# Instrucciones para Configurar Firebase

## 1. Instalar Firebase SDK

Primero, instala el SDK de Firebase:

```bash
npm install firebase
```

## 2. Configurar Variables de Entorno (Archivo `.env`)

### 📍 Ubicación del archivo

**Los datos de Firebase se configuran en un archivo `.env` que debes crear en la raíz del proyecto.**

La estructura de carpetas debe verse así:

```
hydraylics-system/
├── .env                    ← CREA ESTE ARCHIVO AQUÍ (en la raíz)
├── package.json
├── astro.config.mjs
├── src/
│   └── utils/
│       └── firebaseClient.ts  ← Este archivo lee las variables del .env
└── ...
```

### 🔧 Crear y configurar el archivo `.env`

1. **Crea un archivo nuevo** llamado `.env` en la raíz del proyecto (la misma carpeta donde está `package.json`)

2. **Añade las siguientes variables** al archivo `.env`:

```env
PUBLIC_FIREBASE_API_KEY=tu-api-key
PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto-id
PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
PUBLIC_FIREBASE_APP_ID=tu-app-id
```

### 📋 Cómo obtener estos valores desde Firebase:

1. **Inicia sesión** en [Firebase Console](https://console.firebase.google.com)
2. **Selecciona tu proyecto** (o créalo si no tienes uno)
3. Ve a **Configuración del proyecto** (⚙️) en el menú lateral
4. Haz clic en **Configuración del proyecto**
5. Desplázate hasta la sección **Tus aplicaciones**
6. Si no tienes una app web, haz clic en **Agregar app** > **Web** (</>)
7. Copia los valores de configuración que aparecen:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",                    // → PUBLIC_FIREBASE_API_KEY
  authDomain: "proyecto.firebaseapp.com", // → PUBLIC_FIREBASE_AUTH_DOMAIN
  projectId: "mi-proyecto",             // → PUBLIC_FIREBASE_PROJECT_ID
  storageBucket: "proyecto.appspot.com",  // → PUBLIC_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "123456789",        // → PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  appId: "1:123456789:web:abc123"        // → PUBLIC_FIREBASE_APP_ID
};
```

### ✅ Ejemplo de archivo `.env` completo:

```env
PUBLIC_FIREBASE_API_KEY=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz
PUBLIC_FIREBASE_AUTH_DOMAIN=mi-proyecto.firebaseapp.com
PUBLIC_FIREBASE_PROJECT_ID=mi-proyecto-id
PUBLIC_FIREBASE_STORAGE_BUCKET=mi-proyecto.appspot.com
PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

### ⚠️ Importante después de crear/modificar el `.env`:

1. **Reinicia el servidor de desarrollo** para que las variables se carguen
2. Si estás usando `npm run dev`, detén el servidor (Ctrl+C) y vuelve a ejecutarlo
3. El archivo `.env` **NO debe subirse a Git** (ya está en `.gitignore`)

### 🔍 Dónde se usan estas variables:

Estas variables son leídas automáticamente por el archivo `src/utils/firebaseClient.ts`:

```typescript
const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID || '',
  // ...
}
```

Este cliente de Firebase se usa en toda la aplicación para:
- Cargar productos desde Firestore
- Crear, editar y eliminar productos
- Gestionar el catálogo de productos

### 🧪 Verificar que la configuración funciona:

1. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Abre la consola del navegador (F12)
3. Si ves un mensaje: `⚠️ Firebase no configurado`, significa que el archivo `.env` no está configurado correctamente
4. Si ves: `✅ Firebase configurado correctamente`, la configuración está correcta ✅

---

## 2. Configurar Firestore Database

### 📍 Crear la base de datos

1. Ve a **Firestore Database** en Firebase Console
2. Haz clic en **Crear base de datos**
3. Selecciona **Iniciar en modo de prueba** (puedes cambiar las reglas después)
4. Elige una ubicación para tu base de datos (recomendado: la más cercana a tus usuarios)

### 📋 Estructura de la colección

La colección se llamará `products` y cada documento tendrá esta estructura:

```javascript
{
  id: "bomba-engrenagem-4280520001",
  nombre: "Bomba de Engrenagem 4280520001",
  descripcion: "Descripción del producto...",
  modelos_compatibles: ["4280520001", "3239915004"],
  imagen: "/productos/1.jpeg",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
}
```

**Nota:** El campo `id` será el ID del documento en Firestore.

### 🔒 Configurar Reglas de Seguridad (Opcional)

En **Firestore Database** > **Reglas**, puedes configurar:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura pública de productos
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null; // Solo usuarios autenticados pueden escribir
    }
  }
}
```

Para desarrollo, puedes usar temporalmente:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // ⚠️ Solo para desarrollo
    }
  }
}
```

---

## 3. Migrar Productos Existentes

Si ya tienes productos en `src/data/products.json`, puedes migrarlos a Firebase:

### 🚀 Usar el script de migración:

