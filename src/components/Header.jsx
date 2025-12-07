import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header style={{
            borderBottom: '1px solid var(--color-border)',
            padding: 'var(--spacing-sm) 0',
            marginBottom: 'var(--spacing-md)'
        }}>
            <div className="container" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Link to="/" style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    color: 'var(--color-text-primary)'
                }}>
                    Creamos juntos
                </Link>

                <nav>
                    <ul style={{ display: 'flex', gap: 'var(--spacing-md)', listStyle: 'none' }}>
                        <li><Link to="/">Inicio</Link></li>
                        <li><Link to="/habitos">Hábitos</Link></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
