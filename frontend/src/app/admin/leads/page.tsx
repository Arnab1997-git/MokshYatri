"use client";

import Link from "next/link";

import { useEffect, useState } from "react";

import {
  getDestinations,
} from "@/services/destinationService";

import {
  createLead,
  getLeads,
  updateLeadStatus,
} from "@/services/leadService";

const statuses = [
  "NEW",
  "CONTACTED",
  "FOLLOW_UP",
  "QUOTED",
  "CONVERTED",
  "BOOKED",
  "LOST",
];

export default function LeadsPage() {

  const [leads, setLeads] =
    useState<any[]>([]);

  const [destinations, setDestinations] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [customerName, setCustomerName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [destinationId, setDestinationId] =
    useState("");

  const [budget, setBudget] =
    useState("");

  const [travelMonth, setTravelMonth] =
    useState("");

  const [travelers, setTravelers] =
    useState("");

  const [notes, setNotes] =
    useState("");

  async function loadData() {

    const leadsData =
      await getLeads();

    const destinationsData =
      await getDestinations();

    setLeads(leadsData);

    setDestinations(
      destinationsData
    );

    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleCreateLead() {

    if (
      !customerName ||
      !destinationId
    ) {
      return;
    }

    await createLead({

      customer_name:
        customerName,

      phone,

      destination_id:
        Number(destinationId),

      budget:
        budget
          ? Number(budget)
          : null,

      travel_month:
        travelMonth,

      travelers:
        travelers
          ? Number(travelers)
          : null,

      notes,

      status: "NEW",
    });

    setCustomerName("");
    setPhone("");
    setDestinationId("");
    setBudget("");
    setTravelMonth("");
    setTravelers("");
    setNotes("");

    loadData();
  }

  async function handleStatusChange(
    leadId: number,
    status: string
  ) {

    await updateLeadStatus(
      leadId,
      status
    );

    loadData();
  }

  const filteredLeads =
    leads.filter((lead) => {

      const customer =
        lead.customer_name
          ?.toLowerCase() || "";

      const phoneNo =
        lead.phone
          ?.toLowerCase() || "";

      const query =
        search.toLowerCase();

      return (
        customer.includes(query) ||
        phoneNo.includes(query)
      );
    });

  return (

    <main className="p-10 text-white">

      <div className="mb-10">

        <p className="mb-2 text-sm uppercase tracking-[0.4em] text-cyan-400">
          CRM
        </p>

        <h1 className="text-5xl font-bold">
          Lead Management
        </h1>

      </div>

      {/* CREATE LEAD */}

      <div className="mb-10 rounded-3xl border border-white/10 bg-white/5 p-6">

        <h2 className="mb-6 text-2xl font-semibold">
          Create Lead
        </h2>

        <div className="grid gap-4 md:grid-cols-2">

          <input
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) =>
              setCustomerName(
                e.target.value
              )
            }
            className="rounded-xl bg-black/20 p-3"
          />

          <input
            placeholder="Phone"
            value={phone}
            onChange={(e) =>
              setPhone(
                e.target.value
              )
            }
            className="rounded-xl bg-black/20 p-3"
          />

          <select
            value={destinationId}
            onChange={(e) =>
              setDestinationId(
                e.target.value
              )
            }
            className="rounded-xl bg-black/20 p-3"
          >

            <option value="">
              Select Destination
            </option>

            {destinations.map(
              (destination) => (

                <option
                  key={destination.id}
                  value={destination.id}
                >
                  {destination.title}
                </option>

              )
            )}

          </select>

          <input
            placeholder="Budget"
            value={budget}
            onChange={(e) =>
              setBudget(
                e.target.value
              )
            }
            className="rounded-xl bg-black/20 p-3"
          />

          <input
            placeholder="Travel Month"
            value={travelMonth}
            onChange={(e) =>
              setTravelMonth(
                e.target.value
              )
            }
            className="rounded-xl bg-black/20 p-3"
          />

          <input
            placeholder="Travelers"
            value={travelers}
            onChange={(e) =>
              setTravelers(
                e.target.value
              )
            }
            className="rounded-xl bg-black/20 p-3"
          />

        </div>

        <textarea
          placeholder="Notes"
          value={notes}
          onChange={(e) =>
            setNotes(
              e.target.value
            )
          }
          className="mt-4 h-24 w-full rounded-xl bg-black/20 p-3"
        />

        <button
          onClick={handleCreateLead}
          className="mt-6 rounded-full bg-cyan-400 px-6 py-3 font-semibold text-black"
        >
          Create Lead
        </button>

      </div>

      {/* SEARCH */}

      <div className="mb-6">

        <input
          placeholder="Search by customer or phone..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="w-full rounded-xl bg-white/5 p-4"
        />

      </div>

      {/* LEADS */}

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

        <h2 className="mb-6 text-2xl font-semibold">
          Leads
        </h2>

        {loading ? (

          <p>Loading...</p>

        ) : (

          <div className="space-y-4">

            {filteredLeads.map(
              (lead) => (

                <div
                  key={lead.id}
                  className="rounded-2xl border border-white/10 p-5"
                >

                  <div className="grid gap-4 md:grid-cols-7">

                    <div>
                      <p className="text-gray-400">
                        Customer
                      </p>

                      <p>
                        {lead.customer_name}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-400">
                        Phone
                      </p>

                      <p>
                        {lead.phone}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-400">
                        Destination
                      </p>

                      <p>
                        {
                          lead.destinations?.title ||
                          lead.destination ||
                          "-"
                        }
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-400">
                        Budget
                      </p>

                      <p>
                        ₹{lead.budget}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-400">
                        Travelers
                      </p>

                      <p>
                        {lead.travelers}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-400">
                        Status
                      </p>

                      <select
                        value={lead.status}
                        onChange={(e) =>
                          handleStatusChange(
                            lead.id,
                            e.target.value
                          )
                        }
                        className="rounded-lg bg-black/30 p-2"
                      >

                        {statuses.map(
                          (status) => (

                            <option
                              key={status}
                              value={status}
                            >
                              {status}
                            </option>

                          )
                        )}

                      </select>

                    </div>

                    <div>
                      <p className="text-gray-400">
                        Created
                      </p>

                      <p>
                        {new Date(
                          lead.created_at
                        ).toLocaleDateString()}
                      </p>
                    </div>

                  </div>

                  <div className="mt-5 flex gap-3">

                    <Link
                      href={`/admin/quotation-engine?leadId=${lead.id}`}
                      className="rounded-full bg-cyan-400 px-4 py-2 font-semibold text-black"
                    >
                      Generate Quote
                    </Link>

                    {lead.quotation_id && (

                      <Link
                        href={`/admin/quotations/${lead.quotation_id}`}
                        className="rounded-full border border-cyan-400 px-4 py-2 text-cyan-400"
                      >
                        View Quote
                      </Link>

                    )}

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </main>
  );
}