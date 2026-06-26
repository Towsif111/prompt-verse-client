"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Users, Shield, Crown, User, Sparkles, ChevronLeft, Mail, KeyRound, LogIn, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

const DEMO_USERS = [
  {
    id: 1,
    name: "Admin Demo",
    email: "admin@demo.com",
    password: "Demo@123",
    address: "789 Admin Blvd, Austin, TX 73301",
    role: "Admin",
    bio: "Platform administrator with full access",
    avatarColor: "from-indigo-400 to-purple-600",
    promptsCount: 12,
  },
  {
    id: 2,
    name: "Creator Demo",
    email: "creator@demo.com",
    password: "Demo@123",
    address: "123 Creator Lane, San Francisco, CA 94102",
    role: "Creator",
    bio: "AI prompt engineer & content creator",
    avatarColor: "from-amber-400 to-orange-500",
    promptsCount: 24,
  },
  {
    id: 3,
    name: "User Demo",
    email: "user@demo.com",
    password: "Demo@123",
    address: "456 Developer Ave, New York, NY 10001",
    role: "User",
    bio: "Frontend developer & AI enthusiast",
    avatarColor: "from-cyan-400 to-blue-500",
    promptsCount: 5,
  },
];

const roleIcons = {
  Admin: Shield,
  Creator: Crown,
  User: User,
};

const roleStyles = {
  Admin: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  Creator: "bg-amber-50 text-amber-700 ring-amber-200",
  User: "bg-cyan-50 text-cyan-700 ring-cyan-200",
};

const roleGradients = {
  Admin: "from-indigo-500 to-purple-700",
  Creator: "from-amber-500 to-orange-600",
  User: "from-cyan-500 to-blue-600",
};

export default function DemoUsersPage() {
  const router = useRouter();
  const [loggingInAs, setLoggingInAs] = useState(null);

  const handleLogin = async (user) => {
    setLoggingInAs(user.id);
    try {
      // 1. Seed demo users on the Express backend first
      try {
        await fetch("http://localhost:5000/auth/seed-demo", { method: "POST" });
      } catch (err) {
        console.error("Backend seed failed:", err);
        // Continue anyway — backend might be down
      }

      // 2. Try Better Auth sign in
      let authResult = await authClient.signIn.email({
        email: user.email,
        password: user.password,
      });

      // 3. If sign in fails, try registering the user first
      if (authResult.error) {
        const registerResult = await authClient.signUp.email({
          email: user.email,
          password: user.password,
          name: user.name,
        });

        if (registerResult.error) {
          toast.error(`Failed to create demo account: ${registerResult.error.message}`);
          setLoggingInAs(null);
          return;
        }

        // Retry sign in after registration
        authResult = await authClient.signIn.email({
          email: user.email,
          password: user.password,
        });
      }

      if (authResult.error) {
        toast.error(`Sign in failed: ${authResult.error.message}`);
        setLoggingInAs(null);
        return;
      }

      if (authResult.data) {
        // 4. Sync with Express server for JWT
        try {
          const expressRes = await fetch("http://localhost:5000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: user.email, password: user.password }),
          });
          const expressData = await expressRes.json();
          if (expressRes.ok && expressData.token) {
            localStorage.setItem("express_token", expressData.token);
          }
        } catch (err) {
          console.error("Express login sync failed:", err);
        }

        toast.success(`Signed in as ${user.name}`);
        router.push("/");
      }
    } catch (err) {
      toast.error("Login failed. Please try again.");
      setLoggingInAs(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Page heading */}
        <div className="mb-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-indigo-600 shadow-lg shadow-cyan-500/20 mb-4">
            <Users className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Demo Users
          </h1>
          <p className="mt-3 text-base text-slate-500 max-w-lg mx-auto">
            Click on any demo user to instantly sign in and explore the platform with their role.
          </p>
        </div>

        {/* Users grid */}
        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {DEMO_USERS.map((user) => {
            const RoleIcon = roleIcons[user.role] || User;
            const isLoggingIn = loggingInAs === user.id;

            return (
              <div
                key={user.id}
                className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:shadow-lg hover:border-slate-300 overflow-hidden"
              >
                {/* Role header gradient */}
                <div className={`bg-gradient-to-r ${roleGradients[user.role]} px-5 py-4`}>
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm text-lg font-bold text-white shadow-sm">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white ring-1 ring-white/30">
                      <RoleIcon size={12} />
                      {user.role}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col flex-1 p-5">
                  {/* Name & bio */}
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">
                    {user.name}
                  </h3>
                  <p className="text-sm text-slate-500 mb-3">{user.bio}</p>

                  {/* Address */}
                  <div className="flex items-start gap-2 text-sm text-slate-500 mb-4">
                    <Sparkles className="h-3.5 w-3.5 shrink-0 text-slate-400 mt-0.5" />
                    <span>{user.address}</span>
                  </div>

                  {/* Credentials card */}
                  <div className="mt-auto rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-3.5 space-y-2.5">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      <code className="flex-1 truncate rounded bg-white px-2 py-0.5 text-xs font-mono text-slate-700 border border-slate-200 select-all">
                        {user.email}
                      </code>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <KeyRound className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      <code className="flex-1 truncate rounded bg-white px-2 py-0.5 text-xs font-mono text-slate-700 border border-slate-200 select-all">
                        {user.password}
                      </code>
                    </div>
                  </div>

                  {/* Login button */}
                  <button
                    type="button"
                    onClick={() => handleLogin(user)}
                    disabled={isLoggingIn}
                    className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 ${
                      isLoggingIn
                        ? "bg-slate-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 hover:shadow-md active:scale-[0.98]"
                    }`}
                  >
                    {isLoggingIn ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        <LogIn className="h-4 w-4" />
                        Login as {user.role}
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Note */}
        <div className="mt-10 text-center max-w-lg mx-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-600">
            Demo accounts are automatically created on the backend when you log in for the first time.
            Your credentials are stored securely and used only for exploring the platform.
          </p>
        </div>
      </div>
    </div>
  );
}
