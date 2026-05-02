'use client';

import React from 'react';
import { ThemeProvider } from 'next-themes';
import { MotionConfig } from 'framer-motion';
import { Toaster } from 'sonner';
import { CommandPalette } from '@/components/command-palette';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
      <MotionConfig reducedMotion="user">
        {children}
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            className: 'bg-card text-card-foreground border-border',
          }}
        />
        <CommandPalette />
      </MotionConfig>
    </ThemeProvider>
  );
}
