// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAYX2t-tw8VxSXZAHUnkkXmDgbMEKTOg4E",
    authDomain: "videosage-76de3.firebaseapp.com",
    projectId: "videosage-76de3",
    storageBucket: "videosage-76de3.appspot.com",
    messagingSenderId: "66001472793",
    appId: "1:66001472793:web:7e415ea70ef77c54038988",
    measurementId: "G-JMB8H9FLVT"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const analytics = getAnalytics(app);

export { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, provider, analytics };