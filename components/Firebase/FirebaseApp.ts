import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyDVFf9G0PCAoD_uOuDg_ipKLkjUOa2ehMc",
    authDomain: "tonkatsu-hiroba.firebaseapp.com",
    projectId: "tonkatsu-hiroba",
    storageBucket: "tonkatsu-hiroba.firebasestorage.app",
    messagingSenderId: "537094001631",
    appId: "1:537094001631:web:65dbde894aeff7b4c3ea6a",
    measurementId: "G-R25QHVCBR1"
};

export const firebaseApp = initializeApp(firebaseConfig);
