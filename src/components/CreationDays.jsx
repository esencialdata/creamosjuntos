import React, { useRef, useState, useEffect } from 'react';

const DAYS = [
  {
    ordinal: 'Primer Día',
    eyebrow: 'GÉNESIS 1 · DÍA PRIMERO',
    gradient: 'linear-gradient(160deg, #1a0e06 0%, #7a3c14 25%, #d4964a 55%, #f5e0b0 80%, #fffdf8 100%)',
    accent: '#A0621A', // ámbar dorado
    numeral: '1',
  },
  {
    ordinal: 'Segundo Día',
    eyebrow: 'GÉNESIS 1 · DÍA SEGUNDO',
    gradient: 'linear-gradient(160deg, #0a1628 0%, #1a3a5c 30%, #2e6a8c 55%, #8ab4c8 80%, #e8f4f8 100%)',
    accent: '#2A6A8C', // azul cielo
    numeral: '2',
  },
  {
    ordinal: 'Tercer Día',
    eyebrow: 'GÉNESIS 1 · DÍA TERCERO',
    gradient: 'linear-gradient(160deg, #1c1208 0%, #4a2e10 30%, #8a5c28 55%, #c4904a 80%, #e8d0a0 100%)',
    accent: '#4E8B2A', // verde planta/árbol
    numeral: '3',
  },
  {
    ordinal: 'Cuarto Día',
    eyebrow: 'GÉNESIS 1 · DÍA CUARTO',
    gradient: 'linear-gradient(160deg, #0c0c1a 0%, #1e1e3c 30%, #3c3860 55%, #7a6fa0 80%, #c8c0e0 100%)',
    accent: '#5A4890', // índigo noche
    numeral: '4',
  },
  {
    ordinal: 'Quinto Día',
    eyebrow: 'GÉNESIS 1 · DÍA QUINTO',
    gradient: 'linear-gradient(160deg, #061218 0%, #0e3040 30%, #1a6070 55%, #4aa0b0 80%, #b0e0ec 100%)',
    accent: '#1A6878', // teal mar
    numeral: '5',
  },
  {
    ordinal: 'Sexto Día',
    eyebrow: 'GÉNESIS 1 · DÍA SEXTO',
    gradient: 'linear-gradient(160deg, #0e1008 0%, #283010 30%, #506a20 55%, #90a850 80%, #d8e8a0 100%)',
    accent: '#2E5010', // verde bosque profundo
    numeral: '6',
  },
  {
    ordinal: 'Séptimo Día',
    eyebrow: 'GÉNESIS 2 · DÍA SÉPTIMO',
    gradient: 'linear-gradient(160deg, #0a0810 0%, #1c1628 40%, #2c2040 70%, #3c3050 100%)',
    accent: '#6A4A80', // malva descanso
    numeral: '7',
  },
];

const CreationDays = () => {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const day = DAYS[new Date().getDay()];

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @keyframes dawnBrighten {
          0%   { filter: brightness(0.05) saturate(0.2); }
          70%  { filter: brightness(1.15) saturate(1.1); }
          100% { filter: brightness(1) saturate(1); }
        }
        @keyframes dawnBreath {
          0%, 100% { filter: brightness(0.88) saturate(0.95); }
          50%       { filter: brightness(1.1) saturate(1.05); }
        }
      `}</style>

      <section
        ref={sectionRef}
        style={{
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundColor: '#ecebe5',
          marginBottom: 'var(--spacing-md)',
          boxShadow: 'rgba(44, 34, 24, 0.1) 0px 8px 32px -4px',
        }}
      >
        <div style={{
          position: 'relative',
          height: '200px',
          background: day.gradient,
          overflow: 'hidden',
          filter: visible ? undefined : 'brightness(0.05) saturate(0.2)',
          animation: visible
            ? 'dawnBrighten 2.8s ease-out forwards, dawnBreath 7s ease-in-out 2.8s infinite'
            : 'none',
        }}>
          <span aria-hidden="true" style={{
            position: 'absolute',
            top: '0.75rem',
            right: '1.25rem',
            fontSize: '130px',
            lineHeight: 1,
            fontWeight: 400,
            color: 'rgba(255, 255, 255, 0.08)',
            letterSpacing: '-0.06em',
            userSelect: 'none',
            fontFamily: "'Inter', system-ui, sans-serif",
          }}>
            {day.numeral}
          </span>
        </div>

        <div style={{ padding: '1.5rem' }}>
          <p style={{
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: day.accent,
            fontWeight: 400,
            marginBottom: '0.75rem',
            fontFamily: "'Inter', system-ui, sans-serif",
          }}>
            {day.eyebrow}
          </p>

          <h2 style={{
            fontSize: 'clamp(1.5rem, 5vw, 2rem)',
            fontWeight: 400,
            lineHeight: 1.4,
            letterSpacing: '-0.03em',
            color: '#383838',
            marginBottom: '0.875rem',
            fontFamily: "'Lora', Georgia, serif",
          }}>
            {day.ordinal}
          </h2>

          <div style={{
            width: '2.5rem',
            height: '1px',
            backgroundColor: day.accent,
            marginBottom: '1.25rem',
          }} />

          <p style={{
            fontSize: '0.95rem',
            lineHeight: 1.65,
            letterSpacing: '-0.03em',
            color: 'rgba(56, 56, 56, 0.75)',
            fontFamily: "'Lora', Georgia, serif",
            fontWeight: 400,
            fontStyle: 'italic',
            margin: '0 0 0.5rem 0',
            whiteSpace: 'pre-line',
          }}>{`"Enséñanos de tal modo a contar nuestros días,\nQue traigamos al corazón sabiduría."`}</p>
          <p style={{
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: day.accent,
            fontFamily: "'Inter', system-ui, sans-serif",
            fontWeight: 400,
            margin: 0,
            opacity: 0.7,
          }}>— Salmos 90:12</p>
        </div>
      </section>
    </>
  );
};

export default CreationDays;
