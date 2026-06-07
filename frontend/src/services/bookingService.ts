import { supabase } from "@/lib/supabase";

export async function createBooking(
  booking: any
) {

  const { data, error } =
    await supabase
      .from("bookings")
      .insert([booking])
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
    message: "Booking created",
    data,
  };
}

export async function getBookings() {

  const { data, error } =
    await supabase
      .from("bookings")
      .select(`
        *,
        quotations (
          id,
          customer_name,
          customer_phone,
          selling_price
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

export async function getBookingById(
  id: number
) {

  const { data, error } =
    await supabase
      .from("bookings")
      .select(`
        *,
        quotations (
          id,
          customer_name,
          customer_phone,
          selling_price
        )
      `)
      .eq("id", id)
      .maybeSingle();

  if (error) {

    console.error(
      "Booking Lookup Error:",
      error
    );

    return null;
  }

  return data;
}

export async function updateBookingStatus(
  bookingId: number,
  status: string
) {

  const { error } =
    await supabase
      .from("bookings")
      .update({
        status,
      })
      .eq(
        "id",
        bookingId
      );

  if (error) {

    console.error(error);

    return {
      success: false,
    };
  }

  return {
    success: true,
  };
}

export async function createBookingFromQuotation(
  quotation: any,
  travelDate: string,
  advancePaid: number
) {

  // ---------------------------
  // Prevent Duplicate Booking
  // ---------------------------

  const existingBooking =
    await supabase
      .from("bookings")
      .select("id")
      .eq(
        "quotation_id",
        quotation.id
      )
      .maybeSingle();

  if (
    existingBooking.data
  ) {

    return {

      success: false,

      message:
        "Booking already exists for this quotation",

      data:
        existingBooking.data,
    };
  }

  // ---------------------------
  // Calculate Amounts
  // ---------------------------

  const totalAmount =
    Number(
      quotation.quoted_price ??
      quotation.selling_price
    );

  const balanceDue =
    totalAmount -
    advancePaid;

  // ---------------------------
  // Create Booking
  // ---------------------------

  const { data, error } =
    await supabase
      .from("bookings")
      .insert([
        {

          quotation_id:
            quotation.id,

          lead_id:
            quotation.lead_id,

          customer_name:
            quotation.customer_name,

          customer_phone:
            quotation.customer_phone,

          travel_date:
            travelDate,

          advance_paid:
            advancePaid,

          balance_due:
            balanceDue,

          total_amount:
            totalAmount,

          status:
            "PENDING",

        },
      ])
      .select()
      .single();

  if (error) {

    console.error(error);

    return {

      success: false,

      message:
        error.message,

      data: null,
    };
  }

  return {

    success: true,

    message:
      "Booking created successfully",

    data,
  };
}
export async function getBookingPayments(
  bookingId: number
) {

  const { data, error } =
    await supabase
      .from("booking_payments")
      .select("*")
      .eq(
        "booking_id",
        bookingId
      )
      .order(
        "payment_date",
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

export async function getBookingHotelAllocation(
  bookingId: number
) {

  const { data, error } =
    await supabase
      .from("hotel_allocations")
      .select(`
        *,
        hotels (
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

export async function getBookingVehicleAllocation(
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

export async function getBookingsByLeadIds(
  leadIds: number[]
) {

  if (!leadIds.length) {
    return [];
  }

  const { data, error } =
    await supabase
      .from("bookings")
      .select("*")
      .in(
        "lead_id",
        leadIds
      )
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

export async function getCustomerTripStatus(
  bookingId: number
) {

  const [
    hotel,
    vehicle,
    payments,
  ] = await Promise.all([

    getBookingHotelAllocation(
      bookingId
    ),

    getBookingVehicleAllocation(
      bookingId
    ),

    getBookingPayments(
      bookingId
    ),

  ]);

  const totalPaid =
    payments.reduce(
      (
        sum,
        payment
      ) =>
        sum +
        Number(
          payment.amount || 0
        ),
      0
    );

  return {

    hotel,

    vehicle,

    totalPaid,

  };
}