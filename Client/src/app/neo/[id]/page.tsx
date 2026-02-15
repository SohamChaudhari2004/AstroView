"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  fetchAsteroidById,
  Asteroid,
  fetchNeoLookup,
  NeoObject,
} from "@/lib/api";

// Icons
const Icons = {
  Back: ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
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
  Maximize: ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M8 3H5a2 2 0 0 0-2 2v3" />
      <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
      <path d="M3 16v3a2 2 0 0 0 2 2h3" />
      <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
    </svg>
  ),
  Activity: ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  Clock: ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Info: ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  ),
};

const MOON_DISTANCE_KM = 384400;

function formatDistanceFull(km: number): string {
  if (km > 1000000) return `${(km / 1000000).toFixed(2)} million km`;
  if (km > 1000) return `${(km / 1000).toFixed(1)}K km`;
  return `${km.toFixed(0)} km`;
}

function formatVelocityFull(kph: number): string {
  return `${kph.toLocaleString(undefined, { maximumFractionDigits: 0 })} km/h`;
}

function getThreatLevel(missDistanceKm: number): {
  level: string;
  color: string;
  bg: string;
  description: string;
  percentage: number;
} {
  const lunarDistances = missDistanceKm / MOON_DISTANCE_KM;
  if (lunarDistances < 0.5) {
    return {
      level: "EXTREME",
      color: "text-red-400",
      bg: "from-red-500 to-rose-600",
      description:
        "Extremely close approach — within half the Earth-Moon distance. Active monitoring required.",
      percentage: 95,
    };
  }
  if (lunarDistances < 1) {
    return {
      level: "HIGH",
      color: "text-orange-400",
      bg: "from-orange-500 to-amber-600",
      description:
        "Very close approach — closer than the Moon. This object is being closely tracked.",
      percentage: 75,
    };
  }
  if (lunarDistances < 5) {
    return {
      level: "MODERATE",
      color: "text-yellow-400",
      bg: "from-yellow-500 to-amber-500",
      description:
        "Moderately close approach — within 5 lunar distances. Standard monitoring in effect.",
      percentage: 50,
    };
  }
  if (lunarDistances < 20) {
    return {
      level: "LOW",
      color: "text-cyan-400",
      bg: "from-cyan-500 to-blue-500",
      description:
        "Distant pass — presents no immediate threat. Tracked for cataloging purposes.",
      percentage: 25,
    };
  }
  return {
    level: "MINIMAL",
    color: "text-green-400",
    bg: "from-green-500 to-emerald-500",
    description:
      "Very distant pass — no threat whatsoever. Routine observation.",
    percentage: 10,
  };
}

function getSizeComparisons(missDistanceKm: number) {
  const lunarDistances = missDistanceKm / MOON_DISTANCE_KM;
  return [
    {
      label: "Earth Radii",
      value: `${(missDistanceKm / 6371).toFixed(1)}`,
      icon: "🌍",
    },
    {
      label: "Lunar Distances",
      value: `${lunarDistances.toFixed(2)} LD`,
      icon: "🌙",
    },
    {
      label: "AU (Astronomical Units)",
      value: `${(missDistanceKm / 149597870.7).toFixed(6)} AU`,
      icon: "☀️",
    },
  ];
}

