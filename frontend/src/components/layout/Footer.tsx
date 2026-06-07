"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden px-6 py-24 md:px-12">
      
      {/* Ambient Glow */}
      <div className="absolute bottom-0 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="relative z-10 mx-auto max-w-5xl rounded-[2rem] border border-white/5 bg-white/5 p-8 sm:p-10 md:p-12 backdrop-blur-xl"
      >
        <div className="grid gap-12 md:grid-cols-3">
          
          {/* Brand */}
          <div>
            <h2 className="mb-4 text-3xl font-bold">
              Moksh Yatri
            </h2>

            <p className="leading-relaxed text-gray-300">
              Cinematic journeys, hidden stories, and unforgettable
              experiences crafted for modern explorers.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-4 text-xl font-semibold">
              Explore
            </h3>

            <div className="flex flex-col gap-3 text-gray-300">
              <button className="text-left transition hover:translate-x-1 hover:text-white">
                Journeys
              </button>

              <button className="text-left transition hover:translate-x-1 hover:text-white">
                Stories
              </button>

              <button className="text-left transition hover:translate-x-1 hover:text-white">
                Hidden Gems
              </button>

              <button className="text-left transition hover:translate-x-1 hover:text-white">
                Community
              </button>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-4 text-xl font-semibold">
              Stay Inspired
            </h3>

            <p className="mb-6 text-gray-300">
              Receive cinematic travel stories and hidden discoveries.
            </p>

            <div className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="rounded-full border border-white/5 bg-white/10 px-6 py-4 outline-none transition placeholder:text-gray-400 focus:border-cyan-400/40"
              />

              <button className="rounded-full bg-white px-6 py-4 font-medium text-black transition hover:scale-105">
                Join The Journey
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-white/5 pt-8 text-center text-sm text-gray-400">
          © 2026 Moksh Yatri. Crafted for explorers.
        </div>
      </motion.div>
    </footer>
  );
}