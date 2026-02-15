import { Router } from 'express';
import axios from 'axios';
import { withCache, CACHE_TTL } from '../config/redis';

const router = Router();
const NASA_API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';

// Mars Rover Photos - Curiosity latest
router.get('/rover/curiosity', async (req, res) => {
    try {
        const { sol, page } = req.query;
        const solParam = sol || '1000';
        const pageParam = page || '1';
        const data = await withCache(`mars:curiosity:${solParam}:${pageParam}`, CACHE_TTL.MARS_PHOTOS, async () => {
            const response = await axios.get(
                `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${solParam}&page=${pageParam}&api_key=${NASA_API_KEY}`
            );
            return response.data;
        });
        res.json(data);
    } catch (error) {
        console.error('Error fetching Curiosity photos:', error);
        res.status(500).json({ message: 'Error fetching Curiosity data' });
    }
});

// Mars Rover Photos - Perseverance latest
router.get('/rover/perseverance', async (req, res) => {
    try {
        const { sol, page } = req.query;
        const solParam = sol || '100';
        const pageParam = page || '1';
        const data = await withCache(`mars:perseverance:${solParam}:${pageParam}`, CACHE_TTL.MARS_PHOTOS, async () => {
            const response = await axios.get(
                `https://api.nasa.gov/mars-photos/api/v1/rovers/perseverance/photos?sol=${solParam}&page=${pageParam}&api_key=${NASA_API_KEY}`
            );
            return response.data;
        });
        res.json(data);
    } catch (error) {
        console.error('Error fetching Perseverance photos:', error);
        res.status(500).json({ message: 'Error fetching Perseverance data' });
    }
});

// Mars Rover manifest (full mission stats)
router.get('/rover/:roverName/manifest', async (req, res) => {
    try {
        const { roverName } = req.params;
        const data = await withCache(`mars:manifest:${roverName}`, CACHE_TTL.MARS_DASHBOARD, async () => {
            const response = await axios.get(
                `https://api.nasa.gov/mars-photos/api/v1/manifests/${roverName}?api_key=${NASA_API_KEY}`
            );
            return response.data;
        });
        res.json(data);
    } catch (error) {
        console.error('Error fetching rover manifest:', error);
        res.status(500).json({ message: 'Error fetching rover manifest' });
    }
});

// Mars Weather (InSight + curated data)
router.get('/weather', async (_req, res) => {
    try {
        const data = await withCache('mars:weather', CACHE_TTL.MARS_WEATHER, async () => {
            // InSight weather API (may return limited data since InSight ended in Dec 2022)
            let insightData: any = null;
            try {
                const resp = await axios.get(
                    `https://api.nasa.gov/insight_weather/?api_key=${NASA_API_KEY}&feedtype=json&ver=1.0`
                );
                insightData = resp.data;
            } catch { /* InSight data may not be available */ }

            // Curated Mars weather (since InSight is no longer active)
            return {
                source: insightData ? 'NASA InSight' : 'Simulated / Historical',
                insightData,
                currentConditions: {
                    temperature: { avg: -60, min: -100, max: -20, unit: '°C' },
                    pressure: { avg: 720, min: 690, max: 750, unit: 'Pa' },
                    windSpeed: { avg: 6.5, max: 25, unit: 'm/s' },
                    windDirection: 'SW',
                    season: getMarsSeason(),
                    opacity: 'Sunny',
                    uvIndex: 'Very High',
                    sol: estimateCurrentSol(),
                },
                atmosphere: {
                    composition: [
                        { gas: 'Carbon Dioxide (CO₂)', percentage: 95.32 },
                        { gas: 'Nitrogen (N₂)', percentage: 2.7 },
                        { gas: 'Argon (Ar)', percentage: 1.6 },
                        { gas: 'Oxygen (O₂)', percentage: 0.13 },
                        { gas: 'Carbon Monoxide (CO)', percentage: 0.08 },
                        { gas: 'Water Vapor (H₂O)', percentage: 0.03 },
                    ],
                    surfacePressure: '610 Pa (0.6% of Earth)',
                    scaleHeight: '11.1 km',
                },
                dustStorms: {
                    global: false,
                    regional: 'Minor dust activity in Hellas Basin',
                    lastMajorStorm: '2018 (global, ended InSight solar power)',
                },
                lastUpdated: new Date().toISOString(),
            };
        });
        res.json(data);
    } catch (error) {
        console.error('Error fetching Mars weather:', error);
        res.status(500).json({ message: 'Error fetching Mars weather' });
    }
});