function getDaysUntilApproach(dateStr: string): number {
  const approachDate = new Date(dateStr);
  const now = new Date();
  return Math.ceil(
    (approachDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );
}

export default function NEOPage() {
  const router = useRouter();
  const params = useParams();
  const neoId = params.id as string;
  const [asteroid, setAsteroid] = useState<Asteroid | null>(null);
  const [neoDetail, setNeoDetail] = useState<NeoObject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAsteroid = async () => {
      try {
        // Try NeoWs Lookup API first (richer data)
        const neoData = await fetchNeoLookup(neoId).catch(() => null);
        if (neoData) {
          setNeoDetail(neoData);
          // Convert to Asteroid shape for backward-compat display
          const approach = neoData.close_approach_data[0];
          setAsteroid({
            _id: neoData.id,
            nasaId: neoData.neo_reference_id,
            name: neoData.name,
            isHazardous: neoData.is_potentially_hazardous_asteroid,
            closeApproachDate: approach?.close_approach_date || "",
            missDistanceKm: approach
              ? parseFloat(approach.miss_distance.kilometers)
              : 0,
            relativeVelocityKph: approach
              ? parseFloat(approach.relative_velocity.kilometers_per_hour)
              : 0,
            lastUpdated: new Date().toISOString(),
          });
        } else {
          // Fall back to MongoDB record
          const data = await fetchAsteroidById(neoId);
          setAsteroid(data);
        }
      } catch (error) {
        console.error("Error loading asteroid:", error);
      } finally {
        setLoading(false);
      }
    };
    loadAsteroid();
  }, [neoId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-amber-400 text-lg">Tracking asteroid data...</p>
        </div>
      </div>
    );
  }

  if (!asteroid) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex flex-col items-center justify-center text-white gap-4">
        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-2">
          <Icons.Target className="w-10 h-10 text-gray-500" />
        </div>
        <h1 className="text-2xl font-bold">Asteroid Not Found</h1>
        <p className="text-gray-500">
          This asteroid could not be located in our database.
        </p>
        <Link
          href="/dashboard"
          className="mt-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium hover:opacity-90 transition-all"
        >
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  const threat = getThreatLevel(asteroid.missDistanceKm);
  const distanceComparisons = getSizeComparisons(asteroid.missDistanceKm);
  const daysUntil = getDaysUntilApproach(asteroid.closeApproachDate);
  const isPast = daysUntil < 0;
  const lunarDistances = asteroid.missDistanceKm / MOON_DISTANCE_KM;
  const speedMach = asteroid.relativeVelocityKph / 1235; // Mach speed
  const speedBullet = asteroid.relativeVelocityKph / 4320; // relative to bullet speed

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-transparent to-red-900/20" />
        {[...Array(60)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ opacity: [0.1, 0.5, 0.1] }}
            transition={{ duration: Math.random() * 4 + 2, repeat: Infinity }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0a0a1a]/80 border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
          >
            <Icons.Back className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 flex-1">
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${threat.bg} flex items-center justify-center shadow-lg`}
            >
              <Icons.Alert className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{asteroid.name}</h1>
              <p className="text-xs text-gray-400">
                NASA ID: {asteroid.nasaId} • Near-Earth Object
              </p>
            </div>
          </div>
          {asteroid.isHazardous && (
            <span className="px-3 py-1.5 text-xs rounded-full border font-medium bg-red-500/20 border-red-500/50 text-red-400 animate-pulse">
              ⚠️ HAZARDOUS
            </span>
          )}
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${threat.bg} p-[1px]`}
        >
          <div className="rounded-3xl bg-[#0f0f1f] p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className={`px-3 py-1 text-xs rounded-full border font-bold ${
                      asteroid.isHazardous
                        ? "bg-red-500/20 border-red-500/50 text-red-400"
                        : "bg-green-500/20 border-green-500/50 text-green-400"
                    }`}
                  >
                    {asteroid.isHazardous
                      ? "⚠️ POTENTIALLY HAZARDOUS"
                      : "✓ NON-HAZARDOUS"}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">
                  {asteroid.name}
                </h2>
                <p className="text-gray-400">
                  Near-Earth asteroid tracked by NASA&apos;s Center for Near
                  Earth Object Studies (CNEOS).
                  {asteroid.isHazardous &&
                    " Classified as potentially hazardous due to its size and proximity to Earth's orbit."}
                </p>
              </div>
              <div className="text-center md:text-right shrink-0">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                  {isPast ? "CLOSEST APPROACH" : "DAYS UNTIL APPROACH"}
                </p>
                <p
                  className={`text-4xl md:text-5xl font-mono font-bold ${threat.color}`}
                >
                  {isPast ? "PASSED" : `T-${daysUntil}`}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(asteroid.closeApproachDate).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Approach Date",
              value: new Date(asteroid.closeApproachDate).toLocaleDateString(
                "en-US",
                { month: "short", day: "numeric", year: "numeric" },
              ),
              icon: Icons.Calendar,
              color: "text-amber-400",
            },
            {
              label: "Miss Distance",
              value: formatDistanceFull(asteroid.missDistanceKm),
              icon: Icons.Target,
              color: "text-cyan-400",
            },
            {
              label: "Velocity",
              value: formatVelocityFull(asteroid.relativeVelocityKph),
              icon: Icons.Zap,
              color: "text-rose-400",
            },
            {
              label: "Threat Level",
              value: threat.level,
              icon: Icons.Shield,
              color: threat.color,
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-all"
            >
              <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
              <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">
                {stat.label}
              </p>
              <p className="font-semibold text-white">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Threat Assessment + Distance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Threat Assessment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10"
          >
            <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
              <Icons.Shield className={`w-5 h-5 ${threat.color}`} /> Threat
              Assessment
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${threat.bg} flex items-center justify-center shrink-0 shadow-lg`}
                >
                  <span className="text-2xl font-black text-white">
                    {threat.level.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className={`text-xl font-bold ${threat.color}`}>
                    {threat.level} THREAT
                  </p>
                  <p className="text-sm text-gray-400">{threat.description}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Threat Meter</span>
                  <span className={`font-bold ${threat.color}`}>
                    {threat.percentage}%
                  </span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${threat.percentage}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`h-full rounded-full bg-gradient-to-r ${threat.bg}`}
                  />
                </div>
              </div>
              {asteroid.isHazardous && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm">
                  <p className="text-red-400 font-medium">
                    ⚠️ Hazardous Classification
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    This asteroid is classified as potentially hazardous based
                    on its orbit and estimated size. It is being actively
                    monitored by planetary defense systems.
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Distance Context */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10"
          >
            <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
              <Icons.Maximize className="w-5 h-5 text-cyan-400" /> Distance
              Context
            </h3>
            <div className="space-y-4">
              {distanceComparisons.map((comp, i) => (
                <motion.div
                  key={comp.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-4 p-3 rounded-xl bg-white/5"
                >
                  <span className="text-2xl">{comp.icon}</span>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase">
                      {comp.label}
                    </p>
                    <p className="font-semibold text-white">{comp.value}</p>
                  </div>
                </motion.div>
              ))}

              {/* Visual distance bar */}
              <div className="mt-4 p-4 rounded-xl bg-black/20">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">
                  Distance Scale (Earth → Moon)
                </p>
                <div className="relative h-6 bg-white/10 rounded-full overflow-hidden">
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                    🌙 Moon
                  </div>
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                    🌍
                  </div>
                  {lunarDistances <= 2 && (
                    <motion.div
                      initial={{ left: "0%" }}
                      animate={{
                        left: `${Math.min(lunarDistances * 50, 95)}%`,
                      }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gradient-to-r from-amber-400 to-red-500 shadow-lg shadow-amber-500/50"
                    />
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  {lunarDistances > 2
                    ? `This asteroid passes at ${lunarDistances.toFixed(1)}× the Earth-Moon distance`
                    : `This asteroid passes at only ${lunarDistances.toFixed(2)}× the Earth-Moon distance`}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Velocity + Orbit Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Velocity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10"
          >
            <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
              <Icons.Zap className="w-5 h-5 text-rose-400" /> Velocity Analysis
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-white/5 text-center">
                <p className="text-xs text-gray-500 uppercase mb-1">Speed</p>
                <p className="text-2xl font-bold text-white">
                  {(asteroid.relativeVelocityKph / 1000).toFixed(1)}K
                </p>
                <p className="text-xs text-gray-500">km/h</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 text-center">
                <p className="text-xs text-gray-500 uppercase mb-1">km/s</p>
                <p className="text-2xl font-bold text-cyan-400">
                  {(asteroid.relativeVelocityKph / 3600).toFixed(1)}
                </p>
                <p className="text-xs text-gray-500">kilometers per second</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 text-center">
                <p className="text-xs text-gray-500 uppercase mb-1">
                  Mach Number
                </p>
                <p className="text-2xl font-bold text-amber-400">
                  {speedMach.toFixed(0)}
                </p>
                <p className="text-xs text-gray-500">× speed of sound</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 text-center">
                <p className="text-xs text-gray-500 uppercase mb-1">
                  vs Bullet
                </p>
                <p className="text-2xl font-bold text-rose-400">
                  {speedBullet.toFixed(0)}×
                </p>
                <p className="text-xs text-gray-500">faster than a bullet</p>
              </div>
            </div>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10"
          >
            <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
              <Icons.Info className="w-5 h-5 text-blue-400" /> Object Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between py-3 border-b border-white/5 text-sm">
                <span className="text-gray-400">NASA ID</span>
                <span className="text-white font-mono font-medium">
                  {asteroid.nasaId}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-white/5 text-sm">
                <span className="text-gray-400">Designation</span>
                <span className="text-white font-medium">{asteroid.name}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-white/5 text-sm">
                <span className="text-gray-400">Classification</span>
                <span
                  className={`font-medium ${asteroid.isHazardous ? "text-red-400" : "text-green-400"}`}
                >
                  {asteroid.isHazardous
                    ? "Potentially Hazardous"
                    : "Non-Hazardous"}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-white/5 text-sm">
                <span className="text-gray-400">Close Approach</span>
                <span className="text-white font-medium">
                  {new Date(asteroid.closeApproachDate).toLocaleDateString(
                    "en-US",
                    { month: "long", day: "numeric", year: "numeric" },
                  )}
                </span>
              </div>
              <div className="flex justify-between py-3 text-sm">
                <span className="text-gray-400">Last Updated</span>
                <span className="text-white font-medium">
                  {new Date(asteroid.lastUpdated).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* NASA JPL Link */}
            <div className="mt-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <a
                href={`https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=${asteroid.nasaId}&view=OPC`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Icons.Globe className="w-4 h-4" />
                View on NASA JPL Small-Body Database →
              </a>
            </div>
          </motion.div>
        </div>

        {/* Orbital Data (from NeoWs Lookup) */}
        {neoDetail?.orbital_data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10"
          >
            <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
              <Icons.Globe className="w-5 h-5 text-purple-400" /> Orbital Data
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
              {[
                {
                  label: "Orbit Class",
                  value: neoDetail.orbital_data.orbit_class?.orbit_class_type,
                },
                { label: "Orbit ID", value: neoDetail.orbital_data.orbit_id },
                {
                  label: "Eccentricity",
                  value: neoDetail.orbital_data.eccentricity,
                },
                {
                  label: "Semi-Major Axis",
                  value: `${neoDetail.orbital_data.semi_major_axis} AU`,
                },
                {
                  label: "Inclination",
                  value: `${neoDetail.orbital_data.inclination}°`,
                },
                {
                  label: "Orbital Period",
                  value: `${parseFloat(neoDetail.orbital_data.orbital_period).toFixed(1)} days`,
                },
                {
                  label: "Perihelion Distance",
                  value: `${neoDetail.orbital_data.perihelion_distance} AU`,
                },
                {
                  label: "Aphelion Distance",
                  value: `${neoDetail.orbital_data.aphelion_distance} AU`,
                },
                {
                  label: "Observations Used",
                  value: neoDetail.orbital_data.observations_used?.toString(),
                },
                {
                  label: "Data Arc",
                  value: `${neoDetail.orbital_data.data_arc_in_days} days`,
                },
                {
                  label: "First Observed",
                  value: neoDetail.orbital_data.first_observation_date,
                },
                {
                  label: "Last Observed",
                  value: neoDetail.orbital_data.last_observation_date,
                },
              ]
                .filter((item) => item.value)
                .map((item) => (
                  <div
                    key={item.label}
                    className="flex justify-between py-2.5 border-b border-white/5 text-sm"
                  >
                    <span className="text-gray-400">{item.label}</span>
                    <span className="text-white font-mono text-xs">
                      {item.value}
                    </span>
                  </div>
                ))}
            </div>
            {neoDetail.orbital_data.orbit_class?.orbit_class_description && (
              <p className="mt-4 text-xs text-slate-500 italic">
                {neoDetail.orbital_data.orbit_class.orbit_class_description}
              </p>
            )}
          </motion.div>
        )}

        {/* Estimated Diameter (from NeoWs Lookup) */}
        {neoDetail?.estimated_diameter && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10"
          >
            <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
              <Icons.Maximize className="w-5 h-5 text-amber-400" /> Estimated
              Size
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                {
                  label: "Kilometers",
                  min: neoDetail.estimated_diameter.kilometers
                    .estimated_diameter_min,
                  max: neoDetail.estimated_diameter.kilometers
                    .estimated_diameter_max,
                  unit: "km",
                },
                {
                  label: "Meters",
                  min: neoDetail.estimated_diameter.meters
                    .estimated_diameter_min,
                  max: neoDetail.estimated_diameter.meters
                    .estimated_diameter_max,
                  unit: "m",
                },
                {
                  label: "Miles",
                  min: neoDetail.estimated_diameter.miles
                    .estimated_diameter_min,
                  max: neoDetail.estimated_diameter.miles
                    .estimated_diameter_max,
                  unit: "mi",
                },
                {
                  label: "Feet",
                  min: neoDetail.estimated_diameter.feet.estimated_diameter_min,
                  max: neoDetail.estimated_diameter.feet.estimated_diameter_max,
                  unit: "ft",
                },
              ].map((d) => (
                <div
                  key={d.label}
                  className="p-4 rounded-xl bg-white/5 text-center"
                >
                  <p className="text-xs text-gray-500 uppercase mb-1">
                    {d.label}
                  </p>
                  <p className="text-lg font-bold text-white">
                    {d.min.toFixed(2)}
                  </p>
                  <p className="text-xs text-slate-500">
                    to {d.max.toFixed(2)} {d.unit}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Back */}
        <div className="flex justify-center pt-4 pb-8">
          <Link
            href="/neo"
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium hover:opacity-90 transition-all shadow-lg shadow-amber-500/20"
          >
            ← Back to NEO Tracker
          </Link>
        </div>
      </main>
    </div>
  );
}
