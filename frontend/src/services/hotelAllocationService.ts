import { supabase } from "@/lib/supabase";

export async function createHotelAllocation(
  allocation: any
) {

  const { data, error } =
    await supabase
      .from("hotel_allocations")
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
      "Hotel allocation created",
    data,
  };
}

export async function getHotelAllocations() {

  const { data, error } =
    await supabase
      .from("hotel_allocations")
      .select(`
        *,
        bookings (
          id,
          customer_name
        ),
        hotels (
          id,
          name,
          location_id,
          accommodation_type,
          pricing_type
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
      .from("hotel_allocations")
      .select(`
        *,
        hotels (
          id,
          name,
          location_id,
          accommodation_type,
          pricing_type
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

export async function updateHotelAllocation(
  allocationId: number,
  updates: any
) {

  const { data, error } =
    await supabase
      .from("hotel_allocations")
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