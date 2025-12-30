# Guía: Dónde Poner las Imágenes de los Productos

Tienes **2 opciones** para manejar las imágenes de los productos:

## Opción 1: Mantener Imágenes en `public/productos/` (Recomendada para empezar) ✅

**Ventajas:**
- ✅ Más simple y rápido
- ✅ No requiere configuración adicional
- ✅ Las imágenes ya están en tu proyecto
- ✅ Funciona inmediatamente

**Cómo funciona:**
- Las imágenes ya están en `public/productos/`
- Las rutas en Supabase serán: `"/productos/1.jpeg"`, `"/productos/bomb (1).jpeg"`, etc.
- Astro sirve estas imágenes automáticamente desde `public/`

**Estructura actual:**
```
public/
  productos/
    1.jpeg
    2.jpeg
    3.jpg
    bomb (1).jpeg
    bomb (2).jpeg
    ...
```

**No necesitas hacer nada más** - el script de migración usará las rutas actuales.

---

## Opción 2: Subir Imágenes a Supabase Storage (Más profesional) 🚀

**Ventajas:**
- ✅ Imágenes centralizadas en Supabase
- ✅ CDN automático (carga más rápida)
- ✅ Escalable para muchos productos
- ✅ Gestión de imágenes desde Supabase

**Desventajas:**
- ⚠️ Requiere configuración adicional
- ⚠️ Más pasos para subir imágenes

**Pasos para usar Supabase Storage:**

### 1. Crear bucket en Supabase Storage

1. Ve a tu proyecto en Supabase
2. Ve a **Storage** en el menú lateral
3. Crea un nuevo bucket llamado `productos`
4. Configura como **Public** (para que las imágenes sean accesibles)

### 2. Subir imágenes manualmente

1. En Storage > `productos`, haz clic en **Upload**
2. Sube todas las imágenes de `public/productos/`
3. Copia las URLs públicas de cada imagen

### 3. Actualizar rutas en productos

Las rutas cambiarían de:
```json
"/productos/1.jpeg"
```

A:
```json
"https://omapsbxeyttgvatwfdki.supabase.co/storage/v1/object/public/productos/1.jpeg"
```

---

## Recomendación

**Para empezar:** Usa la **Opción 1** (mantener en `public/productos/`)

- Es más simple
- Funciona inmediatamente
- Puedes migrar a Supabase Storage después si lo necesitas

**Para producción a largo plazo:** Considera la **Opción 2** (Supabase Storage)

- Mejor rendimiento
- Escalable
- Gestión centralizada

---

## Script de Migración

El script `migrateProductsToSupabase.js` usará las rutas actuales del JSON, que apuntan a `public/productos/`. Esto funcionará perfectamente sin cambios adicionales.

