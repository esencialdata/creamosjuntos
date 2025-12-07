import React from 'react';
import { Link } from 'react-router-dom';

const WeeklyHabit = ({ habit, toggleHabit, isCompleted }) => {
    return (
        <section className="card">
            <h2 style={{
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                marginBottom: 'var(--spacing-sm)',
                color: 'var(--color-accent)'
            }}>
                Hábito de la semana
            </h2>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{habit.name}</h3>
            {habit.reference && (
                <small style={{ display: 'block', marginBottom: '1rem', color: 'var(--color-text-secondary)' }}>
                    {habit.reference}
                </small>
            )}
            <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>
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
