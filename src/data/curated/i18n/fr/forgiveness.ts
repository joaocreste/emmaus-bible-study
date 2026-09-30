/**
 * Français overlay for the topic "forgiveness". The English module (src/data/curated/topics/forgiveness.ts)
 * stays the source of truth for ids, references and citations. Scripture quoted in prose follows LSG.
 */
import type { TopicOverlay } from '../types';

const overlay: TopicOverlay = {
  topicId: 'forgiveness',
  locale: 'fr',
  name: 'Pardon',
  aliases: [
    'pardon',
    'le pardon',
    'pardonner',
    'pardonné',
    'pardonnée',
    'pardonnés',
    'comment pardonner',
    'pardonner aux autres',
    'pardonner à mes ennemis',
    'pardonner à ses ennemis',
    'refus de pardonner',
    'rancune',
    'rancœur',
    'amertume',
    'garder rancune',
    'dieu pardonne-t-il',
    'est-ce que dieu pardonne',
    'pardon des péchés',
    'rémission des péchés',
    'combien de fois dois-je pardonner',
    'soixante-dix fois sept fois',
    'septante fois sept fois',
    'que dit la bible sur le pardon',
  ],
  question: 'Que dit la Bible sur le pardon ?',
  definition:
    'Dans l’Écriture, le pardon est d’abord ce que Dieu fait : il pardonne l’iniquité, éloigne les transgressions et ne traite pas son peuple selon ses péchés (Ps 103.10–12 ; Mi 7.18–19). Le verbe grec le plus employé pour le dire, aphiēmi, signifie libérer ou laisser aller ; il s’emploie aussi bien pour la remise d’une dette que pour le pardon des péchés (Mt 18.27 ; 1 Jn 1.9). Le Nouveau Testament situe ce pardon en Christ, par qui Dieu annule la dette qui nous était contraire (Ep 1.7 ; Col 2.13–14). Ceux qui ont été pardonnés doivent à leur tour pardonner : Jésus lie la miséricorde reçue à la miséricorde accordée (Mt 6.12–15 ; 18.21–35), et Paul prend pour modèle la manière dont Dieu nous a pardonné en Christ (Ep 4.32). Le pardon ne fait pas comme si rien ne s’était passé ; il nomme le tort et remet la dette (Lc 17.3–4 ; Gn 50.15–21).',
  keyPassages: {
    'forgiveness:kp:1': {
      title: 'Le bonheur d’être pardonné',
      group: 'Le Dieu qui pardonne',
      note: 'David oppose la misère qui ronge celui qui cache son péché au soulagement de l’aveu : quand il a reconnu son péché, Dieu en a effacé la faute. Paul cite les premiers versets en Romains 4.7–8.',
    },
    'forgiveness:kp:2': {
      title: 'Autant l’orient est éloigné de l’occident',
      group: 'Le Dieu qui pardonne',
      note: 'Dieu ne rend pas aux humains selon leurs péchés. Sa bonté fidèle éloigne entièrement les transgressions, et il a compassion des êtres fragiles comme un père a compassion de ses enfants.',
    },
    'forgiveness:kp:3': {
      title: 'Quel Dieu est semblable à toi ?',
      group: 'Le Dieu qui pardonne',
      note: 'Michée clôt son livre en s’émerveillant d’un Dieu qui pardonne l’iniquité, qui prend plaisir à la bonté fidèle et qui jette au fond de la mer les péchés de son peuple.',
    },
    'forgiveness:kp:4': {
      title: 'L’écarlate devenue blanche',
      group: 'Le Dieu qui pardonne',
      note: 'S’adressant à une nation rebelle, l’Éternel l’invite à plaider avec lui : des péchés rouges comme l’écarlate peuvent devenir blancs comme la neige.',
    },
    'forgiveness:kp:5': {
      title: 'Beaucoup pardonnée, elle a beaucoup aimé',
      group: 'Le pardon par Christ',
      note: 'Jésus déclare pardonnés les péchés d’une femme pécheresse et se sert de la parabole de deux débiteurs pour montrer qu’un grand pardon produit un grand amour. Les convives se demandent alors qui est cet homme qui pardonne même les péchés (7.49).',
    },
    'forgiveness:kp:6': {
      title: 'Père, pardonne-leur',
      group: 'Le pardon par Christ',
      note: 'Sur la croix, Jésus prie pour le pardon de ceux qui le crucifient, incarnant l’amour des ennemis qu’il avait enseigné. (Une note de la BSB signale que certains manuscrits ne contiennent pas cette prière.)',
    },
    'forgiveness:kp:7': {
      title: 'La dette annulée',
      group: 'Le pardon par Christ',
      note: 'Dieu a rendu à la vie avec Christ ceux qui étaient spirituellement morts, leur a pardonné toutes leurs offenses et a annulé l’acte de dette qui les accusait en le clouant à la croix.',
    },
    'forgiveness:kp:8': {
      title: 'Si nous confessons nos péchés',
      group: 'Le pardon par Christ',
      note: 'Les chrétiens pèchent encore. Le remède n’est pas le déni, mais la confession à un Dieu fidèle et juste pour pardonner et purifier.',
    },
    'forgiveness:kp:9': {
      title: 'Le serviteur impitoyable',
      group: 'Se pardonner les uns aux autres',
      note: 'À la question de savoir combien de fois pardonner, Jésus répond « jusqu’à septante fois sept fois » et raconte l’histoire d’un serviteur libéré d’une dette impossible à payer qui refuse de remettre une petite dette. Ceux qui ont été pardonnés doivent pardonner de tout leur cœur.',
    },
    'forgiveness:kp:10': {
      title: 'Pardonne-nous comme nous pardonnons',
      group: 'Se pardonner les uns aux autres',
      note: 'Le Notre Père demande pardon pour nos offenses — littéralement nos dettes — comme nous pardonnons à ceux qui nous ont offensés, et Jésus ajoute un sérieux avertissement contre le refus de pardonner aux autres.',
    },
    'forgiveness:kp:11': {
      title: 'Comme Dieu vous a pardonné en Christ',
      group: 'Se pardonner les uns aux autres',
      note: 'Paul invite les croyants à rejeter toute amertume, toute colère et toute méchanceté, et à être bons et compatissants, se pardonnant réciproquement comme Dieu leur a pardonné en Christ.',
    },
    'forgiveness:kp:12': {
      title: 'Joseph pardonne à ses frères',
      group: 'Se pardonner les uns aux autres',
      note: 'Joseph refuse de prendre la place de Dieu pour se venger, reconnaît que Dieu a fait servir au bien le mal qu’ils avaient voulu, et rassure ses frères effrayés par sa bonté et en pourvoyant à leurs besoins.',
    },
  },
  suggestedQuestions: [
    'Combien de fois dois-je pardonner à quelqu’un ?',
    'Que signifie le mot grec traduit par « pardonner » ?',
    'Pourquoi Jésus lie-t-il le pardon de Dieu au pardon accordé aux autres ?',
    'Expliquez la parabole du serviteur impitoyable.',
    'Comment Joseph a-t-il pardonné à ses frères ?',
  ],
};

export default overlay;
