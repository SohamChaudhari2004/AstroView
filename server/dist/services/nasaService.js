"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchSatelliteTLE = exports.fetchSolarWeather = exports.fetchHazardousAsteroids = void 0;
const axios_1 = __importDefault(require("axios"));
const Asteroid_1 = __importDefault(require("../models/Asteroid"));
const SolarStorm_1 = __importDefault(require("../models/SolarStorm"));
const SatelliteTLE_1 = __importDefault(require("../models/SatelliteTLE"));
const redis_1 = __importDefault(require("../config/redis"));
const NASA_API_KEY = process.env.NASA_API_KEY || 'fxpgQ4j0RVUvt8lIaQvzaVgb6LNZ7GPgTIHAv4b6';
const NEO_WS_URL = 'https://api.nasa.gov/neo/rest/v1/feed';
const DONKI_URL = 'https://api.nasa.gov/DONKI/GST';
const CELESTRAK_URL = 'https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=tle';
const fetchHazardousAsteroids = async () => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        // Check Redis cache first (optional, but good practice for API limits)
        // For this specific 'feed' endpoint, we might want fresh data, but caching for 1 hour could save quotas.
        const cacheKey = `asteroids:${today}:${nextWeek}`;
        const cachedData = await redis_1.default.get(cacheKey);
        if (cachedData) {
            console.log('Using cached asteroid data');
            return; // Or return parsed data if needed for API response
        }
        console.log(`Fetching Asteroids from ${today} to ${nextWeek}`);
        const response = await axios_1.default.get(NEO_WS_URL, {
            params: {
                start_date: today,
                end_date: nextWeek,
                api_key: NASA_API_KEY
            }
        });
        const nearEarthObjects = response.data.near_earth_objects;
        // Process dynamic keys (dates)
        for (const date in nearEarthObjects) {
            const asteroids = nearEarthObjects[date];
            for (const asteroid of asteroids) {
                if (asteroid.is_potentially_hazardous_asteroid) {
                    const closeApproach = asteroid.close_approach_data[0];
                    await Asteroid_1.default.findOneAndUpdate({ nasaId: asteroid.id }, {
                        name: asteroid.name,
                        isHazardous: true,
                        closeApproachDate: closeApproach.close_approach_date,
                        missDistanceKm: parseFloat(closeApproach.miss_distance.kilometers),
                        relativeVelocityKph: parseFloat(closeApproach.relative_velocity.kilometers_per_hour),
                        lastUpdated: new Date()
                    }, { upsert: true, new: true });
                }
            }
        }
        // Cache the successful fetch to avoid hitting rate limits too hard
        await redis_1.default.set(cacheKey, 'fetched', { EX: 3600 });
        console.log('Hazardous asteroids updated.');
    }
    catch (error) {
        console.error('Error fetching asteroids:', error);
    }
};
exports.fetchHazardousAsteroids = fetchHazardousAsteroids;
const fetchSolarWeather = async () => {
    try {
        const startDate = new Date().toISOString().split('T')[0];
        console.log(`Fetching Solar Weather for ${startDate}`);
        const response = await axios_1.default.get(DONKI_URL, {
            params: {
                startDate: startDate,
                api_key: NASA_API_KEY
            }
        });
        const solarData = response.data;
        for (const storm of solarData) {
            const gstID = storm.gstID;
            const startTime = storm.startTime;
            for (const kp of storm.allKpIndex) {
                // Trigger alert if kpIndex > 5
                if (kp.kpIndex > 5) {
                    console.log(`ALERT: Geomagnetic Storm Detected! KP Index: ${kp.kpIndex}`);
                    // Here we could trigger a notification service
                }
                await SolarStorm_1.default.findOneAndUpdate({ gstID: gstID }, {
                    startTime: startTime,
                    kpIndex: kp.kpIndex,
                    observedTime: kp.observedTime,
                    source: kp.source
                }, { upsert: true, new: true });
            }
        }
        console.log('Solar weather data updated.');
    }
    catch (error) {
        console.error('Error fetching solar weather:', error);
    }
};
exports.fetchSolarWeather = fetchSolarWeather;
const fetchSatelliteTLE = async () => {
    try {
        console.log('Fetching Satellite TLE Data...');
        const response = await axios_1.default.get(CELESTRAK_URL);
        const rawData = response.data;
        const lines = rawData.split('\n');
        // TLE data comes in sets of 3 lines (Name, Line 1, Line 2)
        for (let i = 0; i < lines.length; i += 3) {
            if (lines[i] && lines[i + 1] && lines[i + 2]) {
                const name = lines[i].trim();
                const line1 = lines[i + 1].trim();
                const line2 = lines[i + 2].trim();
                await SatelliteTLE_1.default.findOneAndUpdate({ satelliteName: name }, {
                    line1: line1,
                    line2: line2,
                    lastUpdated: new Date()
                }, { upsert: true, new: true });
            }
        }
        console.log('Satellite TLE data updated.');
    }
    catch (error) {
        console.error('Error fetching TLE data:', error);
    }
};
exports.fetchSatelliteTLE = fetchSatelliteTLE;
