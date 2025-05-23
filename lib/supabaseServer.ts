// lib/supabaseServer.ts
import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export function supabase() {
  return createServerComponentSupabaseClient({ cookies });
}