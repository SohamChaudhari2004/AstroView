import { Router } from 'express';
import axios from 'axios';
import { withCache, CACHE_TTL } from '../config/redis';

const router = Router();
const NASA_API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';
const DONKI_BASE = 'https://api.nasa.gov/DONKI';

// ────────────────────────────────────────────
//  SOLAR FLARES (FLR)
// ────────────────────────────────────────────
router.get('/solar-flares', async (_req, res) => {
    try {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
        const data = await withCache('space_weather:solar_flares', CACHE_TTL.SOLAR_FLARES, async () => {
            const resp = await axios.get(`${DONKI_BASE}/FLR`, {
                params: { startDate: thirtyDaysAgo, api_key: NASA_API_KEY }
            });
            return (resp.data || []).map((f: any) => ({
                flrID: f.flrID,
                beginTime: f.beginTime,
                peakTime: f.peakTime,
                endTime: f.endTime,
                classType: f.classType,
                sourceLocation: f.sourceLocation,
                activeRegionNum: f.activeRegionNum,
                instruments: f.instruments?.map((i: any) => i.displayName) || [],
                linkedEvents: f.linkedEvents?.length || 0,
            }));
        });
        res.json(data);
    } catch (error) {
        console.error('Error fetching solar flares:', error);
        res.status(500).json({ message: 'Error fetching solar flare data' });
    }
});

// ────────────────────────────────────────────
//  CORONAL MASS EJECTIONS (CME)
// ────────────────────────────────────────────
router.get('/cme', async (_req, res) => {
    try {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
        const data = await withCache('space_weather:cme', CACHE_TTL.CME_EVENTS, async () => {
            const resp = await axios.get(`${DONKI_BASE}/CME`, {
                params: { startDate: thirtyDaysAgo, api_key: NASA_API_KEY }
            });
            return (resp.data || []).map((c: any) => ({
                activityID: c.activityID,
                startTime: c.startTime,
                sourceLocation: c.sourceLocation,
                activeRegionNum: c.activeRegionNum,
                note: c.note,
                speed: c.cmeAnalyses?.[0]?.speed || null,
                halfAngle: c.cmeAnalyses?.[0]?.halfAngle || null,
                type: c.cmeAnalyses?.[0]?.type || 'Unknown',
                isMostAccurate: c.cmeAnalyses?.[0]?.isMostAccurate || false,
                earthImpact: c.cmeAnalyses?.[0]?.enlilList?.some((e: any) => e.isEarthGB) || false,
                linkedEvents: c.linkedEvents?.length || 0,
            }));
        });
        res.json(data);
    } catch (error) {
        console.error('Error fetching CME data:', error);
        res.status(500).json({ message: 'Error fetching CME data' });
    }
});

// ────────────────────────────────────────────
//  GEOMAGNETIC STORMS (GST)
// ────────────────────────────────────────────
router.get('/geomagnetic-storms', async (_req, res) => {
    try {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
        const data = await withCache('space_weather:gst', CACHE_TTL.SOLAR_WEATHER, async () => {
            const resp = await axios.get(`${DONKI_BASE}/GST`, {
                params: { startDate: thirtyDaysAgo, api_key: NASA_API_KEY }
            });
            return (resp.data || []).map((s: any) => ({
                gstID: s.gstID,
                startTime: s.startTime,
                kpIndex: s.allKpIndex?.[0]?.kpIndex || 0,
                observedTime: s.allKpIndex?.[0]?.observedTime || null,
                source: s.allKpIndex?.[0]?.source || 'Unknown',
                allKpIndex: s.allKpIndex || [],
                linkedEvents: s.linkedEvents?.length || 0,
            }));
        });
        res.json(data);
    } catch (error) {
        console.error('Error fetching geomagnetic storms:', error);
        res.status(500).json({ message: 'Error fetching geomagnetic storm data' });
    }
});

