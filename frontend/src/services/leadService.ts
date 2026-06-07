import { supabase } from "@/lib/supabase";

export async function createLead(
  lead: any
) {

  const { data, error } =
    await supabase
      .from("leads")
      .insert([lead])
      .select()
      .single();

  if (error) {

    console.error(
      "Create Lead Error:",
      JSON.stringify(error, null, 2)
    );

    return {
      success: false,
      message:
        error.message ||
        "Unknown error",
    };
  }

  return {
    success: true,
    data,
  };
}

export async function getLeads() {

  const { data, error } =
    await supabase
      .from("leads")
      .select(`
        *,
        destinations (
          id,
          title
        )
      `)
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

  if (error) {

    console.error(error);

    return [];
  }

  return data || [];
}

export async function updateLeadStatus(
  leadId: number,
  status: string
) {

  const { error } =
    await supabase
      .from("leads")
      .update({
        status,
      })
      .eq(
        "id",
        leadId
      );

  if (error) {

    console.error(error);

    return {
      success: false,
    };
  }

  return {
    success: true,
  };
}

export async function getLeadById(
  id: number | null | undefined
) {

  if (!id) {
    return null;
  }

  const { data, error } =
    await supabase
      .from("leads")
      .select(`
        *,
        destinations (
          id,
          title
        )
      `)
      .eq("id", id)
      .maybeSingle();

  if (error) {

    console.error(
      "Lead Lookup Error:",
      error
    );

    return null;
  }

  return data;
}

export async function linkQuotationToLead(
  leadId: number,
  quotationId: number
) {

  const { error } =
    await supabase
      .from("leads")
      .update({
        quotation_id: quotationId,
        status: "QUOTED",
      })
      .eq("id", leadId);

  if (error) {

    console.error(error);

    return {
      success: false,
    };
  }

  return {
    success: true,
  };
}
export async function markLeadAsBooked(
  leadId: number
) {

  const { error } =
    await supabase
      .from("leads")
      .update({
        status: "BOOKED",
      })
      .eq(
        "id",
        leadId
      );

  if (error) {

    console.error(error);

    return {
      success: false,
    };
  }

  return {
    success: true,
  };
}

export async function getUserLeads(
  userId: string
) {

  const { data, error } =
    await supabase
      .from("leads")
      .select("*")
      .eq(
        "user_id",
        userId
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

  if (error) {

    console.error(error);

    return [];
  }

  return data || [];
}