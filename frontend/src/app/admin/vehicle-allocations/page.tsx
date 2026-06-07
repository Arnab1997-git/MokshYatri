"use client";

import { useEffect, useState } from "react";

import {
  getBookings,
} from "@/services/bookingService";

import {
  getVehicles,
} from "@/services/vehicleService";

import {
  createVehicleAllocation,
  getVehicleAllocations,
} from "@/services/vehicleAllocationService";

export default function VehicleAllocationsPage() {

  const [bookings, setBookings] =
    useState<any[]>([]);

  const [vehicles, setVehicles] =
    useState<any[]>([]);

  const [allocations, setAllocations] =
    useState<any[]>([]);

  const [bookingId, setBookingId] =
    useState("");

  const [vehicleId, setVehicleId] =
    useState("");

  const [driverName, setDriverName] =
    useState("");

  const [driverPhone, setDriverPhone] =
    useState("");

  const [vehicleNumber, setVehicleNumber] =
    useState("");

  const [pickupDate, setPickupDate] =
    useState("");

  const [notes, setNotes] =
    useState("");

  async function loadData() {

    const [
      bookingData,
      vehicleData,
      allocationData,
    ] = await Promise.all([

      getBookings(),

      getVehicles(),

      getVehicleAllocations(),

    ]);

    setBookings(
      bookingData
    );

    setVehicles(
      vehicleData
    );

    setAllocations(
      allocationData
    );
  }

  useEffect(() => {

    loadData();

  }, []);

  async function handleCreateAllocation() {

    if (
      !bookingId ||
      !vehicleId
    ) {

      alert(
        "Select booking and vehicle"
      );

      return;
    }

    const result =
      await createVehicleAllocation({

        booking_id:
          Number(
            bookingId
          ),

        vehicle_id:
          Number(
            vehicleId
          ),

        driver_name:
          driverName,

        driver_phone:
          driverPhone,

        vehicle_number:
          vehicleNumber,

        pickup_date:
          pickupDate,

        notes,
      });

    if (!result.success) {

      alert(
        result.message
      );

      return;
    }

    alert(
      "Vehicle allocated successfully"
    );

    setBookingId("");
    setVehicleId("");
    setDriverName("");
    setDriverPhone("");
    setVehicleNumber("");
    setPickupDate("");
    setNotes("");

    loadData();
  }

  return (

    <main className="p-10 text-white">

      <div className="mb-10">

        <p className="mb-2 text-sm uppercase tracking-[0.4em] text-cyan-400">
          Operations
        </p>

        <h1 className="text-5xl font-bold">
          Vehicle Allocations
        </h1>

      </div>

      <div className="mb-10 rounded-3xl border border-white/10 bg-white/5 p-6">

        <h2 className="mb-6 text-2xl font-semibold">
          Assign Vehicle
        </h2>

        <div className="grid gap-4 md:grid-cols-2">

          <select
            value={bookingId}
            onChange={(e) =>
              setBookingId(
                e.target.value
              )
            }
            className="rounded-xl bg-black/20 p-3"
          >

            <option value="">
              Select Booking
            </option>

            {bookings.map(
              (booking) => (

                <option
                  key={booking.id}
                  value={booking.id}
                >
                  #{booking.id}
                  {" - "}
                  {booking.customer_name}
                </option>

              )
            )}

          </select>

          <select
            value={vehicleId}
            onChange={(e) =>
              setVehicleId(
                e.target.value
              )
            }
            className="rounded-xl bg-black/20 p-3"
          >

            <option value="">
              Select Vehicle
            </option>

            {vehicles.map(
              (vehicle) => (

                <option
                  key={vehicle.id}
                  value={vehicle.id}
                >
                  {vehicle.name}
                </option>

              )
            )}

          </select>

          <input
            placeholder="Driver Name"
            value={driverName}
            onChange={(e) =>
              setDriverName(
                e.target.value
              )
            }
            className="rounded-xl bg-black/20 p-3"
          />

          <input
            placeholder="Driver Phone"
            value={driverPhone}
            onChange={(e) =>
              setDriverPhone(
                e.target.value
              )
            }
            className="rounded-xl bg-black/20 p-3"
          />

          <input
            placeholder="Vehicle Number"
            value={vehicleNumber}
            onChange={(e) =>
              setVehicleNumber(
                e.target.value
              )
            }
            className="rounded-xl bg-black/20 p-3"
          />

          <input
            type="date"
            value={pickupDate}
            onChange={(e) =>
              setPickupDate(
                e.target.value
              )
            }
            className="rounded-xl bg-black/20 p-3"
          />

        </div>

        <textarea
          value={notes}
          onChange={(e) =>
            setNotes(
              e.target.value
            )
          }
          placeholder="Notes"
          className="mt-4 h-24 w-full rounded-xl bg-black/20 p-3"
        />

        <button
          onClick={
            handleCreateAllocation
          }
          className="mt-6 rounded-full bg-cyan-400 px-6 py-3 font-semibold text-black"
        >
          Assign Vehicle
        </button>

      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

        <h2 className="mb-6 text-2xl font-semibold">
          Allocation History
        </h2>

        <div className="space-y-4">

          {allocations.map(
            (allocation) => (

              <div
                key={allocation.id}
                className="rounded-2xl border border-white/10 p-5"
              >

                <div className="grid gap-4 md:grid-cols-6">

                  <div>
                    <p className="text-gray-400">
                      Customer
                    </p>
                    <p>
                      {
                        allocation.bookings
                          ?.customer_name
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400">
                      Vehicle
                    </p>
                    <p>
                      {
                        allocation.vehicles
                          ?.name
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400">
                      Driver
                    </p>
                    <p>
                      {
                        allocation.driver_name
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400">
                      Phone
                    </p>
                    <p>
                      {
                        allocation.driver_phone
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400">
                      Vehicle No
                    </p>
                    <p>
                      {
                        allocation.vehicle_number
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400">
                      Pickup
                    </p>
                    <p>
                      {
                        allocation.pickup_date
                      }
                    </p>
                  </div>

                </div>

              </div>

            )
          )}

        </div>

      </div>

    </main>
  );
}