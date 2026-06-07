import { supabase } from "@/lib/supabase";

export async function createReview(
  review: {
    booking_id: number;
    user_id: string;
    rating: number;
    review_text: string;
  }
) {

  const { data, error } =
    await supabase
      .from("reviews")
      .insert([review])
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
    data,
  };
}

export async function getReviewByBooking(
  bookingId: number
) {

  const { data, error } =
    await supabase
      .from("reviews")
      .select("*")
      .eq(
        "booking_id",
        bookingId
      )
      .maybeSingle();

  if (error) {

    console.error(error);

    return null;
  }

  return data;
}

export async function getMyReviews(
  userId: string
) {

  const { data, error } =
    await supabase
      .from("reviews")
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

export async function getFeaturedReviews() {

  const { data, error } =
    await supabase
      .from("reviews")
      .select(`
        *,
        bookings (
          customer_name
        )
      `)
      .eq(
        "is_featured",
        true
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

export async function toggleFeaturedReview(
  reviewId: number,
  featured: boolean
) {

  const { error } =
    await supabase
      .from("reviews")
      .update({
        is_featured:
          featured,
      })
      .eq(
        "id",
        reviewId
      );

  if (error) {

    console.error(error);

    return false;
  }

  return true;
}

export async function getAllReviews() {

  const { data, error } =
    await supabase
      .from("reviews")
      .select("*")
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