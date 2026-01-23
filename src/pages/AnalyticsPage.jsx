import React, { useState, useEffect } from 'react';
import { getThemeStats, getCommunityStats } from '../services/firestoreService';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import logoHeader from '../assets/logo_header.png';
import { useNavigate } from 'react-router-dom';

const ACCESS_CODE = "hemeaqui";

const AnalyticsPage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [inputCode, setInputCode] = useState('');
    const [error, setError] = useState(false);
    const [communityStats, setCommunityStats] = useState(null);
    const [statsError, setStatsError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const isLeader = localStorage.getItem('isLeader');
        if (isLeader === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    // Fetch stats
    useEffect(() => {
        if (isAuthenticated && !communityStats) {
            setStatsError(null);
            getCommunityStats()
                .then(stats => setCommunityStats(stats))
                .catch(err => {
                    console.error("Stats fetch error:", err);
                    setStatsError(err.message || "Error al cargar datos");
                });
        }
    }, [isAuthenticated]);

    const handleLogin = (e) => {
        e.preventDefault();
        if (inputCode.trim().toLowerCase() === ACCESS_CODE.toLowerCase()) {
            localStorage.setItem('isLeader', 'true');
            setIsAuthenticated(true);
        } else {
            setError(true);
            setTimeout(() => setError(false), 2000);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('isLeader');
        setIsAuthenticated(false);
        setInputCode('');
        navigate('/'); // Go back to home/schedule
    };

    if (!isAuthenticated) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f3f4f6',
                fontFamily: 'Inter, system-ui, sans-serif'
            }}>
                <div style={{
                    backgroundColor: '#fff',
                    padding: '2.5rem',
                    borderRadius: '16px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    width: '100%',
                    maxWidth: '400px',
                    textAlign: 'center'
                }}>
                    <img src={logoHeader} alt="Campo David" style={{ marginBottom: '1.5rem', height: '60px' }} />
                    <h2 style={{
                        marginTop: '0.5rem',
                        marginBottom: '1.5rem',
                        color: '#111827',
                        fontSize: '1.5rem',
                        fontWeight: '700'
                    }}>Acceso a Analíticas</h2>

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input
                            type="password"
                            value={inputCode}
                            onChange={(e) => setInputCode(e.target.value)}
                            placeholder="Código de acceso"
                            style={{
                                padding: '0.75rem',
                                borderRadius: '6px',
                                border: `1px solid ${error ? '#ef4444' : '#d1d5db'}`,
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'all 0.2s'
                            }}
                        />
                        {error && <span style={{ color: '#ef4444', fontSize: '0.875rem' }}>Código incorrecto</span>}
                        <button
                            type="submit"
                            style={{
                                padding: '0.75rem',
                                backgroundColor: '#0052CC',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '6px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                textTransform: 'uppercase',
                                fontSize: '0.9rem',
                                letterSpacing: '1px',
                                boxShadow: '0 4px 6px rgba(0,82,204,0.2)'
                            }}
                        >
                            Entrar
                        </button>
                    </form>
                    <div style={{ marginTop: '1rem' }}>
                        <button
                            onClick={() => navigate('/')}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#6B7280',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                textDecoration: 'underline'
                            }}
                        >
                            Volver al Calendario
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f8f9fa',
            color: '#333',
            fontFamily: 'Inter, system-ui, sans-serif',
            paddingBottom: '4rem'
        }}>
            {/* Header / Top Bar */}
            <div style={{
                backgroundColor: '#fff',
                borderBottom: '1px solid #e5e5e5',
                padding: '1rem 0'
            }}>
                <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img src={logoHeader} alt="Campo David" style={{ height: '40px' }} />
                        <span style={{ fontWeight: '600', color: '#1E293B' }}>Analíticas</span>
                    </div>

                    <button
                        onClick={handleLogout}
                        style={{
                            background: 'none',
                            border: '1px solid #e5e5e5',
                            color: '#666',
                            padding: '0.4rem 1rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                        }}
                    >
                        Salir
                    </button>
                </div>
            </div>

            <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
                <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1E293B', marginBottom: '0.5rem' }}>Panel de Datos</h2>
                        <p style={{ color: '#64748B' }}>Visualizando métricas de impacto en tiempo real.</p>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#fff',
                            border: '1px solid #E2E8F0',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            color: '#475569',
                            fontWeight: '500'
                        }}
                    >
                        ← Ir al Calendario
                    </button>
                </div>
                {statsError ? (
                    <div style={{ padding: '2rem', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', color: '#991B1B' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem' }}>⚠️ Error al cargar datos</h3>
                        <p style={{ marginBottom: '1rem' }}>{statsError}</p>
                        {(statsError.includes('index') || statsError.includes('failed-precondition')) && (
                            <p style={{ fontSize: '0.9rem' }}>
                                Es probable que falte un índice en Firestore.<br />
                                <a href="https://console.firebase.google.com/project/campo-david/firestore/indexes" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                                    Verificar Indices en Firebase Console
                                </a>
                            </p>
                        )}
                    </div>
                ) : (
                    communityStats ? <AnalyticsDashboard stats={communityStats} isLive={true} /> : <p>Cargando datos...</p>
                )}
            </div>
        </div>
    );
};

export default AnalyticsPage;
