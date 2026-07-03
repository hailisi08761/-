import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || 'https://xksbhaplagfbgebxcrle.supabase.co';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_0BOqzPTmZk4DlU-9E_cxSA_7KwtVLwx';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

