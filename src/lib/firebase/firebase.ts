// Import the functions you need from the SDKs you need
import { deleteApp, getApp, getApps, initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
import {getAuth} from 'firebase/auth'
import { getStorage } from "firebase/storage";
import { env } from "$env/dynamic/public";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey:   env.PUBLIC_FIREBASE_API_KEY || "dummy-api-key-for-build",
  authDomain:   env.PUBLIC_FIREBASE_AUTH_DOMAIN || "dummy.firebaseapp.com",
  projectId:    env.PUBLIC_FIREBASE_PROJECT_ID || "dummy-project",
  messagingSenderId:   env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  storageBucket:  env.PUBLIC_FIREBASE_STORAGE_BUCKET || "dummy.appspot.com",
  appId:   env.PUBLIC_FIREBASE_APP_ID || "1:123:web:abc",
  measurementId:   env.PUBLIC_FIREBASE_MEASUREMENT_ID || "G-DUMMY",
};


// Initialize Firebase
let firebaseApp
if(!getApps().length){
    firebaseApp = initializeApp(firebaseConfig)
} else {
    firebaseApp = getApp()
    deleteApp(firebaseApp)
        firebaseApp = initializeApp(firebaseConfig)
}

export const db = getFirestore(firebaseApp)
export const auth = getAuth(firebaseApp)

// Get the Firebase Storage instance
export const storage = getStorage(firebaseApp);

// intialize firebase admin sdk

