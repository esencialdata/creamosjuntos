import React, { useState } from 'react';
import { useGlobalPlayer } from '../context/GlobalPlayerContext';
import { useBookmarks } from '../hooks/useBookmarks';
import { toggleCapsuleLike } from '../services/firestoreService';

// Helper: formats 'YYYY-MM-DD' to 'DD MMM YYYY' in Spanish
const formatReleaseDate = (dateStr) => {
    if (!dateStr) return '';
    const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun',
                    'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const [, month, day] = dateStr.split('-');
    return `${parseInt(day)} ${months[parseInt(month) - 1]}`;
};

const isLocked = (releaseDate) => {
    if (!releaseDate) return false;
    return new Date(releaseDate + 'T00:00:00') > new Date();
};

const AudioCapsuleCard = ({ capsule }) => {
    const { playTrack, currentTrack, isPlaying } = useGlobalPlayer();
    const { isBookmarked, toggleBookmark } = useBookmarks();

    const [saved, setSaved] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const [liked, setLiked] = useState(() => {
        const storedLikes = JSON.parse(localStorage.getItem('audio_likes') || '{}');
        return !!storedLikes[capsule.id];
    });

    React.useEffect(() => {
        setSaved(isBookmarked(`audio-${capsule.id}`));
    }, [isBookmarked, capsule.id]);

    const randomHeights = React.useMemo(() => {
        return [...Array(15)].map(() => Math.max(20, Math.random() * 100));
    }, []);

    const isCurrent = currentTrack?.audioUrl === capsule.audioUrl;
    const isActive = isCurrent && isPlaying;
    const locked = isLocked(capsule.releaseDate);

    const handlePlay = () => {
        if (locked) return;
        playTrack(capsule);
    };

    const handleSave = async (e) => {
        e.stopPropagation();
        const itemToSave = {
            itemID: `audio-${capsule.id}`,
            itemType: 'capsule',
            title: capsule.title,
            contentPreview: capsule.duration,
            ...capsule
        };
        await toggleBookmark(itemToSave);
        setSaved(!saved);
    };

    const handleShare = async (e) => {
        e.stopPropagation();
        const currentHash = window.location.hash.split('?')[0];
        const shareUrl = `${window.location.origin}${window.location.pathname}${currentHash}?anchor=capsule-${capsule.id}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: capsule.title,
                    text: capsule.shareText || `Escucha "${capsule.title}" en Creamos Juntos`,
                    url: shareUrl,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            try {
                await navigator.clipboard.writeText(`${capsule.title} - ${shareUrl}`);
                alert('Enlace copiado al portapapeles');
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        }
    };

    const handleLike = async (e) => {
        e.stopPropagation();
        const newLikedState = !liked;
        setLiked(newLikedState);
        const storedLikes = JSON.parse(localStorage.getItem('audio_likes') || '{}');
        if (newLikedState) {
            storedLikes[capsule.id] = true;
        } else {
            delete storedLikes[capsule.id];
        }
        localStorage.setItem('audio_likes', JSON.stringify(storedLikes));
        await toggleCapsuleLike(capsule.id, newLikedState);
    };

    return (
        <div id={`capsule-${capsule.id}`} style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: 'var(--spacing-md)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            border: '1px solid var(--color-border)',
            opacity: locked ? 0.6 : 1,
            transition: 'opacity 0.2s',
        }}>
            {/* Top row: play + info + actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {/* Play / Lock Button */}
                <button
                    onClick={handlePlay}
                    disabled={locked}
                    style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        backgroundColor: locked ? '#94A3B8' : (capsule.color || 'var(--color-primary)'),
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        cursor: locked ? 'not-allowed' : 'pointer',
                        flexShrink: 0,
                        boxShadow: locked ? 'none' : '0 4px 6px rgba(37, 99, 235, 0.2)',
                    }}
                >
                    {locked ? (
                        // Lock icon
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                            fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                    ) : isActive ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '2px' }}>
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    )}
                </button>

                {/* Center: Info & Waveform */}
                <div style={{ flex: 1, overflow: 'hidden' }}>
                    <h4 style={{
                        margin: 0,
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: 'var(--color-text-primary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}>
                        {capsule.title}
                    </h4>

                    {/* Waveform OR lock label */}
                    {locked ? (
                        <p style={{
                            margin: '4px 0 0 0',
                            fontSize: '0.78rem',
                            color: '#94A3B8',
                            fontWeight: 500,
                        }}>
                            Disponible el {formatReleaseDate(capsule.releaseDate)}
                        </p>
                    ) : (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2px',
                            height: '24px',
                            marginTop: '4px',
                            opacity: 0.6,
                        }}>
                            {randomHeights.map((height, i) => (
                                <div key={i} style={{
                                    width: '3px',
                                    height: `${height}%`,
                                    backgroundColor: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                                    borderRadius: '2px',
                                    animation: isActive ? `wave 1s ease-in-out infinite ${i * 0.1}s` : 'none',
                                }} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Duration & action buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                    <span style={{
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        backgroundColor: 'var(--color-bg)',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        color: 'var(--color-text-secondary)',
                        border: '1px solid var(--color-border)',
                    }}>
                        {capsule.duration}
                    </span>

                    {!locked && (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {/* Share */}
                            <button onClick={handleShare} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--color-text-secondary)' }} title="Compartir">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                                </svg>
                            </button>
                            {/* Like */}
                            <button onClick={handleLike} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: liked ? '#EF4444' : 'var(--color-text-secondary)', transition: 'transform 0.1s' }} title={liked ? 'Ya no me gusta' : 'Me gusta'}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                </svg>
                            </button>
                            {/* Save */}
                            <button onClick={handleSave} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: saved ? '#2563EB' : 'var(--color-text-secondary)' }} title={saved ? 'Quitar de favoritos' : 'Guardar'}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Description (expandable) — only if present and not locked */}
            {capsule.description && !locked && (
                <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
                    <p style={{
                        margin: 0,
                        fontSize: '0.83rem',
                        color: 'var(--color-text-secondary)',
                        lineHeight: 1.55,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: expanded ? 'unset' : 2,
                        transition: 'all 0.3s ease',
                    }}>
                        {capsule.description}
                    </p>
                    <button
                        onClick={() => setExpanded(!expanded)}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px 0 0 0',
                            fontSize: '0.78rem',
                            color: capsule.color || 'var(--color-primary)',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px',
                        }}
                    >
                        {expanded ? 'Ver menos' : 'Ver más'}
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                            style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </button>
                </div>
            )}

            <style>{`
                @keyframes wave {
                    0%, 100% { height: 30%; }
                    50% { height: 100%; }
                }
            `}</style>
        </div>
    );
};

export default AudioCapsuleCard;
