"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import {
  getUserLeads,
} from "@/services/leadService";

import {
  getBookingsByLeadIds,
  getCustomerTripStatus,
} from "@/services/bookingService";

import Link from "next/link";
import CustomerPortalNav from "@/components/customer/CustomerPortalNav";

export default function MyBookingsPage() {

  const [bookings, setBookings] =
    useState<any[]>([]);

  const [tripData, setTripData] =
    useState<Record<number, any>>({});

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    async function loadBookings() {

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {

        setLoading(false);

        return;
      }

      const leads =
        await getUserLeads(
          user.id
        );

      const leadIds =
        leads.map(
          (lead) => lead.id
        );

      const data =
        await getBookingsByLeadIds(
          leadIds
        );

      setBookings(data);

      const statusMap:
        Record<number, any> = {};

      for (
        const booking of data
      ) {

        statusMap[
          booking.id
        ] =
          await getCustomerTripStatus(
            booking.id
          );

      }

      setTripData(
        statusMap
      );

      setLoading(false);
    }

    loadBookings();

  }, []);

  return (

    <main className="min-h-screen bg-[#050816] px-6 py-24 text-white">

      <div className="mx-auto max-w-6xl">

        

        <div className="mb-12">

          <p className="mb-3 text-sm uppercase tracking-[0.4em] text-cyan-400">
            Customer Portal
          </p>
          <CustomerPortalNav />
          <h1 className="text-5xl font-bold">
            My Bookings
          </h1>

        </div>

        {loading && (

          <p className="text-gray-400">
            Loading bookings...
          </p>

        )}

        {!loading &&
          bookings.length === 0 && (

          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">

            <h2 className="mb-3 text-2xl font-semibold">
              No bookings yet
            </h2>

            <p className="text-gray-400">
              Confirmed trips will appear here.
            </p>

          </div>

        )}

        <div className="grid gap-6">

          {bookings.map((booking) => {

            const trip =
              tripData[
                booking.id
              ];

            const tripReady =
              trip?.hotel &&
              trip?.vehicle &&
              Number(
                booking.balance_due || 0
              ) <= 0;

            return (

              <Link
                href={`/dashboard/bookings/${booking.id}`}
                key={booking.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
              >

                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">

                  <div>

                    <h2 className="mb-3 text-2xl font-semibold">
                      Booking #{booking.id}
                    </h2>

                    <p className="text-gray-400">
                      Customer:
                      {" "}
                      {booking.customer_name}
                    </p>

                    <p className="text-gray-400">
                      Travel Date:
                      {" "}
                      {booking.travel_date}
                    </p>

                  </div>

                  <div className="text-right">

                    <div
                      className={`inline-flex rounded-full px-4 py-2 text-sm ${
                        booking.status === "CONFIRMED"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {booking.status}
                    </div>

                    <p className="mt-4 text-gray-400">
                      Total:
                      {" "}
                      ₹{Number(
                        booking.total_amount || 0
                      ).toLocaleString()}
                    </p>

                    <p className="text-gray-400">
                      Advance:
                      {" "}
                      ₹{Number(
                        booking.advance_paid || 0
                      ).toLocaleString()}
                    </p>

                    <p className="font-semibold text-cyan-400">
                      Balance:
                      {" "}
                      ₹{Number(
                        booking.balance_due || 0
                      ).toLocaleString()}
                    </p>

                  </div>

                </div>

                {/* Trip Tracker */}

                <div className="mt-6 rounded-2xl border border-cyan-400/10 bg-black/20 p-5">

                  <h3 className="mb-4 text-lg font-semibold text-cyan-300">
                    Trip Tracker
                  </h3>

                  <div className="grid gap-3 md:grid-cols-3">

                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500">
                        Hotel
                      </p>

                      <p className="mt-1 text-gray-300">
                        {
                          trip?.hotel?.hotels
                            ?.name ||
                          "Not Assigned"
                        }
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500">
                        Vehicle
                      </p>

                      <p className="mt-1 text-gray-300">
                        {
                          trip?.vehicle
                            ?.vehicles
                            ?.name ||
                          "Not Assigned"
                        }
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500">
                        Amount Paid
                      </p>

                      <p className="mt-1 text-gray-300">
                        ₹{Number(
                          trip?.totalPaid || 0
                        ).toLocaleString()}
                      </p>
                    </div>

                  </div>

                  <div className="mt-5">

                    {tripReady ? (

                      <span className="rounded-full bg-green-500/20 px-4 py-2 text-green-400">
                        🚀 Trip Ready
                      </span>

                    ) : (

                      <span className="rounded-full bg-yellow-500/20 px-4 py-2 text-yellow-400">
                        ⏳ Preparation In Progress
                      </span>

                    )}

                  </div>

                </div>

              </Link>

            );

          })}

        </div>

      </div>

    </main>

  );
}