import { createClient } from '@supabase/supabase-js';

// IMPORTANT: Replace these with your actual Supabase credentials
const supabaseUrl = 'https://yumvdeuphwdkoqengyuu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1bXZkZXVwaHdka29xZW5neXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0MDM0OTcsImV4cCI6MjA1NDAwNTQ5N30.i9wUPrf3pT87-X6s37_hX7I98A-k-K9-9r0Z_p-q-P4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Helper to handle Supabase responses
 */
export async function handleResponse(promise) {
    const { data, error } = await promise;
    if (error) {
        console.error('Supabase Error:', error);
        throw error;
    }
    return data;
}
