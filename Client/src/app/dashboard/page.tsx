"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  fetchDashboardData,
  fetchMissions,
  fetchMissionsByOrganization,
  fetchOrganizations,
  initializeMissions,
  fetchSpaceWeatherDashboard,
  Mission,
  Asteroid,
  SolarStorm,
  Satellite,
  DashboardData,
  SpaceWeatherDashboard,
} from "@/lib/api";

// Professional SVG Icons
const Icons = {
  Rocket: ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  ),
  Globe: ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  ),
  Satellite: ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M13 7 9 3 5 7l4 4" />
      <path d="m17 11 4 4-4 4-4-4" />
      <path d="m8 12 4 4 6-6-4-4Z" />
      <path d="m16 8 3-3" />
      <path d="M9 21a6 6 0 0 0-6-6" />
    </svg>
  ),
  Sun: ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
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
  ),
  Alert: ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  ),
  Refresh: ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  ),
  ChevronDown: ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  ),
  Clock: ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Target: ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
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
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Users: ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Eye: ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Calendar: ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  ),
  Activity: ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
};

const ORG_COLORS: Record<string, string> = {
  NASA: "from-blue-500 to-blue-600",
  ISRO: "from-orange-500 to-orange-600",
  ESA: "from-indigo-500 to-indigo-600",
  SpaceX: "from-gray-600 to-gray-700",
  CNSA: "from-red-500 to-red-600",
};

