/**
 * Script para migrar productos desde products.json a Firebase Firestore
 * 
 * Uso:
 * 1. Asegúrate de tener las variables de entorno configuradas en .env
 * 2. Ejecuta: npm run migrate:firebase
 * 
 * O directamente:
 * node scripts/migrateProductsToFirebase.js
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

// Cargar variables de entorno
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuración de Firebase desde variables de entorno
const firebaseConfig = {
  apiKey: process.env.PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.PUBLIC_FIREBASE_APP_ID || ''
};

// Validar configuración
const requiredFields = ['apiKey', 'authDomain', 'projectId'];
const missingFields = requiredFields.filter(field => !firebaseConfig[field]);

if (missingFields.length > 0) {
  console.error('❌ Error: Faltan variables de entorno de Firebase');
  console.error('Campos faltantes:', missingFields.join(', '));
  console.error('\nAsegúrate de tener estas variables en tu archivo .env:');
  console.error('PUBLIC_FIREBASE_API_KEY=tu-api-key');
  console.error('PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com');
  console.error('PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto-id');
  console.error('PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com (opcional)');
  console.error('PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id (opcional)');
  console.error('PUBLIC_FIREBASE_APP_ID=tu-app-id (opcional)');
  process.exit(1);
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Cargar productos desde el JSON
const productsPath = join(__dirname, '../src/data/products.json');
const productsData = JSON.parse(readFileSync(productsPath, 'utf-8'));

async function migrateProducts() {
  console.log('🚀 Iniciando migración de productos a Firebase Firestore...\n');
  console.log(`📦 Productos a migrar: ${productsData.length}\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const product of productsData) {
    try {
      const productRef = doc(db, 'products', product.id);
      
      // Verificar si el producto ya existe
      const productSnap = await getDoc(productRef);

      if (productSnap.exists()) {
        console.log(`⚠️  Producto "${product.id}" ya existe, actualizando...`);
      }

      // Crear o actualizar el producto
      await setDoc(productRef, {
        id: product.id,
        nombre: product.nombre,
        descripcion: product.descripcion || '',
        modelos_compatibles: product.modelos_compatibles || [],
        imagen: product.imagen || '',
        createdAt: productSnap.exists() ? productSnap.data().createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { merge: true });

      console.log(`   ✅ ${productSnap.exists() ? 'Actualizado' : 'Creado'}: ${product.nombre.substring(0, 50)}...`);
      successCount++;
    } catch (error) {
      console.error(`   ❌ Error con producto "${product.id}":`, error.message);
      errorCount++;
    }
  }

  console.log('\n📊 Resumen:');
  console.log(`   ✅ Productos migrados exitosamente: ${successCount}`);
  console.log(`   ❌ Errores: ${errorCount}`);
  console.log(`   📦 Total procesados: ${productsData.length}`);
}

// Ejecutar migración
migrateProducts()
  .then(() => {
    console.log('\n✨ Migración completada!');
    console.log('\n💡 Próximos pasos:');
    console.log('   1. Verifica los productos en Firebase Console > Firestore Database');
    console.log('   2. Las imágenes están usando rutas relativas (/productos/...)');
    console.log('   3. Asegúrate de que las imágenes existan en public/productos/');
    console.log('   4. Configura las reglas de seguridad en Firestore si es necesario');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error fatal:', error);
    process.exit(1);
  });
