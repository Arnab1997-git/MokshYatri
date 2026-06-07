"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { supabase } from "@/lib/supabase";
import { getUserItineraries } from "@/services/dashboardService";
import CustomerPortalNav from "@/components/customer/CustomerPortalNav";
import {
  getCurrentProfile,
} from "@/services/profileService";

import {
  getProfileStats,
} from "@/services/profileStatsService";

import {
  getUserAchievements,
} from "@/services/achievementService";

import {
  getCustomerNotifications,
} from "@/services/notificationService";

import {
  getReferralStats,
} from "@/services/referralService";

import {
  getUpcomingTrip,
} from "@/services/customerDashboardService";

import {
  getTravelMilestones,
} from "@/services/travelMilestoneService";

import {
  getRelevantGems,
} from "@/services/aiGemService";

export default function DashboardPage() {
  const [itineraries, setItineraries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] =
    useState<any>(null);

  const [stats, setStats] =
    useState<any>(null);

  const [achievements, setAchievements] =
    useState<any[]>([]);

  const [notifications, setNotifications] =
    useState<any[]>([]);

  const [referralStats, setReferralStats] =
    useState<any>(null);

  const [upcomingTrip, setUpcomingTrip] =
    useState<any>(null);

  const [milestones, setMilestones] =
    useState<any>(null);

  const [recommendedGems, setRecommendedGems] =
    useState<any[]>([]);

  useEffect(() => {
    async function loadTrips() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const data = await getUserItineraries(user.id);
      const profileData =
        await getCurrentProfile();

      setProfile(
        profileData
      );

      const statsData =
        await getProfileStats(
          user.id
        );

      setStats(
        statsData
      );

      const upcoming =
        await getUpcomingTrip(
          user.id
        );

      setUpcomingTrip(
        upcoming
      );

      const milestoneData =
        await getTravelMilestones(
          user.id
        );

      setMilestones(
        milestoneData
      );

      const achievementData =
        await getUserAchievements(
          user.id
        );

      setAchievements(
        achievementData
      );

      const notificationData =
        await getCustomerNotifications();

      setNotifications(
        notificationData.slice(
          0,
          5
        )
      );

      const referralData =
        await getReferralStats(
          user.id
        );

      setReferralStats(
          referralData
      );

      setItineraries(data || []);
      setLoading(false);
      if (
        profileData?.travel_style
      ) {

        const gems =
          await getRelevantGems(
            profileData.travel_style
          );

        setRecommendedGems(
          gems.slice(0, 3)
        );

      }
    }

    loadTrips();
  }, []);

  let daysRemaining = null;

  if (
    upcomingTrip?.travel_date
  ) {

    const today =
      new Date();

    const travelDate =
      new Date(
        upcomingTrip.travel_date
      );

    daysRemaining =
      Math.ceil(
        (
          travelDate.getTime() -
          today.getTime()
        ) /
        (
          1000 *
          60 *
          60 *
          24
        )
      );

  }

  return (
    <main className="min-h-screen bg-[#050816] px-6 py-24 text-white">
      <div className="mx-auto max-w-6xl">

        <p className="mb-3 text-sm uppercase tracking-[0.4em] text-cyan-400">
          Customer Portal
        </p>

        <CustomerPortalNav />

        {/* HERO */}

        <div className="mb-12 rounded-3xl border border-white/10 bg-white/5 p-8">

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div>

              <h1 className="text-5xl font-bold">

                Welcome,
                {" "}
                {profile?.full_name || "Traveler"}

              </h1>

              <p className="mt-4 text-lg text-gray-400">

                {profile?.travel_style || "Traveler"}
                {" • "}
                {profile?.travel_personality || "Explorer"}

              </p>

              <p className="mt-4 text-cyan-400">
                Ready for your next adventure?
              </p>

            </div>

            <Link
              href="/dashboard/bookmarks"
              className="inline-block rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 text-cyan-300"
            >
              View Saved Gems
            </Link>

          </div>

        </div>

        {/* UPCOMING TRIP */}

        {upcomingTrip && (

          <div className="mb-12 rounded-3xl border border-cyan-400/20 bg-cyan-400/5 p-8">

            <h2 className="mb-4 text-2xl font-semibold">
              Upcoming Trip
            </h2>

            <div className="grid gap-6 md:grid-cols-3">

              <div>

                <p className="text-gray-400">
                  Customer
                </p>

                <p className="font-semibold">
                  {
                    upcomingTrip.customer_name
                  }
                </p>

              </div>

              <div>

                <p className="text-gray-400">
                  Travel Date
                </p>

                <p>
                  {
                    upcomingTrip.travel_date
                  }
                </p>

              </div>

              <div>

                <p className="text-gray-400">
                  Countdown
                </p>

                <p className="text-4xl font-bold text-cyan-400">

                  {daysRemaining}

                </p>

                <p className="text-sm text-gray-400">
                  days remaining
                </p>

              </div>

            </div>

          </div>

        )}

        {/* TRAVEL MILESTONES */}

        {milestones && (

          <div className="mb-12 rounded-3xl border border-white/10 bg-white/5 p-8">

            <h2 className="mb-6 text-2xl font-semibold">
              Travel Milestones
            </h2>

            <div className="grid gap-6 md:grid-cols-5">

              <div>

                <p className="text-gray-400">
                  Trips
                </p>

                <p className="text-4xl font-bold text-cyan-400">
                  {milestones.tripsCompleted}
                </p>

              </div>

              <div>

                <p className="text-gray-400">
                  Saved Gems
                </p>

                <p className="text-4xl font-bold text-cyan-400">
                  {milestones.savedGems}
                </p>

              </div>

              <div>

                <p className="text-gray-400">
                  Achievements
                </p>

                <p className="text-4xl font-bold text-cyan-400">
                  {milestones.achievementsEarned}
                </p>

              </div>

              <div>

                <p className="text-gray-400">
                  Reviews
                </p>

                <p className="text-4xl font-bold text-cyan-400">
                  {milestones.reviewsWritten}
                </p>

              </div>

              <div>

                <p className="text-gray-400">
                  Reward Points
                </p>

                <p className="text-4xl font-bold text-cyan-400">
                  {milestones.rewardPoints}
                </p>

              </div>

            </div>

          </div>

        )}

        {/* RECOMMENDED FOR YOU */}

        <div className="mb-12 rounded-3xl border border-white/10 bg-white/5 p-8">

          <h2 className="mb-6 text-2xl font-semibold">
            Recommended For You
          </h2>

          {recommendedGems.length === 0 ? (

            <p className="text-gray-400">
              No recommendations available.
            </p>

          ) : (

            <div className="grid gap-6 md:grid-cols-3">

              {recommendedGems.map(
                (gem) => (

                  <div
                    key={gem.id}
                    className="rounded-2xl border border-white/10 p-5"
                  >

                    <h3 className="mb-2 text-lg font-semibold">

                      {gem.title}

                    </h3>

                    <p className="mb-3 text-sm text-cyan-400">

                      {gem.location}

                    </p>

                    <p className="text-sm text-gray-400">

                      {gem.description}

                    </p>

                  </div>

                )
              )}

            </div>

          )}

        </div>

        {/* QUICK STATS */}

        <div className="mb-12 grid gap-6 md:grid-cols-4">

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

            <p className="text-gray-400">
              Journeys
            </p>

            <p className="mt-2 text-4xl font-bold text-cyan-400">
              {stats?.journeys || 0}
            </p>

          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

            <p className="text-gray-400">
              Saved Gems
            </p>

            <p className="mt-2 text-4xl font-bold text-cyan-400">
              {stats?.bookmarks || 0}
            </p>

          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

            <p className="text-gray-400">
              Achievements
            </p>

            <p className="mt-2 text-4xl font-bold text-cyan-400">
              {achievements.length}
            </p>

          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

            <p className="text-gray-400">
              Reward Points
            </p>

            <p className="mt-2 text-4xl font-bold text-cyan-400">
              {referralStats?.rewardPoints || 0}
            </p>

          </div>

        </div>

        {/* ACHIEVEMENTS */}

        <div className="mb-12 rounded-3xl border border-white/10 bg-white/5 p-8">

          <h2 className="mb-6 text-2xl font-semibold">
            Recent Achievements
          </h2>

          {achievements.length === 0 ? (

            <p className="text-gray-400">
              No achievements earned yet.
            </p>

          ) : (

            <div className="grid gap-4 md:grid-cols-3">

              {achievements
                .slice(0, 3)
                .map((achievement) => (

                  <div
                    key={achievement.id}
                    className="rounded-2xl border border-white/10 p-5"
                  >

                    <div className="mb-2 text-3xl">

                      {
                        achievement
                          .achievements
                          ?.icon
                      }

                    </div>

                    <p className="font-semibold">

                      {
                        achievement
                          .achievements
                          ?.title
                      }

                    </p>

                  </div>

                ))}

            </div>

          )}

        </div>

        {/* NOTIFICATIONS */}

        <div className="mb-12 rounded-3xl border border-white/10 bg-white/5 p-8">

          <h2 className="mb-6 text-2xl font-semibold">
            Recent Notifications
          </h2>

          {notifications.length === 0 ? (

            <p className="text-gray-400">
              No notifications available.
            </p>

          ) : (

            <div className="space-y-4">

              {notifications.map(
                (
                  notification,
                  index
                ) => (

                  <div
                    key={index}
                    className="rounded-xl border border-white/10 p-4"
                  >

                    <p className="font-medium">

                      {notification.title}

                    </p>

                    <p className="text-sm text-gray-400">

                      Booking #
                      {notification.bookingId}

                    </p>

                  </div>

                )
              )}

            </div>

          )}

        </div>

        {/* JOURNEYS */}

        <div className="mb-6">

          <h2 className="mb-8 text-3xl font-bold">
            My Journeys
          </h2>

        </div>

        {loading && (

          <p className="text-gray-400">
            Loading journeys...
          </p>

        )}

        {!loading &&
          itineraries.length === 0 && (

          <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center">

            <h2 className="mb-3 text-2xl font-semibold">
              No journeys yet
            </h2>

            <p className="text-gray-400">
              Generate your first AI journey
              to begin your adventure.
            </p>

          </div>

        )}

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {itineraries.map((trip) => (

            <Link
              href={`/dashboard/${trip.id}`}
              key={trip.id}
              className="group"
            >

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:-translate-y-2 hover:border-cyan-400/30 hover:bg-white/10">

                <h2 className="mb-2 text-2xl font-bold text-white">
                  {trip.title}
                </h2>

                <p className="mb-4 text-gray-400">
                  {trip.destination}
                </p>

                <div className="flex items-center justify-between">

                  <span className="text-sm text-gray-500">

                    {new Date(
                      trip.created_at
                    ).toLocaleDateString()}

                  </span>

                  <span className="text-cyan-400 transition group-hover:text-cyan-300">

                    View Journey →

                  </span>

                </div>

              </div>

            </Link>

          ))}

        </div>

      </div>
    </main>
  );
}