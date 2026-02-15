'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface BadgeProps {
  text: string;
  variant?: 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  text,
  variant = 'info',
  size = 'sm',
  className = '',
}) => {
  const variantClasses = {
    success: 'bg-accent-cyan/20 text-accent-cyan border-accent-cyan/30',
    warning: 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30',
    danger: 'bg-accent-danger/20 text-accent-danger border-accent-danger/30',
    info: 'bg-accent-deep-blue/20 text-accent-deep-blue border-accent-deep-blue/30',
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  return (
    <motion.span
      className={`inline-block border rounded-full font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      whileHover={{ scale: 1.05 }}
    >
      {text}
    </motion.span>
  );
};

export default Badge;
