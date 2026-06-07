"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-[#030712]"
        >
          {/* Ambient Glow */}
          <div className="absolute h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-3xl" />

          {/* Logo Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="relative z-10 text-center"
          >
            <motion.h1
              animate={{
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="mb-6 text-5xl font-bold tracking-wide md:text-7xl"
            >
              Moksh Yatri
            </motion.h1>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.8 }}
              className="mx-auto h-[2px] w-40 origin-left rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500"
            />

            <p className="mt-6 text-sm uppercase tracking-[0.4em] text-gray-400">
              Cinematic Journeys Await
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}