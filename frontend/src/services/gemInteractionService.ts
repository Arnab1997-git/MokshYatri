import { supabase } from "@/lib/supabase";

export async function likeGem(
  gemId: number,
  userId: string
) {
  const { error } = await supabase
    .from("gem_likes")
    .insert([
      {
        gem_id: gemId,
        user_id: userId,
      },
    ]);

  if (error) {
    console.error(error);
    return false;
  }

  return true;
}

export async function unlikeGem(
  gemId: number,
  userId: string
) {
  const { error } = await supabase
    .from("gem_likes")
    .delete()
    .eq("gem_id", gemId)
    .eq("user_id", userId);

  if (error) {
    console.error(error);
    return false;
  }

  return true;
}

export async function hasUserLikedGem(
  gemId: number,
  userId: string
) {
  const { data } = await supabase
    .from("gem_likes")
    .select("id")
    .eq("gem_id", gemId)
    .eq("user_id", userId)
    .maybeSingle();

  return !!data;
}

export async function bookmarkGem(
  gemId: number,
  userId: string
) {
  const { error } = await supabase
    .from("gem_bookmarks")
    .insert([
      {
        gem_id: gemId,
        user_id: userId,
      },
    ]);

  if (error) {
    console.error(error);
    return false;
  }

  return true;
}

export async function removeBookmark(
  gemId: number,
  userId: string
) {
  const { error } = await supabase
    .from("gem_bookmarks")
    .delete()
    .eq("gem_id", gemId)
    .eq("user_id", userId);

  if (error) {
    console.error(error);
    return false;
  }

  return true;
}

export async function hasUserBookmarkedGem(
  gemId: number,
  userId: string
) {
  const { data } = await supabase
    .from("gem_bookmarks")
    .select("id")
    .eq("gem_id", gemId)
    .eq("user_id", userId)
    .maybeSingle();

  return !!data;
}

export async function getGemLikes(
  gemId: number
) {
  const { count } = await supabase
    .from("gem_likes")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("gem_id", gemId);

  return count || 0;
}
export async function getSavedGems(
  userId: string
) {

  const { data, error } =
    await supabase
      .from("gem_bookmarks")
      .select("*")
      .eq(
        "user_id",
        userId
      );

  if (error) {

    console.error(error);

    return [];
  }

  return data || [];
}