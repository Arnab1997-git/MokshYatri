"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

const links = [
  {
    label: "My Profile",
    href: "/dashboard/profile",
  },
  {
    href: "/dashboard",
    label: "My Journeys",
  },
  {
    href: "/dashboard/bookmarks",
    label: "Saved Gems",
  },
  {
    href: "/dashboard/leads",
    label: "My Leads",
  },
  {
    href: "/dashboard/quotations",
    label: "My Quotations",
  },
  {
    href: "/dashboard/bookings",
    label: "My Bookings",
  },
  {
  label:
      "Notifications",

    href:
      "/dashboard/notifications",
  },
  {
    label: "AI Advisor",
    href: "/dashboard/ai-advisor",
  },

  {
    href: "/recommendations",
    label: "Recommendations",
  },
  {
    href: "/",
    label: "Main Website",
  }
];

async function handleLogout() {

  await supabase.auth.signOut();

  window.location.href = "/";

}

export default function CustomerPortalNav() {
  const pathname = usePathname();

  return (
    <div className="mb-10 flex flex-wrap gap-3">
      {links.map((link) => {
        const active =
          pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-full px-5 py-2 text-sm font-medium transition ${
              active
                ? "bg-cyan-400 text-black"
                : "border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400/20"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
      <button
        onClick={handleLogout}
        className="rounded-full border border-red-400/30 bg-red-400/10 px-5 py-2 text-sm font-medium text-red-300 transition hover:bg-red-400/20"
      >
        Logout
      </button>
    </div>
  );
}