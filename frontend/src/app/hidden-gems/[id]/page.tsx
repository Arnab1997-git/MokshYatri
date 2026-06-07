"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { getHiddenGemById } from "@/services/hiddenGemDetailService";
import { supabase } from "@/lib/supabase";

import {
  likeGem,
  unlikeGem,
  hasUserLikedGem,
  bookmarkGem,
  removeBookmark,
  hasUserBookmarkedGem,
  getGemLikes,
} from "@/services/gemInteractionService";
import Navbar from "@/components/layout/Navbar";

export default function HiddenGemPage() {
  const params = useParams();
  const id = params.id as string;

  const [gem, setGem] = useState<any>(null);

  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  const [bookmarked, setBookmarked] =
    useState(false);

  const [loadingLike, setLoadingLike] =
    useState(false);

  const [loadingBookmark, setLoadingBookmark] =
    useState(false);

  async function handleLike() {
    if (!gem) return;

    setLoadingLike(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first.");
      setLoadingLike(false);
      return;
    }

    if (liked) {
      const success = await unlikeGem(
        gem.id,
        user.id
      );

      if (success) {
        setLiked(false);

        setLikes((prev) =>
          Math.max(prev - 1, 0)
        );
      }
    } else {
      const success = await likeGem(
        gem.id,
        user.id
      );

      if (success) {
        setLiked(true);

        setLikes((prev) => prev + 1);
      }
    }

    setLoadingLike(false);
  }

  async function handleBookmark() {
    if (!gem) return;

    setLoadingBookmark(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first.");
      setLoadingBookmark(false);
      return;
    }

    if (bookmarked) {
      const success =
        await removeBookmark(
          gem.id,
          user.id
        );

      if (success) {
        setBookmarked(false);
      }
    } else {
      const success =
        await bookmarkGem(
          gem.id,
          user.id
        );

      if (success) {
        setBookmarked(true);
      }
    }

    setLoadingBookmark(false);
  }

  useEffect(() => {
    async function loadGem() {
      if (!id) return;

      const data = await getHiddenGemById(id);

      setGem(data);

      const likeCount =
        await getGemLikes(Number(id));

      setLikes(likeCount);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const likedAlready =
          await hasUserLikedGem(
            Number(id),
            user.id
          );

        setLiked(likedAlready);

        const bookmarkedAlready =
          await hasUserBookmarkedGem(
            Number(id),
            user.id
          );

        setBookmarked(
          bookmarkedAlready
        );
      }
    }

    loadGem();
  }, [id]);

  if (!gem) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050816] text-white">
        Loading hidden gem...
      </main>
    );
  }

  return (


    <main className="min-h-screen bg-[#050816] text-white">
      <Navbar />
      {gem.image_url && (
        <div className="relative h-[60vh] overflow-hidden">

          <img
            src={gem.image_url}
            alt={gem.title}
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-black/30 to-transparent" />

        </div>
      )}

      <div className="mx-auto max-w-5xl px-6 py-16">

        <Link
          href="/hidden-gems"
          className="mb-10 inline-block text-cyan-400 transition hover:text-cyan-300"
        >
          ← Back to Hidden Gems
        </Link>

        <h1 className="mb-4 text-5xl font-bold md:text-6xl">
          {gem.title}
        </h1>

        {/* Actions */}

        <div className="mb-8 flex flex-wrap gap-4">

          <button
            onClick={handleLike}
            disabled={loadingLike}
            className="rounded-full border border-pink-500/30 bg-pink-500/10 px-5 py-2 text-pink-300 transition hover:scale-105 disabled:opacity-50"
          >
            {loadingLike
              ? "..."
              : `${liked ? "❤️" : "🤍"} ${likes}`}
          </button>

          <button
            onClick={handleBookmark}
            disabled={loadingBookmark}
            className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-cyan-300 transition hover:scale-105 disabled:opacity-50"
          >
            {loadingBookmark
              ? "..."
              : bookmarked
              ? "✅ Saved"
              : "🔖 Save"}
          </button>

        </div>

        {/* Tags */}

        <div className="mb-8 flex flex-wrap gap-3">

          <span className="rounded-full border border-white/10 px-4 py-2 text-gray-300">
            📍 {gem.location}
          </span>

          {gem.vibe && (
            <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-cyan-300">
              ✨ {gem.vibe}
            </span>
          )}

        </div>

        {/* Description */}

        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl">

          <h2 className="mb-6 text-3xl font-semibold">
            About this Gem
          </h2>

          <p className="leading-8 text-gray-300">
            {gem.description}
          </p>

        </div>
        {/* PLAN THIS TRIP */}

        <div className="mt-10 rounded-3xl border border-cyan-400/20 bg-cyan-400/5 p-10">

          <h2 className="mb-4 text-3xl font-semibold">
            Ready To Experience {gem.title}?
          </h2>

          <p className="mb-8 text-gray-300">
            Let our travel experts craft a personalized
            itinerary for your journey.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">

            <Link
              href={`/plan-my-trip?destination=${encodeURIComponent(
                gem.location
              )}&source=hidden_gem&gem=${encodeURIComponent(
                gem.title
              )}`}
              className="rounded-full bg-cyan-400 px-8 py-4 text-center font-semibold text-black transition hover:scale-105"
            >
              Plan This Trip
            </Link>

            <Link
              href="/recommendations"
              className="rounded-full border border-white/10 px-8 py-4 text-center transition hover:bg-white/5"
            >
              Explore Similar Gems
            </Link>

          </div>

        </div>
      </div>
    </main>
  );
}