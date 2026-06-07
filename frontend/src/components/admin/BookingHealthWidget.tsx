"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  getBookingHealthData,
} from "@/services/bookingHealthService";

export default function BookingHealthWidget() {

  const [bookings, setBookings] =
    useState<any[]>([]);

  useEffect(() => {

    async function loadData() {

      const data =
        await getBookingHealthData();

      setBookings(
        data
      );

    }

    loadData();

  }, []);

  return (

    <div className="rounded-3xl border border-white/10 bg-white/5 p-8">

      <h2 className="mb-6 text-2xl font-semibold">
        Booking Health Dashboard
      </h2>

      <div className="space-y-4">

        {bookings.map(
          (item) => {

            let color =
              "text-green-400";

            let label =
              "Healthy";

            if (
              item.health ===
              "PAYMENT_PENDING"
            ) {

              color =
                "text-red-400";

              label =
                "Payment Pending";

            }

            if (
              item.health ===
              "HOTEL_PENDING"
            ) {

              color =
                "text-yellow-400";

              label =
                "Hotel Pending";

            }

            if (
              item.health ===
              "VEHICLE_PENDING"
            ) {

              color =
                "text-yellow-400";

              label =
                "Vehicle Pending";

            }

            return (

              <div
                key={
                  item.booking.id
                }
                className="flex items-center justify-between rounded-xl border border-white/10 p-4"
              >

                <div>

                  <p className="font-semibold">

                    Booking #
                    {
                      item.booking.id
                    }

                  </p>

                  <p className="text-sm text-gray-400">

                    {
                      item.booking
                        .customer_name
                    }

                  </p>

                </div>

                <div
                  className={`font-semibold ${color}`}
                >

                  {label}

                </div>

              </div>

            );

          }
        )}

      </div>

    </div>

  );
}