import React from 'react';

const TempleGrowth = ({ habitCount, currentWeek, streak, brickCount }) => {

    const getStatusMessage = (count) => {
        if (count < 5) return "Estamos levantando los cimientos.";
        if (count < 9) return "Estamos levantando los muros.";
        return "Estamos fortaleciendo el interior del templo.";
    };

    return (
        <section className="card" style={{ backgroundColor: '#F9F8F6', border: '1px dashed var(--color-border)' }}>
            <h2 style={{
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                marginBottom: 'var(--spacing-sm)',
                color: 'var(--color-text-secondary)'
            }}>
                Cómo va creciendo el templo
            </h2>

            <p style={{ marginBottom: '1rem', fontStyle: 'italic', color: 'var(--color-text-secondary)' }}>
                "Cada hábito que adoptamos es como un nuevo ladrillo en el templo que Dios está construyendo en nosotros y en la comunidad."
            </p>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '0.5rem',
                marginBottom: '1rem',
                borderTop: '1px solid var(--color-border)',
                borderBottom: '1px solid var(--color-border)',
                padding: '1rem 0'
            }}>
                <div className="text-center">
                    <span style={{ display: 'block', fontSize: '1.25rem', fontWeight: 'bold' }}>{habitCount}</span>
                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)' }}>Hábitos</span>
                </div>
                <div className="text-center">
                    <span style={{ display: 'block', fontSize: '1.25rem', fontWeight: 'bold' }}>{brickCount || 0}</span>
                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-accent)' }}>Tus Ladrillos</span>
                </div>
                <div className="text-center">
                    <span style={{ display: 'block', fontSize: '1.25rem', fontWeight: 'bold' }}>{streak ? streak.count : 0}</span>
                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)' }}>Días Racha</span>
                </div>
            </div>

            <p style={{ textAlign: 'center', fontWeight: '500', marginBottom: '0.5rem' }}>
                Creer, Crear, Crecer
            </p>
        </section>
    );
};

export default TempleGrowth;
