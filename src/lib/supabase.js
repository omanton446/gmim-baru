import { createClient } from '@supabase/supabase-js'

// Gunakan URL dan ANON KEY yang benar
const supabaseUrl = 'https://kpinybsmnkihffkbiigj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwaW55YnNtbmtpaGZma2JpaWdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyNTgyNDgsImV4cCI6MjA5OTgzNDI0OH0.W39AyOI_bS45iFVmwjdIhKA68WCib5DXkeIpC9OrE9w'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log('🔌 Supabase connected!')
console.log('📦 URL:', supabaseUrl)