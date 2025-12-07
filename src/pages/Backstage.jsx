import React, { useState, useEffect } from 'react';
import { CONFIG } from '../config/data';
import { subscribeToSchedule, updateEventStatus, initializeDefaultData } from '../services/firestoreService';
import { generateGoogleCalendarLink } from '../utils/calendarUtils';
import logoHeader from '../assets/logo_header.png';

const ACCESS_CODE = "hemeaqui";

const RoleManager = ({ status, onConfirm, onSOS, role, name, calendarLink, eventDate }) => {
    const getStatusColor = () => {
        if (status === 'confirmed') return '#10b981'; // emerald-500
        if (status === 'sos') return '#ef4444'; // red-500
        return '#333333'; // Dark gray for neutral
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flex: 1 }}>
                <span style={{
                    color: '#666',
                    fontSize: '0.85rem',
                    textTransform: 'uppercase',
                    fontWeight: '600',
                    letterSpacing: '0.5px'
                }}>{role}</span>
                <span style={{
                    color: getStatusColor(),
                    fontSize: '0.95rem',
                    fontWeight: status && status !== 'none' ? 'bold' : 'normal',
                    transition: 'all 0.3s'
                }}>
                    {name}
                </span>
                {status === 'confirmed' && <span>✅</span>}
                {status === 'sos' && <span className="animate-pulse">🚨</span>}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button
                    onClick={() => calendarLink && window.open(calendarLink, '_blank')}
                    title={calendarLink ? "Agregar a Google Calendar" : "Error de datos"}
                    style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '1.2rem',
                        cursor: 'pointer',
                        marginRight: '0.5rem',
                        opacity: calendarLink ? 1 : 0.3,
                        filter: calendarLink ? 'none' : 'grayscale(100%)'
                    }}
                >
                    📅
                </button>

                <button
                    onClick={onConfirm}
                    title="Confirmar asistencia"
                    style={{
                        background: 'none',
                        border: '1px solid #10b981',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        padding: '4px 8px',
                        opacity: status === 'confirmed' ? 1 : 0.5,
                        filter: status === 'confirmed' ? 'none' : 'grayscale(100%)',
                        transition: 'all 0.2s'
                    }}
                >
                    ✅
                </button>
                <button
                    onClick={onSOS}
                    title="Pedir ayuda (SOS)"
                    style={{
                        background: 'none',
                        border: '1px solid #ef4444',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        padding: '4px 8px',
                        opacity: status === 'sos' ? 1 : 0.5,
                        filter: status === 'sos' ? 'none' : 'grayscale(100%)',
                        transition: 'all 0.2s'
                    }}
                >
                    🚨
                </button>
            </div>
        </div>
    );
};

