"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 text-center sm:px-6 md:px-12">
      <div className="relative z-10 max-w-6xl">
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mb-6 text-[10px] uppercase tracking-[0.5em] text-gray-400 sm:text-xs md:text-sm"
        >
          Journey Beyond Destinations
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="mb-8 text-5xl font-bold leading-tight sm:text-6xl md:text-8xl"
        >
          Discover The
          <span className="block bg-gradient-to-r from-white via-blue-200 to-cyan-300 bg-clip-text text-transparent">
            Soul Of Travel
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="mx-auto max-w-2xl px-2 text-base leading-relaxed text-gray-300 sm:text-lg md:text-xl"
        >
          Explore cinematic journeys, hidden stories, and unforgettable
          experiences crafted for modern explorers.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <button className="w-full rounded-full bg-white px-8 py-4 font-medium text-black transition hover:scale-105 sm:w-auto">
            Start Exploring
          </button>

          <Link
            href="/plan-my-trip"
            className="w-full rounded-full border border-cyan-400 px-8 py-4 text-cyan-400 transition hover:bg-cyan-400 hover:text-black sm:w-auto"
          >
            Plan My Trip
          </Link>
        </motion.div>
      </div>
    </section>
  );
}