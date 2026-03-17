import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";

    let RAW_API_KEY = import.meta.env.VITE_FIREBASE_API_KEY || '';
    RAW_API_KEY = RAW_API_KEY.replace(/^["']|["']$/g, '').trim();
    if (RAW_API_KEY.length < 30) RAW_API_KEY = "AIzaSyDP5f7i4UHobWLe6mEPm0rxr7q_Ws7U6sA";
    
const firebaseConfig = {
    apiKey: RAW_API_KEY,
    authDomain: "campo-david.firebaseapp.com",
    projectId: "campo-david",
    storageBucket: "campo-david.firebasestorage.app",
    messagingSenderId: "548361706376",
    appId: "1:548361706376:web:7ea804514d4e07fee6783d"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Messaging se exporta como función lazy para evitar errores en SSR o ambientes sin soporte
let _messaging = null;
export const getAppMessaging = () => {
    if (!_messaging) {
        _messaging = getMessaging(app);
    }
    return _messaging;
};