const Backstage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [inputCode, setInputCode] = useState('');
    const [error, setError] = useState(false);
    const [schedule, setSchedule] = useState([]);
    const [fontSizePercent, setFontSizePercent] = useState(() => {
        return parseInt(localStorage.getItem('appFontSize') || '100');
    });

    useEffect(() => {
        const isLeader = localStorage.getItem('isLeader');
        if (isLeader === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    // Apply font size globally
    useEffect(() => {
        document.documentElement.style.fontSize = `${fontSizePercent}%`;
        localStorage.setItem('appFontSize', fontSizePercent);
    }, [fontSizePercent]);

    // Subscribe to schedule updates
    useEffect(() => {
        if (isAuthenticated) {
            const unsubscribe = subscribeToSchedule((data) => {
                if (data) setSchedule(data);
            });
            return () => unsubscribe();
        }
    }, [isAuthenticated]);

    const handleLogin = (e) => {
        e.preventDefault();
        // Simple comparison for simple password
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
    };

    const handleFontSizeChange = (delta) => {
        setFontSizePercent(prev => Math.min(Math.max(prev + delta, 70), 150));
    };

    const handleRoleStatusChange = (weekId, eventId, roleIndex, newStatus, roleData) => {
        updateEventStatus(weekId, eventId, roleIndex, newStatus);

        if (newStatus === 'sos') {
            const text = `⚠️ ATENCIÓN EQUIPO: Tengo una dificultad para cubrir ${roleData.role} (${roleData.name}) este ${roleData.date} en ${roleData.type}. ¿Alguien podría apoyarme cubriendo este espacio? 🙏`;
            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
        }
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
                    }}>Logística de Servicio</h2>

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
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f8f9fa', // Light background
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
                    <img src={logoHeader} alt="Campo David" style={{ height: '72px' }} />

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        {/* Font Controls */}
                        <div style={{ display: 'flex', border: '1px solid #e5e5e5', borderRadius: '6px', overflow: 'hidden', marginRight: '1rem' }}>
                            <button onClick={() => handleFontSizeChange(-10)} style={{ padding: '4px 10px', background: '#f9fafb', border: 'none', borderRight: '1px solid #e5e5e5', cursor: 'pointer', fontSize: '0.9rem', color: '#555' }}>A-</button>
                            <button onClick={() => setFontSizePercent(100)} style={{ padding: '4px 10px', background: '#fff', border: 'none', borderRight: '1px solid #e5e5e5', cursor: 'pointer', fontSize: '0.8rem', color: '#333', minWidth: '50px' }}>{fontSizePercent}%</button>
                            <button onClick={() => handleFontSizeChange(10)} style={{ padding: '4px 10px', background: '#f9fafb', border: 'none', cursor: 'pointer', fontSize: '1rem', color: '#555' }}>A+</button>
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
            </div>

            <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>

                {/* Hero / Info Card */}
                <div style={{
                    backgroundColor: '#eff6ff', // blue-50 
                    borderRadius: '12px',
                    padding: '2.5rem',
                    color: '#1e3a8a', // blue-900
                    marginBottom: '2rem',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                    border: '1px solid #dbeafe', // blue-100
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <h2 style={{
                        fontSize: '1.8rem',
                        fontWeight: '800',
                        lineHeight: '1.2',
                        marginBottom: '1.5rem',
                        textTransform: 'uppercase',
                        borderBottom: '2px solid #bfdbfe', // blue-200
                        paddingBottom: '1rem',
                        color: '#1e40af' // blue-800
                    }}>
                        Tablero de Avisos
                    </h2>

                    <div style={{ display: 'grid', mdGridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                        {/* Próximos Eventos */}
                        <div>
                            <h3 style={{
                                fontSize: '1.1rem',
                                fontWeight: '700',
                                marginBottom: '1rem',
                                color: '#2563eb', // blue-600
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>Próximos Eventos</h3>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center' }}>
                                    <span style={{ backgroundColor: '#fff', border: '1px solid #dbeafe', color: '#2563eb', padding: '4px 8px', borderRadius: '4px', marginRight: '0.8rem', fontSize: '0.9rem', width: '80px', textAlign: 'center', fontWeight: 'bold' }}>16 Abr</span>
                                    <span style={{ fontSize: '1rem', color: '#1e3a8a' }}>Pascua</span>
                                </li>
                                <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center' }}>
                                    <span style={{ backgroundColor: '#fff', border: '1px solid #dbeafe', color: '#2563eb', padding: '4px 8px', borderRadius: '4px', marginRight: '0.8rem', fontSize: '0.9rem', width: '80px', textAlign: 'center', fontWeight: 'bold' }}>02 Jun</span>
                                    <span style={{ fontSize: '1rem', color: '#1e3a8a' }}>Pentecostés</span>
                                </li>
                                <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center' }}>
                                    <span style={{ backgroundColor: '#fff', border: '1px solid #dbeafe', color: '#2563eb', padding: '4px 8px', borderRadius: '4px', marginRight: '0.8rem', fontSize: '0.9rem', width: '80px', textAlign: 'center', fontWeight: 'bold' }}>07 Oct</span>
                                    <span style={{ fontSize: '1rem', color: '#1e3a8a' }}>Cabañas</span>
                                </li>
                            </ul>
                        </div>

                        {/* Avisos Semanales */}
                        <div>
                            <h3 style={{
                                fontSize: '1.1rem',
                                fontWeight: '700',
                                marginBottom: '1rem',
                                color: '#2563eb', // blue-600
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>Avisos Semanales</h3>
                            <div style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '8px', border: '1px solid #dbeafe' }}>
                                <p style={{ fontSize: '0.95rem', lineHeight: '1.5', opacity: 0.9, color: '#334155' }}>
                                    Recordatorio: Confirmar asistencia a las reuniones antes del jueves.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid #bfdbfe', paddingTop: '1.5rem', textAlign: 'center' }}>
                        <p style={{ fontSize: '1rem', fontStyle: 'italic', fontWeight: '500', lineHeight: '1.6', fontFamily: 'serif', color: '#1e3a8a' }}>
                            "Así también vosotros pues que anhelais espirituales dones, procurad ser excelentes para la edificación de la iglesia"
                        </p>
                    </div>
                </div>

                <div style={{ display: 'grid', gap: '2rem' }}>
                    {/* Schedule Grid */}
                    {schedule && schedule.map(week => (
                        <div key={week.id}>
                            <h3 style={{
                                fontSize: '0.9rem',
                                fontWeight: '700',
                                color: '#666',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                marginBottom: '1rem',
                                paddingLeft: '0.5rem',
                                borderLeft: '3px solid #0066CC'
                            }}>
                                {week.week}
                            </h3>

                            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                                {week.events.map((event, idx) => (
                                    <div key={idx} style={{
                                        backgroundColor: '#fff',
                                        borderRadius: '10px',
                                        padding: '1.5rem',
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.03)',
                                        border: '1px solid #f0f0f0'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                            <span style={{
                                                color: '#0066CC',
                                                fontWeight: 'bold',
                                                fontSize: '0.9rem',
                                                backgroundColor: '#e6f0ff',
                                                padding: '4px 8px',
                                                borderRadius: '4px'
                                            }}>
                                                {event.date}
                                            </span>
                                            <span style={{ fontSize: '0.85rem', color: '#888' }}>{event.time}</span>
                                        </div>

                                        <h4 style={{
                                            fontSize: '1.1rem',
                                            fontWeight: '700',
                                            marginBottom: '0.5rem',
                                            color: '#1a1a1a'
                                        }}>
                                            {event.type}
                                        </h4>

                                        {event.theme && (
                                            <div style={{ marginBottom: '1.2rem' }}>
                                                <p style={{ color: '#555', fontSize: '0.95rem', fontStyle: 'italic' }}>"{event.theme}"</p>
                                                {event.objective && (
                                                    <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.2rem' }}>Obj: {event.objective}</p>
                                                )}
                                            </div>
                                        )}

                                        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '1rem' }}>
                                            {event.details.map((detail, dIdx) => (
                                                <RoleManager
                                                    key={dIdx}
                                                    role={detail.role}
                                                    name={detail.name}
                                                    status={detail.status}
                                                    eventDate={event.date}
                                                    calendarLink={generateGoogleCalendarLink(event, detail)}
                                                    onConfirm={() => handleRoleStatusChange(week.id, event.id, dIdx, 'confirmed', { ...detail, date: event.date, type: event.type })}
                                                    onSOS={() => handleRoleStatusChange(week.id, event.id, dIdx, 'sos', { ...detail, date: event.date, type: event.type })}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Backstage;
