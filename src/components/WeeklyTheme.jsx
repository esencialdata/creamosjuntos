import React from 'react';
import { shareContent } from '../utils/share';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

// Import local styles for swiper
import 'swiper/css';
import 'swiper/css/pagination';
import '../index.css'; // Ensure we have access to global variables if needed

const WeeklyTheme = ({ theme }) => {
    const handleShare = async () => {
        const textToShare = `Esta semana en Creamos Juntos estamos trabajando: "${theme.title || 'Identidad'}" - ${theme.description}. Únete aquí:`;
        await shareContent('Tema de la semana - Creamos Juntos', textToShare, window.location.href);
    };

    // If no slides define, fallback to simple view (safety check)
    if (!theme.slides || !theme.slides.length) return null;

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
                    '--swiper-pagination-color': 'var(--color-accent)',
                    '--swiper-pagination-bullet-inactive-color': '#9CA3AF',
                    '--swiper-pagination-bullet-inactive-opacity': '0.5',
                }}
            >
                {theme.slides.map((slide, index) => (
                    <SwiperSlide key={index} style={{ height: 'auto' }}>
                        <div className="card" style={{
                            aspectRatio: '4/5',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center',
                            padding: '2rem',
                            backgroundColor: '#F9FAFB', // Paper-like off-white
                            border: '1px solid #E5E7EB',
                            borderRadius: '16px', // Rounded corners like Instagram posts
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            {/* Decorative Elements */}
                            <div style={{
                                position: 'absolute',
                                top: '-20px',
                                right: '-20px',
                                width: '100px',
                                height: '100px',
                                background: 'radial-gradient(circle, rgba(217,119,6,0.05) 0%, rgba(255,255,255,0) 70%)',
                                borderRadius: '50%'
                            }} />

                            {slide.type === 'title' && (
                                <>
                                    <span style={{
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.2em',
                                        fontSize: '0.75rem',
                                        color: 'var(--color-accent)',
                                        marginBottom: '1rem'
                                    }}>
                                        {slide.sub}
                                    </span>
                                    <h2 style={{
                                        fontFamily: 'var(--font-sans)',
                                        fontSize: '2rem',
                                        fontWeight: '800',
                                        color: 'var(--color-text-primary)',
                                        lineHeight: 1.1
                                    }}>
                                        {slide.content}
                                    </h2>
                                </>
                            )}

                            {slide.type === 'verse' && (
                                <>
                                    <p style={{
                                        fontFamily: 'var(--font-serif)',
                                        fontSize: '1.35rem',
                                        fontStyle: 'italic',
                                        color: 'var(--color-text-primary)',
                                        marginBottom: '1.5rem',
                                        lineHeight: 1.6
                                    }}>
                                        "{slide.content}"
                                    </p>
                                    <span style={{
                                        fontSize: '0.9rem',
                                        fontWeight: '600',
                                        color: 'var(--color-text-secondary)'
                                    }}>
                                        — {slide.citation}
                                    </span>
                                </>
                            )}

                            {slide.type === 'challenge' && (
                                <>
                                    <div style={{ marginBottom: '1rem' }}>🔥</div>
                                    <h3 style={{
                                        fontSize: '1.25rem',
                                        fontWeight: '600',
                                        color: 'var(--color-text-primary)',
                                        lineHeight: 1.4
                                    }}>
                                        {slide.content}
                                    </h3>
                                </>
                            )}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Floating Share Button */}
            <button
                onClick={handleShare}
                style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '10px',
                    zIndex: 10,
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
        </section>
    );
};

export default WeeklyTheme;
