import { supabase } from "@/lib/supabase";

export async function calculatePackagePricing(
packageId: number,
travelerCount: number,
vehicleCategoryId: number
) {
try {
console.log("================================");
console.log("PACKAGE ID", packageId);
console.log("TRAVELERS", travelerCount);
console.log("VEHICLE", vehicleCategoryId);
console.log("================================");


// ----------------------------------
// PACKAGE
// ----------------------------------

const packageResponse = await supabase
  .from("package_templates")
  .select("*")
  .eq("id", packageId);

console.log(
  "PACKAGE RESPONSE",
  packageResponse
);

const packageData =
  packageResponse.data?.[0];

if (!packageData) {
  throw new Error(
    "Package not found"
  );
}

// ----------------------------------
// PACKAGE DAYS
// ----------------------------------

const packageDaysResponse =
  await supabase
    .from("package_days")
    .select("*");

console.log(
  "ALL PACKAGE DAYS",
  packageDaysResponse
);

const packageDays =
  packageDaysResponse.data?.filter(
    (d) => d.package_id === packageId
  );

console.log(
  "FILTERED PACKAGE DAYS",
  packageDays
);

if (
  !packageDays ||
  packageDays.length === 0
) {
  throw new Error(
    "Package days not found"
  );
}

let hotelB2B = 0;
let hotelB2C = 0;

// ----------------------------------
// HOTEL COSTS V2
// ----------------------------------

for (const day of packageDays) {

  // -----------------------------
  // Rate Group
  // -----------------------------

  const rateResponse =
    await supabase
      .from("hotel_rate_groups")
      .select("*")
      .eq(
        "location_id",
        day.location_id
      )
      .eq(
        "category_id",
        packageData.category_id
      );

  const rate =
    rateResponse.data?.[0];

  if (!rate) {
    console.warn(
      "NO RATE FOUND",
      day.location_id
    );
    continue;
  }

  // -----------------------------
  // Hotel Details
  // -----------------------------

  const hotelResponse =
    await supabase
      .from("hotels")
      .select(`
        *,
        hotel_category_mapping!inner(
          category_id
        )
      `)
      .eq(
        "location_id",
        day.location_id
      );

  const matchingHotel =
    hotelResponse.data?.find(
      (hotel: any) =>
        hotel.hotel_category_mapping?.some(
          (mapping: any) =>
            mapping.category_id ===
            packageData.category_id
        )
    );

  if (!matchingHotel) {
    console.warn(
      "NO HOTEL FOUND",
      day.location_id
    );
    continue;
  }

  const nights =
    day.nights || 1;

  // -----------------------------
  // PER PERSON
  // -----------------------------

  if (
    matchingHotel.pricing_type ===
    "PER_PERSON"
  ) {

    hotelB2B +=
      Number(rate.b2b_rate) *
      travelerCount *
      nights;

    hotelB2C +=
      Number(rate.rate_per_person) *
      travelerCount *
      nights;
  }

  // -----------------------------
  // PER ROOM
  // -----------------------------

  else if (
    matchingHotel.pricing_type ===
    "PER_ROOM"
  ) {

    const roomsNeeded =
      Math.ceil(
        travelerCount /
        (matchingHotel.max_occupancy || 2)
      );

    hotelB2B +=
      Number(rate.b2b_rate) *
      roomsNeeded *
      nights;

    hotelB2C +=
      Number(rate.rate_per_person) *
      roomsNeeded *
      nights;
  }

  console.log(
    "HOTEL CALCULATION",
    {
      location:
        day.location_id,

      pricingType:
        matchingHotel.pricing_type,

      travelers:
        travelerCount,

      occupancy:
        matchingHotel.max_occupancy,
    }
  );
}

// ----------------------------------
// VEHICLE
// ----------------------------------

const vehicleResponse =
  await supabase
    .from("vehicle_categories")
    .select("*")
    .eq(
      "id",
      vehicleCategoryId
    );

console.log(
  "VEHICLE RESPONSE",
  vehicleResponse
);

const vehicleCategory =
  vehicleResponse.data?.[0];

if (!vehicleCategory) {
  throw new Error(
    "Vehicle category not found"
  );
}

const tripDays =
  packageData.duration_days || 1;

const vehicleB2B =
  Number(
    vehicleCategory.b2b_rate
  ) * tripDays;

const vehicleB2C =
  (
    Number(
      vehicleCategory.b2b_rate
    ) +
    Number(
      vehicleCategory.markup
    )
  ) * tripDays;

const totalCost =
  hotelB2B + vehicleB2B;

const sellingPrice =
  hotelB2C + vehicleB2C;

const profit =
  sellingPrice - totalCost;

const result = {
  packageName:
    packageData.name,

  travelerCount,

  hotelB2B,
  hotelB2C,

  vehicleB2B,
  vehicleB2C,

  totalCost,
  sellingPrice,

  profit,
};

console.log(
  "FINAL RESULT",
  result
);

return result;


} catch (error) {
console.error(
"PRICING ENGINE ERROR",
error
);


return null;


}
}
