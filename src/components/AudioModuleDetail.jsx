import React from 'react';
import AudioCapsuleCard from './AudioCapsuleCard';

const AudioModuleDetail = ({ module, onBack }) => {
    const accent = module.accentColor || '#2563EB';

    return (
        <div>
            {/* Back button */}
            <button
                onClick={onBack}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.9rem',
                    padding: '0 0 1rem 0',
                    fontWeight: 500,
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                </svg>
                Todos los programas
            </button>

            {/* Module header */}
            <div style={{
                background: `linear-gradient(135deg, ${accent}15 0%, ${accent}30 100%)`,
                borderRadius: '16px',
                padding: '1.25rem',
                marginBottom: '1.5rem',
                border: `1px solid ${accent}30`,
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '0.5rem',
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                        fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18V5l12-2v13" />
                        <circle cx="6" cy="18" r="3" />
                        <circle cx="18" cy="16" r="3" />
                    </svg>
                    <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        color: accent,
                    }}>
                        Serie · {module.episodes.length} episodios
                    </span>
                </div>
                <h2 style={{
                    margin: '0 0 0.5rem 0',
                    fontSize: '1.3rem',
                    fontWeight: 800,
                    color: 'var(--color-text)',
                    lineHeight: 1.2,
                }}>
                    {module.title}
                </h2>
                <p style={{
                    margin: 0,
                    fontSize: '0.88rem',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.6,
                }}>
                    {module.description}
                </p>
            </div>

            {/* Episode list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {module.episodes.map((episode) => (
                    <AudioCapsuleCard
                        key={episode.id}
                        capsule={episode}
                    />
                ))}
            </div>
        </div>
    );
};

export default AudioModuleDetail;
