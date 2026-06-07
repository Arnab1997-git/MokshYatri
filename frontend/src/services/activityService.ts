import {
  getBookings,
} from "@/services/bookingService";

import {
  getBookingTimeline,
} from "@/services/timelineService";

export async function getActivityFeed() {

  const bookings =
    await getBookings();

  let activities: any[] = [];

  for (
    const booking of bookings
  ) {

    const timeline =
      await getBookingTimeline(
        booking
      );

    const bookingActivities =
      timeline.map(
        (event) => ({

          bookingId:
            booking.id,

          customerName:
            booking.customer_name,

          title:
            event.title,

          status:
            event.status,

          date:
            event.date,

        })
      );

    activities.push(
      ...bookingActivities
    );

  }

  activities =
    activities.filter(
      (item) =>
        item.date
    );

  activities.sort(
    (a, b) =>
      new Date(
        b.date
      ).getTime() -
      new Date(
        a.date
      ).getTime()
  );

  return activities;
}