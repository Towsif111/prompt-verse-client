import Link from "next/link";
import { FileQuestion, Home } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-100 to-indigo-100">
          <FileQuestion className="h-12 w-12 text-cyan-600" />
        </div>
        <h1 className="text-6xl font-black text-slate-800 mb-2">404</h1>
        <h2 className="text-2xl font-bold text-slate-600 mb-4">Page Not Found</h2>
        <p className="text-slate-400 mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
        >
          <Home className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
