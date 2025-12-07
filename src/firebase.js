import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCx6R_qr497dYRzosZRqpMJYnxjZ1v6QdY",
    authDomain: "campo-david.firebaseapp.com",
    projectId: "campo-david",
    storageBucket: "campo-david.firebasestorage.app",
    messagingSenderId: "548361706376",
    appId: "1:548361706376:web:7ea804514d4e07fee6783d"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
