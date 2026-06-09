// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBEKmAvgCU1nFHJcwPsIuz_wKKieT9BN0E",
  authDomain: "shawarma-master-f19bd.firebaseapp.com",
  projectId: "shawarma-master-f19bd",
  storageBucket: "shawarma-master-f19bd.firebasestorage.app",
  messagingSenderId: "191157949085",
  appId: "1:191157949085:web:d97f3180889eb48b4bfa74",
  measurementId: "G-ZV2JL5ZS02"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db   = getFirestore(app);
export const auth = getAuth(app);