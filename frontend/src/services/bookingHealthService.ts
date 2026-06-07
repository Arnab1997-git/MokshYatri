import {
  getBookings,
  getBookingPayments,
  getBookingHotelAllocation,
  getBookingVehicleAllocation,
} from "@/services/bookingService";

export async function getBookingHealthData() {

  const bookings =
    await getBookings();

  const results = [];

  for (
    const booking of bookings
  ) {

    const [
      payments,
      hotel,
      vehicle,
    ] = await Promise.all([

      getBookingPayments(
        booking.id
      ),

      getBookingHotelAllocation(
        booking.id
      ),

      getBookingVehicleAllocation(
        booking.id
      ),

    ]);

    const collected =
      Number(
        booking.advance_paid || 0
      ) +
      payments.reduce(
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

    const paymentComplete =
      collected >=
      Number(
        booking.total_amount || 0
      );

    let health =
      "HEALTHY";

    if (
      !paymentComplete
    ) {

      health =
        "PAYMENT_PENDING";

    }
    else if (
      !hotel
    ) {

      health =
        "HOTEL_PENDING";

    }
    else if (
      !vehicle
    ) {

      health =
        "VEHICLE_PENDING";

    }

    results.push({

      booking,

      health,

      paymentComplete,

      hotelAssigned:
        !!hotel,

      vehicleAssigned:
        !!vehicle,

    });

  }

  return results;
}