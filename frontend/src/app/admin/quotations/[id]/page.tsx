"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import {
  getQuotationById,
} from "@/services/quotationService";

import {
  generateQuotationPdf,
} from "@/services/pdfService";

import {
  createBookingFromQuotation,
} from "@/services/bookingService";

import {
  markLeadAsBooked,
} from "@/services/leadService";

export default function QuotationDetailsPage() {

  const params =
    useParams();

  const [quotation, setQuotation] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [travelDate, setTravelDate] =
    useState("");

  const [advancePaid, setAdvancePaid] =
    useState("");

  const [creatingBooking, setCreatingBooking] =
    useState(false);

  useEffect(() => {

    async function loadQuotation() {

      const data =
        await getQuotationById(
          Number(params.id)
        );

      setQuotation(data);

      setLoading(false);
    }

    if (params.id) {

      loadQuotation();
    }

  }, [params.id]);

  async function handleConvertToBooking() {

    if (!travelDate) {

      alert(
        "Please select travel date"
      );

      return;
    }

    setCreatingBooking(true);

    const result =
      await createBookingFromQuotation(
        quotation,
        travelDate,
        Number(
          advancePaid || 0
        )
      );

    setCreatingBooking(false);

    if (result.success) {

      if (
        quotation.lead_id
      ) {

        await markLeadAsBooked(
          quotation.lead_id
        );
      }

      alert(
        "Booking created successfully"
      );

    } else {

      alert(
        result.message ||
        "Failed to create booking"
      );
    }
  }

  if (loading) {

    return (

      <main className="min-h-screen bg-[#050816] flex items-center justify-center text-white">

        Loading quotation...

      </main>

    );
  }

  if (!quotation) {

    return (

      <main className="min-h-screen bg-[#050816] flex items-center justify-center text-white">

        Quotation not found

      </main>

    );
  }

  return (

    <main className="min-h-screen bg-[#050816] px-6 py-24 text-white">

      <div className="mx-auto max-w-4xl">

        <div className="rounded-3xl border border-white/10 bg-white/5 p-10">

          <div className="mb-10 text-center">

            <p className="mb-3 text-sm uppercase tracking-[0.4em] text-cyan-400">
              Moksh Yatri
            </p>

            <h1 className="text-5xl font-bold">
              Quotation
            </h1>

          </div>

          <div className="grid gap-8 md:grid-cols-2">

            <div>

              <p className="mb-2 text-gray-400">
                Customer Name
              </p>

              <p className="text-xl font-semibold">
                {quotation.customer_name}
              </p>

            </div>

            <div>

              <p className="mb-2 text-gray-400">
                Phone Number
              </p>

              <p className="text-xl font-semibold">
                {quotation.customer_phone}
              </p>

            </div>

            <div>

              <p className="mb-2 text-gray-400">
                Package
              </p>

              <p className="text-xl font-semibold">
                {
                  quotation
                    .package_templates
                    ?.name
                }
              </p>

            </div>

            <div>

              <p className="mb-2 text-gray-400">
                Travelers
              </p>

              <p className="text-xl font-semibold">
                {quotation.travelers}
              </p>

            </div>

            <div>

              <p className="mb-2 text-gray-400">
                Total Cost
              </p>

              <p className="text-xl font-semibold text-yellow-400">
                ₹{quotation.total_cost}
              </p>

            </div>

            <div>

              <p className="mb-2 text-gray-400">
                System Selling Price
              </p>

              <p className="text-xl font-semibold text-cyan-400">
                ₹{quotation.selling_price}
              </p>

            </div>

            <div>

              <p className="mb-2 text-gray-400">
                Quoted Price
              </p>

              <p className="text-2xl font-bold text-cyan-300">
                ₹
                {
                  quotation.quoted_price ??
                  quotation.selling_price
                }
              </p>

            </div>

            <div>

              <p className="mb-2 text-gray-400">
                Profit
              </p>

              <p className="text-xl font-semibold text-green-400">
                ₹{quotation.profit}
              </p>

            </div>

            <div className="md:col-span-2">

              <p className="mb-2 text-gray-400">
                Generated On
              </p>

              <p className="text-xl font-semibold">
                {new Date(
                  quotation.created_at
                ).toLocaleString()}
              </p>

            </div>

          </div>

          <div className="mt-10 border-t border-white/10 pt-8">

            <div className="rounded-2xl bg-cyan-400/10 p-6 text-center">

              <p className="mb-2 text-sm uppercase tracking-widest text-cyan-400">
                Customer Price
              </p>

              <p className="text-5xl font-bold text-cyan-300">
                ₹
                {
                  quotation.quoted_price ??
                  quotation.selling_price
                }
              </p>

            </div>

          </div>

          {/* BOOKING SECTION */}

          <div className="mt-10 border-t border-white/10 pt-8">

            <h2 className="mb-6 text-center text-2xl font-semibold">
              Convert To Booking
            </h2>

            <div className="grid gap-4 md:grid-cols-2">

              <div>

                <label className="mb-2 block text-sm text-gray-400">
                  Travel Date
                </label>

                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) =>
                    setTravelDate(
                      e.target.value
                    )
                  }
                  className="w-full rounded-2xl border border-white/10 bg-white/5 p-4"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm text-gray-400">
                  Advance Paid
                </label>

                <input
                  type="number"
                  value={advancePaid}
                  onChange={(e) =>
                    setAdvancePaid(
                      e.target.value
                    )
                  }
                  placeholder="0"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 p-4"
                />

              </div>

            </div>

            <div className="mt-6 flex justify-center">

              <button
                onClick={
                  handleConvertToBooking
                }
                disabled={
                  creatingBooking
                }
                className="rounded-full bg-green-500 px-8 py-4 font-semibold text-white transition hover:opacity-90"
              >
                {creatingBooking
                  ? "Creating Booking..."
                  : "Convert To Booking"}
              </button>

            </div>

          </div>

          {/* PDF BUTTON */}

          <div className="mt-10 flex justify-center">

            <button
              onClick={() =>
                generateQuotationPdf(
                  quotation
                )
              }
              className="rounded-full bg-cyan-400 px-8 py-4 font-semibold text-black transition hover:opacity-90"
            >
              Download PDF
            </button>

          </div>

        </div>

      </div>

    </main>

  );
}