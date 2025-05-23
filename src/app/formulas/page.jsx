// *** SERVER COMPONENT – no "use client" here ***
import { supabase } from "@/lib/supabaseServer";   // helper shown earlier
import FormulasClient from "./_Client";            // interactive UI

// Incremental static regeneration: rebuild every 2 minutes
export const revalidate = 120;

export default async function FormulasPage() {
  // pull every column from the 'formulas' table
  const { data: formulas, error } = await supabase()
    .from("formulas")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    throw new Error("Failed to load formulas");
  }

  return <FormulasClient initial={formulas ?? []} />;
}