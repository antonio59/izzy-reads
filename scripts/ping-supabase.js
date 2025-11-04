#!/usr/bin/env node

/**
 * Supabase Keep-Alive Script
 * 
 * This script pings your Supabase instance to prevent it from going to sleep
 * on the free tier. Can be run manually or via cron job.
 * 
 * Usage:
 *   node scripts/ping-supabase.js
 * 
 * Or via npm:
 *   npm run ping-supabase
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY

async function pingSupabase() {
  console.log('🔄 Pinging Supabase...')
  
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('❌ Error: Supabase credentials not found in environment variables')
    console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file')
    process.exit(1)
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    
    // Simple query to wake up the database
    const { data, error } = await supabase
      .from('books')
      .select('count')
      .limit(1)
    
    if (error && error.code !== 'PGRST116') {
      // PGRST116 = table doesn't exist, which is fine for keep-alive
      console.warn('⚠️  Warning:', error.message)
    }
    
    console.log('✅ Supabase pinged successfully!')
    console.log(`📅 Timestamp: ${new Date().toISOString()}`)
    console.log(`🌐 URL: ${SUPABASE_URL}`)
    
  } catch (error) {
    console.error('❌ Error pinging Supabase:', error.message)
    process.exit(1)
  }
}

// Run the ping
pingSupabase()
  .then(() => {
    console.log('\n✨ Keep-alive ping completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Ping failed:', error)
    process.exit(1)
  })
