import { getLocalTodayDate } from './dateUtils';

const STREAK_KEY = 'templo_streak';
const BACKUP_KEY = 'templo_streak_backup';

export const getStreak = () => {
    try {
        const stored = localStorage.getItem(STREAK_KEY);
        if (stored) {
            return JSON.parse(stored);
        }

        // Fallback: Try backup if main key is missing/corrupt
        const backup = localStorage.getItem(BACKUP_KEY);
        if (backup) {
            console.warn("Recovering streak from backup");
            const data = JSON.parse(backup);
            // Restore main key immediately
            localStorage.setItem(STREAK_KEY, backup);
            return data;
        }

        return { count: 0, lastVisit: null };
    } catch (e) {
        console.error("Error reading streak", e);
        // Attempt recovery on error too
        try {
            const backup = localStorage.getItem(BACKUP_KEY);
            if (backup) {
                return JSON.parse(backup);
            }
        } catch (backupError) {
            console.error("Backup also failed", backupError);
        }
        return { count: 0, lastVisit: null };
    }
};

export const updateStreak = () => {
    const today = getLocalTodayDate();
    const { count, lastVisit } = getStreak();

    if (lastVisit === today) {
        return { count, lastVisit, message: "Has vuelto hoy." };
    }

    let newCount = 1;
    if (lastVisit) {
        // Safer parsing
        const [ly, lm, ld] = lastVisit.split('-').map(Number);
        const [ty, tm, td] = today.split('-').map(Number);

        const lastDate = new Date(ly, lm - 1, ld);
        const currentDate = new Date(ty, tm - 1, td);

        const diffTime = currentDate - lastDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            newCount = count + 1;
        } else if (diffDays === 0) {
            newCount = count;
        } else {
            newCount = 1;
        }
    }

    const newStreak = { count: newCount, lastVisit: today };
    const serialized = JSON.stringify(newStreak);

    // Save to both locations
    localStorage.setItem(STREAK_KEY, serialized);
    localStorage.setItem(BACKUP_KEY, serialized);

    return newStreak;
};

// Helper for manual restoration or debugging
if (typeof window !== 'undefined') {
    window.restoreStreak = (count) => {
        const today = getLocalTodayDate();
        const data = { count, lastVisit: today };
        const serialized = JSON.stringify(data);
        localStorage.setItem(STREAK_KEY, serialized);
        localStorage.setItem(BACKUP_KEY, serialized);
        console.log(`✅ Racha restaurada a ${count} días (y respaldo actualizado).`);
        return data;
    };
}

