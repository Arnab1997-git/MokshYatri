import { supabase } from "@/lib/supabase";

export async function getPackages() {

  const { data, error } =
    await supabase
      .from("package_templates")
      .select("*")
      .eq("is_active", true)
      .order("name");

  if (error) {
    console.error(error);
    return [];
  }

  return data || [];
}