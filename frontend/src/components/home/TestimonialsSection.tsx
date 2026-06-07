"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  getFeaturedReviews,
} from "@/services/reviewService";

export default function TestimonialsSection() {

  const [reviews, setReviews] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    async function loadReviews() {

      const data =
        await getFeaturedReviews();

      setReviews(data);

      setLoading(false);

    }

    loadReviews();

  }, []);

  if (
    !loading &&
    reviews.length === 0
  ) {
    return null;
  }

  return (

    <section className="px-6 py-24">

      <div className="mx-auto max-w-7xl">

        <div className="mb-12 text-center">

          <p className="mb-3 text-sm uppercase tracking-[0.4em] text-cyan-400">
            Testimonials
          </p>

          <h2 className="text-5xl font-bold text-white">
            What Our Travelers Say
          </h2>

        </div>

        {loading && (

          <p className="text-center text-gray-400">
            Loading reviews...
          </p>

        )}

        <div className="grid gap-6 md:grid-cols-3">

          {reviews.map(
            (review) => (

              <div
                key={review.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-8"
              >

                <div className="mb-4 text-2xl">

                  {"⭐".repeat(
                    review.rating
                  )}

                </div>

                <p className="mb-6 text-gray-300">

                  "{review.review_text}"

                </p>

                <div>

                  <p className="font-semibold text-white">

                    {
                      review.bookings
                        ?.customer_name
                    }

                  </p>

                </div>

              </div>

            )
          )}

        </div>

      </div>

    </section>

  );
}