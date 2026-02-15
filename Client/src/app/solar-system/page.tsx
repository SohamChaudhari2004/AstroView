'use client';

import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Stars, Ring, Line } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import SpaceLoader from '@/components/ui/SpaceLoader';

// Active missions/satellites/rovers per planet
const PLANET_MISSIONS: Record<string, {
    satellites: { name: string; agency: string; status: string; since: string }[];
    rovers: { name: string; agency: string; status: string; location: string }[];
    dataCollected: string;
    discoveries: string[];
}> = {
    Mercury: {
        satellites: [{ name: 'BepiColombo', agency: 'ESA/JAXA', status: 'En route (arrival 2025)', since: '2018' }],
        rovers: [],
        dataCollected: '~2TB from MESSENGER mission',
        discoveries: ['Water ice at poles', 'Magnetic field exists', 'Volcanic plains cover 27% of surface'],
    },
    Venus: {
        satellites: [{ name: 'Akatsuki', agency: 'JAXA', status: 'Active (orbiting)', since: '2015' }],
        rovers: [],
        dataCollected: '~5TB from multiple missions',
        discoveries: ['Possible phosphine in atmosphere', 'Super-rotation of atmosphere', 'Active volcanism evidence'],
    },
    Earth: {
        satellites: [
            { name: 'ISS', agency: 'NASA/Roscosmos/ESA/JAXA', status: 'Active', since: '1998' },
            { name: 'Hubble', agency: 'NASA/ESA', status: 'Active', since: '1990' },
            { name: 'JWST', agency: 'NASA/ESA/CSA', status: 'Active', since: '2022' },
            { name: 'Tiangong', agency: 'CNSA', status: 'Active', since: '2021' },
        ],
        rovers: [],
        dataCollected: 'Petabytes — continuous monitoring',
        discoveries: ['Over 5,000 exoplanets cataloged via space telescopes', 'Deep field images reveal earliest galaxies'],
    },
    Mars: {
        satellites: [
            { name: 'Mars Reconnaissance Orbiter', agency: 'NASA', status: 'Active', since: '2006' },
            { name: 'MAVEN', agency: 'NASA', status: 'Active', since: '2014' },
            { name: '2001 Mars Odyssey', agency: 'NASA', status: 'Active', since: '2001' },
            { name: 'Mars Express', agency: 'ESA', status: 'Active', since: '2003' },
            { name: 'ExoMars TGO', agency: 'ESA', status: 'Active', since: '2016' },
            { name: 'Hope (Al Amal)', agency: 'UAESA', status: 'Active', since: '2021' },
            { name: 'Tianwen-1 Orbiter', agency: 'CNSA', status: 'Active', since: '2021' },
        ],
        rovers: [
            { name: 'Curiosity', agency: 'NASA', status: 'Active', location: 'Gale Crater' },
            { name: 'Perseverance', agency: 'NASA', status: 'Active', location: 'Jezero Crater' },
            { name: 'Zhurong', agency: 'CNSA', status: 'Hibernating', location: 'Utopia Planitia' },
        ],
        dataCollected: '~50TB+ across all missions',
        discoveries: ['Ancient river deltas', 'Subsurface water ice', 'Organic molecules detected', 'Seasonal methane variations'],
    },
    Jupiter: {
        satellites: [
            { name: 'Juno', agency: 'NASA', status: 'Active (extended)', since: '2016' },
            { name: 'JUICE', agency: 'ESA', status: 'En route (arrival 2031)', since: '2023' },
        ],
        rovers: [],
        dataCollected: '~10TB from Juno mission',
        discoveries: ['Complex internal structure', 'Cyclone storms at poles', 'Europa water geysers confirmed'],
    },
    Saturn: {
        satellites: [],
        rovers: [],
        dataCollected: '~635GB from Cassini (1997-2017)',
        discoveries: ['Enceladus ocean and geysers', 'Titan methane seas', 'Hexagonal polar storm', 'Ring rain phenomenon'],
    },
    Uranus: {
        satellites: [],
        rovers: [],
        dataCollected: '~5GB from Voyager 2 flyby',
        discoveries: ['Tilted magnetic field', '13 rings discovered', 'Extreme seasonal variations'],
    },
    Neptune: {
        satellites: [],
        rovers: [],
        dataCollected: '~5GB from Voyager 2 flyby',
        discoveries: ['Great Dark Spot', 'Triton geysers', 'Fastest planetary winds (2,100 km/h)'],
    },
};

