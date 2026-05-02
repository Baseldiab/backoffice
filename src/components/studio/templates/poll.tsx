'use client';

import React from 'react';
import type { StoryTemplateProps } from './flash-sale';

export function PollTemplate(props: StoryTemplateProps) {
  void props;
  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-between overflow-hidden px-6 py-10"
      style={{ backgroundColor: '#1a1a2e' }}
    >
      {/* Question */}
      <div className="z-10 flex flex-col items-center gap-2 pt-16">
        <span className="text-xl font-bold text-white">What do you think?</span>
        <span className="text-xs text-white/50">Choose your answer below</span>
      </div>

      {/* Options */}
      <div className="z-10 flex w-full gap-3">
        <div className="flex flex-1 flex-col items-center gap-2 rounded-xl border border-white/20 bg-white/10 p-4 ring-2 ring-white/30">
          <span className="text-2xl">A</span>
          <span className="text-sm font-medium text-white">Option A</span>
        </div>
        <div className="flex flex-1 flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/10 p-4">
          <span className="text-2xl">B</span>
          <span className="text-sm font-medium text-white">Option B</span>
        </div>
      </div>

      {/* Footer */}
      <div className="z-10 pb-6">
        <span className="text-xs text-white/40">Tap to vote</span>
      </div>
    </div>
  );
}
