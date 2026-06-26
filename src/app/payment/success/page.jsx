"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Loader2, ArrowLeft, Crown } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setVerifying(false);
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/verify-payment/${sessionId}`);
        const data = await res.json();
        if (data.verified) {
          // Refresh the Better Auth session so UI picks up Premium subscription
          // Note: useSession() hook will pick up the change on next poll or page navigation
          try {
            await fetch("/api/auth/session");
          } catch (sessionErr) {
            console.error("Session refresh failed:", sessionErr);
          }
          setVerified(true);
          toast.success("Payment successful! Welcome to Premium!");
        } else {
          // Might be a slight delay - check again after a few seconds
          setTimeout(async () => {
            const retryRes = await fetch(`http://localhost:5000/api/verify-payment/${sessionId}`);
            const retryData = await retryRes.json();
            if (retryData.verified) {
              // Refresh Better Auth session so UI picks up Premium on next poll
              try {
                await fetch("/api/auth/session");
              } catch (sessionErr) {
                console.error("Session refresh failed:", sessionErr);
              }
              setVerified(true);
              toast.success("Payment successful! Welcome to Premium!");
            } else {
              toast.success("Payment recorded! You may need to refresh.");
              setVerified(true);
            }
            setVerifying(false);
          }, 3000);
          return;
        }
      } catch (err) {
        toast.error("Failed to verify payment");
      }
      setVerifying(false);
    };
    verify();
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {verifying ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 shadow-xl">
            <Loader2 className="h-12 w-12 animate-spin text-cyan-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Verifying Payment...</h1>
            <p className="text-sm text-slate-500">Please wait while we confirm your payment</p>
          </div>
        ) : verified ? (
          <div className="rounded-3xl border border-emerald-200 bg-white p-12 shadow-xl">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle className="h-10 w-10 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-black text-emerald-700 mb-2">Payment Successful!</h1>
            <p className="text-slate-500 mb-2">Welcome to Premium!</p>
            <div className="mx-auto mb-6 flex items-center justify-center gap-2 rounded-full bg-amber-50 px-4 py-2 w-fit">
              <Crown className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-bold text-amber-700">Premium Member</span>
            </div>
            <p className="text-sm text-slate-500 mb-8">
              You now have access to all premium prompts and features.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/all-prompts"
                className="rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg hover:shadow-xl transition"
              >
                Browse All Prompts
              </Link>
              <Link
                href="/dashboard/user"
                className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 shadow-xl">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">No Payment Found</h1>
            <p className="text-sm text-slate-500 mb-6">
              We couldn't verify your payment. Please contact support if you believe this is an error.
            </p>
            <Link
              href="/payment"
              className="rounded-xl bg-cyan-600 px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-cyan-700 transition"
            >
              Try Again
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
