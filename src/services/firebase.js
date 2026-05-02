// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCW5t8N7R2sr2X0CSjZGJea8ajKDMnHgO4",
  authDomain: "shawarma-master-74166.firebaseapp.com",
  projectId: "shawarma-master-74166",
  storageBucket: "shawarma-master-74166.firebasestorage.app",
  messagingSenderId: "1064675455773",
  appId: "1:1064675455773:web:e7e6ce400c7ee87f2aa7f4",
  measurementId: "G-2YZYCM5455"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);