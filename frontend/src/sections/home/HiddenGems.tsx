"use client";

import { useEffect, useState } from "react";

import Reveal from "@/components/animations/Reveal";
import HiddenGemCard from "@/components/shared/HiddenGemCard";

import { getHiddenGems } from "@/services/hiddenGemService";

export default function HiddenGems() {
  const [hiddenGems, setHiddenGems] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getHiddenGems();
      setHiddenGems(data);
    }

    fetchData();
  }, []);

  return (
    <section className="relative z-10 px-5 py-24 sm:px-6 md:px-12 md:py-32">
      
      <div className="mx-auto max-w-7xl">
        
        <div className="mb-20 text-center">
          
          <p className="mb-4 text-sm uppercase tracking-[0.4em] text-gray-400">
            Hidden Discoveries
          </p>

          <h2 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">
            Explore The
            <span className="block bg-gradient-to-r from-white via-blue-200 to-cyan-300 bg-clip-text text-transparent">
              Unknown
            </span>
          </h2>

          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-300">
            Beyond tourist attractions lies a world filled with hidden cafés,
            secret beaches, mountain stories, and unforgettable encounters.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {hiddenGems.map((gem, index) => (
            <Reveal
              key={gem.id}
              delay={index * 0.15}
            >
              <HiddenGemCard
                title={gem.title}
                location={gem.location}
                description={gem.description}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}