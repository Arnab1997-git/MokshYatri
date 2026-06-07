"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

import { addHiddenGem } from "@/services/addHiddenGemService";
import Navbar from "@/components/layout/Navbar";

export default function AddHiddenGemPage() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [vibe, setVibe] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const success = await addHiddenGem({
      title,
      location,
      description,
      vibe,
      image_url: imageUrl,
      user_id: user?.id,
    });

    if (success) {
      alert("Hidden Gem added successfully!");

      setTitle("");
      setLocation("");
      setDescription("");
      setVibe("");
      setImageUrl("");
    }

    setSaving(false);
  }

  return (
    <main className="min-h-screen bg-[#050816] px-6 py-24 text-white">
      <Navbar />
      <div className="mx-auto max-w-4xl">

        <h1 className="mb-12 text-center text-5xl font-bold">
          Add Hidden Gem
        </h1>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl">

          <div className="space-y-5">

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Gem Title"
              className="w-full rounded-2xl border border-white/10 bg-white/5 p-5"
            />

            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              className="w-full rounded-2xl border border-white/10 bg-white/5 p-5"
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              rows={5}
              className="w-full rounded-2xl border border-white/10 bg-white/5 p-5"
            />

            <input
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
              placeholder="Vibe (Cinematic, Adventure...)"
              className="w-full rounded-2xl border border-white/10 bg-white/5 p-5"
            />

            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Image URL"
              className="w-full rounded-2xl border border-white/10 bg-white/5 p-5"
            />

            <button
              onClick={handleSubmit}
              disabled={saving}
              className="rounded-full bg-white px-8 py-4 text-black transition hover:scale-105"
            >
              {saving
                ? "Submitting..."
                : "Submit Hidden Gem"}
            </button>

          </div>

        </div>

      </div>
    </main>
  );
}