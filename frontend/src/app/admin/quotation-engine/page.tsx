"use client";

import { useEffect, useState } from "react";

import {
  useSearchParams,
} from "next/navigation";

import {
  calculatePackagePricing,
} from "@/services/pricingEngineService";

import {
  getPackages,
} from "@/services/packageService";

import {
  saveQuotation,
} from "@/services/quotationService";

import {
  getLeadById,
  linkQuotationToLead,
} from "@/services/leadService";

export default function QuotationEnginePage() {

  const searchParams =
    useSearchParams();

  const leadId =
    searchParams.get("leadId");

  const [lead, setLead] =
    useState<any>(null);

  const [packages, setPackages] =
    useState<any[]>([]);

  const [packageId, setPackageId] =
    useState<number>();

  const [travelers, setTravelers] =
    useState(2);

  const [
    vehicleCategoryId,
    setVehicleCategoryId,
  ] = useState(1);

  const [
    customerName,
    setCustomerName,
  ] = useState("");

  const [
    customerPhone,
    setCustomerPhone,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [result, setResult] =
    useState<any>(null);

  useEffect(() => {

    async function loadData() {

      const packageData =
        await getPackages();

      setPackages(
        packageData
      );

      if (
        packageData.length > 0
      ) {

        setPackageId(
          packageData[0].id
        );
      }

      if (leadId) {

        const leadData =
          await getLeadById(
            Number(leadId)
          );

        if (leadData) {

          setLead(
            leadData
          );

          setCustomerName(
            leadData.customer_name || ""
          );

          setCustomerPhone(
            leadData.phone || ""
          );

          if (
            leadData.travelers
          ) {

            setTravelers(
              leadData.travelers
            );
          }
        }
      }
    }

    loadData();

  }, [leadId]);

  async function generateQuote() {

    if (!packageId) return;

    setLoading(true);

    const data =
      await calculatePackagePricing(
        packageId,
        travelers,
        vehicleCategoryId
      );

    setResult(data);

    setLoading(false);
  }

  async function handleSaveQuote() {

    if (!result) {

      alert(
        "Generate quotation first"
      );

      return;
    }

    if (
      !customerName.trim()
    ) {

      alert(
        "Customer name required"
      );

      return;
    }

    const saveResult =
      await saveQuotation({

        lead_id:
          lead
            ? lead.id
            : null,

        customer_name:
          customerName,

        customer_phone:
          customerPhone,

        package_id:
          packageId,

        travelers,

        vehicle_category_id:
          vehicleCategoryId,

        total_cost:
          result.totalCost,

        selling_price:
          result.sellingPrice,

        profit:
          result.profit,
      });

    if (
      saveResult.success &&
      saveResult.data &&
      lead
    ) {

      await linkQuotationToLead(
        lead.id,
        saveResult.data.id
      );
    }

    if (
      saveResult.success
    ) {

      alert(
        lead
          ? "Quotation saved and linked to lead"
          : "Quotation saved"
      );

    } else {

      alert(
        saveResult.message
      );
    }
  }

  const profitPercent =
    result
      ? (
          (
            result.profit /
            result.sellingPrice
          ) * 100
        ).toFixed(2)
      : 0;

  return (

    <main className="min-h-screen bg-[#050816] px-6 py-24 text-white">

      <div className="mx-auto max-w-5xl">

        <div className="mb-12 text-center">

          <p className="mb-4 text-sm uppercase tracking-[0.4em] text-cyan-400">
            Business Dashboard
          </p>

          <h1 className="text-5xl font-bold">
            Quotation Engine
          </h1>

          {lead && (

            <div className="mx-auto mt-6 max-w-lg rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-4">

              <p className="font-semibold text-cyan-400">
                Lead Connected
              </p>

              <p>
                {lead.customer_name}
              </p>

              <p className="text-sm text-gray-400">
                Travelers: {lead.travelers}
              </p>

            </div>

          )}

        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">

          <div className="mb-8 grid gap-6 md:grid-cols-2">

            <div>

              <label className="mb-2 block text-sm text-gray-400">
                Customer Name
              </label>

              <input
                value={customerName}
                onChange={(e) =>
                  setCustomerName(
                    e.target.value
                  )
                }
                placeholder="Customer Name"
                className="w-full rounded-2xl border border-white/10 bg-white/5 p-4"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm text-gray-400">
                Customer Phone
              </label>

              <input
                value={customerPhone}
                onChange={(e) =>
                  setCustomerPhone(
                    e.target.value
                  )
                }
                placeholder="Phone Number"
                className="w-full rounded-2xl border border-white/10 bg-white/5 p-4"
              />

            </div>

          </div>

          <div className="grid gap-6 md:grid-cols-3">

            <div>

              <label className="mb-2 block text-sm text-gray-400">
                Package
              </label>

              <select
                value={packageId}
                onChange={(e) =>
                  setPackageId(
                    Number(
                      e.target.value
                    )
                  )
                }
                className="w-full rounded-2xl border border-white/10 bg-white/5 p-4"
              >

                {packages.map(
                  (pkg) => (

                    <option
                      key={pkg.id}
                      value={pkg.id}
                    >
                      {pkg.name}
                    </option>

                  )
                )}

              </select>

            </div>

            <div>

              <label className="mb-2 block text-sm text-gray-400">
                Travelers
              </label>

              <input
                type="number"
                min={1}
                value={travelers}
                onChange={(e) =>
                  setTravelers(
                    Number(
                      e.target.value
                    )
                  )
                }
                className="w-full rounded-2xl border border-white/10 bg-white/5 p-4"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm text-gray-400">
                Vehicle
              </label>

              <select
                value={vehicleCategoryId}
                onChange={(e) =>
                  setVehicleCategoryId(
                    Number(
                      e.target.value
                    )
                  )
                }
                className="w-full rounded-2xl border border-white/10 bg-white/5 p-4"
              >

                <option value={1}>
                  4 Seater
                </option>

                <option value={2}>
                  7 Seater
                </option>

                <option value={3}>
                  7 Seater Premium
                </option>

              </select>

            </div>

          </div>

          <div className="mt-8 text-center">

            <button
              onClick={generateQuote}
              disabled={
                loading ||
                !packageId
              }
              className="rounded-full bg-white px-8 py-4 font-semibold text-black"
            >
              {loading
                ? "Calculating..."
                : "Generate Quote"}
            </button>

          </div>

        </div>

        {result && (

          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">

            <h2 className="mb-8 text-3xl font-semibold">
              Quote Summary
            </h2>

            <div className="grid gap-6 md:grid-cols-2">

              <div>

                <p className="mb-3">
                  Hotel Cost:
                  <span className="ml-2 font-bold">
                    ₹{result.hotelB2B}
                  </span>
                </p>

                <p className="mb-3">
                  Vehicle Cost:
                  <span className="ml-2 font-bold">
                    ₹{result.vehicleB2B}
                  </span>
                </p>

                <p className="mb-3 text-xl">
                  Total Cost:
                  <span className="ml-2 font-bold text-yellow-400">
                    ₹{result.totalCost}
                  </span>
                </p>

              </div>

              <div>

                <p className="mb-3">
                  Customer Price:
                  <span className="ml-2 font-bold text-cyan-400">
                    ₹{result.sellingPrice}
                  </span>
                </p>

                <p className="mb-3">
                  Profit:
                  <span className="ml-2 font-bold text-green-400">
                    ₹{result.profit}
                  </span>
                </p>

                <p className="mb-3">
                  Profit %:
                  <span className="ml-2 font-bold">
                    {profitPercent}%
                  </span>
                </p>

              </div>

            </div>

            <div className="mt-8 text-center">

              <button
                onClick={handleSaveQuote}
                className="rounded-full bg-cyan-400 px-8 py-4 font-semibold text-black"
              >
                Save Quote
              </button>

            </div>

          </div>

        )}

      </div>

    </main>
  );
}