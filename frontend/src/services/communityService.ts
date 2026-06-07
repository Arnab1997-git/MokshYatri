import { supabase } from "@/lib/supabase";

export async function publishTrip(id: string) {
  const { error } = await supabase
    .from("itineraries")
    .update({
      is_public: true,
    })
    .eq("id", id);

  if (error) {
    console.error(error);
    return false;
  }

  return true;
}