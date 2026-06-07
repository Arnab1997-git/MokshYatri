import { supabase } from "@/lib/supabase";

export async function getVehicles() {

  const { data, error } =
    await supabase
      .from("vehicles")
      .select(`
        id,
        name,
        category_id
      `)
      .eq(
        "is_active",
        true
      )
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

export async function getVehicleById(
  id: number
) {

  const { data, error } =
    await supabase
      .from("vehicles")
      .select("*")
      .eq(
        "id",
        id
      )
      .single();

  if (error) {

    console.error(error);

    return null;
  }

  return data;
}