"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/dist/client/link";
import Navbar from "@/components/layout/Navbar";

const questions = [
  {
    question: "What excites you most while travelling?",
    options: [
      "Photography & scenery",
      "Inner peace",
      "Adventure",
      "Luxury experiences",
      "Local culture",
    ],
  },
  {
    question: "Your ideal morning?",
    options: [
      "Sunrise viewpoint",
      "Meditation retreat",
      "Mountain trek",
      "Boutique breakfast",
      "Exploring local markets",
    ],
  },
  {
    question: "Which travel memory matters most?",
    options: [
      "Movie-like moments",
      "Spiritual growth",
      "Thrilling experiences",
      "Premium comfort",
      "Stories from locals",
    ],
  },
  {
    question: "What would you rather discover?",
    options: [
      "Hidden café",
      "Ancient monastery",
      "Secret trail",
      "Luxury resort",
      "Historic neighborhood",
    ],
  },
  {
    question: "Choose your perfect evening:",
    options: [
      "Sunset photography",
      "Silent reflection",
      "Campfire adventure",
      "Rooftop dining",
      "Local cultural show",
    ],
  },
];

const personalities = [
  {
    name: "Cinematic Explorer",
    emoji: "🎬",
    description:
      "You seek destinations that feel like scenes from a movie. Misty mountains, hidden cafés, atmospheric streets and unforgettable viewpoints define your journeys.",
  },
  {
    name: "Soul Seeker",
    emoji: "🧘",
    description:
      "You travel to reconnect with yourself. Peaceful monasteries, meaningful conversations and spiritual experiences shape your adventures.",
  },
  {
    name: "Wanderlust Adventurer",
    emoji: "⛰️",
    description:
      "You thrive on exploration and uncertainty. Treks, road trips and hidden paths are where you feel most alive.",
  },
  {
    name: "Luxury Nomad",
    emoji: "✨",
    description:
      "You appreciate refined experiences. Boutique stays, premium comfort and carefully curated journeys define your travel style.",
  },
  {
    name: "Cultural Storyteller",
    emoji: "🌍",
    description:
      "You travel for stories, people and traditions. Every destination is an opportunity to learn and connect.",
  },
];

export default function PersonalityPage() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  async function handleAnswer(
    optionIndex: number
  ) {
    const updated = [...answers, optionIndex];
    setAnswers(updated);

    if (current < questions.length - 1) {
      setCurrent(current + 1);
      return;
    }

    const scores = [0, 0, 0, 0, 0];

    updated.forEach((answer) => {
      scores[answer]++;
    });

    const winner = scores.indexOf(
      Math.max(...scores)
    );

    const personality =
      personalities[winner];

    setResult(personality);

    setSaving(true);

    const styleMap: Record<string, string> = {
      "Cinematic Explorer": "cinematic",
      "Soul Seeker": "spiritual",
      "Wanderlust Adventurer": "adventure",
      "Luxury Nomad": "luxury",
      "Cultural Storyteller": "cultural",
    };

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {

      await supabase
        .from("profiles")
        .update({

          travel_personality:
            personality.name,

          travel_style:
            styleMap[
              personality.name
            ],

        })
        .eq("id", user.id);

    }

    setSaving(false);
  }

  return (
    <main className="min-h-screen bg-[#050816] px-6 py-24 text-white">

      <Navbar />
      <div className="mx-auto max-w-3xl">

        {!result && (
          <>
            <div className="mb-10">

              <div className="mb-4 flex justify-between text-sm text-gray-400">

                <span>
                  Question {current + 1}
                </span>

                <span>
                  {questions.length}
                </span>

              </div>

              <div className="h-2 overflow-hidden rounded-full bg-white/10">

                <div
                  className="h-full bg-cyan-400 transition-all"
                  style={{
                    width: `${
                      ((current + 1) /
                        questions.length) *
                      100
                    }%`,
                  }}
                />

              </div>

            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl">

              <h1 className="mb-10 text-4xl font-bold">
                {
                  questions[current]
                    .question
                }
              </h1>

              <div className="space-y-4">

                {questions[
                  current
                ].options.map(
                  (
                    option,
                    index
                  ) => (
                    <button
                      key={index}
                      onClick={() =>
                        handleAnswer(
                          index
                        )
                      }
                      className="w-full rounded-2xl border border-white/10 p-5 text-left transition hover:border-cyan-400 hover:bg-white/5"
                    >
                      {option}
                    </button>
                  )
                )}

              </div>

            </div>
          </>
        )}

        {result && (
          <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/5 p-10 text-center">

            <div className="mb-6 text-7xl">
              {result.emoji}
            </div>

            <h1 className="mb-6 text-5xl font-bold">
              {result.name}
            </h1>

            <p className="mx-auto max-w-2xl leading-8 text-gray-300">
              {result.description}
            
            </p>
            <Link
              href={`/recommendations?personality=${encodeURIComponent(
                result.name
              )}`}
              className="mt-8 inline-block rounded-full bg-cyan-400 px-8 py-4 font-semibold text-black"
            >
              Discover Recommended Trips
            </Link>


            {saving && (
              <p className="mt-6 text-cyan-300">
                Saving personality...
              </p>
            )}

          </div>
        )}

      </div>

    </main>
  );
}