import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cvsyaazeukcyvdzkduwm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2c3lhYXpldWtjeXZkemtkdXdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA1NTEzMTEsImV4cCI6MjAzNjEyNzMxMX0.uPuXcxReNMpy-zWJY_2tABNIVXBDLEZnZtCf0sfybaE';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;