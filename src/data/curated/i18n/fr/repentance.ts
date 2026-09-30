/**
 * Français overlay for the topic "repentance". The English module (src/data/curated/topics/repentance.ts)
 * stays the source of truth for ids, references and citations. Scripture quoted in prose follows LSG.
 */
import type { TopicOverlay } from '../types';

const overlay: TopicOverlay = {
  topicId: 'repentance',
  locale: 'fr',
  name: 'Repentance',
  aliases: [
    'repentance',
    'la repentance',
    'repentir',
    'se repentir',
    'repentant',
    'qu’est-ce que la repentance',
    "qu'est-ce que la repentance",
    'que veut dire se repentir',
    'que signifie se repentir',
    'comment se repentir',
    'revenir à dieu',
    'se tourner vers dieu',
    'retourner à dieu',
    'revenir au seigneur',
    'confesser mes péchés',
    'confession des péchés',
    'tristesse selon dieu',
    'contrition',
    'conversion',
    'se convertir',
    'rechute',
    'le fils prodigue',
    'fils prodigue',
  ],
  question: 'Que signifie la repentance selon la Bible ?',
  definition:
    'La repentance est un retournement de tout l’être, qui se détourne du péché pour se tourner vers Dieu. Le verbe hébreu central, shuv, signifie se retourner ou revenir ; les prophètes appellent Israël à revenir à l’Éternel de tout son cœur, en se fiant à sa miséricorde (Jl 2.12–13 ; Es 55.6–7 ; Ez 18.30–32). Les termes néotestamentaires metanoeō et metanoia peuvent signifier un changement d’avis, mais ils désignent presque toujours le fait de se détourner du péché dans une vie transformée ; il ne faut donc pas en presser l’étymologie. La première prédication de Jésus unit la repentance à la foi en l’Évangile (Mc 1.15). La repentance est plus qu’un regret : Paul distingue la tristesse selon Dieu, qui mène au salut, de la tristesse du monde, qui produit la mort (2 Co 7.10), et Jean-Baptiste demande des fruits dignes de la repentance (Lc 3.8–14). La bonté de Dieu pousse à la repentance (Rm 2.4), et le ciel se réjouit pour chaque pécheur qui se repent (Lc 15.7, 10).',
  keyPassages: {
    'repentance:kp:1': {
      title: 'Crée en moi un cœur pur',
      group: 'Revenir à l’Éternel',
      note: 'D’après sa suscription, David pria ce psaume après que Nathan l’eut confronté au sujet de Bath-Schéba. C’est un modèle de repentance : aveu sincère, appel à la miséricorde de Dieu, supplication pour un cœur nouveau — et l’assurance que Dieu ne dédaigne pas un cœur brisé et contrit.',
    },
    'repentance:kp:2': {
      title: 'Tu es cet homme-là !',
      group: 'Revenir à l’Éternel',
      note: 'La parabole de Nathan sur la brebis volée dévoile le péché de David contre Urie. David confesse qu’il a péché contre l’Éternel, et Nathan lui annonce que l’Éternel a ôté son péché.',
    },
    'repentance:kp:3': {
      title: 'Déchirez vos cœurs',
      group: 'Revenir à l’Éternel',
      note: 'Dieu appelle son peuple à revenir à lui de tout son cœur — à déchirer leurs cœurs et non leurs vêtements —, car il est compatissant, miséricordieux et riche en bonté.',
    },
    'repentance:kp:4': {
      title: 'Convertissez-vous, et vivez',
      group: 'Revenir à l’Éternel',
      note: 'Dieu presse Israël de se détourner de toutes ses transgressions et de se faire un cœur nouveau et un esprit nouveau, car il ne prend pas plaisir à la mort de qui que ce soit.',
    },
    'repentance:kp:5': {
      title: 'Ninive se détourne du mal',
      group: 'Revenir à l’Éternel',
      note: 'À l’avertissement de Jonas, la ville entière, du roi au plus humble, jeûne et se détourne de la violence, et Dieu renonce au malheur dont il l’avait menacée.',
    },
    'repentance:kp:6': {
      title: 'Repentez-vous, et croyez',
      group: 'Repentez-vous et croyez',
      note: 'La proclamation inaugurale de Jésus unit la repentance et la foi en l’Évangile comme la réponse à la venue du règne de Dieu.',
    },
    'repentance:kp:7': {
      title: 'La joie dans le ciel',
      group: 'Repentez-vous et croyez',
      note: 'Critiqué parce qu’il accueille les pécheurs, Jésus parle d’un berger et d’une femme qui cherchent ce qui était perdu et se réjouissent de le retrouver — comme le ciel se réjouit pour un seul pécheur qui se repent.',
    },
    'repentance:kp:8': {
      title: 'Le fils prodigue',
      group: 'Repentez-vous et croyez',
      note: 'Un fils qui a tout dilapidé rentre en lui-même et reprend le chemin de la maison avec un aveu tout préparé ; son père court l’embrasser avant qu’il ait pu parler et coupe court à l’aveu avec la robe et l’anneau, et le frère aîné, plein de ressentiment, est lui aussi invité à se réjouir.',
    },
    'repentance:kp:9': {
      title: 'Repentez-vous, et soyez baptisés',
      group: 'Repentez-vous et croyez',
      note: 'Le cœur transpercé par la prédication de Pierre à la Pentecôte, la foule est invitée à se repentir et à être baptisée au nom de Jésus pour le pardon des péchés, et à recevoir le don du Saint-Esprit.',
    },
    'repentance:kp:10': {
      title: 'Dieu appelle tous les hommes, en tous lieux, à se repentir',
      group: 'Repentez-vous et croyez',
      note: 'Devant l’Aréopage d’Athènes, Paul annonce que Dieu appelle désormais tous les hommes à se repentir, parce qu’il a fixé un jour de jugement, attesté en ressuscitant Jésus d’entre les morts.',
    },
    'repentance:kp:11': {
      title: 'Des fruits dignes de la repentance',
      group: 'Les fruits de la repentance',
      note: 'Jean-Baptiste demande des vies changées : partager vêtements et nourriture, ne percevoir que ce qui est dû, ne pas extorquer — des fruits concrets plutôt qu’une ascendance religieuse.',
    },
    'repentance:kp:12': {
      title: 'La tristesse selon Dieu',
      group: 'Les fruits de la repentance',
      note: 'Paul distingue la tristesse qui conduit à la repentance et au salut de la tristesse du monde, qui produit la mort, et décrit l’empressement et le zèle que la tristesse selon Dieu a fait naître chez les Corinthiens.',
    },
  },
  suggestedQuestions: [
    'Quel est le mot hébreu derrière « revenir » dans le Psaume 51 ?',
    'Que signifie metanoia ?',
    'Quelle différence entre la tristesse selon Dieu et la tristesse du monde ?',
    'Qu’enseigne la parabole du fils prodigue sur la repentance ?',
    'En quoi le Psaume 51 est-il un modèle de confession ?',
    'Que sont les « fruits dignes de la repentance » ?',
  ],
};

export default overlay;
