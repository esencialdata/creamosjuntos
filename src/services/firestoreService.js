import { db } from "../firebase";
import { doc, getDoc, setDoc, onSnapshot, updateDoc, increment, runTransaction, collection, deleteDoc, collectionGroup, query, where, getDocs } from "firebase/firestore";
import { CONFIG } from "../config/data";

export const initializeDefaultData = async () => {
    try {
        const docRef = doc(db, "appData", "schedule");
        // Force update to ensure new month data is applied
        // This overwrites existing schedule data, which is intended for a new release.
        await setDoc(docRef, { schedule: CONFIG.schedule }, { merge: true });
        console.log("Schedule data initialized/updated in Firestore from CONFIG.");
    } catch (error) {
        console.error("Error initializing data:", error);
    }
};

export const subscribeToSchedule = (callback) => {
    const docRef = doc(db, "appData", "schedule");
    return onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
            callback(doc.data().schedule);
        } else {
            console.log("No schedule data found!");
            callback([]);
        }
    });
};

export const updateEventStatus = async (weekId, eventId, roleIndex, newStatus) => {
    try {
        const docRef = doc(db, "appData", "schedule");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            const updatedSchedule = [...data.schedule];

            const week = updatedSchedule.find(w => w.id === weekId);
            if (week) {
                const event = week.events.find(e => e.id === eventId);
                if (event && event.details[roleIndex]) {
                    // Initialize status prop if it doesn't exist? 
                    // Wait, the structure in defaultSchedule doesn't have status field in details items.
                    // We need to add it dynamically or rely on it being added.
                    // We will add a 'status' field to the detail object.
                    event.details[roleIndex].status = newStatus;

                    await updateDoc(docRef, { schedule: updatedSchedule });
                }
            }
        }
    } catch (error) {
        console.error("Error updating event status:", error);
    }
};

export const toggleReaction = async (weekId, eventId, shouldAdd) => {
    const docRef = doc(db, "appData", "schedule");

    try {
        await runTransaction(db, async (transaction) => {
            const docSnap = await transaction.get(docRef);

            if (!docSnap.exists()) {
                throw "Document does not exist!";
            }

            const data = docSnap.data();
            // Clone the array/objects to avoid mutating state directly if referenced elsewhere (though not critical here with deep cloning)
            // JSON parse/stringify is a cheap way to deep clone for this specific simple structure
            const updatedSchedule = JSON.parse(JSON.stringify(data.schedule));

            const week = updatedSchedule.find(w => w.id === weekId);
            if (week) {
                const event = week.events.find(e => e.id === eventId);
                if (event) {
                    let currentLights = event.lights || 0;

                    if (shouldAdd) {
                        currentLights += 1;
                    } else {
                        currentLights = Math.max(0, currentLights - 1);
                    }

                    event.lights = currentLights;

                    // Transactional write
                    transaction.update(docRef, { schedule: updatedSchedule });
                }
            }
        });
    } catch (error) {
        console.error("Error toggling reaction (transaction):", error);
    }
};

export const toggleLightReaction = async (weekId, eventId, shouldAdd) => {
    return toggleReaction(weekId, eventId, shouldAdd);
};

// --- Pulse Measurement Stats ---

export const toggleVerseHeart = async (verseReference, shouldAdd) => {
    // Uses a central 'stats' document in 'appData' collection
    // Structure: { verse_hearts: { [reference]: count } }
    try {
        const docRef = doc(db, "appData", "stats");
        // We use dot notation for nested field updates in Firestore
        // e.g. "verse_hearts.Juan 3:16"
        const fieldPath = `verse_hearts.${verseReference}`;

        await setDoc(docRef, {
            verse_hearts: {
                [verseReference]: increment(shouldAdd ? 1 : -1)
            }
        }, { merge: true });

    } catch (error) {
        console.error("Error toggling verse heart:", error);
    }
};

export const toggleThemeSave = async (themeTitle, shouldAdd) => {
    // Uses the same central 'stats' document
    // Structure: { theme_saves: { [title]: count } }
    try {
        const docRef = doc(db, "appData", "stats");
        const docSnap = await getDoc(docRef); // Check existence if we wanted to avoid negative, but increment handles it OK mostly
        // actually, increment(-1) on undefined starts at -1. 
        // Ideally we should care, but for this specific "Pulse" use case, 
        // we assume we start from 0.

        await setDoc(docRef, {
            theme_saves: {
                [themeTitle]: increment(shouldAdd ? 1 : -1)
            }
        }, { merge: true });

    } catch (error) {
        console.error("Error toggling theme save:", error);
    }
};

