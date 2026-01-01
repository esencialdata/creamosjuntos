
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

// CORRECT Config from src/firebase.js
const firebaseConfig = {
    apiKey: "AIzaSyCx6R_qr497dYRzosZRqpMJYnxjZ1v6QdY",
    authDomain: "campo-david.firebaseapp.com",
    projectId: "campo-david",
    storageBucket: "campo-david.firebasestorage.app",
    messagingSenderId: "548361706376",
    appId: "1:548361706376:web:7ea804514d4e07fee6783d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function inspectData() {
    console.log("--- Inspecting appData/stats for persisted theme saves ---");
    try {
        const statsRef = doc(db, "appData", "stats");
        const statsSnap = await getDoc(statsRef);
        if (statsSnap.exists()) {
            console.log("STATS DATA FOUND:", JSON.stringify(statsSnap.data(), null, 2));
        } else {
            console.log("No stats document found.");
        }
    } catch (e) {
        console.error("Error reading stats:", e);
    }
}

inspectData();
