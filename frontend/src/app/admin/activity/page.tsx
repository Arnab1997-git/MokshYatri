"use client";

import { useEffect, useState } from "react";

import {
  getActivityFeed,
} from "@/services/activityService";

export default function ActivityPage() {

  const [activities, setActivities] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    async function loadData() {

      const data =
        await getActivityFeed();

      setActivities(
        data
      );

      setLoading(false);

    }

    loadData();

  }, []);

  return (

    <main className="p-10 text-white">

      <div className="mb-10">

        <p className="mb-2 text-sm uppercase tracking-[0.4em] text-cyan-400">
          Operations
        </p>

        <h1 className="text-5xl font-bold">
          Activity Feed
        </h1>

      </div>

      {loading && (

        <p className="text-gray-400">
          Loading activity...
        </p>

      )}

      {!loading &&
        activities.length === 0 && (

        <div className="rounded-3xl border border-white/10 bg-white/5 p-10">

          No activity found.

        </div>

      )}

      <div className="space-y-4">

        {activities.map(
          (
            activity,
            index
          ) => {

            let color =
              "text-cyan-400";

            if (
              activity.status ===
              "completed"
            ) {

              color =
                "text-green-400";

            }

            if (
              activity.status ===
              "pending"
            ) {

              color =
                "text-yellow-400";

            }

            return (

              <div
                key={index}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >

                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">

                  <div>

                    <p
                      className={`font-semibold ${color}`}
                    >
                      {activity.title}
                    </p>

                    <p className="text-sm text-gray-400">

                      Booking #
                      {activity.bookingId}

                      {" • "}

                      {
                        activity.customerName
                      }

                    </p>

                  </div>

                  <div className="text-sm text-gray-500">

                    {new Date(
                      activity.date
                    ).toLocaleString()}

                  </div>

                </div>

              </div>

            );

          }
        )}

      </div>

    </main>

  );
}