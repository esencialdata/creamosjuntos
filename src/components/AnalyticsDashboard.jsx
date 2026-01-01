
import React, { useState, useMemo } from 'react';
import { CONFIG } from '../config/data';
import { PAST_SCHEDULES } from '../config/schedule_archive';

const AnalyticsDashboard = () => {
    const [sortBy, setSortBy] = useState('date'); // 'date' | 'lights_desc' | 'lights_asc'

    // 1. Data Aggregation
    const aggregatedData = useMemo(() => {
        let allEvents = [];

        // Function to extract events from a schedule structure
        const extract = (scheduleList) => {
            scheduleList.forEach(week => {
                week.events.forEach(event => {
                    // Only care about events with Themes (likely to have votes/impact)
                    // Or specific roles like Predicación if we want to be granular.
                    // For now, based on "Topic Performance", we track events with 'theme' and 'lights'.

                    // We need to normalize the "Theme" vs "Sermon Title" issue.
                    // If it has a sermon title in details, use that? Or the Theme?
                    // The request says "Topic Title". Let's stick to the main Theme for consistency
                    // OR try to find the sermon title if 'Predicación' exists.

                    if (event.theme) {
                        let displayTitle = event.theme;
                        // Optional: refinement to match the card logic (Sermon Title override)
                        // but maybe for analytics "Theme" is cleaner? Let's use Theme for now.

                        allEvents.push({
                            id: event.id || `${week.id}-${event.date}`,
                            date: event.date,
                            // Improve date for sorting
                            parsedDate: parseDateForSort(event.date),
                            title: displayTitle,
                            lights: event.lights || 0, // Ensure numeric
                            objective: event.objective
                        });
                    }
                });
            });
        };

        // Process Archive
        Object.values(PAST_SCHEDULES).forEach(year => {
            Object.values(year).forEach(monthWeeks => {
                extract(monthWeeks);
            });
        });

        // Process Current Schedule (Optional: exclude if empty stats? Include for now)
        // extract(CONFIG.schedule); 

        return allEvents;
    }, []);

    // Helper for date sorting (Simple approximate)
    function parseDateForSort(dateStr) {
        // "Sábado 03 Ene"
        try {
            const months = { 'Ene': 0, 'Feb': 1, 'Mar': 2, 'Abr': 3, 'May': 4, 'Jun': 5, 'Jul': 6, 'Ago': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dic': 11 };
            const parts = dateStr.split(" ");
            if (parts.length < 3) return 0;
            const day = parseInt(parts[1], 10);
            const month = months[parts[2].substr(0, 3)];
            // Hacky year assumption: Archive is 2025/2026. 
            // Better to pass Year context if possible, but for relative sorting within recent times:
            // Let's assume month > 10 is 2025, < 2 is 2026? 
            // Or just rely on array order if purely chronological... but 'sortBy' breaks array order.
            // Let's verify year.
            let year = 2026;
            if (month >= 10) year = 2025; // Simple heuristic for now
            return new Date(year, month, day).getTime();
        } catch (e) {
            return 0;
        }
    }

    // 2. Sorting Logic
    const sortedData = useMemo(() => {
        let data = [...aggregatedData];
        if (sortBy === 'date') {
            // Newest first
            data.sort((a, b) => b.parsedDate - a.parsedDate);
        } else if (sortBy === 'lights_desc') {
            data.sort((a, b) => b.lights - a.lights);
        } else if (sortBy === 'lights_asc') {
            data.sort((a, b) => a.lights - b.lights);
        }
        return data;
    }, [aggregatedData, sortBy]);

    // 3. Stats Calculation
    const maxLights = Math.max(...aggregatedData.map(d => d.lights), 1); // Avoid div by 0
    const topTopic = [...aggregatedData].sort((a, b) => b.lights - a.lights)[0];

    // 4. Filters Handlers
    const handleSortChange = (e) => setSortBy(e.target.value);


    return (
        <div className="analytics-dashboard" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>

            {/* Header / Title */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1E293B' }}>Analíticas de Impacto</h3>
            </div>

            {/* HERO METRIC CARD */}
            {topTopic && (
                <div style={{
                    background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', // Midnight/Indigo
                    borderRadius: '16px',
                    padding: '1.5rem',
                    color: 'white',
                    marginBottom: '2rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.8, marginBottom: '0.5rem' }}>
                            🏆 Tema de Mayor Impacto
                        </p>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '2.5rem', fontWeight: '800', color: '#FCD34D' }}>{topTopic.lights}</span>
                            <span style={{ fontSize: '1rem', fontWeight: '500', opacity: 0.9 }}>reacciones</span>
                        </div>
                        <h4 style={{ fontSize: '1.25rem', fontWeight: '600', lineHeight: 1.3 }}>
                            {topTopic.title}
                        </h4>
                        <p style={{ fontSize: '0.85rem', marginTop: '0.25rem', opacity: 0.7 }}>{topTopic.date}</p>
                    </div>
                    {/* Decorative Blob */}
                    <div style={{
                        position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px',
                        background: '#FCD34D', opacity: 0.15, borderRadius: '50%', blur: '20px'
                    }} />
                </div>
            )}

            {/* CONTROLS */}
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#64748B' }}>Desempeño por Tema</span>
                <select
                    value={sortBy}
                    onChange={handleSortChange}
                    style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: '1px solid #E2E8F0',
                        fontSize: '0.85rem',
                        color: '#475569',
                        outline: 'none'
                    }}
                >
                    <option value="date">Más Recientes</option>
                    <option value="lights_desc">Mayor Impacto</option>
                    <option value="lights_asc">Menor Impacto</option>
                </select>
            </div>

            {/* PERFORMANCE LIST */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {sortedData.map((item, idx) => {
                    // Calc percentage
                    const percentage = Math.round((item.lights / maxLights) * 100);

                    // Determine Color
                    let barColor = '#94A3B8'; // default gray
                    if (percentage >= 80) barColor = '#10B981'; // Emerald 500
                    else if (percentage >= 50) barColor = '#3B82F6'; // Blue 500

                    return (
                        <div key={idx} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px',
                            backgroundColor: '#fff',
                            borderRadius: '12px',
                            border: '1px solid #F1F5F9'
                        }}>
                            {/* Date */}
                            <div style={{ minWidth: '50px', fontSize: '0.75rem', color: '#94A3B8', textAlign: 'right', lineHeight: 1.2 }}>
                                {item.date.split(" ").slice(0, 2).join(" ")} <br />
                                {item.date.split(" ")[2]}
                            </div>

                            {/* Content */}
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                    <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#334155' }}>{item.title}</span>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: barColor }}>{item.lights}</span>
                                </div>

                                {/* Progress Bar Container */}
                                <div style={{ width: '100%', height: '6px', backgroundColor: '#F1F5F9', borderRadius: '10px', overflow: 'hidden' }}>
                                    <div style={{
                                        width: `${percentage}%`,
                                        height: '100%',
                                        backgroundColor: barColor,
                                        borderRadius: '10px',
                                        transition: 'width 0.5s ease'
                                    }} />
                                </div>
                            </div>
                        </div>
                    );
                })}

                {sortedData.length === 0 && (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>
                        No hay datos registrados aún.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
