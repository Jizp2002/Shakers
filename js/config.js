const SUPABASE_URL = 'https://agpfeleclitvswvqzakr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFncGZlbGVjbGl0dnN3dnF6YWtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1ODE2ODIsImV4cCI6MjA4MzE1NzY4Mn0.tXlgeDLf0ZoM_PXWqpAtAgBH1fBxjSnI7lcetJ2j_4w';

// Initialize Supabase Client
// Initialize Supabase Client
// We overwrite the library object with the client instance
// Initialize Supabase Client
// We overwrite the library object with the client instance
if (typeof window.supabase !== 'undefined') {
    if (window.supabase.createClient) {
        // It's the library, initialize it
        window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('Supabase Initialized (Library -> Client)');
    } else if (window.supabase.auth) {
        // It's already the client
        console.log('Supabase check: Already initialized');
    } else {
        console.error('Supabase object found but weird state:', window.supabase);
    }
} else {
    console.error('Supabase library not loaded! Check script tags.');
}
