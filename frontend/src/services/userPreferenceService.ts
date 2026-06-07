import { supabase } from "@/lib/supabase";

export async function getUserLikedVibes(
  userId: string
) {
  const { data } = await supabase
    .from("gem_likes")
    .select(`
      gem_id,
      hidden_gems (
        vibe
      )
    `)
    .eq("user_id", userId);

  return (
    data?.map(
      (item: any) =>
        item.hidden_gems?.vibe
    ) || []
  );
}

export async function getUserBookmarkedVibes(
  userId: string
) {
  const { data } = await supabase
    .from("gem_bookmarks")
    .select(`
      gem_id,
      hidden_gems (
        vibe
      )
    `)
    .eq("user_id", userId);

  return (
    data?.map(
      (item: any) =>
        item.hidden_gems?.vibe
    ) || []
  );
}