// Solar System data with realistic visual properties
const PLANET_DATA = [
    {
        name: 'Mercury', radius: 0.38, distance: 6, speed: 4.15,
        description: 'The smallest planet and closest to the Sun. It has no atmosphere and extreme temperature variations.',
        facts: { diameter: '4,879 km', dayLength: '59 Earth days', yearLength: '88 Earth days', gravity: '3.7 m/s²', temp: '-180°C to 430°C', moons: 0 },
        moons: [],
        // Grey-brown with craters
        baseColor: '#8c7e6d', emissive: '#1a1510', roughness: 0.95, metalness: 0.0,
        surfaceDetail: 'cratered',
    },
    {
        name: 'Venus', radius: 0.95, distance: 9, speed: 1.62,
        description: 'The hottest planet with a thick toxic atmosphere. Its surface pressure is 90 times that of Earth.',
        facts: { diameter: '12,104 km', dayLength: '243 Earth days', yearLength: '225 Earth days', gravity: '8.87 m/s²', temp: '462°C average', moons: 0 },
        moons: [],
        baseColor: '#e8cda0', emissive: '#2a2010', roughness: 0.5, metalness: 0.0,
        surfaceDetail: 'cloudy',
    },
    {
        name: 'Earth', radius: 1.0, distance: 12.5, speed: 1.0,
        description: 'Our home planet. The only known planet to harbor life, with liquid water on its surface.',
        facts: { diameter: '12,742 km', dayLength: '24 hours', yearLength: '365.25 days', gravity: '9.8 m/s²', temp: '15°C average', moons: 1 },
        moons: [{ name: 'Moon', radius: 0.27, distance: 1.8, color: '#c0c0c0', speed: 13.0, description: 'Earth\'s only natural satellite. It stabilizes Earth\'s axial tilt and causes tides.', facts: { diameter: '3,474 km', gravity: '1.62 m/s²', orbitalPeriod: '27.3 days' } }],
        baseColor: '#4a90d9', emissive: '#050a15', roughness: 0.6, metalness: 0.1,
        surfaceDetail: 'earth',
    },
    {
        name: 'Mars', radius: 0.53, distance: 16, speed: 0.53,
        description: 'The Red Planet. Home to the tallest mountain (Olympus Mons) and largest canyon (Valles Marineris) in the solar system.',
        facts: { diameter: '6,779 km', dayLength: '24.6 hours', yearLength: '687 Earth days', gravity: '3.72 m/s²', temp: '-60°C average', moons: 2 },
        moons: [
            { name: 'Phobos', radius: 0.12, distance: 1.2, color: '#8a7d6a', speed: 20.0, description: 'The larger and closer of Mars\' two moons. It is gradually spiraling inward.', facts: { diameter: '22.4 km', gravity: '0.0057 m/s²', orbitalPeriod: '7.65 hours' } },
            { name: 'Deimos', radius: 0.08, distance: 1.8, color: '#9a8d7a', speed: 8.0, description: 'The smaller and more distant of Mars\' two moons.', facts: { diameter: '12.4 km', gravity: '0.003 m/s²', orbitalPeriod: '30.3 hours' } },
        ],
        baseColor: '#c1440e', emissive: '#1a0800', roughness: 0.85, metalness: 0.0,
        surfaceDetail: 'rocky',
    },
    {
        name: 'Jupiter', radius: 2.5, distance: 24, speed: 0.084,
        description: 'The largest planet. A gas giant with the Great Red Spot — a storm larger than Earth.',
        facts: { diameter: '139,820 km', dayLength: '9.9 hours', yearLength: '11.86 years', gravity: '24.79 m/s²', temp: '-108°C average', moons: 95 },
        moons: [
            { name: 'Io', radius: 0.28, distance: 3.5, color: '#e8c84a', speed: 15.0, description: 'The most volcanically active body in the solar system.', facts: { diameter: '3,643 km', gravity: '1.80 m/s²', orbitalPeriod: '1.77 days' } },
            { name: 'Europa', radius: 0.25, distance: 4.2, color: '#c8d8e8', speed: 10.0, description: 'Has a subsurface ocean beneath its icy crust. Prime candidate for extraterrestrial life.', facts: { diameter: '3,122 km', gravity: '1.31 m/s²', orbitalPeriod: '3.55 days' } },
            { name: 'Ganymede', radius: 0.41, distance: 5.0, color: '#a0a0b0', speed: 6.0, description: 'Largest moon in the solar system. Larger than Mercury.', facts: { diameter: '5,268 km', gravity: '1.43 m/s²', orbitalPeriod: '7.15 days' } },
            { name: 'Callisto', radius: 0.38, distance: 5.8, color: '#707080', speed: 4.0, description: 'Most heavily cratered body in the solar system.', facts: { diameter: '4,821 km', gravity: '1.24 m/s²', orbitalPeriod: '16.7 days' } },
        ],
        baseColor: '#c88b3a', emissive: '#1a0f00', roughness: 0.4, metalness: 0.0,
        surfaceDetail: 'banded',
    },
    {
        name: 'Saturn', radius: 2.1, distance: 34, speed: 0.034,
        description: 'Famous for its extensive ring system. It is the least dense planet — would float in water.',
        facts: { diameter: '116,460 km', dayLength: '10.7 hours', yearLength: '29.46 years', gravity: '10.44 m/s²', temp: '-139°C average', moons: 146 },
        moons: [
            { name: 'Titan', radius: 0.40, distance: 4.0, color: '#d4a050', speed: 5.0, description: 'Only moon with a dense atmosphere. Has lakes of liquid methane and ethane.', facts: { diameter: '5,150 km', gravity: '1.35 m/s²', orbitalPeriod: '15.95 days' } },
            { name: 'Enceladus', radius: 0.15, distance: 3.0, color: '#f0f0f8', speed: 12.0, description: 'Shoots geysers of water ice into space. Subsurface ocean likely exists.', facts: { diameter: '504 km', gravity: '0.113 m/s²', orbitalPeriod: '1.37 days' } },
            { name: 'Mimas', radius: 0.10, distance: 2.4, color: '#d0d0d8', speed: 18.0, description: 'Has a large crater making it look like the Death Star.', facts: { diameter: '396 km', gravity: '0.064 m/s²', orbitalPeriod: '0.94 days' } },
        ],
        hasRings: true, ringInner: 2.8, ringOuter: 4.5,
        baseColor: '#e8d8a0', emissive: '#1a1508', roughness: 0.45, metalness: 0.0,
        surfaceDetail: 'banded',
    },
    {
        name: 'Uranus', radius: 1.6, distance: 44, speed: 0.012,
        description: 'An ice giant that rotates on its side. Has faint rings and 27 known moons.',
        facts: { diameter: '50,724 km', dayLength: '17.2 hours', yearLength: '84.01 years', gravity: '8.87 m/s²', temp: '-197°C average', moons: 27 },
        moons: [
            { name: 'Titania', radius: 0.25, distance: 3.0, color: '#c8c8d0', speed: 5.0, description: 'Largest moon of Uranus. Has deep canyons and scarps.', facts: { diameter: '1,578 km', gravity: '0.379 m/s²', orbitalPeriod: '8.71 days' } },
            { name: 'Oberon', radius: 0.24, distance: 3.6, color: '#b0b0b8', speed: 4.0, description: 'Second largest moon of Uranus.', facts: { diameter: '1,523 km', gravity: '0.346 m/s²', orbitalPeriod: '13.46 days' } },
        ],
        baseColor: '#82cfd9', emissive: '#081518', roughness: 0.3, metalness: 0.1,
        surfaceDetail: 'smooth',
    },
    {
        name: 'Neptune', radius: 1.5, distance: 52, speed: 0.006,
        description: 'The windiest planet with speeds up to 2,100 km/h. An ice giant with a Great Dark Spot.',
        facts: { diameter: '49,244 km', dayLength: '16.1 hours', yearLength: '164.8 years', gravity: '11.15 m/s²', temp: '-201°C average', moons: 16 },
        moons: [
            { name: 'Triton', radius: 0.22, distance: 3.0, color: '#c0d0e0', speed: 5.0, description: 'Only large moon with a retrograde orbit. Has geysers of nitrogen gas.', facts: { diameter: '2,707 km', gravity: '0.779 m/s²', orbitalPeriod: '5.88 days (retrograde)' } },
        ],
        baseColor: '#3f54ba', emissive: '#050820', roughness: 0.35, metalness: 0.1,
        surfaceDetail: 'banded',
    },
];

