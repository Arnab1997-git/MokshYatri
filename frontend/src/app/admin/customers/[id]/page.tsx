"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import {
  getCustomer360,
} from "@/services/customer360Service";

export default function Customer360Page() {

  const params =
    useParams();

  const customerId =
    String(params.id);

  const [customer, setCustomer] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    async function loadData() {

      const data =
        await getCustomer360(
          customerId
        );

      setCustomer(
        data
      );

      setLoading(false);

    }

    if (customerId) {
      loadData();
    }

  }, [customerId]);

  if (loading) {

    return (

      <main className="p-10 text-white">

        Loading customer...

      </main>

    );

  }

  if (!customer) {

    return (

      <main className="p-10 text-white">

        Customer not found

      </main>

    );

  }

  return (

    <main className="p-10 text-white">

      {/* HEADER */}

      <div className="mb-10">

        <p className="mb-2 text-sm uppercase tracking-[0.4em] text-cyan-400">
          CRM
        </p>

        <h1 className="text-5xl font-bold">
          Customer 360
        </h1>

      </div>

      {/* PROFILE */}

      <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-8">

        <h2 className="mb-4 text-3xl font-bold">

          {
            customer.profile?.full_name ||
            customer.profile?.username ||
            "Customer"
          }

        </h2>

        <div className="grid gap-6 md:grid-cols-4">

          <div>

            <p className="text-gray-400">
              Travel Style
            </p>

            <p>
              {
                customer.profile
                  ?.travel_style || "-"
              }
            </p>

          </div>

          <div>

            <p className="text-gray-400">
              Personality
            </p>

            <p>
              {
                customer.profile
                  ?.travel_personality || "-"
              }
            </p>

          </div>

          <div>

            <p className="text-gray-400">
              Home City
            </p>

            <p>
              {
                customer.profile
                  ?.home_city || "-"
              }
            </p>

          </div>

          <div>

            <p className="text-gray-400">
              Username
            </p>

            <p>
              {
                customer.profile
                  ?.username || "-"
              }
            </p>

          </div>

        </div>

      </div>

      {/* KPI */}

      <div className="mb-8 grid gap-6 md:grid-cols-5">

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

          <p className="text-gray-400">
            Leads
          </p>

          <p className="mt-2 text-4xl font-bold text-cyan-400">
            {customer.leads.length}
          </p>

        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

          <p className="text-gray-400">
            Bookings
          </p>

          <p className="mt-2 text-4xl font-bold text-cyan-400">
            {customer.bookings.length}
          </p>

        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

          <p className="text-gray-400">
            Reviews
          </p>

          <p className="mt-2 text-4xl font-bold text-cyan-400">
            {customer.reviews.length}
          </p>

        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

          <p className="text-gray-400">
            Achievements
          </p>

          <p className="mt-2 text-4xl font-bold text-cyan-400">
            {customer.achievements.length}
          </p>

        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

          <p className="text-gray-400">
            Referrals
          </p>

          <p className="mt-2 text-4xl font-bold text-cyan-400">
            {
              customer.referralStats
                ?.totalReferrals || 0
            }
          </p>

        </div>

      </div>

      {/* LEADS */}

      <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-8">

        <h2 className="mb-4 text-2xl font-semibold">
          Leads
        </h2>

        <div className="space-y-3">

          {customer.leads.map(
            (lead: any) => (

              <div
                key={lead.id}
                className="rounded-xl border border-white/10 p-4"
              >

                {lead.customer_name}
                {" • "}
                {lead.status}

              </div>

            )
          )}

        </div>

      </div>

      {/* BOOKINGS */}

      <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-8">

        <h2 className="mb-4 text-2xl font-semibold">
          Bookings
        </h2>

        <div className="space-y-3">

          {customer.bookings.map(
            (booking: any) => (

              <div
                key={booking.id}
                className="rounded-xl border border-white/10 p-4"
              >

                Booking #
                {booking.id}
                {" • "}
                {booking.status}

              </div>

            )
          )}

        </div>

      </div>

      {/* REVIEWS */}

      <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-8">

        <h2 className="mb-4 text-2xl font-semibold">
          Reviews
        </h2>

        <div className="space-y-3">

          {customer.reviews.map(
            (review: any) => (

              <div
                key={review.id}
                className="rounded-xl border border-white/10 p-4"
              >

                ⭐ {review.rating}

                <p className="mt-2 text-gray-400">
                  {review.review_text}
                </p>

              </div>

            )
          )}

        </div>

      </div>

      {/* ACHIEVEMENTS */}

      <div className="rounded-3xl border border-white/10 bg-white/5 p-8">

        <h2 className="mb-4 text-2xl font-semibold">
          Achievements
        </h2>

        <div className="space-y-3">

          {customer.achievements.map(
            (achievement: any) => (

              <div
                key={achievement.id}
                className="rounded-xl border border-white/10 p-4"
              >

                {
                  achievement
                    .achievements
                    ?.title
                }

              </div>

            )
          )}

        </div>

      </div>

    </main>

  );
}