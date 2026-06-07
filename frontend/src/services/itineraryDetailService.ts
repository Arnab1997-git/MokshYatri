import { supabase } from "@/lib/supabase";

export async function getItineraryById(id: string) {
  const { data, error } = await supabase
    .from("itineraries")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}