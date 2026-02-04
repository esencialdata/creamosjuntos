import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import WeeklyTheme from '../components/WeeklyTheme';
import { CONFIG, VERSES_POOL } from '../config/data';
import { CITAS_HISTORIAL } from '../resources/citas_biblicas';
import { shareContent } from '../utils/share';
import { useBookmarks } from '../hooks/useBookmarks';

const Library = () => {
    const [activeTab, setActiveTab] = useState('themes');
    const [selectedTheme, setSelectedTheme] = useState(null);
    const { toggleBookmark, isBookmarked } = useBookmarks();

    useEffect(() => {
        const getAnchor = () => {
            const url = new URL(window.location.href);
            const searchParams = new URLSearchParams(url.search);
            if (searchParams.get('anchor')) return searchParams.get('anchor');

            // Check hash part if using HashRouter or combined
            if (url.hash.includes('?')) {
                const parts = url.hash.split('?');
                if (parts[1]) {
                    const hashParams = new URLSearchParams(parts[1]);
                    return hashParams.get('anchor');
                }
            }
            return null;
        };

        const anchor = getAnchor();
        if (anchor) {
            setActiveTab('verses');
            setTimeout(() => {
                const element = document.getElementById(anchor);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Optional highlight effect
                    const originalTransition = element.style.transition;
                    const originalBg = element.style.backgroundColor;

                    element.style.transition = 'background-color 0.5s ease';
                    element.style.backgroundColor = 'var(--color-primary-light, rgba(37, 99, 235, 0.1))';

                    setTimeout(() => {
                        element.style.backgroundColor = originalBg;
                        element.style.transition = originalTransition;
                    }, 2000);
                }
            }, 500);
        }
    }, []);

    // Filter verses to only show those released up to today
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    // Subtract 1 because array is 0-indexed (Jan 1st = Index 0)
    // Use Math.max to ensure we don't slice with a negative number if something is off
    const currentIndex = Math.max(0, dayOfYear - 1);
    const visibleVerses = VERSES_POOL.slice(0, currentIndex + 1);

    return (
        <Layout>
            <div style={{ padding: 'var(--spacing-md) 0' }}>
                <h1 style={{ marginBottom: 'var(--spacing-md)', fontSize: '1.5rem', fontWeight: 700 }}>Biblioteca</h1>

                {/* Tabs */}
                <div style={{
                    display: 'flex',
                    gap: 'var(--spacing-md)',
                    borderBottom: '1px solid var(--color-border)',
                    marginBottom: 'var(--spacing-lg)'
                }}>
                    <button
                        onClick={() => setActiveTab('themes')}
                        style={{
                            padding: 'var(--spacing-sm) var(--spacing-md)',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === 'themes' ? '2px solid var(--color-primary)' : '2px solid transparent',
                            color: activeTab === 'themes' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                            fontWeight: activeTab === 'themes' ? 700 : 400,
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        Temas Semanales
                    </button>
                    <button
                        onClick={() => setActiveTab('verses')}
                        style={{
                            padding: 'var(--spacing-sm) var(--spacing-md)',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === 'verses' ? '2px solid var(--color-primary)' : '2px solid transparent',
                            color: activeTab === 'verses' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                            fontWeight: activeTab === 'verses' ? 700 : 400,
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        Citas Bíblicas
                    </button>
                </div>

                {/* Content */}
                {activeTab === 'themes' && (
                    <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                        {CONFIG.themes.map((theme, index) => (
                            <div
                                key={index}
                                id={`weekly-theme-${theme.id}`}
                                onClick={() => setSelectedTheme(theme)}
                                style={{
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-md)',
                                    padding: 'var(--spacing-md)',
                                    cursor: 'pointer',
                                    background: 'var(--color-surface)',
                                    transition: 'transform 0.2s',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 'var(--spacing-sm)'
                                }}
                            >
                                <div style={{ fontSize: '0.9rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                                    SEMANA {theme.weekId || index + 1}
                                </div>
                                <h3 style={{ margin: 0 }}>{theme.title}</h3>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                                    {theme.description}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'verses' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                        {/* Current Month */}
                        <div>
                            <h2 style={{ fontSize: '1.2rem', marginBottom: 'var(--spacing-md)', color: 'var(--color-text-secondary)' }}>
                                Enero 2026
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                                {visibleVerses.map((verse, index) => {
                                    const verseId = `verse-${verse.reference.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`;
                                    return (
                                        <div
                                            key={index}
                                            id={verseId}
                                            style={{
                                                background: 'var(--color-surface)',
                                                padding: 'var(--spacing-md)',
                                                borderRadius: 'var(--radius-md)',
                                                border: '1px solid var(--color-border)'
                                            }}
                                        >
                                            <blockquote style={{ margin: '0 0 var(--spacing-sm) 0', fontStyle: 'italic', lineHeight: 1.5 }}>
                                                "{verse.text}"
                                            </blockquote>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-primary)' }}>
                                                    {verse.reference}
                                                </span>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button
                                                        onClick={() => {
                                                            const currentHash = window.location.hash.split('?')[0];
                                                            const shareUrl = `${window.location.origin}${window.location.pathname}${currentHash}?anchor=${verseId}`;
                                                            shareContent('Cita Bíblica Creamos Juntos', `"${verse.text}" - ${verse.reference}`, shareUrl);
                                                        }}
                                                        style={{
                                                            background: 'var(--color-surface-hover)',
                                                            border: 'none',
                                                            padding: '4px 8px',
                                                            borderRadius: '4px',
                                                            fontSize: '0.8rem',
                                                            cursor: 'pointer',
                                                            color: 'var(--color-text)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '4px'
                                                        }}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <circle cx="18" cy="5" r="3"></circle>
                                                            <circle cx="6" cy="12" r="3"></circle>
                                                            <circle cx="18" cy="19" r="3"></circle>
                                                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                                                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                                                        </svg>
                                                        Compartir
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            const itemToSave = {
                                                                itemID: verse.reference,
                                                                itemType: 'quote',
                                                                contentPreview: verse.reference + " - " + verse.text,
                                                                ...verse
                                                            };
                                                            toggleBookmark(itemToSave);
                                                        }}
                                                        style={{
                                                            background: 'var(--color-surface-hover)',
                                                            border: 'none',
                                                            padding: '4px 8px',
                                                            borderRadius: '4px',
                                                            fontSize: '0.8rem',
                                                            cursor: 'pointer',
                                                            color: isBookmarked(verse.reference) ? '#ef4444' : 'var(--color-text)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '4px'
                                                        }}
                                                    >
                                                        <span style={{ fontSize: '1rem' }}>
                                                            {isBookmarked(verse.reference) ? "❤️" : "🤍"}
                                                        </span>
                                                        {isBookmarked(verse.reference) ? "Guardado" : "Guardar"}
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(`"${verse.text}" - ${verse.reference}`);
                                                            alert('Cita copiada al portapapeles');
                                                        }}
                                                        style={{
                                                            background: 'var(--color-surface-hover)',
                                                            border: 'none',
                                                            padding: '4px 8px',
                                                            borderRadius: '4px',
                                                            fontSize: '0.8rem',
                                                            cursor: 'pointer',
                                                            color: 'var(--color-text)'
                                                        }}
                                                    >
                                                        Copiar
                                                    </button>
                                                </div>
                                            </div>
                                            {
                                                verse.comment && (
                                                    <div style={{ marginTop: 'var(--spacing-sm)', fontSize: '0.85rem', color: 'var(--color-text-secondary)', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '8px' }}>
                                                        💡 {verse.comment}
                                                    </div>
                                                )
                                            }
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* History */}
                        {Object.entries(CITAS_HISTORIAL).map(([month, verses]) => (
                            <div key={month}>
                                <h2 style={{ fontSize: '1.2rem', marginBottom: 'var(--spacing-md)', color: 'var(--color-text-secondary)', textTransform: 'capitalize' }}>
                                    {month} {month === 'diciembre' ? '2025' : ''}
                                </h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                                    {verses.map((verse, index) => {
                                        const verseId = `verse-${verse.reference.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`;
                                        return (
                                            <div
                                                key={index}
                                                id={verseId}
                                                style={{
                                                    background: 'var(--color-surface)',
                                                    padding: 'var(--spacing-md)',
                                                    borderRadius: 'var(--radius-md)',
                                                    border: '1px solid var(--color-border)'
                                                }}
                                            >
                                                <blockquote style={{ margin: '0 0 var(--spacing-sm) 0', fontStyle: 'italic', lineHeight: 1.5 }}>
                                                    "{verse.text}"
                                                </blockquote>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-primary)' }}>
                                                        {verse.reference}
                                                    </span>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button
                                                            onClick={() => {
                                                                const currentHash = window.location.hash.split('?')[0];
                                                                const shareUrl = `${window.location.origin}${window.location.pathname}${currentHash}?anchor=${verseId}`;
                                                                shareContent('Cita Bíblica Creamos Juntos', `"${verse.text}" - ${verse.reference}`, shareUrl);
                                                            }}
                                                            style={{
                                                                background: 'var(--color-surface-hover)',
                                                                border: 'none',
                                                                padding: '4px 8px',
                                                                borderRadius: '4px',
                                                                fontSize: '0.8rem',
                                                                cursor: 'pointer',
                                                                color: 'var(--color-text)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '4px'
                                                            }}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <circle cx="18" cy="5" r="3"></circle>
                                                                <circle cx="6" cy="12" r="3"></circle>
                                                                <circle cx="18" cy="19" r="3"></circle>
                                                                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                                                                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                                                            </svg>
                                                            Compartir
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                const itemToSave = {
                                                                    itemID: verse.reference,
                                                                    itemType: 'quote',
                                                                    contentPreview: verse.reference + " - " + verse.text,
                                                                    ...verse
                                                                };
                                                                toggleBookmark(itemToSave);
                                                            }}
                                                            style={{
                                                                background: 'var(--color-surface-hover)',
                                                                border: 'none',
                                                                padding: '4px 8px',
                                                                borderRadius: '4px',
                                                                fontSize: '0.8rem',
                                                                cursor: 'pointer',
                                                                color: isBookmarked(verse.reference) ? '#ef4444' : 'var(--color-text)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '4px'
                                                            }}
                                                        >
                                                            <span style={{ fontSize: '1rem' }}>
                                                                {isBookmarked(verse.reference) ? "❤️" : "🤍"}
                                                            </span>
                                                            {isBookmarked(verse.reference) ? "Guardado" : "Guardar"}
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(`"${verse.text}" - ${verse.reference}`);
                                                                alert('Cita copiada al portapapeles');
                                                            }}
                                                            style={{
                                                                background: 'var(--color-surface-hover)',
                                                                border: 'none',
                                                                padding: '4px 8px',
                                                                borderRadius: '4px',
                                                                fontSize: '0.8rem',
                                                                cursor: 'pointer',
                                                                color: 'var(--color-text)'
                                                            }}
                                                        >
                                                            Copiar
                                                        </button>
                                                    </div>
                                                </div>
                                                {verse.comment && (
                                                    <div style={{ marginTop: 'var(--spacing-sm)', fontSize: '0.85rem', color: 'var(--color-text-secondary)', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '8px' }}>
                                                        💡 {verse.comment}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

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
            </div>
        </Layout >
    );
};

export default Library;
