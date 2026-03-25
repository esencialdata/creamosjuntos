import React from 'react';

const AudioModuleCard = ({ module, onClick }) => {
    const available = module.episodes.filter(ep => {
        if (!ep.releaseDate) return true;
        return new Date(ep.releaseDate + 'T00:00:00') <= new Date();
    }).length;

    const total = module.episodes.length;
    const progress = total > 0 ? (available / total) * 100 : 0;
    const accent = module.accentColor || '#2563EB';

    return (
        <div
            onClick={onClick}
            style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '16px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
            }}
        >
            {/* Cover / Header */}
            {module.coverImageUrl ? (
                <img
                    src={module.coverImageUrl}
                    alt={module.title}
                    style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }}
                />
            ) : (
                <div style={{
                    width: '100%',
                    height: '120px',
                    background: `linear-gradient(135deg, ${accent}22 0%, ${accent}55 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"
                        fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18V5l12-2v13" />
                        <circle cx="6" cy="18" r="3" />
                        <circle cx="18" cy="16" r="3" />
                    </svg>
                </div>
            )}

            {/* Body */}
            <div style={{ padding: '1rem' }}>
                <h3 style={{
                    margin: '0 0 0.4rem 0',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: 'var(--color-text)',
                }}>
                    {module.title}
                </h3>

                <p style={{
                    margin: '0 0 1rem 0',
                    fontSize: '0.85rem',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                }}>
                    {module.description}
                </p>

                {/* Progress bar */}
                <div style={{ marginBottom: '0.75rem' }}>
                    <div style={{
                        height: '4px',
                        background: 'var(--color-border)',
                        borderRadius: '2px',
                        overflow: 'hidden',
                    }}>
                        <div style={{
                            height: '100%',
                            width: `${progress}%`,
                            background: accent,
                            borderRadius: '2px',
                            transition: 'width 0.4s ease',
                        }} />
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <span style={{
                        fontSize: '0.78rem',
                        color: 'var(--color-text-secondary)',
                    }}>
                        {available} de {total} disponibles
                    </span>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: accent,
                        fontSize: '0.85rem',
                        fontWeight: 600,
                    }}>
                        Ver serie
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AudioModuleCard;
