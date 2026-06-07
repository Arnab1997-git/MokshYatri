"use client";

import { useEffect, useState } from "react";

import DashboardCard from "@/components/admin/DashboardCard";

import {
  getDashboardStats,
} from "@/services/dashboardService";
import BookingHealthWidget
from "@/components/admin/BookingHealthWidget";

export default function AdminDashboardPage() {

  const [stats, setStats] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    async function loadStats() {

      const data =
        await getDashboardStats();

      setStats(data);

      setLoading(false);
    }

    loadStats();

  }, []);

  if (loading) {

    return (

      <main className="p-10 text-white">

        Loading dashboard...

      </main>

    );
  }

  return (

    <main className="p-10 text-white">

      <div className="mb-10">

        <p className="mb-2 text-sm uppercase tracking-[0.4em] text-cyan-400">
          Admin Dashboard
        </p>

        <h1 className="text-5xl font-bold">
          Moksh Yatri Admin
        </h1>

      </div>

      {/* Booking Health Dashboard */}
      <div className="mb-10">

        <BookingHealthWidget />

      </div>
      
      {/* KPI CARDS */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <DashboardCard
          title="Total Leads"
          value={
            stats?.totalLeads || 0
          }
        />

        <DashboardCard
          title="Total Quotations"
          value={
            stats?.totalQuotations || 0
          }
        />

        <DashboardCard
          title="Total Bookings"
          value={
            stats?.totalBookings || 0
          }
        />

        <DashboardCard
          title="Revenue"
          value={`₹${(
            stats?.totalRevenue || 0
          ).toLocaleString()}`}
        />

      </div>

      {/* SECOND ROW */}

      <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <DashboardCard
          title="Profit"
          value={`₹${(
            stats?.totalProfit || 0
          ).toLocaleString()}`}
        />

        <DashboardCard
          title="Outstanding Balance"
          value={`₹${(
            stats?.outstandingBalance || 0
          ).toLocaleString()}`}
        />

        <DashboardCard
          title="Lead → Quote %"
          value={`${stats?.leadToQuotePercent || 0}%`}
        />

        <DashboardCard
          title="Quote → Booking %"
          value={`${stats?.quoteToBookingPercent || 0}%`}
        />

      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <DashboardCard
          title="Trips Ready"
          value={`${stats?.tripsReady || 0}`}
        />

      </div>

      {/* BUSINESS SUMMARY */}

      <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">

        <h2 className="mb-6 text-2xl font-semibold">
          Business Overview
        </h2>

        <div className="grid gap-6 md:grid-cols-3">

          <div className="rounded-2xl bg-black/20 p-5">

            <h3 className="mb-2 text-lg font-semibold">
              Sales Funnel
            </h3>

            <p className="text-gray-400">
              Leads: {stats?.totalLeads}
            </p>

            <p className="text-gray-400">
              Quotations: {stats?.totalQuotations}
            </p>

            <p className="text-gray-400">
              Bookings: {stats?.totalBookings}
            </p>

          </div>

          <div className="rounded-2xl bg-black/20 p-5">

            <h3 className="mb-2 text-lg font-semibold">
              Financial Snapshot
            </h3>

            <p className="text-gray-400">
              Revenue:
              {" "}
              ₹{(
                stats?.totalRevenue || 0
              ).toLocaleString()}
            </p>

            <p className="text-gray-400">
              Profit:
              {" "}
              ₹{(
                stats?.totalProfit || 0
              ).toLocaleString()}
            </p>

            <p className="text-gray-400">
              Outstanding:
              {" "}
              ₹{(
                stats?.outstandingBalance || 0
              ).toLocaleString()}
            </p>

          </div>

          <div className="rounded-2xl bg-black/20 p-5">

            <h3 className="mb-2 text-lg font-semibold">
              Lead Sources
            </h3>

            <p className="text-gray-400">
              Website:
              {" "}
              {stats?.websiteLeads || 0}
            </p>

            <p className="text-gray-400">
              Recommendations:
              {" "}
              {stats?.recommendationLeads || 0}
            </p>

            <p className="text-gray-400">
              Hidden Gems:
              {" "}
              {stats?.hiddenGemLeads || 0}
            </p>

            <p className="text-gray-400">
              Dream Trips:
              {" "}
              {stats?.dreamTripLeads || 0}
            </p>

          </div>

        </div>

      </div>

    </main>

  );
}