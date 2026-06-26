"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import {
  Users, FileText, Copy, MessageSquare, Loader2,
  TrendingUp, BarChart3
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isPending) return;
    if (!session?.user || session.user.role !== "Admin") {
      router.push("/auth/signin");
      return;
    }

    const token = session?.session?.token || "";

    fetch("http://localhost:5000/api/admin/analytics", {
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

  const statsCards = [
    { icon: Users, label: "Total Users", value: analytics?.totalUsers || 0, color: "from-blue-400 to-blue-600", bg: "bg-blue-50", href: "/dashboard/admin/users" },
    { icon: FileText, label: "Total Prompts", value: analytics?.totalPrompts || 0, color: "from-cyan-400 to-teal-600", bg: "bg-cyan-50", href: "/dashboard/admin/prompts" },
    { icon: Copy, label: "Total Copies", value: analytics?.totalCopies || 0, color: "from-amber-400 to-orange-600", bg: "bg-amber-50", href: "/dashboard/admin/analytics" },
    { icon: MessageSquare, label: "Total Reviews", value: analytics?.totalReviews || 0, color: "from-purple-400 to-purple-600", bg: "bg-purple-50", href: "/dashboard/admin/analytics" },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <BarChart3 className="h-6 w-6 text-slate-600" />
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, idx) => (
          <Link
            key={idx}
            href={stat.href}
            className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition hover:-translate-y-0.5"
          >
            <div className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
              <stat.icon className={`h-5 w-5 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} />
            </div>
            <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-slate-800">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Manage Users", desc: "View, edit roles, delete users", href: "/dashboard/admin/users", icon: Users },
          { label: "Manage Prompts", desc: "Approve, reject, feature prompts", href: "/dashboard/admin/prompts", icon: FileText },
          { label: "Payments", desc: "View payment history", href: "/dashboard/admin/payments", icon: Copy },
          { label: "Reported Prompts", desc: "Review user reports", href: "/dashboard/admin/reports", icon: MessageSquare },
          { label: "Analytics", desc: "Full platform analytics", href: "/dashboard/admin/analytics", icon: TrendingUp },
        ].map((link, idx) => (
          <Link
            key={idx}
            href={link.href}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition hover:-translate-y-0.5"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
              <link.icon className="h-5 w-5 text-indigo-600" />
            </div>
            <h3 className="font-bold text-slate-800">{link.label}</h3>
            <p className="text-xs text-slate-400 mt-1">{link.desc}</p>
          </Link>
        ))}
      </div>

      {/* Monthly Growth */}
      {analytics?.monthlyGrowth && analytics.monthlyGrowth.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Monthly Prompt Growth</h2>
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
