// src/app/formulas/page.jsx  (server component)

import { createClient } from "@supabase/supabase-js";
import FormulasClient from "./_Client";

// Revalidate at most once per minute (keep if you already had this)
export const revalidate = 60;

/** Server side: fetch formulas with *anon* creds only. */
export default async function FormulasPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: formulas, error } = await supabase
    .from("formulas")
    .select("id,title,prompt,category,images,refs")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase error:", error);
  }

  return <FormulasClient initial={formulas ?? []} />;
}