import {
  ArrowRightLeft,
  Brackets,
  Equal,
  Eye,
  Image,
  Link2,
  ListTree,
  Milestone,
  Music,
  Repeat,
  Route,
  type LucideIcon,
} from 'lucide-react';
import type { LiteraryFeatureType } from '../../../domain/models';

/** English labels (non-UI fallback); the UI shows the 'literary' namespace's `feature.<type>.label`. */
export const FEATURE_LABEL: Record<LiteraryFeatureType, string> = {
  repetition: 'Repetition',
  parallelism: 'Parallelism',
  chiasm: 'Chiasm',
  inclusio: 'Inclusio',
  metaphor: 'Metaphor',
  imagery: 'Imagery',
  poetry: 'Poetry',
  'narrative-structure': 'Narrative structure',
  'argument-structure': 'Argument structure',
  transition: 'Transition',
  allusion: 'Allusion',
};

/** One-line explanation of each device (English fallback; the eyebrow's tooltip uses `feature.<type>.explanation`). */
export const FEATURE_EXPLANATION: Record<LiteraryFeatureType, string> = {
  repetition: 'A word or phrase repeated to build emphasis or bind a passage together.',
  parallelism: 'Lines that echo, extend or contrast one another — a characteristic feature of Hebrew poetry.',
  chiasm: 'A mirrored arrangement (A B C … C′ B′ A′) that often places the emphasis at the centre.',
  inclusio: 'The same word or idea at the beginning and end, framing what lies between.',
  metaphor: 'Speaking of one thing in terms of another.',
  imagery: 'Concrete pictures the writer uses to make an idea seen and felt.',
  poetry: 'Features of poetic form: lines, stanzas, rhythm, terseness.',
  'narrative-structure': 'How the story is arranged: scenes, plot, turning points.',
  'argument-structure': 'How the writer’s reasoning moves: claims, grounds, conclusions.',
  transition: 'A hinge that turns the passage from one movement to the next.',
  allusion: 'An echo of an earlier text that the first readers would have heard.',
};

export const FEATURE_ICON: Record<LiteraryFeatureType, LucideIcon> = {
  repetition: Repeat,
  parallelism: Equal,
  chiasm: ArrowRightLeft,
  inclusio: Brackets,
  metaphor: Image,
  imagery: Eye,
  poetry: Music,
  'narrative-structure': Route,
  'argument-structure': ListTree,
  transition: Milestone,
  allusion: Link2,
};
