'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ThreatMeterProps {
  level: 'low' | 'moderate' | 'high';
  percentage: number;
}

const ThreatMeter: React.FC<ThreatMeterProps> = ({ level, percentage }) => {
  const colors = {
    low: 'from-accent-cyan to-accent-deep-blue',
    moderate: 'from-yellow-400 to-orange-400',
    high: 'from-accent-danger to-red-600',
  };

  const labels = {
    low: 'Low Threat',
    moderate: 'Moderate Threat',
    high: 'High Threat',
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-text-secondary">Threat Level</span>
        <span className="text-lg font-bold text-text-primary">{labels[level]}</span>
      </div>
      <div className="relative h-3 bg-card-bg rounded-full overflow-hidden border border-white/10">
        <motion.div
          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${colors[level]} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8 }}
        />
      </div>
      <p className="text-xs text-text-tertiary text-right">{percentage}%</p>
    </div>
  );
};

export default ThreatMeter;
