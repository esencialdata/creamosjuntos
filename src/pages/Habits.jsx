import React from 'react';
import Layout from '../components/Layout';
import HabitCard from '../components/HabitCard';
import { CONFIG } from '../config/data';

const Habits = ({ toggleHabit, isHabitCompletedToday }) => {
    return (
        <Layout>
            <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Hábitos que estamos construyendo</h1>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
                    Estos son los hábitos que hemos ido proponiendo semana a semana. Marca "Completar hoy" cuando realices tu hábito.
                </p>

                <div>
                    {CONFIG.habits.map(habit => (
                        <HabitCard
                            key={habit.id}
                            habit={habit}
                            onToggle={() => toggleHabit(habit.id)}
                            isCompleted={isHabitCompletedToday(habit.id)}
                        />
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default Habits;
