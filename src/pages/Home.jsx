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

const Home = ({ toggleHabit, isHabitCompletedToday, brickCount }) => {
    const [streak, setStreak] = useState(null);

    const [schedule, setSchedule] = useState([]);

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
                <DailyVerse verse={CONFIG.dailyVerse} />

                <WeeklyTheme theme={CONFIG.themes.find(t => t.id === CONFIG.currentWeek) || CONFIG.themes[0]} />
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
