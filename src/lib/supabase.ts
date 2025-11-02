import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if valid Supabase credentials are provided
const hasValidCredentials = 
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'your-project-url-here' &&
  (supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://'))

if (!hasValidCredentials) {
  console.warn('⚠️ Supabase not configured. Using mock client. Add real credentials to .env for authentication.')
}

// Create Supabase client with fallback to dummy URL
export const supabase = createClient(
  hasValidCredentials ? supabaseUrl : 'https://placeholder.supabase.co',
  hasValidCredentials ? supabaseAnonKey : 'placeholder-key'
)

// Test connection (only in development and if valid credentials)
if (import.meta.env.DEV && hasValidCredentials) {
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
