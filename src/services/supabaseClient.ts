import { createClient } from '@supabase/supabase-js';

// ==============================================================================
// CLIENTE DO SUPABASE — FLYTOHUB
// ==============================================================================
// As credenciais são carregadas do arquivo .env.local via import.meta.env
// Se não estiverem configuradas ainda, o FlytoHUB funciona no modo autônomo.
// Assim que você preencher o .env.local, o sistema conecta automaticamente!
// ==============================================================================

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('seu-projeto')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
