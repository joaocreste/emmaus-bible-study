/**
 * Français overlay for the topic "sin". The English module (src/data/curated/topics/sin.ts)
 * stays the source of truth for ids, references and citations.
 */
import type { TopicOverlay } from '../types';

const overlay: TopicOverlay = {
  topicId: 'sin',
  locale: 'fr',
  name: 'Péché',
  aliases: [
    'péché',
    'le péché',
    'péchés',
    'pécheur',
    'pécheurs',
    'pécher',
    'qu’est-ce que le péché',
    "qu'est-ce que le péché",
    'pourquoi péchons-nous',
    'pourquoi pèche-t-on',
    'péché originel',
    'la chute',
    'chute de l’homme',
    "chute de l'homme",
    'tentation',
    'transgression',
    'iniquité',
    'nature pécheresse',
    'dépravation totale',
    'que dit la bible sur le péché',
  ],
  question: 'Qu’enseigne la Bible sur le péché ?',
  definition:
    'Le péché est le manquement à aimer Dieu et à lui obéir — une révolte contre son autorité légitime, qui abîme toutes les relations. Genèse 3 raconte comment les premiers humains ont douté de la parole de Dieu et ont voulu se faire semblables à Dieu, entraînant la honte, la dissimulation, les accusations et la mort, même si Dieu a aussi promis que la tête du serpent serait écrasée (Gn 3.15). L’Écriture décrit le péché comme la transgression de la loi (1 Jn 3.4), comme une puissance qui asservit (Jn 8.34 ; Rm 6.12–14) et comme ce qui jaillit du cœur (Mc 7.21–23 ; Jr 17.9). Sa portée est universelle : tous ont péché et sont privés de la gloire de Dieu (Rm 3.23), et par un seul homme le péché et la mort se sont étendus à tous (Rm 5.12). Le salaire du péché, c’est la mort, mais le don de Dieu, c’est la vie éternelle en Christ (Rm 6.23), victime expiatoire pour nos péchés (1 Jn 2.2).',
  keyPassages: {
    'sin:kp:1': {
      title: 'La chute',
      group: 'Aux origines du péché',
      note: 'Tentés de douter de la parole de Dieu et de vouloir être comme Dieu, les premiers humains désobéissent. La honte, la dissimulation et les accusations suivent, et la mort fait son entrée — pourtant Dieu les revêt et promet la défaite du serpent (3.15, 21).',
    },
    'sin:kp:2': {
      title: 'Le péché couché à la porte',
      group: 'Aux origines du péché',
      note: 'Dieu avertit Caïn, irrité, que le péché est couché à sa porte et que ses désirs se portent vers lui, mais qu’il doit dominer sur lui ; Caïn tue pourtant son frère.',
    },
    'sin:kp:3': {
      title: 'Toutes les pensées du cœur',
      group: 'Aux origines du péché',
      note: 'Avant le déluge, l’Éternel voit que la méchanceté humaine est devenue totale, atteignant chaque pensée du cœur, en tout temps.',
    },
    'sin:kp:4': {
      title: 'Contre toi seul',
      group: 'Ce qu’est le péché',
      note: 'David confesse son péché comme une révolte contre Dieu, comme une culpabilité qui doit être lavée, et comme une condition qui remonte à sa naissance.',
    },
    'sin:kp:5': {
      title: 'Vos crimes mettent une séparation',
      group: 'Ce qu’est le péché',
      note: 'Le problème n’est pas que Dieu soit trop faible pour sauver ou trop sourd pour entendre, mais que le péché sépare les hommes de lui.',
    },
    'sin:kp:6': {
      title: 'Du cœur de l’homme',
      group: 'Ce qu’est le péché',
      note: 'Jésus situe la souillure non dans les aliments, mais dans le cœur, d’où sortent les mauvaises pensées et les mauvaises actions.',
    },
    'sin:kp:7': {
      title: 'La convoitise conçoit et enfante le péché',
      group: 'Ce qu’est le péché',
      note: 'La tentation ne vient pas de Dieu ; elle est l’attrait de nos propres convoitises, qui enfantent le péché, et le péché, parvenu à son terme, produit la mort.',
    },
    'sin:kp:8': {
      title: 'Il n’y a point de juste',
      group: 'Ce qu’est le péché',
      note: 'En tissant ensemble des lignes des Psaumes et d’Ésaïe (par exemple Ps 14.1–3 ; Es 59.7–8), Paul conclut que Juifs et non-Juifs sont tous sous l’empire du péché, et que la loi donne la connaissance du péché plutôt que la justification.',
    },
    'sin:kp:9': {
      title: 'Adam et Christ',
      group: 'Le règne du péché brisé',
      note: 'Le péché et la mort sont entrés dans le monde par un seul homme ; à bien plus forte raison, la grâce et le don de la justice règnent par un seul homme, Jésus-Christ.',
    },
    'sin:kp:10': {
      title: 'Morts au péché, vivants pour Dieu',
      group: 'Le règne du péché brisé',
      note: 'Unis au Christ dans sa mort et sa résurrection, les croyants ne sont plus esclaves du péché ; ils ne doivent pas le laisser régner, mais s’offrir eux-mêmes à Dieu.',
    },
    'sin:kp:11': {
      title: 'Le Fils vous affranchit',
      group: 'Le règne du péché brisé',
      note: 'Quiconque pèche est esclave du péché, mais le Fils peut rendre réellement libre.',
    },
    'sin:kp:12': {
      title: 'Si quelqu’un a péché',
      group: 'Le règne du péché brisé',
      note: 'Les chrétiens qui nient leur péché se séduisent eux-mêmes ; ceux qui le confessent trouvent le pardon, et ils ont un avocat auprès du Père, Jésus-Christ, victime expiatoire pour les péchés.',
    },
  },
  suggestedQuestions: [
    'Que s’est-il passé lors de la chute, en Genèse 3 ?',
    'Que veut dire Paul quand il affirme que tous ont péché ?',
    'D’où vient la tentation ?',
    'Comment Paul relie-t-il Adam et Christ ?',
    'Comment les chrétiens sont-ils libérés du péché ?',
  ],
};

export default overlay;
