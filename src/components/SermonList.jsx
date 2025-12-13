import React, { useState, useEffect } from 'react';
import { toggleLightReaction } from '../services/firestoreService';

const SermonList = ({ schedule }) => {
    // State to track liked sermons (persisted in localStorage)
    const [likedSermons, setLikedSermons] = useState(() => {
        try {
            const stored = localStorage.getItem('likedSermons');
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            return [];
        }
    });

    // Helper to parse dates like "Viernes 05 Dic"
    const parseSpanishDate = (dateStr) => {
        const months = {
            'Ene': 0, 'Feb': 1, 'Mar': 2, 'Abr': 3, 'May': 4, 'Jun': 5,
            'Jul': 6, 'Ago': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dic': 11
        };
        const parts = dateStr.match(/(\d+)\s(\w{3})/);
        if (!parts) return new Date(); // Fallback

        const day = parseInt(parts[1], 10);
        const month = months[parts[2]];
        const year = 2025; // Hardcoded for this schedule's context

        const date = new Date(year, month, day);
        // Set to end of day to include events of that day
        date.setHours(23, 59, 59, 999);
        return date;
    };

    const getRelevantWeek = (scheduleData) => {
        if (!scheduleData || scheduleData.length === 0) return null;

        const now = new Date();

        // Find the first week where the last event hasn't happened yet OR is happening today
        // Actually, we want to show the week UNTIL it's fully over.
        const currentMs = now.getTime();

        const upcomingOrCurrentWeek = scheduleData.find(week => {
            const lastEvent = week.events[week.events.length - 1];
            if (!lastEvent) return false;

            const weekEndDate = parseSpanishDate(lastEvent.date);
            return weekEndDate.getTime() >= currentMs;
        });

        // If found, return it. If not found (all dates passed), return the last week?
        // Or maybe return null to show nothing? Let's return the last week to show *something*.
        return upcomingOrCurrentWeek || scheduleData[scheduleData.length - 1];
    };

    // Determine the current week dynamically
    const currentWeek = getRelevantWeek(schedule);


    // Filter for "Predicación" events only
    const sermonEvents = currentWeek ? currentWeek.events.filter(event => {
        return event.details && event.details.some(d => d.role === "Predicación");
    }) : [];

    const handleLightClick = (weekId, eventId) => {
        const isLiked = likedSermons.includes(eventId);
        const shouldAdd = !isLiked;

        // Optimistic UI Update
        setLikedSermons(prev => {
            let newLiked;
            if (isLiked) {
                newLiked = prev.filter(id => id !== eventId);
            } else {
                newLiked = [...prev, eventId];
            }
            localStorage.setItem('likedSermons', JSON.stringify(newLiked));
            return newLiked;
        });

        // Backend Update
        toggleLightReaction(weekId, eventId, shouldAdd);
    };

    if (!sermonEvents.length) return null;

    return (
        <section style={{ marginBottom: 'var(--spacing-md)' }}>
            <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: 'var(--color-text-primary)'
            }}>
                Mensajes de esta semana
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {sermonEvents.map(event => {
                    // Extract preacher name (removed as per request)
                    // const preacher = event.details.find(d => d.role === "Predicación")?.name || "Invitado";
                    const isLiked = likedSermons.includes(event.id);
                    // Use event.lights from props (real-time from firestore subscription in parent)
                    // If local optimistic update happened, the prop might lag slightly, but usually fast.
                    // For better UX during lag, we could locally modify count, but let's stick to props for simplicity + optimistic "status" color.

                    return (
                        <div key={event.id} className="card" style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '1.25rem',
                            marginBottom: 0, // Reset card margin
                            borderLeft: '4px solid var(--color-accent)'
                        }}>
                            {/* Text Info */}
                            <div style={{ flex: 1, paddingRight: '1rem' }}>
                                <span style={{
                                    fontSize: '0.75rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    color: 'var(--color-text-secondary)',
                                    display: 'block',
                                    marginBottom: '0.25rem'
                                }}>
                                    {event.date} • {event.time}
                                </span>
                                <h4 style={{
                                    fontSize: '1rem',
                                    fontWeight: '700',
                                    marginBottom: '0.25rem',
                                    lineHeight: '1.3'
                                }}>
                                    {event.theme || "Tema Especial"}
                                </h4>
                                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                                    {event.objective}
                                </p>
                            </div>

                            {/* Reaction Button */}
                            <button
                                onClick={() => handleLightClick(currentWeek.id, event.id)}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '0.5rem',
                                    transition: 'transform 0.1s'
                                }}
                            >
                                <div style={{
                                    backgroundColor: isLiked ? '#FFFBEB' : '#F3F4F6', // Amber-50 vs Gray-100
                                    borderRadius: '50%',
                                    padding: '0.75rem',
                                    marginBottom: '0.25rem',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    boxShadow: isLiked ? '0 0 15px rgba(245, 158, 11, 0.4)' : 'none',
                                    transition: 'all 0.3s ease'
                                }}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill={isLiked ? "#F59E0B" : "none"} // Amber-500
                                        stroke={isLiked ? "#F59E0B" : "#9CA3AF"} // Gray-400
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        style={{ width: '1.5rem', height: '1.5rem' }}
                                    >
                                        <path d="M12 2v2"></path>
                                        <path d="M12 20v2"></path>
                                        <path d="M4.93 4.93l1.41 1.41"></path>
                                        <path d="M17.66 17.66l1.41 1.41"></path>
                                        <path d="M2 12h2"></path>
                                        <path d="M20 12h2"></path>
                                        <path d="M6.34 17.66l-1.41 1.41"></path>
                                        <path d="M19.07 4.93l-1.41 1.41"></path>
                                        {/* Bulb Body */}
                                        <path d="M9 16a5 5 0 1 1 6 0a3.5 3.5 0 0 0 -1 3a2 2 0 0 1 -4 0a3.5 3.5 0 0 0 -1 -3"></path>
                                        <path d="M9.7 17h4.6"></path>
                                    </svg>
                                </div>
                                <span style={{
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    color: isLiked ? '#D97706' : '#9CA3AF'
                                }}>
                                    {isLiked ? 'Iluminado' : 'Iluminar'}
                                    {event.lights > 0 && ` (${event.lights})`}
                                </span>
                            </button>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default SermonList;
