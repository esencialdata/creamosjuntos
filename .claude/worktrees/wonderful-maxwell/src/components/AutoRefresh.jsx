import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

/**
 * AutoRefresh Component
 * 
 * This component automatically checks for Service Worker updates periodically.
 * If an update is found, it will automatically update the application
 * (because registerType: 'autoUpdate' is set in vite.config.js).
 * 
 * It runs invisible to the user.
 */
function AutoRefresh() {
    const {
        updateServiceWorker,
        needRefresh,
    } = useRegisterSW({
        onRegisteredSW(swUrl, r) {
            if (r) {
                // Check for updates every 15 seconds
                // This is aggressive but ensures users see changes almost immediately
                // as requested ("constantly refreshing").
                setInterval(async () => {
                    // console.log('Checking for SW update...');
                    try {
                        if (!(!r.installing && !r.waiting)) return; // Skip if already updating

                        if ('connection' in navigator && !navigator.onLine) return; // Skip if offline

                        const resp = await r.update();

                        if (resp) {
                            // console.log('SW update found!');
                        }
                    } catch {
                        // Silently fail if update check fails (e.g. network error)
                        // console.error('SW update check failed', e);
                    }
                }, 15 * 1000 /* 15 seconds */);
            }
        },
    });

    // Automatically reload when a new SW is waiting
    useEffect(() => {
        if (needRefresh) {
            updateServiceWorker(true);
        }
    }, [needRefresh, updateServiceWorker]);

    return null; // This component renders nothing
}

export default AutoRefresh;
