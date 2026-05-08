import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import WeeklyTheme from '../components/WeeklyTheme';
import AudioCapsuleCard from '../components/AudioCapsuleCard';
import AudioModuleCard from '../components/AudioModuleCard';
import AudioModuleDetail from '../components/AudioModuleDetail';
import { CONFIG, VERSES_POOL } from '../config/data';
import { CITAS_HISTORIAL } from '../resources/citas_biblicas';
import { shareContent } from '../utils/share';
import { useBookmarks } from '../hooks/useBookmarks';

const Library = () => {
    const [activeTab, setActiveTab] = useState('themes');
    const [selectedModule, setSelectedModule] = useState(null);
    const [selectedTheme, setSelectedTheme] = useState(null);
    const [showManifiesto, setShowManifiesto] = useState(false);
    const { toggleBookmark, isBookmarked } = useBookmarks();
    const location = useLocation();

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
        
        if (location.state?.openModule) {
            setActiveTab('audios');
            const mod = CONFIG.audioModules?.find(m => m.id === location.state.openModule);
            if (mod) setSelectedModule(mod);
        } else if (anchor === 'audios-tab') {
            setActiveTab('audios');
        } else if (anchor) {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isModuleAvailable = (mod) => {
        if (!mod.episodes || mod.episodes.length === 0) return false;
        const now = new Date();
        return mod.episodes.some(ep => {
            if (!ep.releaseDate) return true;
            return new Date(ep.releaseDate + 'T00:00:00') <= now;
        });
    };

    const audioModules = CONFIG.audioModules || [];
    const entradaModules = audioModules.filter(m => m.layer === 'entrada' && isModuleAvailable(m));
    const ejeOrder = [
        { key: 'carne',    label: 'Carne',    color: '#D85A30', bg: '#FAECE7' },
        { key: 'alma',     label: 'Alma',     color: '#3C3489', bg: '#EEEDFE' },
        { key: 'espiritu', label: 'Espíritu', color: '#085041', bg: '#E1F5EE' },
    ];
    const ejeModules = ejeOrder.reduce((acc, { key }) => {
        acc[key] = audioModules.filter(m => m.layer === 'eje' && m.eje === key && isModuleAvailable(m));
        return acc;
    }, {});
    const unclassifiedModules = audioModules.filter(m => !m.layer && isModuleAvailable(m));

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
                    {[
                        { id: 'themes', label: 'Temas' },
                        { id: 'verses', label: 'Citas Bíblicas' },
                        { id: 'audios', label: 'Audios' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: 'var(--spacing-sm) var(--spacing-md)',
                                background: 'none',
                                border: 'none',
                                borderBottom: activeTab === tab.id ? '2px solid var(--color-primary)' : '2px solid transparent',
                                color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                                fontWeight: activeTab === tab.id ? 700 : 400,
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
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

                {activeTab === 'audios' && (
                    <div>
                        {selectedModule ? (
                            <AudioModuleDetail
                                module={selectedModule}
                                onBack={() => setSelectedModule(null)}
                            />
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>

                                {/* Encabezado compacto DISEÑO ORIGINAL */}
                                <div style={{
                                    paddingBottom: '20px',
                                    marginBottom: '20px',
                                    borderBottom: '1px solid #E8E0D4',
                                }}>
                                    <div style={{
                                        fontSize: '10px',
                                        letterSpacing: '0.12em',
                                        fontWeight: 400,
                                        color: '#8B6914',
                                        textTransform: 'uppercase',
                                        fontFamily: 'Inter, sans-serif',
                                        marginBottom: '10px',
                                    }}>
                                        Diseño Original
                                    </div>
                                    <div style={{
                                        fontFamily: 'Lora, Georgia, serif',
                                        fontSize: '18px',
                                        fontWeight: 400,
                                        color: '#2C2218',
                                        lineHeight: 1.4,
                                        letterSpacing: '-0.03em',
                                        marginBottom: '6px',
                                    }}>
                                        Fuiste construido con propósito
                                    </div>
                                    <div style={{
                                        fontFamily: 'Lora, Georgia, serif',
                                        fontSize: '13px',
                                        fontWeight: 400,
                                        color: '#7A6E62',
                                        lineHeight: 1.65,
                                        letterSpacing: '-0.03em',
                                        marginBottom: '12px',
                                    }}>
                                        Tres dimensiones. Un manual. Tu vida como fue diseñada.
                                    </div>
                                    <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                                        {[
                                            { label: 'Carne',    bg: '#FAECE7', color: '#712B13' },
                                            { label: 'Alma',     bg: '#EEEDFE', color: '#3C3489' },
                                            { label: 'Espíritu', bg: '#E1F5EE', color: '#085041' },
                                        ].map(({ label, bg, color }) => (
                                            <span key={label} style={{
                                                fontSize: '9px',
                                                fontWeight: 400,
                                                letterSpacing: '0.1em',
                                                textTransform: 'uppercase',
                                                fontFamily: 'Inter, sans-serif',
                                                padding: '3px 10px',
                                                borderRadius: '20px',
                                                background: bg,
                                                color,
                                            }}>
                                                {label}
                                            </span>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => setShowManifiesto(true)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            padding: '8px 0 0 0',
                                            cursor: 'pointer',
                                            fontFamily: 'Inter, sans-serif',
                                            fontSize: '11px',
                                            fontWeight: 400,
                                            color: '#8B6914',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            letterSpacing: '0.02em',
                                        }}
                                    >
                                        Leer manifiesto completo
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                                            stroke="#8B6914" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="9 18 15 12 9 6" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Capa 1: Para comenzar */}
                                {entradaModules.length > 0 && (
                                    <div style={{ marginBottom: '24px' }}>
                                        <div style={{
                                            fontSize: '10px',
                                            letterSpacing: '0.12em',
                                            fontWeight: 400,
                                            color: '#7A6E62',
                                            textTransform: 'uppercase',
                                            fontFamily: 'Inter, sans-serif',
                                            marginBottom: '12px',
                                        }}>
                                            Para comenzar
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                            {entradaModules.map(mod => (
                                                <AudioModuleCard key={mod.id} module={mod} onClick={() => setSelectedModule(mod)} />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Capa 2: Series por eje */}
                                {ejeOrder.map(({ key, label, color, bg }) => {
                                    const mods = ejeModules[key];
                                    if (!mods || mods.length === 0) return null;
                                    return (
                                        <div key={key} style={{ marginBottom: '24px' }}>
                                            <div style={{
                                                display: 'inline-block',
                                                fontSize: '9px',
                                                letterSpacing: '0.1em',
                                                fontWeight: 400,
                                                textTransform: 'uppercase',
                                                fontFamily: 'Inter, sans-serif',
                                                color,
                                                background: bg,
                                                padding: '3px 10px',
                                                borderRadius: '20px',
                                                marginBottom: '12px',
                                            }}>
                                                {label}
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                                {mods.map(mod => (
                                                    <AudioModuleCard key={mod.id} module={mod} onClick={() => setSelectedModule(mod)} />
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Fallback: módulos sin layer */}
                                {unclassifiedModules.length > 0 && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {unclassifiedModules.map(mod => (
                                            <AudioModuleCard key={mod.id} module={mod} onClick={() => setSelectedModule(mod)} />
                                        ))}
                                    </div>
                                )}

                                {/* Empty state */}
                                {entradaModules.length === 0 &&
                                 ejeOrder.every(({ key }) => !ejeModules[key]?.length) &&
                                 unclassifiedModules.length === 0 && (
                                    <p style={{
                                        color: '#7A6E62',
                                        textAlign: 'center',
                                        padding: '32px 0',
                                        fontFamily: 'Lora, Georgia, serif',
                                        fontSize: '14px',
                                        fontWeight: 400,
                                    }}>
                                        Aún no hay programas disponibles.
                                    </p>
                                )}
                            </div>
                        )}
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

            {/* Modal: Manifiesto completo */}
            {showManifiesto && (
                <div
                    onClick={() => setShowManifiesto(false)}
                    style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(44, 34, 24, 0.7)',
                        zIndex: 1000,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                    }}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{
                            background: '#F9F6F1',
                            borderRadius: '20px 20px 0 0',
                            padding: '32px 24px 48px',
                            maxHeight: '85vh',
                            overflowY: 'auto',
                        }}
                    >
                        {/* Handle */}
                        <div style={{
                            width: '36px',
                            height: '4px',
                            background: '#E8E0D4',
                            borderRadius: '2px',
                            margin: '0 auto 24px',
                        }} />

                        {/* Eyebrow */}
                        <div style={{
                            fontSize: '10px',
                            letterSpacing: '0.12em',
                            fontWeight: 400,
                            color: '#8B6914',
                            textTransform: 'uppercase',
                            fontFamily: 'Inter, sans-serif',
                            marginBottom: '16px',
                        }}>
                            Diseño Original
                        </div>

                        {/* Párrafos del manifiesto */}
                        {[
                            { text: 'Fuiste construido con una precisión que todavía no terminas de entender.', strong: true },
                            { text: 'No como metáfora. Como hecho.', strong: false },
                            { text: 'Tienes un cuerpo con sistemas de autorregulación más sofisticados que cualquier tecnología existente. Tienes una mente capaz de reescribirse a sí misma. Tienes una dimensión interior que ninguna resonancia magnética ha podido mapear del todo.', strong: false },
                            { text: 'Tres capas. Un solo ser. Un diseño con propósito.', strong: true },
                            { text: 'El problema no es que estés roto. El problema es que nadie te entregó el manual.', strong: false },
                            { text: 'DISEÑO ORIGINAL es eso: el manual. Una colección de audio construida desde la sabiduría más antigua del mundo, validada por la ciencia más reciente, traducida al lenguaje de tu vida cotidiana.', strong: false },
                            { text: 'No importa desde dónde llegues. Importa hacia dónde puedes ir.', strong: false },
                        ].map(({ text, strong }, i) => (
                            <p key={i} style={{
                                fontFamily: 'Lora, Georgia, serif',
                                fontSize: '15px',
                                lineHeight: 1.7,
                                letterSpacing: '-0.03em',
                                color: strong ? '#2C2218' : '#7A6E62',
                                fontWeight: 400,
                                marginBottom: '16px',
                                marginTop: 0,
                            }}>
                                {text}
                            </p>
                        ))}

                        {/* Ejes */}
                        <div style={{
                            textAlign: 'center',
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '10px',
                            letterSpacing: '0.12em',
                            fontWeight: 400,
                            color: '#8B6914',
                            textTransform: 'uppercase',
                            margin: '24px 0',
                        }}>
                            Carne · Alma · Espíritu
                        </div>

                        {/* Párrafo final */}
                        <p style={{
                            fontFamily: 'Lora, Georgia, serif',
                            fontSize: '15px',
                            lineHeight: 1.7,
                            letterSpacing: '-0.03em',
                            color: '#7A6E62',
                            fontWeight: 400,
                            margin: '0 0 32px 0',
                            textAlign: 'center',
                        }}>
                            Cada serie trabaja una dimensión específica de lo que eres. Puedes empezar por donde más lo necesites.
                        </p>

                        {/* Botón cerrar */}
                        <button
                            onClick={() => setShowManifiesto(false)}
                            style={{
                                display: 'block',
                                width: '100%',
                                padding: '14px',
                                background: '#2563EB',
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: '20px',
                                fontFamily: 'Inter, sans-serif',
                                fontSize: '14px',
                                fontWeight: 400,
                                cursor: 'pointer',
                                minHeight: '44px',
                            }}
                        >
                            Explorar las series
                        </button>
                    </div>
                </div>
            )}
        </Layout >
    );
};

export default Library;
