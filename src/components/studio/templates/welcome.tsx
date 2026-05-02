'use client';

import React from 'react';
import { Star, Heart, Zap } from 'lucide-react';
import type { StoryTemplateProps } from './flash-sale';

const FEATURES = [
  { icon: Star, label: 'Discover' },
  { icon: Heart, label: 'Save' },
  { icon: Zap, label: 'Engage' },
];

export function WelcomeTemplate(props: StoryTemplateProps) {
  void props;
  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-between overflow-hidden px-6 py-10"
      style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #f43f5e 100%)' }}
    >
      {/* Wave + intro */}
      <div className="z-10 flex flex-col items-center gap-2 pt-16">
        <span className="text-4xl">&#x1f44b;</span>
        <span className="text-lg text-white/80">Welcome to</span>
        <span className="text-3xl font-bold text-white">{'{{app_name}}'}</span>
      </div>

      {/* Description */}
      <div className="z-10 flex flex-col items-center gap-6">
        <span className="text-center text-sm text-white/70">
          Discover what&apos;s new and trending
        </span>

        {/* Feature icons */}
        <div className="flex gap-6">
          {FEATURES.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <Icon className="h-5 w-5 text-white" />
              </div>
              <span className="text-[10px] font-medium text-white/70">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="z-10 pb-6">
        <div className="rounded-full bg-white px-8 py-3 shadow-lg">
          <span className="text-sm font-bold text-gray-900">Get Started</span>
        </div>
      </div>
    </div>
  );
}
