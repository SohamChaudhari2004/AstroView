"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { BentoGrid, BentoGridItem } from "@/components/ui/BentoGrid";

// ─── Types ──────────────────────────────────────────────────────────────────

interface APODData {
  date: string;
  explanation: string;
  hdurl?: string;
  media_type: string;
  title: string;
  url: string;
  copyright?: string;
  thumbnail_url?: string;
}

// ─── Icons ──────────────────────────────────────────────────────────────────

const RefreshIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
    />
  </svg>
);

const ExpandIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
    />
  </svg>
);

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

// ─── Main Page ──────────────────────────────────────────────────────────────

const LandingPage = () => {
  const [apod, setApod] = useState<APODData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showFullExplanation, setShowFullExplanation] = useState(false);

  const fetchRandomAPOD = useCallback(async () => {
    setLoading(true);
    setError("");
    setImageLoaded(false);
    setShowFullExplanation(false);
    try {
      const res = await fetch("http://localhost:5001/api/apod/random?count=1");
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to fetch APOD");
      const items = json.data;
      if (items && items.length > 0) {
        setApod(items[0]);
      }
    } catch (err: any) {
      console.error("APOD fetch error:", err);
      setError(err.message || "Failed to load Astronomy Picture of the Day");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRandomAPOD();
  }, [fetchRandomAPOD]);

  return (
    <div className="min-h-screen flex flex-col items-center">
    <div className="flex gap-5 mt-10 ml-5">
      {/* ─── Hero Text ────────────────────────────────────────────── */}

      {/* ─── APOD Hero Image ──────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.7 }}
        className="w-full max-w-7xl mx-auto px-4"
      >
        <AnimatePresence mode="wait">
          {/* Loading Skeleton */}
          {loading && !apod && (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-3xl border border-white/10 overflow-hidden"
            >
              <div className="w-full h-[50vh] md:h-[70vh] bg-white/5 animate-pulse" />
              <div className="p-8 space-y-4">
                <div className="h-6 bg-white/10 rounded-lg w-2/5 animate-pulse" />
                <div className="h-3 bg-white/5 rounded w-full animate-pulse" />
                <div className="h-3 bg-white/5 rounded w-5/6 animate-pulse" />
              </div>
            </motion.div>
          )}

          {/* Error State */}
          {error && !apod && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="glass-card rounded-3xl border border-red-500/20 p-12 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <p className="text-red-400 text-sm mb-4">{error}</p>
              <button
                onClick={fetchRandomAPOD}
                className="px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-sm transition-all"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {/* APOD Content */}
          {apod && (
            <motion.div
              key={apod.date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Full-width Image */}
              <div className="relative w-full h-[50vh] md:h-[70vh] rounded-3xl overflow-hidden border border-white/10 group">
                {apod.media_type === "image" ? (
                  <>
                    {!imageLoaded && (
                      <div className="absolute inset-0 bg-gradient-to-br from-violet-900/30 to-cyan-900/20 animate-pulse" />
                    )}
                    <img
                      src={apod.url}
                      alt={apod.title}
                      className={`w-full h-full object-cover transition-all duration-700 ${
                        imageLoaded
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-105"
                      }`}
                      onLoad={() => setImageLoaded(true)}
                    />
                    {apod.hdurl && (
                      <a
                        href={apod.hdurl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"
                      >
                        <div className="flex items-center gap-2 px-5 py-3 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 text-white text-sm font-medium">
                          <ExpandIcon />
                          View Full Resolution
                        </div>
                      </a>
                    )}
                  </>
                ) : apod.media_type === "video" ? (
                  <iframe
                    src={apod.url}
                    title={apod.title}
                    className="w-full h-full"
                    allowFullScreen
                    allow="autoplay; encrypted-media"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-violet-900/20 to-cyan-900/10 flex items-center justify-center">
                    <p className="text-slate-400">Media not available</p>
                  </div>
                )}

                {/* Gradient overlay at bottom of image */}
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0B0F1A] via-[#0B0F1A]/60 to-transparent pointer-events-none" />

                {/* Title overlay on image */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <h3 className="text-2xl md:text-4xl font-bold text-white mb-2 leading-tight tracking-tight drop-shadow-lg">
                    {apod.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-medium border border-amber-500/30 backdrop-blur-sm">
                      <CalendarIcon />
                      {formatDate(apod.date)}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 backdrop-blur-sm">
                      {apod.media_type}
                    </span>
                    {apod.copyright && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] text-slate-300 bg-white/10 border border-white/20 backdrop-blur-sm">
                        &copy; {apod.copyright.trim()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Description below image */}
              <div className="glass-card rounded-3xl border border-white/10 mt-4 p-6 md:p-8">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20">
                      <svg
                        className="w-5 h-5 text-amber-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                    </div>
                    <h4 className="text-lg font-bold text-white">
                      Astronomy Picture of the Day
                    </h4>
                  </div>
                  <button
                    onClick={fetchRandomAPOD}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/30 text-slate-300 hover:text-cyan-400 text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                  >
                    <span className={loading ? "animate-spin" : ""}>
                      <RefreshIcon />
                    </span>
                    {loading ? "Loading..." : "Surprise Me"}
                  </button>
                </div>

                {/* Explanation */}
                <div className="mb-5">
                  <div className="relative">
                    <p
                      className={`text-slate-300 text-sm leading-relaxed ${
                        showFullExplanation
                          ? "max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 pr-2"
                          : "line-clamp-4"
                      }`}
                    >
                      {apod.explanation}
                    </p>
                    {apod.explanation.length > 250 && (
                      <button
                        onClick={() =>
                          setShowFullExplanation(!showFullExplanation)
                        }
                        className="mt-2 text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                      >
                        {showFullExplanation ? "Show less" : "Read more..."}
                      </button>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                  {apod.hdurl && (
                    <a
                      href={apod.hdurl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500/10 to-cyan-500/5 hover:from-cyan-500/20 hover:to-cyan-500/10 text-cyan-400 rounded-xl text-xs font-medium border border-cyan-500/20 transition-all"
                    >
                      <ExpandIcon />
                      HD Image
                    </a>
                  )}
                  <a
                    href={`https://apod.nasa.gov/apod/ap${apod.date.replace(/-/g, "").slice(2)}.html`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-xl text-xs font-medium border border-purple-500/20 transition-all"
                  >
                    <ExternalLinkIcon />
                    View on NASA
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      <section className="w-full mt-20 max-w-7xl mx-auto flex flex-col items-center text-center pt-10 pb-8 md:pt-16 md:pb-10 px-4 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px] -z-10"
        />
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-gray-500 mb-4 tracking-tighter"
        >
          Explore the <br />
          <span className="text-glow-cyan bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-violet-500">
            Cosmos
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mb-8 leading-relaxed"
        >
          Real-time space intelligence at your fingertips. Track asteroids,
          monitor solar storms, and explore the universe with NASA&apos;s live
          data.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 mb-2"
        >
          <Link href="/dashboard">
            <button className="px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:bg-gray-200 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
              Dashboard
            </button>
          </Link>
          <Link href="/solar-system">
            <button className="px-8 py-4 rounded-full glass border border-white/10 text-white font-medium hover:bg-white/10 transition-all">
              View Solar System
            </button>
          </Link>
        </motion.div>
      </section>

      </div>
      {/* ─── Features Bento Grid ─────────────────────────────────── */}
      <section className="w-full max-w-7xl mx-auto py-20 px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-white/80">
          Mission Control Capabilities
        </h2>
        <BentoGrid>
          <BentoGridItem
            title="Real-Time NEO Tracking"
            description="Monitor Near-Earth Objects and potentially hazardous asteroids in real-time."
            header={
              <div className="flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-800 border border-white/5 flex items-center justify-center text-4xl">
                ☄️
              </div>
            }
            className="md:col-span-2"
            icon={
              <svg
                className="w-5 h-5 text-neutral-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            }
          />
          <BentoGridItem
            title="Solar Weather"
            description="Live data on solar flares, CMEs, and geomagnetic storms."
            header={
              <div className="flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-amber-900/50 to-orange-900/50 border border-amber-500/20 flex items-center justify-center text-4xl">
                ☀️
              </div>
            }
            className="md:col-span-1"
            icon={
              <svg
                className="w-5 h-5 text-amber-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>
            }
          />
          <BentoGridItem
            title="Mars Exploration"
            description="Latest photos from Curiosity and Perseverance rovers."
            header={
              <div className="flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-red-900/50 to-orange-900/50 border border-red-500/20 flex items-center justify-center text-4xl">
                🔴
              </div>
            }
            className="md:col-span-1"
            icon={
              <svg
                className="w-5 h-5 text-red-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
              </svg>
            }
          />
          <BentoGridItem
            title="Satellite Tracker"
            description="Track ISS, Hubble, and Starlink satellites with orbital data."
            header={
              <div className="flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-cyan-900/50 to-blue-900/50 border border-cyan-500/20 flex items-center justify-center text-4xl">
                🛰️
              </div>
            }
            className="md:col-span-2"
            icon={
              <svg
                className="w-5 h-5 text-cyan-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path d="M13 7 9 3 5 7l4 4" />
                <path d="m17 11 4 4-4 4-4-4" />
                <path d="m8 12 4 4 6-6-4-4Z" />
              </svg>
            }
          />
        </BentoGrid>
      </section>
    </div>
  );
};

export default LandingPage;
