import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import DailyVerse from '../components/DailyVerse';
import WeeklyTheme from '../components/WeeklyTheme';
import WeeklyHabit from '../components/WeeklyHabit';
import SermonList from '../components/SermonList';
import TempleGrowth from '../components/TempleGrowth';
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

                {/* Render ONLY the latest theme for the current week */}
                {(() => {
                    const currentWeekThemes = CONFIG.themes.filter(t => t.weekId === CONFIG.currentWeek);
                    // Show only the last theme (most recent) for this week
                    const latestTheme = currentWeekThemes.length > 0
                        ? currentWeekThemes[currentWeekThemes.length - 1]
                        : CONFIG.themes[0];

                    return <WeeklyTheme key={latestTheme.id} theme={latestTheme} />;
                })()}
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
