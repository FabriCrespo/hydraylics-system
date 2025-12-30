# Instrucciones para Configurar Supabase

## 1. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

### Cómo obtener estos valores:

1. Ve a tu proyecto en [Supabase](https://supabase.com)
2. Ve a **Settings** > **API**
3. Copia:
   - **Project URL** → `PUBLIC_SUPABASE_URL`
   - **anon/public key** → `PUBLIC_SUPABASE_ANON_KEY`

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

## 5. Notas Importantes

- Los productos se cargan desde Supabase al cargar la página
- Si Supabase no está disponible, la aplicación usa el JSON como fallback
- Las imágenes se almacenan como base64 (data URLs) o rutas de archivos
- Para ocultar los botones de administración en producción, cambia `display: flex` a `display: none` en el CSS de `.admin-actions`

## 6. Solución de Problemas

### Error: "Supabase URL o API Key no configuradas"
- Verifica que el archivo `.env` existe y tiene las variables correctas
- Reinicia el servidor de desarrollo después de crear/modificar `.env`

### Error: "Error al cargar desde Supabase"
- Verifica que la tabla `products` existe en tu proyecto
- Verifica que las columnas tienen los nombres correctos
- Revisa la consola del navegador para más detalles

### Los productos no se muestran
- Verifica que hay productos en la tabla de Supabase
- Revisa que las variables de entorno están configuradas correctamente
- La aplicación usará el JSON como fallback si Supabase falla

