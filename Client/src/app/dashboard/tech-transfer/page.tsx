"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Icons
const Icons = {
  Search: ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  ),
  ChevronDown: ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  ),
  ChevronLeft: ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  ),
  ChevronRight: ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  ),
  FileText: ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  ),
  Code: ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  Lightbulb: ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  ),
  Building: ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  ),
  ExternalLink: ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" x2="21" y1="14" y2="3" />
    </svg>
  ),
};

interface TechTransferResult {
  id: string;
  code: string;
  title: string;
  description: string;
  category: string;
  releaseType?: string;
  externalUrl?: string;
  center: string;
  imageUrl?: string;
  relevance?: number;
}

type SearchType = "patent" | "software" | "spinoff";

export default function TechTransferPage() {
  const [searchType, setSearchType] = useState<SearchType>("patent");
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<TechTransferResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a search query");
      return;
    }

    setLoading(true);
    setError(null);
    setCurrentPage(1); // Reset to first page on new search

    try {
      const response = await fetch(
        `http://localhost:5001/api/tech-transfer?${searchType}=${encodeURIComponent(searchQuery)}`,
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch data");
      }

      // Parse the results array from NASA API
      const parsedResults: TechTransferResult[] = (data.data.results || []).map(
        (item: any[]) => ({
          id: item[0] || "",
          code: item[1] || "",
          title: item[2] || "",
          description: item[3] || "",
          category: item[5] || "",
          releaseType: item[6] || undefined,
          externalUrl: item[8] || undefined,
          center: item[9] || "",
          imageUrl: item[10] || undefined,
          relevance: item[12] || undefined,
        }),
      );

      setResults(parsedResults);
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching data");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const toggleCard = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const getTypeIcon = (type: SearchType) => {
    switch (type) {
      case "patent":
        return <Icons.FileText className="w-5 h-5" />;
      case "software":
        return <Icons.Code className="w-5 h-5" />;
      case "spinoff":
        return <Icons.Lightbulb className="w-5 h-5" />;
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(results.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentResults = results.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    setExpandedCard(null); // Close any expanded cards when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white">
      {/* ── Background ──────────────────────────────────────────────────── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/15 via-transparent to-purple-900/10" />
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ opacity: [0.1, 0.6, 0.1] }}
            transition={{ duration: Math.random() * 4 + 2, repeat: Infinity }}
          />
        ))}
      </div>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="relative z-20 border-b border-white/10 backdrop-blur-xl bg-[#0B0F1A]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Icons.Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  NASA Technology Transfer
                </h1>
                <p className="text-sm text-slate-400">
                  Discover NASA&apos;s innovations: patents, software &amp;
                  spinoff technologies
                </p>
              </div>
            </div>

            {/* Type Tabs */}
            <div className="flex gap-2 p-1 rounded-xl bg-white/5 border border-white/10">
              {(["patent", "software", "spinoff"] as SearchType[]).map(
                (type) => (
                  <button
                    key={type}
                    onClick={() => setSearchType(type)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      searchType === type
                        ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {getTypeIcon(type)}
                      <span className="capitalize">{type}s</span>
                    </span>
                  </button>
                ),
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm">
            <div className="space-y-4">
              {/* Search Input */}
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Icons.Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder={`Search for ${searchType}s... (e.g., "engine", "autonomous", "medical")`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="px-6 py-4 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-cyan-500/20"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Searching...
                    </span>
                  ) : (
                    "Search"
                  )}
                </button>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 flex items-start gap-3"
                  >
                    <Icons.ExternalLink className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 animate-pulse"
                >
                  <div className="flex gap-4">
                    <div className="w-32 h-32 bg-white/10 rounded-lg" />
                    <div className="flex-1 space-y-3">
                      <div className="h-6 bg-white/10 rounded w-3/4" />
                      <div className="h-4 bg-white/10 rounded w-1/2" />
                      <div className="h-4 bg-white/10 rounded w-full" />
                      <div className="h-4 bg-white/10 rounded w-5/6" />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : results.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-cyan-400 font-medium mb-4 flex items-center gap-2"
              >
                <Icons.Search className="w-5 h-5" />
                Found {results.length} result{results.length !== 1 ? "s" : ""} •
                Showing {startIndex + 1}-{Math.min(endIndex, results.length)}
              </motion.p>

              {currentResults.map((result, index) => {
                const isExpanded = expandedCard === result.id;
                return (
                  <motion.div
                    key={result.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300 ${!isExpanded ? "cursor-pointer" : ""}`}
                    onClick={() => !isExpanded && toggleCard(result.id)}
                  >
                    <div className="p-6">
                      <div className="flex gap-4">
                        {/* Image */}
                        {result.imageUrl && (
                          <motion.div
                            className="flex-shrink-0 w-32 h-32 relative"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                          >
                            <img
                              src={result.imageUrl}
                              alt={result.title}
                              className="w-full h-full object-cover rounded-lg border border-white/10"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          </motion.div>
                        )}

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex-1">
                              <h3
                                className="text-xl font-semibold text-white mb-2 leading-tight"
                                dangerouslySetInnerHTML={{
                                  __html: result.title.replace(
                                    /<span class="highlight">(.*?)<\/span>/g,
                                    '<span class="text-cyan-400">$1</span>',
                                  ),
                                }}
                              />
                              <div className="flex flex-wrap gap-3 text-sm">
                                <span className="flex items-center gap-1 text-cyan-400 font-medium">
                                  <Icons.FileText className="w-4 h-4" />
                                  {result.code}
                                </span>
                                {result.center && (
                                  <span className="flex items-center gap-1 text-slate-400">
                                    <Icons.Building className="w-4 h-4" />
                                    {result.center}
                                  </span>
                                )}
                                {result.category && (
                                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium border border-purple-500/30">
                                    {result.category}
                                  </span>
                                )}
                                {result.releaseType && (
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium border ${
                                      result.releaseType === "Open Source"
                                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                        : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                                    }`}
                                  >
                                    {result.releaseType}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              {result.relevance && (
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-cyan-400">
                                    {result.relevance.toFixed(1)}%
                                  </div>
                                  <div className="text-xs text-slate-500">
                                    match
                                  </div>
                                </div>
                              )}
                              <motion.div
                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                                className="flex-shrink-0 cursor-pointer p-1 rounded-lg hover:bg-white/10 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (isExpanded) setExpandedCard(null);
                                  else toggleCard(result.id);
                                }}
                              >
                                <Icons.ChevronDown className="w-6 h-6 text-cyan-400" />
                              </motion.div>
                            </div>
                          </div>

                          {/* Short Description - Always Visible */}
                          <p
                            className={`text-slate-300 text-sm leading-relaxed ${
                              !isExpanded ? "line-clamp-2" : ""
                            }`}
                            dangerouslySetInnerHTML={{
                              __html: result.description.replace(
                                /<span class="highlight">(.*?)<\/span>/g,
                                '<span class="text-cyan-400 font-medium">$1</span>',
                              ),
                            }}
                          />
                        </div>
                      </div>

                      {/* Expanded Content */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-6 pt-6 border-t border-white/10"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Left Column - Details */}
                              <div className="space-y-4">
                                <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                                  <Icons.FileText className="w-5 h-5 text-cyan-400" />
                                  Details
                                </h4>
                                <div className="space-y-3 text-sm">
                                  <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                                    <Icons.Building className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                      <div className="text-slate-400 text-xs mb-1">
                                        NASA Center
                                      </div>
                                      <div className="text-white font-medium">
                                        {result.center || "N/A"}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                                    <Icons.Lightbulb className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                      <div className="text-slate-400 text-xs mb-1">
                                        Category
                                      </div>
                                      <div className="text-white font-medium">
                                        {result.category || "N/A"}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                                    <Icons.ExternalLink className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                      <div className="text-slate-400 text-xs mb-1">
                                        Technology ID
                                      </div>
                                      <div className="text-white font-mono text-xs">
                                        {result.code}
                                      </div>
                                    </div>
                                  </div>
                                  {result.releaseType && (
                                    <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                                      <Icons.Code className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                      <div>
                                        <div className="text-slate-400 text-xs mb-1">
                                          Release Type
                                        </div>
                                        <div
                                          className={`font-medium text-sm ${
                                            result.releaseType === "Open Source"
                                              ? "text-emerald-300"
                                              : "text-amber-300"
                                          }`}
                                        >
                                          {result.releaseType}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  {result.externalUrl && (
                                    <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                                      <Icons.ExternalLink className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                                      <div className="min-w-0 flex-1">
                                        <div className="text-slate-400 text-xs mb-1">
                                          Source Repository
                                        </div>
                                        <a
                                          href={result.externalUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-cyan-400 hover:text-cyan-300 text-sm font-medium truncate block transition-colors"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          {result.externalUrl}
                                        </a>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Right Column - Full Description */}
                              <div className="space-y-4">
                                <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                                  <Icons.FileText className="w-5 h-5 text-cyan-400" />
                                  Full Description
                                </h4>
                                <div
                                  className="text-slate-300 text-sm leading-relaxed p-4 bg-white/5 rounded-lg max-h-64 overflow-y-auto custom-scrollbar"
                                  dangerouslySetInnerHTML={{
                                    __html: result.description.replace(
                                      /<span class="highlight">(.*?)<\/span>/g,
                                      '<span class="text-cyan-400 font-medium">$1</span>',
                                    ),
                                  }}
                                />
                              </div>
                            </div>

                            {/* Action Button */}
                            <div className="mt-6 flex flex-wrap gap-3 justify-end">
                              {result.externalUrl && (
                                <a
                                  href={result.externalUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-medium hover:bg-white/10 transition-all"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  View Source Code
                                  <Icons.Code className="w-4 h-4" />
                                </a>
                              )}
                              <a
                                href={`https://technology.nasa.gov/${searchType}/${result.code}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
                                onClick={(e) => e.stopPropagation()}
                              >
                                View on NASA Website
                                <Icons.ExternalLink className="w-4 h-4" />
                              </a>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-8 flex items-center justify-center gap-2"
                >
                  {/* Previous Button */}
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <Icons.ChevronLeft className="w-5 h-5 text-cyan-400" />
                  </button>

                  {/* Page Numbers */}
                  <div className="flex gap-2">
                    {getPageNumbers().map((page, idx) => {
                      if (page === "...") {
                        return (
                          <span
                            key={`ellipsis-${idx}`}
                            className="px-4 py-2 text-slate-400"
                          >
                            ...
                          </span>
                        );
                      }
                      return (
                        <button
                          key={page}
                          onClick={() => goToPage(page as number)}
                          className={`min-w-[44px] px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            currentPage === page
                              ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                              : "bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <Icons.ChevronRight className="w-5 h-5 text-cyan-400" />
                  </button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            !loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Trending Topics */}
                <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Icons.Lightbulb className="w-6 h-6 text-cyan-400" />
                    <h3 className="text-xl font-semibold text-white">
                      Trending Technologies
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                      {
                        query: "artificial intelligence",
                        icon: "🤖",
                        desc: "AI & Machine Learning",
                        count: "147 results",
                      },
                      {
                        query: "autonomous systems",
                        icon: "🛰️",
                        desc: "Autonomous Navigation",
                        count: "89 results",
                      },
                      {
                        query: "propulsion",
                        icon: "🚀",
                        desc: "Rocket Propulsion",
                        count: "203 results",
                      },
                      {
                        query: "solar panels",
                        icon: "☀️",
                        desc: "Solar Energy Systems",
                        count: "76 results",
                      },
                      {
                        query: "life support",
                        icon: "💨",
                        desc: "Environmental Control",
                        count: "92 results",
                      },
                      {
                        query: "robotics",
                        icon: "🦾",
                        desc: "Robotic Systems",
                        count: "118 results",
                      },
                    ].map((topic) => (
                      <button
                        key={topic.query}
                        onClick={() => {
                          setSearchQuery(topic.query);
                          setTimeout(handleSearch, 100);
                        }}
                        className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-gradient-to-br hover:from-cyan-500/10 hover:to-purple-500/10 hover:border-cyan-500/30 transition-all text-left group"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{topic.icon}</span>
                          <div className="flex-1">
                            <p className="font-medium text-white group-hover:text-cyan-400 transition-colors">
                              {topic.desc}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              {topic.count}
                            </p>
                          </div>
                          <Icons.ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search Examples by Category */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Icons.Code className="w-5 h-5 text-purple-400" />
                      <h4 className="text-lg font-semibold text-white">
                        Software & Algorithms
                      </h4>
                    </div>
                    <div className="space-y-2">
                      {[
                        "trajectory optimization",
                        "image processing",
                        "data compression",
                        "flight control",
                        "sensor fusion",
                      ].map((term) => (
                        <button
                          key={term}
                          onClick={() => {
                            setSearchQuery(term);
                            setTimeout(handleSearch, 100);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg bg-white/5 text-slate-300 hover:bg-purple-500/10 hover:text-purple-400 hover:border-purple-500/30 border border-transparent transition-all text-sm"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Icons.FileText className="w-5 h-5 text-amber-400" />
                      <h4 className="text-lg font-semibold text-white">
                        Patents & Innovations
                      </h4>
                    </div>
                    <div className="space-y-2">
                      {[
                        "heat shield",
                        "aerodynamic design",
                        "thermal protection",
                        "composites",
                        "advanced materials",
                      ].map((term) => (
                        <button
                          key={term}
                          onClick={() => {
                            setSearchQuery(term);
                            setTimeout(handleSearch, 100);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg bg-white/5 text-slate-300 hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-500/30 border border-transparent transition-all text-sm"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
