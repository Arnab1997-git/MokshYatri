"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  getCustomers,
} from "@/services/customer360Service";

export default function CustomersPage() {

  const [customers, setCustomers] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    async function loadData() {

      const data =
        await getCustomers();

      setCustomers(
        data
      );

      setLoading(false);

    }

    loadData();

  }, []);

  return (

    <main className="p-10 text-white">

      <div className="mb-10">

        <p className="mb-2 text-sm uppercase tracking-[0.4em] text-cyan-400">
          CRM
        </p>

        <h1 className="text-5xl font-bold">
          Customers
        </h1>

      </div>

      {loading && (

        <p className="text-gray-400">
          Loading customers...
        </p>

      )}

      {!loading &&
        customers.length === 0 && (

        <div className="rounded-3xl border border-white/10 bg-white/5 p-10">

          No customers found.

        </div>

      )}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

        {customers.map(
          (customer) => (

            <div
              key={customer.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >

              <h2 className="mb-2 text-2xl font-semibold">

                {
                  customer.full_name ||
                  customer.username ||
                  "Customer"
                }

              </h2>

              <p className="mb-4 text-gray-400">

                {
                  customer.travel_style ||
                  "-"
                }

                {" • "}

                {
                  customer.travel_personality ||
                  "-"
                }

              </p>

              <div className="mb-6 space-y-2 text-sm text-gray-400">

                <p>

                  Username:
                  {" "}
                  {
                    customer.username ||
                    "-"
                  }

                </p>

                <p>

                  Home City:
                  {" "}
                  {
                    customer.home_city ||
                    "-"
                  }

                </p>

              </div>

              <Link
                href={`/admin/customers/${customer.id}`}
                className="inline-flex rounded-xl bg-cyan-500 px-4 py-2 font-medium text-black"
              >
                View Customer
              </Link>

            </div>

          )
        )}

      </div>

    </main>

  );
}