```bash
npm run migrate:firebase
```

Este script:
- ✅ Lee todos los productos de `src/data/products.json`
- ✅ Verifica si cada producto ya existe en Firestore
- ✅ Si existe: lo actualiza
- ✅ Si no existe: lo crea
- ✅ Muestra un resumen al final

### 📊 Ejemplo de salida:

```
🚀 Iniciando migración de productos a Firebase Firestore...

📦 Productos a migrar: 50

   ✅ Creado: Bomba de Engrenagem 4280520001...
   ✅ Creado: Bomba de Engrenagem 4280520002...
   ⚠️  Producto "bomba-engrenagem-4280520001" ya existe, actualizando...
   ✅ Actualizado: Bomba de Engrenagem 4280520001...

📊 Resumen:
   ✅ Productos migrados exitosamente: 50
   ❌ Errores: 0
   📦 Total procesados: 50

✨ Migración completada!
```

---

## 4. Funcionalidades Implementadas

### ✅ CRUD Completo:
- **Create**: Botón flotante "+" para agregar productos
- **Read**: Los productos se cargan automáticamente desde Firestore
- **Update**: Botón de editar (✏️) en cada producto
- **Delete**: Botón de eliminar (🗑️) en cada producto

### 🔧 Botones de Administración:

- **Botón flotante**: Aparece en la esquina inferior derecha de la página de productos
- **Botones en productos**: Al hacer hover sobre un producto, aparecen botones de editar y eliminar

---

## 5. Sistema de Fallback Automático

### 🔄 ¿Qué es el fallback?

La aplicación tiene un sistema **automático de fallback** que garantiza que los productos siempre se muestren, incluso si Firebase no está disponible.

### 📋 Cómo funciona:

1. **Intenta cargar desde Firebase primero** (si está configurado)
2. **Si Firebase falla o no está configurado**, automáticamente carga los productos desde el archivo JSON local
3. Los productos del JSON están en `src/data/products.json`

### ✅ Escenarios donde se usa el fallback:

- **Firebase no configurado**: Si no hay variables de entorno en `.env`
- **Error de conexión**: Si no se puede conectar a Firebase
- **Colección vacía**: Si la colección `products` en Firestore no tiene datos
- **Error en la consulta**: Si hay algún problema al obtener los datos

### 📝 Archivos involucrados:

- `src/utils/firebaseClient.ts`: Cliente de Firebase
- `src/utils/productService.ts`: Contiene la lógica de fallback (necesita actualización)
- `src/data/products.json`: Archivo JSON con los productos de respaldo

---

## 6. Notas Importantes

- Los productos se cargan desde Firebase al cargar la página, con fallback automático al JSON
- Si Firebase no está disponible o falla, la aplicación usa automáticamente el JSON como respaldo
- Las imágenes se almacenan como rutas de archivos (relativas a `/productos/`)
- Para ocultar los botones de administración en producción, cambia `display: flex` a `display: none` en el CSS de `.admin-actions`
- **El archivo JSON siempre debe mantenerse actualizado** como respaldo de los productos

---

## 7. Solución de Problemas

### Error: "Firebase no configurado"
- Verifica que el archivo `.env` existe y tiene las variables correctas
- Reinicia el servidor de desarrollo después de crear/modificar `.env`
- Verifica que las variables empiezan con `PUBLIC_`

### Error: "Error al crear cliente de Firebase"
- Verifica que todas las variables de entorno están configuradas
- Verifica que los valores son correctos (sin espacios extra, sin comillas)
- Revisa la consola del navegador para más detalles

### Los productos no se muestran
- Verifica que hay productos en Firestore **o** en el archivo `src/data/products.json`
- Verifica que las variables de entorno están configuradas correctamente (si usas Firebase)
- La aplicación usará el JSON como fallback automáticamente si Firebase falla
- Abre la consola del navegador (F12) para ver mensajes sobre el origen de los datos

### Los productos se cargan desde JSON en lugar de Firebase
- Verifica que las variables de entorno están correctamente configuradas en `.env`
- Verifica que la colección `products` existe y tiene datos en Firestore
- Revisa la consola del navegador para ver el mensaje de error específico
- Verifica que las reglas de Firestore permiten lectura pública

---

## 8. Comparación: Firebase vs Supabase

### Firebase Firestore:
- ✅ Base de datos NoSQL (documentos)
- ✅ Escalable automáticamente
- ✅ Integración con otros servicios de Firebase
- ✅ Generoso plan gratuito
- ⚠️ Requiere configuración de reglas de seguridad

### Supabase:
- ✅ Base de datos SQL (PostgreSQL)
- ✅ Más familiar si vienes de SQL
- ✅ API REST automática
- ✅ Plan gratuito generoso
- ⚠️ Requiere configuración de políticas RLS

**Puedes usar cualquiera de los dos**, o incluso ambos como respaldo. El sistema de fallback permite cambiar entre ellos fácilmente.
