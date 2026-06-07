"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import CustomerPortalNav from "@/components/customer/CustomerPortalNav";

export default function AIAdvisorPage() {

  const [question, setQuestion] =
    useState("");

  const [answer, setAnswer] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [profile, setProfile] =
    useState<any>(null);

  useEffect(() => {

    async function loadProfile() {

        const {
        data: { user },
        } =
        await supabase.auth.getUser();

        if (!user) {
        return;
        }

        const { data } =
        await supabase
            .from("profiles")
            .select("*")
            .eq(
            "id",
            user.id
            )
            .single();

        setProfile(data);

    }

    loadProfile();

  }, []);

  async function askAI() {

    if (!question.trim()) {
      return;
    }

    try {

      setLoading(true);

      setAnswer("");

      const response =
        await fetch(
          "/api/ai-advisor",
          {

            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              question,

              travelStyle:
                profile?.travel_style || "",

              travelPersonality:
                profile?.travel_personality || "",

            }),

          }
        );

      const data =
        await response.json();

      setAnswer(
        data.answer || ""
      );

    } catch (error) {

      console.error(error);

      setAnswer(
        "AI Advisor is currently unavailable."
      );

    } finally {

      setLoading(false);

    }

  }

  return (

    <main className="min-h-screen bg-[#050816] px-6 py-24 text-white">

      <div className="mx-auto max-w-6xl">

        <p className="mb-3 text-sm uppercase tracking-[0.4em] text-cyan-400">

          Customer Portal

        </p>
        <CustomerPortalNav />

        <h1 className="mb-4 text-5xl font-bold">

          AI Trip Advisor

        </h1>

        <p className="mb-10 text-gray-400">

          Ask travel questions and get personalized advice powered by Llama 3.

        </p>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">

          <textarea
            value={question}
            onChange={(e) =>
              setQuestion(
                e.target.value
              )
            }
            placeholder="What should I pack for Sikkim in July?"
            className="h-40 w-full rounded-2xl border border-white/10 bg-black/20 p-4 text-white outline-none"
          />

          <button
            onClick={askAI}
            disabled={loading}
            className="mt-6 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black transition hover:bg-cyan-400 disabled:opacity-50"
          >

            {loading
              ? "Thinking..."
              : "Ask AI"}

          </button>

        </div>

        {answer && (

          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">

            <h2 className="mb-4 text-2xl font-semibold">

              AI Response

            </h2>

            <div className="whitespace-pre-wrap text-gray-300">

              {answer}

            </div>

          </div>

        )}

      </div>

    </main>

  );
}