"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  fetchMarsDashboard,
  fetchMarsWeather,
  MarsDashboard,
  MarsRover,
  MarsOrbiter,
  MarsWeather,
} from "@/lib/api";

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
  Camera: ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  ),
  Satellite: ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M13 7 9 3 5 7l4 4" />
      <path d="m17 11 4 4-4 4-4-4" />
      <path d="m8 12 4 4 6-6-4-4Z" />
      <path d="m16 8 3-3" />
      <path d="M9 21a6 6 0 0 0-6-6" />
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
  Rocket: ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
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
  MapPin: ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
};

const AGENCY_COLORS: Record<string, string> = {
  NASA: "from-blue-500 to-cyan-500",
  ISRO: "from-orange-500 to-amber-500",
  ESA: "from-indigo-500 to-violet-500",
  "ESA/Roscosmos": "from-indigo-500 to-blue-500",
  CNSA: "from-red-500 to-rose-500",
  UAESA: "from-green-500 to-emerald-500",
};

function RoverCard({
  rover,
  onClick,
}: {
  rover: MarsRover;
  onClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:bg-white/[0.07] transition-all cursor-pointer"
      onClick={onClick}
    >
      {/* Photo strip */}
      {rover.latestPhotos.length > 0 && (
        <div className="grid grid-cols-2 gap-0.5 h-32 overflow-hidden">
          {rover.latestPhotos.slice(0, 4).map((photo, i) => (
            <div key={photo.id || i} className="overflow-hidden">
              <img
                src={photo.img_src}
                alt={`${rover.name} photo`}
                className="w-full h-full object-cover hover:scale-110 transition-transform"
              />
            </div>
          ))}
        </div>
      )}
      {rover.latestPhotos.length === 0 && (
        <div className="h-32 bg-gradient-to-br from-red-900/40 to-orange-900/40 flex items-center justify-center">
          <Icons.Camera className="w-8 h-8 text-gray-500" />
        </div>
      )}

      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-white">{rover.name}</h3>
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 text-xs rounded-full font-medium ${
                rover.status === "active"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
              }`}
            >
              {rover.status === "active" ? "● Active" : "○ " + rover.status}
            </span>
            <span
              className={`px-2 py-1 text-xs rounded-full bg-gradient-to-r ${AGENCY_COLORS[rover.agency] || "from-gray-500 to-gray-600"} text-white`}
            >
              {rover.agency}
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-400 mb-4">{rover.description}</p>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-white/5">
            <p className="text-xs text-gray-500">Landing Site</p>
            <p className="text-sm font-medium text-white mt-0.5">
              {rover.landingSite}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white/5">
            <p className="text-xs text-gray-500">Landing Date</p>
            <p className="text-sm font-medium text-white mt-0.5">
              {new Date(rover.landingDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white/5">
            <p className="text-xs text-gray-500">Total Photos</p>
            <p className="text-sm font-bold text-emerald-400 mt-0.5">
              {rover.totalPhotos.toLocaleString()}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white/5">
            <p className="text-xs text-gray-500">Max Sol</p>
            <p className="text-sm font-bold text-cyan-400 mt-0.5">
              {rover.maxSol.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function OrbiterCard({ orbiter }: { orbiter: MarsOrbiter }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-all"
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${AGENCY_COLORS[orbiter.agency] || "from-gray-500 to-gray-600"} flex items-center justify-center shrink-0`}
        >
          <Icons.Satellite className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-bold text-white truncate">
              {orbiter.name}
            </h3>
            <span
              className={`px-2 py-0.5 text-xs rounded-full shrink-0 ${
                orbiter.status === "active"
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-gray-500/20 text-gray-400"
              }`}
            >
              {orbiter.status}
            </span>
          </div>
          <p className="text-xs text-gray-400 mb-2">{orbiter.description}</p>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span
              className={`px-1.5 py-0.5 rounded bg-gradient-to-r ${AGENCY_COLORS[orbiter.agency] || "from-gray-500 to-gray-600"} text-white`}
            >
              {orbiter.agency}
            </span>
            <span>
              Launched:{" "}
              {new Date(orbiter.launchDate).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function MarsPage() {
  const [data, setData] = useState<MarsDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRover, setSelectedRover] = useState<MarsRover | null>(null);
  const [tab, setTab] = useState<"rovers" | "orbiters" | "weather">("rovers");
  const [marsWeather, setMarsWeather] = useState<MarsWeather | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [marsData, weatherData] = await Promise.all([
          fetchMarsDashboard(),
          fetchMarsWeather(),
        ]);
        setData(marsData);
        setMarsWeather(weatherData);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-red-400 text-lg">Connecting to Mars...</p>
        </div>
      </div>
    );
  }

  const rovers = data?.rovers || [];
  const orbiters = data?.orbiters || [];
  const activeOrbiters = orbiters.filter((o) => o.status === "active").length;
  const activeRovers = rovers.filter((r) => r.status === "active").length;
  const totalPhotos = rovers.reduce((sum, r) => sum + r.totalPhotos, 0);

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-transparent to-orange-900/15" />
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

      {/* Header */}
      <header className="relative z-20 border-b border-white/10 backdrop-blur-xl bg-[#0B0F1A]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg shadow-red-500/20">
              <span className="text-xl">🔴</span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                Mars Exploration
              </h1>
              <p className="text-sm text-slate-400">
                Rovers, orbiters &amp; surface operations
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Hero Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-gradient-to-br from-red-500 to-orange-600 p-[1px]"
        >
          <div className="rounded-3xl bg-[#0f0f1f] p-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              The Red Planet
            </h2>
            <p className="text-gray-400 max-w-2xl mb-6">
              Mars is the most explored planet beyond Earth, with multiple
              active rovers and orbiters studying its geology, atmosphere, and
              potential for past or present life.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-white/5 text-center">
                <p className="text-3xl font-bold text-red-400">
                  {activeRovers}
                </p>
                <p className="text-xs text-gray-500 mt-1">Active Rovers</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 text-center">
                <p className="text-3xl font-bold text-orange-400">
                  {activeOrbiters}
                </p>
                <p className="text-xs text-gray-500 mt-1">Active Orbiters</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 text-center">
                <p className="text-3xl font-bold text-amber-400">
                  {totalPhotos.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">Total Photos</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 text-center">
                <p className="text-3xl font-bold text-cyan-400">
                  {rovers.length + orbiters.length}
                </p>
                <p className="text-xs text-gray-500 mt-1">Total Missions</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 rounded-xl bg-white/5 border border-white/10 w-fit">
          {[
            {
              key: "rovers" as const,
              label: `Rovers (${rovers.length})`,
              icon: "🤖",
            },
            {
              key: "orbiters" as const,
              label: `Orbiters (${orbiters.length})`,
              icon: "🛰️",
            },
            { key: "weather" as const, label: "Weather", icon: "🌡️" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                tab === t.key
                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === "rovers" && (
            <motion.div
              key="rovers"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rovers.map((rover) => (
                  <RoverCard
                    key={rover.name}
                    rover={rover}
                    onClick={() => setSelectedRover(rover)}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {tab === "orbiters" && (
            <motion.div
              key="orbiters"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {orbiters.map((orbiter) => (
                  <OrbiterCard key={orbiter.name} orbiter={orbiter} />
                ))}
              </div>
            </motion.div>
          )}

          {tab === "weather" && (
            <motion.div
              key="weather"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {marsWeather ? (
                <>
                  {/* Current Conditions */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 text-center">
                      <p className="text-4xl font-bold text-red-400">
                        {marsWeather.currentConditions.temperature.avg}°C
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Avg Temperature
                      </p>
                      <p className="text-[10px] text-gray-600">
                        {marsWeather.currentConditions.temperature.min}° /{" "}
                        {marsWeather.currentConditions.temperature.max}°
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                      <p className="text-4xl font-bold text-orange-400">
                        {marsWeather.currentConditions.pressure.avg}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Pressure (Pa)
                      </p>
                      <p className="text-[10px] text-gray-600">
                        {marsWeather.currentConditions.pressure.min} -{" "}
                        {marsWeather.currentConditions.pressure.max}
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                      <p className="text-4xl font-bold text-cyan-400">
                        {marsWeather.currentConditions.windSpeed.avg}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Wind (m/s)</p>
                      <p className="text-[10px] text-gray-600">
                        Max: {marsWeather.currentConditions.windSpeed.max} m/s{" "}
                        {marsWeather.currentConditions.windDirection}
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                      <p className="text-4xl font-bold text-amber-400">
                        Sol {marsWeather.currentConditions.sol}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Mars Day</p>
                      <p className="text-[10px] text-gray-600">
                        {marsWeather.currentConditions.opacity} • UV:{" "}
                        {marsWeather.currentConditions.uvIndex}
                      </p>
                    </div>
                  </div>

                  {/* Season & Extra Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <span>🌍</span> Mars Season
                      </h3>
                      <p className="text-white font-medium mb-2">
                        {marsWeather.currentConditions.season}
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between py-1.5 border-b border-white/5 text-sm">
                          <span className="text-gray-400">
                            Surface Pressure
                          </span>
                          <span className="text-white">
                            {marsWeather.atmosphere.surfacePressure}
                          </span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-white/5 text-sm">
                          <span className="text-gray-400">Scale Height</span>
                          <span className="text-white">
                            {marsWeather.atmosphere.scaleHeight}
                          </span>
                        </div>
                        <div className="flex justify-between py-1.5 text-sm">
                          <span className="text-gray-400">Data Source</span>
                          <span className="text-gray-300 text-xs">
                            {marsWeather.source}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <span>🌪️</span> Dust Storms
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-3 h-3 rounded-full ${marsWeather.dustStorms.global ? "bg-red-400 animate-pulse" : "bg-emerald-400"}`}
                          />
                          <div>
                            <p className="text-sm text-white">
                              {marsWeather.dustStorms.global
                                ? "GLOBAL STORM ACTIVE"
                                : "No Global Storm"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {marsWeather.dustStorms.regional}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">
                          Last major storm:{" "}
                          {marsWeather.dustStorms.lastMajorStorm}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Atmospheric Composition */}
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                    <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                      <span>💨</span> Atmospheric Composition
                    </h3>
                    <div className="space-y-2">
                      {marsWeather.atmosphere.composition.map((gas) => (
                        <div key={gas.gas} className="flex items-center gap-3">
                          <span className="text-xs text-gray-400 w-40 truncate">
                            {gas.gas}
                          </span>
                          <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${Math.min(100, gas.percentage)}%`,
                              }}
                              transition={{ duration: 1, delay: 0.2 }}
                              className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-500"
                            />
                          </div>
                          <span className="text-xs text-white font-mono w-14 text-right">
                            {gas.percentage}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">Loading Mars weather data...</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mars Facts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-2xl bg-white/5 border border-white/10"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Icons.Globe className="w-5 h-5 text-red-400" /> Mars Facts
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Diameter", value: "6,779 km" },
              { label: "Distance from Sun", value: "228M km" },
              { label: "Day Length", value: "24h 37m" },
              { label: "Year Length", value: "687 days" },
              { label: "Gravity", value: "3.72 m/s²" },
              { label: "Temperature", value: "-60°C avg" },
              { label: "Atmosphere", value: "95.3% CO₂" },
              { label: "Moons", value: "Phobos, Deimos" },
            ].map((f) => (
              <div
                key={f.label}
                className="p-3 rounded-xl bg-white/5 text-center"
              >
                <p className="text-xs text-gray-500">{f.label}</p>
                <p className="text-sm font-bold text-white mt-1">{f.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="flex justify-center pt-4 pb-8">
          <Link
            href="/dashboard"
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-medium hover:opacity-90 transition-all shadow-lg shadow-red-500/20"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </main>

      {/* Rover Detail Modal */}
      <AnimatePresence>
        {selectedRover && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedRover(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#0f0f1f] rounded-3xl border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal photos */}
              {selectedRover.latestPhotos.length > 0 && (
                <div className="grid grid-cols-2 gap-0.5 h-48 overflow-hidden rounded-t-3xl">
                  {selectedRover.latestPhotos.slice(0, 4).map((photo, i) => (
                    <div key={photo.id || i} className="overflow-hidden">
                      <img
                        src={photo.img_src}
                        alt={`${selectedRover.name}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedRover.name}</h2>
                    <p className="text-sm text-gray-400">
                      {selectedRover.agency} • {selectedRover.status}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedRover(null)}
                    className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-sm text-gray-300 leading-relaxed">
                  {selectedRover.description}
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      icon: Icons.Calendar,
                      label: "Launch Date",
                      value: new Date(
                        selectedRover.launchDate,
                      ).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      }),
                    },
                    {
                      icon: Icons.MapPin,
                      label: "Landing Date",
                      value: new Date(
                        selectedRover.landingDate,
                      ).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      }),
                    },
                    {
                      icon: Icons.MapPin,
                      label: "Landing Site",
                      value: selectedRover.landingSite,
                    },
                    {
                      icon: Icons.Rocket,
                      label: "Agency",
                      value: selectedRover.agency,
                    },
                    {
                      icon: Icons.Camera,
                      label: "Total Photos",
                      value: selectedRover.totalPhotos.toLocaleString(),
                    },
                    {
                      icon: Icons.Globe,
                      label: "Days on Mars",
                      value: `Sol ${selectedRover.maxSol.toLocaleString()}`,
                    },
                  ].map((item) => (
                    <div key={item.label} className="p-3 rounded-xl bg-white/5">
                      <div className="flex items-center gap-2 mb-1">
                        <item.icon className="w-3.5 h-3.5 text-red-400" />
                        <p className="text-xs text-gray-500">{item.label}</p>
                      </div>
                      <p className="text-sm font-medium text-white">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                {selectedRover.latestPhotos.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">
                      Latest Photos from Mars
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedRover.latestPhotos.map((photo, i) => (
                        <div
                          key={photo.id || i}
                          className="rounded-xl overflow-hidden"
                        >
                          <img
                            src={photo.img_src}
                            alt={photo.camera.full_name}
                            className="w-full h-32 object-cover"
                          />
                          <div className="p-2 bg-white/5 text-xs text-gray-500">
                            {photo.camera.full_name} • {photo.earth_date}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
