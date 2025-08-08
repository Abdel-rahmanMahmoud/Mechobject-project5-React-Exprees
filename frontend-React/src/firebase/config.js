import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCy5RH5f5flQFaqMRzv5iVuGyeS8P9AGfs",
  authDomain: "mechobject-7b416.firebaseapp.com",
  projectId: "mechobject-7b416",
  storageBucket: "mechobject-7b416",
  messagingSenderId: "269505965370",
  appId: "1:269505965370:web:d82b51ddeee673d2c87403",
  measurementId: "G-F9LMEXCHZP"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, GoogleAuthProvider, FacebookAuthProvider };
