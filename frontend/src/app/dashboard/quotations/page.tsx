"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { supabase } from "@/lib/supabase";

import {
  getUserLeads,
} from "@/services/leadService";

import {
  getQuotationsByLeadIds,
} from "@/services/quotationService";

import CustomerPortalNav from "@/components/customer/CustomerPortalNav";

export default function MyQuotationsPage() {

  const [quotations, setQuotations] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    async function loadQuotations() {

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {

        setLoading(false);

        return;
      }

      const leads =
        await getUserLeads(
          user.id
        );

      const leadIds =
        leads.map(
          (lead) => lead.id
        );

      const data =
        await getQuotationsByLeadIds(
          leadIds
        );

      setQuotations(data);

      setLoading(false);
    }

    loadQuotations();

  }, []);

  return (

    <main className="min-h-screen bg-[#050816] px-6 py-24 text-white">

      <div className="mx-auto max-w-6xl">

        <div className="mb-12">

          <p className="mb-3 text-sm uppercase tracking-[0.4em] text-cyan-400">
            Customer Portal
          </p>

          <CustomerPortalNav />

          <h1 className="text-5xl font-bold">
            My Quotations
          </h1>

        </div>

        {loading && (

          <p className="text-gray-400">
            Loading quotations...
          </p>

        )}

        {!loading &&
          quotations.length === 0 && (

          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">

            <h2 className="mb-3 text-2xl font-semibold">
              No quotations available
            </h2>

            <p className="text-gray-400">
              Once our travel consultants prepare
              a quotation, it will appear here.
            </p>

          </div>

        )}

        <div className="grid gap-6">

          {quotations.map((quotation) => (

            <Link
              key={quotation.id}
              href={`/dashboard/quotations/${quotation.id}`}
              className="group"
            >

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/10">

                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

                  <div>

                    <h2 className="mb-3 text-2xl font-semibold">
                      Quotation #{quotation.id}
                    </h2>

                    <p className="text-gray-400">
                      Travelers:
                      {" "}
                      {quotation.travelers}
                    </p>

                    <p className="text-gray-400">
                      Customer:
                      {" "}
                      {quotation.customer_name}
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="mb-2 text-sm text-gray-400">
                      Quoted Price
                    </p>

                    <p className="text-3xl font-bold text-cyan-400">
                      ₹{Number(
                        quotation.quoted_price || 0
                      ).toLocaleString()}
                    </p>

                    <p className="mt-3 text-sm text-gray-500">

                      {new Date(
                        quotation.created_at
                      ).toLocaleDateString()}

                    </p>

                    <p className="mt-2 text-cyan-400 transition group-hover:text-cyan-300">
                      View Quotation →
                    </p>

                  </div>

                </div>

              </div>

            </Link>

          ))}

        </div>

      </div>

    </main>

  );
}