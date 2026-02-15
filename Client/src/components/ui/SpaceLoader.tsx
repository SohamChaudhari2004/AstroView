'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SpaceLoaderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'full';
}

const SpaceLoader: React.FC<SpaceLoaderProps> = ({ className = '', size = 'full' }) => {
  const containerClasses = {
    sm: 'w-16 h-16 min-h-[4rem]',
    md: 'w-32 h-32 min-h-[8rem]',
    lg: 'w-48 h-48 min-h-[12rem]',
    full: 'min-h-[50vh] w-full',
  };

  const orbitSizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    full: 'w-32 h-32',
  };

  const textSizeClasses = {
    sm: 'text-[10px] mt-2',
    md: 'text-xs mt-4',
    lg: 'text-sm mt-6',
    full: 'text-sm mt-8',
  };

  return (
    <div className={`flex flex-col items-center justify-center ${containerClasses[size]} ${className}`}>
      <div className={`relative ${orbitSizeClasses[size]} flex items-center justify-center`}>
        {/* Outer Orbit */}
        <motion.div
          className="absolute w-full h-full border border-cyan-500/30 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Middle Orbit */}
        <motion.div
          className="absolute w-2/3 h-2/3 border border-purple-500/30 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner Core Pulsing */}
        <motion.div
          className="w-1/3 h-1/3 bg-cyan-500 rounded-full blur-md"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Planet 1 */}
        <motion.div
          className="absolute w-full h-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)] absolute -top-0.5 left-1/2 -translate-x-1/2" />
        </motion.div>

         {/* Planet 2 */}
         <motion.div
          className="absolute w-2/3 h-2/3"
          animate={{ rotate: -360 }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-1 h-1 bg-purple-400 rounded-full shadow-[0_0_10px_rgba(192,132,252,0.8)] absolute -bottom-0.5 left-1/2 -translate-x-1/2" />
        </motion.div>
      </div>
      
      {size !== 'sm' && (
        <motion.p
          className={`text-cyan-500 font-SpaceGrotesk tracking-widest uppercase ${textSizeClasses[size]}`}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Initialising...
        </motion.p>
      )}
    </div>
  );
};

export default SpaceLoader;
