import { useEffect, useState, useCallback } from 'react';
import { getToken, isSupported } from 'firebase/messaging';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, getAppMessaging } from '../firebase';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

/**
 * Hook para manejar notificaciones push con FCM.
 * 
 * Uso:
 *   const { permission, requestPermission, isSupported } = useNotifications();
 * 
 * - permission: 'default' | 'granted' | 'denied'
 * - requestPermission(): solicita permiso y guarda el token en Firestore
 * - isSupported: booleano, false en iOS sin PWA instalada
 */
export function useNotifications() {
    const [permission, setPermission] = useState(() => {
        if (typeof Notification === 'undefined') return 'unsupported';
        return Notification.permission;
    });
    const [fcmSupported, setFcmSupported] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Verificar si FCM está soportado (no lo está en Safari antiguo, iOS sin PWA, etc.)
        isSupported().then(setFcmSupported).catch(() => setFcmSupported(false));
    }, []);

    const saveTokenToFirestore = async (token) => {
        try {
            // Guardamos el token con un ID único basado en el propio token
            // Usamos los últimos 20 chars como ID para evitar duplicados
            const tokenId = token.slice(-20);
            const tokenRef = doc(db, 'fcm_tokens', tokenId);
            await setDoc(tokenRef, {
                token,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                userAgent: navigator.userAgent,
                platform: navigator.platform || 'unknown',
            }, { merge: true });
            console.log('[FCM] Token guardado en Firestore');
        } catch (error) {
            console.error('[FCM] Error guardando token:', error);
        }
    };

    const requestPermission = useCallback(async () => {
        if (!fcmSupported) {
            console.warn('[FCM] No soportado en este navegador');
            return false;
        }

        if (!VAPID_KEY) {
            console.error('[FCM] VITE_FIREBASE_VAPID_KEY no está definido en .env');
            return false;
        }

        setLoading(true);
        try {
            // 1. Pedir permiso al usuario
            const result = await Notification.requestPermission();
            setPermission(result);

            if (result !== 'granted') {
                console.log('[FCM] Permiso denegado:', result);
                return false;
            }

            // 2. Inicializar messaging y obtener token
            const messaging = getAppMessaging();
            const token = await getToken(messaging, {
                vapidKey: VAPID_KEY,
                serviceWorkerRegistration: await navigator.serviceWorker.ready,
            });

            if (token) {
                await saveTokenToFirestore(token);
                return true;
            } else {
                console.warn('[FCM] No se pudo obtener token');
                return false;
            }
        } catch (error) {
            console.error('[FCM] Error al pedir permiso:', error);
            return false;
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
