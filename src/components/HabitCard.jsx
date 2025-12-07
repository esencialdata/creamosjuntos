import React from 'react';

const HabitCard = ({ habit, onToggle, isCompleted }) => {
    return (
        <div style={{
            marginBottom: 'var(--spacing-md)',
            paddingBottom: 'var(--spacing-md)',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <div style={{ flex: 1, paddingRight: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', color: 'var(--color-text-primary)' }}>
                    {habit.name}
                </h3>
                <p style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
                    {habit.action}
                </p>
                {habit.reference && (
                    <span style={{
                        fontSize: '0.85rem',
                        color: 'var(--color-text-secondary)',
                        backgroundColor: '#F0EFEA',
                        padding: '2px 8px',
                        borderRadius: '4px'
                    }}>
                        {habit.reference}
                    </span>
                )}
            </div>

            <button
                onClick={onToggle}
                style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: isCompleted ? '1px solid #4CAF50' : '1px solid var(--color-border)',
                    backgroundColor: isCompleted ? '#4CAF50' : 'transparent',
                    color: isCompleted ? 'white' : 'var(--color-text-secondary)',
                    minWidth: '120px',
                    textAlign: 'center'
                }}
            >
                {isCompleted ? 'Ladrillo puesto' : 'Completar hoy'}
            </button>
        </div>
    );
};

export default HabitCard;
