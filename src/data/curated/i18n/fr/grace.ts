/**
 * Français — traduction de l’étude thématique « La grâce » (src/data/curated/studies/grace.ts).
 *
 * Les paroles bibliques citées entre guillemets suivent la Louis Segond 1910 (LSG), version
 * française par défaut ; quand une autre traduction est discutée, elle est nommée. Ailleurs,
 * l’Écriture est paraphrasée sans guillemets. Ancres vérifiées sur le texte de LSG, Darby,
 * NCL et Ostervald. Les citations vérifiées ne sont pas réécrites : elles reçoivent seulement
 * une traduction libre (quoteTranslation). Les titres d’ouvrages modernes restent tels qu’ils
 * sont cités.
 */
import type { StudyOverlay } from '../types';

const ev = (verse: number) => ({ book: 'EPH', chapter: 2, verse });

const overlay: StudyOverlay = {
  studyId: 'grace',
  locale: 'fr',
  title: 'La grâce',
  subtitle: 'La faveur imméritée de Dieu en Christ',
  summary:
    'Cette étude suit l’un des mots les plus riches de la Bible — la grâce —, depuis le langage de la faveur et de l’amour fidèle dans l’Ancien Testament jusqu’à sa pleine expression en Jésus-Christ. Elle s’ancre dans Éphésiens 2.1–10, où Paul passe de la détresse de l’humanité, par le tournant « Mais Dieu », à un salut qui vient par grâce, par le moyen de la foi, comme un don de Dieu et non comme un salaire. En chemin, elle examine les principaux mots hébreux et grecs, explique ce que signifiait charis dans un monde de patrons et de bienfaiteurs, et montre comment la grâce produit une nouvelle manière de vivre (2.10). Elle expose aussi, aussi équitablement que possible, les points sur lesquels les traditions chrétiennes s’accordent au sujet de la grâce et ceux sur lesquels elles divergent depuis longtemps.',
  opening:
    'La grâce est au cœur de la foi chrétienne, et peu de passages le disent plus clairement qu’Éphésiens 2.1–10 — je l’ai ouvert à côté de nous, avec les mots clés en évidence. J’ai aussi rassemblé l’arrière-plan de l’Ancien Testament, le grec qui se cache derrière « grâce », ce que les premiers lecteurs ont pu entendre, et des voix qui vont d’Augustin à Tim Keller. Voulez-vous commencer par le sens du mot, par l’argumentation de Paul dans ces versets, ou par la manière dont la grâce transforme une vie ?',
  matchTopics: [
    'grâce',
    'la grâce',
    'la grâce de dieu',
    'grâce de dieu',
    'faveur imméritée',
    'grâce imméritée',
    'qu’est-ce que la grâce',
    'sauvé par grâce',
    'sauvés par grâce',
    'sauvés par la grâce',
    'c’est par grâce que vous êtes sauvés',
    'que dit la bible sur la grâce',
    'que dit la bible de la grâce',
  ],
  suggestedQuestions: [
    'Quel mot grec se cache derrière « grâce » ?',
    'Que veut dire Paul par « chair » ici ?',
    'Expliquez le verset 8 plus en détail.',
    'Comment les premiers lecteurs comprenaient-ils la grâce ?',
    'Où Paul parle-t-il ailleurs du salut par grâce ?',
    'Quel lien avec l’épître aux Romains ?',
    'Comment concilier Éphésiens 2.10 et Jacques 2 ?',
    'Qu’a dit Tim Keller sur la grâce ?',
    'Existe-t-il différentes interprétations théologiques de ce passage ?',
  ],
  topic: {
    name: 'La grâce',
    question: 'Qu’entend la Bible par « grâce » ?',
    definition:
      'Dans l’Écriture, la grâce est la faveur libre et imméritée de Dieu envers des personnes qui n’y ont aucun droit, avec les dons qui découlent de cette faveur. Israël en a appris le vocabulaire bien avant Paul : chen (faveur), chanan (faire grâce) et hesed (amour fidèle et loyal) décrivent un Dieu qui s’est révélé miséricordieux et compatissant (Ex 34.6–7) et qui a choisi Israël par pur amour, non pour ses mérites (Dt 7.7–8). Dans le Nouveau Testament, le grec charis désigne ce que Dieu a fait en Christ : les pécheurs sont justifiés gratuitement par sa grâce (Rm 3.24) et sauvés par grâce, par le moyen de la foi, comme un don et non par les œuvres (Ep 2.8–9). La grâce est aussi une puissance. Elle enseigne les croyants à mener une vie pieuse (Tt 2.11–12), les soutient dans la faiblesse (2 Co 12.9) et façonne une nouvelle manière de marcher (Ep 2.10).',
  },
  topicPassages: {
    'grace:kp:gen-6-8': {
      title: 'Noé trouva grâce',
      group: 'La grâce dans l’Ancien Testament',
      note: 'Premier emploi biblique de chen (faveur). Sur fond de corruption universelle (6.5–7), le narrateur mentionne la faveur de l’Éternel envers Noé avant de décrire la justice de Noé, dans la nouvelle section qui commence en 6.9 (« Voici la postérité de Noé »). Beaucoup de lecteurs y voient un premier indice que le salut commence par la disposition de Dieu plutôt que par l’accomplissement humain, même si l’expression « trouver grâce aux yeux de » peut ailleurs faire suite à une conduite observée (Gn 39.4).',
    },
    'grace:kp:exod-34-6': {
      title: 'L’Éternel, miséricordieux et compatissant',
      group: 'La grâce dans l’Ancien Testament',
      note: 'La manière dont Dieu se décrit à Moïse après l’épisode du veau d’or : compatissant, faisant grâce (channun), riche en bonté (hesed) et en fidélité, pardonnant l’iniquité — sans pourtant tenir le coupable pour innocent. Cette confession résonne dans tout l’Ancien Testament (Ps 103.8 ; Jon 4.2), et c’est le terreau où grandit le langage néotestamentaire de la grâce.',
    },
    'grace:kp:deut-7-7': {
      title: 'Choisis parce que l’Éternel vous aime',
      group: 'La grâce dans l’Ancien Testament',
      note: 'Moïse nie qu’Israël ait été choisi pour son nombre ou sa force ; la seule raison donnée est que l’Éternel l’aimait et voulait tenir son serment. Une élection fondée sur l’amour de Dieu plutôt que sur la valeur de ceux qui en bénéficient, c’est la grâce, même si le mot n’y est pas.',
    },
    'grace:kp:ps-103-8': {
      title: 'Il ne nous traite pas selon nos péchés',
      group: 'La grâce dans l’Ancien Testament',
      note: 'David chante la confession d’Exode 34 (103.8) et en déploie le sens : Dieu ne nous a pas rendu selon nos iniquités, il a éloigné de nous nos transgressions autant que l’orient est éloigné de l’occident, et il a compassion de nous comme un père a compassion de ses enfants, se souvenant que nous sommes poussière.',
    },
    'grace:kp:jonah-4-2': {
      title: 'En colère contre la grâce',
      group: 'La grâce dans l’Ancien Testament',
      note: 'Jonas cite la même confession — compatissant, miséricordieux, riche en bonté — pour s’en plaindre : il a fui parce qu’il savait que Dieu épargnerait Ninive. La grâce choque quand elle atteint des gens que nous jugeons indignes, un thème que Jésus reprend avec le fils aîné de la parabole (Luc 15.25–32).',
    },
    'grace:kp:john-1-14': {
      title: 'Pleine de grâce et de vérité',
      group: 'La grâce révélée en Christ',
      note: 'La Parole faite chair est pleine de grâce et de vérité, et de sa plénitude nous recevons grâce pour grâce. Jean oppose la loi donnée par Moïse à la grâce et à la vérité venues par Jésus-Christ — non pour rejeter la loi comme mauvaise, mais pour désigner le Christ comme la révélation la plus pleine de la faveur de Dieu.',
    },
    'grace:kp:2-cor-8-9': {
      title: 'Il s’est fait pauvre pour vous',
      group: 'La grâce révélée en Christ',
      note: 'Paul définit la grâce de notre Seigneur Jésus-Christ comme un échange coûteux : de riche qu’il était, il s’est fait pauvre afin que nous soyons enrichis. La grâce n’est pas ici une attitude abstraite, mais un acte de don de soi.',
    },
    'grace:kp:luke-15': {
      title: 'Le père et ses deux fils',
      group: 'La grâce révélée en Christ',
      note: 'Parabole racontée à des pharisiens qui murmuraient parce que Jésus accueillait des pécheurs (15.1–2). Le père court au-devant du fils cadet qui revient, et il sort aussi supplier le fils aîné plein de ressentiment. La grâce rejoint à la fois le rebelle déclaré et l’homme consciencieux qui croit avoir mérité sa place.',
    },
    'grace:kp:matt-20': {
      title: 'Le maître généreux',
      group: 'La grâce révélée en Christ',
      note: 'Les ouvriers embauchés à la dernière heure reçoivent le même salaire que ceux qui ont travaillé toute la journée. La réponse du maître — « Ne m’est-il pas permis de faire de mon bien ce que je veux ? » — met à nu notre réflexe de mesurer les dons de Dieu à notre travail.',
    },
    'grace:kp:eph-2-1': {
      title: 'C’est par grâce que vous êtes sauvés',
      group: 'Sauvés par grâce',
      note: 'Le passage d’ancrage de cette étude. Paul passe de la mort spirituelle (2.1–3) à l’intervention de Dieu (2.4–7), résume le salut — par grâce, par le moyen de la foi, don de Dieu et non fruit des œuvres (2.8–9) — et conclut sur la vie nouvelle faite des bonnes œuvres que Dieu a préparées (2.10).',
    },
    'grace:kp:rom-3-21': {
      title: 'Gratuitement justifiés par sa grâce',
      group: 'Sauvés par grâce',
      note: 'Parce que tous ont péché (3.23), la justice qui vient de Dieu doit être donnée sans la loi, par la foi en Jésus-Christ. Les croyants sont justifiés gratuitement (dōrean) par sa grâce, par le moyen de la rédemption qui est en Jésus-Christ, que Dieu a destiné à être victime propitiatoire.',
    },
    'grace:kp:rom-5-15': {
      title: 'Là où le péché a abondé, la grâce a surabondé',
      group: 'Sauvés par grâce',
      note: 'Paul oppose l’offense d’Adam au don du Christ : il n’en est pas du don gratuit comme de l’offense. La grâce ne se contente pas d’égaler le péché, elle le déborde, afin que la grâce règne par la justice pour la vie éternelle.',
    },
    'grace:kp:rom-11-5': {
      title: 'Autrement la grâce n’est plus une grâce',
      group: 'Sauvés par grâce',
      note: 'Un reste est choisi par grâce, et Paul en tire la conséquence logique : si c’est par grâce, ce n’est plus par les œuvres. Mêler les deux viderait la grâce de son sens.',
    },
    'grace:kp:gal-2-21': {
      title: 'Je ne rejette pas la grâce de Dieu',
      group: 'Sauvés par grâce',
      note: 'Si la justice s’obtenait par la loi, Christ serait mort en vain (dōrean, le même mot qui signifie « gratuitement » en Rm 3.24). Paul refuse tout chemin vers la justice qui rendrait la croix inutile.',
    },
    'grace:kp:titus-3-4': {
      title: 'Non à cause des œuvres de justice, mais selon sa miséricorde',
      group: 'Sauvés par grâce',
      note: 'Un parallèle étroit avec Éphésiens 2 : la bonté de Dieu et son amour pour les hommes ont été manifestés ; il nous a sauvés non à cause de nos œuvres de justice, mais selon sa miséricorde, par le bain de la régénération et le renouvellement du Saint-Esprit, afin que, justifiés par sa grâce, nous devenions héritiers.',
    },
    'grace:kp:rom-6-1': {
      title: 'Demeurerions-nous dans le péché, afin que la grâce abonde ?',
      group: 'Vivre de la grâce',
      note: 'Paul anticipe l’abus de la grâce et le rejette : les croyants sont morts au péché avec le Christ dans le baptême, et ils marchent désormais en nouveauté de vie. Le péché n’aura pas de pouvoir sur eux, précisément parce qu’ils sont non sous la loi, mais sous la grâce (6.14).',
    },
    'grace:kp:titus-2-11': {
      title: 'La grâce qui enseigne',
      group: 'Vivre de la grâce',
      note: 'La grâce de Dieu, source de salut, enseigne aussi aux croyants à renoncer à l’impiété et à vivre selon la sagesse, la justice et la piété, en attendant la manifestation du Christ. La grâce est un maître autant qu’un don : elle forme un peuple zélé pour les bonnes œuvres.',
    },
    'grace:kp:2-cor-12-9': {
      title: 'Ma grâce te suffit',
      group: 'Vivre de la grâce',
      note: 'Privé du soulagement qu’il demandait pour son écharde dans la chair, Paul reçoit à la place une promesse : la grâce du Christ suffit, et sa puissance s’accomplit dans la faiblesse. La grâce n’est pas seulement le commencement de la vie chrétienne ; elle en est la force de chaque jour.',
    },
    'grace:kp:heb-4-16': {
      title: 'Le trône de la grâce',
      group: 'Vivre de la grâce',
      note: 'Parce que Jésus est un souverain sacrificateur qui compatit, les croyants peuvent s’approcher avec assurance du trône de Dieu — appelé ici le trône de la grâce — afin d’obtenir miséricorde et de trouver grâce, pour être secourus dans leurs besoins.',
    },
    'grace:kp:1-pet-4-10': {
      title: 'Dispensateurs des diverses grâces de Dieu',
      group: 'Vivre de la grâce',
      note: 'Chaque croyant a reçu un don (charisma) et doit le mettre au service des autres, en bon dispensateur des diverses grâces de Dieu. La grâce reçue devient grâce transmise.',
    },
  },

  /* ------------------------------------------------------------------ */
  /* Mots clés                                                           */
  /* ------------------------------------------------------------------ */
  keyWords: {
    'grace:kw:charis': {
      english: 'grâce',
      grammar: 'Nom, datif singulier féminin (χάριτι, « par grâce ») en 2.5 et 2.8 ; génitif singulier (χάριτος) en 2.7',
      basicMeaning: 'grâce ; faveur, bonté, bienveillance',
      semanticRange: [
        'faveur ou bienveillance de la part d’un donateur — dans le Nouveau Testament, surtout la faveur gratuite de Dieu',
        'un don, ou une preuve concrète de faveur',
        'remerciement, reconnaissance (la réponse de celui qui reçoit)',
        'grâce, charme (par exemple d’une parole)',
        'un état de grâce dans lequel se tiennent les croyants',
      ],
      notableNotes: [
        'Grâce pour grâce, reçue de la plénitude du Christ ; la grâce et la vérité sont venues par Jésus-Christ.',
        'Gratuitement (dōrean) justifiés par sa grâce (charis) — le parallèle le plus proche d’Ep 2.8.',
        'Le salaire est imputé comme une chose due, non comme une grâce (kata charin) : la grâce est le contraire de la dette.',
        'Si c’est par grâce, ce n’est plus par les œuvres — autrement la grâce ne serait plus une grâce.',
        'Les croyants ont accès à « cette grâce, dans laquelle nous demeurons fermes » : la grâce comme un état stable.',
        'Charis au sens de « remerciement » : grâces soient rendues à Dieu pour son don ineffable.',
        'La grâce du Christ suffit ; sa puissance s’accomplit dans la faiblesse.',
      ],
      significance:
        'Charis apparaît 155 fois dans le Nouveau Testament grec NA28 (156 dans la concordance de l’application, qui compte aussi Rm 16.24, verset imprimé dans le Textus Receptus et le texte byzantin mais absent de NA28), dont 12 fois dans Éphésiens et trois fois dans ce passage (2.5, 7, 8). Il désigne ici la faveur de Dieu comme la seule source du salut : les morts ne peuvent contribuer à leur propre résurrection (2.5), la richesse de cette faveur sera montrée dans les siècles à venir (2.7), et elle exclut tout motif de se glorifier (2.8–9). Dans le monde de Paul, le même mot pouvait aussi désigner le don et la reconnaissance qu’il appelait (voir le contexte historique), et Paul lui-même passe directement de la grâce aux bonnes œuvres de 2.10 — mais ce lien vient de son argumentation, non des autres sens du mot.',
      caution:
        'Charis n’est pas un terme technique au sens unique et fixe : en Luc 17.9, il signifie « remerciement », et en Col 4.6 il qualifie une parole aimable. Sa force en Éphésiens 2 vient de l’argumentation de Paul (la grâce opposée aux œuvres, 2.8–9), et non du mot seul.',
      anchors: [
        { verse: ev(5), phrases: { LSG: 'grâce', DARBY: 'grâce', NCL: 'grâce', OST: 'grâce' } },
        { verse: ev(7), phrases: { LSG: 'grâce', DARBY: 'grâce', NCL: 'grâce', OST: 'grâce' } },
        { verse: ev(8), phrases: { LSG: 'grâce', DARBY: 'grâce', NCL: 'grâce', OST: 'grâce' } },
      ],
    },
    'grace:kw:eleos': {
      english: 'miséricorde',
      grammar: 'Nom, datif singulier neutre (ἐλέει) après ἐν : « riche en miséricorde » (2.4)',
      basicMeaning: 'miséricorde, pitié, compassion',
      semanticRange: [
        'la miséricorde que des personnes montrent envers d’autres (Mt 9.13 ; Luc 10.37)',
        'la miséricorde de Dieu envers les nécessiteux et ceux qui ne la méritent pas',
        'la miséricorde du Christ (Jude 21)',
        'la miséricorde invoquée dans les salutations et les bénédictions (1 Tm 1.2 ; 2 Jn 3)',
      ],
      notableNotes: [
        'Il nous a sauvés non à cause de nos œuvres de justice, mais selon sa miséricorde — un parallèle étroit avec Ep 2.4–9.',
        'Jésus cite Os 6.6 : « Je prends plaisir à la miséricorde » ; l’hébreu d’Osée porte hesed, le grec eleos.',
        'Les « vases de miséricorde » que Dieu a d’avance préparés pour la gloire.',
        'Le cantique de Marie : sa miséricorde s’étend d’âge en âge sur ceux qui le craignent.',
        'Au trône de la grâce, nous obtenons miséricorde et trouvons grâce.',
      ],
      significance:
        'Paul enracine l’œuvre de sauvetage de Dieu dans deux traits de Dieu lui-même : il est riche en miséricorde, et il agit à cause de son grand amour (2.4). La miséricorde regarde la misère de 2.1–3 ; la grâce, le don immérité de 2.5–8. Dans l’Ancien Testament grec, eleos traduit surtout hesed, si bien que « riche en miséricorde » s’inscrit dans la longue confession d’Israël sur un Dieu riche en bonté et en amour fidèle (Ex 34.6). Eleos apparaît 27 fois dans NA28.',
      caution:
        'La distinction commode — « la miséricorde retient ce que nous méritons, la grâce donne ce que nous ne méritons pas » — est un résumé utile, mais les auteurs bibliques emploient souvent les deux mots ensemble (Tt 3.5–7 ; Hé 4.16) sans tracer de frontière nette.',
      anchors: [{ verse: ev(4), phrases: { LSG: 'miséricorde', DARBY: 'miséricorde', NCL: 'miséricorde', OST: 'miséricorde' } }],
    },
    'grace:kw:sozo': {
      english: 'sauvés',
      grammar:
        'Participe parfait passif, nominatif pluriel masculin (σεσῳσμένοι), avec ἐστε (présent, « vous êtes ») : un parfait périphrastique — « vous êtes des gens qui ont été sauvés » (2.5, 2.8)',
      basicMeaning: 'sauver, secourir, délivrer ; guérir',
      semanticRange: [
        'arracher à un danger, à une blessure ou à la mort (Mt 8.25)',
        'guérir, rendre la santé (Marc 5.34)',
        'sauver du péché et de ses conséquences — dit au passé, au présent ou au futur',
      ],
      notableNotes: [
        'Aoriste : « c’est en espérance que nous sommes sauvés ».',
        'Présent : pour « nous qui sommes sauvés », la prédication de la croix est une puissance de Dieu.',
        'Futur : à plus forte raison « serons-nous sauvés par lui de la colère ».',
        'Parfait de l’indicatif : « Ta foi t’a sauvée » — la foi liée à un sauvetage accompli.',
        'Aoriste : « il nous a sauvés […] selon sa miséricorde ».',
      ],
      significance:
        'Sōzō apparaît 106 fois dans NA28 (107 dans la concordance de l’application, qui compte aussi Mt 18.11, verset présent seulement dans le Textus Receptus et le texte byzantin), mais le participe parfait σεσῳσμένοι ne se trouve qu’ici, en 2.5 et 2.8 (TAGNT). Le parfait présente le salut comme un acte accompli aux effets durables : ceux qui étaient morts sont maintenant, et demeurent, des gens sauvés. (La LSG rend ce parfait par un présent : « vous êtes sauvés ».) Ailleurs, Paul parle du salut comme passé, en cours et encore à venir (Rm 8.24 ; 1 Co 1.18 ; Rm 5.9–10) ; Éphésiens souligne sa réalité présente et acquise, ce qui explique que Paul puisse dire les croyants déjà ressuscités et assis avec le Christ (2.6).',
      caution:
        'Le parfait décrit la situation présente des lecteurs telle que Paul la voit ; il ne tranche pas à lui seul les débats ultérieurs sur l’assurance ou la persévérance, qui s’appuient sur bien d’autres textes.',
      anchors: [
        { verse: ev(5), phrases: { LSG: 'vous êtes sauvés', DARBY: 'vous êtes sauvés', NCL: 'vous êtes sauvés', OST: 'vous êtes sauvés' } },
        { verse: ev(8), phrases: { LSG: 'vous êtes sauvés', DARBY: 'vous êtes sauvés', NCL: 'vous êtes sauvés', OST: 'vous êtes sauvés' } },
      ],
    },
    'grace:kw:pistis': {
      english: 'foi',
      grammar: 'Nom, génitif singulier féminin (πίστεως) après διά : « par le moyen de la foi » (2.8)',
      basicMeaning: 'foi, croyance, confiance, assurance',
      semanticRange: [
        'foi, confiance, assurance (dans le Nouveau Testament, en Dieu ou en Christ)',
        'croyance, conviction',
        'fidélité, loyauté (Rm 3.3 ; Ga 5.22)',
        'un engagement de fidélité (1 Tm 5.12)',
      ],
      notableNotes: [
        'La justice de Dieu vient par la foi en Jésus-Christ pour tous ceux qui croient.',
        'Justifiés par la foi, nous avons accès par la foi à cette grâce.',
        'Si je vis maintenant dans la chair, je vis dans la foi au Fils de Dieu, qui m’a aimé.',
        'La foi comme « une ferme assurance des choses qu’on espère ».',
        'La foi sans les œuvres est morte — l’interpellation de Jacques contre une foi purement verbale.',
      ],
      significance:
        'Paul dit que nous sommes sauvés par grâce (un simple datif : la grâce est ce qui sauve), par le moyen de la foi (διά avec le génitif : le canal par lequel on la reçoit), et il n’emploie ἐκ, « de », que pour nier d’autres sources — « cela ne vient pas de vous […] Ce n’est point par les œuvres » (2.8–9). La foi reçoit au lieu de mériter ; c’est pourquoi elle s’accorde avec « Ce n’est point par les œuvres » en 2.9, et pourquoi tout motif de se glorifier est exclu. Pistis apparaît 243 fois dans NA28 — 40 fois dans Romains, 22 dans Galates, 16 dans Jacques —, si bien que le rapport entre la foi et les œuvres est une conversation qui traverse le Nouveau Testament, et non l’affaire d’un seul verset.',
      caution:
        'Les spécialistes débattent pour savoir si l’expression paulinienne pistis Christou signifie la foi en Christ ou la fidélité du Christ lui-même (par exemple en Rm 3.22) ; Ep 2.8 ne contient pas cette expression et désigne simplement la confiance du croyant.',
      anchors: [{ verse: ev(8), phrases: { LSG: 'foi', DARBY: 'foi', NCL: 'foi', OST: 'foi' } }],
    },
    'grace:kw:doron': {
      english: 'don',
      grammar:
        'Nom, nominatif singulier neutre (δῶρον) en 2.8, dans l’expression θεοῦ τὸ δῶρον (« de Dieu [est] le don »), avec θεοῦ placé en tête pour l’emphase',
      basicMeaning: 'don, présent',
      semanticRange: ['un don ou un présent (Mt 2.11)', 'une offrande apportée à Dieu (Mt 5.23–24 ; Hé 5.1)', 'le don de Dieu aux hommes (Ep 2.8)'],
      notableNotes: [
        'Les présents des mages : l’or, l’encens et la myrrhe.',
        'Une offrande présentée à l’autel — le sens habituel de dōron, une offrande faite à Dieu.',
        'Le souverain sacrificateur présente « des offrandes et des sacrifices pour les péchés ».',
        'Les riches mettent leurs offrandes (dōra) dans le tronc — des offrandes à Dieu, à côté des deux petites pièces de la veuve.',
      ],
      significance:
        'Sur les 19 emplois de dōron dans NA28, la plupart désignent des offrandes que l’on apporte à Dieu ; Ep 2.8 renverse la perspective et fait de Dieu le donateur. Un autre mot de Paul, charisma (formé sur charis), exprime une idée semblable en Rm 6.23 : le don gratuit de Dieu, c’est la vie éternelle. « Cela » (τοῦτο) en 2.8 est neutre et ne s’accorde pas avec les noms féminins « grâce » et « foi » ; beaucoup d’interprètes y voient donc une référence à l’ensemble de l’événement — être sauvé par grâce, par le moyen de la foi — comme don de Dieu plutôt que comme notre œuvre.',
      caution:
        'La question de savoir si « cela » renvoie spécifiquement à la foi est débattue depuis l’Église ancienne : Chrysostome et Augustin incluaient la foi dans le don, tandis que Calvin comprenait le don comme le salut lui-même. La grammaire permet une référence à l’ensemble.',
      anchors: [{ verse: ev(8), phrases: { LSG: 'don', DARBY: 'don', NCL: 'don', OST: 'don' } }],
    },
    'grace:kw:poiema': {
      english: 'ouvrage',
      grammar:
        'Nom, nominatif singulier neutre (ποίημα), attribut de ἐσμεν — « nous sommes [son] ouvrage » —, avec αὐτοῦ (« son ») placé en tête pour l’emphase (2.10)',
      basicMeaning: 'ce qui est fait, une œuvre',
      semanticRange: ['une chose faite, un ouvrage', 'les œuvres de Dieu dans la création (Rm 1.20)', 'la nouvelle création de Dieu en Christ (Ep 2.10)'],
      notableNotes: ['Le seul autre emploi du Nouveau Testament : la puissance de Dieu se voit « dans ses ouvrages », dans la création.'],
      significance:
        'Poiēma n’apparaît que deux fois dans le Nouveau Testament : pour la création en Rm 1.20 et pour les croyants ici. Le rapprochement est suggestif — le Dieu qui a fait le monde a fait un peuple nouveau, « créés en Jésus-Christ » (2.10), ce qui fait écho au langage paulinien de la nouvelle création (2 Co 5.17). Les bonnes œuvres ne sont pas la matière première du salut, mais le but du nouvel ouvrage de Dieu. Dans l’Ancien Testament grec, poiēma traduit surtout ma‘aseh, « œuvre, action ».',
      caution:
        'Un enseignement populaire traduit parfois poiēma par « chef-d’œuvre » ou « poème ». Le sens lexical est simplement « ce qui est fait, un ouvrage » ; la dignité de l’idée vient de l’artisan et de son dessein, non du mot lui-même.',
      anchors: [{ verse: ev(10), phrases: { LSG: 'ouvrage', DARBY: 'ouvrage', NCL: 'ouvrage', OST: 'ouvrage' } }],
    },
    'grace:kw:dorean': {
      english: 'gratuitement, comme un don',
      grammar: 'Adverbe — accusatif de δωρεά (« don ») employé adverbialement : « gratuitement, comme un don » (Rm 3.24)',
      basicMeaning: 'gratuitement, comme un don ; en vain, pour rien',
      semanticRange: [
        'gratuitement, sans paiement (Mt 10.8 ; Ap 22.17)',
        'comme un don, gracieusement (Rm 3.24)',
        'sans cause (Jean 15.25)',
        'en vain, pour rien (Ga 2.21)',
      ],
      notableNotes: [
        'Gratuitement (dōrean) justifiés par sa grâce.',
        'Si la justice s’obtient par la loi, Christ est donc mort en vain (dōrean).',
        '« Vous avez reçu gratuitement, donnez gratuitement. »',
        'Que celui qui a soif prenne de l’eau de la vie, gratuitement.',
        '« Ils m’ont haï sans cause » — le même adverbe, au sens de « sans raison ».',
      ],
      significance:
        'Dōrean ne figure pas en Éphésiens 2, mais il se trouve derrière « gratuitement justifiés par sa grâce » en Rm 3.24, le parallèle le plus proche d’Ep 2.8. Il apparaît neuf fois dans NA28. Paul emploie le même mot en Ga 2.21 dans son autre sens : si la justice s’obtenait par la loi, Christ serait mort « en vain ». Ou bien la grâce est gratuite, ou bien la croix n’avait pas de sens.',
      caution:
        'Les deux sens (« comme un don » et « pour rien ») sont deux emplois d’un même mot, et non un double sens caché dans chaque texte ; c’est le contexte qui tranche.',
    },
    'grace:kw:chen': {
      english: 'faveur, grâce',
      grammar: 'Nom, masculin singulier absolu (Gn 6.8), dans l’expression « trouver grâce aux yeux de »',
      basicMeaning: 'faveur, grâce, charme',
      semanticRange: [
        'faveur, bon accueil aux yeux de quelqu’un (Gn 6.8 ; Ex 33.12–17)',
        'grâce donnée par Dieu (Pr 3.34 ; Za 12.10)',
        'charme, élégance (Pr 31.30)',
      ],
      notableNotes: [
        'Premier emploi : Noé trouva grâce aux yeux de l’Éternel.',
        'Moïse plaide sur la base de la grâce qu’il a trouvée ; chen apparaît cinq fois en Exode 33.',
        '« Il fait grâce aux humbles » — cité en Jc 4.6 et 1 P 5.5 avec charis.',
        'La pierre principale posée au milieu des acclamations : « Grâce, grâce pour elle ! »',
        'Dieu répandra sur Jérusalem « un esprit de grâce et de supplication ».',
      ],
      significance:
        'Chen apparaît 69 fois dans la Bible hébraïque (TAHOT), dont 14 dans la Genèse et 13 dans les Proverbes, le plus souvent dans l’expression « trouver grâce aux yeux de ». Sa première occurrence est Gn 6.8, où la faveur de l’Éternel envers Noé est mentionnée avant sa justice (6.9). Dans l’Ancien Testament grec, charis traduit surtout chen — l’un des ponts entre le vocabulaire d’Israël et celui de Paul.',
      caution:
        'Bien des emplois de chen décrivent une faveur sociale ordinaire (Gn 39.4) ou le charme (Pr 31.30) ; toutes les occurrences ne portent pas le poids théologique du charis de Paul.',
    },
    'grace:kw:hesed': {
      english: 'bonté, amour fidèle',
      grammar: 'Nom, masculin singulier absolu en Ex 34.6 : « riche en bonté » (rav-chesed)',
      basicMeaning: 'bonté, bienveillance, fidélité',
      semanticRange: [
        'bonté, bienveillance',
        'amour loyal, fidélité au sein d’une relation ou d’une alliance',
        'miséricorde envers ceux qui ne la méritent pas (Ps 51.1 ; Lm 3.22)',
      ],
      notableNotes: [
        'Riche en bonté, conservant son amour jusqu’à mille générations, pardonnant l’iniquité.',
        'Le Dieu fidèle garde son alliance et sa miséricorde.',
        'Le refrain « sa miséricorde dure à toujours » — hesed apparaît 26 fois dans ce psaume.',
        'Les bontés de l’Éternel ne sont pas épuisées ; ses compassions se renouvellent chaque matin.',
        '« J’aime la piété et non les sacrifices » (LSG, pour l’hébreu hesed) — cité par Jésus en Mt 9.13 avec eleos.',
        'Pratiquer la justice, aimer la miséricorde (hesed), marcher humblement avec ton Dieu.',
      ],
      significance:
        'Hesed apparaît environ 245 fois dans la Bible hébraïque (TAHOT), dont 127 dans les Psaumes, et décrit l’amour engagé et loyal de Dieu — surtout dans le cadre de son alliance avec Israël. Ce n’est pas simplement le mot hébreu correspondant à charis (l’Ancien Testament grec le rend d’ordinaire par eleos, « miséricorde »), mais il fournit une bonne part de ce que Paul veut dire quand il appelle Dieu riche en miséricorde et parle de son grand amour (Ep 2.4) : un amour qui reste fidèle aux infidèles.',
      caution:
        'La LSG rend hesed par bonté, miséricorde ou même piété (Os 6.6) ; les versions anglaises par steadfast love, lovingkindness, loving devotion ou mercy. Aucun mot ne le saisit entièrement, et il ne faut le réduire ni à la « grâce » ni à une simple « loyauté ».',
    },
    'grace:kw:chanan': {
      english: 'faire grâce',
      grammar: 'Verbe, qal impératif masculin singulier avec suffixe de 1re personne en Ps 51.1 (chonneni, « fais-moi grâce » ; LSG : « Aie pitié de moi »)',
      basicMeaning: 'faire grâce, montrer de la faveur, avoir pitié',
      semanticRange: [
        'montrer de la faveur, faire grâce (qal)',
        'être pris en pitié, obtenir grâce (niphal, hophal)',
        'chercher ou implorer la faveur (hithpael)',
      ],
      notableNotes: [
        'La bénédiction sacerdotale : « Que l’Éternel fasse luire sa face sur toi, et qu’il t’accorde sa grâce ! »',
        'La supplication de David après son péché : fais-moi grâce, ô Dieu, selon ta bonté (hesed).',
        '« Je fais grâce à qui je fais grâce » (chanan) — cité par Paul en Rm 9.15, où le grec rend chanan par eleeō, « faire miséricorde » (LSG : « Je ferai miséricorde à qui je fais miséricorde »).',
        '« L’Éternel désire vous faire grâce » (chanan), et il se lèvera pour vous faire miséricorde.',
      ],
      significance:
        'Chanan (77 fois dans TAHOT) est le verbe de la bénédiction sacerdotale (Nb 6.25) et du cri du pénitent (Ps 51.1). Son adjectif channun, « qui fait grâce », apparaît 13 fois et s’emploie presque exclusivement de Dieu, souvent dans la formule en forme de credo d’Ex 34.6, reprise en Ps 103.8 et Jon 4.2. En Ex 33.19, Dieu déclare qu’il fait grâce à qui il fait grâce ; Paul le cite en Rm 9.15–16 pour montrer que la miséricorde dépend de Dieu, et non de la volonté ou de l’effort humains.',
      caution:
        'Les mots d’une même racine (chen, chanan, channun) ont un air de famille, mais le sens de chacun est fixé par son emploi en contexte, non par la seule racine.',
    },
  },

  /* ------------------------------------------------------------------ */
  /* Références croisées                                                 */
  /* ------------------------------------------------------------------ */
  crossReferences: {
    'grace:xr:rom-3-23': {
      title: 'Gratuitement justifiés par sa grâce',
      explanation:
        'Romains dit en termes juridiques ce qu’Éphésiens dit en termes de sauvetage. Tous ont péché (comparer Ep 2.1–3), et tous ceux qui sont rendus justes devant Dieu sont justifiés gratuitement (dōrean) par sa grâce (charis). Les deux passages situent la cause entièrement en Dieu, et le moyen dans la rédemption accomplie par le Christ.',
    },
    'grace:xr:rom-5-6': {
      title: 'Lorsque nous étions encore pécheurs — et ennemis',
      explanation:
        'Ep 2.5 dit que Dieu nous a rendus à la vie, « nous qui étions morts » ; Romains 5 dit que le Christ est mort pour nous alors que nous étions sans force, pécheurs et ennemis. Les deux passages affirment que l’amour de Dieu a agi avant tout changement en nous — et c’est exactement ce qui en fait une grâce. Romains ajoute le regard vers l’avenir : une fois réconciliés, à plus forte raison serons-nous sauvés.',
    },
    'grace:xr:col-2-13': {
      title: 'Morts par vos offenses, rendus à la vie avec le Christ',
      explanation:
        'Le parallèle verbal le plus proche du Nouveau Testament. L’épître aux Colossiens décrit, elle aussi, des lecteurs morts par leurs offenses et rendus à la vie avec le Christ, avec le même verbe rare, συζωοποιέω, qui ne se trouve qu’en Ep 2.5 et Col 2.13. Colossiens précise comment : Dieu nous a pardonné toutes nos offenses et a effacé l’acte qui nous condamnait en le clouant à la croix.',
    },
    'grace:xr:titus-3-4': {
      title: 'Bonté, miséricorde, non par les œuvres',
      explanation:
        'Tite 3 suit les mêmes rails qu’Éphésiens 2 : la bonté de Dieu (χρηστότης, comme en Ep 2.7) et son amour pour les hommes ont été manifestés ; il nous a sauvés non à cause des œuvres de justice, mais selon sa miséricorde (ἔλεος, comme en Ep 2.4) ; et nous sommes justifiés par sa grâce. Tite ajoute l’œuvre de l’Esprit dans la nouvelle naissance et le renouvellement.',
    },
    'grace:xr:gal-2-20': {
      title: 'Je ne rejette pas la grâce de Dieu',
      explanation:
        'Galates offre la version personnelle et polémique d’Ep 2.8–9. Paul vit dans la foi au Fils de Dieu qui l’a aimé et s’est livré lui-même pour lui, et il refuse d’annuler la grâce : si la justice s’obtenait par la loi, Christ serait mort en vain. Ajouter les œuvres comme fondement de l’acceptation viderait de leur sens à la fois la grâce et la croix.',
    },
    'grace:xr:rom-11-6': {
      title: 'Grâce et œuvres ne se mélangent pas',
      explanation:
        'Rm 11.6 explicite la logique de « Ce n’est point par les œuvres » en Ep 2.9 : si une chose vient par grâce, elle ne vient plus des œuvres, sinon la grâce ne serait plus une grâce. Le contraste n’oppose pas le don de Dieu à l’obéissance humaine en général, mais deux fondements incompatibles de l’acceptation devant Dieu.',
    },
    'grace:xr:rom-4-4': {
      title: 'Salaire ou don',
      explanation:
        'Paul oppose deux économies. Le salaire d’un ouvrier lui est dû, il ne lui est pas donné comme une grâce ; mais Dieu justifie l’impie qui se confie en lui au lieu de travailler pour l’obtenir. Éphésiens 2.8–9 se tient dans le même contraste — don et non salaire, foi et non œuvres —, et c’est pourquoi tout motif de se glorifier est exclu (comparer Rm 4.2).',
    },
    'grace:xr:jas-2-14': {
      title: 'La foi sans les œuvres est morte',
      explanation:
        'Jacques semble d’abord contredire Paul : l’homme est justifié par les œuvres, et non par la foi seulement (2.24). Mais Jacques vise une foi qui se dit croyante et ne produit rien, tandis que Paul exclut les œuvres comme fondement du salut. Ep 2.10 montre où ils se rejoignent : ceux que Dieu sauve par grâce sont créés pour de bonnes œuvres, si bien qu’une foi qui n’y marche jamais n’est pas la foi dont parle Paul. Les chrétiens n’ont pas toujours trouvé facile de concilier les deux textes, et ils les pèsent encore différemment, mais la plupart des traditions les lisent aujourd’hui comme complémentaires.',
    },
    'grace:xr:ezek-36-26': {
      title: 'Un cœur nouveau et une marche nouvelle',
      explanation:
        'Ézéchiel promettait que Dieu remplacerait le cœur de pierre par un cœur de chair et mettrait son Esprit dans son peuple, pour le faire marcher selon ses ordonnances. Éphésiens ne cite pas Ézéchiel, mais, lus côte à côte, les deux textes partagent un même schéma : en 2.1–10, les morts sont rendus à la vie (2.5) et recréés pour marcher dans les bonnes œuvres (2.10), à l’inverse de l’ancienne marche de 2.2. Dans les deux textes, l’initiative revient à Dieu.',
    },
    'grace:xr:deut-7-7': {
      title: 'Aimés parce qu’il vous aime',
      explanation:
        'Israël n’a pas été choisi parce qu’il était nombreux ou impressionnant ; l’Éternel s’est attaché à lui simplement parce qu’il l’aimait et voulait tenir son serment. Le « à cause du grand amour » de Paul (Ep 2.4) s’inscrit dans la même ligne : l’amour de Dieu est à lui-même sa propre raison, et non une réponse à la valeur de ceux qu’il aime.',
    },
    'grace:xr:exod-34-6': {
      title: 'La confession fondatrice d’Israël : un Dieu qui fait grâce',
      explanation:
        'Au Sinaï, après l’idolâtrie d’Israël avec le veau d’or, Dieu proclama son nom : compatissant et faisant grâce, lent à la colère, riche en hesed et en fidélité, pardonnant l’iniquité. Cette révélation de lui-même devint le credo d’Israël (Ps 103.8 ; Jon 4.2). Quand Paul appelle Dieu riche en miséricorde et parle de la richesse de sa grâce et de sa bonté (Ep 2.4, 7), il parle en héritier de cette histoire.',
    },
    'grace:xr:john-1-16': {
      title: 'Grâce pour grâce',
      explanation:
        'Paul parle de l’infinie richesse de la grâce de Dieu manifestée en Jésus-Christ (2.7) ; Jean dit que de la plénitude de la Parole incarnée nous avons reçu grâce pour grâce, et que la grâce et la vérité sont venues par Jésus-Christ. Les deux auteurs font du Christ lui-même le lieu où la grâce de Dieu se déploie pleinement.',
    },
    'grace:xr:2-cor-5-17': {
      title: 'Une nouvelle créature',
      explanation:
        '« Créés en Jésus-Christ » (Ep 2.10) est un langage de nouvelle création. En 2 Co 5.17, si quelqu’un est en Christ, il est une nouvelle créature — les choses anciennes sont passées, toutes choses sont devenues nouvelles —, et Paul ajoute que tout cela vient de Dieu. Le salut par grâce n’est pas une réparation à laquelle nous contribuerions, mais un acte créateur de Dieu.',
    },
    'grace:xr:phil-1-6': {
      title: 'Celui qui a commencé la bonne œuvre l’achèvera',
      explanation:
        'Les croyants sont l’ouvrage de Dieu (Ep 2.10), et la confiance de Paul en Ph 1.6 repose sur la même logique : le Dieu qui a commencé en eux une bonne œuvre la mènera à son achèvement. La grâce commence et soutient la vie chrétienne. (La manière dont cela se rattache à la persévérance est débattue ; voir la note sur sōzō.)',
    },
    'grace:xr:luke-18-9': {
      title: 'Le pharisien et le publicain',
      explanation:
        'Jésus raconte cette parabole à des gens qui se persuadaient d’être justes. Le pharisien énumère ses jeûnes et ses dîmes ; le publicain se contente de demander à Dieu d’être apaisé envers lui — et c’est lui qui redescend dans sa maison justifié. C’est une image narrative d’Ep 2.9 : le salut ne vient pas des œuvres, afin que personne ne se glorifie.',
    },
    'grace:xr:rom-6-1': {
      title: 'La grâce n’est pas une permission de pécher',
      explanation:
        'La grâce gratuite suscite une objection : demeurerons-nous dans le péché, afin que la grâce abonde ? Paul répond que ceux qui sont unis au Christ dans sa mort et sa résurrection marchent désormais en nouveauté de vie. Ep 2.10 dit la même chose de manière positive — la grâce recrée des êtres pour les bonnes œuvres —, si bien que la grâce et la sainteté vont ensemble.',
    },
  },

  /* ------------------------------------------------------------------ */
  /* Contexte                                                            */
  /* ------------------------------------------------------------------ */
  context: {
    'grace:ctx:authorship': {
      title: 'Qui a écrit Éphésiens ?',
      summary:
        'La lettre se présente comme écrite par Paul et a été traditionnellement reçue comme l’une de ses lettres de captivité. Beaucoup de spécialistes modernes pensent toutefois qu’elle a été écrite par un disciple ultérieur de Paul.',
      detail:
        'Les doutes reposent sur des différences de vocabulaire, de style, de situation et d’accents théologiques par rapport aux lettres incontestées de Paul ; certains proposent un disciple écrivant sous le nom de Paul, ou une lettre paulinienne remaniée par un éditeur. D’autres répondent que ces différences s’expliquent par le contenu liturgique de la lettre, par le recours de Paul à des secrétaires, par l’évolution de sa pensée et par son caractère de lettre circulaire — les notes de Tyndale concluent qu’il n’y a pas de raison décisive de nier la paternité paulinienne. La question influe sur la place d’Éphésiens dans le développement de la pensée de Paul (par exemple, la grande étude de John Barclay sur la grâce chez Paul se concentre sur les lettres qu’il tient pour incontestées), mais non sur ce qu’Ep 2.1–10 dit de la grâce.',
    },
    'grace:ctx:recipients': {
      title: 'Une lettre pour plusieurs Églises d’Asie',
      summary:
        'Bien que traditionnellement adressée à Éphèse, la lettre a pu être une lettre circulaire, destinée aux Églises de la province romaine d’Asie.',
      detail:
        'Les mots « à Éphèse » (1.1) manquent dans plusieurs des manuscrits les plus anciens, et la lettre ne contient aucune salutation personnelle — ce qui surprend si Paul écrivait à une Église où il avait passé deux à trois ans (Ac 19.10 ; 20.31). Beaucoup d’Églises de la province ont été fondées pendant le ministère de Paul à Éphèse, certaines par ses convertis plutôt que par Paul lui-même. Les lecteurs étaient en majorité des convertis d’origine païenne, ce qui façonne l’argumentation du chapitre 2.',
    },
    'grace:ctx:ephesus': {
      title: 'Éphèse et la date de la lettre',
      summary:
        'Éphèse était la capitale et le port de la province romaine d’Asie, l’une des plus grandes villes de l’Empire, célèbre pour son temple d’Artémis. La lettre présente Paul comme écrivant de prison (3.1 ; 4.1) — traditionnellement à Rome, vers 60–62 apr. J.-C., bien que certains spécialistes proposent une captivité à Éphèse vers 53–56.',
      detail:
        'Les notes de Tyndale décrivent Éphèse comme la quatrième ville de l’Empire romain, avec une population de peut-être 500 000 habitants. Après une première visite brève (Ac 18.19–21), Paul y resta deux à trois ans (Ac 19.1–20.1), au milieu d’une forte opposition. L’opinion traditionnelle situe les lettres de captivité (Éphésiens, Philippiens, Colossiens, Philémon) à Rome, vers la fin de la vie de Paul ; une autre hypothèse les place pendant une captivité à Éphèse, ce qui les daterait plus tôt.',
    },
    'grace:ctx:patronage': {
      title: 'Charis dans un monde de patrons et de bienfaiteurs',
      summary:
        'Les lecteurs de Paul employaient charis tous les jours pour la faveur d’un patron ou d’un bienfaiteur, pour le don lui-même et pour la reconnaissance qu’il appelait. La grâce était le langage du don généreux et de la réponse reconnaissante.',
      detail:
        'Dans le monde gréco-romain, on obtenait souvent protection, charge ou aide matérielle par des liens personnels avec les puissants plutôt que par des institutions publiques. David deSilva montre que charis portait trois sens liés : la disposition favorable du donateur, le bienfait donné et la reconnaissance du bénéficiaire. Des moralistes comme Sénèque (De beneficiis) insistaient pour que la faveur reçoive en retour la gratitude ; Sénèque illustrait cet idéal par les trois Grâces, dont la ronde figure le bienfait qui passe du donateur au bénéficiaire, puis revient au donateur. En entendant qu’ils étaient sauvés « par grâce », les premiers lecteurs se seront très probablement représenté Dieu comme le bienfaiteur suprême, et ils se seront attendus à ce qu’une telle grâce appelle une réponse de fidélité et de reconnaissance (comparer 2.10).',
    },
    'grace:ctx:surprising-grace': {
      title: 'Ce que la grâce de Dieu avait de surprenant',
      summary:
        'Les bienfaiteurs antiques donnaient en principe librement, mais ils choisissaient d’ordinaire des bénéficiaires dignes. La surprise du Nouveau Testament, c’est que Dieu fait son plus grand don à des indignes — et même à des ennemis.',
      detail:
        'DeSilva note que, pour Sénèque, le donateur le plus généreux pouvait même aider des gens qui s’étaient montrés ingrats, pourvu qu’il lui reste de quoi le faire après avoir aidé ceux qui le méritaient. Le Nouveau Testament va bien plus loin : Dieu fait son plus grand don à des gens qui s’étaient dressés contre lui (Rm 5.6–10 ; Luc 6.35), et c’est lui qui fait le premier pas pour les réconcilier. Dans Paul and the Gift (2015), John Barclay décrit cette grâce comme donnée sans égard à la dignité du bénéficiaire (ce qu’il appelle son « incongruité ») ; selon sa lecture, Paul ne fait pas de la grâce un don qui n’attendrait aucune réponse — elle est inconditionnée, mais elle vise une vie transformée. Ep 2.1–10 s’accorde avec ces deux points : Dieu agit envers des morts (2.5) et les crée pour de bonnes œuvres (2.10).',
    },
    'grace:ctx:hesed-covenant': {
      title: 'Hesed et alliance : la grammaire de la grâce en Israël',
      summary:
        'Le vocabulaire de Paul a des racines juives. Les Écritures d’Israël confessaient déjà un Dieu qui fait grâce, riche en hesed, et qui a choisi Israël par amour plutôt que pour ses mérites.',
      detail:
        'L’Ancien Testament grec rendait généralement chen (faveur) par charis, et hesed (amour loyal, amour d’alliance) par eleos (miséricorde) ; aussi, quand Paul associe miséricorde et grâce en Ep 2.4–8, il puise dans cet héritage. Des textes comme Ex 34.6–7, Dt 7.7–9 et le Psaume 103 montrent que la grâce n’est pas une invention chrétienne ; ce qui est nouveau dans Éphésiens, c’est qu’elle est centrée sur le Christ et étendue à des païens qui étaient « étrangers aux alliances de la promesse » (2.12).',
    },
    'grace:ctx:gentiles': {
      title: 'Des païens « sans espérance et sans Dieu »',
      summary:
        'La plupart des premiers lecteurs étaient des païens, restés en dehors des alliances d’Israël. Paul leur rappelle qu’ils étaient autrefois sans Christ, étrangers aux promesses, « sans espérance et sans Dieu dans le monde » (2.12).',
      detail:
        'Éphésiens 2.11–22 applique aussitôt la grâce de 2.1–10 à la division entre Juifs et païens. Les Juifs considéraient traditionnellement les païens comme exclus du peuple de Dieu, et une barrière basse, dans le temple de Jérusalem, marquait la limite que les païens ne pouvaient franchir. Les notes de Tyndale suggèrent que cette insistance reflète peut-être des tensions entre croyants d’origine juive et d’origine païenne. Pour de tels lecteurs, « c’est par grâce que vous êtes sauvés » signifiait que leur position devant Dieu ne reposait sur rien de ce qu’ils avaient apporté — ni l’ascendance, ni les accomplissements.',
    },
    'grace:ctx:powers': {
      title: '« Le prince de la puissance de l’air »',
      summary:
        'Paul décrit la vie sans le Christ comme façonnée par le train de ce monde et par le diable, « le prince de la puissance de l’air » (2.2). Dans une ville connue pour sa magie, ce n’était pas une idée abstraite.',
      detail:
        'Les notes de Tyndale lisent 2.2 comme une référence au diable, qui gouverne les puissances du mal et agit dans ceux qui refusent d’obéir à Dieu (comparer 6.11–12). Les Actes rapportent que, pendant le ministère de Paul à Éphèse, beaucoup de croyants vinrent confesser leurs pratiques, et qu’un certain nombre de ceux qui avaient exercé la magie brûlèrent publiquement leurs livres, estimés à cinquante mille pièces d’argent (des drachmes, Ac 19.18–19). Dans Éphésiens, la grâce est donc aussi une libération à l’égard des puissances spirituelles, et non seulement un pardon.',
    },
  },

  /* ------------------------------------------------------------------ */
  /* Contexte littéraire                                                 */
  /* ------------------------------------------------------------------ */
  literary: {
    placeInBook:
      'Éphésiens se divise en deux moitiés : les chapitres 1–3 louent Dieu pour sa grâce, et les chapitres 4–6 décrivent la vie qui y répond. Ep 2.1–10 suit immédiatement la prière de Paul pour que les lecteurs saisissent la puissance que Dieu a déployée en ressuscitant le Christ et en le faisant asseoir dans les lieux célestes (1.19–20) ; 2.5–6 applique cette même puissance aux croyants. Le passage fonde ensuite 2.11–22, où la grâce unit Juifs et païens en un seul peuple nouveau.',
    argument:
      'L’argumentation avance en cinq étapes : la détresse de toute l’humanité — morte, asservie et sous la colère (2.1–3) ; le tournant vers le caractère de Dieu — riche en miséricorde, grand dans son amour (2.4) ; l’action de Dieu avec le Christ — rendus à la vie, ressuscités et assis (2.5–6) ; le dessein de Dieu — montrer l’infinie richesse de sa grâce dans les siècles à venir (2.7) ; et l’explication — sauvés par grâce, par le moyen de la foi, comme un don, non par les œuvres, et créés pour de bonnes œuvres (2.8–10). En grec, 2.1–7 forme une seule longue phrase, un trait du style de Paul dans Éphésiens.',
    placeInCanon:
      'Éphésiens 2 rassemble un fil qui traverse toute la Bible : le Dieu auprès de qui Noé trouva grâce, qui s’est révélé au Sinaï comme le Dieu qui fait grâce et qui a choisi Israël par amour, montre maintenant l’infinie richesse de sa grâce en Christ. C’est l’énoncé le plus ramassé, dans les lettres de Paul, de ce que Romains et Galates développent longuement, et il annonce l’espérance de la nouvelle création qui parcourt le reste du Nouveau Testament.',
    bookOutline: [
      'Salutation',
      'Louange pour toute bénédiction spirituelle',
      'Prière pour l’intelligence spirituelle',
      'De la mort à la vie : sauvés par grâce',
      'Un seul peuple nouveau en Christ',
      'Paul, dispensateur de la grâce de Dieu envers les païens',
      'Prière pour connaître l’amour du Christ',
      'Unité et dons dans le corps',
      'La vie nouvelle : marcher comme des enfants de lumière',
      'Des maisons façonnées par le Christ',
      'Les armes de Dieu',
      'Derniers mots',
    ],
    passageOutline: [
      'La détresse : morts, asservis, sous la colère',
      'Le tournant : « Mais Dieu », riche en miséricorde',
      'Rendus à la vie, ressuscités et assis avec le Christ',
      'Le dessein : la grâce exposée pour les siècles',
      'Par grâce, par le moyen de la foi, un don — non par les œuvres',
      'L’ouvrage de Dieu, créés pour de bonnes œuvres',
    ],
    features: {
      'grace:lit:but-god': {
        title: 'Le tournant : « Mais Dieu »',
        description:
          'Après trois versets qui décrivent l’impuissance humaine, 2.4 s’ouvre sur Ὁ δὲ θεός — « Mais Dieu ». Le sujet grammatical du sauvetage est Dieu seul ; tous les verbes principaux qui suivent (rendre à la vie, ressusciter, faire asseoir) ont Dieu pour sujet.',
      },
      'grace:lit:refrain': {
        title: 'Le refrain « c’est par grâce que vous êtes sauvés »',
        description:
          'Paul s’interrompt lui-même en 2.5 avec « c’est par grâce que vous êtes sauvés » (entre parenthèses dans la KJV, comme dans les quatre versions françaises proposées ici), puis il le reprend et le développe en 2.8. La répétition en fait la thèse du passage. Calvin ne savait pas si la parenthèse venait de Paul ou d’une main plus tardive, mais il l’acceptait comme convenant au contexte et y voyait le signe que Paul n’avait jamais le sentiment d’en avoir assez dit sur la grâce de Dieu.',
        structure: [
          { text: 'C’est par grâce que vous êtes sauvés (incise)' },
          { text: 'C’est par la grâce que vous êtes sauvés, par le moyen de la foi… le don de Dieu… non par les œuvres' },
        ],
      },
      'grace:lit:with-christ': {
        title: 'Trois verbes « avec » qui font écho à l’histoire du Christ',
        description:
          'Paul emploie trois verbes composés commençant par syn- (« avec ») : rendus à la vie avec, ressuscités avec, assis avec (2.5–6). Ils reflètent ce que Dieu a fait pour le Christ en 1.20 — il l’a ressuscité et l’a fait asseoir dans les lieux célestes —, si bien que l’histoire du croyant est intégrée à celle du Christ.',
        structure: [
          { label: 'Le Christ', text: 'Dieu l’a ressuscité et l’a fait asseoir dans les lieux célestes' },
          { label: 'Les croyants', text: 'rendus à la vie avec… ressuscités avec… assis avec le Christ' },
        ],
      },
      'grace:lit:walk': {
        title: 'Deux manières de marcher',
        description:
          'Le verbe « marcher » (περιπατέω) encadre le passage : les lecteurs marchaient autrefois dans leurs offenses et leurs péchés (2.2), et le passage s’achève — c’est son dernier mot en grec — sur les bonnes œuvres que Dieu a préparées « afin que nous marchions en elles » (2.10, selon Darby ; la LSG traduit « afin que nous les pratiquions », la BSB « our way of life »). La grâce ne change pas seulement un statut ; elle change la direction d’une vie.',
        structure: [
          { label: 'Autrefois', text: 'vous marchiez dans vos offenses et vos péchés, selon le train de ce monde' },
          { label: 'Maintenant', text: 'de bonnes œuvres que Dieu a préparées, afin que nous y marchions' },
        ],
      },
      'grace:lit:works': {
        title: '« Non par les œuvres » et « pour de bonnes œuvres »',
        description:
          'Paul emploie le même nom, ἔργα (œuvres), dans deux versets consécutifs, avec des prépositions différentes : le salut ne vient pas des œuvres (ἐξ ἔργων, 2.9), mais les croyants sont créés pour de bonnes œuvres (ἐπὶ ἔργοις ἀγαθοῖς, 2.10). Les œuvres sont exclues comme source du salut et rétablies comme son fruit.',
      },
    },
  },

  /* ------------------------------------------------------------------ */
  /* Théologie                                                           */
  /* ------------------------------------------------------------------ */
  theology: {
    'grace:th:gift': {
      title: 'Le salut, don de Dieu',
      summary:
        'Ep 2.8–9 condense l’Évangile en trois contrastes : par grâce, non par les œuvres ; par le moyen de la foi, non de vous-mêmes ; don de Dieu, non motif de gloire pour nous. Le salut a sa source dans la faveur de Dieu, il est reçu par la confiance, et il ne laisse aucune place à l’autosatisfaction.',
      detail:
        'Les chrétiens de toutes les traditions affirment que nul ne peut gagner ni mériter la grâce du salut. Les notes de Tyndale voient en 2.8–9 un résumé concis de la manière dont une personne est sauvée et un point cardinal de l’Évangile. Les traditions divergent sur la manière dont la grâce se rapporte à la volonté humaine et au processus de renouvellement — voir les perspectives ci-dessous.',
    },
    'grace:th:election': {
      title: 'Élection et appel : la grâce avant les temps',
      summary:
        'Éphésiens situe la grâce avant la création du monde : Dieu a élu les croyants en Christ avant la fondation du monde, à la louange de la gloire de sa grâce (1.4–6), et il a préparé d’avance pour eux de bonnes œuvres (2.10).',
      detail:
        'Ce schéma parcourt l’Écriture : Israël a été choisi par amour, non pour ses mérites (Dt 7.7–8) ; un reste est choisi par grâce (Rm 11.5–6) ; Dieu nous a sauvés et appelés selon son propre dessein et selon la grâce qui nous a été donnée en Jésus-Christ avant les temps éternels (2 Tm 1.9). Les chrétiens s’accordent pour dire que l’élection est gracieuse ; ils divergent sur son fondement. Les Articles des remontrants (1610) décrivent le décret éternel par lequel Dieu sauve ceux qui, par la grâce de l’Esprit, croiront et persévéreront ; les Canons de Dordrecht (1619) répondent que l’élection n’est pas fondée sur la foi prévue, mais qu’elle est la source même de la foi. Les perspectives ci-dessous explorent la question plus large.',
    },
    'grace:th:justification': {
      title: 'Grâce et justification',
      summary:
        'Éphésiens 2 parle d’être sauvé plutôt que d’être justifié, mais les idées se rejoignent : dans Romains, Galates et Tite, les croyants sont justifiés gratuitement par la grâce de Dieu, par la foi, et non par les œuvres de la loi.',
      detail:
        'Augustin résumait ainsi le rapport entre la loi et la grâce : la loi a été donnée pour que l’on cherche la grâce, et la grâce a été donnée pour que la loi soit accomplie. Les traditions protestantes soulignent la justification comme déclaration par laquelle Dieu tient les pécheurs pour justes à cause du Christ ; l’enseignement catholique tient que la justification comprend aussi le renouvellement intérieur. Ces dernières décennies, N. T. Wright a soutenu que le langage paulinien de la justification doit être lu dans le cadre du plan de Dieu, qui passe par Israël pour atteindre le monde — un accent qu’il trouve en Ep 2.11–22, à côté des accents classiques de la Réforme en 2.1–10.',
    },
    'grace:th:sanctification': {
      title: 'La grâce qui forme : les bonnes œuvres comme fruit',
      summary:
        'La grâce sauve sans les œuvres, mais ne laisse jamais les croyants sans elles. Ils sont l’ouvrage de Dieu, créés pour de bonnes œuvres (Ep 2.10) ; la grâce qui apporte le salut leur enseigne aussi à mener une vie pieuse (Tt 2.11–12).',
      detail:
        'Paul rejette l’idée que la grâce gratuite encouragerait le péché (Rm 6.1–2), et il décrit son propre labeur comme la grâce de Dieu à l’œuvre avec lui (1 Co 15.10). Les notes de Tyndale le disent simplement : les bonnes œuvres sont le résultat du salut, non sa cause. Philippiens 2.12–13 tient les deux côtés ensemble : travaillez à votre salut, car c’est Dieu qui produit en vous le vouloir et le faire.',
    },
    'grace:th:common-grace': {
      title: 'Grâce commune et grâce salvatrice',
      summary:
        'L’Écriture parle de la bonté de Dieu envers tous — le soleil et la pluie sur les méchants et sur les bons, la nourriture et la joie accordées aux nations — à côté de la grâce salvatrice d’Éphésiens 2. Les théologiens ont articulé ces deux réalités de diverses manières ; la théologie réformée emploie l’expression « grâce commune » pour une grâce qui ne sauve pas.',
      detail:
        'Charles Hodge, par exemple, définissait la grâce commune comme l’influence du Saint-Esprit accordée dans une certaine mesure à tous ceux qui entendent la vérité, distincte de la grâce efficace qui régénère. Les wesleyens parlent plutôt d’une grâce prévenante donnée à tous, qui éveille la conscience et doit conduire au salut. La théologie orthodoxe, telle que la présente Vladimir Lossky, ne se représente pas la nature humaine comme un ordre naturel clos sur lui-même, auquel la grâce viendrait ensuite s’ajouter comme un supplément ; selon lui, le don de Dieu est à l’œuvre dans la création dès l’origine. À travers ces traditions, les biens dont on jouit en dehors de la foi qui sauve restent un don immérité.',
    },
    'grace:th:means': {
      title: 'Les moyens de grâce',
      summary:
        'Beaucoup de traditions chrétiennes — catholique, luthérienne, réformée et méthodiste, entre autres — enseignent que Dieu donne et nourrit ordinairement la grâce par des moyens qu’il a établis, avant tout la Parole et les sacrements, ainsi que la prière, même si elles décrivent ces moyens différemment. Tous les chrétiens n’emploient pas ce langage : certaines Églises libres parlent du baptême et de la cène comme d’ordonnances d’obéissance et de souvenir, et l’enseignement des premiers quakers tenait que les rites extérieurs n’étaient plus du tout nécessaires.',
      detail:
        'Le Petit Catéchisme de Westminster (Q. 88) nomme la Parole, les sacrements et la prière comme les moyens extérieurs et ordinaires par lesquels le Christ communique les bienfaits de la rédemption. La Confession d’Augsbourg (art. V) enseigne que, par la Parole et les sacrements, comme par des instruments, est donné le Saint-Esprit, qui produit la foi. Le Catéchisme de l’Église catholique parle des grâces sacramentelles propres à chaque sacrement, et des grâces spéciales ou charismes (§ 2003). Le sermon de John Wesley The Means of Grace nomme la prière, l’étude des Écritures et la cène comme les principaux canaux ordinaires par lesquels Dieu communique la grâce. À l’inverse, la Baptist Faith and Message de la Convention baptiste du Sud (2000, art. VII) présente l’un et l’autre comme des symboles et des actes d’obéissance : le baptême figure la foi du croyant et sa vie nouvelle, et la cène rappelle la mort du Christ et regarde vers son retour. L’Apology de Robert Barclay (1678), défense des principes quakers, tient le vrai baptême et la vraie communion pour intérieurs et spirituels, et les rites extérieurs pour des figures destinées à un temps seulement (propositions 12–13). L’Église primitive persévérait dans l’enseignement des apôtres, la fraction du pain et les prières (Ac 2.42).',
    },
  },

  /* ------------------------------------------------------------------ */
  /* Perspectives                                                        */
  /* ------------------------------------------------------------------ */
  perspectives: {
    'grace:ps:grace-and-response': {
      question: 'Comment la grâce de Dieu se rapporte-t-elle à la réponse humaine de la foi ?',
      intro:
        'Toutes les traditions ci-dessous confessent que le salut vient de la grâce de Dieu et ne peut se mériter. Elles divergent sur la manière dont la grâce agit dans la volonté humaine : est-elle efficace par elle-même ; opère-t-elle seule la conversion tout en pouvant être refusée ; rend-elle possible une réponse libre qui peut être refusée ; guérit-elle la nature en appelant à la coopération ; ou unit-elle les énergies de Dieu à la liberté humaine ? Le débat a des racines profondes — dans la controverse d’Augustin avec Pélage, dans le concile africain de 418, qui enseigna que la grâce donne non seulement le pardon mais la volonté et la force d’obéir, et dans le concile d’Orange (529), qui tint que même le commencement de la foi est un don de la grâce. Tous les camps se réclament, sincèrement, d’Ep 2.8–10.',
      commonGround:
        'Toutes ces traditions confessent que le salut est l’initiative gracieuse de Dieu en Christ ; que nul ne gagne ni ne mérite la grâce du salut ; que la foi est rendue possible par la grâce ; et que la grâce véritable porte du fruit dans une vie transformée, comme y insiste Ep 2.10.',
      perspectives: {
        'grace:ps:grace-and-response:reformed': {
          tradition: 'Réformée',
          label: 'La grâce efficace : Dieu donne la foi qu’il demande',
          summary:
            'Les Canons de Dordrecht (1619) enseignent que la conversion doit être entièrement attribuée à Dieu : la régénération est une nouvelle création et une résurrection d’entre les morts, et non une simple persuasion morale qui laisserait au pouvoir de l’homme d’être converti ou non ; la foi est un don de Dieu, parce que Dieu produit réellement à la fois la volonté de croire et l’acte de croire. Pourtant, la grâce ne traite pas les personnes comme des objets inertes et ne détruit pas la volonté — elle la renouvelle, de sorte que la personne croit et se repent vraiment. Les lecteurs réformés voient cela en Éphésiens 2 : les morts sont rendus à la vie (2.5), et le salut tout entier « ne vient pas de vous » (2.8).',
        },
        'grace:ps:grace-and-response:wesleyan': {
          tradition: 'Arminienne / wesleyenne',
          label: 'La grâce prévenante : une réponse rendue possible, et résistible',
          summary:
            'Les Articles des remontrants (1610) tiennent que nul ne peut penser, vouloir ou faire le bien sans la grâce, qui est le commencement, la continuation et l’achèvement de tout bien — mais que la grâce n’est pas irrésistible, puisque l’Écriture dit que beaucoup se sont opposés au Saint-Esprit (Ac 7.51). John Wesley enseignait que nul n’est laissé dans un état de pure nature : la grâce prévenante de Dieu éveille en chacun la conscience et les premiers désirs tournés vers lui, si bien que les gens pèchent non par manque de grâce, mais parce qu’ils n’usent pas de la grâce qu’ils ont. Dans son sermon sur Ep 2.8, il appelait la grâce la source et la foi la condition du salut, et dans Free Grace il soutenait que la grâce de Dieu est libre en tous et pour tous.',
        },
        'grace:ps:grace-and-response:catholic': {
          tradition: 'Catholique',
          label: 'La grâce qui guérit et élève, avec une coopération réelle',
          summary:
            'Le concile de Trente (session VI, 1547) enseigne que le commencement de la justification vient de la grâce prévenante de Dieu, sans aucun mérite ; Dieu touche le cœur, et la personne, qui pourrait rejeter cette grâce, y consent et y coopère librement, bien qu’incapable de se tourner vers Dieu sans elle. On dit que nous sommes justifiés gratuitement parce que rien de ce qui précède la justification — ni la foi ni les œuvres — ne mérite la grâce même de la justification. Le Catéchisme décrit la grâce comme l’aide gratuite et imméritée de Dieu et comme une participation à sa vie, en distinguant la grâce habituelle (sanctifiante) des grâces actuelles ; après la justification, le mérite est lui-même un don de la grâce. Le traité de Thomas d’Aquin sur la grâce a façonné ce vocabulaire.',
        },
        'grace:ps:grace-and-response:lutheran': {
          tradition: 'Luthérienne',
          label: 'Sola gratia : Dieu seul convertit, mais la grâce peut être refusée',
          summary:
            'La Confession d’Augsbourg (1530, art. IV) enseigne que les hommes ne peuvent être justifiés devant Dieu par leurs propres forces, mérites ou œuvres, mais qu’ils sont justifiés gratuitement à cause du Christ, par la foi, que Dieu leur impute à justice ; l’article V ajoute que le Saint-Esprit, qui produit la foi, est donné par la Parole et les sacrements comme par des instruments. La Formule de Concorde (1577, Épitomé, art. II) tient que la conversion est l’œuvre de la seule grâce du Saint-Esprit : la volonté non convertie n’y contribue en rien, même si, une fois renouvelée, elle coopère avec l’Esprit dans les œuvres qui suivent. Pourtant, cette grâce peut être refusée : selon l’Épitomé, art. XI, ceux qui périssent le font parce qu’ils méprisent la Parole et endurcissent leur cœur, et non parce que Dieu n’aurait pas voulu qu’ils soient sauvés. Dans le cadre de la justification, l’enseignement luthérien considère la grâce avant tout comme la faveur imméritée de Dieu envers les pécheurs, plutôt que comme une qualité infuse dans l’âme. Dietrich Bonhoeffer avertissait que cette grâce gratuite ne doit jamais devenir un principe qui excuse le péché.',
        },
        'grace:ps:grace-and-response:orthodox': {
          tradition: 'Orthodoxe',
          label: 'La grâce comme énergies incréées de Dieu ; la synergie en vue de la théosis',
          summary:
            'À la suite de Grégoire Palamas, Vladimir Lossky présente la grâce non comme une qualité créée dans l’âme, mais comme l’énergie incréée de Dieu lui-même : Dieu se donne véritablement dans ses énergies, tandis que son essence demeure inconnaissable. Le salut est l’union avec Dieu (la théosis, ou divinisation) — une participation réelle à la nature divine (2 P 1.4) dans laquelle la personne humaine reste une créature. Cette union implique une synergie : la volonté humaine coopère avec la grâce divine, et, selon Lossky, la grâce et la liberté agissent ensemble plutôt qu’en rivales. Lossky observe que la théologie orientale n’a jamais fait du rapport entre la grâce et le libre arbitre la controverse brûlante qu’il est devenu dans l’Occident latin après Augustin, et que le langage du mérite tient peu de place dans les écrits spirituels orientaux. Chrysostome, commentant Ep 2.8, dit de même que la foi elle-même est un don de Dieu, tout en relevant que Paul préserve le libre arbitre humain.',
        },
      },
    },
    'grace:ps:joint-declaration': {
      question: 'La Déclaration commune de 1999 a-t-elle réglé le différend de la Réforme sur la justification par grâce ?',
      intro:
        'Le 31 octobre 1999, à Augsbourg, la Fédération luthérienne mondiale et l’Église catholique ont signé la Déclaration commune sur la doctrine de la justification. Le Conseil méthodiste mondial s’y est associé en 2006, et les communions anglicane et réformée l’ont ensuite approuvée. Les chrétiens continuent d’en évaluer différemment la portée.',
      commonGround:
        'Les deux appréciations s’accordent pour dire que la justification est l’œuvre gracieuse de Dieu en Christ, reçue par la foi, et qu’un accord honnête comme un désaccord honnête valent mieux que de masquer les différences.',
      perspectives: {
        'grace:ps:joint-declaration:consensus': {
          tradition: 'Églises signataires (Fédération luthérienne mondiale, Église catholique, puis instances méthodiste, anglicane et réformée)',
          label: 'Un consensus réel sur des vérités fondamentales',
          summary:
            'La Déclaration affirme que luthériens et catholiques peuvent désormais confesser ensemble que Dieu accepte les pécheurs — et leur donne l’Esprit, qui les renouvelle et les engage dans les bonnes œuvres — par grâce seulement, par la foi en l’œuvre du Christ, et jamais sur la base d’un mérite humain. Elle considère les différences qui subsistent entre les présentations des deux Églises comme des différences de vocabulaire, d’accent et de développement théologique qui ne remettent pas en cause ce consensus fondamental. Elle conclut que les condamnations mutuelles du XVIe siècle ne s’appliquent pas à l’enseignement du partenaire tel que la Déclaration l’expose.',
        },
        'grace:ps:joint-declaration:differences': {
          tradition: 'Luthériens confessionnels et autres critiques',
          label: 'Des différences importantes subsistent',
          summary:
            'L’Église luthérienne – Synode du Missouri a conclu que la Déclaration n’est pas une percée : à ses yeux, l’enseignement catholique définit toujours la justification comme incluant le renouvellement intérieur et permet aux justifiés de mériter une grâce supplémentaire, tandis que les luthériens tiennent que la justification est le libre pardon de Dieu, reçu par la foi seule. Son guide d’étude ajoute que tous les théologiens catholiques ne voient pas non plus dans la Déclaration une rupture avec l’enseignement catholique traditionnel, et cite le jugement de Leonardo De Chirico, pour qui la présentation de la justification qu’elle propose laisse pour l’essentiel en place la théologie du concile de Trente.',
        },
      },
    },
  },

  /* ------------------------------------------------------------------ */
  /* Commentaires                                                        */
  /* ------------------------------------------------------------------ */
  commentary: {
    'grace:cm:augustine': {
      lead: 'Sur « Ce n’est point par les œuvres » et « créés […] pour de bonnes œuvres » (Ep 2.9–10)',
      quoteTranslation:
        '« Non par les œuvres » est dit des œuvres que tu crois tirer leur origine de toi seul ; mais tu dois penser aux œuvres pour lesquelles Dieu t’a façonné (c’est-à-dire formé et créé).',
    },
    'grace:cm:chrysostom': {
      lead: 'Sur « cela ne vient pas de vous » (Ep 2.8)',
      quoteTranslation:
        'La foi non plus, veut-il dire, ne vient pas « de nous ». Car s’il n’était pas venu, s’il ne nous avait pas appelés, comment aurions-nous pu croire ?',
    },
    'grace:cm:aquinas': {
      lead: 'Sur les sens ordinaires du mot « grâce »',
      quoteTranslation:
        'Selon la manière commune de parler, on prend habituellement la grâce en trois sens. D’abord, pour l’amour de quelqu’un, comme nous avons coutume de dire que le soldat est dans les bonnes grâces du roi… Ensuite, on la prend pour tout don accordé gratuitement… Enfin, on la prend pour la reconnaissance d’un don accordé « gratis », en tant qu’on dit que nous rendons grâces pour des bienfaits.',
    },
    'grace:cm:calvin': {
      lead: 'Sur « par la grâce […] par le moyen de la foi » (Ep 2.8)',
      quoteTranslation:
        'Dieu déclare qu’il ne nous doit rien ; de sorte que le salut n’est ni un salaire ni une récompense, mais une pure grâce. … La foi amène donc l’homme vide à Dieu, afin qu’il soit rempli des bénédictions du Christ.',
    },
    'grace:cm:wesley': {
      lead: 'Prêchant sur Ep 2.8 à Oxford, en 1738',
      quoteTranslation:
        'Toutes les bénédictions que Dieu a accordées à l’homme viennent de sa pure grâce, de sa bonté ou de sa faveur ; de sa faveur gratuite et imméritée ; d’une faveur entièrement imméritée, l’homme n’ayant aucun droit à la moindre de ses miséricordes. … La grâce est la source, la foi la condition, du salut.',
    },
    'grace:cm:newton': {
      lead: 'Tiré de l’hymne connu aujourd’hui sous le titre « Amazing Grace »',
      quoteTranslation:
        'C’est la grâce qui apprit à mon cœur à craindre, / Et la grâce qui apaisa mes craintes ; / Combien cette grâce me parut précieuse / À l’heure où j’ai cru pour la première fois !',
    },
    'grace:cm:spurgeon': {
      lead: 'Sur la grâce comme source et la foi comme canal (Ep 2.8)',
      quoteTranslation:
        'La foi occupe la place d’un canal ou d’une conduite. La grâce est la source et le courant ; la foi est l’aqueduc le long duquel le flot de la miséricorde descend pour rafraîchir les fils des hommes assoiffés.',
    },
    'grace:cm:bonhoeffer': {
      lead: 'Sur la « grâce à bon marché » et la « grâce qui coûte »',
      text:
        'Bonhoeffer ouvre Discipleship (1937) en opposant ce qu’il appelait la grâce à bon marché et la grâce qui coûte. La grâce à bon marché, selon lui, est le pardon traité comme s’il n’engageait en rien celui qui est pardonné — sans détournement du péché ni marche à la suite du Christ, si bien que la vie continue inchangée. La grâce qui coûte est l’appel même de Jésus à le suivre, qui réclame la vie entière d’une personne et, dans le même temps, donne gratuitement une vie nouvelle. Son avertissement applique Ep 2.8–10 par l’autre bout : une grâce qui ne marche jamais dans les bonnes œuvres a été mal comprise.',
    },
    'grace:cm:packer': {
      lead: 'Pourquoi la grâce paraît banale à beaucoup',
      text:
        'Dans le chapitre sur la grâce de Dieu de Knowing God (1973), Packer soutient que beaucoup de ceux qui parlent de la grâce ne la trouvent pas étonnante parce qu’ils n’ont pas saisi quatre vérités qu’elle présuppose : les êtres humains sont moralement coupables devant Dieu ; Dieu est juste et doit punir le péché ; nous sommes impuissants à restaurer par nous-mêmes notre relation avec lui ; et Dieu est libre — il n’a aucune obligation de nous montrer sa faveur. C’est seulement quand on ressent ces vérités que la grâce apparaît comme la chose stupéfiante que décrit Ep 2.1–10.',
    },
    'grace:cm:keller': {
      lead: 'La grâce pour le rebelle et pour le moraliste',
      text:
        'Dans The Prodigal God (2008), Keller lit Luc 15 comme l’histoire de deux fils, tous deux éloignés de leur père. Le cadet se rebelle ouvertement ; l’aîné obéit pour faire du père son débiteur, et, à la fin, c’est lui qui refuse d’entrer à la fête. Keller soutient que l’Évangile démasque à la fois la complaisance envers soi-même et le moralisme qui se croit juste comme deux manières de chercher à contrôler Dieu, et que seule la grâce ramène l’un et l’autre fils à la maison — la même logique qu’Ep 2.9, qui exclut tout motif de se glorifier.',
    },
    'grace:cm:piper': {
      lead: 'Faut-il chercher à rendre à Dieu ce qu’il nous a donné ?',
      text:
        'Dans Future Grace (première publication en 1995 ; édition révisée en 2012), Piper affirme que la reconnaissance envers Dieu est juste et biblique, mais il met en garde contre ce qu’il appelle une « éthique du débiteur » : traiter l’obéissance comme un remboursement de ce que Dieu a fait. Selon lui, chercher à rembourser Dieu ferait de la grâce un dû plutôt qu’un don gratuit. Il soutient plutôt que l’obéissance est nourrie par la foi en la grâce que Dieu promet pour l’avenir. Plus loin dans le livre, il cite Ep 2.8–10 pour rappeler aux lecteurs qu’ils sont sauvés pour de bonnes œuvres : l’obéissance persévérante est le fruit de la foi et de l’aide de l’Esprit, non le fondement de leur acceptation, qui repose sur le Christ.',
    },
    'grace:cm:wright': {
      lead: 'Éphésiens 2 et les « anciennes » et « nouvelles » perspectives sur Paul',
      text:
        'Dans Justification (2009), écrit dans le cadre du débat avec John Piper et d’autres, Wright lit le langage paulinien de la justification dans le cadre du plan unique de Dieu, qui passe par Israël pour atteindre le monde, tout en affirmant que les pécheurs sont déclarés justes sur la base de la mort et de la résurrection du Christ. Il observe qu’Éphésiens tient ensemble des accents souvent opposés l’un à l’autre : le salut par grâce, par le moyen de la foi, qui produit de bonnes œuvres (2.1–10), et Juifs et païens unis en une seule famille dans le Messie (2.11–22). Des critiques comme Piper ont contesté certains aspects de sa présentation de la justification, mais sa lecture montre pourquoi Ep 2.1–10 ne doit pas être lu isolément de 2.11–22.',
    },
  },

  /* ------------------------------------------------------------------ */
  /* Prédications                                                        */
  /* ------------------------------------------------------------------ */
  sermons: {
    'grace:sermon:wesley-salvation-by-faith': {
      summary:
        'Prêché devant l’université d’Oxford le 11 juin 1738, fête de saint Barnabé (les éditions de 1746 et de 1872 le datent à tort du 18 juin, alors que Wesley était en Allemagne), le sermon commence par fonder toute bénédiction sur la faveur gratuite et imméritée de Dieu, puis il demande ce qu’est la foi qui sauve (non pas la simple croyance d’un païen ou d’un démon, mais la confiance en Christ), ce que comprend le salut par la foi, et comment répondre aux objections.',
    },
    'grace:sermon:spurgeon-salvation-all-of-grace': {
      summary:
        'Spurgeon suit la grâce à travers l’élection, la rédemption, l’appel et la justification, et suggère que Paul insiste parce que le cœur humain résiste à l’idée d’être sauvé par grâce. Les pécheurs ne viennent pas comme des innocents ou des excusables, mais comme des coupables qui se jettent dans les bras de la miséricorde. Il en tire ensuite cinq conséquences pratiques : cette doctrine donne de l’espérance à tout pécheur, montre comment plaider auprès de Dieu, réconcilie les croyants avec les voies que Dieu a établies (la foi et le baptême), fournit un puissant motif de sainteté, et met à l’épreuve la réponse de chaque auditeur.',
    },
    'grace:sermon:piper-but-god': {
      summary:
        'Un sermon de la période de Noël qui oppose chaque élément de la détresse décrite en 2.1–3 à la réponse de Dieu en 2.4–7 : la bonté au lieu de la colère (2.3 et 2.7), la liberté et une place auprès du Christ au lieu de la captivité (2.2 et 2.6), et la vie au lieu de la mort (2.1 et 2.5–6) — le tout articulé autour des mots « Mais Dieu ».',
    },
    'grace:sermon:keller-grace-of-god': {
      summary:
        'Ce sermon fait partie d’une série sur les attributs de Dieu. D’après la présentation qui en est faite, Keller soutient à partir d’Ep 2.1–10 que la grâce est un don dont nous ne pouvons nous passer et qui a coûté infiniment à Dieu, et que voir ces deux vérités change la manière dont la grâce s’empare d’une vie.',
    },
  },

  /* ------------------------------------------------------------------ */
  /* Notes sur les versets                                               */
  /* ------------------------------------------------------------------ */
  verseNotes: {
    'EPH.2.1': [
      'Paul commence par le diagnostic : ses lecteurs étaient morts par leurs offenses et par leurs péchés. « Morts » dit plus que la faiblesse — sans l’action de Dieu, ils ne pouvaient se donner la vie —, et c’est pourquoi le remède, en 2.5, est une résurrection et non une amélioration. (Les traditions divergent sur l’étendue de cette incapacité et sur la manière dont la grâce la rejoint ; voir les perspectives.) La même image se retrouve en Col 2.13.',
    ],
    'EPH.2.2': [
      'La vie sans le Christ était une manière de marcher façonnée par le train de ce monde et par « le prince de la puissance de l’air » — le diable, qui agit dans ceux qui désobéissent à Dieu. Le péché n’y apparaît pas seulement comme un choix individuel, mais comme un asservissement à des puissances extérieures. Le verbe « marcher » revient en 2.10, dans une direction nouvelle.',
    ],
    'EPH.2.3': [
      'Paul s’inclut lui-même — « Nous tous aussi » — et décrit une vie menée par les convoitises de la chair et des pensées. « La chair » désigne ici la nature humaine déchue (les notes de Tyndale parlent de notre nature pécheresse), et non simplement le corps physique. « Par nature des enfants de colère » signifie que, sans la grâce, chacun se trouve sous le juste jugement de Dieu contre le péché ; Juifs et païens partagent la même détresse.',
    ],
    'EPH.2.4': [
      '« Mais Dieu » est la charnière du passage. Paul fonde tout ce qui suit sur le caractère de Dieu — riche en miséricorde (eleos, le mot par lequel l’Ancien Testament grec rendait hesed) et agissant par un grand amour. Rien chez les lecteurs n’a suscité ce sauvetage ; sa raison est tout entière en Dieu.',
    ],
    'EPH.2.5': [
      'Dieu nous a rendus à la vie avec le Christ alors même que nous étions morts. Paul interrompt alors sa propre phrase — « c’est par grâce que vous êtes sauvés » — avec un participe parfait qui présente le salut comme un sauvetage accompli aux effets durables. C’est, avec 2.8, le seul endroit du Nouveau Testament où cette forme apparaît.',
    ],
    'EPH.2.6': [
      'Les croyants sont ressuscités avec le Christ et assis avec lui dans les lieux célestes — un langage qui fait écho à ce que Dieu a fait pour le Christ en 1.20. Paul en parle comme d’une réalité déjà vraie, parce que les croyants sont unis au Christ ; ils n’en font pas encore pleinement l’expérience, mais leur position en lui est assurée.',
    ],
    'EPH.2.7': [
      'Le dessein de Dieu va au-delà du sauvetage des lecteurs : dans les siècles à venir, il montrera l’infinie richesse de sa grâce, exprimée dans sa bonté envers nous en Jésus-Christ. Les sauvés deviennent une vitrine durable de ce qu’est Dieu. La bonté (chrēstotēs) est ici le même mot qu’en Tite 3.4.',
    ],
    'EPH.2.8': [
      'La thèse du passage : sauvés par grâce (ce qui sauve), par le moyen de la foi (la manière dont on le reçoit), et cela ne vient pas de vous, c’est le don de Dieu. Comme « cela » est neutre alors que « grâce » et « foi » sont féminins en grec, beaucoup de lecteurs y voient l’ensemble de l’événement du salut. Les chrétiens discutent depuis longtemps pour savoir si la foi elle-même fait partie du don — Chrysostome et Augustin répondaient oui, Calvin comprenait le don comme le salut lui-même.',
    ],
    'EPH.2.9': [
      '« Ce n’est point par les œuvres, afin que personne ne se glorifie. » Si le salut était même en partie mérité, les sauvés pourraient s’en attribuer une part de mérite ; la grâce ôte tout motif d’orgueil devant Dieu (comparer Rm 3.27 ; 1 Co 1.29–31). Les œuvres exclues ici sont les œuvres comme fondement de l’acceptation — Paul va affirmer les bonnes œuvres dès le verset suivant.',
    ],
    'EPH.2.10': [
      'Nous sommes l’ouvrage (poiēma) de Dieu, créés en Jésus-Christ pour de bonnes œuvres que Dieu a préparées d’avance, afin que nous y marchions (LSG : « afin que nous les pratiquions »). Les bonnes œuvres sont le résultat du salut, non sa cause. Le verset referme le cercle ouvert en 2.2 : l’ancienne marche dans le péché fait place à une marche nouvelle dans les œuvres que Dieu a prévues.',
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Concepts                                                            */
  /* ------------------------------------------------------------------ */
  concepts: {
    'grace:concept:grace': {
      label: 'La grâce (charis)',
      aliases: [
        'grâce',
        'grâces',
        'gracieux',
        'faveur',
        'faveur imméritée',
        'imméritée',
        'immérité',
        'par grâce',
        'par la grâce',
        'mot grec pour grâce',
        'grâce commune',
        'qu’est-ce que la grâce',
        'que signifie grâce',
        'que veut dire grâce',
      ],
      answer:
        'Le mot grec derrière « grâce » en Ep 2.5, 7 et 8 est charis — la faveur ou la bienveillance d’un donateur, et surtout la faveur gratuite et imméritée de Dieu. Il pouvait aussi désigner le don lui-même et la reconnaissance qu’il appelle. Dans ce passage, Paul l’emploie pour nommer l’unique source du salut : Dieu a agi envers des gens spirituellement morts, si bien que le salut est son don, et non leur accomplissement (2.8–9). Les théologiens distinguent aussi cette grâce qui sauve de la bonté commune de Dieu envers tous — voir la section Théologie.',
    },
    'grace:concept:mercy': {
      label: 'Miséricorde et amour (Ep 2.4)',
      aliases: [
        'miséricorde',
        'miséricordieux',
        'riche en miséricorde',
        'compassion',
        'grand amour',
        'amour de dieu',
        'bonté',
        'bienveillance',
        'mais dieu qui est riche en miséricorde',
      ],
      answer:
        'En 2.4, Paul fonde le sauvetage opéré par Dieu sur son caractère : il est riche en miséricorde (eleos) et il agit à cause de son grand amour. La miséricorde regarde la misère décrite en 2.1–3 ; la grâce, le don immérité de 2.5–8. Dans l’Ancien Testament grec, eleos traduit d’ordinaire hesed, l’amour fidèle de Dieu dans l’alliance, si bien que Paul fait écho à la confession d’Israël sur un Dieu riche en bonté (Ex 34.6).',
    },
    'grace:concept:saved': {
      label: 'Sauvés (sōzō)',
      aliases: [
        'sauvé',
        'sauvés',
        'sauver',
        'salut',
        'vous êtes sauvés',
        'avez été sauvés',
        'temps du parfait',
        'participe parfait',
        'secourus',
        'délivrance',
        'sauvetage',
      ],
      answer:
        'Les deux fois où Paul dit « c’est par grâce que vous êtes sauvés » (2.5, 8), il emploie un participe parfait de sōzō, σεσῳσμένοι, avec « vous êtes » — ce qui présente le salut comme un sauvetage accompli dont les effets demeurent. Dans tout le Nouveau Testament, cette forme n’apparaît que dans ces deux versets. Ailleurs, Paul parle aussi du salut comme d’une réalité en cours et encore à venir (1 Co 1.18 ; Rm 5.9–10) ; Éphésiens en souligne la réalité présente et assurée.',
    },
    'grace:concept:faith': {
      label: 'Par le moyen de la foi',
      aliases: [
        'foi',
        'par la foi',
        'par le moyen de la foi',
        'croire',
        'croyance',
        'confiance',
        'la foi seule',
        'foi seule',
        'la foi est-elle un don',
        'la foi est elle un don',
      ],
      answer:
        'Paul dit que nous sommes sauvés par grâce, par le moyen de la foi (2.8) : la grâce est ce qui sauve, et la foi est la manière dont le don est reçu. La foi n’est pas une œuvre qui mériterait le salut — c’est pourquoi elle s’accorde avec « Ce n’est point par les œuvres » (2.9). Spurgeon comparait la grâce à la source et la foi à l’aqueduc ; Wesley appelait la grâce la source et la foi la condition du salut. La question de savoir si la foi elle-même fait partie du « don » de 2.8 est discutée depuis l’Église ancienne.',
    },
    'grace:concept:gift': {
      label: 'Le don de Dieu — « cela ne vient pas de vous »',
      aliases: [
        'don',
        'don de dieu',
        'le don de dieu',
        'cela ne vient pas de vous',
        'pas de vous-mêmes',
        'don gratuit',
        'gratuitement',
        'gratuit',
        'gratuité',
      ],
      answer:
        'En 2.8, Paul appelle le salut « le don de Dieu » (dōron), avec un mot qui désigne ailleurs le plus souvent une offrande que les hommes apportent à Dieu — ici, c’est Dieu qui donne. Le « cela » de « cela ne vient pas de vous » est neutre et ne s’accorde pas avec les mots féminins « grâce » et « foi » ; il renvoie donc le plus naturellement à l’ensemble de l’événement : être sauvé par grâce, par le moyen de la foi. Chrysostome et Augustin incluaient la foi dans le don ; Calvin comprenait le don comme le salut lui-même.',
    },
    'grace:concept:works': {
      label: 'Les œuvres, la gloire et Jacques',
      aliases: [
        'œuvres',
        'oeuvres',
        'non par les œuvres',
        'bonnes œuvres',
        'bonnes oeuvres',
        'se glorifier',
        'se vanter',
        'mérite',
        'mériter',
        'mérité',
        'gagner son salut',
        'jacques',
        'foi et œuvres',
        'foi et oeuvres',
        'la foi sans les œuvres',
        'jacques 2',
      ],
      answer:
        'Paul exclut les œuvres comme fondement du salut « afin que personne ne se glorifie » (2.9), puis dit aussitôt que nous avons été créés pour de bonnes œuvres (2.10) — le même nom grec, d’abord avec « de », puis avec « pour ». L’avertissement de Jacques, selon lequel la foi sans les œuvres est morte (Jc 2.14–26), vise une foi qui ne produit rien ; Paul exclut les œuvres comme fondement de l’acceptation. Ensemble, ils enseignent que la grâce sauve sans les œuvres et ne laisse jamais les croyants sans elles.',
    },
    'grace:concept:workmanship': {
      label: 'L’ouvrage de Dieu (poiēma)',
      aliases: [
        'ouvrage',
        'son ouvrage',
        'nous sommes son ouvrage',
        'chef-d’œuvre',
        'chef-d’oeuvre',
        'œuvre de dieu',
        'nouvelle création',
        'nouvelle créature',
        'créés en jésus-christ',
        'préparées d’avance',
        'verset 10',
      ],
      answer:
        'En 2.10, Paul appelle les croyants l’ouvrage (poiēma) de Dieu, un mot qui n’apparaît qu’une autre fois dans le Nouveau Testament — pour la création elle-même, en Rm 1.20. Le Dieu qui a fait le monde a fait un peuple nouveau, « créés en Jésus-Christ » pour de bonnes œuvres qu’il a préparées d’avance. Les bonnes œuvres sont le but et le fruit du salut, non sa cause, et la marche de 2.10 remplace l’ancienne marche de 2.2.',
    },
    'grace:concept:dead-alive': {
      label: 'De la mort à la vie : « Mais Dieu »',
      aliases: [
        'morts',
        'mort',
        'morts dans le péché',
        'morts par vos offenses',
        'offenses',
        'rendus à la vie',
        'vivifiés',
        'mais dieu',
        'chair',
        'la chair',
        'enfants de colère',
        'colère',
        'prince de la puissance de l’air',
        'ressuscités avec christ',
        'assis avec christ',
        'lieux célestes',
        'union avec christ',
        'union au christ',
      ],
      answer:
        'Paul décrit la vie sans le Christ comme une mort (2.1), un asservissement au monde et au diable (2.2), et une vie menée par la chair — la nature humaine déchue — sous la juste colère de Dieu (2.3). Vient alors la charnière : « Mais Dieu » (2.4). Les morts ne se raniment pas eux-mêmes ; Dieu nous a rendus à la vie, ressuscités et fait asseoir avec le Christ (2.5–6), en écho à ce qu’il a fait pour le Christ en 1.20.',
    },
    'grace:concept:grace-and-response': {
      label: 'Grâce et réponse humaine : là où les chrétiens divergent',
      aliases: [
        'interprétations différentes',
        'différentes interprétations',
        'interprétations théologiques',
        'calvinisme',
        'calviniste',
        'réformé',
        'réformée',
        'arminien',
        'arminianisme',
        'wesleyen',
        'catholique',
        'luthérien',
        'orthodoxe',
        'libre arbitre',
        'prédestination',
        'élection',
        'monergisme',
        'synergie',
        'grâce prévenante',
        'grâce irrésistible',
        'pélage',
        'pélagianisme',
        'théosis',
        'divinisation',
        'déclaration commune',
      ],
      answer:
        'Toutes les grandes traditions affirment que le salut vient de la grâce de Dieu et ne peut se mériter ; elles divergent sur la manière dont la grâce agit dans la volonté humaine. La théologie réformée enseigne une grâce efficace qui donne la foi qu’elle demande ; la théologie arminienne et wesleyenne, une grâce prévenante qui rend possible une réponse libre et résistible ; l’enseignement catholique parle d’une grâce qui guérit et élève, avec une coopération réelle ; les luthériens confessent que Dieu seul convertit, par la Parole et les sacrements, mais que sa grâce peut être refusée, et ils soulignent la grâce comme faveur de Dieu reçue par la foi seule ; et l’orthodoxie parle de synergie avec les énergies incréées de Dieu. La section Théologie présente chaque position avec ses sources.',
    },
    'grace:concept:original-audience': {
      label: 'Comment les premiers lecteurs entendaient « grâce »',
      aliases: [
        'premiers lecteurs',
        'lecteurs originels',
        'public d’origine',
        'patronage',
        'patron',
        'bienfaiteur',
        'bienfait',
        'réciprocité',
        'gratitude',
        'reconnaissance',
        'monde romain',
        'éphèse',
        'païens',
        'qui a écrit éphésiens',
        'auteur d’éphésiens',
        'paternité',
      ],
      answer:
        'Les lecteurs de Paul, en majorité d’origine païenne, dans la province d’Asie, employaient charis pour la faveur d’un patron ou d’un bienfaiteur, pour le don lui-même et pour la reconnaissance qu’il imposait. En entendant qu’ils étaient sauvés par grâce, ils se seront très probablement représenté Dieu comme le bienfaiteur suprême — à ceci près que le Dieu de Paul fait son plus grand don à des indignes, et même à des ennemis, et que son don crée une vie nouvelle et reconnaissante (2.10). Des spécialistes comme David deSilva et John Barclay ont exploré cet arrière-plan.',
    },
    'grace:concept:living-by-grace': {
      label: 'Vivre de la grâce : grâce à bon marché, grâce qui coûte',
      aliases: [
        'grâce à bon marché',
        'grâce qui coûte',
        'le prix de la grâce',
        'licence',
        'permission de pécher',
        'continuer à pécher',
        'demeurer dans le péché',
        'sanctification',
        'sainteté',
        'la grâce enseigne',
        'débiteur',
      ],
      answer:
        'Parce que la grâce est gratuite, certains l’ont prise pour une permission de pécher ; Paul répond que ceux qui sont unis au Christ marchent en nouveauté de vie (Rm 6.1–4), et la grâce qui sauve nous enseigne aussi à mener une vie pieuse (Tt 2.11–12). Bonhoeffer appelait « grâce à bon marché » la grâce sans marche à la suite du Christ, et l’opposait à la grâce qui coûte, celle de l’appel du Christ. Ep 2.10 dit la même chose : nous sommes sauvés non par les bonnes œuvres, mais pour elles.',
    },
    'grace:concept:means-of-grace': {
      label: 'Les moyens de grâce : la Parole, les sacrements, la prière',
      aliases: [
        'moyens de grâce',
        'sacrements',
        'sacrement',
        'ordonnances',
        'ordonnance',
        'parole et sacrements',
        'sainte cène',
        'la cène',
        'eucharistie',
        'communion',
        'baptême',
      ],
      answer:
        'Beaucoup de traditions — catholique, luthérienne, réformée et méthodiste, entre autres — enseignent que Dieu donne et nourrit ordinairement la grâce par des moyens qu’il a établis, avant tout la Parole et les sacrements, ainsi que la prière. Le Petit Catéchisme de Westminster (Q. 88) nomme la Parole, les sacrements et la prière ; la Confession d’Augsbourg (art. V) dit que l’Esprit, qui produit la foi, est donné par la Parole et les sacrements ; et Wesley appelait la prière, l’Écriture et la cène les principaux canaux ordinaires de la grâce. Certains chrétiens des Églises libres décrivent plutôt le baptême et la cène comme des actes symboliques d’obéissance, et les premiers quakers tenaient que les rites extérieurs n’étaient plus nécessaires. La section Théologie présente ces positions avec leurs sources.',
    },
    'grace:concept:old-testament': {
      label: 'La grâce dans l’Ancien Testament',
      aliases: [
        'ancien testament',
        'hébreu',
        'mot hébreu pour grâce',
        'bonté de l’éternel',
        'amour fidèle',
        'fidélité de dieu',
        'miséricorde de l’éternel',
        'trouva grâce',
        'trouver grâce',
        'noé',
        'miséricordieux et compatissant',
        'dieu compatissant',
      ],
      answer:
        'La grâce n’est pas une invention du Nouveau Testament. L’hébreu chen signifie la faveur (Noé trouva grâce aux yeux de l’Éternel, Gn 6.8), le verbe chanan signifie faire grâce (Nb 6.25 ; Ps 51.1), et hesed désigne l’amour fidèle et loyal de Dieu. Au Sinaï, Dieu s’est révélé miséricordieux et compatissant, riche en hesed (Ex 34.6–7), et il a choisi Israël par amour, non pour ses mérites (Dt 7.7–8). L’Ancien Testament grec a rendu chen par charis et hesed par eleos — les mots mêmes qu’emploie Paul en Ep 2.4–8.',
    },
  },
};

export default overlay;
