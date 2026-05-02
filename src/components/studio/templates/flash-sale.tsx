'use client';

import React from 'react';

export interface StoryTemplateProps {
  width: number;
  height: number;
  editable?: boolean;
}

export function FlashSaleTemplate(props: StoryTemplateProps) {
  void props;
  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-between overflow-hidden px-6 py-10"
      style={{ background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)' }}
    >
      {/* Decorative sparkles */}
      <svg
        className="absolute start-4 top-16 h-6 w-6 text-white/30"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 0l3.09 6.26L22 7.27l-5 4.87 1.18 6.88L12 15.4l-6.18 3.62L7 12.14 2 7.27l6.91-1.01L12 0z" />
      </svg>
      <svg
        className="absolute end-6 top-24 h-4 w-4 text-yellow-200/40"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 0l3.09 6.26L22 7.27l-5 4.87 1.18 6.88L12 15.4l-6.18 3.62L7 12.14 2 7.27l6.91-1.01L12 0z" />
      </svg>
      <svg
        className="absolute bottom-32 start-8 h-5 w-5 text-white/20"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 0l3.09 6.26L22 7.27l-5 4.87 1.18 6.88L12 15.4l-6.18 3.62L7 12.14 2 7.27l6.91-1.01L12 0z" />
      </svg>

      {/* Top section */}
      <div className="z-10 flex flex-col items-center gap-1 pt-8">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-white/70">
          Limited Time
        </span>
        <span className="text-[10px] tracking-[0.2em] text-yellow-100/60">FLASH SALE</span>
      </div>

      {/* Center — big discount */}
      <div className="z-10 flex flex-col items-center gap-2">
        <span className="text-5xl font-black leading-none text-white drop-shadow-lg">50%</span>
        <span className="text-3xl font-extrabold leading-none text-white drop-shadow-lg">OFF</span>
        <div className="mt-3 flex items-center gap-2">
          {['02', '14', '37'].map((val, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className="text-lg font-bold text-white/60">:</span>}
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                <span className="font-mono text-lg font-bold text-white">{val}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
        <div className="flex gap-6 text-[8px] text-white/50">
          <span>HRS</span>
          <span>MIN</span>
          <span>SEC</span>
        </div>
      </div>

      {/* CTA */}
      <div className="z-10 pb-6">
        <div className="rounded-full bg-white px-8 py-3 shadow-lg">
          <span className="text-sm font-bold text-gray-900">Shop Now &rarr;</span>
        </div>
      </div>
    </div>
  );
}
