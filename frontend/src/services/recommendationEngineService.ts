import { supabase } from "@/lib/supabase";

export async function getRecommendedGems(
  personality: string
) {
  const { data: gems } = await supabase
    .from("hidden_gems")
    .select("*");

  if (!gems) return [];

  const scoringMap: Record<
    string,
    Record<string, number>
  > = {
    "Cinematic Explorer": {
      cinematic: 50,
      dreamy: 40,
      moody: 35,
      peaceful: 20,
    },

    "Soul Seeker": {
      spiritual: 50,
      peaceful: 45,
      dreamy: 20,
    },

    "Wanderlust Adventurer": {
      adventure: 50,
      moody: 20,
      cinematic: 15,
    },

    "Luxury Nomad": {
      luxury: 50,
      dreamy: 15,
    },

    "Cultural Storyteller": {
      spiritual: 20,
      peaceful: 20,
      cinematic: 15,
    },
  };

  const scores =
    scoringMap[personality] || {};

  return gems
    .map((gem) => ({
      ...gem,
      score:
        scores[
          gem.vibe?.toLowerCase()
        ] || 0,
    }))
    .sort(
      (a, b) =>
        b.score - a.score
    );
}