import { supabase } from "@/lib/supabase";

export async function getProfileStats(
  userId: string
) {
  const { count: likes } =
    await supabase
      .from("gem_likes")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("user_id", userId);

  const { count: bookmarks } =
    await supabase
      .from("gem_bookmarks")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("user_id", userId);

  const { count: journeys } =
    await supabase
      .from("itineraries")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("user_id", userId);

  return {
    likes: likes || 0,
    bookmarks: bookmarks || 0,
    journeys: journeys || 0,
  };
}