import { getLeadById } from "@/services/leadService";

import {
  getBookingPayments,
  getBookingHotelAllocation,
  getBookingVehicleAllocation,
} from "@/services/bookingService";

export async function getBookingTimeline(
  booking: any
) {

  const timeline = [];

  // --------------------------------
  // Lead
  // --------------------------------

  if (booking.lead_id) {

    const lead =
      await getLeadById(
        booking.lead_id
      );

    if (lead) {

      timeline.push({

        status:
          "completed",

        title:
          "Lead Submitted",

        date:
          lead.created_at,

      });

      if (
        lead.quotation_id
      ) {

        timeline.push({

          status:
            "completed",

          title:
            "Quotation Generated",

          date:
            lead.created_at,

        });

      }

    }

  }

  // --------------------------------
  // Booking
  // --------------------------------

  timeline.push({

    status:
      "completed",

    title:
      "Booking Confirmed",

    date:
      booking.created_at,

  });

  // --------------------------------
  // Advance
  // --------------------------------

  if (
    Number(
      booking.advance_paid || 0
    ) > 0
  ) {

    timeline.push({

      status:
        "completed",

      title:
        "Advance Received",

      date:
        booking.created_at,

    });

  }

  // --------------------------------
  // Payments
  // --------------------------------

  const payments =
    await getBookingPayments(
      booking.id
    );

  if (
    payments.length > 0
  ) {

    timeline.push({

      status:
        "completed",

      title:
        "Additional Payments Received",

      date:
        payments[0]
          .payment_date,

    });

  }

  const totalPaid =
    Number(
      booking.advance_paid || 0
    ) +
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

  if (
    totalPaid >=
    Number(
      booking.total_amount || 0
    )
  ) {

    timeline.push({

      status:
        "completed",

      title:
        "Payment Completed",

      date:
        payments[0]
          ?.payment_date,

    });

  }

  // --------------------------------
  // Hotel
  // --------------------------------

  const hotel =
    await getBookingHotelAllocation(
      booking.id
    );

  if (hotel) {

    timeline.push({

      status:
        "completed",

      title:
        "Hotel Assigned",

      date:
        hotel.created_at,

    });

  } else {

    timeline.push({

      status:
        "pending",

      title:
        "Hotel Assignment",

    });

  }

  // --------------------------------
  // Vehicle
  // --------------------------------

  const vehicle =
    await getBookingVehicleAllocation(
      booking.id
    );

  if (vehicle) {

    timeline.push({

      status:
        "completed",

      title:
        "Vehicle Assigned",

      date:
        vehicle.created_at,

    });

  } else {

    timeline.push({

      status:
        "pending",

      title:
        "Vehicle Assignment",

    });

  }

  // --------------------------------
  // Ready For Travel
  // --------------------------------

  const readyForTravel =
    hotel &&
    vehicle &&
    totalPaid >=
      Number(
        booking.total_amount || 0
      );

  let readyForTravelDate =
    null;

  const dates = [

    hotel?.created_at,

    vehicle?.created_at,

    payments[0]
      ?.payment_date,

  ]
    .filter(Boolean)
    .map(
      (date) =>
        new Date(
          date as string
        ).getTime()
    );

  if (
    readyForTravel &&
    dates.length
  ) {

    readyForTravelDate =
      new Date(
        Math.max(
          ...dates
        )
      ).toISOString();

  }

  timeline.push({

    status:
      readyForTravel
        ? "completed"
        : "pending",

    title:
      "Ready For Travel",

    date:
      readyForTravelDate,

  });

  // --------------------------------
  // Sort Timeline
  // --------------------------------

  timeline.sort(
    (a, b) => {

      if (!a.date) {
        return 1;
      }

      if (!b.date) {
        return -1;
      }

      return (
        new Date(
          a.date
        ).getTime() -
        new Date(
          b.date
        ).getTime()
      );

    }
  );

  return timeline;
}