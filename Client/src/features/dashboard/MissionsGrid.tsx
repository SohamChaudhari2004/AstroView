'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { Mission } from '@/types';
import { calculateCountdown, formatDate } from '@/utils/helpers';
import SpaceLoader from '@/components/ui/SpaceLoader';

interface MissionsGridProps {
  missions: Mission[];
  onMissionSelect: (id: string) => void;
}

const MissionsGrid: React.FC<MissionsGridProps> = ({ missions, onMissionSelect }) => {
  const [countdowns, setCountdowns] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const interval = setInterval(() => {
      const newCountdowns: { [key: string]: string } = {};
      missions.forEach((mission) => {
        newCountdowns[mission.id] = calculateCountdown(mission.launchDate);
      });
      setCountdowns(newCountdowns);
    }, 1000);

    return () => clearInterval(interval);
  }, [missions]);

  const organizationColors = {
    NASA: 'from-blue-500 to-cyan-500',
    ISRO: 'from-orange-500 to-yellow-500',
    SpaceX: 'from-gray-700 to-slate-900',
    ESA: 'from-purple-500 to-pink-500',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {missions.map((mission, index) => (
        <motion.div
          key={mission.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card
            interactive
            onClick={() => onMissionSelect(mission.id)}
            className="cursor-pointer"
            glow="cyan"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-bold text-text-primary flex-1">{mission.name}</h3>
              <Badge
                text={mission.organization}
                variant={
                  mission.organization === 'NASA'
                    ? 'info'
                    : mission.organization === 'ISRO'
                    ? 'warning'
                    : 'success'
                }
              />
            </div>

            {/* Mission Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-text-tertiary text-sm">Rocket</span>
                <span className="text-text-primary font-medium">{mission.rocket}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-tertiary text-sm">Launch Date</span>
                <span className="text-text-primary font-medium">{formatDate(mission.launchDate)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-tertiary text-sm">Status</span>
                <Badge
                  text={mission.status}
                  variant={mission.status === 'launched' ? 'success' : 'warning'}
                  size="sm"
                />
              </div>
            </div>

            {/* Countdown */}
            <div className="p-3 bg-card-hover rounded-lg mb-4 border border-accent-cyan/20">
              <p className="text-xs text-text-tertiary mb-1">COUNTDOWN</p>
              <p className="font-mono text-accent-cyan font-bold text-sm">
                {countdowns[mission.id] || <SpaceLoader size="sm" />}
              </p>
            </div>

            {/* Button */}
            <Button size="sm" className="w-full" variant="outline">
              View Details
            </Button>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default MissionsGrid;
