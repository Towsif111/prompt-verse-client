"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import {
  FileText, ExternalLink, Trash2, Edit3, Loader2,
  Eye, CheckCircle, XCircle
} from "lucide-react";
import toast from "react-hot-toast";

export default function CreatorMyPromptsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.push("/auth/signin");
      return;
    }

    fetch(`http://localhost:5000/api/my-prompts/${session.user.email}`)
      .then((r) => r.json())
      .then(setPrompts)
      .catch(() => toast.error("Failed to load prompts"))
      .finally(() => setLoading(false));
  }, [session, isPending, router]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this prompt?")) return;
    setDeleting(id);
    try {
      const token = session?.session?.token || "";
      const res = await fetch(`http://localhost:5000/api/prompts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success("Prompt deleted");
        setPrompts((p) => p.filter((pr) => pr._id !== id));
      } else {
        toast.error("Failed to delete");
      }
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleting(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700"><CheckCircle size={12} /> Approved</span>;
      case "rejected":
        return <span className="flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700"><XCircle size={12} /> Rejected</span>;
      default:
        return <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700"><Loader2 size={12} /> Pending</span>;
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-slate-600" />
          <h1 className="text-2xl font-bold text-slate-900">My Prompts</h1>
          <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-medium text-cyan-700">
            {prompts.length}
          </span>
        </div>
        <Link
          href="/dashboard/creator/add-prompt"
          className="rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-md hover:shadow-lg transition"
        >
          + New Prompt
        </Link>
      </div>

      {prompts.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 mb-1">No prompts yet</h3>
          <p className="text-sm text-slate-400 mb-4">Create your first prompt to share with the community</p>
          <Link
            href="/dashboard/creator/add-prompt"
            className="inline-flex rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-cyan-700 transition"
          >
            Create Prompt
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Title</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Category</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Copies</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Date</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {prompts.map((prompt) => (
                <tr key={prompt._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-800 truncate max-w-[200px]">{prompt.title}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{prompt.category}</td>
                  <td className="px-4 py-3">{getStatusBadge(prompt.status)}</td>
                  <td className="px-4 py-3 font-medium text-slate-700">{prompt.copyCount || 0}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs">
                    {new Date(prompt.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/prompts/${prompt._id}`}
                        className="rounded-lg p-1.5 text-cyan-600 hover:bg-cyan-50 transition"
                        title="View"
                      >
                        <ExternalLink size={16} />
                      </Link>
                      <Link
                        href={`/dashboard/creator/my-prompts/edit/${prompt._id}`}
                        className="rounded-lg p-1.5 text-indigo-600 hover:bg-indigo-50 transition"
                        title="Edit"
                      >
                        <Edit3 size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(prompt._id)}
                        disabled={deleting === prompt._id}
                        className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                        title="Delete"
                      >
                        {deleting === prompt._id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Rejection feedback display */}
      {prompts.filter(p => p.rejectionFeedback).length > 0 && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">
          <h3 className="font-bold text-red-800 mb-3">Rejected Prompts Feedback</h3>
          <div className="space-y-2">
            {prompts.filter(p => p.rejectionFeedback).map(p => (
              <div key={p._id} className="rounded-xl bg-white p-3 border border-red-100">
                <p className="font-semibold text-slate-800 text-sm">{p.title}</p>
                <p className="text-xs text-red-600 mt-1">{p.rejectionFeedback}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
