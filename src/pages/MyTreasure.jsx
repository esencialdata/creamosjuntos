import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useBookmarks } from '../hooks/useBookmarks';
import { shareContent } from '../utils/share';

const MyTreasure = () => {
    const { bookmarks, toggleBookmark } = useBookmarks();
    const [activeTab, setActiveTab] = useState('verses');

    // Convert bookmarks object to array
    const allBookmarks = Object.values(bookmarks);

    const verses = allBookmarks.filter(item => item.itemType === 'quote');
    const topics = allBookmarks.filter(item => item.itemType === 'topic');

    const handleShare = async (text) => {
        await shareContent('Tesoro compartido - Creamos Juntos', text, window.location.href);
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
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem' }}>
                Aún no has guardado tesoros.
            </p>
            <p style={{ fontSize: '0.9rem' }}>
                Toca el corazón en los versículos para verlos aquí.
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
            <p style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.1rem',
                lineHeight: '1.6',
                color: 'var(--color-text-primary)',
                marginBottom: '1rem'
            }}>
                "{item.contentPreview}"
            </p>
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
        <div style={{
            background: 'var(--color-bg-secondary)',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
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
                    onClick={() => toggleBookmark(item)}
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
                        Mi Tesoro
                    </h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>Tus citas y temas guardados</p>
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
                            padding: '1rem 2rem',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === 'verses' ? '2px solid var(--color-accent)' : '2px solid transparent',
                            color: activeTab === 'verses' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                            fontFamily: 'var(--font-sans)',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        Versículos
                    </button>
                    <button
                        onClick={() => setActiveTab('topics')}
                        style={{
                            padding: '1rem 2rem',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === 'topics' ? '2px solid var(--color-accent)' : '2px solid transparent',
                            color: activeTab === 'topics' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                            fontFamily: 'var(--font-sans)',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        Temas
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
                </div>
            </div>
        </Layout>
    );
};

export default MyTreasure;
