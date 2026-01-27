import React, { useState, useEffect } from 'react';
import { useBookmarks } from '../hooks/useBookmarks';


const SermonList = ({ schedule }) => {
    const { isBookmarked, toggleBookmark } = useBookmarks();

    const [showToast, setShowToast] = useState(false);

    // Helper to parse dates like "Viernes 05 Dic"
    const parseSpanishDate = (dateStr) => {
        // Normalize: lowercase, remove accents for matching (simplified map)
        const months = {
            'ene': 0, 'feb': 1, 'mar': 2, 'abr': 3, 'may': 4, 'jun': 5,
            'jul': 6, 'ago': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dic': 11
        };

        // Match day and month (first 3 chars) loosely
        const parts = dateStr.toLowerCase().match(/(\d+)\s+([a-z]{3})/);

        if (!parts) {
            // Check for just a number (e.g. "Sábado 06" -> 06)
            const dayParts = dateStr.match(/(\d+)/);
            if (dayParts) {
                console.log("DEBUG: Incomplete date found, assuming December:", dateStr);
                const day = parseInt(dayParts[1], 10);
                const date = new Date(2025, 11, day); // Default to December
                date.setHours(23, 59, 59, 999);
                return date;
            }

            console.warn("Date parse fallback for:", dateStr);
            return new Date(0); // Fallback to epoch (past) so it doesn't trigger "isFuture"
        }

        const day = parseInt(parts[1], 10);
        const monthStr = parts[2]; // e.g., "dic"
        const month = months[monthStr];

        if (month === undefined) {
            console.warn("Month parse failed for:", monthStr);
            return new Date(0); // Fallback to past
        }

        const year = 2026; // Updated for new year
        const date = new Date(year, month, day);
        date.setHours(23, 59, 59, 999);
        return date;
    };

    const getRelevantWeek = (scheduleData) => {
        if (!scheduleData || scheduleData.length === 0) return null;

        const now = new Date();
        const currentMs = now.getTime();
        console.log("DEBUG: Checking current time:", now.toString());

        const upcomingOrCurrentWeek = scheduleData.find((week, index) => {
            const lastEvent = week.events[week.events.length - 1];
            if (!lastEvent) return false;

            const weekEndDate = parseSpanishDate(lastEvent.date);
            const isFuture = weekEndDate.getTime() >= currentMs;

            console.log(`DEBUG: Week ${index + 1} (${lastEvent.date}) ends: ${weekEndDate.toDateString()}. Is Future/Now? ${isFuture}`);
            return isFuture;
        });

        console.log("DEBUG: Selected week:", upcomingOrCurrentWeek ? upcomingOrCurrentWeek.week : "None (Using last)");
        return upcomingOrCurrentWeek || scheduleData[scheduleData.length - 1];
    };

    // Determine the current week dynamically
    console.log("DEBUG: Schedule received:", schedule);
    const currentWeek = getRelevantWeek(schedule);
    console.log("DEBUG: Calculated Current Week:", currentWeek);


    // Filter for "Predicación" events only
    const sermonEvents = currentWeek ? currentWeek.events.filter(event => {
        return event.details && event.details.some(d => d.role === "Predicación");
    }) : [];

    const handleInterestClick = async (event) => {
        const isCurrentlyBookmarked = isBookmarked(event.id);

        // Construct the item to save
        // We need a title for the bookmark.
        const preacherDetail = event.details && event.details.find(d => d.role === "Predicación");
        const preacherText = preacherDetail ? preacherDetail.name : "";
        const titleMatch = preacherText.match(/\(([^)]+)\)/);
        const displayTitle = titleMatch ? titleMatch[1] : (event.theme || "Tema Especial");

        const itemToSave = {
            itemID: event.id,
            itemType: 'event', // New type
            title: displayTitle,
            contentPreview: `${event.date} • ${event.time}`,
            ...event
        };

        await toggleBookmark(itemToSave);

        if (!isCurrentlyBookmarked) {
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }
    };

    if (!sermonEvents.length) return null;

    return (
        <section style={{ marginBottom: 'var(--spacing-md)', position: 'relative' }}>
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
                    const saved = isBookmarked(event.id);

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
                                {(() => {
                                    // Extract specific sermon title from Predicación detail if available
                                    // Format expected: "Name (Sermon Title)"
                                    const preacherDetail = event.details && event.details.find(d => d.role === "Predicación");
                                    const preacherText = preacherDetail ? preacherDetail.name : "";
                                    const titleMatch = preacherText.match(/\(([^)]+)\)/);

                                    // If title found in parens, use it. Otherwise fallback to event theme.
                                    const displayTitle = titleMatch ? titleMatch[1] : (event.theme || "Tema Especial");

                                    return (
                                        <h4 style={{
                                            fontSize: '1rem',
                                            fontWeight: '700',
                                            marginBottom: '0.25rem',
                                            lineHeight: '1.3'
                                        }}>
                                            {displayTitle}
                                        </h4>
                                    );
                                })()}
                                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                                    {event.objective}
                                </p>
                            </div>



                            {/* Interest Button (Heart) */}
                            <button
                                onClick={() => handleInterestClick(event)}
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
                                    backgroundColor: 'transparent',
                                    borderRadius: '50%',
                                    marginBottom: '0.25rem',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    transition: 'all 0.3s ease'
                                }}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill={saved ? "#EF4444" : "none"} // Red-500 if saved
                                        stroke={saved ? "#EF4444" : "#9CA3AF"} // Gray-400 if not
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        style={{ width: '1.75rem', height: '1.75rem' }}
                                    >
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                    </svg>
                                </div>
                                <span style={{
                                    fontSize: '0.75rem',
                                    fontWeight: '700', // Slightly bold
                                    color: saved ? '#EF4444' : '#9CA3AF'
                                }}>
                                    Me interesa
                                </span>
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Toast Notification */}
            <div style={{
                position: 'fixed',
                bottom: showToast ? '24px' : '-100px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(31, 41, 55, 0.95)', // Dark gray background
                color: 'white',
                padding: '12px 24px',
                borderRadius: '99px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                zIndex: 9999,
                transition: 'bottom 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                whiteSpace: 'nowrap',
                fontWeight: '500',
                fontSize: '0.9rem'
            }}>
                <span>❤️</span> Guardado en tus intereses
            </div>
        </section>
    );
};

export default SermonList;
