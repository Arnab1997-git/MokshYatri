"use client";

import { useEffect, useState } from "react";

import { getCurrentProfile } from "@/services/profileService";
import { updateProfile } from "@/services/profileUpdateService";

export default function EditProfilePage() {
  const [profileId, setProfileId] = useState("");

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [homeCity, setHomeCity] = useState("");
  const [travelStyle, setTravelStyle] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const profile = await getCurrentProfile();

      if (!profile) return;

      setProfileId(profile.id);
      setFullName(profile.full_name || "");
      setUsername(profile.username || "");
      setBio(profile.bio || "");
      setHomeCity(profile.home_city || "");
      setTravelStyle(profile.travel_style || "");

      setLoading(false);
    }

    loadProfile();
  }, []);

  async function handleSave() {
    setSaving(true);

    const success = await updateProfile(profileId, {
      full_name: fullName,
      username,
      bio,
      home_city: homeCity,
      travel_style: travelStyle,
    });

    if (success) {
      alert("Profile updated successfully!");
    }

    setSaving(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050816] flex items-center justify-center text-white">
        Loading profile...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050816] px-6 py-24 text-white">
      <div className="mx-auto max-w-4xl">

        <h1 className="mb-12 text-center text-5xl font-bold">
          Edit Profile
        </h1>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl">

          <div className="mb-10 flex justify-center">
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-cyan-400 text-4xl font-bold text-black">
              {fullName?.charAt(0)?.toUpperCase() || "U"}
            </div>
          </div>

          <div className="space-y-6">

            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name"
              className="w-full rounded-2xl border border-white/10 bg-white/5 p-5 outline-none focus:border-cyan-400"
            />

            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full rounded-2xl border border-white/10 bg-white/5 p-5 outline-none focus:border-cyan-400"
            />

            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell travelers about yourself..."
              rows={4}
              className="w-full rounded-2xl border border-white/10 bg-white/5 p-5 outline-none focus:border-cyan-400"
            />

            <input
              value={homeCity}
              onChange={(e) => setHomeCity(e.target.value)}
              placeholder="Home City"
              className="w-full rounded-2xl border border-white/10 bg-white/5 p-5 outline-none focus:border-cyan-400"
            />

            <div>
              <h3 className="mb-4 text-xl font-semibold">
                Travel Style
              </h3>

              <div className="grid gap-4 md:grid-cols-2">

                {[
                  "Cinematic",
                  "Luxury",
                  "Backpacking",
                  "Adventure",
                  "Spiritual",
                  "Food Explorer",
                ].map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setTravelStyle(style)}
                    className={`rounded-2xl border p-4 transition ${
                      travelStyle === style
                        ? "border-cyan-400 bg-cyan-400/10"
                        : "border-white/10 bg-white/5"
                    }`}
                  >
                    {style}
                  </button>
                ))}

              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="mt-4 rounded-full bg-white px-8 py-4 font-medium text-black transition hover:scale-105 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>

          </div>

        </div>

      </div>
    </main>
  );
}