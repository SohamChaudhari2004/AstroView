'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { fetchSatelliteById, Satellite } from '@/lib/api';

const Icons = {
    Back: ({ className }: { className?: string }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
    ),
    Satellite: ({ className }: { className?: string }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M13 7 9 3 5 7l4 4" /><path d="m17 11 4 4-4 4-4-4" /><path d="m8 12 4 4 6-6-4-4Z" /><path d="m16 8 3-3" /><path d="M9 21a6 6 0 0 0-6-6" />
        </svg>
    ),
    Globe: ({ className }: { className?: string }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>
    ),
    Activity: ({ className }: { className?: string }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
    ),
    Info: ({ className }: { className?: string }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
    ),
    Clock: ({ className }: { className?: string }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
    ),
};

// TLE Parser - extract orbital elements from TLE line 1 and line 2
function parseTLE(line1: string, line2: string) {
    if (!line1 || !line2) return null;
    try {
        const inclination = parseFloat(line2.substring(8, 16).trim());
        const raan = parseFloat(line2.substring(17, 25).trim());
        const eccentricity = parseFloat('0.' + line2.substring(26, 33).trim());
        const argPerigee = parseFloat(line2.substring(34, 42).trim());
        const meanAnomaly = parseFloat(line2.substring(43, 51).trim());
        const meanMotion = parseFloat(line2.substring(52, 63).trim());
        const revNumber = parseInt(line2.substring(63, 68).trim());
        const epochYear = parseInt(line1.substring(18, 20).trim());
        const epochDay = parseFloat(line1.substring(20, 32).trim());
        const fullYear = epochYear > 56 ? 1900 + epochYear : 2000 + epochYear;
        const orbitalPeriod = 1440 / meanMotion; // in minutes
        const semiMajorAxis = Math.pow(398600.4418 / Math.pow(meanMotion * 2 * Math.PI / 86400, 2), 1 / 3); // km
        const perigee = semiMajorAxis * (1 - eccentricity) - 6371;
        const apogee = semiMajorAxis * (1 + eccentricity) - 6371;
        const velocity = Math.sqrt(398600.4418 / semiMajorAxis); // km/s

        return {
            inclination, raan, eccentricity, argPerigee, meanAnomaly,
            meanMotion, revNumber, epochYear: fullYear, epochDay,
            orbitalPeriod, semiMajorAxis, perigee, apogee, velocity,
        };
    } catch {
        return null;
    }
}

function getOrbitType(perigee: number, apogee: number): string {
    const avg = (perigee + apogee) / 2;
    if (avg < 2000) return 'Low Earth Orbit (LEO)';
    if (avg < 35786) return 'Medium Earth Orbit (MEO)';
    if (Math.abs(avg - 35786) < 1000) return 'Geostationary Orbit (GEO)';
    return 'High Earth Orbit (HEO)';
}