// Combined Mars dashboard
router.get('/dashboard', async (_req, res) => {
    try {
        const data = await withCache('mars:dashboard', CACHE_TTL.MARS_DASHBOARD, async () => {
            const [curiosityManifest, perseveranceManifest] = await Promise.all([
                axios.get(`https://api.nasa.gov/mars-photos/api/v1/manifests/curiosity?api_key=${NASA_API_KEY}`).then(r => r.data),
                axios.get(`https://api.nasa.gov/mars-photos/api/v1/manifests/perseverance?api_key=${NASA_API_KEY}`).then(r => r.data),
            ]);

            const cMaxSol = curiosityManifest.photo_manifest?.max_sol || 4000;
            const pMaxSol = perseveranceManifest.photo_manifest?.max_sol || 1000;

            const [curiosityPhotos, perseverancePhotos] = await Promise.all([
                axios.get(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${cMaxSol}&page=1&api_key=${NASA_API_KEY}`).then(r => r.data).catch(() => ({ photos: [] })),
                axios.get(`https://api.nasa.gov/mars-photos/api/v1/rovers/perseverance/photos?sol=${pMaxSol}&page=1&api_key=${NASA_API_KEY}`).then(r => r.data).catch(() => ({ photos: [] })),
            ]);

            return {
                rovers: [
                    {
                        name: 'Curiosity', agency: 'NASA',
                        status: curiosityManifest.photo_manifest?.status || 'active',
                        launchDate: '2011-11-26', landingDate: '2012-08-06', landingSite: 'Gale Crater',
                        totalPhotos: curiosityManifest.photo_manifest?.total_photos || 0,
                        maxSol: curiosityManifest.photo_manifest?.max_sol || 0,
                        latestPhotos: (curiosityPhotos.photos || []).slice(0, 4),
                        description: 'Car-sized rover exploring Gale Crater since 2012. Studying Mars habitability and geology.',
                    },
                    {
                        name: 'Perseverance', agency: 'NASA',
                        status: perseveranceManifest.photo_manifest?.status || 'active',
                        launchDate: '2020-07-30', landingDate: '2021-02-18', landingSite: 'Jezero Crater',
                        totalPhotos: perseveranceManifest.photo_manifest?.total_photos || 0,
                        maxSol: perseveranceManifest.photo_manifest?.max_sol || 0,
                        latestPhotos: (perseverancePhotos.photos || []).slice(0, 4),
                        description: 'Latest Mars rover searching for ancient microbial life and collecting samples for future return.',
                    },
                    {
                        name: 'Zhurong', agency: 'CNSA', status: 'hibernating',
                        launchDate: '2020-07-23', landingDate: '2021-05-14', landingSite: 'Utopia Planitia',
                        totalPhotos: 0, maxSol: 0, latestPhotos: [],
                        description: 'Chinese rover that explored Utopia Planitia. Entered hibernation in May 2022.',
                    },
                ],
                orbiters: [
                    { name: '2001 Mars Odyssey', agency: 'NASA', launchDate: '2001-04-07', status: 'active', description: 'Longest-serving spacecraft at Mars. Maps minerals and radiation environment.' },
                    { name: 'Mars Express', agency: 'ESA', launchDate: '2003-06-02', status: 'active', description: 'European orbiter studying Mars atmosphere, surface, and subsurface.' },
                    { name: 'Mars Reconnaissance Orbiter', agency: 'NASA', launchDate: '2005-08-12', status: 'active', description: 'High-resolution imaging and data relay for surface missions.' },
                    { name: 'MAVEN', agency: 'NASA', launchDate: '2013-11-18', status: 'active', description: 'Studying Mars upper atmosphere and its interaction with solar wind.' },
                    { name: 'Mars Orbiter Mission (Mangalyaan)', agency: 'ISRO', launchDate: '2013-11-05', status: 'completed', description: "India's first Mars mission. Successfully orbited Mars on first attempt." },
                    { name: 'ExoMars TGO', agency: 'ESA/Roscosmos', launchDate: '2016-03-14', status: 'active', description: 'Studying trace gases in Mars atmosphere, especially methane.' },
                    { name: 'Hope (Al Amal)', agency: 'UAESA', launchDate: '2020-07-19', status: 'active', description: 'UAE mission studying Mars weather and climate dynamics.' },
                    { name: 'Tianwen-1 Orbiter', agency: 'CNSA', launchDate: '2020-07-23', status: 'active', description: 'Chinese orbiter conducting remote sensing of Mars surface and atmosphere.' },
                ],
            };
        });
        res.json(data);
    } catch (error) {
        console.error('Error fetching Mars dashboard:', error);
        res.status(500).json({ message: 'Error fetching Mars dashboard data' });
    }
});

// Helpers
function getMarsSeason(): string {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    // Mars seasons are approximately 6 Earth months each
    const marsSeason = dayOfYear % 365;
    if (marsSeason < 91) return 'Northern Spring / Southern Autumn';
    if (marsSeason < 182) return 'Northern Summer / Southern Winter';
    if (marsSeason < 273) return 'Northern Autumn / Southern Spring';
    return 'Northern Winter / Southern Summer';
}

function estimateCurrentSol(): number {
    // Curiosity landing: Aug 6, 2012 (Sol 0)
    const landingDate = new Date('2012-08-06').getTime();
    const daysSinceLanding = (Date.now() - landingDate) / 86400000;
    return Math.floor(daysSinceLanding / 1.02749); // Mars sol = 1.02749 Earth days
}

export default router;
