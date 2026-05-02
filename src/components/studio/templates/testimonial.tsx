'use client';

import React from 'react';
import { Star } from 'lucide-react';
import type { StoryTemplateProps } from './flash-sale';

export function TestimonialTemplate(props: StoryTemplateProps) {
  void props;
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-between overflow-hidden bg-[#f8f6f3] px-6 py-10">
      {/* Large quote mark */}
      <div className="z-10 pt-12">
        <span className="text-6xl font-serif leading-none text-gray-300/50">&ldquo;</span>
      </div>

      {/* Review content */}
      <div className="z-10 flex flex-col items-center gap-4">
        <p className="text-center text-lg italic leading-relaxed text-gray-800">
          &ldquo;This product changed everything for me. Absolutely love it!&rdquo;
        </p>

        {/* Stars */}
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
          ))}
        </div>

        {/* Reviewer */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-200" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900">Sarah K.</span>
            <span className="text-[10px] font-medium text-emerald-600">Verified Buyer</span>
          </div>
        </div>
      </div>

      {/* Product reference */}
      <div className="z-10 pb-6">
        <span className="text-xs text-gray-400">RE: Summer Collection</span>
      </div>
    </div>
  );
}
