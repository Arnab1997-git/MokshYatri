"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { supabase } from "@/lib/supabase";

import {
  getQuotationById,
} from "@/services/quotationService";

import {
  getLeadById,
} from "@/services/leadService";

import CustomerPortalNav from "@/components/customer/CustomerPortalNav";

export default function QuotationDetailsPage() {

  const params =
    useParams();

  const quotationId =
    Number(params.id);

  const [quotation, setQuotation] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    async function loadQuotation() {

      const quotationData =
        await getQuotationById(
          quotationId
        );

      if (!quotationData) {

        setLoading(false);

        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {

        setLoading(false);

        return;
      }

      if (
        !quotationData.lead_id
      ) {

        setLoading(false);

        return;
      }

      const lead =
        await getLeadById(
          quotationData.lead_id
        );

      if (
        !lead ||
        lead.user_id !== user.id
      ) {

        setLoading(false);

        return;
      }

      setQuotation(
        quotationData
      );

      setLoading(false);
    }

    if (quotationId) {

      loadQuotation();

    }

  }, [quotationId]);

  if (loading) {

    return (
      <main className="p-10 text-white">
        Loading...
      </main>
    );

  }

  if (!quotation) {

    return (
      <main className="p-10 text-white">
        Quotation not found
      </main>
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
          href="/dashboard/quotations"
          className="mb-6 inline-block text-cyan-400"
        >
          ← Back to My Quotations
        </Link>

        <h1 className="mb-12 text-5xl font-bold">
          Quotation #{quotation.id}
        </h1>

        <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-8">

          <h2 className="mb-6 text-2xl font-semibold">
            Quotation Summary
          </h2>

          <div className="grid gap-6 md:grid-cols-2">

            <div>

              <p className="text-gray-400">
                Customer
              </p>

              <p className="text-xl">
                {quotation.customer_name}
              </p>

            </div>

            <div>

              <p className="text-gray-400">
                Travelers
              </p>

              <p className="text-xl">
                {quotation.travelers}
              </p>

            </div>

            <div>

              <p className="text-gray-400">
                Package
              </p>

              <p className="text-xl">
                {quotation.package_templates?.name ||
                  "Custom Package"}
              </p>

            </div>

            <div>

              <p className="text-gray-400">
                Created
              </p>

              <p className="text-xl">
                {new Date(
                  quotation.created_at
                ).toLocaleDateString()}
              </p>

            </div>

          </div>

        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">

          <h2 className="mb-6 text-2xl font-semibold">
            Pricing
          </h2>

          <div className="grid gap-6 md:grid-cols-3">

            <div>

              <p className="text-gray-400">
                Total Cost
              </p>

              <p className="text-3xl font-bold">
                ₹{Number(
                  quotation.total_cost || 0
                ).toLocaleString()}
              </p>

            </div>

            <div>

              <p className="text-gray-400">
                Selling Price
              </p>

              <p className="text-3xl font-bold">
                ₹{Number(
                  quotation.selling_price || 0
                ).toLocaleString()}
              </p>

            </div>

            <div>

              <p className="text-gray-400">
                Quoted Price
              </p>

              <p className="text-3xl font-bold text-cyan-400">
                ₹{Number(
                  quotation.quoted_price || 0
                ).toLocaleString()}
              </p>

            </div>

          </div>

        </div>

      </div>

    </main>

  );
}