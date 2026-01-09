# Instrucciones para Configurar Supabase

## 1. Configurar Variables de Entorno (Archivo `.env`)

### 📍 Ubicación del archivo

**Los datos de Supabase se configuran en un archivo `.env` que debes crear en la raíz del proyecto.**

La estructura de carpetas debe verse así:

```
hydraylics-system/
├── .env                    ← CREA ESTE ARCHIVO AQUÍ (en la raíz)
├── package.json
├── astro.config.mjs
├── src/
│   └── utils/
│       └── supabaseClient.ts  ← Este archivo lee las variables del .env
└── ...
```

### 🔧 Crear y configurar el archivo `.env`

1. **Crea un archivo nuevo** llamado `.env` en la raíz del proyecto (la misma carpeta donde está `package.json`)

2. **Añade las siguientes variables** al archivo `.env`:

```env
PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

### 📋 Cómo obtener estos valores desde Supabase:

1. **Inicia sesión** en [Supabase](https://supabase.com)
2. **Selecciona tu proyecto** (o créalo si no tienes uno)
3. Ve a **Settings** (⚙️) en el menú lateral
4. Haz clic en **API**
5. En la sección **Project API keys**, encontrarás:
   - **Project URL**: Copia esta URL completa
   - **anon/public key**: Copia esta clave (la que está marcada como `public` o `anon`)

### ✅ Ejemplo de archivo `.env` completo:

```env
PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.ejemplo1234567890
```

### ⚠️ Importante después de crear/modificar el `.env`:

1. **Reinicia el servidor de desarrollo** para que las variables se carguen
2. Si estás usando `npm run dev`, detén el servidor (Ctrl+C) y vuelve a ejecutarlo
3. El archivo `.env` **NO debe subirse a Git** (ya está en `.gitignore`)

### 🔍 Dónde se usan estas variables:

Estas variables son leídas automáticamente por el archivo `src/utils/supabaseClient.ts`:

```typescript
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || ''
```

Este cliente de Supabase se usa en toda la aplicación para:
- Cargar productos desde la base de datos
- Crear, editar y eliminar productos
- Gestionar el catálogo de productos

### 🧪 Verificar que la configuración funciona:

1. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Abre la consola del navegador (F12)
3. Si ves un mensaje de advertencia: `⚠️ Supabase URL o API Key no configuradas`, significa que el archivo `.env` no está configurado correctamente
4. Si no ves ningún error, la configuración está correcta ✅

---

## 2. Estructura de la Tabla en Supabase

Asegúrate de que tu tabla `products` tenga la siguiente estructura:

```sql
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  modelos_compatibles JSONB,
  imagen JSONB
);
```

## 3. Migrar Productos Existentes

Si ya tienes productos en `src/data/products.json`, puedes migrarlos a Supabase:

1. Ve a **Table Editor** en Supabase
2. Selecciona la tabla `products`
3. Haz clic en **Insert** > **Insert row**
4. Copia los datos de tu JSON

O usa el SQL Editor para insertar múltiples productos:

```sql
INSERT INTO products (id, nombre, descripcion, modelos_compatibles, imagen)
VALUES 
  ('bomba-engrenagem-4280520001', 'Bomba de Engrenagem 4280520001', 'Descripción...', '["4280520001", "3239915004"]', '"/productos/1.jpeg"'),
  -- ... más productos
```

## 4. Funcionalidades Implementadas

### ✅ CRUD Completo:
- **Create**: Botón flotante "+" para agregar productos
- **Read**: Los productos se cargan automáticamente desde Supabase
- **Update**: Botón de editar (✏️) en cada producto
- **Delete**: Botón de eliminar (🗑️) en cada producto

### 🔧 Botones de Administración:

- **Botón flotante**: Aparece en la esquina inferior derecha de la página de productos
- **Botones en productos**: Al hacer hover sobre un producto, aparecen botones de editar y eliminar

## 5. Sistema de Fallback Automático

### 🔄 ¿Qué es el fallback?

La aplicación tiene un sistema **automático de fallback** que garantiza que los productos siempre se muestren, incluso si Supabase no está disponible.

### 📋 Cómo funciona:

1. **Intenta cargar desde Supabase primero** (si está configurado)
2. **Si Supabase falla o no está configurado**, automáticamente carga los productos desde el archivo JSON local
3. Los productos del JSON están en `src/data/products.json`

### ✅ Escenarios donde se usa el fallback:

- **Supabase no configurado**: Si no hay variables de entorno en `.env`
- **Error de conexión**: Si no se puede conectar a Supabase
- **Tabla vacía**: Si la tabla `products` en Supabase no tiene datos
- **Error en la consulta**: Si hay algún problema al obtener los datos

### 📝 Archivos involucrados:

- `src/utils/productService.ts`: Contiene la lógica de fallback
- `src/data/products.json`: Archivo JSON con los productos de respaldo
- `src/pages/api/products.json.ts`: Endpoint de API que sirve el JSON
- `src/pages/productos.astro`: Página que carga los productos

### 🔍 Verificación en consola:

Al cargar la página, verás mensajes en la consola del navegador (F12):
- `✅ X productos cargados desde Supabase` - Cuando funciona Supabase
- `⚠️ Supabase no configurado. Cargando productos desde JSON...` - Cuando no está configurado
- `📦 Cargando productos desde JSON como fallback...` - Cuando Supabase falla

## 6. Notas Importantes

- Los productos se cargan desde Supabase al cargar la página, con fallback automático al JSON
- Si Supabase no está disponible o falla, la aplicación usa automáticamente el JSON como respaldo
- Las imágenes se almacenan como base64 (data URLs) o rutas de archivos
- Para ocultar los botones de administración en producción, cambia `display: flex` a `display: none` en el CSS de `.admin-actions`
- **El archivo JSON siempre debe mantenerse actualizado** como respaldo de los productos

## 7. Solución de Problemas

### Error: "Supabase URL o API Key no configuradas"
- Verifica que el archivo `.env` existe y tiene las variables correctas
- Reinicia el servidor de desarrollo después de crear/modificar `.env`

### Error: "Error al cargar desde Supabase"
- Verifica que la tabla `products` existe en tu proyecto
- Verifica que las columnas tienen los nombres correctos
- Revisa la consola del navegador para más detalles

### Los productos no se muestran
- Verifica que hay productos en la tabla de Supabase **o** en el archivo `src/data/products.json`
- Revisa que las variables de entorno están configuradas correctamente (si usas Supabase)
- La aplicación usará el JSON como fallback automáticamente si Supabase falla
- Abre la consola del navegador (F12) para ver mensajes sobre el origen de los datos

### Los productos se cargan desde JSON en lugar de Supabase
- Verifica que las variables de entorno están correctamente configuradas en `.env`
- Verifica que la URL y la clave de Supabase son correctas
- Revisa la consola del navegador para ver el mensaje de error específico
- Verifica que la tabla `products` existe y tiene datos en Supabase

