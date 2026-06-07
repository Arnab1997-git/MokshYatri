"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

export default function DashboardLayout({
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

    async function verifyUser() {

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {

        router.push("/login");

        return;
      }

      setAuthorized(true);
      setLoading(false);

    }

    verifyUser();

  }, [router]);

  if (loading) {

    return (

      <main className="flex min-h-screen items-center justify-center bg-[#050816] text-white">

        Loading...

      </main>

    );

  }

  if (!authorized) {
    return null;
  }

  return <>{children}</>;

}
