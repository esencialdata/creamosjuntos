import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useBookmarks } from '../hooks/useBookmarks';
import { shareContent } from '../utils/share';
import WeeklyTheme from '../components/WeeklyTheme';
import AudioCapsuleCard from '../components/AudioCapsuleCard';
import { CONFIG } from '../config/data';

const Favorites = () => {
    const { bookmarks, toggleBookmark } = useBookmarks();
    const [activeTab, setActiveTab] = useState('verses');
    const [selectedTheme, setSelectedTheme] = useState(null);

    // Convert bookmarks object to array
    const allBookmarks = Object.values(bookmarks);

    const verses = allBookmarks.filter(item => item.itemType === 'quote');
    const topics = allBookmarks.filter(item => item.itemType === 'topic');
    const capsules = allBookmarks.filter(item => item.itemType === 'capsule');

    const handleShare = async (text) => {
        await shareContent('Biblioteca personal - Creamos Juntos', text, window.location.href);
    };

    const EmptyState = () => (
        <div style={{
            textAlign: 'center',
            padding: '4rem 1rem',
            color: 'var(--color-text-secondary)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
        }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem' }}>
                Aún no tienes favoritos guardados.
            </p>
            <p style={{ fontSize: '0.9rem' }}>
                Marca "Me interesa" en los eventos o el corazón en versículos para verlos aquí.
            </p>
        </div>
    );

    const VerseCard = ({ item }) => (
        <div style={{
            background: 'var(--color-bg-secondary)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '1rem',
            position: 'relative',
            border: '1px solid var(--color-border)'
        }}>
            <blockquote style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.1rem',
                lineHeight: '1.6',
                color: 'var(--color-text-primary)',
                marginBottom: '1rem',
                fontStyle: 'italic',
                margin: '0 0 1rem 0'
            }}>
                "{item.text || item.contentPreview}"
            </blockquote>
            {item.comment && (
                <div style={{
                    marginBottom: '1rem',
                    fontSize: '0.9rem',
                    color: 'var(--color-text-secondary)',
                    background: 'rgba(0,0,0,0.03)',
                    padding: '0.75rem',
                    borderRadius: '8px'
                }}>
                    💡 {item.comment}
                </div>
            )}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid var(--color-border)',
                paddingTop: '0.75rem'
            }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--color-accent)' }}>
                    {item.reference}
                </span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={() => handleShare(`"${item.contentPreview}" — ${item.reference}`)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)' }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                    </button>
                    <button
                        onClick={() => toggleBookmark(item)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            </div>
        </div>
    );

    const TopicCard = ({ item }) => (
        <div
            onClick={() => {
                const fullTheme = CONFIG.themes.find(t => t.title === item.title) || item;
                setSelectedTheme(fullTheme);
            }}
            style={{
                background: 'var(--color-bg-secondary)',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
            <div style={{ padding: '1.5rem', flex: 1 }}>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-text-secondary)' }}>
                    Tema Semanal
                </span>
                <h3 style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.2rem',
                    color: 'var(--color-text-primary)',
                    marginTop: '0.5rem',
                    marginBottom: '0.5rem'
                }}>
                    {item.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: '1.4' }}>
                    {item.contentPreview}
                </p>
            </div>
            <div style={{
                background: 'rgba(0,0,0,0.03)',
                padding: '0.75rem 1.5rem',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.5rem'
            }}>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(item);
                    }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                    title="Eliminar"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            </div>
        </div>
    );

    return (
        <Layout>
            <div className="my-treasure-page">
                <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '2rem',
                        color: 'var(--color-accent)'
                    }}>
                        Favoritos
                    </h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>Tus recursos y temas favoritos</p>
                </header>

                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '2rem',
                    borderBottom: '1px solid var(--color-border)'
                }}>
                    <button
                        onClick={() => setActiveTab('verses')}
                        style={{
                            padding: '1rem 1.5rem',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === 'verses' ? '2px solid var(--color-accent)' : '2px solid transparent',
                            color: activeTab === 'verses' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                            fontFamily: 'var(--font-sans)',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontSize: '1rem',
                            transition: 'all 0.2s'
                        }}
                    >
                        Versículos
                    </button>
                    <button
                        onClick={() => setActiveTab('topics')}
                        style={{
                            padding: '1rem 1.5rem',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === 'topics' ? '2px solid var(--color-accent)' : '2px solid transparent',
                            color: activeTab === 'topics' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                            fontFamily: 'var(--font-sans)',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontSize: '1rem',
                            transition: 'all 0.2s'
                        }}
                    >
                        Temas
                    </button>
                    <button
                        onClick={() => setActiveTab('audios')}
                        style={{
                            padding: '1rem 1.5rem',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === 'audios' ? '2px solid var(--color-accent)' : '2px solid transparent',
                            color: activeTab === 'audios' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                            fontFamily: 'var(--font-sans)',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontSize: '1rem',
                            transition: 'all 0.2s'
                        }}
                    >
                        Audios
                    </button>
                </div>

                <div className="tab-content">
                    {activeTab === 'verses' && (
                        <div>
                            {verses.length === 0 ? (
                                <EmptyState />
                            ) : (
                                <div>
                                    {verses.map(item => (
                                        <VerseCard key={item.itemID} item={item} />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'topics' && (
                        <div>
                            {topics.length === 0 ? (
                                <EmptyState />
                            ) : (
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                    gap: '1.5rem'
                                }}>
                                    {topics.map(item => (
                                        <TopicCard key={item.itemID} item={item} />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'audios' && (
                        <div>
                            {capsules.length === 0 ? (
                                <EmptyState />
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                                    {capsules.map(item => (
                                        <AudioCapsuleCard key={item.itemID} capsule={item} />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>


            {/* Theme Modal/Overlay */}
            {selectedTheme && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.85)',
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 'var(--spacing-md)',
                    overflowY: 'auto'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--spacing-md)' }}>
                        <button
                            onClick={() => setSelectedTheme(null)}
                            style={{
                                background: 'var(--color-surface)',
                                border: 'none',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            ×
                        </button>
                    </div>
                    <WeeklyTheme theme={selectedTheme} />
                </div>
            )}
        </Layout>
    );
};

export default Favorites;
