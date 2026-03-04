import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();

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

                {/* --- SECCIÓN "LO ÚLTIMO" --- */}
                <section style={{ marginBottom: 'var(--spacing-md)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'var(--spacing-sm)' }}>
                        <h3 style={{
                            fontSize: '0.875rem',
                            textTransform: 'uppercase',
                            color: 'var(--color-accent)',
                            margin: 0
                        }}>
                            Lo Último
                        </h3>
                        <span style={{
                            marginLeft: '0.75rem',
                            padding: '0.2rem 0.5rem',
                            backgroundColor: 'rgba(37, 99, 235, 0.1)',
                            color: 'var(--color-primary)',
                            borderRadius: '12px',
                            fontSize: '0.65rem',
                            fontWeight: 'bold',
                            textTransform: 'uppercase'
                        }}>Nuevos</span>
                    </div>

                    {/* Más reciente: Tema y Audio */}
                    {(() => {
                        const currentWeekThemes = CONFIG.themes
                            .filter(t => t.weekId === CONFIG.currentWeek && (!t.availableFrom || new Date() >= new Date(t.availableFrom)))
                            .reverse();
                        const latestTheme = currentWeekThemes.length > 0 ? currentWeekThemes[0] : CONFIG.themes[0];

                        const hasAudio = CONFIG.audioCapsules && CONFIG.audioCapsules.length > 0;
                        const latestAudio = hasAudio ? CONFIG.audioCapsules[CONFIG.audioCapsules.length - 1] : null;

                        return (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                                <WeeklyTheme key={`latest-theme-${latestTheme.id}`} theme={latestTheme} />
                                {latestAudio && <AudioCapsuleCard key={`latest-audio-${latestAudio.id}`} capsule={latestAudio} />}
                            </div>
                        );
                    })()}
                </section>

                {/* --- TEMAS ANTERIORES DE ESTA SEMANA --- */}
                {(() => {
                    const currentWeekThemes = CONFIG.themes
                        .filter(t => t.weekId === CONFIG.currentWeek && (!t.availableFrom || new Date() >= new Date(t.availableFrom)))
                        .reverse();

                    if (currentWeekThemes.length > 1) {
                        const olderThemes = currentWeekThemes.slice(1);
                        return olderThemes.map(theme => (
                            <div key={`older-theme-${theme.id}`} style={{ marginBottom: 'var(--spacing-md)' }}>
                                <WeeklyTheme theme={theme} />
                            </div>
                        ));
                    }
                    return null;
                })()}

                {/* Tu Dosis Semanal Section (AUDIOS ANTERIORES) */}
                {CONFIG.audioCapsules && CONFIG.audioCapsules.length > 1 && (() => {
                    // Tomamos del penúltimo hacia atrás, máximo 3
                    const previousAudios = [...CONFIG.audioCapsules].reverse().slice(1, 4);
                    return (
                        <section style={{ marginBottom: 'var(--spacing-md)' }}>
                            <h3 style={{
                                fontSize: '0.875rem',
                                textTransform: 'uppercase',
                                marginBottom: 'var(--spacing-sm)',
                                color: 'var(--color-accent)'
                            }}>
                                Escuchar anteriores
                            </h3>
                            {previousAudios.map(capsule => (
                                <AudioCapsuleCard key={`older-audio-${capsule.id}`} capsule={capsule} />
                            ))}
                            {CONFIG.audioCapsules.length > 4 && (
                                <button
                                    onClick={() => navigate('/recursos?anchor=audios-tab')}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        backgroundColor: 'transparent',
                                        color: 'var(--color-primary)',
                                        border: '1px solid var(--color-primary)',
                                        borderRadius: '8px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem',
                                        marginTop: 'var(--spacing-xs)',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    Ver todos los audios →
                                </button>
                            )}
                        </section>
                    );
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
