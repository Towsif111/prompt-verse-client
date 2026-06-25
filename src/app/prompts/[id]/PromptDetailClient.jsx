"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Star, Copy, Calendar, Tag, Wrench, BarChart3,
  Bookmark, BookmarkCheck, Flag, MessageSquare, Eye, Lock,
  ChevronDown, ThumbsUp, User, Send, X
} from "lucide-react";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";

const REPORT_REASONS = [
  "Inappropriate Content",
  "Spam",
  "Copyright Violation",
  "Misleading Information",
  "Other",
];

export default function PromptDetailClient({ prompt }) {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();
  const user = session?.user;

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copyCount, setCopyCount] = useState(prompt.copyCount || 0);
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [submittingReport, setSubmittingReport] = useState(false);
  const [loadingStates, setLoadingStates] = useState({
    bookmark: false,
    review: false,
    report: false,
    copy: false,
  });

  const isPremium = user?.subscription === "premium" || user?.subscription === "Premium";
  const isPrivate = prompt.visibility === "Private" || prompt.visibility === "private";

  // Fetch reviews
  useEffect(() => {
    fetch(`http://localhost:5000/api/prompts/${prompt._id}/reviews`)
      .then((r) => r.json())
      .then(setReviews)
      .catch(() => {});
  }, [prompt._id]);

  // Check bookmark status
  useEffect(() => {
    if (user?.email) {
      fetch(`http://localhost:5000/api/bookmarks/${user.email}/${prompt._id}`)
        .then((r) => r.json())
        .then((data) => setIsBookmarked(data.bookmarked))
        .catch(() => {});
    }
  }, [user?.email, prompt._id]);

  const handleBookmark = useCallback(async () => {
    if (!user) {
      toast.error("Please sign in to bookmark prompts");
      return;
    }
    if (loadingStates.bookmark) return;
    setLoadingStates((p) => ({ ...p, bookmark: true }));
    try {
      const res = await fetch("http://localhost:5000/api/bookmarks/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: user.email, promptId: prompt._id }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsBookmarked(data.bookmarked);
        toast.success(data.bookmarked ? "Prompt bookmarked!" : "Bookmark removed");
      } else {
        toast.error(data.error || "Failed to toggle bookmark");
      }
    } catch {
      toast.error("Failed to toggle bookmark");
    } finally {
      setLoadingStates((p) => ({ ...p, bookmark: false }));
    }
  }, [user, prompt._id, loadingStates.bookmark]);

  const handleCopy = useCallback(async () => {
    if (isPrivate && !isPremium) {
      toast.error("Subscribe to Premium to copy this prompt");
      return;
    }
    setLoadingStates((p) => ({ ...p, copy: true }));
    try {
      await navigator.clipboard.writeText(prompt.prompt || prompt.description);
      toast.success("Copied to clipboard!");
      setCopyCount((c) => c + 1);
      await fetch(`http://localhost:5000/api/prompts/${prompt._id}/copy`, {
        method: "POST",
      });
    } catch {
      toast.error("Failed to copy");
    } finally {
      setLoadingStates((p) => ({ ...p, copy: false }));
    }
  }, [prompt, isPrivate, isPremium]);

  const handleSubmitReview = useCallback(async () => {
    if (!user) {
      toast.error("Please sign in to review");
      return;
    }
    if (newRating === 0) {
      toast.error("Please select a rating");
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promptId: prompt._id,
          userEmail: user.email,
          userName: user.name,
          rating: newRating,
          comment: newComment,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Review submitted!");
        setNewRating(0);
        setNewComment("");
        // Refresh reviews
        const reviewsRes = await fetch(`http://localhost:5000/api/prompts/${prompt._id}/reviews`);
        setReviews(await reviewsRes.json());
      } else {
        toast.error(data.error || "Failed to submit review");
      }
    } catch {
      toast.error("Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  }, [user, prompt._id, newRating, newComment]);

  const handleSubmitReport = useCallback(async () => {
    if (!user) {
      toast.error("Please sign in to report");
      return;
    }
    if (!reportReason) {
      toast.error("Please select a reason");
      return;
    }
    setSubmittingReport(true);
    try {
      const res = await fetch("http://localhost:5000/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promptId: prompt._id,
          userEmail: user.email,
          reason: reportReason,
          description: reportDescription,
        }),
      });
      if (res.ok) {
        toast.success("Report submitted. Thank you!");
        setShowReportModal(false);
        setReportReason("");
        setReportDescription("");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to submit report");
      }
    } catch {
      toast.error("Failed to submit report");
    } finally {
      setSubmittingReport(false);
    }
  }, [user, prompt._id, reportReason, reportDescription]);

  const {
    _id, title, description, category, aiTool, difficulty,
    thumbnail, creatorName, createdAt,
    prompt: promptText, tags, reviewCount,
  } = prompt;

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : prompt.rating || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link
          href="/all-prompts"
          className="group mb-6 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-700"
        >
          <ArrowLeft size={16} className="transition group-hover:-translate-x-0.5" />
          Back to All Prompts
        </Link>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
          {/* Hero image */}
          <div className="relative h-64 w-full sm:h-80 lg:h-96">
            <Image
              src={thumbnail || "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200"}
              alt={title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${
                  isPrivate
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                }`}>
                  {isPrivate ? "🔒 Premium" : "Public"}
                </span>
                {difficulty && (
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-white/20 text-white">
                    {difficulty}
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl drop-shadow-sm">
                {title}
              </h1>
            </div>
          </div>

          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-3">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <section>
                <h2 className="mb-3 text-lg font-bold text-slate-800">Description</h2>
                <p className="text-base leading-relaxed text-slate-600">{description}</p>
              </section>

              {/* Tags */}
              {tags && tags.length > 0 && (
                <section>
                  <h2 className="mb-3 text-lg font-bold text-slate-800">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, i) => (
                      <span key={i} className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Prompt text - with premium lock */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-bold text-slate-800">Prompt</h2>
                  {isPrivate && !isPremium && (
                    <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                      <Lock size={12} />
                      Premium Content
                    </span>
                  )}
                </div>
                <div className={`relative rounded-xl bg-slate-900 p-5 font-mono text-sm leading-relaxed ${
                  isPrivate && !isPremium ? "blur-sm select-none" : "text-slate-200"
                }`}>
                  {promptText || description}
                  {isPrivate && !isPremium && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-[2px] rounded-xl">
                      <Lock size={32} className="text-amber-400 mb-3" />
                      <p className="text-white font-bold text-base mb-1">Premium Prompt</p>
                      <p className="text-slate-300 text-sm mb-4">Subscribe to access this premium prompt</p>
                      <button
                        onClick={() => router.push("/payment")}
                        className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                      >
                        Subscribe to Premium — $5
                      </button>
                    </div>
                  )}
                </div>
              </section>

              {/* Creator info */}
              {creatorName && (
                <section className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                  <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-slate-400">Creator</h2>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 text-white text-sm font-bold">
                      {creatorName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                    </div>
                    <p className="text-lg font-semibold text-slate-800">{creatorName}</p>
                  </div>
                </section>
              )}

              {/* Reviews Section */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-800">
                    Reviews ({reviews.length})
                  </h2>
                  <div className="flex items-center gap-1">
                    <Star size={16} className="fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-slate-800">{avgRating.toFixed(1)}</span>
                  </div>
                </div>

                {/* Review form - only for logged in, non-premium-locked users */}
                {user && !(isPrivate && !isPremium) ? (
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 mb-6">
                    <h3 className="text-sm font-bold text-slate-700 mb-3">Write a Review</h3>
                    <div className="flex items-center gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="transition hover:scale-110"
                        >
                          <Star
                            size={22}
                            className={
                              star <= newRating
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-300"
                            }
                          />
                        </button>
                      ))}
                    </div>
                    <textarea
                      placeholder="Share your thoughts about this prompt..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                      className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-700 placeholder-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 resize-none"
                    />
                    <button
                      onClick={handleSubmitReview}
                      disabled={submittingReview || newRating === 0}
                      className="mt-3 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={14} />
                      {submittingReview ? "Submitting..." : "Submit Review"}
                    </button>
                  </div>
                ) : user && isPrivate && !isPremium ? (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 mb-6 text-center">
                    <Lock size={20} className="text-amber-500 mx-auto mb-2" />
                    <p className="text-sm text-amber-700 font-medium">Subscribe to Premium to review this prompt</p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 mb-6 text-center">
                    <p className="text-sm text-slate-500">
                      <Link href="/auth/signin" className="text-cyan-600 font-medium hover:underline">Sign in</Link> to leave a review
                    </p>
                  </div>
                )}

                {/* Reviews list */}
                <div className="space-y-4">
                  {reviews.length === 0 && (
                    <p className="text-sm text-slate-400 text-center py-6">
                      No reviews yet. Be the first to review!
                    </p>
                  )}
                  {reviews.map((review, idx) => (
                    <div key={idx} className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 text-white text-xs font-bold">
                            {review.userName?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U"}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{review.userName}</p>
                            <p className="text-xs text-slate-400">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={14}
                              className={s <= review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}
                            />
                          ))}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-slate-600 leading-relaxed">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Stats card */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100">
                      <Star size={16} className="text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Rating</p>
                      <p className="font-semibold text-slate-800">{avgRating.toFixed(1)} / 5</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-100">
                      <Copy size={16} className="text-cyan-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Copies</p>
                      <p className="font-semibold text-slate-800">{copyCount}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100">
                      <Tag size={16} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Category</p>
                      <p className="font-semibold text-slate-800">{category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">
                      <Wrench size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">AI Tool</p>
                      <p className="font-semibold text-slate-800">{aiTool}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100">
                      <BarChart3 size={16} className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Difficulty</p>
                      <p className="font-semibold text-slate-800">{difficulty}</p>
                    </div>
                  </div>
                  {createdAt && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-200">
                        <Calendar size={16} className="text-slate-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Created</p>
                        <p className="font-semibold text-slate-800">
                          {new Date(createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-2">
                <button
                  onClick={handleCopy}
                  disabled={loadingStates.copy}
                  className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:shadow-xl hover:shadow-cyan-500/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                >
                  <Copy size={16} className="inline mr-2" />
                  {loadingStates.copy ? "Copying..." : "Copy Prompt"}
                </button>

                {user && (
                  <button
                    onClick={handleBookmark}
                    disabled={loadingStates.bookmark}
                    className={`w-full rounded-xl border px-6 py-3 text-sm font-bold transition hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 ${
                      isBookmarked
                        ? "border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {isBookmarked ? (
                      <><BookmarkCheck size={16} className="inline mr-2" /> Bookmarked</>
                    ) : (
                      <><Bookmark size={16} className="inline mr-2" /> Bookmark</>
                    )}
                  </button>
                )}

                {user && (
                  <button
                    onClick={() => setShowReportModal(true)}
                    className="w-full rounded-xl border border-red-200 bg-white px-6 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <Flag size={16} className="inline mr-2" />
                    Report Prompt
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Report Prompt</h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-sm text-slate-500 mb-4">
              Why are you reporting this prompt?
            </p>

            <div className="space-y-2 mb-4">
              {REPORT_REASONS.map((reason) => (
                <label
                  key={reason}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                    reportReason === reason
                      ? "border-red-300 bg-red-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="reportReason"
                    value={reason}
                    checked={reportReason === reason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="h-4 w-4 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm font-medium text-slate-700">{reason}</span>
                </label>
              ))}
            </div>

            <textarea
              placeholder="Optional description..."
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-700 placeholder-slate-400 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-400/20 resize-none mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowReportModal(false)}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReport}
                disabled={!reportReason || submittingReport}
                className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white hover:bg-red-700 transition disabled:opacity-50"
              >
                {submittingReport ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
