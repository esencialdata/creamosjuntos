import React from 'react';
import { useGlobalPlayer } from '../context/GlobalPlayerContext';

const StickyBottomPlayer = () => {
    const { isVisible, isPlaying, currentTrack, togglePlay, closePlayer, currentTime, duration, seek } = useGlobalPlayer();

    if (!isVisible || !currentTrack) return null;

    // Helper to format time (seconds -> mm:ss)
    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleSeek = (e) => {
        seek(parseFloat(e.target.value));
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: 'var(--bottom-nav-height, 0px)',
            left: 0,
            right: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.96)', // Consistent frosted look
            backdropFilter: 'blur(10px)',
            borderTop: '1px solid rgba(0,0,0,0.1)',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            zIndex: 1000,
            boxShadow: '0 -4px 12px rgba(0,0,0,0.08)'
        }}>
            <button
                onClick={togglePlay}
                style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    cursor: 'pointer',
                    flexShrink: 0
                }}
            >
                {isPlaying ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '2px' }}><path d="M8 5v14l11-7z" /></svg>
                )}
            </button>

            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', position: 'relative', height: '20px', marginBottom: '4px' }}>
                    <div style={{
                        display: 'inline-block',
                        animation: currentTrack.title.length > 25 ? 'marquee 10s linear infinite' : 'none',
                        paddingLeft: currentTrack.title.length > 25 ? '100%' : '0'
                    }}>
                        <span style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>
                            {currentTrack.title}
                        </span>
                    </div>
                </div>

                {/* Progress Bar & Time */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', width: '30px', textAlign: 'right' }}>
                        {formatTime(currentTime)}
                    </span>
                    <input
                        type="range"
                        min="0"
                        max={duration || 100}
                        value={currentTime}
                        onChange={handleSeek}
                        style={{
                            flex: 1,
                            height: '4px',
                            background: `linear-gradient(to right, var(--color-primary) ${(currentTime / duration) * 100}%, #e5e7eb ${(currentTime / duration) * 100}%)`,
                            borderRadius: '2px',
                            appearance: 'none',
                            outline: 'none',
                            cursor: 'pointer'
                        }}
                    />
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', width: '30px' }}>
                        {formatTime(duration)}
                    </span>
                </div>
            </div>

            <button
                onClick={closePlayer}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-text-secondary)',
                    padding: '4px',
                    cursor: 'pointer'
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <style jsx>{`
                input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    height: 12px;
                    width: 12px;
                    border-radius: 50%;
                    background: var(--color-primary);
                    margin-top: -4px; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
                    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
                }
                input[type=range]::-webkit-slider-runnable-track {
                     width: 100%;
                     height: 4px;
                     cursor: pointer;
                }
            `}</style>
        </div>
    );
};

export default StickyBottomPlayer;
