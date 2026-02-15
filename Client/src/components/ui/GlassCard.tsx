'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const GlassCard = ({
  children,
  className,
  hoverEffect = true,
}: {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}) => {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -5, shadow: "0 20px 40px -10px rgba(0,0,0,0.5)" } : {}}
      className={`glass-card p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
