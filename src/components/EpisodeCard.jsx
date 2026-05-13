import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalPlayer } from '../context/GlobalPlayerContext';
import { toggleCapsuleLike } from '../services/firestoreService';
import { buildShareUrl } from '../utils/share';

const EpisodeCard = ({ episode, module }) => {
    const navigate = useNavigate();
    const { playTrack, togglePlay, currentTrack, isPlaying } = useGlobalPlayer();
    const [liked, setLiked] = useState(() => {
        const stored = JSON.parse(localStorage.getItem('do_episode_likes') || '{}');
        return !!stored[episode.id];
    });

    const isCurrent = currentTrack?.audioUrl === episode.audioUrl;

    const label = [
        module.seriesTag || 'DISEÑO ORIGINAL',
        module.eje?.toUpperCase(),
        `EP. ${episode.numero || 1}`,
    ].filter(Boolean).join(' · ');

    const displayTitle = episode.title?.replace(/^\d+\.\s*/, '') || episode.title;

    const handleClick = () => {
        if (!episode.audioUrl) return;
        if (isCurrent) togglePlay();
        else playTrack(episode);
    };

    const handleLike = async (e) => {
        e.stopPropagation();
        const newLiked = !liked;
        setLiked(newLiked);
        const stored = JSON.parse(localStorage.getItem('do_episode_likes') || '{}');
        if (newLiked) stored[episode.id] = true;
        else delete stored[episode.id];
        localStorage.setItem('do_episode_likes', JSON.stringify(stored));
        await toggleCapsuleLike(episode.id, newLiked);
    };

    const handleShare = async (e) => {
        e.stopPropagation();
        const url = buildShareUrl(null, {
            title: episode.title,
            desc: episode.descripcionCorta || '',
            image: episode.shareImageUrl || episode.portadaUrl || null,
            openEpisode: episode.id,
        });
        if (navigator.share) {
            try { await navigator.share({ title: episode.title, text: episode.descripcionCorta, url }); }
            catch (err) { if (err.name !== 'AbortError') console.error(err); }
        } else {
            await navigator.clipboard.writeText(`${episode.title} — ${url}`);
        }
    };

    return (
        <div
            onClick={handleClick}
            style={{
                background: '#F9F6F1',
                border: '1px solid #E8E0D4',
                borderRadius: '16px',
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: 'rgba(44, 34, 24, 0.1) 0px 8px 32px -4px',
                transition: 'box-shadow 0.15s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = 'rgba(44, 34, 24, 0.18) 0px 12px 40px -4px'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'rgba(44, 34, 24, 0.1) 0px 8px 32px -4px'}
        >
            {/* Cover 16:9 */}
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
                {episode.portadaUrl ? (
                    <img
                        src={episode.portadaUrl}
                        alt={episode.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                ) : (
                    /* Portada editorial contemplativa — gradiente tierra/barro */
                    <div style={{
                        width: '100%', height: '100%',
                        background: 'linear-gradient(160deg, #1c1208 0%, #4a2e10 30%, #8a5c28 55%, #c4904a 80%, #e8d0a0 100%)',
                    }}>
                        {/* Numeral fantasma decorativo */}
                        <span aria-hidden="true" style={{
                            position: 'absolute',
                            bottom: '-16px', right: '10px',
                            fontFamily: 'Lora, Georgia, serif',
                            fontSize: '120px', lineHeight: 1,
                            fontWeight: 400,
                            color: 'rgba(255, 255, 255, 0.07)',
                            letterSpacing: '-0.06em',
                            userSelect: 'none', pointerEvents: 'none',
                        }}>
                            {episode.numero || 1}
                        </span>
                        {/* Eyebrow micro-serie */}
                        <p style={{
                            position: 'absolute',
                            top: '14px', left: '16px',
                            fontFamily: 'Inter, system-ui, sans-serif',
                            fontSize: '10px', textTransform: 'uppercase',
                            letterSpacing: '0.12em', fontWeight: 400,
                            color: 'rgba(255,255,255,0.5)',
                            margin: 0,
                        }}>
                            {module.microSeries || 'La Fisiología de la Santidad'}
                        </p>
                        {/* Divisor acento */}
                        <div style={{
                            position: 'absolute',
                            bottom: '44px', left: '16px',
                            width: '2rem', height: '1px',
                            background: 'rgba(201, 148, 74, 0.8)',
                        }} />
                        {/* Título en portada */}
                        <p style={{
                            position: 'absolute',
                            bottom: '14px', left: '16px', right: '60px',
                            fontFamily: 'Lora, Georgia, serif',
                            fontSize: '15px', fontWeight: 400,
                            color: 'rgba(255,255,255,0.92)',
                            lineHeight: 1.4, letterSpacing: '-0.02em',
                            margin: 0,
                        }}>
                            {displayTitle}
                        </p>
                    </div>
                )}

                {/* Play button — esquina inferior izquierda */}
                <div style={{
                    position: 'absolute',
                    bottom: episode.portadaUrl ? '12px' : '12px',
                    right: '14px',
                    width: '40px', height: '40px',
                    borderRadius: '50%',
                    background: isCurrent && isPlaying
                        ? 'rgba(255,255,255,1)'
                        : 'rgba(255,255,255,0.92)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.35)',
                    transition: 'transform 0.15s ease',
                    flexShrink: 0,
                }}>
                    {isCurrent && isPlaying ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#2C2218">
                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#2C2218" style={{ marginLeft: '2px' }}>
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    )}
                </div>
            </div>

            {/* Body */}
            <div style={{ padding: '16px' }}>
                {/* Series label */}
                <p style={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '11px', textTransform: 'uppercase',
                    letterSpacing: '0.12em', fontWeight: 400,
                    color: '#1D6EE8', margin: '0 0 8px 0',
                }}>
                    {label}
                </p>

                {/* Title */}
                <p style={{
                    fontFamily: 'Georgia, serif',
                    fontSize: '19px', fontWeight: 400,
                    color: '#111111', lineHeight: 1.35,
                    letterSpacing: '-0.02em', margin: '0 0 8px 0',
                }}>
                    {displayTitle}
                </p>

                {/* Short description */}
                {episode.descripcionCorta && (
                    <p style={{
                        fontFamily: 'Inter, system-ui, sans-serif',
                        fontSize: '14px', color: '#6B7280',
                        lineHeight: 1.55, margin: '0 0 14px 0',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }}>
                        {episode.descripcionCorta}
                    </p>
                )}

                {/* Duration row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <div style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: isCurrent && isPlaying ? '#1D6EE8' : 'transparent',
                        border: isCurrent && isPlaying ? 'none' : '1.5px solid #D1D5DB',
                        flexShrink: 0,
                        transition: 'all 0.2s ease',
                    }} />
                    <div style={{ flex: 1, height: '1px', background: '#E6E4DD' }} />
                    <span style={{
                        fontFamily: 'Inter, system-ui, sans-serif',
                        fontSize: '12px', color: '#9CA3AF', flexShrink: 0,
                    }}>
                        {episode.duration}
                    </span>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate('/recursos', { state: { openEpisode: episode.id } });
                        }}
                        style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            padding: '4px', marginRight: 'auto',
                            display: 'flex', alignItems: 'center', gap: '4px',
                            fontFamily: 'Inter, system-ui, sans-serif',
                            fontSize: '11px', color: '#9CA3AF',
                            letterSpacing: '0.06em',
                        }}
                    >
                        Ver más
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" strokeWidth="2.5"
                            strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                    <button
                        onClick={handleLike}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: liked ? '#EF4444' : '#D1D5DB' }}
                        title={liked ? 'Ya no me gusta' : 'Me gusta'}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                            fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                    </button>
                    <button
                        onClick={handleShare}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#D1D5DB' }}
                        title="Compartir"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EpisodeCard;
