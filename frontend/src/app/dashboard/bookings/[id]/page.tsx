"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import {
  getBookingById,
  getBookingPayments,
  getBookingHotelAllocation,
  getBookingVehicleAllocation,
} from "@/services/bookingService";
import CustomerPortalNav from "@/components/customer/CustomerPortalNav";
import Link from "next/dist/client/link";
import { supabase } from "@/lib/supabase";
import { getLeadById } from "@/services/leadService";
import {
  getBookingTimeline,
} from "@/services/timelineService";
import {
  getBookingDocuments,
} from "@/services/documentService";
import {
  createReview,
  getReviewByBooking,
} from "@/services/reviewService";


export default function CustomerBookingDetailsPage() {

  const params =
    useParams();

  const [timeline, setTimeline] =
    useState<any[]>([]);

  const bookingId =
    Number(params.id);

  const [documents, setDocuments] =
    useState<any[]>([]);

  const [booking, setBooking] =
    useState<any>(null);

  const [payments, setPayments] =
    useState<any[]>([]);

  const [hotel, setHotel] =
    useState<any>(null);

  const [vehicle, setVehicle] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [review, setReview] =
    useState<any>(null);

  const [rating, setRating] =
    useState(5);

  const [reviewText, setReviewText] =
    useState("");

  const [submittingReview, setSubmittingReview] =
    useState(false);

  useEffect(() => {

  async function loadData() {

    const bookingData =
      await getBookingById(
        bookingId
      );

    if (!bookingData) {

      setBooking(null);

      setLoading(false);

      return;
    }

    const timelineData =
      await getBookingTimeline(
        bookingData
      );

    setTimeline(
      timelineData
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {

      setBooking(null);

      setLoading(false);

      return;
    }
    if (!bookingData.lead_id) {

      setBooking(null);

      setLoading(false);

      return;
    }
    const lead =
      await getLeadById(
        bookingData.lead_id
      );
    if (!lead) {

      setBooking(null);

      setLoading(false);

      return;
    }
    if (
      !lead ||
      lead.user_id !== user.id
    ) {

      setBooking(null);

      setLoading(false);

      return;
    }

    const [
      paymentData,
      reviewData,
      hotelData,
      vehicleData,
      documentData,
    ] = await Promise.all([

      getBookingPayments(
        bookingId
      ),

      getReviewByBooking(
        bookingId
      ),

      getBookingHotelAllocation(
        bookingId
      ),

      getBookingVehicleAllocation(
        bookingId
      ),

      getBookingDocuments(
        bookingId
      ),

    ]);

    setBooking(
      bookingData
    );

    setPayments(
      paymentData
    );

    setHotel(
      hotelData
    );

    setReview(
      reviewData
    );

    setVehicle(
      vehicleData
    );

    setDocuments(
      documentData
    );

    setLoading(false);

  }

    if (bookingId) {
      loadData();
    }

  }, [bookingId]);

  if (loading) {

    return (
      <main className="p-10 text-white">
        Loading...
      </main>
    );

  }

  if (!booking) {

    return (
      <main className="p-10 text-white">
        Booking not found
      </main>
    );

  }

  const paymentTotal =
    payments.reduce(
      (sum, payment) =>
        sum +
        Number(
          payment.amount || 0
        ),
      0
    );

  const advancePaid =
    Number(
      booking.advance_paid || 0
    );

  const collected =
    advancePaid +
    paymentTotal;

  const outstanding =
    Number(
      booking.total_amount || 0
    ) - collected;

  const paymentComplete =
    outstanding <= 0;

  const hotelAssigned =
    !!hotel;

  const vehicleAssigned =
    !!vehicle;

  const tripReady =
    paymentComplete &&
    hotelAssigned &&
    vehicleAssigned;

  async function handleSubmitReview() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return;
    }

    setSubmittingReview(
      true
    );

    const result =
      await createReview({

        booking_id:
          bookingId,

        user_id:
          user.id,

        rating,

        review_text:
          reviewText,

      });

    if (
      result.success
    ) {

      const savedReview =
        await getReviewByBooking(
          bookingId
        );

      setReview(
        savedReview
      );
    }

    setSubmittingReview(
      false
    );
  }

  return (

    <main className="min-h-screen bg-[#050816] px-6 py-24 text-white">

      <div className="mx-auto max-w-6xl">

        <p className="mb-3 text-sm uppercase tracking-[0.4em] text-cyan-400">
            Customer Portal
        </p>
        <CustomerPortalNav />

        <Link
          href="/dashboard/bookings"
          className="mb-6 inline-block text-cyan-400"
        >
          ← Back to My Bookings
        </Link>

        <h1 className="mb-12 text-5xl font-bold">
          My Trip
        </h1>

        {/* Progress Tracker */}

        <div className="mb-10 rounded-3xl border border-white/10 bg-white/5 p-8">

          <h2 className="mb-6 text-2xl font-semibold">
            Travel Progress
          </h2>

          <div className="grid gap-4 md:grid-cols-3">

            <div>
              ✅ Booking Confirmed
            </div>

            <div>
              {paymentComplete
                ? "✅ Payment Complete"
                : "⏳ Payment Pending"}
            </div>

            <div>
              {hotelAssigned
                ? "✅ Hotel Assigned"
                : "⏳ Hotel Pending"}
            </div>

            <div>
              {vehicleAssigned
                ? "✅ Vehicle Assigned"
                : "⏳ Vehicle Pending"}
            </div>

            <div>
              {tripReady
                ? "🚀 Ready For Travel"
                : "⏳ Preparing Trip"}
            </div>

          </div>

        </div>

        <div className="mb-10 rounded-3xl border border-white/10 bg-white/5 p-8">

          <h2 className="mb-6 text-2xl font-semibold">
            Trip Timeline
          </h2>

          <div className="space-y-4">

            {timeline.map(
              (
                item,
                index
              ) => (

                <div
                  key={index}
                  className="flex items-start gap-4"
                >

                  <div>

                    {item.status ===
                    "completed"
                      ? "✅"
                      : "⏳"}

                  </div>

                  <div>

                    <p className="font-medium">

                      {item.title}

                    </p>

                    {item.date && (

                      <p className="text-sm text-gray-400">

                        {new Date(
                          item.date
                        ).toLocaleDateString()}

                      </p>

                    )}

                  </div>

                </div>

              )
            )}

          </div>

        </div>

        {/* Financial Summary */}

        <div className="mb-10 rounded-3xl border border-white/10 bg-white/5 p-8">

          <h2 className="mb-6 text-2xl font-semibold">
            Financial Summary
          </h2>

          <div className="grid gap-6 md:grid-cols-4">

            <div>
              <p>Total Amount</p>
              <p className="text-2xl font-bold">
                ₹{booking.total_amount}
              </p>
            </div>

            <div>
              <p>Advance</p>
              <p className="text-2xl font-bold">
                ₹{booking.advance_paid}
              </p>
            </div>

            <div>
              <p>Collected</p>
              <p className="text-2xl font-bold text-green-400">
                ₹{collected}
              </p>
            </div>

            <div>
              <p>Balance</p>
              <p className="text-2xl font-bold text-cyan-400">
                ₹{outstanding}
              </p>
            </div>

          </div>

        </div>

        {/* DOCUMENTS */}

        <div className="mb-10 rounded-3xl border border-white/10 bg-white/5 p-8">

          <h2 className="mb-6 text-2xl font-semibold">
            Trip Documents
          </h2>

          {documents.length === 0 ? (

            <p className="text-gray-400">
              No documents available yet.
            </p>

          ) : (

            <div className="space-y-3">

              {documents.map(
                (doc) => (

                  <div
                    key={doc.id}
                    className="flex items-center justify-between rounded-xl border border-white/10 p-4"
                  >

                    <div>
                      📄 {doc.title}
                    </div>

                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400"
                    >
                      Download
                    </a>

                  </div>

                )
              )}

            </div>

          )}

        </div>
        {/* REVIEW */}

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">

          <h2 className="mb-6 text-2xl font-semibold">
            Trip Review
          </h2>

          {!tripReady && (

            <p className="text-gray-400">
              Reviews can be submitted after
              your trip is fully prepared.
            </p>

          )}

          {tripReady && review && (

            <div>

              <p className="mb-3 text-2xl">
                {"⭐".repeat(
                  review.rating
                )}
              </p>

              <p>
                {review.review_text}
              </p>

            </div>

          )}

          {tripReady && !review && (

            <div className="space-y-4">

              <div>

                <label className="mb-2 block">

                  Rating

                </label>

                <select
                  value={rating}
                  onChange={(e) =>
                    setRating(
                      Number(
                        e.target.value
                      )
                    )
                  }
                  className="rounded-xl bg-black/30 p-3"
                >

                  <option value={5}>
                    ⭐⭐⭐⭐⭐
                  </option>

                  <option value={4}>
                    ⭐⭐⭐⭐
                  </option>

                  <option value={3}>
                    ⭐⭐⭐
                  </option>

                  <option value={2}>
                    ⭐⭐
                  </option>

                  <option value={1}>
                    ⭐
                  </option>

                </select>

              </div>

              <textarea
                rows={5}
                placeholder="Tell us about your experience..."
                value={reviewText}
                onChange={(e) =>
                  setReviewText(
                    e.target.value
                  )
                }
                className="w-full rounded-xl bg-black/30 p-4"
              />

              <button
                onClick={
                  handleSubmitReview
                }
                disabled={
                  submittingReview
                }
                className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black"
              >

                {submittingReview
                  ? "Submitting..."
                  : "Submit Review"}

              </button>

            </div>

          )}

        </div>

        {/* Hotel */}

        {hotel && (

          <div className="mb-10 rounded-3xl border border-white/10 bg-white/5 p-8">

            <h2 className="mb-4 text-2xl font-semibold">
              Hotel Details
            </h2>

            <p>
              {hotel.hotels?.name}
            </p>

            <p>
              Check In:
              {" "}
              {hotel.check_in_date}
            </p>

            <p>
              Check Out:
              {" "}
              {hotel.check_out_date}
            </p>

          </div>

        )}

        {/* Vehicle */}

        {vehicle && (

          <div className="mb-10 rounded-3xl border border-white/10 bg-white/5 p-8">

            <h2 className="mb-4 text-2xl font-semibold">
              Vehicle Details
            </h2>

            <p>
              {vehicle.vehicles?.name}
            </p>

            <p>
              Driver:
              {" "}
              {vehicle.driver_name}
            </p>

            <p>
              Phone:
              {" "}
              {vehicle.driver_phone}
            </p>

          </div>

        )}

        {/* Payments */}

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">

          <h2 className="mb-4 text-2xl font-semibold">
            Payment History
          </h2>

          <div className="space-y-3">

            {payments.map(
              (payment) => (

                <div
                  key={payment.id}
                  className="rounded-xl border border-white/10 p-4"
                >
                  ₹{payment.amount}
                  {" • "}
                  {payment.payment_mode}
                  {" • "}
                  {payment.payment_date}
                </div>

              )
            )}

          </div>

        </div>

      </div>

    </main>

  );
}