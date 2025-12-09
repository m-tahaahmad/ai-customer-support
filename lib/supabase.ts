import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase URL and Anon Key must be provided as environment variables');
}

/**
 * Client-side Supabase client
 * Use this in client components and browser-side code
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Server-side Supabase client
 * Use this in API routes and server components
 */
export function createServerClient() {
    return createClient(supabaseUrl, supabaseAnonKey);
}

