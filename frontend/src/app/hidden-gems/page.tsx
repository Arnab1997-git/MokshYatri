"use client";

import { useEffect, useState } from "react";

import { getHiddenGems } from "@/services/hiddenGemService";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";


export default function HiddenGemsPage() {
  const [gems, setGems] = useState<any[]>([]);

  useEffect(() => {
    async function loadGems() {
      const data = await getHiddenGems();
      setGems(data);
    }

    loadGems();
  }, []);

  return (
    <main className="min-h-screen bg-[#050816] px-6 py-24 text-white">
      <Navbar />
      <div className="mx-auto max-w-7xl">

        <div className="mb-16 text-center">
            <p className="mb-4 text-sm uppercase tracking-[0.4em] text-gray-400">
                Hidden Discoveries
            </p>

            <h1 className="mb-6 text-5xl font-bold md:text-6xl">
                Hidden Gems
            </h1>

            <p className="mx-auto max-w-2xl text-gray-400">
                Discover secret cafés, viewpoints, local experiences,
                and unforgettable places shared by travelers.
            </p>

            <Link
                href="/hidden-gems/add"
                className="mt-8 inline-block rounded-full bg-white px-6 py-3 font-medium text-black transition hover:scale-105"
            >
                Add Hidden Gem
            </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {gems.map((gem) => (
            <Link
              href={`/hidden-gems/${gem.id}`}
              key={gem.id}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-cyan-400/30"
            >

              {gem.image_url && (
                <div className="relative h-64 overflow-hidden">

                  <img
                    src={gem.image_url}
                    alt={gem.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                </div>
              )}

              <div className="p-6">

                <h2 className="mb-3 text-2xl font-semibold">
                  {gem.title}
                </h2>

                <p className="mb-4 text-cyan-400">
                  📍 {gem.location}
                </p>

                <p className="mb-5 leading-relaxed text-gray-300">
                  {gem.description}
                </p>

                {gem.vibe && (
                  <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
                    ✨ {gem.vibe}
                  </span>
                )}

              </div>
            </Link>
          ))}

        </div>
      </div>
    </main>
  );
}