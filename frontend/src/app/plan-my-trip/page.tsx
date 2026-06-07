"use client";

export const dynamic = "force-dynamic";

import {
  useEffect,
  useState,
} from "react";

import {
  useSearchParams,
} from "next/navigation";

import {
  createLead,
} from "@/services/leadService";

import { supabase } from "@/lib/supabase";
import Navbar from "@/components/layout/Navbar";
import { Suspense } from "react";


function PlanMyTripContent() {

  const searchParams =
    useSearchParams();

  const [form, setForm] =
    useState({

      customer_name: "",

      phone: "",

      destination: "",

      budget: "",

      travel_month: "",

      travelers: 2,

      notes: "",
    });

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  useEffect(() => {

    const destination =
      searchParams.get(
        "destination"
      );


    const gem =
      searchParams.get("gem");

    const source =
      searchParams.get(
        "source"
      );

    if (
      destination ||
      source
    ) {

      setForm(
        (prev) => ({

          ...prev,

          destination:
            destination ||
            prev.destination,

          notes: [
            source
              ? `Lead Source: ${source}`
              : "",
            gem
              ? `Interested In: ${gem}`
              : "",
          ]
            .filter(Boolean)
            .join("\n"),

        })
      );
    }

  }, [searchParams]);

  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setLoading(true);

    const source =
      searchParams.get(
        "source"
      ) || "website";

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const payload = {

      ...form,

      status: "NEW",

      source:
        source.toUpperCase(),

      user_id:
        user?.id || null,
    };

    console.log(
      "Lead Payload",
      payload
    );

    const result =
      await createLead(
        payload
      );

    setLoading(false);

    if (result.success) {

      setSuccess(true);

      setForm({

        customer_name: "",

        phone: "",

        destination: "",

        budget: "",

        travel_month: "",

        travelers: 2,

        notes: "",
      });

    } else {

      console.error(
        "Lead Creation Failed:",
        result
      );

      alert(
        result.message ||
        "Failed to submit inquiry."
      );
    }
  }

  return (

    <main className="min-h-screen bg-[#050816] px-6 py-20 text-white">

      <Navbar />
      <div className="mx-auto max-w-3xl">

        <p className="mb-3 text-sm uppercase tracking-[0.4em] text-cyan-400">
          Custom Travel Planning
        </p>

        <h1 className="mb-4 text-5xl font-bold">
          Plan My Trip
        </h1>

        <p className="mb-10 text-gray-400">
          Tell us your travel dream and our experts
          will craft a personalized journey.
        </p>

        {success && (

          <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-400">

            Your inquiry has been submitted.
            Our team will contact you shortly.

          </div>

        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8"
        >

          <input
            type="text"
            placeholder="Full Name"
            value={form.customer_name}
            onChange={(e) =>
              setForm({
                ...form,
                customer_name:
                  e.target.value,
              })
            }
            className="w-full rounded-xl bg-black/30 p-4"
            required
          />

          <input
            type="text"
            placeholder="Phone Number"
            value={form.phone}
            onChange={(e) =>
              setForm({
                ...form,
                phone:
                  e.target.value,
              })
            }
            className="w-full rounded-xl bg-black/30 p-4"
            required
          />

          <input
            type="text"
            placeholder="Destination"
            value={form.destination}
            onChange={(e) =>
              setForm({
                ...form,
                destination:
                  e.target.value,
              })
            }
            className="w-full rounded-xl bg-black/30 p-4"
            required
          />

          <input
            type="text"
            placeholder="Budget"
            value={form.budget}
            onChange={(e) =>
              setForm({
                ...form,
                budget:
                  e.target.value,
              })
            }
            className="w-full rounded-xl bg-black/30 p-4"
          />

          <input
            type="text"
            placeholder="Travel Month"
            value={form.travel_month}
            onChange={(e) =>
              setForm({
                ...form,
                travel_month:
                  e.target.value,
              })
            }
            className="w-full rounded-xl bg-black/30 p-4"
          />

          <input
            type="number"
            placeholder="Travelers"
            value={form.travelers}
            onChange={(e) =>
              setForm({
                ...form,
                travelers:
                  Number(
                    e.target.value
                  ),
              })
            }
            className="w-full rounded-xl bg-black/30 p-4"
          />

          <textarea
            placeholder="Tell us about your dream trip..."
            rows={5}
            value={form.notes}
            onChange={(e) =>
              setForm({
                ...form,
                notes:
                  e.target.value,
              })
            }
            className="w-full rounded-xl bg-black/30 p-4"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-white px-8 py-4 font-medium text-black transition hover:scale-105"
          >

            {
              loading
                ? "Submitting..."
                : "Submit Inquiry"
            }

          </button>

        </form>

      </div>

    </main>

  );
}

export default function PlanMyTripPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#050816] flex items-center justify-center text-white">
          Loading...
        </main>
      }
    >
      <PlanMyTripContent />
    </Suspense>
  );
}