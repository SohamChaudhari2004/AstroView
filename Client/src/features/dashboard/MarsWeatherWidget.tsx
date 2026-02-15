'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import { MarsWeather } from '@/types';

interface MarsWeatherWidgetProps {
  data: MarsWeather;
}

const MarsWeatherWidget: React.FC<MarsWeatherWidgetProps> = ({ data }) => {
  return (
    <Card className="bg-gradient-to-br from-red-900/20 to-orange-900/20 border-orange-500/20 glow-danger">
      <div className="mb-4">
        <h3 className="text-2xl font-bold text-gradient mb-2">Mars Weather</h3>
        <p className="text-text-secondary text-sm">Sol {data.sol} | {data.season}</p>
      </div>

      {/* Temperature gauge */}
      <div className="mb-6 p-4 bg-card-hover rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-text-secondary text-sm">Temperature</span>
          <span className="text-2xl font-bold text-orange-400">
            {((data.temperature.max + data.temperature.min) / 2).toFixed(1)}°C
          </span>
        </div>
        <div className="text-xs text-text-tertiary">
          Min: {data.temperature.min.toFixed(1)}°C | Max: {data.temperature.max.toFixed(1)}°C
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div className="p-3 bg-card-bg rounded-lg border border-white/10" whileHover={{ scale: 1.05 }}>
          <p className="text-xs text-text-tertiary mb-1">WIND SPEED</p>
          <p className="text-xl font-bold text-accent-cyan">{data.windSpeed.toFixed(1)} m/s</p>
        </motion.div>
        <motion.div className="p-3 bg-card-bg rounded-lg border border-white/10" whileHover={{ scale: 1.05 }}>
          <p className="text-xs text-text-tertiary mb-1">PRESSURE</p>
          <p className="text-xl font-bold text-accent-cyan">{data.pressure.toFixed(0)} Pa</p>
        </motion.div>
      </div>

      {/* Last update */}
      <p className="text-xs text-text-tertiary mt-4 text-center">
        Last updated: {new Date(data.timestamp).toLocaleTimeString()}
      </p>
    </Card>
  );
};

export default MarsWeatherWidget;
