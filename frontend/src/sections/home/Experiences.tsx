"use client";

import { useEffect, useState } from "react";

import Reveal from "@/components/animations/Reveal";
import ExperienceCard from "@/components/shared/ExperienceCard";

import { getStories } from "@/services/storyService";

export default function Experiences() {
  const [stories, setStories] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getStories();
      setStories(data);
    }

    fetchData();
  }, []);

  return (
    <section className="relative z-10 overflow-hidden px-5 py-24 sm:px-6 md:px-12 md:py-32">

      <div className="mx-auto max-w-7xl">

        <div className="mb-20 text-center">

          <p className="mb-4 text-sm uppercase tracking-[0.4em] text-gray-400">
            Cinematic Experiences
          </p>

          <h2 className="mb-6 text-4xl font-bold md:text-6xl">
            Moments That Stay
          </h2>

          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-300">
            Beyond destinations, discover unforgettable moments captured
            through immersive travel experiences.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {stories.map((story, index) => (
            <Reveal
              key={story.id}
              delay={index * 0.15}
            >
              <ExperienceCard
                title={story.title}
                location={story.destination}
                image={
                  story.cover_image ||
                  "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
                }
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}