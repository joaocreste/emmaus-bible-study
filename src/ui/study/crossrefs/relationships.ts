import { Columns2, GitCompareArrows, Landmark, Link, Milestone, Network, Quote, Waypoints, type LucideIcon } from 'lucide-react';
import type { RelationshipType } from '../../../domain/models';
import type { MessageKey } from '../../../i18n/catalog';
import type { BadgeProps } from '../../primitives';

export interface RelationshipMeta {
  /** 'crossrefs' message key of the label */
  label: MessageKey<'crossrefs'>;
  /** 'crossrefs' message key of the one-line plain explanation (tooltip) */
  description: MessageKey<'crossrefs'>;
  icon: LucideIcon;
  tone: NonNullable<BadgeProps['tone']>;
}

function meta(type: RelationshipType, icon: LucideIcon, tone: RelationshipMeta['tone']): RelationshipMeta {
  return { label: `relationship.${type}.label`, description: `relationship.${type}.description`, icon, tone };
}

/**
 * Labels, icons and quiet tones for cross-reference relationships (always icon + text, never
 * colour alone). Labels and descriptions are keys of the 'crossrefs' namespace: `t(meta.label)`.
 */
export const RELATIONSHIP_META: Record<RelationshipType, RelationshipMeta> = {
  parallel: meta('parallel', Columns2, 'olive'),
  quotation: meta('quotation', Quote, 'terracotta'),
  allusion: meta('allusion', Waypoints, 'terracotta'),
  'prophecy-fulfillment': meta('prophecy-fulfillment', Milestone, 'gold'),
  thematic: meta('thematic', Network, 'sage'),
  'same-concept': meta('same-concept', Link, 'olive'),
  contrast: meta('contrast', GitCompareArrows, 'outline'),
  historical: meta('historical', Landmark, 'sage'),
};
