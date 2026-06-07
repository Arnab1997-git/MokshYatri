import { supabase } from "@/lib/supabase";

export async function getHiddenGemById(id: string) {
  const { data, error } = await supabase
    .from("hidden_gems")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}