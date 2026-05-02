'use client';

import React from 'react';
import { ImageIcon } from 'lucide-react';
import type { StoryTemplateProps } from './flash-sale';

export function NewArrivalTemplate(props: StoryTemplateProps) {
  void props;
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-between overflow-hidden bg-[#faf9f7] px-6 py-10">
      {/* Top badge */}
      <div className="z-10 pt-8">
        <span className="rounded-full bg-gray-900 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white">
          New
        </span>
      </div>

      {/* Product image placeholder */}
      <div className="z-10 flex flex-col items-center gap-4">
        <div className="flex aspect-square w-[60%] items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-100">
          <ImageIcon className="h-10 w-10 text-gray-400" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-lg font-semibold text-gray-900">Product Name</span>
          <span className="text-xl font-bold text-gray-900">299 SAR</span>
        </div>
      </div>

      {/* CTA */}
      <div className="z-10 pb-6">
        <div className="rounded-full bg-gray-900 px-8 py-3 shadow-lg">
          <span className="text-sm font-medium text-white">Discover More</span>
        </div>
      </div>
    </div>
  );
}
