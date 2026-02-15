'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface StatusIndicatorProps {
  status: 'stable' | 'warning' | 'alert';
  label?: string;
  showPulse?: boolean;
}

const statusColors = {
  stable: 'bg-accent-cyan',
  warning: 'bg-yellow-400',
  alert: 'bg-accent-danger',
};

const statusLabels = {
  stable: 'System Stable',
  warning: 'Warning',
  alert: 'Alert',
};

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  showPulse = true,
}) => {
  return (
    <div className="flex items-center gap-2">
      <motion.div
        className={`w-3 h-3 rounded-full ${statusColors[status]}`}
        animate={
          showPulse
            ? {
                scale: [1, 1.2, 1],
                opacity: [1, 0.7, 1],
              }
            : {}
        }
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      />
      <span className="text-sm font-medium text-text-secondary">
        {label || statusLabels[status]}
      </span>
    </div>
  );
};

export default StatusIndicator;
