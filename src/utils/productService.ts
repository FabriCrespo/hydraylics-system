import { supabase } from './supabaseClient'

export interface Product {
  id: string
  nombre: string
  descripcion: string
  modelos_compatibles: string[]
  imagen: string | string[]
}

// Importar directamente el JSON como datos mock
import productsJsonData from '../data/products.json'

// Caché en memoria para optimizar llamadas a Supabase
// Nota: En Vercel (serverless), cada request puede ir a un servidor diferente,
// por lo que el caché solo funciona dentro de la misma función/request
let productsCache: { data: Product[]; timestamp: number; source: 'supabase' | 'json' } | null = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

// En producción/serverless, usar caché más corto para evitar datos obsoletos
const effectiveCacheDuration = isServer && !isDev ? 1 * 60 * 1000 : CACHE_DURATION // 1 min en servidor, 5 min en dev

// Detectar si estamos en desarrollo o en servidor
const isDev = import.meta.env.DEV
const isServer = typeof window === 'undefined'

// Función helper para logs condicionales
const log = (...args: any[]) => {
  if (isDev) {
    console.log(...args)
  }
}

const logWarn = (...args: any[]) => {
  if (isDev) {
    console.warn(...args)
  }
}

const logError = (...args: any[]) => {
  // Errores siempre se muestran
  console.error(...args)
}

/**
 * Cargar productos desde el archivo JSON directamente (sin endpoint)
 */
function loadProductsFromJson(): Product[] {
  log('🔄 [loadProductsFromJson] Cargando productos desde JSON directo...')
  try {
    // Normalizar los datos del JSON para asegurar el formato correcto
    const normalizedProducts = productsJsonData.map((product: any) => ({
      id: product.id,
      nombre: product.nombre,
      descripcion: product.descripcion || '',
      modelos_compatibles: Array.isArray(product.modelos_compatibles) 
        ? product.modelos_compatibles 
        : [],
      imagen: product.imagen || '',
    }))
    
    log('✅ [loadProductsFromJson] Productos normalizados:', normalizedProducts.length)
    
    return normalizedProducts
  } catch (error) {
    logError('❌ [loadProductsFromJson] Error al cargar productos desde JSON:', error)
    return []
  }
}

