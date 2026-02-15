"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Asteroid_1 = __importDefault(require("../models/Asteroid"));
const SolarStorm_1 = __importDefault(require("../models/SolarStorm"));
const SatelliteTLE_1 = __importDefault(require("../models/SatelliteTLE"));
const nasaService_1 = require("../services/nasaService");
const authMiddleware_1 = require("../middleware/authMiddleware");
const redis_1 = require("../config/redis");
const router = express_1.default.Router();
// Get Hazardous Asteroids (cached 1hr)
router.get('/asteroids', async (req, res) => {
    try {
        const asteroids = await (0, redis_1.withCache)('nasa:asteroids', redis_1.CACHE_TTL.ASTEROIDS, async () => {
            return Asteroid_1.default.find({ isHazardous: true }).sort({ closeApproachDate: 1 }).lean();
        });
        res.json(asteroids);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching asteroids' });
    }
});
// Get Solar Weather Alerts (cached 5min)
router.get('/solar-weather', async (req, res) => {
    try {
        const storms = await (0, redis_1.withCache)('nasa:solar_weather', redis_1.CACHE_TTL.SOLAR_WEATHER, async () => {
            return SolarStorm_1.default.find().sort({ startTime: -1 }).lean();
        });
        res.json(storms);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching solar weather' });
    }
});
// Get Satellite TLEs (cached 30min)
router.get('/satellite-tle', async (req, res) => {
    try {
        const tles = await (0, redis_1.withCache)('nasa:satellite_tle', redis_1.CACHE_TTL.SATELLITE_TLE, async () => {
            return SatelliteTLE_1.default.find().sort({ satelliteName: 1 }).limit(100).lean();
        });
        res.json(tles);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching TLEs' });
    }
});
// Get single asteroid by ID
router.get('/asteroids/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let asteroid = null;
        try {
            asteroid = await Asteroid_1.default.findById(id);
        }
        catch {
            asteroid = await Asteroid_1.default.findOne({ nasaId: id });
        }
        if (!asteroid) {
            return res.status(404).json({ message: 'Asteroid not found' });
        }
        res.json(asteroid);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching asteroid' });
    }
});
// Get Dashboard Summary Data (cached 2min)
router.get('/dashboard', async (req, res) => {
    try {
        const data = await (0, redis_1.withCache)('nasa:dashboard', redis_1.CACHE_TTL.DASHBOARD, async () => {
            const [asteroids, solarStorms, satellites] = await Promise.all([
                Asteroid_1.default.find({ isHazardous: true }).sort({ closeApproachDate: 1 }).limit(10).lean(),
                SolarStorm_1.default.find().sort({ startTime: -1 }).limit(10).lean(),
                SatelliteTLE_1.default.find().sort({ lastUpdated: -1 }).limit(20).lean()
            ]);
            const latestStorm = solarStorms[0];
            const kpIndex = latestStorm?.kpIndex || 0;
            return {
                asteroids,
                solarStorms,
                satellites,
                kpIndex,
                systemStatus: {
                    status: kpIndex > 5 ? 'warning' : 'stable',
                    threatLevel: asteroids.length > 5 ? 'moderate' : 'low',
                    lastUpdate: new Date().toISOString()
                }
            };
        });
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching dashboard data' });
    }
});
// Initialize Data (public - for first time setup)
router.post('/init-data', async (req, res) => {
    try {
        console.log('Initializing data from NASA APIs...');
        await Promise.all([
            (0, nasaService_1.fetchHazardousAsteroids)(),
            (0, nasaService_1.fetchSolarWeather)(),
            (0, nasaService_1.fetchSatelliteTLE)()
        ]);
        res.json({ message: 'Data initialization completed', success: true });
    }
    catch (error) {
        res.status(500).json({ message: 'Error initializing data', error });
    }
});
// Manual Trigger (Protected - Admin Only)
router.post('/trigger-fetch', authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(['admin']), async (req, res) => {
    try {
        console.log('Manual fetch triggered');
        Promise.all([
            (0, nasaService_1.fetchHazardousAsteroids)(),
            (0, nasaService_1.fetchSolarWeather)(),
            (0, nasaService_1.fetchSatelliteTLE)()
        ]).then(() => console.log('Manual fetch completed'));
        res.json({ message: 'Fetch triggered in background' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error triggering fetch' });
    }
});
exports.default = router;