// ────────────────────────────────────────────
//  SOLAR WIND / INTERPLANETARY SHOCK (IPS)
// ────────────────────────────────────────────
router.get('/solar-wind', async (_req, res) => {
    try {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
        const data = await withCache('space_weather:solar_wind', CACHE_TTL.SOLAR_WIND, async () => {
            const resp = await axios.get(`${DONKI_BASE}/IPS`, {
                params: { startDate: thirtyDaysAgo, api_key: NASA_API_KEY }
            });
            return (resp.data || []).map((w: any) => ({
                activityID: w.activityID,
                eventTime: w.eventTime,
                location: w.location || 'Earth',
                instruments: w.instruments?.map((i: any) => i.displayName) || [],
            }));
        });
        res.json(data);
    } catch (error) {
        console.error('Error fetching solar wind:', error);
        res.status(500).json({ message: 'Error fetching solar wind data' });
    }
});

// ────────────────────────────────────────────
//  HIGH-SPEED STREAMS (HSS)
// ────────────────────────────────────────────
router.get('/hss', async (_req, res) => {
    try {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
        const data = await withCache('space_weather:hss', CACHE_TTL.SOLAR_WEATHER, async () => {
            const resp = await axios.get(`${DONKI_BASE}/HSS`, {
                params: { startDate: thirtyDaysAgo, api_key: NASA_API_KEY }
            });
            return (resp.data || []).map((h: any) => ({
                hssID: h.hssID,
                eventTime: h.eventTime,
                instruments: h.instruments?.map((i: any) => i.displayName) || [],
                linkedEvents: h.linkedEvents?.length || 0,
            }));
        });
        res.json(data);
    } catch (error) {
        console.error('Error fetching HSS:', error);
        res.status(500).json({ message: 'Error fetching HSS data' });
    }
});

// ────────────────────────────────────────────
//  RADIATION BELT ENHANCEMENT (RBE)
// ────────────────────────────────────────────
router.get('/radiation-belt', async (_req, res) => {
    try {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
        const data = await withCache('space_weather:rbe', CACHE_TTL.SOLAR_WEATHER, async () => {
            const resp = await axios.get(`${DONKI_BASE}/RBE`, {
                params: { startDate: thirtyDaysAgo, api_key: NASA_API_KEY }
            });
            return resp.data || [];
        });
        res.json(data);
    } catch (error) {
        console.error('Error fetching RBE:', error);
        res.status(500).json({ message: 'Error fetching radiation belt data' });
    }
});

// ────────────────────────────────────────────
//  NOTIFICATIONS  
// ────────────────────────────────────────────
router.get('/notifications', async (_req, res) => {
    try {
        const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
        const data = await withCache('space_weather:notifications', CACHE_TTL.SOLAR_WEATHER, async () => {
            const resp = await axios.get(`${DONKI_BASE}/notifications`, {
                params: { startDate: sevenDaysAgo, type: 'all', api_key: NASA_API_KEY }
            });
            return (resp.data || []).slice(0, 20).map((n: any) => ({
                messageID: n.messageID,
                messageType: n.messageType,
                messageIssueTime: n.messageIssueTime,
                messageBody: n.messageBody?.substring(0, 500) || '',
                messageURL: n.messageURL,
            }));
        });
        res.json(data);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Error fetching notifications' });
    }
});

