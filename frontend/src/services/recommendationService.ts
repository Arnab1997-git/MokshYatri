import { supabase } from "@/lib/supabase";

export async function getRecommendedGems() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data: profile } = await supabase
    .from("profiles")
    .select("travel_style")
    .eq("id", user.id)
    .single();

  if (!profile?.travel_style) {
    return [];
  }

  const style = profile.travel_style.toLowerCase();

  let matchingVibes: string[] = [];

  switch (style) {
    case "cinematic":
      matchingVibes = [
        "cinematic",
        "dreamy",
        "moody",
      ];
      break;

    case "spiritual":
      matchingVibes = [
        "peaceful",
        "spiritual",
      ];
      break;

    case "adventure":
      matchingVibes = [
        "adventure",
        "wild",
      ];
      break;

    case "luxury":
      matchingVibes = [
        "luxury",
        "premium",
      ];
      break;

    default:
      matchingVibes = [style];
  }

  const { data, error } = await supabase
    .from("hidden_gems")
    .select("*");

  if (error) {
    console.error(error);
    return [];
  }

  return (
    data?.filter((gem) =>
      matchingVibes.includes(
        gem.vibe?.toLowerCase() || ""
      )
    ) || []
  );
}