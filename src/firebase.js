import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBYbcD7BTwO3rkE1quIHCZ2emWv915wi9c",
  authDomain: "dermasense-ai-e6b0e.firebaseapp.com",
  projectId: "dermasense-ai-e6b0e",
  storageBucket: "dermasense-ai-e6b0e.firebasestorage.app",
  messagingSenderId: "268109367646",
  appId: "1:268109367646:web:e08d6736dfd6af24ff67cf",
  measurementId: "G-HFHSYGXQMX"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
