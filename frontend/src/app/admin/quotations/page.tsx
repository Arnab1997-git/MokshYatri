"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  getQuotations,
} from "@/services/quotationService";

export default function QuotationsPage() {

  const [quotations, setQuotations] =
    useState<any[]>([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    async function loadQuotations() {

      const data =
        await getQuotations();

      setQuotations(data);

      setLoading(false);
    }

    loadQuotations();

  }, []);

  const filteredQuotations =
    quotations.filter((quotation) =>
      quotation.customer_name
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  return (
    <main className="min-h-screen bg-[#050816] px-6 py-24 text-white">

      <div className="mx-auto max-w-7xl">

        <div className="mb-12 text-center">

          <p className="mb-4 text-sm uppercase tracking-[0.4em] text-cyan-400">
            Business Dashboard
          </p>

          <h1 className="text-5xl font-bold">
            Quotation History
          </h1>

        </div>

        <div className="mb-8">

          <input
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            placeholder="Search customer..."
            className="w-full rounded-2xl border border-white/10 bg-white/5 p-4"
          />

        </div>

        {loading && (

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
            Loading quotations...
          </div>

        )}

        {!loading &&
          filteredQuotations.length === 0 && (

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">

            <h2 className="mb-3 text-2xl font-semibold">
              No quotations found
            </h2>

            <p className="text-gray-400">
              Generate and save quotations
              to see them here.
            </p>

          </div>

        )}

        <div className="grid gap-6">

          {filteredQuotations.map(
            (quotation) => (

            <div
              key={quotation.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >

              <div className="grid gap-6 md:grid-cols-5">

                <div>

                  <p className="text-sm text-gray-400">
                    Customer
                  </p>

                  <p className="font-semibold">
                    {quotation.customer_name}
                  </p>

                </div>

                <div>

                  <p className="text-sm text-gray-400">
                    Phone
                  </p>

                  <p>
                    {quotation.customer_phone}
                  </p>

                </div>

                <div>

                  <p className="text-sm text-gray-400">
                    Package
                  </p>

                  <p>
                    {
                      quotation
                        .package_templates
                        ?.name
                    }
                  </p>

                </div>

                <div>

                  <p className="text-sm text-gray-400">
                    Selling Price
                  </p>

                  <p className="font-semibold text-cyan-400">
                    ₹
                    {quotation.selling_price}
                  </p>

                </div>

                <div>

                  <p className="text-sm text-gray-400">
                    Profit
                  </p>

                  <p className="font-semibold text-green-400">
                    ₹
                    {quotation.profit}
                  </p>

                </div>

              </div>

              <div className="mt-4 border-t border-white/10 pt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div className="text-sm text-gray-400">

                  Created:

                  {" "}

                  {new Date(
                    quotation.created_at
                  ).toLocaleString()}

                </div>

                <div>

                  <Link
                    href={`/admin/quotations/${quotation.id}`}
                    className="rounded-full bg-cyan-400 px-5 py-2 font-semibold text-black transition hover:opacity-90"
                  >
                    View Quote
                  </Link>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </main>
  );
}