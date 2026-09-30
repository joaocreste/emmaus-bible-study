/**
 * Français overlay for the topic "justification". The English module (src/data/curated/topics/justification.ts)
 * stays the source of truth for ids, references and citations.
 */
import type { TopicOverlay } from '../types';

const overlay: TopicOverlay = {
  topicId: 'justification',
  locale: 'fr',
  name: 'Justification',
  aliases: [
    'justification',
    'la justification',
    'justifié',
    'justifiés',
    'justifier',
    'justification par la foi',
    'justifié par la foi',
    'justifiés par la foi',
    'justification par la foi seule',
    'la foi seule',
    'justice imputée',
    'imputation',
    'déclaré juste',
    'justice de dieu',
    'la justice de dieu',
    'être juste devant dieu',
    'comment être juste devant dieu',
    'nouvelle perspective sur paul',
    'nouvelle perspective',
  ],
  question: 'Que signifie la justification selon la Bible ?',
  definition:
    'La justification est l’acte par lequel Dieu met une personne dans une juste relation avec lui. Dans le Nouveau Testament, le verbe grec dikaioō signifie avant tout déclarer ou prononcer juste, comme le fait un juge. Ses racines dans l’Ancien Testament sont Abraham, dont Dieu a compté la confiance comme justice (Gn 15.6), et la parole prophétique selon laquelle le juste vivra par la foi (Ha 2.4). L’affirmation centrale de Paul se trouve en Romains 3.21–26 : la justice de Dieu est manifestée sans la loi, par la foi en Jésus-Christ ; les pécheurs sont justifiés gratuitement par sa grâce, par le moyen de la rédemption qui est en Christ, que Dieu a présenté comme sacrifice expiatoire, de sorte que Dieu est à la fois juste et celui qui justifie. La justification apporte la paix avec Dieu (Rm 5.1), et Jacques insiste sur le fait que la foi qui justifie n’est jamais stérile (Jc 2.14–26). Les chrétiens divergent sur la question de savoir si la justification consiste en ce seul verdict ou si elle inclut aussi un renouvellement intérieur.',
  keyPassages: {
    'justification:kp:1': {
      title: 'Abram eut confiance en l’Éternel',
      group: 'Comptés justes',
      note: 'La confiance d’Abram dans la promesse de Dieu lui est comptée comme justice — le verset dont Paul fait le modèle de la justification (Rm 4.3 ; Ga 3.6).',
    },
    'justification:kp:2': {
      title: 'Le péché non imputé',
      group: 'Comptés justes',
      note: 'La béatitude de David sur ceux dont les péchés sont pardonnés et à qui l’Éternel n’impute pas l’iniquité est le second témoin de Paul en faveur d’une justification sans les œuvres (Rm 4.6–8).',
    },
    'justification:kp:3': {
      title: 'Le juste vivra par sa foi',
      group: 'Comptés justes',
      note: 'Habacuc oppose l’orgueilleux au juste qui vit par sa fidélité ; Paul cite cette ligne en Romains 1.17 et en Galates 3.11.',
    },
    'justification:kp:4': {
      title: 'Les vêtements sales ôtés',
      group: 'Comptés justes',
      note: 'Dans la vision de Zacharie, l’Éternel réprimande l’accusateur, dépouille le grand prêtre de ses vêtements sales et le revêt d’habits de fête, en disant qu’il a enlevé son iniquité — une image saisissante de la culpabilité ôtée par Dieu.',
    },
    'justification:kp:5': {
      title: 'La justice de Dieu manifestée',
      group: 'Justifiés par la foi en Christ',
      note: 'Sans la loi, la justice de Dieu vient par la foi en Jésus-Christ pour tous ceux qui croient. Les pécheurs sont justifiés gratuitement par sa grâce, au moyen du sacrifice expiatoire du Christ, qui montre que Dieu est à la fois juste et celui qui justifie, et qui ne laisse aucune place à l’orgueil.',
    },
    'justification:kp:6': {
      title: 'Abraham et David',
      group: 'Justifiés par la foi en Christ',
      note: 'Paul soutient qu’Abraham n’a pas été justifié par les œuvres et que Dieu justifie l’impie qui se confie en lui, en lui imputant la justice sans les œuvres.',
    },
    'justification:kp:7': {
      title: 'La paix avec Dieu',
      group: 'Justifiés par la foi en Christ',
      note: 'Justifiés par la foi, les croyants ont la paix avec Dieu, l’accès à la grâce et l’espérance de la gloire ; justifiés par le sang du Christ, ils seront sauvés par lui de la colère.',
    },
    'justification:kp:8': {
      title: 'Non par les œuvres de la loi',
      group: 'Justifiés par la foi en Christ',
      note: 'Après avoir résisté à Pierre, qui s’était retiré de la table commune avec les non-Juifs (2.11–14), Paul affirme que Juifs et non-Juifs sont pareillement justifiés par la foi en Christ, et non par les œuvres de la loi.',
    },
    'justification:kp:9': {
      title: 'Non avec ma propre justice',
      group: 'Justifiés par la foi en Christ',
      note: 'Paul regarde ses anciens titres comme une perte afin d’être trouvé en Christ, non avec une justice qui lui serait propre et viendrait de la loi, mais avec la justice qui vient de Dieu par la foi.',
    },
    'justification:kp:10': {
      title: 'Devenir en lui justice de Dieu',
      group: 'Justifiés par la foi en Christ',
      note: 'Dieu a réconcilié le monde avec lui-même en Christ, sans imputer aux hommes leurs offenses, et il a fait devenir péché pour nous celui qui n’a point connu le péché, afin que nous devenions en lui justice de Dieu.',
    },
    'justification:kp:11': {
      title: 'La foi et les œuvres',
      group: 'Une foi qui n’est jamais seule',
      note: 'Jacques s’oppose à une foi morte, purement verbale : la foi d’Abraham agissait avec ses œuvres et fut rendue parfaite par elles. Les chrétiens concilient Jacques et Paul de différentes manières, mais tous deux décrivent une foi vivante.',
    },
    'justification:kp:12': {
      title: 'Le publicain redescendit justifié',
      group: 'Une foi qui n’est jamais seule',
      note: 'Jésus déclare justifié non le pharisien sûr de lui, mais le publicain qui se frappait la poitrine en implorant la miséricorde.',
    },
  },
  perspectives: {
    'justification:ps:nature': {
      question:
        'Que se passe-t-il quand Dieu justifie un pécheur — un statut déclaré, un renouvellement intérieur, ou la reconnaissance comme membre du peuple de Dieu ?',
      intro:
        'La justification a été l’un des débats centraux de la Réforme. Catholiques et protestants enseignent les uns comme les autres que la justification est l’œuvre de la grâce de Dieu en Christ, reçue par la foi et jamais méritée, mais ils divergent sur sa nature. Depuis la fin du XXe siècle, la « nouvelle perspective sur Paul », associée à E. P. Sanders et J. D. G. Dunn, a renouvelé les termes du débat ; N. T. Wright en est une voix éminente, bien qu’il se dise en désaccord avec la plupart de ceux qui partagent cette étiquette. En 1999, la Fédération luthérienne mondiale et l’Église catholique ont signé une Déclaration commune qui consigne un consensus sur des vérités fondamentales tout en reconnaissant des différences persistantes.',
      commonGround:
        'Dans la Déclaration commune de 1999, la Fédération luthérienne mondiale et l’Église catholique ont confessé ensemble que la justification est l’œuvre du Dieu trinitaire : les pécheurs sont acceptés non en raison d’un quelconque mérite de leur part, mais par grâce, par la foi en l’œuvre du Christ, et ils reçoivent l’Esprit Saint, qui renouvelle leur cœur et les conduit aux bonnes œuvres (§15). Elles ont estimé que l’enseignement luthérien présenté dans ce texte ne tombe pas sous les condamnations de Trente, ni l’enseignement catholique sous les condamnations luthériennes (§41), tout en nommant des questions qui demandent encore à être clarifiées (§43). Les communions mondiales méthodiste (2006), anglicane (2016) et réformée (2017) y ont ensuite souscrit ; les Églises luthériennes et réformées extérieures à ces communions n’y sont pas parties.',
      perspectives: {
        'justification:ps:nature:reformation': {
          tradition: 'Luthérienne et réformée',
          label: 'La justice imputée par la foi seule',
          summary:
            'Les hommes ne peuvent être justifiés devant Dieu par leurs propres forces, mérites ou œuvres, mais ils sont justifiés gratuitement à cause du Christ, par la foi, lorsqu’ils croient que leurs péchés leur sont pardonnés à cause de lui ; cette foi, Dieu la compte comme justice (Confession d’Augsbourg, art. IV). La Confession de Westminster précise que ce qui est imputé n’est pas la foi elle-même, l’acte de croire, mais l’obéissance et la satisfaction du Christ, que la foi reçoit : Dieu justifie non en infusant la justice aux pécheurs, mais en pardonnant leurs péchés et en les acceptant comme justes à cause du Christ seul. La foi est l’unique instrument de la justification, et pourtant elle n’est jamais seule chez la personne justifiée, mais agit par l’amour (Westminster 11.1–2).',
        },
        'justification:ps:nature:catholic': {
          tradition: 'Catholique',
          label: 'La justification inclut un renouvellement intérieur',
          summary:
            'La justification n’est pas seulement la rémission des péchés, mais aussi la sanctification et le renouvellement de l’homme intérieur par l’acceptation volontaire de la grâce. La passion du Christ en est la cause méritoire ; sa cause formelle est la justice de Dieu par laquelle il nous rend justes, de sorte que nous ne sommes pas seulement réputés justes, mais le sommes vraiment, la charité étant répandue dans nos cœurs par le Saint-Esprit (Trente, session VI, ch. 7). Le concile de Trente a donc rejeté la justification par la seule imputation de la justice du Christ à l’exclusion de la grâce et de la charité inhérentes (canon 11), et enseigné que la justice reçue s’accroît par les bonnes œuvres (canon 24).',
        },
        'justification:ps:nature:new-perspective': {
          tradition: 'Nouvelle perspective sur Paul (N. T. Wright)',
          label: 'Le verdict de Dieu : une personne appartient à la famille de son alliance',
          summary:
            'Wright comprend « la justice de Dieu » comme la fidélité de Dieu à sa propre alliance. La justification est la déclaration de Dieu selon laquelle une personne est dans son droit — ses péchés sont pardonnés et elle appartient à l’unique famille promise à Abraham. Le verdict présent, prononcé en faveur de ceux qui croient que Jésus est Seigneur et que Dieu l’a ressuscité, anticipe le verdict futur, qui, selon Wright, sera rendu sur la base de toute la vie vécue dans la puissance de l’Esprit. Wright admet que Dieu compte la justice aux croyants, mais nie qu’il s’agisse de la justice propre du Christ ; l’union au Christ remplit la fonction traditionnellement attribuée à l’imputation. Parce que la justification concerne l’appartenance, Wright la qualifie de doctrine œcuménique : en Galates 2, il s’agit de croyants juifs et non juifs partageant une même table (Ga 2.11–21 ; Rm 3.29).',
        },
      },
    },
  },
  suggestedQuestions: [
    'Quel est le mot grec derrière « justifié » ?',
    'Comment accorder Paul et Jacques sur la justification ?',
    'Qu’est-ce que la justice imputée ?',
    'Qu’est-ce que la nouvelle perspective sur Paul ?',
    'Existe-t-il différentes interprétations théologiques de la justification ?',
  ],
};

export default overlay;
