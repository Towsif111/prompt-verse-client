"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X, ArrowUpDown } from "lucide-react";
import AllPromptsCard from "./AllPromptsCard";

const sortOptions = [
  { value: "rating-desc", label: "Highest Rated" },
  { value: "rating-asc", label: "Lowest Rated" },
  { value: "copies-desc", label: "Most Copies" },
  { value: "copies-asc", label: "Fewest Copies" },
  { value: "title-asc", label: "Title A-Z" },
  { value: "title-desc", label: "Title Z-A" },
];

export default function AllPromptsPageContent({ prompts = [] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTools, setSelectedTools] = useState([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState([]);
  const [sortBy, setSortBy] = useState("rating-desc");
  const [showFilters, setShowFilters] = useState(false);

  // Extract unique filter options
  const categories = useMemo(
    () => [...new Set(prompts.map((p) => p.category).filter(Boolean))],
    [prompts]
  );
  const tools = useMemo(
    () => [...new Set(prompts.map((p) => p.aiTool).filter(Boolean))],
    [prompts]
  );
  const difficulties = useMemo(
    () => [...new Set(prompts.map((p) => p.difficulty).filter(Boolean))],
    [prompts]
  );

  // Filter and sort logic
  const filteredPrompts = useMemo(() => {
    let result = [...prompts];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.aiTool?.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }

    // AI Tool filter
    if (selectedTools.length > 0) {
      result = result.filter((p) => selectedTools.includes(p.aiTool));
    }

    // Difficulty filter
    if (selectedDifficulties.length > 0) {
      result = result.filter((p) =>
        selectedDifficulties.includes(p.difficulty)
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "rating-desc":
          return (b.rating || 0) - (a.rating || 0);
        case "rating-asc":
          return (a.rating || 0) - (b.rating || 0);
        case "copies-desc":
          return (b.copyCount || 0) - (a.copyCount || 0);
        case "copies-asc":
          return (a.copyCount || 0) - (b.copyCount || 0);
        case "title-asc":
          return (a.title || "").localeCompare(b.title || "");
        case "title-desc":
          return (b.title || "").localeCompare(a.title || "");
        default:
          return 0;
      }
    });

    return result;
  }, [prompts, searchQuery, selectedCategories, selectedTools, selectedDifficulties, sortBy]);

  const toggleFilter = (arr, setter, value) => {
    setter((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedTools([]);
    setSelectedDifficulties([]);
    setSortBy("rating-desc");
  };

  const hasActiveFilters =
    searchQuery ||
    selectedCategories.length > 0 ||
    selectedTools.length > 0 ||
    selectedDifficulties.length > 0;

  const FilterCheckbox = ({ label, checked, onChange }) => (
    <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition hover:bg-slate-100">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
      />
      <span className="text-slate-700">{label}</span>
    </label>
  );

  return (
    <section className="container-shell py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <p className="text-sm font-bold uppercase tracking-[0.35em] text-cyan-600">
          Discover
        </p>
        <h1 className="mt-2 text-4xl font-black bg-gradient-to-r from-cyan-600 to-indigo-600 bg-clip-text text-transparent">
          Explore Prompts
        </h1>
        <p className="mt-2 text-slate-500">
          Browse, search, and filter our curated collection of AI prompts
        </p>
      </motion.div>

      {/* Search bar + sort row */}
      <div className="mx-auto max-w-5xl mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search prompts by title, description, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 shadow-sm transition focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex gap-3">
          {/* Sort dropdown */}
          <div className="relative">
            <ArrowUpDown
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm text-slate-700 shadow-sm transition focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ArrowUpDown
              size={14}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-180"
            />
          </div>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm hover:bg-slate-50 transition"
          >
            <SlidersHorizontal size={16} />
            Filters
            {hasActiveFilters && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-600 text-xs text-white">
                {selectedCategories.length +
                  selectedTools.length +
                  selectedDifficulties.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Active filter chips */}
      {hasActiveFilters && (
        <div className="mx-auto max-w-5xl mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400">Active filters:</span>
          {selectedCategories.map((cat) => (
            <span
              key={cat}
              onClick={() => toggleFilter(selectedCategories, setSelectedCategories, cat)}
              className="flex cursor-pointer items-center gap-1 rounded-full bg-cyan-100 px-3 py-1 text-xs font-medium text-cyan-700 hover:bg-cyan-200 transition"
            >
              {cat}
              <X size={12} />
            </span>
          ))}
          {selectedTools.map((tool) => (
            <span
              key={tool}
              onClick={() => toggleFilter(selectedTools, setSelectedTools, tool)}
              className="flex cursor-pointer items-center gap-1 rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-200 transition"
            >
              {tool}
              <X size={12} />
            </span>
          ))}
          {selectedDifficulties.map((diff) => (
            <span
              key={diff}
              onClick={() => toggleFilter(selectedDifficulties, setSelectedDifficulties, diff)}
              className="flex cursor-pointer items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700 hover:bg-purple-200 transition"
            >
              {diff}
              <X size={12} />
            </span>
          ))}
          <button
            onClick={clearAllFilters}
            className="text-xs text-slate-400 hover:text-slate-600 underline transition ml-1"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Main content: sidebar filters + grid */}
      <div className="mx-auto max-w-5xl flex flex-col lg:flex-row gap-6">
        {/* Sidebar filters - desktop always visible, mobile toggle */}
        <AnimatePresence>
          {(showFilters || true) && (
            <motion.aside
              initial={false}
              className="lg:w-56 shrink-0"
            >
              <div className={`lg:block ${showFilters ? "block" : "hidden"} lg:block`}>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-6">
                  {/* Category filter */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Category
                    </h4>
                    <div className="space-y-0.5 max-h-48 overflow-y-auto">
                      {categories.map((cat) => (
                        <FilterCheckbox
                          key={cat}
                          label={cat}
                          checked={selectedCategories.includes(cat)}
                          onChange={() =>
                            toggleFilter(selectedCategories, setSelectedCategories, cat)
                          }
                        />
                      ))}
                      {categories.length === 0 && (
                        <p className="text-xs text-slate-400 px-3">No categories</p>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-slate-100" />

                  {/* AI Tool filter */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      AI Tool
                    </h4>
                    <div className="space-y-0.5 max-h-36 overflow-y-auto">
                      {tools.map((tool) => (
                        <FilterCheckbox
                          key={tool}
                          label={tool}
                          checked={selectedTools.includes(tool)}
                          onChange={() =>
                            toggleFilter(selectedTools, setSelectedTools, tool)
                          }
                        />
                      ))}
                      {tools.length === 0 && (
                        <p className="text-xs text-slate-400 px-3">No tools</p>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-slate-100" />

                  {/* Difficulty filter */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Difficulty
                    </h4>
                    <div className="space-y-0.5">
                      {difficulties.map((diff) => (
                        <FilterCheckbox
                          key={diff}
                          label={diff}
                          checked={selectedDifficulties.includes(diff)}
                          onChange={() =>
                            toggleFilter(selectedDifficulties, setSelectedDifficulties, diff)
                          }
                        />
                      ))}
                      {difficulties.length === 0 && (
                        <p className="text-xs text-slate-400 px-3">No difficulty levels</p>
                      )}
                    </div>
                  </div>

                  {/* Clear filter button */}
                  {hasActiveFilters && (
                    <>
                      <div className="border-t border-slate-100" />
                      <button
                        onClick={clearAllFilters}
                        className="w-full rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
                      >
                        Reset Filters
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Prompt grid */}
        <div className="flex-1 min-w-0">
          {/* Results count */}
          <p className="text-sm text-slate-400 mb-4">
            Showing {filteredPrompts.length} of {prompts.length} prompts
          </p>

          {filteredPrompts.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredPrompts.map((prompt, index) => (
                <motion.div
                  key={prompt._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (index % 9) * 0.04, duration: 0.3 }}
                >
                  <AllPromptsCard prompt={prompt} eagerImage={index < 3} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Search size={40} className="text-slate-300 mb-4" />
              <h3 className="text-lg font-semibold text-slate-600 mb-1">
                No prompts found
              </h3>
              <p className="text-sm text-slate-400 mb-4">
                Try adjusting your search or filters
              </p>
              <button
                onClick={clearAllFilters}
                className="rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-cyan-700 transition"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
