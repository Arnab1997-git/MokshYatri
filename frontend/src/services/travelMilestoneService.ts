import {
  getProfileStats,
} from "@/services/profileStatsService";

import {
  getUserAchievements,
} from "@/services/achievementService";

import {
  getReferralStats,
} from "@/services/referralService";

export async function getTravelMilestones(
  userId: string
) {

  const stats =
    await getProfileStats(
      userId
    );

  const achievements =
    await getUserAchievements(
      userId
    );

  const referrals =
    await getReferralStats(
      userId
    );

  return {

    tripsCompleted:
      stats.journeys || 0,

    reviewsWritten:
      stats.likes || 0,

    savedGems:
      stats.bookmarks || 0,

    achievementsEarned:
      achievements.length,

    rewardPoints:
      referrals.rewardPoints || 0,

  };
}