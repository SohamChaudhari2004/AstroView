"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { fetchMissionById, Mission } from "@/lib/api";
import { calculateCountdown, formatDate } from "@/utils/helpers";

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
  Users: ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
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
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
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
  Layers: ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
};

const ORG_COLORS: Record<string, string> = {
  NASA: "from-blue-500 to-cyan-600",
  ISRO: "from-orange-500 to-amber-600",
  ESA: "from-indigo-500 to-violet-600",
  SpaceX: "from-gray-500 to-slate-700",
  CNSA: "from-red-500 to-rose-600",
};

const ORG_DESCRIPTIONS: Record<string, string> = {
  NASA: "National Aeronautics and Space Administration — United States federal agency responsible for the civil space program, aeronautics research, and space research.",
  ISRO: "Indian Space Research Organisation — Space agency of the Government of India, headquartered in Bengaluru. One of six government space agencies in the world.",
  ESA: "European Space Agency — Intergovernmental organisation of 22 member states dedicated to the exploration of space.",
  SpaceX:
    "Space Exploration Technologies Corp. — American spacecraft manufacturer, launcher, and satellite communications company founded by Elon Musk.",
  CNSA: "China National Space Administration — National space agency of the People's Republic of China responsible for the national space program.",
};

const STATUS_CONFIG: Record<
  string,
  { color: string; bg: string; label: string }
> = {
  ongoing: {
    color: "text-emerald-400",
    bg: "bg-emerald-500/20 border-emerald-500/50",
    label: "● ONGOING",
  },
  upcoming: {
    color: "text-amber-400",
    bg: "bg-amber-500/20 border-amber-500/50",
    label: "◎ UPCOMING",
  },
  planned: {
    color: "text-blue-400",
    bg: "bg-blue-500/20 border-blue-500/50",
    label: "○ PLANNED",
  },
  completed: {
    color: "text-gray-400",
    bg: "bg-gray-500/20 border-gray-500/50",
    label: "✓ COMPLETED",
  },
};

// Mission-specific data enrichment
function getMissionDetails(mission: Mission) {
  const daysUntilLaunch = Math.max(
    0,
    Math.ceil(
      (new Date(mission.launchDate).getTime() - Date.now()) /
        (1000 * 60 * 60 * 24),
    ),
  );
  const isPast = daysUntilLaunch === 0;

  const milestones = [
    { label: "Mission Concept Review", complete: mission.progress >= 10 },
    { label: "Preliminary Design", complete: mission.progress >= 25 },
    { label: "Critical Design Review", complete: mission.progress >= 40 },
    { label: "Assembly & Integration", complete: mission.progress >= 55 },
    { label: "System Testing", complete: mission.progress >= 70 },
    { label: "Launch Readiness Review", complete: mission.progress >= 85 },
    { label: "Launch", complete: mission.progress >= 95 || isPast },
    { label: "Mission Operations", complete: mission.progress >= 100 },
  ];

  return { daysUntilLaunch, isPast, milestones };
}

