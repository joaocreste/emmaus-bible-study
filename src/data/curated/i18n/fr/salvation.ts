/**
 * Français overlay for the topic "salvation". The English module (src/data/curated/topics/salvation.ts)
 * stays the source of truth for ids, references and citations. Scripture quoted in prose follows LSG.
 */
import type { TopicOverlay } from '../types';

const overlay: TopicOverlay = {
  topicId: 'salvation',
  locale: 'fr',
  name: 'Le salut',
  aliases: [
    'salut',
    'le salut',
    'sauvé',
    'sauvés',
    'être sauvé',
    'comment être sauvé',
    'comment puis-je être sauvé',
    'que dois-je faire pour être sauvé',
    'que faut-il que je fasse pour être sauvé',
    'sauveur',
    'rédemption',
    'sotériologie',
    'peut-on perdre son salut',
    'le salut peut-il se perdre',
    'perdre son salut',
    'une fois sauvé toujours sauvé',
    'sécurité éternelle',
    'persévérance des saints',
    'apostasie',
    'abandonner la foi',
  ],
  question: 'Que dit la Bible sur le salut ?',
  definition:
    'Dans l’Écriture, le salut est la délivrance que Dieu accorde à son peuple — délivrance des ennemis, du péché et de son jugement, et finalement de la mort. L’Ancien Testament célèbre l’Éternel comme celui qui sauve, comme à la mer Rouge (Ex 14.13, 30), et les prophètes proclament que le salut vient de lui et qu’il est offert à toutes les extrémités de la terre (Jon 2.9 ; Es 45.22). Le Nouveau Testament le centre sur Jésus : il n’y a de salut en aucun autre nom (Ac 4.12), et quiconque le confesse comme Seigneur et croit que Dieu l’a ressuscité sera sauvé (Rm 10.9–13). Dieu sauve par miséricorde, non à cause des œuvres de justice que nous aurions faites (Tt 3.4–7). Le salut se conjugue aussi à plusieurs temps : les croyants ont été sauvés, sont en train d’être sauvés, et attendent un salut prêt à être révélé (Ep 2.8 ; 1 Co 1.18 ; 1 P 1.5).',
  keyPassages: {
    'salvation:kp:1': {
      title: 'Le salut à la mer Rouge',
      group: 'Le Dieu qui sauve',
      note: 'Acculé à la mer Rouge, Israël reçoit l’ordre de rester ferme et de regarder la délivrance que l’Éternel va accomplir. Dieu combat pour son peuple et le fait passer à pied sec, et le peuple craint l’Éternel et croit.',
    },
    'salvation:kp:2': {
      title: 'Tournez-vous vers moi, et soyez sauvés',
      group: 'Le Dieu qui sauve',
      note: 'Le seul vrai Dieu appelle toutes les extrémités de la terre à se tourner vers lui pour être sauvées, car il n’y a point d’autre Dieu.',
    },
    'salvation:kp:3': {
      title: 'Le salut vient de l’Éternel',
      group: 'Le Dieu qui sauve',
      note: 'Du ventre du grand poisson, Jonas achève sa prière en confessant que la délivrance appartient à Dieu seul.',
    },
    'salvation:kp:4': {
      title: 'Blessé pour nos péchés',
      group: 'Le Dieu qui sauve',
      note: 'Le Serviteur porte les péchés d’un peuple égaré comme des brebis, et ses meurtrissures lui apportent la guérison. Le Nouveau Testament lit ce chapitre comme parlant de Jésus (Ac 8.32–35 ; 1 P 2.24–25).',
    },
    'salvation:kp:5': {
      title: 'Confesser et croire',
      group: 'Sauvés par Christ',
      note: 'Le résumé de Paul : si tu confesses Jésus comme Seigneur et si tu crois que Dieu l’a ressuscité, tu seras sauvé. La promesse vaut pour le Juif comme pour le Grec, car quiconque invoquera le nom du Seigneur sera sauvé (citation de Joël 2.32).',
    },
    'salvation:kp:6': {
      title: 'Aucun autre nom',
      group: 'Sauvés par Christ',
      note: 'Interrogé par les chefs, les anciens et les scribes de Jérusalem, en présence du grand prêtre et de sa famille (Ac 4.5–8), Pierre déclare que le salut ne se trouve en aucun autre qu’en Jésus.',
    },
    'salvation:kp:7': {
      title: 'Que faut-il que je fasse pour être sauvé ?',
      group: 'Sauvés par Christ',
      note: 'La question d’un geôlier bouleversé reçoit de Paul et de Silas une réponse simple : crois au Seigneur Jésus.',
    },
    'salvation:kp:8': {
      title: 'Non par les œuvres, mais selon sa miséricorde',
      group: 'Sauvés par Christ',
      note: 'Dieu notre Sauveur nous a sauvés non à cause des œuvres de justice que nous aurions faites, mais selon sa miséricorde, par la nouvelle naissance et le renouvellement du Saint-Esprit, afin que, justifiés par sa grâce, nous devenions héritiers de la vie éternelle.',
    },
    'salvation:kp:9': {
      title: 'Dieu a envoyé son Fils pour sauver',
      group: 'Sauvés par Christ',
      note: 'L’amour de Dieu donne son Fils afin que les croyants aient la vie éternelle ; le Fils n’est pas venu pour condamner le monde, mais pour le sauver.',
    },
    'salvation:kp:10': {
      title: 'Travaillez à votre salut',
      group: 'Sauvés, en voie de salut, dans l’attente du salut',
      note: 'Les croyants doivent travailler à leur salut avec crainte et tremblement précisément parce que Dieu agit en eux, produisant le vouloir et le faire selon son bon plaisir.',
    },
    'salvation:kp:11': {
      title: 'Gardés pour un salut prêt à être révélé',
      group: 'Sauvés, en voie de salut, dans l’attente du salut',
      note: 'Dieu nous a fait naître de nouveau pour une espérance vivante et garde les croyants par la foi pour le salut qui sera révélé dans les derniers temps.',
    },
    'salvation:kp:12': {
      title: 'Sauvés par sa vie',
      group: 'Sauvés, en voie de salut, dans l’attente du salut',
      note: 'Paul raisonne du plus au moins : si Christ est mort pour nous alors que nous étions pécheurs et ennemis, à plus forte raison, maintenant réconciliés, serons-nous sauvés par lui de la colère.',
    },
  },
  perspectives: {
    'salvation:ps:perseverance': {
      question: 'Quelqu’un qui est vraiment sauvé peut-il perdre son salut ?',
      intro:
        'Toutes les traditions présentées ci-dessous confessent que le salut est l’œuvre de la grâce de Dieu en Christ et que les croyants doivent persévérer dans la foi. Elles divergent sur la question de savoir si une personne véritablement justifiée peut finalement déchoir, et sur la manière dont les avertissements de l’Écriture (He 6.4–6 ; 10.26–29) s’articulent avec ses promesses que Dieu garde son peuple (Jn 10.27–29 ; Ph 1.6).',
      commonGround:
        'Tous reconnaissent que le salut est le don de Dieu en Christ, que les croyants doivent persévérer dans la foi, que le péché grave blesse le croyant et attriste l’Esprit, et que ceux qui sont tombés peuvent être restaurés par la repentance.',
      perspectives: {
        'salvation:ps:perseverance:reformed': {
          tradition: 'Réformée',
          label: 'La persévérance des saints',
          summary:
            'Ceux que Dieu a efficacement appelés et sanctifiés ne peuvent déchoir de la grâce ni totalement ni définitivement ; ils persévéreront certainement jusqu’à la fin. Cela repose non sur leur libre arbitre, mais sur l’élection immuable de Dieu, sur le mérite et l’intercession du Christ et sur l’Esprit qui demeure en eux (Westminster 17.1–2). De vrais croyants peuvent tomber pour un temps dans des péchés graves, attrister l’Esprit et perdre le sentiment de la grâce, mais Dieu les renouvelle dans la repentance et ne les laisse pas perdre l’adoption et la justification (Westminster 17.3 ; Dordrecht V.4–8). Dieu préserve son peuple par des moyens, dont les exhortations, les menaces et les promesses de la Parole (Dordrecht V.14).',
        },
        'salvation:ps:perseverance:wesleyan': {
          tradition: 'Arminienne / wesleyenne',
          label: 'Les croyants peuvent déchoir',
          summary:
            'On peut résister à la grâce (Remontrance, art. 4), et les wesleyens tiennent qu’on peut aussi la perdre. Les Remontrants de 1610 affirmaient que le Christ garde de la chute ceux qui sont prêts au combat et recherchent son aide, mais laissaient ouverte la question de savoir si les croyants pouvaient, par négligence, abandonner leur vie en Christ (art. 5). Arminius lui-même avait déclaré n’avoir jamais enseigné qu’un vrai croyant puisse déchoir totalement ou définitivement, bien que certains passages de l’Écriture lui aient semblé aller dans ce sens (Declaration of Sentiments, 1608). Les Articles de religion méthodistes enseignent qu’après avoir reçu le Saint-Esprit, nous pouvons nous éloigner de la grâce reçue et tomber dans le péché, puis, par la grâce de Dieu, nous relever (art. XII). Le commentateur méthodiste Adam Clarke lisait Hébreux 6 comme montrant que l’apostasie est possible même à partir des plus hauts degrés de la grâce, de sorte que les avertissements sont réels — tout en soulignant que ce passage ne vise pas les rétrogrades qui se confient encore dans le Christ.',
        },
        'salvation:ps:perseverance:catholic': {
          tradition: 'Catholique',
          label: 'La grâce se perd par le péché mortel et se recouvre par la pénitence',
          summary:
            'La grâce de la justification se perd non seulement par l’incrédulité, mais par tout péché mortel, même lorsque la foi demeure (Trente, session VI, ch. 15). Ceux qui sont tombés peuvent être de nouveau justifiés par le sacrement de pénitence, que les Pères ont appelé une seconde planche après le naufrage de la grâce (ch. 14). Nul ne doit se promettre la persévérance finale avec une certitude absolue en dehors d’une révélation spéciale, mais tous doivent placer une espérance très ferme en Dieu, qui achèvera l’œuvre bonne qu’il a commencée, à moins que les hommes ne manquent à sa grâce (ch. 13 ; canons 16, 23).',
        },
        'salvation:ps:perseverance:lutheran': {
          tradition: 'Luthérienne',
          label: 'L’Esprit peut être perdu ; les pénitents sont restaurés',
          summary:
            'La Confession d’Augsbourg condamne ceux qui nient que des personnes une fois justifiées puissent perdre le Saint-Esprit, et enseigne que quiconque tombe après le baptême reçoit le pardon chaque fois qu’il revient par la repentance (art. XII). En même temps, la Formule de Concorde présente l’élection en Christ comme une ferme consolation : nul ne peut arracher les élus de Dieu de la main du Christ, et les croyants doivent chercher l’assurance dans l’Évangile et les sacrements plutôt que dans le conseil caché de Dieu (Épitomé XI).',
        },
      },
    },
  },
  suggestedQuestions: [
    'Que dois-je faire pour être sauvé ?',
    'Un chrétien peut-il perdre son salut ?',
    'Comment les passages d’avertissement s’accordent-ils avec la promesse de Dieu de garder son peuple ?',
    'Que signifie « travaillez à votre salut » ?',
    'Le salut est-il passé, présent ou futur ?',
    'Quel est le mot grec derrière « sauvé » ?',
  ],
};

export default overlay;
