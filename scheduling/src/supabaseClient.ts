import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uhisvkkifmmsyvqtoxkt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoaXN2a2tpZm1tc3l2cXRveGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwNTcxNTgsImV4cCI6MjA2OTYzMzE1OH0.1IdDqGs6XgJ-nbTw9_CUtaT62C_czYL4JL_VmDLCcYU';

export const supabase = createClient(supabaseUrl, supabaseKey);