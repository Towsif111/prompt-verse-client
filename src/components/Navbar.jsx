"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, Sparkles, UserPlus, LogOut, ChevronDown, LayoutDashboard } from "lucide-react";
import toast from "react-hot-toast";
import { signOut, useSession } from "@/lib/auth-client";
import { useState, useRef, useEffect } from "react";

function Navbar() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      setShowDropdown(false);
      await signOut();
      toast.success("Signed out successfully.");
      setTimeout(() => {
        router.push("/");
      }, 1200);
    } catch (error) {
      toast.error(error?.message || "Sign out failed. Please try again.");
      console.error("Sign out failed:", error);
    }
  };

  const user = session?.user;

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-indigo-600 shadow-lg shadow-cyan-500/20 ring-1 ring-white/10 transition duration-200 group-hover:scale-[1.03]">
            <Sparkles className="h-5 w-5 text-white" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-2xl font-semibold text-cyan-700/80">
              Prompt Verse
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/"
            className="btn btn-ghost btn-sm border border-transparent text-2xl text-slate-700 hover:border-slate-200 hover:bg-slate-100"
          >
            Home
          </Link>
          <Link
            href="/all-prompts"
            className="btn btn-ghost btn-sm border border-transparent text-2xl text-slate-700 hover:border-slate-200 hover:bg-slate-100"
          >
            All Prompts
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {isPending ? null : user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 transition hover:border-slate-300 hover:shadow-sm"
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "User"}
                    className="h-8 w-8 rounded-lg object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <span
                  className={`h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-600 text-sm font-bold text-white ${
                    user.image ? "hidden" : "flex"
                  }`}
                >
                  {getInitials(user.name)}
                </span>
                <span className="hidden text-sm font-medium text-slate-700 sm:inline">
                  {user.name || "User"}
                </span>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {user.name || "User"}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {user.email}
                    </p>
                  </div>
                  <div className="p-1">
                    <Link
                      href="/dashboard/user"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
                    >
                      <LogIn className="h-4 w-4" />
                      Profile Settings
                    </Link>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 transition hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth/signin" className="user-profile" aria-label="Login">
                <span className="user-profile-inner">
                  <LogIn />
                  <span>Sign In</span>
                </span>
              </Link>
              <Link href="/auth/signup" className="user-profile" aria-label="Sign up">
                <span className="user-profile-inner">
                  <UserPlus />
                  <span>Sign Up</span>
                </span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
