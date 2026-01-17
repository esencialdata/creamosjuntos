import React, { useState, useEffect } from 'react';
import { getCommunityStats } from '../services/firestoreService';
import logoHeader from '../assets/logo_header.png';
import { Link } from 'react-router-dom';

const SpiritualThermometer = () => {
    const [stats, setStats] = useState({
        topVerses: [],
        topTopics: [],
        topVerses: [],
        topTopics: [],
        topEvents: [],
        dailyPulse: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const data = await getCommunityStats();
            setStats(data);
            setLoading(false);
        };
        fetchStats();
    }, []);

    const SectionHeader = ({ title, icon }) => (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem',
            borderBottom: '1px solid #e5e5e5',
            paddingBottom: '0.5rem'
        }}>
            <span style={{ fontSize: '1.25rem' }}>{icon}</span>
            <h2 style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '1.1rem',
                color: '#333'
            }}>{title}</h2>
        </div>
    );

    const Card = ({ children }) => (
        <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            border: '1px solid #e5e5e5',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
            {children}
        </div>
    );

    const SimpleLayout = ({ children }) => (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f8f9fa',
            color: '#333',
            fontFamily: 'Inter, system-ui, sans-serif',
            paddingBottom: '4rem'
        }}>
            {/* Header */}
            <div style={{
                backgroundColor: '#fff',
                borderBottom: '1px solid #e5e5e5',
                padding: '1rem 0'
            }}>
                <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <img src={logoHeader} alt="Campo David" style={{ height: '72px' }} />
                    <Link to="/" style={{
                        textDecoration: 'none',
                        color: '#666',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        ← Volver al Panel
                    </Link>
                </div>
            </div>
            <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
                {children}
            </div>
        </div>
    );

    if (loading) {
        return (
            <SimpleLayout>
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <p>Cargando datos de la comunidad...</p>
                </div>
            </SimpleLayout>
        );
    }

    // Determine max value for chart scaling
    const maxPulse = Math.max(...stats.dailyPulse.map(d => d.count), 1);

    return (
        <Layout>
            <div className="spiritual-dashboard">
                <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.8rem',
                        color: 'var(--color-accent)'
                    }}>
                        Termómetro Espiritual
                    </h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>Pulso de la comunidad esta semana</p>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>

                    {/* Engagement Pulse Chart */}
                    <Card>
                        <SectionHeader title="Pulso de Engagement" icon="📊" />
                        <div style={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'space-between',
                            height: '150px',
                            paddingTop: '1rem'
                        }}>
                            {stats.dailyPulse.map((day) => (
                                <div key={day.day} style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    width: '100%'
                                }}>
                                    <div style={{
                                        width: '60%',
                                        height: `${(day.count / maxPulse) * 100}%`,
                                        background: 'var(--color-accent)',
                                        opacity: 0.8,
                                        borderRadius: '4px 4px 0 0',
                                        minHeight: day.count > 0 ? '4px' : '0',
                                        transition: 'height 0.5s ease'
                                    }} title={`${day.count} guardados`}></div>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{day.day}</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Top Verses */}
                    <Card>
                        <SectionHeader title="Versículos más guardados" icon="❤️" />
                        {stats.topVerses.length === 0 ? (
                            <p style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>No hay datos suficientes aún.</p>
                        ) : (
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {stats.topVerses.map((item, index) => (
                                    <li key={index} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '0.75rem 0',
                                        borderBottom: index < stats.topVerses.length - 1 ? '1px solid var(--color-border)' : 'none'
                                    }}>
                                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                            <span style={{
                                                fontWeight: 'bold',
                                                color: 'var(--color-accent)',
                                                width: '20px'
                                            }}>{index + 1}.</span>
                                            <span style={{ fontSize: '0.9rem', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {item.name}
                                            </span>
                                        </div>
                                        <span style={{
                                            background: 'rgba(0,0,0,0.05)',
                                            padding: '2px 8px',
                                            borderRadius: '10px',
                                            fontSize: '0.8rem',
                                            fontWeight: 'bold'
                                        }}>{item.count}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Card>

                    {/* Top Topics */}
                    <Card>
                        <SectionHeader title="Temas de mayor impacto" icon="🔥" />
                        {stats.topTopics.length === 0 ? (
                            <p style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>No hay datos suficientes aún.</p>
                        ) : (
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {stats.topTopics.map((item, index) => (
                                    <li key={index} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '0.75rem 0',
                                        borderBottom: index < stats.topTopics.length - 1 ? '1px solid var(--color-border)' : 'none'
                                    }}>
                                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                            <span style={{
                                                fontWeight: 'bold',
                                                color: 'var(--color-accent)',
                                                width: '20px'
                                            }}>{index + 1}.</span>
                                            <span style={{ fontSize: '0.9rem' }}>{item.name}</span>
                                        </div>
                                        <span style={{
                                            background: 'rgba(0,0,0,0.05)',
                                            padding: '2px 8px',
                                            borderRadius: '10px',
                                            fontSize: '0.8rem',
                                            fontWeight: 'bold'
                                        }}>{item.count}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Card>

                    {/* Top Events */}
                    <Card>
                        <SectionHeader title="Eventos de mayor interés" icon="📅" />
                        {stats.topEvents.length === 0 ? (
                            <p style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>No hay datos suficientes aún.</p>
                        ) : (
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {stats.topEvents.map((item, index) => (
                                    <li key={index} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '0.75rem 0',
                                        borderBottom: index < stats.topEvents.length - 1 ? '1px solid var(--color-border)' : 'none'
                                    }}>
                                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                            <span style={{
                                                fontWeight: 'bold',
                                                color: 'var(--color-accent)',
                                                width: '20px'
                                            }}>{index + 1}.</span>
                                            <span style={{ fontSize: '0.9rem' }}>{item.name}</span>
                                        </div>
                                        <span style={{
                                            background: 'rgba(0,0,0,0.05)',
                                            padding: '2px 8px',
                                            borderRadius: '10px',
                                            fontSize: '0.8rem',
                                            fontWeight: 'bold'
                                        }}>{item.count}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default SpiritualThermometer;
