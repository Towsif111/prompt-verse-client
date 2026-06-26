"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import {
  FileText, CheckCircle, XCircle, Trash2, Star,
  Loader2, ExternalLink, Crown
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AdminPromptsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejection, setRejection] = useState({ id: null, feedback: "" });

  const getToken = () => session?.session?.token || "";

  useEffect(() => {
    if (isPending) return;
    if (!session?.user || session.user.role !== "Admin") {
      router.push("/auth/signin");
      return;
    }
    fetchPrompts();
  }, [session, isPending, router]);

  const fetchPrompts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/prompts", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      setPrompts(data);
    } catch {
      toast.error("Failed to load prompts");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status, feedback = "") => {
    try {
      const body = { status };
      if (feedback) body.rejectionFeedback = feedback;

      const res = await fetch(`http://localhost:5000/api/admin/prompts/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        toast.success(`Prompt ${status}`);
        setRejection({ id: null, feedback: "" });
        fetchPrompts();
      } else {
        toast.error("Failed to update");
      }
    } catch {
      toast.error("Failed to update");
    }
  };

  const toggleFeatured = async (id, featured) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/prompts/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ featured: !featured }),
      });
      if (res.ok) {
        toast.success(featured ? "Removed from featured" : "Marked as featured");
        fetchPrompts();
      }
    } catch {
      toast.error("Failed to update");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this prompt permanently?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/prompts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) {
        toast.success("Prompt deleted");
        fetchPrompts();
      }
    } catch {
      toast.error("Failed to delete");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved": return <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">Approved</span>;
      case "rejected": return <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700">Rejected</span>;
      default: return <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">Pending</span>;
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
      </div>
    );
  }

  const pendingPrompts = prompts.filter(p => p.status === "pending");
  const allPrompts = prompts;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="h-6 w-6 text-slate-600" />
        <h1 className="text-2xl font-bold text-slate-900">All Prompts</h1>
        <div className="flex gap-2">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            {prompts.filter(p => p.status === "approved").length} Approved
          </span>
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
            {pendingPrompts.length} Pending
          </span>
        </div>
      </div>

      {allPrompts.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <p className="text-slate-400">No prompts yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Title</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Creator</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Visibility</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Copies</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Featured</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allPrompts.map((prompt) => (
                <tr key={prompt._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-800 truncate max-w-[200px]">{prompt.title}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{prompt.creatorEmail}</td>
                  <td className="px-4 py-3">{getStatusBadge(prompt.status)}</td>
                  <td className="px-4 py-3">
                    {prompt.visibility === "Private" ? (
                      <span className="flex items-center gap-1 text-xs text-amber-600"><Crown size={12} /> Private</span>
                    ) : (
                      <span className="text-xs text-emerald-600">Public</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">{prompt.copyCount || 0}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleFeatured(prompt._id, prompt.featured)}
                      className={`rounded-lg p-1.5 transition ${prompt.featured ? "text-amber-500 hover:bg-amber-50" : "text-slate-300 hover:bg-slate-100"}`}
                      title={prompt.featured ? "Remove from featured" : "Feature prompt"}
                    >
                      <Star size={16} className={prompt.featured ? "fill-amber-400" : ""} />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {prompt.status === "pending" && (
                        <>
                          <button
                            onClick={() => updateStatus(prompt._id, "approved")}
                            className="rounded-lg p-1.5 text-emerald-600 hover:bg-emerald-50 transition"
                            title="Approve"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            onClick={() => setRejection({ id: prompt._id, feedback: "" })}
                            className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 transition"
                            title="Reject"
                          >
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                      <Link
                        href={`/prompts/${prompt._id}`}
                        className="rounded-lg p-1.5 text-cyan-600 hover:bg-cyan-50 transition"
                        title="View"
                      >
                        <ExternalLink size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(prompt._id)}
                        className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 transition"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Rejection Modal */}
      {rejection.id && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Rejection Feedback</h3>
            <textarea
              placeholder="Provide feedback on why this prompt was rejected..."
              value={rejection.feedback}
              onChange={(e) => setRejection({ ...rejection, feedback: e.target.value })}
              rows={4}
              className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-700 placeholder-slate-400 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-400/20 resize-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setRejection({ id: null, feedback: "" })}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => updateStatus(rejection.id, "rejected", rejection.feedback)}
                className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white hover:bg-red-700 transition"
              >
                Reject Prompt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
