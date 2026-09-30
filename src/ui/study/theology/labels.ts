import {
  BookOpenText,
  Church,
  CircleQuestionMark,
  Compass,
  Cross,
  Flame,
  Gift,
  HandHeart,
  Hourglass,
  HouseHeart,
  Leaf,
  Music,
  PersonStanding,
  Scale,
  Scroll,
  Split,
  Sprout,
  Sun,
  Sunrise,
  Triangle,
  Unlink,
  type LucideIcon,
} from 'lucide-react';
import type { ConsensusLevel, TheologyCategory } from '../../../domain/models';
import type { BadgeProps } from '../../primitives';

/**
 * Icons and English fallback text for theology categories and consensus levels. The UI shows the
 * localized words from the 'theology' namespace (`category.<id>.label/.gloss`, `consensus.<level>.label/.explanation`).
 */
export interface CategoryMeta {
  label: string;
  /** the traditional term and a plain gloss, for the tooltip */
  gloss: string;
  icon: LucideIcon;
}

export const THEOLOGY_CATEGORY: Record<TheologyCategory, CategoryMeta> = {
  'theology-proper': { label: 'Doctrine of God', gloss: 'Theology proper — who God is and what he is like', icon: Sun },
  trinity: { label: 'The Trinity', gloss: 'One God in three persons: Father, Son and Holy Spirit', icon: Triangle },
  christology: { label: 'Christology', gloss: 'The person and work of Jesus Christ', icon: Cross },
  soteriology: { label: 'Salvation', gloss: 'Soteriology — how God saves', icon: HandHeart },
  pneumatology: { label: 'The Holy Spirit', gloss: 'Pneumatology — the person and work of the Spirit', icon: Flame },
  ecclesiology: { label: 'The Church', gloss: 'Ecclesiology — the people of God gathered', icon: Church },
  eschatology: { label: 'Last things', gloss: 'Eschatology — the hope of the age to come', icon: Sunrise },
  covenant: { label: 'Covenant', gloss: 'God’s binding commitments to his people', icon: Scroll },
  creation: { label: 'Creation', gloss: 'God as maker, and the world he made', icon: Sprout },
  anthropology: { label: 'Humanity', gloss: 'Theological anthropology — what it means to be human', icon: PersonStanding },
  hamartiology: { label: 'Sin', gloss: 'Hamartiology — the nature and effects of sin', icon: Unlink },
  grace: { label: 'Grace', gloss: 'God’s undeserved favour', icon: Gift },
  sanctification: { label: 'Sanctification', gloss: 'Growth in holiness', icon: Leaf },
  adoption: { label: 'Adoption', gloss: 'Believers welcomed as God’s children', icon: HouseHeart },
  providence: { label: 'Providence', gloss: 'God’s care for and rule over all things', icon: Compass },
  revelation: { label: 'Revelation', gloss: 'How God makes himself known', icon: BookOpenText },
  ethics: { label: 'Christian life', gloss: 'Ethics — how believers are called to live', icon: Scale },
  worship: { label: 'Worship', gloss: 'Honouring God rightly', icon: Music },
};

export interface ConsensusMeta {
  label: string;
  /** one-line explanation shown beside the badge */
  explanation: string;
  icon: LucideIcon;
  tone: NonNullable<BadgeProps['tone']>;
}

/** The four levels of agreement (spec §7), each with icon + words — never colour alone. */
export const CONSENSUS: Record<ConsensusLevel, ConsensusMeta> = {
  consensus: {
    label: 'Broad Christian consensus',
    explanation: 'Affirmed across the historic Christian traditions.',
    icon: Church,
    tone: 'olive',
  },
  denominational: {
    label: 'Denominational difference',
    explanation: 'A live difference between Christian traditions today.',
    icon: Split,
    tone: 'terracotta',
  },
  'historical-debate': {
    label: 'Historical debate',
    explanation: 'A question with a notable history of debate in the church.',
    icon: Hourglass,
    tone: 'gold',
  },
  uncertain: {
    label: 'Interpretive uncertainty',
    explanation: 'Careful interpreters are genuinely unsure how to read the text.',
    icon: CircleQuestionMark,
    tone: 'sage',
  },
};
