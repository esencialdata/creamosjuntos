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
    const today = new Date().toISOString().split('T')[0];
    const { count, lastVisit } = getStreak();

    if (lastVisit === today) {
        return { count, lastVisit, message: "Has vuelto hoy." };
    }

    let newCount = 1;
    if (lastVisit) {
        const lastDate = new Date(lastVisit);
        const currentDate = new Date(today);
        const diffTime = Math.abs(currentDate - lastDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            newCount = count + 1;
        } else {
            newCount = 1; // Reset if missed a day
        }
    }

    const newStreak = { count: newCount, lastVisit: today };
    localStorage.setItem(STREAK_KEY, JSON.stringify(newStreak));
    return newStreak;
};
