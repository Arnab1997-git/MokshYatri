import { supabase } from "@/lib/supabase";

export async function getRelevantGems(style: string) {
  const { data, error } = await supabase
    .from("hidden_gems")
    .select("*");

  if (error) {
    console.error(error);
    return [];
  }

  const travelStyle = style.toLowerCase();

  let matchingVibes: string[] = [];

  switch (travelStyle) {
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

    default:
      matchingVibes = [travelStyle];
  }

  return data.filter((gem) =>
    matchingVibes.includes(
      gem.vibe?.toLowerCase() || ""
    )
  );
}