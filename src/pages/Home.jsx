import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import DailyVerse from '../components/DailyVerse';
import WeeklyTheme from '../components/WeeklyTheme';
import WeeklyHabit from '../components/WeeklyHabit';
import TempleGrowth from '../components/TempleGrowth';
import { CONFIG } from '../config/data';
import { updateStreak } from '../utils/storage';
import { subscribeToSchedule, toggleReaction } from '../services/firestoreService';

const Home = ({ toggleHabit, isHabitCompletedToday, brickCount }) => {
    const [streak, setStreak] = useState(null);
    const [schedule, setSchedule] = useState([]);
    const [likedEvents, setLikedEvents] = useState(() => {
        return JSON.parse(localStorage.getItem('likedEvents') || '[]');
    });

    useEffect(() => {
        const currentStreak = updateStreak();
        setStreak(currentStreak);

        const unsubscribe = subscribeToSchedule((data) => {
            if (data) setSchedule(data);
        });
        return () => unsubscribe();
    }, []);

    const handleLightClick = (weekId, eventId) => {
        // Optimistic update for local UI state
        setLikedEvents(prev => {
            const isLiked = prev.includes(eventId);
            let newLiked;
            if (isLiked) {
                newLiked = prev.filter(id => id !== eventId);
            } else {
                newLiked = [...prev, eventId];
            }
            localStorage.setItem('likedEvents', JSON.stringify(newLiked));
            return newLiked;
        });

        // Trigger backend update
        toggleReaction(weekId, eventId);
    };

    // Filter for current week's messages (events with a theme)
    // Assuming CONFIG.currentWeek can match the schedule week, but generic matching by ID or finding current week logic might be needed.
    // For now, let's take the first week found or all applicable events that have a Theme.
    // Actually, `CONFIG.currentWeek` is just a string/number? Using first week from schedule for demo if needed, or mapping.
    // Let's grab events from the first active week or flatten all events that have a theme.
    // Better: Allow seeing messages from the latest week available in schedule.
    const currentScheduleWeek = schedule[0]; // simplistic for now, or match ID/Date
    const messageEvents = currentScheduleWeek ? currentScheduleWeek.events.filter(e => e.theme) : [];

    return (
        <Layout>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                <DailyVerse verse={CONFIG.dailyVerse} />

                {/* Mensajes de la Semana Section */}
                {messageEvents.length > 0 && (
                    <section style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', color: '#111827', borderLeft: '4px solid #0052CC', paddingLeft: '0.75rem' }}>
                            Mensajes de la Semana
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {messageEvents.map(event => {
                                const isLiked = likedEvents.includes(event.id);
                                return (
                                    <div key={event.id} style={{ border: '1px solid #f3f4f6', borderRadius: '8px', padding: '1rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                            <span style={{ fontSize: '0.85rem', color: '#6B7280', fontWeight: '600', backgroundColor: '#F3F4F6', padding: '2px 8px', borderRadius: '4px' }}>
                                                {event.date} • {event.time}
                                            </span>
                                        </div>
                                        <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#1F2937', marginBottom: '0.25rem' }}>
                                            {event.theme}
                                        </h4>
                                        <p style={{ fontSize: '0.9rem', color: '#4B5563', marginBottom: '1rem' }}>
                                            {event.objective}
                                        </p>

                                        {/* Light Reaction Button */}
                                        <button
                                            onClick={() => handleLightClick(currentScheduleWeek.id, event.id)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                padding: '0.5rem',
                                                borderRadius: '20px',
                                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                                backgroundColor: isLiked ? '#FEF3C7' : '#F9FAFB', // Yellow-100 : Gray-50
                                                color: isLiked ? '#D97706' : '#6B7280', // Yellow-600 : Gray-500
                                                transform: isLiked ? 'scale(1.02)' : 'scale(1)'
                                            }}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill={isLiked ? "currentColor" : "none"}
                                                viewBox="0 0 24 24"
                                                strokeWidth="1.5"
                                                stroke="currentColor"
                                                style={{ width: '1.25rem', height: '1.25rem', transition: 'transform 0.2s' }}
                                                className={isLiked ? "scale-110" : ""}
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a12.06 12.06 0 01-3 0m3 0a12.06 12.06 0 00-3 0m-3.75-9.838a4.836 4.836 0 01-.19-.516c-.443-1.427-.443-2.97 0-4.397A6.002 6.002 0 0112 3c1.72 0 3.297.712 4.397 1.947a6.002 6.002 0 011.196 4.912c-.22.863-.563 1.68-1.002 2.417" />
                                            </svg>
                                            <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                                                {isLiked ? 'Iluminado' : 'Iluminar'}
                                            </span>
                                            {event.lights > 0 && (
                                                <span style={{ fontSize: '0.85rem', fontWeight: 'normal', marginLeft: '0.25rem' }}>
                                                    {event.lights}
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                <WeeklyTheme theme={CONFIG.weeklyTheme} />
                <WeeklyHabit
                    habit={CONFIG.weeklyHabit}
                    toggleHabit={toggleHabit}
                    isCompleted={isHabitCompletedToday ? isHabitCompletedToday(CONFIG.habits.find(h => h.name === CONFIG.weeklyHabit.name)?.id || 0) : false}
                />
                <TempleGrowth
                    habitCount={CONFIG.habits.length}
                    currentWeek={CONFIG.currentWeek}
                    streak={streak}
                    brickCount={brickCount}
                />
            </div>
        </Layout>
    );
};

export default Home;
