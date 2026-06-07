import {
  getUserLeads,
} from "@/services/leadService";

import {
  getBookingsByLeadIds,
} from "@/services/bookingService";

export async function getUpcomingTrip(
  userId: string
) {

  const leads =
    await getUserLeads(
      userId
    );

  const bookings =
    await getBookingsByLeadIds(
      leads.map(
        (lead) => lead.id
      )
    );

  const upcoming =
    bookings
      .filter(
        (booking) =>
          booking.travel_date
      )
      .sort(
        (a, b) =>
          new Date(
            a.travel_date
          ).getTime() -
          new Date(
            b.travel_date
          ).getTime()
      )[0];

  return upcoming || null;
}