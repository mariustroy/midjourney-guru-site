// src/app/formulas/page.jsx (server component)
import { supabase } from "@/lib/supabaseServer";
import FormulasClient from "./_Client";

export const dynamic = "force-dynamic";  // skip static prerender

export default async function FormulasPage() {
  const { data: formulas, error } = await supabase()
    .from("formulas")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase error:", error);  // shows up in Vercel logs
  }

  // send an empty array if we couldn’t fetch
  return <FormulasClient initial={formulas ?? []} />;
}