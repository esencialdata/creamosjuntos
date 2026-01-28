import React from 'react';
import Layout from '../components/Layout';
import { VERSES_POOL } from '../config/data';
import { CITAS_HISTORIAL } from '../resources/citas_biblicas';
import { shareContent } from '../utils/share';
import { useBookmarks } from '../hooks/useBookmarks';

const Library = () => {
    const { toggleBookmark, isBookmarked } = useBookmarks();

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
            </div>
        </Layout >
    );
};

export default Library;
