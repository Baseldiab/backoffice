'use client';

import React from 'react';
import type { StoryTemplateProps } from './flash-sale';

const TIMER_ITEMS = [
  { value: '07', label: 'Days' },
  { value: '12', label: 'Hours' },
  { value: '45', label: 'Min' },
  { value: '30', label: 'Sec' },
];

export function CountdownTemplate(props: StoryTemplateProps) {
  void props;
  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-between overflow-hidden px-6 py-10"
      style={{
        background: 'radial-gradient(circle at 50% 40%, rgba(255,255,255,0.06) 0%, #000000 70%)',
      }}
    >
      {/* Pulse glow */}
      <div
        className="absolute left-1/2 top-1/3 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
          animation: 'tpl-pulse-glow 3s ease-in-out infinite',
        }}
      />

      {/* Top label */}
      <div className="z-10 pt-16">
        <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/50">
          Coming Soon
        </span>
      </div>

      {/* Countdown boxes */}
      <div className="z-10 flex flex-col items-center gap-3">
        <div className="flex gap-2.5">
          {TIMER_ITEMS.map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                <span className="font-mono text-2xl font-bold text-white">{item.value}</span>
              </div>
              <span className="text-[9px] uppercase text-white/35">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="z-10 pb-6">
        <div className="rounded-full bg-white px-8 py-3 shadow-lg">
          <span className="text-sm font-bold text-gray-900">Notify Me</span>
        </div>
      </div>

      {/* eslint-disable-next-line react/no-danger */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes tpl-pulse-glow {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
          50% { transform: translate(-50%, -50%) scale(1.3); opacity: 0.15; }
        }
      `,
        }}
      />
    </div>
  );
}
