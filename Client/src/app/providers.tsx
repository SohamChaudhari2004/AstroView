'use client';

import React, { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      <Toaster position="top-right" />
      {children}
    </>
  );
}