export default function SatellitePage() {
    const router = useRouter();
    const params = useParams();
    const satId = params.id as string;
    const [satellite, setSatellite] = useState<Satellite | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchSatelliteById(satId);
                setSatellite(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [satId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4" />
            </div>
        );
    }

    if (!satellite) {
        return (
            <div className="min-h-screen bg-[#0a0a1a] flex flex-col items-center justify-center text-white gap-4">
                <Icons.Satellite className="w-12 h-12 text-gray-500" />
                <h1 className="text-2xl font-bold">Satellite Not Found</h1>
                <Link href="/dashboard" className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium">← Back to Dashboard</Link>
            </div>
        );
    }

    const orbital = parseTLE(satellite.line1, satellite.line2);
    const orbitType = orbital ? getOrbitType(orbital.perigee, orbital.apogee) : 'Unknown';

    return (
        <div className="min-h-screen bg-[#0a0a1a] text-white">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-cyan-900/20" />
                {[...Array(40)].map((_, i) => (
                    <motion.div key={i} className="absolute rounded-full bg-white"
                        style={{ width: Math.random() * 2 + 1, height: Math.random() * 2 + 1, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                        animate={{ opacity: [0.1, 0.5, 0.1] }} transition={{ duration: Math.random() * 4 + 2, repeat: Infinity }} />
                ))}
            </div>

            <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0a0a1a]/80 border-b border-white/10">
                <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                        <Icons.Back className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                            <Icons.Satellite className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">{satellite.satelliteName}</h1>
                            <p className="text-xs text-gray-400">Source: {satellite.source} • {orbitType}</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-5xl mx-auto px-4 py-8 space-y-6">
                {/* Hero */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="rounded-3xl bg-gradient-to-br from-emerald-500 to-cyan-500 p-[1px]">
                    <div className="rounded-3xl bg-[#0f0f1f] p-8">
                        <h2 className="text-3xl font-bold mb-2">{satellite.satelliteName}</h2>
                        <p className="text-gray-400">Tracked satellite with Two-Line Element (TLE) data from {satellite.source}.</p>
                        <div className="mt-4 flex items-center gap-3">
                            <span className="px-3 py-1 text-xs rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">● TRACKING ACTIVE</span>
                            <span className="px-3 py-1 text-xs rounded-full bg-white/10 border border-white/10 text-gray-400">{orbitType}</span>
                        </div>
                    </div>
                </motion.div>

                {orbital && (
                    <>
                        {/* Orbital Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Perigee', value: `${orbital.perigee.toFixed(0)} km`, color: 'text-emerald-400' },
                                { label: 'Apogee', value: `${orbital.apogee.toFixed(0)} km`, color: 'text-cyan-400' },
                                { label: 'Inclination', value: `${orbital.inclination.toFixed(2)}°`, color: 'text-violet-400' },
                                { label: 'Period', value: `${orbital.orbitalPeriod.toFixed(1)} min`, color: 'text-amber-400' },
                            ].map((stat, i) => (
                                <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }}
                                    className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                    <p className="text-xs text-gray-500 uppercase mb-1">{stat.label}</p>
                                    <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Orbital Details */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                                className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Icons.Globe className="w-5 h-5 text-emerald-400" /> Orbital Elements
                                </h3>
                                <div className="space-y-2">
                                    {[
                                        ['Semi-Major Axis', `${orbital.semiMajorAxis.toFixed(1)} km`],
                                        ['Eccentricity', orbital.eccentricity.toFixed(6)],
                                        ['Inclination', `${orbital.inclination.toFixed(4)}°`],
                                        ['RAAN', `${orbital.raan.toFixed(4)}°`],
                                        ['Arg. of Perigee', `${orbital.argPerigee.toFixed(4)}°`],
                                        ['Mean Anomaly', `${orbital.meanAnomaly.toFixed(4)}°`],
                                        ['Mean Motion', `${orbital.meanMotion.toFixed(8)} rev/day`],
                                        ['Revolutions', orbital.revNumber.toString()],
                                    ].map(([k, v]) => (
                                        <div key={k} className="flex justify-between py-2 border-b border-white/5 text-sm">
                                            <span className="text-gray-400">{k}</span>
                                            <span className="text-white font-mono">{v}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                                className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Icons.Activity className="w-5 h-5 text-cyan-400" /> Tracking Data
                                </h3>
                                <div className="space-y-2">
                                    {[
                                        ['Velocity', `${orbital.velocity.toFixed(2)} km/s`],
                                        ['Perigee Alt.', `${orbital.perigee.toFixed(1)} km`],
                                        ['Apogee Alt.', `${orbital.apogee.toFixed(1)} km`],
                                        ['Period', `${orbital.orbitalPeriod.toFixed(2)} minutes`],
                                        ['Orbits/Day', orbital.meanMotion.toFixed(4)],
                                        ['Orbit Type', orbitType],
                                        ['Epoch', `${orbital.epochYear}, Day ${orbital.epochDay.toFixed(4)}`],
                                        ['Source', satellite.source],
                                    ].map(([k, v]) => (
                                        <div key={k} className="flex justify-between py-2 border-b border-white/5 text-sm">
                                            <span className="text-gray-400">{k}</span>
                                            <span className="text-white font-medium">{v}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Orbit visualization bar */}
                                <div className="mt-4 p-4 rounded-xl bg-black/20">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Altitude Profile</p>
                                    <div className="space-y-2">
                                        <div>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-gray-500">Perigee</span>
                                                <span className="text-emerald-400">{orbital.perigee.toFixed(0)} km</span>
                                            </div>
                                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                                <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((orbital.perigee / 40000) * 100, 100)}%` }}
                                                    transition={{ duration: 1 }} className="h-full rounded-full bg-emerald-500" />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-gray-500">Apogee</span>
                                                <span className="text-cyan-400">{orbital.apogee.toFixed(0)} km</span>
                                            </div>
                                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                                <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((orbital.apogee / 40000) * 100, 100)}%` }}
                                                    transition={{ duration: 1.2 }} className="h-full rounded-full bg-cyan-500" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* TLE Raw Data */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                            className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Icons.Info className="w-5 h-5 text-blue-400" /> Two-Line Element Set (TLE)
                            </h3>
                            <div className="bg-black/30 rounded-xl p-4 font-mono text-xs text-emerald-400 space-y-1 overflow-x-auto">
                                <p className="text-gray-500">Name: {satellite.satelliteName}</p>
                                <p>{satellite.line1}</p>
                                <p>{satellite.line2}</p>
                            </div>
                            <p className="text-xs text-gray-500 mt-3">
                                Last updated: {new Date(satellite.lastUpdated).toLocaleString()}
                            </p>
                        </motion.div>
                    </>
                )}

                <div className="flex justify-center pt-4 pb-8">
                    <Link href="/dashboard" className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium hover:opacity-90 transition-all shadow-lg">
                        ← Back to Dashboard
                    </Link>
                </div>
            </main>
        </div>
    );
}
