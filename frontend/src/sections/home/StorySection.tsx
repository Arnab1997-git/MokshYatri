"use client";

import { motion } from "framer-motion";

export default function StorySection() {
  return (
    <section className="relative z-10 overflow-hidden px-5 py-24 sm:px-6 md:px-12 md:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-24 md:grid-cols-2">
        
        {/* LEFT IMAGE */}
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="group relative overflow-hidden rounded-[2rem] min-h-[260px]"
        >
          <div
            className="h-[400px] sm:h-[500px] md:h-[600px] bg-cover bg-center transition duration-700 group-hover:scale-105"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e')",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
          </div>
        </motion.div>

        {/* RIGHT CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <p className="mb-4 text-sm uppercase tracking-[0.4em] text-gray-400">
            Why We Travel
          </p>

          <h2 className="mb-8 text-4xl font-bold leading-tight md:text-6xl">
            Travel Changes
            <span className="block bg-gradient-to-r from-white via-blue-200 to-cyan-300 bg-clip-text text-transparent">
              More Than Places
            </span>
          </h2>

          <p className="mb-6 text-lg leading-relaxed text-gray-300">
            The most unforgettable journeys are not measured by
            kilometers, but by the moments that quietly change us.
          </p>

          <p className="mb-10 text-lg leading-relaxed text-gray-300">
            From mountain roads wrapped in clouds to hidden cafés in
            unfamiliar cities, every destination carries a story waiting
            to become yours.
          </p>

          <button className="rounded-full border border-white/10 bg-white/10 px-8 py-4 backdrop-blur-md transition hover:bg-white/20">
            Discover Stories
          </button>
        </motion.div>
      </div>
    </section>
  );
}