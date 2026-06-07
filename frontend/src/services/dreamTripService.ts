import { supabase } from "@/lib/supabase";

export async function addDreamTrip(
  destination: string
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return {
    success: false,
    message: "Please login first.",
  };

  const { error } = await supabase
    .from("dream_trips")
    .insert([
      {
        user_id: user.id,
        destination,
      },
    ]);

  if (error) {
    if (error.code === "23505") {
      return {
        success: false,
        message:
          "Destination already exists in your Dream Trips.",
      };
    }

    console.error(error);

    return {
      success: false,
      message:
        "Failed to save destination.",
    };
  }

  return {
    success: true,
    message:
      "Destination added successfully.",
  };
}

export async function getDreamTrips() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("dream_trips")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

export async function removeDreamTrip(
  id: number
) {
  const { error } = await supabase
    .from("dream_trips")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    return false;
  }

  return true;
}

export async function getDreamTripsByUser(
  userId: string
) {
  const { data, error } = await supabase
    .from("dream_trips")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}