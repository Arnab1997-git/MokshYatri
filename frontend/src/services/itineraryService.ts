import { supabase } from "@/lib/supabase";

export async function saveItinerary(
userId: string,
destination: string,
content: string
) {
const { data, error } = await supabase
.from("itineraries")
.insert([
{
user_id: userId,
title: `${destination} Journey`,
destination,
itinerary: {
content,
},
},
]);

if (error) {
console.error(error);
throw error;
}

return data;
}
