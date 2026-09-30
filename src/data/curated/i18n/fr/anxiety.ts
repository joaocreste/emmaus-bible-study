/**
 * Français overlay for the topic "anxiety". The English module (src/data/curated/topics/anxiety.ts)
 * stays the source of truth for ids, references and citations.
 */
import type { TopicOverlay } from '../types';

const overlay: TopicOverlay = {
  topicId: 'anxiety',
  locale: 'fr',
  name: 'Anxiété et inquiétude',
  aliases: [
    'anxiété',
    'anxieux',
    'anxieuse',
    'inquiétude',
    'inquiétudes',
    'inquiet',
    'inquiète',
    's’inquiéter',
    "s'inquiéter",
    'ne vous inquiétez pas',
    'ne vous inquiétez de rien',
    'ne t’inquiète pas',
    "ne t'inquiète pas",
    'souci',
    'soucis',
    'se faire du souci',
    'peur',
    'crainte',
    'avoir peur',
    'angoisse',
    'angoissé',
    'angoissée',
    'stress',
    'stressé',
    'stressée',
    'panique',
    'nervosité',
    'débordé',
    'dépassé par les événements',
    'déchargez-vous sur lui de tous vos soucis',
    'paix intérieure',
    'que dit la bible sur l’anxiété',
    "que dit la bible sur l'anxiété",
    'que dit la bible sur l’inquiétude',
    "que dit la bible sur l'inquiétude",
    'que dit la bible sur la peur',
  ],
  question: 'Que dit la Bible sur l’anxiété ?',
  definition:
    'La Bible parle souvent, et avec douceur, aux personnes anxieuses. Jésus dit à ses disciples de ne pas s’inquiéter de la nourriture, du vêtement ou du lendemain — non que leurs besoins soient irréels, mais parce que le Père les connaît et prend soin même des oiseaux et des fleurs (Mt 6.25–34). Paul transforme l’anxiété en prière accompagnée d’actions de grâces et promet la paix de Dieu qui garde les cœurs (Ph 4.6–7) ; Pierre invite à se décharger sur Dieu de tout souci, parce qu’il prend soin de nous (1 P 5.7). Les mots grecs rendus par « s’inquiéter » ou « souci » (merimnaō, merimna) peuvent aussi désigner une juste sollicitude : Paul les emploie pour son souci des Églises et pour la sollicitude de Timothée envers les Philippiens (2 Co 11.28 ; Ph 2.20). L’Écriture vise donc la méfiance anxieuse, non la sollicitude elle-même, et elle donne des mots pour dire le désespoir et la peur (Ps 42 ; 56.3–4). Elle note même que l’inquiétude abat le cœur et qu’une bonne parole le réjouit (Pr 12.25).',
  keyPassages: {
    'anxiety:kp:1': {
      title: 'Ne vous inquiétez pas du lendemain',
      group: 'Jésus et l’inquiétude',
      note: 'Montrant les oiseaux du ciel et les lis des champs, Jésus raisonne du soin que Dieu prend des petites choses au soin qu’il prend de ses enfants, et il réoriente le cœur vers la recherche première du royaume de Dieu et de sa justice.',
    },
    'anxiety:kp:2': {
      title: 'Marthe, Marthe',
      group: 'Jésus et l’inquiétude',
      note: 'Jésus dit avec douceur à une hôtesse affairée et distraite qu’elle s’inquiète et s’agite pour beaucoup de choses, alors qu’une seule est nécessaire — Marie a choisi de s’asseoir à ses pieds pour l’écouter.',
    },
    'anxiety:kp:3': {
      title: 'Je vous donne ma paix',
      group: 'Jésus et l’inquiétude',
      note: 'La veille de sa mort, Jésus promet l’Esprit et donne à ses disciples sa propre paix, différente de celle du monde, en leur disant de ne pas laisser leur cœur se troubler ni s’alarmer.',
    },
    'anxiety:kp:4': {
      title: 'Venez à moi, et je vous donnerai du repos',
      group: 'Jésus et l’inquiétude',
      note: 'Jésus invite ceux qui sont fatigués et chargés à prendre son joug, qui est doux, et à se mettre à son école, en leur promettant le repos pour leurs âmes.',
    },
    'anxiety:kp:5': {
      title: 'Ne vous inquiétez de rien',
      group: 'Se décharger de ses soucis sur Dieu',
      note: 'Écrivant dans les chaînes (1.13), Paul associe la joie à la prière et à l’action de grâces, promet que la paix de Dieu gardera les cœurs et les pensées, et oriente la pensée vers tout ce qui est vrai, honorable et bon.',
    },
    'anxiety:kp:6': {
      title: 'Déchargez-vous sur lui de tous vos soucis',
      group: 'Se décharger de ses soucis sur Dieu',
      note: 'S’humilier sous la puissante main de Dieu, c’est aussi rejeter sur lui ses inquiétudes, parce qu’il prend soin de nous.',
    },
    'anxiety:kp:7': {
      title: 'Remets ton sort à l’Éternel',
      group: 'Se décharger de ses soucis sur Dieu',
      note: 'Dans un psaume où il se dit trahi par un ami intime (55.12–14), le psalmiste exhorte à remettre son fardeau à l’Éternel, qui soutient le juste.',
    },
    'anxiety:kp:8': {
      title: 'Quand l’inquiétude m’envahit',
      group: 'Se décharger de ses soucis sur Dieu',
      note: 'Le psalmiste reconnaît que l’inquiétude le submerge, et découvre que les consolations de Dieu réjouissent son âme.',
    },
    'anxiety:kp:9': {
      title: 'Pourquoi t’abats-tu, mon âme ?',
      group: 'Peur avouée et présence de Dieu',
      note: 'Un psaume de désir et de découragement qui dialogue avec lui-même : le psalmiste, assoiffé de Dieu et en butte aux railleries, nomme honnêtement son désespoir et ne cesse de dire à son âme d’espérer en Dieu.',
    },
    'anxiety:kp:10': {
      title: 'Quand je suis dans la crainte',
      group: 'Peur avouée et présence de Dieu',
      note: 'La peur et la confiance coexistent : quand il a peur, le psalmiste choisit de se confier en Dieu et en sa parole.',
    },
    'anxiety:kp:11': {
      title: 'Ne crains rien, car je suis avec toi',
      group: 'Peur avouée et présence de Dieu',
      note: 'L’ordre divin de ne pas craindre repose sur la présence de Dieu et sur sa promesse de fortifier, de secourir et de soutenir son peuple.',
    },
    'anxiety:kp:12': {
      title: 'Élie sous le genêt',
      group: 'Peur avouée et présence de Dieu',
      note: 'Menacé par Jézabel, Élie, effrayé et épuisé, s’enfuit et demande à mourir. Il s’endort, et un ange le réveille en le touchant et lui donne à manger et à boire, par deux fois, avant qu’il ne reparte, fortifié pour la route.',
    },
  },
  suggestedQuestions: [
    'Que signifie le mot grec merimnaō ?',
    'L’inquiétude est-elle un péché ?',
    'Que voulait dire Jésus par « Ne vous inquiétez donc pas du lendemain » ?',
    'Comment prier quand je suis anxieux ?',
    'Montrez-moi des psaumes pour les moments de peur.',
  ],
};

export default overlay;
