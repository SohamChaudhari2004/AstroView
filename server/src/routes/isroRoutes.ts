import { Router } from 'express';
import axios from 'axios';
import { withCache, CACHE_TTL } from '../config/redis';

const router = Router();
const ISRO_API = 'https://isro.vercel.app/api';

// Get all ISRO spacecrafts
router.get('/spacecrafts', async (_req, res) => {
    try {
        const data = await withCache('isro:spacecrafts', CACHE_TTL.ISRO_DATA, async () => {
            const response = await axios.get(`${ISRO_API}/spacecrafts`);
            return response.data;
        });
        res.json(data);
    } catch (error) {
        console.error('Error fetching ISRO spacecrafts:', error);
        res.status(500).json({ message: 'Error fetching ISRO spacecrafts' });
    }
});

// Get all ISRO launchers
router.get('/launchers', async (_req, res) => {
    try {
        const data = await withCache('isro:launchers', CACHE_TTL.ISRO_DATA, async () => {
            const response = await axios.get(`${ISRO_API}/launchers`);
            return response.data;
        });
        res.json(data);
    } catch (error) {
        console.error('Error fetching ISRO launchers:', error);
        res.status(500).json({ message: 'Error fetching ISRO launchers' });
    }
});

// Get all ISRO customer satellites
router.get('/customer_satellites', async (_req, res) => {
    try {
        const data = await withCache('isro:customer_satellites', CACHE_TTL.ISRO_DATA, async () => {
            const response = await axios.get(`${ISRO_API}/customer_satellites`);
            return response.data;
        });
        res.json(data);
    } catch (error) {
        console.error('Error fetching ISRO customer satellites:', error);
        res.status(500).json({ message: 'Error fetching ISRO customer satellites' });
    }
});

// Get all ISRO centres
router.get('/centres', async (_req, res) => {
    try {
        const data = await withCache('isro:centres', CACHE_TTL.ISRO_DATA, async () => {
            const response = await axios.get(`${ISRO_API}/centres`);
            return response.data;
        });
        res.json(data);
    } catch (error) {
        console.error('Error fetching ISRO centres:', error);
        res.status(500).json({ message: 'Error fetching ISRO centres' });
    }
});

// Combined dashboard data
router.get('/dashboard', async (_req, res) => {
    try {
        const data = await withCache('isro:dashboard', CACHE_TTL.ISRO_DATA, async () => {
            const [spacecrafts, launchers, centres] = await Promise.all([
                axios.get(`${ISRO_API}/spacecrafts`).then(r => r.data),
                axios.get(`${ISRO_API}/launchers`).then(r => r.data),
                axios.get(`${ISRO_API}/centres`).then(r => r.data),
            ]);
            return { spacecrafts: spacecrafts.spacecrafts, launchers: launchers.launchers, centres: centres.centres };
        });
        res.json(data);
    } catch (error) {
        console.error('Error fetching ISRO dashboard:', error);
        res.status(500).json({ message: 'Error fetching ISRO dashboard data' });
    }
});

export default router;
