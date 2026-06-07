"use client";

import { useEffect, useState } from "react";

import {
  getDreamTrips,
  addDreamTrip,
  removeDreamTrip,
} from "@/services/dreamTripService";
import Navbar from "@/components/layout/Navbar";

export default function DreamTripsPage() {

  const [destination, setDestination] =
    useState("");

  const [dreamTrips, setDreamTrips] =
    useState<any[]>([]);

  async function loadTrips() {

    const data =
      await getDreamTrips();

    setDreamTrips(data);
  }

  useEffect(() => {

    loadTrips();

  }, []);

  async function handleAdd() {

    if (!destination.trim()) {
      return;
    }

    const result =
      await addDreamTrip(
        destination
      );

    alert(
      result.message
    );

    if (result.success) {

      setDestination("");

      loadTrips();
    }
  }

  async function handleDelete(
    id: number
  ) {

    const success =
      await removeDreamTrip(
        id
      );

    if (success) {

      loadTrips();
    }
  }

  return (

    <main className="min-h-screen bg-[#050816] px-6 py-24 text-white">

      <Navbar />
      <div className="mx-auto max-w-4xl">

        <div className="mb-12 text-center">

          <p className="mb-4 text-sm uppercase tracking-[0.4em] text-cyan-400">
            Future Adventures
          </p>

          <h1 className="mb-6 text-5xl font-bold">
            My Dream Trips
          </h1>

          <p className="text-gray-400">
            Save destinations you dream
            of visiting someday.
          </p>

        </div>

        <div className="mb-10 flex gap-4">

          <input
            value={destination}
            onChange={(e) =>
              setDestination(
                e.target.value
              )
            }
            placeholder="Japan, Vietnam, Iceland..."
            className="flex-1 rounded-2xl border border-white/10 bg-white/5 p-4 outline-none focus:border-cyan-400"
          />

          <button
            onClick={handleAdd}
            className="rounded-2xl bg-white px-6 py-4 text-black"
          >
            Add
          </button>

        </div>

        <div className="space-y-4">

          {dreamTrips.map((trip) => (

            <div
              key={trip.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >

              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <span className="text-lg">
                  ✈️ {trip.destination}
                </span>

                <div className="flex flex-wrap gap-3">

                  <a
                    href={`/plan-my-trip?destination=${encodeURIComponent(
                      trip.destination
                    )}&source=dream_trip`}
                    className="rounded-full bg-cyan-400 px-4 py-2 font-semibold text-black transition hover:scale-105"
                  >
                    Plan This Trip
                  </a>

                  <button
                    onClick={() =>
                      handleDelete(
                        trip.id
                      )
                    }
                    className="rounded-full border border-red-500/30 px-4 py-2 text-red-400 transition hover:bg-red-500/10"
                  >
                    Remove
                  </button>

                </div>

              </div>

            </div>

          ))}

          {dreamTrips.length === 0 && (

            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">

              <p className="text-gray-400">
                No dream trips added yet.
              </p>

            </div>

          )}

        </div>

      </div>

    </main>

  );
}