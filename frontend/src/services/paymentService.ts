import { supabase } from "@/lib/supabase";

export async function createPayment(
  payment: any
) {

  const { data, error } =
    await supabase
      .from("booking_payments")
      .insert([payment])
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

  const bookingId =
    payment.booking_id;

  const { data: booking } =
    await supabase
      .from("bookings")
      .select(`
        id,
        total_amount,
        advance_paid
      `)
      .eq(
        "id",
        bookingId
      )
      .single();

  if (booking) {

    const { data: payments } =
      await supabase
        .from("booking_payments")
        .select("amount")
        .eq(
          "booking_id",
          bookingId
        );

    const totalCollected =
      payments?.reduce(
        (
          total,
          payment
        ) =>
          total +
          Number(
            payment.amount || 0
          ),
        0
      ) || 0;

    const balanceDue =
      Number(
        booking.total_amount || 0
      ) -
      Number(
        booking.advance_paid || 0
      ) -
      totalCollected;

    const [
      hotelResult,
      vehicleResult,
    ] = await Promise.all([

      supabase
        .from("hotel_allocations")
        .select("id")
        .eq(
          "booking_id",
          bookingId
        )
        .maybeSingle(),

      supabase
        .from("vehicle_allocations")
        .select("id")
        .eq(
          "booking_id",
          bookingId
        )
        .maybeSingle(),

    ]);

    const hotelAssigned =
      !!hotelResult.data;

    const vehicleAssigned =
      !!vehicleResult.data;

    let status =
      "PENDING";

    if (
      balanceDue <= 0 &&
      hotelAssigned &&
      vehicleAssigned
    ) {

      status =
        "READY_FOR_TRAVEL";

    } else if (
      balanceDue <= 0
    ) {

      status =
        "CONFIRMED";

    }

    await supabase
      .from("bookings")
      .update({

        balance_due:
          balanceDue,

        status,

      })
      .eq(
        "id",
        bookingId
      );
  }

  return {
    success: true,
    message:
      "Payment recorded",
    data,
  };
}

export async function getPaymentsByBooking(
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

export async function getTotalCollected(
  bookingId: number
) {

  const payments =
    await getPaymentsByBooking(
      bookingId
    );

  return payments.reduce(
    (
      total,
      payment
    ) =>
      total +
      Number(
        payment.amount || 0
      ),
    0
  );
}

export async function getOutstandingBalance(
  bookingId: number
) {

  const { data: booking } =
    await supabase
      .from("bookings")
      .select(`
        total_amount,
        advance_paid
      `)
      .eq(
        "id",
        bookingId
      )
      .single();

  if (!booking) {
    return 0;
  }

  const totalCollected =
    await getTotalCollected(
      bookingId
    );

  return (
    Number(
      booking.total_amount || 0
    ) -
    Number(
      booking.advance_paid || 0
    ) -
    totalCollected
  );
}
export async function getAllPayments() {

  const { data, error } =
    await supabase
      .from("booking_payments")
      .select(`
        *,
        bookings (
          id,
          customer_name
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