import React, { useState, useEffect } from 'react';
import { shareContent } from '../utils/share';
import { toggleVerseHeart } from '../services/firestoreService';

const DailyVerse = ({ verse }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        // Check localStorage on mount
        const storedLike = localStorage.getItem(`liked_verse_${verse.reference}`);
        if (storedLike === 'true') {
            setIsLiked(true);
        } else {
            setIsLiked(false);
        }
    }, [verse.reference]);

    const handleShare = async () => {
        const textToShare = `"${verse.text}" — ${verse.reference}. Creamos Juntos`;
        await shareContent('Cita del día - Creamos Juntos', textToShare, window.location.href);
    };

    const handleHeart = async () => {
        const newStatus = !isLiked;
        setIsLiked(newStatus);

        // Trigger animation
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 300);

        // Update local storage
        localStorage.setItem(`liked_verse_${verse.reference}`, newStatus);

        // Update Firestore
        await toggleVerseHeart(verse.reference, newStatus);
    };

    return (
        <section style={{ marginBottom: 'var(--spacing-lg)', textAlign: 'center', position: 'relative' }}>
            <h2 style={{
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                color: 'var(--color-accent)',
                marginBottom: 'var(--spacing-sm)'
            }}>
                Cita del día
            </h2>
            <div style={{ maxWidth: '80%', margin: '0 auto', position: 'relative' }}>
                <p style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.5rem',
                    lineHeight: '1.5',
                    color: 'var(--color-text-primary)'
                }}>
                    "{verse.text}"
                </p>
                <div style={{
                    marginTop: 'var(--spacing-sm)',
                    fontStyle: 'italic',
                    color: 'var(--color-text-secondary)',
                    marginBottom: 'var(--spacing-md)'
                }}>
                    — {verse.reference}
                </div>
                <p style={{
                    fontSize: '1rem',
                    color: 'var(--color-text-secondary)',
                    maxWidth: '500px',
                    margin: '0 auto',
                    borderLeft: '2px solid var(--color-border)',
                    paddingLeft: 'var(--spacing-sm)',
                    textAlign: 'left'
                }}>
                    {verse.comment}
                </p>

                {/* Action Buttons Container */}
                <div style={{
                    position: 'absolute',
                    right: '-3rem',
                    bottom: '0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                }}>
                    {/* Heart Button */}
                    <button
                        onClick={handleHeart}
                        title="Me llega al corazón"
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: isLiked ? '#ef4444' : 'var(--color-text-secondary)',
                            fill: isLiked ? '#ef4444' : 'none',
                            padding: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            transform: isAnimating ? 'scale(1.3)' : 'scale(1)'
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>

                    {/* Share Button */}
                    <button
                        onClick={handleShare}
                        title="Compartir"
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--color-text-secondary)',
                            padding: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'color 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text-primary)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="18" cy="5" r="3"></circle>
                            <circle cx="6" cy="12" r="3"></circle>
                            <circle cx="18" cy="19" r="3"></circle>
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default DailyVerse;
