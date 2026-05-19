import { getLocalTodayDate } from './dateUtils';

/**
 * Capa de almacenamiento persistente (localStorage / PWA).
 */

const STREAK_KEY = 'templo_streak';
const BACKUP_KEY = 'templo_streak_backup';

function storageGet(key) {
    return localStorage.getItem(key);
}

function storageSet(key, value) {
    localStorage.setItem(key, value);
}

// ─── API pública ──────────────────────────────────────────────────────────────

export const getStreak = () => {
    try {
        const stored = storageGet(STREAK_KEY);
        if (stored) return JSON.parse(stored);

        const backup = storageGet(BACKUP_KEY);
        if (backup) {
            console.warn('[storage] Recuperando racha desde respaldo');
            const data = JSON.parse(backup);
            storageSet(STREAK_KEY, backup);
            return data;
        }

        return { count: 0, lastVisit: null };
    } catch (e) {
        console.error('[storage] Error leyendo racha', e);
        try {
            const backup = storageGet(BACKUP_KEY);
            if (backup) return JSON.parse(backup);
        } catch (backupError) {
            console.error('[storage] Respaldo también falló', backupError);
        }
        return { count: 0, lastVisit: null };
    }
};

export const updateStreak = () => {
    const today = getLocalTodayDate();
    const { count, lastVisit } = getStreak();

    if (lastVisit === today) {
        return { count, lastVisit, message: 'Has vuelto hoy.' };
    }

    let newCount = 1;
    if (lastVisit) {
        const [ly, lm, ld] = lastVisit.split('-').map(Number);
        const [ty, tm, td] = today.split('-').map(Number);
        const lastDate = new Date(ly, lm - 1, ld);
        const currentDate = new Date(ty, tm - 1, td);
        const diffDays = Math.ceil((currentDate - lastDate) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) newCount = count + 1;
        else if (diffDays === 0) newCount = count;
        else newCount = 1;
    }

    const newStreak = { count: newCount, lastVisit: today };
    const serialized = JSON.stringify(newStreak);

    storageSet(STREAK_KEY, serialized);
    storageSet(BACKUP_KEY, serialized);

    return newStreak;
};

// Helper para restauración manual desde consola (debug)
if (typeof window !== 'undefined') {
    window.restoreStreak = (count) => {
        const today = getLocalTodayDate();
        const data = { count, lastVisit: today };
        const serialized = JSON.stringify(data);
        storageSet(STREAK_KEY, serialized);
        storageSet(BACKUP_KEY, serialized);
        console.log(`✅ Racha restaurada a ${count} días.`);
        return data;
    };
}
