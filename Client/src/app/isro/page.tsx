'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { fetchISRODashboard, ISRODashboard, ISROSpacecraft, ISROCentre } from '@/lib/api';

const Icons = {
    Back: ({ className }: { className?: string }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
    ),
    Rocket: ({ className }: { className?: string }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        </svg>
    ),
    Satellite: ({ className }: { className?: string }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M13 7 9 3 5 7l4 4" /><path d="m17 11 4 4-4 4-4-4" /><path d="m8 12 4 4 6-6-4-4Z" /><path d="m16 8 3-3" /><path d="M9 21a6 6 0 0 0-6-6" />
        </svg>
    ),
    MapPin: ({ className }: { className?: string }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
    ),
    Search: ({ className }: { className?: string }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
    ),
};

const SPACECRAFT_CATEGORIES = ['All', 'INSAT', 'IRS', 'GSAT', 'IRNSS', 'PSLV', 'CARTOSAT', 'Chandrayaan', 'RISAT', 'Other'];

function categorize(name: string): string {
    for (const cat of SPACECRAFT_CATEGORIES.slice(1, -1)) {
        if (name.toUpperCase().includes(cat.toUpperCase())) return cat;
    }
    return 'Other';
}

export default function ISROPage() {
    const [data, setData] = useState<ISRODashboard | null>(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<'spacecrafts' | 'launchers' | 'centres'>('spacecrafts');
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        const load = async () => {
            try {
                const d = await fetchISRODashboard();
                setData(d);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
                <div className="text-center">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-orange-400 text-lg">Loading ISRO data...</p>
                </div>
            </div>
        );
    }

    const spacecrafts = data?.spacecrafts || [];
    const launchers = data?.launchers || [];
    const centres = data?.centres || [];

    const filteredSpacecrafts = spacecrafts.filter(sc => {
        const matchesSearch = sc.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || categorize(sc.name) === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const groupedCentres: Record<string, ISROCentre[]> = {};
    centres.forEach(c => {
        if (!groupedCentres[c.State]) groupedCentres[c.State] = [];
        groupedCentres[c.State].push(c);
    });

    return (
        <div className="min-h-screen bg-[#0a0a1a] text-white">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 via-transparent to-amber-900/20" />
                {[...Array(40)].map((_, i) => (
                    <motion.div key={i} className="absolute rounded-full bg-white"
                        style={{ width: Math.random() * 2 + 1, height: Math.random() * 2 + 1, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                        animate={{ opacity: [0.1, 0.4, 0.1] }} transition={{ duration: Math.random() * 4 + 2, repeat: Infinity }} />
                ))}
            </div>

            <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0a0a1a]/80 border-b border-white/10">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                        <Icons.Back className="w-5 h-5" />
                    </Link>
                    <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                            <span className="text-lg">🇮🇳</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">ISRO Explorer</h1>
                            <p className="text-xs text-gray-400">Indian Space Research Organisation</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-6xl mx-auto px-4 py-8 space-y-6">
                {/* Hero Stats */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="rounded-3xl bg-gradient-to-br from-orange-500 to-amber-600 p-[1px]">
                    <div className="rounded-3xl bg-[#0f0f1f] p-8">
                        <h2 className="text-3xl md:text-4xl font-bold mb-2">Indian Space Research Organisation</h2>
                        <p className="text-gray-400 max-w-2xl mb-6">
                            ISRO is the space agency of India, one of six government space agencies in the world that possess full launch capabilities.
                            Explore their spacecrafts, launch vehicles, and research centres.
                        </p>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 rounded-xl bg-white/5 text-center">
                                <p className="text-3xl font-bold text-orange-400">{spacecrafts.length}</p>
                                <p className="text-xs text-gray-500 mt-1">Spacecrafts</p>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 text-center">
                                <p className="text-3xl font-bold text-amber-400">{launchers.length}</p>
                                <p className="text-xs text-gray-500 mt-1">Launch Vehicles</p>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 text-center">
                                <p className="text-3xl font-bold text-cyan-400">{centres.length}</p>
                                <p className="text-xs text-gray-500 mt-1">Research Centres</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Tabs */}
                <div className="flex gap-2 bg-white/5 rounded-xl p-1 border border-white/10 w-fit">
                    {[
                        { key: 'spacecrafts' as const, label: `Spacecrafts`, icon: '🛰️' },
                        { key: 'launchers' as const, label: `Launchers`, icon: '🚀' },
                        { key: 'centres' as const, label: `Centres`, icon: '🏢' },
                    ].map(t => (
                        <button key={t.key} onClick={() => setTab(t.key)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${tab === t.key ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white' : 'text-gray-400 hover:text-white'
                                }`}>
                            <span>{t.icon}</span> {t.label}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {tab === 'spacecrafts' && (
                        <motion.div key="spacecrafts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                            {/* Search + Category Filter */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1">
                                    <Icons.Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input type="text" placeholder="Search spacecrafts..." value={search} onChange={e => setSearch(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:border-orange-500/50 focus:outline-none transition-all text-sm" />
                                </div>
                                <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                                    {SPACECRAFT_CATEGORIES.map(cat => (
                                        <button key={cat} onClick={() => setSelectedCategory(cat)}
                                            className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-orange-500/30 text-orange-400 border border-orange-500/40' : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-transparent'
                                                }`}>
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <p className="text-sm text-gray-500">{filteredSpacecrafts.length} spacecrafts found</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {filteredSpacecrafts.map((sc, i) => (
                                    <motion.div key={sc.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.02, 0.5) }}
                                        className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/[0.07] hover:border-orange-500/30 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500/30 to-amber-500/30 flex items-center justify-center shrink-0">
                                                <Icons.Satellite className="w-4 h-4 text-orange-400" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-white truncate">{sc.name}</p>
                                                <p className="text-xs text-gray-500">{categorize(sc.name)} • #{sc.id}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {tab === 'launchers' && (
                        <motion.div key="launchers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                {launchers.map((launcher, i) => {
                                    const isPSLV = launcher.id.includes('PSLV');
                                    const isGSLV = launcher.id.includes('GSLV') || launcher.id.includes('LVM');
                                    const isSLV = launcher.id.includes('SLV');
                                    const isASLV = launcher.id.includes('ASLV');
                                    const color = isGSLV ? 'from-violet-500 to-indigo-500' : isPSLV ? 'from-orange-500 to-amber-500' : isSLV ? 'from-blue-500 to-cyan-500' : isASLV ? 'from-emerald-500 to-teal-500' : 'from-gray-500 to-slate-500';
                                    return (
                                        <motion.div key={launcher.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: Math.min(i * 0.02, 0.5) }}
                                            className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-all text-center">
                                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-2`}>
                                                <Icons.Rocket className="w-5 h-5 text-white" />
                                            </div>
                                            <p className="text-xs font-bold text-white">{launcher.id}</p>
                                            <p className="text-[10px] text-gray-500 mt-0.5">
                                                {isPSLV ? 'PSLV' : isGSLV ? 'GSLV/LVM' : isSLV ? 'SLV' : isASLV ? 'ASLV' : 'Other'}
                                            </p>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {tab === 'centres' && (
                        <motion.div key="centres" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                            {Object.entries(groupedCentres).sort(([, a], [, b]) => b.length - a.length).map(([state, stCentres]) => (
                                <div key={state}>
                                    <h3 className="text-sm font-semibold text-orange-400 mb-3 flex items-center gap-2">
                                        <Icons.MapPin className="w-4 h-4" /> {state} ({stCentres.length})
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {stCentres.map(centre => (
                                            <motion.div key={centre.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-all">
                                                <p className="text-sm font-medium text-white">{centre.name}</p>
                                                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                                    <Icons.MapPin className="w-3 h-3" /> {centre.Place}, {centre.State}
                                                </p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex justify-center pt-4 pb-8">
                    <Link href="/dashboard" className="px-8 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium hover:opacity-90 transition-all shadow-lg">
                        ← Back to Dashboard
                    </Link>
                </div>
            </main>
        </div>
    );
}
