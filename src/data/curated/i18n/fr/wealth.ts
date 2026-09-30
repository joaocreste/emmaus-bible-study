/**
 * Français overlay for the topic "wealth". The English module (src/data/curated/topics/wealth.ts)
 * stays the source of truth for ids, references and citations. Scripture quoted in prose follows LSG.
 */
import type { TopicOverlay } from '../types';

const overlay: TopicOverlay = {
  topicId: 'wealth',
  locale: 'fr',
  name: 'Richesse et biens',
  aliases: [
    'richesse',
    'richesses',
    'argent',
    'riche',
    'les riches',
    'biens',
    'biens matériels',
    'possessions',
    'avidité',
    'cupidité',
    'convoitise',
    'amour de l’argent',
    "amour de l'argent",
    'générosité',
    'donner généreusement',
    'contentement',
    'pauvreté',
    'les pauvres',
    'matérialisme',
    'mamon',
    'mammon',
    'est-ce mal d’être riche',
    "est-ce mal d'être riche",
    'que dit la bible sur la richesse',
    'que dit la bible sur l’argent',
    "que dit la bible sur l'argent",
  ],
  question: 'Que dit la Bible sur la richesse ?',
  definition:
    'L’Écriture présente la richesse à la fois comme un don et comme un danger. Tout appartient à Dieu, et c’est lui qui donne la force d’acquérir des richesses (1 Ch 29.11–14 ; Dt 8.17–18) ; jouir du fruit de son travail est en soi un don de Dieu (Ec 5.18–19). Pourtant les richesses engendrent facilement l’orgueil et l’oubli de Dieu (Dt 8.11–14), ne rassasient jamais (Ec 5.10) et se disputent le cœur : Jésus avertit que nul ne peut servir Dieu et l’argent, et que la vie d’un homme ne dépend pas de ses biens (Mt 6.19–24 ; Lc 12.15). Paul appelle l’amour de l’argent une racine de toutes sortes de maux, recommande le contentement et exhorte les riches à la générosité (1 Tm 6.6–19). La Loi exige une main ouverte envers le pauvre (Dt 15.7–11), et l’Évangile enracine la générosité dans le Christ, qui s’est fait pauvre pour nous (2 Co 8.9).',
  keyPassages: {
    'wealth:kp:1': {
      title: 'Souviens-toi de l’Éternel, ton Dieu',
      group: 'La richesse, don et épreuve',
      note: 'Moïse avertit que la prospérité peut enfler le cœur et faire oublier le Dieu qui a délivré Israël ; la force d’acquérir des richesses est un don de Dieu, non le produit de sa propre puissance.',
    },
    'wealth:kp:2': {
      title: 'Tout vient de toi',
      group: 'La richesse, don et épreuve',
      note: 'Après que le peuple a donné de bon cœur pour la construction de la maison de Dieu, David confesse que toutes les richesses viennent de Dieu, si bien que donner, c’est simplement rendre à Dieu ce qui est déjà à lui.',
    },
    'wealth:kp:3': {
      title: 'Ni pauvreté ni richesse',
      group: 'La richesse, don et épreuve',
      note: 'Agur demande le nécessaire : pas trop, de peur d’oublier Dieu, et pas trop peu, de peur de voler et de déshonorer le nom de Dieu.',
    },
    'wealth:kp:4': {
      title: 'Celui qui aime l’argent n’est pas rassasié',
      group: 'La richesse, don et épreuve',
      note: 'L’Ecclésiaste dénonce le vide de la thésaurisation et les nuits sans sommeil des riches, tout en appelant don de Dieu la capacité de jouir de son travail et de ses biens.',
    },
    'wealth:kp:5': {
      title: 'Un trésor dans le ciel',
      group: 'Jésus et l’argent',
      note: 'Là où est ton trésor, là aussi sera ton cœur. Jésus présente Dieu et l’argent comme deux maîtres rivaux : nul ne peut servir les deux.',
    },
    'wealth:kp:6': {
      title: 'Le riche insensé',
      group: 'Jésus et l’argent',
      note: 'Mettant en garde contre toute forme de cupidité, Jésus parle d’un homme qui a bâti de plus grands greniers pour lui-même sans être riche pour Dieu, et dont l’âme lui fut redemandée la nuit même.',
    },
    'wealth:kp:7': {
      title: 'Le riche qui accourut vers Jésus',
      group: 'Jésus et l’argent',
      note: 'Jésus pose un regard d’amour sur un homme riche et sincère, et lui demande de tout vendre et de le suivre (Matthieu le présente comme un jeune homme, Mt 19.20). Son départ attristé suscite la parole sur le chameau et le trou d’une aiguille — et l’assurance que tout est possible à Dieu.',
    },
    'wealth:kp:8': {
      title: 'Le riche et Lazare',
      group: 'Jésus et l’argent',
      note: 'Une parabole du renversement : un riche qui ignorait le mendiant couché à sa porte découvre après la mort qu’un grand abîme les sépare, et apprend que Moïse et les prophètes suffisaient à l’avertir.',
    },
    'wealth:kp:9': {
      title: 'La piété avec le contentement',
      group: 'Contentement et générosité',
      note: 'Paul avertit que le désir de s’enrichir est un piège et que l’amour de l’argent est une racine de toutes sortes de maux ; il exhorte les riches à ne pas mettre leur espérance dans des richesses incertaines, mais en Dieu, et à être généreux et prompts à partager.',
    },
    'wealth:kp:10': {
      title: 'Ouvre ta main',
      group: 'Contentement et générosité',
      note: 'Israël ne doit pas endurcir son cœur ni fermer sa main à son frère pauvre, mais donner généreusement et sans regret.',
    },
    'wealth:kp:11': {
      title: 'Dieu aime celui qui donne avec joie',
      group: 'Contentement et générosité',
      note: 'Paul encourage un don généreux et libre, en se fiant à Dieu pour pourvoir à toute bonne œuvre et pour changer la générosité en actions de grâces. Il le fonde sur le Christ, qui, étant riche, s’est fait pauvre pour nous (8.9).',
    },
    'wealth:kp:12': {
      title: 'Le salaire retenu',
      group: 'Contentement et générosité',
      note: 'Jacques dénonce les riches qui ont amassé des trésors et frustré leurs ouvriers ; les cris des moissonneurs sont parvenus aux oreilles du Seigneur des armées.',
    },
  },
  suggestedQuestions: [
    'La richesse est-elle un péché ?',
    'Quel est le mot grec derrière « l’amour de l’argent » ?',
    'Que voulait dire Jésus par « Vous ne pouvez servir Dieu et Mamon » ?',
    'La Bible dit-elle que l’argent est la racine de tous les maux ?',
    'Comment la Bible enseigne-t-elle la générosité ?',
    'Expliquez la parabole du riche insensé.',
  ],
};

export default overlay;
