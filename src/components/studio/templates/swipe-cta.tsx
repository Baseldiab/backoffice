'use client';

import React from 'react';
import { ChevronUp } from 'lucide-react';
import type { StoryTemplateProps } from './flash-sale';

export function SwipeCTATemplate(props: StoryTemplateProps) {
  void props;
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden">
      {/* Lifestyle image placeholder bg */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-600 to-gray-800" />

      {/* Bottom gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />

      {/* Content — bottom aligned */}
      <div className="relative z-10 mt-auto flex flex-col items-center gap-3 px-6 pb-10">
        <div className="flex flex-col items-center gap-1 text-center">
          <span className="text-xl font-bold text-white">Exclusive Offer</span>
          <span className="text-sm text-white/80">Get 20% off your first order</span>
        </div>

        {/* Swipe indicator */}
        <div className="flex flex-col items-center gap-0.5 pt-4">
          <ChevronUp
            className="h-5 w-5 text-white/60"
            style={{ animation: 'tpl-bounce-up 1.5s ease-in-out infinite' }}
          />
          <span className="text-[10px] text-white/50">Swipe Up</span>
        </div>
      </div>

      {/* eslint-disable-next-line react/no-danger */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes tpl-bounce-up {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `,
        }}
      />
    </div>
  );
}
