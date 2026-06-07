"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getCurrentProfile } from "@/services/profileService";
import { getProfileStats } from "@/services/profileStatsService";
import { getDreamTripsByUser } from "@/services/dreamTripService";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);

  const [stats, setStats] = useState({
    likes: 0,
    bookmarks: 0,
    journeys: 0,
  });

  const [dreamTrips, setDreamTrips] =
    useState<any[]>([]);

  useEffect(() => {
    async function loadProfile() {
      const data = await getCurrentProfile();

      if (!data) return;

      setProfile(data);

      const statData =
        await getProfileStats(
          data.id
        );

      setStats(statData);

      const trips =
        await getDreamTripsByUser(
          data.id
        );

      setDreamTrips(trips);
    }

    loadProfile();
  }, []);

  if (!profile) {
    return (
      <main className="min-h-screen bg-[#050816] flex items-center justify-center text-white">
        Loading profile...
      </main>
    );
  }

  const personalityDescriptions: Record<
    string,
    string
  > = {
    "Cinematic Explorer":
      "You seek destinations that feel like scenes from a movie. Hidden cafés, misty mountains and breathtaking viewpoints inspire your journeys.",

    "Soul Seeker":
      "You travel to reconnect with yourself. Peaceful landscapes, monasteries and meaningful experiences shape your adventures.",

    "Wanderlust Adventurer":
      "You thrive on exploration. Treks, road trips and discovering hidden corners of the world excite you.",

    "Luxury Nomad":
      "You appreciate refined travel. Boutique stays, premium experiences and elegant comfort define your journeys.",

    "Cultural Storyteller":
      "You travel for stories, people and traditions. Every destination becomes a chapter in your personal journey.",
  };

  const recommendations: Record<
    string,
    string[]
  > = {
    "Cinematic Explorer": [
      "Vietnam 🇻🇳",
      "Japan 🇯🇵",
      "Sikkim 🇮🇳",
      "Iceland 🇮🇸",
    ],

    "Soul Seeker": [
      "Rishikesh 🇮🇳",
      "Bhutan 🇧🇹",
      "Nepal 🇳🇵",
      "Bali 🇮🇩",
    ],

    "Wanderlust Adventurer": [
      "Ladakh 🇮🇳",
      "Patagonia 🇦🇷",
      "Peru 🇵🇪",
      "New Zealand 🇳🇿",
    ],

    "Luxury Nomad": [
      "Dubai 🇦🇪",
      "Maldives 🇲🇻",
      "Switzerland 🇨🇭",
      "Santorini 🇬🇷",
    ],

    "Cultural Storyteller": [
      "Turkey 🇹🇷",
      "Morocco 🇲🇦",
      "Egypt 🇪🇬",
      "Vietnam 🇻🇳",
    ],
  };

  const totalActions =
    stats.likes +
    stats.bookmarks +
    stats.journeys;

  let badge = "New Traveler";

  if (totalActions >= 50) {
    badge = "Travel Legend";
  } else if (totalActions >= 20) {
    badge = "Adventurer";
  } else if (totalActions >= 6) {
    badge = "Explorer";
  }

  return (
    <main className="min-h-screen bg-[#050816] px-6 py-24 text-white">
      <div className="mx-auto max-w-6xl">

        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl">

          {/* Profile Header */}

          <div className="mb-10 flex flex-col items-center text-center">

            <div className="mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-cyan-400 text-4xl font-bold text-black">
              {profile.full_name?.charAt(0) || "U"}
            </div>

            <h1 className="text-5xl font-bold">
              {profile.full_name ||
                "Traveler"}
            </h1>

            <p className="mt-2 text-gray-400">
              @{profile.username}
            </p>

            <Link
              href="/profile/edit"
              className="mt-6 rounded-full border border-white/10 bg-white/10 px-6 py-3 transition hover:bg-white/20"
            >
              Edit Profile
            </Link>

          </div>

          {/* Personality */}

          <div className="mb-10 rounded-3xl border border-cyan-400/20 bg-cyan-400/5 p-8">

            <h2 className="mb-4 text-3xl font-bold text-cyan-300">
              {profile.travel_personality ||
                "Discover Your Personality"}
            </h2>

            <p className="leading-8 text-gray-300">
              {personalityDescriptions[
                profile.travel_personality
              ] ||
                "Take the Travel Personality Quiz to unlock personalized recommendations."}
            </p>

            {!profile.travel_personality && (
              <Link
                href="/personality"
                className="mt-6 inline-block rounded-full bg-white px-6 py-3 text-black"
              >
                Take Quiz
              </Link>
            )}

          </div>

          {/* Stats */}

          <div className="mb-10 grid gap-6 md:grid-cols-4">

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
              <div className="mb-2 text-3xl">
                ❤️
              </div>

              <div className="text-3xl font-bold">
                {stats.likes}
              </div>

              <p className="text-gray-400">
                Likes
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
              <div className="mb-2 text-3xl">
                🔖
              </div>

              <div className="text-3xl font-bold">
                {stats.bookmarks}
              </div>

              <p className="text-gray-400">
                Bookmarks
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
              <div className="mb-2 text-3xl">
                🌍
              </div>

              <div className="text-3xl font-bold">
                {stats.journeys}
              </div>

              <p className="text-gray-400">
                Journeys
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-6 text-center">
              <div className="mb-2 text-3xl">
                🏆
              </div>

              <div className="text-2xl font-bold">
                {badge}
              </div>

              <p className="text-gray-400">
                Travel Level
              </p>
            </div>

          </div>

          {/* Travel Details */}

          <div className="mb-10 grid gap-6 md:grid-cols-2">

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="mb-3 text-xl font-semibold">
                Home City
              </h3>

              <p className="text-gray-300">
                {profile.home_city ||
                  "Not specified"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="mb-3 text-xl font-semibold">
                Travel Style
              </h3>

              <p className="text-gray-300">
                {profile.travel_style ||
                  "Not specified"}
              </p>
            </div>

          </div>

          {/* Dream Destinations */}

          <div className="mb-10 rounded-3xl border border-white/10 bg-white/5 p-8">

            <div className="mb-6 flex items-center justify-between">

              <h2 className="text-3xl font-bold">
                Dream Destinations
              </h2>

              <Link
                href="/dream-trips"
                className="rounded-full border border-white/10 px-4 py-2 text-sm transition hover:bg-white/10"
              >
                Manage
              </Link>

            </div>

            {dreamTrips.length === 0 ? (
              <p className="text-gray-400">
                No dream destinations yet.
              </p>
            ) : (
              <div className="flex flex-wrap gap-4">

                {dreamTrips.map((trip) => (
                  <span
                    key={trip.id}
                    className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 text-cyan-300"
                  >
                    ✈️ {trip.destination}
                  </span>
                ))}

              </div>
            )}

          </div>

          {/* Recommended Destinations */}

          {profile.travel_personality && (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">

              <h2 className="mb-6 text-3xl font-bold">
                Recommended For You
              </h2>

              <div className="flex flex-wrap gap-4">

                {(recommendations[
                  profile.travel_personality
                ] || []).map(
                  (destination) => (
                    <span
                      key={destination}
                      className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 text-cyan-300"
                    >
                      {destination}
                    </span>
                  )
                )}

              </div>

            </div>
          )}

        </div>

      </div>
    </main>
  );
}