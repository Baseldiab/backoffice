'use client';

import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import type { StoryTemplateProps } from './flash-sale';

const EVENT_DETAILS = [
  { icon: Calendar, text: 'June 15, 2026' },
  { icon: Clock, text: '7:00 PM GST' },
  { icon: MapPin, text: 'Dubai Mall, UAE' },
];

export function EventTemplate(props: StoryTemplateProps) {
  void props;
  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-between overflow-hidden px-6 py-10"
      style={{ background: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)' }}
    >
      {/* Top label */}
      <div className="z-10 pt-14">
        <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/50">
          You&apos;re Invited
        </span>
      </div>

      {/* Event info */}
      <div className="z-10 flex flex-col items-center gap-5">
        <span className="text-center text-2xl font-bold text-white">Summer Launch Party</span>

        <div className="flex w-full flex-col gap-2.5 rounded-xl bg-white/15 p-4 backdrop-blur-sm">
          {EVENT_DETAILS.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <Icon className="h-4 w-4 shrink-0 text-white/70" />
              <span className="text-sm text-white">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="z-10 pb-6">
        <div className="rounded-full bg-white px-8 py-3 shadow-lg">
          <span className="text-sm font-bold text-gray-900">RSVP Now</span>
        </div>
      </div>
    </div>
  );
}
