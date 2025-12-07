import { getLocalTodayDate } from './dateUtils';

const STREAK_KEY = 'templo_streak';

export const getStreak = () => {
    try {
        const stored = localStorage.getItem(STREAK_KEY);
        if (!stored) return { count: 0, lastVisit: null };
        return JSON.parse(stored);
    } catch (e) {
        console.error("Error reading streak", e);
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
        // Parse "YYYY-MM-DD" explicitly to avoid timezone shifts
        // Constructing Date from string "YYYY-MM-DD" defaults to UTC in some browsers or Local in others.
        // Safer to split and construct local date.
        const [ly, lm, ld] = lastVisit.split('-').map(Number);
        const [ty, tm, td] = today.split('-').map(Number);

        const lastDate = new Date(ly, lm - 1, ld);
        const currentDate = new Date(ty, tm - 1, td);

        const diffTime = currentDate - lastDate; // Milliseconds
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            newCount = count + 1;
        } else if (diffDays === 0) {
            // Should be caught by lastVisit === today check, but strictly speaking same day
            newCount = count;
        } else {
            newCount = 1; // Reset if missed a day
        }
    }

    const newStreak = { count: newCount, lastVisit: today };
    localStorage.setItem(STREAK_KEY, JSON.stringify(newStreak));
    return newStreak;
};
