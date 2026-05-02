'use client';

import React from 'react';
import type { StoryTemplateProps } from './flash-sale';

export function RamadanTemplate(props: StoryTemplateProps) {
  void props;
  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-between overflow-hidden px-6 py-10"
      style={{ background: 'linear-gradient(135deg, #14532d 0%, #854d0e 100%)' }}
    >
      {/* Islamic geometric border (subtle) */}
      <div className="absolute inset-4 rounded-2xl border border-amber-400/10" />
      <div className="absolute inset-6 rounded-xl border border-amber-400/5" />

      {/* Crescent + star */}
      <div className="z-10 pt-12">
        <svg viewBox="0 0 64 64" className="h-16 w-16" fill="none">
          <path
            d="M32 4C18.745 4 8 14.745 8 28s10.745 24 24 24c5.28 0 10.16-1.72 14.12-4.62C41.6 51.32 35.6 54 29 54 16.297 54 6 43.703 6 31S16.297 8 29 8c6.6 0 12.6 2.68 17.12 6.62C42.16 11.72 37.28 10 32 10z"
            fill="#d4a017"
            opacity="0.9"
          />
          <circle cx="48" cy="14" r="3" fill="#d4a017" opacity="0.9" />
        </svg>
      </div>

      {/* Text */}
      <div className="z-10 flex flex-col items-center gap-3">
        <span className="text-2xl font-bold text-amber-300">Ramadan Kareem</span>
        <span className="text-lg text-amber-200/80" dir="rtl">
          &#x631;&#x645;&#x636;&#x627;&#x646; &#x643;&#x631;&#x64A;&#x645;
        </span>
        <div className="mt-4 flex flex-col items-center gap-1">
          <span className="text-xl font-bold text-white">Up to 40% off</span>
          <span className="text-xs text-white/50">Exclusive Ramadan deals</span>
        </div>
      </div>

      {/* CTA */}
      <div className="z-10 pb-6">
        <div className="rounded-full px-8 py-3 shadow-lg" style={{ backgroundColor: '#d4a017' }}>
          <span className="text-sm font-bold text-gray-900">Shop Ramadan Collection</span>
        </div>
      </div>
    </div>
  );
}
