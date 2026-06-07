"use client";

import { motion } from "framer-motion";

interface HiddenGemCardProps {
  title: string;
  location: string;
  description: string;
}

export default function HiddenGemCard({
  title,
  location,
  description,
}: HiddenGemCardProps) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ duration: 0.4 }}
      className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition duration-500 hover:border-cyan-400/30 hover:shadow-[0_0_60px_rgba(34,211,238,0.15)]"
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 via-transparent to-blue-500/5 opacity-0 transition duration-500 group-hover:opacity-100" />

      <div className="relative z-10">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-cyan-300">
          {location}
        </p>

        <h3 className="mb-4 text-3xl font-bold">
          {title}
        </h3>

        <p className="leading-relaxed text-gray-300">
          {description}
        </p>

        <button className="mt-8 text-sm font-medium text-cyan-300 transition hover:text-cyan-200">
          Discover More →
        </button>
      </div>
    </motion.div>
  );
}