// ─── Realistic Sun Component ───
function Sun() {
    const meshRef = useRef<THREE.Mesh>(null!);
    const coronaRef = useRef<THREE.Mesh>(null!);
    const glowRef = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        meshRef.current.rotation.y += 0.002;
        // Pulsating corona
        const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.03;
        if (coronaRef.current) coronaRef.current.scale.setScalar(pulse);
        if (glowRef.current) glowRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.02);
    });

    return (
        <group>
            {/* Core */}
            <mesh ref={meshRef}>
                <sphereGeometry args={[3, 64, 64]} />
                <meshBasicMaterial color="#FDB813" />
            </mesh>
            {/* Inner corona */}
            <mesh ref={coronaRef}>
                <sphereGeometry args={[3.15, 48, 48]} />
                <meshBasicMaterial color="#FFD700" transparent opacity={0.2} />
            </mesh>
            {/* Mid glow */}
            <mesh ref={glowRef}>
                <sphereGeometry args={[3.5, 32, 32]} />
                <meshBasicMaterial color="#FFA500" transparent opacity={0.08} />
            </mesh>
            {/* Outer glow */}
            <mesh>
                <sphereGeometry args={[4.2, 32, 32]} />
                <meshBasicMaterial color="#FF8C00" transparent opacity={0.03} />
            </mesh>
            <pointLight intensity={2.5} distance={200} decay={0.4} color="#FFF5E0" />
            <pointLight intensity={0.8} distance={60} decay={0.8} color="#FFD700" />
        </group>
    );
}

