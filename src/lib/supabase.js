import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://spraizvmmkeojmlxufpg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwcmFpenZtbWtlb2ptbHh1ZnBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxNzc1MDYsImV4cCI6MjA5ODc1MzUwNn0.lm52nwFWj6g5Xo1qSCAckVj6c-302sxPma6T2Er4Hlw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const handleResponse = async (query) => {
    const { data, error } = await query;
    if (error) {
        console.error('Supabase error:', error);
        throw error;
    }
    return data;
};
