"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchNeoFeed,
  fetchNeoBrowse,
  NeoObject,
  NeoFeedResponse,
  NeoBrowseResponse,
} from "@/lib/api";

// ─── Icons ──────────────────────────────────────────────────────────────────

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
  Calendar: ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  ),
  Target: ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  Zap: ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Alert: ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  ),
  Shield: ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Globe: ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
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
  Asteroid: ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  ),
  List: ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="8" x2="21" y1="6" y2="6" />
      <line x1="8" x2="21" y1="12" y2="12" />
      <line x1="8" x2="21" y1="18" y2="18" />
      <line x1="3" x2="3.01" y1="6" y2="6" />
      <line x1="3" x2="3.01" y1="12" y2="12" />
      <line x1="3" x2="3.01" y1="18" y2="18" />
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
  Loader: ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
};

// ─── Helpers ────────────────────────────────────────────────────────────────

const MOON_DISTANCE_KM = 384400;

function formatDistance(km: number): string {
  if (km > 1_000_000) return `${(km / 1_000_000).toFixed(2)}M km`;
  if (km > 1000) return `${(km / 1000).toFixed(1)}K km`;
  return `${km.toFixed(0)} km`;
}

function formatVelocity(kph: number): string {
  return `${(kph / 1000).toFixed(1)}K km/h`;
}

function formatDiameter(neo: NeoObject): string {
  const min = neo.estimated_diameter.meters.estimated_diameter_min;
  const max = neo.estimated_diameter.meters.estimated_diameter_max;
  if (max > 1000) {
    return `${(min / 1000).toFixed(2)} - ${(max / 1000).toFixed(2)} km`;
  }
  return `${min.toFixed(0)} - ${max.toFixed(0)} m`;
}

function getThreatInfo(neo: NeoObject): {
  level: string;
  color: string;
  bg: string;
  border: string;
  dot: string;
} {
  if (!neo.close_approach_data.length) {
    return {
      level: "UNKNOWN",
      color: "text-gray-400",
      bg: "bg-gray-500/20",
      border: "border-gray-500/30",
      dot: "bg-gray-500",
    };
  }
  const distKm = parseFloat(
    neo.close_approach_data[0].miss_distance.kilometers,
  );
  const ld = distKm / MOON_DISTANCE_KM;

  if (neo.is_potentially_hazardous_asteroid && ld < 1) {
    return {
      level: "EXTREME",
      color: "text-red-400",
      bg: "bg-red-500/20",
      border: "border-red-500/30",
      dot: "bg-red-500",
    };
  }
  if (neo.is_potentially_hazardous_asteroid) {
    return {
      level: "HIGH",
      color: "text-orange-400",
      bg: "bg-orange-500/20",
      border: "border-orange-500/30",
      dot: "bg-orange-500",
    };
  }
  if (ld < 5) {
    return {
      level: "MODERATE",
      color: "text-yellow-400",
      bg: "bg-yellow-500/20",
      border: "border-yellow-500/30",
      dot: "bg-yellow-500",
    };
  }
  if (ld < 20) {
    return {
      level: "LOW",
      color: "text-cyan-400",
      bg: "bg-cyan-500/20",
      border: "border-cyan-500/30",
      dot: "bg-cyan-500",
    };
  }
  return {
    level: "MINIMAL",
    color: "text-green-400",
    bg: "bg-green-500/20",
    border: "border-green-500/30",
    dot: "bg-green-500",
  };
}

function getDateRange(daysFromNow: number = 7): { start: string; end: string } {
  const today = new Date();
  const end = new Date(today.getTime() + daysFromNow * 24 * 60 * 60 * 1000);
  return {
    start: today.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0],
  };
}

// ─── Component ──────────────────────────────────────────────────────────────

type ViewMode = "feed" | "browse";

