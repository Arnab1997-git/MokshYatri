import { supabase } from "@/lib/supabase";

export async function getPublicTrips() {
  const { data, error } = await supabase
    .from("itineraries")
    .select(`
      *,
      profiles (
        username,
        full_name,
        travel_style
      )
    `)
    .eq("is_public", true)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}