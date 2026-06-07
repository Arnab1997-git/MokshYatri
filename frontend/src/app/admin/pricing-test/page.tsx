"use client";

import { useState } from "react";

import { calculatePackagePricing }
  from "@/services/pricingEngineService";

export default function PricingTestPage() {

  const [result, setResult] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(false);

  async function runTest() {

    setLoading(true);

    const data =
      await calculatePackagePricing(
        1, // West Sikkim Deluxe
        2, // Travelers
        1  // 4 Seater
      );

    setResult(data);

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#050816] px-6 py-24 text-white">

      <div className="mx-auto max-w-4xl">

        <h1 className="mb-10 text-center text-5xl font-bold">
          Pricing Engine Test
        </h1>

        <div className="flex justify-center">

          <button
            onClick={runTest}
            disabled={loading}
            className="rounded-full bg-white px-8 py-4 font-semibold text-black"
          >
            {loading
              ? "Calculating..."
              : "Run Pricing Test"}
          </button>

        </div>

        {result && (

          <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-8">

            <h2 className="mb-6 text-3xl font-semibold">
              {result.packageName}
            </h2>

            <div className="space-y-4">

              <p>
                Travelers:
                <span className="ml-2 font-bold">
                  {result.travelerCount}
                </span>
              </p>

              <p>
                Hotel Cost (B2B):
                <span className="ml-2 font-bold">
                  ₹{result.hotelB2B}
                </span>
              </p>

              <p>
                Hotel Selling (B2C):
                <span className="ml-2 font-bold">
                  ₹{result.hotelB2C}
                </span>
              </p>

              <p>
                Vehicle Cost (B2B):
                <span className="ml-2 font-bold">
                  ₹{result.vehicleB2B}
                </span>
              </p>

              <p>
                Vehicle Selling (B2C):
                <span className="ml-2 font-bold">
                  ₹{result.vehicleB2C}
                </span>
              </p>

              <hr className="border-white/10" />

              <p className="text-xl">
                Total Cost:
                <span className="ml-2 font-bold text-yellow-400">
                  ₹{result.totalCost}
                </span>
              </p>

              <p className="text-xl">
                Selling Price:
                <span className="ml-2 font-bold text-cyan-400">
                  ₹{result.sellingPrice}
                </span>
              </p>

              <p className="text-2xl">
                Profit:
                <span className="ml-2 font-bold text-green-400">
                  ₹{result.profit}
                </span>
              </p>

            </div>

          </div>

        )}

      </div>

    </main>
  );
}