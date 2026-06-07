"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

import { getPublicTripById } from "@/services/communityDetailService";
import Navbar from "@/components/layout/Navbar";

export default function CommunityStoryPage() {
  const params = useParams();
  const id = params.id as string;

  const [trip, setTrip] = useState<any>(null);

  useEffect(() => {
    async function loadTrip() {
      if (!id) return;

      const data = await getPublicTripById(id);
      setTrip(data);
    }

    loadTrip();
  }, [id]);

  if (!trip) {
    return (
      <main className="min-h-screen bg-[#050816] flex items-center justify-center text-white">
        <div className="text-center">
          <div className="mb-4 text-4xl">🌍</div>
          <p className="text-gray-400">
            Loading community story...
          </p>
        </div>
      </main>
    );
  }

  return (
    <div>
      <Navbar />
      <main className="min-h-screen bg-[#050816] px-6 py-24 text-white">
        <div className="mx-auto max-w-5xl">

          <Link
            href="/community"
            className="mb-10 inline-block text-cyan-400 transition hover:text-cyan-300"
          >
            ← Back to Community
          </Link>

          <div className="mb-12">
            <h1 className="mb-5 text-5xl font-bold md:text-6xl">
              {trip.title}
            </h1>

            <div className="mb-6 flex flex-wrap gap-3 text-gray-400">
              <span>{trip.destination}</span>
              <span>•</span>
              <span>
                {new Date(
                  trip.created_at
                ).toLocaleDateString()}
              </span>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">

              <div className="flex items-center gap-4">

                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-400 text-xl font-bold text-black">
                  {trip.profiles?.full_name
                    ?.charAt(0)
                    ?.toUpperCase() || "T"}
                </div>

                <div>
                  <h3 className="text-xl font-semibold">
                    {trip.profiles?.full_name ||
                      "Traveler"}
                  </h3>

                  <p className="text-cyan-400">
                    @{trip.profiles?.username || "user"}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2">

                    {trip.profiles?.home_city && (
                      <span className="rounded-full border border-white/10 px-3 py-1 text-sm text-gray-300">
                        📍 {trip.profiles.home_city}
                      </span>
                    )}

                    {trip.profiles?.travel_style && (
                      <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-300">
                        🎬 {trip.profiles.travel_style}
                      </span>
                    )}

                  </div>
                </div>

              </div>

            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl">

            <ReactMarkdown
              components={{
                h1: (props) => (
                  <h1 className="mb-6 text-4xl font-bold text-white">
                    {props.children}
                  </h1>
                ),

                h2: (props) => (
                  <h2 className="mb-5 mt-10 text-3xl font-semibold text-cyan-300">
                    {props.children}
                  </h2>
                ),

                h3: (props) => (
                  <h3 className="mb-4 mt-8 text-2xl font-semibold text-white">
                    {props.children}
                  </h3>
                ),

                p: (props) => (
                  <p className="mb-4 leading-8 text-gray-300">
                    {props.children}
                  </p>
                ),

                strong: (props) => (
                  <strong className="font-bold text-white">
                    {props.children}
                  </strong>
                ),

                ul: (props) => (
                  <ul className="mb-6 ml-6 list-disc space-y-2 text-gray-300">
                    {props.children}
                  </ul>
                ),

                ol: (props) => (
                  <ol className="mb-6 ml-6 list-decimal space-y-2 text-gray-300">
                    {props.children}
                  </ol>
                ),

                li: (props) => (
                  <li>{props.children}</li>
                ),

                blockquote: (props) => (
                  <blockquote className="my-6 border-l-4 border-cyan-400 pl-4 italic text-gray-300">
                    {props.children}
                  </blockquote>
                ),
              }}
            >
              {trip.itinerary.content}
            </ReactMarkdown>

          </div>
        </div>
      </main>
    </div>
  );
}