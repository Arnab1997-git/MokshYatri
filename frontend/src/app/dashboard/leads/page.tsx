"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { supabase } from "@/lib/supabase";

import {
  getUserLeads,
} from "@/services/leadService";

import CustomerPortalNav from "@/components/customer/CustomerPortalNav";

export default function MyLeadsPage() {

  const [leads, setLeads] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    async function loadLeads() {

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {

        setLoading(false);

        return;
      }

      const data =
        await getUserLeads(
          user.id
        );

      setLeads(data);

      setLoading(false);
    }

    loadLeads();

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
            My Leads
          </h1>

        </div>

        {loading && (

          <p className="text-gray-400">
            Loading leads...
          </p>

        )}

        {!loading &&
          leads.length === 0 && (

          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">

            <h2 className="mb-3 text-2xl font-semibold">
              No inquiries yet
            </h2>

            <p className="text-gray-400">
              Submit a trip inquiry to see it here.
            </p>

          </div>

        )}

        <div className="grid gap-6">

          {leads.map((lead) => (

            <Link
              key={lead.id}
              href={`/dashboard/leads/${lead.id}`}
              className="group"
            >

              <div
                className="rounded-3xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/10"
              >

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                  <div>

                    <h2 className="mb-2 text-2xl font-semibold">
                      {lead.destination}
                    </h2>

                    <p className="text-gray-400">
                      Travel Month:
                      {" "}
                      {lead.travel_month || "-"}
                    </p>

                    <p className="text-gray-400">
                      Travelers:
                      {" "}
                      {lead.travelers}
                    </p>

                    <p className="text-gray-400">
                      Source:
                      {" "}
                      {lead.source || "-"}
                    </p>

                  </div>

                  <div className="text-right">

                    <div
                      className={`inline-flex rounded-full px-4 py-2 text-sm ${
                        lead.status === "BOOKED"
                          ? "bg-green-500/20 text-green-400"
                          : lead.status === "QUOTED"
                          ? "bg-cyan-500/20 text-cyan-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {lead.status}
                    </div>

                    <p className="mt-3 text-sm text-gray-500">

                      {new Date(
                        lead.created_at
                      ).toLocaleDateString()}

                    </p>

                    <p className="mt-2 text-cyan-400 transition group-hover:text-cyan-300">
                      View Lead →
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