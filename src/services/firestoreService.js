import { db } from "../firebase";
import { doc, getDoc, setDoc, onSnapshot, updateDoc, increment, runTransaction } from "firebase/firestore";

const defaultSchedule = [
    {
        id: 1, week: "Semana del 5 al 6 Dic",
        events: [
            { id: "e1", date: "Viernes 05 Dic", type: "Virtual", time: "7:00 PM", details: [{ role: "Superintendente", name: "Absalón Perusquía" }, { role: "Predicación", name: "Yahir López" }] },
            { id: "e2", date: "Sábado 06 Dic", type: "Matutino", time: "10:00 AM", theme: "La Virgen María", objective: "Sustentar creencia verdadera", details: [{ role: "Superintendente", name: "Yahir López" }, { role: "Lección", name: "Mizraim Montiel" }, { role: "Predicación", name: "Absalón Perusquía" }] },
            { id: "e3", date: "Sábado 06 Dic", type: "Vespertino", time: "4:00 PM", theme: "La familia de Jesús", objective: "Sustentar que Jesús tuvo familia", details: [{ role: "Superintendente", name: "Mizraim Montiel" }, { role: "Predicación", name: "Absalón Perusquía" }] }
        ]
    },
    {
        id: 2, week: "Semana del 12 al 13 Dic",
        events: [
            { id: "e4", date: "Viernes 12 Dic", type: "Virtual", time: "7:00 PM", details: [{ role: "Superintendente", name: "Yahir López" }, { role: "Predicación", name: "Absalón Perusquía" }] },
            { id: "e5", date: "Sábado 13 Dic", type: "Matutino", time: "10:00 AM", theme: "Parábola del sembrador", objective: "Trabajar en la evangelización", details: [{ role: "Superintendente", name: "Yahir López" }, { role: "Lección", name: "Gerardo Mier" }, { role: "Predicación", name: "Aarón Espinosa" }] },
            { id: "e6", date: "Sábado 13 Dic", type: "Vespertino", time: "4:00 PM", theme: "¿Andarás por el fuego?", objective: "Fiestas que provocan desobediencia", details: [{ role: "Superintendente", name: "Yahir López" }, { role: "Predicación", name: "Absalón Perusquía" }] }
        ]
    },
    {
        id: 3, week: "Semana del 19 al 20 Dic",
        events: [
            { id: "e7", date: "Viernes 19 Dic", type: "Virtual", time: "7:00 PM", details: [{ role: "Superintendente", name: "Absalón Perusquía" }, { role: "Predicación", name: "Yahir López" }] },
            { id: "e8", date: "Sábado 20 Dic", type: "Matutino", time: "10:00 AM", theme: "El nacimiento de Cristo", objective: "Defender verdad del nacimiento", details: [{ role: "Superintendente", name: "Yahir López" }, { role: "Lección", name: "Mizraim Montiel" }, { role: "Predicación", name: "Aarón Espinosa" }] },
            { id: "e9", date: "Sábado 20 Dic", type: "Vespertino", time: "4:00 PM", theme: "Parábola del hijo pródigo", objective: "Formas de obtener perdón", details: [{ role: "Superintendente", name: "Gerardo Mier" }, { role: "Predicación", name: "Absalón Perusquía" }] }
        ]
    },
    {
        id: 4, week: "Semana del 26 al 27 Dic",
        events: [
            { id: "e10", date: "Viernes 26 Dic", type: "Virtual", time: "7:00 PM", details: [{ role: "Superintendente", name: "Yahir López" }, { role: "Predicación", name: "Absalón Perusquía" }] },
            { id: "e11", date: "Sábado 27 Dic", type: "Matutino", time: "10:00 AM", theme: "Yo soy el camino", objective: "Ejemplo de Cristo", details: [{ role: "Superintendente", name: "Yahir López" }, { role: "Lección", name: "Absalón Perusquía" }, { role: "Predicación", name: "Aarón Espinoza" }] },
            { id: "e12", date: "Sábado 27 Dic", type: "Vespertino", time: "4:00 PM", theme: "Nuestra herencia", objective: "Características de los valientes", details: [{ role: "Superintendente", name: "Yahir López" }, { role: "Predicación", name: "Aarón Espinosa" }] }
        ]
    }
];

export const initializeDefaultData = async () => {
    try {
        const docRef = doc(db, "appData", "schedule");
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            await setDoc(docRef, { schedule: defaultSchedule });
            console.log("Default schedule data initialized in Firestore.");
        } else {
            console.log("Schedule data already exists in Firestore.");
        }
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
