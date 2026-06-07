"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getCurrentProfile } from "@/services/profileService";
import { getRecommendedGems } from "@/services/recommendationEngineService";
import Navbar from "@/components/layout/Navbar";

export default function RecommendationsPage() {

  const [gems, setGems] =
    useState<any[]>([]);

  const [personality, setPersonality] =
    useState("");

  useEffect(() => {

    async function loadRecommendations() {

      const profile =
        await getCurrentProfile();

      if (
        !profile?.travel_personality
      ) {
        return;
      }

      setPersonality(
        profile.travel_personality
      );

      const data =
        await getRecommendedGems(
          profile.travel_personality
        );

      setGems(data);
    }

    loadRecommendations();

  }, []);

  return (

    <main className="min-h-screen bg-[#050816] px-6 py-24 text-white">
      <Navbar  />
      <div className="mx-auto max-w-7xl">

        <div className="mb-16 text-center">

          <p className="mb-4 text-sm uppercase tracking-[0.4em] text-cyan-400">
            AI Travel Discovery
          </p>

          <h1 className="mb-6 text-5xl font-bold md:text-6xl">
            Recommended For You
          </h1>

          <p className="mx-auto max-w-2xl text-gray-400">
            Personalized hidden gems
            selected for your travel
            personality.
          </p>

          {personality && (

            <div className="mt-6 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-6 py-3 text-cyan-300">

              ✨ {personality}

            </div>

          )}

        </div>

        {gems.length === 0 && (

          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">

            <h2 className="mb-4 text-2xl font-semibold">
              No recommendations found
            </h2>

            <p className="text-gray-400">
              Add more hidden gems with
              matching vibes or update your
              personality profile.
            </p>

          </div>

        )}

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {gems.map((gem) => (

            <div
              key={gem.id}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-cyan-400/30"
            >

              <div className="p-6">

                <div className="mb-4 flex items-center justify-between">

                  <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-sm text-cyan-300">
                    🔥 {gem.score} Match
                  </span>

                  <span className="text-sm text-gray-400">
                    ✨ {gem.vibe}
                  </span>

                </div>

                <h2 className="mb-3 text-2xl font-semibold">
                  {gem.title}
                </h2>

                <p className="mb-3 text-cyan-400">
                  📍 {gem.location}
                </p>

                <p className="mb-5 text-gray-300">
                  {gem.description}
                </p>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">

                  <p className="mb-2 text-sm font-medium text-cyan-300">
                    Why recommended?
                  </p>

                  <p className="text-sm text-gray-400">
                    Matches your{" "}
                    {personality} travel
                    personality.
                  </p>

                </div>

                <div className="mt-5 flex gap-3">

                  <Link
                    href={`/hidden-gems/${gem.id}`}
                    className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-center transition hover:bg-white/5"
                  >
                    View Destination
                  </Link>

                  <Link
                    href={`/plan-my-trip?destination=${encodeURIComponent(
                      gem.title
                    )}&source=recommendation`}
                    className="flex-1 rounded-xl bg-cyan-400 px-4 py-3 text-center font-semibold text-black transition hover:scale-105"
                  >
                    Plan This Trip
                  </Link>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </main>

  );
}