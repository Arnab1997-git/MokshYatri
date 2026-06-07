import { supabase } from "@/lib/supabase";

import {
  getUserLeads,
} from "@/services/leadService";

import {
  getBookingsByLeadIds,
} from "@/services/bookingService";

import {
  getBookingTimeline,
} from "@/services/timelineService";

export async function getCustomerNotifications() {

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const leads =
    await getUserLeads(
      user.id
    );

  const leadIds =
    leads.map(
      (lead) => lead.id
    );

  const bookings =
    await getBookingsByLeadIds(
      leadIds
    );

  let notifications: any[] = [];

  for (
    const booking of bookings
  ) {

    const timeline =
      await getBookingTimeline(
        booking
      );

    const bookingNotifications =
      timeline.map(
        (event) => ({

          bookingId:
            booking.id,

          title:
            event.title,

          status:
            event.status,

          date:
            event.date,

        })
      );

    notifications.push(
      ...bookingNotifications
    );

  }

  notifications.sort(
    (a, b) => {

      if (!a.date) {
        return 1;
      }

      if (!b.date) {
        return -1;
      }

      return (
        new Date(
          b.date
        ).getTime() -
        new Date(
          a.date
        ).getTime()
      );

    }
  );

  return notifications;
}