"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

import { getItineraryById } from "@/services/itineraryDetailService";
import { publishTrip } from "@/services/communityService";

export default function ItineraryPage() {
  const params = useParams();
  const id = params.id as string;

  const [trip, setTrip] = useState<any>(null);
  const [publishing, setPublishing] = useState(false);

  async function handlePublish() {
    if (!trip) return;

    setPublishing(true);

    const success = await publishTrip(
      trip.id.toString()
    );

    if (success) {
      setTrip({
        ...trip,
        is_public: true,
      });

      alert("Journey published successfully!");
    }

    setPublishing(false);
  }

  useEffect(() => {
    async function loadTrip() {
      if (!id) return;

      const data = await getItineraryById(id);

      setTrip(data);
    }

    loadTrip();
  }, [id]);

  if (!trip) {
    return (
      <main className="min-h-screen bg-[#050816] flex items-center justify-center text-white">
        <div className="text-center">
          <div className="mb-4 text-2xl">🌍</div>
          <p className="text-gray-400">
            Loading your journey...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050816] px-6 py-24 text-white">
      <div className="mx-auto max-w-5xl">

        <Link
          href="/dashboard"
          className="mb-10 inline-block text-cyan-400 transition hover:text-cyan-300"
        >
          ← Back to Dashboard
        </Link>

        <div className="mb-12">
          <h1 className="mb-4 text-5xl font-bold md:text-6xl">
            {trip.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
            <span>{trip.destination}</span>

            <span>•</span>

            <span>
              {new Date(
                trip.created_at
              ).toLocaleDateString()}
            </span>
          </div>

          <div className="mt-6 flex gap-4">

            {!trip.is_public && (
              <button
                onClick={handlePublish}
                disabled={publishing}
                className="rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 font-semibold text-black shadow-lg hover:scale-105 transition"
              >
                {publishing
                  ? "Publishing..."
                  : "Publish Story"}
              </button>
            )}

            {trip.is_public && (
              <span className="rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-green-400">
                ✓ Published
              </span>
            )}

          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-12 backdrop-blur-xl">

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
  );
}