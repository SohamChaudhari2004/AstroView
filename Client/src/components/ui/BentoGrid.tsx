'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={`grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto ${className}`}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  onClick,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      onClick={onClick}
      className={`row-span-1 rounded-3xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-6 glass-card bg-card border-white/5 justify-between flex flex-col space-y-4 cursor-pointer ${className}`}
    >
      {header}
      <div className="group-hover/bento:translate-x-2 transition duration-200">
        {icon}
        <div className="font-sans font-bold text-neutral-200 mb-2 mt-2 font-SpaceGrotesk">
          {title}
        </div>
        <div className="font-sans font-normal text-neutral-400 text-xs dark:text-neutral-300">
          {description}
        </div>
      </div>
    </motion.div>
  );
};
