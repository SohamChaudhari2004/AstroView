import cron from 'node-cron';
import { fetchHazardousAsteroids, fetchSolarWeather, fetchSatelliteTLE } from '../services/nasaService';

// Detect Hazardous Asteroids - Every 6 hours
cron.schedule('0 */6 * * *', async () => {
  console.log('Running Cron Job: Fetch Hazardous Asteroids');
  await fetchHazardousAsteroids();
});

// Detect Solar Storms - Every 6 hours
cron.schedule('0 */6 * * *', async () => {
    console.log('Running Cron Job: Fetch Solar Weather');
    await fetchSolarWeather();
});

// Update Satellite TLEs - Daily at Midnight
cron.schedule('0 0 * * *', async () => {
    console.log('Running Cron Job: Update Satellite TLEs');
    await fetchSatelliteTLE();
});

console.log('Cron Jobs Scheduled');
