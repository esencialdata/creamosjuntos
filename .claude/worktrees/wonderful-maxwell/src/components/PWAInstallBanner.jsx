import React, { useState, useEffect } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import './PWAInstallBanner.css';

const PWAInstallBanner = () => {
    const { isInstallable, isIOS, isInstalled, install } = usePWAInstall();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Don't show if already installed
        if (isInstalled) return;

        // Show banner if installable (Android/Desktop) or iOS
        if (isInstallable || isIOS) {
            // Check if user dismissed it recently (e.g., 24h)
            const dismissedAt = localStorage.getItem('pwa_banner_dismissed');
            if (dismissedAt) {
                const dismissedTime = new Date(parseInt(dismissedAt));
                const now = new Date();
                const diffHours = Math.abs(now - dismissedTime) / 36e5;
                if (diffHours < 24) return;
            }

            // Small delay for better UX
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
                <div className="pwa-icon">
                    📱
                </div>
                <div className="pwa-text">
                    <h3>Instala la App</h3>
                    <p>Mejor experiencia, sin conexión y acceso rápido.</p>
                </div>
            </div>

            {isIOS ? (
                <div className="ios-instructions">
                    <p>Para instalar en iOS:</p>
                    <div className="ios-step">
                        1. Pulsa el botón Compartir <span className="share-icon">⎋</span>
                    </div>
                    <div className="ios-step">
                        2. Selecciona "Agregar a Inicio" ⊞
                    </div>
                </div>
            ) : null}

            <div className="pwa-actions">
                <button className="pwa-close-btn" onClick={handleDismiss}>
                    Ahora no
                </button>
                {!isIOS && (
                    <button className="pwa-install-btn" onClick={install}>
                        Instalar
                    </button>
                )}
            </div>
        </div>
    );
};

export default PWAInstallBanner;
