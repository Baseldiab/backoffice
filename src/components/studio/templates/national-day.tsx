'use client';

import React from 'react';
import type { StoryTemplateProps } from './flash-sale';

export function NationalDayTemplate(props: StoryTemplateProps) {
  void props;
  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-between overflow-hidden px-6 py-10"
      style={{ backgroundColor: '#006B3F' }}
    >
      {/* Background watermark */}
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[120px] font-black leading-none text-white/[0.06]">
        93
      </span>

      {/* Saudi emblem (simplified sword + palm) */}
      <div className="z-10 pt-10">
        <svg viewBox="0 0 80 80" className="h-20 w-20" fill="none">
          {/* Palm tree */}
          <path
            d="M40 20 C40 20 35 30 35 45 L45 45 C45 30 40 20 40 20Z"
            fill="white"
            opacity="0.9"
          />
          {/* Fronds */}
          <path d="M40 18 C32 12 22 14 20 16 C28 14 36 18 40 24Z" fill="white" opacity="0.8" />
          <path d="M40 18 C48 12 58 14 60 16 C52 14 44 18 40 24Z" fill="white" opacity="0.8" />
          <path d="M40 22 C34 17 26 18 24 20 C30 18 37 21 40 26Z" fill="white" opacity="0.7" />
          <path d="M40 22 C46 17 54 18 56 20 C50 18 43 21 40 26Z" fill="white" opacity="0.7" />
          {/* Swords (crossed) */}
          <path
            d="M22 60 L58 48 M22 48 L58 60"
            stroke="white"
            strokeWidth="2"
            opacity="0.9"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Text */}
      <div className="z-10 flex flex-col items-center gap-3">
        <span className="text-xl font-bold text-white">Happy National Day</span>
        <span className="text-lg text-white/80" dir="rtl">
          &#x627;&#x644;&#x64A;&#x648;&#x645; &#x627;&#x644;&#x648;&#x637;&#x646;&#x64A;
          &#x627;&#x644;&#x633;&#x639;&#x648;&#x62F;&#x64A;
        </span>
        <span className="mt-2 text-base text-white/90">Celebrate with 23% off</span>
      </div>

      {/* CTA */}
      <div className="z-10 pb-6">
        <div className="rounded-full bg-white px-8 py-3 shadow-lg">
          <span className="text-sm font-bold" style={{ color: '#006B3F' }}>
            Shop Now
          </span>
        </div>
      </div>
    </div>
  );
}
