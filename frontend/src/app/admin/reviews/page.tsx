"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  getAllReviews,
  toggleFeaturedReview,
} from "@/services/reviewService";

export default function ReviewsPage() {

  const [reviews, setReviews] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  async function loadReviews() {

    const data =
      await getAllReviews();

    setReviews(
      data
    );

    setLoading(false);
  }

  async function handleFeatureToggle(
    reviewId: number,
    featured: boolean
  ) {

    const success =
      await toggleFeaturedReview(
        reviewId,
        !featured
      );

    if (success) {

      await loadReviews();

    }

  }

  useEffect(() => {

    loadReviews();

  }, []);

  return (

    <main className="min-h-screen p-10 text-white">

      <div className="mb-10">

        <p className="mb-2 text-sm uppercase tracking-[0.4em] text-cyan-400">
          Reputation Center
        </p>

        <h1 className="text-5xl font-bold">
          Customer Reviews
        </h1>

      </div>

      {loading && (

        <p>
          Loading reviews...
        </p>

      )}

      <div className="space-y-6">

        {reviews.map(
          (review) => (

            <div
              key={review.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >

              <div className="mb-4 flex items-center justify-between">

                <div>

                  <p className="text-2xl">

                    {"⭐".repeat(
                      review.rating
                    )}

                  </p>

                  <p className="mt-2 text-gray-400">

                    Booking #
                    {review.booking_id}

                  </p>

                  <p className="text-gray-400">

                    {
                      review.bookings
                        ?.customer_name
                    }

                  </p>

                </div>

                <div>

                  <span
                    className={`rounded-full px-4 py-2 text-sm ${
                      review.is_featured
                        ? "bg-green-500/20 text-green-400"
                        : "bg-gray-500/20 text-gray-400"
                    }`}
                  >

                    {review.is_featured
                      ? "FEATURED"
                      : "NORMAL"}

                  </span>

                </div>

              </div>

              <p className="mb-6">

                {review.review_text}

              </p>

              <button
                onClick={() =>
                  handleFeatureToggle(
                    review.id,
                    review.is_featured
                  )
                }
                className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-black"
              >

                {review.is_featured
                  ? "Remove Featured"
                  : "Feature Review"}

              </button>

            </div>

          )
        )}

      </div>

    </main>

  );
}