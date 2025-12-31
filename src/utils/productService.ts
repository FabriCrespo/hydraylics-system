import { supabase } from './supabaseClient'

export interface Product {
  id: string
  nombre: string
  descripcion: string
  modelos_compatibles: string[]
  imagen: string | string[]
}

export const productService = {
  /**
   * Obtener todos los productos
   */
  async getAll(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('nombre', { ascending: true })

      if (error) {
        console.error('Error al obtener productos:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Error en getAll:', error)
      return []
    }
  },

  /**
   * Obtener un producto por ID
   */
  async getById(id: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error al obtener producto:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error en getById:', error)
      return null
    }
  },

  /**
   * Crear un nuevo producto
   */
  async create(product: Omit<Product, 'id'> & { id?: string }): Promise<Product | null> {
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
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id')
        .ilike('nombre', nombre)
        .limit(1)

      if (error) {
        console.error('Error al verificar producto:', error)
        return false
      }

      return (data?.length || 0) > 0
    } catch (error) {
      console.error('Error en existsByName:', error)
      return false
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

