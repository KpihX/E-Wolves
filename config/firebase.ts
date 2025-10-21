import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Configuration Firebase
// 🔥 IMPORTANT: Remplacez ces valeurs par vos propres clés Firebase
// Pour obtenir ces clés:
// 1. Allez sur https://console.firebase.google.com/
// 2. Créez un nouveau projet "e-wolves"
// 3. Allez dans Project Settings > Your apps
// 4. Créez une Web App et copiez la config

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "VOTRE_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "e-wolves.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://e-wolves-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "e-wolves",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "e-wolves.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);

// Initialisation de la Realtime Database
export const database = getDatabase(app);

// Export pour usage futur si besoin
export { app };
