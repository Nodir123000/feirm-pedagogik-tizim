const supabaseUrl = 'https://yumvdeuphwdkoqengyuu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1bXZkZXVwaHdka29xZW5neXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5MjY0ODksImV4cCI6MjA4NTUwMjQ4OX0.XKh299ZXKLpBP66vcN9MZS8FzK8gFZYAHZWw9meHfpo';

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
