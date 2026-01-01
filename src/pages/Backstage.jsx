import React, { useState, useEffect } from 'react';
import { CONFIG } from '../config/data';
import { db, subscribeToSchedule, updateEventStatus, getThemeStats } from '../services/firestoreService';
import { generateGoogleCalendarLink } from '../utils/calendarUtils';
import { PAST_SCHEDULES } from '../config/schedule_archive';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
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
                            <AnalyticsDashboard />
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

export default Backstage;
