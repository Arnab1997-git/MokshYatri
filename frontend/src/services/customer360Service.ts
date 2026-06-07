import { supabase } from "@/lib/supabase";

import {
  getUserLeads,
} from "@/services/leadService";

import {
  getBookingsByLeadIds,
} from "@/services/bookingService";

import {
  getMyReviews,
} from "@/services/reviewService";

import {
  getUserAchievements,
} from "@/services/achievementService";

import {
  getReferralStats,
} from "@/services/referralService";

export async function getCustomers() {

  const { data, error } =
    await supabase
      .from("profiles")
      .select("*")
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

  console.log(
    "CUSTOMERS DATA:",
    data
  );

  console.log(
    "CUSTOMERS ERROR:",
    error
  );

  if (error) {

    console.error(error);

    return [];
  }

  return data || [];
}

export async function getCustomer360(
  userId: string
) {

  const { data: profile } =
    await supabase
      .from("profiles")
      .select("*")
      .eq(
        "id",
        userId
      )
      .single();

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

  const reviews =
    await getMyReviews(
      userId
    );

  const achievements =
    await getUserAchievements(
      userId
    );

  const referralStats =
    await getReferralStats(
      userId
    );

  return {

    profile,

    leads,

    bookings,

    reviews,

    achievements,

    referralStats,

  };
}