"use client";

import { useEffect, useState } from "react";

import {
  getBookings,
} from "@/services/bookingService";

import {
  getHotels,
} from "@/services/hotelService";

import {
  createHotelAllocation,
  getHotelAllocations,
} from "@/services/hotelAllocationService";

export default function HotelAllocationsPage() {

  const [bookings, setBookings] =
    useState<any[]>([]);

  const [hotels, setHotels] =
    useState<any[]>([]);

  const [allocations, setAllocations] =
    useState<any[]>([]);

  const [bookingId, setBookingId] =
    useState("");

  const [hotelId, setHotelId] =
    useState("");

  const [checkInDate, setCheckInDate] =
    useState("");

  const [checkOutDate, setCheckOutDate] =
    useState("");

  const [confirmationNumber, setConfirmationNumber] =
    useState("");

  const [notes, setNotes] =
    useState("");

  async function loadData() {

    const [
      bookingData,
      hotelData,
      allocationData,
    ] = await Promise.all([

      getBookings(),

      getHotels(),

      getHotelAllocations(),

    ]);

    setBookings(
      bookingData
    );

    setHotels(
      hotelData
    );

    setAllocations(
      allocationData
    );
  }

  useEffect(() => {

    loadData();

  }, []);

  async function handleCreateAllocation() {

    if (
      !bookingId ||
      !hotelId
    ) {

      alert(
        "Select booking and hotel"
      );

      return;
    }

    const result =
      await createHotelAllocation({

        booking_id:
          Number(
            bookingId
          ),

        hotel_id:
          Number(
            hotelId
          ),

        check_in_date:
          checkInDate,

        check_out_date:
          checkOutDate,

        confirmation_number:
          confirmationNumber,

        notes,

      });

    if (!result.success) {

      alert(
        result.message
      );

      return;
    }

    alert(
      "Hotel allocated successfully"
    );

    setBookingId("");
    setHotelId("");
    setCheckInDate("");
    setCheckOutDate("");
    setConfirmationNumber("");
    setNotes("");

    loadData();
  }

  return (

    <main className="p-10 text-white">

      <div className="mb-10">

        <p className="mb-2 text-sm uppercase tracking-[0.4em] text-cyan-400">
          Operations
        </p>

        <h1 className="text-5xl font-bold">
          Hotel Allocations
        </h1>

      </div>

      {/* CREATE */}

      <div className="mb-10 rounded-3xl border border-white/10 bg-white/5 p-6">

        <h2 className="mb-6 text-2xl font-semibold">
          Assign Hotel
        </h2>

        <div className="grid gap-4 md:grid-cols-2">

          <select
            value={bookingId}
            onChange={(e) =>
              setBookingId(
                e.target.value
              )
            }
            className="rounded-xl bg-black/20 p-3"
          >

            <option value="">
              Select Booking
            </option>

            {bookings.map(
              (booking) => (

                <option
                  key={booking.id}
                  value={booking.id}
                >
                  #{booking.id}
                  {" - "}
                  {booking.customer_name}
                </option>

              )
            )}

          </select>

          <select
            value={hotelId}
            onChange={(e) =>
              setHotelId(
                e.target.value
              )
            }
            className="rounded-xl bg-black/20 p-3"
          >

            <option value="">
              Select Hotel
            </option>

            {hotels.map(
              (hotel) => (

                <option
                  key={hotel.id}
                  value={hotel.id}
                >
                  {hotel.name}
                </option>

              )
            )}

          </select>

          <input
            type="date"
            value={checkInDate}
            onChange={(e) =>
              setCheckInDate(
                e.target.value
              )
            }
            className="rounded-xl bg-black/20 p-3"
          />

          <input
            type="date"
            value={checkOutDate}
            onChange={(e) =>
              setCheckOutDate(
                e.target.value
              )
            }
            className="rounded-xl bg-black/20 p-3"
          />

          <input
            placeholder="Confirmation Number"
            value={
              confirmationNumber
            }
            onChange={(e) =>
              setConfirmationNumber(
                e.target.value
              )
            }
            className="rounded-xl bg-black/20 p-3"
          />

        </div>

        <textarea
          value={notes}
          onChange={(e) =>
            setNotes(
              e.target.value
            )
          }
          placeholder="Notes"
          className="mt-4 h-24 w-full rounded-xl bg-black/20 p-3"
        />

        <button
          onClick={
            handleCreateAllocation
          }
          className="mt-6 rounded-full bg-cyan-400 px-6 py-3 font-semibold text-black"
        >
          Assign Hotel
        </button>

      </div>

      {/* HISTORY */}

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

        <h2 className="mb-6 text-2xl font-semibold">
          Allocation History
        </h2>

        <div className="space-y-4">

          {allocations.map(
            (allocation) => (

              <div
                key={allocation.id}
                className="rounded-2xl border border-white/10 p-5"
              >

                <div className="grid gap-4 md:grid-cols-5">

                  <div>

                    <p className="text-gray-400">
                      Customer
                    </p>

                    <p>
                      {
                        allocation.bookings
                          ?.customer_name
                      }
                    </p>

                  </div>

                  <div>

                    <p className="text-gray-400">
                      Hotel
                    </p>

                    <p>
                      {
                        allocation.hotels
                          ?.name
                      }
                    </p>

                  </div>

                  <div>

                    <p className="text-gray-400">
                      Check In
                    </p>

                    <p>
                      {
                        allocation.check_in_date
                      }
                    </p>

                  </div>

                  <div>

                    <p className="text-gray-400">
                      Check Out
                    </p>

                    <p>
                      {
                        allocation.check_out_date
                      }
                    </p>

                  </div>

                  <div>

                    <p className="text-gray-400">
                      Confirmation
                    </p>

                    <p>
                      {
                        allocation.confirmation_number
                      }
                    </p>

                  </div>

                </div>

              </div>

            )
          )}

        </div>

      </div>

    </main>

  );
}