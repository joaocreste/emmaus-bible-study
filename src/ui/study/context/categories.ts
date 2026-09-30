import {
  BookText,
  Coins,
  Crown,
  Flame,
  Hourglass,
  Houses,
  Landmark,
  Mail,
  MapPin,
  PenLine,
  Scroll,
  Tent,
  Users,
  Wheat,
  type LucideIcon,
} from 'lucide-react';
import type { ContextCategory, ContextItem } from '../../../domain/models';

/** Display order: who wrote → when → why → to whom → where → the wider world → form. */
export const CONTEXT_CATEGORY_ORDER: ContextCategory[] = [
  'authorship',
  'historical-period',
  'occasion',
  'audience',
  'geography',
  'political',
  'social',
  'economic',
  'religious',
  'jewish-tradition',
  'greco-roman',
  'ancient-near-east',
  'customs',
  'genre',
];

/** English labels (non-UI fallback); the UI shows the 'context' namespace's `category.<category>`. */
export const CONTEXT_CATEGORY_LABEL: Record<ContextCategory, string> = {
  authorship: 'Authorship',
  'historical-period': 'Historical period',
  occasion: 'Occasion',
  audience: 'First audience',
  geography: 'Geography',
  political: 'Political setting',
  social: 'Social world',
  economic: 'Economic life',
  religious: 'Religious practice',
  'jewish-tradition': 'Jewish tradition',
  'greco-roman': 'Greco-Roman world',
  'ancient-near-east': 'Ancient Near East',
  customs: 'Customs & daily life',
  genre: 'Genre',
};

export const CONTEXT_CATEGORY_ICON: Record<ContextCategory, LucideIcon> = {
  authorship: PenLine,
  'historical-period': Hourglass,
  occasion: Mail,
  audience: Users,
  geography: MapPin,
  political: Crown,
  social: Houses,
  economic: Coins,
  religious: Flame,
  'jewish-tradition': Scroll,
  'greco-roman': Landmark,
  'ancient-near-east': Tent,
  customs: Wheat,
  genre: BookText,
};

/** Stable sort by category order (items of one category stay adjacent, in their curated order). */
export function sortContextItems(items: ContextItem[]): ContextItem[] {
  const rank = (c: ContextCategory) => {
    const i = CONTEXT_CATEGORY_ORDER.indexOf(c);
    return i < 0 ? CONTEXT_CATEGORY_ORDER.length : i;
  };
  return items
    .map((item, i) => ({ item, i }))
    .sort((a, b) => rank(a.item.category) - rank(b.item.category) || a.i - b.i)
    .map((x) => x.item);
}

/** Group items by category, only the categories present, in display order. */
export function groupContextItems(items: ContextItem[]): { category: ContextCategory; items: ContextItem[] }[] {
  const groups: { category: ContextCategory; items: ContextItem[] }[] = [];
  for (const item of sortContextItems(items)) {
    const last = groups[groups.length - 1];
    if (last && last.category === item.category) last.items.push(item);
    else groups.push({ category: item.category, items: [item] });
  }
  return groups;
}
