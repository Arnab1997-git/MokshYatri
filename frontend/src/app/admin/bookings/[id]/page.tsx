"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import {
  getBookingById,
  getBookingPayments,
  getBookingHotelAllocation,
  getBookingVehicleAllocation,
} from "@/services/bookingService";

import {
  uploadBookingDocument,
  getBookingDocuments,
} from "@/services/documentService";
export default function BookingDetailsPage() {

  const params =
    useParams();

  const bookingId =
    Number(params.id);

  const [booking, setBooking] =
    useState<any>(null);

  const [payments, setPayments] =
    useState<any[]>([]);

  const [hotelAllocation, setHotelAllocation] =
    useState<any>(null);

  const [vehicleAllocation, setVehicleAllocation] =
    useState<any>(null);

  const [documents, setDocuments] =
    useState<any[]>([]);

  const [documentTitle, setDocumentTitle] =
    useState("");

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [uploadingDocument, setUploadingDocument] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    async function loadData() {

      const [
        bookingData,
        paymentData,
        hotelData,
        vehicleData,
        documentData,
      ] = await Promise.all([

        getBookingById(
          bookingId
        ),

        getBookingPayments(
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

      setHotelAllocation(
        hotelData
      );

      setVehicleAllocation(
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

        Loading booking...

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

  const advancePaid =
    Number(
      booking.advance_paid || 0
    );

  const actualCollected =
    advancePaid +
    totalCollected;

  const outstanding =
    Number(
      booking.total_amount || 0
    ) -
    actualCollected;

  const totalAmount =
  Number(
    booking.total_amount || 0
  );

  const collectionPercentage =
    totalAmount > 0
      ? (
          actualCollected /
          totalAmount
        ) * 100
      : 0;

  const paymentComplete =
    outstanding <= 0;

  const hotelAssigned =
    !!hotelAllocation;

  const vehicleAssigned =
    !!vehicleAllocation;

  const tripReady =
    paymentComplete &&
    hotelAssigned &&
    vehicleAssigned;

  const recommendedStatus =
    tripReady
      ? "READY_FOR_TRAVEL"
      : booking.status;
  
  async function handleDocumentUpload() {

    if (
      !selectedFile ||
      !documentTitle
    ) {
      return;
    }

    setUploadingDocument(
      true
    );

    const result =
      await uploadBookingDocument(
        bookingId,
        selectedFile,
        documentTitle
      );

    if (
      result.success
    ) {

      const docs =
        await getBookingDocuments(
          bookingId
        );

      setDocuments(
        docs
      );

      setDocumentTitle(
        ""
      );

      setSelectedFile(
        null
      );
    }

    setUploadingDocument(
      false
    );
  }
  return (

    <main className="p-10 text-white">

      {/* HEADER */}

      <div className="mb-10">

        <p className="mb-2 text-sm uppercase tracking-[0.4em] text-cyan-400">
          Booking Command Center
        </p>

        <h1 className="text-5xl font-bold">
            Booking #{booking.id}
        </h1>

        <p className="mt-2 text-gray-400">
            {booking.customer_name}
        </p>

      </div>

      {/* CUSTOMER */}

      <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6">

        <h2 className="mb-4 text-2xl font-semibold">
          Customer Information
        </h2>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-4">

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
              Phone
            </p>
            <p>
              {booking.customer_phone}
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
              Status
            </p>
            <p
                className={
                    recommendedStatus ===
                    "READY_FOR_TRAVEL"
                    ? "font-bold text-green-400"
                    : ""
                }
            >
                {recommendedStatus}
            </p>
          </div>

        </div>

      </div>

      {/* TRIP READINESS */}

      <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6">

        <h2 className="mb-6 text-2xl font-semibold">
            Trip Readiness
        </h2>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-4">

            <div>

             <p className="text-gray-400">
                Payment
             </p>

             <p
                className={
                paymentComplete
                    ? "font-bold text-green-400"
                    : "font-bold text-red-400"
                }
            >
                {
                paymentComplete
                    ? "COMPLETE"
                    : "PENDING"
                }
             </p>

            </div>

            <div>

             <p className="text-gray-400">
                Hotel
             </p>

             <p
                className={
                hotelAssigned
                    ? "font-bold text-green-400"
                    : "font-bold text-red-400"
                }
            >
                {
                hotelAssigned
                    ? "ASSIGNED"
                    : "PENDING"
                }
             </p>

            </div>

            <div>

             <p className="text-gray-400">
                Vehicle
             </p>

             <p
                className={
                vehicleAssigned
                    ? "font-bold text-green-400"
                    : "font-bold text-red-400"
                }
            >
                {
                vehicleAssigned
                    ? "ASSIGNED"
                    : "PENDING"
                }
             </p>

            </div>

            <div>

             <p className="text-gray-400">
                Trip Ready
             </p>

             <p
                className={
                tripReady
                    ? "font-bold text-green-400"
                    : "font-bold text-yellow-400"
                }
            >
                {
                tripReady
                    ? "YES"
                    : "NO"
                }
             </p>

            </div>

        </div>

      </div>


      {/* FINANCIALS */}

        <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6">

        <h2 className="mb-4 text-2xl font-semibold">
            Financial Summary
        </h2>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-4">

            <div>

            <p className="text-gray-400">
                Total Amount
            </p>

            <p className="text-2xl font-bold">
                ₹{booking.total_amount}
            </p>

            </div>

            <div>

            <p className="text-gray-400">
                Collected
            </p>

            <p className="text-2xl font-bold text-green-400">
                ₹{actualCollected}
            </p>

            </div>

            <div>

            <p className="text-gray-400">
                Outstanding
            </p>

            <p className="text-2xl font-bold text-yellow-400">
                ₹{outstanding}
            </p>

            </div>

            <div>

            <p className="text-gray-400">
                Collection %
            </p>

            <p className="text-2xl font-bold text-cyan-400">
                {collectionPercentage.toFixed(1)}%
            </p>

            </div>

        </div>

        </div>

      {/* PAYMENTS */}

      <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6">

        <h2 className="mb-4 text-2xl font-semibold">
          Payment History
        </h2>

        <div className="space-y-3">

          {payments.length === 0 && (
            <p className="text-gray-400">
              No payments recorded
            </p>
          )}

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

      {/* HOTEL */}

      <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6">

        <h2 className="mb-4 text-2xl font-semibold">
          Hotel Allocation
        </h2>

        {hotelAllocation ? (

          <div className="grid gap-4 grid-cols-1 md:grid-cols-4">

            <div>
              <p className="text-gray-400">
                Hotel
              </p>
              <p>
                {hotelAllocation.hotels?.name}
              </p>
            </div>

            <div>
              <p className="text-gray-400">
                Check In
              </p>
              <p>
                {hotelAllocation.check_in_date}
              </p>
            </div>

            <div>
              <p className="text-gray-400">
                Check Out
              </p>
              <p>
                {hotelAllocation.check_out_date}
              </p>
            </div>

            <div>
              <p className="text-gray-400">
                Confirmation
              </p>
              <p>
                {
                  hotelAllocation.confirmation_number
                }
              </p>
            </div>

          </div>

        ) : (

          <p className="text-gray-400">
            No hotel assigned
          </p>

        )}

      </div>

      {/* VEHICLE */}

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

        <h2 className="mb-4 text-2xl font-semibold">
          Vehicle Allocation
        </h2>

        {vehicleAllocation ? (

          <div className="grid gap-4 grid-cols-1 md:grid-cols-5">

            <div>
              <p className="text-gray-400">
                Vehicle
              </p>
              <p>
                {vehicleAllocation.vehicles?.name}
              </p>
            </div>

            <div>
              <p className="text-gray-400">
                Driver
              </p>
              <p>
                {vehicleAllocation.driver_name}
              </p>
            </div>

            <div>
              <p className="text-gray-400">
                Phone
              </p>
              <p>
                {vehicleAllocation.driver_phone}
              </p>
            </div>

            <div>
              <p className="text-gray-400">
                Vehicle Number
              </p>
              <p>
                {vehicleAllocation.vehicle_number}
              </p>
            </div>

            <div>
              <p className="text-gray-400">
                Pickup Date
              </p>
              <p>
                {vehicleAllocation.pickup_date}
              </p>
            </div>

          </div>

        ) : (

          <p className="text-gray-400">
            No vehicle assigned
          </p>

        )}

      </div>

      {/* DOCUMENTS */}

      <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">

        <h2 className="mb-6 text-2xl font-semibold">
          Trip Documents
        </h2>

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Document Title"
            value={documentTitle}
            onChange={(e) =>
              setDocumentTitle(
                e.target.value
              )
            }
            className="w-full rounded-xl border border-white/10 bg-black/30 p-3"
          />

          <input
            type="file"
            onChange={(e) =>
              setSelectedFile(
                e.target.files?.[0] ||
                null
              )
            }
            className="w-full"
          />

          <button
            onClick={
              handleDocumentUpload
            }
            disabled={
              uploadingDocument
            }
            className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-black"
          >
            {uploadingDocument
              ? "Uploading..."
              : "Upload Document"}
          </button>

        </div>

        <div className="mt-8 space-y-3">

          {documents.length === 0 && (

            <p className="text-gray-400">
              No documents uploaded yet.
            </p>

          )}

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
                  View
                </a>

              </div>

            )
          )}

        </div>

      </div>

    </main>
  );
}