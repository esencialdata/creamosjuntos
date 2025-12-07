import React from 'react';
import { shareContent } from '../utils/share';

const WeeklyTheme = ({ theme }) => {
    const handleShare = async () => {
        const textToShare = `Esta semana en Creamos Juntos estamos trabajando: "${theme.name || 'Identidad'}" - ${theme.description}. Únete aquí:`;
        await shareContent('Tema de la semana - Creamos Juntos', textToShare, window.location.href);
    };

    return (
        <section className="card text-center" style={{ backgroundColor: '#F4F2EE', border: 'none', position: 'relative' }}>
            <h2 style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                marginBottom: '0.5rem',
                color: 'var(--color-text-secondary)'
            }}>
                Tema de la semana
            </h2>
            <p style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.25rem',
                color: 'var(--color-text-primary)',
                marginBottom: '1rem'
            }}>
                {theme.description}
            </p>

            <button
                onClick={handleShare}
                title="Compartir tema"
                style={{
                    position: 'absolute',
                    right: '10px',
                    bottom: '10px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-text-secondary)',
                    opacity: 0.6,
                    padding: '0.25rem',
                    transition: 'opacity 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
            </button>
        </section>
    );
};

export default WeeklyTheme;
