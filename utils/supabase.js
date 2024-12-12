import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcxyyxsiuhhywynwmyrm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjeHl5eHNpdWhoeXd5bndteXJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQwMTA2NDgsImV4cCI6MjA0OTU4NjY0OH0.2byIygcsjM2oCowpuTHPb9miz7WIAWgovsXnPakAVTg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
// quittance
// paswword : Leanaatlan3!