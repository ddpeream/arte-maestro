import { supabase } from "../lib/supabaseClient";

export async function testSupabaseConnection() {
  const { data, error } = await supabase.from("news").select("id").limit(1);

  if (error) {
    console.error("❌ Error conectando con Supabase:", error);
    return;
  }

  console.log("✅ Arte Maestro conectado con Supabase:", data);
}
