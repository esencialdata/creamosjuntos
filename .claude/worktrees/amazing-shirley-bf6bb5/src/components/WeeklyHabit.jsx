import React from 'react';
import { Link } from 'react-router-dom';

const WeeklyHabit = ({ habit, toggleHabit, isCompleted }) => {
    const handleShare = async () => {
        const shareData = {
            title: `Hábito: ${habit.name}`,
            text: `Esta semana estamos practicando: ${habit.name}.\n"${habit.action}"\n\nÚnete a nosotros:`,
            url: window.location.origin
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
                alert("Texto copiado al portapapeles");
            }
        } catch (err) {
            console.error("Error al compartir:", err);
        }
    };

    return (
        <section className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <p style={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    fontWeight: 400,
                    color: 'var(--color-accent)',
                    marginBottom: 'var(--spacing-sm)',
                    margin: '0 0 var(--spacing-sm) 0',
                }}>
                    Hábito de la semana
                </p>
                <button
                    onClick={handleShare}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        color: 'var(--color-text-secondary)',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                    aria-label="Compartir hábito"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                        <polyline points="16 6 12 2 8 6"></polyline>
                        <line x1="12" y1="2" x2="12" y2="15"></line>
                    </svg>
                </button>
            </div>

            <h3 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: '1.3rem', fontWeight: 400, letterSpacing: '-0.03em', marginBottom: '0.25rem' }}>{habit.name}</h3>
            {habit.reference && (
                <small style={{ display: 'block', marginBottom: '1rem', color: 'var(--color-text-secondary)' }}>
                    {habit.reference}
                </small>
            )}
            <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: '1.1rem', fontWeight: 400, lineHeight: 1.65, letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>
                {habit.action}
            </p>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
                <button
                    onClick={() => toggleHabit(habit.id || 1)} // Fallback if id missing in config, mainly for demo
                    style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        border: isCompleted ? '1px solid #4CAF50' : '1px solid var(--color-text-primary)',
                        backgroundColor: isCompleted ? '#4CAF50' : 'transparent',
                        color: isCompleted ? 'white' : 'var(--color-text-primary)',
                        flex: 1
                    }}
                >
                    {isCompleted ? 'Ladrillo colocado' : 'Completar hoy'}
                </button>

                <Link to="/habitos" style={{
                    borderBottom: '1px solid var(--color-text-primary)',
                    paddingBottom: '2px',
                    fontSize: '0.9rem',
                    color: 'var(--color-text-primary)'
                }}>
                    Ver todos
                </Link>
            </div>
        </section>
    );
};

export default WeeklyHabit;
