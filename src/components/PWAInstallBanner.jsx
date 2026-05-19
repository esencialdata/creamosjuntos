import React, { useState, useEffect } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import './PWAInstallBanner.css';

/**
 * PWAInstallBanner
 *
 * Solo se muestra en entorno web (navegador).
 * En Capacitor (app nativa) no tiene sentido porque la app ya está instalada,
 * así que el componente devuelve null automáticamente.
 */

const isCapacitor = () =>
    typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.();

const PWAInstallBanner = () => {
    // En app nativa no renderizamos nada
    if (isCapacitor()) return null;

    return <PWAInstallBannerWeb />;
};

function PWAInstallBannerWeb() {
    const { isInstallable, isIOS, isInstalled, install } = usePWAInstall();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isInstalled) return;

        if (isInstallable || isIOS) {
            const dismissedAt = localStorage.getItem('pwa_banner_dismissed');
            if (dismissedAt) {
                const diffHours = Math.abs(Date.now() - parseInt(dismissedAt)) / 36e5;
                if (diffHours < 24) return;
            }

            const timer = setTimeout(() => setIsVisible(true), 3000);
            return () => clearTimeout(timer);
        }
    }, [isInstallable, isIOS, isInstalled]);

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem('pwa_banner_dismissed', Date.now().toString());
    };

    if (!isVisible) return null;

    return (
        <div className="pwa-install-banner">
            <div className="pwa-banner-content">
                <div className="pwa-icon">📱</div>
                <div className="pwa-text">
                    <h3>Instala la App</h3>
                    <p>Mejor experiencia, sin conexión y acceso rápido.</p>
                </div>
            </div>

            {isIOS ? (
                <div className="ios-instructions">
                    <p>Para instalar en iOS:</p>
                    <div className="ios-step">1. Pulsa el botón Compartir <span className="share-icon">⎋</span></div>
                    <div className="ios-step">2. Selecciona "Agregar a Inicio" ⊞</div>
                </div>
            ) : null}

            <div className="pwa-actions">
                <button className="pwa-close-btn" onClick={handleDismiss}>Ahora no</button>
                {!isIOS && (
                    <button className="pwa-install-btn" onClick={install}>Instalar</button>
                )}
            </div>
        </div>
    );
}

export default PWAInstallBanner;
