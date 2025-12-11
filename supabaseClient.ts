import { createClient } from '@supabase/supabase-js';

// --- SUPABASE CONFIGURATION ---
// Replace these with your project credentials from https://app.supabase.com
const SUPABASE_URL: string = 'https://wbfuimwaujvmwjzgwomb.supabase.co';
const SUPABASE_ANON_KEY: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndiZnVpbXdhdWp2bXdqemd3b21iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0NjgzMzgsImV4cCI6MjA4MTA0NDMzOH0.rbwQJegbFFOpFw0qnukCRmsIl7A6lIGbvq96EaUxa-0';

// Check if keys appear valid (basic length check and domain check)
export const isConfigured = 
    SUPABASE_URL.includes('supabase.co') && 
    SUPABASE_ANON_KEY.length > 10;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);