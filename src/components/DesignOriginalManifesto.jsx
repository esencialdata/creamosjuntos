import React from 'react';

const prose = {
    fontFamily: "'Lora', Georgia, serif",
    fontSize: '1rem',
    lineHeight: 1.65,
    letterSpacing: '-0.03em',
    fontWeight: 400,
    color: 'var(--color-text-secondary)',
    marginBottom: '1.25rem',
};

const prosePrimary = {
    ...prose,
    color: 'var(--color-text)',
    fontSize: '1.05rem',
};

const DesignOriginalManifesto = () => {
    return (
        <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            padding: '2rem',
            marginBottom: '2rem',
        }}>
            {/* Eyebrow */}
            <p style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                fontWeight: 400,
                color: 'var(--color-text-secondary)',
                margin: '0 0 1.25rem 0',
            }}>
                Diseño Original
            </p>

            {/* Divider */}
            <div style={{
                width: '2.5rem',
                height: '1px',
                background: 'var(--color-primary)',
                marginBottom: '1.75rem',
            }} />

            <p style={prosePrimary}>
                Fuiste construido con una precisión que todavía no terminas de entender.
            </p>

            <p style={prose}>
                No como metáfora. Como hecho.
            </p>

            <p style={prose}>
                Tienes un cuerpo con sistemas de autorregulación más sofisticados que cualquier tecnología existente. Tienes una mente capaz de reescribirse a sí misma. Tienes una dimensión interior que ninguna resonancia magnética ha podido mapear del todo.
            </p>

            <p style={prosePrimary}>
                Tres capas. Un solo ser. Un diseño con propósito.
            </p>

            <p style={prose}>
                El problema no es que estés roto. El problema es que nadie te entregó el manual.
            </p>

            <p style={prose}>
                DISEÑO ORIGINAL es eso: el manual. Una colección de audio construida desde la sabiduría más antigua del mundo, validada por la ciencia más reciente, traducida al lenguaje de tu vida cotidiana.
            </p>

            <p style={{ ...prose, marginBottom: '1.75rem' }}>
                No importa desde dónde llegues. Importa hacia dónde puedes ir.
            </p>

            {/* Divider */}
            <div style={{
                width: '2.5rem',
                height: '1px',
                background: 'var(--color-primary)',
                margin: '0 auto 1.75rem auto',
            }} />

            {/* Ejes */}
            <p style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                fontWeight: 400,
                color: 'var(--color-text-secondary)',
                textAlign: 'center',
                margin: '0 0 1.5rem 0',
            }}>
                Cuerpo · Alma · Espíritu
            </p>

            <p style={{ ...prose, marginBottom: 0, textAlign: 'center' }}>
                Cada serie trabaja una dimensión específica de lo que eres. Puedes empezar por donde más lo necesites.
            </p>
        </div>
    );
};

export default DesignOriginalManifesto;
