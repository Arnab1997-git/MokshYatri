"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/admin/Sidebar";

import {
  isAdmin,
} from "@/services/authService";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const router =
    useRouter();

  const [loading, setLoading] =
    useState(true);

  const [authorized, setAuthorized] =
    useState(false);

  useEffect(() => {

    async function verifyAdmin() {

      const admin =
        await isAdmin();

      if (!admin) {

        router.push("/login");

        return;
      }

      setAuthorized(true);
      setLoading(false);
    }

    verifyAdmin();

  }, [router]);

  if (loading) {

    return (

      <main className="flex min-h-screen items-center justify-center bg-[#050816] text-white">

        Checking permissions...

      </main>

    );
  }

  if (!authorized) {
    return null;
  }

  return (

    <div className="flex min-h-screen bg-[#050816]">

      <Sidebar />

      <main className="flex-1 overflow-auto">
        {children}
      </main>

    </div>

  );
}