export const productService = {
  /**
   * Invalidar el caché de productos
   * Se llama automáticamente después de create, update o delete
   */
  invalidateCache(): void {
    productsCache = null
    log('🗑️ [productService] Caché invalidado')
  },

  /**
   * Obtener todos los productos
   * Intenta cargar desde Supabase primero, si falla usa el JSON como fallback
   * Usa caché en memoria para evitar múltiples llamadas a Supabase
   */
  async getAll(): Promise<Product[]> {
    // Verificar si hay caché válido
    if (productsCache && Date.now() - productsCache.timestamp < effectiveCacheDuration) {
      log('📦 [productService.getAll] Usando caché (', Math.round((Date.now() - productsCache.timestamp) / 1000), 's)')
      return productsCache.data
    }
    
    log('🚀 [productService.getAll] Iniciando obtención de productos...')
    
    // Si no hay cliente de Supabase configurado, usar JSON directamente
    if (!supabase) {
      logWarn('⚠️ [productService.getAll] Supabase no configurado. Cargando productos desde JSON...')
      const productos = loadProductsFromJson()
      // Guardar en caché
      productsCache = { data: productos, timestamp: Date.now(), source: 'json' }
      log('✅ [productService.getAll] Productos obtenidos desde JSON:', productos.length)
      return productos
    }

    try {
      log('🔍 [productService.getAll] Consultando Supabase...')
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('nombre', { ascending: true })

      if (error) {
        logWarn('⚠️ [productService.getAll] Error al obtener productos desde Supabase:', error.message)
        log('📦 [productService.getAll] Cargando productos desde JSON como fallback...')
        const productos = loadProductsFromJson()
        // Guardar en caché
        productsCache = { data: productos, timestamp: Date.now(), source: 'json' }
        log('✅ [productService.getAll] Productos obtenidos desde JSON (fallback):', productos.length)
        return productos
      }

      // Si no hay productos en Supabase, usar JSON como fallback
      if (!data || data.length === 0) {
        logWarn('⚠️ [productService.getAll] No se encontraron productos en Supabase')
        log('📦 [productService.getAll] Cargando productos desde JSON como fallback...')
        const productos = loadProductsFromJson()
        // Guardar en caché
        productsCache = { data: productos, timestamp: Date.now(), source: 'json' }
        log('✅ [productService.getAll] Productos obtenidos desde JSON (fallback):', productos.length)
        return productos
      }

      // Guardar en caché
      productsCache = { data, timestamp: Date.now(), source: 'supabase' }
      log(`✅ [productService.getAll] ${data.length} productos cargados desde Supabase`)
      return data
    } catch (error) {
      logError('❌ [productService.getAll] Error al conectar con Supabase:', error)
      log('📦 [productService.getAll] Cargando productos desde JSON como fallback...')
      const productos = loadProductsFromJson()
      // Guardar en caché
      productsCache = { data: productos, timestamp: Date.now(), source: 'json' }
      log('✅ [productService.getAll] Productos obtenidos desde JSON (fallback):', productos.length)
      return productos
    }
  },

  /**
   * Obtener un producto por ID
   * Primero busca en caché, luego en Supabase
   */
  async getById(id: string): Promise<Product | null> {
    // Buscar primero en caché si está disponible
    if (productsCache && Date.now() - productsCache.timestamp < effectiveCacheDuration) {
      const cached = productsCache.data.find(p => p.id === id)
      if (cached) {
        log('📦 [productService.getById] Producto encontrado en caché:', id)
        return cached
      }
    }

    if (!supabase) {
      logWarn('⚠️ Supabase no configurado. Buscando producto en JSON...')
      const products = loadProductsFromJson()
      return products.find(p => p.id === id) || null
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        logError('Error al obtener producto:', error)
        // Intentar buscar en JSON como fallback
        const products = loadProductsFromJson()
        return products.find(p => p.id === id) || null
      }

      return data
    } catch (error) {
      logError('Error en getById:', error)
      // Intentar buscar en JSON como fallback
      const products = loadProductsFromJson()
      return products.find(p => p.id === id) || null
    }
  },

  /**
   * Crear un nuevo producto
   */
  async create(product: Omit<Product, 'id'> & { id?: string }): Promise<Product | null> {
    if (!supabase) {
      throw new Error('No se puede crear producto: Supabase no está configurado. Configura las variables de entorno PUBLIC_SUPABASE_URL y PUBLIC_SUPABASE_ANON_KEY')
    }

    try {
      // Generar ID si no se proporciona
      const productId = product.id || this.generateId(product.nombre)

      const productData = {
        id: productId,
        nombre: product.nombre,
        descripcion: product.descripcion,
        modelos_compatibles: product.modelos_compatibles,
        imagen: product.imagen,
      }

      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single()

      if (error) {
        logError('Error al crear producto:', error)
        throw error
      }

      // Invalidar caché después de crear
      this.invalidateCache()

      return data
    } catch (error) {
      logError('Error en create:', error)
      throw error
    }
  },

  /**
   * Actualizar un producto existente
   */
  async update(id: string, product: Partial<Omit<Product, 'id'>>): Promise<Product | null> {
    if (!supabase) {
      throw new Error('No se puede actualizar producto: Supabase no está configurado. Configura las variables de entorno PUBLIC_SUPABASE_URL y PUBLIC_SUPABASE_ANON_KEY')
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .update(product)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        logError('Error al actualizar producto:', error)
        throw error
      }

      // Invalidar caché después de actualizar
      this.invalidateCache()

      return data
    } catch (error) {
      logError('Error en update:', error)
      throw error
    }
  },

  /**
   * Eliminar un producto
   */
  async delete(id: string): Promise<boolean> {
    if (!supabase) {
      throw new Error('No se puede eliminar producto: Supabase no está configurado. Configura las variables de entorno PUBLIC_SUPABASE_URL y PUBLIC_SUPABASE_ANON_KEY')
    }

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) {
        logError('Error al eliminar producto:', error)
        throw error
      }

      // Invalidar caché después de eliminar
      this.invalidateCache()

      return true
    } catch (error) {
      logError('Error en delete:', error)
      throw error
    }
  },

  /**
   * Verificar si existe un producto con el mismo nombre
   * Primero busca en caché si está disponible
   */
  async existsByName(nombre: string): Promise<boolean> {
    // Buscar primero en caché si está disponible
    if (productsCache && Date.now() - productsCache.timestamp < effectiveCacheDuration) {
      const exists = productsCache.data.some(p => p.nombre.toLowerCase() === nombre.toLowerCase())
      if (exists) {
        log('📦 [productService.existsByName] Producto encontrado en caché:', nombre)
        return true
      }
    }

    if (!supabase) {
      // Buscar en JSON como fallback
      const products = loadProductsFromJson()
      return products.some(p => p.nombre.toLowerCase() === nombre.toLowerCase())
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('id')
        .ilike('nombre', nombre)
        .limit(1)

      if (error) {
        logError('Error al verificar producto:', error)
        // Buscar en JSON como fallback
        const products = loadProductsFromJson()
        return products.some(p => p.nombre.toLowerCase() === nombre.toLowerCase())
      }

      return (data?.length || 0) > 0
    } catch (error) {
      logError('Error en existsByName:', error)
      // Buscar en JSON como fallback
      const products = loadProductsFromJson()
      return products.some(p => p.nombre.toLowerCase() === nombre.toLowerCase())
    }
  },

  /**
   * Generar un ID único basado en el nombre del producto
   */
  generateId(nombre: string): string {
    return nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
      .replace(/[^a-z0-9]+/g, '-') // Reemplazar caracteres especiales con guiones
      .replace(/^-+|-+$/g, '') // Eliminar guiones al inicio y final
      .substring(0, 100) // Limitar longitud
  },
}

