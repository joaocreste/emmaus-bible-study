/**
 * Français overlay for the topic "trinity". The English module (src/data/curated/topics/trinity.ts)
 * stays the source of truth for ids, references and citations. Scripture quoted in prose follows LSG.
 */
import type { TopicOverlay } from '../types';

const overlay: TopicOverlay = {
  topicId: 'trinity',
  locale: 'fr',
  name: 'La Trinité',
  aliases: [
    'trinité',
    'la trinité',
    'sainte trinité',
    'la sainte trinité',
    'dieu trinitaire',
    'dieu trine',
    'trois en un',
    'dieu en trois personnes',
    'père fils et saint-esprit',
    'père, fils et saint-esprit',
    'qu’est-ce que la trinité',
    "qu'est-ce que la trinité",
    'doctrine de la trinité',
    'la trinité est-elle dans la bible',
    'procession du saint-esprit',
    'procession de l’esprit',
  ],
  question: 'Qu’enseigne la Bible sur la Trinité ?',
  definition:
    'La doctrine de la Trinité confesse un seul Dieu qui existe éternellement comme Père, Fils et Saint-Esprit. Le mot lui-même ne se trouve pas dans la Bible — le grec trias apparaît pour la première fois dans les écrits conservés vers 180 apr. J.-C., chez Théophile d’Antioche —, mais il nomme une structure que l’Écriture expose. Israël confessait que l’Éternel est un (Dt 6.4), et le Nouveau Testament maintient cette confession (1 Co 8.4–6). Pourtant il parle de la Parole qui était avec Dieu et qui était Dieu (Jn 1.1), de l’Esprit comme d’un autre Consolateur envoyé par le Père (Jn 14.16–17, 26), et du baptême au nom unique du Père, du Fils et du Saint-Esprit (Mt 28.19). Au baptême de Jésus, le Père parle et l’Esprit descend (Mt 3.16–17). Le symbole de 381 a donné à cette foi sa confession classique.',
  keyPassages: {
    'trinity:kp:1': {
      title: 'L’Éternel est un',
      group: 'Un seul Dieu',
      note: 'La confession quotidienne d’Israël en l’Éternel unique demeure le point de départ de l’enseignement chrétien sur Dieu ; Jésus lui-même l’appelle le premier de tous les commandements (Mc 12.29–30).',
    },
    'trinity:kp:2': {
      title: 'Je suis le premier et je suis le dernier',
      group: 'Un seul Dieu',
      note: 'L’Éternel déclare qu’il n’y a point d’autre Dieu que lui. L’Apocalypse met ensuite le titre « le premier et le dernier » dans la bouche du Christ ressuscité (Ap 1.17 ; 22.13).',
    },
    'trinity:kp:3': {
      title: 'Un seul Dieu, le Père, et un seul Seigneur, Jésus-Christ',
      group: 'Un seul Dieu',
      note: 'Paul reformule la confession d’Israël en un seul Dieu autour du Père et du Fils : un seul Dieu, le Père, de qui viennent toutes choses, et un seul Seigneur, Jésus-Christ, par qui sont toutes choses.',
    },
    'trinity:kp:4': {
      title: 'Le baptême de Jésus',
      group: 'Le Père, le Fils et l’Esprit révélés',
      note: 'Au Jourdain, le Fils est baptisé, l’Esprit descend sur lui comme une colombe, et la voix du Père déclare son amour — une scène que l’Église lit depuis longtemps comme une révélation des trois personnes.',
    },
    'trinity:kp:5': {
      title: 'La Parole était Dieu',
      group: 'Le Père, le Fils et l’Esprit révélés',
      note: 'La Parole est à la fois avec Dieu et Dieu, celle par qui toutes choses ont été faites ; cette Parole a été faite chair (1.14).',
    },
    'trinity:kp:6': {
      title: 'Un autre Consolateur',
      group: 'Le Père, le Fils et l’Esprit révélés',
      note: 'Jésus promet un autre Consolateur, l’Esprit de vérité, que le Père enverra en son nom ; le Père et le Fils feront leur demeure chez ceux qui l’aiment (14.23).',
    },
    'trinity:kp:7': {
      title: 'Qui procède du Père',
      group: 'Le Père, le Fils et l’Esprit révélés',
      note: 'Jésus enverra d’auprès du Père l’Esprit de vérité, et l’Esprit procède du Père. Ce verset est au cœur du débat ultérieur entre l’Orient et l’Occident sur le Filioque.',
    },
    'trinity:kp:8': {
      title: 'Existant en forme de Dieu',
      group: 'Le Père, le Fils et l’Esprit révélés',
      note: 'Le Christ, existant en forme de Dieu, s’est abaissé jusqu’à la croix. Dieu lui donne alors le nom qui est au-dessus de tout nom, et la scène de tout genou qui fléchit fait écho aux paroles mêmes de l’Éternel en Ésaïe 45.23.',
    },
    'trinity:kp:9': {
      title: 'Baptisés en un seul nom',
      group: 'Vie et culte trinitaires',
      note: 'Jésus ressuscité envoie ses disciples faire de toutes les nations des disciples, en les baptisant au nom — au singulier — du Père, du Fils et du Saint-Esprit.',
    },
    'trinity:kp:10': {
      title: 'Grâce, amour et communion',
      group: 'Vie et culte trinitaires',
      note: 'La bénédiction finale de Paul unit la grâce du Seigneur Jésus-Christ, l’amour de Dieu et la communion du Saint-Esprit.',
    },
    'trinity:kp:11': {
      title: 'Dieu a envoyé son Fils… et l’Esprit de son Fils',
      group: 'Vie et culte trinitaires',
      note: 'Le Père envoie le Fils pour racheter, puis envoie l’Esprit de son Fils dans le cœur des croyants, si bien qu’ils appellent Dieu « Abba ! Père ! ».',
    },
    'trinity:kp:12': {
      title: 'Élus, sanctifiés, aspergés',
      group: 'Vie et culte trinitaires',
      note: 'Pierre décrit le salut comme l’œuvre de la prescience du Père, de la sanctification de l’Esprit, ainsi que de l’obéissance à Jésus-Christ et de l’aspersion de son sang.',
    },
  },
  perspectives: {
    'trinity:ps:filioque': {
      question: 'Le Saint-Esprit procède-t-il du Père seul, ou du Père et du Fils (le Filioque) ?',
      intro:
        'La foi en un seul Dieu en trois personnes est partagée par les Églises orthodoxes, catholique et protestantes historiques, et toutes confessent le symbole de 381, qui, dans sa forme originale, dit que l’Esprit procède du Père. Les Églises d’Occident ont ensuite ajouté « et du Fils » (en latin filioque) : l’ajout semble avoir d’abord été chanté en Espagne après le troisième concile de Tolède (589) ; après le concile d’Aix-la-Chapelle (809), le pape Léon III approuva la doctrine, mais conseilla de laisser le mot hors du symbole ; et la plupart des historiens datent son adoption à Rome du début du XIe siècle. Il est devenu un point de division durable entre l’Orient et l’Occident, et la réunion tentée à Florence (1439) n’a pas tenu.',
      commonGround:
        'Les deux parties confessent un seul Dieu en trois personnes coégales et coéternelles, toutes deux reconnaissent le Père comme la source du Fils et de l’Esprit, et toutes deux confessent le symbole de 381 (l’Occident avec la clause ajoutée). Le différend porte sur le rapport de l’origine éternelle de l’Esprit au Fils, et sur la question de savoir qui peut modifier un symbole que toute l’Église partage.',
      perspectives: {
        'trinity:ps:filioque:western': {
          tradition: 'Catholique et protestante occidentale',
          label: 'Du Père et du Fils',
          summary:
            'Augustin enseignait que l’Esprit procède principalement du Père, qui, en engendrant le Fils, lui a donné que l’Esprit procède aussi de lui ; ainsi l’Esprit est l’Esprit des deux (De Trinitate XV.17.29 ; XV.26.47). Thomas d’Aquin soutenait que si l’Esprit ne procédait pas du Fils, les deux ne pourraient être distingués comme personnes (Somme théologique I q.36 a.2). La théologie occidentale invoque des textes où l’Esprit est appelé l’Esprit du Fils et est envoyé par le Fils (Ga 4.6 ; Jn 15.26 ; 16.14–15). L’Église catholique a défini cette doctrine à Lyon (1274) et à Florence (1439), et des confessions protestantes comme la Confession de Westminster (2.3) et les Articles méthodistes (art. IV) l’ont conservée.',
        },
        'trinity:ps:filioque:orthodox': {
          tradition: 'Orthodoxe',
          label: 'Du Père seul, donné par le Fils',
          summary:
            'Le Père seul est cause et source au sein de la divinité : le Fils est engendré de lui et l’Esprit procède de lui, comme le disent Jean 15.26 et le symbole de 381. Jean Damascène refuse de dire que l’Esprit est du Fils, mais il l’appelle l’Esprit du Fils, manifesté et communiqué à nous par le Fils, et parle de l’Esprit comme procédant du Père par le Fils (Exposition I.8, I.12). Au IXe siècle, le patriarche Photius rejeta la procession à partir du Fils et s’opposa à l’insertion du mot dans le symbole, et les critiques orientaux objectèrent qu’ajouter au symbole commun revenait à ignorer l’interdiction conciliaire de composer un autre symbole (Éphèse, 431). La Confession de Dosithée (1672) confesse l’Esprit comme procédant du Père.',
        },
      },
    },
  },
  suggestedQuestions: [
    'La Trinité est-elle enseignée dans la Bible ?',
    'Où voit-on ensemble le Père, le Fils et l’Esprit dans l’Écriture ?',
    'Qu’est-ce que la querelle du Filioque ?',
    'Comment Dieu peut-il être un et trois ?',
    'Comment le Nouveau Testament parle-t-il du Fils comme Dieu ?',
  ],
};

export default overlay;
