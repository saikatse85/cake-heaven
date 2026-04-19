// src/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAqhjODKcTRpCvjuIc6ORVnv4B80xyodOY",
  authDomain: "cake-heaven-8f1e3.firebaseapp.com",
  projectId: "cake-heaven-8f1e3",
  storageBucket: "cake-heaven-8f1e3.firebasestorage.app",
  messagingSenderId: "194510272846",
  appId: "1:194510272846:web:25834fbf9615a8f8e0461f"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);