'use client';

import React from 'react';
import type { StoryTemplateProps } from './flash-sale';

export function QuizTemplate(props: StoryTemplateProps) {
  void props;
  const answers = ['A) First option', 'B) Second option', 'C) Third option', 'D) Fourth option'];

  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-between overflow-hidden px-6 py-10"
      style={{ background: 'linear-gradient(135deg, #9333ea 0%, #6366f1 100%)' }}
    >
      {/* Header */}
      <div className="z-10 flex flex-col items-center gap-2 pt-10">
        <span className="text-2xl">&#x1f9e0;</span>
        <span className="text-lg font-bold text-white">Quiz Time!</span>
        <span className="text-base text-white/90">How well do you know us?</span>
      </div>

      {/* Answer options */}
      <div className="z-10 flex w-full flex-col gap-2.5">
        {answers.map((answer, i) => (
          <div key={i} className="rounded-xl bg-white/15 px-4 py-3 backdrop-blur-sm">
            <span className="text-sm font-medium text-white">{answer}</span>
          </div>
        ))}
      </div>

      {/* Progress dots */}
      <div className="z-10 flex items-center gap-2 pb-6">
        <div className="h-2 w-2 rounded-full bg-white" />
        <div className="h-2 w-2 rounded-full bg-white/30" />
        <div className="h-2 w-2 rounded-full bg-white/30" />
      </div>
    </div>
  );
}
