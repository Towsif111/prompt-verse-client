"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { DollarSign, Loader2, Crown } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminPaymentsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const getToken = () => session?.session?.token || "";

  useEffect(() => {
    if (isPending) return;
    if (!session?.user || session.user.role !== "Admin") {
      router.push("/auth/signin");
      return;
    }
    fetchPayments();
  }, [session, isPending, router]);

  const fetchPayments = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/payments", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      setPayments(data);
    } catch {
      toast.error("Failed to load payments");
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

  const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <DollarSign className="h-6 w-6 text-slate-600" />
          <h1 className="text-2xl font-bold text-slate-900">All Payments</h1>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            {payments.length}
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3">
          <Crown className="h-5 w-5 text-amber-600" />
          <div>
            <p className="text-xs text-amber-600">Total Revenue</p>
            <p className="text-xl font-black text-amber-800">${totalRevenue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <DollarSign className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 mb-1">No payments yet</h3>
          <p className="text-sm text-slate-400">Payments will appear here once users subscribe</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Amount</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Date</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Session ID</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, idx) => (
                <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                  <td className="px-4 py-3 font-medium text-slate-800">{payment.email}</td>
                  <td className="px-4 py-3 font-bold text-slate-800">${payment.amount?.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400 font-mono truncate max-w-[150px]">
                    {payment.stripeSessionId}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
