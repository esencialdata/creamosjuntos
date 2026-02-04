import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import DailyVerse from '../components/DailyVerse';
import WeeklyTheme from '../components/WeeklyTheme';
import WeeklyHabit from '../components/WeeklyHabit';
import SermonList from '../components/SermonList';
import TempleGrowth from '../components/TempleGrowth';
import AudioCapsuleCard from '../components/AudioCapsuleCard';
import { CONFIG } from '../config/data';
import { updateStreak } from '../utils/storage';
import { subscribeToSchedule } from '../services/firestoreService';
import { usePWAInstall } from '../hooks/usePWAInstall';

const Home = ({ toggleHabit, isHabitCompletedToday, brickCount }) => {
    const [streak, setStreak] = useState(null);
    const [schedule, setSchedule] = useState([]);
    const { isInstallable, install } = usePWAInstall();

    useEffect(() => {
        const currentStreak = updateStreak();
        setStreak(currentStreak);

        const unsubscribe = subscribeToSchedule((data) => {
            if (data) setSchedule(data);
        });

        // Handle Anchor Scrolling for Shared Links
        const getAnchor = () => {
            const url = new URL(window.location.href);
            const searchParams = new URLSearchParams(url.search);
            if (searchParams.get('anchor')) return searchParams.get('anchor');

            if (url.hash.includes('?')) {
                const parts = url.hash.split('?');
                if (parts[1]) {
                    const hashParams = new URLSearchParams(parts[1]);
                    return hashParams.get('anchor');
                }
            }
            return null;
        };

        const anchor = getAnchor();
        if (anchor) {
            setTimeout(() => {
                const element = document.getElementById(anchor);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });

                    // Highlight effect
                    const originalTransition = element.style.transition;
                    const originalBorderColor = element.style.borderColor;
                    const originalBoxShadow = element.style.boxShadow;

                    element.style.transition = 'all 0.5s ease';
                    element.style.borderColor = 'var(--color-primary)';
                    element.style.boxShadow = '0 0 0 2px var(--color-primary-light, rgba(37, 99, 235, 0.2))';

                    setTimeout(() => {
                        element.style.borderColor = originalBorderColor;
                        element.style.boxShadow = originalBoxShadow;
                        element.style.transition = originalTransition;
                    }, 2000);
                }
            }, 500);
        }

        return () => unsubscribe();
    }, []);

    return (
        <Layout>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                {isInstallable && (
                    <button
                        onClick={install}
                        style={{
                            width: '100%',
                            padding: '0.8rem',
                            backgroundColor: 'var(--color-primary)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            fontSize: '0.9rem'
                        }}
                    >
                        <span>⬇️</span> Instalar App para mejor experiencia
                    </button>
                )}

                <DailyVerse verse={CONFIG.dailyVerse} />

                {/* Render ALL themes for the current week, newest first */}
                {(() => {
                    const currentWeekThemes = CONFIG.themes
                        .filter(t => t.weekId === CONFIG.currentWeek)
                        .reverse(); // Show newest (highest ID) first

                    if (currentWeekThemes.length === 0) {
                        // Fallback to the very first theme if nothing matches
                        return <WeeklyTheme key={CONFIG.themes[0].id} theme={CONFIG.themes[0]} />;
                    }

                    return currentWeekThemes.map(theme => (
                        <WeeklyTheme key={theme.id} theme={theme} />
                    ));
                })()}

                {/* Tu Dosis Semanal Section */}
                {CONFIG.audioCapsules && CONFIG.audioCapsules.length > 0 && (
                    <section>
                        <h3 style={{
                            fontSize: '0.875rem',
                            textTransform: 'uppercase',
                            marginBottom: 'var(--spacing-sm)',
                            color: 'var(--color-accent)'
                        }}>
                            Para escuchar
                        </h3>
                        {CONFIG.audioCapsules.map(capsule => (
                            <AudioCapsuleCard key={capsule.id} capsule={capsule} />
                        ))}
                    </section>
                )}
                <WeeklyHabit
                    habit={CONFIG.weeklyHabit}
                    toggleHabit={toggleHabit}
                    isCompleted={isHabitCompletedToday ? isHabitCompletedToday(CONFIG.weeklyHabit.id) : false}
                />

                {/* New Sermon List Section */}
                <SermonList schedule={schedule} />

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
