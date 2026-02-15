'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import { SatellitePosition } from '@/types';

interface SatelliteTrackerProps {
  satellites: SatellitePosition[];
  selectedSatellite?: string;
  onSelectSatellite?: (name: string) => void;
}

const SatelliteTracker: React.FC<SatelliteTrackerProps> = ({
  satellites,
  selectedSatellite = 'ISS',
  onSelectSatellite,
}) => {
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    setMapLoaded(true);
  }, []);

  const selected = satellites.find((s) => s.name === selectedSatellite);

  return (
    <div className="space-y-4">
      {/* Satellite selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {satellites.map((sat) => (
          <motion.button
            key={sat.name}
            onClick={() => onSelectSatellite?.(sat.name)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
              selectedSatellite === sat.name
                ? 'glass glow-cyan border-accent-cyan'
                : 'glass border-white/10 hover:border-accent-cyan'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {sat.name}
          </motion.button>
        ))}
      </div>

      {/* Main tracker card */}
      {selected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          key={selectedSatellite}
        >
          <Card glow="cyan">
            {/* Map placeholder */}
            <div className="w-full h-80 bg-card-hover rounded-lg border border-white/10 mb-4 flex items-center justify-center overflow-hidden relative">
              {mapLoaded ? (
                <div className="w-full h-full bg-gradient-to-br from-background to-background-light relative">
                  {/* Simple world map visualization */}
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-text-secondary text-sm mb-2">
                        Latitude: {selected.latitude.toFixed(4)}°
                      </p>
                      <p className="text-text-secondary text-sm">
                        Longitude: {selected.longitude.toFixed(4)}°
                      </p>
                    </div>
                  </div>
                  {/* Animated marker */}
                  <motion.div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-accent-cyan rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                      boxShadow: [
                        '0 0 0 0 rgba(0, 217, 255, 0.7)',
                        '0 0 0 10px rgba(0, 217, 255, 0)',
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                </div>
              ) : (
                <p className="text-text-secondary">Loading map...</p>
              )}
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-card-hover rounded-lg">
                <p className="text-xs text-text-tertiary mb-1">ALTITUDE</p>
                <p className="text-lg font-bold text-accent-cyan">
                  {selected.altitude.toFixed(0)} km
                </p>
              </div>
              <div className="p-3 bg-card-hover rounded-lg">
                <p className="text-xs text-text-tertiary mb-1">VELOCITY</p>
                <p className="text-lg font-bold text-accent-cyan">
                  {(selected.velocity * 3.6).toFixed(0)} km/h
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default SatelliteTracker;
