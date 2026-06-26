"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, Users, FileText, DollarSign, Flag,
  TrendingUp, ChevronRight, LogOut, Shield
} from "lucide-react";
import toast from "react-hot-toast";
import { signOut } from "@/lib/auth-client";

export function AdminSidebar() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard/admin" },
    { icon: Users, label: "All Users", href: "/dashboard/admin/users" },
    { icon: FileText, label: "All Prompts", href: "/dashboard/admin/prompts" },
    { icon: DollarSign, label: "Payments", href: "/dashboard/admin/payments" },
    { icon: Flag, label: "Reports", href: "/dashboard/admin/reports" },
    { icon: TrendingUp, label: "Analytics", href: "/dashboard/admin/analytics" },
  ];

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
    router.push("/");
  };

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-purple-600 text-white font-bold">
          <Shield className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-800 truncate">{user?.name || "Admin"}</p>
          <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
            Admin
          </span>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-slate-100 p-3 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 transition hover:bg-slate-100"
        >
          <ChevronRight className="h-5 w-5" />
          Back to Home
        </Link>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-600 transition hover:bg-red-50"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
