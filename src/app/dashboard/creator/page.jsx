"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import {
  FileText, Copy, BookmarkCheck, TrendingUp, Loader2,
  BarChart3, ArrowUp, ArrowDown
} from "lucide-react";
import toast from "react-hot-toast";

export default function CreatorDashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.push("/auth/signin");
      return;
    }

    const token = session?.session?.token || "";

    fetch("http://localhost:5000/api/creator/analytics", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setAnalytics)
      .catch(() => toast.error("Failed to load analytics"))
      .finally(() => setLoading(false));
  }, [session, isPending, router]);

  if (isPending || loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
      </div>
    );
  }

  const stats = [
    { icon: FileText, label: "Total Prompts", value: analytics?.totalPrompts || 0, color: "from-cyan-400 to-blue-500", bg: "bg-cyan-50" },
    { icon: Copy, label: "Total Copies", value: analytics?.totalCopies || 0, color: "from-amber-400 to-orange-500", bg: "bg-amber-50" },
    { icon: BookmarkCheck, label: "Total Bookmarks", value: analytics?.totalBookmarks || 0, color: "from-indigo-400 to-purple-500", bg: "bg-indigo-50" },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <BarChart3 className="h-6 w-6 text-slate-600" />
        <h1 className="text-2xl font-bold text-slate-900">Creator Dashboard</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition"
          >
            <div className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
              <stat.icon className={`h-5 w-5 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} />
            </div>
            <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-slate-800">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Prompt Copies Chart */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Prompt Copies Overview</h2>
        {analytics?.promptCopies && analytics.promptCopies.length > 0 ? (
          <div className="space-y-3">
            {analytics.promptCopies.map((prompt, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-700 truncate">{prompt.title}</p>
                  <p className="text-xs text-slate-400">
                    {new Date(prompt.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Copy className="h-4 w-4 text-amber-500" />
                  <span className="font-bold text-slate-800">{prompt.copyCount || 0}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400">
            <FileText className="h-10 w-10 mx-auto mb-2" />
            <p className="text-sm">No prompts yet. Create your first prompt!</p>
          </div>
        )}
      </div>

      {/* Monthly Growth */}
      {analytics?.monthlyGrowth && analytics.monthlyGrowth.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Monthly Growth</h2>
          <div className="space-y-3">
            {analytics.monthlyGrowth.map((month, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-500 w-20">{month._id}</span>
                <div className="flex-1 h-6 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all"
                    style={{
                      width: `${Math.min(100, (month.count / Math.max(...analytics.monthlyGrowth.map(m => m.count))) * 100)}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-bold text-slate-600 w-8 text-right">{month.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
