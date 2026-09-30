/**
 * Français overlay for the curated study "suffering" (2 Corinthiens 4.7–18).
 * The English module (src/data/curated/studies/suffering.ts) stays the source of truth for ids,
 * references, citations and provenance. Verified quotations keep their English words; only a
 * clearly labelled free translation (quoteTranslation) is added here. Scripture words quoted in
 * prose follow the Louis Segond 1910 (LSG) wording; otherwise they are paraphrased without quotation marks.
 */
import type { StudyOverlay } from '../types';

const overlay: StudyOverlay = {
  studyId: 'suffering',
  locale: 'fr',
  title: 'Souffrance',
  subtitle: 'Pourquoi Dieu permet-il la souffrance ?',
  summary:
    'Cette étude aborde la plus ancienne des questions difficiles de la foi — pourquoi un Dieu bon et tout-puissant permet la souffrance — et l’ancre dans 2 Corinthiens 4.7–18, où Paul, pressé de toute manière, parle d’un trésor porté dans des vases de terre et de légères afflictions du moment présent qui produisent un poids éternel de gloire. Autour de ce passage, elle rassemble le témoignage plus large de la Bible : la chute et une création qui soupire, les psaumes de lamentation et Job, le refus d’assimiler la souffrance à une punition, Dieu entrant dans la souffrance humaine en Christ, et la promesse d’un monde sans larmes. Elle expose aussi comment les penseurs chrétiens — d’Irénée et Augustin aux traditions réformée, catholique, wesleyenne et orthodoxe, jusqu’aux philosophes modernes — ont répondu au problème du mal, là où ils s’accordent et là où ils divergent.',
  opening:
    'Peu de questions pèsent plus lourd que celle-ci, et la Bible ne la survole pas. Nous ancrerons l’étude dans 2 Corinthiens 4, où Paul écrit en homme soumis à une pression bien réelle, mais non écrasé, puis nous suivrons la réponse biblique plus large — la lamentation sincère, le mystère de Job, la croix et l’espérance d’un monde sans larmes. Posez vos questions sur un verset, sur un mot, ou sur la manière dont les chrétiens se sont débattus avec le problème du mal.',
  matchTopics: [
    'souffrance',
    'souffrances',
    'la souffrance',
    'souffrir',
    'pourquoi dieu permet-il la souffrance',
    'pourquoi dieu permet la souffrance',
    'pourquoi dieu permet-il le mal',
    'pourquoi dieu permet le mal',
    'pourquoi dieu laisse-t-il souffrir',
    'pourquoi la souffrance',
    'pourquoi je souffre',
    'le problème du mal',
    'problème du mal',
    'problème de la souffrance',
    'théodicée',
    'douleur',
    'le mal',
    'épreuve',
    'épreuves',
    'affliction',
    'afflictions',
    'lamentation',
    'deuil',
    'chagrin',
    'tribulation',
    'difficultés',
    '2 corinthiens 4',
    '2 co 4',
    '2co 4',
    'vases de terre',
  ],
  suggestedQuestions: [
    'Pourquoi Dieu permet-il la souffrance ?',
    'Que veut dire Paul par « des vases de terre » ?',
    'Quel est le mot grec derrière « affliction » ?',
    'Qu’a dit Tim Keller sur la souffrance ?',
    'Comment les premiers destinataires comprenaient-ils ce passage ?',
    'Où Paul parle-t-il ailleurs de la souffrance ?',
    'Quel lien avec l’épître aux Romains ?',
    'Expliquez le verset 17 plus en détail.',
    'Existe-t-il différentes interprétations théologiques du problème du mal ?',
  ],
  topic: {
    name: 'Souffrance',
    question: 'Pourquoi Dieu permet-il la souffrance ?',
    definition:
      'L’Écriture ne donne pas de réponse unique et bien ordonnée à la question de savoir pourquoi Dieu permet la souffrance. Elle offre un ensemble de vérités à tenir ensemble. Dieu est à la fois bon et souverain, et pourtant le mal est réel et n’est jamais simplement un bien : le péché et la mort sont entrés dans le monde bon de Dieu par la révolte humaine, et la création tout entière soupire désormais (Gn 3 ; Rm 5.12 ; 8.20–22). La souffrance n’est pas toujours la punition d’un péché particulier (Job ; Jn 9 ; Lc 13). Dieu accueille la lamentation sincère : le cri répété du psalmiste, « Jusques à quand », est déjà une prière de foi (Ps 13). Dieu ne s’est pas tenu à distance : en Christ, il est entré dans la douleur humaine, a été abandonné sur la croix et est ressuscité (Es 53 ; Mc 15.34). Entre ses mains, l’affliction peut affiner la foi et même contribuer à la gloire (Gn 50.20 ; Rm 5.3–5 ; 2 Co 4.17). Et l’histoire s’achève sur Dieu lui-même essuyant toute larme (Ap 21.3–5).',
  },
  topicPassages: {
    'suffering:kp:gen-3-16': {
      title: 'Douleur, labeur et poussière',
      group: 'La souffrance et la chute',
      note: 'Après la première révolte, la douleur entre dans l’enfantement, le sol est maudit, le travail devient un dur labeur, et l’homme apprend qu’il retournera à la poussière. L’Écriture fait remonter à ce détournement originel loin de Dieu la brisure du monde — y compris bien des souffrances qu’aucun individu n’a choisies.',
    },
    'suffering:kp:rom-8-20': {
      title: 'Une création qui soupire dans l’espérance',
      group: 'La souffrance et la chute',
      note: 'Paul dit que la création a été soumise à la vanité et à la servitude de la corruption — mais « avec l’espérance », et il compare ses soupirs aux douleurs de l’enfantement. La souffrance dans le monde naturel est réelle, mais elle est un travail d’enfantement vers une naissance nouvelle plutôt qu’une fin dépourvue de sens.',
    },
    'suffering:kp:psa-13': {
      title: 'Jusques à quand, Éternel ?',
      group: 'Lamentation et foi sincère',
      note: 'Quatre fois en deux versets, David demande jusqu’à quand : jusqu’à quand Dieu l’oubliera et lui cachera sa face, jusqu’à quand il devra se débattre avec le chagrin, jusqu’à quand son ennemi triomphera. Pourtant ce bref psaume s’achève dans la confiance et le chant. La lamentation n’est pas une défaillance de la foi ; c’est la foi qui porte sa plainte devant le seul qui puisse y répondre.',
    },
    'suffering:kp:psa-88': {
      title: 'Une lamentation qui s’achève dans les ténèbres',
      group: 'Lamentation et foi sincère',
      note: 'Le Psaume 88 est singulier : il se clôt sans retour à la louange, et son dernier mot, en hébreu, est *ténèbres*. Pourtant il s’adresse d’un bout à l’autre au « Dieu de mon salut » (88.1). Sa présence dans l’Écriture autorise ceux qui souffrent à prier même quand aucun soulagement n’est venu.',
    },
    'suffering:kp:lam-3-19': {
      title: 'Des compassions nouvelles au milieu des ruines',
      group: 'Lamentation et foi sincère',
      note: 'Écrivant parmi les décombres de Jérusalem, le poète se souvient de son affliction, puis rappelle délibérément à sa mémoire l’amour fidèle de Dieu et ses compassions, qui se renouvellent chaque matin. Le passage s’achève sur une affirmation saisissante au sujet du cœur de Dieu : ce n’est pas de bon gré qu’il afflige (3.33).',
    },
    'suffering:kp:hab-1-2': {
      title: 'Pourquoi tolères-tu l’injustice ?',
      group: 'Lamentation et foi sincère',
      note: 'Habacuc s’ouvre sur la même question que le Psaume 13 — jusqu’à quand ? —, portant cette fois sur l’injustice dans la société : violence, loi paralysée et justice pervertie. La plainte du prophète devient le début d’un dialogue avec Dieu plutôt que la fin de la foi.',
    },
    'suffering:kp:hab-3-17': {
      title: 'La joie quand le figuier ne fleurit pas',
      group: 'Lamentation et foi sincère',
      note: 'À la fin du livre, le prophète attend encore le jour de la détresse (3.16) et envisage une perte totale — ni fruits, ni récoltes, ni troupeaux —, et pourtant Habacuc décide de se réjouir dans le Dieu de son salut. C’est l’une des images les plus claires, dans l’Écriture, d’une foi qui ne dépend plus des circonstances.',
    },
    'suffering:kp:job-1-20': {
      title: 'L’Éternel a donné, et l’Éternel a ôté',
      group: 'Job : souffrance et mystère',
      note: 'Après avoir perdu ses enfants et ses biens, Job déchire son manteau, se jette à terre — et adore. Le narrateur ajoute qu’il ne pécha point et n’accusa pas Dieu d’injustice. Deuil et adoration ne s’opposent pas ici ; ils se rejoignent dans un même geste.',
    },
    'suffering:kp:job-38-1': {
      title: 'La réponse du milieu de la tempête',
      group: 'Job : souffrance et mystère',
      note: 'Quand Dieu parle enfin, il n’explique pas la scène céleste des chapitres 1–2. Il demande à Job où il était quand la terre fut fondée. Les notes d’étude Tyndale observent que le livre n’explique pas la souffrance ; il montre Dieu rejetant les explications faciles tout en appelant Job à se fier à sa sagesse.',
    },
    'suffering:kp:job-42-1': {
      title: 'Maintenant mon œil t’a vu',
      group: 'Job : souffrance et mystère',
      note: 'Job ne reçoit pas de liste de raisons, mais il reçoit Dieu lui-même : il avait entendu parler de Dieu, et maintenant il le voit. Le livre suggère que ce dont celui qui souffre a le plus besoin n’est pas une explication, mais une rencontre.',
    },
    'suffering:kp:gen-50-20': {
      title: 'Vous vouliez le mal, Dieu voulait le bien',
      group: 'Les desseins de Dieu dans la douleur',
      note: 'Joseph appelle mal l’acte de ses frères et, dans la même phrase, affirme que Dieu le destinait au bien — pour sauver la vie à un peuple nombreux. Le verset tient ensemble la culpabilité humaine et le dessein divin, sans laisser l’un annuler l’autre.',
    },
    'suffering:kp:rom-5-3': {
      title: 'L’affliction produit la persévérance',
      group: 'Les desseins de Dieu dans la douleur',
      note: 'Paul trace un enchaînement : l’affliction, la persévérance, le caractère éprouvé, l’espérance — et une espérance qui ne trompe point, parce que l’amour de Dieu a été répandu dans nos cœurs par l’Esprit. Le bien ne réside pas dans la douleur elle-même, mais dans ce que Dieu opère à travers elle.',
    },
    'suffering:kp:heb-12-5': {
      title: 'La discipline d’un Père',
      group: 'Les desseins de Dieu dans la douleur',
      note: 'L’épître aux Hébreux lit certaines épreuves comme l’éducation qu’un père aimant donne à ses enfants : douloureuse sur le moment, mais produisant plus tard un fruit de justice et de paix. Le passage ne dit pas que chaque épreuve sanctionne une faute précise ; il situe la persévérance dans le cadre de la filiation.',
    },
    'suffering:kp:2co-12-7': {
      title: 'La puissance s’accomplit dans la faiblesse',
      group: 'Les desseins de Dieu dans la douleur',
      note: 'Par trois fois, Paul a demandé que son écharde dans la chair lui soit retirée ; la réponse fut une grâce qui lui suffisait. Nous ignorons ce qu’était cette écharde, mais nous savons ce qu’elle lui a appris : la puissance du Christ repose sur ceux qui sont faibles.',
    },
    'suffering:kp:jhn-9-1': {
      title: 'Qui a péché ?',
      group: 'Pas toujours une punition',
      note: 'Les disciples supposent que la cécité d’un homme doit être la faute de quelqu’un. Jésus écarte les deux hypothèses et désigne plutôt ce que Dieu va manifester en lui. L’Écriture refuse l’équation simpliste selon laquelle la souffrance serait toujours le signe d’une culpabilité personnelle.',
    },
    'suffering:kp:luk-13-1': {
      title: 'La tour de Siloé',
      group: 'Pas toujours une punition',
      note: 'Informé du sort des victimes de la violence de Pilate, et ajoutant lui-même l’exemple d’une tour effondrée, Jésus nie qu’elles aient été plus coupables que les autres — puis transforme la question en appel : tous ont besoin de se repentir. Le drame n’est pas un verdict sur ses victimes, mais il rappelle à chacun son besoin de Dieu.',
    },
    'suffering:kp:isa-53-3': {
      title: 'Un homme de douleur',
      group: 'Dieu avec nous dans la souffrance : le Christ',
      note: 'Le Serviteur est familier de la souffrance ; il porte nos douleurs et il est brisé pour nos iniquités. Le Nouveau Testament applique ce chant à Jésus (par exemple 1 P 2.24) : le Dieu de la Bible ne répond pas à la souffrance de loin, mais en la portant.',
    },
    'suffering:kp:mrk-15-34': {
      title: 'Mon Dieu, pourquoi m’as-tu abandonné ?',
      group: 'Dieu avec nous dans la souffrance : le Christ',
      note: 'Sur la croix, Jésus prie la première ligne du Psaume 22, une lamentation. Le Fils de Dieu lui-même demande pourquoi. Les chrétiens y ont depuis longtemps trouvé à la fois la profondeur de ce que le Christ a porté et la permission d’apporter à Dieu leur propre « pourquoi ».',
    },
    'suffering:kp:heb-4-15': {
      title: 'Un grand prêtre qui compatit',
      group: 'Dieu avec nous dans la souffrance : le Christ',
      note: 'Parce que Jésus a été éprouvé en toutes choses comme nous, il peut compatir à nos faiblesses. Celui qui souffre prie quelqu’un qui connaît la douleur de l’intérieur.',
    },
    'suffering:kp:rev-21-3': {
      title: 'Plus de mort ni de deuil',
      group: 'L’espérance finale',
      note: 'Le dernier mot de la Bible sur la souffrance n’est pas une explication, mais une fin : Dieu habitant avec son peuple, toute larme essuyée, la mort et la douleur disparues, toutes choses faites nouvelles. La souffrance présente est réelle, mais elle n’est pas définitive.',
    },
  },
  keyWords: {
    'suffering:kw:thlipsis': {
      english: 'affliction',
      grammar: 'Nom, génitif singulier féminin',
      basicMeaning: 'pression ; (au figuré) affliction, tribulation, détresse',
      semanticRange: ['pression (sens propre)', 'affliction', 'tribulation', 'détresse'],
      notableNotes: [
        'La lettre s’ouvre sur le Dieu qui nous console dans toutes nos afflictions — le mot apparaît deux fois dans ce verset.',
        'L’affliction que Paul a subie dans la province d’Asie, si accablante qu’il désespéra même de la vie.',
        'Employé deux fois : les croyants se glorifient dans les afflictions, parce que l’affliction produit la persévérance.',
        'Jésus avertit ses disciples qu’ils auront des tribulations dans le monde, et les assure qu’il a vaincu le monde.',
        'L’expression discutée sur ce qui manque aux afflictions du Christ.',
      ],
      significance:
        'D’après notre décompte dans le Nouveau Testament grec étiqueté de STEPBible, θλῖψις apparaît 45 fois, et 2 Corinthiens en compte davantage (9) que tout autre livre — c’est une lettre écrite sous la pression. En 4.17, Paul qualifie cette affliction de légère et momentanée, non parce qu’elle serait insignifiante (4.8–9 et 11.23–29 montrent le contraire), mais parce qu’elle est mise en balance avec un poids éternel de gloire. Le verbe apparenté θλίβω ouvre la liste des épreuves en 4.8 (pressés), si bien que la liste commence par la pression (4.8) et que la conclusion la nomme de nouveau (4.17).',
      caution:
        'Le sens littéral donné par le lexique est « pression », mais cela ne signifie pas que chaque emploi évoque l’image vive d’un écrasement. Dans le Nouveau Testament, le mot s’emploie au figuré pour l’affliction et la détresse ; c’est le contexte, et non l’étymologie, qui décide de la nuance.',
      anchors: [
        {
          verse: { book: '2CO', chapter: 4, verse: 17 },
          phrases: { LSG: 'afflictions', DARBY: 'tribulation', NCL: 'affliction', OST: 'affliction' },
        },
      ],
    },
    'suffering:kw:ostrakinos': {
      english: 'vases de terre',
      grammar: 'Adjectif, datif pluriel neutre (avec σκεῦος, « vase », G4632)',
      basicMeaning: 'fait d’argile, de terre',
      semanticRange: ['fait d’argile', 'de terre, en terre cuite'],
      notableNotes: [
        'Le seul autre emploi dans le Nouveau Testament : dans une grande maison, il y a des vases d’or et d’argent, mais aussi de bois et de terre.',
        'Ce n’est pas le même mot, mais sa racine : dans l’Ancien Testament grec, Job se gratte avec un ὄστρακον, un tesson.',
      ],
      significance:
        'L’adjectif vient de ὄστρακον, un vase de terre ou un tesson, et n’apparaît que deux fois dans le Nouveau Testament (2 Co 4.7 ; 2 Tm 2.20). L’image de Paul place le trésor inestimable de 4.6 — la lumière de la connaissance de la gloire de Dieu sur la face du Christ — dans un objet bon marché et fragile : son corps mortel et son ministère malmené. Le but est énoncé dans le même verset : que cette puissance incomparable apparaisse comme venant de Dieu, et non de nous. La faiblesse n’est pas un embarras pour l’Évangile ; c’est là que la puissance de Dieu devient visible.',
      caution:
        'Le vase est une métaphore de la fragilité et de la banalité humaines, non l’affirmation que le corps serait sans valeur. Paul s’attend à ce que le corps lui-même soit ressuscité (4.14).',
      anchors: [
        {
          verse: { book: '2CO', chapter: 4, verse: 7 },
          phrases: { LSG: 'vases de terre', DARBY: 'vases de terre', NCL: 'vases de terre', OST: 'vases de terre' },
        },
      ],
    },
    'suffering:kw:exaporeo': {
      english: 'désespoir',
      grammar: 'Verbe, participe présent moyen/passif (déponent), nominatif pluriel masculin',
      basicMeaning: 'être complètement dans l’impasse, être dans le désespoir',
      semanticRange: ['être complètement dans l’impasse', 'être dans le désespoir'],
      notableNotes: [
        'Le seul autre emploi dans le Nouveau Testament : Paul reconnaît qu’en Asie ils ont désespéré même de la vie.',
        'L’Ancien Testament grec emploie ce verbe là où le psalmiste dit son désespoir.',
      ],
      significance:
        'Paul joue en 4.8 sur deux verbes apparentés : ἀπορούμενοι (perplexes, sans issue) mais non ἐξαπορούμενοι (complètement sans issue, désespérés). Le préfixe intensifie le mot, et le jeu de mots s’entend en grec. Le verbe n’apparaît que deux fois dans le Nouveau Testament — ici et en 1.8, où Paul reconnaît qu’en Asie ils ont bel et bien désespéré de la vie. Lus ensemble, ces versets suggèrent que « non dans le désespoir » n’est pas la revendication d’un calme inaltérable, mais le témoignage que le désespoir n’a pas eu le dernier mot, parce qu’ils ont appris à se confier dans le Dieu qui ressuscite les morts (1.9).',
      caution:
        'Le jeu de mots est clair en grec, mais les traductions françaises ne peuvent pas le reproduire ; il ne faut pas bâtir une doctrine sur le seul préfixe.',
      anchors: [
        {
          verse: { book: '2CO', chapter: 4, verse: 8 },
          phrases: { LSG: 'désespoir', DARBY: 'sans ressource', NCL: 'désespoir', OST: 'sans espérance' },
        },
      ],
    },
    'suffering:kw:nekrosis': {
      english: 'mort / fait de mourir',
      grammar: 'Nom, accusatif singulier féminin',
      basicMeaning: 'mise à mort ; état de mort',
      semanticRange: ['mise à mort', 'état de mort, extinction de la vie'],
      notableNotes: [
        'Le seul autre emploi dans le Nouveau Testament : l’état de mort du sein de Sara, devenu stérile — d’où Dieu fit naître la vie.',
      ],
      significance:
        'Paul n’emploie pas ici le mot ordinaire pour la mort (θάνατος), mais le plus rare νέκρωσις, que le lexique glose par « mise à mort » ou « état de mort ». Le mot suggère un processus — la mort quotidienne d’un corps usé par la persécution — que Paul porte partout avec lui comme la marque de la mort même de Jésus. La proposition finale compte tout autant : « afin que la vie de Jésus soit aussi manifestée dans notre corps ». Calvin a rendu le mot par mortificatio, et une note de l’édition de la Calvin Translation Society cite Bèze, qui employait la même traduction, en expliquant que le mot décrit ici non la mort elle-même, mais une condition exposée chaque jour à la mort.',
      caution:
        'Paul ne dit pas que ses souffrances expient le péché. Il partage la forme de la mort du Christ, non son œuvre salvatrice unique.',
      anchors: [
        {
          verse: { book: '2CO', chapter: 4, verse: 10 },
          phrases: { LSG: 'mort', DARBY: 'mort', NCL: 'mort', OST: 'mort' },
        },
      ],
    },
    'suffering:kw:ekkakeo': {
      english: 'perdre courage',
      grammar:
        'Verbe, présent actif indicatif, première personne du pluriel (ἐγκακοῦμεν dans le texte de Nestle-Aland ; ἐκκακοῦμεν dans le Textus Receptus)',
      basicMeaning: 'perdre courage',
      semanticRange: ['perdre courage', 'se décourager', 'se lasser (de faire le bien)'],
      notableNotes: [
        'Le chapitre s’ouvre sur les mêmes mots : nous ne perdons pas courage.',
        'Jésus dit une parabole pour enseigner à prier avec persévérance au lieu de se décourager.',
        'Paul exhorte les croyants à ne pas se lasser de faire le bien, car une moisson vient.',
      ],
      significance:
        'D’après notre décompte, le verbe apparaît six fois dans le Nouveau Testament, dont deux dans ce chapitre (4.1, 4.16). Ces deux emplois encadrent la plus grande partie du chapitre : Paul ne perd pas courage à cause de la miséricorde qui lui a confié son ministère (4.1), et il ne perd pas courage parce que l’homme intérieur se renouvelle de jour en jour (4.16). Ailleurs, il désigne le fait de se lasser de faire le bien (Ga 6.9 ; 2 Th 3.13) ou de se décourager à cause des souffrances d’un apôtre (Ep 3.13), et Luc 18.1 l’associe à la prière — indice de l’endroit où le courage se renouvelle.',
      caution:
        'Les lexiques anciens rattachent le mot à κακός (« lâche »), mais c’est l’usage, et non l’étymologie, qui décide du sens : dans le Nouveau Testament, il signifie perdre courage ou se lasser, non spécifiquement faire preuve de lâcheté.',
      anchors: [
        {
          verse: { book: '2CO', chapter: 4, verse: 16 },
          phrases: { LSG: 'ne perdons pas courage', DARBY: 'ne nous lassons point', NCL: 'ne perdons pas courage', OST: 'ne perdons point courage' },
        },
      ],
    },
    'suffering:kw:baros': {
      english: 'poids',
      grammar: 'Nom, accusatif singulier neutre',
      basicMeaning: 'poids, fardeau',
      semanticRange: ['poids', 'fardeau', 'dignité, autorité (en grec plus tardif)'],
      notableNotes: [
        'Les croyants doivent porter les fardeaux les uns des autres — ici, le mot désigne une charge qui accable.',
        'Le concile de Jérusalem décide de ne pas imposer aux croyants d’origine païenne d’autre charge que le nécessaire.',
      ],
      significance:
        'Paul établit un contrepoids délibéré : ἐλαφρόν, la légèreté de l’affliction présente, face à βάρος, un poids éternel de gloire, et il accumule l’expression καθ᾽ ὑπερβολὴν εἰς ὑπερβολήν (littéralement « à l’excès jusqu’à l’excès »). Une ancienne ligne d’interprétation, citée dans une note de l’édition de la Calvin Translation Society d’après le lexicographe du XVIIIe siècle John Parkhurst, y entend un écho hébreu : le mot pour gloire, כָּבוֹד (kavod, H3519), est apparenté au verbe כָּבֵד (H3513), dont le champ sémantique comprend à la fois « être lourd » et « être honoré ». Le lexique signale un passage de l’Ancien Testament grec où βάρος rend cette racine hébraïque (Jg 18.21). La suggestion est séduisante — la gloire comme la véritable pesanteur du réel —, mais Paul ne la formule pas.',
      caution:
        'Le lien avec kavod est une hypothèse, non une certitude : Paul écrivait en grec et ne signale aucun jeu de mots hébreu. Il faut y voir une possibilité éclairante, non la clé du verset.',
      anchors: [
        {
          verse: { book: '2CO', chapter: 4, verse: 17 },
          phrases: { LSG: 'poids', DARBY: 'poids', NCL: 'poids', OST: 'poids' },
        },
      ],
    },
    'suffering:kw:pascho': {
      english: 'souffrir',
      grammar: 'Verbe, participe présent actif, nominatif pluriel masculin (en 1 P 4.19)',
      basicMeaning: 'souffrir ; subir',
      semanticRange: ['souffrir (un malheur, une douleur)', 'éprouver, subir'],
      notableNotes: [
        'Jésus ressuscité explique que le Messie devait souffrir avant d’entrer dans sa gloire.',
        'Le Fils lui-même a appris l’obéissance par ce qu’il a souffert.',
        'Souffrir pour Christ est présenté comme une grâce accordée aux croyants, au même titre que la foi elle-même.',
        'En 2 Corinthiens, Paul parle des Corinthiens qui endurent les mêmes souffrances que lui.',
      ],
      significance:
        'Le verbe de base du Nouveau Testament pour la souffrance n’apparaît pas en 2 Corinthiens 4, mais il encadre le thème. D’après notre décompte, il apparaît 42 fois, et 1 Pierre l’emploie plus que tout autre livre (12 fois) — une lettre adressée à des croyants dispersés et en butte à l’hostilité. Le lexique relève son sens fondamental : subir plutôt qu’agir ; la souffrance est ce qui nous arrive. Les Évangiles l’emploient pour la nécessité des souffrances du Messie (Lc 24.26), et 1 Pierre 4.19 invite ceux qui souffrent selon la volonté de Dieu à remettre leurs âmes au fidèle Créateur.',
      anchors: [
        {
          verse: { book: '1PE', chapter: 4, verse: 19 },
          phrases: { LSG: 'souffrent', DARBY: 'souffrent', NCL: 'souffrent', OST: 'souffrent' },
        },
      ],
    },
    'suffering:kw:oni': {
      english: 'affliction',
      grammar: 'Nom commun masculin singulier, à l’état construit, avec suffixe de la première personne (mon affliction)',
      basicMeaning: 'affliction, pauvreté, misère',
      semanticRange: ['affliction', 'pauvreté', 'misère'],
      notableNotes: [
        'Au buisson ardent, Dieu dit à Moïse qu’il a vu l’affliction de son peuple en Égypte.',
        'Le pain sans levain de la Pâque est appelé pain d’affliction, mangé en souvenir de l’Égypte.',
        'Dieu parle d’éprouver son peuple dans la fournaise de l’affliction.',
        'Dans son affliction, le psalmiste trouve sa consolation dans la promesse de Dieu, qui fait vivre.',
        'Élihu affirme que Dieu délivre les affligés par leur affliction même.',
      ],
      significance:
        'D’après notre décompte dans le texte hébreu étiqueté de STEPBible, עֳנִי apparaît 36 fois, le plus souvent dans les Psaumes (10), Job (6) et les Lamentations (5). Son champ sémantique va de l’affliction à la pauvreté et à la misère, et c’est souvent quelque chose que Dieu voit : le récit de l’exode commence lorsque l’Éternel déclare avoir vu l’affliction de son peuple (Ex 3.7). En Lamentations 3.19, le poète demande à Dieu de se souvenir de son affliction — et, quelques versets plus loin, il se souvient des compassions de Dieu (3.21–23). Le mot même qui nomme la souffrance entre aussi dans le culte d’Israël, avec le pain d’affliction de la Pâque.',
      anchors: [
        {
          verse: { book: 'LAM', chapter: 3, verse: 19 },
          phrases: { LSG: 'détresse', DARBY: 'affliction', NCL: 'affliction', OST: 'affliction' },
        },
      ],
    },
    'suffering:kw:an': {
      english: 'jusqu’à quand',
      grammar: 'Particule interrogative ; en Ps 13.1 (v. 2 en hébreu), dans l’expression עַד־אָנָה (avec עַד, « jusqu’à », H5704)',
      basicMeaning: 'où ? vers où ? ; (pour le temps) quand ? jusqu’à quand ?',
      semanticRange: ['où ? vers où ? (lieu)', 'quand ? jusqu’à quand ? (temps)'],
      notableNotes: [
        'Le « jusqu’à quand » du prophète face à la violence et à l’injustice.',
        'Job retourne la question contre ses amis : jusqu’à quand le tourmenteront-ils ?',
        'L’Éternel lui-même demande jusqu’à quand son peuple le méprisera — la question va dans les deux sens.',
      ],
      significance:
        'L’expression « jusqu’à quand » (Segond : « Jusques à quand ») rend un idiome hébreu de deux mots, עַד־אָנָה — littéralement « jusqu’où ? ». D’après notre décompte, cette association apparaît 14 fois dans la Bible hébraïque, dont quatre dans les deux premiers versets du Psaume 13, où, comme l’observent les notes d’étude Tyndale, la répétition traduit l’agitation et une profonde angoisse. L’hébreu possède un second idiome pour dire « jusqu’à quand », עַד־מָתַי (avec מָתַי, H4970, « quand ? »), employé par exemple au Psaume 6.3. Dans les deux cas, la question elle-même est significative : elle suppose que Dieu peut agir et qu’il agira. C’est une plainte sur le délai, non une négation de Dieu.',
      caution:
        'אָן employé seul signifie généralement « où ? » ; c’est la combinaison avec עַד qui donne « jusqu’à quand ». La fiche présente l’interrogatif, mais le sens appartient à l’expression.',
      anchors: [
        {
          verse: { book: 'PSA', chapter: 13, verse: 1 },
          phrases: { LSG: 'Jusques à quand', DARBY: 'Jusques à quand', NCL: 'Jusques à quand' },
        },
      ],
    },
  },
  crossReferences: {
    'suffering:xr:rom-5-3': {
      title: 'Une affliction qui produit quelque chose',
      explanation:
        'Les deux passages disent que l’affliction produit quelque chose, et tous deux emploient le même verbe grec (κατεργάζομαι, accomplir, produire) avec le même nom θλῖψις. En 2 Corinthiens 4.17, l’affliction produit un poids éternel de gloire ; en Romains 5.3–4, elle produit la persévérance, le caractère éprouvé et l’espérance. Romains décrit le changement que Dieu opère dès maintenant dans le croyant ; 2 Corinthiens regarde vers la gloire qui l’emportera sur l’affliction. Ensemble, ils écartent l’idée que la souffrance serait perdue entre les mains de Dieu.',
    },
    'suffering:xr:rom-8-18': {
      title: 'Sans comparaison avec la gloire',
      explanation:
        'Écrit à environ un an d’intervalle de 2 Corinthiens, Romains 8.18 fait la même comparaison en termes plus simples : « les souffrances du temps présent ne sauraient être comparées à la gloire à venir ». Paul ne minimise pas la douleur ; il la place sur une balance dont l’autre plateau est si lourd qu’il change la manière de vivre le présent. L’étude sur Romains 8 approfondit ce verset et la création qui soupire, dont il est question ensuite.',
    },
    'suffering:xr:2co-1-3': {
      title: 'Le Dieu de toute consolation — et le désespoir en Asie',
      explanation:
        'Le début de la lettre est le meilleur commentaire du chapitre 4. Dieu nous console dans toutes nos afflictions (θλῖψις, deux fois en 1.4) afin que nous puissions consoler les autres ; et Paul relate une crise en Asie si grave qu’ils désespéraient même de conserver la vie (1.8) — le verbe même qu’il nie en 4.8. La leçon qu’il en tire correspond exactement au chapitre 4 : ne pas placer sa confiance en soi-même, mais en Dieu qui ressuscite les morts (1.9 ; comparer 4.7, 14). Ce qui s’est passé exactement en Asie reste incertain ; les notes d’étude Tyndale évoquent comme possibilités l’émeute d’Éphèse ou un procès pouvant aboutir à une exécution.',
    },
    'suffering:xr:2co-11-23': {
      title: 'Ce que « pressés de toute manière » voulait vraiment dire',
      explanation:
        'Le chapitre 11 retrace l’histoire qui se cache derrière 4.8–9 : des flagellations, trois bastonnades à coups de verges, une lapidation, trois naufrages, des dangers sur les fleuves et de la part des brigands, la faim, le froid — et la pression quotidienne du souci de toutes les Églises. Certains éléments se retrouvent dans les Actes (battu de verges à Philippes, Ac 16.22–23 ; lapidé à Lystre, Ac 14.19). Comme 2 Corinthiens a été écrite avant le dernier voyage de Paul à Jérusalem et à Rome, aucun des trois naufrages ne peut être le célèbre naufrage d’Actes 27. La légère affliction de Paul n’avait rien de léger à vue humaine.',
    },
    'suffering:xr:2co-12-7': {
      title: 'La puissance accomplie dans la faiblesse',
      explanation:
        'Le chapitre 4 énonce le principe ; le chapitre 12 raconte l’histoire. En 4.7, la puissance incomparable (δύναμις) appartient à Dieu, non au vase fragile. En 12.9, après que Paul a demandé par trois fois que l’écharde lui soit retirée, le Seigneur a répondu en refusant la demande et en promettant autre chose : sa grâce suffit, et sa puissance (δύναμις) s’accomplit dans la faiblesse. Jean Chrysostome, commentant 4.7, rapprochait déjà les deux versets. L’écharde n’est pas identifiée, mais la leçon est claire : la faiblesse est le lieu où repose la puissance du Christ.',
    },
    'suffering:xr:php-3-10': {
      title: 'La communion de ses souffrances',
      explanation:
        'Dans l’épître aux Philippiens, Paul dit vouloir connaître Christ — la puissance de sa résurrection et la communion de ses souffrances, en devenant conforme à lui dans sa mort. C’est le même double mouvement qu’en 2 Corinthiens 4.10–11 : porter la mort de Jésus afin que la vie de Jésus soit manifestée. Pour Paul, souffrir pour Christ n’est pas un détour qui éloigne de sa connaissance, mais l’une des manières dont on le connaît.',
    },
    'suffering:xr:col-1-24': {
      title: 'Souffrir pour l’Église',
      explanation:
        'La formule « la mort agit en nous, et la vie agit en vous » (4.12) a un proche parent en Colossiens 1.24, où Paul se réjouit de ses souffrances pour l’Église et parle d’achever ce qui manque aux afflictions du Christ. Les notes d’étude Tyndale rapprochent elles-mêmes les deux versets. L’expression de Colossiens demande de la prudence. La note de Tyndale explique que la souffrance rédemptrice du Christ est unique et accomplie, tandis que le Christ continue de souffrir à travers son peuple dans un monde hostile. Les chrétiens s’accordent à dire que rien ne peut être ajouté à l’œuvre salvatrice du Christ, mais ils lisent ce verset différemment. Calvin y voyait l’idée que le Christ, ayant souffert une fois en sa propre personne, souffre encore dans ses membres, dont les afflictions affermissent la foi de l’Église — et il rejetait toute lecture qui leur prêterait une valeur expiatoire. L’enseignement catholique (Jean-Paul II, Salvifici Doloris §24, 1984) affirme lui aussi que nul ne peut rien ajouter à la Rédemption, tout en parlant des croyants qui, unis au Christ, participent à sa souffrance rédemptrice pour l’Église.',
    },
    'suffering:xr:1pe-1-6': {
      title: 'Pour un peu de temps — éprouvés comme l’or',
      explanation:
        'Au « moment présent » de Paul répond le « pour un peu de temps » de Pierre, qui ajoute une image : une foi mise à l’épreuve comme l’or est éprouvé par le feu, pour aboutir à la louange et à la gloire lorsque Jésus-Christ apparaîtra. Pierre, comme Paul, présente les épreuves présentes comme brèves et porteuses de sens au regard de la gloire à venir.',
    },
    'suffering:xr:1pe-4-12': {
      title: 'Participer aux souffrances du Christ',
      explanation:
        'Pierre invite les croyants à ne pas être surpris par la fournaise de l’épreuve, comme s’il leur arrivait quelque chose d’étrange, mais à se réjouir de participer aux souffrances du Christ (4.12–13) — la même union au Christ que Paul exprime en parlant de porter la mort de Jésus. Pierre ajoute deux distinctions que Paul partagerait : souffrir comme malfaiteur n’est pas la même chose que souffrir comme chrétien (4.15–16), et ceux qui souffrent doivent remettre leurs âmes au fidèle Créateur en continuant de faire le bien (4.19).',
    },
    'suffering:xr:jas-1-2': {
      title: 'L’épreuve qui produit la persévérance',
      explanation:
        'Jacques, comme Paul, emploie κατεργάζομαι (produire) : l’épreuve de la foi produit la persévérance, qui conduit à la maturité. Là où Paul parle de l’homme intérieur renouvelé de jour en jour, Jacques parle de devenir parfait et accompli, sans que rien ne manque. Aucun des deux ne dit les épreuves agréables ; tous deux les disent fécondes.',
    },
    'suffering:xr:gen-1-3': {
      title: 'Que la lumière brille du sein des ténèbres',
      explanation:
        'Le trésor de 4.7 est la lumière de 4.6, et Paul décrit Dieu comme celui qui a dit « La lumière brillera du sein des ténèbres » et qui a fait briller la lumière dans nos cœurs. Chrysostome entendait ici la création de la lumière en Genèse 1.3 (avec les ténèbres de 1.2), et bien des commentateurs ultérieurs le suivent : Jamieson, Fausset et Brown citent Genèse 1.3, et Calvin jugeait cette lecture la plus naturelle parmi plusieurs, tout en laissant la question ouverte. La formulation grecque exacte (φῶς λάμψει, « la lumière brillera ») correspond à Ésaïe 9.2 dans la Septante plutôt qu’à Genèse 1.3 ; Paul mêle donc peut-être la création et l’aurore promise par Ésaïe. Quoi qu’il en soit, l’enjeu compte pour la souffrance : le Dieu qui a créé la lumière au commencement accomplit maintenant une création nouvelle, et il dépose cette lumière dans des vases fragiles.',
    },
    'suffering:xr:psa-116-10': {
      title: 'J’ai cru, c’est pourquoi j’ai parlé',
      explanation:
        'Paul cite mot pour mot l’Ancien Testament grec : ἐπίστευσα, διὸ ἐλάλησα. Dans la Septante, ces mots ouvrent un psaume distinct (Ps 115 LXX), parce que le grec divise en deux le Psaume 116 hébreu. Calvin notait que Paul suit la traduction grecque courante. Le contexte est éloquent : le psalmiste ajoute qu’il était très affligé. Paul emprunte la voix d’un homme éprouvé qui a continué de croire et de parler — le même esprit de foi qu’il revendique pour lui-même.',
    },
    'suffering:xr:isa-53-3': {
      title: 'Le Serviteur qui a porté nos douleurs',
      explanation:
        'La mort de Jésus que Paul porte avec lui est la mort du Serviteur méprisé, familier de la souffrance et brisé pour nos iniquités. Le chant d’Ésaïe montre que le chemin de l’élu de Dieu passe par la souffrance avant qu’il soit rétabli dans son droit ; le ministère de Paul suit de loin le même modèle — il partage la forme de la souffrance du Christ, non son œuvre expiatoire.',
    },
    'suffering:xr:job-1-9': {
      title: 'Est-ce d’une manière désintéressée que Job craint Dieu ?',
      explanation:
        'Dans le livre de Job, l’accusateur prétend que la foi ne tient que par beau temps : retirez les bénédictions, et le croyant maudira Dieu. L’adoration de Job après ses pertes en est la première réfutation ; la parole de Paul, « abattus, mais non perdus », en est une autre. Tous deux montrent une foi qui tient quand la haie protectrice a disparu. Les deux textes répondent à la théorie cynique de l’accusateur par ce que la grâce accomplit réellement chez ceux qui souffrent.',
    },
    'suffering:xr:rev-21-3': {
      title: 'Les réalités invisibles rendues visibles',
      explanation:
        'Paul fixe les yeux sur ce qui est invisible et éternel. Apocalypse 21 en donne l’image : Dieu habitant avec son peuple, les larmes essuyées (écho de la promesse d’Ésaïe 25.8, selon laquelle Dieu anéantira la mort et essuiera les larmes), et plus de mort, ni deuil, ni cri, ni douleur. Le poids éternel de gloire n’est pas une abstraction, mais une création renouvelée en la présence de Dieu.',
    },
    'suffering:xr:heb-12-1': {
      title: 'Jésus a souffert la croix en vue de la joie',
      explanation:
        'L’épître aux Hébreux appelle les croyants à courir avec persévérance, les regards fixés sur Jésus, qui, en vue de la joie qui lui était réservée, a souffert la croix. C’est la même logique qu’en 2 Corinthiens 4.17–18 — la souffrance présente endurée en vue de ce qui est à venir —, mais appliquée d’abord à Jésus lui-même. (La BSB anglaise rend les deux passages par la même expression, fix our eyes, bien que les verbes grecs diffèrent : σκοπέω en 2 Corinthiens, ἀφοράω en Hébreux.)',
    },
    'suffering:xr:mrk-15-34': {
      title: 'Abandonné — et non abandonné',
      explanation:
        'Paul se dit persécuté, mais non abandonné, avec le verbe ἐγκαταλείπω ; Marc rend le cri de Jésus sur la croix — pourquoi m’as-tu abandonné ? — avec le même verbe. Paul ne cite pas Marc, et le lien est verbal et théologique plutôt que littéraire. Mais il conduit au cœur de l’espérance chrétienne dans la souffrance : beaucoup de chrétiens ont vu dans le Christ abandonné le gage que Dieu n’abandonnera pas son peuple — une promesse qu’Hébreux 13.5 reprend avec le même verbe.',
    },
    'suffering:xr:psa-88': {
      title: 'Une place pour la prière qui s’achève dans les ténèbres',
      explanation:
        'L’expression de Paul « non dans le désespoir » emploie un verbe que l’Ancien Testament grec utilise au Psaume 88 pour le désespoir du psalmiste (88.15 ; LXX 87.16). Le Psaume 88 est une lamentation qui s’achève sans résolution, et pourtant elle demeure une prière, adressée au « Dieu de mon salut ». Tenus ensemble, les deux textes gardent les chrétiens dans la vérité : l’Écriture ne nie pas le désespoir, mais ne le laisse pas non plus avoir le dernier mot.',
    },
  },
  context: {
    'suffering:ctx:occasion': {
      title: 'Une relation tendue avec Corinthe',
      summary:
        'Paul a écrit 2 Corinthiens vers 56 apr. J.-C., depuis la Macédoine, après une visite douloureuse à Corinthe, une lettre sévère (probablement perdue aujourd’hui) et le rapport encourageant de Tite. Certains, dans l’Église, doutaient de son autorité précisément parce qu’il paraissait faible et affligé.',
      detail:
        'Selon les Tyndale Open Study Notes, 1 Corinthiens avait été mal reçue ; Paul fit depuis Éphèse une visite personnelle qui échoua, écrivit dans les larmes une « lettre sévère » portée par Tite, puis, après avoir quitté Éphèse au milieu de graves épreuves, retrouva Tite en Macédoine, qui lui apporta de bonnes nouvelles de la repentance de l’Église. Aux yeux de certains Corinthiens, sa souffrance et sa faiblesse semblaient contredire sa prétention à être apôtre. Le chapitre 4 répond de front à cette objection : la faiblesse est précisément le lieu où la puissance de Dieu se manifeste.',
    },
    'suffering:ctx:asia': {
      title: 'La crise en Asie',
      summary:
        'Peu avant d’écrire, Paul a traversé, dans la province romaine d’Asie, une crise qui menaçait sa vie (1.8–11). Sa nature exacte est inconnue : on a proposé l’émeute d’Éphèse (Ac 19.23–41), un procès avec la perspective d’une exécution, ou — moins probablement — une grave maladie.',
    },
    'suffering:ctx:clay-jars': {
      title: 'La poterie corinthienne et un trésor dans des vases de terre',
      summary:
        'Les artisans de Corinthe fabriquaient des poteries, et surtout des lampes en terre cuite réputées dans tout le monde antique ; des commentateurs anciens notent aussi qu’on conservait souvent des trésors dans des jarres de terre. L’image de Paul était immédiatement concrète : un récipient bon marché et fragile contenant quelque chose d’inestimable.',
      detail:
        'L’introduction de Tyndale relie directement les célèbres lampes en terre cuite de Corinthe à 2 Corinthiens 4.7, ce qui s’accorde avec l’imagerie de la lumière et du vase en 4.6–7. Jamieson, Fausset et Brown remarquent que les Anciens gardaient souvent leurs trésors dans des vases de terre. Certains commentateurs anciens (le commentaire de Matthew Henry, dans la section sur 2 Corinthiens achevée après la mort de Henry par Daniel Mayo, ainsi que Jamieson, Fausset et Brown) y ont aussi vu une allusion aux soldats de Gédéon, dont les torches étaient cachées dans des cruches (Jg 7.16–20) ; cela reste une suggestion, puisque Paul ne mentionne pas Gédéon.',
    },
    'suffering:ctx:triumph': {
      title: 'Mené dans un triomphe romain (2.14)',
      summary:
        'La section qui contient le chapitre 4 s’ouvre sur l’image d’un cortège triomphal romain, où un général menait des captifs tandis que l’on répandait de l’encens le long du parcours. Paul se représente comme le captif du Christ dans ce cortège — le cadre de son propos sur la faiblesse et la gloire.',
      detail:
        'Les notes d’étude Tyndale expliquent que les captifs d’un défilé triomphal étaient en route vers l’arène et la mort, et que l’encens répandu le long du parcours avait pour eux une odeur de mort et, pour les vainqueurs, une odeur de vie (2.15–16). L’autoportrait de Paul en captif prépare le thème du chapitre 4 : porter partout avec soi la mort de Jésus.',
    },
    'suffering:ctx:hardship-lists': {
      title: 'Les catalogues d’épreuves',
      summary:
        'Les listes d’épreuves étaient une forme reconnue de la philosophie morale gréco-romaine, utilisée pour mettre en valeur l’endurance du sage. Les listes de Paul en 1 et 2 Corinthiens (dont 4.8–9) ont été étudiées sur cet arrière-plan — avec une différence essentielle : Paul attribue sa survie à la puissance de Dieu, non à sa propre vertu.',
      detail:
        'L’ouvrage de John T. Fitzgerald, Cracks in an Earthen Vessel (1988) — dont le titre est tiré de 2 Co 4.7 —, examine les catalogues d’épreuves de la correspondance corinthienne en regard de l’usage philosophique de telles listes (le terme grec est peristasis, circonstance ou épreuve), en s’appuyant sur des auteurs comme Épictète et Dion Chrysostome. Le contraste de 4.7 (la puissance vient de Dieu, et non de nous) est propre à Paul : ses listes mettent en valeur non l’autosuffisance d’un sage, mais la force de Dieu dans un vase fragile.',
    },
    'suffering:ctx:lament-psalms': {
      title: 'La lamentation, un genre biblique',
      summary:
        'Les lamentations constituent la plupart des psaumes des livres 1 à 3 du Psautier et comprennent des lamentations individuelles et communautaires. Elles vont généralement de la plainte et de la supplication vers la confiance — ce que ne fait pas le Psaume 88 —, donnant à Israël un langage reconnu pour dire la douleur.',
      detail:
        'L’introduction de Tyndale aux Psaumes classe la plupart des psaumes des livres 1 à 3 parmi les lamentations, subdivisées en lamentations individuelles et communautaires. Le Psaume 13 montre le mouvement habituel, du quadruple « jusqu’à quand » à la confiance et au chant ; le Psaume 88 montre que le canon conserve aussi une lamentation sans résolution. Les Lamentations, Job et Habacuc prolongent la même tradition au-delà du Psautier.',
    },
    'suffering:ctx:ane-wisdom': {
      title: 'Job parmi les textes anciens sur la souffrance',
      summary:
        'D’autres textes du Proche-Orient ancien se débattent avec la figure du juste souffrant, notamment les œuvres babyloniennes connues en anglais sous les titres I Will Praise the Lord of Wisdom et Babylonian Theodicy (la Théodicée babylonienne). Job partage la forme dialoguée de la Théodicée, mais s’en distingue nettement : il est monothéiste, et son héros ne renonce jamais à son attachement à Dieu.',
      detail:
        'L’introduction de Tyndale à Job, qui s’appuie sur les Ancient Near Eastern Texts de Pritchard, note que dans I Will Praise the Lord of Wisdom, celui qui souffre suppose quelque péché inconnu et est guéri par des exorcismes, tandis que la Théodicée babylonienne recourt à un dialogue très semblable à celui de Job, mais dans un monde polythéiste et avec un souffrant qui menace de renoncer à l’obéissance. Le cadre du récit de Job est patriarcal ; la date de composition du livre est incertaine.',
    },
    'suffering:ctx:retribution': {
      title: 'Celui qui souffre l’avait-il mérité ?',
      summary:
        'Une conviction répandue dans le monde biblique — exprimée par les amis de Job et par les disciples de Jésus — voulait que la souffrance soit toujours la conséquence directe du péché de celui qui souffre. L’Écriture affirme que le péché a des conséquences, mais nie à maintes reprises que chaque calamité soit un verdict sur ses victimes.',
      detail:
        'Les notes d’étude Tyndale sur Job décrivent le raisonnement serré des amis — Dieu est juste, donc la souffrance de Job doit être une punition — et montrent que le livre rejette cette logique de rétribution mécanique. En Jean 9.2, les disciples supposent que le péché de quelqu’un a causé la cécité d’un homme, et Jésus les reprend. En Luc 13, Jésus répond à l’idée populaire selon laquelle le malheur ne frappe que les méchants ; les notes ajoutent que l’incident galiléen n’est pas connu par d’autres sources, bien que l’on sache par Josèphe que Pilate réprimait violemment les troubles.',
    },
  },
  literary: {
    placeInBook:
      '2 Corinthiens 4.7–18 s’inscrit dans une longue section (2.14–7.4) où Paul interrompt le récit de sa recherche de Tite pour défendre la nature de son ministère ; le récit reprend en 7.5. Après avoir décrit la gloire incomparable du ministère de la nouvelle alliance (3.1–4.6), Paul affronte maintenant l’objection évidente — si le message est si glorieux, pourquoi son messager est-il si malmené ? — et fait de sa faiblesse une preuve en faveur de l’Évangile.',
    argument:
      'Le passage progresse en cinq étapes. (1) Thèse : le trésor est dans des vases de terre afin que la puissance apparaisse comme celle de Dieu (4.7). (2) Preuves : quatre contrastes appariés — pressés mais non écrasés, dans l’impasse mais non désespérés, persécutés mais non abandonnés, abattus mais non perdus (4.8–9). (3) Interprétation : c’est la mort de Jésus portée dans le corps afin que sa vie soit manifestée, et elle produit la vie chez les Corinthiens (4.10–12). (4) Fondement de l’assurance : la foi du psalmiste, qui parle, et la certitude de la résurrection (4.13–15). (5) Conclusion : c’est pourquoi nous ne perdons pas courage, car l’affliction présente est mise en balance avec la gloire éternelle, et l’invisible demeure quand le visible passe (4.16–18).',
    placeInCanon:
      'Le passage récapitule toute l’histoire biblique. Il fait écho à la création (la lumière qui brille du sein des ténèbres, 4.6, rappelant très probablement Genèse 1.3), assume lucidement la chute (un homme extérieur qui se détruit, 4.16), trouve son centre dans la mort et la résurrection du Christ (4.10, 14), et se tend vers la nouvelle création (4.17–5.5 ; comparer 5.17). Cet arc — création, chute, rédemption, nouvelle création — est le cadre dans lequel la Bible place toute question sur la souffrance.',
    bookOutline: [
      'Salutation et le Dieu de toute consolation',
      'Projets modifiés et la lettre douloureuse',
      'La gloire du ministère de la nouvelle alliance',
      'Un trésor dans des vases de terre : souffrance et espérance',
      'Le ministère de la réconciliation',
      'Appel à ouvrir les cœurs',
      'Le rapport de Tite et la joie de Paul',
      'La collecte pour Jérusalem',
      'Paul défend son apostolat',
    ],
    passageOutline: [
      'Un trésor dans des vases de terre',
      'Quatre contrastes « mais non »',
      'La mort et la vie de Jésus',
      'La foi qui parle',
      'Renouvelés de jour en jour : le poids de gloire',
    ],
    features: {
      'suffering:lit:antitheses': {
        title: 'Quatre contrastes « mais non »',
        description:
          'Les versets 8–9 présentent quatre paires symétriques, chacune formée d’un participe d’épreuve suivi de « mais non » et d’un participe plus fort. Le rythme porte le message : chaque coup est réel, mais aucun n’est définitif. Le deuxième contraste contient un jeu de mots en grec — ἀπορούμενοι (dans l’impasse) mais non ἐξαπορούμενοι (complètement dans l’impasse).',
        structure: [
          { label: '1', text: 'Pressés de toute part — mais non écrasés' },
          { label: '2', text: 'Dans l’impasse — mais non complètement dans l’impasse (désespérés)' },
          { label: '3', text: 'Poursuivis — mais non abandonnés' },
          { label: '4', text: 'Terrassés — mais non détruits' },
        ],
      },
      'suffering:lit:inclusio': {
        title: 'Nous ne perdons pas courage (4.1, 4.16)',
        description:
          'La même proposition, avec le même verbe grec, ouvre le chapitre 4 et revient vers sa fin (4.16). En 4.1, la raison en est la miséricorde de Dieu qui a confié le ministère ; en 4.16, c’est le renouvellement quotidien de l’homme intérieur et la gloire à venir. Ce cadre révèle le but du chapitre : expliquer comment un serviteur de l’Évangile qui souffre continue d’avancer.',
      },
      'suffering:lit:death-life': {
        title: 'La mort et la vie de Jésus',
        description:
          'En 4.10–14, le nom de Jésus apparaît six fois, et la mort et la vie alternent trois fois chacune (4.10, 11, 12). L’expérience de Paul est entièrement décrite dans les termes de l’histoire même de Jésus : sa mort portée dans le corps, sa vie manifestée dans une chair mortelle, sa résurrection gage de la nôtre.',
      },
      'suffering:lit:scales': {
        title: 'L’affliction mise en balance avec la gloire',
        description:
          'Les versets 17–18 sont bâtis sur des couples d’opposés : momentané et éternel, légèreté et poids, affliction et gloire, visible et invisible, passager et éternel. Jean Chrysostome remarquait déjà comment Paul oppose le présent au futur, le bref à l’éternel, le léger au lourd et l’affliction à la gloire — puis redouble son expression pour faire bonne mesure.',
        structure: [
          { label: 'A', text: 'Légère affliction du moment présent' },
          { label: 'A′', text: 'Un poids éternel de gloire, au-delà de toute mesure' },
          { label: 'B', text: 'Ce qui se voit — passager' },
          { label: 'B′', text: 'Ce qui ne se voit pas — éternel' },
        ],
      },
      'suffering:lit:jars': {
        title: 'Un trésor dans des vases de terre',
        description:
          'L’image directrice du passage relie 4.6 à 4.7 : la lumière de la gloire de Dieu sur la face du Christ est le trésor, et les corps et ministères humains, fragiles, sont les vases. La métaphore explique toute l’argumentation — la faiblesse du récipient rend indubitable la puissance du contenu.',
      },
    },
  },
  theology: {
    'suffering:th:providence': {
      title: 'Un Dieu bon et souverain dans un monde déchu',
      summary:
        'L’Écriture tient ensemble la bonté de Dieu, sa souveraineté sur toutes choses, la réalité du mal et la responsabilité humaine — sans prétendre qu’il soit facile de les concilier.',
      detail:
        'Joseph peut dire d’un même souffle que ses frères voulaient le mal et que Dieu voulait le bien (Gn 50.20). Le narrateur de Job montre Dieu permettant ce que fait Satan sans jamais l’expliquer à Job. Les Lamentations disent que ce n’est pas de bon cœur que Dieu afflige (Lm 3.33). La réponse chrétienne historique, formulée de manière classique par Augustin et reprise sous diverses formes par la Confession de foi de Westminster (ch. 5) et le Catéchisme de l’Église catholique (§§311–312), est que rien, pas même le mal, n’échappe à la providence de Dieu : Dieu n’est jamais l’auteur du péché, et pourtant il peut tirer le bien du mal. Les chrétiens divergent sur la manière de décrire le rapport de Dieu aux actes mauvais — l’enseignement catholique dit qu’il permet le mal moral, tandis que la Confession de Westminster affirme qu’il gouverne le péché « not by a bare permission » (non par une simple permission ; voir les perspectives ci-dessous) —, mais ils s’accordent à dire que le mal n’est ni une illusion ni hors du gouvernement de Dieu.',
    },
    'suffering:th:cross': {
      title: 'La théologie de la croix : Dieu dans les profondeurs',
      summary:
        'La réponse la plus complète de Dieu à la souffrance n’est pas un argument, mais un acte : en Christ, il est entré dans la douleur humaine, a été abandonné sur la croix et est ressuscité. La puissance se révèle dans la faiblesse.',
      detail:
        'Le Serviteur d’Ésaïe est un homme de douleur ; Jésus prie sur la croix la lamentation du Psaume 22 ; l’épître aux Hébreux insiste sur le fait qu’il compatit à nos faiblesses. Les thèses de Martin Luther pour la dispute de Heidelberg (1518) en ont fait un principe : Dieu n’est pas véritablement connu lorsqu’on remonte jusqu’à lui par le raisonnement à partir des œuvres et de la gloire, mais dans la souffrance et la croix. 2 Corinthiens 4 applique ce principe au ministère chrétien — la puissance de Dieu se montre dans un vase fêlé —, et John Stott, dans le dernier chapitre de The Cross of Christ, considérait la souffrance du monde depuis le Calvaire, où l’on voit Dieu endurer lui-même la douleur et l’injustice au lieu de les observer de loin.',
    },
    'suffering:th:union': {
      title: 'L’union au Christ dans la souffrance',
      summary:
        'Les croyants partagent l’histoire du Christ : ils portent sa mort et ils auront part à sa résurrection. Souffrir pour Christ est l’une des manières dont les croyants partagent sa vie, non le signe qu’ils ont été abandonnés.',
      detail:
        'Paul parle de porter la mort de Jésus afin que sa vie soit manifestée (2 Co 4.10–11), de la communion de ses souffrances (Ph 3.10) et de souffrir avec Christ pour être glorifié avec lui (Rm 8.17). Pierre invite les croyants à se réjouir de participer aux souffrances du Christ (1 P 4.13). Les chrétiens s’accordent à dire que ces textes n’ajoutent rien à l’œuvre expiatoire unique du Christ, même si les traditions décrivent différemment la part des croyants à ses souffrances (voir Col 1.24). Ces textes décrivent la forme d’une vie façonnée par la croix, ainsi que la certitude de la résurrection (2 Co 4.14).',
    },
    'suffering:th:lament': {
      title: 'La lamentation : une foi qui se plaint à Dieu',
      summary:
        'La Bible donne à ceux qui souffrent des mots pour protester, questionner et pleurer — adressés à Dieu. La lamentation n’est pas le contraire de la foi, mais l’une de ses formes.',
      detail:
        'Une grande partie des Psaumes sont des lamentations ; Job argumente avec Dieu ; les Lamentations (traditionnellement attribuées à Jérémie) pleurent une ville détruite ; Habacuc demande jusqu’à quand ; Jésus lui-même prie une lamentation sur la croix. Le « jusqu’à quand » du Psaume 13 et les ténèbres non dissipées du Psaume 88 montrent que la sincérité devant Dieu n’est pas une irrévérence. A Grief Observed de C. S. Lewis est un exemple moderne du même combat sincère.',
    },
    'suffering:th:refining': {
      title: 'Des épreuves qui affinent',
      summary:
        'Dieu se sert de l’affliction pour produire la persévérance, le caractère et l’espérance, et pour desserrer notre emprise sur ce qui passe. Le bien ne réside pas dans la douleur, mais dans ce que Dieu opère à travers elle.',
      detail:
        'Paul, Jacques et Pierre décrivent chacun les épreuves comme produisant quelque chose — la persévérance, la maturité, une foi éprouvée (Rm 5.3–5 ; Jc 1.2–4 ; 1 P 1.6–7). L’épître aux Hébreux présente l’épreuve comme l’éducation donnée par un père (He 12.5–11), et 2 Corinthiens 4.16 parle de l’homme intérieur renouvelé de jour en jour tandis que l’homme extérieur se détruit. L’Écriture ne dit pas que chaque épreuve est envoyée pour corriger une faute précise (Jn 9.3), ni que la souffrance soit bonne en elle-même.',
    },
    'suffering:th:hope': {
      title: 'Le poids de gloire : l’espérance au-delà de la souffrance',
      summary:
        'L’espérance chrétienne ne nie pas la douleur présente ; elle la place sur une balance face à la résurrection et à la nouvelle création, où la gloire l’emporte sur l’affliction au-delà de toute comparaison.',
      detail:
        'Paul fonde la persévérance sur la résurrection (2 Co 4.14) et sur un poids éternel de gloire (4.17), et poursuit avec l’espérance d’une demeure céleste en 5.1–5. Romains 8.18 dit que les souffrances présentes ne sauraient être comparées à la gloire à venir, et Apocalypse 21 dépeint la fin : Dieu avec son peuple, les larmes essuyées, la mort disparue. C’est cette espérance qui permet à Paul de qualifier de légère une souffrance pesante.',
    },
  },
  perspectives: {
    'suffering:ps:why-evil': {
      question: 'Pourquoi Dieu permet-il le mal et la souffrance ?',
      intro:
        'Les chrétiens s’accordent à dire que Dieu est bon, qu’il est souverain et que le mal est réel. Plusieurs réponses ont été données à la question de savoir pourquoi un tel Dieu permet le mal. Certaines sont des accents philosophiques ou pastoraux que des chrétiens de nombreuses Églises combinent. Un point, cependant, constitue une réelle différence entre les traditions : l’enseignement catholique dit que Dieu permet le mal moral par respect pour la liberté de ses créatures (CEC 311), et John Wesley soutenait que Dieu ne pourrait abolir le péché sans détruire la liberté qu’il a donnée ; la Confession de foi de Westminster, en revanche, enseigne que Dieu a ordonné tout ce qui arrive et qu’il gouverne même le péché « not by a bare permission » (non par une simple permission ; WCF 3.1 ; 5.4), tout en niant qu’il en soit l’auteur.',
      commonGround:
        'Dans leurs formes chrétiennes historiques, ces approches affirment que Dieu est bon et tout-puissant ; que le mal est réel, qu’il n’est pas bon en lui-même et qu’il n’est jamais un péché de Dieu ; que la révolte humaine a abîmé une création bonne ; que la mort et la résurrection du Christ sont la réponse décisive de Dieu au mal ; et que Dieu mettra finalement fin à la souffrance et à la mort. Elles diffèrent dans la manière de rapporter la volonté de Dieu aux maux particuliers, et dans la part de ce qui peut, selon elles, être expliqué en deçà de la nouvelle création.',
      perspectives: {
        'suffering:ps:why-evil:augustinian': {
          tradition: 'Augustinienne',
          label: 'Le mal est une privation de bien ; Dieu le permet parce qu’il peut en tirer le bien',
          summary:
            'Augustin enseignait que tout ce que Dieu a fait est bon et que le mal n’est pas une substance, mais l’absence ou la corruption du bien, comme la maladie est l’absence de la santé. Le mal est entré par le mauvais usage du libre arbitre créé. Dieu ne le permet que parce qu’il est assez puissant et assez bon pour tirer le bien même du mal ; il a jugé meilleur de tirer le bien du mal que de ne permettre aucun mal.',
        },
        'suffering:ps:why-evil:irenaean': {
          tradition: 'Irénéenne (formation de l’âme)',
          label: 'L’humanité a été créée immature ; le monde est un lieu de croissance vers Dieu',
          summary:
            'Irénée de Lyon soutenait que les humains ne pouvaient recevoir la perfection au moment de leur création, étant comme des nourrissons ; ils doivent grandir, par l’expérience du bien et du mal et par le libre choix, vers la ressemblance de Dieu (Contre les hérésies 4.37–39). En 1966, le philosophe John Hick en a tiré une théodicée moderne de la « formation de l’âme » (soul-making), qu’il opposait à celle d’Augustin. Le lecteur notera que la version de Hick traitait la chute comme un mythe et exigeait le salut final de tous (un universalisme critiqué par le théologien Henri Blocher), et que ses travaux ultérieurs sont passés au pluralisme religieux et à une conception métaphorique de l’incarnation, bien en dehors de l’orthodoxie historique. L’accent irénéen sur la croissance ne dépend pas de ces choix.',
        },
        'suffering:ps:why-evil:reformed': {
          tradition: 'Réformée',
          label: 'Dieu ordonne toutes choses, y compris les actes mauvais, à des fins saintes — sans être l’auteur du péché',
          summary:
            'La théologie réformée souligne que la providence de Dieu s’étend à chaque événement, y compris au péché, non par une simple permission, mais en le bornant et en le dirigeant avec sagesse vers ses fins saintes ; pourtant le péché ne procède que de la créature, et Dieu n’en est ni l’auteur ni l’approbateur (Confession de Westminster 5.4). Les paroles de Joseph en Genèse 50.20 en sont le modèle. D. A. Carson défend cette position comme un compatibilisme : Dieu est pleinement souverain et les humains pleinement responsables, un mystère de la providence que l’Écriture affirme sans l’expliquer entièrement. Les écrits pastoraux de John Piper l’appliquent directement, en exhortant les croyants à voir même la maladie comme inscrite dans le dessein de Dieu pour leur bien.',
        },
        'suffering:ps:why-evil:catholic': {
          tradition: 'Catholique',
          label: 'Dieu permet le mal moral, par respect pour la liberté des créatures, et en tire le bien',
          summary:
            'Le Catéchisme de l’Église catholique affirme qu’aucun argument isolé ne tranche la question du mal ; c’est l’ensemble de la foi chrétienne qui y répond. Dieu ne cause le mal moral ni directement ni indirectement, mais il le permet par respect pour la liberté de ses créatures, et il sait en tirer le bien. Le Catéchisme cite l’Enchiridion d’Augustin et les paroles de Joseph en Genèse 50.20, et renvoie à la croix, où le plus grand mal jamais commis est devenu l’occasion du plus grand bien (CEC 309–314, 324). Dans la lettre apostolique Salvifici Doloris (1984), Jean-Paul II ajoute que la rédemption accomplie par le Christ est complète et que rien ne peut y être ajouté, et pourtant ceux qui souffrent en union avec lui participent à sa souffrance rédemptrice (§§19, 24) ; il lit 2 Corinthiens 4.8–11 dans cette lumière (§20).',
        },
        'suffering:ps:why-evil:wesleyan': {
          tradition: 'Arminienne / wesleyenne',
          label: 'Dieu gouverne toutes choses, mais ne détruira pas la liberté qu’il a donnée pour abolir le péché',
          summary:
            'John Wesley défendait une providence particulière autant que générale : Dieu voit chaque créature et chaque souffrance de ses enfants, et prend soin de chacun (Sermon 67, « On Divine Providence », §§12–13, 18–26). Pourquoi alors ne met-il pas simplement fin au péché et à la douleur ? Parce que, soutenait Wesley, Dieu a fait les humains à son image, doués d’entendement, de volonté et de liberté, sans lesquels ils ne seraient capables ni de vertu ni de vice ; abolir le péché par sa seule puissance reviendrait à défaire sa propre œuvre. Ainsi Dieu gouverne les humains comme des êtres libres et intelligents plutôt que comme des machines, leur accordant toute aide vers le bien qui ne supprime pas leur liberté (§15).',
        },
        'suffering:ps:why-evil:free-will-defence': {
          tradition: 'Défense par le libre arbitre (philosophie analytique de la religion)',
          label: 'Un monde de créatures réellement libres peut valoir le risque du mal',
          summary:
            'La défense par le libre arbitre d’Alvin Plantinga répond à la forme logique du problème du mal (telle que la soutenait J. L. Mackie) : il n’est pas contradictoire d’affirmer qu’un Dieu tout-puissant et parfaitement bon existe en même temps que le mal, car un monde peuplé de créatures dotées d’une réelle liberté morale — et donc capables de mal faire — peut être meilleur qu’un monde sans créatures libres, et Dieu lui-même ne peut faire que des créatures libres choisissent toujours librement le bien. Plantinga la présente comme une défense (qui établit la cohérence), non comme une théodicée complète expliquant chaque mal.',
        },
        'suffering:ps:why-evil:orthodox': {
          tradition: 'Orthodoxe',
          label: 'La mort et la corruption sont des ennemis que Dieu a vaincus en Christ',
          summary:
            'La pensée chrétienne orientale tend à parler moins d’expliquer le mal que de la victoire de Dieu sur lui. Athanase décrit une humanité glissant vers la corruption et la mort, et Dieu, ne voulant pas que son ouvrage périsse, prenant un corps semblable au nôtre pour vaincre la mort et restaurer l’incorruptibilité (Sur l’incarnation du Verbe 6–10). Le philosophe orthodoxe David Bentley Hart, écrivant après le tsunami de 2004 dans l’océan Indien, a soutenu que les chrétiens ne devraient pas décrire de telles catastrophes comme des expressions de la volonté de Dieu, mais comme les marques d’un monde tenu captif par des puissances hostiles — une captivité à laquelle Dieu s’oppose et à laquelle il mettra fin dans son royaume.',
        },
        'suffering:ps:why-evil:pastoral': {
          tradition: 'Pastorale et biblique (toutes traditions)',
          label: 'L’Écriture offre la présence de Dieu et un avenir plus qu’une explication complète',
          summary:
            'Beaucoup d’auteurs soulignent que la Bible, comme le livre de Job, ne donne pas à ceux qui souffrent une explication complète, mais leur donne Dieu lui-même — sa présence, sa souffrance en Christ et sa promesse de tout remettre en ordre. Timothy Keller combine des approches philosophiques, bibliques et pratiques, et soutient que Dieu fait naître la joie au moyen de la souffrance, comme le montre la croix. N. T. Wright soutient que la Bible raconte comment Dieu traite le mal plutôt qu’elle n’explique d’où il vient. Joni Eareckson Tada, écrivant avec Steven Estes à partir de décennies de tétraplégie, soutient que Dieu comprend notre douleur, ne la permet que pour des raisons sages et peut s’en servir pour le bien.',
        },
      },
    },
  },
  commentary: {
    'suffering:cm:chrysostom-4-7': {
      lead: 'Sur le trésor dans des vases de terre (4.7). Dans la citation, « vile » signifie humble, sans valeur.',
      quoteTranslation:
        '… c’est précisément là la plus grande des merveilles et une très grande preuve de la puissance de Dieu, qu’un vase de terre ait été rendu capable de porter un si grand éclat et de garder un si haut trésor. … Car c’est alors surtout que la puissance de Dieu se fait remarquer, quand elle accomplit de grandes choses par des moyens vils.',
    },
    'suffering:cm:augustine-enchiridion': {
      lead: 'Pourquoi un Dieu parfaitement bon permet le mal',
      quoteTranslation:
        'Car le Dieu tout-puissant, qui, comme le reconnaissent même les païens, possède sur toutes choses la puissance suprême, étant lui-même souverainement bon, ne permettrait jamais l’existence d’aucun mal parmi ses œuvres s’il n’était assez tout-puissant et assez bon pour tirer le bien du mal même. Car qu’est-ce que ce que nous appelons le mal, sinon l’absence du bien ?',
    },
    'suffering:cm:luther-heidelberg': {
      lead: 'Sur la théologie de la croix (thèses 19–21)',
      text: 'Dans des thèses préparées pour une dispute de son ordre augustinien à Heidelberg, en avril 1518, Luther distingue deux sortes de théologiens. Le théologien de la gloire prétend discerner les attributs invisibles de Dieu — sa sagesse, sa justice et sa bonté — à partir des choses créées et des œuvres humaines, et préfère ainsi la réussite à la souffrance, la gloire à la croix et la force à la faiblesse. Le vrai théologien comprend ce qui est visible de Dieu à travers la souffrance et la croix. La théologie de la gloire, dit Luther, inverse le bien et le mal, tandis que la théologie de la croix appelle les choses par leur nom.',
    },
    'suffering:cm:calvin-4-17': {
      lead: 'Sur la légère affliction du moment présent (4.17)',
      quoteTranslation:
        'Paul prescrit donc le meilleur remède contre ton abattement sous le poids des afflictions, lorsqu’il leur oppose cette félicité à venir qui t’est réservée dans le ciel. … Car cette comparaison rend léger ce qui paraissait lourd auparavant, et rend bref et momentané ce qui semblait d’une durée sans fin.',
    },
    'suffering:cm:mayo-4-8': {
      lead: 'Sur les quatre contrastes de 4.8–9. Tiré du commentaire de Matthew Henry — la section sur 2 Corinthiens a été achevée après la mort de Henry par Daniel Mayo.',
      quoteTranslation:
        'Quelle que soit la condition des enfants de Dieu en ce monde, ils ont un « mais non » pour se consoler ; leur situation est parfois mauvaise, oui, très mauvaise, mais pas aussi mauvaise qu’elle pourrait l’être.',
    },
    'suffering:cm:spurgeon-light-affliction': {
      lead: 'Pourquoi Paul pouvait dire son affliction légère',
      quoteTranslation:
        'Il parlait de « notre légère affliction » alors même qu’il était lourdement affligé, et qu’il ressentait vivement cette affliction. … Il en sentait le poids, et avait pleinement conscience de la pression qu’elle exerçait sur son esprit…',
    },
    'suffering:cm:lewis-problem-of-pain': {
      lead: 'Sur la puissance de Dieu, l’amour de Dieu et la douleur humaine',
      text: 'Lewis soutient que la douleur ne réfute pas l’existence d’un Dieu bon et tout-puissant, dès lors que ces mots sont correctement compris. La toute-puissance n’inclut pas le fait d’accomplir ce qui est contradictoire en soi, et un monde où des créatures libres peuvent se rencontrer requiert un ordre naturel stable, qui peut aussi blesser. L’amour divin est plus exigeant qu’une bienveillance qui voudrait simplement notre confort ; il recherche notre perfection et peut donc causer de la douleur. Dans les chapitres sur la douleur humaine, il soutient que, contrairement au plaisir ou même au péché, la douleur ne peut guère être ignorée, si bien qu’elle peut réveiller ceux qui se contentent de vivre sans Dieu et leur faire prendre conscience de leur besoin de lui. Il ne prétend pas expliquer chaque cas de souffrance, seulement montrer que bonté et souffrance ne sont pas contradictoires.',
    },
    'suffering:cm:lewis-grief-observed': {
      lead: 'Sur le deuil sans réponses toutes faites',
      text: 'Composé à partir des carnets que Lewis tint après la mort de sa femme, Joy Davidman, emportée par un cancer en 1960, et publié d’abord sous le pseudonyme de N. W. Clerk, A Grief Observed relate le deuil avec une franchise peu commune. Lewis y exprime sa colère et son désarroi envers Dieu, ainsi que des questions de foi qu’il avait naguère traitées avec assurance, et ne progresse que peu à peu vers une confiance renouvelée et plus humble, et vers la gratitude pour l’amour qui lui avait été donné. Lu à côté de The Problem of Pain, il montre le même auteur traversant ce sur quoi il avait auparavant raisonné.',
    },
    'suffering:cm:stott-cross': {
      lead: 'Sur la croix et le problème de la souffrance',
      text: 'Dans le dernier chapitre de The Cross of Christ, « Suffering and Glory », Stott affronte le défi que posent le mal et la douleur dans le monde de Dieu. Il reconnaît que la croix laisse sans réponse bien des questions sur la douleur, mais il en fait la lentille à travers laquelle les croyants doivent considérer toute souffrance, car Dieu y apparaît non comme un spectateur lointain, mais comme celui qui est lui-même entré dans la souffrance, l’injustice et la mort humaines.',
    },
    'suffering:cm:keller-walking': {
      lead: 'Traverser la souffrance, et pas seulement l’expliquer',
      text: 'Le livre de Keller réunit trois approches souvent tenues séparées : le problème philosophique de la souffrance, l’enseignement de la Bible à son sujet et l’expérience concrète de la traverser. Sa thèse, exposée dans l’introduction, est que, dans toute la Bible, Dieu ne donne pas seulement la joie à son peuple après la souffrance ou à côté d’elle, mais qu’il la fait naître au moyen de la souffrance — à l’image de la croix, où la souffrance même de Jésus a été le chemin par lequel le salut est venu.',
    },
    'suffering:cm:piper-cancer': {
      lead: 'Ne pas gaspiller l’affliction',
      text: 'Écrit en février 2006, à la veille de sa propre opération d’un cancer de la prostate, l’article de Piper énumère dix manières dont un croyant peut gaspiller une maladie. Entre autres : refuser d’y voir un dessein de Dieu pour le bien du croyant, chercher du réconfort dans les statistiques de survie plutôt qu’en Dieu (il cite 2 Co 1.9), éviter toute pensée de la mort, mesurer la victoire au fait de rester en vie plutôt qu’au prix que l’on attache au Christ, se retirer loin des autres, s’affliger sans espérance, et manquer l’occasion qu’elle offre de rendre témoignage au Christ.',
    },
    'suffering:cm:wright-evil': {
      lead: 'Ce que Dieu fait face au mal',
      text: 'Wright soutient que la culture occidentale moderne est devenue naïve à l’égard du mal, tendant à l’ignorer jusqu’à ce qu’il frappe tout près, puis à réagir en accusant les autres. Plutôt que de proposer une théodicée philosophique, il retrace la manière dont la Bible raconte Dieu aux prises avec le mal — le jugeant tout en offrant sa grâce à travers l’histoire d’Israël, et de manière culminante dans la mort et la résurrection de Jésus, où il voit la réponse de Dieu au mal atteindre son point décisif. Il exhorte ensuite les chrétiens à prier et à œuvrer dès maintenant pour la justice, en anticipant un monde libéré du mal, et surtout à pratiquer le pardon.',
    },
  },
  sermons: {
    'suffering:sm:spurgeon-3244': {
      summary:
        'Prêché un jeudi soir au Metropolitan Tabernacle, ce sermon affirme d’abord que Paul n’était ni naïf, ni endurci, ni insouciant face à la souffrance, puis soutient que l’affliction est légère par comparaison — avec les buts et le grand mobile du service chrétien, avec les souffrances des autres, avec ce que nous méritons, avec les souffrances du Christ et avec les bénédictions dont les croyants jouissent déjà. Il ajoute qu’elle paraît légère à mesure que les croyants font l’expérience de la grâce de Dieu qui les soutient et voient la croissance dans la grâce à laquelle elle conduit, et enfin qu’elle est légère comparée à la gloire qui sera bientôt révélée.',
    },
    'suffering:sm:spurgeon-35': {
      summary:
        'L’un des premiers sermons de Spurgeon, sur la fournaise de l’affliction (selon la formulation de la KJV en Es 48.10). Spurgeon souligne que l’amour de Dieu ne change pas dans la fournaise, puis donne les raisons pour lesquelles les croyants sont éprouvés — toutes les choses précieuses sont mises à l’épreuve, et la souffrance les rend semblables au Christ — et décrit les bienfaits de la fournaise, à commencer par la purification.',
    },
    'suffering:sm:keller-2004': {
      summary:
        'Keller présente l’espérance chrétienne comme une ferme assurance quant à l’avenir final du croyant avec Dieu dans la nouvelle création, une assurance qui change la manière d’affronter la souffrance et la déception. À partir de 2 Corinthiens, il fait ensuite trois observations sur la souffrance : personne n’y échappe, elle suit un modèle, et elle a un avenir.',
    },
  },
  verseNotes: {
    '2CO.4.7': [
      'Ce trésor est la lumière de 4.6 — la connaissance de la gloire de Dieu sur la face du Christ. Paul dit qu’il est porté dans des vases de terre : des corps et des ministères humains, fragiles et ordinaires. La raison en est donnée aussitôt : afin que cette grande puissance soit attribuée à Dieu, et non à nous. Corinthe était connue pour ses lampes en terre cuite, ce qui rend l’image de la lumière dans un vase particulièrement concrète.',
    ],
    '2CO.4.8': [
      'Les deux premiers des quatre contrastes : pressés de toute manière, mais non écrasés ; dans l’impasse, mais non désespérés. Le premier participe vient de θλίβω, le verbe qui se trouve derrière θλῖψις (affliction) en 4.17. Le second contraste est un jeu de mots grec — sans issue, mais pas complètement sans issue. Paul reconnaît une pression et un désarroi réels ; ce qu’il nie, c’est la défaite finale.',
    ],
    '2CO.4.9': [
      'Les deux derniers contrastes : la persécution sans l’abandon, être terrassé sans être détruit. Le mot « abandonnés » (ἐγκαταλείπω) rend le même verbe que Marc emploie pour le cri de Jésus sur la croix. Paul peut être abandonné par les hommes, mais pas par Dieu — une promesse qu’Hébreux 13.5 énonce avec le même verbe.',
    ],
    '2CO.4.10': [
      'Paul lit ses souffrances à travers l’histoire de Jésus : il porte toujours dans son corps la mort (νέκρωσις) de Jésus, afin que la vie de Jésus y soit aussi manifestée. L’exposition quotidienne au danger est une sorte de mort continue ; sa survie et son endurance font paraître le Christ ressuscité. C’est l’union au Christ, non un ajout à sa mort expiatoire.',
    ],
    '2CO.4.11': [
      'Le verset 11 reformule plus simplement le verset 10 : bien que toujours vivants, Paul et ses compagnons sont sans cesse livrés à la mort à cause de Jésus. Le but est le même, avec désormais un adjectif éloquent — la vie de Jésus manifestée dans une chair mortelle. La vie de la résurrection se montre précisément dans ce qui meurt.',
    ],
    '2CO.4.12': [
      'La mort agit dans l’apôtre ; la vie agit chez les Corinthiens. Les souffrances de Paul ne sont pas une affaire privée ; elles servent l’Église, car c’est par son exposition au danger que l’Évangile atteint et affermit les autres. Les notes d’étude Tyndale rapprochent ce verset de Colossiens 1.24, où Paul parle de souffrir pour le corps du Christ.',
    ],
    '2CO.4.13': [
      'Paul cite le Psaume 116.10 sous sa forme grecque : « J’ai cru, c’est pourquoi j’ai parlé ». Dans le psaume, celui qui parle ajoute qu’il était très affligé ; Paul revendique le même esprit de foi, qui continue de croire et de parler sous la pression. Les notes d’étude Tyndale voient dans cette foi le secret de la résilience de Paul.',
    ],
    '2CO.4.14': [
      'Le contenu de la foi de Paul : le Dieu qui a ressuscité Jésus ressuscitera aussi Paul et le fera paraître, avec les Corinthiens, en sa présence. La résurrection est le fondement de la persévérance. La souffrance n’est pas le dernier chapitre, parce que le tombeau de Jésus ne l’a pas été.',
    ],
    '2CO.4.15': [
      'Paul affirme que tout ce qu’il endure est pour le bien des Corinthiens. Ses épreuves servent un enchaînement de grâce : la grâce atteignant un plus grand nombre, suscitant davantage d’actions de grâces, à la gloire de Dieu. La souffrance dans le ministère s’inscrit dans le dessein de Dieu de répandre la louange.',
    ],
    '2CO.4.16': [
      'Paul reprend les mots de 4.1 — nous ne perdons pas courage —, si bien qu’ils encadrent la plus grande partie du chapitre. Tandis que l’homme extérieur se détruit sous l’effet de l’âge et des épreuves, l’homme intérieur se renouvelle chaque jour. Les notes d’étude Tyndale observent que Paul était usé physiquement et émotionnellement, mais que son esprit était revivifié par la puissance de Dieu. Le renouvellement est quotidien, et non accompli une fois pour toutes.',
    ],
    '2CO.4.17': [
      'Paul qualifie l’affliction présente de légère et momentanée, et dit qu’elle produit un poids éternel de gloire, au-delà de toute comparaison. Il associe des contraires — la légèreté et le poids, le momentané et l’éternel, l’affliction et la gloire — et redouble son superlatif (littéralement « à l’excès jusqu’à l’excès »). Il ne dit pas que ses souffrances sont insignifiantes (voir 11.23–29) ; il les met en balance avec ce qu’elles produisent. Certains interprètes y entendent un écho hébreu, puisque kavod (gloire) est apparenté à une racine qui signifie « lourd », mais cela reste une suggestion.',
    ],
    '2CO.4.18': [
      'Paul garde les yeux fixés sur l’invisible plutôt que sur le visible, car ce qui se voit est passager et ce qui ne se voit pas dure éternellement. Le verbe (σκοπέω) signifie regarder attentivement, garder son attention fixée sur quelque chose. Les notes d’étude Tyndale le disent simplement : ne regarder que les difficultés présentes nous fait défaillir, mais voir la vie à la lumière de la réalité éternelle montre que les difficultés passeront.',
    ],
  },
  concepts: {
    'suffering:c:why-god-allows': {
      label: 'Pourquoi Dieu permet la souffrance',
      aliases: [
        'pourquoi dieu permet-il la souffrance',
        'pourquoi dieu permet la souffrance',
        'pourquoi dieu permet-il le mal',
        'pourquoi dieu permet le mal',
        'pourquoi dieu laisse-t-il arriver des malheurs',
        'pourquoi dieu laisse faire le mal',
        'pourquoi arrive-t-il des malheurs',
        'problème du mal',
        'le problème du mal',
        'problème de la souffrance',
        'théodicée',
        'théodicées',
        'si dieu est bon',
        'pourquoi la souffrance',
        'pourquoi moi',
        'libre arbitre',
        'défense par le libre arbitre',
        'formation de l’âme',
        'privation du bien',
        'dieu permet-il le mal',
        'dieu permet le mal',
        'dieu est-il l’auteur du mal',
        "dieu est-il l'auteur du mal",
        'dieu est-il responsable du mal',
        'dieu contrôle-t-il le mal',
        'souveraineté et mal',
        'simple permission',
        'vision catholique de la souffrance',
        'vision wesleyenne de la souffrance',
        'vision arminienne de la souffrance',
        'vision réformée de la souffrance',
        'vision orthodoxe de la souffrance',
      ],
      answer:
        'L’Écriture ne donne pas de réponse unique et bien ordonnée, mais elle donne des vérités fermes : Dieu est bon et souverain, le péché et la mort sont entrés dans son monde bon par la révolte humaine, la souffrance n’est pas toujours une punition, et Dieu est entré dans notre souffrance en Christ et y mettra fin. Les chrétiens ont expliqué de diverses manières pourquoi Dieu permet le mal — le bien tiré du mal selon Augustin, l’accent irénéen sur la croissance, l’insistance réformée sur les desseins souverains de Dieu, l’accent catholique et wesleyen sur la liberté que Dieu a donnée à ses créatures, la défense par le libre arbitre et l’accent orthodoxe sur la victoire du Christ sur la mort —, et la section Théologie présente ces réponses côte à côte, y compris là où les traditions divergent réellement.',
    },
    'suffering:c:affliction': {
      label: 'Affliction (θλῖψις)',
      aliases: [
        'affliction',
        'afflictions',
        'affligé',
        'affligés',
        'tribulation',
        'tribulations',
        'détresse',
        'pressés de toute manière',
        'pression',
        'difficultés',
        'légère affliction',
        'légères afflictions',
        'affliction momentanée',
        'mot grec pour affliction',
        'quel est le mot grec pour affliction',
      ],
      answer:
        'Le mot grec derrière « afflictions » en 4.17 est θλῖψις (thlipsis, Strong G2347) : littéralement une pression, et au figuré l’affliction ou la détresse. D’après notre décompte, il apparaît 45 fois dans le Nouveau Testament — dont 9 en 2 Corinthiens, plus que dans tout autre livre —, et le verbe apparenté ouvre la liste des épreuves en 4.8 (pressés). Paul ne qualifie cette affliction de légère et momentanée qu’en la mettant en balance avec un poids éternel de gloire.',
    },
    'suffering:c:jars-of-clay': {
      label: 'Vases de terre',
      aliases: [
        'vases de terre',
        'vase de terre',
        'vases d’argile',
        "vases d'argile",
        'vase d’argile',
        'jarres d’argile',
        'ce trésor',
        'trésor',
        'faiblesse',
        'fragile',
        'fragilité',
        'poterie',
        'que veut dire vases de terre',
        'que signifient les vases de terre',
      ],
      answer:
        'En 4.7, le trésor est la lumière de l’Évangile évoquée en 4.6, et les vases de terre (ὀστράκινος, « de terre ») sont les corps et les ministères humains, fragiles. Paul dit que Dieu a disposé les choses ainsi pour que cette puissance incomparable soit manifestement celle de Dieu, et non la nôtre. Corinthe était célèbre pour ses lampes en terre cuite, et l’on gardait souvent des trésors dans des récipients de terre : l’image était donc parlante ; des commentateurs anciens ont aussi suggéré une allusion aux cruches de Gédéon, même si Paul ne le dit pas.',
    },
    'suffering:c:lament': {
      label: 'La lamentation et le « jusqu’à quand ? »',
      aliases: [
        'lamentation',
        'se lamenter',
        'jusqu’à quand',
        "jusqu'à quand",
        'jusques à quand',
        'jusqu’à quand seigneur',
        "jusqu'à quand seigneur",
        'jusques à quand éternel',
        'plainte',
        'se plaindre à dieu',
        'ai-je le droit d’être en colère contre dieu',
        "ai-je le droit d'être en colère contre dieu",
        'peut-on être en colère contre dieu',
        'en colère contre dieu',
        'psaume 13',
        'psaume 88',
        'habacuc',
        'deuil',
        'chagrin',
        'pleurer',
      ],
      answer:
        'La lamentation est une prière qui apporte à Dieu la douleur, la protestation et les questions. Le « jusqu’à quand » de la Bible (en hébreu עַד־אָנָה, littéralement « jusqu’où ? ») apparaît quatre fois dans le seul passage du Psaume 13.1–2, et le Psaume 88 s’achève même dans les ténèbres — pourtant tous deux s’adressent à Dieu. L’Écriture traite la plainte sincère comme une forme de foi, et Jésus lui-même a prié une lamentation sur la croix.',
    },
    'suffering:c:despair': {
      label: 'Dans la détresse, mais non dans le désespoir',
      aliases: [
        'désespoir',
        'désespéré',
        'désespérée',
        'désespérer',
        'non dans le désespoir',
        'dans le désespoir',
        'perplexe',
        'perplexité',
        'sans espoir',
        'dépression',
        'écrasé',
        'écrasée',
        'désespérer de la vie',
        'nous désespérions même de conserver la vie',
      ],
      answer:
        'En 4.8, Paul se dit dans la détresse — littéralement perplexe (ἀπορέω, sans issue) —, mais non dans le désespoir (ἐξαπορέω, complètement sans issue) : un jeu de mots grec. Le second verbe n’apparaît qu’une autre fois dans le Nouveau Testament, en 1.8, où Paul reconnaît qu’en Asie ils ont bel et bien désespéré même de la vie. « Non dans le désespoir » n’est donc pas la revendication d’un calme constant ; c’est le témoignage que le désespoir n’a pas eu le dernier mot, parce qu’ils ont appris à se confier dans le Dieu qui ressuscite les morts.',
    },
    'suffering:c:lose-heart': {
      label: 'Ne pas perdre courage',
      aliases: [
        'perdre courage',
        'ne pas perdre courage',
        'nous ne perdons pas courage',
        'ne perdons pas courage',
        'découragé',
        'découragée',
        'découragement',
        'abandonner',
        'baisser les bras',
        'tout abandonner',
        'persévérer',
        'endurance',
        'se renouvelle de jour en jour',
        'renouvelé de jour en jour',
        'homme intérieur',
        'homme extérieur',
        'se lasser',
      ],
      answer:
        '« Nous ne perdons pas courage » (ἐκκακέω, G1573) encadre la plus grande partie de 2 Corinthiens 4, en 4.1 et en 4.16. Les raisons de Paul sont la miséricorde de Dieu qui l’a appelé (4.1), le renouvellement quotidien de l’homme intérieur alors même que l’homme extérieur se détruit (4.16), et la gloire éternelle qui l’emporte sur l’affliction présente (4.17). Le même verbe apparaît dans l’appel de Jésus à prier sans se relâcher (Lc 18.1).',
    },
    'suffering:c:weight-of-glory': {
      label: 'Le poids de gloire',
      aliases: [
        'poids de gloire',
        'poids éternel de gloire',
        'un poids éternel de gloire',
        'gloire',
        'poids',
        'ciel',
        'éternité',
        'invisible',
        'les choses invisibles',
        'ce qui ne se voit pas',
        'nous regardons aux choses invisibles',
      ],
      answer:
        'En 4.17, Paul oppose la légèreté de l’affliction présente à un poids (βάρος) éternel de gloire, « à l’excès jusqu’à l’excès ». Une ancienne ligne d’interprétation, signalée dans l’édition de la Calvin Translation Society, y entend l’hébreu kavod (gloire), apparenté à une racine qui signifie « lourd » — une suggestion séduisante, mais non démontrée. Le point est clair dans tous les cas : ce qui est invisible et éternel l’emporte sur ce qui est visible et passager (4.18).',
    },
    'suffering:c:death-and-life': {
      label: 'Porter la mort de Jésus',
      aliases: [
        'la mort de jésus',
        'mort de jésus',
        'la vie de jésus',
        'union au christ',
        'union avec christ',
        'union avec le christ',
        'communion de ses souffrances',
        'la communion de ses souffrances',
        'participer à ses souffrances',
        'participer aux souffrances du christ',
        'souffrir avec christ',
        'souffrir avec le christ',
        'chair mortelle',
        'corps mortel',
        'la mort agit en nous',
        'colossiens 1.24',
        'colossiens 1:24',
        'ce qui manque aux souffrances de christ',
        'ce qui manque aux souffrances du christ',
        'ce qui manque aux afflictions du christ',
        'souffrance rédemptrice',
        'salvifici doloris',
      ],
      answer:
        'Paul décrit ses souffrances comme le fait de porter partout la mort (νέκρωσις) de Jésus, afin que la vie de Jésus soit manifestée dans son corps mortel (4.10–11). C’est l’union au Christ : les croyants partagent la forme de sa mort et la puissance de sa résurrection (Ph 3.10 ; 1 P 4.13). Les chrétiens s’accordent à dire que cela n’ajoute rien à son œuvre expiatoire unique — comme le disent les notes d’étude Tyndale sur Colossiens 1.24, la souffrance rédemptrice du Christ est unique et accomplie —, même si les traditions décrivent différemment la part des croyants à ses souffrances : Calvin parlait du Christ souffrant dans ses membres pour l’affermissement de l’Église, tandis que l’enseignement catholique (Salvifici Doloris) parle des croyants participant à la souffrance rédemptrice du Christ.',
    },
    'suffering:c:punishment': {
      label: 'La souffrance est-elle une punition ?',
      aliases: [
        'punition',
        'puni',
        'punie',
        'dieu me punit-il',
        'est-ce que dieu me punit',
        'est-ce une punition',
        'ai-je mérité cela',
        'est-ce que je l’ai mérité',
        "est-ce que je l'ai mérité",
        'mériter',
        'karma',
        'rétribution',
        'qui a péché',
        'les amis de job',
        'amis de job',
        'la tour de siloé',
        'tour de siloé',
        'aveugle de naissance',
        'né aveugle',
        'le malheur arrive aux gens bien',
      ],
      answer:
        'L’Écriture affirme que le péché a des conséquences, mais elle nie à maintes reprises que chaque calamité soit un verdict sur ses victimes. Les amis de Job affirmaient que sa souffrance devait être une punition, et le livre leur donne tort ; Jésus a dit à ses disciples que la cécité d’un homme n’avait pour cause ni son péché ni celui de ses parents (Jn 9.3), et que les victimes de Pilate et de la tour de Siloé n’étaient pas plus coupables que les autres (Lc 13.1–5).',
    },
    'suffering:c:purpose': {
      label: 'Les desseins de Dieu dans la souffrance',
      aliases: [
        'le but de la souffrance',
        'sens de la souffrance',
        'la souffrance a-t-elle un sens',
        'la souffrance a-t-elle un but',
        'que fait dieu',
        'affiner',
        'affinés',
        'fournaise',
        'fournaise de l’affliction',
        'persévérance',
        'caractère',
        'discipline',
        'châtiment',
        'épreuves',
        'épreuve',
        'éprouvés',
        'dieu l’a changé en bien',
        "dieu l'a changé en bien",
        'katergazomai',
        'κατεργάζομαι',
      ],
      answer:
        'Le Nouveau Testament dit à plusieurs reprises que l’affliction produit quelque chose. Romains 5.3, Jacques 1.3 et 2 Corinthiens 4.17 emploient tous le même verbe grec (κατεργάζομαι) : la souffrance produit la persévérance et l’espérance, l’épreuve produit l’endurance, et l’affliction présente produit un poids éternel de gloire. La parole de Joseph — vous vouliez le mal, Dieu voulait le bien (Gn 50.20) — montre que le dessein de Dieu ne rend pas le mal bon ; il prévaut sur lui.',
    },
    'suffering:c:suffering-god': {
      label: 'Dieu avec nous dans la souffrance',
      aliases: [
        'dieu souffre-t-il',
        'est-ce que dieu souffre',
        'dieu peut-il souffrir',
        'dieu souffre',
        'un dieu qui souffre',
        'impassibilité',
        'dieu est-il impassible',
        'dieu ressent-il la douleur',
        'où est dieu',
        'où était dieu',
        'dieu avec nous',
        'emmanuel',
        'abandonné',
        'pourquoi m’as-tu abandonné',
        "pourquoi m'as-tu abandonné",
        'mon dieu mon dieu',
        'théologie de la croix',
        'croix',
        'homme de douleur',
        'compatir',
      ],
      answer:
        'La réponse la plus profonde de l’Écriture à la souffrance est que Dieu y est entré. Le Serviteur d’Ésaïe est un homme de douleur, Jésus crie sur la croix avec les mots du Psaume 22, et l’épître aux Hébreux dit qu’il compatit à nos faiblesses. En 4.9, Paul est persécuté, mais non abandonné — avec le même verbe que le cri d’abandon de Jésus. La théologie de la croix de Luther et le chapitre de John Stott sur la souffrance soutiennent tous deux que la croix est le lieu où Dieu se laisse vraiment voir. La théologie chrétienne classique situe cette souffrance dans le Fils incarné, qui a souffert dans sa nature humaine — la Confession de foi de Westminster, par exemple, confesse que Dieu est « without body, parts, or passions » (sans corps, sans parties ni passions ; 2.1) —, et la mesure dans laquelle on peut parler de souffrance en Dieu lui-même est débattue parmi les théologiens.',
    },
    'suffering:c:hope': {
      label: 'L’espérance au-delà de la souffrance',
      aliases: [
        'espérance',
        'espoir',
        'plus de larmes',
        'il essuiera toute larme',
        'essuyer toute larme',
        'nouvelle création',
        'nouveaux cieux et nouvelle terre',
        'résurrection',
        'est-ce que cela finira',
        'la souffrance finira-t-elle',
        'la souffrance prendra-t-elle fin',
        'vie après la mort',
        'l’au-delà',
        'vie éternelle',
        'gloire à venir',
        'apocalypse 21',
      ],
      answer:
        'L’espérance chrétienne ne nie pas la douleur présente ; elle la met en balance. Paul fonde la persévérance sur la résurrection (2 Co 4.14) et sur un poids éternel de gloire (4.17) ; Romains 8.18 dit que les souffrances du temps présent ne sauraient être comparées à la gloire à venir, et Apocalypse 21 dépeint Dieu habitant avec son peuple, toute larme essuyée et la mort disparue. La Bible s’achève non sur une explication de la souffrance, mais sur sa fin.',
    },
  },
};

export default overlay;
