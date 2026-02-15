'use client';

import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Card from '@/components/common/Card';
import { KpIndex } from '@/types';

interface KpIndexChartProps {
  data: KpIndex[];
}

const KpIndexChart: React.FC<KpIndexChartProps> = ({ data }) => {
  const chartData = data.map((d) => ({
    time: new Date(d.timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
    value: d.value,
  }));

  return (
    <Card>
      <h3 className="text-lg font-bold text-text-primary mb-4">KP Index Timeline</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorKp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00D9FF" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#00D9FF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis
            dataKey="time"
            stroke="rgba(176, 176, 176, 0.5)"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="rgba(176, 176, 176, 0.5)"
            domain={[0, 9]}
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(11, 15, 26, 0.9)',
              border: '1px solid rgba(0, 217, 255, 0.3)',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#00D9FF' }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#00D9FF"
            fillOpacity={1}
            fill="url(#colorKp)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default KpIndexChart;
