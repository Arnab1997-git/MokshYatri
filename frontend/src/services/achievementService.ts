import { supabase } from "@/lib/supabase";
import {
  getUserLeads,
} from "@/services/leadService";

import {
  getBookingsByLeadIds,
} from "@/services/bookingService";

import {
  getSavedGems,
} from "@/services/gemInteractionService";

import {
  getMyReviews,
} from "@/services/reviewService";

export async function getAchievements() {

  const { data, error } =
    await supabase
      .from("achievements")
      .select("*");

  if (error) {

    console.error(error);

    return [];
  }

  return data || [];
}

export async function getUserAchievements(
  userId: string
) {

  const { data, error } =
    await supabase
      .from("user_achievements")
      .select(`
        *,
        achievements (*)
      `)
      .eq(
        "user_id",
        userId
      );

  if (error) {

    console.error(error);

    return [];
  }

  return data || [];
}

export async function awardAchievement(
  userId: string,
  achievementId: number
) {

  const existing =
    await supabase
      .from(
        "user_achievements"
      )
      .select("id")
      .eq(
        "user_id",
        userId
      )
      .eq(
        "achievement_id",
        achievementId
      )
      .maybeSingle();

  if (
    existing.data
  ) {
    return;
  }

  await supabase
    .from(
      "user_achievements"
    )
    .insert([{

      user_id:
        userId,

      achievement_id:
        achievementId,

    }]);
}
export async function evaluateAchievements(
  userId: string
) {

  const achievements =
    await getAchievements();

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

  const gems =
    await getSavedGems(
      userId
    );

  const firstJourney =
    achievements.find(
      (a) =>
        a.title ===
        "First Journey"
    );

  if (
    firstJourney &&
    bookings.length >= 1
  ) {

    await awardAchievement(
      userId,
      firstJourney.id
    );

  }

  const reviewMaster =
    achievements.find(
      (a) =>
        a.title ===
        "Review Master"
    );

  if (
    reviewMaster &&
    reviews.length >= 1
  ) {

    await awardAchievement(
      userId,
      reviewMaster.id
    );

  }

  const gemHunter =
    achievements.find(
      (a) =>
        a.title ===
        "Hidden Gem Hunter"
    );

  if (
    gemHunter &&
    gems.length >= 3
  ) {

    await awardAchievement(
      userId,
      gemHunter.id
    );

  }

  const explorer =
    achievements.find(
      (a) =>
        a.title ===
        "Explorer"
    );

  if (
    explorer &&
    bookings.length >= 5
  ) {

    await awardAchievement(
      userId,
      explorer.id
    );

  }
}