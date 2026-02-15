'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import { NearEarthObject } from '@/types';
import { formatDistance, formatVelocity } from '@/utils/helpers';

interface NEOGridProps {
  objects: NearEarthObject[];
  hazardousOnly?: boolean;
  onHazardousToggle?: (enabled: boolean) => void;
}

const NEOGrid: React.FC<NEOGridProps> = ({
  objects,
  hazardousOnly = false,
  onHazardousToggle,
}) => {
  const filtered = useMemo(() => {
    return hazardousOnly ? objects.filter((obj) => obj.hazardous) : objects;
  }, [objects, hazardousOnly]);

  return (
    <div>
      {/* Controls */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold text-text-primary">Near Earth Objects</h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={hazardousOnly}
            onChange={(e) => onHazardousToggle?.(e.target.checked)}
            className="accent-accent-cyan"
          />
          <span className="text-text-secondary text-sm">Hazardous Only</span>
        </label>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((neo, index) => (
          <motion.div
            key={neo.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card glow={neo.hazardous ? 'danger' : 'cyan'}>
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-bold text-text-primary flex-1">{neo.name}</h4>
                {neo.hazardous && (
                  <Badge text="HAZARDOUS" variant="danger" size="sm" />
                )}
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Miss Distance</span>
                  <span className="text-text-primary font-medium">
                    {formatDistance(neo.missDistance)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Velocity</span>
                  <span className="text-text-primary font-medium">
                    {formatVelocity(neo.velocity)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Approach Date</span>
                  <span className="text-text-primary font-medium">
                    {new Date(neo.approachDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Size</span>
                  <span className="text-text-primary font-medium">
                    {neo.size.min.toFixed(2)}m - {neo.size.max.toFixed(2)}m
                  </span>
                </div>
              </div>

              {/* Hazard indicator */}
              {neo.hazardous && (
                <div className="mt-4 p-2 bg-accent-danger/10 rounded-lg border border-accent-danger/20">
                  <p className="text-xs text-accent-danger font-medium">⚠️ Potentially Hazardous</p>
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card className="text-center py-8">
          <p className="text-text-secondary">No near-Earth objects matching criteria</p>
        </Card>
      )}
    </div>
  );
};

export default NEOGrid;