// ────────────────────────────────────────────
//  AGGREGATED SPACE WEATHER DASHBOARD
// ────────────────────────────────────────────
router.get('/dashboard', async (_req, res) => {
    try {
        const data = await withCache('space_weather:dashboard', CACHE_TTL.SPACE_WEATHER_FULL, async () => {
            const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
            const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];

            const [flares, cme, gst, ips, hss, notifications] = await Promise.allSettled([
                axios.get(`${DONKI_BASE}/FLR`, { params: { startDate: thirtyDaysAgo, api_key: NASA_API_KEY } }),
                axios.get(`${DONKI_BASE}/CME`, { params: { startDate: thirtyDaysAgo, api_key: NASA_API_KEY } }),
                axios.get(`${DONKI_BASE}/GST`, { params: { startDate: thirtyDaysAgo, api_key: NASA_API_KEY } }),
                axios.get(`${DONKI_BASE}/IPS`, { params: { startDate: thirtyDaysAgo, api_key: NASA_API_KEY } }),
                axios.get(`${DONKI_BASE}/HSS`, { params: { startDate: thirtyDaysAgo, api_key: NASA_API_KEY } }),
                axios.get(`${DONKI_BASE}/notifications`, { params: { startDate: sevenDaysAgo, type: 'all', api_key: NASA_API_KEY } }),
            ]);

            const extract = (r: PromiseSettledResult<any>) => r.status === 'fulfilled' ? (r.value.data || []) : [];

            const solarFlares = extract(flares).map((f: any) => ({
                flrID: f.flrID, beginTime: f.beginTime, peakTime: f.peakTime,
                classType: f.classType, sourceLocation: f.sourceLocation,
            }));
            const cmeEvents = extract(cme).map((c: any) => ({
                activityID: c.activityID, startTime: c.startTime,
                speed: c.cmeAnalyses?.[0]?.speed || null,
                type: c.cmeAnalyses?.[0]?.type || 'Unknown',
                earthImpact: c.cmeAnalyses?.[0]?.enlilList?.some((e: any) => e.isEarthGB) || false,
            }));
            const geoStorms = extract(gst).map((s: any) => ({
                gstID: s.gstID, startTime: s.startTime,
                kpIndex: s.allKpIndex?.[0]?.kpIndex || 0,
            }));
            const solarWind = extract(ips).map((w: any) => ({
                activityID: w.activityID, eventTime: w.eventTime,
                location: w.location || 'Earth',
            }));
            const highSpeedStreams = extract(hss).map((h: any) => ({
                hssID: h.hssID, eventTime: h.eventTime,
            }));
            const recentNotifications = extract(notifications).slice(0, 10).map((n: any) => ({
                messageType: n.messageType,
                messageIssueTime: n.messageIssueTime,
                messageBody: n.messageBody?.substring(0, 300) || '',
            }));

            // Determine alert level
            const latestKp = geoStorms.length > 0 ? Math.max(...geoStorms.map((s: any) => s.kpIndex)) : 0;
            const hasXFlare = solarFlares.some((f: any) => f.classType?.startsWith('X'));
            const hasMFlare = solarFlares.some((f: any) => f.classType?.startsWith('M'));
            const hasEarthImpactCME = cmeEvents.some((c: any) => c.earthImpact);

            let alertLevel: 'nominal' | 'watch' | 'warning' | 'alert' = 'nominal';
            if (latestKp >= 7 || hasXFlare || hasEarthImpactCME) alertLevel = 'alert';
            else if (latestKp >= 5 || hasMFlare) alertLevel = 'warning';
            else if (latestKp >= 3 || solarFlares.length > 5) alertLevel = 'watch';

            // Aurora forecast - simplified based on KP index
            const auroraForecast = {
                kpIndex: latestKp,
                visibility: latestKp >= 7 ? 'Visible at mid-latitudes (40°+)' :
                    latestKp >= 5 ? 'Visible at high latitudes (50°+)' :
                        latestKp >= 3 ? 'Visible near polar regions (60°+)' :
                            'Minimal visibility',
                probability: Math.min(100, Math.round(latestKp * 15)),
                bestViewing: latestKp >= 5 ? 'Tonight – optimal conditions' : 'Check back during active storms',
            };

            return {
                alertLevel,
                timestamp: new Date().toISOString(),
                summary: {
                    solarFlareCount: solarFlares.length,
                    cmeCount: cmeEvents.length,
                    geoStormCount: geoStorms.length,
                    solarWindEvents: solarWind.length,
                    highSpeedStreamCount: highSpeedStreams.length,
                    maxKpIndex: latestKp,
                    earthImpactCMEs: cmeEvents.filter((c: any) => c.earthImpact).length,
                },
                auroraForecast,
                solarFlares: solarFlares.slice(0, 15),
                cmeEvents: cmeEvents.slice(0, 15),
                geoStorms: geoStorms.slice(0, 15),
                solarWind: solarWind.slice(0, 10),
                recentNotifications,
            };
        });

        res.json(data);
    } catch (error) {
        console.error('Error fetching space weather dashboard:', error);
        res.status(500).json({ message: 'Error fetching space weather dashboard' });
    }
});

export default router;
