"use client";

import { useEffect, useState } from "react";

import {
  getBookings,
} from "@/services/bookingService";

import {
  createPayment,
  getAllPayments,
} from "@/services/paymentService";

const paymentModes = [
  "UPI",
  "BANK_TRANSFER",
  "CASH",
  "CARD",
];

export default function PaymentsPage() {

  const [bookings, setBookings] =
    useState<any[]>([]);

  const [payments, setPayments] =
    useState<any[]>([]);

  const [bookingId, setBookingId] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [paymentDate, setPaymentDate] =
    useState("");

  const [paymentMode, setPaymentMode] =
    useState("UPI");

  const [referenceNumber, setReferenceNumber] =
    useState("");

  const [notes, setNotes] =
    useState("");

  async function loadData() {

    const bookingData =
      await getBookings();

    const paymentData =
      await getAllPayments();

    setBookings(
      bookingData
    );

    setPayments(
      paymentData
    );
  }

  useEffect(() => {

    loadData();

  }, []);

  async function handleCreatePayment() {

    if (
      !bookingId ||
      !amount ||
      !paymentDate
    ) {

      alert(
        "Please fill all required fields"
      );

      return;
    }

    const result =
      await createPayment({

        booking_id:
          Number(
            bookingId
          ),

        amount:
          Number(
            amount
          ),

        payment_date:
          paymentDate,

        payment_mode:
          paymentMode,

        reference_number:
          referenceNumber,

        notes,
      });

    if (!result.success) {

      alert(
        result.message
      );

      return;
    }

    alert(
      "Payment recorded successfully"
    );

    setBookingId("");
    setAmount("");
    setPaymentDate("");
    setPaymentMode("UPI");
    setReferenceNumber("");
    setNotes("");

    loadData();
  }

  const totalCollected =
    payments.reduce(
      (
        total,
        payment
      ) =>
        total +
        Number(
          payment.amount || 0
        ),
      0
    );

  return (

    <main className="p-10 text-white">

      <div className="mb-10">

        <p className="mb-2 text-sm uppercase tracking-[0.4em] text-cyan-400">
          Finance
        </p>

        <h1 className="text-5xl font-bold">
          Payment Management
        </h1>

      </div>

      {/* SUMMARY */}

      <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6">

        <h2 className="mb-4 text-xl font-semibold">
          Collection Summary
        </h2>

        <p className="text-3xl font-bold text-green-400">
          ₹
          {totalCollected.toLocaleString()}
        </p>

        <p className="mt-2 text-gray-400">
          Total Payments Recorded
        </p>

      </div>

      {/* CREATE PAYMENT */}

      <div className="mb-10 rounded-3xl border border-white/10 bg-white/5 p-6">

        <h2 className="mb-6 text-2xl font-semibold">
          Record Payment
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

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) =>
              setAmount(
                e.target.value
              )
            }
            className="rounded-xl bg-black/20 p-3"
          />

          <input
            type="date"
            value={paymentDate}
            onChange={(e) =>
              setPaymentDate(
                e.target.value
              )
            }
            className="rounded-xl bg-black/20 p-3"
          />

          <select
            value={paymentMode}
            onChange={(e) =>
              setPaymentMode(
                e.target.value
              )
            }
            className="rounded-xl bg-black/20 p-3"
          >

            {paymentModes.map(
              (mode) => (

                <option
                  key={mode}
                  value={mode}
                >
                  {mode}
                </option>

              )
            )}

          </select>

          <input
            placeholder="Reference Number"
            value={referenceNumber}
            onChange={(e) =>
              setReferenceNumber(
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
            handleCreatePayment
          }
          className="mt-6 rounded-full bg-green-500 px-6 py-3 font-semibold"
        >
          Record Payment
        </button>

      </div>

      {/* PAYMENT HISTORY */}

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

        <h2 className="mb-6 text-2xl font-semibold">
          Payment History
        </h2>

        <div className="space-y-4">

          {payments.map(
            (payment) => (

              <div
                key={payment.id}
                className="rounded-2xl border border-white/10 p-5"
              >

                <div className="grid gap-4 md:grid-cols-5">

                  <div>

                    <p className="text-gray-400">
                      Customer
                    </p>

                    <p>
                      {
                        payment.bookings
                          ?.customer_name
                      }
                    </p>

                  </div>

                  <div>

                    <p className="text-gray-400">
                      Amount
                    </p>

                    <p className="text-green-400 font-semibold">
                      ₹{payment.amount}
                    </p>

                  </div>

                  <div>

                    <p className="text-gray-400">
                      Mode
                    </p>

                    <p>
                      {
                        payment.payment_mode
                      }
                    </p>

                  </div>

                  <div>

                    <p className="text-gray-400">
                      Date
                    </p>

                    <p>
                      {
                        payment.payment_date
                      }
                    </p>

                  </div>

                  <div>

                    <p className="text-gray-400">
                      Reference
                    </p>

                    <p>
                      {
                        payment.reference_number
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