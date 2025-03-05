import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // For authentication
import { getFirestore } from 'firebase/firestore'; // For Firestore database
import { getStorage } from 'firebase/storage'; // For Firebase storage (if needed)

// our web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyBd3iYE7-0FkwNDPcoUPpMHPYbotUDmU2g",
  authDomain: "travellotus-2fe90.firebaseapp.com",
  projectId: "travellotus-2fe90",
  storageBucket: "travellotus-2fe90.firebasestorage.app",
  messagingSenderId: "45899466058",
  appId: "1:45899466058:web:f974767c970a0cdb1bedb3",
  measurementId: "G-0QCQV9ZDXW"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // Keep this if using Firebase Storage, otherwise remove it
export default app;
