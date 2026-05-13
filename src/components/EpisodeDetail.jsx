import React, { useState, useRef } from 'react';
import { useGlobalPlayer } from '../context/GlobalPlayerContext';
import { toggleCapsuleLike } from '../services/firestoreService';
import { buildShareUrl } from '../utils/share';

const fmt = (s) => {
    if (!s || isNaN(s)) return '0:00';
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
};

const getEpisodeState = (ep) => {
    if (!ep.audioUrl) return 'coming_soon';
    if (!ep.releaseDate) return 'available';
    return new Date(ep.releaseDate + 'T00:00:00') <= new Date() ? 'available' : 'coming_soon';
};

const EpisodeDetail = ({ episode, module, onBack, onSelectEpisode }) => {
    const { playTrack, togglePlay, currentTrack, isPlaying, currentTime, duration, seek } = useGlobalPlayer();
    const [liked, setLiked] = useState(() => {
        const stored = JSON.parse(localStorage.getItem('do_episode_likes') || '{}');
        return !!stored[episode.id];
    });
    const progressRef = useRef(null);

    const accent = '#1D6EE8';
    const isCurrent = currentTrack?.audioUrl === episode.audioUrl;
    const isActive = isCurrent && isPlaying;
    const progress = isCurrent && duration ? (currentTime / duration) * 100 : 0;
    const displayTime = isCurrent ? currentTime : 0;
    const displayDuration = isCurrent ? duration : 0;

    const label = [
        module.seriesTag || 'DISEÑO ORIGINAL',
        module.eje?.toUpperCase(),
        `EP. ${episode.numero || 1}`,
    ].filter(Boolean).join(' · ');

    const displayTitle = episode.title?.replace(/^\d+\.\s*/, '') || episode.title;

    const handlePlay = () => {
        if (isCurrent) togglePlay();
        else playTrack(episode);
    };

    const handleSeek = (e) => {
        if (!progressRef.current || !duration) return;
        const rect = progressRef.current.getBoundingClientRect();
        seek(((e.clientX - rect.left) / rect.width) * duration);
    };

    const handleLike = async () => {
        const newLiked = !liked;
        setLiked(newLiked);
        const stored = JSON.parse(localStorage.getItem('do_episode_likes') || '{}');
        if (newLiked) stored[episode.id] = true;
        else delete stored[episode.id];
        localStorage.setItem('do_episode_likes', JSON.stringify(stored));
        await toggleCapsuleLike(episode.id, newLiked);
    };

    const handleShare = async () => {
        const url = buildShareUrl(`do-ep-${episode.id}`, {
            title: episode.title,
            desc: episode.descripcionCorta || '',
            image: episode.portadaUrl || null,
        });
        if (navigator.share) {
            try { await navigator.share({ title: episode.title, text: episode.descripcionCorta, url }); }
            catch (err) { if (err.name !== 'AbortError') console.error(err); }
        } else {
            await navigator.clipboard.writeText(`${episode.title} — ${url}`);
        }
    };

    return (
        <div style={{ background: '#F7F8FC' }}>
            {/* Back */}
            <button
                onClick={onBack}
                style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#6B7280', fontSize: '0.88rem',
                    padding: '0 0 20px 0',
                    fontFamily: 'Inter, system-ui, sans-serif',
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                </svg>
                Atrás
            </button>

            {/* Series label */}
            <p style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '11px', textTransform: 'uppercase',
                letterSpacing: '0.14em', fontWeight: 400,
                color: accent, margin: '0 0 10px 0',
            }}>
                {label}
            </p>

            {/* Title */}
            <h1 style={{
                fontFamily: 'Georgia, serif',
                fontSize: '22px', fontWeight: 400,
                color: '#111111', lineHeight: 1.3,
                letterSpacing: '-0.02em',
                margin: '0 0 20px 0',
            }}>
                {displayTitle}
            </h1>

            <hr style={{ border: 'none', borderTop: '1px solid #E6E4DD', margin: '0 0 20px 0' }} />

            {/* Texto base */}
            {episode.textoBase && (
                <>
                    <p style={{
                        fontFamily: 'Georgia, serif',
                        fontSize: '14px', fontStyle: 'italic',
                        color: '#6B7280', lineHeight: 1.7,
                        margin: '0 0 6px 0',
                    }}>
                        "{episode.textoBase.cita}"
                    </p>
                    <p style={{
                        fontFamily: 'Inter, system-ui, sans-serif',
                        fontSize: '12px', color: '#9CA3AF',
                        margin: '0 0 20px 0', letterSpacing: '0.04em',
                    }}>
                        — {episode.textoBase.referencia}
                    </p>
                    <hr style={{ border: 'none', borderTop: '1px solid #E6E4DD', margin: '0 0 20px 0' }} />
                </>
            )}

            {/* Player */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                <button
                    onClick={handlePlay}
                    style={{
                        width: '44px', height: '44px', borderRadius: '50%',
                        background: '#111111', border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, color: 'white',
                    }}
                >
                    {isActive ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '2px' }}>
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    )}
                </button>

                <div style={{ flex: 1 }}>
                    <div
                        ref={progressRef}
                        onClick={handleSeek}
                        style={{
                            height: '2px', background: '#E6E4DD',
                            borderRadius: '1px', cursor: 'pointer',
                            position: 'relative', marginBottom: '6px',
                        }}
                    >
                        <div style={{
                            position: 'absolute', top: 0, left: 0,
                            height: '100%', width: `${progress}%`,
                            background: accent, borderRadius: '1px',
                            transition: 'width 0.1s linear',
                        }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '11px', color: '#9CA3AF' }}>
                            {fmt(displayTime)}
                        </span>
                        <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '11px', color: '#9CA3AF' }}>
                            -{fmt(displayDuration > 0 ? displayDuration - displayTime : 0)}
                        </span>
                    </div>
                </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #E6E4DD', margin: '0 0 20px 0' }} />

            {/* Long description */}
            {episode.descripcionLarga && (
                <>
                    <p style={{
                        fontFamily: 'Inter, system-ui, sans-serif',
                        fontSize: '15px', color: '#374151',
                        lineHeight: 1.7, margin: '0 0 20px 0',
                    }}>
                        {episode.descripcionLarga}
                    </p>
                    <hr style={{ border: 'none', borderTop: '1px solid #E6E4DD', margin: '0 0 20px 0' }} />
                </>
            )}

            {/* Continúa la serie */}
            <div style={{ marginBottom: '24px' }}>
                <p style={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '11px', textTransform: 'uppercase',
                    letterSpacing: '0.12em', color: '#9CA3AF',
                    margin: '0 0 12px 0', fontWeight: 400,
                }}>
                    Continúa la serie
                </p>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {(module.episodes || []).map((ep) => {
                        const state = getEpisodeState(ep);
                        const isCurrentEp = ep.id === episode.id;
                        return (
                            <div
                                key={ep.id}
                                onClick={() => state === 'available' && !isCurrentEp && onSelectEpisode?.(ep)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '12px',
                                    padding: '12px 0',
                                    borderBottom: '1px solid #F3F4F6',
                                    cursor: state === 'available' && !isCurrentEp ? 'pointer' : 'default',
                                    opacity: state === 'coming_soon' ? 0.45 : 1,
                                }}
                            >
                                <span style={{
                                    fontFamily: 'Inter, system-ui, sans-serif',
                                    fontSize: '12px',
                                    color: isCurrentEp ? accent : '#9CA3AF',
                                    fontWeight: isCurrentEp ? 600 : 400,
                                    width: '18px', flexShrink: 0, textAlign: 'right',
                                }}>
                                    {ep.numero}
                                </span>
                                <p style={{
                                    fontFamily: 'Inter, system-ui, sans-serif',
                                    fontSize: '14px',
                                    color: isCurrentEp ? accent : '#374151',
                                    fontWeight: isCurrentEp ? 600 : 400,
                                    margin: 0, lineHeight: 1.4, flex: 1,
                                }}>
                                    {ep.title?.replace(/^\d+\.\s*/, '') || ep.title}
                                </p>
                                <span style={{
                                    fontFamily: 'Inter, system-ui, sans-serif',
                                    fontSize: '12px', color: '#9CA3AF', flexShrink: 0,
                                }}>
                                    {state === 'available' ? ep.duration : 'Próximamente'}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingBottom: '32px' }}>
                <button
                    onClick={handleLike}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: liked ? '#EF4444' : '#D1D5DB' }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                        fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                </button>
                <button
                    onClick={handleShare}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: '#D1D5DB' }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default EpisodeDetail;
