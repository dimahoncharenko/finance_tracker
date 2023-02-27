import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA5glDJxUXqvnVlpbW9qe3P4Nek7BBLqrs",
  authDomain: "finance-tracker-471ef.firebaseapp.com",
  projectId: "finance-tracker-471ef",
  storageBucket: "finance-tracker-471ef.appspot.com",
  messagingSenderId: "47828028877",
  appId: "1:47828028877:web:772deb28b9a40948ecc884",
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore();

const storage = getStorage(app);

const auth = getAuth(app);

export { app, firestore, storage, auth };
