'use client';

import React from 'react';
import { ImageIcon, Star } from 'lucide-react';
import type { StoryTemplateProps } from './flash-sale';

export function ProductShowcaseTemplate(props: StoryTemplateProps) {
  void props;
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-between overflow-hidden bg-white px-6 py-10">
      {/* Top badge */}
      <div className="z-10 pt-8">
        <span className="rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-bold uppercase text-white">
          Bestseller
        </span>
      </div>

      {/* Product image */}
      <div className="z-10 flex flex-col items-center gap-4">
        <div className="flex aspect-square w-[65%] items-center justify-center rounded-2xl bg-gray-100">
          <ImageIcon className="h-12 w-12 text-gray-300" />
        </div>

        <div className="flex flex-col items-center gap-2">
          <span className="text-lg font-bold text-gray-900">Premium Collection</span>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">599 SAR</span>
            <span className="text-sm text-gray-400 line-through">799 SAR</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium text-gray-900">4.8</span>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${i < 4 ? 'fill-amber-400 text-amber-400' : 'fill-amber-400/50 text-amber-400/50'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="z-10 w-full pb-6">
        <div className="w-full rounded-xl bg-gray-900 py-3.5 text-center shadow-lg">
          <span className="text-sm font-bold text-white">Add to Cart</span>
        </div>
      </div>
    </div>
  );
}
