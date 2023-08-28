import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebase.config";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from 'firebase/storage';

export const Firebase = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const Providers = { google: new GoogleAuthProvider() };