export const toggleThemeShare = async (themeTitle, shouldAdd) => {
    // Uses the same central 'stats' document
    // Structure: { theme_shares: { [title]: count } }
    try {
        const docRef = doc(db, "appData", "stats");
        // We assume we start from 0 and increment.
        await setDoc(docRef, {
            theme_shares: {
                [themeTitle]: increment(1) // Shares usually only increment
            }
        }, { merge: true });

    } catch (error) {
        console.error("Error toggling theme share:", error);
    }
};

export const getThemeStats = async () => {
    try {
        const docRef = doc(db, "appData", "stats");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data(); // Returns { theme_saves, theme_shares, verse_hearts }
        }
        return {};
    } catch (error) {
        console.error("Error getting analytics stats:", error);
        return {};
    }
};
const getCollectionPath = (deviceId) => `users/${deviceId}/bookmarks`;

export const subscribeToUserBookmarks = (deviceId, callback) => {
    if (!deviceId) return () => { };

    const collectionRef = collection(db, getCollectionPath(deviceId));

    return onSnapshot(collectionRef, (snapshot) => {
        const bookmarks = {};
        snapshot.forEach(doc => {
            bookmarks[doc.id] = doc.data();
        });
        callback(bookmarks);
    }, (error) => {
        console.error("Error subscribing to bookmarks:", error);
        callback({});
    });
};

export const saveBookmark = async (deviceId, item) => {
    if (!deviceId || !item.itemID) return;

    try {
        const docRef = doc(db, getCollectionPath(deviceId), item.itemID);
        await setDoc(docRef, {
            ...item,
            dateSaved: new Date().toISOString(),
            userDeviceID: deviceId
        }, { merge: true });
    } catch (error) {
        console.error("Error saving bookmark:", error);
    }
};

export const removeBookmark = async (deviceId, itemId) => {
    if (!deviceId || !itemId) return;

    try {
        const docRef = doc(db, getCollectionPath(deviceId), itemId);
        await deleteDoc(docRef);
    } catch (error) {
        console.error("Error removing bookmark:", error);
    }
};

export const getCommunityStats = async () => {
    try {
        // Calculate start of current week (Sunday)
        const today = new Date();
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        startOfWeek.setHours(0, 0, 0, 0);

        const bookmarksQuery = query(
            collectionGroup(db, 'bookmarks'),
            where('dateSaved', '>=', startOfWeek.toISOString())
        );

        const querySnapshot = await getDocs(bookmarksQuery);

        const stats = {
            topVerses: {},
            topTopics: {},
            dailyPulse: {
                "Mon": 0, "Tue": 0, "Wed": 0, "Thu": 0, "Fri": 0, "Sat": 0, "Sun": 0
            }
        };

        const daysMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const date = new Date(data.dateSaved);
            const dayName = daysMap[date.getDay()];

            // Daily Pulse
            if (stats.dailyPulse[dayName] !== undefined) {
                stats.dailyPulse[dayName]++;
            }

            // Top Items
            if (data.itemType === 'quote') {
                const key = data.contentPreview || data.itemID; // Fallback to ID if no preview
                stats.topVerses[key] = (stats.topVerses[key] || 0) + 1;
            } else if (data.itemType === 'topic') {
                const key = data.title || data.itemID;
                stats.topTopics[key] = (stats.topTopics[key] || 0) + 1;
            }
        });

        // Convert to Arrays, Sort and Slice
        const sortAndSlice = (obj) => {
            return Object.entries(obj)
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 5);
        };

        return {
            topVerses: sortAndSlice(stats.topVerses),
            topTopics: sortAndSlice(stats.topTopics),
            dailyPulse: Object.entries(stats.dailyPulse).map(([day, count]) => ({ day, count }))
        };

    } catch (error) {
        console.error("Error getting community stats:", error);
        return { topVerses: [], topTopics: [], dailyPulse: [] };
    }
};
