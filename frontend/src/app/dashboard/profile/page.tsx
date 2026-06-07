"use client";

import { useEffect, useState } from "react";

import CustomerPortalNav from "@/components/customer/CustomerPortalNav";

import {
  getCurrentProfile,
} from "@/services/profileService";

import {
  getProfileStats,
} from "@/services/profileStatsService";

import {
  updateProfile,
} from "@/services/profileUpdateService";

import {
  uploadAvatar,
} from "@/services/avatarUploadService";

import {
  getUserAchievements,
  evaluateAchievements,
} from "@/services/achievementService";

import {
  getMyReferralCode,
  getReferralStats,
} from "@/services/referralService";

export default function ProfilePage() {

  const [profile, setProfile] =
    useState<any>(null);

  const [stats, setStats] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [achievements, setAchievements] =
    useState<any[]>([]);

  const [referralCode, setReferralCode] =
    useState("");

  const [referralStats, setReferralStats] =
    useState<any>(null);

  useEffect(() => {

    async function loadProfile() {

      const profileData =
        await getCurrentProfile();

      if (!profileData) {

        setLoading(false);

        return;
      }

      setProfile(profileData);

      const statsData =
        await getProfileStats(
          profileData.id
        );

      setStats(statsData);
      await evaluateAchievements(
        profileData.id
      );
      const earnedAchievements =
        await getUserAchievements(
          profileData.id
        );

      setAchievements(
        earnedAchievements
      );
      const code =
        await getMyReferralCode(
          profileData.id
        );

      setReferralCode(
        code || ""
      );

      const stats =
        await getReferralStats(
          profileData.id
        );

      setReferralStats(
        stats
      );
      setLoading(false);
      
    }

    loadProfile();
    

  }, []);

  async function handleAvatarUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {

    const file =
      e.target.files?.[0];

    if (
      !file ||
      !profile
    ) {
      return;
    }

    setUploading(true);

    const url =
      await uploadAvatar(
        profile.id,
        file
      );

    setUploading(false);

    if (!url) {
      return;
    }

    setProfile({
      ...profile,
      avatar_url: url,
    });
  }

  async function handleSave() {
    

    if (!profile) return;

    setSaving(true);

    const success =
      await updateProfile(
        profile.id,
        {
          avatar_url:
            profile.avatar_url || "",

          full_name:
            profile.full_name || "",

          username:
            profile.username || "",

          bio:
            profile.bio || "",

          home_city:
            profile.home_city || "",

          travel_style:
            profile.travel_style || "",

          travel_personality:
            profile.travel_personality || "",

        }
      );

    setSaving(false);

    if (success) {

      setSaved(true);

      setTimeout(
        () =>
          setSaved(false),
        3000
      );

    }
  }

  if (loading) {

    return (

      <main className="p-10 text-white">

        Loading profile...

      </main>

    );

  }

  if (!profile) {

    return (

      <main className="p-10 text-white">

        Profile not found

      </main>

    );

  }
  async function copyReferralCode() {

  if (!referralCode) {
    return;
  }

  await navigator.clipboard.writeText(
    referralCode
  );

  alert(
    "Referral code copied!"
  );
}

  return (

    <main className="min-h-screen bg-[#050816] px-6 py-24 text-white">

      <div className="mx-auto max-w-6xl">

        <p className="mb-3 text-sm uppercase tracking-[0.4em] text-cyan-400">
          Customer Portal
        </p>

        <CustomerPortalNav />

        <h1 className="mb-12 text-5xl font-bold">
          My Profile
        </h1>

        {saved && (

          <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-400">

            Profile updated successfully.

          </div>

        )}

        <div className="mb-10 flex flex-col items-center">

          <div className="mb-4">

            {profile.avatar_url ? (

              <img
                src={profile.avatar_url}
                alt="Avatar"
                className="h-32 w-32 rounded-full border-4 border-cyan-400 object-cover"
              />

            ) : (

              <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-cyan-400 bg-white/5">

                👤

              </div>

            )}

          </div>

          <input
            type="file"
            accept="image/*"
            onChange={
              handleAvatarUpload
            }
          />

          {uploading && (

            <p className="mt-2 text-cyan-400">

              Uploading...

            </p>

          )}

        </div>

        {/* Stats */}

        {stats && (

          <div className="mb-10 grid gap-6 md:grid-cols-3">

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

              <p className="text-gray-400">
                Journeys
              </p>

              <p className="text-4xl font-bold text-cyan-400">
                {stats.journeys}
              </p>

            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

              <p className="text-gray-400">
                Saved Gems
              </p>

              <p className="text-4xl font-bold text-cyan-400">
                {stats.bookmarks}
              </p>

            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

              <p className="text-gray-400">
                Likes
              </p>

              <p className="text-4xl font-bold text-cyan-400">
                {stats.likes}
              </p>

            </div>

          </div>

        )}

        {/* ACHIEVEMENTS */}

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">

          <h2 className="mb-6 text-2xl font-semibold">
            Travel Achievements
          </h2>

          {achievements.length === 0 ? (

            <p className="text-gray-400">
              Complete trips and activities
              to unlock achievements.
            </p>

          ) : (

            <div className="grid gap-4 md:grid-cols-2">

              {achievements.map(
                (achievement) => (

                  <div
                    key={achievement.id}
                    className="rounded-2xl border border-white/10 p-5"
                  >

                    <div className="mb-2 text-3xl">

                      {
                        achievement
                          .achievements
                          ?.icon
                      }

                    </div>

                    <h3 className="font-semibold text-lg">

                      {
                        achievement
                          .achievements
                          ?.title
                      }

                    </h3>

                    <p className="mt-2 text-sm text-gray-400">

                      {
                        achievement
                          .achievements
                          ?.description
                      }

                    </p>

                  </div>

                )
              )}

            </div>

          )}

        </div>

        {/* REFERRAL PROGRAM */}

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">

          <h2 className="mb-6 text-2xl font-semibold">
            Referral Program
          </h2>

          <div className="grid gap-6 md:grid-cols-3">

            <div>

              <p className="text-gray-400">
                Referral Code
              </p>

              <p className="mt-2 text-2xl font-bold text-cyan-400">
                {referralCode || "-"}
              </p>

              <button
                onClick={
                  copyReferralCode
                }
                className="mt-3 rounded-xl bg-cyan-500 px-4 py-2 text-black"
              >
                Copy Code
              </button>

            </div>

            <div>

              <p className="text-gray-400">
                Referrals
              </p>

              <p className="text-4xl font-bold text-cyan-400">
                {
                  referralStats
                    ?.totalReferrals || 0
                }
              </p>

            </div>

            <div>

              <p className="text-gray-400">
                Reward Points
              </p>

              <p className="text-4xl font-bold text-cyan-400">
                {
                  referralStats
                    ?.rewardPoints || 0
                }
              </p>

            </div>

          </div>

        </div>

        {/* Profile Form */}

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">

          <div className="grid gap-6">

            <input
              value={
                profile.full_name || ""
              }
              onChange={(e) =>
                setProfile({
                  ...profile,
                  full_name:
                    e.target.value,
                })
              }
              placeholder="Full Name"
              className="rounded-xl bg-black/30 p-4"
            />

            <input
              value={
                profile.username || ""
              }
              onChange={(e) =>
                setProfile({
                  ...profile,
                  username:
                    e.target.value,
                })
              }
              placeholder="Username"
              className="rounded-xl bg-black/30 p-4"
            />

            <input
              value={
                profile.home_city || ""
              }
              onChange={(e) =>
                setProfile({
                  ...profile,
                  home_city:
                    e.target.value,
                })
              }
              placeholder="Home City"
              className="rounded-xl bg-black/30 p-4"
            />

            <input
              value={
                profile.travel_style || ""
              }
              onChange={(e) =>
                setProfile({
                  ...profile,
                  travel_style:
                    e.target.value,
                })
              }
              placeholder="Travel Style"
              className="rounded-xl bg-black/30 p-4"
            />

            <input
              value={
                profile.travel_personality || ""
              }
              onChange={(e) =>
                setProfile({
                  ...profile,
                  travel_personality:
                    e.target.value,
                })
              }
              placeholder="Travel Personality"
              className="rounded-xl bg-black/30 p-4"
            />

            <textarea
              rows={5}
              value={
                profile.bio || ""
              }
              onChange={(e) =>
                setProfile({
                  ...profile,
                  bio:
                    e.target.value,
                })
              }
              placeholder="Bio"
              className="rounded-xl bg-black/30 p-4"
            />

            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-full bg-cyan-400 px-8 py-4 font-semibold text-black"
            >

              {
                saving
                  ? "Saving..."
                  : "Save Profile"
              }

            </button>

          </div>

        </div>

      </div>

    </main>

  );
}