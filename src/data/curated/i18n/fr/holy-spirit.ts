/**
 * Français overlay for the topic "holy-spirit". The English module (src/data/curated/topics/holy-spirit.ts)
 * stays the source of truth for ids, references and citations. Scripture quoted in prose follows LSG;
 * titles of cited works stay as cited.
 */
import type { TopicOverlay } from '../types';

const overlay: TopicOverlay = {
  topicId: 'holy-spirit',
  locale: 'fr',
  name: 'Le Saint-Esprit',
  aliases: [
    'saint-esprit',
    'le saint-esprit',
    'saint esprit',
    'esprit saint',
    'l’esprit saint',
    "l'esprit saint",
    'esprit de dieu',
    'l’esprit de dieu',
    "l'esprit de dieu",
    'qui est le saint-esprit',
    'que fait le saint-esprit',
    'pneumatologie',
    'dons de l’esprit',
    "dons de l'esprit",
    'dons spirituels',
    'fruit de l’esprit',
    "fruit de l'esprit",
    'baptême dans l’esprit',
    "baptême dans l'esprit",
    'baptême du saint-esprit',
    'baptême dans le saint-esprit',
    'rempli de l’esprit',
    "rempli de l'esprit",
    'rempli du saint-esprit',
    'parler en langues',
    'le parler en langues',
    'glossolalie',
    'prophétie aujourd’hui',
    "prophétie aujourd'hui",
    'cessationnisme',
    'continuationnisme',
    'pentecôte',
    'pentecôtiste',
    'charismatique',
    'consolateur',
    'paraclet',
  ],
  question: 'Qui est le Saint-Esprit, et que fait-il ?',
  definition:
    'Le Saint-Esprit est Dieu présent et agissant. L’Esprit se meut au-dessus de la création naissante (Gn 1.2), et les prophètes annoncent un jour où Dieu mettra son Esprit au-dedans de son peuple et le répandra sur toute chair (Ez 36.26–27 ; Jl 2.28–29). L’hébreu rûach et le grec pneuma peuvent signifier vent, souffle ou esprit, et Jésus joue sur cette amplitude (Jn 3.8). Jésus parle de l’Esprit comme d’une personne, un autre Consolateur qui enseigne, rappelle et rend témoignage de lui (Jn 14.16–17, 26 ; 15.26 ; 16.13–15). À la Pentecôte, l’Esprit promis est répandu (Ac 2.1–21). L’Esprit donne la vie nouvelle, assure les croyants qu’ils sont enfants de Dieu, produit le fruit d’amour, de joie et de paix, et distribue des dons pour l’utilité commune (Rm 8.9–17 ; Ga 5.22–23 ; 1 Co 12.4–11).',
  keyPassages: {
    'holy-spirit:kp:1': {
      title: 'L’Esprit se mouvait au-dessus des eaux',
      group: 'L’Esprit promis',
      note: 'Avant même que la première parole de la création ne soit prononcée, l’Esprit de Dieu est présent au-dessus de l’abîme informe et ténébreux.',
    },
    'holy-spirit:kp:2': {
      title: 'Un cœur nouveau et mon Esprit en vous',
      group: 'L’Esprit promis',
      note: 'Dieu promet de remplacer un cœur de pierre par un cœur de chair et de mettre son propre Esprit au-dedans de son peuple, le rendant capable de marcher dans ses voies.',
    },
    'holy-spirit:kp:3': {
      title: 'Sur toute chair',
      group: 'L’Esprit promis',
      note: 'Joël annonce l’Esprit répandu sans distinction d’âge, de sexe ou de condition. Pierre cite ce passage pour expliquer la Pentecôte (Ac 2.16–21).',
    },
    'holy-spirit:kp:4': {
      title: 'Un autre Consolateur',
      group: 'Jésus et le Consolateur',
      note: 'Jésus promet l’Esprit de vérité, qui demeurera éternellement avec ses disciples pour les enseigner et leur rappeler ses paroles, tandis que le Père et le Fils font leur demeure chez ceux qui l’aiment.',
    },
    'holy-spirit:kp:5': {
      title: 'Il vous conduira dans toute la vérité',
      group: 'Jésus et le Consolateur',
      note: 'L’Esprit convainc le monde en ce qui concerne le péché, la justice et le jugement, et il glorifie le Christ en faisant connaître aux disciples ce qui est à lui.',
    },
    'holy-spirit:kp:6': {
      title: 'Vous recevrez une puissance',
      group: 'Jésus et le Consolateur',
      note: 'Jésus ressuscité demande aux disciples d’attendre à Jérusalem la promesse du Père — le baptême du Saint-Esprit —, qui leur donnera la puissance d’être ses témoins jusqu’aux extrémités de la terre.',
    },
    'holy-spirit:kp:7': {
      title: 'La Pentecôte',
      group: 'Jésus et le Consolateur',
      note: 'L’Esprit vient avec le bruit d’un vent et des langues semblables à du feu ; les disciples proclament les merveilles de Dieu dans les langues de nombreuses nations, et Pierre y voit l’accomplissement de la prophétie de Joël.',
    },
    'holy-spirit:kp:8': {
      title: 'La Samarie reçoit l’Esprit',
      group: 'La vie dans l’Esprit',
      note: 'Des croyants baptisés en Samarie ne reçoivent l’Esprit que lorsque Pierre et Jean prient et leur imposent les mains — un épisode au cœur des débats sur la question de savoir si le baptême dans l’Esprit peut suivre la conversion.',
    },
    'holy-spirit:kp:9': {
      title: 'L’Esprit d’adoption',
      group: 'La vie dans l’Esprit',
      note: 'Quiconque appartient au Christ a son Esprit, qui donne la vie aux corps mortels, conduit les enfants de Dieu et rend témoignage à leur esprit qu’ils sont enfants et héritiers de Dieu.',
    },
    'holy-spirit:kp:10': {
      title: 'Le fruit de l’Esprit',
      group: 'La vie dans l’Esprit',
      note: 'Marcher selon l’Esprit s’oppose aux désirs de la chair. Le fruit de l’Esprit, qui commence par l’amour, la joie et la paix, est le caractère transformé qu’il produit chez les croyants.',
    },
    'holy-spirit:kp:11': {
      title: 'Diversité de dons, un seul Esprit',
      group: 'La vie dans l’Esprit',
      note: 'Les différents dons, ministères et opérations viennent tous du même Esprit, pour l’utilité commune, et tous les croyants ont été baptisés dans un seul Esprit pour former un seul corps (12.13).',
    },
    'holy-spirit:kp:12': {
      title: 'Scellés du Saint-Esprit promis',
      group: 'La vie dans l’Esprit',
      note: 'Ceux qui ont entendu l’Évangile et y ont cru ont été scellés du Saint-Esprit qui avait été promis, gage de leur héritage jusqu’à la rédemption finale accomplie par Dieu.',
    },
  },
  perspectives: {
    'holy-spirit:ps:gifts': {
      question: 'Les dons miraculeux comme la prophétie, les langues et la guérison continuent-ils aujourd’hui ?',
      intro:
        'Les chrétiens s’accordent à dire que l’Esprit accorde des dons à chaque croyant pour l’utilité commune (1 Co 12.7) et qu’il est toujours à l’œuvre dans l’Église. Ils divergent sur la question de savoir si les dons les plus extraordinaires décrits dans les Actes et en 1 Corinthiens — prophétie, langues et guérisons — appartenaient à la fondation apostolique de l’Église ou se poursuivent aujourd’hui. L’ouvrage de référence pour cette comparaison, Are Miraculous Gifts for Today? Four Views (1996), expose les positions cessationniste, ouverte mais prudente, de la « troisième vague » et pentecôtiste/charismatique.',
      commonGround:
        'Tous reconnaissent que l’Esprit habite en chaque croyant et accorde des dons pour édifier l’Église, et tous tiennent l’Écriture pour la norme à l’aune de laquelle toute expérience spirituelle revendiquée doit être examinée (1 Th 5.21).',
      perspectives: {
        'holy-spirit:ps:gifts:cessationist': {
          tradition: 'Cessationniste',
          label: 'Les dons de signes ont cessé avec les apôtres',
          summary:
            'B. B. Warfield soutenait que les dons miraculeux n’étaient pas l’apanage de tout chrétien des premiers temps, mais les lettres de créance des apôtres en tant qu’agents autorisés de Dieu pour la fondation de l’Église, de sorte qu’ils ont disparu avec l’âge apostolique (Counterfeit Miracles, 1918, p. 5–6). Les cessationnistes rattachent cela à l’Église édifiée sur le fondement des apôtres et des prophètes (Ep 2.20), aux signes qui confirmaient le message apostolique (He 2.3–4 ; 2 Co 12.12) et à l’achèvement de l’Écriture : la Confession de Westminster déclare que les anciennes manières dont Dieu révélait sa volonté à son peuple ont désormais cessé (1.1).',
        },
        'holy-spirit:ps:gifts:open': {
          tradition: 'Ouverte mais prudente',
          label: 'Possibles, mais pas la norme pour tout chrétien',
          summary:
            'Beaucoup d’évangéliques répondent par un « peut-être » (Four Views) : ouverts à ce que l’Esprit accorde aujourd’hui des dons inhabituels, mais réticents à en faire la norme pour tous les croyants. John Stott conseillait la retenue de part et d’autre. Ceux qui se méfient du mouvement charismatique devraient être prêts à reconnaître une œuvre inhabituelle de l’Esprit chez d’autres, pourvu que l’expérience ne contredise pas l’Écriture et fasse du bien au croyant et à l’Église. Ceux qui ont vécu de telles expériences ne devraient pas en faire un modèle pour tous, car ce que tout chrétien doit partager, c’est l’œuvre de l’Esprit dans le caractère, et non un don ou une expérience particuliers (Baptism and Fullness, p. 73–74). Les tenants de cette position invoquent le conseil de Paul : ne pas éteindre l’Esprit ni mépriser les prophéties, mais examiner toutes choses (1 Th 5.19–21).',
        },
        'holy-spirit:ps:gifts:continuationist': {
          tradition: 'Pentecôtistes, charismatiques et « troisième vague »',
          label: 'Tous les dons demeurent jusqu’au retour du Christ',
          summary:
            'Les chrétiens pentecôtistes et de la « troisième vague » répondent oui : les dons décrits dans les Actes et en 1 Corinthiens restent à la disposition de l’Église (Four Views). Les Assemblées de Dieu, par exemple, enseignent que le baptême dans l’Esprit revêt les croyants de puissance pour vivre et servir, et leur apporte les dons de l’Esprit pour le ministère (Statement of Fundamental Truths, art. 7). Les continuationnistes invoquent l’exhortation de Paul à aspirer aux dons spirituels, surtout à celui de prophétie (1 Co 14.1), et notent qu’il s’attend à ce que prophétie et langues prennent fin « quand ce qui est parfait sera venu », lorsque les croyants verront face à face (1 Co 13.8–12).',
        },
      },
    },
    'holy-spirit:ps:spirit-baptism': {
      question: 'Le « baptême dans l’Esprit » est-il une seconde expérience après la conversion ?',
      intro:
        'Jésus a promis à ses disciples qu’ils seraient baptisés du Saint-Esprit (Ac 1.5), et Paul dit que si quelqu’un n’a pas l’Esprit de Christ, il ne lui appartient pas (Rm 8.9). Les chrétiens divergent sur la question de savoir si le baptême dans l’Esprit fait partie de l’entrée dans la vie chrétienne ou s’il est un revêtement de puissance distinct qui peut la suivre, selon la lecture pentecôtiste des épisodes de Samarie et d’Éphèse (Ac 8.14–17 ; 19.1–7).',
      commonGround:
        'Tous reconnaissent que tout chrétien a l’Esprit de Christ (Rm 8.9), que les croyants doivent continuer d’être remplis de l’Esprit (Ep 5.18), et que la puissance de l’Esprit est donnée pour le témoignage et le service (Ac 1.8).',
      perspectives: {
        'holy-spirit:ps:spirit-baptism:pentecostal': {
          tradition: 'Pentecôtisme classique',
          label: 'Un revêtement de puissance distinct, après la nouvelle naissance',
          summary:
            'Les Assemblées de Dieu enseignent que tout croyant devrait attendre et rechercher le baptême dans le Saint-Esprit, qu’elles considèrent comme l’expérience commune des premiers chrétiens. Il revêt les croyants de puissance pour vivre et servir, et il constitue une expérience distincte qui suit la nouvelle naissance, comme en Actes 8, 10, 11 et 15 (Statement of Fundamental Truths, art. 7). Son premier signe extérieur est le parler en d’autres langues, selon que l’Esprit donne de s’exprimer, comme à la Pentecôte (art. 8 ; Ac 2.4).',
        },
        'holy-spirit:ps:spirit-baptism:evangelical': {
          tradition: 'Évangélique (non pentecôtiste)',
          label: 'Reçu par tout croyant à la conversion',
          summary:
            'John Stott soutenait que le baptême de l’Esprit est reçu par tout croyant à sa conversion — nous avons tous été baptisés dans un seul Esprit pour former un seul corps (1 Co 12.13) —, tandis qu’être rempli de l’Esprit est un besoin permanent, à rechercher sans cesse (Ep 5.18). Il demandait donc à ceux qui avaient vécu des expériences spirituelles inhabituelles de ne pas presser les autres de rechercher le baptême de l’Esprit comme une seconde étape après la conversion, puisque, selon lui, l’Écriture ne l’établit pas (Baptism and Fullness, p. 73–74).',
        },
        'holy-spirit:ps:spirit-baptism:sacramental': {
          tradition: 'Catholique et orthodoxe',
          label: 'Donné dans les sacrements de l’initiation',
          summary:
            'Dans l’enseignement catholique et orthodoxe, l’Esprit est donné au sein de l’initiation chrétienne, et non dans une expérience ultérieure et distincte. Le baptême est la nouvelle naissance d’eau et d’Esprit (Jn 3.5), et il est parachevé par la confirmation (en Orient, la chrismation), que la Catholic Encyclopedia décrit comme le sacrement par lequel le Saint-Esprit est donné aux baptisés pour faire d’eux des chrétiens forts et adultes, un perfectionnement du baptême ; elle lit les épisodes de Samarie et d’Éphèse comme des exemples apostoliques de ce rite (Ac 8.14–17 ; 19.1–6). La Confession de Dosithée compte le chrême parmi les sept mystères et le rattache à la promesse de Jésus selon laquelle les disciples seraient revêtus de la puissance d’en haut (Décret XV ; Lc 24.49).',
        },
      },
    },
  },
  suggestedQuestions: [
    'Le Saint-Esprit est-il une personne ou une force ?',
    'Que s’est-il passé à la Pentecôte ?',
    'Qu’est-ce que le fruit de l’Esprit ?',
    'Les dons spirituels comme les langues et la prophétie continuent-ils aujourd’hui ?',
    'Qu’est-ce que le baptême dans le Saint-Esprit ?',
    'Quels sont les mots hébreu et grec pour « esprit » ?',
  ],
};

export default overlay;
