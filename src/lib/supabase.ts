import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.')
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
)

// Test connection (only in development)
if (import.meta.env.DEV && supabaseUrl && supabaseAnonKey) {
  supabase
    .from('_test')
    .select('*')
    .limit(1)
    .then((result) => {
      if (result.error) {
        console.warn('⚠️ Supabase connection test failed:', result.error.message)
      } else {
        console.log('✅ Supabase connected successfully')
      }
    })
}
