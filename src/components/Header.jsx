import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    const [fontSizePercent, setFontSizePercent] = useState(() => {
        return parseInt(localStorage.getItem('appFontSize') || '100');
    });

    useEffect(() => {
        document.documentElement.style.fontSize = `${fontSizePercent}%`;
        localStorage.setItem('appFontSize', fontSizePercent);
    }, [fontSizePercent]);

    const handleFontSizeChange = (delta) => {
        setFontSizePercent(prev => Math.min(Math.max(prev + delta, 70), 150));
    };

    return (
        <header style={{
            borderBottom: '1px solid var(--color-border)',
            padding: 'var(--spacing-sm) 0',
            marginBottom: 'var(--spacing-md)'
        }}>
            <div className="container" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                <Link to="/" style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    color: 'var(--color-text-primary)'
                }}>
                    Creamos juntos
                </Link>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-md)',
                    flexWrap: 'wrap',
                    justifyContent: 'center' // Center content if it wraps on very small screens
                }}>
                    {/* Font Controls */}
                    <div style={{ display: 'flex', border: '1px solid var(--color-border)', borderRadius: '6px', overflow: 'hidden' }}>
                        <button onClick={() => handleFontSizeChange(-10)} style={{ padding: '4px 10px', background: 'var(--color-bg-secondary)', border: 'none', borderRight: '1px solid var(--color-border)', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>A-</button>
                        <button onClick={() => setFontSizePercent(100)} style={{ padding: '4px 10px', background: 'var(--color-bg-primary)', border: 'none', borderRight: '1px solid var(--color-border)', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--color-text-primary)', minWidth: '45px' }}>{fontSizePercent}%</button>
                        <button onClick={() => handleFontSizeChange(10)} style={{ padding: '4px 10px', background: 'var(--color-bg-secondary)', border: 'none', cursor: 'pointer', fontSize: '1rem', color: 'var(--color-text-secondary)' }}>A+</button>
                    </div>

                    <nav>
                        <ul style={{ display: 'flex', gap: 'var(--spacing-md)', listStyle: 'none', margin: 0, padding: 0 }}>
                            <li><Link to="/">Inicio</Link></li>
                            <li><Link to="/habitos">Hábitos</Link></li>
                            <li><Link to="/recursos">Recursos</Link></li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;
