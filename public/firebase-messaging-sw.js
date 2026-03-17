// Service Worker para Firebase Cloud Messaging
// Este archivo DEBE estar en /public para que sea accesible desde la raíz del dominio

importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

// NOTA: La apiKey de Firebase es pública por diseño (se protege con reglas de Firestore/Storage)
// Los Service Workers no tienen acceso a variables de entorno de Vite
firebase.initializeApp({
    apiKey: 'AIzaSyDP5f7i4UHobWLe6mEPm0rxr7q_Ws7U6sA',
    authDomain: 'campo-david.firebaseapp.com',
    projectId: 'campo-david',
    storageBucket: 'campo-david.firebasestorage.app',
    messagingSenderId: '548361706376',
    appId: '1:548361706376:web:7ea804514d4e07fee6783d'
});

console.log('[FCM SW] Firebase inicializado en Service Worker');

const messaging = firebase.messaging();

// Maneja mensajes en background (cuando la app está cerrada o en segundo plano)
messaging.onBackgroundMessage((payload) => {
    console.log('[SW] Notificación recibida en background:', payload);

    const { title, body, icon, url } = payload.notification || {};

    const notificationOptions = {
        body: body || '',
        icon: icon || '/apple-icon.png',
        badge: '/apple-icon.png',
        data: {
            url: payload.data?.url || url || '/'
        },
        // Vibración y sonido en móviles
        vibrate: [200, 100, 200],
    };

    self.registration.showNotification(title || 'Creamos Juntos', notificationOptions);
});

// Al hacer clic en la notificación, navega a la URL indicada
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const targetUrl = event.notification.data?.url || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // Si ya hay una ventana abierta, enfócala y navega
            for (const client of clientList) {
                if ('focus' in client) {
                    client.focus();
                    client.navigate(targetUrl);
                    return;
                }
            }
            // Si no hay ventana abierta, abre una nueva
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});
