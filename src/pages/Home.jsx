import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import DailyVerse from '../components/DailyVerse';
import WeeklyTheme from '../components/WeeklyTheme';
import WeeklyHabit from '../components/WeeklyHabit';
import TempleGrowth from '../components/TempleGrowth';
import { CONFIG } from '../config/data';
import { updateStreak } from '../utils/storage';

const Home = ({ toggleHabit, isHabitCompletedToday, brickCount }) => {
    const [streak, setStreak] = useState(null);

    useEffect(() => {
        const currentStreak = updateStreak();
        setStreak(currentStreak);
    }, []);

    return (
        <Layout>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                <DailyVerse verse={CONFIG.dailyVerse} />
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
