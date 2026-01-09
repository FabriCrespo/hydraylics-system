import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Estas variables deben estar en tu archivo .env o configuradas directamente
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || ''

// Crear el cliente solo si hay configuración válida
// Si no hay configuración, exportar null y se usará el fallback a JSON
let supabase: SupabaseClient | null = null

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.warn('⚠️ Error al crear cliente de Supabase:', error)
    supabase = null
  }
} else {
  console.warn('⚠️ Supabase URL o API Key no configuradas. Configura PUBLIC_SUPABASE_URL y PUBLIC_SUPABASE_ANON_KEY en tu archivo .env')
}

export { supabase }