// ─── Moon Component ───
interface MoonData { name: string; radius: number; distance: number; color: string; speed: number; description: string; facts: Record<string, string>; }

function MoonObject({ moon, parentRef, onSelect }: { moon: MoonData; parentRef: React.RefObject<THREE.Group>; onSelect: (m: MoonData) => void }) {
    const ref = useRef<THREE.Group>(null!);
    const angle = useRef(Math.random() * Math.PI * 2);

    useFrame((_, delta) => {
        angle.current += moon.speed * delta * 0.1;
        if (ref.current && parentRef.current) {
            ref.current.position.x = parentRef.current.position.x + Math.cos(angle.current) * moon.distance;
            ref.current.position.z = parentRef.current.position.z + Math.sin(angle.current) * moon.distance;
            ref.current.position.y = parentRef.current.position.y;
        }
    });

    return (
        <group ref={ref}>
            <mesh onClick={(e) => { e.stopPropagation(); onSelect(moon); }}>
                <sphereGeometry args={[moon.radius * 0.3, 24, 24]} />
                <meshStandardMaterial color={moon.color} roughness={0.85} metalness={0.05} />
            </mesh>
        </group>
    );
}

// ─── Realistic Planet Component ───
interface PlanetProps {
    planet: typeof PLANET_DATA[0];
    onSelect: (body: typeof PLANET_DATA[0] | MoonData) => void;
    timeScale: number;
}

