import { supabase } from "@/lib/supabase";

export async function getStories() {
  const { data, error } = await supabase
    .from("stories")
    .select("*");

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}