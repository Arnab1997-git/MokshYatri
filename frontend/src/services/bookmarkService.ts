import { supabase } from "@/lib/supabase";

export async function getBookmarkedGems(
  userId: string
) {
  const { data, error } = await supabase
    .from("gem_bookmarks")
    .select(`
      hidden_gems (
        *
      )
    `)
    .eq("user_id", userId);

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}