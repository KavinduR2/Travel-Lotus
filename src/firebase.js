import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // For authentication
import { getFirestore } from 'firebase/firestore'; // For Firestore database
import { getStorage } from 'firebase/storage'; // For Firebase storage (if needed)

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyBwygHOh841bp5Z3CDCy0y4MiQxbRSRZoM",
  authDomain: "cribclique-2e8e8.firebaseapp.com",
  projectId: "cribclique-2e8e8",
  storageBucket: "cribclique-2e8e8.firebasestorage.app",
  messagingSenderId: "265405474218",
  appId: "1:265405474218:web:6588181466fc3a571337d3"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // Keep this if using Firebase Storage, otherwise remove it
export default app;
