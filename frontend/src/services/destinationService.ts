import { supabase } from "@/lib/supabase";

export async function getDestinations() {

  const { data, error } =
    await supabase
      .from("destinations")
      .select("*")
      .order("title");

  if (error) {

    console.error(error);

    return [];
  }

  return data || [];
}