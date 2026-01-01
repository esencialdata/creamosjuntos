
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, collection, getDocs } from "firebase/firestore";

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

const inspectSchema = async () => {
    try {
        console.log("--- Listing ALL Collections in Root ---");

        // Helper to check standard collections
        const checkCollection = async (colName) => {
            console.log(`Checking collection: ${colName}...`);
            const colRef = collection(db, colName);
            const snap = await getDocs(colRef);
            if (!snap.empty) {
                console.log(`!!! Found Collection: ${colName} !!!`);
                snap.forEach(doc => {
                    console.log(`Doc ID: ${doc.id}`);
                    console.log(`Data: ${JSON.stringify(doc.data(), null, 2)}`);
                });
            } else {
                console.log(`Collection ${colName} is empty or doesn't exist.`);
            }
        };

        await checkCollection("appData");

        // Check for potential backups
        const backupNames = ['archive', 'backups', 'history', 'schedules', 'events', 'stats', 'users', 'logs'];
        for (const name of backupNames) {
            await checkCollection(name);
        }

    } catch (e) {
        console.error("Error inspecting schema:", e);
    }
};

inspectSchema();