function Planet({ planet, onSelect, timeScale }: PlanetProps) {
    const groupRef = useRef<THREE.Group>(null!);
    const meshRef = useRef<THREE.Mesh>(null!);
    const atmosphereRef = useRef<THREE.Mesh>(null!);
    const angle = useRef(Math.random() * Math.PI * 2);

    useFrame((state, delta) => {
        angle.current += planet.speed * delta * 0.05 * timeScale;
        if (groupRef.current) {
            groupRef.current.position.x = Math.cos(angle.current) * planet.distance;
            groupRef.current.position.z = Math.sin(angle.current) * planet.distance;
        }
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.3;
        }
        // Atmosphere shimmer for gas giants and Venus/Earth
        if (atmosphereRef.current) {
            const shimmer = 0.06 + Math.sin(state.clock.elapsedTime * 1.5 + planet.distance) * 0.02;
            (atmosphereRef.current.material as THREE.MeshBasicMaterial).opacity = shimmer;
        }
    });

    const orbitPoints = useMemo(() => {
        const pts: [number, number, number][] = [];
        for (let i = 0; i <= 128; i++) {
            const a = (i / 128) * Math.PI * 2;
            pts.push([Math.cos(a) * planet.distance, 0, Math.sin(a) * planet.distance]);
        }
        return pts;
    }, [planet.distance]);

    const hasAtmosphere = ['Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'].includes(planet.name);
    const atmosphereColor = planet.name === 'Earth' ? '#88ccff' :
        planet.name === 'Venus' ? '#e8cda0' :
            planet.name === 'Mars' ? '#cc8866' :
                planet.baseColor;

    // Axial tilt for realism
    const tilt = planet.name === 'Uranus' ? Math.PI / 2.2 :
        planet.name === 'Earth' ? 0.41 :
            planet.name === 'Mars' ? 0.44 :
                planet.name === 'Saturn' ? 0.47 : 0.1;

    return (
        <>
            <Line points={orbitPoints} color="#ffffff" lineWidth={1} transparent opacity={0.4} />

            <group ref={groupRef}>
                <group rotation={[tilt, 0, 0]}>
                    {/* Main body */}
                    <mesh ref={meshRef} onClick={(e) => { e.stopPropagation(); onSelect(planet); }}>
                        <sphereGeometry args={[planet.radius, 48, 48]} />
                        <meshStandardMaterial
                            color={planet.baseColor}
                            emissive={planet.emissive}
                            emissiveIntensity={0.3}
                            roughness={planet.roughness}
                            metalness={planet.metalness}
                        />
                    </mesh>

                    {/* Atmosphere shell */}
                    {hasAtmosphere && (
                        <mesh ref={atmosphereRef}>
                            <sphereGeometry args={[planet.radius * 1.08, 32, 32]} />
                            <meshBasicMaterial color={atmosphereColor} transparent opacity={0.06} />
                        </mesh>
                    )}

                    {/* Saturn rings */}
                    {'hasRings' in planet && planet.hasRings && (
                        <>
                            <Ring args={[planet.ringInner!, planet.ringOuter!, 128]} rotation={[Math.PI / 2, 0, 0]}>
                                <meshBasicMaterial color="#d4c8a0" transparent opacity={0.45} side={THREE.DoubleSide} />
                            </Ring>
                            {/* Inner ring detail */}
                            <Ring args={[planet.ringInner! * 0.85, planet.ringInner!, 64]} rotation={[Math.PI / 2, 0, 0]}>
                                <meshBasicMaterial color="#c0b890" transparent opacity={0.25} side={THREE.DoubleSide} />
                            </Ring>
                            {/* Gap (Cassini Division) */}
                            <Ring args={[(planet.ringInner! + planet.ringOuter!) / 2 - 0.05, (planet.ringInner! + planet.ringOuter!) / 2 + 0.05, 64]} rotation={[Math.PI / 2, 0, 0]}>
                                <meshBasicMaterial color="#000000" transparent opacity={0.3} side={THREE.DoubleSide} />
                            </Ring>
                        </>
                    )}
                </group>

                {/* Planet label */}
                <Html distanceFactor={15} position={[0, planet.radius + 0.5, 0]} center style={{ pointerEvents: 'none' }}>
                    <div className="text-white text-xs font-medium bg-black/70 px-2 py-0.5 rounded whitespace-nowrap backdrop-blur-sm border border-white/10">
                        {planet.name}
                    </div>
                </Html>

                {/* Moons */}
                {planet.moons.map((moon) => (
                    <MoonObject key={moon.name} moon={moon} parentRef={groupRef} onSelect={onSelect as (m: MoonData) => void} />
                ))}
            </group>
        </>
    );
}

