'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';

interface DashboardHeaderProps {
  userName: string;
  systemStatus: 'stable' | 'warning' | 'alert';
  threatLevel: 'low' | 'moderate' | 'high';
  lastUpdate: string;
  autoRefresh: boolean;
  onAutoRefreshToggle: (enabled: boolean) => void;
  onRefresh: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName,
  systemStatus,
  threatLevel,
  lastUpdate,
  autoRefresh,
  onAutoRefreshToggle,
  onRefresh,
}) => {
  const statusColors = {
    stable: 'from-accent-cyan to-accent-deep-blue',
    warning: 'from-yellow-400 to-orange-400',
    alert: 'from-accent-danger to-red-600',
  };

  const threatColors = {
    low: 'text-accent-cyan',
    moderate: 'text-yellow-400',
    high: 'text-accent-danger',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Welcome */}
          <div>
            <p className="text-text-tertiary text-sm mb-1">WELCOME BACK</p>
            <h1 className="text-2xl font-bold text-gradient">{userName}</h1>
          </div>

          {/* System Status */}
          <div>
            <p className="text-text-tertiary text-sm mb-1">SYSTEM STATUS</p>
            <div className="flex items-center gap-2">
              <motion.div
                className={`w-4 h-4 rounded-full bg-gradient-to-r ${statusColors[systemStatus]}`}
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
              <span className="text-lg font-bold capitalize text-text-primary">
                {systemStatus}
              </span>
            </div>
          </div>

          {/* Threat Level */}
          <div>
            <p className="text-text-tertiary text-sm mb-1">THREAT LEVEL</p>
            <p className={`text-lg font-bold capitalize ${threatColors[threatLevel]}`}>
              {threatLevel}
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-2">
            <Button size="sm" variant="secondary" onClick={onRefresh}>
              Refresh Now
            </Button>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => onAutoRefreshToggle(e.target.checked)}
                className="accent-accent-cyan"
              />
              <span className="text-xs text-text-secondary">Auto-refresh</span>
            </label>
          </div>
        </div>

        {/* Last update */}
        <p className="text-xs text-text-tertiary mt-4 text-right">
          Last updated: {new Date(lastUpdate).toLocaleTimeString()}
        </p>
      </Card>
    </motion.div>
  );
};

export default DashboardHeader;
