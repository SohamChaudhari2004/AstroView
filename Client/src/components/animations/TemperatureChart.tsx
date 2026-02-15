'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Card from '@/components/common/Card';

interface TemperatureData {
  date: string;
  min: number;
  max: number;
  avg: number;
}

interface TemperatureChartProps {
  data: TemperatureData[];
  title?: string;
}

const TemperatureChart: React.FC<TemperatureChartProps> = ({
  data,
  title = 'Temperature Trend',
}) => {
  return (
    <Card>
      <h3 className="text-lg font-bold text-text-primary mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis
            dataKey="date"
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
              border: '1px solid rgba(178, 75, 255, 0.3)',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#B24BFF' }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="max"
            stroke="#00D9FF"
            dot={false}
            strokeWidth={2}
            name="Max"
          />
          <Line
            type="monotone"
            dataKey="avg"
            stroke="#B24BFF"
            dot={false}
            strokeWidth={2}
            name="Average"
          />
          <Line
            type="monotone"
            dataKey="min"
            stroke="#0066FF"
            dot={false}
            strokeWidth={2}
            name="Min"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default TemperatureChart;
