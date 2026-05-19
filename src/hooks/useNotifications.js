import { useEffect, useState, useCallback } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Hook para manejar notificaciones push con FCM (Web Push / PWA).
 *
 * Uso:
 *   const { permission, requestPermission, isSupported } = useNotifications();
 *
 * - permission: 'default' | 'granted' | 'denied' | 'unsupported'
 * - requestPermission(): solicita permiso y guarda el token en Firestore
 * - isSupported: booleano
 */

const saveTokenToFirestore = async (token) => {
    try {
        const tokenId = token.slice(-20);
        const tokenRef = doc(db, 'fcm_tokens', tokenId);
        await setDoc(tokenRef, {
            token,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            platform: isCapacitor()
                ? (window.Capacitor?.getPlatform?.() || 'native')
                : 'web',
            userAgent: navigator.userAgent,
        }, { merge: true });
        console.log('[FCM] Token guardado en Firestore');
    } catch (error) {
        console.error('[FCM] Error guardando token:', error);
    }
};

// ─── Implementación WEB (PWA) ────────────────────────────────────────────────

// VAPID key pública (hardcodeada porque Vercel trunca variables largas en el env)
const VAPID_KEY = (import.meta.env.VITE_FIREBASE_VAPID_KEY || 'BCofhAK2IA6yGwynWyj6-o2Y-7ApN7CqXy2CFQ6hVwXmmgMy6OM32jY9rXopq-xJXhAQiTt7KETt0q7mDkk5vPs')
    .replace(/[^a-zA-Z0-9\-_=]/g, '');
const FIREBASE_API_KEY = import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyByUNZrR7s8pRsDwlezVcgwGBWFrQtL7bY';

async function checkWebFCMSupport() {
    try {
        const { isSupported } = await import('firebase/messaging');
        return await isSupported();
    } catch {
        return false;
    }
}

async function requestWebPermission() {
    try {
        const { getToken } = await import('firebase/messaging');
        const { getAppMessaging } = await import('../firebase');

        const result = await Notification.requestPermission();
        if (result !== 'granted') return false;

        let swReg;
        try {
            swReg = await navigator.serviceWorker.register(
                `/firebase-messaging-sw.js?apiKey=${FIREBASE_API_KEY}`,
                { scope: '/' }
            );
        } catch {
            swReg = await navigator.serviceWorker.ready;
        }

        const messaging = getAppMessaging();
        const token = await getToken(messaging, {
            vapidKey: VAPID_KEY,
            serviceWorkerRegistration: swReg,
        });

        if (token) await saveTokenToFirestore(token);
        return !!token;
    } catch (err) {
        console.error('[FCM Web] Error al pedir permiso:', err);
        return false;
    }
}

async function autoRegisterWebToken() {
    try {
        const { getToken } = await import('firebase/messaging');
        const { getAppMessaging } = await import('../firebase');

        let swReg;
        try {
            swReg = await navigator.serviceWorker.register(
                `/firebase-messaging-sw.js?apiKey=${FIREBASE_API_KEY}`,
                { scope: '/' }
            );
        } catch {
            swReg = await navigator.serviceWorker.ready;
        }

        const messaging = getAppMessaging();
        const token = await getToken(messaging, {
            vapidKey: VAPID_KEY,
            serviceWorkerRegistration: swReg,
        });

        if (token) await saveTokenToFirestore(token);
    } catch (err) {
        console.error('[FCM Web] Auto-registro falló:', err);
    }
}

// ─── Hook principal ───────────────────────────────────────────────────────────

export function useNotifications() {
    const [permission, setPermission] = useState(() => {
        if (typeof Notification === 'undefined') return 'unsupported';
        return Notification.permission;
    });
    const [fcmSupported, setFcmSupported] = useState(false);
    const [loading, setLoading] = useState(false);

    // Inicialización: detectar soporte FCM
    useEffect(() => {
        checkWebFCMSupport().then(setFcmSupported);
    }, []);

    // Auto re-registro silencioso si el permiso ya estaba concedido
    useEffect(() => {
        if (!fcmSupported || !VAPID_KEY) return;
        if (typeof Notification === 'undefined') return;
        if (Notification.permission !== 'granted') return;
        autoRegisterWebToken();
    }, [fcmSupported]);

    const requestPermission = useCallback(async () => {
        if (!fcmSupported) {
            console.warn('[FCM] No soportado en este entorno');
            return false;
        }
        setLoading(true);
        try {
            const granted = await requestWebPermission();
            if (granted) setPermission('granted');
            else setPermission('denied');
            return granted;
        } finally {
            setLoading(false);
        }
    }, [fcmSupported]);

    return {
        permission,
        requestPermission,
        isSupported: fcmSupported,
        loading,
    };
}