// ─── Enhanced Info Panel with Missions & Satellite Data ───
function InfoPanel({ body, onClose }: { body: typeof PLANET_DATA[0] | MoonData | null; onClose: () => void }) {
    if (!body) return null;

    const isPlanet = 'distance' in body && 'moons' in body;
    const facts = body.facts as Record<string, string>;
    const missions = isPlanet ? PLANET_MISSIONS[body.name] : null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ x: 400, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 400, opacity: 0 }}
                className="absolute right-4 top-20 bottom-4 w-[340px] bg-black/85 backdrop-blur-xl border border-white/20 rounded-2xl p-5 overflow-y-auto z-50"
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#333 transparent' }}
            >
                <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all text-white">✕</button>

                {/* Header */}
                <div className="mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${isPlanet ? 'from-violet-500 to-cyan-500' : 'from-gray-500 to-slate-600'} flex items-center justify-center mb-3`}>
                        <span className="text-xl">{isPlanet ? '🪐' : '🌙'}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white">{body.name}</h2>
                    <p className="text-sm text-gray-400 mt-1">{isPlanet ? 'Planet' : 'Moon'}</p>
                </div>

                <p className="text-sm text-gray-300 leading-relaxed mb-5">{body.description}</p>

                {/* Properties */}
                <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-semibold">Properties</h3>
                <div className="space-y-1 mb-5">
                    {Object.entries(facts).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-1.5 border-b border-white/5 text-sm">
                            <span className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                            <span className="text-white font-medium">{String(value)}</span>
                        </div>
                    ))}
                </div>

                {/* Active Satellites */}
                {missions && missions.satellites.length > 0 && (
                    <div className="mb-5">
                        <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-semibold flex items-center gap-2">
                            <span>🛰️</span> Active Satellites ({missions.satellites.length})
                        </h3>
                        <div className="space-y-2">
                            {missions.satellites.map(sat => (
                                <div key={sat.name} className="p-2.5 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                                    <div className="flex justify-between items-start">
                                        <p className="text-white font-medium text-xs">{sat.name}</p>
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${sat.status.includes('Active') ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                                            {sat.status.includes('Active') ? '● ACTIVE' : sat.status.includes('En route') ? '→ EN ROUTE' : sat.status}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-gray-500 mt-1">{sat.agency} • Since {sat.since}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Active Rovers */}
                {missions && missions.rovers.length > 0 && (
                    <div className="mb-5">
                        <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-semibold flex items-center gap-2">
                            <span>🤖</span> Rovers ({missions.rovers.length})
                        </h3>
                        <div className="space-y-2">
                            {missions.rovers.map(rover => (
                                <div key={rover.name} className="p-2.5 rounded-xl bg-orange-500/5 border border-orange-500/20">
                                    <div className="flex justify-between items-start">
                                        <p className="text-white font-medium text-xs">{rover.name}</p>
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${rover.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'}`}>
                                            {rover.status === 'Active' ? '● ACTIVE' : rover.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-gray-500 mt-1">{rover.agency} • {rover.location}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Data & Discoveries */}
                {missions && (
                    <div className="mb-5">
                        <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-semibold flex items-center gap-2">
                            <span>📊</span> Data Collected
                        </h3>
                        <p className="text-sm text-cyan-400 font-medium mb-3">{missions.dataCollected}</p>

                        <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-semibold flex items-center gap-2">
                            <span>🔬</span> Key Discoveries
                        </h3>
                        <div className="space-y-1.5">
                            {missions.discoveries.map((d, i) => (
                                <div key={i} className="flex items-start gap-2 text-xs text-gray-300">
                                    <span className="text-violet-400 mt-0.5">›</span>
                                    <span>{d}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Notable Moons */}
                {isPlanet && 'moons' in body && (body as typeof PLANET_DATA[0]).moons.length > 0 && (
                    <div className="mt-4">
                        <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-semibold">
                            Notable Moons ({(body as typeof PLANET_DATA[0]).moons.length})
                        </h3>
                        <div className="space-y-2">
                            {(body as typeof PLANET_DATA[0]).moons.map(moon => (
                                <div key={moon.name} className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                                    <p className="text-white font-medium text-sm">{moon.name}</p>
                                    <p className="text-[11px] text-gray-400 mt-1">{moon.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    );
}

export default function SolarSystemPage() {
    const [selected, setSelected] = useState<typeof PLANET_DATA[0] | MoonData | null>(null);
    const [timeScale, setTimeScale] = useState(1);

    return (
        <div className="min-h-screen bg-black text-white relative">
            {/* Header */}
            <header className="absolute top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10">
                <div className="max-w-full mx-auto px-4 py-3 flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
                        </svg>
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-lg font-bold">Solar System Explorer</h1>
                        <p className="text-xs text-gray-400">Interactive 3D visualization • Click any planet or moon</p>
                    </div>

                    {/* Time controls */}
                    <div className="flex items-center gap-2 bg-white/5 rounded-xl p-1.5 border border-white/10">
                        {[0.25, 0.5, 1, 2, 5].map(s => (
                            <button key={s} onClick={() => setTimeScale(s)}
                                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${timeScale === s ? 'bg-violet-500 text-white' : 'text-gray-400 hover:text-white'}`}>
                                {s}×
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* Planet Quick-Select */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 flex gap-2 bg-black/60 backdrop-blur-xl rounded-2xl p-2 border border-white/10">
                {PLANET_DATA.map(p => (
                    <button key={p.name} onClick={() => setSelected(p)}
                        className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${selected?.name === p.name ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
                        {p.name}
                    </button>
                ))}
            </div>

            {/* Info Panel */}
            <InfoPanel body={selected} onClose={() => setSelected(null)} />

            {/* 3D Canvas */}
            <Canvas
                camera={{ position: [0, 40, 60], fov: 50, near: 0.1, far: 500 }}
                className="!h-screen"
                gl={{ antialias: true }}
            >
                <Suspense fallback={<Html center><SpaceLoader size="md" /></Html>}>
                    <ambientLight intensity={0.15} />
                    <Stars radius={200} depth={100} count={8000} factor={4} saturation={0.2} fade speed={0.3} />

                    <Sun />

                    {PLANET_DATA.map(planet => (
                        <Planet key={planet.name} planet={planet} onSelect={setSelected} timeScale={timeScale} />
                    ))}

                    <OrbitControls
                        enablePan={true}
                        enableZoom={true}
                        enableRotate={true}
                        minDistance={5}
                        maxDistance={150}
                        autoRotate
                        autoRotateSpeed={0.15}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
}
