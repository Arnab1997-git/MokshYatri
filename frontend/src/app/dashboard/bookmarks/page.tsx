"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { supabase } from "@/lib/supabase";
import { getBookmarkedGems } from "@/services/bookmarkService";
import CustomerPortalNav from "@/components/customer/CustomerPortalNav";

export default function BookmarksPage() {
  const [gems, setGems] = useState<any[]>([]);

  useEffect(() => {
    async function loadBookmarks() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const data = await getBookmarkedGems(
        user.id
      );

      setGems(data);
    }

    loadBookmarks();
  }, []);

  return (
    <main className="min-h-screen bg-[#050816] px-6 py-24 text-white">
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 text-sm uppercase tracking-[0.4em] text-cyan-400">
            Customer Portal
        </p>
        <CustomerPortalNav />
        <h1 className="mb-4 text-5xl font-bold">
          Saved Hidden Gems
        </h1>

        <p className="mb-12 text-gray-400">
          Your personal collection of discoveries.
        </p>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {gems.map((item) => {
            const gem = item.hidden_gems;

            return (
              <Link
                href={`/hidden-gems/${gem.id}`}
                key={gem.id}
                className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl transition hover:-translate-y-2"
              >

                {gem.image_url && (
                  <div className="h-56 overflow-hidden">
                    <img
                      src={gem.image_url}
                      alt={gem.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />
                  </div>
                )}

                <div className="p-6">

                  <h2 className="mb-3 text-2xl font-semibold">
                    {gem.title}
                  </h2>

                  <p className="mb-3 text-cyan-400">
                    📍 {gem.location}
                  </p>

                  <p className="text-gray-300">
                    {gem.description}
                  </p>

                </div>

              </Link>
            );
          })}

        </div>
      </div>
    </main>
  );
}