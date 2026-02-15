import express from 'express';
import Asteroid from '../models/Asteroid';
import SolarStorm from '../models/SolarStorm';
import SatelliteTLE from '../models/SatelliteTLE';
import { fetchHazardousAsteroids, fetchSolarWeather, fetchSatelliteTLE } from '../services/nasaService';
import { authenticate, authorize } from '../middleware/authMiddleware';
import { withCache, CACHE_TTL } from '../config/redis';

const router = express.Router();

// Get Hazardous Asteroids (cached 1hr)
router.get('/asteroids', async (req, res) => {
  try {
    const asteroids = await withCache('nasa:asteroids', CACHE_TTL.ASTEROIDS, async () => {
      return Asteroid.find({ isHazardous: true }).sort({ closeApproachDate: 1 }).lean();
    });
    res.json(asteroids);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching asteroids' });
  }
});

// Get Solar Weather Alerts (cached 5min)
router.get('/solar-weather', async (req, res) => {
  try {
    const storms = await withCache('nasa:solar_weather', CACHE_TTL.SOLAR_WEATHER, async () => {
      return SolarStorm.find().sort({ startTime: -1 }).lean();
    });
    res.json(storms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching solar weather' });
  }
});

// Get Satellite TLEs (cached 30min)
router.get('/satellite-tle', async (req, res) => {
  try {
    const tles = await withCache('nasa:satellite_tle', CACHE_TTL.SATELLITE_TLE, async () => {
      return SatelliteTLE.find().sort({ satelliteName: 1 }).limit(100).lean();
    });
    res.json(tles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching TLEs' });
  }
});

// Get single asteroid by ID
router.get('/asteroids/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let asteroid = null;
    try {
      asteroid = await Asteroid.findById(id);
    } catch {
      asteroid = await Asteroid.findOne({ nasaId: id });
    }
    if (!asteroid) {
      return res.status(404).json({ message: 'Asteroid not found' });
    }
    res.json(asteroid);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching asteroid' });
  }
});

// Get Dashboard Summary Data (cached 2min)
router.get('/dashboard', async (req, res) => {
  try {
    const data = await withCache('nasa:dashboard', CACHE_TTL.DASHBOARD, async () => {
      const [asteroids, solarStorms, satellites] = await Promise.all([
        Asteroid.find({ isHazardous: true }).sort({ closeApproachDate: 1 }).limit(10).lean(),
        SolarStorm.find().sort({ startTime: -1 }).limit(10).lean(),
        SatelliteTLE.find().sort({ lastUpdated: -1 }).limit(20).lean()
      ]);

      const latestStorm = solarStorms[0] as any;
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
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});

// Initialize Data (public - for first time setup)
router.post('/init-data', async (req, res) => {
  try {
    console.log('Initializing data from NASA APIs...');
    await Promise.all([
      fetchHazardousAsteroids(),
      fetchSolarWeather(),
      fetchSatelliteTLE()
    ]);
    res.json({ message: 'Data initialization completed', success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error initializing data', error });
  }
});

// Manual Trigger (Protected - Admin Only)
router.post('/trigger-fetch', authenticate, authorize(['admin']), async (req, res) => {
  try {
    console.log('Manual fetch triggered');
    Promise.all([
      fetchHazardousAsteroids(),
      fetchSolarWeather(),
      fetchSatelliteTLE()
    ]).then(() => console.log('Manual fetch completed'));
    res.json({ message: 'Fetch triggered in background' });
  } catch (error) {
    res.status(500).json({ message: 'Error triggering fetch' });
  }
});

export default router;
