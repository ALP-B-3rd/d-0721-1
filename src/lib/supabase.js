import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ogpdfzqvdxyxxvxenfpc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ncGRmenF2ZHh5eHh2eGVuZnBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxNjM2ODQsImV4cCI6MjA2ODczOTY4NH0.Qsq6Tu-Uw_x3bfj7s2EABFD4vo3qRBIqNX7WwQtkEO8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 