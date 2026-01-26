import React from 'react';
import { useBookmarks } from '../hooks/useBookmarks';
import { shareContent } from '../utils/share';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { toggleThemeSave, toggleThemeShare } from '../services/firestoreService';

// Import local styles for swiper
import 'swiper/css';
import 'swiper/css/pagination';
import '../index.css'; // Ensure we have access to global variables if needed
import './WeeklyTheme.css'; // Import specific styles for scrollbars and effects

const WeeklyTheme = ({ theme = {} }) => {
    const { isBookmarked, toggleBookmark } = useBookmarks();

    const handleShare = async () => {
        // Track the share attempt in Firestore
        await toggleThemeShare(theme.title, true);

        const textToShare = `Esta semana en Creamos Juntos estamos trabajando: "${theme.title || 'Identidad'}" - ${theme.description}`;
        await shareContent(theme.title, textToShare, window.location.href);
    };

    // If no slides define, fallback to simple view (safety check)
    if (!theme.slides || !theme.slides.length) return null;

    // Define styles based on theme or defaults
    const styles = {
        bg: theme.themeStyles?.bg || '#F9FAFB',
        textPrimary: theme.themeStyles?.textPrimary || 'var(--color-text-primary)',
        textSecondary: theme.themeStyles?.textSecondary || 'var(--color-text-secondary)',
        accent: theme.themeStyles?.accent || 'var(--color-accent)',
        fontSerif: theme.themeStyles?.fontSerif || 'var(--font-serif)',
        fontSans: theme.themeStyles?.fontSans || 'var(--font-sans)',
        cardBorder: theme.themeStyles?.cardBorder || '1px solid #E5E7EB',
        cardShadow: theme.themeStyles?.cardShadow || '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        backgroundImage: theme.themeStyles?.backgroundImage || 'none',
        backgroundSize: theme.themeStyles?.backgroundSize || 'cover',
    };

    const renderSlideContent = (slide) => {
        switch (slide.type) {
            case 'cover':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between', alignItems: 'center', textAlign: 'center' }}>
                        <div style={{ marginTop: '2rem' }}>
                            <h1 style={{ fontFamily: styles.fontSerif, fontSize: '2.2rem', fontWeight: 700, color: styles.textPrimary, lineHeight: 1.1, marginBottom: '0.5rem' }}>
                                {slide.title}
                            </h1>
                            <p style={{ fontFamily: styles.fontSans, fontSize: '0.9rem', color: styles.textSecondary, textTransform: 'uppercase', letterSpacing: '2px' }}>
                                {slide.subtitle}
                            </p>
                        </div>

                        {/* Video Support */}
                        {slide.videoUrl ? (
                            <div style={{
                                margin: '2rem 0',
                                width: '100%',
                                height: '200px',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}>
                                <video
                                    src={slide.videoUrl}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                        ) : slide.imageUrl ? (
                            <div style={{
                                margin: '2rem 0',
                                width: '100%',
                                height: 'auto',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}>
                                <img
                                    src={slide.imageUrl}
                                    alt={slide.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                />
                            </div>
                        ) : slide.visual && (
                            <div style={{ fontSize: '4rem', margin: '2rem 0' }}>
                                {slide.visual}
                            </div>
                        )}

                        <div style={{ marginBottom: '2rem', maxWidth: '90%' }}>
                            <p style={{ fontFamily: styles.fontSerif, fontSize: '0.9rem', fontStyle: 'italic', color: styles.accent }}>
                                {slide.footerText}
                            </p>
                        </div>
                    </div>
                );

            case 'video': // explicit video card type
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{
                            width: '100%',
                            aspectRatio: '9/16',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                            marginBottom: '1rem'
                        }}>
                            <video
                                src={slide.videoUrl}
                                autoPlay
                                loop
                                muted
                                playsInline
                                controls={slide.controls}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                        {slide.caption && (
                            <p style={{ fontFamily: styles.fontSerif, fontSize: '1rem', color: styles.textPrimary, textAlign: 'center' }}>
                                {slide.caption}
                            </p>
                        )}
                    </div>
                );

            case 'diagnostic':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', textAlign: 'left' }}>
                        <span style={{ fontFamily: styles.fontSans, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: styles.accent, marginBottom: '1rem' }}>
                            {slide.label || 'Diagnóstico'}
                        </span>
                        <h2 style={{ fontFamily: styles.fontSerif, fontSize: '1.6rem', fontWeight: 700, color: styles.textPrimary, marginBottom: '1.5rem', lineHeight: 1.2 }}>
                            {slide.title}
                        </h2>
                        {slide.subtitle && (
                            <p style={{ fontFamily: styles.fontSans, fontSize: '1rem', color: styles.accent, marginBottom: '1.5rem', fontStyle: 'italic' }}>
                                {slide.subtitle}
                            </p>
                        )}
                        {slide.body && (
                            <div style={{ fontFamily: styles.fontSans, fontSize: '0.95rem', lineHeight: 1.6, color: styles.textPrimary, marginBottom: '2rem', whiteSpace: 'pre-line' }}>
                                {slide.body}
                            </div>
                        )}
                        {slide.question && (
                            <p style={{ fontFamily: styles.fontSerif, fontSize: '1.1rem', fontWeight: 600, color: styles.textPrimary, marginBottom: '1rem' }}>
                                {slide.question}
                            </p>
                        )}
                        {slide.options && (
                            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', textAlign: 'left' }}>
                                {slide.options.map((opt, idx) => (
                                    <li key={idx} style={{
                                        marginBottom: '0.8rem',
                                        padding: '0.8rem',
                                        background: 'rgba(0,0,0,0.03)',
                                        borderRadius: '8px',
                                        fontSize: '0.9rem',
                                        color: styles.textPrimary
                                    }}>
                                        {opt}
                                    </li>
                                ))}
                            </ul>
                        )}
                        {slide.citation && (
                            <blockquote style={{ borderLeft: `3px solid ${styles.accent}`, paddingLeft: '1rem', fontStyle: 'italic', fontFamily: styles.fontSerif, color: styles.textSecondary, fontSize: '0.9rem' }}>
                                "{slide.citation}"
                                <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', fontStyle: 'normal', fontWeight: 600 }}>— {slide.reference}</div>
                            </blockquote>
                        )}
                    </div>
                );

            case 'concept':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', textAlign: 'left' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                            <span style={{ background: styles.accent, color: '#fff', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, fontFamily: styles.fontSans }}>
                                {slide.tag}
                            </span>
                            <span style={{ fontFamily: styles.fontSerif, fontSize: '1rem', fontStyle: 'italic', color: styles.textSecondary }}>
                                {slide.subTag}
                            </span>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ fontFamily: styles.fontSans, fontSize: '0.85rem', fontWeight: 700, color: styles.textPrimary, marginBottom: '0.5rem', textTransform: 'uppercase' }}>CONCEPTO</h3>
                            <p style={{ fontFamily: styles.fontSerif, fontSize: '0.95rem', lineHeight: 1.5, color: styles.textPrimary }}>
                                {slide.concept}
                            </p>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ fontFamily: styles.fontSans, fontSize: '0.85rem', fontWeight: 700, color: '#DC2626', marginBottom: '0.5rem', textTransform: 'uppercase' }}>{slide.dangerTitle}</h3>
                            <p style={{ fontFamily: styles.fontSerif, fontSize: '0.95rem', lineHeight: 1.5, color: styles.textPrimary }}>
                                {slide.dangerText}
                            </p>
                        </div>

                        {slide.citation && (
                            <div style={{ borderTop: `1px solid ${styles.accent}40`, paddingTop: '1rem', fontSize: '0.85rem', color: styles.textSecondary, fontFamily: styles.fontSerif, fontStyle: 'italic' }}>
                                "{slide.citation}" — {slide.reference}
                            </div>
                        )}
                    </div>
                );
            case 'action':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', textAlign: 'left' }}>
                        <div>
                            <h2 style={{ fontFamily: styles.fontSerif, fontSize: '1.6rem', fontWeight: 700, color: styles.textPrimary, marginBottom: '0.5rem' }}>
                                {slide.title}
                            </h2>
                            <p style={{ fontFamily: styles.fontSans, fontSize: '0.9rem', color: styles.accent, marginBottom: '2rem' }}>
                                {slide.subtitle}
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {slide.steps.map((step, idx) => {
                                    let label = '';
                                    let text = '';
                                    if (typeof step === 'string') {
                                        const parts = step.split(':');
                                        if (parts.length > 1) {
                                            label = parts[0] + ':';
                                            text = parts.slice(1).join(':').trim();
                                        } else {
                                            text = step;
                                        }
                                    } else {
                                        label = step.label;
                                        text = step.text;
                                    }

                                    return (
                                        <div key={idx} style={{ display: 'flex', gap: '1rem' }}>
                                            <div style={{
                                                background: styles.accent, color: '#fff',
                                                width: '24px', height: '24px', borderRadius: '50%',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '0.8rem', fontWeight: 700, flexShrink: 0
                                            }}>
                                                {idx + 1}
                                            </div>
                                            <div style={{ textAlign: 'left' }}>
                                                {label && <strong style={{ display: 'block', fontFamily: styles.fontSans, fontSize: '0.95rem', color: styles.textPrimary }}>{label}</strong>}
                                                <span style={{ fontFamily: styles.fontSerif, fontSize: '0.9rem', color: styles.textSecondary }}>{text}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {slide.citation && (
                            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                                <blockquote style={{ fontFamily: styles.fontSerif, fontSize: '1rem', fontStyle: 'italic', color: styles.textPrimary, marginBottom: '0.5rem' }}>
                                    "{slide.citation}"
                                </blockquote>
                                <div style={{ fontSize: '0.8rem', color: styles.accent, fontWeight: 600 }}>— {slide.reference}</div>
                            </div>
                        )}

                        {slide.footer && (
                            <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.8rem', color: styles.textSecondary }}>
                                {slide.footer}
                            </div>
                        )}
                    </div>
                );

            // Legacy/Default types
            case 'title':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', justifyContent: 'center', flex: 1 }}>
                        <span style={{ textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.75rem', color: styles.accent, marginBottom: '1rem' }}>
                            {slide.sub}
                        </span>
                        <h2 style={{ fontFamily: styles.fontSans, fontSize: '2rem', fontWeight: '800', color: styles.textPrimary, lineHeight: 1.1 }}>
                            {slide.content}
                        </h2>
                    </div>
                );
            case 'verse':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', justifyContent: 'center', flex: 1 }}>
                        <p style={{ fontFamily: styles.fontSerif, fontSize: '1.35rem', fontStyle: 'italic', color: styles.textPrimary, marginBottom: '1.5rem', lineHeight: 1.6 }}>
                            "{slide.content}"
                        </p>
                        <span style={{ fontSize: '0.9rem', fontWeight: '600', color: styles.textSecondary }}>
                            — {slide.citation}
                        </span>
                    </div>
                );
            case 'challenge':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', justifyContent: 'center', flex: 1 }}>
                        <div style={{ marginBottom: '1rem', fontSize: '2rem' }}>🔥</div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: styles.textPrimary, lineHeight: 1.4 }}>
                            {slide.content}
                        </h3>
                    </div>
                );
            default:
                return null;
        }
    };


    return (
        <section style={{ position: 'relative', marginBottom: 'var(--spacing-md)' }}>
            <Swiper
                modules={[Pagination]}
                spaceBetween={20}
                slidesPerView={1.1} // Show a peek of the next slide
                centeredSlides={true}
                grabCursor={true}
                pagination={{ clickable: true, dynamicBullets: true }}
                style={{
                    paddingBottom: '30px', // Space for pagination dots
                    '--swiper-pagination-color': styles.accent,
                    '--swiper-pagination-bullet-inactive-color': '#9CA3AF',
                    '--swiper-pagination-bullet-inactive-opacity': '0.5',
                }}
            >
                {theme.slides.map((slide, index) => (
                    <SwiperSlide key={index} style={{ height: 'auto' }}>
                        <div className="card weekly-theme-card" style={{
                            // Elegant Fixed Dimensions with Internal Scroll
                            aspectRatio: '3/5', // Slightly taller than 4/5 for modern content
                            maxHeight: '75vh', // Never take up more than 75% of screen height
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '2rem',
                            backgroundColor: styles.bg,
                            border: styles.cardBorder,
                            borderRadius: '16px',
                            boxShadow: styles.cardShadow,
                            position: 'relative',
                            overflow: 'hidden', // Hide overflow of container
                            backgroundImage: styles.backgroundImage,
                            backgroundSize: styles.backgroundSize,
                            backgroundPosition: 'center',
                        }}>
                            {/* Scrollable Content Wrapper */}
                            <div className="card-content-scrollable" style={{
                                flex: 1,
                                overflowY: 'auto',
                                display: 'flex',
                                flexDirection: 'column',
                                // Hide scrollbar but allow functionality
                                scrollbarWidth: 'none', /* Firefox */
                                msOverflowStyle: 'none',  /* IE and Edge */
                                paddingRight: '4px' // Prevent content touching scroll edge
                            }}>
                                {renderSlideContent(slide)}
                            </div>

                            {/* Styling for WebKit scrollbar hiding injected via class or style */}
                            <style>{`
                                .card-content-scrollable::-webkit-scrollbar {
                                    display: none;
                                }
                             `}</style>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Actions Container */}
            <div style={{
                position: 'absolute',
                bottom: '0',
                right: '10px',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                {/* Save Button */}
                <button
                    onClick={() => toggleBookmark({
                        itemID: theme.title,
                        itemType: 'topic',
                        contentPreview: theme.description || theme.title,
                        title: theme.title
                    })}
                    title={isBookmarked(theme.title) ? "Quitar de guardados" : "Guardar tema"}
                    style={{
                        background: isBookmarked(theme.title) ? 'var(--color-primary)' : 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        cursor: 'pointer',
                        color: isBookmarked(theme.title) ? 'white' : 'var(--color-text-secondary)',
                        transition: 'all 0.2s ease'
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={isBookmarked(theme.title) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    </svg>
                </button>

                {/* Share Button */}
                <button
                    onClick={handleShare}
                    title="Compartir tema"
                    style={{
                        background: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        cursor: 'pointer',
                        color: 'var(--color-text-secondary)'
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="18" cy="5" r="3"></circle>
                        <circle cx="6" cy="12" r="3"></circle>
                        <circle cx="18" cy="19" r="3"></circle>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                    </svg>
                </button>
            </div>
        </section>
    );
};

export default WeeklyTheme;
