"use client";

import { useEffect, useState } from "react";

import DestinationCard from "@/components/shared/DestinationCard";
import Reveal from "@/components/animations/Reveal";

import { getDestinations } from "@/services/destinationService";

export default function Destinations() {
  const [destinations, setDestinations] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getDestinations();
      setDestinations(data);
    }

    fetchData();
  }, []);

  return (
    <section className="relative z-10 px-5 py-24 sm:px-6 md:px-12 md:py-32">
      
      <div className="mx-auto max-w-7xl">
        
        <div className="mb-20 text-center">
          
          <p className="mb-4 text-sm uppercase tracking-[0.4em] text-gray-400">
            Featured Journeys
          </p>

          <h2 className="mb-6 text-4xl font-bold md:text-6xl">
            Explore Destinations
          </h2>

          <p className="mx-auto max-w-2xl text-lg text-gray-300">
            Discover immersive journeys crafted for explorers,
            storytellers, and dreamers.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {destinations.map((destination, index) => (
            <Reveal
              key={destination.id}
              delay={index * 0.15}
            >
              <DestinationCard
                title={destination.title}
                description={destination.description}
                image={
                  destination.image_url ||
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