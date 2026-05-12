import React from 'react';

const DesignOriginalCard = ({ coverImageUrl, availableCount, onClick }) => {
    const label = availableCount === 1 ? '1 serie disponible' : `${availableCount} series disponibles`;

    return (
        <div
            onClick={onClick}
            style={{
                background: '#F9F6F1',
                border: '1px solid #E8E0D4',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: 'rgba(44, 34, 24, 0.1) 0px 8px 32px -4px',
                cursor: 'pointer',
                transition: 'background 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.background = '#F0EDE6';
                e.currentTarget.style.boxShadow = 'rgba(44, 34, 24, 0.18) 0px 12px 40px -4px';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.background = '#F9F6F1';
                e.currentTarget.style.boxShadow = 'rgba(44, 34, 24, 0.1) 0px 8px 32px -4px';
            }}
        >
            {/* Header */}
            {coverImageUrl ? (
                <img
                    src={coverImageUrl}
                    alt="Diseño Original"
                    style={{ width: '100%', height: '110px', objectFit: 'cover', display: 'block' }}
                />
            ) : (
                <div style={{
                    width: '100%',
                    height: '110px',
                    background: '#F9F6F1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg"
                        stroke="#8B6914" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <ellipse cx="25" cy="20" rx="10" ry="14" />
                        <path d="M15 20 Q10 28 15 36 Q20 44 25 44 Q30 44 35 36 Q40 28 35 20" />
                        <line x1="25" y1="6" x2="25" y2="44" strokeOpacity="0.3" />
                        <line x1="16" y1="14" x2="34" y2="26" strokeOpacity="0.3" />
                        <line x1="16" y1="26" x2="34" y2="14" strokeOpacity="0.3" />
                    </svg>
                </div>
            )}

            {/* Body */}
            <div style={{ padding: '16px' }}>
                {/* Eyebrow */}
                <p style={{
                    fontFamily: "'Inter', system-ui, sans-serif",
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    fontWeight: 400,
                    color: '#8B6914',
                    margin: '0 0 10px 0',
                }}>
                    Diseño Original
                </p>

                {/* Divisor */}
                <div style={{
                    width: '2rem',
                    height: '1px',
                    background: '#8B6914',
                    marginBottom: '12px',
                }} />

                {/* Título */}
                <p style={{
                    fontFamily: "'Lora', Georgia, serif",
                    fontSize: '22px',
                    fontWeight: 400,
                    color: '#2C2218',
                    lineHeight: 1.4,
                    letterSpacing: '-0.03em',
                    margin: '0 0 6px 0',
                }}>
                    Fuiste construido con propósito
                </p>

                {/* Tagline */}
                <p style={{
                    fontFamily: "'Lora', Georgia, serif",
                    fontSize: '16px',
                    fontWeight: 400,
                    color: '#7A6E62',
                    lineHeight: 1.65,
                    letterSpacing: '-0.03em',
                    margin: '0 0 14px 0',
                }}>
                    Tres dimensiones. Un manual. Tu vida como fue diseñada.
                </p>

                {/* Pills de ejes */}
                <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
                    {[
                        { label: 'Cuerpo',   bg: '#FAECE7', color: '#712B13' },
                        { label: 'Alma',     bg: '#EEEDFE', color: '#3C3489' },
                        { label: 'Espíritu', bg: '#E1F5EE', color: '#085041' },
                    ].map(({ label: pillLabel, bg, color }) => (
                        <span key={pillLabel} style={{
                            fontFamily: "'Inter', system-ui, sans-serif",
                            fontSize: '11px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            fontWeight: 400,
                            color,
                            background: bg,
                            padding: '3px 10px',
                            borderRadius: '20px',
                        }}>
                            {pillLabel}
                        </span>
                    ))}
                </div>

                {/* Footer */}
                <div style={{
                    borderTop: '1px solid #E8E0D4',
                    paddingTop: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <span style={{
                        fontFamily: "'Inter', system-ui, sans-serif",
                        fontSize: '11px',
                        fontWeight: 400,
                        color: '#7A6E62',
                    }}>
                        {label}
                    </span>
                    <span style={{
                        fontFamily: "'Inter', system-ui, sans-serif",
                        fontSize: '13px',
                        fontWeight: 400,
                        color: '#2563EB',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                    }}>
                        Explorar
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                            fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default DesignOriginalCard;