export default function MissionPage() {
  const router = useRouter();
  const params = useParams();
  const missionId = params.id as string;
  const [countdown, setCountdown] = useState("");
  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMission = async () => {
      try {
        const data = await fetchMissionById(missionId);
        setMission(data);
      } catch (error) {
        console.error("Error loading mission:", error);
      } finally {
        setLoading(false);
      }
    };
    loadMission();
  }, [missionId]);

  useEffect(() => {
    if (!mission) return;
    const interval = setInterval(() => {
      setCountdown(calculateCountdown(mission.launchDate));
    }, 1000);
    setCountdown(calculateCountdown(mission.launchDate));
    return () => clearInterval(interval);
  }, [mission]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-violet-400 text-lg">Loading mission data...</p>
        </div>
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex flex-col items-center justify-center text-white gap-4">
        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-2">
          <Icons.Rocket className="w-10 h-10 text-gray-500" />
        </div>
        <h1 className="text-2xl font-bold">Mission Not Found</h1>
        <p className="text-gray-500">
          The mission you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <Link
          href="/dashboard"
          className="mt-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-medium hover:opacity-90 transition-all"
        >
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  const { daysUntilLaunch, isPast, milestones } = getMissionDetails(mission);
  const statusCfg = STATUS_CONFIG[mission.status] || STATUS_CONFIG.planned;
  const orgGradient =
    ORG_COLORS[mission.organization] || "from-violet-500 to-purple-600";
  const orgDesc =
    ORG_DESCRIPTIONS[mission.organization] ||
    "International space organization.";

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-transparent to-cyan-900/20" />
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
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${orgGradient} flex items-center justify-center shadow-lg`}
            >
              <Icons.Rocket className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{mission.name}</h1>
              <p className="text-xs text-gray-400">
                {mission.organization} • {mission.missionType}
              </p>
            </div>
          </div>
          <span
            className={`px-3 py-1.5 text-xs rounded-full border font-medium ${statusCfg.bg}`}
          >
            {statusCfg.label}
          </span>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${orgGradient} p-[1px]`}
        >
          <div className="rounded-3xl bg-[#0f0f1f] p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex-1">
                <h2 className="text-3xl md:text-4xl font-bold mb-3">
                  {mission.name}
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed">
                  {mission.description}
                </p>
              </div>
              <div className="text-center md:text-right shrink-0">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                  {isPast ? "MISSION STATUS" : "COUNTDOWN TO LAUNCH"}
                </p>
                <p className="text-3xl md:text-4xl font-mono font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  {countdown || "Calculating..."}
                </p>
                {!isPast && (
                  <p className="text-sm text-gray-500 mt-1">
                    {daysUntilLaunch} days remaining
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Launch Date",
              value: formatDate(mission.launchDate),
              icon: Icons.Calendar,
              color: "text-violet-400",
            },
            {
              label: "Destination",
              value: mission.destination,
              icon: Icons.Target,
              color: "text-cyan-400",
            },
            {
              label: "Mission Type",
              value: mission.missionType,
              icon: Icons.Layers,
              color: "text-emerald-400",
            },
            {
              label: "Crew",
              value:
                mission.crew > 0 ? `${mission.crew} astronauts` : "Uncrewed",
              icon: Icons.Users,
              color: "text-amber-400",
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

        {/* Progress + Timeline Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10"
          >
            <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
              <Icons.Activity className="w-5 h-5 text-cyan-400" /> Mission
              Progress
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Overall Completion</span>
                <span className="text-white font-bold text-lg">
                  {mission.progress}%
                </span>
              </div>
              <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${mission.progress}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className={`h-full rounded-full bg-gradient-to-r ${orgGradient} relative`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 rounded-full" />
                </motion.div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Start</span>
                <span>Launch</span>
                <span>Complete</span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white/5 text-center">
                <Icons.Clock className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
                <p className="text-xs text-gray-500">Days to Launch</p>
                <p className="text-xl font-bold text-white">
                  {isPast ? "—" : daysUntilLaunch}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 text-center">
                <Icons.Zap className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                <p className="text-xs text-gray-500">Status</p>
                <p className={`text-sm font-bold ${statusCfg.color}`}>
                  {mission.status.charAt(0).toUpperCase() +
                    mission.status.slice(1)}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10"
          >
            <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
              <Icons.Clock className="w-5 h-5 text-violet-400" /> Mission
              Timeline
            </h3>
            <div className="space-y-0">
              {milestones.map((milestone, i) => {
                const isActive =
                  milestone.complete &&
                  (i === milestones.length - 1 || !milestones[i + 1].complete);
                return (
                  <div key={milestone.label} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 + i * 0.08 }}
                        className={`w-4 h-4 rounded-full border-2 shrink-0 ${
                          isActive
                            ? `bg-gradient-to-r ${orgGradient} border-transparent shadow-lg shadow-violet-500/30`
                            : milestone.complete
                              ? "bg-emerald-500 border-emerald-400"
                              : "bg-transparent border-gray-600"
                        }`}
                      />
                      {i < milestones.length - 1 && (
                        <div
                          className={`w-0.5 h-6 ${milestone.complete ? "bg-emerald-500/50" : "bg-gray-700"}`}
                        />
                      )}
                    </div>
                    <span
                      className={`text-sm pb-3 ${
                        isActive
                          ? "text-white font-semibold"
                          : milestone.complete
                            ? "text-emerald-400"
                            : "text-gray-500"
                      }`}
                    >
                      {milestone.label}
                      {isActive && (
                        <span className="ml-2 text-xs text-cyan-400 animate-pulse">
                          ← Current
                        </span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Mission Description + Destination */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Icons.Info className="w-5 h-5 text-blue-400" /> Mission Overview
            </h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              {mission.description}
            </p>
            <div className="p-4 rounded-xl bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-violet-500/20">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                Objective
              </p>
              <p className="text-gray-300 text-sm">
                {mission.crew > 0
                  ? `Crewed mission to ${mission.destination} with ${mission.crew} astronauts aboard.`
                  : `Robotic exploration mission targeting ${mission.destination}.`}{" "}
                Mission type: {mission.missionType}.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Icons.MapPin className="w-5 h-5 text-rose-400" /> Destination
            </h3>
            <div className="flex items-center gap-4 mb-4">
              <div
                className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${orgGradient} flex items-center justify-center`}
              >
                <Icons.Target className="w-10 h-10 text-white/80" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mission.destination}</p>
                <p className="text-sm text-gray-500">{mission.missionType}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span>Launch Window</span>
                <span className="text-white font-medium">
                  {formatDate(mission.launchDate)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span>Crew Size</span>
                <span className="text-white font-medium">
                  {mission.crew > 0 ? `${mission.crew} personnel` : "Uncrewed"}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span>Progress</span>
                <span className="text-white font-medium">
                  {mission.progress}%
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Organization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-6 rounded-2xl bg-white/5 border border-white/10"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Icons.Globe className="w-5 h-5 text-emerald-400" /> Organization
          </h3>
          <div className="flex items-start gap-5">
            <div
              className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${orgGradient} flex items-center justify-center shrink-0 shadow-lg`}
            >
              <span className="text-2xl font-bold text-white">
                {mission.organization.charAt(0)}
              </span>
            </div>
            <div>
              <p className="text-xl font-bold mb-1">{mission.organization}</p>
              <p className="text-sm text-gray-400 leading-relaxed">{orgDesc}</p>
            </div>
          </div>
        </motion.div>

        {/* Back */}
        <div className="flex justify-center pt-4 pb-8">
          <Link
            href="/dashboard"
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-medium hover:opacity-90 transition-all shadow-lg shadow-violet-500/20"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
