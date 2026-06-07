"use client";

import {
  useEffect,
  useState,
} from "react";

import CustomerPortalNav
  from "@/components/customer/CustomerPortalNav";

import {
  getCustomerNotifications,
} from "@/services/notificationService";

export default function NotificationsPage() {

  const [
    notifications,
    setNotifications,
  ] = useState<any[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  useEffect(() => {

    async function loadData() {

      const data =
        await getCustomerNotifications();

      setNotifications(
        data
      );

      setLoading(false);
    }

    loadData();

  }, []);

  return (

    <main className="min-h-screen bg-[#050816] px-6 py-24 text-white">

      <div className="mx-auto max-w-6xl">

        <p className="mb-3 text-sm uppercase tracking-[0.4em] text-cyan-400">
          Customer Portal
        </p>

        <CustomerPortalNav />

        <h1 className="mb-12 text-5xl font-bold">
          Notifications
        </h1>

        {loading && (

          <p>
            Loading...
          </p>

        )}

        {!loading &&
          notifications.length === 0 && (

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">

            No notifications yet.

          </div>

        )}

        <div className="space-y-4">

          {notifications.map(
            (
              item,
              index
            ) => (

              <div
                key={index}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >

                <div className="flex items-center justify-between">

                  <div>

                    <p className="font-semibold">

                      {item.title}

                    </p>

                    <p className="text-sm text-gray-400">

                      Booking #
                      {item.bookingId}

                    </p>

                  </div>

                  <div className="text-right">

                    <p
                      className={`text-sm ${
                        item.status ===
                        "completed"
                          ? "text-green-400"
                          : "text-yellow-400"
                      }`}
                    >

                      {item.status}

                    </p>

                    {item.date && (

                      <p className="text-xs text-gray-500">

                        {new Date(
                          item.date
                        ).toLocaleDateString(
                          "en-IN"
                        )}

                      </p>

                    )}

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