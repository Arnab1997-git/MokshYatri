import { supabase } from "@/lib/supabase";

export async function getPublicTripById(id: string) {
  const { data, error } = await supabase
    .from("itineraries")
    .select(`
      *,
      profiles (
        full_name,
        username,
        home_city,
        travel_style
      )
    `)
    .eq("id", id)
    .eq("is_public", true)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}