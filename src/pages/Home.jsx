import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import DailyVerse from '../components/DailyVerse';
import WeeklyTheme from '../components/WeeklyTheme';
import WeeklyHabit from '../components/WeeklyHabit';
import SermonList from '../components/SermonList';
import TempleGrowth from '../components/TempleGrowth';
import AudioCapsuleCard from '../components/AudioCapsuleCard';
import AudioModuleCard from '../components/AudioModuleCard';
import DesignOriginalCard from '../components/DesignOriginalCard';
import EpisodeCard from '../components/EpisodeCard';
import CreationDays from '../components/CreationDays';
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

                {/* <CreationDays /> */}

                {/* --- SECCIÓN "LO ÚLTIMO" --- */}
                <section style={{ marginBottom: 'var(--spacing-md)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'var(--spacing-sm)' }}>
                        <p style={{
                            fontFamily: 'Inter, system-ui, sans-serif',
                            fontSize: '11px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.12em',
                            fontWeight: 400,
                            color: 'var(--color-accent)',
                            margin: 0,
                        }}>
                            Lo Último
                        </p>
                        <span style={{
                            marginLeft: '0.75rem',
                            padding: '2px 8px',
                            backgroundColor: 'rgba(37, 99, 235, 0.1)',
                            color: 'var(--color-primary)',
                            borderRadius: '12px',
                            fontFamily: 'Inter, system-ui, sans-serif',
                            fontSize: '11px',
                            fontWeight: 400,
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
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

                        const now = new Date();
                        let latestDOEpisode = null;
                        for (const mod of (CONFIG.audioModules || [])) {
                            if (!mod.seriesTag) continue;
                            for (const ep of (mod.episodes || [])) {
                                if (!ep.audioUrl) continue;
                                const rd = ep.releaseDate ? new Date(ep.releaseDate + 'T00:00:00') : null;
                                if (!rd || rd <= now) { latestDOEpisode = { episode: ep, module: mod }; break; }
                            }
                            if (latestDOEpisode) break;
                        }

                        return (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                                {latestDOEpisode && (
                                    <EpisodeCard
                                        key={`do-ep-${latestDOEpisode.episode.id}`}
                                        episode={latestDOEpisode.episode}
                                        module={latestDOEpisode.module}
                                    />
                                )}
                                {latestAudio && <AudioCapsuleCard key={`latest-audio-${latestAudio.id}`} capsule={latestAudio} />}
                                <WeeklyTheme key={`latest-theme-${latestTheme.id}`} theme={latestTheme} />
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

                {/* DISEÑO ORIGINAL — entrada al universo de series */}
                {(() => {
                    const now = new Date();
                    const isModuleAvailable = (mod) => {
                        if (!mod.episodes || mod.episodes.length === 0) return false;
                        return mod.episodes.some(ep => {
                            if (!ep.audioUrl) return false;
                            if (!ep.releaseDate) return true;
                            return new Date(ep.releaseDate + 'T00:00:00') <= now;
                        });
                    };
                    const availableModules = (CONFIG.audioModules || []).filter(isModuleAvailable);
                    if (availableModules.length === 0) return null;
                    const coverModule = availableModules.find(m => m.coverImageUrl) || availableModules[0];
                    return (
                        <section style={{ marginBottom: 'var(--spacing-md)' }}>
                            <DesignOriginalCard
                                coverImageUrl={coverModule.coverImageUrl}
                                availableCount={availableModules.length}
                                onClick={() => navigate('/recursos?anchor=audios-tab')}
                            />
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
