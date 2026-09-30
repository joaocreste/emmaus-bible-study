/**
 * Français overlay for the topic "marriage". The English module (src/data/curated/topics/marriage.ts)
 * stays the source of truth for ids, references and citations. Confession wording stays in English.
 */
import type { TopicOverlay } from '../types';

const overlay: TopicOverlay = {
  topicId: 'marriage',
  locale: 'fr',
  name: 'Mariage',
  aliases: [
    'mariage',
    'le mariage',
    'marié',
    'mariée',
    'mariés',
    'se marier',
    'épouser',
    'mari',
    'époux',
    'épouse',
    'maris et femmes',
    'conjoint',
    'noces',
    'une seule chair',
    'divorce',
    'divorcer',
    'mariage chrétien',
    'le mariage est-il un sacrement',
    'sacrement du mariage',
    'célibat',
    'que dit la bible sur le mariage',
  ],
  question: 'Que dit la Bible sur le mariage ?',
  definition:
    'L’Écriture présente le mariage comme un don de la création : l’union d’alliance d’un homme et d’une femme, dans laquelle les deux deviennent une seule chair (Gn 2.18–25). L’homme n’est pas fait pour être seul, et la femme est formée comme une aide qui lui corresponde. Interrogé sur le divorce, Jésus revient à ce « commencement » : ce que Dieu a uni, nul ne doit le séparer (Mt 19.3–9). Malachie appelle l’épouse la femme de l’alliance, l’Éternel en étant témoin (Ml 2.14), et Osée se sert du mariage pour dépeindre l’amour fidèle de Dieu envers Israël infidèle (Os 2.14–20). Paul appelle les maris à aimer comme Christ a aimé l’Église et dit de l’union en une seule chair qu’elle est un grand mystère concernant Christ et l’Église (Ep 5.21–33). Le mariage doit être honoré de tous (He 13.4), et pourtant le célibat est aussi un don, qui rend libre pour un attachement sans partage au Seigneur (1 Co 7.7, 32–35).',
  keyPassages: {
    'marriage:kp:1': {
      title: 'Homme et femme à l’image de Dieu',
      group: 'Le mariage dans la création',
      note: 'L’humanité, homme et femme ensemble, porte l’image de Dieu et reçoit la bénédiction d’être féconde et de dominer sur la terre.',
    },
    'marriage:kp:2': {
      title: 'Il n’est pas bon que l’homme soit seul',
      group: 'Le mariage dans la création',
      note: 'Dieu forme la femme comme une aide qui corresponde à l’homme ; l’homme quitte ses parents et s’attache à sa femme, et les deux deviennent une seule chair, sans honte.',
    },
    'marriage:kp:3': {
      title: 'Ce que Dieu a joint',
      group: 'Le mariage dans la création',
      note: 'Interrogé sur le divorce, Jésus remonte à la création : le mariage est l’œuvre de Dieu qui unit deux êtres en un seul, et la permission de divorcer accordée par Moïse reflétait la dureté des cœurs plutôt que le dessein de Dieu.',
    },
    'marriage:kp:4': {
      title: 'La femme de ton alliance',
      group: 'Le mariage dans la création',
      note: 'Malachie reprend les hommes qui trahissent la femme de leur jeunesse : l’Éternel a été témoin de leur alliance conjugale. L’hébreu de 2.16 est difficile, et la BSB signale une autre traduction possible.',
    },
    'marriage:kp:5': {
      title: 'L’amour est fort comme la mort',
      group: 'Amour et fidélité',
      note: 'Le Cantique des cantiques célèbre l’amour engagé comme ardent, exclusif et sans prix — les grandes eaux ne peuvent l’éteindre, et la richesse ne peut l’acheter.',
    },
    'marriage:kp:6': {
      title: 'Fais ta joie de la femme de ta jeunesse',
      group: 'Amour et fidélité',
      note: 'Après avoir mis en garde contre la femme étrangère (5.1–14), le père recommande la joie et la fidélité dans le mariage.',
    },
    'marriage:kp:7': {
      title: 'Une appartenance mutuelle',
      group: 'Amour et fidélité',
      note: 'Paul donne au mari et à la femme des droits égaux l’un sur le corps de l’autre et déconseille de se priver l’un de l’autre, tout en appelant aussi le célibat un don de Dieu.',
    },
    'marriage:kp:8': {
      title: 'Que le mariage soit honoré',
      group: 'Amour et fidélité',
      note: 'Le mariage doit être honoré de tous et le lit conjugal exempt de souillure, car Dieu jugera l’impudicité et l’adultère.',
    },
    'marriage:kp:9': {
      title: 'Christ et l’Église',
      group: 'Le mariage et l’Évangile',
      note: 'Après l’appel à se soumettre les uns aux autres dans la crainte de Christ (5.21), Paul appelle les femmes à la soumission et les maris à aimer jusqu’au sacrifice, comme Christ a aimé l’Église, et dit de l’union en une seule chair qu’elle est un grand mystère concernant Christ et l’Église. Les chrétiens interprètent de diverses manières son langage de chef et de soumission.',
    },
    'marriage:kp:10': {
      title: 'Je serai ton fiancé pour toujours',
      group: 'Le mariage et l’Évangile',
      note: 'Dieu s’engage à reconquérir Israël infidèle et à se fiancer avec elle dans la justice, l’amour et la fidélité — le mariage comme image de l’alliance de Dieu.',
    },
    'marriage:kp:11': {
      title: 'Le festin de noces de l’Agneau',
      group: 'Le mariage et l’Évangile',
      note: 'L’histoire s’achève par des noces : l’Église, vêtue d’un fin lin qui représente les œuvres justes des saints, est l’épouse de l’Agneau.',
    },
  },
  perspectives: {
    'marriage:ps:sacrament': {
      question: 'Le mariage est-il un sacrement ?',
      intro:
        'Tous les chrétiens honorent le mariage comme institué par Dieu et béni par le Christ. Ils divergent sur la question de savoir s’il est un sacrement au même sens que le baptême et l’eucharistie (la cène) — un rite par lequel Dieu donne la grâce. Beaucoup dépend d’Éphésiens 5.32, où Paul appelle l’union en une seule chair un grand mystère (en grec mystērion), rendu par sacramentum dans la Vulgate latine.',
      commonGround:
        'Les trois traditions fondent le mariage sur son institution par Dieu à la création et sur l’enseignement du Christ (Gn 2.24 ; Mt 19.4–6), le disent saint et y voient une image de l’amour du Christ pour l’Église (Ep 5.25–32).',
      perspectives: {
        'marriage:ps:sacrament:catholic': {
          tradition: 'Catholique',
          label: 'L’un des sept sacrements',
          summary:
            'Le concile de Trente a enseigné que le Christ a mérité par sa passion la grâce qui perfectionne l’amour naturel, affermit l’union indissoluble et sanctifie les époux, en renvoyant aux paroles de Paul sur le Christ et l’Église (Ep 5.25, 32). Parce que le mariage, sous la loi évangélique, l’emporte en grâce sur les mariages d’autrefois, les Pères, les conciles et la tradition l’ont toujours compté parmi les sacrements ; Trente a condamné l’opinion selon laquelle le mariage ne serait pas véritablement l’un des sept sacrements institués par le Christ et ne conférerait pas la grâce (session XXIV, doctrine et canon 1).',
        },
        'marriage:ps:sacrament:orthodox': {
          tradition: 'Orthodoxe',
          label: 'Un saint mystère de l’Église',
          summary:
            'La Confession de Dosithée compte le mariage parmi les sept mystères de l’Église : le Christ l’a scellé lorsqu’il a interdit de séparer ceux que Dieu a unis, et l’Apôtre l’appelle un grand mystère (Décret XV ; Mt 19.6 ; Ep 5.32). La catéchèse orthodoxe décrit ce sacrement comme le don du Saint-Esprit, afin que l’amour d’un couple trouve son accomplissement dans le Royaume de Dieu ; les époux sont couronnés, et le rite n’est pas un contrat juridique et ne comporte pas de vœux (Orthodox Church in America).',
        },
        'marriage:ps:sacrament:protestant': {
          tradition: 'Protestante (réformée, méthodiste, luthérienne)',
          label: 'Une sainte ordonnance, non un sacrement de l’Évangile',
          summary:
            'La Confession de Westminster ne reconnaît que deux sacrements institués par le Christ, le baptême et la cène (27.4), et présente le mariage comme une ordonnance de Dieu pour l’aide mutuelle, l’accroissement du genre humain et la prévention de l’impureté (24.2). Les Articles méthodistes (issus des Articles anglicans) ne comptent pas le mariage parmi les sacrements de l’Évangile et le rangent parmi des rites nés en partie d’une imitation corrompue des apôtres et qui sont en partie « states of life allowed in the Scriptures » (des états de vie permis par les Écritures ; art. XVI). L’Apologie de Melanchthon note que le mariage a été institué à la création et possède le commandement et les promesses de Dieu pour cette vie corporelle ; si l’on veut l’appeler sacrement, il faut encore le distinguer des signes du Nouveau Testament (art. XIII).',
        },
      },
    },
  },
  suggestedQuestions: [
    'Quel est le mot hébreu derrière « aide » ?',
    'Qu’a enseigné Jésus sur le divorce ?',
    'Comment Paul relie-t-il le mariage au Christ et à l’Église ?',
    'Le mariage est-il un sacrement ?',
    'Que dit la Bible sur le célibat ?',
  ],
};

export default overlay;
