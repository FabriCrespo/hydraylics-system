import { createClient } from '@supabase/supabase-js'

// Estas variables deben estar en tu archivo .env o configuradas directamente
// Por ahora las dejamos aquí, pero deberías moverlas a variables de entorno
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase URL o API Key no configuradas. Configura PUBLIC_SUPABASE_URL y PUBLIC_SUPABASE_ANON_KEY en tu archivo .env')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

