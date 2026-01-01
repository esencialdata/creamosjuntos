import { db } from "../firebase";
import { doc, getDoc, setDoc, onSnapshot, updateDoc, increment, runTransaction } from "firebase/firestore";
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

export const getThemeStats = async () => {
    try {
        const docRef = doc(db, "appData", "stats");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data().theme_saves || {};
        }
        return {};
    } catch (error) {
        console.error("Error getting theme stats:", error);
        return {};
    }
};
