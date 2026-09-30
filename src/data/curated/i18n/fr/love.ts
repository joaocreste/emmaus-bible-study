/**
 * Français overlay for the topic "love". The English module (src/data/curated/topics/love.ts)
 * stays the source of truth for ids, references and citations. Scripture quoted in prose follows LSG;
 * lexicon glosses (STEPBible) stay in English.
 */
import type { TopicOverlay } from '../types';

const overlay: TopicOverlay = {
  topicId: 'love',
  locale: 'fr',
  name: 'Amour',
  aliases: [
    'amour',
    'l’amour',
    'aimer',
    'l’amour de dieu',
    "l'amour de dieu",
    'amour de dieu',
    'dieu est amour',
    'qu’est-ce que l’amour',
    "qu'est-ce que l'amour",
    'aimer les autres',
    'aimez-vous les uns les autres',
    'aimer son prochain',
    'aime ton prochain',
    'tu aimeras ton prochain comme toi-même',
    'aimer ses ennemis',
    'aimez vos ennemis',
    'le plus grand commandement',
    'charité',
    'bonté',
    'amour fidèle',
    'que dit la bible sur l’amour',
    "que dit la bible sur l'amour",
  ],
  question: 'Que dit la Bible sur l’amour ?',
  definition:
    'L’amour commence en Dieu, qui se révèle miséricordieux et compatissant, riche en bonté et en fidélité (Ex 34.6–7) ; l’hébreu ḥesed (que la BSB anglaise rend par loving devotion, et Segond ici par « bonté ») est glosé kindness dans le lexique STEPBible. Jean dit que Dieu est amour et définit l’amour par l’action de Dieu envoyant son Fils comme victime expiatoire pour nos péchés (1 Jn 4.8–10 ; Rm 5.8). L’amour humain répond à celui de Dieu : les plus grands commandements sont d’aimer Dieu de tout son être et son prochain comme soi-même (Dt 6.5 ; Lv 19.18 ; Mc 12.28–34), et l’amour est l’accomplissement de la loi (Rm 13.10). Jésus l’étend aux ennemis (Mt 5.43–48) et fait de son propre amour la mesure (Jn 13.34). Le grec agapē (verbe agapaō) est le mot habituel, mais il n’est pas en soi un terme réservé à l’amour divin : le même verbe décrit des hommes qui ont aimé les ténèbres (Jn 3.19, où Segond traduit « préféré »), si bien que c’est le contexte qui montre la profondeur de l’amour.',
  keyPassages: {
    'love:kp:1': {
      title: 'Riche en bonté',
      group: 'L’amour de Dieu',
      note: 'Après l’idolâtrie d’Israël avec le veau d’or, Dieu proclame son nom devant Moïse : miséricordieux, compatissant, riche en amour fidèle, pardonnant — sans pour autant tenir le coupable pour innocent. L’Écriture reprend ensuite cette autodescription à maintes reprises (par exemple Ps 103.8 ; Jl 2.13).',
    },
    'love:kp:2': {
      title: 'Dieu est amour',
      group: 'L’amour de Dieu',
      note: 'Jean fonde l’amour chrétien sur la nature de Dieu et sur l’envoi du Fils. L’amour parvenu à sa maturité bannit la crainte, et prétendre aimer Dieu en ignorant son frère est un mensonge.',
    },
    'love:kp:3': {
      title: 'Lorsque nous étions encore des pécheurs',
      group: 'L’amour de Dieu',
      note: 'Dieu prouve son amour en ce que Christ est mort pour les impies — non pour ceux qui le méritaient, mais pour des pécheurs.',
    },
    'love:kp:4': {
      title: 'Rien ne pourra nous séparer',
      group: 'L’amour de Dieu',
      note: 'Paul énumère toutes les menaces — détresse, persécution, mort, puissances spirituelles — et conclut que rien dans toute la création ne pourra séparer les croyants de l’amour de Dieu manifesté en Jésus-Christ.',
    },
    'love:kp:5': {
      title: 'Tu aimeras l’Éternel, ton Dieu',
      group: 'Les grands commandements',
      note: 'La confession d’Israël en l’Éternel unique conduit droit au commandement de l’aimer de tout son cœur, de toute son âme et de toute sa force.',
    },
    'love:kp:6': {
      title: 'Tu aimeras ton prochain comme toi-même',
      group: 'Les grands commandements',
      note: 'Dans un chapitre de sainteté pratique, Israël reçoit l’ordre de ne pas haïr, de ne pas se venger ni garder de rancune, mais d’aimer son prochain comme soi-même ; le même chapitre étend cet amour à l’étranger (19.34).',
    },
    'love:kp:7': {
      title: 'Le plus grand commandement',
      group: 'Les grands commandements',
      note: 'Interrogé sur le commandement le plus important, Jésus unit Deutéronome 6.5 et Lévitique 19.18 comme le premier et le second, et le scribe reconnaît qu’ils valent plus que tous les sacrifices.',
    },
    'love:kp:8': {
      title: 'L’amour accomplit la loi',
      group: 'Les grands commandements',
      note: 'Tous les commandements qui concernent le prochain se résument dans celui d’aimer, car l’amour ne fait point de mal au prochain.',
    },
    'love:kp:9': {
      title: 'La voie de l’amour',
      group: 'L’amour en pratique',
      note: 'Écrit pour une Église richement dotée mais divisée, au cœur de l’enseignement de Paul sur les dons spirituels (1 Co 12–14), ce portrait montre que sans l’amour les dons même les plus spectaculaires ne sont rien, et que l’amour leur survit à tous.',
    },
    'love:kp:10': {
      title: 'Comme je vous ai aimés',
      group: 'L’amour en pratique',
      note: 'Jésus donne un commandement nouveau : aimez-vous les uns les autres comme il vous a aimés. Cet amour est la marque à laquelle tous reconnaîtront ses disciples.',
    },
    'love:kp:11': {
      title: 'Le bon Samaritain',
      group: 'L’amour en pratique',
      note: 'Invité à définir le « prochain », Jésus raconte l’histoire d’un Samaritain méprisé qui a exercé la miséricorde envers un inconnu blessé, et retourne la question : qui s’est montré le prochain ?',
    },
    'love:kp:12': {
      title: 'Aimez vos ennemis',
      group: 'L’amour en pratique',
      note: 'Jésus appelle ses disciples à aimer leurs ennemis et à prier pour ceux qui les persécutent, à l’image du Père qui fait lever son soleil et tomber la pluie sur les méchants et sur les bons.',
    },
  },
  suggestedQuestions: [
    'Quel est le mot grec pour l’amour en 1 Corinthiens 13 ?',
    'Que signifie « Dieu est amour » ?',
    'Qui est mon prochain ?',
    'Comment puis-je aimer mes ennemis ?',
    'Expliquez 1 Corinthiens 13 verset par verset.',
  ],
};

export default overlay;
