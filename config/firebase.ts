import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBbbU3YRdl52kQzsdtTS9QohEWIy6cG-Ak",
  authDomain: "alisha-sih-project.firebaseapp.com",
  projectId: "alisha-sih-project",
  storageBucket: "alisha-sih-project.firebasestorage.app",
  messagingSenderId: "331370112251",
  appId: "1:331370112251:web:8f34edaa116a0287ce7c5e",
  measurementId: "G-T6K69T567R"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);