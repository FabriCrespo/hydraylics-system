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

/**
 * Cargar productos desde el archivo JSON directamente (sin endpoint)
 */
function loadProductsFromJson(): Product[] {
  console.log('🔄 [loadProductsFromJson] Cargando productos desde JSON directo...')
  try {
    console.log('📦 [loadProductsFromJson] JSON importado, cantidad de productos:', productsJsonData?.length || 0)
    console.log('📋 [loadProductsFromJson] Primeros productos:', productsJsonData?.slice(0, 3)?.map((p: any) => ({ id: p.id, nombre: p.nombre })))
    
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
    
    console.log('✅ [loadProductsFromJson] Productos normalizados:', normalizedProducts.length)
    console.log('🔍 [loadProductsFromJson] IDs de productos:', normalizedProducts.map((p: Product) => p.id))
    
    // Verificar si están los nuevos productos
    const nuevosProductos = normalizedProducts.filter((p: Product) => 
      p.id.includes('rexroth') || p.id.includes('kit-componentes')
    )
    console.log('🆕 [loadProductsFromJson] Productos REXROTH encontrados:', nuevosProductos.length)
    nuevosProductos.forEach((p: Product) => {
      console.log('  -', p.id, ':', p.nombre)
    })
    
    return normalizedProducts
  } catch (error) {
    console.error('❌ [loadProductsFromJson] Error al cargar productos desde JSON:', error)
    return []
  }
}

export const productService = {
  /**
   * Obtener todos los productos
   * Intenta cargar desde Supabase primero, si falla usa el JSON como fallback
   */
  async getAll(): Promise<Product[]> {
    console.log('🚀 [productService.getAll] Iniciando obtención de productos...')
    console.log('🔧 [productService.getAll] Supabase configurado:', !!supabase)
    
    // Si no hay cliente de Supabase configurado, usar JSON directamente
    if (!supabase) {
      console.warn('⚠️ [productService.getAll] Supabase no configurado. Cargando productos desde JSON...')
      const productos = loadProductsFromJson()
      console.log('✅ [productService.getAll] Productos obtenidos desde JSON:', productos.length)
      return productos
    }

    try {
      console.log('🔍 [productService.getAll] Consultando Supabase...')
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('nombre', { ascending: true })

      if (error) {
        console.warn('⚠️ [productService.getAll] Error al obtener productos desde Supabase:', error.message)
        console.info('📦 [productService.getAll] Cargando productos desde JSON como fallback...')
        const productos = loadProductsFromJson()
        console.log('✅ [productService.getAll] Productos obtenidos desde JSON (fallback):', productos.length)
        return productos
      }

      // Si no hay productos en Supabase, usar JSON como fallback
      if (!data || data.length === 0) {
        console.warn('⚠️ [productService.getAll] No se encontraron productos en Supabase')
        console.info('📦 [productService.getAll] Cargando productos desde JSON como fallback...')
        const productos = loadProductsFromJson()
        console.log('✅ [productService.getAll] Productos obtenidos desde JSON (fallback):', productos.length)
        return productos
      }

      console.log(`✅ [productService.getAll] ${data.length} productos cargados desde Supabase`)
      console.log('🔍 [productService.getAll] IDs de productos desde Supabase:', data.map((p: Product) => p.id))
      return data
    } catch (error) {
      console.error('❌ [productService.getAll] Error al conectar con Supabase:', error)
      console.info('📦 [productService.getAll] Cargando productos desde JSON como fallback...')
      const productos = loadProductsFromJson()
      console.log('✅ [productService.getAll] Productos obtenidos desde JSON (fallback):', productos.length)
      return productos
    }
  },

  /**
   * Obtener un producto por ID
   */
  async getById(id: string): Promise<Product | null> {
    if (!supabase) {
      console.warn('⚠️ Supabase no configurado. Buscando producto en JSON...')
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
        console.error('Error al obtener producto:', error)
        // Intentar buscar en JSON como fallback
        const products = loadProductsFromJson()
        return products.find(p => p.id === id) || null
      }

      return data
    } catch (error) {
      console.error('Error en getById:', error)
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
        console.error('Error al crear producto:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Error en create:', error)
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
        console.error('Error al actualizar producto:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Error en update:', error)
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
        console.error('Error al eliminar producto:', error)
        throw error
      }

      return true
    } catch (error) {
      console.error('Error en delete:', error)
      throw error
    }
  },

  /**
   * Verificar si existe un producto con el mismo nombre
   */
  async existsByName(nombre: string): Promise<boolean> {
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
        console.error('Error al verificar producto:', error)
        // Buscar en JSON como fallback
        const products = loadProductsFromJson()
        return products.some(p => p.nombre.toLowerCase() === nombre.toLowerCase())
      }

      return (data?.length || 0) > 0
    } catch (error) {
      console.error('Error en existsByName:', error)
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

