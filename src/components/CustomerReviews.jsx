"use client";

import { motion } from "framer-motion";

const customerReviews = [
  {
    id: 1,
    userName: "Fahim Ahmed",
    rating: 5,
    comment: "Amazing prompt quality. I use it daily for client work."
  },
  {
    id: 2,
    userName: "Jannatul Ferdaus",
    rating: 4,
    comment: "Very clean UI and the bookmark feature is super useful."
  },
  {
    id: 3,
    userName: "Sajid Hasan",
    rating: 5,
    comment: "Premium prompts are worth it. Helped me automate many tasks."
  }
];

export default function CustomerReviewsSection() {
  return (
    <section className="py-12">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Customer Reviews</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {customerReviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            viewport={{ once: true }}
            className="border rounded-xl p-10 bg-white shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">{review.userName}</h3>
              <span className="text-sm text-amber-500">★ {review.rating}</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{review.comment}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}