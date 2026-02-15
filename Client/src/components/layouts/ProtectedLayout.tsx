'use client';

import React, { ReactNode } from 'react';
import Navigation from './Navigation';

interface ProtectedLayoutProps {
  children: ReactNode;
}

const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 pb-12">
        <div className="container-main">
          {children}
        </div>
      </main>
    </div>
  );
};

export default ProtectedLayout;
