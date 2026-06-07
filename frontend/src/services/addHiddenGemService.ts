import { supabase } from "@/lib/supabase";

export async function addHiddenGem(
  gem: {
    title: string;
    location: string;
    description: string;
    vibe: string;
    image_url: string;
    user_id?: string;
  }
) {
  const { error } = await supabase
    .from("hidden_gems")
    .insert([gem]);

  if (error) {
    console.error(error);
    return false;
  }

  return true;
}