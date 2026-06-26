"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import {
  TrendingUp, Users, FileText, Copy, MessageSquare,
  Loader2, BarChart3
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const getToken = () => session?.session?.token || "";

  useEffect(() => {
    if (isPending) return;
    if (!session?.user || session.user.role !== "Admin") {
      router.push("/auth/signin");
      return;
    }
    fetchAnalytics();
  }, [session, isPending, router]);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/analytics", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      setAnalytics(data);
    } catch {
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
      </div>
    );
  }

  const stats = [
    { icon: Users, label: "Total Users", value: analytics?.totalUsers || 0, color: "from-blue-400 to-blue-600", bg: "bg-blue-50" },
    { icon: FileText, label: "Total Prompts", value: analytics?.totalPrompts || 0, color: "from-cyan-400 to-teal-600", bg: "bg-cyan-50" },
    { icon: Copy, label: "Total Copies", value: analytics?.totalCopies || 0, color: "from-amber-400 to-orange-600", bg: "bg-amber-50" },
    { icon: MessageSquare, label: "Total Reviews", value: analytics?.totalReviews || 0, color: "from-purple-400 to-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <TrendingUp className="h-6 w-6 text-slate-600" />
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
              <stat.icon className={`h-5 w-5 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} />
            </div>
            <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-slate-800">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Monthly Growth Chart */}
      {analytics?.monthlyGrowth && analytics.monthlyGrowth.length > 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="h-5 w-5 text-slate-500" />
            <h2 className="text-lg font-bold text-slate-800">Monthly Prompt Growth</h2>
          </div>
          <div className="space-y-3">
            {analytics.monthlyGrowth.map((month, idx) => {
              const maxCount = Math.max(...analytics.monthlyGrowth.map(m => m.count));
              return (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-500 w-20 shrink-0">{month._id}</span>
                  <div className="flex-1 h-7 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-500"
                      style={{ width: `${(month.count / maxCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-slate-600 w-10 text-right">{month.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <BarChart3 className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-400">No growth data available yet</p>
        </div>
      )}

      {/* Category Distribution - could be added */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-2">Summary</h2>
        <p className="text-sm text-slate-500">
          Platform has <strong className="text-slate-800">{analytics?.totalUsers || 0}</strong> users, 
          <strong className="text-slate-800"> {analytics?.totalPrompts || 0}</strong> prompts with 
          <strong className="text-slate-800"> {analytics?.totalCopies || 0}</strong> total copies and 
          <strong className="text-slate-800"> {analytics?.totalReviews || 0}</strong> reviews.
        </p>
      </div>
    </div>
  );
}
