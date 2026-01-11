import React, { useState, useEffect, useMemo } from 'react';
import { CONFIG, VERSES_POOL } from '../config/data';
import { subscribeToSchedule, updateEventStatus, initializeDefaultData, getThemeStats } from '../services/firestoreService';
import { generateGoogleCalendarLink } from '../utils/calendarUtils';
import { PAST_SCHEDULES } from '../config/schedule_archive';
import logoHeader from '../assets/logo_header.png';

const ACCESS_CODE = "hemeaqui";

const RoleManager = ({ status, onConfirm, onSOS, role, name, calendarLink, eventDate }) => {
    const getStatusColor = () => {
        if (status === 'confirmed') return '#10b981'; // emerald-500
        if (status === 'sos') return '#ef4444'; // red-500
        return '#333333'; // Dark gray for neutral
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.75rem 0', // Un poco más de aire
            borderBottom: '1px solid #f0f0f0',
            flexWrap: 'wrap', // <--- CLAVE PARA RESPONSIVE
            gap: '0.5rem'     // <--- ESPACIO ENTRE FILAS
        }}>
            <div style={{
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'center',
                flex: '1 1 200px',
                minWidth: '60%'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{
                        color: '#666',
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        fontWeight: '600',
                        letterSpacing: '0.5px'
                    }}>{role}</span>

                    <span style={{
                        color: getStatusColor(),
                        fontSize: '0.95rem',
                        fontWeight: status && status !== 'none' ? 'bold' : 'normal',
                        lineHeight: '1.2',
                        transition: 'all 0.3s'
                    }}>
                        {name}
                    </span>
                </div>

                <div style={{ display: 'flex', gap: '0.25rem', marginLeft: '0.5rem' }}>
                    {status === 'confirmed' && <span style={{ fontSize: '0.8rem' }}>✅</span>}
                    {status === 'sos' && <span className="animate-pulse" style={{ fontSize: '0.8rem' }}>🚨</span>}
                </div>
            </div>

            <div style={{
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'center',
                marginLeft: 'auto', // Empuja a la derecha en desktop
                flexShrink: 0       // Evita que los botones se aplasten
            }}>
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
    const [showArchive, setShowArchive] = useState(false);
    const [selectedYear, setSelectedYear] = useState('2025');
    const [selectedMonth, setSelectedMonth] = useState('December');
    const [archiveViewMode, setArchiveViewMode] = useState('calendar'); // 'calendar' | 'analytics'

    useEffect(() => {
        const isLeader = localStorage.getItem('isLeader');
        if (isLeader === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    // Subscribe to schedule updates
    useEffect(() => {
        if (isAuthenticated) {
            const unsubscribe = subscribeToSchedule((data) => {
                if (data) setSchedule(data);
            });
            return () => unsubscribe();
        }
    }, [isAuthenticated]);

    // Fetch stats for archive
    const [themeStats, setThemeStats] = useState({});
    useEffect(() => {
        if (showArchive) {
            getThemeStats().then(stats => setThemeStats(stats));
        }
    }, [showArchive]);

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
                                    <span style={{ backgroundColor: '#fff', border: '1px solid #dbeafe', color: '#2563eb', padding: '4px 8px', borderRadius: '4px', marginRight: '0.8rem', fontSize: '0.9rem', width: '80px', textAlign: 'center', fontWeight: 'bold' }}>28 Feb</span>
                                    <span style={{ fontSize: '1rem', color: '#1e3a8a' }}>Servicio Unificado (3 Localidades)</span>
                                </li>
                                <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center' }}>
                                    <span style={{ backgroundColor: '#fff', border: '1px solid #dbeafe', color: '#2563eb', padding: '4px 8px', borderRadius: '4px', marginRight: '0.8rem', fontSize: '0.9rem', width: '80px', textAlign: 'center', fontWeight: 'bold' }}>28 Feb</span>
                                    <span style={{ fontSize: '1rem', color: '#1e3a8a' }}>Bautizos</span>
                                </li>
                                <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center' }}>
                                    <span style={{ backgroundColor: '#fff', border: '1px solid #dbeafe', color: '#2563eb', padding: '4px 8px', borderRadius: '4px', marginRight: '0.8rem', fontSize: '0.9rem', width: '80px', textAlign: 'center', fontWeight: 'bold' }}>01 Abr</span>
                                    <span style={{ fontSize: '1rem', color: '#1e3a8a' }}>Pascua</span>
                                </li>
                                <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center' }}>
                                    <span style={{ backgroundColor: '#fff', border: '1px solid #dbeafe', color: '#2563eb', padding: '4px 8px', borderRadius: '4px', marginRight: '0.8rem', fontSize: '0.9rem', width: '80px', textAlign: 'center', fontWeight: 'bold' }}>22 May</span>
                                    <span style={{ fontSize: '1rem', color: '#1e3a8a' }}>Pentecostés</span>
                                </li>
                                <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center' }}>
                                    <span style={{ backgroundColor: '#fff', border: '1px solid #dbeafe', color: '#2563eb', padding: '4px 8px', borderRadius: '4px', marginRight: '0.8rem', fontSize: '0.9rem', width: '80px', textAlign: 'center', fontWeight: 'bold' }}>22 Sep</span>
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
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    <li style={{ marginBottom: '0.5rem', fontSize: '0.95rem', color: '#334155' }}>
                                        • Recordatorio: Confirmar asistencia a las reuniones antes del jueves.
                                    </li>
                                </ul>
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
                                                {/* Logic to extract sermon title from Predicación details if available */}
                                                {(() => {
                                                    const preacherDetail = event.details && event.details.find(d => d.role === "Predicación");
                                                    const titleMatch = preacherDetail ? preacherDetail.name.match(/\(([^)]+)\)/) : null;
                                                    const displayTheme = titleMatch ? titleMatch[1] : event.theme;

                                                    return (
                                                        <p style={{ color: '#555', fontSize: '0.95rem', fontStyle: 'italic' }}>"{displayTheme}"</p>
                                                    );
                                                })()}

                                                {/* Objective displayed immediately under Theme as per screenshot/request */}
                                                {event.objective && (
                                                    <p style={{ fontSize: '0.8rem', color: '#888', margin: '0.2rem 0 0 0' }}>Obj: {event.objective}</p>
                                                )}

                                                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '0.4rem' }}>
                                                    {/* Lights Metric Badge */}
                                                    {event.lights > 0 && (
                                                        <span style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '4px',
                                                            backgroundColor: '#FEF3C7',
                                                            color: '#D97706',
                                                            padding: '2px 8px',
                                                            borderRadius: '12px',
                                                            fontSize: '0.8rem',
                                                            fontWeight: 'bold'
                                                        }}>
                                                            💡 {event.lights}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '1rem' }}>
                                            {event.details.map((detail, dIdx) => (
                                                <div key={dIdx}>
                                                    <RoleManager
                                                        role={detail.role}
                                                        name={detail.name}
                                                        status={detail.status}
                                                        eventDate={event.date}
                                                        calendarLink={generateGoogleCalendarLink(event, detail)}
                                                        onConfirm={() => handleRoleStatusChange(week.id, event.id, dIdx, 'confirmed', { ...detail, date: event.date, type: event.type })}
                                                        onSOS={() => handleRoleStatusChange(week.id, event.id, dIdx, 'sos', { ...detail, date: event.date, type: event.type })}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Archive Section */}
            <div className="container" style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
                <button
                    onClick={() => setShowArchive(!showArchive)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#666',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        marginBottom: '1rem'
                    }}
                >
                    {showArchive ? 'Ocultar Historial' : 'Ver Servicios Anteriores'}
                </button>

                {showArchive && (
                    <div style={{
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        border: '1px solid #e5e5e5'
                    }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#333' }}>Historial de Servicios</h3>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                            {/* Analytics Toggle */}
                            <div style={{
                                display: 'flex',
                                backgroundColor: '#F1F5F9',
                                padding: '4px',
                                borderRadius: '8px'
                            }}>
                                <button
                                    onClick={() => setArchiveViewMode('calendar')}
                                    style={{
                                        padding: '6px 16px',
                                        borderRadius: '6px',
                                        border: 'none',
                                        fontSize: '0.9rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        backgroundColor: archiveViewMode === 'calendar' ? '#fff' : 'transparent',
                                        color: archiveViewMode === 'calendar' ? '#0F172A' : '#64748B',
                                        boxShadow: archiveViewMode === 'calendar' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    Calendario
                                </button>
                                <button
                                    onClick={() => setArchiveViewMode('analytics')}
                                    style={{
                                        padding: '6px 16px',
                                        borderRadius: '6px',
                                        border: 'none',
                                        fontSize: '0.9rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        backgroundColor: archiveViewMode === 'analytics' ? '#fff' : 'transparent',
                                        color: archiveViewMode === 'analytics' ? '#0F172A' : '#64748B',
                                        boxShadow: archiveViewMode === 'analytics' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    Analíticas
                                </button>
                            </div>

                            {/* Date Selectors (Only visible in Calendar mode) */}
                            {archiveViewMode === 'calendar' && (
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <select
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(e.target.value)}
                                        style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                    >
                                        {Object.keys(PAST_SCHEDULES).map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>

                                    <select
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(e.target.value)}
                                        style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                    >
                                        {Object.keys(PAST_SCHEDULES[selectedYear] || {}).map(month => (
                                            <option key={month} value={month}>{month}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        {/* CONTENT SWITCHER */}
                        {archiveViewMode === 'analytics' ? (
                            <AnalyticsDashboard stats={themeStats} />
                        ) : (
                            <div style={{ display: 'grid', gap: '2rem' }}>
                                {PAST_SCHEDULES[selectedYear]?.[selectedMonth]?.map(week => (
                                    <div key={week.id} style={{ opacity: 0.8 }}>
                                        <h3 style={{
                                            fontSize: '0.8rem',
                                            fontWeight: '700',
                                            color: '#888',
                                            textTransform: 'uppercase',
                                            marginBottom: '0.8rem',
                                            borderLeft: '3px solid #ccc',
                                            paddingLeft: '0.5rem'
                                        }}>
                                            {week.week}
                                        </h3>
                                        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                                            {week.events.map((event, idx) => (
                                                <div key={idx} style={{
                                                    backgroundColor: '#fafafa',
                                                    borderRadius: '8px',
                                                    padding: '1rem',
                                                    border: '1px solid #eee'
                                                }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                        <span style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#555' }}>
                                                            {event.date}
                                                        </span>
                                                        <span style={{ fontSize: '0.8rem', color: '#999' }}>{event.time}</span>
                                                    </div>
                                                    <h4 style={{ fontSize: '1rem', marginBottom: '0.4rem', color: '#444' }}>{event.type}</h4>

                                                    {event.theme && (
                                                        <div style={{ marginBottom: '0.8rem' }}>
                                                            <p style={{ color: '#666', fontSize: '0.9rem', fontStyle: 'italic', marginBottom: '0.3rem' }}>"{event.theme}"</p>
                                                        </div>
                                                    )}
                                                    {/* Only basic details for simplified history view */}
                                                    <div style={{ marginTop: '0.8rem' }}>
                                                        {event.details.map((detail, dIdx) => (
                                                            <div key={dIdx} style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.2rem' }}>
                                                                <strong>{detail.role}:</strong> {detail.name}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// --- ANALYTICS COMPONENT (Inline) ---
const AnalyticsDashboard = ({ stats = {} }) => {
    const [viewMode, setViewMode] = useState('sermons'); // 'sermons' | 'slides' | 'verses'
    const [sortBy, setSortBy] = useState('impact_desc');

    // 1. Data Aggregation (Sermons - Archive)
    const aggregatedSermons = useMemo(() => {
        let items = [];
        try {
            if (PAST_SCHEDULES) {
                Object.values(PAST_SCHEDULES).forEach(year => {
                    if (year) Object.values(year).forEach(monthWeeks => {
                        monthWeeks.forEach(week => {
                            week.events.forEach(event => {
                                if (event.theme) {
                                    // Sermons only track lights from archive
                                    items.push({
                                        id: event.id || `${week.id}-${event.date}`,
                                        title: event.theme,
                                        date: event.date,
                                        parsedDate: parseDateForSort(event.date),
                                        lights: event.lights || 0,
                                        type: 'sermon'
                                    });
                                }
                            });
                        });
                    });
                });
            }
        } catch (e) { console.error(e); }
        return items;
    }, []);

    // 2. Data Aggregation (Slides - Config + Stats)
    const aggregatedSlides = useMemo(() => {
        if (!CONFIG.themes) return [];
        return CONFIG.themes.map(theme => {
            const saves = stats.theme_saves?.[theme.title] || 0;
            const shares = stats.theme_shares?.[theme.title] || 0;
            const lights = stats.theme_lights?.[theme.title] || 0; // Assuming this exists in stats
            return {
                id: `t-${theme.id}`,
                title: theme.title,
                lights,
                shares,
                saves,
                type: 'slide'
            };
        });
    }, [stats]);

    // 3. Data Aggregation (Verses - Pool + Stats)
    const aggregatedVerses = useMemo(() => {
        if (!VERSES_POOL) return [];
        return VERSES_POOL.map((verse, idx) => ({
            id: `v-${idx}`,
            title: verse.reference,
            text: verse.text,
            likes: stats.verse_hearts?.[verse.reference] || 0,
            type: 'verse'
        }));
    }, [stats]);

    // Helper for date sorting
    function parseDateForSort(dateStr) {
        try {
            const months = { 'Ene': 0, 'Feb': 1, 'Mar': 2, 'Abr': 3, 'May': 4, 'Jun': 5, 'Jul': 6, 'Ago': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dic': 11 };
            const parts = dateStr.split(" ");
            if (parts.length < 3) return 0;
            const day = parseInt(parts[1], 10);
            const month = months[parts[2].substr(0, 3)];
            let year = 2026;
            if (month >= 10) year = 2025;
            return new Date(year, month, day).getTime();
        } catch (e) { return 0; }
    }

    // 4. Sorting
    const sortedData = useMemo(() => {
        let data = [];
        if (viewMode === 'sermons') data = [...aggregatedSermons];
        else if (viewMode === 'slides') data = [...aggregatedSlides];
        else if (viewMode === 'verses') data = [...aggregatedVerses];

        if (viewMode === 'sermons') {
            if (sortBy === 'date') data.sort((a, b) => b.parsedDate - a.parsedDate);
            else if (sortBy === 'impact_desc') data.sort((a, b) => b.lights - a.lights);
            else if (sortBy === 'impact_asc') data.sort((a, b) => a.lights - b.lights);
        } else if (viewMode === 'slides') {
            if (sortBy === 'impact_desc' || sortBy === 'likes') data.sort((a, b) => b.lights - a.lights);
            else if (sortBy === 'shares') data.sort((a, b) => b.shares - a.shares);
            else if (sortBy === 'saves') data.sort((a, b) => b.saves - a.saves);
        } else {
            // Verses
            data.sort((a, b) => b.likes - a.likes);
        }
        return data;
    }, [aggregatedSermons, aggregatedSlides, aggregatedVerses, viewMode, sortBy]);

    const topItem = sortedData.length > 0 ? sortedData[0] : null;

    return (
        <div className="analytics-dashboard" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            {/* Header & Tabs */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1E293B' }}>Analíticas de Impacto</h3>

                <div style={{ display: 'flex', backgroundColor: '#F1F5F9', padding: '4px', borderRadius: '8px', alignSelf: 'start', flexWrap: 'wrap', gap: '4px' }}>
                    {[
                        { id: 'sermons', label: 'Predicaciones' },
                        { id: 'slides', label: 'Carruseles' },
                        { id: 'verses', label: 'Citas' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => { setViewMode(tab.id); setSortBy('impact_desc'); }}
                            style={{
                                padding: '6px 12px',
                                borderRadius: '6px',
                                border: 'none',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                backgroundColor: viewMode === tab.id ? '#fff' : 'transparent',
                                color: viewMode === tab.id ? '#0F172A' : '#64748B',
                                boxShadow: viewMode === tab.id ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                                transition: 'all 0.2s',
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* HERO METRIC CARD */}
            {topItem && (
                <div style={{
                    background: viewMode === 'verses' ? 'linear-gradient(135deg, #065f46 0%, #059669 100%)' :
                        viewMode === 'slides' ? 'linear-gradient(135deg, #7c2d12 0%, #ea580c 100%)' :
                            'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    color: 'white',
                    marginBottom: '2rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.8, marginBottom: '0.5rem' }}>
                            🏆 {viewMode === 'verses' ? 'Cita Más Amada' : 'Contenido Destacado'}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '2.5rem', fontWeight: '800', color: '#FCD34D' }}>
                                {viewMode === 'verses' ? topItem.likes : topItem.lights}
                            </span>
                            <span style={{ fontSize: '1rem', fontWeight: '500', opacity: 0.9 }}>
                                {viewMode === 'verses' ? 'me gusta' : 'reacciones'}
                            </span>
                        </div>
                        <h4 style={{ fontSize: '1.25rem', fontWeight: '600', lineHeight: 1.3 }}>
                            {topItem.title}
                        </h4>
                        {viewMode === 'sermons' && <p style={{ fontSize: '0.85rem', marginTop: '0.25rem', opacity: 0.7 }}>{topItem.date}</p>}
                        {viewMode === 'verses' && <p style={{ fontSize: '0.85rem', marginTop: '0.25rem', opacity: 0.7, fontStyle: 'italic', maxWidth: '90%' }}>"{topItem.text.substring(0, 60)}..."</p>}
                    </div>
                </div>
            )}

            {/* CONTROLS */}
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#64748B' }}>Ranking</span>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.85rem', color: '#475569' }}
                >
                    <option value="impact_desc">Mayor Impacto</option>
                    <option value="impact_asc">Menor Impacto</option>
                    {viewMode === 'slides' && <option value="shares">Más Compartidos</option>}
                    {viewMode === 'slides' && <option value="saves">Más Guardados</option>}
                    {viewMode === 'sermons' && <option value="date">Más Recientes</option>}
                </select>
            </div>

            {/* LIST */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {sortedData.map((item, idx) => (
                    <div key={item.id} style={{
                        display: 'flex', alignItems: 'center', gap: '12px', padding: '12px',
                        backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #F1F5F9'
                    }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#334155' }}>{item.title}</span>
                            </div>

                            {/* METRICS ROW */}
                            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#64748B' }}>
                                {viewMode === 'sermons' && (
                                    <span title="Reacciones">💡 <strong>{item.lights}</strong></span>
                                )}
                                {viewMode === 'slides' && (
                                    <>
                                        <span title="Reacciones">💡 <strong>{item.lights}</strong></span>
                                        <span title="Compartidos">↗️ <strong>{item.shares}</strong></span>
                                        <span title="Guardados">💾 <strong>{item.saves}</strong></span>
                                    </>
                                )}
                                {viewMode === 'verses' && (
                                    <span title="Me Gusta">❤️ <strong>{item.likes}</strong></span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {sortedData.length === 0 && (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>
                        No hay datos registrados aún.
                    </div>
                )}
            </div>
        </div >
    );
};

export default Backstage;
