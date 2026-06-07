"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const handleSignup = async () => {

    const { error } =
      await supabase.auth.signUp({
        email,
        password,
      });

    if (error) {

      alert(error.message);

    } else {

      router.push("/personality");

    }

  };

  return (

    <main className="flex min-h-screen items-center justify-center bg-[#050816] px-6 text-white">

      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-10 backdrop-blur-xl">

        <h1 className="mb-8 text-center text-4xl font-bold">
          Create Account
        </h1>

        <div className="flex flex-col gap-5">

          <input
            type="email"
            placeholder="Email"
            className="rounded-full border border-white/10 bg-white/10 px-6 py-4 outline-none"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="rounded-full border border-white/10 bg-white/10 px-6 py-4 outline-none"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button
            onClick={handleSignup}
            className="rounded-full bg-white px-6 py-4 font-medium text-black transition hover:scale-105"
          >
            Sign Up
          </button>

        </div>

      </div>

    </main>

  );

}