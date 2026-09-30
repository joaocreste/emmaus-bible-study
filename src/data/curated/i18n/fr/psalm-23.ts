/**
 * Français — traduction de l’étude « Psaume 23 » (src/data/curated/studies/psalm-23.ts).
 *
 * Les paroles bibliques citées entre guillemets reproduisent la Louis Segond 1910 (LSG), version
 * française par défaut (ou, lorsqu’elle est nommée, la version indiquée : Darby, NCL, Ostervald) ;
 * ailleurs, le texte biblique est paraphrasé sans guillemets. Les remarques de l’original sur les
 * versions anglaises (LORD en petites capitales, marges de la KJV, notes de la BSB) sont conservées
 * et complétées, quand c’est vérifiable, par le rendu des versions françaises. Les citations
 * vérifiées d’auteurs ne sont jamais réécrites : l’overlay n’ajoute qu’une traduction libre
 * (`quoteTranslation`), et la prose les rapporte au style indirect, sans guillemets.
 * Les ancres des mots clés ont été vérifiées sur le texte de LSG, Darby, NCL et Ostervald.
 */
import type { VerseRef } from '../../../../domain/models';
import type { StudyOverlay } from '../types';

const ps23 = (verse: number): VerseRef => ({ book: 'PSA', chapter: 23, verse });

