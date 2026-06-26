"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

export default function DashboardIndexPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.push("/auth/signin");
      return;
    }

    const role = session.user.role;

    switch (role) {
      case "Admin":
        router.push("/dashboard/admin");
        break;
      case "Creator":
        router.push("/dashboard/creator");
        break;
      default:
        router.push("/dashboard/user");
        break;
    }
  }, [session, isPending, router]);

  return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
        <p className="text-sm text-slate-500">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
