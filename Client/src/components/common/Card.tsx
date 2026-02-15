'use client';

import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  glow?: 'cyan' | 'purple' | 'danger' | 'none';
  interactive?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  glow = 'none',
  interactive = false,
  onClick,
}) => {
  const glowClass = {
    cyan: 'shadow-glow-cyan',
    purple: 'shadow-glow-purple',
    danger: 'shadow-glow-danger',
    none: '',
  }[glow];

  const interactiveClass = interactive
    ? 'cursor-pointer hover:bg-card-hover hover:shadow-glow-cyan transition-all duration-300 transform hover:scale-105'
    : '';

  return (
    <div
      className={`glass p-6 rounded-2xl ${glowClass} ${interactiveClass} ${className}`}
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
    >
      {children}
    </div>
  );
};

export default Card;
