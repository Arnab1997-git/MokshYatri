"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

const menuItems = [

  {
    title: "Dashboard",
    href: "/admin",
  },

  {
    title: "Create Quote",
    href: "/admin/quotation-engine",
  },

  {
    title: "Quotations",
    href: "/admin/quotations",
  },

  {
    title: "Leads",
    href: "/admin/leads",
  },

  {
    title: "Bookings",
    href: "/admin/bookings",
  },

  {
    title: "Customers",
    href: "/admin/customers",
  },

  {
    title: "Activity",
    href: "/admin/activity",
  },

  {
    title: "Payments",
    href: "/admin/payments",
  },

  {
    title: "Hotel Allocation",
    href: "/admin/hotel-allocations",
  },

  {
    title: "Vehicle Allocation",
    href: "/admin/vehicle-allocations",
  },

  {
    title: "Reviews",
    href: "/admin/reviews",
  }

];
async function handleLogout() {

  await supabase.auth.signOut();

  window.location.href = "/";

}
export default function Sidebar() {

  const pathname =
    usePathname();

  return (

    <aside className="flex h-screen w-64 flex-col border-r border-white/10 bg-[#0B1023] p-6 text-white">

      <h2 className="mb-10 text-2xl font-bold text-cyan-400">
        Moksh Yatri
      </h2>

      <nav className="space-y-3">

        {menuItems.map((item) => {

          const active =
            pathname === item.href;

          return (

            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-xl px-4 py-3 transition ${
                active
                  ? "bg-cyan-400 text-black font-semibold"
                  : "hover:bg-white/10"
              }`}
            >
              {item.title}
            </Link>

          );
        })}

      </nav>

      <div className="mt-auto space-y-3 pt-10">

        <div className="border-t border-white/10 pt-6">

          <Link
            href="/dashboard"
            className="block rounded-xl px-4 py-3 transition hover:bg-white/10"
          >
            Customer Portal
          </Link>

          <Link
            href="/"
            className="block rounded-xl px-4 py-3 transition hover:bg-white/10"
          >
            Main Website
          </Link>

          <button
            onClick={handleLogout}
            className="block w-full rounded-xl px-4 py-3 text-left transition hover:bg-white/10"
          >
            Logout
          </button>

        </div>

      </div>

    </aside>
  );
}