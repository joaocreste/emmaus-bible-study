/**
 * Français — traduction de l’étude « Jean 1 » (src/data/curated/studies/john-1.ts).
 *
 * Les paroles bibliques citées entre guillemets suivent la Louis Segond 1910 (LSG), version
 * française par défaut ; quand une autre traduction est discutée, elle est nommée. Ailleurs,
 * l’Écriture est paraphrasée sans guillemets. Ancres vérifiées sur le texte de LSG, Darby,
 * NCL et Ostervald. Les citations vérifiées ne sont pas réécrites : elles reçoivent seulement
 * une traduction libre (quoteTranslation). Les titres d’ouvrages restent tels qu’ils sont cités.
 */
import type { StudyOverlay } from '../types';

const jv = (verse: number) => ({ book: 'JHN', chapter: 1, verse });

const overlay: StudyOverlay = {
  studyId: 'john-1',
  locale: 'fr',
  title: 'Jean 1',
  subtitle: 'La Parole faite chair',
  summary:
    'Jean 1 ouvre le quatrième Évangile en remontant avant la création : la Parole qui était avec Dieu et qui était Dieu, par qui toutes choses ont été faites, « a été faite chair, et elle a habité parmi nous ». En faisant écho à Genèse 1 et à la mémoire d’Israël — le tabernacle, le Sinaï —, le prologue (1.1–18) présente Jésus comme celui en qui la gloire, la grâce et la vérité de Dieu se laissent enfin voir, et qui fait connaître le Père invisible. La suite du chapitre entre dans l’histoire : Jean-Baptiste rend témoignage et désigne « l’Agneau de Dieu, qui ôte le péché du monde », et les premiers disciples se mettent à suivre Jésus en le confessant sous un titre après l’autre — Rabbi, Messie, Fils de Dieu, roi d’Israël —, jusqu’à ce que Jésus leur promette le ciel ouvert au-dessus du Fils de l’homme.',
  opening:
    'Bienvenue dans Jean 1 — l’un des chapitres les plus aimés et les plus profonds de la Bible. Nous pouvons commencer « Au commencement » avec la Parole, guetter les échos de la Genèse et de l’Exode, regarder de près quelques mots grecs, puis suivre les premiers disciples qui répondent à l’invitation : « Viens, et vois ». Interrogez-moi sur un verset, un mot ou une voix de l’histoire de l’Église : l’étude, à côté, vous suivra.',
  matchTopics: [
    'jean 1',
    'jean chapitre 1',
    'évangile de jean 1',
    'évangile selon jean 1',
    'la parole a été faite chair',
    'la parole s’est faite chair',
    'le verbe s’est fait chair',
    'le verbe fait chair',
    'au commencement était la parole',
    'au commencement était le verbe',
    'le logos',
    'prologue de jean',
    'le prologue de jean',
    'prologue johannique',
    'agneau de dieu',
    'l’agneau de dieu',
    'incarnation du verbe',
  ],
  suggestedQuestions: [
    'Quel mot grec se cache derrière « Parole » ?',
    'Quel lien entre Jean 1 et la Genèse ?',
    'Expliquez le verset 14 plus en détail.',
    'Comment les premiers lecteurs comprenaient-ils « Logos » ?',
    'Y a-t-il plusieurs interprétations de « Fils unique » ?',
    'Qu’a dit Augustin sur ce passage ?',
    'Pourquoi Jésus est-il appelé l’Agneau de Dieu ?',
    'Qu’a dit Tim Keller à ce sujet ?',
    'Qu’enseigne ce chapitre sur l’identité de Jésus ?',
  ],

  /* ------------------------------------------------------------------ */
  /* Mots clés                                                           */
  /* ------------------------------------------------------------------ */
  keyWords: {
    'john-1:kw:logos': {
      english: 'Parole / Verbe',
      grammar: 'Nom, nominatif singulier masculin, avec l’article (ὁ λόγος) — forme en 1.1',
      basicMeaning: 'parole',
      semanticRange: [
        'une parole qui exprime une pensée ou une idée',
        'un propos, une déclaration ou un message — surtout « la parole de Dieu »',
        'discours, enseignement, compte rendu ou récit',
        'raison ; compte à rendre',
        'la Parole divine (le Logos) : Jean 1.1, 14 ; 1 Jean 1.1 ; Apocalypse 19.13',
      ],
      notableNotes: [
        'Dans l’Ancien Testament grec (Ps 32.6 LXX), les cieux ont été faits par la parole — τῷ λόγῳ — du Seigneur : la parole créatrice dont Jean se fait l’écho en 1.3.',
        'La « parole de vie », ce qui était « dès le commencement » et que l’on a vu et touché — le prologue parallèle de la même tradition.',
        'Le cavalier qui revient porte ce nom : « la Parole de Dieu ».',
        '« La parole de Dieu est vivante et efficace » — le sens ordinaire du message que Dieu adresse, sur lequel s’appuie l’emploi personnel qu’en fait Jean.',
      ],
      significance:
        'Jean ne nomme Jésus qu’en 1.17 ; il commence par « la Parole ». Pour les lecteurs de l’Ancien Testament grec, λόγος était la traduction habituelle de l’hébreu dāvār — la parole par laquelle Dieu crée (Ps 33.6), parle par les prophètes et accomplit sa volonté. Les lecteurs grecs y entendaient l’ordre rationnel qui sous-tend le monde. Jean recueille ces deux harmoniques, puis dit ce qu’aucune ne laissait attendre : cette Parole est personnelle, elle était « avec Dieu », elle « était Dieu », et elle « a été faite chair » (1.14). La Parole est l’expression même de Dieu — c’est pourquoi le prologue s’achève sur le Fils qui « l’a fait connaître » (1.18). (La LSG, Darby et Ostervald traduisent « la Parole » ; la NCL, avec la tradition catholique, « le Verbe ».)',
      caution:
        'Un seul mot ne porte pas toute la doctrine. Dans la plupart de ses 330 emplois du Nouveau Testament (décompte du TAGNT de STEPBible, dont 40 chez Jean), λόγος signifie simplement une parole, un message ou un récit. Son sens en 1.1 vient des phrases de Jean — de ce qu’il dit que la Parole était et a fait —, et non du seul dictionnaire.',
      anchors: [
        { verse: jv(1), phrases: { LSG: 'Parole', DARBY: 'Parole', NCL: 'Verbe', OST: 'Parole' } },
        { verse: jv(14), phrases: { LSG: 'parole', DARBY: 'Parole', NCL: 'Verbe', OST: 'Parole' } },
      ],
    },
    'john-1:kw:arche': {
      english: 'commencement',
      grammar: 'Nom, datif singulier féminin, sans article (ἐν ἀρχῇ, « au commencement ») — forme en 1.1',
      basicMeaning: 'commencement',
      semanticRange: [
        'commencement, origine — au sens absolu, le commencement de toutes choses',
        'le principe premier ou la source (du Christ : Ap 3.14 ; Col 1.18)',
        'un commencement relatif (« le premier des miracles », Jean 2.11)',
        'autorité, souveraineté ; (au pluriel) les puissances et les autorités',
      ],
      notableNotes: [
        'L’Ancien Testament grec s’ouvre sur les deux mêmes mots, Ἐν ἀρχῇ : les premiers mots de Jean font délibérément écho à la Genèse.',
        '« Ce qui était dès le commencement » (ἀπ’ ἀρχῆς) — l’ouverture parallèle de la lettre johannique.',
        'Le Christ est « le commencement, le premier-né d’entre les morts ».',
        'Cana est « le premier des miracles » (ἀρχή) — un commencement relatif, le début de la révélation publique de Jésus.',
      ],
      significance:
        'En reprenant les premiers mots de la Bible grecque, Jean invite ses lecteurs à relire Genèse 1 avec Jésus sous les yeux. Mais il faut remarquer le verbe : la Genèse dit qu’au commencement Dieu créa ; Jean dit qu’au commencement la Parole « était » déjà. Quand le commencement a commencé, la Parole n’est pas venue à l’existence — elle était déjà là. L’Évangile de Jean se présente ainsi comme une nouvelle Genèse : celui par qui le monde a été fait vient maintenant faire des êtres nouveaux (1.12–13).',
      caution:
        'ἀρχή ne signifie pas en soi « éternité » ; le mot veut dire commencement. L’éternité de la Parole découle de l’association d’ἀρχή avec le verbe « était » (ἦν) et du verset 3, qui range tout ce qui est venu à l’existence de l’autre côté de la ligne.',
      anchors: [
        { verse: jv(1), phrases: { LSG: 'Au commencement', DARBY: 'Au commencement', NCL: 'Au commencement', OST: 'Au commencement' } },
        { verse: jv(2), phrases: { LSG: 'au commencement', DARBY: 'au commencement', NCL: 'au commencement', OST: 'au commencement' } },
      ],
    },
    'john-1:kw:theos': {
      english: 'Dieu',
      grammar: 'Nom, nominatif singulier masculin — attribut placé avant le verbe et sans article (θεὸς ἦν ὁ λόγος) — 1.1c',
      basicMeaning: 'Dieu ; un dieu',
      semanticRange: [
        'le seul vrai Dieu (généralement avec l’article, ὁ θεός)',
        'Dieu, sans l’article — notamment après une préposition et comme attribut (le TBESG cite Jean 1.1)',
        'un dieu, une divinité (dans un contexte polythéiste)',
      ],
      notableNotes: [
        'En 1.1b, « avec Dieu » porte l’article (πρὸς τὸν θεόν) ; en 1.1c, « était Dieu » n’en porte pas (θεὸς ἦν ὁ λόγος).',
        'Les manuscrits les plus anciens lisent μονογενὴς θεός, « le [Fils] unique, [lui-même] Dieu » ; des manuscrits plus tardifs lisent « Fils ».',
        'Thomas confesse : « Mon Seigneur et mon Dieu ! » — l’Évangile s’achève là où il a commencé.',
      ],
      significance:
        'L’ordre des mots et l’article comptent ici. Le sujet est ὁ λόγος (« la Parole », avec l’article) ; θεός (« Dieu ») est placé en tête pour l’emphase et n’a pas d’article. Si Jean avait écrit ὁ θεὸς ἦν ὁ λόγος, il aurait identifié la Parole à celui qu’il vient d’appeler « Dieu » (le Père) — en contradiction avec « la Parole était avec Dieu ». Comme l’a soutenu Philip Harner, la construction est qualitative : la Parole possède la nature même de Dieu — elle est vraiment Dieu, non un être divin inférieur, et elle n’est pas le Père.',
      caution:
        'L’absence d’article ne rend pas θεός indéfini. La Traduction du monde nouveau rend 1.1c par « un dieu », mais le grec omet régulièrement l’article devant « Dieu » (par exemple en 1.6 et 1.18), et le contexte exclut un « dieu » inférieur et créé : tout ce qui a été fait l’a été par la Parole (1.3). Harner, dont l’étude est souvent citée à propos de ce verset, concluait lui-même que la Parole partage la même nature que Dieu, et il rejetait la traduction « un dieu ».',
      anchors: [{ verse: jv(1), phrases: { LSG: 'était Dieu', DARBY: 'était Dieu', NCL: 'était Dieu', OST: 'était Dieu' } }],
    },
    'john-1:kw:phos': {
      english: 'lumière',
      grammar: 'Nom, nominatif singulier neutre (τὸ φῶς) — forme en 1.4',
      basicMeaning: 'lumière',
      semanticRange: [
        'la lumière physique (le contraire des ténèbres, σκότος / σκοτία)',
        'au figuré, en parlant de Dieu (1 Jean 1.5)',
        'la vérité spirituelle et son effet dans la vie humaine (Jean 1.4–5 ; 3.19–21)',
        'celui d’où rayonne la vérité — surtout le Christ, « la lumière du monde » (8.12 ; 9.5)',
      ],
      notableNotes: [
        '« Que la lumière soit ! » — la première parole de la création, dont Jean 1.4–5 se fait l’écho (LXX γενηθήτω φῶς).',
        'Citant Ésaïe 9.2 : le peuple assis dans les ténèbres « a vu une grande lumière » — ce qui s’accomplit dans le ministère de Jésus.',
        '« Je suis la lumière du monde » — l’image du prologue devient la parole de Jésus sur lui-même.',
        '« Dieu est lumière », et il n’y a en lui aucunes ténèbres.',
      ],
      significance:
        'La lumière et les ténèbres (σκοτία, deux fois en 1.5) encadrent le drame du prologue. Dans la Genèse, la lumière est le premier don créateur de Dieu ; chez Jean, la vie de la Parole « était la lumière des hommes » (1.4), elle continue de luire dans des ténèbres qui ne peuvent l’éteindre (1.5), et elle est « la véritable lumière » qui vient dans le monde (1.9). Comme le note D. A. Carson, une première lecture y entend la lumière de la création, tandis que la suite de l’Évangile y ajoute la lumière de la révélation et celle qui met le mal à nu (3.19–21) — Jean pense aux deux. φῶς apparaît 23 fois chez Jean (73 dans le Nouveau Testament).',
      caution:
        '« Lumière » est une image, non un terme technique : chez Jean, elle passe de la création à la révélation et à la mise en lumière morale, et c’est le contexte qui décide laquelle domine dans chaque verset.',
      anchors: [
        { verse: jv(4), phrases: { LSG: 'la lumière des hommes', DARBY: 'la lumière des hommes', NCL: 'la lumière des hommes', OST: 'la lumière des hommes' } },
        { verse: jv(9), phrases: { LSG: 'la véritable lumière', DARBY: 'la vraie lumière', NCL: 'La lumière, la vraie', OST: 'La véritable lumière' } },
      ],
    },
    'john-1:kw:katalambano': {
      english: 'vaincre / comprendre',
      grammar: 'Verbe, aoriste second actif indicatif, troisième personne du singulier (κατέλαβεν) — 1.5',
      basicMeaning: 'saisir',
      semanticRange: [
        's’emparer de, saisir, prendre possession de (Ph 3.12)',
        'surprendre, atteindre — en parlant des ténèbres ou du jour (Jean 12.35 ; 1 Th 5.4)',
        'saisir par l’intelligence, comprendre (généralement à la voix moyenne : Ep 3.18 ; Ac 4.13)',
      ],
      notableNotes: [
        'Le seul autre emploi chez Jean (hors du passage à l’authenticité contestée, 8.3–4) : « afin que les ténèbres ne vous surprennent point » — là encore, les ténèbres sont un sujet hostile.',
        'À la voix moyenne : « comprendre […] quelle est la largeur, la longueur, la profondeur et la hauteur » — le sens intellectuel.',
        '« Je cours, pour tâcher de le saisir, puisque moi aussi j’ai été saisi par Jésus-Christ » — le sens de saisir.',
      ],
      significance:
        'Le verbe que la BSB rend par « has not overcome it » est notoirement à double tranchant. La KJV (« comprehended it not ») l’entend de la compréhension, comme Darby en français (« ne l’ont pas comprise ») ; la BSB et la WEB y voient une attaque hostile (overcome, « vaincre ») ; la LSG, la NCL et Ostervald le rendent par « recevoir » (LSG : « ne l’ont point reçue »). Le verbe de 1.5 est à l’actif (le sens intellectuel se trouve d’ordinaire au moyen), le lexique range ce verset sous « surprendre, atteindre », et le seul autre emploi de Jean (12.35, hors du passage à l’authenticité contestée, 8.3–4) montre les ténèbres poursuivant les hommes — ce qui s’accorde avec le « vaincre » de la BSB et de la WEB (la note de la WEB explique le verbe comme le fait d’avoir prise sur un ennemi pour le terrasser) et avec la conclusion des notes de Tyndale : chez Jean, le mot exprime l’hostilité. Quoi qu’il en soit, le verset annonce tout l’Évangile : la Lumière rencontre le rejet, mais les ténèbres n’ont pas le dernier mot. Le panneau des perspectives présente les deux lectures.',
      caution:
        'Le verbe apparaît 13 fois dans le texte de Nestle–Aland (15 si l’on compte le passage à l’authenticité contestée de Jean 8.3–4). Avec si peu d’emplois, et des sens qui se recoupent, aucune certitude n’est possible ici.',
      anchors: [{ verse: jv(5), phrases: { LSG: 'ne l’ont point reçue', DARBY: 'ne l’ont pas comprise', NCL: 'ne l’ont pas reçue', OST: "ne l'ont point reçue" } }],
    },
    'john-1:kw:skenoo': {
      english: 'habiter / dresser sa tente',
      grammar: 'Verbe, aoriste actif indicatif, troisième personne du singulier (ἐσκήνωσεν) — 1.14',
      basicMeaning: 'habiter',
      semanticRange: ['avoir sa tente (σκηνή), camper', 'habiter, s’établir (parfois pour une demeure temporaire)'],
      notableNotes: [
        '« Voici le tabernacle (σκηνή) de Dieu avec les hommes ! Il habitera (σκηνώσει) avec eux » — la promesse accomplie à la fin.',
        '« Celui qui est assis sur le trône dressera sa tente sur eux. »',
        'Non pas le verbe lui-même, mais le nom sur lequel il est formé : dans l’Ancien Testament grec, la gloire (δόξα) de l’Éternel remplit la σκηνή, le tabernacle — l’arrière-plan qu’évoque Jean.',
      ],
      significance:
        'σκηνόω est formé sur σκηνή, le mot de la Bible grecque pour le tabernacle, et dans l’Ancien Testament grec il rend le plus souvent l’hébreu shakan, « habiter ». « Elle a habité parmi nous » peut donc s’entendre : elle a dressé sa tente parmi nous. Jean ajoute aussitôt : « nous avons contemplé sa gloire » (δόξα — le mot par lequel la Bible grecque désignait la gloire qui remplissait le tabernacle). Le Dieu qui habitait jadis au milieu d’Israël sous une tente habite désormais parmi nous dans la chair de Jésus. Le verbe n’apparaît que cinq fois dans le Nouveau Testament : ici et quatre fois dans l’Apocalypse.',
      caution:
        'Le verbe n’implique pas que l’humanité de Jésus ait été provisoire ou fragile ; l’allusion porte sur la présence et la gloire de Dieu, comme dans le tabernacle — non sur la toile de la tente.',
      anchors: [
        { verse: jv(14), phrases: { LSG: 'elle a habité parmi nous', DARBY: 'habita au milieu de nous', NCL: 'il a habité parmi nous', OST: 'a habité parmi nous' } },
      ],
    },
    'john-1:kw:monogenes': {
      english: 'unique / unique engendré',
      grammar: 'Adjectif, génitif singulier masculin (μονογενοῦς) en 1.14 ; nominatif (μονογενής) en 1.18',
      basicMeaning: 'unique',
      semanticRange: [
        'seul, unique engendré — d’un fils ou d’une fille unique (Luc 7.12 ; 8.42 ; 9.38 ; le lexique de STEPBible range aussi ici Hé 11.17)',
        'unique, seul de son espèce (ainsi de nombreux lexiques modernes ; on discute pour savoir si Isaac, en Hé 11.17, relève de ce sens ou d’« unique engendré »)',
        'du Christ, le Fils unique (Jean 1.14, 18 ; 3.16, 18 ; 1 Jean 4.9)',
      ],
      notableNotes: [
        '« Il a donné son Fils unique » — le même mot dans le verset le plus connu de l’Évangile.',
        'Isaac est le μονογενής d’Abraham, alors qu’Abraham avait un autre fils — un texte clé du débat sur le sens du mot.',
        'Le « fils unique » de la veuve de Naïn — le sens familial ordinaire.',
        '« Dieu a envoyé son Fils unique dans le monde, afin que nous vivions par lui. »',
      ],
      significance:
        'En 1.14, la phrase sur la gloire dit littéralement « gloire comme d’un unique de la part d’un père » (δόξαν ὡς μονογενοῦς παρὰ πατρός ; la LSG, comme la BSB, ajoute « Fils ») : la gloire qui appartient au Fils unique venu du Père. En 1.18, les manuscrits les plus anciens lisent μονογενὴς θεός — « l’unique, [lui-même] Dieu » —, tandis que des manuscrits plus tardifs lisent « Fils », leçon que suivent la KJV (« the only begotten Son »), la WEB (« the only born Son ») et les quatre versions françaises proposées ici (« le Fils unique »). Les Bibles anglaises se partagent entre « only begotten », « unique engendré » (KJV, d’après le latin unigenitus), et « one and only », « unique » (BSB) ; le « only born » de la WEB se tient entre les deux. En français, « Fils unique » est la traduction courante. Le mot apparaît 9 fois dans le Nouveau Testament, dont 4 chez Jean.',
      caution:
        'Raisonner à partir des éléments du mot (μόνος + γένος) peut égarer dans les deux sens : γένος peut signifier « espèce » ou « descendance ». Ce sont l’usage et le contexte qui tranchent. Le panneau des perspectives expose les deux lectures ; aucun des deux camps ne doute que Jésus soit le Fils de manière unique, et pleinement Dieu.',
      anchors: [
        { verse: jv(14), phrases: { LSG: 'Fils unique', DARBY: 'fils unique', NCL: 'fils unique', OST: 'Fils unique' } },
        { verse: jv(18), phrases: { LSG: 'le Fils unique', DARBY: 'le Fils unique', NCL: 'le Fils unique', OST: 'le Fils unique' } },
      ],
    },
    'john-1:kw:charis': {
      english: 'grâce',
      grammar:
        'Nom, génitif singulier féminin (χάριτος) en 1.14 ; en 1.16, χάριν ἀντὶ χάριτος — χάριν (accusatif) est le complément de « nous avons reçu », et χάριτος (génitif) suit la préposition ἀντί',
      basicMeaning: 'grâce',
      semanticRange: [
        'grâce, charme (Luc 4.22 ; Col 4.6)',
        'faveur, bienveillance — surtout la faveur libre et imméritée de Dieu',
        'un don ou une marque de grâce (Jean 1.16)',
        'reconnaissance, action de grâce',
      ],
      notableNotes: [
        '« Car vous connaissez la grâce de notre Seigneur Jésus-Christ, qui pour vous s’est fait pauvre, de riche qu’il était » — la grâce vue dans l’incarnation.',
        '« Si c’est par grâce, ce n’est plus par les œuvres » — chez Paul, la faveur qui ne peut se mériter.',
        '« C’est par la grâce que vous êtes sauvés, par le moyen de la foi » — le mot au cœur de l’Évangile de Paul.',
      ],
      significance:
        'χάρις n’apparaît que quatre fois dans l’Évangile de Jean, toutes dans le prologue (1.14 ; deux fois en 1.16 ; 1.17) — John Piper remarque que l’Évangile parle ensuite sans cesse de vérité, mais plus jamais de grâce. « Pleine de grâce et de vérité » décrit la gloire vue en Jésus, et beaucoup d’interprètes entendent derrière l’expression la manière dont Dieu se décrit à Moïse : « riche en bonté et en fidélité » (Ex 34.6). En 1.16, « grâce pour grâce » (LSG ; « grâce sur grâce » chez Darby, dans la NCL et chez Ostervald ; littéralement « grâce au lieu de, ou pour, grâce », avec ἀντί) a été compris comme une grâce accumulée sur une autre, comme la grâce répandue sur le Christ qui se déverse ensuite sur les croyants, ou comme la grâce nouvelle en Christ qui succède à la grâce donnée par Moïse (1.17) ; Matthew Henry range ces trois lectures parmi six sens possibles.',
      caution:
        'Il ne faut pas importer en Jean 1 toutes les nuances pauliniennes de la « grâce ». L’accent porte ici sur la plénitude du don que Dieu fait de lui-même en Jésus, mise en regard du don de la loi par Moïse — il ne s’agit pas d’une polémique contre la loi.',
      anchors: [
        { verse: jv(14), phrases: { LSG: 'grâce et de vérité', DARBY: 'grâce et de vérité', NCL: 'grâce et de vérité', OST: 'grâce et de vérité' } },
        { verse: jv(16), phrases: { LSG: 'grâce pour grâce', DARBY: 'grâce sur grâce', NCL: 'grâce sur grâce', OST: 'grâce sur grâce' } },
        { verse: jv(17), phrases: { LSG: 'la grâce et la vérité', DARBY: 'la grâce et la vérité', NCL: 'la grâce et la vérité', OST: 'la grâce et la vérité' } },
      ],
    },
    'john-1:kw:exegeomai': {
      english: 'faire connaître / raconter',
      grammar: 'Verbe, aoriste moyen (déponent) indicatif, troisième personne du singulier (ἐξηγήσατο) — 1.18',
      basicMeaning: 'raconter',
      semanticRange: [
        'relater, raconter, faire le récit de (Luc 24.35 ; Ac 10.8 ; 15.12, 14 ; 21.19)',
        'faire connaître, révéler (Dieu, en Jean 1.18)',
        'littéralement « conduire, montrer le chemin » (premier sens du lexique, mais non l’usage du Nouveau Testament)',
      ],
      notableNotes: [
        'Les disciples d’Emmaüs « racontèrent ce qui leur était arrivé en chemin » — le sens ordinaire du récit.',
        'Barnabas et Paul « racontèrent tous les miracles et les prodiges que Dieu avait faits ».',
        'Paul « raconta en détail ce que Dieu avait fait ».',
      ],
      significance:
        'Dans ses cinq autres emplois du Nouveau Testament, ce verbe signifie relater ou raconter ce qui s’est passé. En 1.18, son objet est Dieu lui-même : le Fils, qui est dans le sein du Père, a raconté Dieu — il l’a exposé dans une vie humaine. (Le mot « exégèse » vient de la même famille grecque.) C’est le sommet du prologue : personne n’a jamais vu Dieu, mais en Jésus le Dieu invisible a été pleinement et fidèlement expliqué.',
      caution:
        'Le mot dérivé est un aide-mémoire, non une définition : Jean ne dit pas que Jésus est un interprète de la Bible, mais que toute sa personne et toute sa vie sont la révélation que Dieu donne de lui-même.',
      anchors: [
        { verse: jv(18), phrases: { LSG: 'l’a fait connaître', DARBY: 'l’a fait connaître', NCL: 'l’a fait connaître', OST: "l'a fait connaître" } },
      ],
    },
    'john-1:kw:amnos': {
      english: 'Agneau',
      grammar: 'Nom, nominatif singulier masculin (ὁ ἀμνός) — 1.29, suivi du participe présent ὁ αἴρων, « qui ôte »',
      basicMeaning: 'agneau',
      semanticRange: [
        'un agneau (en particulier un agneau offert en sacrifice)',
        'au figuré, du Christ (Jean 1.29, 36 ; Ac 8.32 ; 1 P 1.19)',
      ],
      notableNotes: [
        'L’Ancien Testament grec emploie ἀμνός pour l’agneau muet devant celui qui le tond, image du Serviteur — le même mot qu’en Jean 1.29. (Dans ce verset, l’animal conduit à la boucherie est un πρόβατον, une brebis.)',
        'Le haut fonctionnaire éthiopien lit Ésaïe 53.7, et Philippe lui annonce Jésus.',
        'Rachetés « par le sang précieux de Christ, comme d’un agneau sans défaut et sans tache ».',
        'L’offrande quotidienne de deux agneaux (ἀμνοί dans l’Ancien Testament grec), le matin et le soir.',
      ],
      significance:
        'ἀμνός n’apparaît que quatre fois dans le Nouveau Testament, et chaque fois il désigne Jésus. L’annonce du Baptiste condense toute une théologie en une phrase : cet Agneau est celui de Dieu — désigné et fourni par lui (comparer Gn 22.8) —, et il « ôte » (au présent : c’est ce qu’il fait) « le péché du monde », et non seulement celui d’Israël. Le mot grec renvoie le plus directement à Ésaïe 53.7 et aux agneaux offerts chaque jour au temple ; l’agneau pascal (appelé πρόβατον dans le grec d’Exode 12) intervient par le cadre pascal plus large de l’Évangile (19.14, 36).',
      caution:
        'Les spécialistes pèsent plusieurs arrière-plans pour « l’Agneau de Dieu » (la Pâque, le sacrifice quotidien, le Serviteur d’Ésaïe). Jean en vise peut-être plus d’un ; il est plus sage de les laisser s’éclairer mutuellement que d’imposer une source unique.',
      anchors: [
        { verse: jv(29), phrases: { LSG: 'l’Agneau de Dieu', DARBY: 'l’agneau de Dieu', NCL: 'l’agneau de Dieu', OST: "l'agneau de Dieu" } },
        { verse: jv(36), phrases: { LSG: 'l’Agneau de Dieu', DARBY: 'l’agneau de Dieu', NCL: 'l’Agneau de Dieu', OST: "l'agneau de Dieu" } },
      ],
    },
  },

  /* ------------------------------------------------------------------ */
  /* Références croisées                                                 */
  /* ------------------------------------------------------------------ */
  crossReferences: {
    'john-1:xr:gen-1': {
      title: 'Au commencement — une nouvelle Genèse',
      explanation:
        'Les premiers mots de Jean, Ἐν ἀρχῇ (« Au commencement »), sont les deux mots qui ouvrent la Genèse dans l’Ancien Testament grec, et l’écho se prolonge. Dans la Genèse, Dieu parle et la création advient ; chez Jean, « toutes choses ont été faites » par la Parole (1.3). La Genèse passe des ténèbres qui couvrent l’abîme au « Que la lumière soit ! » ; chez Jean, la Parole est la vie et « la lumière des hommes », et elle luit dans des ténèbres qui n’en ont pas eu raison (1.4–5). Jean ne remplace pas la Genèse, il la lit plus profondément : la parole par laquelle Dieu a créé était la Parole qui était avec Dieu — et qui vient maintenant apporter une création nouvelle, en donnant à ceux qui la reçoivent de naître « de Dieu » (1.12–13). Luther, qui rattache l’ouverture de Jean à Genèse 1, appelait les livres de Moïse la véritable mine d’or d’où le Nouveau Testament a tiré son enseignement sur la divinité du Christ.',
    },
    'john-1:xr:ps-33': {
      title: 'Les cieux ont été faits par la parole de l’Éternel',
      explanation:
        'Le Psaume 33 célèbre la création par la parole : « Les cieux ont été faits par la parole de l’Éternel […] Car il dit, et la chose arrive. » L’Ancien Testament grec (Ps 32.6) emploie ici λόγος. Jean reprend cette confession familière de la parole créatrice de Dieu et avance à son sujet une affirmation saisissante : la Parole par laquelle « toutes choses ont été faites » (1.3) n’est pas seulement quelque chose que Dieu dit, mais quelqu’un qui « était avec Dieu » et qui « était Dieu ». La tradition juive a elle aussi longuement médité ce verset : la Jewish Encyclopedia signale une sentence rabbinique selon laquelle Dieu a créé le monde par sa parole, en citant le Psaume 33.6.',
    },
    'john-1:xr:prov-8': {
      title: 'La Sagesse aux côtés du Créateur',
      explanation:
        'En Proverbes 8, la Sagesse parle comme présente avant la création : « Lorsqu’il disposa les cieux, j’étais là […] J’étais à l’œuvre auprès de lui » (8.27, 30). Des écrits juifs plus tardifs ont développé ce tableau (la Sagesse de Salomon 9.1–2 associe la parole et la sagesse de Dieu dans la création), et beaucoup d’interprètes l’entendent derrière la Parole de Jean, qui était « avec Dieu » et par qui toutes choses ont été faites. Le lien est thématique, ce n’est pas une équation, et il demande de la prudence. Les Proverbes sont une poésie qui personnifie un attribut de Dieu, et au IVe siècle les ariens tiraient de 8.22 (« L’Éternel m’a créée ») que le Fils est une créature. Athanase répondait que, rapporté au Christ, le verset parle de son humanité incarnée et non de son être divin — et Jean 1.1–3 affirme avec force que la Parole n’a pas été faite.',
    },
    'john-1:xr:exod-33-34': {
      title: '« Fais-moi voir ta gloire » — le Sinaï revisité',
      explanation:
        'Plusieurs fils de 1.14–18 remontent à Exode 33–34. Moïse demande : « Fais-moi voir ta gloire ! » ; l’Éternel répond que nul ne peut voir sa face et vivre, puis il passe devant lui en se proclamant « riche en bonté et en fidélité » (34.6) — en hébreu ḥesed et ʾemet. Jean répond : la Parole a habité parmi nous, « pleine de grâce et de vérité ; et nous avons contemplé sa gloire » ; « la loi a été donnée par Moïse, la grâce et la vérité sont venues par Jésus-Christ » ; et « Personne n’a jamais vu Dieu ; le Fils unique […] est celui qui l’a fait connaître ». D. A. Carson, entre autres, entend dans « la grâce et la vérité » la manière dont Jean rend ḥesed et ʾemet, et John Piper lit lui aussi 1.17–18 à la lumière de la demande de Moïse en Exode 33–34. (L’Ancien Testament grec rend 34.6 par πολυέλεος καὶ ἀληθινός, « très miséricordieux et véridique », sans χάρις, même si ἀληθινός appartient à la même famille de mots que l’ἀλήθεια de Jean ; le lien est donc surtout conceptuel.) Il ne s’agit pas de dire que le Sinaï manquait de grâce, mais que ce que Moïse a entrevu depuis le creux du rocher se voit maintenant sur le visage de Jésus.',
    },
    'john-1:xr:exod-40': {
      title: 'Le tabernacle rempli de gloire',
      explanation:
        'Jean dit que la Parole « a habité » parmi nous — σκηνόω, dresser une tente, de σκηνή, le mot de la Bible grecque pour le tabernacle. Au Sinaï, Dieu avait dit : « Ils me feront un sanctuaire, et j’habiterai au milieu d’eux » (Ex 25.8), et quand le tabernacle fut achevé, « la gloire de l’Éternel remplit le tabernacle » (40.34–35). Jean unit ces deux idées dans une seule phrase : la Parole « a habité parmi nous […] et nous avons contemplé sa gloire ». La présence de Dieu, autrefois liée à une tente puis à un temple, prend maintenant corps dans une personne ; au chapitre suivant, Jésus parle de son corps comme du temple (2.19–21). Spurgeon a développé la même image : la chair du Christ est le lieu où Dieu rencontre l’humanité.',
    },
    'john-1:xr:isa-40': {
      title: '« La voix de celui qui crie dans le désert »',
      explanation:
        'Quand on lui demande qui il est, Jean-Baptiste répond par Ésaïe 40.3 — l’ouverture du message de consolation d’Ésaïe, qui annonce la venue de l’Éternel lui-même vers son peuple : « Alors la gloire de l’Éternel sera révélée » (40.5). La formulation de Jean suit la tradition grecque, où c’est la voix qui est « dans le désert » (dans l’hébreu, que suivent la BSB et la LSG — « Préparez au désert le chemin de l’Éternel » —, c’est le chemin qui est préparé au désert), et elle dit « Aplanissez » là où la Septante dit « Préparez ». Dans les deux cas, le Baptiste se fait petit — il n’est qu’une voix — et grandit celui qui vient : le chemin que l’on prépare est celui de l’Éternel.',
    },
    'john-1:xr:deut-18': {
      title: '« Es-tu le prophète ? »',
      explanation:
        'La question de la délégation, « Es-tu le prophète ? », renvoie à la promesse de Moïse : Dieu susciterait « un prophète comme moi », qu’Israël devrait écouter (Dt 18.15, 18). Jean-Baptiste répond non. L’Évangile laisse la question en suspens et y répond par Jésus : des gens de la foule diront plus tard « Celui-ci est vraiment le prophète » (6.14 ; 7.40), et Philippe annonce qu’il a trouvé « celui de qui Moïse a écrit dans la loi » (1.45). En Actes 3.22, Pierre applique directement Deutéronome 18.15 à Jésus. Jésus est le prophète semblable à Moïse — et plus encore, car Moïse a reçu les paroles de Dieu, tandis que Jésus est la Parole de Dieu.',
    },
    'john-1:xr:mal-4': {
      title: 'Élie avant le jour de l’Éternel',
      explanation:
        '« Es-tu Élie ? » suppose la promesse de Malachie : « je vous enverrai Élie, le prophète, Avant que le jour de l’Éternel arrive, Ce jour grand et redoutable » (Ml 4.5), où Élie est le précurseur de la venue du Seigneur (comparer le messager qui « préparera le chemin », en 3.1). Jean nie être Élie — sans doute nie-t-il être l’ancien prophète revenu en personne, comme se le figuraient ses interlocuteurs. Par son rôle, pourtant, il est bien le précurseur décrit par Malachie, comme le relèvent les notes de Tyndale (comparer Mt 11.14 ; Luc 1.17).',
    },
    'john-1:xr:matt-11': {
      title: '« C’est lui qui est l’Élie qui devait venir »',
      explanation:
        'Ici, les Évangiles semblent d’abord se contredire. Jean dit de lui-même : « Je ne le suis point » (1.21), tandis que Jésus dit de Jean : « c’est lui qui est l’Élie qui devait venir » (Mt 11.14 ; comparer 17.10–13). La tension s’apaise quand chaque parole est entendue selon sa visée. Le Baptiste refuse l’identité que ses interlocuteurs avaient en tête ; Jésus, qui ajoute « si vous voulez le comprendre », parle du rôle que Jean a rempli — comme l’ange l’avait promis, il a marché devant Dieu « avec l’esprit et la puissance d’Élie » (Luc 1.17). L’Évangile de Jean détourne le projecteur du Baptiste ; la parole rapportée par Matthieu explique sa portée.',
    },
    'john-1:xr:isa-53': {
      title: 'L’agneau muet d’Ésaïe 53',
      explanation:
        '« Voici l’Agneau de Dieu, qui ôte le péché du monde. » Le mot grec pour « agneau », ἀμνός, est celui que la Septante emploie en Ésaïe 53.7 pour l’agneau muet devant celui qui le tond : le Serviteur qui « n’a point ouvert la bouche ». Dans le grec de ce verset, l’animal mené à la boucherie est un πρόβατον, une brebis — l’inverse des traductions faites sur l’hébreu, comme la BSB ou la LSG (« Semblable à un agneau qu’on mène à la boucherie, A une brebis muette devant ceux qui la tondent ») ; Actes 8.32 cite le texte grec. Le même Serviteur « a porté les péchés de beaucoup d’hommes » (53.12). L’Église primitive lisait ainsi Ésaïe 53 : quand le haut fonctionnaire éthiopien s’interroge sur 53.7, Philippe part de ce passage pour lui annoncer la bonne nouvelle de Jésus (Ac 8.32–35). Le titre donné par le Baptiste réunit cet arrière-plan du Serviteur et les agneaux des sacrifices d’Israël ; Ésaïe 53 apporte l’idée d’un innocent qui souffre pour les péchés des autres.',
    },
    'john-1:xr:exod-12': {
      title: 'L’agneau pascal',
      explanation:
        'Au sommet de l’Évangile de Jean, Jésus est condamné le jour de « la préparation de la Pâque » (19.14), et aucun de ses os n’est brisé — ce que Jean lit comme l’accomplissement de l’Écriture (19.36), en rappelant la règle de l’agneau pascal (Ex 12.46). Aussi, quand le Baptiste l’appelle « l’Agneau de Dieu », beaucoup de lecteurs entendent l’agneau dont le sang marqua les portes d’Israël la nuit de la délivrance (Ex 12.3–7) ; Paul lui aussi appelle le Christ « notre Pâque » (1 Co 5.7). Les interprètes pèsent ce lien à côté d’autres arrière-plans — le Serviteur d’Ésaïe et les agneaux offerts chaque jour au temple (Ex 29.38–39) —, et les notes de Tyndale comme Matthew Henry mentionnent le sacrifice quotidien aussi bien que la Pâque. La Septante d’Exode 12 appelle l’animal pascal πρόβατον et non ἀμνός : le lien est donc thématique plutôt que verbal.',
    },
    'john-1:xr:gen-28': {
      title: 'L’échelle de Jacob et le Fils de l’homme',
      explanation:
        'La promesse de Jésus — « vous verrez désormais le ciel ouvert et les anges de Dieu monter et descendre sur le Fils de l’homme » — fait écho au songe de Jacob à Béthel, où « les anges de Dieu montaient et descendaient par cette échelle » (l’Ancien Testament grec emploie la même paire de verbes, monter et descendre). La scène a été préparée : Jésus a dit de Nathanaël « Voici vraiment un Israélite, dans lequel il n’y a point de fraude » (1.47), à la différence de Jacob le rusé. Ce que Jacob appelait « la maison de Dieu, […] la porte des cieux » (28.17) est maintenant une personne : le Fils de l’homme est le lieu où le ciel et la terre se rejoignent. Tim Keller a prêché sur ce lien, en soutenant qu’en Jésus le ciel s’ouvre à ceux qui viennent humblement.',
    },
    'john-1:xr:col-1': {
      title: 'L’image du Dieu invisible, agent de la création',
      explanation:
        'Le grand hymne christologique de Paul dit, dans son propre vocabulaire, ce que dit le prologue de Jean. Le Fils est « l’image du Dieu invisible » (comparer Jean 1.18) ; « tout a été créé par lui et pour lui » (comparer 1.3) ; « il est avant toutes choses » (comparer 1.1–2, 15) ; et « Dieu a voulu que toute plénitude habitât en lui » (comparer 1.14, 16). Deux voix différentes du Nouveau Testament, un Évangile et une lettre, confessent le même Fils préexistant, créateur et révélateur.',
    },
    'john-1:xr:heb-1': {
      title: 'Dieu nous a parlé par le Fils',
      explanation:
        'L’épître aux Hébreux s’ouvre comme Jean, sur la parole de Dieu. Dieu a parlé « par les prophètes », de bien des manières, mais « dans ces derniers temps », il « nous a parlé par le Fils, […] par lequel il a aussi créé le monde ». Le Fils est « le reflet de sa gloire et l’empreinte de sa personne ». Jean appelle le Fils « la Parole » ; Hébreux fait de lui la parole définitive de Dieu. Tous deux tiennent ensemble la création (Jean 1.3 ; Hé 1.2) et la révélation (Jean 1.14, 18 ; Hé 1.3), et Hébreux y ajoute la purification des péchés que Jean 1.29 annonce dans l’Agneau. John Piper établit précisément ce lien pour expliquer pourquoi Jean appelle Jésus « la Parole ».',
    },
    'john-1:xr:phil-2': {
      title: 'L’abaissement du Fils',
      explanation:
        'Jean dit que la Parole, qui « était Dieu », « a été faite chair ». Paul dit que le Christ Jésus, « existant en forme de Dieu », « s’est dépouillé lui-même, en prenant une forme de serviteur, en devenant semblable aux hommes », et qu’il est descendu jusqu’à la mort de la croix. Les deux textes décrivent un même mouvement — de la gloire divine à une vie humaine véritable — et tous deux affirment que celui qui descend reste la même personne de bout en bout. Augustin a remarqué ce rapprochement. Dans les livres des platoniciens, il avait trouvé des idées semblables à Jean 1.1–5, et même que le Fils était dans la forme du Père et égal à Dieu (comparer Ph 2.6). Mais il n’y avait pas lu que le Verbe a été fait chair et a habité parmi nous, ni que le Fils s’est anéanti en prenant la forme de serviteur (Ph 2.7–11 ; Confessions 7.9).',
    },
    'john-1:xr:1jn-1': {
      title: '« Ce qui était dès le commencement »',
      explanation:
        'La première épître de Jean s’ouvre sur un prologue étroitement parallèle à Jean 1 : « dès le commencement », « la parole de vie », la vie « qui était auprès du Père et qui nous a été manifestée », et une forte insistance sur « ce que nous avons vu de nos yeux, ce que nous avons contemplé et que nos mains ont touché ». L’Évangile souligne que la Parole a été faite chair et que « nous avons contemplé sa gloire » (1.14) ; la lettre souligne la réalité physique de ce voir et de ce toucher. Lus ensemble, ces textes montrent le témoignage johannique tenant à la fois l’éternité de la Parole et l’humanité tangible de Jésus.',
    },
    'john-1:xr:rev-19': {
      title: 'Son nom est la Parole de Dieu',
      explanation:
        'Seuls les écrits johanniques donnent à Jésus le titre de « Parole » : le prologue (1.1, 14), 1 Jean 1.1 (« la parole de vie ») et Apocalypse 19.13, où le cavalier qui revient, « revêtu d’un vêtement teint de sang », est appelé « la Parole de Dieu ». Les cadres ne pourraient être plus différents — l’ouverture paisible d’un Évangile et une vision du jugement final —, et pourtant le titre affirme la même chose : la parole décisive de Dieu au monde est une personne, qui révèle, sauve et juge.',
    },
    'john-1:xr:matt-3': {
      title: 'L’Esprit descendant comme une colombe',
      explanation:
        'L’Évangile de Jean ne raconte pas le baptême de Jésus ; il rapporte le témoignage du Baptiste sur ce qu’il a vu : « J’ai vu l’Esprit descendre du ciel comme une colombe et s’arrêter sur lui […] il est le Fils de Dieu » (1.32–34). Matthieu et Marc racontent l’événement lui-même — les cieux ouverts, l’Esprit descendant comme une colombe, et la voix du Père : « Celui-ci est mon Fils bien-aimé » (Mt 3.16–17 ; comparer Marc 1.10–11 : « Tu es mon Fils bien-aimé »). Les récits convergent vers la même révélation du Père, de l’Esprit et du Fils. Jean ajoute que le signe a été donné pour que le Baptiste puisse reconnaître Jésus et rendre témoignage (1.33) et — comme le relèvent les notes de Tyndale — que l’Esprit demeurait sur lui.',
    },
  },

  /* ------------------------------------------------------------------ */
  /* Contexte                                                            */
  /* ------------------------------------------------------------------ */
  context: {
    'john-1:ctx:authorship': {
      title: 'Qui a écrit le quatrième Évangile — et quand ?',
      summary:
        'L’Évangile ne nomme pas son auteur. Il fonde son récit sur le témoignage d’un témoin oculaire anonyme, « celui que Jésus aimait » (13.23 ; 19.35 ; 21.24). La tradition de l’Église ancienne l’a identifié à l’apôtre Jean, fils de Zébédée ; Irénée de Lyon (fin du IIe siècle) écrit que Jean, le disciple qui avait reposé sur la poitrine du Seigneur, publia son Évangile alors qu’il séjournait à Éphèse, en Asie.',
      detail:
        'Les notes de Tyndale acceptent l’identification traditionnelle — Jean, l’un des Douze et, avec Pierre et Jacques, membre du cercle le plus proche de Jésus —, tandis que leur résumé présente l’auteur comme « probablement » le disciple bien-aimé, « traditionnellement identifié » à Jean, fils de Zébédée. Cette identification n’est pas faite dans l’Évangile lui-même, et elle est discutée depuis longtemps : Eusèbe notait déjà que Papias nommait à la fois l’apôtre Jean et un « Jean l’Ancien » (Histoire ecclésiastique 3.39.4–6), et la Catholic Encyclopedia (1910), tout en défendant la paternité apostolique, reconnaissait que depuis le XIXe siècle la plupart des critiques extérieurs à l’Église catholique l’avaient niée. Quant à la date, les notes de Tyndale indiquent que la plupart des spécialistes pensent que l’Évangile a été achevé vers 90 apr. J.-C. Cette datation de la fin du Ier siècle est l’opinion commune, mais non la seule : J. A. T. Robinson a soutenu dans Redating the New Testament (1976) que tous les livres du Nouveau Testament, Jean compris, ont été écrits avant 70. La tradition éphésienne remonte à Irénée. Quand Jean 1.14 dit « nous avons contemplé sa gloire », c’est le plus naturellement la voix de ceux qui ont connu Jésus qui s’exprime.',
    },
    'john-1:ctx:audience': {
      title: 'Destinataires et but',
      summary:
        'Jean énonce son but vers la fin : « ces choses ont été écrites afin que vous croyiez que Jésus est le Christ, le Fils de Dieu, et qu’en croyant vous ayez la vie en son nom » (20.31). Le chapitre 1 sert ce but en accumulant les témoignages et les titres donnés à Jésus.',
      detail:
        'Selon les notes de Tyndale, les premiers lecteurs étaient probablement des chrétiens d’origine juive vivant autour d’Éphèse et dans le monde méditerranéen — familiers des fêtes et des idées juives, mais ayant besoin qu’on leur explique certains termes. Jean leur traduit « Rabbi » (« Maître », 1.38) et « Messie » (« Christ », 1.41). Ce public mêlé compte pour 1.1 : le mot Logos pouvait parler à la fois aux lecteurs nourris de l’Ancien Testament grec et à ceux qu’avait formés la pensée grecque.',
    },
    'john-1:ctx:occasion': {
      title: 'Contre un Christ divisé : Irénée sur les raisons de l’Évangile',
      summary:
        'Irénée pensait que Jean avait écrit en partie pour réfuter Cérinthe et des maîtres apparentés, qui séparaient le Créateur du monde du Père de Jésus et enseignaient qu’un Christ céleste était descendu sur l’homme Jésus avant de le quitter.',
      detail:
        'Dans ces systèmes, Monogenès (« Fils unique ») et Logos (« Parole ») étaient même des noms d’êtres célestes. Irénée lisait le prologue comme établissant qu’il y a un seul Dieu, qui a tout fait par sa Parole, et que la Parole par laquelle Dieu a créé est celle-là même par laquelle il sauve. Luther reprend la tradition selon laquelle Jean a écrit contre Cérinthe. Que Cérinthe ait été ou non la cible directe de Jean, l’insistance du prologue — la Parole est Dieu, elle est le Créateur, et elle a véritablement été faite chair — répond directement à de telles idées.',
    },
    'john-1:ctx:greek-logos': {
      title: 'Le Logos dans la pensée grecque',
      summary:
        'Bien avant Jean, des philosophes grecs employaient logos pour désigner le principe rationnel qui ordonne le monde. Héraclite invitait ses auditeurs à écouter non pas lui, mais le Logos, commun à tous ; les stoïciens identifiaient Dieu à la raison éternelle (logos) qui pénètre le cosmos.',
      detail:
        'Des lecteurs grecs cultivés pouvaient entendre en Jean 1.1 l’écho d’une réalité qu’ils estimaient : la raison qui sous-tend le réel. Jean affirme que le monde a bien une telle source, mais il la rend personnelle (« avec Dieu »), divine (« était Dieu ») et — ce qui choque le plus — incarnée (« a été faite chair »). Augustin raconte qu’un platonicien disait que le début du prologue mériterait d’être écrit en lettres d’or et exposé dans toutes les églises, mais que les orgueilleux refusaient de se mettre à l’école d’un Dieu fait chair (La Cité de Dieu 10.29) ; dans sa propre lecture des livres platoniciens, il avait trouvé des idées proches de 1.1–5, mais non la Parole faite chair (Confessions 7.9). Tim Keller souligne lui aussi combien l’affirmation que la Parole a été faite chair sonnait de manière saisissante aux oreilles des Juifs comme des Grecs.',
    },
    'john-1:ctx:jewish-word': {
      title: 'Parole, Sagesse et Memra dans la tradition juive',
      summary:
        'Pour des auditeurs juifs, « la parole de l’Éternel » était celle qui avait fait les cieux (Ps 33.6), qui venait aux prophètes et accomplissait les desseins de Dieu. Les écrits de sagesse juifs montraient la Sagesse aux côtés de Dieu lors de la création (Pr 8), et racontaient même qu’elle avait reçu l’ordre d’habiter — littéralement, de dresser sa tente — en Jacob (Siracide 24.8).',
      detail:
        'Deux autres arrière-plans sont souvent proposés ; tous deux sont discutés. Philon d’Alexandrie, philosophe juif contemporain de Jésus, appelait le Logos le premier-né de Dieu et disait que l’image de Dieu est sa parole la plus ancienne (On the Confusion of Tongues 146–147) — mais le Logos de Philon ne devient jamais un être humain. Les Targoums araméens (paraphrases juives de l’Écriture) parlent souvent du Memra, « la Parole », de l’Éternel là où l’hébreu montre Dieu agissant directement. Matthew Henry notait que la paraphrase araméenne appelle souvent le Messie le Memra, et John Gill jugeait plus probable que Jean ait tiré l’expression des Targoums, qu’il croyait antérieurs à Jean, que de Platon. Daniel Boyarin (2001) a soutenu que la théologie du Logos du prologue a de profondes racines juives. La mesure dans laquelle ces idées ont façonné Jean, ou se sont influencées entre elles, reste débattue. La Jewish Encyclopedia (1904) jugeait difficile de dire jusqu’où le Memra rabbinique avait été influencé par le Logos grec, tout en estimant que le Logos de Philon avait préparé la voie aux idées chrétiennes sur l’Incarnation. Ce qui est clair, c’est que le langage de Jean devait sonner comme enraciné dans les Écritures d’Israël, et non comme étranger à elles.',
    },
    'john-1:ctx:tabernacle': {
      title: 'Tabernacle, temple et gloire',
      summary:
        'Dans l’histoire d’Israël, la présence de Dieu demeurait au milieu de son peuple dans le tabernacle, et sa gloire le remplissait (Ex 25.8 ; 40.34–35). La tradition juive ultérieure a appelé cette présence qui demeure la Shekhina, un terme apparenté au verbe hébreu shakan, « habiter ».',
      detail:
        'Le verbe de Jean, σκηνόω (« elle a habité », littéralement « elle a dressé sa tente »), est formé sur σκηνή, « tabernacle », et dans l’Ancien Testament grec il rend le plus souvent shakan. Le lexique grec relève que δόξα, « gloire », désignait l’éclat de la présence de Dieu dans la colonne de nuée et dans le lieu très saint — ce que l’hébreu plus tardif appelait la Shekhina. Ainsi « elle a habité parmi nous […] et nous avons contemplé sa gloire » (1.14) devait rappeler à des lecteurs juifs le tabernacle rempli de gloire : la présence de Dieu, autrefois liée à une tente puis à un temple, se trouve désormais en Jésus (comparer 2.19–21).',
    },
    'john-1:ctx:baptist': {
      title: 'Jean-Baptiste et son mouvement',
      summary:
        'Jean-Baptiste était connu bien au-delà des Évangiles. L’historien juif Josèphe le décrit comme un homme de bien qui exhortait les Juifs à pratiquer la justice les uns envers les autres et la piété envers Dieu, et à venir au baptême ; il ajoute qu’Hérode le tétrarque fit exécuter Jean parce qu’il redoutait son influence sur les foules.',
      detail:
        'Le mouvement de Jean semble lui avoir survécu : à Éphèse, des années plus tard, Paul rencontra des « disciples » qui ne connaissaient que le baptême de Jean (Ac 19.1–7). Les notes de Tyndale y voient des croyants à la compréhension incomplète de la foi ; Matthew Henry pensait qu’ils avaient été baptisés au nom de Jean par l’un de ses partisans, qui le maintenait à la tête d’un parti. Le souvenir de tels groupes aide peut-être à comprendre pourquoi le prologue précise avec tant de soin que Jean « n’était pas la lumière », mais qu’il est venu lui rendre témoignage (1.8), et pourquoi le Baptiste déclare qu’il n’est pas le Christ (1.20) ; les notes de Tyndale relèvent que certains se demandaient si Jean était le Messie. Les ablutions rituelles de purification étaient familières dans le judaïsme ; le baptême de Jean appelait à la repentance en vue de celui qui vient (1.25–27).',
    },
    'john-1:ctx:expectations': {
      title: 'Messie, Élie et le prophète',
      summary:
        'Les questions posées à Jean — Es-tu le Christ ? Élie ? le prophète ? — dessinent les espérances du judaïsme du Ier siècle : un libérateur oint (Messie est l’équivalent hébreu du mot grec Christ), le retour d’Élie avant le jour de l’Éternel (Ml 4.5) et un prophète semblable à Moïse (Dt 18.15).',
      detail:
        'La délégation les considère comme trois figures distinctes, et Jean refuse chacun de ces rôles, détournant l’attention de lui-même. La suite du chapitre applique ces titres à Jésus en rafale : Messie (1.41), celui dont Moïse et les prophètes ont écrit (1.45), Fils de Dieu et roi d’Israël (1.49). Les notes de Tyndale ajoutent qu’on attendait du Messie qu’il apporte à Israël une direction spirituelle et une rédemption politique.',
    },
    'john-1:ctx:geography': {
      title: 'Béthanie au-delà du Jourdain — puis la Galilée',
      summary:
        'Jean baptisait à « Béthanie, au-delà du Jourdain » (1.28), de l’autre côté du fleuve par rapport à la Judée — et non à la Béthanie proche de Jérusalem où vivait Lazare (11.18). La KJV lit ici « Bethabara », suivant le texte grec sur lequel elle a été traduite (le Textus Receptus), et Ostervald fait de même (« Béthabara ») ; la BSB et la WEB, comme la LSG, Darby et la NCL, lisent « Béthanie », avec le texte critique de Nestle–Aland et le texte byzantin (majoritaire).',
      detail:
        'La seconde moitié du chapitre remonte vers le nord, en Galilée. Philippe, André et Pierre venaient de Bethsaïda, un village de la rive nord de la mer de Galilée ; la question de Nathanaël, « Peut-il venir de Nazareth quelque chose de bon ? », reflète l’obscurité d’un petit village des collines. Les notes de Tyndale observent aussi que Philippe (un nom grec) et Nathanaël (un nom hébreu) témoignent du mélange des cultures en Galilée.',
    },
  },

  /* ------------------------------------------------------------------ */
  /* Contexte littéraire                                                 */
  /* ------------------------------------------------------------------ */
  literary: {
    placeInBook:
      'Jean 1 est la porte d’entrée de tout l’Évangile. Le prologue (1.1–18) énonce d’avance les thèmes que le récit va déployer — l’identité divine de la Parole, la vie et la lumière, le témoignage, le rejet et l’accueil, la gloire, la grâce et la vérité. Puis 1.19–51 ouvre le récit : le témoignage de Jean-Baptiste et le rassemblement des premiers disciples, qui mènent tout droit au premier signe, à Cana, où Jésus « manifesta sa gloire » (2.11). On appelle souvent les chapitres 1–12 le Livre des signes, et les chapitres 13–21 le Livre de la gloire.',
    argument:
      'Le prologue va de l’éternité à l’histoire. Il commence par l’existence de la Parole et sa relation à Dieu (1–2), puis son œuvre dans la création, comme vie et comme lumière (3–5), introduit Jean comme témoin (6–8), retrace la venue de la Lumière, son rejet et son accueil (9–13), atteint l’incarnation et la gloire contemplée (14), reprend le témoignage de Jean (15), et se clôt sur la plénitude reçue, le contraste avec Moïse et le Fils qui fait connaître Dieu (16–18). Le récit répond ensuite à la question « Qui es-tu ? » (19–28), désigne l’Agneau et le Fils sur qui repose l’Esprit (29–34), et montre le témoignage qui suscite des disciples venus voir par eux-mêmes (35–51), pour s’achever sur la promesse du ciel ouvert au-dessus du Fils de l’homme.',
    placeInCanon:
      'Jean 1 rassemble l’histoire de l’Ancien Testament en une seule personne. Il relit Genèse 1 (le commencement, la parole, la lumière), l’Exode (le tabernacle rempli de gloire, la demande de Moïse de voir Dieu, l’agneau pascal), Ésaïe (la voix dans le désert, le Serviteur semblable à un agneau) et Genèse 28 (l’échelle de Jacob). Il se tient aux côtés d’autres confessions néotestamentaires du Fils préexistant — Colossiens 1, Hébreux 1, Philippiens 2 — et regarde vers l’Apocalypse, où la Parole de Dieu revient et où Dieu habite enfin avec l’humanité (Ap 19.13 ; 21.3).',
    bookOutline: [
      'Prologue : la Parole faite chair',
      'Le témoignage de Jean et les premiers disciples',
      'Les premiers signes : de Cana à Cana',
      'Jésus aux fêtes',
      'Lazare ressuscité et le dernier appel public',
      'La chambre haute : adieux et prière',
      'Arrestation, procès et crucifixion',
      'Résurrection et envoi',
    ],
    passageOutline: [
      'La Parole, la création et la lumière',
      'Jean envoyé comme témoin',
      'La lumière vient : rejetée et reçue',
      'La Parole faite chair : gloire, grâce et vérité',
      'Le témoignage de Jean devant la délégation de Jérusalem',
      '« Voici l’Agneau de Dieu »',
      'Les premiers disciples : venez et voyez',
      'Philippe et Nathanaël : le ciel ouvert',
    ],
    features: {
      'john-1:lit:inclusio': {
        title: 'Encadrement : Dieu et la Parole (1.1 et 1.18)',
        description:
          'Le prologue s’ouvre et se ferme sur les deux mêmes notes. En 1.1, la Parole est « avec Dieu » et elle « était Dieu » ; en 1.18, le Fils unique est lui-même Dieu (selon les manuscrits les plus anciens) et il est « dans le sein du Père ». Entre ces deux bornes, la Parole entre dans le monde. L’effet est d’encadrer toute l’histoire de l’incarnation par l’intimité éternelle du Fils avec le Père — celle-là même qui le rend capable de faire connaître le Père.',
      },
      'john-1:lit:chiasm': {
        title: 'Un chiasme centré sur « enfants de Dieu » (une proposition)',
        description:
          'Certains interprètes voient dans le prologue un chiasme — des lignes disposées en miroir autour d’un centre. R. Alan Culpepper (« The Pivot of John’s Prologue », New Testament Studies 27, 1980) a proposé que ce centre soit 1.12b : il leur a donné le droit (LSG : « le pouvoir ») de devenir enfants de Dieu. Dans cette lecture, le but du prologue n’est pas seulement de dire qui est la Parole, mais ce qu’elle donne. Les paires ci-dessous résument la proposition avec les mots de cette étude ; les lecteurs divergent sur les détails, mais les correspondances (1.1–2 avec 1.18, 1.6–8 avec 1.15, et 1.9–10 avec 1.14) sont faciles à vérifier.',
        structure: [
          { text: 'La Parole avec Dieu' },
          { text: 'Toutes choses sont venues à l’existence par la Parole' },
          { text: 'Ce que nous avons reçu : la vie et la lumière' },
          { text: 'Jean envoyé pour rendre témoignage' },
          { text: 'La lumière qui vient dans le monde' },
          { text: 'Les siens ne l’ont pas reçue' },
          { text: 'Tous ceux qui l’ont reçue' },
          { text: 'Elle leur a donné le pouvoir de devenir enfants de Dieu' },
          { text: 'Ceux qui croient en son nom' },
          { text: 'Nés non de la volonté de l’homme, mais de Dieu' },
          { text: 'La Parole a été faite chair' },
          { text: 'Le témoignage de Jean' },
          { text: 'Ce que nous avons reçu : grâce pour grâce' },
          { text: 'La grâce et la vérité sont venues par Jésus-Christ' },
          { text: 'Le Fils, dans le sein du Père, le fait connaître' },
        ],
      },
      'john-1:lit:staircase': {
        title: 'Des lignes poétiques « en escalier » en 1.1–5',
        description:
          'Les premiers versets sont bâtis comme des marches : chaque proposition reprend un mot clé de la précédente — en grec λόγος … λόγος, θεόν … θεός, ζωή … ζωή, φῶς … φῶς, σκοτία … σκοτία. Le français en garde une part : « En elle était la vie, et la vie était la lumière des hommes. La lumière luit dans les ténèbres, et les ténèbres ne l’ont point reçue. » Ce rythme a conduit beaucoup de lecteurs à penser que 1.1–5 a pu être un hymne ou un poème ; les notes de Tyndale suggèrent qu’il a pu être chanté par les premiers chrétiens.',
      },
      'john-1:lit:witness': {
        title: 'Témoigner et voir',
        description:
          'Le témoignage est le moteur du chapitre. Le verbe μαρτυρέω (« rendre témoignage ») et le nom μαρτυρία (« témoignage ») y apparaissent sept fois (deux fois en 1.7 ; 1.8, 15, 19, 32, 34), et les verbes de la vue les accompagnent : « nous avons contemplé sa gloire » (1.14), « j’ai vu, et j’ai rendu témoignage » (1.34), « Venez […] et voyez » (1.39) et « Viens, et vois » (1.46), « tu verras de plus grandes choses » (1.50–51). L’Évangile de Jean présente la foi comme la réponse à un témoignage digne de confiance.',
      },
      'john-1:lit:days-and-titles': {
        title: 'Une suite de jours et une cascade de titres',
        description:
          'Le récit est rythmé par des indications de temps — « Le lendemain » (1.29, 35, 43), puis « Trois jours après » (2.1 ; littéralement « le troisième jour »). Certains interprètes y comptent une semaine qui culmine à Cana, peut-être en écho aux jours de la création ; le décompte est discuté, mais la succession est claire. En chemin, Jésus reçoit titre après titre : la Parole, la Lumière, le Fils unique, l’Agneau de Dieu, le Fils de Dieu, Rabbi, Messie, celui dont Moïse et les prophètes ont écrit, roi d’Israël — et enfin, dans sa propre bouche, le Fils de l’homme.',
      },
    },
  },

  /* ------------------------------------------------------------------ */
  /* Théologie                                                           */
  /* ------------------------------------------------------------------ */
  theology: {
    'john-1:th:eternal-word': {
      title: 'La Parole éternelle et divine',
      summary:
        'Jean 1.1–2 affirme trois choses de la Parole : elle « était » déjà au commencement (elle n’est pas venue à l’existence), elle était « avec Dieu » (distincte du Père), et elle « était Dieu » (elle partage la nature de Dieu). Le prologue s’achève de la même manière : le Fils unique — lui-même Dieu, selon les manuscrits les plus anciens — est « dans le sein du Père » (1.18).',
      detail:
        'Les verbes sont parlants. Tout, en 1.3, « a été fait » (ἐγένετο, est venu à l’existence) ; la Parole, elle, « était » (ἦν), tout simplement. Le contraste revient en 1.14, où la Parole qui a toujours été « a été faite » chair. Voilà pourquoi l’Église, face à Arius au IVe siècle, en a appelé à Jean 1 : comme le soutenait Augustin, celui par qui toutes choses ont été faites ne peut être lui-même l’une des choses faites — et Piper relève que les derniers mots de 1.3 rendent ce point indiscutable.',
    },
    'john-1:th:trinity': {
      title: '« Avec Dieu » et « était Dieu » : les racines de la foi trinitaire',
      summary:
        'Jean 1.1 tient ensemble deux affirmations sans dissoudre ni l’une ni l’autre : la Parole est distincte de Dieu (« avec Dieu »), et pourtant elle est Dieu. Plus loin dans le chapitre, Dieu, qui a envoyé le Baptiste (1.6, 33), lui donne un signe : l’Esprit descend et demeure sur Jésus, et le Baptiste atteste que celui-ci est le Fils de Dieu (1.32–34).',
      detail:
        'La doctrine de la Trinité — un seul Dieu, éternellement Père, Fils et Saint-Esprit — a été formulée au IVe siècle, en grande partie par la méditation de textes comme ceux-ci. Le symbole de 381 confesse le Fils comme Fils unique de Dieu, lumière de lumière, vrai Dieu de vrai Dieu, celui par qui tout a été fait — un langage imprégné de Jean 1. Jean n’emploie pas le vocabulaire technique ultérieur, mais il en fournit la matière première : une distinction réelle, sans division. Luther observait que l’évangéliste a agencé ses mots pour réfuter d’un même coup deux erreurs — celle qui confond le Père et le Fils en une seule personne, et celle qui nie que le Fils soit vraiment Dieu.',
    },
    'john-1:th:incarnation': {
      title: 'La Parole a été faite chair',
      summary:
        '« La parole a été faite chair » (1.14) : c’est le cœur de la foi chrétienne au sujet de Jésus. La Parole éternelle a assumé une vie humaine complète — la « chair » au sens biblique d’une humanité fragile et mortelle — sans cesser d’être la Parole.',
      detail:
        'Les premiers interprètes ont veillé sur les deux versants. Chrysostome insistait : « a été faite » ne signifie pas que la nature divine s’est changée en chair ; le Verbe a pris chair, sans que sa nature soit altérée. Calvin disait que le Fils de Dieu a commencé d’être homme tout en demeurant la Parole éternelle. Face aux maîtres qui affirmaient que Jésus n’avait d’humain que l’apparence, le mot « chair » est sans détour : il s’agit d’une humanité réelle, qu’on peut toucher (comparer 1 Jean 1.1). Les notes de Tyndale observent que l’idée stupéfiait aussi bien les Grecs, qui séparaient le divin du monde charnel, que les Juifs.',
    },
    'john-1:th:creation': {
      title: 'La création par la Parole',
      summary:
        '« Toutes choses ont été faites par elle » (1.3) : la Parole ne fait pas partie de la création, elle en est l’agent. Sur la ligne qui sépare Dieu de tout le reste, Jean place Jésus du côté du Créateur.',
      detail:
        'Cela a deux conséquences en Jean 1. D’abord, le monde appartient à la Parole — ce qui rend d’autant plus triste le fait qu’il ne l’ait pas reconnue (1.10–11). Ensuite, celui qui a tout fait peut faire des êtres nouveaux : ceux qui le reçoivent sont nés de Dieu (1.12–13). Irénée a vu le lien : la Parole par laquelle Dieu a fait la création est celle par laquelle il accorde le salut aux hommes de cette création. Colossiens 1.16 et Hébreux 1.2 font la même confession.',
    },
    'john-1:th:revelation': {
      title: 'Le Fils qui fait connaître Dieu',
      summary:
        '« Personne n’a jamais vu Dieu ; le Fils unique […] est celui qui l’a fait connaître » (1.18). Le verbe ἐξηγέομαι signifie raconter ou exposer en entier : Jésus est l’explication que Dieu donne de lui-même.',
      detail:
        'Le prologue conduit à cette affirmation par ses images : la Parole (l’expression de Dieu lui-même), la lumière qui luit dans les ténèbres, la gloire vue dans la chair, la grâce et la vérité pleinement venues. Moïse n’a pas été autorisé à voir la face de Dieu (Ex 33.20) ; le Fils, qui est dans le sein du Père, peut le faire connaître — c’est pourquoi Jésus dira plus tard : « Celui qui m’a vu a vu le Père » (14.9). Athanase formulait ainsi le but de l’incarnation : le Verbe s’est manifesté par un corps afin que nous recevions l’idée du Père invisible.',
    },
    'john-1:th:children-lamb': {
      title: 'Les enfants de Dieu et l’Agneau qui ôte le péché',
      summary:
        'Jean 1 décrit le salut sous deux angles. Ceux qui reçoivent la Parole et croient en son nom reçoivent le pouvoir de devenir enfants de Dieu — nés non d’une ascendance ou d’une décision humaines, mais de Dieu (1.12–13). Et Jésus est annoncé comme « l’Agneau de Dieu, qui ôte le péché du monde » (1.29).',
      detail:
        'Le premier aspect est la nouvelle naissance, œuvre de Dieu lui-même, que Jésus expliquera à Nicodème (3.3–6) ; R. Alan Culpepper a soutenu que 1.12 est le pivot de tout le prologue. Le second est le sacrifice : l’Agneau enlève le péché — non seulement celui d’Israël, mais celui du monde ; Calvin y voit la fonction principale du Christ. Chrysostome rattachait le premier thème à l’incarnation : le Fils de Dieu est devenu Fils de l’homme afin que les fils des hommes deviennent enfants de Dieu.',
    },
  },

  /* ------------------------------------------------------------------ */
  /* Perspectives                                                        */
  /* ------------------------------------------------------------------ */
  perspectives: {
    'john-1:ps:nicene': {
      question: 'La Parole est-elle pleinement Dieu — ou la première et la plus élevée des créatures de Dieu ?',
      intro:
        'Les chrétiens des traditions catholique, orthodoxe et protestantes s’accordent à lire en Jean 1.1 et 1.14 la confession de la pleine divinité et de la véritable humanité du Christ. La question a été âprement débattue au IVe siècle, quand Arius enseignait que le Fils avait eu un commencement. Le concile de Nicée (325), puis le symbole développé en 381, ont répondu que le Fils est engendré, non créé. La position arienne est présentée ici pour la compréhension historique ; ce n’est pas une option vivante au sein du christianisme historique.',
      commonGround:
        'Les deux camps admettaient que le Fils existait avant la création et que toutes choses ont été faites par lui. Le débat portait sur la question de savoir s’il se tient du côté du Créateur ou du côté de la création — et c’est en Jean 1.1–3 que l’Église a trouvé sa réponse.',
      perspectives: {
        'john-1:ps:nicene:nicene': {
          tradition: 'Christianisme nicéen (catholique, orthodoxe, protestant)',
          label: 'La Parole est pleinement Dieu, éternellement distincte du Père',
          summary:
            'En 1.1, la Parole « était » déjà avant que rien ne soit fait, elle est distinguée du Père (« avec Dieu ») et partage la nature divine (« était Dieu ») ; 1.3 la place du côté du Créateur ; 1.14 dit qu’elle est vraiment devenue humaine ; en 1.18, les manuscrits les plus anciens appellent le Fils lui-même Dieu. Le symbole le confesse Fils unique de Dieu, engendré du Père avant tous les siècles, vrai Dieu de vrai Dieu, engendré et non créé, celui par qui tout a été fait et qui, pour nous les hommes et pour notre salut, est descendu du ciel et s’est fait homme.',
        },
        'john-1:ps:nicene:arian': {
          tradition: 'Arianisme (IVe siècle ; rejeté à Nicée)',
          label: 'Le Fils est un être élevé qui a eu un commencement',
          summary:
            'Arius voulait préserver l’unicité de Dieu, seul inengendré et sans commencement. Il écrit lui-même que le Fils a un commencement, alors que Dieu est sans commencement — tout en pouvant encore appeler le Fils Dieu parfait, unique engendré et immuable. Les ariens rapportaient au Fils des textes comme Proverbes 8.22 (« L’Éternel m’a créée ») et en concluaient qu’il est une œuvre, une créature. Leurs adversaires répondaient à partir de Jean 1 lui-même : la Parole « était » déjà au commencement, et rien de ce qui a été fait n’a été fait sans elle — elle ne peut donc être elle-même une chose faite. Le concile de Nicée a anathématisé l’affirmation selon laquelle il fut un temps où le Fils n’existait pas.',
        },
      },
    },
    'john-1:ps:monogenes': {
      question: 'μονογενής signifie-t-il « unique engendré » ou « unique » ?',
      intro:
        'Les Bibles anglaises anciennes, à la suite de la Vulgate latine, disent « only begotten », unique engendré (KJV) ; beaucoup de modernes disent « one and only » ou « only », unique (BSB), et la WEB a « only born ». En français, les versions proposées ici disent « Fils unique ». Le débat se tient à l’intérieur de l’orthodoxie chrétienne : les deux camps affirment la pleine divinité du Fils. La question porte sur ce que ce mot précis apporte.',
      commonGround:
        'Les deux lectures affirment que Jésus est le Fils de manière unique, pleinement Dieu, et que les croyants ne deviennent enfants de Dieu que par lui (1.12). Ceux qui tiennent la génération éternelle du Fils la fondent sur bien d’autres textes que celui-ci ; la question est ici de savoir si μονογενής en est l’un des appuis.',
      perspectives: {
        'john-1:ps:monogenes:unique': {
          tradition: 'Consensus lexical du XXe siècle',
          label: '« Unique » — seul de son espèce',
          summary:
            'Dale Moody (1953) a soutenu que μονογενής vient de μόνος (« seul ») et de γένος (« espèce »), non du verbe « engendrer », et qu’il signifie donc « seul » ou « unique ». Il invoquait Hébreux 11.17, où Isaac est le μονογενής d’Abraham alors qu’Abraham avait un autre fils — Isaac était unique en tant que fils de la promesse —, et la Vieille Latine, qui avait unicus (« unique ») chez Jean avant que Jérôme n’y introduise unigenitus (« unique engendré »), tout en laissant unicus chez Luc. Comme le montre Denny Burk, de nombreux commentaires et lexiques ultérieurs l’ont suivi. Moody lui-même affirmait la divinité préexistante du Christ, et ceux qui adoptent cette lecture ne nient généralement pas la relation éternelle du Fils au Père ; simplement, ils ne la font pas reposer sur ce mot.',
        },
        'john-1:ps:monogenes:begotten': {
          tradition: 'Lecture traditionnelle (nicéenne), récemment remise à l’honneur',
          label: '« Unique engendré » — le Fils unique engendré du Père',
          summary:
            'Le symbole de Nicée appelle le Fils Fils unique de Dieu, engendré du Père avant tous les siècles, lisant μονογενής comme un mot qui dit l’origine, et des spécialistes récents ont remis cette lecture à l’honneur. Charles Lee Irons (2017), examinant les composés en -γενής dans la littérature grecque, soutient que la grande majorité concernent la naissance ou l’origine plutôt que l’« espèce », et qu’Isaac pouvait être appelé le μονογενής d’Abraham (Hé 11.17) parce qu’il était son unique héritier. Denny Burk ajoute qu’Hébreux 11.17 convient à « engendré de manière unique » — Isaac, héritier promis issu du corps même d’Abraham — et que Jean emploie μονογενής juste après avoir parlé de la naissance des croyants à partir de Dieu (1.13–14 ; 3.3–16), distinguant ainsi l’engendrement unique du Fils de leur nouvelle naissance. Dans cette perspective, les Pères de Nicée ont lu correctement le grec de Jean.',
        },
      },
    },
    'john-1:ps:katalambano': {
      question: 'En 1.5, les ténèbres n’ont-elles pas « vaincu » la Lumière — ou ne l’ont-elles pas « comprise » ?',
      intro:
        'Le verbe καταλαμβάνω peut signifier saisir ou surprendre, ou (généralement à la voix moyenne) saisir par l’intelligence. Les Bibles se partagent : la KJV dit que les ténèbres « comprehended it not », comme Darby (« ne l’ont pas comprise ») ; la BSB et la WEB disent « has not overcome it », ne l’ont pas vaincue ; la LSG, la NCL et Ostervald le rendent par « recevoir » (LSG : « ne l’ont point reçue »). C’est une vraie question exégétique, sur laquelle des lecteurs attentifs divergent.',
      commonGround:
        'Les deux lectures s’accordent pour dire que la Lumière n’est pas vaincue et que l’humanité, livrée à elle-même, lui résiste. La différence est d’accent — hostilité ou incompréhension —, et le verbe peut porter l’une comme l’autre, comme l’observent les notes de Tyndale.',
      perspectives: {
        'john-1:ps:katalambano:overcome': {
          tradition: 'Traductions modernes comme la BSB et la WEB ; les notes de Tyndale',
          label: 'Hostilité : les ténèbres n’ont pas vaincu la Lumière',
          summary:
            'Dans le seul autre emploi du verbe chez Jean (hors du passage à l’authenticité contestée, 8.3–4), les ténèbres sont de nouveau le sujet, et le sens est hostile : « afin que les ténèbres ne vous surprennent point » (12.35). Le verbe de 1.5 est à l’actif, et non au moyen, qui sert d’ordinaire pour la saisie intellectuelle, et le lexique de STEPBible range ce verset sous « surprendre, atteindre ». Les notes de Tyndale concluent que, chez Jean, le mot exprime l’hostilité : les ténèbres tenteraient de détruire la Lumière et échoueraient, et la Lumière apporterait le salut au monde. (On peut y voir une annonce de la croix et de la résurrection.)',
        },
        'john-1:ps:katalambano:comprehend': {
          tradition: 'Lectures de la Réforme et anciennes versions anglaises (Calvin ; la KJV) ; en français, Darby',
          label: 'Incompréhension : les ténèbres n’ont pas saisi la Lumière',
          summary:
            'Dans cette lecture, les ténèbres sont l’intelligence humaine déchue : la Lumière brille, mais les esprits aveuglés ne la saisissent pas. Calvin applique le verset aux restes de raison dans l’humanité déchue, qui d’eux-mêmes ne parviennent jamais jusqu’à Dieu — si bien qu’il n’y a pas d’espoir, à moins que Dieu n’accorde un secours nouveau. Cette lecture s’accorde avec les versets suivants, où le monde « ne l’a point connue » (1.10) et où les siens « ne l’ont point reçue » (1.11).',
        },
      },
    },
  },

  /* ------------------------------------------------------------------ */
  /* Commentaires                                                        */
  /* ------------------------------------------------------------------ */
  commentary: {
    'john-1:cm:augustine-tractate-1': {
      lead: 'Sur « Au commencement était la Parole », en réponse à ceux qui disaient que la Parole avait été créée',
      quoteTranslation:
        'Quelque arien incrédule s’avancera peut-être pour dire que le Verbe de Dieu a été fait. Comment se pourrait-il que le Verbe de Dieu ait été fait, alors que Dieu a tout fait par le Verbe ?',
    },
    'john-1:cm:augustine-confessions': {
      lead: 'Sur ce qu’il a trouvé — et n’a pas trouvé — dans les livres des platoniciens',
      quoteTranslation:
        'De même, j’y ai lu que Dieu le Verbe n’est pas né de la chair, ni du sang, ni de la volonté de l’homme, ni de la volonté de la chair, mais de Dieu. Mais que le Verbe a été fait chair et qu’il a habité parmi nous, je ne l’y ai pas lu.',
    },
    'john-1:cm:chrysostom-homily-11': {
      lead: 'Sur la raison pour laquelle le Verbe a été fait chair (1.12–14)',
      quoteTranslation:
        'Car celui qui était le propre Fils de Dieu est devenu Fils de l’homme, afin de faire des fils des hommes des enfants de Dieu.',
    },
    'john-1:cm:athanasius-incarnation': {
      lead: 'Sur ce que l’incarnation accomplit — l’énoncé classique à l’arrière-plan de l’enseignement oriental sur la théosis (la participation, par grâce, à la vie de Dieu)',
      quoteTranslation:
        'Car il s’est fait homme pour que nous soyons faits Dieu ; et il s’est manifesté par un corps pour que nous recevions l’idée du Père invisible…',
    },
    'john-1:cm:luther-postil': {
      lead: 'Sur la manière de lire « la vie » et « la lumière » (1.4) à partir du Christ plutôt que par la spéculation',
      quoteTranslation:
        'Ce sont là des pensées toutes humaines, platoniciennes et philosophiques, qui nous détournent du Christ pour nous ramener en nous-mêmes ; mais l’évangéliste veut nous faire sortir de nous-mêmes pour nous conduire dans le Christ.',
    },
    'john-1:cm:calvin-speech': {
      lead: 'Sur la raison pour laquelle Jean appelle le Fils « la Parole » (le traducteur anglais de Calvin rend Logos par Speech, « discours »)',
      quoteTranslation:
        'Quant au fait que l’évangéliste appelle le Fils de Dieu la Parole, la raison simple m’en paraît être, d’abord, qu’il est la Sagesse et la Volonté éternelles de Dieu ; ensuite, qu’il est l’image vivante de son dessein ; car, de même que la parole est dite, chez les hommes, l’image de la pensée, il n’est pas inapproprié d’appliquer cela à Dieu et de dire qu’il se révèle à nous par sa Parole.',
    },
    'john-1:cm:henry-fullness': {
      lead: 'Sur « nous avons tous reçu de sa plénitude » (1.16)',
      quoteTranslation:
        'Comme la citerne reçoit l’eau de la plénitude de la source, les branches la sève de la plénitude de la racine, et l’air la lumière de la plénitude du soleil, ainsi nous recevons la grâce de la plénitude du Christ.',
    },
    'john-1:cm:spurgeon-tabernacle': {
      lead: 'Sur « elle a habité » — le Christ, tabernacle de Dieu (1.14)',
      quoteTranslation:
        'Or la chair humaine du Christ était le tabernacle de Dieu, et c’est en Christ que Dieu rencontre l’homme, et en Christ que l’homme a affaire avec Dieu.',
    },
    'john-1:cm:lewis-begetting': {
      lead: 'Sur l’« engendré, non créé » du symbole — une formule qui s’appuie en partie sur le μονογενής (« unique engendré ») de Jean',
      text:
        'Lewis explique l’affirmation du symbole selon laquelle le Fils est engendré, non créé, et précise que cet engendrement a eu lieu avant le temps, et non à Bethléhem. Engendrer, dit-il, produit un être de même nature que celui qui engendre, alors que faire produit quelque chose d’une autre nature ; ainsi le Fils, engendré du Père, est Dieu comme le Père est Dieu, tandis que tout ce que Dieu fait est une créature. Il en vient ensuite à l’offre chrétienne : les êtres humains, qui sont faits, peuvent en venir à partager la vie engendrée du Fils et devenir ainsi fils de Dieu (comparer Jean 1.12).',
    },
    'john-1:cm:carson-talk': {
      lead: 'Sur Jean 1.1–18 comme accomplissement d’Exode 33–34',
      text:
        'Carson présente « la Parole » comme l’expression de Dieu lui-même — la parole par laquelle Dieu révèle, crée et transforme dans l’Ancien Testament — et soutient que Jean 1.14–18 reprend la scène où Moïse demande à voir la gloire de Dieu (Ex 33–34). Jésus a dressé sa tente parmi nous comme le lieu de rencontre entre Dieu et les pécheurs ; sa gloire se manifeste suprêmement à la croix ; et la grâce et la vérité font écho à la manière dont Dieu se décrit à Moïse. Il lit 1.16 comme une grâce qui en remplace une autre : la loi était un don de grâce, auquel succède maintenant la grâce plus grande de la nouvelle alliance en Jésus. Il conclut en pressant quiconque veut connaître le caractère de Dieu — sa sainteté, son pardon et sa gloire — de regarder à Jésus, jusqu’à la croix.',
    },
    'john-1:cm:keller-incarnation': {
      lead: 'Sur les raisons pour lesquelles l’incarnation de la Parole devrait nous transformer',
      text:
        'Keller relève que, pour les premiers auditeurs de Jean, Juifs comme Grecs, l’affirmation selon laquelle la Parole de Dieu était devenue un être humain de chair et de sang était saisissante — beaucoup de spécialistes, observe-t-il, y voient un tournant dans l’histoire des idées. Pourtant, Noël nous laisse souvent inchangés. Il tire de l’incarnation trois conséquences : parce que Dieu a partagé notre condition humaine, nous avons une consolation profonde dans la souffrance ; nous avons un puissant motif de servir les autres ; et nous avons une espérance lucide sur les fractures du monde, mais qui ne peut décevoir.',
    },
    'john-1:cm:piper-fullness': {
      lead: 'Sur la gloire, la grâce et Moïse en Jean 1.14–18',
      text:
        'Piper observe que Jean insiste sur la grâce dans le prologue et n’emploie plus jamais le mot dans l’Évangile, alors que « vérité » revient tout au long. Lisant 1.16 comme la raison de 1.14, il soutient que seul le don de la grâce permet à quiconque de voir la gloire du Christ. Il rapproche 1.17–18 de la demande de Moïse de voir la gloire de Dieu en Exode 33–34 : la loi était elle-même un don de grâce, et en Christ une grâce plus grande est venue. Le contraste n’oppose pas une mauvaise loi à un bon Évangile, mais celui qui a été le médiateur de la loi de Dieu à celui en qui la grâce de Dieu et sa révélation sont personnellement présentes.',
    },
  },

  /* ------------------------------------------------------------------ */
  /* Prédications                                                        */
  /* ------------------------------------------------------------------ */
  sermons: {
    'john-1:sermon:spurgeon-glory': {
      summary:
        'Spurgeon lit 1.14 comme « il a dressé sa tente parmi nous » : de même que le tabernacle, avec la gloire de la Shekhina, était le plus grand privilège d’Israël, l’humanité du Christ est le lieu où Dieu et l’humanité se rencontrent — mais, à la différence du tabernacle, il est plein de grâce et de vérité, la réalité plutôt que l’ombre. Il considère ensuite le peuple privilégié qui a contemplé sa gloire, et la nature de cette gloire.',
    },
    'john-1:sermon:spurgeon-lamb': {
      summary:
        'Spurgeon note que le Baptiste, qui aurait pu présenter Jésus comme un maître ou un modèle, a choisi de le proclamer d’abord comme le sacrifice pour le péché, et il soutient que cette doctrine est éminemment pratique : toute la vie du Baptiste existait pour désigner Jésus, comme devrait le faire celle des croyants.',
    },
    'john-1:sermon:piper-beginning': {
      summary:
        'Piper soutient que Jean appelle Jésus « la Parole » parce que la personne et l’œuvre de Jésus — sa venue, sa vie, sa mort et sa résurrection, et pas seulement son enseignement — sont le cœur de ce que Dieu révèle (en rapprochant Hébreux 1.1–2 et Apocalypse 19.13). Il tire ensuite de 1.1–3 quatre observations — le temps de l’existence de la Parole, son identité divine, sa relation avec Dieu et sa relation au monde — et montre comment les derniers mots de 1.3 excluent l’idée que le Fils aurait été créé.',
    },
    'john-1:sermon:keller-word-made-flesh': {
      summary:
        'Méditant 1.14, Keller présente Jésus comme la Parole de Dieu : Dieu se rend personnellement connaissable en Jésus, un peu comme les personnes se font connaître par ce qu’elles disent. Mais Jésus n’est pas venu seulement pour parler ; il est venu partager notre vie — si bien qu’aucune de nos souffrances ne lui est étrangère — et, par-dessus tout, mourir pour nous.',
    },
    'john-1:sermon:keller-heaven-open': {
      summary:
        'Keller rattache le sens de la venue du Christ au songe de Jacob à Béthel : en Jésus, l’accès à Dieu est ouvert, et ce sont les humbles, non ceux qui sont sûrs d’eux-mêmes, qui entrent.',
    },
  },

  /* ------------------------------------------------------------------ */
  /* Notes sur les versets                                               */
  /* ------------------------------------------------------------------ */
  verseNotes: {
    'JHN.1.1': [
      'L’ouverture de Jean fait écho à Genèse 1.1 — en grec, les deux premiers mots sont identiques. Suivent trois affirmations. La Parole existait déjà quand le commencement a commencé ; la Parole était « avec Dieu », en relation avec lui et distincte de lui ; et « la Parole était Dieu », partageant la nature même de Dieu. En grec, « Dieu » vient en tête de la dernière proposition et sans article, ce que des grammairiens comme Philip Harner comprennent comme une description de ce qu’est la Parole, plutôt que comme son identification au Père, que Jean vient d’appeler « Dieu ».',
    ],
    'JHN.1.3': [
      'Tout ce qui existe est venu à l’existence (ἐγένετο) par la Parole, et la seconde moitié du verset ferme toutes les échappatoires : rien de ce qui est venu à l’existence ne l’est venu sans elle. Cela place la Parole hors de la catégorie des choses faites — un argument qu’Augustin opposait aux ariens et que John Piper fait encore valoir aujourd’hui. Certains lecteurs anciens, dont Irénée et Augustin, découpaient la phrase autrement, en rattachant « ce qui a été fait » au verset 4 (ὃ γέγονεν ἐν αὐτῷ ζωὴ ἦν, « ce qui est venu à l’existence en lui était vie »). Le texte grec de Nestle–Aland (28e édition) ponctue lui aussi de cette manière. Luther et Calvin discutent tous deux ce choix et gardent ces mots au verset 3, comme la BSB, la KJV et la WEB — et comme les quatre versions françaises proposées ici.',
    ],
    'JHN.1.5': [
      '« La lumière luit » est au présent : elle continue de luire. La seconde proposition emploie un aoriste, κατέλαβεν, qui peut signifier que les ténèbres n’ont pas vaincu la Lumière ou qu’elles ne l’ont pas comprise (comparer la BSB et la KJV ; en français, Darby a « ne l’ont pas comprise », la LSG « ne l’ont point reçue ») ; le panneau des perspectives expose les deux lectures. Dans les deux cas, le verset annonce tout l’Évangile : le rejet, la croix, et une Lumière qui ne s’éteint pas.',
    ],
    'JHN.1.9': [
      'La « véritable lumière » est la lumière authentique, par opposition aux lumières partielles ou empruntées, comme Jean-Baptiste (1.8). Le participe grec « venant dans le monde » peut se rapporter à la lumière (BSB, WEB : la lumière « venait dans le monde ») ou à « tout homme » (KJV : « every man that cometh into the world ») ; sa forme convient aux deux. Les quatre versions françaises proposées ici le rapportent à la lumière (LSG : « qui, en venant dans le monde, éclaire tout homme »). Luther insiste sur le fait que la lumière dont il s’agit ici est la lumière de la grâce en Christ, et non la simple raison naturelle.',
    ],
    'JHN.1.12': [
      'Recevoir Jésus est défini comme croire « en son nom » — se fier à ce qu’il est. À ceux-là, il donne le droit (ἐξουσία, l’autorité ; LSG : « le pouvoir ») de devenir enfants de Dieu (τέκνα θεοῦ). Ce statut est un don, non un droit de naissance ; c’est pourquoi le verset 13 exclut aussitôt, comme sa source, le sang, le désir humain et la volonté d’un mari. R. Alan Culpepper a soutenu que ce verset est le pivot sur lequel tourne tout le prologue.',
    ],
    'JHN.1.14': [
      'Le verset repose sur trois verbes. La Parole « a été faite » (ἐγένετο) chair — elle est entrée dans une humanité fragile et mortelle, et n’a pas seulement paru humaine. Elle « a habité » (ἐσκήνωσεν, « a dressé sa tente ») parmi nous — le langage du tabernacle où demeurait la gloire de Dieu. Et « nous avons contemplé » (ἐθεασάμεθα) sa gloire — le témoignage de ceux qui l’ont connu. Cette gloire est « une gloire comme la gloire du Fils unique venu du Père », et elle a pour caractère d’être « pleine de grâce et de vérité », ce qui rappelle l’amour et la fidélité de l’alliance que Dieu a proclamés à Moïse (Ex 34.6).',
    ],
    'JHN.1.16': [
      '« Et nous avons tous reçu de sa plénitude, et grâce pour grâce. » Le grec, χάριν ἀντὶ χάριτος, dit littéralement « grâce pour (ou à la place de) grâce », et il a été lu de trois manières principales : une grâce accumulée sur une autre, un don après l’autre (BSB, WEB ; en français, « grâce sur grâce » chez Darby, dans la NCL et chez Ostervald) ; la grâce répandue sur le Christ qui se déverse sur les croyants, comme par un canal (Calvin) ; ou une grâce nouvelle qui remplace une grâce antérieure — le don gracieux de la loi par Moïse, auquel succède la plénitude de la grâce en Christ, ce qui s’accorde avec le verset 17 (D. A. Carson ; John Piper). Matthew Henry, qui qualifie l’expression de singulière, range ces trois lectures parmi six sens possibles.',
    ],
    'JHN.1.17': [
      'Moïse et Jésus-Christ sont placés côte à côte : la loi « a été donnée » par Moïse ; la grâce et la vérité « sont venues » par Jésus-Christ. Ce n’est pas le contraste d’une mauvaise loi et d’un bon Évangile — la loi était elle-même un don de Dieu —, mais celui d’un don qui annonçait une réalité et de cette réalité elle-même. Et ici, pour la première fois dans l’Évangile, la Parole est nommée : Jésus-Christ.',
    ],
    'JHN.1.18': [
      '« Personne n’a jamais vu Dieu » rappelle la parole de l’Éternel à Moïse : « l’homme ne peut me voir et vivre » (Ex 33.20). Celui qui peut faire connaître Dieu, c’est le Fils unique, lui-même Dieu, « qui est dans le sein du Père ». Sur ce point, les manuscrits les plus anciens lisent μονογενὴς θεός (« l’unique, [lui-même] Dieu ») ; des manuscrits plus tardifs, suivis par la KJV (« the only begotten Son »), la WEB (« the only born Son ») et les quatre versions françaises proposées ici (LSG : « le Fils unique »), lisent « Fils » — et le Tyndale House Greek New Testament lit également « Fils ». « Dans le sein du Père » rend littéralement le grec κόλπος (la BSB traduit « at the Father’s side ») ; Jean n’emploie ce mot qu’une autre fois, quand le disciple bien-aimé est « couché sur le sein de Jésus » (13.23).',
    ],
    'JHN.1.21': [
      'La délégation propose à Jean les rôles les plus attendus avant la fin : Élie (Ml 4.5) et le prophète semblable à Moïse (Dt 18.15), après qu’il a déjà nié être le Christ. Il les refuse tous. Son refus d’être Élie semble heurter la parole de Jésus en Matthieu 11.14, mais Jean refuse l’identité que ses interlocuteurs avaient en tête, tandis que Jésus parle du rôle que Jean a rempli « avec l’esprit et la puissance d’Élie » (Luc 1.17).',
    ],
    'JHN.1.29': [
      '« Voici l’Agneau de Dieu, qui ôte le péché du monde. » Le participe αἴρων, « qui ôte », est au présent : c’est ce que fait l’Agneau. Derrière ce titre se trouvent le Serviteur semblable à un agneau d’Ésaïe 53.7 (la Septante emploie le même mot, ἀμνός), l’agneau pascal (Ex 12 ; Jean 19.36) et les agneaux offerts chaque jour au temple (Ex 29.38–39). « Du monde » dépasse Israël : l’Agneau porte remède au péché de toute l’humanité.',
    ],
    'JHN.1.34': [
      'Le témoignage du Baptiste atteint son sommet : « il est le Fils de Dieu ». Certains manuscrits lisent à la place « l’Élu de Dieu » — un écho d’Ésaïe 42.1, où Dieu met son Esprit sur son Serviteur élu. Le SBL Greek New Testament adopte cette leçon (et les notes de Tyndale la commentent), tandis que la plupart des éditions, la BSB, la KJV et la WEB — ainsi que les quatre versions françaises proposées ici — lisent « Fils ».',
    ],
    'JHN.1.51': [
      'Le chapitre s’achève sur la première des paroles de Jean introduites par un double « En vérité, en vérité » (ἀμὴν ἀμήν). Jésus promet à Nathanaël — et, par un « vous » pluriel, à tous les disciples — qu’ils verront le ciel ouvert et les anges de Dieu monter et descendre sur le Fils de l’homme. L’image est celle de l’échelle de Jacob à Béthel (Gn 28.12) : Jésus lui-même est le lien entre le ciel et la terre, la véritable « maison de Dieu ».',
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Concepts                                                            */
  /* ------------------------------------------------------------------ */
  concepts: {
    'john-1:concept:logos': {
      label: 'La Parole (Logos)',
      aliases: [
        'parole',
        'la parole',
        'le verbe',
        'le logos',
        'parole de dieu',
        'la parole de dieu',
        'parole de vie',
        'au commencement était la parole',
        'au commencement était le verbe',
        'mot grec derrière parole',
        'quel mot grec',
        'que signifie logos',
        'que veut dire logos',
        'qu’est-ce que le logos',
        'le memra',
        'philon',
        'héraclite',
        'stoïciens',
        'stoïcisme',
        'philosophie grecque',
        'premiers lecteurs',
        'public d’origine',
      ],
      answer:
        'Derrière « Parole » se trouve le grec λόγος (logos), le mot ordinaire pour une parole, un message ou un récit. Pour les lecteurs de l’Ancien Testament grec, il rappelait la parole créatrice et prophétique de Dieu (l’hébreu dāvār ; « Les cieux ont été faits par la parole de l’Éternel », Ps 33.6) ; les lecteurs grecs y entendaient le principe rationnel qui sous-tend le monde. Jean reprend les deux et va au-delà : cette Parole était avec Dieu, elle était Dieu, et elle a été faite chair — l’expression même de Dieu, en une personne (1.1, 14, 18).',
    },
    'john-1:concept:genesis': {
      label: 'Au commencement : Jean et la Genèse',
      aliases: [
        'genèse',
        'genèse 1',
        'au commencement',
        'commencement',
        'archè',
        'création',
        'créé',
        'nouvelle création',
        'toutes choses ont été faites',
        'tout a été fait par lui',
        'lien avec la genèse',
        'jean et la genèse',
      ],
      answer:
        'Jean s’ouvre sur les deux mêmes mots que la Genèse grecque, Ἐν ἀρχῇ, « Au commencement ». Il raconte ensuite à nouveau la création : toutes choses ont été faites par la Parole (1.3), la vie et la lumière luisent dans les ténèbres (1.4–5 ; comparer Gn 1.3). La différence tient au verbe : dans la Genèse, Dieu « créa » ; chez Jean, la Parole « était » déjà. Celui par qui le monde a été fait apporte maintenant une création nouvelle, en faisant des hommes des enfants de Dieu (1.12–13).',
    },
    'john-1:concept:deity': {
      label: '« La Parole était Dieu »',
      aliases: [
        'la parole était dieu',
        'le verbe était dieu',
        'divinité',
        'divinité du christ',
        'divinité de jésus',
        'jésus est-il dieu',
        'jésus est il dieu',
        'jésus était-il dieu',
        'un dieu',
        'théos',
        'avec dieu',
        'trinité',
        'arien',
        'arianisme',
        'nicée',
        'symbole de nicée',
        'credo de nicée',
        'nicéen',
        'christologie',
        'christologique',
        'qui est jésus',
        'identité de jésus',
        'préexistence',
        'préexistence du christ',
      ],
      answer:
        'Jean 1.1 dit à la fois que la Parole était « avec Dieu » — distincte du Père — et qu’elle « était Dieu ». En grec, θεός vient en tête et sans article, ce qui souligne ce qu’est la Parole : elle a la nature même de Dieu, sans être identique au Père. Le verset 3 la place du côté du Créateur, face à tout ce qui a été fait ; c’est pourquoi l’Église du IVe siècle, répondant à Arius, a confessé le Fils engendré, non créé.',
    },
    'john-1:concept:incarnation': {
      label: 'La Parole faite chair',
      aliases: [
        'faite chair',
        'fait chair',
        'a été faite chair',
        's’est faite chair',
        'la parole faite chair',
        'le verbe fait chair',
        'chair',
        'noël',
        'humain',
        'humanité de jésus',
        'verset 14',
        'expliquez le verset 14',
        'expliquer le verset 14',
      ],
      answer:
        '« La parole a été faite chair » (1.14) : la Parole éternelle est entrée dans une vie humaine complète — la « chair » au sens biblique d’une humanité fragile et mortelle — sans cesser d’être Dieu. Chrysostome soulignait que le Verbe ne s’est pas changé en chair, mais qu’il a pris chair ; Augustin remarquait que c’était précisément ce que les philosophes ne pouvaient pas dire. Jean ajoute que ceux qui l’ont connu ont « contemplé sa gloire ».',
    },
    'john-1:concept:tabernacle': {
      label: 'Demeure et gloire : le tabernacle',
      aliases: [
        'habité',
        'a habité',
        'habité parmi nous',
        'a habité parmi nous',
        'demeure',
        'dresser sa tente',
        'dressé sa tente',
        'tente',
        'gloire',
        'shekhina',
        'chekhina',
        'présence de dieu',
      ],
      answer:
        '« Elle a habité » traduit σκηνόω, « dresser une tente », de σκηνή, le mot grec pour le tabernacle. Jean rappelle la tente où Dieu demeurait au milieu d’Israël et où sa gloire remplissait le sanctuaire (Ex 25.8 ; 40.34–35) — aussi ajoute-t-il aussitôt : « nous avons contemplé sa gloire ». La présence de Dieu, autrefois liée au tabernacle et au temple, se trouve désormais en Jésus (comparer 2.19–21).',
    },
    'john-1:concept:monogenes': {
      label: 'Fils unique / unique engendré',
      aliases: [
        'fils unique',
        'le fils unique',
        'unique engendré',
        'l’unique engendré',
        'seul engendré',
        'monogenès',
        'engendré',
        'génération éternelle',
        'engendré non créé',
      ],
      answer:
        'Le mot grec est μονογενής (monogenēs), employé pour un enfant unique (Luc 7.12) et pour Isaac, fils unique d’Abraham (Hé 11.17). La KJV, suivant le latin, dit « only begotten » (unique engendré) ; la BSB dit « one and only » (unique) ; les versions françaises proposées ici disent « Fils unique ». Depuis Dale Moody (1953), beaucoup le comprennent comme « unique », tandis que des spécialistes récents comme Charles Lee Irons défendent « unique engendré ». Les deux camps affirment que Jésus est le Fils de manière unique et pleinement Dieu ; en 1.18, les manuscrits les plus anciens l’appellent même « l’unique, [lui-même] Dieu ».',
    },
    'john-1:concept:light': {
      label: 'Lumière et ténèbres',
      aliases: [
        'lumière',
        'ténèbres',
        'véritable lumière',
        'vraie lumière',
        'lumière des hommes',
        'vaincue',
        'vaincre',
        'comprise',
        'comprendre',
        'ne l’ont point reçue',
        'verset 5',
      ],
      answer:
        'Chez Jean, la Parole est vie et « la lumière des hommes » (1.4), en écho à la première parole créatrice de Dieu : « Que la lumière soit ! » La Lumière continue de luire dans des ténèbres qui ne l’ont pas vaincue (BSB : « overcome ») — ou ne l’ont pas « comprise » (KJV, Darby) ; la LSG dit qu’elles « ne l’ont point reçue ». Le verbe καταλαμβάνω peut avoir l’un ou l’autre sens. Le seul autre emploi de Jean (12.35, hors du passage à l’authenticité contestée, 8.3–4) est hostile, ce qui s’accorde avec le « vaincre » de la BSB et de la WEB ; le panneau des perspectives expose les deux lectures.',
    },
    'john-1:concept:grace-truth': {
      label: 'Grâce et vérité',
      aliases: [
        'grâce',
        'grâce et vérité',
        'la grâce et la vérité',
        'grâce pour grâce',
        'grâce sur grâce',
        'vérité',
        'plénitude',
        'sa plénitude',
        'loi',
        'moïse',
        'bonté',
        'fidélité',
        'verset 16',
        'verset 17',
      ],
      answer:
        'χάρις (grâce) n’apparaît que dans le prologue de l’Évangile de Jean (1.14, 16, 17). « Pleine de grâce et de vérité » rappelle la manière dont Dieu se décrit à Moïse : « riche en bonté et en fidélité » (Ex 34.6). En 1.16, « grâce pour grâce » (« grâce sur grâce » chez Darby, dans la NCL et chez Ostervald) a été compris comme une grâce accumulée sur une autre, comme la grâce qui nous vient de la grâce répandue sur le Christ (Calvin), ou comme la grâce du Christ qui succède à la grâce de la loi donnée par Moïse (Carson, Piper) — ce qui s’accorde avec 1.17. Matthew Henry range ces trois lectures parmi six sens possibles.',
    },
    'john-1:concept:revelation': {
      label: 'Le Fils fait connaître Dieu',
      aliases: [
        'fait connaître',
        'l’a fait connaître',
        'a fait connaître',
        'exégèse',
        'personne n’a jamais vu dieu',
        'voir dieu',
        'vu dieu',
        'sein du père',
        'dans le sein du père',
        'verset 18',
        'révélation',
      ],
      answer:
        '« Personne n’a jamais vu Dieu ; le Fils unique […] est celui qui l’a fait connaître » (1.18). Le verbe ἐξηγέομαι signifie ailleurs raconter ou relater ; ici, son objet est Dieu. Moïse ne pouvait pas voir la face de Dieu (Ex 33.20), mais le Fils qui est dans le sein du Père a raconté Dieu dans une vie humaine — si bien que Jésus pourra dire plus tard : « Celui qui m’a vu a vu le Père » (14.9).',
    },
    'john-1:concept:lamb': {
      label: 'L’Agneau de Dieu',
      aliases: [
        'agneau',
        'agneau de dieu',
        'l’agneau de dieu',
        'pâque',
        'agneau pascal',
        'qui ôte le péché',
        'ôte le péché',
        'péché du monde',
        'expiation',
        'verset 29',
      ],
      answer:
        '« Voici l’Agneau de Dieu, qui ôte le péché du monde » (1.29). Le mot ἀμνός rattache Jésus au Serviteur d’Ésaïe 53.7, muet comme un agneau, et aux agneaux offerts chaque jour au temple ; l’Évangile de Jean encadre aussi sa mort par la Pâque (19.14, 36). L’Agneau appartient à Dieu, et il ôte le péché non seulement d’Israël, mais du monde.',
    },
    'john-1:concept:baptist': {
      label: 'Jean-Baptiste et le témoignage',
      aliases: [
        'jean-baptiste',
        'jean baptiste',
        'le baptiste',
        'témoin',
        'témoignage',
        'rendre témoignage',
        'a rendu témoignage',
        'voix dans le désert',
        'la voix de celui qui crie',
        'élie',
        'le prophète',
        'es-tu élie',
        'baptiser',
        'baptême',
        'colombe',
        'venez et voyez',
        'viens et vois',
      ],
      answer:
        'Jean-Baptiste est présenté avant tout comme un témoin : il « n’était pas la lumière », mais il est venu lui rendre témoignage (1.8). Il refuse tous les titres qu’on lui propose — le Christ, Élie, le prophète —, ne se disant qu’une « voix » (És 40.3), et il désigne Jésus comme l’Agneau de Dieu et le Fils de Dieu sur qui repose l’Esprit (1.29–34). Josèphe confirme combien Jean était connu, et Actes 19 laisse penser que son mouvement lui a survécu.',
    },
    'john-1:concept:children': {
      label: 'Enfants de Dieu et nouvelle naissance',
      aliases: [
        'enfants de dieu',
        'enfant de dieu',
        'nés de dieu',
        'né de dieu',
        'nouvelle naissance',
        'né de nouveau',
        'naître de nouveau',
        'pouvoir de devenir',
        'droit de devenir',
        'ceux qui l’ont reçue',
        'croire en son nom',
        'croient en son nom',
        'verset 12',
        'verset 13',
      ],
      answer:
        'À tous ceux qui reçoivent la Parole — qui croient en son nom — il donne le pouvoir de devenir enfants de Dieu, nés non d’une ascendance ou d’une décision humaines, mais de Dieu (1.12–13). R. Alan Culpepper a soutenu que c’est le pivot du prologue. Chrysostome y voyait le but de l’incarnation : le Fils de Dieu est devenu Fils de l’homme pour faire des fils des hommes des enfants de Dieu.',
    },
  },
};

export default overlay;
