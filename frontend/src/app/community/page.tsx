"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getPublicTrips } from "@/services/communityFeedService";
import Navbar from "@/components/layout/Navbar";
import { div } from "framer-motion/client";

export default function CommunityPage() {
  const [trips, setTrips] = useState<any[]>([]);

  useEffect(() => {
    async function loadTrips() {
      const data = await getPublicTrips();
      setTrips(data);
    }

    loadTrips();
  }, []);

  return (
    <div>
      <Navbar />
      <main className="min-h-screen bg-[#050816] px-6 py-24 text-white">
        <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-5xl font-bold">
            Community Stories
          </h1>
        </div>
          <p className="mb-12 text-gray-400">
            Discover journeys shared by travelers.
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {trips.map((trip) => (
              <div
                key={trip.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
              >
                <h2 className="mb-3 text-2xl font-semibold">
                  {trip.title}
                </h2>

                <div className="mb-4">
                  <p className="text-sm text-cyan-400">
                    @{trip.profiles?.username || "traveler"}
                  </p>

                  <p className="text-xs text-gray-500">
                    {trip.profiles?.travel_style || "Traveler"}
                  </p>
                </div>

                <p className="mb-4 text-gray-400">
                  {trip.destination}
                </p>

                <p className="mb-6 text-sm text-gray-500">
                  {new Date(
                    trip.created_at
                  ).toLocaleDateString()}
                </p>

                <Link
                  href={`/community/${trip.id}`}
                  className="text-cyan-400 hover:text-cyan-300"
                >
                  Read Story →
                </Link>
              </div>
            ))}

          </div>
        </div>
      </main>
    </div>
  );
}