"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star, Copy, Calendar, Tag, Wrench, BarChart3 } from "lucide-react";

export default function PromptDetailClient({ prompt }) {
  const {
    title,
    description,
    category,
    aiTool,
    difficulty,
    thumbnail,
    copyCount,
    rating,
    creatorName,
    createdAt,
    prompt: promptText,
  } = prompt;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link
          href="/all-prompts"
          className="group mb-6 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-700"
        >
          <ArrowLeft
            size={16}
            className="transition group-hover:-translate-x-0.5"
          />
          Back to All Prompts
        </Link>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
          {/* Hero image */}
          <div className="relative h-64 w-full sm:h-80 lg:h-96">
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl drop-shadow-sm">
                {title}
              </h1>
            </div>
          </div>

          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-3">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <section>
                <h2 className="mb-3 text-lg font-bold text-slate-800">
                  Description
                </h2>
                <p className="text-base leading-relaxed text-slate-600">
                  {description}
                </p>
              </section>

              {/* Prompt text */}
              {promptText && (
                <section>
                  <h2 className="mb-3 text-lg font-bold text-slate-800">
                    Prompt
                  </h2>
                  <div className="rounded-xl bg-slate-900 p-5 font-mono text-sm leading-relaxed text-slate-200">
                    {promptText}
                  </div>
                </section>
              )}

              {/* Creator info */}
              {creatorName && (
                <section className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                  <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-slate-400">
                    Creator
                  </h2>
                  <p className="text-lg font-semibold text-slate-800">
                    {creatorName}
                  </p>
                </section>
              )}
            </div>

            {/* Sidebar stats */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">
                  Details
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100">
                      <Star size={16} className="text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Rating</p>
                      <p className="font-semibold text-slate-800">
                        {rating} / 5
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-100">
                      <Copy size={16} className="text-cyan-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Copies</p>
                      <p className="font-semibold text-slate-800">
                        {copyCount}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100">
                      <Tag size={16} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Category</p>
                      <p className="font-semibold text-slate-800">{category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">
                      <Wrench size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">AI Tool</p>
                      <p className="font-semibold text-slate-800">{aiTool}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100">
                      <BarChart3 size={16} className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Difficulty</p>
                      <p className="font-semibold text-slate-800">
                        {difficulty}
                      </p>
                    </div>
                  </div>

                  {createdAt && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-200">
                        <Calendar size={16} className="text-slate-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Created</p>
                        <p className="font-semibold text-slate-800">
                          {new Date(createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action button */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(promptText || description);
                }}
                className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:shadow-xl hover:shadow-cyan-500/30 hover:-translate-y-0.5 active:translate-y-0"
              >
                Copy Prompt
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
