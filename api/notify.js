/**
 * Vercel Serverless Function: POST /api/notify
 * 
 * Envía una notificación push a todos los tokens FCM registrados en Firestore.
 * 
 * Body (JSON):
 *   { title, body, url, secret }
 * 
 * Variables de entorno requeridas en Vercel:
 *   FIREBASE_SERVICE_ACCOUNT  — JSON del Service Account de Firebase (como string)
 *   NOTIFY_SECRET             — Clave secreta para proteger el endpoint
 */

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import https from 'https';

// Inicializar Firebase Admin una sola vez (Vercel reutiliza instancias)
function getAdminApp() {
    if (getApps().length > 0) return getApps()[0];

    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
    return initializeApp({
        credential: cert(serviceAccount),
        projectId: 'campo-david',
    });
}

// Obtener un Access Token de Google usando el Service Account
async function getAccessToken(serviceAccount) {
    const { google } = await import('googleapis');
    const auth = new google.auth.GoogleAuth({
        credentials: serviceAccount,
        scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
    });
    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    return tokenResponse.token;
}

// Enviar notificación a un token específico via FCM HTTP v1
async function sendFcmNotification(token, title, body, url, accessToken, projectId) {
    return new Promise((resolve, reject) => {
        const message = JSON.stringify({
            message: {
                token,
                notification: { title, body },
                webpush: {
                    notification: {
                        title,
                        body,
                        icon: '/apple-icon.png',
                        badge: '/apple-icon.png',
                        click_action: url || '/',
                    },
                    fcm_options: {
                        link: url || '/',
                    },
                },
            },
        });

        const options = {
            hostname: 'fcm.googleapis.com',
            path: `/v1/projects/${projectId}/messages:send`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'Content-Length': Buffer.byteLength(message),
            },
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve({ success: true });
                } else {
                    resolve({ success: false, error: data, statusCode: res.statusCode });
                }
            });
        });

        req.on('error', reject);
        req.write(message);
        req.end();
    });
}

export default async function handler(req, res) {
    // Solo POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    // Parsear body
    let body;
    try {
        body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch {
        return res.status(400).json({ error: 'Body inválido' });
    }

    const { title, body: msgBody, url, secret } = body || {};

    // Validar secret
    const expectedSecret = process.env.NOTIFY_SECRET;
    if (!expectedSecret || secret !== expectedSecret) {
        return res.status(401).json({ error: 'No autorizado' });
    }

    // Validar campos requeridos
    if (!title || !msgBody) {
        return res.status(400).json({ error: 'title y body son requeridos' });
    }

    try {
        // Inicializar Firebase Admin
        const app = getAdminApp();
        const db = getFirestore(app);

        // Obtener todos los tokens FCM de Firestore
        const tokensSnap = await db.collection('fcm_tokens').get();
        if (tokensSnap.empty) {
            return res.status(200).json({ sent: 0, message: 'No hay tokens registrados' });
        }

        const tokens = tokensSnap.docs.map(doc => ({
            docId: doc.id,
            token: doc.data().token,
        }));

        // Obtener Google Access Token para FCM v1
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
        const { google } = await import('googleapis');
        const auth = new google.auth.GoogleAuth({
            credentials: serviceAccount,
            scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
        });
        const authClient = await auth.getClient();
        const tokenResponse = await authClient.getAccessToken();
        const accessToken = tokenResponse.token;

        // Enviar a todos los tokens en paralelo
        const results = await Promise.allSettled(
            tokens.map(({ token, docId }) =>
                sendFcmNotification(token, title, msgBody, url, accessToken, 'campo-david')
                    .then(result => ({ ...result, token, docId }))
            )
        );

        // Limpiar tokens inválidos (registro unregistered)
        const tokensToDelete = [];
        for (const result of results) {
            if (result.status === 'fulfilled' && !result.value.success) {
                const errorBody = result.value.error || '';
                if (errorBody.includes('UNREGISTERED') || errorBody.includes('INVALID_ARGUMENT')) {
                    tokensToDelete.push(result.value.docId);
                }
            }
        }

        // Eliminar tokens inválidos en batch
        if (tokensToDelete.length > 0) {
            const batch = db.batch();
            tokensToDelete.forEach(docId => {
                batch.delete(db.collection('fcm_tokens').doc(docId));
            });
            await batch.commit();
            console.log(`[FCM] Tokens inválidos eliminados: ${tokensToDelete.length}`);
        }

        const successCount = results.filter(r => r.status === 'fulfilled' && r.value.success).length;

        return res.status(200).json({
            sent: successCount,
            total: tokens.length,
            removed: tokensToDelete.length,
        });

    } catch (error) {
        console.error('[FCM] Error en /api/notify:', error);
        return res.status(500).json({ error: 'Error interno', detail: error.message });
    }
}
