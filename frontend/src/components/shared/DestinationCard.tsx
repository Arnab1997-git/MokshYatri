"use client";

import { motion } from "framer-motion";

interface DestinationCardProps {
  title: string;
  description: string;
  image: string;
}

export default function DestinationCard({
  title,
  description,
  image,
}: DestinationCardProps) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ duration: 0.4 }}
      className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 transition duration-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]"    >
      <div
        className="h-[350px] sm:h-[420px] md:h-[450px] bg-cover bg-center transition duration-700 group-hover:scale-110"
        style={{
          backgroundImage: `url(${image})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      <div className="absolute bottom-0 z-10 p-6">
        <h3 className="mb-3 text-3xl font-bold">
          {title}
        </h3>

        <p className="max-w-sm text-sm leading-relaxed text-gray-300">
          {description}
        </p>
      </div>
    </motion.div>
  );
}