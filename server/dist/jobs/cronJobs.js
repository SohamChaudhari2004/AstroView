"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const nasaService_1 = require("../services/nasaService");
// Detect Hazardous Asteroids - Every 6 hours
node_cron_1.default.schedule('0 */6 * * *', async () => {
    console.log('Running Cron Job: Fetch Hazardous Asteroids');
    await (0, nasaService_1.fetchHazardousAsteroids)();
});
// Detect Solar Storms - Every 6 hours
node_cron_1.default.schedule('0 */6 * * *', async () => {
    console.log('Running Cron Job: Fetch Solar Weather');
    await (0, nasaService_1.fetchSolarWeather)();
});
// Update Satellite TLEs - Daily at Midnight
node_cron_1.default.schedule('0 0 * * *', async () => {
    console.log('Running Cron Job: Update Satellite TLEs');
    await (0, nasaService_1.fetchSatelliteTLE)();
});
console.log('Cron Jobs Scheduled');
