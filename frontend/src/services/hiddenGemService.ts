import { supabase } from "@/lib/supabase";

export async function getHiddenGems() {
  const { data, error } = await supabase
    .from("hidden_gems")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}