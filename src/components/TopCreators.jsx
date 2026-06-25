"use client";

import { motion } from "framer-motion";
import { Copy, Star, FileText, Mail } from "lucide-react";

const rankColors = {
  0: "from-yellow-300 to-amber-500",
  1: "from-slate-300 to-slate-500",
  2: "from-orange-300 to-amber-600",
};

const rankIcons = {
  0: "🥇",
  1: "🥈",
  2: "🥉",
};

export default function TopCreators({ creators = [] }) {
  if (creators.length === 0) return null;

  const topCreators = creators.slice(0, 6);

  return (
    <section className="container-shell py-16 bg-gradient-to-b from-white to-slate-50">
      <div className="mx-auto max-w-2xl text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-cyan-600">
            Community
          </p>
          <h2 className="mt-2 text-4xl font-black bg-gradient-to-r from-cyan-600 to-indigo-600 bg-clip-text text-transparent">
            Top Creators
          </h2>
          <p className="mt-3 text-slate-500">
            The most active and highest-rated prompt creators in our community
          </p>
        </motion.div>
      </div>

      <div className="mx-auto max-w-5xl grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {topCreators.map((creator, index) => (
          <motion.div
            key={creator.email}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, duration: 0.4 }}
          >
            <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              {/* Rank badge for top 3 */}
              {index < 3 && (
                <div className="absolute -right-8 -top-8 z-10 h-20 w-20 rotate-12">
                  <div
                    className={`h-full w-full rounded-full bg-gradient-to-br ${rankColors[index]} shadow-lg flex items-center justify-center pt-6 pl-6`}
                  >
                    <span className="text-xl">{rankIcons[index]}</span>
                  </div>
                </div>
              )}

              <div className="p-5">
                {/* Avatar with initials */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 text-white font-bold text-lg shadow-md">
                    {creator.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-slate-800 truncate">
                      {creator.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                      <Mail size={12} />
                      <span className="truncate">{creator.email}</span>
                    </div>
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-cyan-600">
                      <FileText size={14} />
                      <span className="font-bold text-slate-800">
                        {creator.promptCount}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">Prompts</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-amber-500">
                      <Copy size={14} />
                      <span className="font-bold text-slate-800">
                        {creator.totalCopies}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">Copies</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-purple-500">
                      <Star size={14} />
                      <span className="font-bold text-slate-800">
                        {creator.avgRating.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">Rating</p>
                  </div>
                </div>
              </div>

              {/* Hover accent bar */}
              <div className="h-1 w-0 bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-300 group-hover:w-full" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}