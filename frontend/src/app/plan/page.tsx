"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/lib/supabase";
import { saveItinerary } from "@/services/itineraryService";
import Navbar from "@/components/layout/Navbar";

export default function PlanPage() {
const [destination, setDestination] = useState("");
const [days, setDays] = useState("");
const [style, setStyle] = useState("");

const [loading, setLoading] = useState(false);
const [result, setResult] = useState("");

async function generateItinerary() {
try {
setLoading(true);
setResult("");


  const response = await fetch("/api/generate-itinerary", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      destination,
      days,
      style,
    }),
  });

  const data = await response.json();

  setResult(data.result);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await saveItinerary(
      user.id,
      destination,
      data.result
    );

    console.log("Itinerary saved successfully");
  }
} catch (error) {
  console.error(error);
  setResult(
    "Something went wrong while generating your journey."
  );
} finally {
  setLoading(false);
}

}

return ( 
<div>
  <Navbar />

  <main className="min-h-screen bg-[#050816] px-6 py-24 text-white"> <div className="mx-auto max-w-5xl"> <h1 className="mb-4 text-center text-5xl font-bold md:text-6xl">
  AI Journey Planner </h1>

      <p className="mb-12 text-center text-gray-400">
        Generate cinematic travel itineraries powered by AI.
      </p>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <div className="space-y-5">
          <input
            placeholder="Destination (e.g. Vietnam)"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 p-5 outline-none transition focus:border-cyan-400"
          />

          <input
            placeholder="Number of Days"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 p-5 outline-none transition focus:border-cyan-400"
          />

          <input
            placeholder="Travel Style (cinematic, luxury, backpacking...)"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 p-5 outline-none transition focus:border-cyan-400"
          />

          <button
            onClick={generateItinerary}
            disabled={loading}
            className="rounded-full bg-white px-8 py-4 font-medium text-black transition hover:scale-105 disabled:opacity-50"
          >
            {loading
              ? "Generating Your Journey..."
              : "Generate Journey"}
          </button>
        </div>
      </div>

      {result && (
        <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <ReactMarkdown
            components={{
              h1: (props) => (
                <h1 className="mb-6 text-4xl font-bold">
                  {props.children}
                </h1>
              ),

              h2: (props) => (
                <h2 className="mb-4 mt-8 text-3xl font-semibold text-cyan-300">
                  {props.children}
                </h2>
              ),

              h3: (props) => (
                <h3 className="mb-3 mt-6 text-2xl font-semibold">
                  {props.children}
                </h3>
              ),

              p: (props) => (
                <p className="mb-4 leading-relaxed text-gray-300">
                  {props.children}
                </p>
              ),

              strong: (props) => (
                <strong className="font-bold text-white">
                  {props.children}
                </strong>
              ),

              ul: (props) => (
                <ul className="mb-4 ml-6 list-disc space-y-2">
                  {props.children}
                </ul>
              ),

              li: (props) => (
                <li className="text-gray-300">
                  {props.children}
                </li>
              ),
            }}
          >
            {result}
          </ReactMarkdown>
        </div>
      )}
    </div>
  </main>
</div>

);
}
