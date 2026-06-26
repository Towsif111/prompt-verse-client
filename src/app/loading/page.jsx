import { Loader2 } from "lucide-react";

export default function LoadingPage() {
  return (
    <div className="flex h-[70vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-500" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-transparent border-b-indigo-500" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-500">Loading</p>
          <p className="text-xs text-slate-400">Please wait a moment...</p>
        </div>
      </div>
    </div>
  );
}
