"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import {
createBooking,
getBookings,
updateBookingStatus,
} from "@/services/bookingService";

import {
getQuotations,
} from "@/services/quotationService";

const statuses = [
  "PENDING",
  "CONFIRMED",
  "READY_FOR_TRAVEL",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

export default function BookingsPage() {

const [bookings, setBookings] =
useState<any[]>([]);

const [quotations, setQuotations] =
useState<any[]>([]);

const [loading, setLoading] =
useState(true);

const [quotationId, setQuotationId] =
useState("");

const [travelDate, setTravelDate] =
useState("");

const [advancePaid, setAdvancePaid] =
useState("");

const [notes, setNotes] =
useState("");

async function loadData() {


const bookingData =
  await getBookings();

const quotationData =
  await getQuotations();

setBookings(
  bookingData
);

setQuotations(
  quotationData
);

setLoading(false);


}

useEffect(() => {
loadData();
}, []);

async function handleCreateBooking() {


if (!quotationId) {

  alert(
    "Select quotation"
  );

  return;
}

const quotation =
  quotations.find(
    (q) =>
      q.id ===
      Number(
        quotationId
      )
  );

if (!quotation) {
  return;
}

const totalAmount =
  Number(
    quotation.quoted_price ??
    quotation.selling_price
  );

const advance =
  Number(
    advancePaid || 0
  );

await createBooking({

  quotation_id:
    quotation.id,

  customer_name:
    quotation.customer_name,

  customer_phone:
    quotation.customer_phone,

  travel_date:
    travelDate,

  advance_paid:
    advance,

  balance_due:
    totalAmount -
    advance,

  total_amount:
    totalAmount,

  status:
    "PENDING",

  notes,
});

setQuotationId("");
setTravelDate("");
setAdvancePaid("");
setNotes("");

loadData();


}

async function handleStatusChange(
bookingId: number,
status: string
) {


await updateBookingStatus(
  bookingId,
  status
);

loadData();


}

return (


<main className="p-10 text-white">

  <div className="mb-10">

    <p className="mb-2 text-sm uppercase tracking-[0.4em] text-cyan-400">
      Operations
    </p>

    <h1 className="text-5xl font-bold">
      Booking Management
    </h1>

  </div>

  {/* CREATE BOOKING */}

  <div className="mb-10 rounded-3xl border border-white/10 bg-white/5 p-6">

    <h2 className="mb-6 text-2xl font-semibold">
      Create Booking
    </h2>

    <div className="grid gap-4 md:grid-cols-2">

      <select
        value={quotationId}
        onChange={(e) =>
          setQuotationId(
            e.target.value
          )
        }
        className="rounded-xl bg-black/20 p-3"
      >

        <option value="">
          Select Quotation
        </option>

        {quotations.map(
          (quotation) => (

            <option
              key={quotation.id}
              value={quotation.id}
            >
              #{quotation.id} - {quotation.customer_name}
            </option>

          )
        )}

      </select>

      <input
        type="date"
        value={travelDate}
        onChange={(e) =>
          setTravelDate(
            e.target.value
          )
        }
        className="rounded-xl bg-black/20 p-3"
      />

      <input
        placeholder="Advance Paid"
        value={advancePaid}
        onChange={(e) =>
          setAdvancePaid(
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
        handleCreateBooking
      }
      className="mt-6 rounded-full bg-cyan-400 px-6 py-3 font-semibold text-black"
    >
      Create Booking
    </button>

  </div>

  {/* BOOKINGS */}

  <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

    <h2 className="mb-6 text-2xl font-semibold">
      Bookings
    </h2>

    {loading ? (

      <p>Loading...</p>

    ) : (

      <div className="space-y-4">

        {bookings.map(
          (booking) => (

            <div
              key={booking.id}
              className="rounded-2xl border border-white/10 p-5"
            >

              <div className="grid gap-4 md:grid-cols-8">

                <div>
                  <p className="text-gray-400">
                    Customer
                  </p>
                  <p>
                    {booking.customer_name}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400">
                    Travel Date
                  </p>
                  <p>
                    {booking.travel_date}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400">
                    Total
                  </p>
                  <p>
                    ₹{booking.total_amount}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400">
                    Advance
                  </p>
                  <p>
                    ₹{booking.advance_paid}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400">
                    Balance
                  </p>
                  <p>
                    ₹{booking.balance_due}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400">
                    Status
                  </p>

                  <select
                    value={
                      booking.status
                    }
                    onChange={(e) =>
                      handleStatusChange(
                        booking.id,
                        e.target.value
                      )
                    }
                    className="rounded-lg bg-black/30 p-2"
                  >

                    {statuses.map(
                      (status) => (

                        <option
                          key={status}
                          value={status}
                        >
                          {status}
                        </option>

                      )
                    )}

                  </select>

                </div>

                <div>
                  <p className="text-gray-400">
                    Quote
                  </p>

                  <p>
                    #
                    {
                      booking.quotation_id
                    }
                  </p>
                </div>

                <div className="flex items-center">

                  <Link
                    href={`/admin/bookings/${booking.id}`}
                    className="rounded-xl bg-cyan-400 px-4 py-2 font-semibold text-black"
                  >
                    View Details
                  </Link>

                </div>

              </div>

            </div>

          )
        )}

      </div>

    )}

  </div>

</main>


);
}
