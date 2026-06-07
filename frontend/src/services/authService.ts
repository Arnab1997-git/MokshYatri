import { supabase } from "@/lib/supabase";

export async function getCurrentProfile() {

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return data;
}

export async function isAdmin() {

  const profile =
    await getCurrentProfile();

  return (
    profile?.role ===
    "ADMIN"
  );
}