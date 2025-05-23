// src/lib/supabaseServer.ts
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

/**
 * Returns a Supabase client for use inside **Server Components**
 * (App-router pages, layouts, Route Handlers, etc.).
 * It automatically forwards the browser cookies so that RLS works.
 */
export function supabase() {
  return createServerComponentClient({ cookies });
}