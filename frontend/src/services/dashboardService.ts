import { supabase } from "@/lib/supabase";

export async function getDashboardStats() {

  try {

    const [
      leadsResult,
      quotationsResult,
      bookingsResult,
    ] = await Promise.all([

      supabase
        .from("leads")
        .select("*", {
          count: "exact",
          head: true,
        }),

      supabase
        .from("quotations")
        .select("*", {
          count: "exact",
          head: true,
        }),

      supabase
        .from("bookings")
        .select("*", {
          count: "exact",
          head: true,
        }),

    ]);

    const totalLeads =
      leadsResult.count || 0;

    const totalQuotations =
      quotationsResult.count || 0;

    const totalBookings =
      bookingsResult.count || 0;

    const { data: leadSources } =
      await supabase
        .from("leads")
        .select("source");

    const websiteLeads =
      leadSources?.filter(
        (lead) =>
          lead.source ===
          "WEBSITE"
      ).length || 0;

    const recommendationLeads =
      leadSources?.filter(
        (lead) =>
          lead.source ===
          "RECOMMENDATION"
      ).length || 0;

    const hiddenGemLeads =
      leadSources?.filter(
        (lead) =>
          lead.source ===
          "HIDDEN_GEM"
      ).length || 0;

    const dreamTripLeads =
      leadSources?.filter(
        (lead) =>
          lead.source ===
          "DREAM_TRIP"
      ).length || 0;

    const { data: quotationData } =
      await supabase
        .from("quotations")
        .select(`
          selling_price,
          profit
        `);

    const totalRevenue =
      quotationData?.reduce(
        (
          sum,
          quotation
        ) =>
          sum +
          Number(
            quotation.selling_price || 0
          ),
        0
      ) || 0;

    const totalProfit =
      quotationData?.reduce(
        (
          sum,
          quotation
        ) =>
          sum +
          Number(
            quotation.profit || 0
          ),
        0
      ) || 0;

    const { data: bookings } =
      await supabase
        .from("bookings")
        .select(`
          id,
          balance_due
        `);

    const outstandingBalance =
      bookings?.reduce(
        (
          sum,
          booking
        ) =>
          sum +
          Number(
            booking.balance_due || 0
          ),
        0
      ) || 0;

    let tripsReady = 0;

    if (bookings?.length) {

      for (const booking of bookings) {

        const balanceClear =
          Number(
            booking.balance_due || 0
          ) <= 0;

        const [
          hotelResult,
          vehicleResult,
        ] = await Promise.all([

          supabase
            .from("hotel_allocations")
            .select("id")
            .eq(
              "booking_id",
              booking.id
            )
            .maybeSingle(),

          supabase
            .from("vehicle_allocations")
            .select("id")
            .eq(
              "booking_id",
              booking.id
            )
            .maybeSingle(),

        ]);

        const hotelAssigned =
          !!hotelResult.data;

        const vehicleAssigned =
          !!vehicleResult.data;

        if (
          balanceClear &&
          hotelAssigned &&
          vehicleAssigned
        ) {

          tripsReady++;

        }

      }

    }

    const leadToQuotePercent =
      totalLeads > 0
        ? (
            (
              totalQuotations /
              totalLeads
            ) * 100
          ).toFixed(1)
        : "0";

    const quoteToBookingPercent =
      totalQuotations > 0
        ? (
            (
              totalBookings /
              totalQuotations
            ) * 100
          ).toFixed(1)
        : "0";

    return {

      totalLeads,

      totalQuotations,

      totalBookings,

      totalRevenue,

      totalProfit,

      outstandingBalance,

      leadToQuotePercent,

      quoteToBookingPercent,

      tripsReady,

      websiteLeads,

      recommendationLeads,

      hiddenGemLeads,

      dreamTripLeads,

    };

  } catch (error) {

    console.error(error);

    return null;
  }
}

export async function getUserItineraries(
  userId: string
) {

  const { data, error } =
    await supabase
      .from("itineraries")
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