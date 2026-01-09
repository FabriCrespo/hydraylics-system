import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

// Configuración de Firebase desde variables de entorno
const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID || ''
};

// Crear el cliente solo si hay configuración válida
// Si no hay configuración, exportar null y se usará el fallback a JSON
let firebaseApp: FirebaseApp | null = null;
let firestore: Firestore | null = null;

const requiredFields = ['apiKey', 'authDomain', 'projectId'];
const hasValidConfig = requiredFields.every(field => firebaseConfig[field]);

if (hasValidConfig) {
  try {
    firebaseApp = initializeApp(firebaseConfig);
    firestore = getFirestore(firebaseApp);
    console.log('✅ Firebase configurado correctamente');
  } catch (error) {
    console.warn('⚠️ Error al crear cliente de Firebase:', error);
    firebaseApp = null;
    firestore = null;
  }
} else {
  console.warn('⚠️ Firebase no configurado. Configura PUBLIC_FIREBASE_API_KEY, PUBLIC_FIREBASE_AUTH_DOMAIN y PUBLIC_FIREBASE_PROJECT_ID en tu archivo .env');
}

export { firebaseApp, firestore };
