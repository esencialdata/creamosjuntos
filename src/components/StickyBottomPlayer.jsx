import React from 'react';
import { useGlobalPlayer } from '../context/GlobalPlayerContext';

const StickyBottomPlayer = () => {
    const { currentTrack, isPlaying, isVisible, togglePlay, closePlayer } = useGlobalPlayer();

    if (!isVisible || !currentTrack) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: 'var(--bottom-nav-height, 0px)', // Configurable offset
            left: 0,
            right: 0,
            height: '60px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderTop: '1px solid var(--color-border)',
            boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 1rem',
            zIndex: 1000,
            transition: 'bottom 0.3s ease'
        }}>
            {/* Play/Pause Button */}
            <button
                onClick={togglePlay}
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px',
                    marginRight: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-primary)'
                }}
            >
                {isPlaying ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                )}
            </button>

            {/* Scrolling Text Container */}
            <div style={{
                flex: 1,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                position: 'relative',
                maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
            }}>
                <div style={{
                    display: 'inline-block',
                    animation: 'marquee 15s linear infinite',
                    paddingLeft: '100%', // Start off-screen
                    color: 'var(--color-text-primary)',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                }}>
                    {currentTrack.title || "Unknown Title"}
                </div>
            </div>

            {/* Close Button */}
            <button
                onClick={closePlayer}
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px',
                    marginLeft: '8px',
                    color: 'var(--color-text-secondary)'
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
    );
};

export default StickyBottomPlayer;