export default function NEOListPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("feed");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Feed state
  const [feedData, setFeedData] = useState<NeoFeedResponse | null>(null);
  const [startDate, setStartDate] = useState(getDateRange().start);
  const [endDate, setEndDate] = useState(getDateRange().end);

  // Browse state
  const [browseData, setBrowseData] = useState<NeoBrowseResponse | null>(null);
  const [browsePage, setBrowsePage] = useState(0);

  // Filters
  const [showHazardousOnly, setShowHazardousOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // ── Fetch Feed ─────────────────────────────────────────────────────────
  const loadFeed = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNeoFeed(startDate, endDate);
      setFeedData(data);
    } catch (err: any) {
      console.error("Error loading NEO feed:", err);
      setError(err?.message || "Failed to load NEO feed");
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  // ── Fetch Browse ───────────────────────────────────────────────────────
  const loadBrowse = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNeoBrowse(browsePage, 20);
      setBrowseData(data);
    } catch (err: any) {
      console.error("Error loading NEO browse:", err);
      setError(err?.message || "Failed to browse NEOs");
    } finally {
      setLoading(false);
    }
  }, [browsePage]);

  useEffect(() => {
    if (viewMode === "feed") {
      loadFeed();
    } else {
      loadBrowse();
    }
  }, [viewMode, loadFeed, loadBrowse]);

  // ── Compute flat asteroid list ─────────────────────────────────────────
  const allNeos: NeoObject[] = (() => {
    if (viewMode === "feed" && feedData) {
      const all: NeoObject[] = [];
      for (const date of Object.keys(feedData.near_earth_objects).sort()) {
        all.push(...feedData.near_earth_objects[date]);
      }
      return all;
    }
    if (viewMode === "browse" && browseData) {
      return browseData.near_earth_objects;
    }
    return [];
  })();

  // ── Filter ─────────────────────────────────────────────────────────────
  const filteredNeos = allNeos.filter((neo) => {
    if (showHazardousOnly && !neo.is_potentially_hazardous_asteroid)
      return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        neo.name.toLowerCase().includes(q) ||
        neo.id.includes(q) ||
        neo.neo_reference_id.includes(q)
      );
    }
    return true;
  });

  // ── Stats ──────────────────────────────────────────────────────────────
  const totalCount = allNeos.length;
  const hazardousCount = allNeos.filter(
    (n) => n.is_potentially_hazardous_asteroid,
  ).length;
  const sentryCount = allNeos.filter((n) => n.is_sentry_object).length;
  const avgSpeed =
    allNeos.length > 0
      ? allNeos.reduce((sum, n) => {
          const v =
            n.close_approach_data[0]?.relative_velocity?.kilometers_per_hour;
          return sum + (v ? parseFloat(v) : 0);
        }, 0) / allNeos.length
      : 0;

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white">
      {/* ── Background ──────────────────────────────────────────────────── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/15 via-transparent to-cyan-900/10" />
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
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Icons.Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  Near-Earth Objects
                </h1>
                <p className="text-sm text-slate-400">
                  NASA NeoWs — Track asteroids &amp; comets approaching Earth
                </p>
              </div>
            </div>

            {/* View Tabs */}
            <div className="flex gap-2 p-1 rounded-xl bg-white/5 border border-white/10">
              <button
                onClick={() => setViewMode("feed")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === "feed"
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Icons.Calendar className="w-4 h-4" />
                  Date Feed
                </span>
              </button>
              <button
                onClick={() => setViewMode("browse")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === "browse"
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Icons.List className="w-4 h-4" />
                  Browse All
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* ── Stats Banner ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total Objects",
              value: totalCount,
              icon: Icons.Asteroid,
              color: "text-cyan-400",
              bg: "from-cyan-500/20 to-blue-500/20",
            },
            {
              label: "Hazardous",
              value: hazardousCount,
              icon: Icons.Alert,
              color: "text-red-400",
              bg: "from-red-500/20 to-rose-500/20",
            },
            {
              label: "Sentry Watch",
              value: sentryCount,
              icon: Icons.Shield,
              color: "text-amber-400",
              bg: "from-amber-500/20 to-orange-500/20",
            },
            {
              label: "Avg Velocity",
              value:
                avgSpeed > 0 ? `${(avgSpeed / 1000).toFixed(1)}K km/h` : "—",
              icon: Icons.Zap,
              color: "text-purple-400",
              bg: "from-purple-500/20 to-violet-500/20",
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`p-4 rounded-2xl bg-gradient-to-br ${stat.bg} border border-white/10 backdrop-blur-sm`}
            >
              <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                {stat.label}
              </p>
              <p className="text-xl font-bold text-white mt-1">
                {typeof stat.value === "number"
                  ? stat.value.toLocaleString()
                  : stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ── Controls ───────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
          {viewMode === "feed" && (
            <div className="flex flex-wrap gap-3 items-end">
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50"
                />
              </div>
              <button
                onClick={loadFeed}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-amber-500/20"
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          )}

          <div className="flex-1" />

          {/* Search + filter */}
          <div className="flex gap-3 items-center">
            <div className="relative">
              <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 w-56"
              />
            </div>
            <button
              onClick={() => setShowHazardousOnly(!showHazardousOnly)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                showHazardousOnly
                  ? "bg-red-500/20 border-red-500/40 text-red-400"
                  : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
              }`}
            >
              ⚠️ Hazardous Only
            </button>
          </div>
        </div>

        {/* ── Loading / Error ────────────────────────────────────────────── */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            >
              <Icons.Loader className="w-8 h-8 text-amber-400" />
            </motion.div>
            <p className="ml-3 text-slate-400">Scanning near-Earth space...</p>
          </div>
        )}

        {error && !loading && (
          <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-center">
            <Icons.Alert className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <p className="text-red-400 font-medium">{error}</p>
            <button
              onClick={viewMode === "feed" ? loadFeed : loadBrowse}
              className="mt-3 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm hover:bg-red-500/30 transition-all"
            >
              Retry
            </button>
          </div>
        )}

        {/* ── Date-grouped Cards (Feed Mode) ─────────────────────────────── */}
        {!loading && !error && viewMode === "feed" && feedData && (
          <div className="space-y-8">
            {feedData.element_count > 0 && (
              <p className="text-sm text-slate-400">
                Showing{" "}
                <span className="text-white font-medium">
                  {filteredNeos.length}
                </span>{" "}
                of {feedData.element_count} objects from{" "}
                <span className="text-amber-400">{startDate}</span> to{" "}
                <span className="text-amber-400">{endDate}</span>
              </p>
            )}

            {Object.keys(feedData.near_earth_objects)
              .sort()
              .map((date) => {
                const dayNeos = feedData.near_earth_objects[date].filter(
                  (neo) => {
                    if (
                      showHazardousOnly &&
                      !neo.is_potentially_hazardous_asteroid
                    )
                      return false;
                    if (searchQuery) {
                      const q = searchQuery.toLowerCase();
                      return (
                        neo.name.toLowerCase().includes(q) || neo.id.includes(q)
                      );
                    }
                    return true;
                  },
                );

                if (dayNeos.length === 0) return null;

                return (
                  <div key={date}>
                    <div className="flex items-center gap-3 mb-4">
                      <Icons.Calendar className="w-4 h-4 text-amber-400" />
                      <h2 className="text-lg font-semibold text-white">
                        {new Date(date + "T12:00:00").toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </h2>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-slate-400">
                        {dayNeos.length} object{dayNeos.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {dayNeos.map((neo, i) => (
                        <NeoCard key={neo.id} neo={neo} index={i} />
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {/* ── Grid Cards (Browse Mode) ───────────────────────────────────── */}
        {!loading && !error && viewMode === "browse" && browseData && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">
                Page{" "}
                <span className="text-white font-medium">
                  {browseData.page.number + 1}
                </span>{" "}
                of {browseData.page.total_pages.toLocaleString()} —{" "}
                <span className="text-cyan-400">
                  {browseData.page.total_elements.toLocaleString()}
                </span>{" "}
                total objects
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredNeos.map((neo, i) => (
                <NeoCard key={neo.id} neo={neo} index={i} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                onClick={() => setBrowsePage((p) => Math.max(0, p - 1))}
                disabled={browsePage === 0}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all flex items-center gap-1"
              >
                <Icons.ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <span className="text-sm text-slate-400 px-4">
                {browsePage + 1} /{" "}
                {browseData.page.total_pages.toLocaleString()}
              </span>
              <button
                onClick={() => setBrowsePage((p) => p + 1)}
                disabled={browsePage >= browseData.page.total_pages - 1}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all flex items-center gap-1"
              >
                Next <Icons.ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── Empty state ────────────────────────────────────────────────── */}
        {!loading && !error && filteredNeos.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Icons.Target className="w-10 h-10 text-slate-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No Objects Found
            </h3>
            <p className="text-slate-500 max-w-md mx-auto">
              {showHazardousOnly
                ? "No potentially hazardous asteroids matched your criteria. Try widening the date range or disabling the hazardous filter."
                : "No near-earth objects found for the selected criteria. Try a different date range."}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

// ─── Neo Card Component ─────────────────────────────────────────────────────

function NeoCard({ neo, index }: { neo: NeoObject; index: number }) {
  const threat = getThreatInfo(neo);
  const approach = neo.close_approach_data[0];
  const distKm = approach ? parseFloat(approach.miss_distance.kilometers) : 0;
  const velocityKph = approach
    ? parseFloat(approach.relative_velocity.kilometers_per_hour)
    : 0;
  const lunarDist = approach ? parseFloat(approach.miss_distance.lunar) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
    >
      <Link href={`/neo/${neo.id}`}>
        <div className="group relative p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300 cursor-pointer h-full">
          {/* Hazard glow */}
          {neo.is_potentially_hazardous_asteroid && (
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none" />
          )}

          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white truncate group-hover:text-amber-400 transition-colors">
                {neo.name}
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                ID: {neo.id}
              </p>
            </div>
            <span
              className={`ml-2 shrink-0 px-2 py-0.5 text-xs rounded-full border font-medium ${threat.bg} ${threat.border} ${threat.color}`}
            >
              {threat.level}
            </span>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            {approach && (
              <>
                <div className="p-2 rounded-lg bg-white/5">
                  <p className="text-[10px] text-slate-500 uppercase">
                    Miss Distance
                  </p>
                  <p className="text-sm font-medium text-white">
                    {formatDistance(distKm)}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {lunarDist.toFixed(2)} LD
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-white/5">
                  <p className="text-[10px] text-slate-500 uppercase">
                    Velocity
                  </p>
                  <p className="text-sm font-medium text-white">
                    {formatVelocity(velocityKph)}
                  </p>
                </div>
              </>
            )}
            <div className="p-2 rounded-lg bg-white/5">
              <p className="text-[10px] text-slate-500 uppercase">
                Est. Diameter
              </p>
              <p className="text-sm font-medium text-white">
                {formatDiameter(neo)}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-white/5">
              <p className="text-[10px] text-slate-500 uppercase">Magnitude</p>
              <p className="text-sm font-medium text-white">
                {neo.absolute_magnitude_h.toFixed(2)} H
              </p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {neo.is_potentially_hazardous_asteroid && (
              <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] rounded-full bg-red-500/15 border border-red-500/25 text-red-400">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />{" "}
                Hazardous
              </span>
            )}
            {neo.is_sentry_object && (
              <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] rounded-full bg-amber-500/15 border border-amber-500/25 text-amber-400">
                Sentry
              </span>
            )}
            {approach && (
              <span className="px-2 py-0.5 text-[10px] rounded-full bg-white/5 text-slate-400">
                {approach.close_approach_date}
              </span>
            )}
            {approach && (
              <span className="px-2 py-0.5 text-[10px] rounded-full bg-white/5 text-slate-400">
                Orbiting: {approach.orbiting_body}
              </span>
            )}
          </div>

          {/* Hover arrow */}
          <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
            <Icons.ExternalLink className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
