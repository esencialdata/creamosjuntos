import React, { useState, useMemo } from 'react';
import { CONFIG, VERSES_POOL } from '../config/data';
import { PAST_SCHEDULES } from '../config/schedule_archive';

const AnalyticsDashboard = ({ stats = {}, isLive = false }) => {
    const [viewMode, setViewMode] = useState('sermons'); // 'sermons' | 'slides' | 'verses'
    const [sortBy, setSortBy] = useState('impact_desc');

    // Determine max value for chart scaling (Pulse)
    const dailyPulse = stats.dailyPulse || [];
    const maxPulse = Math.max(...dailyPulse.map(d => d.count), 1);

    // Helper for date sorting
    function parseDateForSort(dateStr) {
        try {
            if (!dateStr || dateStr === 'Reciente') return new Date().getTime();
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

    // 1. Data Aggregation (Sermons)
    const aggregatedSermons = useMemo(() => {
        if (isLive && stats.topEvents) {
            return stats.topEvents.map(event => ({
                id: event.id || event.name,
                title: event.name,
                date: 'Reciente',
                lights: event.count,
                type: 'sermon'
            }));
        }

        // Fallback to Archive logic if not live
        let items = [];
        try {
            if (PAST_SCHEDULES) {
                Object.values(PAST_SCHEDULES).forEach(year => {
                    if (year) Object.values(year).forEach(monthWeeks => {
                        monthWeeks.forEach(week => {
                            week.events.forEach(event => {
                                if (event.theme) {
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
    }, [stats, isLive]);

    // 2. Data Aggregation (Slides)
    const aggregatedSlides = useMemo(() => {
        // Get valid theme titles for filtering
        const validThemeTitles = CONFIG.themes ? CONFIG.themes.map(t => t.title) : [];

        if (isLive && stats.topTopics) {
            return stats.topTopics
                .filter(topic => validThemeTitles.includes(topic.name)) // STRICT FILTER: Only show official themes
                .map(topic => ({
                    id: topic.name,
                    title: topic.name,
                    lights: topic.count,
                    type: 'slide'
                }));
        }

        if (!CONFIG.themes) return [];
        return CONFIG.themes.map(theme => {
            const saves = stats.theme_saves?.[theme.title] || 0;
            const shares = stats.theme_shares?.[theme.title] || 0;
            const lights = stats.theme_lights?.[theme.title] || 0;
            return {
                id: `t-${theme.id}`,
                title: theme.title,
                lights,
                shares,
                saves,
                type: 'slide'
            };
        });
    }, [stats, isLive]);

    // 3. Data Aggregation (Verses)
    const aggregatedVerses = useMemo(() => {
        if (isLive && stats.topVerses) {
            return stats.topVerses.map(verse => {
                const found = VERSES_POOL ? VERSES_POOL.find(v => v.reference === verse.name) : null;
                return {
                    id: verse.name,
                    title: verse.name,
                    text: found ? found.text : '',
                    likes: verse.count,
                    type: 'verse'
                };
            });
        }

        if (!VERSES_POOL) return [];
        return VERSES_POOL.map((verse, idx) => ({
            id: `v-${idx}`,
            title: verse.reference,
            text: verse.text,
            likes: stats.verse_hearts?.[verse.reference] || 0,
            type: 'verse'
        }));
    }, [stats, isLive]);

    // 4. Sorting
    const sortedData = useMemo(() => {
        let data = [];
        if (viewMode === 'sermons') data = [...aggregatedSermons];
        else if (viewMode === 'slides') data = [...aggregatedSlides];
        else if (viewMode === 'verses') data = [...aggregatedVerses];

        if (viewMode === 'sermons') {
            if (sortBy === 'date') data.sort((a, b) => b.parsedDate - a.parsedDate);
            else if (sortBy === 'impact_desc') data.sort((a, b) => b.lights - a.lights);
        } else if (viewMode === 'slides') {
            data.sort((a, b) => b.lights - a.lights);
        } else {
            data.sort((a, b) => b.likes - a.likes);
        }
        return data;
    }, [aggregatedSermons, aggregatedSlides, aggregatedVerses, viewMode, sortBy]);

    const topItem = sortedData.length > 0 ? sortedData[0] : null;

    return (
        <div className="analytics-dashboard" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            {/* Header & Tabs */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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

            {/* Pulse Chart (Only for Live Mode) */}
            {isLive && dailyPulse.length > 0 && (
                <div style={{
                    background: '#fff',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    marginBottom: '2rem',
                    border: '1px solid #e5e5e5',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                        <span style={{ fontSize: '1.2rem' }}>📊</span>
                        <h4 style={{ margin: 0, fontSize: '1rem', color: '#333' }}>Pulso de Engagement Semanal</h4>
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'space-between',
                        height: '100px',
                        paddingTop: '1rem'
                    }}>
                        {dailyPulse.map((day) => (
                            <div key={day.day} style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.3rem',
                                width: '100%'
                            }}>
                                <div style={{
                                    width: '60%',
                                    height: `${(day.count / maxPulse) * 100}%`,
                                    background: 'var(--color-accent, #3b82f6)',
                                    opacity: 0.8,
                                    borderRadius: '4px 4px 0 0',
                                    minHeight: day.count > 0 ? '4px' : '0',
                                    transition: 'height 0.5s ease'
                                }} title={`${day.count} guardados`}></div>
                                <span style={{ fontSize: '0.7rem', color: '#666' }}>{day.day}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

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
                        {viewMode === 'verses' && <p style={{ fontSize: '0.85rem', marginTop: '0.25rem', opacity: 0.7, fontStyle: 'italic', maxWidth: '90%' }}>"{topItem.text?.substring(0, 60)}..."</p>}
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

export default AnalyticsDashboard;
