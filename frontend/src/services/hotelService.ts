import { supabase } from "@/lib/supabase";

export async function getHotels() {

  const { data, error } =
    await supabase
      .from("hotels")
      .select(`
        id,
        name,
        location_id,
        accommodation_type,
        pricing_type
      `)
      .order(
        "name",
        {
          ascending: true,
        }
      );

  if (error) {

    console.error(error);

    return [];
  }

  return data || [];
}

export async function getHotelById(
  id: number
) {

  const { data, error } =
    await supabase
      .from("hotels")
      .select("*")
      .eq("id", id)
      .single();

  if (error) {

    console.error(error);

    return null;
  }

  return data;
}