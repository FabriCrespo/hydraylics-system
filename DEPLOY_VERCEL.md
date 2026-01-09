# Guía de Deployment en Vercel

## ✅ Compatibilidad con SSR

El proyecto está **100% compatible** con Vercel. Astro soporta SSR nativamente en Vercel.

## 📋 Pasos para Deploy en Vercel

### 1. Configurar Variables de Entorno en Vercel

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Ve a **Settings** > **Environment Variables**
3. Agrega las siguientes variables:

```
PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

**Importante:** 
- Las variables que empiezan con `PUBLIC_` están disponibles tanto en servidor como en cliente
- No uses `PUBLIC_` para variables secretas (aunque en este caso, la anon key es pública por diseño)

### 2. Conectar tu Repositorio

1. En Vercel Dashboard, haz clic en **Add New Project**
2. Conecta tu repositorio de GitHub/GitLab/Bitbucket
3. Vercel detectará automáticamente que es un proyecto Astro

### 3. Configuración Automática

Vercel detectará automáticamente:
- ✅ Framework: Astro
- ✅ Build Command: `npm run build`
- ✅ Output Directory: `dist`
- ✅ Node.js Version: Automático

### 4. Deploy

1. Haz clic en **Deploy**
2. Vercel construirá y desplegará tu proyecto
3. ¡Listo! Tu sitio estará en `tu-proyecto.vercel.app`

## 🔧 Optimizaciones para Vercel

### Caché en Serverless

El código está optimizado para Vercel:
- **Caché más corto en servidor** (1 minuto) para evitar datos obsoletos en serverless
- **Caché más largo en desarrollo** (5 minutos) para mejor experiencia local
- **Fallback automático** a JSON si Supabase falla

### Rendimiento

- ✅ **SSR**: Los productos se cargan en el servidor (mejor SEO y rendimiento)
- ✅ **Caché inteligente**: Reduce llamadas a Supabase
- ✅ **Sin polling**: No hay consultas innecesarias
- ✅ **Fallback robusto**: Si Supabase falla, usa JSON automáticamente

## 🚨 Solución de Problemas

### Error: "Supabase URL o API Key no configuradas"

**Solución:** Asegúrate de agregar las variables de entorno en Vercel:
1. Ve a Settings > Environment Variables
2. Agrega `PUBLIC_SUPABASE_URL` y `PUBLIC_SUPABASE_ANON_KEY`
3. Haz un nuevo deploy

### Error: "Cannot find module"

**Solución:** Asegúrate de que `package.json` tenga todas las dependencias:
```bash
npm install
```

### Los productos no se cargan

**Solución:** 
1. Verifica que las variables de entorno estén configuradas
2. Verifica que la tabla `products` exista en Supabase
3. Revisa los logs de Vercel para ver errores

## 📊 Monitoreo

### Ver Logs en Vercel

1. Ve a tu proyecto en Vercel Dashboard
2. Haz clic en **Deployments**
3. Selecciona un deployment
4. Haz clic en **Functions** para ver logs del servidor

### Verificar que SSR funciona

1. Abre tu sitio en Vercel
2. Haz clic derecho > "Ver código fuente"
3. Deberías ver el HTML con los productos ya renderizados (no solo `<div id="productosGrid"></div>`)

## 💡 Notas Importantes

1. **Variables de Entorno**: Las variables `PUBLIC_*` están disponibles en servidor y cliente
2. **Caché**: En Vercel (serverless), el caché funciona dentro de cada request, no entre requests
3. **Build Time**: El build puede tardar 1-2 minutos la primera vez
4. **Cold Start**: La primera request después de inactividad puede tardar ~1 segundo (normal en serverless)

## ✅ Checklist Pre-Deploy

- [ ] Variables de entorno configuradas en Vercel
- [ ] `package.json` tiene todas las dependencias
- [ ] Build local funciona: `npm run build`
- [ ] Preview local funciona: `npm run preview`
- [ ] Productos se cargan correctamente en local

## 🎉 ¡Listo!

Una vez configurado, cada push a tu repositorio desplegará automáticamente en Vercel.
