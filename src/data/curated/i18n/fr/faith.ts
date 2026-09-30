/**
 * Français overlay for the topic "faith". The English module (src/data/curated/topics/faith.ts)
 * stays the source of truth for ids, references and citations.
 */
import type { TopicOverlay } from '../types';

const overlay: TopicOverlay = {
  topicId: 'faith',
  locale: 'fr',
  name: 'Foi',
  aliases: [
    'foi',
    'la foi',
    'croire',
    'croyance',
    'qu’est-ce que la foi',
    "qu'est-ce que la foi",
    'foi en dieu',
    'foi en jésus',
    'croire en dieu',
    'confiance en dieu',
    'faire confiance à dieu',
    'foi qui sauve',
    'la foi et les œuvres',
    'foi et œuvres',
    'doute',
    'doutes',
    'avoir des doutes',
    'que dit la bible sur la foi',
  ],
  question: 'Que dit la Bible sur la foi ?',
  definition:
    'La foi est la confiance en Dieu qui le prend au mot. L’épître aux Hébreux la décrit comme l’assurance de ce qu’on espère et la conviction de ce qu’on ne voit pas, sans laquelle il est impossible de plaire à Dieu (He 11.1, 6). Abraham en est le modèle : il s’est fié à la promesse de Dieu, et Dieu le lui a compté comme justice (Gn 15.6 ; Rm 4.18–22). Le grec pistis signifie croyance, confiance ou assurance, et peut aussi signifier fidélité ; en Habacuc 2.4, l’hébreu ʾemunah signifie fidélité ou fermeté, une loyauté constante plutôt qu’un assentiment passager. Dans le Nouveau Testament, la foi repose sur Jésus en tant que Christ et reçoit le salut comme un don de Dieu (Jn 20.31 ; Ep 2.8–9). Elle naît de l’écoute du message du Christ (Rm 10.17) et n’est jamais oisive : elle agit par l’amour et se montre dans les actes (Ga 5.6 ; Jc 2.17).',
  keyPassages: {
    'faith:kp:1': {
      title: 'La foi définie',
      group: 'La foi définie et incarnée',
      note: 'L’épître aux Hébreux décrit la foi comme l’assurance de ce qu’on espère et de ce qu’on ne voit pas, puis la montre à l’œuvre chez Abel et Hénoc. Sans cette confiance, il est impossible de plaire à Dieu, car celui qui s’approche de lui doit croire qu’il existe et qu’il récompense ceux qui le cherchent (11.6).',
    },
    'faith:kp:2': {
      title: 'Abram croit à la promesse',
      group: 'La foi définie et incarnée',
      note: 'Sans enfant et avançant en âge, Abram est invité à compter les étoiles ; il se fie à la promesse de Dieu, et l’Éternel lui compte sa foi comme justice. Paul et Jacques s’appuient tous deux sur ce verset (Rm 4.3 ; Jc 2.23).',
    },
    'faith:kp:3': {
      title: 'La foi obéissante d’Abraham',
      group: 'La foi définie et incarnée',
      note: 'La foi part sans savoir où elle va, vit en étrangère dans l’attente de la cité de Dieu, et va jusqu’à estimer que Dieu peut ressusciter les morts (11.19).',
    },
    'faith:kp:4': {
      title: 'Le juste vivra par sa foi',
      group: 'La foi définie et incarnée',
      note: 'En un temps de crise, il est dit au prophète que le juste vivra par sa fidélité (en hébreu ʾemunah). Paul cite cette ligne comme une note maîtresse de l’Évangile, et l’épître aux Hébreux l’applique à la persévérance (Rm 1.17 ; Ga 3.11 ; He 10.38).',
    },
    'faith:kp:5': {
      title: 'Écrit afin que vous croyiez',
      group: 'Croire en Christ',
      note: 'Jean énonce le but de son Évangile : que les lecteurs croient que Jésus est le Christ, le Fils de Dieu, et qu’en croyant ils aient la vie en son nom.',
    },
    'faith:kp:6': {
      title: 'Quiconque croit en lui',
      group: 'Croire en Christ',
      note: 'Le don que Dieu fait de son Fils se reçoit en croyant : dans ces versets, la ligne de partage passe entre croire et ne pas croire au Fils unique de Dieu (3.18), et les versets suivants associent l’incrédulité à l’amour des ténèbres (3.19–21).',
    },
    'faith:kp:7': {
      title: 'La foi vient de ce qu’on entend',
      group: 'Croire en Christ',
      note: 'Paul fait remonter la foi à la proclamation : on invoque celui en qui l’on croit, on croit ce que l’on a entendu, et l’on entend parce que quelqu’un est envoyé avec le message du Christ.',
    },
    'faith:kp:8': {
      title: 'Sauvés par le moyen de la foi',
      group: 'Croire en Christ',
      note: 'Le salut est par grâce, par le moyen de la foi, et non par les œuvres, afin que personne ne se glorifie. La foi reçoit ce que Dieu donne au lieu de le mériter.',
    },
    'faith:kp:9': {
      title: 'La foi sans les œuvres est morte',
      group: 'Une foi agissante et persévérante',
      note: 'Jacques rejette une simple profession de foi qui laisse l’affamé sans nourriture. La foi vivante, comme celle d’Abraham et de Rahab, se manifeste dans les actes (2.17, 21–25).',
    },
    'faith:kp:10': {
      title: 'La foi qui agit par l’amour',
      group: 'Une foi agissante et persévérante',
      note: 'En Christ, ce qui compte n’est ni la circoncision ni l’incirconcision, mais la foi qui s’exprime par l’amour.',
    },
    'faith:kp:11': {
      title: 'Viens au secours de mon incrédulité',
      group: 'Une foi agissante et persévérante',
      note: 'Un père désespéré confesse dans le même souffle sa foi et son incrédulité, et Jésus répond à cette foi mêlée en guérissant son fils. La foi peut être réelle tout en étant encore faible.',
    },
    'faith:kp:12': {
      title: 'Une foi éprouvée par le feu',
      group: 'Une foi agissante et persévérante',
      note: 'Les épreuves attestent la foi comme le feu éprouve l’or. Les croyants aiment un Christ qu’ils n’ont pas vu, se confient en lui, et obtiennent le salut, qui est le but de la foi.',
    },
  },
  suggestedQuestions: [
    'Quel est le mot grec pour « foi » ?',
    'Comment accorder Paul et Jacques sur la foi et les œuvres ?',
    'Pourquoi Abraham est-il le modèle de la foi ?',
    'Que signifie Hébreux 11.1 ?',
    'Est-ce mal d’avoir des doutes ?',
  ],
};

export default overlay;
