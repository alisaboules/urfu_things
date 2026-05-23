// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAUISeON5hziPjVSuF9wQi5PIKxExx6XR8",
  authDomain: "unifind-2c6c6.firebaseapp.com",
  projectId: "unifind-2c6c6",
  storageBucket: "unifind-2c6c6.firebasestorage.app",
  messagingSenderId: "293333471572",
  appId: "1:293333471572:web:29d06ad2866c1abaa378c1",
  measurementId: "G-G7SE46BP3L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);