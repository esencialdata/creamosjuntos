import React, { useState } from 'react';
import { useGlobalPlayer } from '../context/GlobalPlayerContext';
import { useBookmarks } from '../hooks/useBookmarks';

const AudioCapsuleCard = ({ capsule }) => {
    const { playTrack, currentTrack, isPlaying } = useGlobalPlayer();
    const { isBookmarked, toggleBookmark } = useBookmarks();
    const [saved, setSaved] = useState(isBookmarked(capsule.id));

    const isCurrent = currentTrack?.audioUrl === capsule.audioUrl;
    const isActive = isCurrent && isPlaying;

    const handlePlay = () => {
        playTrack(capsule);
    };

    const handleSave = async (e) => {
        e.stopPropagation();
        const itemToSave = {
            itemID: capsule.id,
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
        if (navigator.share) {
            try {
                await navigator.share({
                    title: capsule.title,
                    text: `Escucha "${capsule.title}" en Creamos Juntos`,
                    url: window.location.href, // Or deep link if available
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            // Fallback: Copy to clipboard
            try {
                await navigator.clipboard.writeText(`${capsule.title} - ${window.location.href}`);
                alert('Enlace copiado al portapapeles');
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        }
    };

    return (
        <div style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: 'var(--spacing-md)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
        }}>
            {/* Left: Play Button */}
            <button
                onClick={handlePlay}
                style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: capsule.color || 'var(--color-primary)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    cursor: 'pointer',
                    flexShrink: 0,
                    boxShadow: '0 4px 6px rgba(37, 99, 235, 0.2)'
                }}
            >
                {isActive ? (
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
                    textOverflow: 'ellipsis'
                }}>
                    {capsule.title}
                </h4>

                {/* Decorative Waveform */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                    height: '24px',
                    marginTop: '4px',
                    opacity: 0.6
                }}>
                    {[...Array(15)].map((_, i) => (
                        <div key={i} style={{
                            width: '3px',
                            height: `${Math.max(20, Math.random() * 100)}%`, // Random height 20-100%
                            backgroundColor: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                            borderRadius: '2px',
                            animation: isActive ? `wave 1s ease-in-out infinite ${i * 0.1}s` : 'none'
                        }} />
                    ))}
                </div>
            </div>

            {/* Right: Duration, Share, & Action */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                <span style={{
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    backgroundColor: 'var(--color-bg)',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    color: 'var(--color-text-secondary)',
                    border: '1px solid var(--color-border)'
                }}>
                    {capsule.duration}
                </span>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {/* Share Button */}
                    <button
                        onClick={handleShare}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            color: 'var(--color-text-secondary)'
                        }}
                        title="Compartir"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="18" cy="5" r="3"></circle>
                            <circle cx="6" cy="12" r="3"></circle>
                            <circle cx="18" cy="19" r="3"></circle>
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                        </svg>
                    </button>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            color: saved ? '#EF4444' : 'var(--color-border)' // Red or Gray
                        }}
                        title={saved ? "Quitar de favoritos" : "Guardar"}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill={saved ? "currentColor" : "none"}
                            stroke={saved ? "currentColor" : "currentColor"}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ width: '20px', height: '20px', color: saved ? '#EF4444' : '#9CA3AF' }}
                        >
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <style>
                {`
                @keyframes wave {
                    0%, 100% { height: 30%; }
                    50% { height: 100%; }
                }
                `}
            </style>
        </div>
    );
};

export default AudioCapsuleCard;
