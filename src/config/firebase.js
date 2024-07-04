import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDJP8009ah_xHJO0Iq6pwX_I1O-ODIwzkw",
  authDomain: "fir-tuts-2024-2.firebaseapp.com",
  projectId: "fir-tuts-2024-2",
  storageBucket: "fir-tuts-2024-2.appspot.com",
  messagingSenderId: "997253124756",
  appId: "1:997253124756:web:389ed2e1f9b4ef963cda81",
  measurementId: "G-E9XY131DY2",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
