"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { supabase } from "@/lib/supabase";

import {
  getLeadById,
} from "@/services/leadService";

import CustomerPortalNav from "@/components/customer/CustomerPortalNav";

export default function LeadDetailsPage() {

  const params =
    useParams();

  const leadId =
    Number(params.id);

  const [lead, setLead] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    async function loadLead() {

      const leadData =
        await getLeadById(
          leadId
        );

      if (!leadData) {

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
        leadData.user_id !== user.id
      ) {

        setLoading(false);

        return;
      }

      setLead(
        leadData
      );

      setLoading(false);
    }

    if (leadId) {

      loadLead();

    }

  }, [leadId]);

  if (loading) {

    return (
      <main className="p-10 text-white">
        Loading...
      </main>
    );

  }

  if (!lead) {

    return (
      <main className="p-10 text-white">
        Lead not found
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
          href="/dashboard/leads"
          className="mb-6 inline-block text-cyan-400"
        >
          ← Back to My Leads
        </Link>

        <h1 className="mb-12 text-5xl font-bold">
          Lead #{lead.id}
        </h1>

        <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-8">

          <h2 className="mb-6 text-2xl font-semibold">
            Trip Request
          </h2>

          <div className="grid gap-6 md:grid-cols-2">

            <div>
              <p className="text-gray-400">
                Destination
              </p>
              <p className="text-xl">
                {lead.destination}
              </p>
            </div>

            <div>
              <p className="text-gray-400">
                Travelers
              </p>
              <p className="text-xl">
                {lead.travelers}
              </p>
            </div>

            <div>
              <p className="text-gray-400">
                Budget
              </p>
              <p className="text-xl">
                {lead.budget || "Not Specified"}
              </p>
            </div>

            <div>
              <p className="text-gray-400">
                Travel Month
              </p>
              <p className="text-xl">
                {lead.travel_month || "Flexible"}
              </p>
            </div>

          </div>

        </div>

        <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-8">

          <h2 className="mb-6 text-2xl font-semibold">
            Lead Status
          </h2>

          <div className="inline-flex rounded-full bg-cyan-400/20 px-4 py-2 text-cyan-300">
            {lead.status}
          </div>

        </div>

        <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-8">

          <h2 className="mb-6 text-2xl font-semibold">
            Lead Source
          </h2>

          <p className="text-xl">
            {lead.source || "WEBSITE"}
          </p>

        </div>

        {lead.notes && (

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">

            <h2 className="mb-6 text-2xl font-semibold">
              Notes
            </h2>

            <p className="whitespace-pre-wrap text-gray-300">
              {lead.notes}
            </p>

          </div>

        )}

      </div>

    </main>

  );
}