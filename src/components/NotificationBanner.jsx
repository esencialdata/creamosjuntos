import React, { useState, useEffect } from 'react';

/**
 * Banner discreto que pide permiso para notificaciones.
 * Aparece desde abajo (encima del sticky player).
 * Props:
 *   onAccept() — el usuario acepta
 *   onDismiss() — el usuario descarta
 */
export default function NotificationBanner({ onAccept, onDismiss }) {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    useEffect(() => {
        // Pequeño delay para no aparecer al mismo tiempo que el install banner
        const t = setTimeout(() => setVisible(true), 3000);
        return () => clearTimeout(t);
    }, []);

    const handleAccept = async () => {
        setLoading(true);
        const success = await onAccept();
        setLoading(false);
        setDone(true);
        setTimeout(() => setVisible(false), 2000);
    };

    const handleDismiss = () => {
        setVisible(false);
        onDismiss?.();
    };

    return (
        <div
            role="dialog"
            aria-label="Activar notificaciones"
            style={{
                position: 'fixed',
                bottom: visible ? '80px' : '-200px', // 80px = encima del sticky player
                left: '50%',
                transform: 'translateX(-50%)',
                width: 'calc(100% - 2rem)',
                maxWidth: '420px',
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                zIndex: 9000,
                transition: 'bottom 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
        >
            {/* Icono */}
            <div style={{
                fontSize: '2rem',
                flexShrink: 0,
                animation: done ? 'none' : 'bell-ring 2s ease-in-out infinite',
            }}>
                {done ? '✅' : '🔔'}
            </div>

            {/* Texto */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                    margin: 0,
                    color: '#fff',
                    fontWeight: '700',
                    fontSize: '0.9rem',
                    lineHeight: '1.3',
                }}>
                    {done ? '¡Notificaciones activadas!' : 'Mantente al día'}
                </p>
                {!done && (
                    <p style={{
                        margin: '0.15rem 0 0',
                        color: 'rgba(255,255,255,0.6)',
                        fontSize: '0.78rem',
                        lineHeight: '1.3',
                    }}>
                        Recibe avisos de nuevos contenidos
                    </p>
                )}
            </div>

            {/* Acciones */}
            {!done && (
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                    <button
                        onClick={handleDismiss}
                        title="Ahora no"
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.15)',
                            color: 'rgba(255,255,255,0.7)',
                            borderRadius: '8px',
                            padding: '0.4rem 0.75rem',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                        }}
                    >
                        Ahora no
                    </button>
                    <button
                        onClick={handleAccept}
                        disabled={loading}
                        style={{
                            background: 'linear-gradient(135deg, #6c63ff, #4facfe)',
                            border: 'none',
                            color: '#fff',
                            borderRadius: '8px',
                            padding: '0.4rem 0.9rem',
                            fontSize: '0.8rem',
                            fontWeight: '700',
                            cursor: loading ? 'wait' : 'pointer',
                            opacity: loading ? 0.7 : 1,
                            transition: 'opacity 0.2s',
                        }}
                    >
                        {loading ? '...' : 'Activar'}
                    </button>
                </div>
            )}

            <style>{`
                @keyframes bell-ring {
                    0%, 100% { transform: rotate(0deg); }
                    10% { transform: rotate(15deg); }
                    20% { transform: rotate(-12deg); }
                    30% { transform: rotate(8deg); }
                    40% { transform: rotate(-5deg); }
                    50% { transform: rotate(0deg); }
                }
            `}</style>
        </div>
    );
}
