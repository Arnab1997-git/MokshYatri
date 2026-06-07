import { supabase } from "@/lib/supabase";

export async function updateProfile(
  id: string,
  updates: Partial<{
    full_name: string;
    username: string;
    bio: string;
    home_city: string;
    travel_style: string;
    travel_personality: string;
    avatar_url: string;
  }>
) {
  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", id);

  if (error) {
    console.error(error);
    return false;
  }

  return true;
}