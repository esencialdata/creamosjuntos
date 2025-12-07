import React from 'react';
import { shareContent } from '../utils/share';

const DailyVerse = ({ verse }) => {
    const handleShare = async () => {
        const textToShare = `"${verse.text}" — ${verse.reference}. Creamos Juntos`;
        await shareContent('Cita del día - Creamos Juntos', textToShare, window.location.href);
    };

    return (
        <section style={{ marginBottom: 'var(--spacing-lg)', textAlign: 'center', position: 'relative' }}>
            <h2 style={{
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                color: 'var(--color-accent)',
                marginBottom: 'var(--spacing-sm)'
            }}>
                Cita del día
            </h2>
            <div style={{ maxWidth: '80%', margin: '0 auto', position: 'relative' }}>
                <p style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.5rem',
                    lineHeight: '1.5',
                    color: 'var(--color-text-primary)'
                }}>
                    "{verse.text}"
                </p>
                <div style={{
                    marginTop: 'var(--spacing-sm)',
                    fontStyle: 'italic',
                    color: 'var(--color-text-secondary)',
                    marginBottom: 'var(--spacing-md)'
                }}>
                    — {verse.reference}
                </div>
                <p style={{
                    fontSize: '1rem',
                    color: 'var(--color-text-secondary)',
                    maxWidth: '500px',
                    margin: '0 auto',
                    borderLeft: '2px solid var(--color-border)',
                    paddingLeft: 'var(--spacing-sm)',
                    textAlign: 'left'
                }}>
                    {verse.comment}
                </p>

                <button
                    onClick={handleShare}
                    title="Compartir"
                    style={{
                        position: 'absolute',
                        right: '-2rem',
                        bottom: '0',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--color-text-secondary)',
                        padding: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="18" cy="5" r="3"></circle>
                        <circle cx="6" cy="12" r="3"></circle>
                        <circle cx="18" cy="19" r="3"></circle>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                    </svg>
                </button>
            </div>
        </section>
    );
};

export default DailyVerse;
