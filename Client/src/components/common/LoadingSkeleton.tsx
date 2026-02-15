'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSkeletonProps {
  count?: number;
  height?: string;
  circle?: boolean;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  count = 1,
  height = 'h-20',
  circle = false,
}) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className={`${height} ${circle ? 'rounded-full' : 'rounded-xl'} bg-card-hover`}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      ))}
    </div>
  );
};

export default LoadingSkeleton;
