'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import { SpaceWeatherEvent } from '@/types';

interface SpaceWeatherWidgetProps {
  events: SpaceWeatherEvent[];
  kpIndex: number;
}

const SpaceWeatherWidget: React.FC<SpaceWeatherWidgetProps> = ({ events, kpIndex }) => {
  const getKpColor = () => {
    if (kpIndex <= 2) return 'from-accent-cyan to-accent-deep-blue';
    if (kpIndex <= 5) return 'from-yellow-400 to-orange-400';
    return 'from-accent-danger to-red-600';
  };

  const getKpStatus = () => {
    if (kpIndex <= 2) return 'Quiet';
    if (kpIndex <= 5) return 'Active';
    if (kpIndex <= 7) return 'Storm';
    return 'Severe Storm';
  };

  const severityColors = {
    minor: 'info',
    moderate: 'warning',
    severe: 'danger',
  } as const;

  return (
    <div className="space-y-4">
      {/* KP Index Gauge */}
      <Card glow={kpIndex > 5 ? 'danger' : 'cyan'}>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-text-primary">KP Index</h4>
            <span className="text-2xl font-bold text-gradient">{kpIndex}</span>
          </div>
          <p className="text-sm text-text-secondary mb-4">{getKpStatus()}</p>

          {/* Visual gauge */}
          <div className="relative h-4 bg-card-bg rounded-full overflow-hidden border border-white/10">
            <motion.div
              className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getKpColor()}`}
              initial={{ width: 0 }}
              animate={{ width: `${(kpIndex / 9) * 100}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-text-tertiary">
            <span>0</span>
            <span>9</span>
          </div>
        </div>

        {kpIndex > 5 && (
          <div className="p-3 bg-accent-danger/10 rounded-lg border border-accent-danger/20 animate-pulse">
            <p className="text-sm text-accent-danger font-medium">
              🚨 Geomagnetic disturbance warning
            </p>
          </div>
        )}
      </Card>

      {/* Events List */}
      <div>
        <h4 className="font-bold text-text-primary mb-3">Space Weather Events</h4>
        <div className="space-y-2">
          {events.length > 0 ? (
            events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-text-primary capitalize">
                        {event.eventType.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="text-xs text-text-tertiary mt-1">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    <Badge
                      text={event.severity}
                      variant={severityColors[event.severity]}
                      size="sm"
                    />
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <Card className="p-4 text-center">
              <p className="text-text-secondary text-sm">No active space weather events</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpaceWeatherWidget;
