import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Reemplaza con tu configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyB0vrxYCVtyDJWwJ3yMAodiTbyN8CAYIwY",
    authDomain: "abpro-gesfinapp.firebaseapp.com",
    projectId: "abpro-gesfinapp",
    storageBucket: "abpro-gesfinapp.firebasestorage.app",
    messagingSenderId: "352927287718",
    appId: "1:352927287718:web:63e912f9a91afdf870a767",
    measurementId: "G-XG3ZNYDPEM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
