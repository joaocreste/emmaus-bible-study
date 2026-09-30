/**
 * Français — traduction de l’étude « Romains 8 » (src/data/curated/studies/romans-8.ts).
 *
 * Les paroles bibliques citées entre guillemets reproduisent la Louis Segond 1910 (LSG), version
 * française par défaut (ou, lorsqu’elle est nommée, la version indiquée : Darby, NCL, Ostervald) ;
 * ailleurs, le texte biblique est paraphrasé sans guillemets. Les citations vérifiées d’auteurs
 * (Calvin, Chrysostome, Owen…) ne sont jamais réécrites : l’overlay n’ajoute qu’une traduction
 * libre (`quoteTranslation`), et la prose les rapporte au style indirect, sans guillemets.
 * Les ancres des mots clés ont été vérifiées sur le texte de LSG, Darby, NCL et Ostervald.
 */
import type { VerseRef } from '../../../../domain/models';
import type { StudyOverlay } from '../types';

const rom8 = (verse: number): VerseRef => ({ book: 'ROM', chapter: 8, verse });

const overlay: StudyOverlay = {
  studyId: 'romans-8',
  locale: 'fr',
  title: 'Romains 8',
  subtitle: 'La vie dans l’Esprit — ni condamnation, ni séparation',
  summary:
    'Romains 8 est le sommet de l’argumentation de Paul dans les chapitres 5 à 8. Il s’ouvre sur l’affirmation qu’il n’y a « aucune condamnation pour ceux qui sont en Jésus-Christ » (8.1) et se clôt sur la certitude que rien, dans toute la création, « ne pourra nous séparer de l’amour de Dieu manifesté en Jésus-Christ notre Seigneur » (8.39). Entre les deux, Paul montre le Saint-Esprit accomplissant ce que la loi ne pouvait pas faire : donner la vie, conduire les enfants de Dieu, susciter le cri « Abba! Père! » et intercéder dans notre faiblesse — le mot grec pour « Esprit » y revient 21 fois, plus que dans tout autre chapitre du Nouveau Testament. Les souffrances présentes sont replacées dans le dessein de Dieu de renouveler la création et de racheter nos corps, et le chapitre s’achève dans un tribunal où aucun accusateur ne peut l’emporter, parce que Dieu justifie et que le Christ intercède.',
  opening:
    'Bienvenue dans Romains 8, un chapitre que beaucoup de chrétiens chérissent presque plus que tout autre. Il commence par « aucune condamnation » et s’achève sur la promesse que rien ne pourra nous séparer de l’amour de Dieu ; entre les deux, Paul décrit l’œuvre de l’Esprit, notre adoption comme enfants de Dieu et une espérance assez grande pour porter les souffrances présentes. Touchez un mot surligné pour voir le grec qui se trouve derrière, ou interrogez-moi sur un verset, sur un mot, ou sur ce que les chrétiens en ont dit au fil des siècles.',
  matchTopics: [
    'romains 8',
    'romains huit',
    'romains chapitre 8',
    'rm 8',
    'la vie dans l’esprit',
    'vie selon l’esprit',
    'aucune condamnation',
    'pas de condamnation',
    'il n’y a donc maintenant aucune condamnation',
    'aucune séparation',
    'rien ne pourra nous séparer de l’amour de dieu',
    'qui nous séparera de l’amour de christ',
    'plus que vainqueurs',
    'toutes choses concourent au bien',
    'tout concourt au bien',
    'la chaîne d’or',
    'esprit d’adoption',
    'abba père',
    'soupirs inexprimables',
    'prémices de l’esprit',
  ],
  suggestedQuestions: [
    'Que signifie « condamnation » au verset 1 ?',
    'Qu’entend Paul ici par « la chair » ?',
    'Quel mot grec se trouve derrière « adoption » ?',
    'Qu’a dit Tim Keller sur ce passage ?',
    'Comment les premiers destinataires comprenaient-ils « Abba! Père! » ?',
    'Où Paul parle-t-il encore de ce sujet ?',
    'Pouvez-vous m’expliquer le verset 28 plus en détail ?',
    'Existe-t-il différentes interprétations théologiques des versets 29 et 30 ?',
    'Comment ce chapitre s’articule-t-il avec le reste de l’épître aux Romains ?',
    '« Abba » veut-il dire « papa » ?',
  ],

  keyWords: {
    'romans-8:kw:katakrima': {
      english: 'condamnation',
      basicMeaning: 'condamnation ; la peine qui suit une sentence',
      semanticRange: [
        'condamnation : le verdict défavorable prononcé contre quelqu’un (ainsi la plupart des versions)',
        'peine : la sentence mise à exécution (glose d’Abbott-Smith ; la Revised Version anglaise traduit « condemnation »)',
      ],
      grammar: 'Nom, nominatif singulier neutre',
      significance:
        'Κατάκριμα n’apparaît que trois fois dans le Nouveau Testament, toutes dans l’épître aux Romains : deux fois en 5.16–18, où l’unique offense d’Adam entraîne la condamnation de tous, et ici. Ainsi 8.1 répond directement à 5.18 : pour ceux qui sont « en Jésus-Christ », le verdict et la peine qui pesaient sur l’humanité en Adam ne tiennent plus. Paul explique ensuite pourquoi : Dieu « a condamné le péché dans la chair » de son Fils (8.3), et, au bout du compte, personne ne peut condamner ceux que Dieu justifie (8.34).',
      caution:
        '« Aucune condamnation » est un verdict sur la situation d’une personne devant Dieu. Cela ne signifie pas que les croyants ne pèchent plus ou ne luttent plus : Paul leur dit encore : « si par l’Esprit vous faites mourir les actions du corps, vous vivrez » (8.13).',
      notableNotes: [
        '« C’est après une seule offense que le jugement est devenu condamnation » — l’offense d’Adam.',
        '« Par une seule offense la condamnation a atteint tous les hommes » — le verdict que 8.1 renverse pour ceux qui sont en Christ.',
      ],
      anchors: [{ verse: rom8(1), phrases: { LSG: 'condamnation', DARBY: 'condamnation', NCL: 'condamnation', OST: 'condamnation' } }],
    },
    'romans-8:kw:katakrino': {
      english: 'condamner',
      basicMeaning: 'condamner ; prononcer un jugement contre',
      semanticRange: [
        'prononcer un jugement contre quelqu’un, condamner (Mc 14.64 ; Jn 8.10–11)',
        'au passif : être condamné (Rm 14.23 ; 1 Co 11.32)',
        'au figuré : condamner par contraste ou par l’exemple (Mt 12.41–42 ; He 11.7 — Abbott-Smith range aussi Rm 8.3 sous ce sens)',
      ],
      grammar:
        'Verbe, aoriste actif indicatif, 3e personne du singulier (8.3) ; participe en 8.34 — étiqueté au présent par TAGNT, bien que l’accent de la forme imprimée (κατακρινῶν) soit celui d’un participe futur : « qui condamnera ? »',
      significance:
        'Paul emploie encore deux fois dans le chapitre le verbe apparenté (18 occurrences dans le Nouveau Testament), en écho au nom de 8.1. En 8.3, Dieu en est le sujet : en envoyant son Fils en sacrifice pour le péché, il « a condamné le péché dans la chair » — la sentence est tombée sur le péché, en Christ, plutôt que sur ceux qui sont en lui (ainsi la note d’étude Tyndale : Dieu a condamné le péché en Christ, notre substitut). En 8.34, la question « Qui les condamnera? » reste sans réponse, car celui qui est mort, qui est ressuscité et qui intercède maintenant, c’est le Christ lui-même.',
      caution:
        'Le lexique d’Abbott-Smith classe 8.3 sous le sens figuré (condamner par contraste) ; la plupart des commentateurs y lisent la sentence judiciaire de Dieu exécutée sur le péché dans la chair du Christ. C’est le contexte, et non l’article de dictionnaire, qui doit trancher.',
      notableNotes: [
        'Le sanhédrin : « Tous le condamnèrent comme méritant la mort » — Jésus lui-même condamné.',
        '« Je ne te condamne pas non plus » — Jésus à la femme surprise en adultère.',
        '« Qui les condamnera? » — la question à laquelle le chapitre ne laisse aucune réponse possible.',
      ],
      anchors: [
        { verse: rom8(3), phrases: { LSG: 'a condamné le péché', DARBY: 'a condamné le péché', NCL: 'a condamné le péché', OST: 'a condamné le péché' } },
        { verse: rom8(34), phrases: { LSG: 'condamnera', DARBY: 'condamne', NCL: 'condamnera', OST: 'condamnera' } },
      ],
    },
    'romans-8:kw:sarx': {
      english: 'chair',
      basicMeaning: 'chair',
      semanticRange: [
        'la substance physique du corps ; le corps lui-même',
        'les êtres humains dans leur fragilité et leur condition mortelle (« toute chair »)',
        'la descendance et la parenté naturelles (« selon la chair », Rm 1.3 ; 9.3, 5)',
        'dans l’usage éthique de Paul, l’humanité comme siège et véhicule du désir pécheur, opposée à l’Esprit (Rm 8.4–13 ; Ga 5.16–17)',
      ],
      grammar: 'Nom, accusatif singulier féminin (κατὰ σάρκα, « selon la chair », 8.4)',
      significance:
        'Σάρξ apparaît 13 fois dans les seuls versets 8.3–13 (147 fois dans le Nouveau Testament). Paul ne dit pas que le corps est mauvais : Dieu a condamné le péché dans la chair, non la chair elle-même (8.3), et l’Esprit rendra la vie à nos corps mortels (8.11). La « chair » désigne ici l’humanité telle qu’elle est en Adam — faible, prétendant se suffire à elle-même, portée vers le péché et en « inimitié contre Dieu » (8.7). « Selon la chair » et « selon l’esprit » décrivent deux manières d’exister et deux sources de vie, non deux parties de la personne.',
      caution:
        'Il ne faut pas lire « chair », dans ce chapitre, au sens de « corps physique » ou de « sexualité ». Certaines traductions rendent le mot par « nature pécheresse » (ainsi la NLT anglaise, sur laquelle s’appuient les notes Tyndale) ; le contexte tranche à chaque emploi — voir le sens neutre de « selon la chair » en Romains 1.3 et 9.5.',
      notableNotes: [
        'Sens neutre : le Fils de Dieu, « né de la postérité de David, selon la chair ».',
        '« Ce qui est bon, je le sais, n’habite pas en moi, c’est-à-dire dans ma chair » — le combat qui précède immédiatement le chapitre 8.',
        '« La chair a des désirs contraires à ceux de l’Esprit » — l’autre grand passage de Paul sur la chair et l’Esprit.',
      ],
      anchors: [
        { verse: rom8(4), phrases: { LSG: 'chair', DARBY: 'chair', NCL: 'chair', OST: 'chair' } },
        { verse: rom8(13), phrases: { LSG: 'chair', DARBY: 'chair', NCL: 'chair', OST: 'chair' } },
      ],
    },
    'romans-8:kw:pneuma': {
      english: 'Esprit',
      basicMeaning: 'esprit, souffle ; le (Saint-)Esprit',
      semanticRange: [
        'vent ; souffle',
        'l’esprit humain — « notre esprit » (8.16)',
        'une disposition, un état d’esprit — « un esprit de servitude » (8.15)',
        'le Saint-Esprit — « l’Esprit de Dieu », « l’Esprit de Christ » (8.9)',
      ],
      grammar: 'Nom, génitif singulier neutre (τοῦ πνεύματος τῆς ζωῆς, « de l’Esprit de vie », 8.2)',
      significance:
        'Vingt et une des 34 occurrences de πνεῦμα dans l’épître aux Romains se trouvent dans ce chapitre, contre cinq dans les chapitres 1 à 7 ; aucun autre chapitre du Nouveau Testament n’en approche (vient ensuite 1 Corinthiens 12, avec 12 occurrences). L’Esprit est « l’Esprit de Dieu » et « l’Esprit de Christ » dans une seule et même phrase (8.9). Il affranchit (8.2), donne la vie maintenant et la résurrection plus tard (8.10–11), conduit les enfants de Dieu (8.14), rend témoignage à notre esprit (8.16) et intercède pour nous (8.26–27).',
      caution:
        'Dans quelques versets, les traducteurs doivent choisir entre « Esprit » et « esprit » : en 8.10, la LSG écrit « l’esprit est vie », là où Darby porte « l’Esprit est vie » ; en 8.4–5, elle écrit « selon l’esprit », là où la NCL a « selon l’Esprit » ; et en 8.15, la NCL imprime « un Esprit de servitude ». La majuscule relève d’une décision d’interprétation : le texte grec ne marque pas la différence.',
      notableNotes: [
        '« L’amour de Dieu est répandu dans nos cœurs par le Saint-Esprit » — annoncé dès avant le chapitre 8.',
        'Servir « dans un esprit nouveau, et non selon la lettre qui a vieilli ».',
        '« Marchez selon l’Esprit » — la même éthique dans l’épître aux Galates.',
      ],
      anchors: [
        { verse: rom8(2), phrases: { LSG: 'esprit de vie', DARBY: 'Esprit de vie', NCL: 'Esprit de la vie', OST: 'Esprit de vie' } },
        { verse: rom8(16), phrases: { LSG: 'L’Esprit lui-même', DARBY: 'L’Esprit lui-même', NCL: 'Esprit lui-même', OST: "l'Esprit lui-même" } },
      ],
    },
    'romans-8:kw:phronema': {
      english: 'affection / pensée',
      basicMeaning: 'la pensée ; ce à quoi l’esprit s’attache, l’intention',
      semanticRange: ['ce qui occupe l’esprit : pensée, orientation, état d’esprit', 'intention, dessein (la glose de STEPBible)'],
      grammar: 'Nom, nominatif singulier neutre',
      significance:
        'Les quatre emplois de ce nom dans le Nouveau Testament se trouvent tous en Romains 8 (deux fois en 8.6, puis en 8.7 et 8.27) ; la LSG le rend par « affection » en 8.6–7 et par « pensée » en 8.27. La chair et l’Esprit ont chacun leur « affection » — une orientation de la volonté et du désir, pas seulement un ensemble d’idées (la note Tyndale sur le verbe apparenté, en 8.5, fait la même remarque). Cette orientation aboutit soit à la mort, soit à « la vie et la paix » (8.6) ; et en 8.27, le Père connaît « la pensée de l’Esprit » tandis que l’Esprit intercède.',
      notableNotes: [
        '« L’affection de la chair est inimitié contre Dieu. »',
        '« Celui qui sonde les cœurs connaît quelle est la pensée de l’Esprit » — le même mot, employé pour l’Esprit.',
      ],
      anchors: [
        {
          verse: rom8(6),
          phrases: { LSG: 'l’affection de la chair', DARBY: 'la pensée de la chair', NCL: 'les affections de la chair', OST: "l'affection de la chair" },
        },
      ],
    },
    'romans-8:kw:huiothesia': {
      english: 'adoption',
      basicMeaning: 'adoption (comme fils)',
      semanticRange: [
        'adoption d’un fils ou d’une fille (terme juridique courant dans les inscriptions)',
        'la relation de Dieu avec Israël (Rm 9.4)',
        'la relation de Dieu avec les chrétiens (Rm 8.15 ; Ga 4.5 ; Ep 1.5)',
        'son accomplissement futur (Rm 8.23)',
      ],
      grammar: 'Nom, génitif singulier féminin (πνεῦμα υἱοθεσίας, « Esprit d’adoption », 8.15)',
      significance:
        'Seul Paul emploie ce mot dans le Nouveau Testament (5 fois), et Romains 8 l’applique au présent comme à l’avenir : l’Esprit d’adoption a déjà été reçu (8.15), et pourtant nous attendons encore « l’adoption, la rédemption de notre corps » (8.23). Paul emprunte un terme juridique gréco-romain — le fils adopté recevait tous les droits d’un héritier (note Tyndale sur 8.15) —, mais il le remplit de l’histoire d’Israël, puisque « l’adoption » appartenait d’abord à Israël (9.4 ; Ex 4.22).',
      caution:
        'Il ne faut pas plaquer sur Paul chaque détail du droit romain de l’adoption ; les notes Tyndale renvoient aussi à l’image vétérotestamentaire d’Israël, fils de Dieu (Ex 4.22 ; Os 11.1).',
      notableNotes: [
        '« À qui appartiennent l’adoption, et la gloire » — le privilège appartenait d’abord à Israël.',
        '« Afin que nous reçussions l’adoption » — le Fils envoyé pour racheter.',
        '« Nous ayant prédestinés dans son amour à être ses enfants d’adoption par Jésus-Christ. »',
      ],
      anchors: [
        { verse: rom8(15), phrases: { LSG: 'adoption', DARBY: 'adoption', NCL: 'adoption', OST: 'adoption' } },
        { verse: rom8(23), phrases: { LSG: 'adoption', DARBY: 'adoption', NCL: 'adoption', OST: 'adoption' } },
      ],
    },
    'romans-8:kw:abba': {
      english: 'Abba',
      basicMeaning: 'père (araméen אַבָּא, forme emphatique de אַב)',
      semanticRange: [
        'père — le mot araméen ordinaire de la vie familiale, employé ici comme interpellation directe',
        'toujours associé, dans le Nouveau Testament, au grec ὁ πατήρ : « Abba, Père »',
      ],
      grammar: 'Nom, vocatif singulier masculin — mot araméen indéclinable écrit en lettres grecques',
      significance:
        'Paul laisse le mot araméen non traduit dans une lettre écrite en grec et lui adjoint son équivalent grec. Ses seuls autres emplois dans le Nouveau Testament sont la prière de Jésus à Gethsémané (Mc 14.36) et Galates 4.6, ce qui laisse penser que l’appellation employée par Jésus est devenue la prière chérie des Églises de langue grecque. Pour Paul, c’est l’Esprit qui rend ce cri possible : les croyants prient Dieu comme Jésus l’a fait — en enfants, non en esclaves.',
      caution:
        'L’enseignement populaire affirme souvent qu’abba signifie « papa » (certaines notes d’étude, dont la note Tyndale sur 8.15, le disent encore). James Barr (1988) a soutenu que les données n’autorisent pas à y voir un mot du langage enfantin : abba était un mot familial courant, employé par des fils et des filles, jeunes ou adultes, mais sa nuance est « Père », non « papa ».',
      notableNotes: [
        'Jésus à Gethsémané : « Abba, Père… non pas ce que je veux, mais ce que tu veux. »',
        'L’Esprit de son Fils envoyé dans nos cœurs, « lequel crie: Abba! Père! »',
      ],
      anchors: [{ verse: rom8(15), phrases: { LSG: 'Abba', DARBY: 'Abba', NCL: 'Abba', OST: 'Abba' } }],
    },
    'romans-8:kw:aparche': {
      english: 'prémices',
      basicMeaning: 'prémices',
      semanticRange: [
        'la première part d’un sacrifice ou d’une récolte, offerte à Dieu',
        'les prémices de la moisson (Lv 23.10 dans l’Ancien Testament grec) et de la pâte (Rm 11.16 ; cf. Nb 15.20)',
        'au figuré : les premiers convertis d’une région (Rm 16.5) ; le Christ ressuscité (1 Co 15.20, 23)',
      ],
      grammar: 'Nom, accusatif singulier féminin',
      significance:
        'En Lévitique 23.10, l’Ancien Testament grec emploie ce mot même pour la première gerbe de la moisson, agitée devant l’Éternel avant qu’on puisse manger quoi que ce soit de la récolte. Paul appelle l’Esprit les « prémices » que les croyants possèdent déjà — le premier versement et la garantie de la moisson encore à venir : l’adoption plénière et la résurrection du corps (8.23). Il applique la même image à la résurrection du Christ en 1 Corinthiens 15.20.',
      notableNotes: [
        '« Christ est ressuscité des morts, il est les prémices de ceux qui sont morts. »',
        '« Si les prémices sont saintes, la masse l’est aussi » — la première part sanctifie le tout.',
      ],
      anchors: [{ verse: rom8(23), phrases: { LSG: 'prémices', DARBY: 'prémices', NCL: 'prémices', OST: 'prémices' } }],
    },
    'romans-8:kw:sunergeo': {
      english: 'concourir',
      basicMeaning: 'travailler avec ; coopérer, concourir',
      semanticRange: [
        'travailler avec, coopérer (Mc 16.20 ; 1 Co 16.16 ; Jc 2.22)',
        'faire concourir, faire travailler ensemble — sens transitif attesté chez des auteurs hellénistiques, que certains adoptent pour Rm 8.28',
      ],
      grammar: 'Verbe, présent actif indicatif, 3e personne du singulier',
      significance:
        'Le grec de 8.28 peut se construire de plus d’une façon, d’où les différences entre traductions : on peut comprendre que « toutes choses concourent au bien » (LSG, NCL, Ostervald, comme la KJV anglaise), ou que Dieu fait concourir toutes choses au bien (ainsi la BSB anglaise). Un petit groupe de manuscrits explicite le sujet en ajoutant « Dieu » (ὁ θεός) — leçon retenue par l’édition de Westcott et Hort, alors que les autres éditions des données STEPBible, texte byzantin compris, ne l’ont pas. Le lexique d’Abbott-Smith signale un sens intransitif et un sens transitif. Dans tous les cas, le contexte rend décisif le dessein de Dieu (8.28b–30), et 8.29 définit ce bien : être « semblables à l’image de son Fils ».',
      caution:
        'Paul ne dit pas que chaque événement est bon, ni que tout finit bien pour tout le monde. La promesse porte sur le bien « de ceux qui aiment Dieu, de ceux qui sont appelés selon son dessein », et ce bien, c’est la ressemblance avec le Christ — qui peut passer par la souffrance (8.17, 35–36).',
      notableNotes: [
        'Abraham : « la foi agissait avec ses œuvres ».',
        '« Nous travaillons avec Dieu » — le même verbe, pour la coopération humaine avec Dieu.',
      ],
      anchors: [{ verse: rom8(28), phrases: { LSG: 'concourent', DARBY: 'travaillent ensemble', NCL: 'concourent', OST: 'concourent' } }],
    },
    'romans-8:kw:proginosko': {
      english: 'connaître d’avance',
      basicMeaning: 'connaître d’avance, préconnaître (glose de STEPBible : « connaître / choisir »)',
      semanticRange: [
        'connaître d’avance, en parlant de personnes qui savent quelque chose à l’avance (Ac 26.5 ; 2 P 3.17)',
        'de la prescience de Dieu (Rm 8.29 ; 11.2 ; 1 P 1.20)',
      ],
      grammar: 'Verbe, aoriste second actif indicatif, 3e personne du singulier',
      significance:
        'Toute la chaîne de 8.29–30 dépend de ce premier verbe, dont le sens est débattu. Son objet, ce sont des personnes (« ceux »), non des faits les concernant, et dans l’Ancien Testament « connaître » peut signifier choisir quelqu’un ou lui attacher son amour (Am 3.2, que la LSG rend d’ailleurs par « Je vous ai choisis »). Les lecteurs réformés y voient donc un « aimer d’avance » ; d’autres y lisent la prescience qu’a Dieu de ceux qui croiraient. Le verbe apparaît cinq fois dans le Nouveau Testament. Voir les perspectives sur 8.29–30, dans la section Théologie.',
      caution:
        'Un seul verbe ne peut trancher la doctrine de l’élection ; il faut aussi peser l’argument qui l’entoure (8.28–39) et Romains 9 à 11.',
      notableNotes: [
        '« Dieu n’a point rejeté son peuple, qu’il a connu d’avance » — l’objet, là encore, ce sont des personnes.',
        'Le Christ, « prédestiné avant la fondation du monde » (LSG ; le grec porte προεγνωσμένου, « connu d’avance »).',
        'Prescience humaine : les accusateurs de Paul « savent depuis longtemps » qui il est.',
      ],
      anchors: [{ verse: rom8(29), phrases: { LSG: 'connus d’avance', DARBY: 'préconnus', NCL: 'connus d’avance', OST: "connus d'avance" } }],
    },
  },

  crossReferences: {
    'romans-8:xr:rom-7-24': {
      title: 'De « Misérable que je suis! » à « aucune condamnation »',
      explanation:
        'Romains 7 s’achève sur un cri — « Qui me délivrera du corps de cette mort? » — et sur une action de grâces par Jésus-Christ. Romains 8.1 en tire la conclusion (« donc ») : le combat du chapitre 7 est réel, mais il ne décide pas de la situation du croyant devant Dieu. Là où 7.23 parlait de « la loi du péché » qui retient captif, 8.2 annonce que « la loi de l’esprit de vie » a affranchi. La division en chapitres est un ajout tardif : l’argument de Paul se poursuit sans interruption.',
    },
    'romans-8:xr:rom-5-16': {
      title: 'Condamnation en Adam, vie en Christ',
      explanation:
        'Les seuls autres emplois de κατάκριμα dans le Nouveau Testament se trouvent ici : par une seule offense « la condamnation a atteint tous les hommes », mais par un seul acte de justice « la justification qui donne la vie s’étend à tous les hommes ». Romains 8.1 applique 5.18 à ceux qui sont en Christ : le verdict prononcé sur l’humanité en Adam a été remplacé.',
    },
    'romans-8:xr:jhn-3-17': {
      title: 'Celui qui croit n’est point jugé',
      explanation:
        'Les paroles de Jésus à Nicodème énoncent le même verdict : Dieu « n’a pas envoyé son Fils dans le monde pour qu’il juge le monde, mais pour que le monde soit sauvé par lui », et « celui qui croit en lui n’est point jugé ». Jean emploie le verbe plus simple κρίνω (« juger », ici au sens de juger contre) et lie la délivrance de la condamnation au fait de croire au Fils ; Paul la lie au fait d’être « en Jésus-Christ ». Ce sont deux angles d’une même union.',
    },
    'romans-8:xr:gal-5-16': {
      title: 'La chair contre l’Esprit',
      explanation:
        'L’autre grand développement de Paul sur la chair et l’Esprit. L’épître aux Galates décrit le conflit (« la chair a des désirs contraires à ceux de l’Esprit ») et le fruit de l’Esprit (5.22–23) ; Romains 8 fonde le même appel — marcher selon l’Esprit (Rm 8.4 ; Ga 5.16, 25) — sur l’œuvre vivifiante de l’Esprit. Lus ensemble, ces textes montrent que la « chair » est une puissance et une manière de vivre, non simplement le corps.',
    },
    'romans-8:xr:gal-4-4': {
      title: '« Abba! Père! » dans l’épître aux Galates',
      explanation:
        'Le parallèle le plus proche chez Paul. Dieu a envoyé son Fils « afin que nous reçussions l’adoption », et il a envoyé « dans nos cœurs l’Esprit de son Fils, lequel crie: Abba! Père! » — « Ainsi tu n’es plus esclave, mais fils; et si tu es fils, tu es aussi héritier ». La même séquence (adoption, Esprit, cri « Abba », de l’esclave au fils, héritier) parcourt Romains 8.14–17. Dans l’épître aux Galates, c’est l’Esprit qui crie ; dans l’épître aux Romains, c’est nous qui crions par l’Esprit.',
    },
    'romans-8:xr:exo-4-22': {
      title: 'Israël, fils premier-né de Dieu',
      explanation:
        'Dans le récit de l’Exode, Dieu appelle Israël « mon fils, mon premier-né » et ordonne à Pharaon : « Laisse aller mon fils ». Le langage de Paul — des fils conduits par l’Esprit et libérés d’« un esprit de servitude » — rappelle ce récit (la note Tyndale sur 8.14 cite Ex 4.22 ; N. T. Wright soutient que Romains 5–8 tout entier raconte à nouveau l’Exode). L’Ancien Testament grec appelle Israël le πρωτότοκος de Dieu, son « premier-né » — le titre que Paul donne au Christ « entre plusieurs frères » en 8.29.',
    },
    'romans-8:xr:gen-3-17': {
      title: 'Le sol maudit à cause d’Adam',
      explanation:
        'Après le péché d’Adam, Dieu déclare : « Le sol sera maudit à cause de toi » — épines, labeur pénible et retour à la poussière. Les mots de Paul, selon lesquels la création « a été soumise à la vanité, … à cause de celui qui l’y a soumise, avec l’espérance », rappellent très naturellement ce jugement : John Wesley identifiait à Dieu celui qui l’y a soumise, en renvoyant à Genèse 3.17, et la note Tyndale fait remonter le mal subi par la création à la chute d’Adam. L’épître aux Romains ajoute ce que la Genèse ne fait qu’esquisser : cet assujettissement s’est fait « avec l’espérance », et la création aura part à « la liberté de la gloire des enfants de Dieu ».',
    },
    'romans-8:xr:lev-23-10': {
      title: 'La gerbe des prémices',
      explanation:
        'Israël apportait au sacrificateur « une gerbe, prémices de votre moisson », et celui-ci l’agitait devant l’Éternel ; on ne pouvait manger ni pain ni grain « jusqu’au jour même où vous apporterez l’offrande ». L’Ancien Testament grec appelle cette gerbe ἀπαρχή, le mot que Paul applique à l’Esprit en 8.23. La première gerbe consacrait et promettait à la fois la moisson entière : ainsi l’Esprit est le gage donné par Dieu de la rédemption complète encore à venir.',
    },
    'romans-8:xr:1co-15-20': {
      title: 'Le Christ, prémices de la résurrection',
      explanation:
        'Paul applique la même image de la moisson au Christ, ressuscité comme « les prémices de ceux qui sont morts », que suivront « ceux qui appartiennent à Christ, lors de son avènement ». Romains 8 nomme le lien entre les deux moissons : l’Esprit de celui qui a ressuscité Jésus rendra aussi la vie à nos corps mortels (8.11), et nous qui avons les prémices de l’Esprit attendons « la rédemption de notre corps » (8.23).',
    },
    'romans-8:xr:2co-5-2': {
      title: 'Gémir dans cette tente',
      explanation:
        'Ici aussi, « nous gémissons dans cette tente » — le même verbe (στενάζω) qu’en Romains 8.23, où la LSG traduit « nous soupirons » —, dans le désir de revêtir la vie de la résurrection, et c’est Dieu « qui nous a donné les arrhes de l’Esprit ». Les deux passages tiennent ensemble les soupirs présents et la gloire future, avec l’Esprit comme garantie entre les deux.',
    },
    'romans-8:xr:eph-1-13': {
      title: 'L’Esprit, gage de l’héritage',
      explanation:
        'L’épître aux Éphésiens appelle le Saint-Esprit « un gage de notre héritage, pour la rédemption de ceux que Dieu s’est acquis » — la même logique qu’en Romains 8.17 et 8.23 : héritiers dès maintenant, héritage plénier et rédemption plus tard, avec l’Esprit comme garantie entre les deux. La note Tyndale sur 8.23 relie les deux passages.',
    },
    'romans-8:xr:ps-44-22': {
      title: '« Des brebis destinées à la boucherie »',
      explanation:
        'Paul cite le Psaume grec presque mot pour mot (Psaume 43.23 dans la numérotation de la Septante). Le Psaume 44 est la lamentation d’un peuple qui souffrait « à cause de toi » alors qu’il n’avait ni oublié Dieu ni violé son alliance. Le citer montre que la souffrance n’est pas le signe d’un rejet de la part de Dieu — les fidèles ont toujours souffert pour lui (Calvin fait la même remarque) —, et Paul répond aussitôt à la plainte du psaume : « dans toutes ces choses nous sommes plus que vainqueurs » (8.37).',
    },
    'romans-8:xr:isa-50-8': {
      title: '« Qui me condamnera? »',
      explanation:
        'Dans le troisième chant du Serviteur, celui-ci déclare : « Celui qui me justifie est proche… Qui me condamnera? » (Es 50.8–9). La LSG rejoint ici l’Ancien Testament grec, qui parle lui aussi de celui qui justifie (ὁ δικαιώσας με) — dans la traduction anglaise de Brenton, « he that has justified me draws near ». Le tribunal de Paul — « C’est Dieu qui justifie! Qui les condamnera? » — fait écho à la confiance du Serviteur et l’étend à tous ceux qui appartiennent au Christ.',
    },
    'romans-8:xr:gen-22-12': {
      title: '« Lui, qui n’a point épargné son propre Fils »',
      explanation:
        'Abraham fut loué parce qu’il n’avait pas refusé son fils unique (« tu ne m’as pas refusé ton fils, ton unique ») ; l’Ancien Testament grec dit οὐκ ἐφείσω — dans la traduction anglaise de Brenton, « thou hast not spared thy beloved son » —, le verbe même que Paul emploie en 8.32 (οὐκ ἐφείσατο). La note Tyndale voit Genèse 22 derrière les mots de Paul. Tout est dans le contraste : Isaac fut épargné au dernier moment ; le propre Fils de Dieu ne le fut pas.',
    },
    'romans-8:xr:heb-7-25': {
      title: 'Le Christ, toujours vivant pour intercéder',
      explanation:
        'L’épître aux Hébreux emploie le même verbe (ἐντυγχάνω) pour le Christ ressuscité : il est « toujours vivant pour intercéder en leur faveur ». Romains 8 présente deux intercesseurs — l’Esprit en nous (8.26–27) et le Christ à la droite de Dieu (8.34) —, et l’épître aux Hébreux fonde l’intercession du Christ sur son sacerdoce permanent.',
    },
    'romans-8:xr:ezk-36-26': {
      title: 'L’Esprit promis accomplit la loi',
      explanation:
        'Ézéchiel promettait un cœur nouveau et l’esprit même de Dieu au-dedans de son peuple : « Je mettrai mon esprit en vous, et je ferai en sorte que vous suiviez mes ordonnances » (voir aussi Jr 31.33 : la loi écrite dans le cœur). Paul ne cite pas Ézéchiel ici, mais beaucoup d’interprètes entendent cette promesse derrière 8.4 : « la justice de la loi » est accomplie « en nous, qui marchons, non selon la chair, mais selon l’esprit ». Ce que la loi ne pouvait faire de l’extérieur (8.3), l’Esprit promis le fait de l’intérieur.',
    },
    'romans-8:xr:rev-21-1': {
      title: '« Voici, je fais toutes choses nouvelles »',
      explanation:
        'Romains 8 voit la création attendre d’être « affranchie de la servitude de la corruption » ; la vision finale de l’Apocalypse décrit la même espérance : « un nouveau ciel et une nouvelle terre », plus de mort ni de douleur, et celui qui est assis sur le trône déclarant : « Voici, je fais toutes choses nouvelles. » La note Tyndale sur 8.19–21 cite Ap 21.1–2 : la création aura part aux bénédictions que Dieu a promises à son peuple. Les deux passages attendent le renouvellement du monde, non une évasion hors de lui.',
    },
    'romans-8:xr:2co-4-16': {
      title: 'Légères afflictions, gloire éternelle',
      explanation:
        'Paul fait ailleurs le même calcul : « nos légères afflictions du moment présent produisent pour nous, au-delà de toute mesure, un poids éternel de gloire ». Romains 8.18 dit que les souffrances présentes « ne sauraient être comparées » à la gloire à venir ; la deuxième épître aux Corinthiens ajoute que l’affliction travaille réellement à cette gloire — tout près de la promesse de 8.28.',
    },
  },

  context: {
    'romans-8:ctx:authorship': {
      title: 'Paul, écrivant de Corinthe, vers 57 apr. J.-C.',
      summary:
        'Paul a très probablement écrit l’épître aux Romains pendant un séjour de trois mois à Corinthe, vers la fin de son troisième voyage missionnaire (Ac 20.2–3), autour de 57 apr. J.-C. Il s’apprêtait à porter la collecte destinée à l’Église de Jérusalem (Rm 15.25–26) et espérait passer par Rome en se rendant en Espagne (15.24).',
      detail:
        'La recommandation de Phœbé, de Cenchrées — le port voisin de Corinthe (16.1) —, indique le lieu de rédaction. Paul n’était jamais allé à Rome (1.13) : la lettre le présente, lui et son Évangile, à une Église qu’il n’avait pas fondée.',
    },
    'romans-8:ctx:occasion': {
      title: 'Pourquoi Paul a écrit l’épître aux Romains',
      summary:
        'L’introduction Tyndale distingue trois buts : exposer l’Évangile de Paul tel qu’il l’avait forgé en quelque vingt-cinq ans, gagner le soutien de l’Église de Rome pour une mission en Espagne, et réparer une fracture entre croyants d’origine juive et d’origine païenne au sujet de la loi (14.1–15.13).',
      detail:
        'Romains 8 sert ces trois buts : c’est le point culminant de l’exposé de l’Évangile par Paul (chap. 5–8) ; il donne de l’assurance aux missionnaires et aux Églises dans la souffrance ; et son langage d’une seule famille d’enfants de Dieu — Juifs et païens criant ensemble « Abba! Père! » — fonde l’unité à laquelle il exhortera aux chapitres 14 et 15.',
    },
    'romans-8:ctx:audience': {
      title: 'Une Église de croyants juifs et païens à Rome',
      summary:
        'Les croyants de Rome se réunissaient dans plusieurs Églises de maison, peut-être fondées d’abord par des Juifs de Rome convertis à la Pentecôte (Ac 2.10). Après l’expulsion des Juifs de Rome par l’empereur Claude (datée d’ordinaire de 49 apr. J.-C. ; Ac 18.2), les chrétiens d’origine païenne ont probablement pris la direction de la communauté ; selon une reconstruction largement admise (que suit l’introduction Tyndale), des tensions au sujet de la loi sont apparues au retour des croyants juifs.',
      detail:
        'Le biographe romain Suétone rapporte que Claude chassa de Rome les Juifs, qui ne cessaient de s’agiter à l’instigation de « Chrestus » (Vie de Claude 25.4). Beaucoup d’historiens voient dans ce Chrestus une déformation du nom du Christ, bien que ce point soit débattu. Pour Romains 8, ce public mêlé compte : « Abba, Père » unit un mot araméen et un mot grec, et le langage paulinien de la filiation et de l’héritage puise dans l’histoire d’Israël pour une Église qui apprend à devenir une seule famille.',
    },
    'romans-8:ctx:adoption': {
      title: 'L’adoption dans le monde romain',
      summary:
        'Selon l’usage gréco-romain, un homme pouvait adopter un fils et lui conférer tous les droits et privilèges juridiques d’un enfant naturel, y compris l’héritage. La pratique touchait jusqu’à la famille impériale : Jules César adopta Octave, qui régna sous le nom d’Auguste.',
      detail:
        'Les lecteurs de Paul, dans la capitale, le savaient. Mais la pensée de Paul s’enracine aussi dans l’Ancien Testament, où Israël est le fils de Dieu (Ex 4.22 ; Os 11.1) et où « l’adoption » appartient à Israël (Rm 9.4). En Romains 8, l’adoption est à la fois un statut présent (8.15) et un accomplissement futur — « l’adoption, la rédemption de notre corps » (8.23).',
    },
    'romans-8:ctx:abba': {
      title: 'Abba : le mot araméen de la prière de Jésus',
      summary:
        'Abba est le mot araméen pour « père », dans la langue de tous les jours de la Galilée de Jésus. L’Évangile de Marc le conserve sur les lèvres de Jésus à Gethsémané (Mc 14.36), et Paul le cite deux fois comme le cri des croyants, chaque fois accompagné du mot grec pour « Père » (Rm 8.15 ; Ga 4.6).',
      detail:
        'Que ce mot araméen ait survécu sans traduction dans des Églises de langue grecque montre combien les premiers chrétiens tenaient à prier comme Jésus priait. C’était un mot familial courant, employé par des enfants jeunes ou adultes ; James Barr (1988) a soutenu que les données n’appuient pas l’affirmation populaire selon laquelle il signifierait « papa ». John Wesley pensait qu’en employant à la fois le mot araméen (qu’il appelle « syriaque ») et le mot grec, saint Paul semble évoquer le cri commun des croyants juifs et païens.',
    },
    'romans-8:ctx:exodus': {
      title: 'De l’esclavage à la filiation : le récit de l’Exode',
      summary:
        'Paul oppose « un esprit de servitude, pour être encore dans la crainte » à « un Esprit d’adoption » (8.15). Le récit fondateur d’Israël accomplit exactement ce passage : Dieu appelle Israël « mon fils, mon premier-né » et le fait sortir de l’esclavage en Égypte (Ex 4.22–23).',
      detail:
        'N. T. Wright soutient que Romains 5–8 raconte à nouveau l’Exode : le péché tient l’humanité en esclavage comme Pharaon tenait Israël ; la mort et la résurrection du Messie apportent la libération ; l’Esprit est donné là où Israël avait reçu la loi au Sinaï ; et une marche conduit vers l’héritage — désormais toute la création renouvelée (8.17–25). Tous les lecteurs ne trouvent pas ce schéma aussi omniprésent, mais le vocabulaire « servitude… fils… héritiers » de 8.14–17 puise clairement dans l’histoire d’Israël (note Tyndale sur 8.14).',
    },
    'romans-8:ctx:firstfruits': {
      title: 'L’offrande des prémices',
      summary:
        'Au début de la moisson, Israël apportait au sacrificateur la première gerbe de grain, qu’il agitait devant l’Éternel ; alors seulement on pouvait manger de la nouvelle récolte (Lv 23.9–14 ; voir aussi Ex 23.19).',
      detail:
        'La première part était consacrée à Dieu et servait de gage de la moisson entière. Paul applique cette image à l’Esprit déjà donné aux croyants (Rm 8.23) et, ailleurs, à la résurrection du Christ, la première d’une multitude (1 Co 15.20).',
    },
    'romans-8:ctx:suffering': {
      title: 'Des épreuves bien réelles derrière la liste de 8.35',
      summary:
        '« La tribulation, ou l’angoisse, ou la persécution, ou la faim, ou la nudité, ou le péril, ou l’épée » : ce n’est pas un effet de rhétorique. Paul énumère le même genre d’épreuves tirées de son propre ministère — « à la faim et à la soif, … au froid et à la nudité » (2 Co 11.27) —, et il écrit à une Église dont certains membres avaient déjà connu l’expulsion de la ville.',
      detail:
        'En citant le Psaume 44.22 en 8.36, Paul place ces souffrances dans la longue lignée du peuple fidèle de Dieu qui a souffert « à cause de toi ». L’assurance du chapitre est offerte à des gens pour qui ces menaces étaient des possibilités réelles, non à des gens installés dans le confort.',
    },
  },

  literary: {
    placeInBook:
      'Romains 8 clôt le deuxième grand mouvement de l’épître (chap. 5–8), dans lequel Paul assure les croyants que le salut commencé par Dieu sera mené à son terme. Le chapitre 5 annonçait la paix avec Dieu et le renversement du péché d’Adam ; les chapitres 6 et 7 montraient que ni le péché ni la loi ne peuvent faire échouer le dessein de Dieu. Le chapitre 8 rassemble le tout : l’Esprit libère de la mort (8.1–17) et donne aux croyants l’assurance que la souffrance ne les empêchera pas de parvenir à la gloire (8.18–39). Les chapitres 9 à 11 abordent ensuite la question que cela soulève : si les desseins de Dieu ne peuvent échouer, qu’en est-il d’Israël ?',
    argument:
      'Paul avance en trois temps. (1) 8.1–17 : parce que Dieu a condamné le péché dans la chair du Christ, l’Esprit donne la vie que la loi ne pouvait donner, et ceux qui sont conduits par l’Esprit sont enfants et héritiers de Dieu. (2) 8.18–30 : les héritiers partagent dès maintenant les souffrances du Christ ; la création et les croyants soupirent, et l’Esprit intercède « par des soupirs inexprimables », mais l’espérance repose sur le dessein de Dieu, qui va de la prescience à la gloire. (3) 8.31–39 : un tribunal en questions — qui sera contre nous, qui accusera, qui condamnera, qui séparera ? —, qui s’achève sur la certitude que rien ne peut nous séparer de l’amour de Dieu en Jésus-Christ.',
    placeInCanon:
      'Romains 8 rassemble des fils tirés de toute la Bible : la création soumise à la vanité après Genèse 3 et qui attend son renouvellement ; Israël, fils premier-né de Dieu, arraché à l’esclavage (Ex 4.22) ; les prémices de la moisson (Lv 23) ; la promesse de l’Esprit même de Dieu au-dedans de son peuple (Ez 36.26–27) ; et la confiance du Serviteur que Dieu le justifiera (Es 50.8–9). Il annonce le nouveau ciel et la nouvelle terre de l’Apocalypse (Ap 21.1–5).',
    bookOutline: [
      'Salutation et thème : la bonne nouvelle de la justice de Dieu',
      'Tous ont péché : païens et Juifs sous le péché',
      'La justice par la foi en Christ ; Abraham',
      'L’assurance du salut : Adam et le Christ, le péché, la loi et l’Esprit',
      'La fidélité de Dieu envers Israël',
      'La vie transformée et l’unité de l’Église',
      'Projets missionnaires de Paul, salutations et doxologie',
    ],
    passageOutline: [
      'Aucune condamnation : l’Esprit fait ce que la loi ne pouvait faire',
      'La chair et l’Esprit : deux manières de vivre',
      'Enfants et héritiers : l’Esprit d’adoption',
      'Soupirs et espérance : la création, les croyants et l’Esprit',
      'Le dessein de Dieu : toutes choses pour le bien',
      'Aucune séparation : le tribunal de l’amour de Dieu',
    ],
    features: {
      'romans-8:lit:inclusio': {
        title: 'Aucune condamnation… aucune séparation — « en Jésus-Christ »',
        description:
          'Le chapitre s’ouvre et se ferme sur la même expression : « aucune condamnation pour ceux qui sont en Jésus-Christ » (8.1), et rien « ne pourra nous séparer de l’amour de Dieu manifesté en Jésus-Christ notre Seigneur » (8.39). En grec, 8.1 se termine par ἐν Χριστῷ Ἰησοῦ, et 8.39 par ἐν Χριστῷ Ἰησοῦ τῷ κυρίῳ ἡμῶν. Ce cadre révèle la logique du chapitre : l’union avec le Christ est à la fois le fondement du verdict et la garantie de l’amour.',
        structure: [
          { label: '8.1', text: 'Aucune condamnation — pour ceux qui sont en Jésus-Christ' },
          { label: '8.2–38', text: 'La vie par l’Esprit, l’adoption, les soupirs et l’espérance, le dessein de Dieu, le tribunal' },
          { label: '8.39', text: 'Aucune séparation — d’avec l’amour de Dieu en Jésus-Christ notre Seigneur' },
        ],
      },
      'romans-8:lit:spirit-repetition': {
        title: 'L’Esprit, vingt et une fois',
        description:
          'Le mot πνεῦμα revient 21 fois dans ce chapitre — plus que dans tout autre chapitre du Nouveau Testament —, après seulement cinq emplois en Romains 1–7. « Chair » (σάρξ) se concentre dans la première moitié (13 fois en 8.3–13), puis disparaît, lorsque le chapitre passe de l’opposition chair/Esprit à l’œuvre de l’Esprit dans la souffrance et l’espérance.',
      },
      'romans-8:lit:three-groans': {
        title: 'Trois soupirs',
        description:
          'La création « soupire » (8.22, συστενάζει), « nous aussi nous soupirons en nous-mêmes » (8.23, στενάζομεν), et l’Esprit intercède « par des soupirs inexprimables » (8.26, στεναγμοῖς) — la LSG conserve la répétition. Cette racine reprise relie la frustration du monde, l’attente du croyant et la prière de l’Esprit en un seul mouvement vers la rédemption.',
        structure: [
          { label: '8.22', text: 'La création soupire, comme dans les douleurs de l’enfantement' },
          { label: '8.23', text: 'Nous soupirons, dans l’attente de l’adoption et de la rédemption du corps' },
          { label: '8.26', text: 'L’Esprit intercède par des soupirs sans paroles' },
        ],
      },
      'romans-8:lit:golden-chain': {
        title: 'La « chaîne d’or » de 8.29–30',
        description:
          'Cinq verbes forment une chaîne dont chaque maillon reprend le précédent : connus d’avance → prédestinés → appelés → justifiés → glorifiés. L’exposé de l’épître aux Romains dans le Commentaire de Matthew Henry — rédigé après la mort de Henry (1714) par le pasteur non conformiste John Evans, l’un de ceux qui achevèrent l’ouvrage — y voit une chaîne d’or qui ne peut être rompue. Fait frappant, « glorifiés » est au passé, alors qu’ailleurs dans le chapitre la gloire est encore à venir (8.18, 21) ; la note Tyndale l’explique comme la décision arrêtée de Dieu, aussi certaine que si elle était déjà accomplie.',
        structure: [
          { label: 'connus d’avance', text: 'Ceux qu’il a connus d’avance…' },
          { label: 'prédestinés', text: '…il les a aussi prédestinés à être semblables à l’image de son Fils' },
          { label: 'appelés', text: 'Ceux qu’il a prédestinés, il les a aussi appelés' },
          { label: 'justifiés', text: 'Ceux qu’il a appelés, il les a aussi justifiés' },
          { label: 'glorifiés', text: 'Ceux qu’il a justifiés, il les a aussi glorifiés' },
        ],
      },
      'romans-8:lit:courtroom': {
        title: 'Un tribunal en questions (8.31–39)',
        description:
          'Paul termine par une cascade de questions rhétoriques — « Si Dieu est pour nous, qui sera contre nous? » « Qui accusera les élus de Dieu? » « Qui les condamnera? » « Qui nous séparera de l’amour de Christ? » —, chacune trouvant sa réponse dans ce que Dieu a fait en Christ, le fondement même sur lequel repose le verdict de 8.1. Les énumérations de 8.35 et de 8.38–39 donnent à la conclusion une qualité rythmée, presque hymnique, même si elle reste une argumentation.',
      },
    },
  },

  theology: {
    'romans-8:th:no-condemnation': {
      title: 'Aucune condamnation : le verdict et la vie nouvelle',
      summary:
        'Parce que Dieu a condamné le péché dans la chair de son Fils, envoyé en sacrifice pour le péché (8.3), ceux qui sont en Jésus-Christ ne sont sous le coup d’aucune sentence de condamnation (8.1), et, au dernier jour, aucune accusation ne peut tenir contre les élus de Dieu (8.33–34).',
      detail:
        'Les chrétiens de toutes les traditions confessent que les croyants sont libérés de la condamnation par la mort et la résurrection du Christ. Les protestants mettent l’accent sur le verdict judiciaire — Calvin, sur 8.34 : il ne reste aucune condamnation lorsque satisfaction a été donnée aux lois et que la peine est déjà payée —, mais Calvin insistait aussi sur le fait que la grâce de la régénération n’est jamais séparée de l’imputation de la justice (sur 8.2). Jean Chrysostome lisait 8.1 comme une libération non seulement des péchés passés, mais en vue d’une vie nouvelle rendue possible par l’Esprit. Les traditions divergent pourtant sur la manière dont verdict et renouvellement s’articulent. Les confessions protestantes distinguent la justification — Dieu pardonne aux pécheurs et les accepte comme justes à cause du Christ, non en leur infusant la justice (Confession de Westminster 11.1) — de la sanctification qui l’accompagne toujours (chap. 13), tandis que le concile de Trente a défini la justification elle-même comme n’étant pas seulement la rémission des péchés, mais aussi la sanctification et le renouvellement de l’homme intérieur. Romains 8 tient ensemble verdict et vie nouvelle ; la façon dont les deux s’articulent reste une différence confessionnelle.',
    },
    'romans-8:th:spirit': {
      title: 'L’Esprit qui habite en nous',
      summary:
        'L’Esprit est « l’Esprit de Dieu » et « l’Esprit de Christ » (8.9). Il habite en chaque croyant, donne la vie maintenant et la résurrection plus tard (8.10–11), conduit les enfants de Dieu (8.14), rend témoignage à leur esprit (8.16) et intercède dans leur faiblesse (8.26–27).',
      detail:
        'Romains 8 est l’un des chapitres les plus trinitaires du Nouveau Testament : le Père envoie le Fils (8.3), le ressuscite (8.11) et entend l’intercession de l’Esprit (8.27) ; le Fils meurt, ressuscite et intercède (8.34) ; l’Esprit habite, conduit et prie. L’Esprit ne supprime pas la responsabilité humaine et ne rend pas le péché impossible, mais il est la puissance décisive de la vie chrétienne (note Tyndale sur 8.9).',
    },
    'romans-8:th:adoption': {
      title: 'L’adoption : enfants et héritiers',
      summary:
        'Les croyants ont reçu « un Esprit d’adoption, par lequel nous crions: Abba! Père! » ; enfants, ils sont « héritiers de Dieu, et cohéritiers de Christ » (8.15–17), même si l’adoption plénière — la rédemption du corps — est encore attendue (8.23).',
      detail:
        'J. I. Packer plaçait l’adoption au sommet des bienfaits de l’Évangile, au-dessus même de la justification : la justification règle notre situation devant Dieu comme juge, tandis que l’adoption nous fait entrer dans sa famille comme ses enfants ; et Packer exhortait les chrétiens à comprendre toute leur vie à cette lumière. Cette famille est aussi une famille qui souffre : les cohéritiers souffrent avec le Christ, « afin d’être glorifiés avec lui » (8.17).',
    },
    'romans-8:th:mortification': {
      title: 'Faire mourir le péché par l’Esprit',
      summary:
        '« Si par l’Esprit vous faites mourir les actions du corps, vous vivrez » (8.13). La libération de la condamnation ne met pas fin au combat contre le péché ; elle le rend possible et plein d’espérance, parce qu’il est mené par l’Esprit.',
      detail:
        'L’ouvrage de John Owen, Of the Mortification of Sin in Believers (1656), est bâti sur ce verset. Sa thèse : les croyants les plus éminents, bien qu’assurément libérés de la puissance condamnatrice du péché, doivent pourtant faire, tous les jours de leur vie, leur affaire de mortifier la puissance du péché qui habite en eux. Owen avertissait aussi que la mortification entreprise par ses propres forces, en vue de sa propre justice, est l’essence même de la fausse religion : la mortification est l’œuvre de l’Esprit.',
    },
    'romans-8:th:new-creation': {
      title: 'Soupirs et gloire : la rédemption de la création et des corps',
      summary:
        'La création tout entière, « soumise à la vanité » mais « avec l’espérance », attend avec un ardent désir d’être « affranchie de la servitude de la corruption » lorsque les enfants de Dieu seront révélés dans la gloire ; les croyants attendent eux aussi « la rédemption de notre corps » (8.19–23).',
      detail:
        'Dans Romains 8, l’espérance chrétienne n’est pas une évasion hors du monde matériel, mais sa libération, avec la résurrection du corps. L’Esprit est les prémices de cette moisson (8.23). N. T. Wright en tire une conséquence pratique : si le peuple de Dieu doit hériter de la création libérée, il devrait prendre soin de l’ordre créé dès maintenant.',
    },
    'romans-8:th:providence': {
      title: 'Le dessein de Dieu et la sécurité du croyant',
      summary:
        'Pour ceux qui aiment Dieu et sont appelés selon son dessein, Dieu fait concourir toutes choses au bien — le bien d’être rendus semblables à son Fils (8.28–29). Rien dans toute la création ne peut les séparer de son amour en Jésus-Christ (8.38–39).',
      detail:
        'Toutes les traditions chrétiennes lisent 8.28–39 comme une assurance donnée aux croyants dans la souffrance. Elles divergent sur la relation entre la prescience et la prédestination divines, d’une part, et la foi et la persévérance humaines, d’autre part (voir les perspectives sur 8.29–30), mais s’accordent sur ceci : le fondement de la confiance est l’amour de Dieu, manifesté en ce qu’il n’a pas épargné son propre Fils (8.32).',
    },
  },

  perspectives: {
    'romans-8:ps:foreknowledge': {
      question: 'Que veut dire Paul quand il écrit que Dieu les a « connus d’avance » et « prédestinés » (8.29–30) ?',
      intro:
        'Toutes les traditions chrétiennes affirment que le salut prend sa source dans le dessein de grâce de Dieu et que Paul a écrit 8.29–30 pour donner de l’assurance. Elles divergent sur la relation entre la prescience de Dieu et la foi humaine, et sur la question de savoir si chaque maillon de la chaîne vaut toujours pour les mêmes personnes.',
      commonGround:
        'Toutes s’accordent à dire que le salut naît de l’initiative de la grâce de Dieu, que nul n’est sauvé en dehors de la grâce et de la foi en Christ, que le but de la prédestination est la conformité à l’image du Fils, et que Paul a écrit 8.28–39 pour donner de l’assurance aux croyants éprouvés, non pour inviter à la spéculation.',
      perspectives: {
        'romans-8:ps:foreknowledge:reformed': {
          tradition: 'Réformée',
          label: 'La prescience comme amour électif ; une chaîne indestructible',
          summary:
            'La prescience de Dieu est son choix préalable et personnel d’attacher son amour à des personnes particulières — l’objet de « connus d’avance », ce sont des personnes (« ceux »), non leurs choix prévus —, et chaque maillon suit infailliblement : tous les prédestinés sont appelés, tous les appelés justifiés, tous les justifiés glorifiés. La Confession de Westminster (3.5, qui cite Rm 8.30) affirme que Dieu a choisi sans aucune prévision de la foi ou des bonnes œuvres ; les Canons de Dordrecht (I.9), que l’élection n’a pas été fondée sur la foi prévue. R. C. Sproul et John Piper défendent cette lecture dans des sermons sur ce passage.',
        },
        'romans-8:ps:foreknowledge:wesleyan': {
          tradition: 'Arminienne / wesleyenne',
          label: 'L’élection de ceux dont Dieu a prévu qu’ils croiraient ; la chaîne comme méthode de Dieu',
          summary:
            'Dieu, en Christ, a résolu de sauver ceux qui, par la grâce, croiraient et persévéreraient (Articles des Remontrants, 1610, art. I). La grâce vient en premier : les Articles enseignent que l’homme déchu ne peut de lui-même penser, vouloir ni faire rien de vraiment bon, pas même la foi qui sauve, mais qu’il doit être régénéré par Dieu en Christ, par le Saint-Esprit (art. III) ; que même le régénéré ne peut faire aucun bien sans la grâce prévenante ou secourable, qui éveille, accompagne et coopère ; et que cette grâce n’est pas irrésistible (art. IV). John Wesley lisait 8.29–30 comme la description de la méthode par laquelle Dieu nous conduit pas à pas vers le ciel : Paul, soutenait-il, n’affirme pas que ce soit exactement le même nombre d’hommes qui sont appelés, justifiés et glorifiés.',
        },
        'romans-8:ps:foreknowledge:lutheran': {
          tradition: 'Luthérienne',
          label: 'L’élection, cause du salut et jamais de la damnation — à chercher en Christ',
          summary:
            'La Formule de Concorde (art. XI) distingue la prescience de Dieu, qui s’étend à tous, de l’élection, qui ne concerne que les enfants de Dieu, bons et bien-aimés, et qui est la cause de leur salut. Elle rejette pourtant toute prédestination à la damnation : le Christ désire sincèrement que tous les hommes viennent à lui, et ceux qui périssent le font par leur propre mépris de la Parole. L’élection ne doit pas être scrutée dans le conseil caché de Dieu, mais en Christ et dans l’Évangile — et, selon l’ordre suivi par Paul dans l’épître aux Romains, enseignée après la repentance et la foi, pour consoler. La Préface de Luther à l’épître aux Romains recommandait déjà cet ordre : fixer d’abord son attention sur le Christ et l’Évangile, combattre le péché comme l’enseignent les chapitres 1 à 8, et seulement ensuite, sous la croix et la souffrance du chapitre 8, apprendre des chapitres 9 à 11 la consolation de la providence de Dieu. (La Formule elle-même date de 1577, trois décennies après la mort de Luther.)',
        },
        'romans-8:ps:foreknowledge:catholic': {
          tradition: 'Catholique',
          label: 'Une prédestination gracieuse, avec une libre coopération',
          summary:
            'Le concile de Trente enseigne que la justification commence par la grâce prévenante de Dieu, qui appelle les hommes sans aucun mérite de leur part ; ceux-ci y sont ensuite disposés en consentant librement à cette grâce et en coopérant avec elle — et ils peuvent la rejeter (session VI, chap. 5). Il met en garde contre la présomption de se croire, en dehors d’une révélation spéciale, certainement au nombre des prédestinés (chap. 12), et rejette l’idée que ceux qui sont appelés sans être sauvés aient été prédestinés au mal (canon 17). Dans ces limites, les théologiens catholiques divergent : les thomistes tiennent une prédestination à la gloire antérieure aux mérites prévus, beaucoup de molinistes une prédestination en vue de ces mérites.',
        },
        'romans-8:ps:foreknowledge:orthodox': {
          tradition: 'Orthodoxe',
          label: 'Une prescience sans contrainte ; partager par grâce la ressemblance du Fils',
          summary:
            'La tradition orientale lit ce passage en termes de prescience divine et de libre réponse humaine. Jean Chrysostome soulignait que l’appel ne leur a été ni imposé ni rendu contraignant : tous ont été appelés, mais tous n’ont pas obéi à l’appel ; et Jean Damascène enseignait que Dieu connaît tout d’avance sans pour autant tout prédéterminer. L’accent porte sur le but de 8.29, que Chrysostome formule ainsi : ce que le Fils unique était par nature, eux aussi le sont devenus par grâce.',
        },
      },
    },
    'romans-8:ps:groanings': {
      question: 'Que sont les « soupirs inexprimables » de 8.26 ?',
      intro:
        'Des interprètes attentifs hésitent réellement : qui soupire, et s’agit-il d’une prière audible ? La question touche à la façon dont les chrétiens comprennent la prière dans la faiblesse, non à une doctrine centrale.',
      commonGround:
        'Tous s’accordent à dire que l’Esprit vient en aide aux croyants précisément lorsqu’ils ne savent pas comment prier, et que Dieu comprend une prière qui ne peut se mettre en mots et l’exauce, puisque l’Esprit intercède « selon Dieu » (8.27).',
      perspectives: {
        'romans-8:ps:groanings:spirit': {
          tradition: 'Lecture moderne courante',
          label: 'L’intercession sans paroles de l’Esprit lui-même',
          summary:
            'Les soupirs appartiennent à l’Esprit, non à nous : lorsque nous ne savons pas comment prier, l’Esprit lui-même intercède auprès de Dieu d’une manière qui ne peut se dire en mots, et le Père, qui sonde les cœurs, comprend (8.27). C’est la lecture de la note d’étude Tyndale.',
        },
        'romans-8:ps:groanings:prompted': {
          tradition: 'Commentaire et prédication réformés (Calvin, Spurgeon)',
          label: 'Nos soupirs, suscités par l’Esprit',
          summary:
            'L’Esprit ne soupire pas au sens propre ; il suscite chez les croyants des aspirations trop profondes pour leurs propres mots, et celles-ci lui sont attribuées. Selon Calvin, l’Esprit intercède non parce qu’il s’abaisserait réellement à prier ou à gémir, mais parce qu’il éveille dans nos cœurs les désirs que nous devons avoir. Spurgeon dit la même chose dans son sermon sur ces versets (1880).',
        },
        'romans-8:ps:groanings:charism': {
          tradition: 'Patristique (Jean Chrysostome)',
          label: 'Un don spirituel de prière dans l’Église primitive',
          summary:
            'Chrysostome expliquait ce verset par les dons de l’Église apostolique : à côté de la prophétie et des langues existait un don de prière, appelé lui aussi « esprit », accordé à quelqu’un qui priait avec gémissements pour toute l’Église. Le mot « Esprit » désigne ici, soutenait-il, cette grâce et la personne spirituelle qui la reçoit — non directement le Consolateur.',
        },
        'romans-8:ps:groanings:ecstatic': {
          tradition: 'Certains interprètes',
          label: 'Une prière inarticulée ou extatique',
          summary:
            'Certains comprennent l’expression comme une prière qui ne prend pas la forme du langage humain — des sons émis lorsque les croyants ne savent que demander. La note Tyndale mentionne cette possibilité tout en concluant que les soupirs sont ceux de l’Esprit. Pour beaucoup de lecteurs, l’adjectif « inexprimables » rend moins probable une allusion à une parole audible.',
        },
      },
    },
    'romans-8:ps:romans-7': {
      question: 'Qui est le « je » en lutte de Romains 7.14–25, juste avant « aucune condamnation » ?',
      intro:
        'La façon de lire 8.1 dépend en partie de l’identité de celui qui parle en 7.14–25 : un chrétien qui combat encore le péché, une personne sous la loi et sans l’Esprit, ou Israël sous la Torah. Le débat est ancien et reste ouvert.',
      commonGround:
        'Tous s’accordent à dire que 8.1 répond au cri de 7.24, que les croyants doivent encore faire mourir le péché (8.13), et que la différence décisive est l’union avec le Christ et le don de l’Esprit.',
      perspectives: {
        'romans-8:ps:romans-7:believer': {
          tradition: 'Luthérienne et réformée',
          label: 'Le combat permanent du croyant',
          summary:
            'Paul décrit sa vie de croyant : les régénérés combattent encore le péché qui habite en eux, et pourtant — comme le dit aussitôt 8.1 — ils ne sont pas condamnés. La Préface de Luther à l’épître aux Romains explique qu’au chapitre 7 saint Paul se dépeint encore comme pécheur, tandis qu’au chapitre 8 il affirme qu’il n’y a rien de condamnable en ceux qui sont en Christ ; Calvin ouvre son commentaire de 8.1 en évoquant le combat que les fidèles mènent sans cesse contre leur propre chair ; et Spurgeon disait n’avoir jamais su ce que c’était que d’être sorti de Romains 7 — ni, d’ailleurs, de Romains 8.',
        },
        'romans-8:ps:romans-7:under-law': {
          tradition: 'Pères grecs et tradition wesleyenne',
          label: 'La vie sous la loi, avant l’Esprit',
          summary:
            'Jean Chrysostome lisait « je suis charnel » comme l’esquisse de l’homme qui vit sous la Loi et avant la Loi — l’humanité sans la grâce —, de sorte que le chapitre 8 décrit une délivrance réelle de cette condition. John Wesley voyait de même en 7.7–25 un homme qui raisonne, gémit, lutte et passe de l’état légal à l’état évangélique.',
        },
        'romans-8:ps:romans-7:israel': {
          tradition: 'Exégèse paulinienne contemporaine',
          label: 'Israël sous la Torah',
          summary:
            'N. T. Wright soutient que le « je » de Paul exprime l’histoire d’Israël lui-même sous la Torah : quand la loi est venue, Israël a répété la chute d’Adam et, tout en voulant le bien, est resté « en Adam » — jusqu’à ce que Dieu règle le problème du péché dans le Messie et donne l’Esprit pour faire ce qui était impossible à la loi (8.1–11).',
        },
      },
    },
  },

  commentary: {
    'romans-8:cm:chrysostom-8-28': {
      lead: 'Sur « toutes choses concourent au bien » (8.28)',
      quoteTranslation:
        'Or, quand il parle de toutes choses, il mentionne même celles qui semblent pénibles. … Aussi ne dit-il pas qu’aucune affliction n’atteint ceux qui aiment Dieu, mais que cela concourt à leur bien, c’est-à-dire que Dieu se sert des épreuves mêmes pour rendre dignes d’approbation ceux qui sont ainsi en butte aux complots.',
    },
    'romans-8:cm:chrysostom-8-29': {
      lead: 'Sur le fait d’être « semblables à l’image de son Fils » (8.29)',
      quoteTranslation: 'Car ce que le Fils unique était par nature, eux aussi le sont devenus par grâce.',
    },
    'romans-8:cm:luther-8-1': {
      lead: 'Sur la manière dont le chapitre 8 répond au combat du chapitre 7',
      quoteTranslation: 'Au chapitre 8, saint Paul console de tels combattants et leur dit que cette chair ne leur vaudra pas la condamnation.',
    },
    'romans-8:cm:calvin-8-34': {
      lead: 'Sur « Qui les condamnera? » (8.34)',
      quoteTranslation:
        'De même que nul accusateur ne peut l’emporter quand le juge absout, de même il ne reste aucune condamnation quand satisfaction est donnée aux lois et que la peine est déjà payée.',
    },
    'romans-8:cm:owen-8-13': {
      lead: 'Sur « faites mourir les actions du corps » (8.13)',
      quoteTranslation:
        'Vous, mortifiez ; faites-en votre ouvrage de chaque jour ; appliquez-vous-y sans relâche tant que vous vivez ; ne cessez pas un seul jour cette œuvre ; tuez le péché, ou c’est lui qui vous tuera.',
    },
    'romans-8:cm:wesley-8-16': {
      lead: 'Sur « L’Esprit lui-même rend témoignage à notre esprit » (8.16)',
      quoteTranslation:
        'Avec l’esprit de tout vrai croyant, par un témoignage distinct de celui de son propre esprit, ou du témoignage d’une bonne conscience.',
    },
    'romans-8:cm:spurgeon-8-1': {
      lead: 'Sur le fait de combattre sans être condamné (8.1)',
      quoteTranslation:
        'Le fait est que les croyants sont dans un état de combat, mais non dans un état de condamnation ; et qu’au moment même où le combat est le plus acharné, le croyant est toujours justifié.',
    },
    'romans-8:cm:packer-8-15': {
      lead: 'Sur l’adoption, plus grand bienfait de l’Évangile (8.14–17)',
      text: 'Packer place l’adoption tout en haut des bienfaits de l’Évangile, au-dessus même de la justification. La justification règle notre situation devant Dieu en tant que juge ; l’adoption fait de nous des membres de sa famille, Dieu étant notre Père et nous ses enfants et ses héritiers. Packer soutient ensuite que toute la vie chrétienne doit être comprise, et vécue, à la lumière de cette condition d’enfant de Dieu.',
    },
    'romans-8:cm:wright-8-17': {
      lead: 'Sur Romains 8 comme nouvel Exode (8.12–25)',
      text: 'Wright lit Romains 5–8 comme un nouveau récit de l’Exode : le péché asservit comme l’Égypte, la mort et la résurrection du Messie libèrent, l’Esprit prend la place qu’avait la Torah au Sinaï, et les enfants de Dieu ne doivent pas retourner à l’esclavage (8.12–17). Leur héritage n’est plus un seul pays, mais la création tout entière, affranchie de la servitude — si bien que Romains 8 accomplit la promesse de Romains 4.13 selon laquelle la famille d’Abraham hériterait du monde.',
    },
    'romans-8:cm:piper-8-1': {
      lead: 'Sur le « maintenant » de « aucune condamnation » (8.1)',
      text: 'Piper entend deux sens dans le mot « maintenant » employé par Paul. C’est maintenant enfin : à la croix, Dieu a condamné le péché dans la chair du Christ (8.3), si bien que le Fils a porté la sentence que les pécheurs avaient encourue. Et c’est maintenant déjà : bien que le jugement dernier soit encore à venir, ceux qui sont en Christ peuvent en connaître l’issue par avance (8.33–34). Ce don appartient à ceux qui sont en Christ, et tous sont invités à venir à lui.',
    },
    'romans-8:cm:keller-8-1': {
      lead: 'Sur l’expérience de Dieu par l’Esprit (8.1–4)',
      text: 'Keller se demande comment les croyants peuvent connaître la présence de Dieu dans leur propre expérience, et sa réponse est l’œuvre du Saint-Esprit. Dans sa lecture de Romains 8, l’Esprit nous unit au Christ et à tout ce qu’il a accompli, et nous assure ainsi que rien ne peut nous séparer de l’amour de Dieu (8.39). De 8.1–4, il tire deux vérités à tenir ensemble : le combat contre le péché se poursuit dans la vie chrétienne, et pourtant il n’y a aucune condamnation (8.1).',
    },
    'romans-8:cm:sproul-8-29': {
      lead: 'Sur la « chaîne d’or » de 8.29–30',
      text: 'Sproul soutient que rien dans le texte ne fait dépendre la prédestination de la prescience ; cette conclusion n’est tirée que de l’ordre des verbes. Dieu a connu d’avance des personnes, non leurs décisions, au sens personnel et aimant du verbe « connaître », et la chaîne tient sans aucun maillon rompu. Il oppose cette lecture à la conception dite de la prescience (l’élection fondée sur la foi prévue), qu’il fait remonter à la modification de la pensée de Luther par Melanchthon et qu’il considère comme la position majoritaire parmi les évangéliques d’aujourd’hui.',
    },
  },

  sermons: {
    'romans-8:sermon:spurgeon-1917': {
      summary:
        'Spurgeon refuse de séparer Romains 7 de Romains 8 : le croyant vit dans les deux à la fois, combattant le péché intérieur tout en étant pleinement justifié — dans un état de combat, mais non dans un état de condamnation. Il met en garde contre un message d’absence de condamnation qui nierait les menaces de la loi, décrit la position du croyant « en Jésus-Christ », relève que la proposition de 8.1 sur ceux qui ne marchent pas selon la chair n’est pas originale (la Revised Version anglaise l’omet), et conclut par l’absolution du croyant.',
    },
    'romans-8:sermon:spurgeon-1532': {
      summary:
        'Un sermon en trois parties : le secours que donne le Saint-Esprit, la prière qu’il inspire et le succès assuré de ces prières. Spurgeon enseigne que l’Esprit guide les requêtes des croyants et intercède, non en gémissant lui-même, mais en suscitant en eux des désirs intenses et des soupirs inexprimables, qui lui sont attribués — et que ces prières sont exaucées, parce qu’elles sont selon la volonté de Dieu.',
    },
    'romans-8:sermon:piper-2001': {
      summary:
        'Piper tient 8.1 pour un verset central du message chrétien et explique son « maintenant » de deux façons : l’attente est terminée, puisque Dieu a condamné le péché dans la chair du Christ (8.3) ; et l’issue du jugement dernier est réglée par avance pour ceux qui sont en Christ (8.33–34).',
    },
    'romans-8:sermon:keller-1997': {
      summary:
        'Keller lit la fin de Romains 8 comme le point culminant de l’œuvre de l’Esprit : donner aux croyants la ferme assurance que rien ne peut les séparer de l’amour de Dieu. Ce qui manque aux croyants, suggère-t-il, c’est d’en être convaincus, et l’Esprit leur donne cette conviction face aux doutes qui viennent à la fois de l’intérieur et de l’extérieur.',
    },
    'romans-8:sermon:sproul-2006': {
      summary:
        'Sproul replace 8.29–30 dans l’histoire du débat, depuis les Remontrants et le synode de Dordrecht, et plaide pour l’élection inconditionnelle : dans ce texte, la prescience désigne la connaissance personnelle et aimante que Dieu a des personnes, non la prévision de leurs choix.',
    },
  },

  verseNotes: {
    'ROM.8.1': [
      '« Donc » tire la conclusion des chapitres 5 à 7 : pour ceux qui sont « en Jésus-Christ », il n’y a maintenant aucune condamnation — ni verdict défavorable, ni peine (κατάκριμα, mot que Paul n’emploie qu’ici et en 5.16–18). Le verset suit immédiatement le combat de 7.14–25, et c’est pourquoi Spurgeon pouvait dire que les croyants sont dans un état de combat, mais non dans un état de condamnation. Les mots supplémentaires que portent l’Ostervald et la KJV anglaise — « qui marchent, non selon la chair, mais selon l’esprit » — ne se trouvent que dans la tradition manuscrite byzantine, plus tardive (le Textus Receptus, sur lequel reposent ces deux versions), et sont absents des manuscrits les plus anciens. La plupart des traductions modernes, dont la LSG et Darby, n’ont cette phrase qu’en 8.4 ; la NCL en garde une partie entre crochets.',
    ],
    'ROM.8.3': [
      'La loi ne pouvait pas nous libérer — non parce qu’elle était mauvaise, mais parce que « la chair la rendait sans force » : elle pouvait commander, non donner la force d’obéir. Dieu a donc envoyé « son propre Fils dans une chair semblable à celle du péché » : pleinement homme, mais sans péché. L’expression grecque rendue par « à cause du péché » (περὶ ἁμαρτίας) est celle qu’emploie l’Ancien Testament grec pour le sacrifice pour le péché (note Tyndale). À la croix, Dieu « a condamné le péché dans la chair » : la sentence est tombée sur le péché en Christ, afin qu’elle ne tombe pas sur ceux qui sont en lui.',
    ],
    'ROM.8.9': [
      'Paul présuppose que tout croyant a l’Esprit : « Si quelqu’un n’a pas l’Esprit de Christ, il ne lui appartient pas. » Dans une même phrase, le même Esprit est « l’Esprit de Dieu » et « l’Esprit de Christ ». Là où la LSG traduit « selon l’esprit », le grec dit littéralement « dans l’Esprit » (ainsi Darby et la NCL) : il ne s’agit pas d’une catégorie supérieure de chrétiens, mais du domaine nouveau dans lequel vit tout croyant. L’Esprit ne supprime pas la responsabilité et ne rend pas le péché impossible, mais il est la puissance la plus forte dans la vie du croyant (note Tyndale).',
    ],
    'ROM.8.12': [
      '« Nous ne sommes point redevables à la chair » : le mot grec est « débiteurs » (ὀφειλέται ; Darby traduit littéralement « nous sommes débiteurs »). Paul commence à dire ce que nous devons, mais n’en énonce que le côté négatif : nous ne devons rien à la chair. Jean Chrysostome a remarqué que Paul le formule de manière plus frappante qu’un simple ordre de ne pas vivre selon la chair : le créancier sous-entendu, c’est l’Esprit. Ayant reçu la vie par l’Esprit (8.11), les croyants n’ont aucune obligation de vivre aux conditions de la chair ; 8.13 en précise la portée.',
    ],
    'ROM.8.13': [
      '« Si par l’Esprit vous faites mourir les actions du corps, vous vivrez. » Deux choses sont tenues ensemble : les croyants doivent agir — le verbe est au présent, une mise à mort continue —, et ils ne le peuvent que « par l’Esprit ». John Owen a bâti son classique Of the Mortification of Sin in Believers (1656) sur ce verset : ceux qui sont libérés de la condamnation doivent encore faire de la mise à mort du péché l’affaire de toute leur vie — tuer le péché, sans quoi c’est lui qui les tuera.',
    ],
    'ROM.8.15': [
      'Paul oppose deux « esprits » : un esprit de servitude qui ramène à la crainte, et l’Esprit d’adoption, « par lequel nous crions: Abba! Père! ». Le verbe (κράζω) signifie appeler à haute voix — un cri du cœur, non une formule. Dans le monde romain, l’adoption conférait à un fils tous les droits d’héritier (note Tyndale), et Israël était le fils de Dieu bien avant (Ex 4.22) ; Paul se sert des deux pour dire que les croyants appartiennent à la famille de Dieu et prient avec le mot même qu’employait Jésus pour dire « Père » (Mc 14.36).',
    ],
    'ROM.8.16': [
      'L’Esprit « rend témoignage à notre esprit » — le verbe (συμμαρτυρέω) signifie témoigner ensemble (Darby : « rend témoignage avec notre esprit ») : notre propre esprit, et l’Esprit de Dieu qui le confirme, attestent que nous sommes enfants de Dieu. Les chrétiens ont compris ce témoignage de diverses manières : John Wesley enseignait un témoignage intérieur direct de l’Esprit, distinct de celui de notre propre esprit, tandis que Calvin le rattachait à la confiance qui nous ouvre la bouche pour appeler Dieu « Père » dans la prière. Tous deux voient dans l’assurance un don de Dieu, non une persuasion de soi.',
    ],
    'ROM.8.18': [
      '« J’estime » (λογίζομαι) exprime un jugement réfléchi : Paul a pesé les souffrances présentes face à la gloire qui doit être révélée pour nous, et il conclut qu’elles « ne sauraient être comparées ». Il ne minimise pas la douleur — la liste de 8.35 est bien réelle —, il la pèse sur une balance où la gloire à venir l’emporte. 2 Corinthiens 4.17 fait le même calcul : « nos légères afflictions du moment présent » face à « un poids éternel de gloire ».',
    ],
    'ROM.8.20': [
      'La création « a été soumise à la vanité » — ματαιότης, le mot que l’Ancien Testament grec emploie tout au long de l’Ecclésiaste (« Vanité des vanités… tout est vanité », Ec 1.2 ; la LSG garde le même mot dans les deux livres). Celui qui l’y a soumise est à comprendre, de préférence, comme Dieu, prononçant la malédiction sur le sol après le péché d’Adam (Gn 3.17 ; ainsi John Wesley). Mais ce fut « avec l’espérance » : la création sera affranchie de la servitude de la corruption et aura part à « la liberté de la gloire des enfants de Dieu » (8.21).',
    ],
    'ROM.8.23': [
      'Paul écrit : « nous aussi, qui avons les prémices de l’Esprit » — la première gerbe qui consacrait et garantissait la moisson entière (Lv 23.10, où l’Ancien Testament grec emploie le même mot, ἀπαρχή). Et pourtant « nous aussi nous soupirons en nous-mêmes, en attendant l’adoption, la rédemption de notre corps ». L’adoption est déjà nôtre (8.15) et pas encore achevée : les chrétiens vivent entre le « déjà » de la rédemption et le « pas encore » de la gloire (note Tyndale).',
    ],
    'ROM.8.26': [
      '« De même aussi » relie l’Esprit aux soupirs de la création et des croyants. « L’Esprit nous aide dans notre faiblesse » — Calvin note que le verbe (συναντιλαμβάνομαι) évoque quelqu’un qui prend un fardeau avec nous. Quand nous ne savons pas que demander, « l’Esprit lui-même intercède par des soupirs inexprimables ». Les interprètes divergent : s’agit-il des soupirs de l’Esprit lui-même ou des nôtres, suscités par lui ? Mais tous s’accordent à dire que Dieu les comprend (8.27).',
    ],
    'ROM.8.28': [
      'Paul ne dit pas que tout est bon, mais que toutes choses concourent au bien « de ceux qui aiment Dieu, de ceux qui sont appelés selon son dessein ». Le grec peut se lire soit « toutes choses concourent » (LSG), soit comme disant que Dieu fait concourir toutes choses (ainsi la BSB anglaise ; certains manuscrits ajoutent « Dieu » comme sujet, leçon imprimée par Westcott et Hort) ; dans les deux cas, c’est le dessein de Dieu qui en est la raison. Le verset suivant définit ce bien : être « semblables à l’image de son Fils », ce qui peut passer par la souffrance (8.17, 35–36). Jean Chrysostome l’avait bien vu : « toutes choses » inclut même celles qui semblent pénibles.',
    ],
    'ROM.8.29': [
      '« Ceux qu’il a connus d’avance, il les a aussi prédestinés à être semblables à l’image de son Fils. » Le but du dessein de Dieu est une ressemblance de famille : que le Fils soit « le premier-né entre plusieurs frères » — premier-né (πρωτότοκος) étant le titre que l’Ancien Testament grec donne à Israël comme fils de Dieu (Ex 4.22). Le sens de « connus d’avance » est débattu entre les traditions, mais non le but : Dieu entend rendre ses enfants semblables au Christ, dans leur caractère dès maintenant et dans la gloire corporelle à la résurrection (Ph 3.21).',
    ],
    'ROM.8.34': [
      '« Qui les condamnera? » Paul répond par quatre faits concernant le Christ : il est mort ; bien plus, il est ressuscité ; il est à la droite de Dieu ; et il intercède pour nous. La question fait écho à la confiance du Serviteur en Ésaïe 50.9 (« Qui me condamnera? »), et Calvin en dégage la logique : il ne reste aucune condamnation quand satisfaction est donnée aux lois et que la peine est déjà payée. Le chapitre qui s’ouvrait sur « aucune condamnation » y revient sous la forme d’une question à laquelle aucun accusateur ne peut répondre.',
    ],
    'ROM.8.39': [
      'L’énumération de Paul balaie toutes les catégories qu’il peut nommer — la mort et la vie, les anges et les dominations, les choses présentes et les choses à venir, les puissances, la hauteur et la profondeur, « aucune autre créature » —, et rien de tout cela « ne pourra nous séparer de l’amour de Dieu manifesté en Jésus-Christ notre Seigneur ». Le chapitre commençait par « aucune condamnation pour ceux qui sont en Jésus-Christ » (8.1) et s’achève sur aucune séparation en Jésus-Christ : l’union avec le Christ fonde à la fois le verdict et l’amour.',
    ],
  },

  concepts: {
    'romans-8:concept:condemnation': {
      label: 'Condamnation',
      aliases: [
        'condamnation',
        'aucune condamnation',
        'pas de condamnation',
        'que signifie condamnation',
        'qu’est-ce que la condamnation',
        'condamner',
        'condamne',
        'condamné',
        'condamnés',
        'condamnera',
        'verdict',
        'culpabilité',
        'coupable',
        'accusation',
        'accuser',
      ],
      answer:
        'Κατάκριμα (katakrima, 8.1) est un mot de tribunal : le verdict défavorable et la peine qui en découle. Paul ne l’emploie qu’ici et en 5.16–18, où, par l’offense d’Adam, « la condamnation a atteint tous les hommes ». « Aucune condamnation » signifie que, pour ceux qui sont en Jésus-Christ, cette sentence ne tient plus — parce que Dieu « a condamné le péché dans la chair » de son Fils (8.3), et que personne ne peut condamner ceux que Dieu justifie (8.34). Cela ne veut pas dire que les croyants ne luttent plus contre le péché (7.14–25 ; 8.13).',
    },
    'romans-8:concept:flesh': {
      label: 'La chair',
      aliases: [
        'chair',
        'la chair',
        'que signifie la chair',
        'qu’est-ce que la chair',
        'nature pécheresse',
        'chair de péché',
        'charnel',
        'charnelle',
        'selon la chair',
        'affection de la chair',
        'pensée de la chair',
        'mentalité',
        'état d’esprit',
      ],
      answer:
        'En Romains 8, la « chair » (σάρξ, 13 fois en 8.3–13) n’est pas le corps en tant que tel, mais la vie humaine telle qu’elle est en Adam — faible, prétendant se suffire à elle-même, portée vers le péché et en « inimitié contre Dieu » (8.7). Vivre « selon la chair », c’est tirer de cette source sa vie et sa direction ; vivre selon l’Esprit, c’est être conduit par l’Esprit de Dieu. Chacune a son « affection » (φρόνημα), qui aboutit soit à la mort, soit à la vie et à la paix (8.6). L’opposition porte sur deux puissances et deux manières de vivre, non sur le corps et l’âme : l’Esprit rendra la vie même à nos corps mortels (8.11).',
    },
    'romans-8:concept:spirit': {
      label: 'Le Saint-Esprit',
      aliases: [
        'esprit',
        'l’esprit',
        'saint-esprit',
        'saint esprit',
        'le saint-esprit',
        'esprit saint',
        'esprit de dieu',
        'esprit de christ',
        'esprit de vie',
        'l’esprit habite en vous',
        'conduits par l’esprit',
        'vie dans l’esprit',
        'marcher selon l’esprit',
        'selon l’esprit',
        'qui est le saint-esprit',
      ],
      answer:
        'Le Saint-Esprit domine Romains 8 : πνεῦμα y revient 21 fois — la plupart du temps, mais pas toujours, pour l’Esprit de Dieu (voir « un esprit de servitude », 8.15, et « notre esprit », 8.16) —, plus que dans tout autre chapitre du Nouveau Testament. L’Esprit est à la fois « l’Esprit de Dieu » et « l’Esprit de Christ » (8.9). Il affranchit de la loi du péché et de la mort (8.2), accomplit la justice de la loi en ceux qui marchent selon lui (8.4), donne la vie maintenant et la résurrection plus tard (8.11), conduit les enfants de Dieu et leur donne l’assurance de leur filiation (8.14–16), et intercède dans leur faiblesse (8.26–27).',
    },
    'romans-8:concept:adoption': {
      label: 'L’adoption',
      aliases: [
        'adoption',
        'adopté',
        'adoptés',
        'adopter',
        'adoption filiale',
        'filiation',
        'fils de dieu',
        'enfants de dieu',
        'héritiers',
        'héritier',
        'cohéritiers',
        'cohéritiers de christ',
        'héritage',
        'esprit d’adoption',
        'esprit de servitude',
        'que signifie adoption',
      ],
      answer:
        'L’adoption (υἱοθεσία) est un mot que seul Paul emploie dans le Nouveau Testament. Dans le monde romain, le fils adopté recevait tous les droits d’un héritier ; dans l’Ancien Testament, Israël était le fils de Dieu (Ex 4.22 ; Rm 9.4). Paul unit les deux : les croyants ont reçu « un Esprit d’adoption » et crient « Abba! Père! », et, enfants, ils sont « héritiers de Dieu, et cohéritiers de Christ » (8.15–17). Pourtant l’adoption est aussi à venir — « la rédemption de notre corps » (8.23). J. I. Packer plaçait l’adoption au-dessus même de la justification parmi les bienfaits de l’Évangile.',
    },
    'romans-8:concept:abba': {
      label: 'Abba, Père',
      aliases: ['abba', 'abba père', 'papa', 'araméen', 'dieu le père', 'dieu notre père', 'crier abba', 'que signifie abba'],
      answer:
        'Abba est le mot araméen pour « père », dans la langue que parlait Jésus ; il l’a prié à Gethsémané (Mc 14.36). Paul le garde sans le traduire dans une lettre écrite en grec et y ajoute le mot grec pour « Père » (8.15 ; Ga 4.6) : par l’Esprit, les croyants prient Dieu comme Jésus l’a fait. C’était un mot familial courant, employé par des enfants jeunes ou adultes — James Barr a soutenu que la traduction populaire par « papa » n’est pas appuyée par les données —, et John Wesley voyait dans cette association des deux langues le cri commun des croyants juifs et païens.',
    },
    'romans-8:concept:creation': {
      label: 'Les soupirs et l’espérance de la création',
      aliases: [
        'création',
        'la création tout entière',
        'création qui soupire',
        'soupirs de la création',
        'soupirer',
        'soupire',
        'soupirs',
        'gémissements',
        'enfantement',
        'douleurs de l’enfantement',
        'vanité',
        'futilité',
        'servitude de la corruption',
        'corruption',
        'nouvelle création',
        'rédemption de notre corps',
        'ardent désir',
        'attente ardente',
      ],
      answer:
        'Paul décrit la création tout entière « soumise à la vanité » — le mot que l’Ancien Testament grec emploie tout au long de l’Ecclésiaste —, très probablement en raison du jugement de Dieu après le péché d’Adam (Gn 3.17), mais « avec l’espérance ». La création attend « avec un ardent désir » (ἀποκαραδοκία, composé expressif qu’Abbott-Smith explique par l’image de quelqu’un qui guette, la tête tendue en avant, même si, dans l’usage, le mot désigne simplement une attente ardente et anxieuse), et elle soupire comme une femme en travail, aspirant à être affranchie de la corruption lorsque les enfants de Dieu seront révélés. Les croyants soupirent eux aussi, dans l’attente de la rédemption de leur corps (8.19–23). L’espérance chrétienne est une création renouvelée (Ap 21.1–5), non une évasion hors d’elle.',
    },
    'romans-8:concept:firstfruits': {
      label: 'Les prémices de l’Esprit',
      aliases: ['prémices', 'les prémices', 'prémices de l’esprit', 'première gerbe', 'premiers fruits', 'gage', 'garantie', 'arrhes', 'acompte'],
      answer:
        'Les prémices (ἀπαρχή) étaient la première gerbe de la moisson, agitée devant l’Éternel avant qu’on puisse manger quoi que ce soit de la récolte (Lv 23.9–14) ; l’Ancien Testament grec y emploie le même mot. Paul dit que nous avons « les prémices de l’Esprit » (8.23) : l’Esprit est le premier versement et la garantie de la moisson encore à venir — l’adoption plénière et la rédemption de notre corps. Il emploie la même image pour la résurrection du Christ (1 Co 15.20).',
    },
    'romans-8:concept:all-things-for-good': {
      label: 'Toutes choses concourent au bien',
      aliases: [
        'toutes choses concourent au bien',
        'concourent au bien',
        'tout concourt au bien',
        'toutes choses pour le bien',
        'concourir',
        'travaillent ensemble',
        'pour le bien',
        'le bien',
        'appelés selon son dessein',
        'son dessein',
        'providence',
      ],
      answer:
        'Romains 8.28 ne dit pas que tout est bon, ni que tout finit bien pour tout le monde. Il promet que toutes choses concourent au bien « de ceux qui aiment Dieu, de ceux qui sont appelés selon son dessein » — et 8.29 définit ce bien : être semblables à l’image de son Fils. Le grec peut se lire « toutes choses concourent » ou bien comme disant que Dieu fait concourir toutes choses ; dans les deux cas, le dessein de Dieu est décisif. Jean Chrysostome a relevé que « toutes choses » inclut même celles qui semblent pénibles.',
    },
    'romans-8:concept:predestination': {
      label: 'Prescience et prédestination',
      aliases: [
        'prédestination',
        'prédestinés',
        'prédestiné',
        'prédestiner',
        'prescience',
        'connus d’avance',
        'connaître d’avance',
        'préconnus',
        'élection',
        'élus',
        'élu',
        'choisis',
        'chaîne d’or',
        'appelés',
        'vocation',
        'justifiés',
        'glorifiés',
        'semblables à l’image de son fils',
        'conformes à l’image',
      ],
      answer:
        'Romains 8.29–30 forme une chaîne de cinq verbes : Dieu a connu d’avance, prédestiné, appelé, justifié et glorifié. Les chrétiens s’accordent à dire que le salut prend sa source dans le dessein de grâce de Dieu et vise la ressemblance avec le Christ. Ils divergent sur « connus d’avance » : les lecteurs réformés y voient l’amour électif de Dieu pour des personnes particulières ; les lecteurs arminiens et wesleyens, sa prescience de ceux qui croiraient ; les traditions luthérienne, catholique et orthodoxe l’articulent chacune encore autrement. Le panneau Perspectives présente ces lectures. « Glorifiés » est au passé, alors que la gloire est encore à venir (8.18) : la note Tyndale y voit la décision arrêtée de Dieu, aussi certaine que si elle était déjà accomplie, tandis que John Wesley entendait Paul parler comme quelqu’un qui, parvenu au but, regarde en arrière.',
    },
    'romans-8:concept:mortification': {
      label: 'Faire mourir le péché',
      aliases: [
        'faire mourir',
        'faites mourir',
        'faire mourir le péché',
        'mortifier',
        'mortification',
        'actions du corps',
        'tuer le péché',
        'redevables',
        'débiteurs',
        'obligation',
        'sanctification',
        'sainteté',
        'combat contre le péché',
      ],
      answer:
        '« Si par l’Esprit vous faites mourir les actions du corps, vous vivrez » (8.13). Les croyants ne doivent rien à la chair (8.12) ; ils ont donc à faire mourir le péché sans relâche — le verbe est au présent, une action continue —, mais seulement « par l’Esprit », non par leurs propres forces. L’ouvrage de John Owen, Of the Mortification of Sin in Believers (1656), bâti sur ce verset, insiste : ceux qui sont libérés de la condamnation doivent en faire l’affaire de toute leur vie — tuer le péché, sans quoi c’est lui qui les tuera.',
    },
    'romans-8:concept:intercession': {
      label: 'Le secours de l’Esprit dans la prière',
      aliases: [
        'intercession',
        'intercéder',
        'intercède',
        'intercède pour nous',
        'prière',
        'prier',
        'comment prier',
        'soupirs inexprimables',
        'gémissements inexprimables',
        'faiblesse',
        'infirmités',
        'je ne sais pas prier',
      ],
      answer:
        'Quand « nous ne savons pas ce qu’il nous convient de demander dans nos prières », « l’Esprit nous aide dans notre faiblesse » — le verbe évoque quelqu’un qui prend un fardeau avec un autre — et « intercède par des soupirs inexprimables » (8.26). Dieu, qui sonde les cœurs, connaît la pensée de l’Esprit, qui intercède selon Dieu (8.27). Pendant ce temps, le Christ intercède à la droite de Dieu (8.34). Ces soupirs sont-ils ceux de l’Esprit lui-même, ou les nôtres, suscités par lui ? La question est débattue ; voir Perspectives.',
    },
    'romans-8:concept:separation': {
      label: 'Rien ne peut nous séparer',
      aliases: [
        'séparer',
        'séparation',
        'aucune séparation',
        'rien ne pourra nous séparer',
        'amour de dieu',
        'amour de christ',
        'plus que vainqueurs',
        'vainqueurs',
        'si dieu est pour nous',
        'qui sera contre nous',
        'assurance',
        'sécurité',
        'persécution',
        'brebis destinées à la boucherie',
      ],
      answer:
        'Le chapitre s’achève dans un tribunal en questions : si Dieu est pour nous, qui sera contre nous ? Qui accusera les élus de Dieu, quand c’est Dieu qui justifie ? Qui condamnera, quand le Christ est mort, ressuscité, et qu’il intercède ? Qui nous séparera de l’amour du Christ ? Paul cite le Psaume 44.22 pour montrer que la souffrance n’est pas un signe de rejet, puis déclare : « nous sommes plus que vainqueurs » — ὑπερνικάω, un mot qu’on ne trouve qu’ici dans le Nouveau Testament. Rien dans toute la création ne peut nous séparer de l’amour de Dieu en Jésus-Christ (8.31–39).',
    },
  },
};

export default overlay;
