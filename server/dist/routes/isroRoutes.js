"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const axios_1 = __importDefault(require("axios"));
const redis_1 = require("../config/redis");
const router = (0, express_1.Router)();
const ISRO_API = 'https://isro.vercel.app/api';
// Get all ISRO spacecrafts
router.get('/spacecrafts', async (_req, res) => {
    try {
        const data = await (0, redis_1.withCache)('isro:spacecrafts', redis_1.CACHE_TTL.ISRO_DATA, async () => {
            const response = await axios_1.default.get(`${ISRO_API}/spacecrafts`);
            return response.data;
        });
        res.json(data);
    }
    catch (error) {
        console.error('Error fetching ISRO spacecrafts:', error);
        res.status(500).json({ message: 'Error fetching ISRO spacecrafts' });
    }
});
// Get all ISRO launchers
router.get('/launchers', async (_req, res) => {
    try {
        const data = await (0, redis_1.withCache)('isro:launchers', redis_1.CACHE_TTL.ISRO_DATA, async () => {
            const response = await axios_1.default.get(`${ISRO_API}/launchers`);
            return response.data;
        });
        res.json(data);
    }
    catch (error) {
        console.error('Error fetching ISRO launchers:', error);
        res.status(500).json({ message: 'Error fetching ISRO launchers' });
    }
});
// Get all ISRO customer satellites
router.get('/customer_satellites', async (_req, res) => {
    try {
        const data = await (0, redis_1.withCache)('isro:customer_satellites', redis_1.CACHE_TTL.ISRO_DATA, async () => {
            const response = await axios_1.default.get(`${ISRO_API}/customer_satellites`);
            return response.data;
        });
        res.json(data);
    }
    catch (error) {
        console.error('Error fetching ISRO customer satellites:', error);
        res.status(500).json({ message: 'Error fetching ISRO customer satellites' });
    }
});
// Get all ISRO centres
router.get('/centres', async (_req, res) => {
    try {
        const data = await (0, redis_1.withCache)('isro:centres', redis_1.CACHE_TTL.ISRO_DATA, async () => {
            const response = await axios_1.default.get(`${ISRO_API}/centres`);
            return response.data;
        });
        res.json(data);
    }
    catch (error) {
        console.error('Error fetching ISRO centres:', error);
        res.status(500).json({ message: 'Error fetching ISRO centres' });
    }
});
// Combined dashboard data
router.get('/dashboard', async (_req, res) => {
    try {
        const data = await (0, redis_1.withCache)('isro:dashboard', redis_1.CACHE_TTL.ISRO_DATA, async () => {
            const [spacecrafts, launchers, centres] = await Promise.all([
                axios_1.default.get(`${ISRO_API}/spacecrafts`).then(r => r.data),
                axios_1.default.get(`${ISRO_API}/launchers`).then(r => r.data),
                axios_1.default.get(`${ISRO_API}/centres`).then(r => r.data),
            ]);
            return { spacecrafts: spacecrafts.spacecrafts, launchers: launchers.launchers, centres: centres.centres };
        });
        res.json(data);
    }
    catch (error) {
        console.error('Error fetching ISRO dashboard:', error);
        res.status(500).json({ message: 'Error fetching ISRO dashboard data' });
    }
});
exports.default = router;
