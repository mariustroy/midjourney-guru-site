// src/app/formulas/page.jsx (server component)

import { createClient } from "@supabase/supabase-js";
import FormulasClient from "./_Client";

export const revalidate = 0; // Temporarily disable caching for immediate results

export default async function FormulasPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { data: formulas, error } = await supabase
    .from("formulas")
    .select("*") // simplified for debugging
    .order("created_at", { ascending: false });

  console.log("Fetched formulas (full):", JSON.stringify(formulas, null, 2));
  if (error) {
    console.error("Supabase error (full query):", error);
    return <div>Supabase Error: {error.message}</div>;
  }

  return (
    <div>
      <pre>{JSON.stringify(formulas, null, 2)}</pre>
      <FormulasClient initial={formulas ?? []} />
    </div>
  );
}