const ORG_BADGES: Record<string, string> = {
  NASA: "bg-blue-500/20 text-blue-400 border-blue-500/50",
  ISRO: "bg-orange-500/20 text-orange-400 border-orange-500/50",
  ESA: "bg-indigo-500/20 text-indigo-400 border-indigo-500/50",
  SpaceX: "bg-gray-500/20 text-gray-300 border-gray-500/50",
  CNSA: "bg-red-500/20 text-red-400 border-red-500/50",
};

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [missions, setMissions] = useState<Mission[]>([]);
  const [organizations, setOrganizations] = useState<string[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<string>("all");
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "neo" | "weather" | "satellites"
  >("overview");
  const [showAllNEO, setShowAllNEO] = useState(false);
  const [showAllMissions, setShowAllMissions] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [spaceWeather, setSpaceWeather] =
    useState<SpaceWeatherDashboard | null>(null);

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadData = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const [dashData, missionsData, orgsData, swData] = await Promise.all([
        fetchDashboardData(),
        fetchMissions(),
        fetchOrganizations(),
        fetchSpaceWeatherDashboard(),
      ]);
      setDashboardData(dashData);
      setMissions(missionsData);
      setOrganizations(
        orgsData.length > 0
          ? orgsData
          : ["NASA", "ISRO", "ESA", "SpaceX", "CNSA"],
      );
      setSpaceWeather(swData);
      setLastRefresh(new Date());

      // Initialize missions if empty
      if (missionsData.length === 0) {
        await initializeMissions();
        const newMissions = await fetchMissions();
        setMissions(newMissions);
      }
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadData]);

  const handleOrgSelect = async (org: string) => {
    setSelectedOrg(org);
    setShowOrgDropdown(false);
    if (org === "all") {
      const allMissions = await fetchMissions();
      setMissions(allMissions);
    } else {
      const filteredMissions = await fetchMissionsByOrganization(org);
      setMissions(filteredMissions);
    }
  };

  const ongoingMissions = missions.filter((m) => m.status === "ongoing");
  const upcomingMissions = missions.filter(
    (m) => m.status === "upcoming" || m.status === "planned",
  );

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  const formatDistance = (km: number) =>
    km > 1000000
      ? `${(km / 1000000).toFixed(1)}M km`
      : km > 1000
        ? `${(km / 1000).toFixed(0)}K km`
        : `${km.toFixed(0)} km`;
  const formatVelocity = (kph: number) => `${(kph / 1000).toFixed(1)}K km/h`;
  const getKpColor = (kp: number) =>
    kp >= 7
      ? "text-red-400"
      : kp >= 5
        ? "text-orange-400"
        : kp >= 3
          ? "text-yellow-400"
          : "text-green-400";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-violet-400 text-lg">Loading AstroView...</p>
        </div>
      </div>
    );
  }

  const { asteroids, solarStorms, satellites, kpIndex, systemStatus } =
    dashboardData || {
      asteroids: [],
      solarStorms: [],
      satellites: [],
      kpIndex: 0,
      systemStatus: {
        status: "stable" as const,
        threatLevel: "low" as const,
        lastUpdate: new Date().toISOString(),
      },
    };

  const displayedNEOs = showAllNEO ? asteroids : asteroids.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-transparent to-cyan-900/10" />
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
            animate={{ opacity: [0.1, 0.6, 0.1], scale: [1, 1.2, 1] }}
            transition={{
              duration: Math.random() * 4 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/10 backdrop-blur-xl bg-[#0B0F1A]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <Icons.Rocket className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  Mission Control
                </h1>
                <p className="text-sm text-slate-400">
                  Live Telemetry & Space Situational Awareness
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                <Icons.Clock className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-mono text-cyan-400">
                  {currentTime.toLocaleTimeString("en-US", {
                    hour12: true,
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>
              </div>
              <button
                onClick={loadData}
                disabled={isRefreshing}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all disabled:opacity-50"
              >
                <Icons.Refresh
                  className={`w-5 h-5 text-gray-400 ${isRefreshing ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-10">
          {/* Bento Grid Stats */}
          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Active Missions",
                value: ongoingMissions.length,
                icon: Icons.Rocket,
                gradient: "from-violet-500 to-purple-600",
                glow: "violet",
              },
              {
                label: "NEO Tracking",
                value: asteroids.length,
                icon: Icons.Target,
                gradient: "from-amber-500 to-orange-600",
                glow: "amber",
              },
              {
                label: "KP Index",
                value: kpIndex,
                icon: Icons.Activity,
                gradient: "from-cyan-500 to-blue-600",
                glow: "cyan",
              },
              {
                label: "Satellites",
                value: satellites.length,
                icon: Icons.Satellite,
                gradient: "from-emerald-500 to-teal-600",
                glow: "emerald",
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-white">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`p-2 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}
                  >
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 p-1 rounded-xl bg-white/5 border border-white/10 overflow-x-auto scrollbar-hide w-fit">
            {[
              { id: "overview", label: "Overview", icon: Icons.Globe },
              { id: "neo", label: "NEO Tracking", icon: Icons.Target },
              { id: "weather", label: "Space Weather", icon: Icons.Sun },
              { id: "satellites", label: "Satellites", icon: Icons.Satellite },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap text-sm ${
                  activeTab === tab.id
                    ? "bg-violet-500/20 text-violet-400 border border-violet-500/30"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Missions Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <Icons.Rocket className="w-5 h-5 text-violet-400" /> Space
                      Missions
                    </h2>
                    {/* Organization Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setShowOrgDropdown(!showOrgDropdown)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                      >
                        <span className="text-sm text-gray-300">
                          {selectedOrg === "all"
                            ? "All Organizations"
                            : selectedOrg}
                        </span>
                        <Icons.ChevronDown
                          className={`w-4 h-4 text-gray-400 transition-transform ${showOrgDropdown ? "rotate-180" : ""}`}
                        />
                      </button>
                      <AnimatePresence>
                        {showOrgDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute right-0 mt-2 w-48 rounded-xl bg-[#1a1a2e] border border-white/10 shadow-2xl overflow-hidden z-50"
                          >
                            <button
                              onClick={() => handleOrgSelect("all")}
                              className={`w-full px-4 py-2.5 text-left text-sm hover:bg-white/10 transition-all ${selectedOrg === "all" ? "bg-violet-500/20 text-violet-400" : "text-gray-300"}`}
                            >
                              All Organizations
                            </button>
                            {organizations.map((org) => (
                              <button
                                key={org}
                                onClick={() => handleOrgSelect(org)}
                                className={`w-full px-4 py-2.5 text-left text-sm hover:bg-white/10 transition-all flex items-center gap-2 ${selectedOrg === org ? "bg-violet-500/20 text-violet-400" : "text-gray-300"}`}
                              >
                                <span
                                  className={`w-2 h-2 rounded-full bg-gradient-to-r ${ORG_COLORS[org] || "from-gray-500 to-gray-600"}`}
                                />
                                {org}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Ongoing Missions */}
                  {ongoingMissions.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-emerald-400 flex items-center gap-2">
                        <Icons.Zap className="w-4 h-4" /> Ongoing Missions (
                        {ongoingMissions.length})
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {(showAllMissions
                          ? ongoingMissions
                          : ongoingMissions.slice(0, 3)
                        ).map((mission, i) => (
                          <Link
                            key={mission._id}
                            href={`/mission/${mission._id}`}
                          >
                            <MissionCard mission={mission} index={i} />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upcoming Missions */}
                  {upcomingMissions.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-amber-400 flex items-center gap-2">
                        <Icons.Calendar className="w-4 h-4" /> Upcoming Missions
                        ({upcomingMissions.length})
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {(showAllMissions
                          ? upcomingMissions
                          : upcomingMissions.slice(0, 3)
                        ).map((mission, i) => (
                          <Link
                            key={mission._id}
                            href={`/mission/${mission._id}`}
                          >
                            <MissionCard mission={mission} index={i} />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {missions.length > 6 && (
                    <button
                      onClick={() => setShowAllMissions(!showAllMissions)}
                      className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <Icons.Eye className="w-4 h-4" />
                      {showAllMissions
                        ? "Show Less"
                        : `View All ${missions.length} Missions`}
                    </button>
                  )}
                </div>

                {/* NEO Quick View */}
                <Section
                  title="Near-Earth Objects"
                  icon={<Icons.Target className="w-5 h-5 text-amber-400" />}
                  action={
                    asteroids.length > 4 && (
                      <button
                        onClick={() => setShowAllNEO(!showAllNEO)}
                        className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1"
                      >
                        {showAllNEO ? "Show Less" : "View All"}{" "}
                        <Icons.Eye className="w-4 h-4" />
                      </button>
                    )
                  }
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {displayedNEOs.map((neo, i) => (
                      <Link key={neo._id} href={`/neo/${neo._id}`}>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 hover:border-amber-500/40 transition-all cursor-pointer"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-amber-400 text-sm truncate">
                              {neo.name}
                            </h4>
                            <span className="px-2 py-0.5 text-[10px] rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                              HAZARD
                            </span>
                          </div>
                          <div className="space-y-1 text-xs text-gray-400">
                            <p>
                              Approach:{" "}
                              <span className="text-white">
                                {formatDate(neo.closeApproachDate)}
                              </span>
                            </p>
                            <p>
                              Distance:{" "}
                              <span className="text-white">
                                {formatDistance(neo.missDistanceKm)}
                              </span>
                            </p>
                            <p>
                              Velocity:{" "}
                              <span className="text-white">
                                {formatVelocity(neo.relativeVelocityKph)}
                              </span>
                            </p>
                          </div>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                </Section>
              </motion.div>
            )}

            {activeTab === "neo" && (
              <motion.div
                key="neo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Section
                  title="Near-Earth Object Tracking"
                  icon={<Icons.Target className="w-5 h-5 text-amber-400" />}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {asteroids.map((neo, i) => (
                      <Link key={neo._id} href={`/neo/${neo._id}`}>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 cursor-pointer hover:border-amber-500/50 transition-all"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-semibold text-lg text-amber-400">
                                {neo.name}
                              </h3>
                              <p className="text-xs text-gray-500">
                                NASA ID: {neo.nasaId}
                              </p>
                            </div>
                            <span className="px-3 py-1 text-xs rounded-full bg-red-500/20 text-red-400 border border-red-500/40 font-medium">
                              ⚠️ POTENTIALLY HAZARDOUS
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-3 rounded-xl bg-black/20">
                              <Icons.Calendar className="w-4 h-4 mx-auto mb-1 text-gray-400" />
                              <p className="text-xs text-gray-400">Approach</p>
                              <p className="font-medium text-white">
                                {formatDate(neo.closeApproachDate)}
                              </p>
                            </div>
                            <div className="text-center p-3 rounded-xl bg-black/20">
                              <Icons.Target className="w-4 h-4 mx-auto mb-1 text-gray-400" />
                              <p className="text-xs text-gray-400">
                                Miss Distance
                              </p>
                              <p className="font-medium text-white">
                                {formatDistance(neo.missDistanceKm)}
                              </p>
                            </div>
                            <div className="text-center p-3 rounded-xl bg-black/20">
                              <Icons.Zap className="w-4 h-4 mx-auto mb-1 text-gray-400" />
                              <p className="text-xs text-gray-400">Velocity</p>
                              <p className="font-medium text-white">
                                {formatVelocity(neo.relativeVelocityKph)}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                </Section>
              </motion.div>
            )}

            {activeTab === "weather" && (
              <motion.div
                key="weather"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Alert Level Banner */}
                {spaceWeather && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-2xl border flex items-center justify-between ${
                      spaceWeather.alertLevel === "alert"
                        ? "bg-red-500/10 border-red-500/40"
                        : spaceWeather.alertLevel === "warning"
                          ? "bg-amber-500/10 border-amber-500/40"
                          : spaceWeather.alertLevel === "watch"
                            ? "bg-cyan-500/10 border-cyan-500/40"
                            : "bg-emerald-500/10 border-emerald-500/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-3 h-3 rounded-full animate-pulse ${
                          spaceWeather.alertLevel === "alert"
                            ? "bg-red-400"
                            : spaceWeather.alertLevel === "warning"
                              ? "bg-amber-400"
                              : spaceWeather.alertLevel === "watch"
                                ? "bg-cyan-400"
                                : "bg-emerald-400"
                        }`}
                      />
                      <div>
                        <p className="font-semibold text-white">
                          Space Weather: {spaceWeather.alertLevel.toUpperCase()}
                        </p>
                        <p className="text-xs text-gray-400">
                          Max KP: {spaceWeather.summary.maxKpIndex} •{" "}
                          {spaceWeather.summary.earthImpactCMEs} Earth-directed
                          CMEs
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3 text-center">
                      <div className="px-3 py-1 rounded-lg bg-black/20">
                        <p className="text-lg font-bold text-yellow-400">
                          {spaceWeather.summary.solarFlareCount}
                        </p>
                        <p className="text-[10px] text-gray-500">Flares</p>
                      </div>
                      <div className="px-3 py-1 rounded-lg bg-black/20">
                        <p className="text-lg font-bold text-orange-400">
                          {spaceWeather.summary.cmeCount}
                        </p>
                        <p className="text-[10px] text-gray-500">CMEs</p>
                      </div>
                      <div className="px-3 py-1 rounded-lg bg-black/20">
                        <p className="text-lg font-bold text-red-400">
                          {spaceWeather.summary.geoStormCount}
                        </p>
                        <p className="text-[10px] text-gray-500">Storms</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* KP Gauge + Aurora Forecast */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Section
                    title="Geomagnetic Activity"
                    icon={<Icons.Activity className="w-5 h-5 text-cyan-400" />}
                  >
                    <div className="flex flex-col items-center py-6">
                      <div className="relative w-64 h-32 mb-4">
                        <svg viewBox="0 0 100 50" className="w-full h-full">
                          <defs>
                            <linearGradient
                              id="kpGradient"
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="0%"
                            >
                              <stop offset="0%" stopColor="#22c55e" />
                              <stop offset="33%" stopColor="#eab308" />
                              <stop offset="66%" stopColor="#f97316" />
                              <stop offset="100%" stopColor="#ef4444" />
                            </linearGradient>
                          </defs>
                          <path
                            d="M 5 45 A 40 40 0 0 1 95 45"
                            fill="none"
                            stroke="#1f2937"
                            strokeWidth="10"
                            strokeLinecap="round"
                          />
                          <motion.path
                            d="M 5 45 A 40 40 0 0 1 95 45"
                            fill="none"
                            stroke="url(#kpGradient)"
                            strokeWidth="10"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{
                              pathLength:
                                (spaceWeather?.summary.maxKpIndex || kpIndex) /
                                9,
                            }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
                          <span
                            className={`text-5xl font-bold ${getKpColor(spaceWeather?.summary.maxKpIndex || kpIndex)}`}
                          >
                            {spaceWeather?.summary.maxKpIndex || kpIndex}
                          </span>
                          <span className="text-sm text-gray-400">
                            KP Index
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap justify-center gap-3 text-xs">
                        {[
                          { label: "0-3 Quiet", color: "text-green-400" },
                          { label: "4-5 Active", color: "text-yellow-400" },
                          { label: "6-7 Storm", color: "text-orange-400" },
                          { label: "8-9 Severe", color: "text-red-400" },
                        ].map((level) => (
                          <span
                            key={level.label}
                            className={`${level.color} px-3 py-1 rounded-full bg-white/5`}
                          >
                            {level.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Section>

                  {/* Aurora Forecast */}
                  <Section
                    title="Aurora Forecast"
                    icon={<span className="text-lg">🌌</span>}
                  >
                    {spaceWeather?.auroraForecast ? (
                      <div className="space-y-4">
                        <div className="text-center py-4">
                          <p className="text-6xl font-bold bg-gradient-to-r from-green-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                            {spaceWeather.auroraForecast.probability}%
                          </p>
                          <p className="text-sm text-gray-400 mt-1">
                            Aurora Probability
                          </p>
                        </div>
                        <div className="space-y-2">
                          {[
                            [
                              "Visibility",
                              spaceWeather.auroraForecast.visibility,
                            ],
                            [
                              "Best Viewing",
                              spaceWeather.auroraForecast.bestViewing,
                            ],
                            [
                              "KP Required",
                              `≥${spaceWeather.auroraForecast.kpIndex}`,
                            ],
                          ].map(([label, val]) => (
                            <div
                              key={label}
                              className="flex justify-between py-2 border-b border-white/5 text-sm"
                            >
                              <span className="text-gray-400">{label}</span>
                              <span className="text-white font-medium text-right max-w-[200px]">
                                {val}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${spaceWeather.auroraForecast.probability}%`,
                            }}
                            transition={{ duration: 1.2 }}
                            className="h-full rounded-full bg-gradient-to-r from-green-500 via-cyan-500 to-purple-500"
                          />
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">
                        Loading aurora data...
                      </p>
                    )}
                  </Section>
                </div>

                {/* Solar Flares */}
                <Section
                  title="Solar Flares (30d)"
                  icon={<Icons.Sun className="w-5 h-5 text-yellow-400" />}
                  action={
                    <span className="text-xs text-gray-500">
                      {spaceWeather?.solarFlares.length || solarStorms.length}{" "}
                      events
                    </span>
                  }
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {(spaceWeather?.solarFlares || [])
                      .slice(0, 6)
                      .map((flare, i) => {
                        const isX = flare.classType?.startsWith("X");
                        const isM = flare.classType?.startsWith("M");
                        return (
                          <motion.div
                            key={flare.flrID}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className={`p-4 rounded-xl border ${
                              isX
                                ? "bg-red-500/10 border-red-500/30"
                                : isM
                                  ? "bg-orange-500/10 border-orange-500/30"
                                  : "bg-white/5 border-white/10"
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span
                                className={`text-2xl font-bold ${
                                  isX
                                    ? "text-red-400"
                                    : isM
                                      ? "text-orange-400"
                                      : "text-yellow-400"
                                }`}
                              >
                                {flare.classType}
                              </span>
                              <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded">
                                {flare.sourceLocation}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400">
                              Peak: {new Date(flare.peakTime).toLocaleString()}
                            </p>
                          </motion.div>
                        );
                      })}
                    {(!spaceWeather?.solarFlares ||
                      spaceWeather.solarFlares.length === 0) &&
                      solarStorms.map((storm, i) => (
                        <motion.div
                          key={storm._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className={`p-4 rounded-xl border ${storm.kpIndex >= 5 ? "bg-red-500/10 border-red-500/30" : "bg-white/5 border-white/10"}`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium text-sm">
                                {storm.gstID}
                              </h4>
                              <p className="text-xs text-gray-400">
                                {formatDate(storm.startTime)}
                              </p>
                            </div>
                            <span
                              className={`text-xl font-bold ${getKpColor(storm.kpIndex)}`}
                            >
                              KP {storm.kpIndex}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </Section>

                {/* CME Events + Solar Wind */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Section
                    title="CME Events"
                    icon={<span className="text-lg">💥</span>}
                    action={
                      <span className="text-xs text-gray-500">
                        {spaceWeather?.summary.earthImpactCMEs || 0}{" "}
                        Earth-directed
                      </span>
                    }
                  >
                    <div className="space-y-2">
                      {(spaceWeather?.cmeEvents || [])
                        .slice(0, 5)
                        .map((cme, i) => (
                          <motion.div
                            key={cme.activityID}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.08 }}
                            className={`p-3 rounded-xl border flex items-center justify-between ${
                              cme.earthImpact
                                ? "bg-red-500/10 border-red-500/30"
                                : "bg-white/5 border-white/10"
                            }`}
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-sm text-white">
                                  {new Date(cme.startTime).toLocaleDateString()}
                                </p>
                                {cme.earthImpact && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/30 text-red-300 border border-red-500/50">
                                    EARTH IMPACT
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500">
                                Speed: {cme.speed ? `${cme.speed} km/s` : "N/A"}{" "}
                                • Type: {cme.type}
                              </p>
                            </div>
                            {cme.speed && (
                              <span
                                className={`text-lg font-bold ${cme.speed > 800 ? "text-red-400" : cme.speed > 500 ? "text-orange-400" : "text-yellow-400"}`}
                              >
                                {cme.speed}
                              </span>
                            )}
                          </motion.div>
                        ))}
                      {(!spaceWeather?.cmeEvents ||
                        spaceWeather.cmeEvents.length === 0) && (
                        <p className="text-center text-gray-500 py-6">
                          No CME events in the last 30 days
                        </p>
                      )}
                    </div>
                  </Section>

                  <Section
                    title="Solar Wind & Alerts"
                    icon={<span className="text-lg">🌊</span>}
                    action={
                      <span className="text-xs text-gray-500">
                        {spaceWeather?.summary.solarWindEvents || 0} detections
                      </span>
                    }
                  >
                    <div className="space-y-2">
                      {(spaceWeather?.solarWind || [])
                        .slice(0, 5)
                        .map((sw, i) => (
                          <motion.div
                            key={sw.activityID}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.08 }}
                            className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between"
                          >
                            <div>
                              <p className="font-medium text-sm text-cyan-400">
                                {sw.location}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(sw.eventTime).toLocaleString()}
                              </p>
                            </div>
                            <span className="text-xs px-2 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                              IPS
                            </span>
                          </motion.div>
                        ))}
                      {/* Notifications */}
                      {(spaceWeather?.recentNotifications || [])
                        .slice(0, 3)
                        .map((notif, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 + i * 0.08 }}
                            className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-300 font-medium">
                                {notif.messageType}
                              </span>
                              <span className="text-[10px] text-gray-500">
                                {new Date(
                                  notif.messageIssueTime,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 line-clamp-2">
                              {notif.messageBody}
                            </p>
                          </motion.div>
                        ))}
                    </div>
                  </Section>
                </div>

                {/* Earth Impact & ISS Alerts */}
                <Section
                  title="Earth Impact & ISS Proximity Alerts"
                  icon={<Icons.Globe className="w-5 h-5 text-blue-400" />}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 text-center">
                      <span className="text-3xl">🌊</span>
                      <h4 className="font-semibold text-white mt-2">
                        Tsunami Watch
                      </h4>
                      <p className="text-xs text-gray-400 mt-1">
                        No active tsunami warnings
                      </p>
                      <span className="inline-block mt-2 text-[10px] px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        ALL CLEAR
                      </span>
                    </div>
                    <div className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/20 text-center">
                      <span className="text-3xl">🛰️</span>
                      <h4 className="font-semibold text-white mt-2">
                        ISS Proximity
                      </h4>
                      <p className="text-xs text-gray-400 mt-1">
                        No conjunction alerts for ISS
                      </p>
                      <span className="inline-block mt-2 text-[10px] px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        SAFE
                      </span>
                    </div>
                    <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-center">
                      <span className="text-3xl">🌀</span>
                      <h4 className="font-semibold text-white mt-2">
                        Weather Patterns
                      </h4>
                      <p className="text-xs text-gray-400 mt-1">
                        Monitoring extreme weather events
                      </p>
                      <span className="inline-block mt-2 text-[10px] px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        NOMINAL
                      </span>
                    </div>
                  </div>
                </Section>
              </motion.div>
            )}

            {activeTab === "satellites" && (
              <motion.div
                key="satellites"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Section
                  title="Tracked Satellites"
                  icon={
                    <Icons.Satellite className="w-5 h-5 text-emerald-400" />
                  }
                >
                  <p className="text-sm text-gray-400 mb-4">
                    {satellites.length} satellites tracked via TLE data • Click
                    any satellite to view orbital details
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-xs text-gray-500 border-b border-white/10">
                          <th className="pb-3 pr-4">Satellite</th>
                          <th className="pb-3 pr-4 hidden sm:table-cell">
                            TLE Line 1
                          </th>
                          <th className="pb-3 pr-4">Source</th>
                          <th className="pb-3 pr-4">Updated</th>
                          <th className="pb-3">Track</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {satellites.slice(0, 25).map((sat, i) => (
                          <Link
                            key={sat._id}
                            href={`/satellite/${sat._id}`}
                            className="contents"
                          >
                            <motion.tr
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: i * 0.02 }}
                              className="hover:bg-white/5 cursor-pointer group"
                            >
                              <td className="py-3 pr-4 font-medium text-emerald-400 group-hover:text-emerald-300 transition-colors">
                                {sat.satelliteName}
                              </td>
                              <td className="py-3 pr-4 font-mono text-xs text-gray-500 hidden sm:table-cell truncate max-w-xs">
                                {sat.line1?.substring(0, 40)}...
                              </td>
                              <td className="py-3 pr-4 text-gray-400 text-sm">
                                {sat.source}
                              </td>
                              <td className="py-3 text-gray-500 text-xs">
                                {new Date(sat.lastUpdated).toLocaleDateString()}
                              </td>
                              <td className="py-3 text-xs">
                                <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 group-hover:bg-emerald-500/30 transition-all">
                                  Track →
                                </span>
                              </td>
                            </motion.tr>
                          </Link>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Section>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Explore More Section */}
          <div className="space-y-4 pt-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Icons.Globe className="w-5 h-5 text-violet-400" /> Explore More
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/solar-system">
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-violet-500/30 transition-all cursor-pointer h-full"
                >
                  <div className="text-3xl mb-3">🪐</div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    3D Solar System
                  </h3>
                  <p className="text-xs text-gray-400">
                    Explore planets, moons & their properties in interactive 3D
                  </p>
                </motion.div>
              </Link>
              <Link href="/mars">
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-red-500/30 transition-all cursor-pointer h-full"
                >
                  <div className="text-3xl mb-3">🔴</div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    Mars Exploration
                  </h3>
                  <p className="text-xs text-gray-400">
                    Active rovers, orbiters & real Mars photos from NASA
                  </p>
                </motion.div>
              </Link>
              <Link href="/isro">
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-orange-500/30 transition-all cursor-pointer h-full"
                >
                  <div className="text-3xl mb-3">🇮🇳</div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    ISRO Data
                  </h3>
                  <p className="text-xs text-gray-400">
                    Spacecrafts, launchers & research centres across India
                  </p>
                </motion.div>
              </Link>
            </div>
          </div>

          {/* Footer */}
          <footer className="text-center text-xs text-gray-600 pt-8 pb-4">
            <p>
              Last updated: {lastRefresh.toLocaleTimeString()} • AstroView Space
              Intelligence Platform
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}

function MissionCard({ mission, index }: { mission: Mission; index: number }) {
  const statusColors: Record<string, string> = {
    ongoing: "bg-emerald-500/20 text-emerald-400 border-emerald-500/50",
    upcoming: "bg-amber-500/20 text-amber-400 border-amber-500/50",
    planned: "bg-blue-500/20 text-blue-400 border-blue-500/50",
    completed: "bg-gray-500/20 text-gray-400 border-gray-500/50",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="group p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-violet-500/30 hover:bg-white/[0.06] transition-all cursor-pointer"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white truncate group-hover:text-violet-300 transition-colors">
            {mission.name}
          </h4>
          <p className="text-xs text-gray-500">{mission.missionType}</p>
        </div>
        <span
          className={`px-2 py-1 text-[10px] rounded-full border font-medium ml-2 ${ORG_BADGES[mission.organization] || "bg-gray-500/20 text-gray-400 border-gray-500/50"}`}
        >
          {mission.organization}
        </span>
      </div>
      <p className="text-sm text-gray-400 mb-3 flex items-center gap-1">
        <Icons.Globe className="w-3 h-3" /> {mission.destination}
      </p>
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Progress</span>
          <span className="text-white">{mission.progress}%</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${mission.progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full rounded-full bg-gradient-to-r ${ORG_COLORS[mission.organization] || "from-violet-500 to-purple-600"}`}
          />
        </div>
      </div>
      <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Icons.Calendar className="w-3 h-3" />
          {new Date(mission.launchDate).toLocaleDateString()}
        </span>
        {mission.crew > 0 && (
          <span className="flex items-center gap-1">
            <Icons.Users className="w-3 h-3" />
            {mission.crew} crew
          </span>
        )}
        <span
          className={`px-2 py-0.5 rounded-full border text-[10px] ${statusColors[mission.status]}`}
        >
          {mission.status}
        </span>
      </div>
    </motion.div>
  );
}

function Section({
  title,
  icon,
  action,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white/[0.03] backdrop-blur border border-white/10 p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          {icon}
          {title}
        </h2>
        {action}
      </div>
      {children}
    </motion.section>
  );
}
