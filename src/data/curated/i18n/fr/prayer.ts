/**
 * Français overlay for the topic "prayer". The English module (src/data/curated/topics/prayer.ts)
 * stays the source of truth for ids, references and citations.
 */
import type { TopicOverlay } from '../types';

const overlay: TopicOverlay = {
  topicId: 'prayer',
  locale: 'fr',
  name: 'Prière',
  aliases: [
    'prière',
    'la prière',
    'prières',
    'prier',
    'comment prier',
    'comment dois-je prier',
    'enseigne-nous à prier',
    'le notre père',
    'notre père',
    'l’oraison dominicale',
    'prière du seigneur',
    'prière non exaucée',
    'prières non exaucées',
    'dieu répond-il aux prières',
    'dieu exauce-t-il les prières',
    'intercession',
    'intercéder',
    'supplication',
    'demande',
    'que dit la bible sur la prière',
  ],
  question: 'Qu’enseigne la Bible sur la prière ?',
  definition:
    'La prière consiste à parler à Dieu comme à un Père — louer, confesser, demander et rendre grâces — en ayant confiance qu’il entend. Jésus a appris à ses disciples à prier dans le secret et avec simplicité, puisque le Père sait de quoi ils ont besoin avant qu’ils le lui demandent, et leur a donné un modèle qui recherche le nom, le règne et la volonté de Dieu avant le pain quotidien, le pardon et la délivrance (Mt 6.5–13). Il a encouragé la persévérance (Lc 11.5–13 ; 18.1–8) et l’humilité (Lc 18.9–14). Les Psaumes montrent que la lamentation sincère a autant sa place dans la prière que la louange (Ps 13 ; 62.8). Les chrétiens prient avec assurance parce que Jésus est un grand prêtre qui compatit (He 4.14–16), et lorsqu’ils ne savent que demander, l’Esprit intercède pour eux (Rm 8.26–27). Paul invite les croyants à présenter à Dieu chacun de leurs soucis avec des actions de grâces (Ph 4.6).',
  keyPassages: {
    'prayer:kp:1': {
      title: 'Le Notre Père',
      group: 'Jésus enseigne la prière',
      note: 'Jésus met en garde contre la prière qui cherche à se faire voir ou qui multiplie les paroles, puis donne une prière qui commence par le nom, le règne et la volonté de Dieu et passe ensuite au pain quotidien, au pardon et à la délivrance du mal.',
    },
    'prayer:kp:2': {
      title: 'Demandez, cherchez, frappez',
      group: 'Jésus enseigne la prière',
      note: 'La forme plus brève de la prière chez Luc est suivie de la parabole de l’ami importun à minuit et de la promesse que le Père donne le Saint-Esprit à ceux qui le lui demandent.',
    },
    'prayer:kp:3': {
      title: 'Prier sans se relâcher',
      group: 'Jésus enseigne la prière',
      note: 'Si même un juge inique finit par céder à une veuve insistante, à combien plus forte raison Dieu fera-t-il justice à ses élus qui crient à lui jour et nuit.',
    },
    'prayer:kp:4': {
      title: 'Le pharisien et le publicain',
      group: 'Jésus enseigne la prière',
      note: 'Celui qui redescendit chez lui justifié ne fut pas celui qui énumérait ses vertus, mais celui qui se tenait à distance et implorait simplement la miséricorde, en pécheur qu’il était.',
    },
    'prayer:kp:5': {
      title: 'Non pas ce que je veux, mais ce que tu veux',
      group: 'Jésus enseigne la prière',
      note: 'À Gethsémané, Jésus, accablé de tristesse, demande par trois fois que la coupe s’éloigne de lui, tout en se soumettant à la volonté du Père — la demande sincère et l’abandon tenus ensemble.',
    },
    'prayer:kp:6': {
      title: 'Jusques à quand, Éternel ?',
      group: 'Les prières du peuple de Dieu',
      note: 'Une lamentation qui passe du sentiment d’être oublié de Dieu à une confiance renouvelée en son amour fidèle. L’Écriture donne des mots pour prier quand Dieu semble absent.',
    },
    'prayer:kp:7': {
      title: 'Confession et supplication',
      group: 'Les prières du peuple de Dieu',
      note: 'Apprenant la ruine de Jérusalem, Néhémie mène le deuil, jeûne et prie : il confesse le péché de son peuple, invoque les promesses faites par Dieu à Moïse et demande la faveur du roi qu’il sert comme échanson.',
    },
    'prayer:kp:8': {
      title: 'Prier en s’appuyant sur la miséricorde de Dieu',
      group: 'Les prières du peuple de Dieu',
      note: 'Daniel confesse le péché d’Israël et demande à Dieu d’agir, non à cause de la justice de son peuple, mais à cause de ses grandes compassions et pour l’amour de son nom.',
    },
    'prayer:kp:9': {
      title: 'S’approcher du trône de la grâce',
      group: 'La prière en Christ et par l’Esprit',
      note: 'Parce que Jésus, notre grand prêtre, compatit à nos faiblesses, les croyants peuvent s’approcher de Dieu avec assurance pour obtenir miséricorde et être secourus dans leurs besoins.',
    },
    'prayer:kp:10': {
      title: 'L’Esprit intercède',
      group: 'La prière en Christ et par l’Esprit',
      note: 'Lorsque nous ne savons pas ce qu’il nous convient de demander, l’Esprit lui-même intercède pour nous par des soupirs inexprimables, et il le fait selon la volonté de Dieu.',
    },
    'prayer:kp:11': {
      title: 'La prière plutôt que l’inquiétude',
      group: 'La prière en Christ et par l’Esprit',
      note: 'Paul transforme l’inquiétude en prières et en supplications accompagnées d’actions de grâces, et promet que la paix de Dieu gardera les cœurs et les pensées en Jésus-Christ.',
    },
    'prayer:kp:12': {
      title: 'La prière de la foi',
      group: 'La prière en Christ et par l’Esprit',
      note: 'Jacques recommande la prière dans la souffrance, la maladie et le péché, y compris la confession mutuelle des péchés, et prend l’exemple d’Élie — un homme de la même nature que nous, dont Dieu a exaucé les prières.',
    },
  },
  suggestedQuestions: [
    'Expliquez le Notre Père phrase par phrase.',
    'Pourquoi prier si Dieu sait déjà ce dont j’ai besoin ?',
    'Que faire quand Dieu semble silencieux ?',
    'Que signifie que l’Esprit intercède pour nous ?',
    'Montrez-moi des prières de lamentation dans les Psaumes.',
    'Quel est le mot grec derrière « prier » ?',
  ],
};

export default overlay;
