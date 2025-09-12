import { initializeApp, getApps, getApp } from "firebase/app";

const firebaseConfig = {
  "projectId": "studio-2927320663-eef1d",
  "appId": "1:555114472434:web:fb8c2fb972033a5461816b",
  "storageBucket": "studio-2927320663-eef1d.firebasestorage.app",
  "apiKey": "AIzaSyB1QeRpOdMvQHP75gpqQlRBbAxvuu9LdPk",
  "authDomain": "studio-2927320663-eef1d.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "555114472434"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = {};
const messaging = null;

export { app, db, messaging };
