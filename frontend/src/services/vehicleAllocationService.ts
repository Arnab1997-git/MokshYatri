import { supabase } from "@/lib/supabase";

export async function createVehicleAllocation(
  allocation: any
) {

  const { data, error } =
    await supabase
      .from("vehicle_allocations")
      .insert([allocation])
      .select()
      .single();

  if (error) {

    console.error(error);

    return {
      success: false,
      message: error.message,
      data: null,
    };
  }

  return {
    success: true,
    message:
      "Vehicle allocation created",
    data,
  };
}

export async function getVehicleAllocations() {

  const { data, error } =
    await supabase
      .from("vehicle_allocations")
      .select(`
        *,
        bookings (
          id,
          customer_name
        ),
        vehicles (
          id,
          name
        )
      `)
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

  if (error) {

    console.error(error);

    return [];
  }

  return data || [];
}

export async function getAllocationByBooking(
  bookingId: number
) {

  const { data, error } =
    await supabase
      .from("vehicle_allocations")
      .select(`
        *,
        vehicles (
          id,
          name
        )
      `)
      .eq(
        "booking_id",
        bookingId
      )
      .maybeSingle();

  if (error) {

    console.error(error);

    return null;
  }

  return data;
}

export async function updateVehicleAllocation(
  allocationId: number,
  updates: any
) {

  const { data, error } =
    await supabase
      .from("vehicle_allocations")
      .update(updates)
      .eq(
        "id",
        allocationId
      )
      .select()
      .single();

  if (error) {

    console.error(error);

    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    data,
  };
}