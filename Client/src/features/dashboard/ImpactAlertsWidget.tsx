'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import { ImpactAlert } from '@/types';

interface ImpactAlertsWidgetProps {
  alerts: ImpactAlert[];
}

const alertIcons = {
  tsunami: '🌊',
  severeWeather: '⛈️',
  asteroidImpact: '☄️',
};

const severityColors = {
  low: 'info',
  moderate: 'warning',
  high: 'danger',
} as const;

const ImpactAlertsWidget: React.FC<ImpactAlertsWidgetProps> = ({ alerts }) => {
  const highRiskAlerts = alerts.filter((a) => a.severity === 'high');

  return (
    <div className="space-y-4">
      {highRiskAlerts.length > 0 && (
        <motion.div
          animate={{ borderColor: ['rgba(255, 59, 59, 0.5)', 'rgba(255, 59, 59, 1)'] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="p-4 border-2 border-accent-danger rounded-lg bg-accent-danger/10"
        >
          <p className="text-accent-danger font-bold flex items-center gap-2">
            <span className="text-lg">🚨</span> {highRiskAlerts.length} High-Risk Alert
            {highRiskAlerts.length > 1 ? 's' : ''}
          </p>
        </motion.div>
      )}

      {/* Alerts list */}
      <div className="space-y-2">
        {alerts.length > 0 ? (
          alerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={`p-3 ${
                  alert.severity === 'high' ? 'border-accent-danger/50' : ''
                }`}
                glow={alert.severity === 'high' ? 'danger' : 'cyan'}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">
                        {alertIcons[alert.type]}
                      </span>
                      <p className="text-sm font-bold text-text-primary capitalize">
                        {alert.type.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                    </div>
                    <p className="text-xs text-text-tertiary mb-2">{alert.description}</p>
                    <p className="text-xs text-text-tertiary">
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <Badge
                    text={alert.severity}
                    variant={severityColors[alert.severity]}
                    size="sm"
                  />
                </div>
              </Card>
            </motion.div>
          ))
        ) : (
          <Card className="p-4 text-center">
            <p className="text-text-secondary text-sm">No active impact alerts</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ImpactAlertsWidget;
