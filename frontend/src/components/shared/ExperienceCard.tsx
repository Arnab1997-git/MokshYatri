"use client";

import { motion } from "framer-motion";

interface ExperienceCardProps {
  title: string;
  location: string;
  image: string;
}

export default function ExperienceCard({
  title,
  location,
  image,
}: ExperienceCardProps) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ duration: 0.4 }}
      className="group relative overflow-hidden rounded-[2rem] border border-white/10 transition duration-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]"
    >
      <div
        className="h-[420px] sm:h-[500px] md:h-[550px] bg-cover bg-center transition duration-700 group-hover:scale-110"
        style={{
          backgroundImage: `url(${image})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>

      <div className="absolute bottom-0 z-10 p-6">
        <p className="mb-2 text-sm uppercase tracking-[0.3em] text-gray-300">
          {location}
        </p>

        <h3 className="text-3xl font-bold">
          {title}
        </h3>
      </div>
    </motion.div>
  );
}