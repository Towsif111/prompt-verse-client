"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { MessageSquare, Star, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function MyReviewsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.push("/auth/signin");
      return;
    }

    fetch(`http://localhost:5000/api/my-reviews/${session.user.email}`)
      .then((r) => r.json())
      .then(setReviews)
      .catch(() => toast.error("Failed to load reviews"))
      .finally(() => setLoading(false));
  }, [session, isPending, router]);

  if (isPending || loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="h-6 w-6 text-slate-600" />
        <h1 className="text-2xl font-bold text-slate-900">My Reviews</h1>
        <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
          {reviews.length}
        </span>
      </div>

      {reviews.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 mb-1">No reviews yet</h3>
          <p className="text-sm text-slate-400">Your reviews will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={16}
                      className={s <= review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              {review.comment && (
                <p className="text-sm text-slate-600 leading-relaxed">{review.comment}</p>
              )}
              <p className="text-xs text-slate-400 mt-2">
                Prompt ID: {review.promptId}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
