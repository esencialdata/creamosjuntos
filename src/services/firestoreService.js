import { db } from "../firebase";
import { doc, getDoc, setDoc, onSnapshot, updateDoc } from "firebase/firestore";

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
