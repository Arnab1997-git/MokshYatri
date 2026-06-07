import { supabase } from "@/lib/supabase";

export async function saveQuotation(
  quotation: any
) {

  const payload = {

    ...quotation,

    quoted_price:
      quotation.quoted_price ??
      quotation.selling_price,

  };

  const { data, error } =
    await supabase
      .from("quotations")
      .insert([payload])
      .select()
      .single();

  if (error) {

    console.error(error);

    return {
      success: false,
      message: error.message,
      data: null,
    };
  }

  return {
    success: true,
    message: "Quotation saved",
    data,
  };
}

export async function getQuotations() {

  const { data, error } =
    await supabase
      .from("quotations")
      .select(`
        *,
        package_templates (
          name
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

export async function getQuotationById(
  id: number
) {

  const { data, error } =
    await supabase
      .from("quotations")
      .select(`
        *,
        package_templates (
          name
        )
      `)
      .eq("id", id)
      .maybeSingle();

  if (error) {

    console.error(
      "Quotation Lookup Error:",
      error
    );

    return null;
  }

  return data;
}

export async function updateQuotedPrice(
  quotationId: number,
  quotedPrice: number
) {

  const { data, error } =
    await supabase
      .from("quotations")
      .update({
        quoted_price:
          quotedPrice,
      })
      .eq(
        "id",
        quotationId
      )
      .select()
      .single();

  if (error) {

    console.error(error);

    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message:
      "Quoted price updated",
    data,
  };
}

export async function deleteQuotation(
  quotationId: number
) {

  const { error } =
    await supabase
      .from("quotations")
      .delete()
      .eq(
        "id",
        quotationId
      );

  if (error) {

    console.error(error);

    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message:
      "Quotation deleted",
    };
}

export async function getQuotationsByLeadIds(
  leadIds: number[]
) {

  if (!leadIds.length) {
    return [];
  }

  const { data, error } =
    await supabase
      .from("quotations")
      .select("*")
      .in(
        "lead_id",
        leadIds
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