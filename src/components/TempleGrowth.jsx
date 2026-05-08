import React from 'react';

const TempleGrowth = ({ habitCount, currentWeek, streak, brickCount }) => {

    const getStatusMessage = (count) => {
        if (count < 5) return "Estamos levantando los cimientos.";
        if (count < 9) return "Estamos levantando los muros.";
        return "Estamos fortaleciendo el interior del templo.";
    };

    return (
        <section className="card" style={{ backgroundColor: '#F9F8F6', border: '1px dashed var(--color-border)' }}>
            <p style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                fontWeight: 400,
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--spacing-sm)',
            }}>
                Cómo va creciendo el templo
            </p>

            <p style={{ fontFamily: "'Lora', Georgia, serif", fontWeight: 400, fontSize: '1rem', lineHeight: 1.65, letterSpacing: '-0.03em', marginBottom: '1rem', fontStyle: 'italic', color: 'var(--color-text-secondary)' }}>
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
                    <span style={{ display: 'block', fontFamily: "'Lora', Georgia, serif", fontSize: '1.25rem', fontWeight: 400, letterSpacing: '-0.03em' }}>{habitCount}</span>
                    <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 400, color: 'var(--color-text-secondary)' }}>Hábitos</span>
                </div>
                <div className="text-center">
                    <span style={{ display: 'block', fontFamily: "'Lora', Georgia, serif", fontSize: '1.25rem', fontWeight: 400, letterSpacing: '-0.03em' }}>{brickCount || 0}</span>
                    <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 400, color: 'var(--color-accent)' }}>Tus Ladrillos</span>
                </div>
                <div className="text-center">
                    <span style={{ display: 'block', fontFamily: "'Lora', Georgia, serif", fontSize: '1.25rem', fontWeight: 400, letterSpacing: '-0.03em' }}>{streak ? streak.count : 0}</span>
                    <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 400, color: 'var(--color-text-secondary)' }}>Días Racha</span>
                </div>
            </div>

            <p style={{ fontFamily: "'Lora', Georgia, serif", textAlign: 'center', fontWeight: 400, fontSize: '1rem', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
                Creer, Crear, Crecer
            </p>
        </section>
    );
};

export default TempleGrowth;
