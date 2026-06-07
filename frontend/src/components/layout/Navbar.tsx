"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getCurrentProfile } from "@/services/authService";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [profile, setProfile] =
    useState<any>(null);

  const [showMenu, setShowMenu] =
    useState(false);

  const dropdownRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {

    async function loadUser() {

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      setUser(user);

      if (user) {

        const profile =
          await getCurrentProfile();

        setProfile(profile);

      }

    }

    loadUser();

  }, []);

  useEffect(() => {

    function handleClickOutside(
      event: MouseEvent
    ) {

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) {

        setShowMenu(false);

      }

    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

    };

  }, []);

  async function handleLogout() {

    await supabase.auth.signOut();

    window.location.href = "/";

  }

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="fixed top-0 z-50 w-full px-4 py-4 md:px-8"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/10 bg-[#0a1020]/70 px-5 py-4 backdrop-blur-xl supports-[backdrop-filter]:bg-[#0a1020]/50">

          {/* Logo */}
          <Link
            href="/"
            className="text-lg font-semibold tracking-wide md:text-xl"
          >
            Moksh Yatri
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 text-sm text-gray-300 md:flex">

            <Link
              href="/plan"
              className="transition hover:text-white"
            >
              Journeys
            </Link>

            <Link
              href="/community"
              className="transition hover:text-white"
            >
              Stories
            </Link>

            <Link
              href="/hidden-gems"
              className="transition hover:text-white"
            >
              Hidden Gems
            </Link>

            <Link
              href="/recommendations"
              className="transition hover:text-white"
            >
              For You
            </Link>
            
            <Link
              href="/dream-trips"
              className="transition hover:text-white"
            >
              Dream Trips
            </Link>

            <Link
              href="/personality"
              className="transition hover:text-white"
            >
              Personality
            </Link>

            <Link
              href="/community"
              className="transition hover:text-white"
            >
              Community
            </Link>

          </div>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-4 md:flex">

            {!user && (

              <>

                <Link
                  href="/login"
                  className="text-sm text-gray-300 transition hover:text-white"
                >
                  Login
                </Link>

                <Link
                  href="/signup"
                  className="rounded-full border border-white/10 bg-white/10 px-5 py-2 text-sm backdrop-blur-md transition hover:bg-white/20"
                >
                  Sign Up
                </Link>

              </>

            )}

            {user && (

              <div
                className="relative"
                ref={dropdownRef}
              >

                <button
                  onClick={() =>
                    setShowMenu(!showMenu)
                  }
                  className="rounded-full border border-white/10 bg-white/10 px-5 py-2 text-sm backdrop-blur-md transition hover:bg-white/20"
                >

                  {profile?.username ||
                    profile?.full_name ||
                    "Traveler"}{" "}
                  ▼

                </button>

                {showMenu && (

                  <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-white/10 bg-[#0a1020] p-2 shadow-xl">

                    <Link
                      href="/dashboard"
                      className="block rounded-xl px-4 py-3 text-sm hover:bg-white/10"
                    >
                      Customer Portal
                    </Link>

                    {profile?.role ===
                      "ADMIN" && (

                      <Link
                        href="/admin"
                        className="block rounded-xl px-4 py-3 text-sm hover:bg-white/10"
                      >
                        Admin Portal
                      </Link>

                    )}

                    <button
                      onClick={handleLogout}
                      className="block w-full rounded-xl px-4 py-3 text-left text-sm hover:bg-white/10"
                    >
                      Logout
                    </button>

                  </div>

                )}

              </div>

            )}

          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="text-white md:hidden"
          >
            <Menu size={28} />
          </button>

        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4 }}
              className="fixed right-0 top-0 z-50 flex h-full w-[85%] max-w-sm flex-col border-l border-white/10 bg-[#050816]/95 p-8 backdrop-blur-2xl"
            >
              <div className="mb-12 flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  Moksh Yatri
                </h2>

                <button onClick={() => setIsOpen(false)}>
                  <X size={30} />
                </button>
              </div>

              <div className="flex flex-col gap-8 text-lg">

                <Link
                  href="/plan"
                  onClick={() => setIsOpen(false)}
                  className="transition hover:text-cyan-300"
                >
                  Journeys
                </Link>

                <Link
                  href="/community"
                  onClick={() => setIsOpen(false)}
                  className="transition hover:text-cyan-300"
                >
                  Stories
                </Link>

                <Link
                  href="/hidden-gems"
                  onClick={() => setIsOpen(false)}
                  className="transition hover:text-cyan-300"
                >
                  Hidden Gems
                </Link>

                <Link
                  href="/recommendations"
                  onClick={() => setIsOpen(false)}
                  className="transition hover:text-cyan-300"
                >
                  For You
                </Link>

                <Link
                  href="/dream-trips"
                  onClick={() => setIsOpen(false)}
                  className="transition hover:text-cyan-300"
                >
                  Dream Trips
                </Link>

                <Link
                  href="/personality"
                  onClick={() => setIsOpen(false)}
                  className="transition hover:text-cyan-300"
                >
                  Personality
                </Link>

                <Link
                  href="/community"
                  onClick={() => setIsOpen(false)}
                  className="transition hover:text-cyan-300"
                >
                  Community
                </Link>

              </div>

              <Link
                href="/plan"
                onClick={() => setIsOpen(false)}
                className="mt-auto rounded-full border border-white/10 bg-white/10 px-6 py-4 text-center transition hover:bg-white/20"
              >
                Plan Your Journey
              </Link>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}