// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'blog-mern-6e567.firebaseapp.com',
  projectId: 'blog-mern-6e567',
  storageBucket: 'blog-mern-6e567.appspot.com',
  messagingSenderId: '321812159126',
  appId: '1:321812159126:web:2c0f49d397d1fa569f40b7',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
