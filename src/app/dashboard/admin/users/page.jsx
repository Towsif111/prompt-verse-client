"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Users, Trash2, Crown, Loader2, Shield } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const getToken = () => session?.session?.token || "";

  useEffect(() => {
    if (isPending) return;
    if (!session?.user || session.user.role !== "Admin") {
      router.push("/auth/signin");
      return;
    }
    fetchUsers();
  }, [session, isPending, router]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      setUsers(data);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ role }),
      });
      if (res.ok) {
        toast.success("Role updated");
        fetchUsers();
      } else {
        toast.error("Failed to update role");
      }
    } catch {
      toast.error("Failed to update role");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user and all their data?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) {
        toast.success("User deleted");
        fetchUsers();
      } else {
        toast.error("Failed to delete user");
      }
    } catch {
      toast.error("Failed to delete user");
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
      <div className="flex items-center gap-3 mb-6">
        <Users className="h-6 w-6 text-slate-600" />
        <h1 className="text-2xl font-bold text-slate-900">All Users</h1>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
          {users.length}
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Name</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Email</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Role</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Subscription</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Prompts</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 text-white text-xs font-bold">
                      {user.name?.charAt(0) || "U"}
                    </div>
                    <span className="font-semibold text-slate-800">{user.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-500">{user.email}</td>
                <td className="px-4 py-3">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-medium text-slate-700 focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="User">User</option>
                    <option value="Creator">Creator</option>
                    <option value="Admin">Admin</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  {user.subscription === "Premium" || user.subscription === "premium" ? (
                    <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 w-fit">
                      <Crown size={12} /> Premium
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">Free</span>
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-slate-700">{user.totalPrompts || 0}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 transition"
                    title="Delete User"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