const overlay: StudyOverlay = {
  studyId: 'psalm-23',
  locale: 'fr',
  title: 'Psaume 23',
  subtitle: 'L’Éternel est mon berger',
  summary:
    'Le Psaume 23 est un psaume de confiance dans lequel David confesse l’Éternel — le Dieu de l’alliance d’Israël — d’abord comme son berger, puis comme son hôte. Ses images viennent de la vie quotidienne d’un berger de Judée et de l’habitude, répandue dans le Proche-Orient ancien, d’appeler les rois des bergers : le pâturage et l’eau, la conduite sur des sentiers droits, la protection dans un ravin obscur, une table dressée devant les ennemis, l’huile sur la tête de l’invité et une coupe qui déborde. En son centre — exactement au milieu, selon un certain décompte des mots hébreux — se tient la confession « car tu es avec moi », et il s’achève sur le bonheur et l’amour fidèle (ḥesed) de l’Éternel, qui poursuivent le psalmiste jusqu’à la maison de l’Éternel. Les prophètes ont repris l’image du berger pour dire le soin que Dieu promettait à son peuple dispersé, et le Nouveau Testament présente Jésus comme le bon berger, le grand pasteur et le souverain pasteur.',
  opening:
    'Bienvenue dans le Psaume 23 — peut-être le chant le plus aimé de la Bible, et un texte qui récompense une lecture lente. Nous pouvons examiner les mots hébreux qui se trouvent derrière « berger », « je ne manquerai de rien » et « l’ombre de la mort », le monde ancien où l’on appelait les rois des bergers, et la façon dont cette image de Dieu conduit jusqu’à Jésus, le bon berger. Par où souhaitez-vous commencer ?',
  matchTopics: [
    'psaume 23',
    'ps 23',
    'psaume vingt-trois',
    'l’éternel est mon berger',
    'éternel est mon berger',
    'le seigneur est mon berger',
    'yahweh est mon pasteur',
    'le psaume du berger',
    'psaume du berger',
    'berger',
    'vallée de l’ombre de la mort',
    'verts pâturages',
    'eaux paisibles',
    'je ne manquerai de rien',
    'ma coupe déborde',
  ],
  suggestedQuestions: [
    'Quel mot hébreu se trouve derrière « berger » ?',
    'Que signifie en hébreu « la vallée de l’ombre de la mort » ?',
    'Comment les premiers auditeurs comprenaient-ils ce psaume ?',
    'Où ailleurs la Bible appelle-t-elle Dieu un berger ?',
    'Pouvez-vous m’expliquer le verset 5 plus en détail ?',
    'Existe-t-il différentes interprétations de ce passage ?',
    'Qu’a dit Spurgeon sur ce psaume ?',
    'Quel lien y a-t-il entre le Psaume 23 et Jean 10 ?',
  ],

  keyWords: {
    'psalm-23:kw:yhwh': {
      english: 'l’Éternel',
      basicMeaning: 'l’Éternel — le nom propre du seul vrai Dieu',
      semanticRange: [
        'le nom personnel du Dieu d’Israël, le nom de l’alliance, révélé à Moïse (Ex 3.14–15)',
        'lu à voix haute ’Adonaï (« Seigneur ») dans la tradition juive — d’où « LORD » en petites capitales dans les Bibles anglaises',
        'rendu « l’Éternel » par la LSG, Darby et Ostervald, « Jehovah » dans l’anglais ancien (ainsi les traducteurs anglais de Calvin), et « Yahweh » dans la recherche moderne, dans la World English Bible et dans la NCL',
      ],
      grammar: 'Nom propre — le nom personnel de Dieu',
      significance:
        'David ne commence pas par un mot général pour Dieu, mais par son nom d’alliance : le Dieu qui s’est lié à Israël lors de l’Exode est celui qu’il appelle « mon berger ». Dans le texte hébreu annoté de STEPBible, le nom n’apparaît que deux fois dans ce psaume — comme premier mot après le titre (mizmôr lədāwid, « Cantique de David » dans la LSG) et dans sa dernière ligne —, si bien que tout ce qui se trouve entre les deux est tenu dans le soin de l’Éternel. Les Bibles anglaises impriment LORD en petites capitales pour signaler ce nom, que les lecteurs juifs prononcent ’Adonaï (« Seigneur ») ; le lexique note que le nom était écrit avec les voyelles d’’Adonaï, d’où vient l’ancienne forme « Jéhovah ». Dans l’ensemble de la Bible hébraïque, le nom est annoté plus de 6 500 fois.',
      caution:
        'Le texte hébreu ne conserve que les consonnes YHWH, avec des voyelles d’emprunt ; « Yahweh » est la reconstruction savante habituelle d’une prononciation que le texte massorétique ne conserve pas.',
      notableNotes: [
        'Dieu révèle son nom à Moïse et le relie à « Je suis celui qui suis ».',
        '« Voilà quarante années que l’Éternel, ton Dieu, est avec toi: tu n’as manqué de rien » — le nom joint à la présence et à la provision.',
        'Le nom revient dans la dernière ligne du psaume — « la maison de l’Éternel » —, encadrant tout le psaume.',
      ],
      anchors: [
        { verse: ps23(1), phrases: { LSG: 'L’Éternel', DARBY: 'L’Éternel', NCL: 'Yahweh', OST: "L'Éternel" } },
        { verse: ps23(6), phrases: { LSG: 'l’Éternel', DARBY: 'l’Éternel', NCL: 'Yahweh', OST: "l'Éternel" } },
      ],
    },
    'psalm-23:kw:raah': {
      english: 'berger',
      basicMeaning: 'faire paître, garder, mener paître',
      semanticRange: [
        'faire paître et garder un troupeau',
        'au participe : berger, pâtre',
        'au figuré, d’un chef ou d’un maître qui prend soin d’un peuple',
        'en parlant d’animaux : paître, brouter',
      ],
      grammar:
        'Verbe, participe actif qal, masculin singulier construit, avec suffixe de 1re personne — rōʿî, « mon berger » (littéralement « celui qui me fait paître »)',
      significance:
        'L’hébreu emploie ici un participe : rōʿî, c’est « celui qui me fait paître », une activité continue plutôt qu’un titre figé. En Israël et chez ses voisins, c’était un langage royal — on appelait les rois les bergers de leur peuple —, si bien qu’appeler l’Éternel « mon berger », c’est le confesser à la fois roi et protecteur ; et David, roi lui-même, se range parmi les brebis. Les mots annotés de ce verbe apparaissent 169 fois dans la Bible hébraïque de STEPBible, de la bénédiction de Jacob (Gn 48.15) à la promesse d’Ézéchiel que Dieu lui-même fera paître son troupeau (Ez 34.15).',
      caution:
        'Le mot n’emporte pas à lui seul, dans chacun de ses emplois, la « tendresse » ou l’« autorité » ; ces harmoniques viennent de la manière dont le psaume et l’ensemble de l’Ancien Testament développent l’image.',
      notableNotes: [
        'Jacob bénit « le Dieu qui m’a conduit depuis que j’existe jusqu’à ce jour » — en hébreu, le même participe (le Dieu qui a été mon berger) : la première confession personnelle de Dieu comme berger dans la Bible.',
        '« Tu paîtras mon peuple d’Israël » — le verbe décrit la royauté de David.',
        '« C’est moi qui ferai paître mes brebis » — Dieu promet de faire paître son peuple en personne.',
        '« Comme un berger, il paîtra son troupeau » — le nom et le verbe réunis.',
      ],
      anchors: [{ verse: ps23(1), phrases: { LSG: 'berger', DARBY: 'berger', NCL: 'pasteur', OST: 'berger' } }],
    },
    'psalm-23:kw:chaser': {
      english: 'manquer',
      basicMeaning: 'manquer de',
      semanticRange: ['manquer de, être privé de, être dans le besoin', 'faire défaut, venir à manquer', 'diminuer, décroître'],
      grammar: 'Verbe, inaccompli qal (yiqtol), 1re personne commune du singulier — ʾeḥsār, « je manque / je manquerai »',
      significance:
        '« Je ne manquerai de rien » affirme une suffisance, non un luxe : le verbe signifie manquer de quelque chose, en être privé. C’est le verbe qui résume les années d’Israël au désert — « tu n’as manqué de rien » (Dt 2.7 ; voir aussi Né 9.21), et la LSG garde le même verbe dans les deux textes —, si bien que la ligne peut s’entendre comme l’application à une seule vie de l’expérience d’Israël au désert, rapprochement que font à la fois les notes Tyndale et Sinclair Ferguson : le Dieu qui a pourvu aux besoins d’Israël dans le désert est aussi le berger du psalmiste. Le verbe apparaît 23 fois dans la Bible hébraïque (annotation de STEPBible, décompte établi pour cette étude).',
      caution:
        'La ligne promet que la brebis ne manquera pas de ce dont le Berger sait qu’elle a besoin — le Psaume 34.10 dit que ceux qui cherchent l’Éternel « ne sont privés d’aucun bien » —, non que tout désir sera exaucé.',
      notableNotes: [
        '« Tu n’as manqué de rien » — Moïse, sur les quarante années d’Israël au désert.',
        '« Ils ne manquèrent de rien » — le même souvenir dans la grande prière de confession d’Israël.',
        'Le pays promis, « où tu ne manqueras de rien ».',
        '« Ceux qui cherchent l’Éternel ne sont privés d’aucun bien. »',
      ],
      anchors: [
        {
          verse: ps23(1),
          phrases: { LSG: 'je ne manquerai de rien', DARBY: 'je ne manquerai de rien', NCL: 'je ne manquerai de rien', OST: "je n'aurai point de disette" },
        },
      ],
    },
    'psalm-23:kw:nephesh': {
      english: 'âme',
      basicMeaning: 'âme, être, vie',
      semanticRange: [
        'la vie, l’être vivant',
        'la personne — « moi-même »',
        'l’appétit, le désir',
        'l’être intérieur, siège des émotions et de la volonté',
        'la gorge, le cou (dans quelques textes)',
      ],
      grammar: 'Nom, féminin singulier construit, avec suffixe de 1re personne — nafšî, « mon âme / ma vie / moi-même »',
      significance:
        'Nefesh recouvre tout l’être vivant — souffle, appétit, émotion, volonté et la vie elle-même —, ainsi que ce que le lexique décrit comme l’être intérieur de l’homme. En 23.3, l’image pastorale vise la personne entière : « Il restaure mon âme » signifie que le Berger ramène à la vie et à la force la brebis épuisée ou égarée, et pas seulement qu’il rafraîchit une faculté spirituelle. Le nom apparaît 754 fois dans l’annotation de STEPBible, avec des sens allant de « vie » et « personne » jusqu’à « appétit ».',
      caution:
        'Le mot « âme » peut suggérer une partie seulement intérieure et spirituelle de l’homme ; ici, le contexte désigne l’être entier. L’étude du mot ne tranche pas à elle seule les questions plus larges d’anthropologie biblique, sur lesquelles les chrétiens divergent.',
      notableNotes: [
        'L’homme « devint un être vivant » (nefesh) quand Dieu lui insuffla la vie.',
        'La loi de l’Éternel « restaure l’âme » — le même nom avec le même verbe (šûb), à une autre forme.',
        'Aimer l’Éternel « de toute ton âme » — l’être tout entier.',
      ],
      anchors: [{ verse: ps23(3), phrases: { LSG: 'âme', DARBY: 'âme', NCL: 'âme', OST: 'âme' } }],
    },
    'psalm-23:kw:shuv': {
      english: 'restaurer / ramener',
      basicMeaning: 'retourner, revenir ; (polel) ramener, restaurer, rafraîchir',
      semanticRange: ['se détourner, revenir', 'revenir à Dieu — se repentir', '(polel, hiphil) ramener, restaurer, rafraîchir', 'rendre, restituer'],
      grammar:
        'Verbe, inaccompli polel (annoté piel dans STEPBible ; le polel est la forme intensive des racines creuses comme šûb), 3e personne du masculin singulier — yəšôbēb, « il ramène, il restaure » (en 23.6, le texte massorétique porte wəšabtî, accompli qal avec waw, « et je reviendrai »)',
      significance:
        'Le mouvement de base du verbe est « revenir ». À cette forme, il signifie ramener quelqu’un — une brebis égarée reconduite, une vie défaillante ranimée —, d’où les hésitations des traductions entre « restaurer », « rafraîchir » et « ramener ». Franz Delitzsch, dans le commentaire de Keil et Delitzsch, y voit le retour d’une âme qui s’était pour ainsi dire envolée, de sorte qu’elle revient à elle-même. Le verbe pourrait aussi résonner à la fin du psaume : le texte hébreu, tel qu’il est vocalisé, lit « et je reviendrai » au verset 6, si bien qu’au Berger qui me ramène (v. 3) répond mon retour dans sa maison.',
      caution:
        'On discute pour savoir si 23.3 parle d’un relèvement moral (la repentance) ou de forces renouvelées ; l’image pastorale contient aisément les deux, mais ni l’un ni l’autre ne doit être tiré du seul mot.',
      notableNotes: [
        '« Elle restaure l’âme » — šûb (hiphil) avec nefesh, comme en 23.3.',
        '« Je les ramènerai dans leur pâturage » — Dieu ramenant son troupeau dispersé.',
        'Les voyelles massorétiques lisent « et je reviendrai » ; les versions anciennes lisent « j’habiterai » (voir la note textuelle).',
      ],
      anchors: [
        { verse: ps23(3), phrases: { LSG: 'restaure', DARBY: 'restaure', NCL: 'restaure', OST: 'restaure' } },
        { verse: ps23(6), phrases: { LSG: 'j’habiterai', DARBY: 'mon habitation', NCL: 'j’habiterai', OST: "j'habiterai" } },
      ],
    },
    'psalm-23:kw:tsalmavet': {
      english: 'ombre de la mort',
      basicMeaning: 'ombre de mort, ténèbres profondes',
      semanticRange: [
        'ténèbres profondes, obscurité épaisse',
        'ombre de mort — danger ou détresse extrêmes',
        'les ténèbres du séjour des morts (Jb 10.21–22 ; 38.17)',
        'les ténèbres menaçantes du désert (Jr 2.6)',
      ],
      grammar: 'Nom, masculin singulier absolu — dans l’expression bəgêʾ ṣalmāwet, « dans une vallée d’ombre de mort / de ténèbres profondes »',
      significance:
        'Un lecteur de l’hébreu pouvait entendre deux choses dans ce mot rare : « ombre » (ṣēl) + « mort » (māwet), et un mot désignant une obscurité épaisse. Les voyelles massorétiques et la Septante grecque (skia thanatou) soutiennent « ombre de la mort » ; beaucoup de spécialistes modernes le font dériver d’une racine signifiant « être sombre », d’où la note de la BSB anglaise, « the valley of deep darkness ». Il apparaît 18 fois, dont 10 dans le livre de Job, le plus souvent pour des ténèbres à leur degré le plus menaçant (Am 5.8 l’emploie simplement pour les ténèbres que Dieu change en aurore). Dans tous les cas, l’image est celle d’une gorge si obscure que la mort y semble proche — et c’est là que le psaume dit « tu es avec moi ».',
      caution:
        'Le verset parle de traverser le danger en compagnie de Dieu, et pas seulement de l’instant de la mort ; on a raison de le lire lors des funérailles, mais son premier sens est plus large.',
      notableNotes: [
        '« Les portes de l’ombre de la mort », en parallèle avec « les portes de la mort ».',
        'Le désert, « une terre où règnent la sécheresse et l’ombre de la mort » — le même mot pour la menace du désert.',
        '« Le pays de l’ombre de la mort », sur lequel resplendit une grande lumière (cité en Mt 4.16).',
      ],
      anchors: [
        { verse: ps23(4), phrases: { LSG: 'l’ombre de la mort', DARBY: 'l’ombre de la mort', NCL: 'ombre mortelle', OST: "l'ombre de la mort" } },
      ],
    },
    'psalm-23:kw:shevet': {
      english: 'houlette',
      basicMeaning: 'bâton, verge, sceptre ; tribu',
      semanticRange: [
        'bâton ou massue — un instrument de berger',
        'sceptre — l’insigne de l’autorité d’un souverain',
        'verge de correction',
        'tribu (le sens le plus fréquent du mot)',
      ],
      grammar: 'Nom, masculin singulier construit, avec suffixe de 2e personne — šibṭəkā, « ta houlette » (LSG ; littéralement « ton bâton »)',
      significance:
        'Le šēbeṭ du berger était une massue ou un bâton servant à repousser les prédateurs, à guider le troupeau et à le compter ; son partenaire dans ce verset, la mišʿenet (H4938B), est apparentée à un mot signifiant « appui » — quelque chose sur quoi s’appuyer. Les versions françaises se partagent les deux termes : la LSG dit « Ta houlette et ton bâton », Ostervald « ton bâton et ta houlette ». Le même mot šēbeṭ désigne aussi le sceptre d’un souverain, si bien que l’image unit discrètement protection et autorité royale. La consolation du verset 4 ne vient pas de l’absence de danger, mais de ce que l’arme et l’appui du Berger sont à portée de main.',
      notableNotes: [
        '« Pais ton peuple avec ta houlette » — le même mot, dans une prière adressée à Dieu comme berger.',
        'Les bêtes comptées quand elles passent « sous la houlette ».',
        '« Le sceptre ne s’éloignera point de Juda » — le sens royal.',
      ],
      anchors: [{ verse: ps23(4), phrases: { LSG: 'Ta houlette', DARBY: 'ta houlette', NCL: 'ta houlette', OST: 'ton bâton' } }],
    },
    'psalm-23:kw:dashan': {
      english: 'oindre',
      basicMeaning: 'prospérer, être gras ; (piel) engraisser, oindre',
      semanticRange: [
        'être gras, engraisser — image de prospérité',
        '(piel) engraisser, oindre',
        '(piel) trouver une offrande « grasse », c’est-à-dire agréée',
        '(piel) ôter les cendres grasses de l’autel',
      ],
      grammar: 'Verbe, accompli piel, 2e personne du masculin singulier — diššantā, « tu as oint / tu as engraissé »',
      significance:
        'Ce n’est pas māšaḥ, le verbe de l’onction des rois et des prêtres (la racine de « Messie », employée quand Samuel oignit David, 1 S 16.13), mais un verbe familier qui signifie « engraisser » — répandre généreusement une huile riche sur la tête d’un invité. La marge de la KJV anglaise le signale : « Heb. makest fat ». L’hôte du verset 5 ne se contente pas d’admettre David à sa table ; il l’honore avec l’abondance qu’un hôte généreux réservait à un invité bienvenu (voir Lc 7.46). Le verbe apparaît 11 fois.',
      notableNotes: [
        '« Qu’il agrée tes holocaustes » — littéralement : qu’il les trouve gras.',
        '« L’âme bienfaisante sera rassasiée » — être engraissé, image de l’épanouissement.',
        '« Une bonne nouvelle fortifie les membres » — littéralement, engraisse les os : la même forme piel que « tu oins » en 23.5.',
      ],
      anchors: [{ verse: ps23(5), phrases: { LSG: 'oins', DARBY: 'oint', NCL: 'répands l’huile', OST: 'oins' } }],
    },
    'psalm-23:kw:hesed': {
      english: 'grâce / amour fidèle',
      basicMeaning: 'bonté, bienveillance, fidélité',
      semanticRange: [
        'l’amour loyal au sein d’une relation ou d’une alliance',
        'la bonté manifestée au-delà de ce qui est dû',
        'la fidélité, l’amour constant — de l’engagement de Dieu dans l’alliance',
      ],
      grammar: 'Nom, masculin singulier absolu, précédé de « et » — wāḥesed',
      significance:
        'Ḥesed est l’amour loyal et engagé — la bonté de quelqu’un qui s’est lié à vous. L’interlinéaire de STEPBible le glose ici par « loyauté d’alliance », tandis que les traductions tâtonnent : « la grâce » (LSG, NCL), « la miséricorde » (Ostervald), « la gratuité » (Darby) ; ailleurs, on lit « bonté » ou « amour fidèle ». Associé au « bonheur », il fait du dernier verset une déclaration sur le caractère de l’Éternel : le Dieu à qui Israël chantait « Par ta miséricorde tu as conduit, tu as délivré ce peuple » jusqu’à la demeure de sa sainteté (Ex 15.13) fera de même pour une seule brebis. Il apparaît environ 245 fois dans le texte annoté.',
      caution: 'Aucun mot français ne rend à lui seul ḥesed ; il faut éviter de traiter une traduction (par exemple « grâce ») comme son sens fixe.',
      notableNotes: [
        '« Par ta miséricorde tu as conduit, tu as délivré ce peuple » — le ḥesed qui conduit jusqu’à la demeure de Dieu.',
        'L’Éternel, « riche en bonté et en fidélité ».',
        'Le refrain d’Israël : « Car sa miséricorde dure à toujours! »',
      ],
      anchors: [{ verse: ps23(6), phrases: { LSG: 'la grâce', DARBY: 'la gratuité', NCL: 'la grâce', OST: 'la miséricorde' } }],
    },
    'psalm-23:kw:radaph': {
      english: 'poursuivre / accompagner',
      basicMeaning: 'poursuivre',
      semanticRange: [
        'poursuivre, pourchasser — surtout des ennemis',
        'persécuter, harceler',
        'rechercher, s’attacher à obtenir (par exemple la justice)',
        'courir après',
      ],
      grammar: 'Verbe, inaccompli qal, 3e personne du masculin pluriel, avec suffixe de 1re personne — yirdəpûnî, « ils me poursuivront »',
      significance:
        '« M’accompagneront » (LSG) ou « me suivront » (Darby) sont des mots doux ; l’hébreu est plus fort. Rādap̄ est le verbe qui sert à traquer un ennemi ou à pourchasser un fugitif — celui qu’emploient les psaumes de David pour ceux qui le pourchassent. Ici, les poursuivants sont le bonheur et le ḥesed de Dieu. Franz Delitzsch, dans le commentaire de Keil et Delitzsch, met en relief ce renversement : les ennemis du psalmiste le poursuivent, mais désormais seuls le bonheur et la faveur le poursuivront, tous les jours de sa vie. Le verbe apparaît 143 fois dans le texte annoté.',
      notableNotes: [
        '« Les Égyptiens les poursuivirent » jusqu’à la mer.',
        '« Que l’ennemi me poursuive et m’atteigne » — dans les psaumes de David, le verbe décrit d’ordinaire des ennemis lancés à sa poursuite (Ps 7.1 ; 31.15 ; 143.3).',
        '« Tu suivras ponctuellement la justice » — le même verbe : poursuivre la justice.',
      ],
      anchors: [{ verse: ps23(6), phrases: { LSG: 'm’accompagneront', DARBY: 'me suivront', NCL: 'm’accompagneront', OST: "m'accompagneront" } }],
    },
  },

  crossReferences: {
    'psalm-23:xr:gen-48-15': {
      title: 'Le Dieu berger de Jacob',
      explanation:
        'Le premier personnage de l’Écriture à appeler Dieu son berger est Jacob, bénissant les fils de Joseph au terme d’une vie longue et tourmentée : « le Dieu qui m’a conduit depuis que j’existe jusqu’à ce jour » (LSG) — littéralement, le Dieu qui a été mon berger. L’hébreu emploie le même participe de rāʿâ qu’en Psaume 23.1. La confession de Jacob embrasse toute une vie de protection ; David fait la même confession personnelle, et Sinclair Ferguson suggère qu’il a appris de Jacob à la prononcer.',
    },
    'psalm-23:xr:exod-15-13': {
      title: 'Conduits par le ḥesed jusqu’à la demeure de Dieu',
      explanation:
        'Le cantique de Moïse après la mer Rouge partage avec le Psaume 23 un ensemble de mots peu commun : par son ḥesed (23.6), Dieu « conduit » le peuple qu’il a racheté (nāḥâ — le verbe de « Il me conduit » en 23.3) et le « dirige » (nāhal — celui de « Il me dirige » en 23.2) vers la « demeure » de sa sainteté (nāweh, mot qui désigne aussi un pâturage ou le gîte d’un troupeau). La LSG rend d’ailleurs ces deux verbes de la même manière dans les deux textes. Ces recoupements suggèrent que le psaume lit la vie d’une personne selon le modèle de l’Exode : délivrée, conduite, pourvue et amenée à la maison de Dieu.',
    },
    'psalm-23:xr:deut-2-7': {
      title: 'Quarante ans, et « tu n’as manqué de rien »',
      explanation:
        'Moïse résume les années au désert : « Voilà quarante années que l’Éternel, ton Dieu, est avec toi: tu n’as manqué de rien. » Le verbe est le même que dans « je ne manquerai de rien » (ḥāsēr), et le verset joint la présence de Dieu (« avec toi ») à sa provision — les deux thèmes de 23.1 et de 23.4. Néhémie 9.21 rappelle la même histoire avec le même verbe. Le psaume ne mentionne pas le désert, mais les notes Tyndale sur 23.1 et Sinclair Ferguson renvoient tous deux à ce verset : lue à ses côtés, la brebis unique du Psaume 23 jouit de ce qu’a connu tout le troupeau d’Israël dans le désert.',
    },
    'psalm-23:xr:ps-80-1': {
      title: 'Berger d’Israël',
      explanation:
        'Le Psaume 80 prie Dieu comme « berger d’Israël, toi qui conduis Joseph comme un troupeau », assis sur les chérubins. Il montre le versant communautaire et royal de l’image : l’Éternel fait paître tout son peuple en tant que roi. Le Psaume 23 transforme cette confession nationale en confession personnelle — « mon berger ».',
    },
    'psalm-23:xr:ps-27-4': {
      title: 'Habiter dans la maison de l’Éternel toute ma vie',
      explanation:
        'Le Psaume 27.4 est le parallèle le plus proche de 23.6 : « Je voudrais habiter toute ma vie dans la maison de l’Éternel ». L’hébreu y a la même expression, « tous les jours de ma vie », et emploie šibtî, « mon habitation », de yāšab — le verbe que les traductions anciennes lisent en 23.6. Il montre aussi ce que « la maison de l’Éternel » signifiait pour David : le lieu où contempler la magnificence de l’Éternel et le chercher dans son temple.',
    },
    'psalm-23:xr:ps-16-5': {
      title: 'L’Éternel, mon partage et mon calice',
      explanation:
        'Un autre psaume de David fait de la coupe l’image de la part qui revient à chacun : « L’Éternel est mon partage et mon calice; c’est toi qui m’assures mon lot ». Lue à côté de 23.5, la coupe qui déborde est plus qu’une boisson abondante : c’est une vie dont la part, donnée par Dieu, est plus que suffisante.',
    },
    'psalm-23:xr:isa-40-11': {
      title: 'Il conduira les brebis qui allaitent',
      explanation:
        'Le message de consolation d’Ésaïe aux exilés montre l’Éternel venant comme un berger : il prend les agneaux dans ses bras, et « il conduira les brebis qui allaitent ». L’hébreu emploie les deux mêmes mots que le Psaume 23 — rāʿâ, « faire paître », et nāhal, « conduire », verbe rare (10 occurrences) qui désigne une conduite attentive vers le repos et le rafraîchissement. Ce que David confessait pour lui-même, le prophète le promet à tout un peuple qui rentre chez lui.',
    },
    'psalm-23:xr:isa-43-2': {
      title: '« Je serai avec toi » à travers les eaux et le feu',
      explanation:
        'La promesse de Dieu à Israël — « Si tu traverses les eaux, je serai avec toi; … Si tu marches dans le feu, tu ne te brûleras pas » — suit la même logique que 23.4. Aucun des deux textes ne promet au peuple de Dieu qu’il évitera le danger ; tous deux promettent la présence de Dieu au cœur du danger. C’est pourquoi le psalmiste peut dire : « Je ne crains aucun mal, car tu es avec moi ».',
    },
    'psalm-23:xr:jer-23-1': {
      title: 'Les mauvais bergers et le germe juste',
      explanation:
        'Jérémie dénonce les rois de Juda comme des pasteurs « qui détruisent et dispersent le troupeau », puis promet que l’Éternel lui-même rassemblera son troupeau et le ramènera dans son pâturage, et qu’il suscitera à David « un germe juste ». C’est le Psaume 23 à l’envers : là où les bergers humains ont failli à nourrir, conduire et protéger, Dieu fera ce que le psaume confesse. Le nom du roi à venir, « L’Éternel notre justice » (ṣidqēnû, de la même racine que ṣedeq, « justice », en 23.3), peut s’entendre comme une réponse aux « sentiers de la justice » du psaume.',
    },
    'psalm-23:xr:ezek-34-11': {
      title: 'Dieu fera paître lui-même son troupeau',
      explanation:
        'Ézéchiel 34 se lit comme le Psaume 23 changé en promesse divine. Après avoir condamné les bergers égoïstes d’Israël, Dieu déclare : « j’aurai soin moi-même de mes brebis », « Je les ferai paître dans un bon pâturage … là elles reposeront », « C’est moi qui ferai paître mes brebis, c’est moi qui les ferai reposer » (le même verbe, à la même forme, que « Il me fait reposer », 23.2), et « Je chercherai celle qui était perdue, je ramènerai celle qui était égarée ». Puis il promet « un seul pasteur, … mon serviteur David » (34.23) — le chapitre que Jésus a en vue lorsqu’il se présente comme le bon berger, selon les notes Tyndale sur Jean 10.',
    },
    'psalm-23:xr:luke-7-44': {
      title: 'Oindre d’huile la tête d’un invité',
      explanation:
        'Comme Simon le pharisien avait négligé les marques habituelles de politesse, Jésus lui fit remarquer : « Tu n’as point versé d’huile sur ma tête ». Les notes Tyndale expliquent qu’oindre d’huile d’olive la tête d’un invité était une manière d’honorer un visiteur respecté. La scène montre la coutume qui se trouve derrière 23.5 : l’Éternel traite le psalmiste non comme un étranger toléré, mais comme un invité d’honneur.',
    },
    'psalm-23:xr:mark-6-34': {
      title: 'Des brebis sans berger, assises sur l’herbe verte',
      explanation:
        'Marc raconte que Jésus fut ému de compassion pour la foule « parce qu’ils étaient comme des brebis qui n’ont point de berger » (écho de Nb 27.17), qu’il les enseigna, les fit asseoir « sur l’herbe verte » et les nourrit : « Tous mangèrent et furent rassasiés ». Beaucoup de lecteurs entendent le Psaume 23 derrière la scène — le berger qui fait reposer son troupeau dans de verts pâturages et pourvoit à ses besoins, si bien qu’il ne manque de rien —, Jésus faisant ce que le psaume dit de l’Éternel. Kenneth Bailey consacre à ce passage un chapitre de son étude du thème du berger.',
    },
    'psalm-23:xr:luke-15-3': {
      title: 'Le berger qui ramène la brebis perdue',
      explanation:
        'Dans la parabole de Jésus, le berger laisse les quatre-vingt-dix-neuf, va après la brebis perdue « jusqu’à ce qu’il la retrouve », et « il la met avec joie sur ses épaules ». Le récit donne une forme narrative à « Il restaure mon âme » — le Berger ramène celle qui s’est égarée —, et Jésus l’applique à la joie de Dieu pour un seul pécheur qui se repent. Matthew Henry lit 23.3 exactement ainsi : le Berger me ramène quand je m’égare.',
    },
    'psalm-23:xr:john-10-11': {
      title: '« Je suis le bon berger »',
      explanation:
        'Jésus revendique pour lui-même le rôle que le Psaume 23 donne à l’Éternel et que, selon la promesse d’Ézéchiel 34, Dieu devait assumer en personne : « Je suis le bon berger. » Il connaît ses brebis et elles le connaissent ; à la différence du mercenaire, il « donne sa vie pour ses brebis », et il la reprend. Les chrétiens lisent donc le Psaume 23 comme accompli en Christ — non que David ait écrit directement au sujet de Jésus, mais parce que le Berger en qui il se confiait s’est approché en Jésus. Les notes Tyndale sur Jean 10 situent le Psaume 23 dans la tradition vétérotestamentaire de Dieu berger d’Israël, dont Jésus s’inspire, et disent qu’il porte sur les chefs d’Israël un regard éclairé par Ézéchiel 34. Franz Delitzsch, dans le commentaire de Keil et Delitzsch, fait le lien : le « mon berger » du psalmiste trouve sa réponse dans le « Je suis le bon berger ».',
    },
    'psalm-23:xr:heb-13-20': {
      title: 'Le grand pasteur, ramené d’entre les morts',
      explanation:
        'L’épître aux Hébreux bénit « le Dieu de paix, qui a ramené d’entre les morts le grand pasteur des brebis, … notre Seigneur Jésus ». L’expression grecque « le pasteur des brebis », avec Dieu qui le fait remonter, fait écho à l’Ancien Testament grec d’Ésaïe 63.11, où Dieu fait monter de la mer Moïse, le berger du troupeau. Le Berger qui conduit son troupeau à travers la vallée de l’ombre de la mort a lui-même traversé la mort et en est ressorti.',
    },
    'psalm-23:xr:1pet-2-25': {
      title: 'Retournés vers le pasteur de vos âmes',
      explanation:
        'Pierre, citant Ésaïe 53.6, dit aux croyants qu’ils étaient « comme des brebis errantes », mais qu’ils sont maintenant « retournés vers le pasteur et le gardien de vos âmes ». Son grec partage trois mots clés avec la Septante du Psaume 23 (Ps 22 dans sa numérotation) : le verbe du retour (epistrephō — « il a fait revenir mon âme », 22.3 LXX), « âme » (psychē) et « berger » (poimēn / poimainō). Ce que le psaume décrit du point de vue de la brebis — le Berger qui restaure l’âme —, Pierre le décrit comme la conversion au Christ.',
    },
    'psalm-23:xr:1pet-5-4': {
      title: 'Le souverain pasteur paraîtra',
      explanation:
        'Pierre exhorte les anciens de l’Église : « Paissez le troupeau de Dieu qui est sous votre garde », de bon gré et avec humilité, en modèles plutôt qu’en maîtres, car « le souverain pasteur » va paraître. L’image du Psaume 23 devient le modèle des responsables d’Église, bergers subordonnés qui rendent compte au Christ. F. B. Meyer répartit les trois titres néotestamentaires sur les Psaumes 22 à 24 : le bon berger qui est mort, le grand pasteur qui garde son troupeau, et le souverain pasteur qui revient.',
    },
    'psalm-23:xr:rev-7-17': {
      title: 'L’Agneau sera leur berger',
      explanation:
        'La note de la BSB anglaise sur le Psaume 23.1 renvoie à ce passage. Dans la vision de Jean, « l’agneau qui est au milieu du trône les paîtra et les conduira aux sources des eaux de la vie », et Dieu essuiera toute larme. Les verbes grecs pour « paître » (poimainō) et « conduire » (hodēgeō) sont ceux qu’emploie la Septante en Psaume 23.1 et 3, et la scène reprend aussi Ésaïe 49.10, où Dieu conduit son peuple — avec nāhal, le verbe de 23.2 — « vers des sources d’eaux » (les notes de la BSB sur Ap 7.17 renvoient à la fois au Psaume 23.1 et à Ésaïe 49.10). L’Apocalypse accomplit la promesse d’Ésaïe dans un langage qui fait écho au Psaume 23 : les pâturages et les eaux du psaume deviennent l’image de la demeure finale du peuple de Dieu.',
    },
  },

  context: {
    'psalm-23:ctx:shepherd-kings': {
      title: 'Les rois bergers dans le Proche-Orient ancien',
      summary:
        'Dans tout le Proche-Orient ancien, on appelait couramment les souverains les bergers de leur peuple. Dans l’épilogue de son code de lois, Hammurabi de Babylone (règne v. 1792–1750 av. J.-C.) se présente comme le berger porteur de salut, dont le bâton est droit. Quand David appelle l’Éternel « mon berger », il emploie un langage royal — et, roi lui-même, il se range parmi les brebis.',
      detail:
        'Les notes Tyndale observent que le roi terrestre était compris comme le représentant du berger divin qui l’avait établi sur son peuple, et que les bons rois, qui conduisaient leur peuple avec fermeté et sagesse, ressemblaient à des bergers. Les Écritures d’Israël appliquent l’image à David (« Tu paîtras mon peuple d’Israël », 2 S 5.2), au roi perse Cyrus (« Il est mon berger », Es 44.28) et, négativement, aux rois qui ont dispersé le troupeau (Jr 23.1–2 ; Ez 34.2–6). L’épilogue de Hammurabi rassemble même des images qui rappellent le psaume — un bâton droit, une ombre bienfaisante étendue sur sa ville, un peuple qu’on laisse reposer en paix —, mais le psaume confie le rôle du berger à Dieu plutôt qu’à un roi humain.',
    },
    'psalm-23:ctx:shepherding': {
      title: 'Le travail du berger dans l’Israël ancien',
      summary:
        'Garder les troupeaux était un travail rude et exposé. David était auprès des brebis de son père quand Samuel le fit chercher (1 S 16.11), et il raconta à Saül comment il avait arraché des agneaux à un lion et à un ours (1 S 17.34–35). Les bergers devaient protéger le troupeau des bêtes sauvages, endurer la chaleur, le froid, le vent et la pluie, connaître chacune de leurs brebis et les mener vers de bons pâturages et des eaux calmes.',
      detail:
        'La nuit, un berger du désert pouvait garder son troupeau dans une bergerie — un enclos de murets de pierre surmontés de branches épineuses. Le jour, il marchait en tête, et les brebis suivaient une voix qu’elles connaissaient (Jn 10.3–4) : un bon berger conduit plutôt qu’il ne pousse. Quand Jacob refuse de forcer la marche des bêtes qui allaitent et veut suivre « lentement, au pas du troupeau » (Gn 33.13–14), le texte emploie une forme de nāhal, le verbe rendu par « Il me dirige » en 23.2.',
    },
    'psalm-23:ctx:wilderness': {
      title: 'Pâturages, ravins et désert',
      summary:
        'Le paysage du psaume est celui que David connaissait : les quelques brebis de son père paissaient « dans le désert » (1 S 17.28), où les verts pâturages et les eaux calmes sont précieux. La « vallée » du verset 4 (gêʾ) est, selon les termes du lexique, une vallée encaissée ou une gorge étroite, et Jérémie emploie le mot ṣalmāwet pour la menace du désert — « une terre où règnent la sécheresse et l’ombre de la mort » (Jr 2.6).',
      detail:
        'Franz Delitzsch, dans le commentaire de Keil et Delitzsch, explique le mot traduit par « pâturages » (nāʾôt) comme un lieu de repos ou d’habitation, voire une oasis — un coin de verdure dans le désert. Le souvenir d’Israël au désert a aussi façonné la langue du psaume : là, l’Éternel a conduit son peuple « comme un troupeau » (Ps 78.52), et Israël n’y a « manqué de rien » (Dt 2.7).',
    },
    'psalm-23:ctx:rod-staff': {
      title: 'La houlette et le bâton',
      summary:
        'Le berger portait deux outils. Le šēbeṭ était un bâton ou une massue — un instrument de berger, dit le lexique —, qui servait à repousser les prédateurs, à guider le troupeau et à le compter ; la mišʿenet était un bâton sur lequel s’appuyer. Les notes Tyndale observent que le berger se servait de l’un et de l’autre pour écarter le danger. (La LSG rend le premier par « houlette » et le second par « bâton ».)',
      detail:
        'Le Lévitique mentionne les bêtes comptées quand elles passent « sous la houlette » (Lv 27.32), et David s’avança contre Goliath après avoir pris « en main son bâton » (1 S 17.40) — les notes Tyndale observent que Goliath ne pouvait voir que le bâton, et non la fronde cachée. Le même mot šēbeṭ désigne le sceptre d’un souverain (Gn 49.10), et Michée prie : « Pais ton peuple avec ta houlette » (Mi 7.14).',
    },
    'psalm-23:ctx:hospitality': {
      title: 'La table de l’hôte et l’invité oint',
      summary:
        'Le verset 5 puise dans les coutumes de l’hospitalité. L’hôte prépare un repas pour son invité sous les yeux d’ennemis qui peuvent regarder mais non l’inquiéter, et il l’honore en lui oignant la tête d’huile. Au temps de Jésus, oindre d’huile d’olive la tête d’un invité restait une manière d’honorer un visiteur respecté (Lc 7.44–46).',
      detail:
        'Les notes Tyndale ajoutent qu’oindre la tête témoignait à l’invité honneur, hospitalité et rafraîchissement (voir Ps 92.10 ; 133.2). Franz Delitzsch, dans le commentaire de Keil et Delitzsch, suggère un moment précis de la vie de David : lorsqu’il fuyait devant Absalom, des alliés apportèrent des lits, de la nourriture et de la boisson à sa troupe épuisée dans le désert (2 S 17.27–29). Le psaume lui-même, toutefois, ne mentionne aucune circonstance.',
    },
    'psalm-23:ctx:superscription': {
      title: '« Cantique de David »',
      summary:
        'Le titre hébreu, mizmôr lədāwid, se traduit d’ordinaire « Psaume de David » (ainsi Darby, la NCL et Ostervald ; la LSG a « Cantique de David »). La préposition lə- peut signifier « de », « pour », « dédié à » ou « au sujet de », si bien que le titre peut désigner David comme auteur ou simplement rattacher le psaume à lui ; l’introduction Tyndale invite à la prudence avant de lire chacun de ces titres comme une indication d’auteur, tout en admettant que beaucoup de ces psaumes ont pu être écrits par David.',
      detail:
        'Dans les Bibles hébraïques, le titre compte comme une partie du verset 1, ce qui explique que la numérotation des versets diffère souvent d’une Bible à l’autre. Les interprètes qui admettent que David en est l’auteur divergent sur le moment où il l’a écrit : Calvin y lit les paroles de David au sommet de sa prospérité royale, Spurgeon et Maclaren imaginent le roi se retournant sur ses années de berger, et Franz Delitzsch (dans le commentaire de Keil et Delitzsch) le rattache à la fuite de David devant Absalom (2 S 17.27–29). Le texte lui-même n’indique aucune circonstance.',
    },
    'psalm-23:ctx:genre': {
      title: 'Un psaume de confiance',
      summary:
        'Le Psaume 23 appartient aux psaumes de confiance : il ne contient ni plainte ni requête, seulement des affirmations confiantes au sujet de Dieu et adressées à Dieu. Les notes Tyndale y voient un psaume de confiance et d’assurance dans le Seigneur et le placent dans un groupe (Ps 23–28) qui développe le soin pastoral de Dieu, sa conduite, sa bonté et le désir d’habiter dans sa maison.',
      detail:
        'Il se trouve dans le premier livre du Psautier (Ps 1–41), où domine le nom divin YHWH. Matthew Henry l’oppose aux nombreux psaumes de David remplis de plaintes : celui-ci, dit-il, est rempli de consolations. Sa poésie repose surtout sur des vers parallèles et sur des images plutôt que sur la rime (l’existence d’un mètre régulier dans la poésie hébraïque est débattue).',
    },
    'psalm-23:ctx:christian-worship': {
      title: 'Le Psaume 23 dans le culte chrétien',
      summary:
        'Les chrétiens prient et chantent ce psaume depuis l’Église ancienne. À la fin du IVe siècle, les catéchèses mystagogiques attribuées à Cyrille de Jérusalem (certains spécialistes les attribuent à son successeur Jean) se servaient du verset 5 pour instruire les nouveaux baptisés sur la table du Seigneur et l’onction qu’ils avaient reçue, et Augustin voyait le baptême dans l’eau de rafraîchissement (aqua refectionis) de sa version latine. La version métrique écossaise « The Lord’s my shepherd » parut pour la première fois dans le Psautier métrique écossais de 1650, et Spurgeon remarquait que le verset 4 avait été chanté au chevet d’innombrables mourants.',
      detail:
        'Spurgeon ouvrit son sermon de 1880 sur le verset 4 en citant la version métrique écossaise. Le cantique de Henry W. Baker, « The King of love my Shepherd is », paraphrase le psaume en se référant explicitement au Christ et à sa croix ; F. B. Meyer le fit imprimer en tête de The Shepherd Psalm.',
    },
    'psalm-23:ctx:jewish-tradition': {
      title: 'Le Psaume 23 dans la lecture et la prière juives',
      summary:
        'Dans la pratique juive, le psaume (Mizmor leDavid) est prié surtout le jour du sabbat : un article de Chabad.org indique qu’il est surtout connu pour être chanté au troisième repas du sabbat, ajoute que certaines communautés (dont Chabad) le disent aussi avant les autres repas du sabbat, et fait remonter la coutume au kabbaliste du XVIe siècle Isaac Louria. L’article le présente comme une confession de ce que Dieu pourvoit.',
      detail:
        'Les interprètes juifs ont lu le psaume à la lumière de l’histoire d’Israël. D’après les notes de John Gill, le Targum araméen paraphrase le verset 1 en parlant de Dieu nourrissant Israël au désert, lit la vallée obscure comme la captivité et comprend la maison du verset 6 comme le sanctuaire, tandis que les commentateurs médiévaux Rachi et David Kimhi rattachaient la vallée à la fuite de David devant Saül dans le désert de Ziph.',
    },
  },

  literary: {
    placeInBook:
      'Le Psaume 23 se trouve dans le premier livre du Psautier (Ps 1–41), parmi les psaumes rattachés à David (Ps 3–32 ; 34–41), où domine le nom divin YHWH. Il suit le Psaume 22, qui s’ouvre sur « Mon Dieu! Mon Dieu! Pourquoi m’as-tu abandonné », et précède le Psaume 24, où le roi de gloire fait son entrée. Spurgeon note qu’il suit le Psaume 22, le psaume de la Croix par excellence, et que le psaume du berger ne vient qu’après lui ; F. B. Meyer rapporte qu’on a parfois appelé le Psaume 23 le psaume de la Houlette (« the Psalm of the Crook »), placé entre le psaume de la Croix et celui de la Couronne. Les notes Tyndale regroupent aussi les Psaumes 23 à 28 autour du soin pastoral de Dieu, de sa conduite, de sa bonté et du désir d’habiter dans sa maison.',
    argument:
      'Le psaume progresse en deux temps. Aux versets 1 à 4, l’Éternel est le berger : il pourvoit (v. 1), donne le repos et l’eau (v. 2), restaure et conduit (v. 3), et accompagne la brebis à travers la vallée la plus sombre (v. 4). Aux versets 5 et 6, l’image devient celle d’un banquet : l’Éternel est l’hôte qui dresse une table devant les ennemis, honore l’invité avec de l’huile et remplit sa coupe, jusqu’à ce que le bonheur et le ḥesed poursuivent le psalmiste tous les jours de sa vie et le conduisent à la maison de l’Éternel. En chemin, David cesse de parler de Dieu pour lui parler — « il » devient « tu » au moment où la vallée s’assombrit.',
    placeInCanon:
      'L’image du berger traverse toute la Bible. Jacob bénit le Dieu qui a été son berger (Gn 48.15) ; Dieu conduit Israël à travers le désert comme un troupeau (Ps 78.52) ; David est tiré des bergeries pour paître Israël (Ps 78.70–72 ; 2 S 5.2). Quand les rois d’Israël faillissent à leur tâche de bergers, les prophètes promettent que Dieu fera lui-même paître son peuple et suscitera un berger de la lignée de David (Jr 23.1–6 ; Ez 34.11–24). Jésus revendique ce rôle (Jn 10.11), les épîtres du Nouveau Testament l’appellent le grand pasteur et le souverain pasteur (He 13.20 ; 1 P 5.4), et l’Apocalypse clôt l’histoire avec l’Agneau qui fait paître son peuple et le conduit aux sources des eaux de la vie (Ap 7.17).',
    bookOutline: ['Livre I — Psaumes 1–41', 'Livre II — Psaumes 42–72', 'Livre III — Psaumes 73–89', 'Livre IV — Psaumes 90–106', 'Livre V — Psaumes 107–150'],
    passageOutline: [
      'L’Éternel, mon berger : provision, repos et conduite',
      'À travers la vallée la plus sombre : « tu es avec moi »',
      'L’Éternel, mon hôte : la table, l’huile et la coupe',
      'Poursuivi par le bonheur, chez soi dans la maison de l’Éternel',
    ],
    features: {
      'psalm-23:lit:centre': {
        title: '« Car tu es avec moi » au centre (selon un certain décompte)',
        description:
          'Si l’on compte les mots hébreux des versets 1 à 6 tels qu’ils sont découpés dans le texte annoté de STEPBible (en laissant de côté le titre mizmôr lədāwid et en comptant séparément les mots reliés par un maqqef), le psaume compte 55 mots. Les trois mots kî-ʾattāh ʿimmādî, « car tu es avec moi » (v. 4), sont les mots 27 à 29 : exactement 26 mots les précèdent et exactement 26 les suivent. Que le poète ait compté ou non, la confession de la présence de Dieu se tient au centre arithmétique et affectif du psaume. Le résultat dépend de la convention de décompte — si l’on traite comme un seul mot les mots reliés par un maqqef, les deux moitiés ne s’équilibrent plus —, si bien qu’il vaut mieux le présenter comme une observation que comme la preuve d’un dessein.',
        structure: [
          { label: 'Mots 1–26', text: 'v. 1–4a : l’Éternel comme berger, jusqu’à « Je ne crains aucun mal »' },
          { label: 'Mots 27–29', text: 'kî-ʾattāh ʿimmādî — « car tu es avec moi »' },
          { label: 'Mots 30–55', text: 'v. 4b–6 : la houlette et le bâton, la table, l’huile et la coupe, le bonheur et le ḥesed, la maison de l’Éternel' },
        ],
      },
      'psalm-23:lit:he-to-you': {
        title: 'De « il » à « tu »',
        description:
          'Aux versets 1 à 3, David parle de l’Éternel à la troisième personne (« Il me fait reposer … Il me dirige … Il restaure … Il me conduit »). Au verset 4, tandis que la vallée s’assombrit, il se tourne pour s’adresser directement à Dieu — « car tu es avec moi: Ta houlette et ton bâton » — et continue de lui parler au verset 5 (« Tu dresses … Tu oins »). Le verset 6 se referme sur le nom : « la maison de l’Éternel ». La grammaire met en œuvre le propos du psaume : dans le danger, parler de Dieu devient parler avec Dieu.',
      },
      'psalm-23:lit:inclusio': {
        title: 'Encadré par le nom de l’Éternel',
        description:
          'Le nom divin YHWH n’apparaît que deux fois dans le psaume — comme premier mot après le titre (v. 1) et dans sa dernière ligne (v. 6, « la maison de l’Éternel »). Ce cadre tient tout ce qui se trouve entre les deux — pâturage, vallée, table — à l’intérieur du nom de l’Éternel.',
      },
      'psalm-23:lit:two-images': {
        title: 'Berger et hôte — ou un seul voyage ?',
        description:
          'La plupart des commentateurs voient deux tableaux : l’Éternel comme berger (v. 1–4) et comme hôte (v. 5–6). Franz Delitzsch, dans le commentaire de Keil et Delitzsch, note que la figure du berger s’efface après le verset 4 et que celle de l’hôte apparaît ; Maclaren divise le psaume en deux moitiés — les brebis de son pâturage, et les invités à sa table et dans sa maison. On peut aussi lire ces images comme un seul voyage continu, du pâturage à la maison de l’hôte en passant par la vallée, et le vocabulaire que le psaume partage avec Exode 15.13 (les verbes « conduire » et « diriger », le ḥesed, la « demeure » de Dieu) suggère un écho du voyage d’Israël lors de l’Exode.',
      },
      'psalm-23:lit:return-echo': {
        title: 'Ramené — et rentré à la maison',
        description:
          'Le verbe šûb (« revenir, retourner ») apparaît au verset 3 — « Il restaure (ramène) mon âme » — et, dans le texte hébreu tel que l’ont vocalisé les massorètes, de nouveau au verset 6 : wəšabtî, « et je reviendrai » dans la maison de l’Éternel. Selon cette lecture, le psaume est encadré par un double retour : le Berger me ramène, et je rentre à la maison. Beaucoup de traductions suivent les versions anciennes et lisent plutôt « j’habiterai » (voir la note textuelle dans Perspectives).',
      },
    },
  },

  theology: {
    'psalm-23:th:shepherd-king': {
      title: 'L’Éternel, berger et roi : provision, conduite, protection',
      summary:
        'Appeler l’Éternel « mon berger », c’est employer un langage royal, car en Israël comme dans tout le Proche-Orient ancien on appelait les rois des bergers. Le psaume remplit ce titre de soins concrets : une provision telle que rien de nécessaire ne manque, le repos et l’eau, la restauration, la conduite sur des sentiers droits et la protection de la houlette et du bâton. Calvin y lit une confession de la providence de Dieu : ceux qu’il a pris sous sa garde ne manqueront d’aucun bien.',
      detail:
        'Le titre est aussi un reproche adressé aux bergers humains qui faillissent (Jr 23.1–2 ; Ez 34.2–6) : ce que les rois d’Israël ont mal fait, l’Éternel promet de le faire lui-même (Ez 34.11–16). Sa conduite est « à cause de son nom » — fondée non sur le mérite des brebis, mais sur son propre caractère et sur sa réputation, point sur lequel insistent à la fois Calvin et les notes Tyndale.',
    },
    'psalm-23:th:presence': {
      title: 'La présence de Dieu dans la vallée obscure',
      summary:
        'Le psaume ne promet pas un chemin qui contourne la vallée obscure, mais une compagnie à l’intérieur de celle-ci : « Je ne crains aucun mal, car tu es avec moi ». Calvin observe que David ne prétendait pas être exempt de toute crainte, mais la surmonter en fixant les yeux sur le bâton de son Berger. La promesse de la présence de Dieu dans le danger revient dans toute l’Écriture — « Si tu traverses les eaux, je serai avec toi » (Es 43.2) — et prend chair en Jésus, appelé Emmanuel, « ce qui signifie Dieu avec nous » (Mt 1.23).',
      detail:
        'Augustin lisait la vallée comme cette vie mortelle elle-même, vécue sous l’ombre de la mort, et la présence de Dieu comme le Christ habitant dans le cœur par la foi, afin qu’après l’ombre de la mort le croyant soit avec lui.',
    },
    'psalm-23:th:hesed': {
      title: 'Le bonheur et le ḥesed : l’amour d’alliance qui poursuit',
      summary:
        'Le dernier verset nomme ce qui était à l’œuvre depuis le début : « le bonheur et la grâce », ce ḥesed qui est l’amour d’alliance loyal de l’Éternel. Le verbe n’est pas un doux « accompagner » ou « suivre », mais « poursuivre », le mot qui sert à traquer un ennemi, et qui décrit ici la bonté de Dieu lancée à la poursuite de son serviteur tous les jours de sa vie. Ce même ḥesed a conduit Israël hors d’Égypte jusqu’à la sainte demeure de Dieu (Ex 15.13) et il est célébré dans le refrain d’Israël : « Car sa miséricorde dure à toujours! » (Ps 136.1).',
      detail:
        'Parce que le Berger agit « à cause de son nom » (v. 3), la sécurité du psalmiste repose sur le caractère de Dieu plutôt que sur ses propres performances : le Dieu de l’alliance s’est lié à son peuple.',
    },
    'psalm-23:th:house': {
      title: 'Accueilli à la table et dans la maison de l’Éternel',
      summary:
        'Le psaume s’achève à une table et dans une maison. L’Éternel est hôte autant que berger : il prépare un repas sous les yeux d’ennemis qui ne peuvent intervenir, honore son invité avec de l’huile et remplit sa coupe. Le but est « la maison de l’Éternel », le lieu du culte et de la présence de Dieu, où le Psaume 27.4 aspire à habiter « toute ma vie ». Les notes Tyndale rattachent ce festin au banquet messianique promis en Ésaïe 25.6 et dépeint en Apocalypse 19.9.',
      detail:
        'Les maîtres chrétiens des premiers siècles y ont entendu des harmoniques sacramentelles. Les catéchèses mystagogiques attribuées à Cyrille de Jérusalem appliquent la table à la cène du Seigneur et l’huile à l’onction des nouveaux baptisés ; Augustin lit l’eau de rafraîchissement comme le baptême, mais voit dans la table la nourriture solide de la foi adulte (non plus le lait des petits enfants) et dans l’huile la joie spirituelle. Calvin rapporte d’abord le texte à la provision quotidienne de Dieu pour David et au culte du sanctuaire, où David aspirait à offrir des sacrifices avec ceux qui adoraient avec lui.',
    },
    'psalm-23:th:christ-shepherd': {
      title: 'Le Berger révélé en Jésus',
      summary:
        'Les chrétiens lisent le Psaume 23 à la lumière de la déclaration de Jésus : « Je suis le bon berger » (Jn 10.11). Dans l’Ancien Testament, le berger du Psaume 23 est l’Éternel lui-même, et Ézéchiel a promis à la fois que Dieu ferait paître son troupeau en personne et qu’il établirait « un seul pasteur, … mon serviteur David » (Ez 34.15, 23). Jésus reprend les deux fils : il est le berger qui donne sa vie pour ses brebis, celui que Dieu a ramené d’entre les morts comme le grand pasteur (He 13.20), et celui qui paraîtra comme le souverain pasteur (1 P 5.4).',
      detail:
        'La plupart des interprètes d’aujourd’hui y voient une typologie plutôt que l’affirmation que David aurait consciemment écrit au sujet de Jésus, tandis que certains lecteurs chrétiens plus anciens (Augustin, John Gill) voyaient dans l’Éternel du psaume le Fils lui-même ; dans tous les cas, le Nouveau Testament présente Jésus comme l’accomplissement du modèle que dessinent le psaume et les prophètes. Calvin l’exprime ainsi : Dieu s’est maintenant montré notre berger en la personne de son Fils unique, bien plus clairement qu’il ne l’a fait pour ceux qui vivaient sous la Loi.',
    },
    'psalm-23:th:hope': {
      title: '« Jusqu’à la fin de mes jours » — ou au-delà ?',
      summary:
        'L’hébreu du verset 6 dit littéralement « pour la longueur des jours » (comme l’indiquent les notes de la BSB et de la KJV anglaises), une expression qui peut signifier une longue vie (voir Ps 91.16 : « Je le rassasierai de longs jours ») ou, à propos de la maison de Dieu dans le Psaume 93.5, « pour toute la durée des temps » ; beaucoup de traductions rendent « pour toujours ». Les versions françaises se partagent : « jusqu’à la fin de mes jours » (LSG), « pour de longs jours » (Darby, NCL), « pour l’éternité » (Ostervald). Dans l’Ancien Testament, la ligne exprime le plus naturellement une communion avec Dieu dans sa maison pour toute la vie. Les lecteurs chrétiens, guidés par l’image néotestamentaire de l’Agneau qui conduit son peuple aux sources des eaux de la vie (Ap 7.17), y ont aussi entendu l’espérance d’habiter avec Dieu au-delà de la mort — ainsi Matthew Henry et Spurgeon. Le texte admet à la fois un horizon présent et un horizon futur.',
      detail:
        'La Septante grecque porte eis makrotēta hēmerōn, littéralement « pour la longueur des jours » (en anglais chez Brenton : « for a very long time »). Matthew Henry donne les deux lectures : la résolution de David de rester près de Dieu aussi longtemps qu’il vivra, et la perspective d’une parfaite félicité dans la maison du Père.',
    },
  },

  perspectives: {
    'psalm-23:ps:tsalmavet': {
      question: 'Au verset 4, faut-il lire « la vallée de l’ombre de la mort » ou « la vallée des ténèbres profondes » ?',
      intro:
        'Le mot hébreu ṣalmāwet peut se comprendre de deux manières, et les traductions se partagent. Certains interprètes combinent les deux : Franz Delitzsch, dans le commentaire de Keil et Delitzsch, fait dériver le mot d’une racine signifiant « couvrir d’ombre, obscurcir » plutôt que d’un mot composé, mais tient que, tel qu’il est prononcé, il désigne l’ombre de la mort comme qualificatif des ténèbres les plus effrayantes. C’est une question de philologie plutôt que de doctrine, et le sens du verset n’en est guère changé.',
      commonGround:
        'Les deux lectures évoquent les ténèbres les plus menaçantes qu’une personne puisse traverser — le lexique lui-même donne « ombre de mort, ombre profonde, ténèbres profondes » —, et toutes deux font porter le poids du verset sur les mots suivants : « Je ne crains aucun mal, car tu es avec moi ».',
      perspectives: {
        'psalm-23:ps:tsalmavet:shadow': {
          tradition: 'Traduction traditionnelle',
          label: '« L’ombre de la mort »',
          summary:
            'Les voyelles massorétiques découpent le mot en ṣal + māwet, « ombre de la mort », et c’est ainsi que le lisent la Septante grecque (skia thanatou) puis, à sa suite, les traditions latine, anglaise et française (LSG, Darby, Ostervald) ; Calvin rapporte l’avis de grammairiens juifs qui y voyaient un mot composé — une ombre mortelle, comme dit aussi la NCL (« une vallée d’ombre mortelle »). Le Nouveau Testament emploie la même expression grecque pour les ténèbres que le Christ dissipe (Mt 4.16 ; Lc 1.79). Selon cette lecture, la vallée est expressément un lieu où la mort menace.',
        },
        'psalm-23:ps:tsalmavet:darkness': {
          tradition: 'Traduction philologique',
          label: '« Ténèbres profondes »',
          summary:
            'Beaucoup de spécialistes modernes rattachent le mot à une racine signifiant « être sombre », si bien qu’il désigne des ténèbres épaisses ou profondes. Cette lecture n’est pas seulement moderne : Rachi, à la suite du grammairien du Xe siècle Dounash ben Labrat, explique chaque occurrence de ṣalmāwet comme désignant les ténèbres. La note de la BSB anglaise propose « the valley of deep darkness », et l’interlinéaire de STEPBible glose le mot de la même manière. Son emploi pour les ténèbres sans chemin du désert (Jr 2.6) et pour l’obscurité d’une mine (Jb 28.3) appuie le sens large de ténèbres terrifiantes.',
        },
      },
    },
    'psalm-23:ps:dwell-return': {
      question: 'Au verset 6, le psalmiste « habite »-t-il dans la maison de l’Éternel, ou y « revient »-il — et pour combien de temps ?',
      intro:
        'Les consonnes du mot hébreu (wšbty) peuvent se lire de deux façons. Les voyelles massorétiques donnent wəšabtî, de šûb, « et je reviendrai » ; les anciennes traductions grecque et latine lisent « mon habitation » et « que j’habite », comme si le mot venait de yāšab, « habiter ». L’expression finale signifie littéralement « pour la longueur des jours ». C’est une question textuelle et d’interprétation, non une question confessionnelle.',
      commonGround:
        'Quelle que soit la lecture, le psaume s’achève avec le psalmiste dans la maison de l’Éternel pour toute la durée de ses jours, en présence du Dieu qui l’a poursuivi de son bonheur et de son ḥesed. Savoir si « la longueur des jours » désigne une vie entière ou s’étend au-delà de la mort est une autre question d’interprétation.',
      perspectives: {
        'psalm-23:ps:dwell-return:dwell': {
          tradition: 'Versions anciennes et la plupart des traductions',
          label: '« J’habiterai »',
          summary:
            'La Septante lit littéralement « et mon habitation dans la maison du Seigneur pour la longueur des jours » (Brenton : « and my dwelling shall be in the house of the Lord for a very long time »), et la Vulgate latine la suit (ut inhabitem, « que j’habite ») ; la plupart des versions lisent « habiter » — la LSG, la NCL et Ostervald (« j’habiterai »), Darby (« mon habitation sera »), comme les anglaises KJV, BSB et WEB. Le Psaume 27.4, étroitement parallèle, emploie l’infinitif de yāšab — « habiter … dans la maison de l’Éternel » — avec la même expression hébraïque, « tous les jours de ma vie ». Selon cette lecture, le psaume s’achève sur une résidence stable auprès de Dieu.',
        },
        'psalm-23:ps:dwell-return:return': {
          tradition: 'Texte hébreu massorétique',
          label: '« Je reviendrai »',
          summary:
            'L’hébreu tel qu’il est vocalisé lit « et je reviendrai », le même verbe que « Il restaure » au verset 3, et le texte annoté de STEPBible le glose ainsi. Franz Delitzsch, dans le commentaire de Keil et Delitzsch, défend cette lecture comme une construction prégnante (constructio praegnans) : revenu, le psalmiste habitera de nouveau dans la maison de l’Éternel — un retour au foyer plutôt qu’une première arrivée. Selon cette lecture, le psaume est encadré par deux retours : le Berger me ramène, et je rentre à la maison.',
        },
      },
    },
    'psalm-23:ps:readings': {
      question: 'Qui est le Berger, et jusqu’où faut-il lire le psaume à la lumière du Christ et des sacrements ?',
      intro:
        'Lecteurs juifs et chrétiens aiment ce psaume depuis des millénaires et le lisent de manières différentes, qui parfois se recoupent. Au sein même du christianisme existe une différence de méthode ancienne entre les lectures qui passent rapidement au Christ et aux sacrements et celles qui partent de la situation de David lui-même.',
      commonGround:
        'Toutes ces lectures s’accordent à dire que le Berger est l’Éternel, le Dieu d’Israël, que le psaume exprime la confiance en son soin personnel à travers le danger, et que son but est la vie en présence de Dieu. Les chrétiens ajoutent que ce même Dieu s’est approché en Jésus, le bon berger (Jn 10.11).',
      perspectives: {
        'psalm-23:ps:readings:jewish': {
          tradition: 'Tradition interprétative juive',
          label: 'L’Éternel qui fait paître Israël',
          summary:
            'La tradition juive voit dans le Berger l’Éternel, le Dieu d’Israël, et entend souvent le psaume sur le fond de l’histoire d’Israël. D’après le rapport de John Gill, le Targum paraphrase le verset 1 en parlant de Dieu nourrissant Israël au désert, lit la vallée obscure comme la captivité et comprend la maison du verset 6 comme le sanctuaire, tandis que Rachi et David Kimhi rattachaient la vallée à la fuite de David devant Saül dans le désert de Ziph. Le psaume occupe une place chère dans la prière du sabbat, comme confession de ce que Dieu pourvoit.',
        },
        'psalm-23:ps:readings:patristic': {
          tradition: 'Église ancienne (lecture christologique et sacramentelle)',
          label: 'Le Christ berger, qui nourrit son Église',
          summary:
            'Augustin entend dans le psaume la voix de l’Église qui parle au Christ : il comprend le Dominus pascit me de sa version latine (« le Seigneur me fait paître ») du Christ qui fait paître son peuple, l’eau de rafraîchissement comme le baptême et la vallée comme cette vie mortelle. Les catéchèses mystagogiques attribuées à Cyrille de Jérusalem, qui instruisent les nouveaux baptisés, appliquent la table à la table mystique de l’eucharistie et l’huile à l’onction qui les marque du sceau. Selon cette lecture, le psaume devient un chant de l’initiation chrétienne.',
        },
        'psalm-23:ps:readings:reformation': {
          tradition: 'Réforme et exégèse protestante ultérieure',
          label: 'La confession de la providence par David, accomplie en Christ',
          summary:
            'Calvin lit d’abord le psaume comme la confession de David — un roi riche — qui se reconnaît pauvre brebis sous la providence de Dieu, et il résiste à l’allégorie : il refuse par exemple de lire les « sentiers de la justice » comme la direction de l’Esprit, parce que la métaphore du berger se poursuit encore. Il ajoute pourtant que Dieu s’est montré notre berger bien plus clairement en son Fils. Les commentateurs protestants ultérieurs varient : Matthew Henry et Spurgeon appliquent chaleureusement le psaume au Christ et à son peuple, tandis que John Gill va plus loin et voit dans l’Éternel de ce psaume le Fils lui-même.',
        },
      },
    },
  },

  commentary: {
    'psalm-23:cm:augustine': {
      lead: 'Sur la vallée de l’ombre de la mort (son Psaume 22, selon la numérotation latine)',
      quoteTranslation:
        'Oui, quand je marcherais au milieu de cette vie, qui est l’ombre de la mort. Je ne craindrai aucun mal, car tu es avec moi. Je ne craindrai aucun mal, car tu habites dans mon cœur par la foi ; et tu es maintenant avec moi, afin qu’après l’ombre de la mort je sois, moi aussi, avec toi.',
    },
    'psalm-23:cm:cyril': {
      lead: 'Instruisant les nouveaux baptisés sur la table du verset 5 (d’après les catéchèses mystagogiques traditionnellement attribuées à Cyrille)',
      quoteTranslation:
        'Quand l’homme dit à Dieu : Tu as dressé devant moi une table, que désigne-t-il sinon cette table mystique et spirituelle que Dieu a préparée pour nous en face, c’est-à-dire à l’encontre et à l’opposé des esprits mauvais ?',
    },
    'psalm-23:cm:rashi': {
      lead: 'Une lecture juive médiévale du verset 4 (résumée d’après l’hébreu)',
      text: 'Rachi comprend « la vallée de ṣalmāwet » comme une terre de ténèbres et dit que David parlait du désert de Ziph ; à la suite du grammairien Dounash ben Labrat, il explique toute occurrence de ṣalmāwet comme désignant les ténèbres. Il lit « ta houlette et ton bâton » comme les souffrances qui étaient venues sur David et l’appui de sa confiance dans le ḥesed de Dieu : l’une et l’autre le consolent, parce que les souffrances servent au pardon du péché, et il est sûr que Dieu dressera devant lui une table — que Rachi identifie à la royauté.',
    },
    'psalm-23:cm:calvin': {
      lead: 'Pourquoi Dieu se nomme berger',
      quoteTranslation:
        'Dans l’Écriture, Dieu prend souvent le nom et revêt le personnage d’un berger, et ce n’est pas un mince signe de son tendre amour envers nous. Comme c’est une manière de parler humble et familière, celui qui ne dédaigne pas de s’abaisser si bas pour l’amour de nous doit nous porter une affection singulièrement forte.',
    },
    'psalm-23:cm:henry': {
      lead: 'Sur « l’ombre de la mort » (v. 4)',
      quoteTranslation:
        'Ce n’est que l’ombre de la mort ; il n’y a en elle aucun mal véritable ; l’ombre d’un serpent ne pique pas, et l’ombre d’une épée ne tue pas.',
    },
    'psalm-23:cm:gill': {
      lead: 'Une lecture christologique, avec des notes sur l’interprétation juive',
      text: 'Gill voit dans « l’Éternel » du verset 1 le Christ, le Fils, à qui, dit-il, l’Écriture donne le plus souvent le titre de berger, et il entend donc le psaume comme la voix des brebis du Christ. Chemin faisant, il rapporte des lectures juives : le Targum comprend le verset 1 de Dieu nourrissant Israël au désert et la maison du verset 6 comme le sanctuaire, et les commentateurs médiévaux Rachi (qu’il appelle Jarchi) et Kimhi rattachaient la vallée obscure à la fuite de David devant Saül dans le désert de Ziph.',
    },
    'psalm-23:cm:spurgeon': {
      lead: 'Sur le petit mot « mon » (v. 1)',
      quoteTranslation:
        'Le mot le plus doux de tous est ce monosyllabe : « mon ». Il ne dit pas : « Le Seigneur est le berger du monde entier, et il conduit la multitude comme son troupeau », mais : « L’Éternel est mon berger » ; s’il n’est le berger de personne d’autre, il est mon berger à moi ; il prend soin de moi, il veille sur moi et il me garde.',
    },
    'psalm-23:cm:delitzsch': {
      lead: 'Du berger à l’hôte (v. 4–5) — d’après le volume de Franz Delitzsch sur les Psaumes',
      quoteTranslation:
        'Après que la figure du berger s’est effacée au v. 4, celle de l’hôte apparaît. Ses ennemis doivent regarder sans rien dire … sans pouvoir rien faire, et voir comment Jahvé pourvoit largement aux besoins de son invité, l’oint de doux parfums comme lors d’un banquet joyeux et magnifique … et remplit sa coupe à l’excès.',
    },
    'psalm-23:cm:maclaren': {
      lead: 'Sur les sentiers de la justice (v. 3) : le repos est donné pour la route',
      quoteTranslation:
        'La vie n’est pas un enclos où les brebis se couchent, mais une route où elles doivent marcher. … Le repos doit préparer au travail, le travail doit adoucir le repos.',
    },
    'psalm-23:cm:meyer': {
      lead: 'Le Psaume 23 entre les Psaumes 22 et 24',
      quoteTranslation:
        'Ce psaume a parfois été appelé le psaume de la Houlette. Il se trouve entre le psaume de la Croix et le psaume de la Couronne. Si le vingt-deuxième parle du bon berger, qui est mort, et si le vingt-quatrième parle du souverain pasteur, qui revient, le vingt-troisième parle du grand pasteur, qui garde son troupeau avec une sagacité infaillible et un dévouement inlassable.',
    },
    'psalm-23:cm:phillip-keller': {
      lead: 'La lecture d’un éleveur de moutons moderne (à titre d’illustration, non de témoignage ancien)',
      text: 'W. Phillip Keller, qui a longtemps travaillé dans la gestion de ranchs et élevé lui-même des moutons, lit le Psaume 23 expression par expression à travers les réalités pratiques de l’élevage — ce qu’il faut pour que des brebis se reposent, la détresse d’une brebis renversée sur le dos sans pouvoir se relever, la montée du troupeau vers les pâturages d’été en altitude, les soins à l’huile contre les mouches et les parasites — et applique chacune au soin du Christ pour son peuple. (Il ne faut pas le confondre avec Timothy Keller.)',
    },
    'psalm-23:cm:bailey': {
      lead: 'L’image du berger, de David aux apôtres',
      text: 'Bailey suit le thème du bon berger à travers neuf passages — Psaume 23, Jérémie 23, Ézéchiel 34, Zacharie 10, Marc 6, Luc 15, Matthieu 18, Jean 10 et 1 Pierre 5 —, en traitant le Psaume 23 comme le point de départ d’une longue tradition biblique dans laquelle prophètes, Jésus et apôtres reviennent à l’image de David et l’adaptent à de nouvelles circonstances. Il analyse la composition de chaque passage et les lit à la lumière des coutumes pastorales du Moyen-Orient et des premiers commentateurs de la région.',
    },
    'psalm-23:cm:ferguson': {
      lead: '« Je ne manquerai de rien » : la confiance d’une longue expérience',
      text: 'Ferguson soutient que le Psaume 23 n’a pas été écrit par le jeune berger idéalisé des livres pour enfants, mais par un croyant éprouvé au fil d’une longue expérience — quelqu’un qui avait connu la vallée obscure, le mal et les ennemis —, et que David a appris de Jacob à appeler Dieu son berger (Gn 48.15–16). Il rattache le verbe « manquer » à la provision d’Israël au désert (Ex 16.18 ; Dt 2.7 ; 8.9) et conclut que Jésus, le bon berger qui donne sa vie pour ses brebis (Jn 10.11 ; Za 13.7), garantit que les siens ne manqueront pas de ce dont ils ont vraiment besoin (Rm 8.32).',
    },
  },

  sermons: {
    'psalm-23:sm:spurgeon-1595': {
      summary:
        'Spurgeon avoue qu’il avait eu l’intention de garder ce verset pour son lit de mort, mais qu’il avait besoin de sa consolation dans une épreuve présente, et il insiste sur le fait qu’il est pour les vivants autant que pour les mourants. Sous trois titres — le défilé et ses terreurs, le pèlerin et sa progression, l’âme et son Berger —, il dépeint la vallée comme une gorge de montagne étroite et soutient que traverser la tristesse n’est pas en soi le signe d’un péché, puisque le Christ lui-même fut triste jusqu’à la mort.',
    },
    'psalm-23:sm:spurgeon-3006': {
      summary:
        'Spurgeon développe ce que la métaphore garantit, exige et demande. Ses privilèges sont la conduite (le berger d’Orient marche devant son troupeau), la provision pour les besoins du corps et de l’âme, et la protection ; son premier devoir est la confiance de la brebis en son berger ; et elle suscite des questions pénétrantes : l’auditeur porte-t-il les marques des brebis du Christ ? Il suggère que le psaume a probablement été écrit quand David était roi et n’avait pas honte de ses années de berger.',
    },
    'psalm-23:sm:spurgeon-3060': {
      summary:
        'Sur « L’Éternel est mon berger: je ne manquerai de rien », Spurgeon avance en trois temps : la confession nécessaire avant que quiconque puisse le dire (nous sommes des brebis insensées et dépendantes), l’assurance qui naît de la manière dont Dieu a agi par le passé (en nous ramenant de nos égarements et en pourvoyant à nos besoins), et la sainte confiance du « je ne manquerai de rien », qu’il applique aux besoins réels plutôt qu’aux envies imaginaires.',
    },
    'psalm-23:sm:maclaren-shepherd-king': {
      summary:
        'Maclaren entend dans le psaume le vieux roi qui se retourne sur ses années de berger. Il le divise en deux moitiés — Dieu comme Berger (v. 1–4), qui conduit son troupeau à travers le repos, le travail et la tristesse, et Dieu comme Hôte (v. 5–6), dont l’hospitalité s’achève dans la maison du Père —, et souligne que le repos des verts pâturages est donné pour nous fortifier en vue des sentiers de la justice, et que la main qui conduit dans la vallée obscure conduit aussi à travers elle et au-delà.',
    },
  },

  verseNotes: {
    'PSA.23.1': [
      'Le psaume s’ouvre sur le nom d’alliance de Dieu, YHWH (rendu « l’Éternel » par la LSG), et sur un participe hébreu, rōʿî — « celui qui me fait paître ». Dans le Proche-Orient ancien, « berger » était un titre royal ; David, berger devenu roi, confesse donc que l’Éternel est son véritable roi et son protecteur. Jacob employa le même mot pour Dieu au soir de sa vie : « le Dieu qui m’a conduit depuis que j’existe jusqu’à ce jour » (Gn 48.15 ; littéralement, qui a été mon berger).',
      '« Je ne manquerai de rien » emploie le verbe ḥāsēr, « manquer de ». C’est le mot qu’employa Moïse pour les années au désert — « tu n’as manqué de rien » (Dt 2.7) —, si bien que la ligne peut s’entendre comme l’application à une seule vie de l’expérience d’Israël au désert, rapprochement que font à la fois les notes Tyndale et Sinclair Ferguson. De Calvin à Spurgeon, les commentateurs notent qu’elle promet ce dont le Berger sait que nous avons besoin, et non tout ce que nous pourrions souhaiter.',
    ],
    'PSA.23.2': [
      '« De verts pâturages », c’est littéralement « des pâturages d’herbe tendre » (marge de la KJV : « pastures of tender grass »), et les « eaux paisibles » sont des « eaux de repos » — menûḥôt, le mot qui désigne un lieu de repos (marge de la KJV : « waters of quietness »). Le verbe rendu par « Il me dirige » (nāhal) est un mot rare (10 occurrences) qui désigne une conduite attentive — vers l’eau, le repos ou le rafraîchissement ; il s’emploie pour un troupeau (Gn 33.14 ; Es 40.11, où Dieu « conduira les brebis qui allaitent ») et pour des personnes (Ex 15.13 ; Es 49.10). Franz Delitzsch, dans le commentaire de Keil et Delitzsch, y voit un mot pastoral pour une conduite pleine de douceur, ce qui convient à ce verset. Le berger fait à la fois reposer le troupeau et le mène à l’eau : repos et rafraîchissement ensemble.',
    ],
    'PSA.23.3': [
      '« Il restaure mon âme » pourrait se rendre par « il ramène ma vie » : le verbe est šûb, « revenir », et nefesh désigne l’être vivant tout entier. « Les sentiers de la justice » sont littéralement des « pistes de droiture » — des chemins droits et justes, qui mènent là où ils doivent mener. Le Berger y conduit « à cause de son nom », pour honorer son propre caractère plutôt qu’en raison du mérite des brebis.',
    ],
    'PSA.23.4': [
      'La « vallée » (gêʾ) est un ravin encaissé ou une gorge étroite, et ṣalmāwet signifie soit « ombre de la mort », soit « ténèbres profondes » (note de la BSB anglaise) — un lieu où le danger est proche. Le psaume ne promet pas que la brebis évitera de telles vallées, mais qu’elle les traversera accompagnée : « Je ne crains aucun mal, car tu es avec moi ». C’est ici, au centre du psaume (selon un certain décompte de ses mots hébreux), que David cesse de parler de Dieu pour se mettre à lui parler.',
      'Le šēbeṭ du berger (la « houlette » de la LSG) était une massue pour défendre le troupeau et un outil pour le guider et le compter ; la mišʿenet (le « bâton ») était un appui sur lequel se reposer. Les notes Tyndale observent que les bergers se servaient de l’un et de l’autre pour écarter le danger. Ils rassurent parce qu’ils montrent que le Berger est présent et armé — et šēbeṭ peut aussi désigner le sceptre d’un roi.',
    ],
    'PSA.23.5': [
      'L’image passe du berger à l’hôte. La table est dressée sous les yeux d’ennemis qui peuvent regarder mais non intervenir ; la tête de l’invité est ointe d’huile, marque d’honneur (voir Lc 7.46), avec un verbe qui signifie littéralement « tu engraisses » — une huile répandue avec largesse (marge de la KJV). La coupe « déborde » : rəwāyâ signifie saturation, et le mot n’apparaît ailleurs qu’au Psaume 66.12, où Dieu fait entrer son peuple dans « l’abondance ».',
    ],
    'PSA.23.6': [
      '« Oui » peut aussi se lire « seulement » — Spurgeon signale la lecture : seuls le bonheur et la grâce. Le verbe rendu par « m’accompagneront » est rādap̄, « poursuivre », employé d’ordinaire pour des ennemis lancés aux trousses de quelqu’un. Franz Delitzsch, dans le commentaire de Keil et Delitzsch, met en relief ce renversement : les ennemis du psalmiste le poursuivent, mais désormais seuls le bonheur et le ḥesed de Dieu — son amour d’alliance loyal — le poursuivront, tous les jours de sa vie.',
      'La dernière ligne soulève deux questions textuelles. L’hébreu tel qu’il est vocalisé dit « et je reviendrai » (šûb), tandis que la Septante grecque et la plupart des traductions lisent « j’habiterai » — voir le Psaume 27.4. Et « jusqu’à la fin de mes jours » (LSG) rend une expression qui signifie littéralement « pour la longueur des jours » (Darby et la NCL : « pour de longs jours » ; Ostervald : « pour l’éternité ») — une expression qui peut désigner une longue vie ou, à propos de la maison de Dieu dans le Psaume 93.5, « toute la durée des temps » ; les lecteurs chrétiens y ont aussi entendu l’espérance d’habiter avec Dieu au-delà de la mort.',
    ],
  },

  concepts: {
    'psalm-23:c:shepherd': {
      label: 'L’Éternel, mon berger',
      aliases: [
        'berger',
        'bergers',
        'mon berger',
        'pasteur',
        'faire paître',
        'roi berger',
        'rois bergers',
        'les rois comme bergers',
        'hammourabi',
        'troupeau',
        'brebis',
        'moutons',
        'l’éternel est mon berger',
        'que signifie berger',
      ],
      answer:
        'Rōʿî, « mon berger », est un participe du verbe rāʿâ, « faire paître, garder » : l’Éternel est celui qui, activement, fait paître David. Dans tout le Proche-Orient ancien, les rois se disaient bergers (Hammurabi se présente comme le berger porteur de salut), si bien que ce titre unit l’autorité royale au soin. L’Écriture l’applique à Dieu depuis Jacob (Gn 48.15) jusqu’aux prophètes (Ez 34.15), et Jésus le revendique en Jean 10.11.',
    },
    'psalm-23:c:divine-name': {
      label: 'L’Éternel (YHWH)',
      aliases: [
        'l’éternel',
        'éternel',
        'le seigneur',
        'yahweh',
        'yahvé',
        'jéhovah',
        'jehovah',
        'adonaï',
        'adonai',
        'nom divin',
        'nom de dieu',
        'tétragramme',
        'tétragrammaton',
        'petites capitales',
        'pourquoi l’éternel',
      ],
      answer:
        'Là où la LSG écrit « l’Éternel » (et les Bibles anglaises LORD en petites capitales), l’hébreu porte le nom personnel de Dieu, YHWH, révélé à Moïse (Ex 3.14–15) ; la NCL le transcrit « Yahweh ». Par respect, les lecteurs juifs disent à la place ’Adonaï (« Seigneur »), et le nom était écrit avec les voyelles de ce mot — d’où l’ancienne forme « Jéhovah » ; « Yahweh » est la reconstruction savante habituelle. Dans le Psaume 23, le nom n’apparaît que deux fois, comme premier mot après le titre et dans la dernière ligne, encadrant tout le psaume.',
    },
    'psalm-23:c:want': {
      label: 'Je ne manquerai de rien',
      aliases: [
        'manquer',
        'je ne manquerai de rien',
        'ne manquerai de rien',
        'manquer de rien',
        'tu n’as manqué de rien',
        'disette',
        'privé',
        'provision',
        'pourvoir',
        'besoins',
        'contentement',
      ],
      answer:
        'Le verbe est ḥāsēr, « manquer de ». C’est le mot qu’employa Moïse pour les quarante années d’Israël au désert — « tu n’as manqué de rien » (Dt 2.7 ; voir aussi Né 9.21) —, si bien que la ligne peut s’entendre comme l’application à une seule vie de l’expérience d’Israël au désert, rapprochement que font à la fois les notes Tyndale et Sinclair Ferguson. La promesse est celle de la suffisance, non du luxe : Spurgeon l’applique aux besoins réels plutôt qu’aux envies imaginaires, et le Psaume 34.10 dit que ceux qui cherchent l’Éternel « ne sont privés d’aucun bien ».',
    },
    'psalm-23:c:rest': {
      label: 'Verts pâturages et eaux paisibles',
      aliases: [
        'verts pâturages',
        'pâturages',
        'pâturage',
        'eaux paisibles',
        'eaux tranquilles',
        'eaux',
        'eau',
        'reposer',
        'il me fait reposer',
        'repos',
        'il me dirige',
        'herbe',
        'menouha',
      ],
      answer:
        '« De verts pâturages » sont littéralement « des pâturages d’herbe tendre », et les « eaux paisibles », des « eaux de repos » — menûḥâ désigne un lieu de repos. Le verbe rendu par « Il me dirige » (nāhal) est un mot rare pour une conduite attentive vers l’eau, le repos ou le rafraîchissement ; Ésaïe l’emploie pour Dieu qui « conduira les brebis qui allaitent » (Es 40.11), et on le retrouve dans la promesse que Dieu conduira son peuple « vers des sources d’eaux » (Es 49.10), promesse que l’Apocalypse reprend à propos de l’Agneau (Ap 7.17). Comme le note Maclaren, ce repos est donné pour fortifier le troupeau en vue de la route.',
    },
    'psalm-23:c:restore': {
      label: 'Il restaure mon âme ; les sentiers de la justice',
      aliases: [
        'restaure',
        'restaurer',
        'il restaure mon âme',
        'restaure mon âme',
        'âme',
        'nefesh',
        'nephesh',
        'ramener',
        'revenir',
        'se repentir',
        'repentance',
        'sentiers de la justice',
        'sentiers',
        'justice',
        'à cause de son nom',
        'pour l’amour de son nom',
        'il me conduit',
      ],
      answer:
        '« Il restaure mon âme », c’est littéralement « il ramène ma nefesh » — ma vie, tout mon être. Le verbe šûb, « revenir », peut décrire le fait de ranimer une vie défaillante ou de ramener une brebis égarée, et il signifie ailleurs la repentance. « Les sentiers de la justice » sont des pistes droites et justes, et le Berger y conduit « à cause de son nom » — en raison de ce qu’il est, non du mérite des brebis.',
    },
    'psalm-23:c:valley': {
      label: 'La vallée de l’ombre de la mort — « tu es avec moi »',
      aliases: [
        'vallée',
        'vallée de l’ombre de la mort',
        'ombre de la mort',
        'ombre',
        'vallée obscure',
        'vallée sombre',
        'ténèbres profondes',
        'ténèbres',
        'mort',
        'mourir',
        'je ne crains aucun mal',
        'crainte',
        'peur',
        'tu es avec moi',
        'avec moi',
        'présence',
        'centre du psaume',
      ],
      answer:
        'L’hébreu dit gêʾ ṣalmāwet — un ravin encaissé d’« ombre de mort » ou de « ténèbres profondes » (note de la BSB anglaise). La traduction traditionnelle, que suivent la LSG, Darby et Ostervald, s’appuie sur les voyelles massorétiques et la Septante grecque (skia thanatou) ; beaucoup de spécialistes modernes font dériver le mot d’une racine signifiant « être sombre ». Dans tous les cas, il s’agit des ténèbres les plus menaçantes, et le propos du psaume est que la brebis les traverse avec le Berger : « Je ne crains aucun mal, car tu es avec moi » — des mots qui se tiennent, selon un décompte courant des mots hébreux, au centre du psaume.',
    },
    'psalm-23:c:rod-staff': {
      label: 'Ta houlette et ton bâton',
      aliases: ['houlette', 'bâton', 'houlette et bâton', 'ta houlette et ton bâton', 'crosse', 'me rassurent', 'consolation', 'réconfort', 'sceptre'],
      answer:
        'Le šēbeṭ du berger (la « houlette » de la LSG) était une massue pour repousser les prédateurs et un outil pour guider et compter le troupeau ; la mišʿenet (le « bâton ») était un appui sur lequel se reposer. Les notes Tyndale observent que les bergers se servaient de l’un et de l’autre pour écarter le danger. Comme šēbeṭ peut aussi désigner le sceptre d’un souverain, l’image unit l’autorité royale au soin, et la brebis est rassurée en voyant son Berger armé et proche.',
    },
    'psalm-23:c:table': {
      label: 'La table, l’huile et la coupe qui déborde',
      aliases: [
        'table',
        'tu dresses devant moi une table',
        'dresser une table',
        'ennemis',
        'adversaires',
        'en face de mes adversaires',
        'oindre',
        'oins',
        'tu oins d’huile ma tête',
        'onction',
        'huile',
        'coupe',
        'ma coupe',
        'ma coupe déborde',
        'déborde',
        'hôte',
        'banquet',
        'festin',
        'hospitalité',
        'sainte cène',
        'cène',
        'eucharistie',
      ],
      answer:
        'Au verset 5, le Berger devient un hôte. Il dresse une table sous les yeux d’ennemis qui peuvent regarder mais non intervenir, honore son invité en lui oignant la tête d’huile — le verbe signifie littéralement « tu engraisses », c’est-à-dire une huile répandue avec largesse (voir Lc 7.46) — et remplit la coupe jusqu’à saturation. Dans l’Église ancienne, les catéchèses mystagogiques attribuées à Cyrille de Jérusalem y entendent la table du Seigneur et l’onction des nouveaux baptisés.',
    },
    'psalm-23:c:goodness-mercy': {
      label: 'Le bonheur et le ḥesed me poursuivront',
      aliases: [
        'bonheur',
        'grâce',
        'le bonheur et la grâce',
        'miséricorde',
        'bonté',
        'hesed',
        'chesed',
        'amour fidèle',
        'amour d’alliance',
        'bienveillance',
        'm’accompagneront',
        'accompagner',
        'suivre',
        'poursuivre',
      ],
      answer:
        'Le ḥesed est l’amour loyal de l’Éternel, l’amour d’alliance — glosé « loyauté d’alliance » dans l’interlinéaire de STEPBible, et rendu « la grâce » (LSG, NCL), « la miséricorde » (Ostervald) ou « la gratuité » (Darby). Le verbe rendu par « m’accompagneront » est rādap̄, « poursuivre », employé d’ordinaire pour des ennemis qui traquent quelqu’un ; ici, ce sont le bonheur et le ḥesed de Dieu qui poursuivent le psalmiste, tous les jours de sa vie.',
    },
    'psalm-23:c:house-forever': {
      label: 'Habiter dans la maison de l’Éternel pour toujours',
      aliases: [
        'maison de l’éternel',
        'maison du seigneur',
        'maison',
        'habiter',
        'j’habiterai',
        'habitation',
        'pour toujours',
        'à toujours',
        'jusqu’à la fin de mes jours',
        'pour de longs jours',
        'longueur des jours',
        'ciel',
        'paradis',
        'temple',
        'sanctuaire',
        'revenir à la maison',
        'éternité',
        'vie éternelle',
        'au-delà de la mort',
      ],
      answer:
        'La dernière ligne soulève deux questions. L’hébreu tel qu’il est vocalisé dit « et je reviendrai » (de šûb), tandis que la Septante et la plupart des traductions lisent « j’habiterai » — voir le Psaume 27.4 : « Je voudrais habiter toute ma vie dans la maison de l’Éternel ». Et « pour toujours » rend littéralement « pour la longueur des jours » (LSG : « jusqu’à la fin de mes jours » ; Darby et NCL : « pour de longs jours ») — une expression qui peut désigner une longue vie ou, à propos de la maison de Dieu dans le Psaume 93.5, « toute la durée des temps » ; des lecteurs chrétiens comme Matthew Henry et Spurgeon y ont aussi entendu l’espérance du ciel.',
    },
    'psalm-23:c:good-shepherd': {
      label: 'Jésus, le bon berger',
      aliases: [
        'bon berger',
        'le bon berger',
        'jésus',
        'christ',
        'jean 10',
        'grand pasteur',
        'souverain pasteur',
        'agneau',
        'messie',
        'accomplissement',
        'typologie',
        'nouveau testament',
      ],
      answer:
        'Dans le Psaume 23, le berger est l’Éternel lui-même, et Ézéchiel a promis que Dieu ferait paître son troupeau en personne et établirait sur lui « un seul pasteur, … mon serviteur David » (Ez 34.15, 23). Le Nouveau Testament présente Jésus comme l’accomplissement de ces deux promesses : le bon berger qui donne sa vie (Jn 10.11), le grand pasteur ramené d’entre les morts (He 13.20), le souverain pasteur qui paraîtra (1 P 5.4), et l’Agneau qui paîtra son peuple et le conduira aux sources des eaux de la vie (Ap 7.17).',
    },
    'psalm-23:c:david': {
      label: 'David et le titre « Cantique de David »',
      aliases: [
        'david',
        'psaume de david',
        'cantique de david',
        'auteur',
        'qui a écrit',
        'qui a écrit ce psaume',
        'titre',
        'suscription',
        'mizmor',
        'absalom',
        'quand a-t-il été écrit',
        'date',
      ],
      answer:
        'Le titre mizmôr lədāwid se lit d’ordinaire « Psaume de David » (la LSG : « Cantique de David »), bien que la préposition hébraïque puisse aussi signifier « pour » David ou « au sujet de » David ; l’introduction Tyndale invite donc à la prudence avant de traiter chacun de ces titres comme une indication d’auteur. Ceux qui y lisent l’œuvre de David lui-même la situent diversement : Calvin y lit les paroles de David au sommet de sa prospérité royale, Spurgeon et Maclaren imaginent le roi se retournant sur ses années de berger, et Franz Delitzsch (dans le commentaire de Keil et Delitzsch) la rattache à sa fuite devant Absalom (2 S 17.27–29). Le psaume lui-même ne mentionne aucune circonstance.',
    },
  },
};

export default overlay;
