'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Card from '@/components/common/Card';

interface LaunchFrequencyData {
  organization: string;
  launches: number;
}

interface LaunchFrequencyChartProps {
  data: LaunchFrequencyData[];
}

const LaunchFrequencyChart: React.FC<LaunchFrequencyChartProps> = ({ data }) => {
  return (
    <Card>
      <h3 className="text-lg font-bold text-text-primary mb-4">Launch Frequency</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis
            dataKey="organization"
            stroke="rgba(176, 176, 176, 0.5)"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="rgba(176, 176, 176, 0.5)"
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
          <Legend />
          <Bar
            dataKey="launches"
            fill="url(#colorGradient)"
            name="Number of Launches"
            radius={[8, 8, 0, 0]}
          />
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00D9FF" />
              <stop offset="100%" stopColor="#B24BFF" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default LaunchFrequencyChart;
