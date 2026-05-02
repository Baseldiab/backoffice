export type { StoryTemplateProps } from './flash-sale';

export { FlashSaleTemplate } from './flash-sale';
export { NewArrivalTemplate } from './new-arrival';
export { PollTemplate } from './poll';
export { QuizTemplate } from './quiz';
export { CountdownTemplate } from './countdown';
export { SwipeCTATemplate } from './swipe-cta';
export { WelcomeTemplate } from './welcome';
export { TestimonialTemplate } from './testimonial';
export { EventTemplate } from './event';
export { ProductShowcaseTemplate } from './product-showcase';
export { RamadanTemplate } from './ramadan';
export { NationalDayTemplate } from './national-day';

import type { ComponentType } from 'react';
import type { StoryTemplateProps } from './flash-sale';
import { FlashSaleTemplate } from './flash-sale';
import { NewArrivalTemplate } from './new-arrival';
import { PollTemplate } from './poll';
import { QuizTemplate } from './quiz';
import { CountdownTemplate } from './countdown';
import { SwipeCTATemplate } from './swipe-cta';
import { WelcomeTemplate } from './welcome';
import { TestimonialTemplate } from './testimonial';
import { EventTemplate } from './event';
import { ProductShowcaseTemplate } from './product-showcase';
import { RamadanTemplate } from './ramadan';
import { NationalDayTemplate } from './national-day';

export type TemplateCategory = 'activation' | 'conversion' | 'data-collection' | 'announcement';

export interface TemplateDefinition {
  id: string;
  name: string;
  category: TemplateCategory;
  component: ComponentType<StoryTemplateProps>;
  thumbnail: string; // Tailwind gradient for panel preview
  /** Emoji shown on thumbnail card */
  thumbnailEmoji: string;
}

export const TEMPLATE_REGISTRY: TemplateDefinition[] = [
  {
    id: 'flash-sale',
    name: 'Flash Sale',
    category: 'activation',
    component: FlashSaleTemplate,
    thumbnail: 'from-red-500 to-orange-400',
    thumbnailEmoji: '\u26A1',
  },
  {
    id: 'new-arrival',
    name: 'New Arrival',
    category: 'activation',
    component: NewArrivalTemplate,
    thumbnail: 'from-violet-600 to-indigo-600',
    thumbnailEmoji: '\u2728',
  },
  {
    id: 'poll',
    name: 'Quick Poll',
    category: 'data-collection',
    component: PollTemplate,
    thumbnail: 'from-indigo-900 to-purple-900',
    thumbnailEmoji: '\uD83D\uDCCA',
  },
  {
    id: 'quiz',
    name: 'Knowledge Quiz',
    category: 'data-collection',
    component: QuizTemplate,
    thumbnail: 'from-purple-600 to-indigo-600',
    thumbnailEmoji: '\uD83E\uDDE0',
  },
  {
    id: 'countdown',
    name: 'Coming Soon',
    category: 'conversion',
    component: CountdownTemplate,
    thumbnail: 'from-gray-900 to-black',
    thumbnailEmoji: '\u23F3',
  },
  {
    id: 'swipe-cta',
    name: 'Swipe Up',
    category: 'conversion',
    component: SwipeCTATemplate,
    thumbnail: 'from-gray-600 to-gray-900',
    thumbnailEmoji: '\u2B06\uFE0F',
  },
  {
    id: 'welcome',
    name: 'Welcome',
    category: 'activation',
    component: WelcomeTemplate,
    thumbnail: 'from-amber-500 to-rose-500',
    thumbnailEmoji: '\uD83D\uDC4B',
  },
  {
    id: 'testimonial',
    name: 'Customer Review',
    category: 'conversion',
    component: TestimonialTemplate,
    thumbnail: 'from-amber-400 to-orange-500',
    thumbnailEmoji: '\u2B50',
  },
  {
    id: 'event',
    name: 'Event Announcement',
    category: 'announcement',
    component: EventTemplate,
    thumbnail: 'from-blue-600 to-cyan-500',
    thumbnailEmoji: '\uD83C\uDF89',
  },
  {
    id: 'product-showcase',
    name: 'Product Spotlight',
    category: 'conversion',
    component: ProductShowcaseTemplate,
    thumbnail: 'from-emerald-500 to-teal-600',
    thumbnailEmoji: '\uD83D\uDED2',
  },
  {
    id: 'ramadan',
    name: 'Ramadan Special',
    category: 'announcement',
    component: RamadanTemplate,
    thumbnail: 'from-green-900 to-amber-800',
    thumbnailEmoji: '\uD83C\uDF19',
  },
  {
    id: 'national-day',
    name: 'National Day',
    category: 'announcement',
    component: NationalDayTemplate,
    thumbnail: 'from-green-800 to-green-600',
    thumbnailEmoji: '\uD83C\uDDF8\uD83C\uDDE6',
  },
];

/** Lookup a template definition by ID */
export function getTemplateById(id: string): TemplateDefinition | undefined {
  return TEMPLATE_REGISTRY.find((t) => t.id === id);
}
