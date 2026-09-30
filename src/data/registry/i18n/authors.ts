/**
 * Authors in Portuguese (Brazil), Spanish and French — an overlay over the English author
 * registry (base, shared, knowledge-base and confession registries, and the authors declared
 * by curated studies and topics), keyed by author id.
 *
 * Rules (docs/I18N.md):
 * - `name`: the conventional name in that language. Church Fathers, medieval doctors, reformers
 *   and ancient writers whose names are traditionally rendered get the localized form
 *   (Agostinho de Hipona / Agustín de Hipona / Augustin d’Hippone); modern people keep their
 *   own name (John Wesley, Timothy Keller, C. S. Lewis).
 * - `shortName`: the compact form used in citations and chat prose (Agostinho, Calvino, Luther).
 * - `tradition`, `description`: faithful translations of the English registry — no new facts.
 *   Established translated titles of classical, patristic and confessional works are used
 *   (Confissões, Institución de la religión cristiana, Contre les hérésies); modern works keep
 *   their cited titles (Knowing God, The Reason for God).
 * - `lifespan`: only when the English lifespan carries words ("b. 1946", "c. 347–407",
 *   "2nd century"), written with the conventions of `localizeYear` (pt/es “c.”, fr “v.”).
 * - `aliases`: extra lowercase names readers type in that language ("santo agostinho").
 *   The name and short name are aliases already.
 * - `en`: the English registry name the entry translates (checked by the tests, so a renamed
 *   English author cannot silently keep a stale translation).
 *
 * French strings use a no-break space (U+00A0) before ; : ? ! and inside « », as the French
 * curated overlays do.
 */
import type { NonEnglishLocale } from '../../../domain/bookNames';

export interface LocalizedAuthor {
  name: string;
  shortName: string;
  tradition: string;
  description: string;
  lifespan?: string;
  aliases?: string[];
}

export type AuthorTranslation = {
  en: string;
  /**
   * The name is a description ("Continuators of Matthew Henry"), not a name readers type to ask
   * about someone: its translations are display labels only, not chat aliases.
   */
  descriptive?: true;
} & Record<NonEnglishLocale, LocalizedAuthor>;

export const AUTHOR_TRANSLATIONS: Readonly<Record<string, AuthorTranslation>> = {
  /* ---------------------------------------------------------------- */
  /* Base registry                                                     */
  /* ---------------------------------------------------------------- */
  augustine: {
    en: 'Augustine of Hippo',
    pt: {
      name: 'Agostinho de Hipona',
      shortName: 'Agostinho',
      tradition: 'Padre latino da Igreja',
      description:
        'Bispo de Hipona, no norte da África. Suas Confissões, A Cidade de Deus e seus escritos contra Pelágio moldaram a compreensão da igreja ocidental sobre o pecado e a graça.',
      aliases: ['santo agostinho'],
    },
    es: {
      name: 'Agustín de Hipona',
      shortName: 'Agustín',
      tradition: 'Padre latino de la Iglesia',
      description:
        'Obispo de Hipona, en el norte de África. Sus Confesiones, La ciudad de Dios y sus escritos contra Pelagio moldearon la comprensión del pecado y de la gracia en la Iglesia occidental.',
      aliases: ['san agustín'],
    },
    fr: {
      name: 'Augustin d’Hippone',
      shortName: 'Augustin',
      tradition: 'Père latin de l’Église',
      description:
        'Évêque d’Hippone en Afrique du Nord. Ses Confessions, La Cité de Dieu et ses écrits contre Pélage ont façonné la compréhension du péché et de la grâce dans l’Église d’Occident.',
      aliases: ['saint augustin'],
    },
  },
  chrysostom: {
    en: 'John Chrysostom',
    pt: {
      name: 'João Crisóstomo',
      shortName: 'Crisóstomo',
      tradition: 'Padre grego da Igreja',
      lifespan: 'c. 347–407',
      description:
        'Arcebispo de Constantinopla e o pregador mais célebre da igreja antiga; suas homilias expõem livros inteiros do Novo Testamento.',
      aliases: ['são joão crisóstomo'],
    },
    es: {
      name: 'Juan Crisóstomo',
      shortName: 'Crisóstomo',
      tradition: 'Padre griego de la Iglesia',
      lifespan: 'c. 347–407',
      description:
        'Arzobispo de Constantinopla y el predicador más célebre de la Iglesia antigua; sus homilías exponen libros enteros del Nuevo Testamento.',
      aliases: ['san juan crisóstomo'],
    },
    fr: {
      name: 'Jean Chrysostome',
      shortName: 'Chrysostome',
      tradition: 'Père grec de l’Église',
      lifespan: 'v. 347–407',
      description:
        'Archevêque de Constantinople et le prédicateur le plus célèbre de l’Église ancienne ; ses homélies commentent des livres entiers du Nouveau Testament.',
      aliases: ['saint jean chrysostome'],
    },
  },
  athanasius: {
    en: 'Athanasius of Alexandria',
    pt: {
      name: 'Atanásio de Alexandria',
      shortName: 'Atanásio',
      tradition: 'Padre grego da Igreja',
      lifespan: 'c. 296–373',
      description:
        'Bispo de Alexandria e principal defensor da confissão nicena da plena divindade de Cristo contra o arianismo; autor de A Encarnação do Verbo.',
      aliases: ['santo atanásio'],
    },
    es: {
      name: 'Atanasio de Alejandría',
      shortName: 'Atanasio',
      tradition: 'Padre griego de la Iglesia',
      lifespan: 'c. 296–373',
      description:
        'Obispo de Alejandría y principal defensor de la confesión nicena de la plena divinidad de Cristo frente al arrianismo; autor de La encarnación del Verbo.',
      aliases: ['san atanasio'],
    },
    fr: {
      name: 'Athanase d’Alexandrie',
      shortName: 'Athanase',
      tradition: 'Père grec de l’Église',
      lifespan: 'v. 296–373',
      description:
        'Évêque d’Alexandrie et principal défenseur de la confession nicéenne de la pleine divinité du Christ contre l’arianisme ; auteur de Sur l’incarnation du Verbe.',
      aliases: ['saint athanase'],
    },
  },
  aquinas: {
    en: 'Thomas Aquinas',
    pt: {
      name: 'Tomás de Aquino',
      shortName: 'Tomás de Aquino',
      tradition: 'Católico (dominicano)',
      description:
        'Frade dominicano italiano cuja Suma Teológica continua fundamental para a teologia católica, inclusive seu tratado sobre a graça.',
      aliases: ['são tomás de aquino', 'santo tomás de aquino', 'aquino'],
    },
    es: {
      name: 'Tomás de Aquino',
      shortName: 'Tomás de Aquino',
      tradition: 'Católico (dominico)',
      description:
        'Fraile dominico italiano cuya Suma teológica sigue siendo fundamental para la teología católica, incluido su tratado sobre la gracia.',
      aliases: ['santo tomás de aquino', 'aquino'],
    },
    fr: {
      name: 'Thomas d’Aquin',
      shortName: 'Thomas d’Aquin',
      tradition: 'Catholique (dominicain)',
      description:
        'Frère dominicain italien dont la Somme théologique demeure fondamentale pour la théologie catholique, y compris son traité de la grâce.',
      aliases: ['saint thomas d’aquin'],
    },
  },
  luther: {
    en: 'Martin Luther',
    pt: {
      name: 'Martinho Lutero',
      shortName: 'Lutero',
      tradition: 'Luterano',
      description:
        'Reformador alemão cuja redescoberta da justificação somente pela fé deu início à Reforma Protestante; traduziu a Bíblia para o alemão.',
    },
    es: {
      name: 'Martín Lutero',
      shortName: 'Lutero',
      tradition: 'Luterano',
      description:
        'Reformador alemán cuyo redescubrimiento de la justificación solo por la fe desencadenó la Reforma protestante; tradujo la Biblia al alemán.',
      aliases: ['martin lutero'],
    },
    fr: {
      name: 'Martin Luther',
      shortName: 'Luther',
      tradition: 'Luthérien',
      description:
        'Réformateur allemand dont la redécouverte de la justification par la foi seule a déclenché la Réforme protestante ; il a traduit la Bible en allemand.',
    },
  },
  calvin: {
    en: 'John Calvin',
    pt: {
      name: 'João Calvino',
      shortName: 'Calvino',
      tradition: 'Reformado',
      description:
        'Reformador francês em Genebra, autor das Institutas da Religião Cristã e de comentários sobre a maioria dos livros da Bíblia.',
    },
    es: {
      name: 'Juan Calvino',
      shortName: 'Calvino',
      tradition: 'Reformado',
      description:
        'Reformador francés en Ginebra, autor de la Institución de la religión cristiana y de comentarios sobre la mayoría de los libros de la Biblia.',
    },
    fr: {
      name: 'Jean Calvin',
      shortName: 'Calvin',
      tradition: 'Réformé',
      description:
        'Réformateur français à Genève, auteur de l’Institution de la religion chrétienne et de commentaires sur la plupart des livres de la Bible.',
    },
  },
  'john-owen': {
    en: 'John Owen',
    pt: {
      name: 'John Owen',
      shortName: 'Owen',
      tradition: 'Reformado (puritano inglês)',
      description:
        'Teólogo puritano inglês e vice-reitor da Universidade de Oxford, que escreveu com profundidade sobre o pecado, a graça, a comunhão com Deus e o Espírito Santo.',
      aliases: ['joão owen'],
    },
    es: {
      name: 'John Owen',
      shortName: 'Owen',
      tradition: 'Reformado (puritano inglés)',
      description:
        'Teólogo puritano inglés y vicecanciller de la Universidad de Oxford, que escribió con hondura sobre el pecado, la gracia, la comunión con Dios y el Espíritu Santo.',
    },
    fr: {
      name: 'John Owen',
      shortName: 'Owen',
      tradition: 'Réformé (puritain anglais)',
      description:
        'Théologien puritain anglais et vice-chancelier de l’université d’Oxford, qui a écrit de façon pénétrante sur le péché, la grâce, la communion avec Dieu et le Saint-Esprit.',
    },
  },
  'matthew-henry': {
    en: 'Matthew Henry',
    pt: {
      name: 'Matthew Henry',
      shortName: 'Henry',
      tradition: 'Presbiteriano inglês (não conformista)',
      description:
        'Ministro não conformista nascido no País de Gales, cujo comentário devocional Commentary on the Whole Bible continua sendo publicado há três séculos.',
    },
    es: {
      name: 'Matthew Henry',
      shortName: 'Henry',
      tradition: 'Presbiteriano inglés (no conformista)',
      description:
        'Ministro no conformista nacido en Gales, cuyo comentario devocional Commentary on the Whole Bible se sigue publicando desde hace tres siglos.',
    },
    fr: {
      name: 'Matthew Henry',
      shortName: 'Henry',
      tradition: 'Presbytérien anglais (non-conformiste)',
      description:
        'Pasteur non-conformiste né au pays de Galles, dont le commentaire dévotionnel Commentary on the Whole Bible n’a pas cessé d’être réimprimé depuis trois siècles.',
    },
  },
  'john-gill': {
    en: 'John Gill',
    pt: {
      name: 'John Gill',
      shortName: 'Gill',
      tradition: 'Batista particular',
      description:
        'Pastor batista em Londres e hebraísta; o primeiro batista a escrever um comentário versículo por versículo de toda a Bíblia.',
    },
    es: {
      name: 'John Gill',
      shortName: 'Gill',
      tradition: 'Bautista particular',
      description:
        'Pastor bautista en Londres y hebraísta; el primer bautista que escribió un comentario versículo por versículo de toda la Biblia.',
    },
    fr: {
      name: 'John Gill',
      shortName: 'Gill',
      tradition: 'Baptiste particulier',
      description:
        'Pasteur baptiste à Londres et hébraïsant ; le premier baptiste à écrire un commentaire verset par verset de toute la Bible.',
    },
  },
  wesley: {
    en: 'John Wesley',
    pt: {
      name: 'John Wesley',
      shortName: 'Wesley',
      tradition: 'Metodista (anglicano)',
      description:
        'Sacerdote anglicano e evangelista que liderou o avivamento metodista; seus sermões e as Explanatory Notes upon the New Testament definem a teologia wesleyana.',
      aliases: ['joão wesley'],
    },
    es: {
      name: 'John Wesley',
      shortName: 'Wesley',
      tradition: 'Metodista (anglicano)',
      description:
        'Sacerdote anglicano y evangelista que encabezó el avivamiento metodista; sus sermones y sus Explanatory Notes upon the New Testament definen la teología wesleyana.',
      aliases: ['juan wesley'],
    },
    fr: {
      name: 'John Wesley',
      shortName: 'Wesley',
      tradition: 'Méthodiste (anglican)',
      description:
        'Prêtre anglican et évangéliste qui a conduit le réveil méthodiste ; ses sermons et ses Explanatory Notes upon the New Testament définissent la théologie wesleyenne.',
      aliases: ['jean wesley'],
    },
  },
  edwards: {
    en: 'Jonathan Edwards',
    pt: {
      name: 'Jonathan Edwards',
      shortName: 'Edwards',
      tradition: 'Reformado (congregacionalista)',
      description: 'Pastor-teólogo e filósofo da Nova Inglaterra, figura central do Primeiro Grande Despertamento.',
    },
    es: {
      name: 'Jonathan Edwards',
      shortName: 'Edwards',
      tradition: 'Reformado (congregacionalista)',
      description: 'Pastor-teólogo y filósofo de Nueva Inglaterra, figura central del Primer Gran Despertar.',
    },
    fr: {
      name: 'Jonathan Edwards',
      shortName: 'Edwards',
      tradition: 'Réformé (congrégationaliste)',
      description: 'Pasteur-théologien et philosophe de Nouvelle-Angleterre, au centre du premier Grand Réveil.',
    },
  },
  'adam-clarke': {
    en: 'Adam Clarke',
    pt: {
      name: 'Adam Clarke',
      shortName: 'Clarke',
      tradition: 'Metodista',
      lifespan: 'c. 1760–1832',
      description:
        'Pregador e estudioso metodista nascido na Irlanda, cujo comentário bíblico em oito volumes levou cerca de quarenta anos para ser concluído.',
    },
    es: {
      name: 'Adam Clarke',
      shortName: 'Clarke',
      tradition: 'Metodista',
      lifespan: 'c. 1760–1832',
      description:
        'Predicador y erudito metodista nacido en Irlanda, cuyo comentario bíblico en ocho volúmenes tardó unos cuarenta años en completarse.',
    },
    fr: {
      name: 'Adam Clarke',
      shortName: 'Clarke',
      tradition: 'Méthodiste',
      lifespan: 'v. 1760–1832',
      description:
        'Prédicateur et érudit méthodiste né en Irlande, dont le commentaire biblique en huit volumes a demandé une quarantaine d’années de travail.',
    },
  },
  'jamieson-fausset-brown': {
    en: 'Jamieson, Fausset & Brown',
    pt: {
      name: 'Jamieson, Fausset & Brown',
      shortName: 'Jamieson, Fausset & Brown',
      tradition: 'Presbiteriana e anglicana',
      description:
        'Robert Jamieson e David Brown (presbiterianos escoceses) e A. R. Fausset (anglicano), autores de um comentário evangélico em um volume amplamente utilizado.',
    },
    es: {
      name: 'Jamieson, Fausset & Brown',
      shortName: 'Jamieson, Fausset & Brown',
      tradition: 'Presbiteriana y anglicana',
      description:
        'Robert Jamieson y David Brown (presbiterianos escoceses) y A. R. Fausset (anglicano), autores de un comentario evangélico en un solo volumen de amplio uso.',
    },
    fr: {
      name: 'Jamieson, Fausset & Brown',
      shortName: 'Jamieson, Fausset & Brown',
      tradition: 'Presbytérienne et anglicane',
      description:
        'Robert Jamieson et David Brown (presbytériens écossais) et A. R. Fausset (anglican), auteurs d’un commentaire évangélique en un volume largement utilisé.',
    },
  },
  'keil-delitzsch': {
    en: 'C. F. Keil & Franz Delitzsch',
    pt: {
      name: 'C. F. Keil & Franz Delitzsch',
      shortName: 'Keil & Delitzsch',
      tradition: 'Luteranos',
      description:
        'Estudiosos luteranos alemães do Antigo Testamento cujo comentário filológico da Bíblia Hebraica ainda é consultado.',
    },
    es: {
      name: 'C. F. Keil & Franz Delitzsch',
      shortName: 'Keil & Delitzsch',
      tradition: 'Luteranos',
      description:
        'Estudiosos luteranos alemanes del Antiguo Testamento cuyo comentario filológico de la Biblia hebrea todavía se consulta.',
    },
    fr: {
      name: 'C. F. Keil & Franz Delitzsch',
      shortName: 'Keil & Delitzsch',
      tradition: 'Luthériens',
      description:
        'Exégètes luthériens allemands de l’Ancien Testament dont le commentaire philologique de la Bible hébraïque est encore consulté.',
    },
  },
  spurgeon: {
    en: 'Charles H. Spurgeon',
    pt: {
      name: 'Charles H. Spurgeon',
      shortName: 'Spurgeon',
      tradition: 'Batista reformado',
      description:
        'Pastor do Metropolitan Tabernacle, em Londres, o “Príncipe dos Pregadores”; seus sermões e The Treasury of David estão em domínio público.',
    },
    es: {
      name: 'Charles H. Spurgeon',
      shortName: 'Spurgeon',
      tradition: 'Bautista reformado',
      description:
        'Pastor del Metropolitan Tabernacle de Londres, el «Príncipe de los predicadores»; sus sermones y The Treasury of David son de dominio público.',
    },
    fr: {
      name: 'Charles H. Spurgeon',
      shortName: 'Spurgeon',
      tradition: 'Baptiste réformé',
      description:
        'Pasteur du Metropolitan Tabernacle de Londres, le « prince des prédicateurs » ; ses sermons et The Treasury of David sont dans le domaine public.',
    },
  },
  'james-strong': {
    en: 'James Strong',
    pt: {
      name: 'James Strong',
      shortName: 'Strong',
      tradition: 'Metodista',
      description: 'Estudioso bíblico metodista norte-americano que compilou a Strong’s Exhaustive Concordance (1890).',
    },
    es: {
      name: 'James Strong',
      shortName: 'Strong',
      tradition: 'Metodista',
      description: 'Biblista metodista estadounidense que compiló la Strong’s Exhaustive Concordance (1890).',
    },
    fr: {
      name: 'James Strong',
      shortName: 'Strong',
      tradition: 'Méthodiste',
      description: 'Bibliste méthodiste américain qui a compilé la Strong’s Exhaustive Concordance (1890).',
    },
  },
  bonhoeffer: {
    en: 'Dietrich Bonhoeffer',
    pt: {
      name: 'Dietrich Bonhoeffer',
      shortName: 'Bonhoeffer',
      tradition: 'Luterano',
      description:
        'Pastor-teólogo alemão da Igreja Confessante, executado pelo regime nazista em 1945; autor de Discipleship (1937).',
    },
    es: {
      name: 'Dietrich Bonhoeffer',
      shortName: 'Bonhoeffer',
      tradition: 'Luterano',
      description:
        'Pastor-teólogo alemán de la Iglesia Confesante, ejecutado por el régimen nazi en 1945; autor de Discipleship (1937).',
    },
    fr: {
      name: 'Dietrich Bonhoeffer',
      shortName: 'Bonhoeffer',
      tradition: 'Luthérien',
      description:
        'Pasteur-théologien allemand de l’Église confessante, exécuté par le régime nazi en 1945 ; auteur de Discipleship (1937).',
    },
  },
  'cs-lewis': {
    en: 'C. S. Lewis',
    pt: {
      name: 'C. S. Lewis',
      shortName: 'Lewis',
      tradition: 'Anglicano',
      description:
        'Estudioso de literatura em Oxford e Cambridge e apologista leigo; autor de Mere Christianity, The Problem of Pain e The Chronicles of Narnia.',
    },
    es: {
      name: 'C. S. Lewis',
      shortName: 'Lewis',
      tradition: 'Anglicano',
      description:
        'Estudioso de la literatura en Oxford y Cambridge y apologista laico; autor de Mere Christianity, The Problem of Pain y The Chronicles of Narnia.',
    },
    fr: {
      name: 'C. S. Lewis',
      shortName: 'Lewis',
      tradition: 'Anglican',
      description:
        'Spécialiste de littérature à Oxford et à Cambridge et apologète laïc ; auteur de Mere Christianity, The Problem of Pain et The Chronicles of Narnia.',
    },
  },
  'billy-graham': {
    en: 'Billy Graham',
    pt: {
      name: 'Billy Graham',
      shortName: 'Graham',
      tradition: 'Evangélico (batista do Sul)',
      description:
        'Evangelista norte-americano cujas cruzadas alcançaram milhões de pessoas no mundo inteiro; autor de Peace with God (1953).',
    },
    es: {
      name: 'Billy Graham',
      shortName: 'Graham',
      tradition: 'Evangélico (bautista del Sur)',
      description:
        'Evangelista estadounidense cuyas cruzadas llegaron a millones de personas en todo el mundo; autor de Peace with God (1953).',
    },
    fr: {
      name: 'Billy Graham',
      shortName: 'Graham',
      tradition: 'Évangélique (baptiste du Sud)',
      description:
        'Évangéliste américain dont les campagnes d’évangélisation ont touché des millions de personnes dans le monde ; auteur de Peace with God (1953).',
    },
  },
  'john-stott': {
    en: 'John Stott',
    pt: {
      name: 'John Stott',
      shortName: 'Stott',
      tradition: 'Anglicano (evangélico)',
      description:
        'Reitor da All Souls Church, Langham Place, em Londres, principal arquiteto do Pacto de Lausanne (Lausanne Covenant, 1974) e autor de The Cross of Christ (1986).',
    },
    es: {
      name: 'John Stott',
      shortName: 'Stott',
      tradition: 'Anglicano (evangélico)',
      description:
        'Rector de All Souls Church, Langham Place, en Londres, principal artífice del Pacto de Lausana (Lausanne Covenant, 1974) y autor de The Cross of Christ (1986).',
    },
    fr: {
      name: 'John Stott',
      shortName: 'Stott',
      tradition: 'Anglican (évangélique)',
      description:
        'Recteur de l’église All Souls, Langham Place, à Londres, principal artisan du Lausanne Covenant (1974) et auteur de The Cross of Christ (1986).',
    },
  },
  'ji-packer': {
    en: 'J. I. Packer',
    pt: {
      name: 'J. I. Packer',
      shortName: 'Packer',
      tradition: 'Anglicano (evangélico reformado)',
      description: 'Teólogo nascido na Inglaterra que lecionou no Regent College, em Vancouver; autor de Knowing God (1973).',
    },
    es: {
      name: 'J. I. Packer',
      shortName: 'Packer',
      tradition: 'Anglicano (evangélico reformado)',
      description: 'Teólogo nacido en Inglaterra que enseñó en el Regent College de Vancouver; autor de Knowing God (1973).',
    },
    fr: {
      name: 'J. I. Packer',
      shortName: 'Packer',
      tradition: 'Anglican (évangélique réformé)',
      description: 'Théologien né en Angleterre qui a enseigné au Regent College de Vancouver ; auteur de Knowing God (1973).',
    },
  },
  'rc-sproul': {
    en: 'R. C. Sproul',
    pt: {
      name: 'R. C. Sproul',
      shortName: 'Sproul',
      tradition: 'Reformado (presbiteriano)',
      description: 'Teólogo norte-americano e fundador do Ligonier Ministries (1971); autor de The Holiness of God (1985).',
    },
    es: {
      name: 'R. C. Sproul',
      shortName: 'Sproul',
      tradition: 'Reformado (presbiteriano)',
      description: 'Teólogo estadounidense y fundador de Ligonier Ministries (1971); autor de The Holiness of God (1985).',
    },
    fr: {
      name: 'R. C. Sproul',
      shortName: 'Sproul',
      tradition: 'Réformé (presbytérien)',
      description: 'Théologien américain, fondateur de Ligonier Ministries (1971) ; auteur de The Holiness of God (1985).',
    },
  },
  'tim-keller': {
    en: 'Timothy Keller',
    pt: {
      name: 'Timothy Keller',
      shortName: 'Keller',
      tradition: 'Reformado (presbiteriano, PCA)',
      description:
        'Pastor fundador da Redeemer Presbyterian Church, em Nova York (1989); autor de The Reason for God e The Prodigal God (ambos de 2008).',
    },
    es: {
      name: 'Timothy Keller',
      shortName: 'Keller',
      tradition: 'Reformado (presbiteriano, PCA)',
      description:
        'Pastor fundador de la Redeemer Presbyterian Church de Nueva York (1989); autor de The Reason for God y The Prodigal God (ambos de 2008).',
    },
    fr: {
      name: 'Timothy Keller',
      shortName: 'Keller',
      tradition: 'Réformé (presbytérien, PCA)',
      description:
        'Pasteur fondateur de la Redeemer Presbyterian Church à New York (1989) ; auteur de The Reason for God et The Prodigal God (tous deux en 2008).',
    },
  },
  'john-piper': {
    en: 'John Piper',
    pt: {
      name: 'John Piper',
      shortName: 'Piper',
      tradition: 'Batista reformado',
      lifespan: 'n. 1946',
      description:
        'Pastor da Bethlehem Baptist Church, em Minneapolis (1980–2013), e fundador do Desiring God; autor de Desiring God (1986).',
    },
    es: {
      name: 'John Piper',
      shortName: 'Piper',
      tradition: 'Bautista reformado',
      lifespan: 'n. 1946',
      description:
        'Pastor de la Bethlehem Baptist Church de Minneapolis (1980–2013) y fundador de Desiring God; autor de Desiring God (1986).',
    },
    fr: {
      name: 'John Piper',
      shortName: 'Piper',
      tradition: 'Baptiste réformé',
      lifespan: 'né en 1946',
      description:
        'Pasteur de la Bethlehem Baptist Church à Minneapolis (1980–2013) et fondateur de Desiring God ; auteur de Desiring God (1986).',
    },
  },
  'nt-wright': {
    en: 'N. T. Wright',
    pt: {
      name: 'N. T. Wright',
      shortName: 'Wright',
      tradition: 'Anglicano',
      lifespan: 'n. 1948',
      description:
        'Estudioso do Novo Testamento e ex-bispo de Durham (2003–2010); autor de Paul and the Faithfulness of God (2013).',
    },
    es: {
      name: 'N. T. Wright',
      shortName: 'Wright',
      tradition: 'Anglicano',
      lifespan: 'n. 1948',
      description:
        'Estudioso del Nuevo Testamento y exobispo de Durham (2003–2010); autor de Paul and the Faithfulness of God (2013).',
    },
    fr: {
      name: 'N. T. Wright',
      shortName: 'Wright',
      tradition: 'Anglican',
      lifespan: 'né en 1948',
      description:
        'Spécialiste du Nouveau Testament et ancien évêque de Durham (2003–2010) ; auteur de Paul and the Faithfulness of God (2013).',
    },
  },
  'da-carson': {
    en: 'D. A. Carson',
    pt: {
      name: 'D. A. Carson',
      shortName: 'Carson',
      tradition: 'Evangélico (batista)',
      lifespan: 'n. 1946',
      description:
        'Estudioso do Novo Testamento na Trinity Evangelical Divinity School e cofundador da The Gospel Coalition; autor de The Gospel According to John (1991).',
    },
    es: {
      name: 'D. A. Carson',
      shortName: 'Carson',
      tradition: 'Evangélico (bautista)',
      lifespan: 'n. 1946',
      description:
        'Estudioso del Nuevo Testamento en la Trinity Evangelical Divinity School y cofundador de The Gospel Coalition; autor de The Gospel According to John (1991).',
    },
    fr: {
      name: 'D. A. Carson',
      shortName: 'Carson',
      tradition: 'Évangélique (baptiste)',
      lifespan: 'né en 1946',
      description:
        'Spécialiste du Nouveau Testament à la Trinity Evangelical Divinity School et cofondateur de The Gospel Coalition ; auteur de The Gospel According to John (1991).',
    },
  },

  /* ---------------------------------------------------------------- */
  /* Shared registry                                                   */
  /* ---------------------------------------------------------------- */
  irenaeus: {
    en: 'Irenaeus of Lyons',
    pt: {
      name: 'Ireneu de Lião',
      shortName: 'Ireneu',
      tradition: 'Padre grego da Igreja',
      lifespan: 'século II (m. depois de c. 191)',
      description:
        'Bispo de Lugdunum (Lyon), na Gália, originário de Esmirna, na Ásia Menor, que ouvira Policarpo pregar; sua obra Contra as Heresias (c. 180) combateu o gnosticismo e moldou a teologia cristã primitiva.',
      aliases: ['santo ireneu', 'ireneu de lyon', 'irineu', 'santo irineu', 'irineu de lião', 'irineu de lyon'],
    },
    es: {
      name: 'Ireneo de Lyon',
      shortName: 'Ireneo',
      tradition: 'Padre griego de la Iglesia',
      lifespan: 'siglo II (m. después de c. 191)',
      description:
        'Obispo de Lugdunum (Lyon), en la Galia, oriundo de Esmirna, en Asia Menor, que había oído predicar a Policarpo; su obra Contra las herejías (c. 180) combatió el gnosticismo y moldeó la teología cristiana primitiva.',
      aliases: ['san ireneo', 'ireneo de lión'],
    },
    fr: {
      name: 'Irénée de Lyon',
      shortName: 'Irénée',
      tradition: 'Père grec de l’Église',
      lifespan: 'IIe siècle (mort après v. 191)',
      description:
        'Évêque de Lugdunum (Lyon) en Gaule, originaire de Smyrne en Asie Mineure, qui avait entendu prêcher Polycarpe ; son Contre les hérésies (v. 180) combattit le gnosticisme et façonna la théologie chrétienne des premiers siècles.',
      aliases: ['saint irénée'],
    },
  },
  'john-of-damascus': {
    en: 'John of Damascus',
    pt: {
      name: 'João Damasceno',
      shortName: 'João Damasceno',
      tradition: 'Padre grego da Igreja (ortodoxo oriental)',
      lifespan: 'c. 675–749',
      description:
        'Monge de Mar Saba, perto de Jerusalém, e defensor dos ícones, cuja Fonte do Conhecimento, que inclui a Exposição Exata da Fé Ortodoxa, sintetizou a teologia patrística grega.',
      aliases: ['são joão damasceno', 'joão de damasco', 'damasceno'],
    },
    es: {
      name: 'Juan Damasceno',
      shortName: 'Juan Damasceno',
      tradition: 'Padre griego de la Iglesia (ortodoxo oriental)',
      lifespan: 'c. 675–749',
      description:
        'Monje de Mar Saba, cerca de Jerusalén, y defensor de los iconos, cuya Fuente del conocimiento, que incluye la Exposición exacta de la fe ortodoxa, resumió la teología patrística griega.',
      aliases: ['san juan damasceno', 'juan de damasco', 'damasceno'],
    },
    fr: {
      name: 'Jean Damascène',
      shortName: 'Jean Damascène',
      tradition: 'Père grec de l’Église (orthodoxe)',
      lifespan: 'v. 675–749',
      description:
        'Moine de Mar Saba près de Jérusalem et défenseur des icônes, dont La Source de la connaissance, qui comprend l’Exposition exacte de la foi orthodoxe, résume la théologie patristique grecque.',
      aliases: ['saint jean damascène', 'jean de damas'],
    },
  },
  'jacobus-arminius': {
    en: 'Jacobus Arminius',
    pt: {
      name: 'Jacó Armínio',
      shortName: 'Armínio',
      tradition: 'Reformado holandês (remonstrante)',
      description:
        'Teólogo holandês em Leiden cujos seguidores, após sua morte, publicaram a Remonstrância de 1610 sobre a eleição e a graça; é dele que a teologia arminiana recebe o nome.',
      aliases: ['jacobus armínio'],
    },
    es: {
      name: 'Jacobo Arminio',
      shortName: 'Arminio',
      tradition: 'Reformado neerlandés (remonstrante)',
      description:
        'Teólogo neerlandés en Leiden cuyos seguidores, tras su muerte, publicaron la Remonstrancia de 1610 sobre la elección y la gracia; de él recibe su nombre la teología arminiana.',
    },
    fr: {
      name: 'Jacobus Arminius',
      shortName: 'Arminius',
      tradition: 'Réformé néerlandais (remontrant)',
      description:
        'Théologien néerlandais à Leyde dont les disciples publièrent après sa mort la Remontrance de 1610 sur l’élection et la grâce ; la théologie arminienne tient de lui son nom.',
      aliases: ['jacques arminius'],
    },
  },
  'john-evans': {
    en: 'John Evans',
    pt: {
      name: 'John Evans',
      shortName: 'Evans',
      tradition: 'Presbiteriano inglês (não conformista)',
      lifespan: 'c. 1680–1730',
      description:
        'Ministro presbiteriano nascido no País de Gales que sucedeu Daniel Williams em Hand Alley, Londres, em 1716; após a morte de Matthew Henry, escreveu a exposição de Romanos que completou o comentário de Henry.',
    },
    es: {
      name: 'John Evans',
      shortName: 'Evans',
      tradition: 'Presbiteriano inglés (no conformista)',
      lifespan: 'c. 1680–1730',
      description:
        'Ministro presbiteriano nacido en Gales que sucedió a Daniel Williams en Hand Alley, Londres, en 1716; tras la muerte de Matthew Henry escribió la exposición de Romanos que completó el comentario de Henry.',
    },
    fr: {
      name: 'John Evans',
      shortName: 'Evans',
      tradition: 'Presbytérien anglais (non-conformiste)',
      lifespan: 'v. 1680–1730',
      description:
        'Pasteur presbytérien né au pays de Galles qui succéda à Daniel Williams à Hand Alley, à Londres, en 1716 ; après la mort de Matthew Henry, il écrivit l’exposition de l’épître aux Romains qui compléta le commentaire de Henry.',
    },
  },
  'daniel-mayo': {
    en: 'Daniel Mayo',
    pt: {
      name: 'Daniel Mayo',
      shortName: 'Mayo',
      tradition: 'Presbiteriano inglês (não conformista)',
      lifespan: 'c. 1672–1733',
      description:
        'Ministro presbiteriano em Kingston upon Thames e depois em Hackney e Silver Street, Londres; após a morte de Matthew Henry, em 1714, escreveu a exposição de 2 Coríntios e 1–2 Tessalonicenses que completou o comentário de Henry.',
    },
    es: {
      name: 'Daniel Mayo',
      shortName: 'Mayo',
      tradition: 'Presbiteriano inglés (no conformista)',
      lifespan: 'c. 1672–1733',
      description:
        'Ministro presbiteriano en Kingston upon Thames y después en Hackney y Silver Street, Londres; tras la muerte de Matthew Henry en 1714 escribió la exposición de 2 Corintios y 1–2 Tesalonicenses que completó el comentario de Henry.',
    },
    fr: {
      name: 'Daniel Mayo',
      shortName: 'Mayo',
      tradition: 'Presbytérien anglais (non-conformiste)',
      lifespan: 'v. 1672–1733',
      description:
        'Pasteur presbytérien à Kingston upon Thames, puis à Hackney et à Silver Street, à Londres ; après la mort de Matthew Henry en 1714, il écrivit l’exposition de 2 Corinthiens et de 1–2 Thessaloniciens qui compléta le commentaire de Henry.',
    },
  },
  'charles-hodge': {
    en: 'Charles Hodge',
    pt: {
      name: 'Charles Hodge',
      shortName: 'Hodge',
      tradition: 'Reformado (presbiteriano)',
      description: 'Diretor do Princeton Theological Seminary e autor de uma Systematic Theology em três volumes (1871–1873).',
    },
    es: {
      name: 'Charles Hodge',
      shortName: 'Hodge',
      tradition: 'Reformado (presbiteriano)',
      description: 'Director del Princeton Theological Seminary y autor de una Systematic Theology en tres volúmenes (1871–1873).',
    },
    fr: {
      name: 'Charles Hodge',
      shortName: 'Hodge',
      tradition: 'Réformé (presbytérien)',
      description: 'Directeur du Princeton Theological Seminary et auteur d’une Systematic Theology en trois volumes (1871–1873).',
    },
  },
  'bb-warfield': {
    en: 'B. B. Warfield',
    pt: {
      name: 'B. B. Warfield',
      shortName: 'Warfield',
      tradition: 'Reformado (presbiteriano)',
      description:
        'Professor de teologia no Princeton Theological Seminary e um dos principais defensores da ortodoxia reformada e da inerrância bíblica.',
    },
    es: {
      name: 'B. B. Warfield',
      shortName: 'Warfield',
      tradition: 'Reformado (presbiteriano)',
      description:
        'Profesor de teología en el Princeton Theological Seminary y uno de los principales defensores de la ortodoxia reformada y de la inerrancia bíblica.',
    },
    fr: {
      name: 'B. B. Warfield',
      shortName: 'Warfield',
      tradition: 'Réformé (presbytérien)',
      description:
        'Professeur de théologie au Princeton Theological Seminary et l’un des principaux défenseurs de l’orthodoxie réformée et de l’inerrance biblique.',
    },
  },

  /* ---------------------------------------------------------------- */
  /* Knowledge-base registry                                           */
  /* ---------------------------------------------------------------- */
  'orville-nave': {
    en: 'Orville J. Nave',
    pt: {
      name: 'Orville J. Nave',
      shortName: 'Nave',
      tradition: 'Metodista',
      description:
        'Ministro metodista norte-americano e capelão do Exército dos Estados Unidos, mais conhecido por ter compilado a Nave’s Topical Bible (1896).',
    },
    es: {
      name: 'Orville J. Nave',
      shortName: 'Nave',
      tradition: 'Metodista',
      description:
        'Ministro metodista estadounidense y capellán del Ejército de los Estados Unidos, conocido sobre todo por haber compilado la Nave’s Topical Bible (1896).',
    },
    fr: {
      name: 'Orville J. Nave',
      shortName: 'Nave',
      tradition: 'Méthodiste',
      description:
        'Pasteur méthodiste américain et aumônier de l’armée des États-Unis, surtout connu pour avoir compilé la Nave’s Topical Bible (1896).',
    },
  },
  'ra-torrey': {
    en: 'R. A. Torrey',
    pt: {
      name: 'R. A. Torrey',
      shortName: 'Torrey',
      tradition: 'Evangélico (congregacionalista)',
      description:
        'Evangelista norte-americano, pastor congregacional, educador e escritor; compilador do New Topical Textbook (1897).',
    },
    es: {
      name: 'R. A. Torrey',
      shortName: 'Torrey',
      tradition: 'Evangélico (congregacionalista)',
      description:
        'Evangelista estadounidense, pastor congregacional, educador y escritor; compilador del New Topical Textbook (1897).',
    },
    fr: {
      name: 'R. A. Torrey',
      shortName: 'Torrey',
      tradition: 'Évangélique (congrégationaliste)',
      description:
        'Évangéliste américain, pasteur congrégationaliste, éducateur et écrivain ; compilateur du New Topical Textbook (1897).',
    },
  },
  'mg-easton': {
    en: 'M. G. Easton',
    pt: {
      name: 'M. G. Easton',
      shortName: 'Easton',
      tradition: 'Presbiteriano escocês',
      description:
        'Matthew George Easton, ministro e escritor presbiteriano escocês cujo Illustrated Bible Dictionary (1893) é conhecido, nas edições posteriores, como Easton’s Bible Dictionary.',
    },
    es: {
      name: 'M. G. Easton',
      shortName: 'Easton',
      tradition: 'Presbiteriano escocés',
      description:
        'Matthew George Easton, ministro y escritor presbiteriano escocés cuyo Illustrated Bible Dictionary (1893) se conoce, en sus ediciones posteriores, como Easton’s Bible Dictionary.',
    },
    fr: {
      name: 'M. G. Easton',
      shortName: 'Easton',
      tradition: 'Presbytérien écossais',
      description:
        'Matthew George Easton, pasteur et écrivain presbytérien écossais dont l’Illustrated Bible Dictionary (1893) est connu, dans ses éditions ultérieures, sous le nom d’Easton’s Bible Dictionary.',
    },
  },
  'william-smith-lexicographer': {
    en: 'William Smith',
    pt: {
      name: 'William Smith',
      shortName: 'William Smith',
      tradition: 'Classicista e lexicógrafo inglês',
      description:
        'Sir William Smith, lexicógrafo inglês e editor de obras de referência clássicas e bíblicas, entre elas o Dictionary of the Bible (1860–1863), do qual deriva o Smith’s Bible Dictionary.',
    },
    es: {
      name: 'William Smith',
      shortName: 'William Smith',
      tradition: 'Filólogo clásico y lexicógrafo inglés',
      description:
        'Sir William Smith, lexicógrafo inglés y editor de obras de consulta clásicas y bíblicas, entre ellas el Dictionary of the Bible (1860–1863), del que deriva el Smith’s Bible Dictionary.',
    },
    fr: {
      name: 'William Smith',
      shortName: 'William Smith',
      tradition: 'Philologue classique et lexicographe anglais',
      description:
        'Sir William Smith, lexicographe anglais et éditeur d’ouvrages de référence classiques et bibliques, parmi lesquels le Dictionary of the Bible (1860–1863), d’où dérive le Smith’s Bible Dictionary.',
    },
  },
  'tyndale-house-publishers': {
    en: 'Tyndale House Publishers',
    pt: {
      name: 'Tyndale House Publishers',
      shortName: 'Tyndale',
      tradition: 'Evangélica (editora)',
      lifespan: 'fundada em 1962',
      description:
        'Editora cristã em Carol Stream, Illinois, fundada em 1962 por Kenneth N. Taylor; publicou as Tyndale Open Study Notes, escritas por estudiosos evangélicos, sob a licença CC BY-SA 4.0.',
    },
    es: {
      name: 'Tyndale House Publishers',
      shortName: 'Tyndale',
      tradition: 'Evangélica (editorial)',
      lifespan: 'fundada en 1962',
      description:
        'Editorial cristiana con sede en Carol Stream, Illinois, fundada en 1962 por Kenneth N. Taylor; publicó las Tyndale Open Study Notes, escritas por estudiosos evangélicos, bajo la licencia CC BY-SA 4.0.',
    },
    fr: {
      name: 'Tyndale House Publishers',
      shortName: 'Tyndale',
      tradition: 'Évangélique (maison d’édition)',
      lifespan: 'fondée en 1962',
      description:
        'Maison d’édition chrétienne de Carol Stream (Illinois), fondée en 1962 par Kenneth N. Taylor ; elle a publié les Tyndale Open Study Notes, rédigées par des spécialistes évangéliques, sous licence CC BY-SA 4.0.',
    },
  },
  'henry-continuators': {
    en: 'Continuators of Matthew Henry',
    descriptive: true,
    pt: {
      name: 'Continuadores de Matthew Henry',
      shortName: 'continuadores de Henry',
      tradition: 'Não conformistas ingleses',
      lifespan: 'ativos entre 1714 e 1721',
      description:
        'Os ministros não conformistas que completaram o Commentary on the Whole Bible de Matthew Henry (de Romanos a Apocalipse) após a morte dele, em 1714, trabalhando em parte a partir de suas anotações. Usado quando o Emmaus não registra qual deles escreveu determinado livro.',
    },
    es: {
      name: 'Continuadores de Matthew Henry',
      shortName: 'continuadores de Henry',
      tradition: 'No conformistas ingleses',
      lifespan: 'activos entre 1714 y 1721',
      description:
        'Los ministros no conformistas que completaron el Commentary on the Whole Bible de Matthew Henry (de Romanos a Apocalipsis) tras su muerte en 1714, trabajando en parte a partir de sus notas. Se usa cuando Emmaus no registra cuál de ellos escribió un libro determinado.',
    },
    fr: {
      name: 'Continuateurs de Matthew Henry',
      shortName: 'continuateurs de Henry',
      tradition: 'Non-conformistes anglais',
      lifespan: 'actifs entre 1714 et 1721',
      description:
        'Les pasteurs non-conformistes qui achevèrent le Commentary on the Whole Bible de Matthew Henry (de Romains à l’Apocalypse) après sa mort en 1714, en partie à partir de ses notes. Utilisé lorsque Emmaus n’indique pas lequel d’entre eux a rédigé tel livre.',
    },
  },

  /* ---------------------------------------------------------------- */
  /* Curated studies and topics                                        */
  /* ---------------------------------------------------------------- */
  'john-newton': {
    en: 'John Newton',
    pt: {
      name: 'John Newton',
      shortName: 'Newton',
      tradition: 'Anglicano (evangélico)',
      description:
        'Clérigo anglicano evangélico inglês e, mais tarde, opositor do tráfico de escravos, que antes havia comandado navios negreiros; autor do hino hoje conhecido como “Amazing Grace”.',
    },
    es: {
      name: 'John Newton',
      shortName: 'Newton',
      tradition: 'Anglicano (evangélico)',
      description:
        'Clérigo anglicano evangélico inglés y, más tarde, opositor de la trata de esclavos, que antes había capitaneado barcos negreros; autor del himno hoy conocido como «Amazing Grace».',
    },
    fr: {
      name: 'John Newton',
      shortName: 'Newton',
      tradition: 'Anglican (évangélique)',
      description:
        'Ecclésiastique anglican évangélique anglais, devenu plus tard adversaire de la traite des esclaves après avoir commandé des navires négriers ; auteur du cantique aujourd’hui connu sous le titre « Amazing Grace ».',
    },
  },
  'vladimir-lossky': {
    en: 'Vladimir Lossky',
    pt: {
      name: 'Vladimir Lossky',
      shortName: 'Lossky',
      tradition: 'Ortodoxo oriental (russo)',
      description:
        'Teólogo ortodoxo russo da emigração em Paris, nascido em Göttingen e criado em São Petersburgo, que lecionou teologia dogmática em Paris; sua Mystical Theology of the Eastern Church (1944) tornou-se uma exposição de referência da teologia ortodoxa.',
    },
    es: {
      name: 'Vladimir Lossky',
      shortName: 'Lossky',
      tradition: 'Ortodoxo oriental (ruso)',
      description:
        'Teólogo ortodoxo ruso de la emigración en París, nacido en Gotinga y criado en San Petersburgo, que enseñó teología dogmática en París; su Mystical Theology of the Eastern Church (1944) llegó a ser una exposición de referencia de la teología ortodoxa.',
    },
    fr: {
      name: 'Vladimir Lossky',
      shortName: 'Lossky',
      tradition: 'Orthodoxe (russe)',
      description:
        'Théologien orthodoxe russe de l’émigration parisienne, né à Göttingen et élevé à Saint-Pétersbourg, qui enseigna la théologie dogmatique à Paris ; sa Mystical Theology of the Eastern Church (1944) est devenue un exposé de référence de la théologie orthodoxe.',
    },
  },
  'robert-barclay': {
    en: 'Robert Barclay',
    pt: {
      name: 'Robert Barclay',
      shortName: 'Barclay',
      tradition: 'Quacre (Sociedade Religiosa dos Amigos)',
      description:
        'Escritor quacre escocês cuja Apology for the True Christian Divinity (em latim, 1676; em inglês, 1678) expôs e defendeu os princípios dos primeiros quacres.',
    },
    es: {
      name: 'Robert Barclay',
      shortName: 'Barclay',
      tradition: 'Cuáquero (Sociedad Religiosa de los Amigos)',
      description:
        'Escritor cuáquero escocés cuya Apology for the True Christian Divinity (en latín, 1676; en inglés, 1678) expuso y defendió los principios de los primeros cuáqueros.',
    },
    fr: {
      name: 'Robert Barclay',
      shortName: 'Barclay',
      tradition: 'Quaker (Société religieuse des Amis)',
      description:
        'Écrivain quaker écossais dont l’Apology for the True Christian Divinity (en latin en 1676, en anglais en 1678) exposa et défendit les principes des premiers quakers.',
    },
  },
  'david-desilva': {
    en: 'David A. deSilva',
    pt: {
      name: 'David A. deSilva',
      shortName: 'deSilva',
      tradition: 'Estudioso do Novo Testamento (Ashland Theological Seminary)',
      description: 'Estudioso do Novo Testamento conhecido por seus trabalhos sobre o mundo social e cultural do cristianismo primitivo.',
    },
    es: {
      name: 'David A. deSilva',
      shortName: 'deSilva',
      tradition: 'Estudioso del Nuevo Testamento (Ashland Theological Seminary)',
      description: 'Estudioso del Nuevo Testamento conocido por sus trabajos sobre el mundo social y cultural del cristianismo primitivo.',
    },
    fr: {
      name: 'David A. deSilva',
      shortName: 'deSilva',
      tradition: 'Spécialiste du Nouveau Testament (Ashland Theological Seminary)',
      description: 'Spécialiste du Nouveau Testament connu pour ses travaux sur le monde social et culturel du christianisme ancien.',
    },
  },
  'john-barclay': {
    en: 'John M. G. Barclay',
    pt: {
      name: 'John M. G. Barclay',
      shortName: 'Barclay',
      tradition: 'Estudioso do Novo Testamento (Universidade de Durham)',
      lifespan: 'n. 1958',
      description:
        'Estudioso britânico do Novo Testamento, titular da cátedra Lightfoot de Teologia (Lightfoot Professor of Divinity) na Universidade de Durham de 2003 a 2025; autor de Paul and the Gift (2015).',
    },
    es: {
      name: 'John M. G. Barclay',
      shortName: 'Barclay',
      tradition: 'Estudioso del Nuevo Testamento (Universidad de Durham)',
      lifespan: 'n. 1958',
      description:
        'Estudioso británico del Nuevo Testamento, titular de la cátedra Lightfoot de Teología (Lightfoot Professor of Divinity) en la Universidad de Durham de 2003 a 2025; autor de Paul and the Gift (2015).',
    },
    fr: {
      name: 'John M. G. Barclay',
      shortName: 'Barclay',
      tradition: 'Spécialiste du Nouveau Testament (université de Durham)',
      lifespan: 'né en 1958',
      description:
        'Spécialiste britannique du Nouveau Testament, titulaire de la chaire Lightfoot de théologie (Lightfoot Professor of Divinity) à l’université de Durham de 2003 à 2025 ; auteur de Paul and the Gift (2015).',
    },
  },
  eusebius: {
    en: 'Eusebius of Caesarea',
    pt: {
      name: 'Eusébio de Cesareia',
      shortName: 'Eusébio',
      tradition: 'Padre grego da Igreja',
      lifespan: 'c. 260/265–339',
      description:
        'Bispo de Cesareia, na Palestina, a partir de cerca de 314, e historiador do cristianismo primitivo, cuja História Eclesiástica cita muitos escritores anteriores, entre eles Pápias.',
    },
    es: {
      name: 'Eusebio de Cesarea',
      shortName: 'Eusebio',
      tradition: 'Padre griego de la Iglesia',
      lifespan: 'c. 260/265–339',
      description:
        'Obispo de Cesarea, en Palestina, desde hacia el año 314 e historiador del cristianismo primitivo, cuya Historia eclesiástica cita a muchos escritores anteriores, entre ellos Papías.',
    },
    fr: {
      name: 'Eusèbe de Césarée',
      shortName: 'Eusèbe',
      tradition: 'Père grec de l’Église',
      lifespan: 'v. 260/265–339',
      description:
        'Évêque de Césarée en Palestine à partir de 314 environ et historien du christianisme ancien, dont l’Histoire ecclésiastique cite de nombreux auteurs antérieurs, parmi lesquels Papias.',
    },
  },
  theodoret: {
    en: 'Theodoret of Cyrrhus',
    pt: {
      name: 'Teodoreto de Ciro',
      shortName: 'Teodoreto',
      tradition: 'Padre grego da Igreja',
      description:
        'Bispo de Ciro, na Síria, no século V, cuja História Eclesiástica preserva documentos da controvérsia ariana.',
    },
    es: {
      name: 'Teodoreto de Ciro',
      shortName: 'Teodoreto',
      tradition: 'Padre griego de la Iglesia',
      description:
        'Obispo de Ciro, en Siria, en el siglo V, cuya Historia eclesiástica conserva documentos de la controversia arriana.',
    },
    fr: {
      name: 'Théodoret de Cyr',
      shortName: 'Théodoret',
      tradition: 'Père grec de l’Église',
      description:
        'Évêque de Cyr en Syrie au Ve siècle, dont l’Histoire ecclésiastique conserve des documents de la controverse arienne.',
    },
  },
  philo: {
    en: 'Philo of Alexandria',
    pt: {
      name: 'Fílon de Alexandria',
      shortName: 'Fílon',
      tradition: 'Judaísmo helenístico',
      lifespan: 'c. 20 a.C. – c. 50 d.C.',
      description:
        'Filósofo judeu de Alexandria que interpretou as Escrituras em diálogo com a filosofia grega, inclusive com uma ideia desenvolvida do Logos.',
    },
    es: {
      name: 'Filón de Alejandría',
      shortName: 'Filón',
      tradition: 'Judaísmo helenístico',
      lifespan: 'c. 20 a. C. – c. 50 d. C.',
      description:
        'Filósofo judío de Alejandría que interpretó las Escrituras en diálogo con la filosofía griega, incluida una idea desarrollada del Logos.',
    },
    fr: {
      name: 'Philon d’Alexandrie',
      shortName: 'Philon',
      tradition: 'Judaïsme hellénistique',
      lifespan: 'v. 20 av. J.-C. – v. 50 apr. J.-C.',
      description:
        'Philosophe juif d’Alexandrie qui interpréta les Écritures en dialogue avec la philosophie grecque, notamment au moyen d’une conception élaborée du Logos.',
    },
  },
  josephus: {
    en: 'Flavius Josephus',
    pt: {
      name: 'Flávio Josefo',
      shortName: 'Josefo',
      tradition: 'Historiador judeu',
      lifespan: 'c. 37 – c. 100',
      description:
        'Historiador nascido em Jerusalém, de ascendência sacerdotal, cujas obras A Guerra Judaica e Antiguidades Judaicas são fontes importantes sobre o judaísmo do século I.',
    },
    es: {
      name: 'Flavio Josefo',
      shortName: 'Josefo',
      tradition: 'Historiador judío',
      lifespan: 'c. 37 – c. 100',
      description:
        'Historiador nacido en Jerusalén, de linaje sacerdotal, cuyas obras La guerra de los judíos y Antigüedades judías son fuentes principales para el judaísmo del siglo I.',
    },
    fr: {
      name: 'Flavius Josèphe',
      shortName: 'Josèphe',
      tradition: 'Historien juif',
      lifespan: 'v. 37 – v. 100',
      description:
        'Historien né à Jérusalem, d’ascendance sacerdotale, dont La Guerre des Juifs et les Antiquités juives sont des sources majeures sur le judaïsme du Ier siècle.',
    },
  },
  'dale-moody': {
    en: 'Dale Moody',
    pt: {
      name: 'Dale Moody',
      shortName: 'Moody',
      tradition: 'Batista do Sul',
      description:
        'Teólogo que lecionou no The Southern Baptist Theological Seminary; seu artigo de 1953 em defesa do “only Son” da RSV tornou-se um argumento muito citado para traduzir μονογενής por “único” (em inglês, “only” ou “unique”).',
    },
    es: {
      name: 'Dale Moody',
      shortName: 'Moody',
      tradition: 'Bautista del Sur',
      description:
        'Teólogo que enseñó en The Southern Baptist Theological Seminary; su artículo de 1953 en defensa del «only Son» de la RSV se convirtió en un argumento muy citado para traducir μονογενής por «único» (en inglés, «only» o «unique»).',
    },
    fr: {
      name: 'Dale Moody',
      shortName: 'Moody',
      tradition: 'Baptiste du Sud',
      description:
        'Théologien qui enseigna au Southern Baptist Theological Seminary ; son article de 1953 défendant le « only Son » de la RSV est devenu un plaidoyer très cité pour traduire μονογενής par « unique » (en anglais « only » ou « unique »).',
    },
  },
  'charles-lee-irons': {
    en: 'Charles Lee Irons',
    pt: {
      name: 'Charles Lee Irons',
      shortName: 'Irons',
      tradition: 'Estudioso independente',
      description:
        'Estudioso independente do Novo Testamento (PhD pelo Fuller Theological Seminary) cuja pesquisa defende a tradução “unigênito” (em inglês, “only begotten”).',
    },
    es: {
      name: 'Charles Lee Irons',
      shortName: 'Irons',
      tradition: 'Investigador independiente',
      description:
        'Estudioso independiente del Nuevo Testamento (doctorado por el Fuller Theological Seminary) cuya investigación defiende la traducción «unigénito» (en inglés, «only begotten»).',
    },
    fr: {
      name: 'Charles Lee Irons',
      shortName: 'Irons',
      tradition: 'Chercheur indépendant',
      description:
        'Spécialiste indépendant du Nouveau Testament (docteur du Fuller Theological Seminary) dont les recherches défendent la traduction anglaise « only begotten » (« engendré unique »).',
    },
  },
  'denny-burk': {
    en: 'Denny Burk',
    pt: {
      name: 'Denny Burk',
      shortName: 'Burk',
      tradition: 'Batista do Sul',
      description: 'Professor de Estudos Bíblicos no Boyce College (desde 2008), que escreve sobre teologia do Novo Testamento.',
    },
    es: {
      name: 'Denny Burk',
      shortName: 'Burk',
      tradition: 'Bautista del Sur',
      description: 'Profesor de Estudios Bíblicos en el Boyce College (desde 2008) que escribe sobre teología del Nuevo Testamento.',
    },
    fr: {
      name: 'Denny Burk',
      shortName: 'Burk',
      tradition: 'Baptiste du Sud',
      description: 'Professeur d’études bibliques au Boyce College (depuis 2008), qui écrit sur la théologie du Nouveau Testament.',
    },
  },
  'philip-harner': {
    en: 'Philip B. Harner',
    pt: {
      name: 'Philip B. Harner',
      shortName: 'Harner',
      tradition: 'Estudos bíblicos',
      description:
        'Estudioso do Novo Testamento cujo estudo de 1973 sobre substantivos predicativos anartros é amplamente citado a respeito de João 1:1.',
    },
    es: {
      name: 'Philip B. Harner',
      shortName: 'Harner',
      tradition: 'Estudios bíblicos',
      description:
        'Estudioso del Nuevo Testamento cuyo estudio de 1973 sobre los sustantivos predicativos sin artículo es muy citado a propósito de Juan 1:1.',
    },
    fr: {
      name: 'Philip B. Harner',
      shortName: 'Harner',
      tradition: 'Études bibliques',
      description:
        'Spécialiste du Nouveau Testament dont l’étude de 1973 sur les noms attributs sans article est largement citée à propos de Jean 1.1.',
    },
  },
  'alan-culpepper': {
    en: 'R. Alan Culpepper',
    pt: {
      name: 'R. Alan Culpepper',
      shortName: 'Culpepper',
      tradition: 'Estudos bíblicos',
      description: 'Estudioso do Novo Testamento especializado no Evangelho de João; autor de “The Pivot of John’s Prologue” (1980).',
    },
    es: {
      name: 'R. Alan Culpepper',
      shortName: 'Culpepper',
      tradition: 'Estudios bíblicos',
      description: 'Estudioso del Nuevo Testamento especializado en el Evangelio de Juan; autor de «The Pivot of John’s Prologue» (1980).',
    },
    fr: {
      name: 'R. Alan Culpepper',
      shortName: 'Culpepper',
      tradition: 'Études bibliques',
      description: 'Spécialiste du Nouveau Testament et de l’Évangile de Jean ; auteur de « The Pivot of John’s Prologue » (1980).',
    },
  },
  'daniel-boyarin': {
    en: 'Daniel Boyarin',
    pt: {
      name: 'Daniel Boyarin',
      shortName: 'Boyarin',
      tradition: 'Judeu (historiador da religião)',
      lifespan: 'n. 1946',
      description:
        'Titular da cátedra Taubman de Cultura Talmúdica na Universidade da Califórnia em Berkeley; escreve sobre o judaísmo e o cristianismo antigos.',
    },
    es: {
      name: 'Daniel Boyarin',
      shortName: 'Boyarin',
      tradition: 'Judío (historiador de la religión)',
      lifespan: 'n. 1946',
      description:
        'Titular de la cátedra Taubman de Cultura Talmúdica en la Universidad de California en Berkeley; escribe sobre el judaísmo y el cristianismo antiguos.',
    },
    fr: {
      name: 'Daniel Boyarin',
      shortName: 'Boyarin',
      tradition: 'Juif (historien des religions)',
      lifespan: 'né en 1946',
      description:
        'Titulaire de la chaire Taubman de culture talmudique à l’université de Californie à Berkeley ; il écrit sur le judaïsme et le christianisme anciens.',
    },
  },
  'john-at-robinson': {
    en: 'John A. T. Robinson',
    pt: {
      name: 'John A. T. Robinson',
      shortName: 'Robinson',
      tradition: 'Anglicano',
      description:
        'Estudioso inglês do Novo Testamento e bispo de Woolwich; mais tarde, deão da capela do Trinity College, em Cambridge.',
    },
    es: {
      name: 'John A. T. Robinson',
      shortName: 'Robinson',
      tradition: 'Anglicano',
      description:
        'Estudioso inglés del Nuevo Testamento y obispo de Woolwich; más tarde, deán de la capilla del Trinity College de Cambridge.',
    },
    fr: {
      name: 'John A. T. Robinson',
      shortName: 'Robinson',
      tradition: 'Anglican',
      description:
        'Spécialiste anglais du Nouveau Testament et évêque de Woolwich ; plus tard doyen de la chapelle du Trinity College de Cambridge.',
    },
  },
  rashi: {
    en: 'Rashi',
    pt: {
      name: 'Rashi',
      shortName: 'Rashi',
      tradition: 'Judeu (comentarista rabínico medieval)',
      lifespan: 'c. 1040–1105',
      description:
        'Rabino Shlomo Yitzchaki, de Troyes, na França, um dos principais comentaristas judeus medievais do Talmude e da Bíblia Hebraica; autores cristãos mais antigos, como John Gill, chamam-no de Jarchi.',
    },
    es: {
      name: 'Rashi',
      shortName: 'Rashi',
      tradition: 'Judío (comentarista rabínico medieval)',
      lifespan: 'c. 1040–1105',
      description:
        'Rabí Shlomo Yitzchaki de Troyes, Francia, uno de los principales comentaristas judíos medievales del Talmud y de la Biblia hebrea; autores cristianos antiguos como John Gill lo llaman Jarchi.',
    },
    fr: {
      name: 'Rachi',
      shortName: 'Rachi',
      tradition: 'Juif (commentateur rabbinique médiéval)',
      lifespan: 'v. 1040–1105',
      description:
        'Rabbi Shlomo Yitzchaki de Troyes, en France, l’un des principaux commentateurs juifs médiévaux du Talmud et de la Bible hébraïque ; des auteurs chrétiens anciens comme John Gill l’appellent Jarchi.',
      aliases: ['rachi de troyes'],
    },
  },
  'cyril-of-jerusalem': {
    en: 'Cyril of Jerusalem',
    pt: {
      name: 'Cirilo de Jerusalém',
      shortName: 'Cirilo de Jerusalém',
      tradition: 'Padre grego da Igreja',
      lifespan: 'c. 313–386',
      description:
        'Bispo de Jerusalém no século IV, cujas Catequeses instruem os candidatos antes e depois do batismo; as cinco catequeses mistagógicas são tradicionalmente atribuídas a ele, embora alguns estudiosos as atribuam, ao menos em sua forma final, a seu sucessor João.',
      aliases: ['são cirilo de jerusalém'],
    },
    es: {
      name: 'Cirilo de Jerusalén',
      shortName: 'Cirilo de Jerusalén',
      tradition: 'Padre griego de la Iglesia',
      lifespan: 'c. 313–386',
      description:
        'Obispo de Jerusalén en el siglo IV, cuyas Catequesis instruyen a los candidatos antes y después del bautismo; las cinco catequesis mistagógicas se le atribuyen tradicionalmente, aunque algunos estudiosos las asignan, al menos en su forma final, a su sucesor Juan.',
      aliases: ['san cirilo de jerusalén'],
    },
    fr: {
      name: 'Cyrille de Jérusalem',
      shortName: 'Cyrille de Jérusalem',
      tradition: 'Père grec de l’Église',
      lifespan: 'v. 313–386',
      description:
        'Évêque de Jérusalem au IVe siècle, dont les Catéchèses instruisent les candidats avant et après le baptême ; les cinq catéchèses mystagogiques lui sont traditionnellement attribuées, bien que certains spécialistes les assignent, au moins dans leur forme finale, à son successeur Jean.',
      aliases: ['saint cyrille de jérusalem'],
    },
  },
  'alexander-maclaren': {
    en: 'Alexander Maclaren',
    pt: {
      name: 'Alexander Maclaren',
      shortName: 'Maclaren',
      tradition: 'Batista',
      description:
        'Ministro batista escocês célebre pela pregação expositiva; seus sermões reunidos formam a obra Expositions of Holy Scripture.',
    },
    es: {
      name: 'Alexander Maclaren',
      shortName: 'Maclaren',
      tradition: 'Bautista',
      description:
        'Ministro bautista escocés célebre por su predicación expositiva; sus sermones reunidos forman la obra Expositions of Holy Scripture.',
    },
    fr: {
      name: 'Alexander Maclaren',
      shortName: 'Maclaren',
      tradition: 'Baptiste',
      description:
        'Pasteur baptiste écossais réputé pour sa prédication expositive ; ses sermons réunis forment les Expositions of Holy Scripture.',
    },
  },
  'fb-meyer': {
    en: 'F. B. Meyer',
    pt: {
      name: 'F. B. Meyer',
      shortName: 'Meyer',
      tradition: 'Batista',
      description: 'Pastor e evangelista batista inglês, amigo de D. L. Moody e autor de muitos livros devocionais.',
    },
    es: {
      name: 'F. B. Meyer',
      shortName: 'Meyer',
      tradition: 'Bautista',
      description: 'Pastor y evangelista bautista inglés, amigo de D. L. Moody y autor de numerosos libros devocionales.',
    },
    fr: {
      name: 'F. B. Meyer',
      shortName: 'Meyer',
      tradition: 'Baptiste',
      description: 'Pasteur et évangéliste baptiste anglais, ami de D. L. Moody et auteur de nombreux livres de dévotion.',
    },
  },
  'phillip-keller': {
    en: 'W. Phillip Keller',
    pt: {
      name: 'W. Phillip Keller',
      shortName: 'Keller',
      tradition: 'Evangélico (escritor leigo)',
      description:
        'Nascido na África Oriental, trabalhou com pesquisa agrícola, manejo de terras e desenvolvimento de fazendas de gado na Colúmbia Britânica antes de escrever livros cristãos. Não confundir com Timothy Keller.',
    },
    es: {
      name: 'W. Phillip Keller',
      shortName: 'Keller',
      tradition: 'Evangélico (escritor laico)',
      description:
        'Nacido en África Oriental, trabajó en investigación agrícola, gestión de tierras y desarrollo de ranchos en la Columbia Británica antes de escribir libros cristianos. No debe confundirse con Timothy Keller.',
    },
    fr: {
      name: 'W. Phillip Keller',
      shortName: 'Keller',
      tradition: 'Évangélique (écrivain laïc)',
      description:
        'Né en Afrique de l’Est, il travailla dans la recherche agricole, la gestion des terres et l’aménagement de ranchs en Colombie-Britannique avant d’écrire des livres chrétiens. À ne pas confondre avec Timothy Keller.',
    },
  },
  'kenneth-bailey': {
    en: 'Kenneth E. Bailey',
    pt: {
      name: 'Kenneth E. Bailey',
      shortName: 'Bailey',
      tradition: 'Presbiteriano (mais tarde, cônego teólogo anglicano)',
      description:
        'Estudioso norte-americano do Novo Testamento que lecionou por décadas no Oriente Médio, inclusive na Near East School of Theology, em Beirute, e leu os Evangelhos à luz da cultura do Oriente Médio; ordenado na Igreja Presbiteriana (EUA), mais tarde serviu como cônego teólogo na Comunhão Anglicana.',
    },
    es: {
      name: 'Kenneth E. Bailey',
      shortName: 'Bailey',
      tradition: 'Presbiteriano (más tarde, canónigo teólogo anglicano)',
      description:
        'Estudioso estadounidense del Nuevo Testamento que enseñó durante décadas en Oriente Medio, entre otros lugares en la Near East School of Theology de Beirut, y leyó los Evangelios a la luz de la cultura de Oriente Medio; ordenado en la Iglesia Presbiteriana (EE. UU.), más tarde sirvió como canónigo teólogo en la Comunión Anglicana.',
    },
    fr: {
      name: 'Kenneth E. Bailey',
      shortName: 'Bailey',
      tradition: 'Presbytérien (plus tard chanoine théologien anglican)',
      description:
        'Spécialiste américain du Nouveau Testament qui enseigna pendant des décennies au Moyen-Orient, notamment à la Near East School of Theology de Beyrouth, et lut les Évangiles à la lumière de la culture moyen-orientale ; ordonné dans l’Église presbytérienne (États-Unis), il fut ensuite chanoine théologien dans la Communion anglicane.',
    },
  },
  'sinclair-ferguson': {
    en: 'Sinclair B. Ferguson',
    pt: {
      name: 'Sinclair B. Ferguson',
      shortName: 'Ferguson',
      tradition: 'Reformado (presbiteriano escocês)',
      lifespan: 'n. 1948',
      description:
        'Teólogo reformado escocês, professor de Teologia Sistemática (Chancellor’s Professor) no Reformed Theological Seminary e teaching fellow do Ligonier Ministries.',
    },
    es: {
      name: 'Sinclair B. Ferguson',
      shortName: 'Ferguson',
      tradition: 'Reformado (presbiteriano escocés)',
      lifespan: 'n. 1948',
      description:
        'Teólogo reformado escocés, profesor de Teología Sistemática (Chancellor’s Professor) en el Reformed Theological Seminary y teaching fellow de Ligonier Ministries.',
    },
    fr: {
      name: 'Sinclair B. Ferguson',
      shortName: 'Ferguson',
      tradition: 'Réformé (presbytérien écossais)',
      lifespan: 'né en 1948',
      description:
        'Théologien réformé écossais, professeur de théologie systématique (Chancellor’s Professor) au Reformed Theological Seminary et teaching fellow de Ligonier Ministries.',
    },
  },
  'james-barr': {
    en: 'James Barr',
    pt: {
      name: 'James Barr',
      shortName: 'Barr',
      tradition: 'Igreja da Escócia',
      description:
        'Estudioso escocês do Antigo Testamento e Regius Professor de Hebraico em Oxford (1978–1989), conhecido por seus trabalhos sobre semântica bíblica.',
    },
    es: {
      name: 'James Barr',
      shortName: 'Barr',
      tradition: 'Iglesia de Escocia',
      description:
        'Estudioso escocés del Antiguo Testamento y Regius Professor de Hebreo en Oxford (1978–1989), conocido por sus trabajos sobre semántica bíblica.',
    },
    fr: {
      name: 'James Barr',
      shortName: 'Barr',
      tradition: 'Église d’Écosse',
      description:
        'Spécialiste écossais de l’Ancien Testament et Regius Professor d’hébreu à Oxford (1978–1989), connu pour ses travaux de sémantique biblique.',
    },
  },
  suetonius: {
    en: 'Suetonius',
    pt: {
      name: 'Suetônio',
      shortName: 'Suetônio',
      tradition: 'Historiador romano (não era escritor cristão)',
      lifespan: 'c. 69 – depois de 122',
      description: 'Caio Suetônio Tranquilo, biógrafo romano e secretário imperial, autor de A Vida dos Doze Césares.',
    },
    es: {
      name: 'Suetonio',
      shortName: 'Suetonio',
      tradition: 'Historiador romano (no era un escritor cristiano)',
      lifespan: 'c. 69 – después de 122',
      description: 'Cayo Suetonio Tranquilo, biógrafo romano y secretario imperial, autor de Vidas de los doce césares.',
    },
    fr: {
      name: 'Suétone',
      shortName: 'Suétone',
      tradition: 'Historien romain (pas un auteur chrétien)',
      lifespan: 'v. 69 – après 122',
      description: 'Caius Suetonius Tranquillus, biographe romain et secrétaire impérial, auteur des Vies des douze Césars.',
    },
  },
  'john-hick': {
    en: 'John Hick',
    pt: {
      name: 'John Hick',
      shortName: 'Hick',
      tradition: 'Filósofo da religião (mais tarde, pluralista religioso)',
      description:
        'Filósofo inglês cuja obra Evil and the God of Love (1966) desenvolveu uma teodiceia ireneana de “formação da alma” (soul-making); seus trabalhos posteriores defenderam o pluralismo religioso.',
    },
    es: {
      name: 'John Hick',
      shortName: 'Hick',
      tradition: 'Filósofo de la religión (más tarde, pluralista religioso)',
      description:
        'Filósofo inglés cuya obra Evil and the God of Love (1966) desarrolló una teodicea ireneana de la «formación del alma» (soul-making); su obra posterior defendió el pluralismo religioso.',
    },
    fr: {
      name: 'John Hick',
      shortName: 'Hick',
      tradition: 'Philosophe de la religion (plus tard pluraliste religieux)',
      description:
        'Philosophe anglais dont l’ouvrage Evil and the God of Love (1966) développa une théodicée irénéenne de la « formation de l’âme » (soul-making) ; ses travaux ultérieurs plaidèrent pour le pluralisme religieux.',
    },
  },
  'alvin-plantinga': {
    en: 'Alvin Plantinga',
    pt: {
      name: 'Alvin Plantinga',
      shortName: 'Plantinga',
      tradition: 'Reformado (calvinista); filósofo analítico',
      lifespan: 'n. 1932',
      description:
        'Filósofo analítico norte-americano que lecionou no Calvin College e na Universidade de Notre Dame; conhecido pela defesa do livre-arbítrio e pela epistemologia reformada.',
    },
    es: {
      name: 'Alvin Plantinga',
      shortName: 'Plantinga',
      tradition: 'Reformado (calvinista); filósofo analítico',
      lifespan: 'n. 1932',
      description:
        'Filósofo analítico estadounidense que enseñó en el Calvin College y en la Universidad de Notre Dame; conocido por la defensa del libre albedrío y por la epistemología reformada.',
    },
    fr: {
      name: 'Alvin Plantinga',
      shortName: 'Plantinga',
      tradition: 'Réformé (calviniste) ; philosophe analytique',
      lifespan: 'né en 1932',
      description:
        'Philosophe analytique américain qui enseigna au Calvin College et à l’université Notre-Dame ; connu pour la défense par le libre arbitre et pour l’épistémologie réformée.',
    },
  },
  'david-bentley-hart': {
    en: 'David Bentley Hart',
    pt: {
      name: 'David Bentley Hart',
      shortName: 'Hart',
      tradition: 'Ortodoxo oriental',
      lifespan: 'n. 1965',
      description:
        'Filósofo e teólogo norte-americano que se tornou ortodoxo oriental aos vinte e um anos; autor de The Doors of the Sea (2005).',
    },
    es: {
      name: 'David Bentley Hart',
      shortName: 'Hart',
      tradition: 'Ortodoxo oriental',
      lifespan: 'n. 1965',
      description:
        'Filósofo y teólogo estadounidense que se hizo ortodoxo oriental a los veintiún años; autor de The Doors of the Sea (2005).',
    },
    fr: {
      name: 'David Bentley Hart',
      shortName: 'Hart',
      tradition: 'Orthodoxe',
      lifespan: 'né en 1965',
      description: 'Philosophe et théologien américain devenu orthodoxe à vingt et un ans ; auteur de The Doors of the Sea (2005).',
    },
  },
  'joni-eareckson-tada': {
    en: 'Joni Eareckson Tada',
    pt: {
      name: 'Joni Eareckson Tada',
      shortName: 'Tada',
      tradition: 'Evangélica',
      lifespan: 'n. 1949',
      description:
        'Autora norte-americana e fundadora do Joni and Friends, um ministério voltado às pessoas com deficiência; tetraplégica desde um acidente de mergulho em 1967.',
    },
    es: {
      name: 'Joni Eareckson Tada',
      shortName: 'Tada',
      tradition: 'Evangélica',
      lifespan: 'n. 1949',
      description:
        'Autora estadounidense y fundadora de Joni and Friends, un ministerio en el ámbito de la discapacidad; tetrapléjica desde un accidente al zambullirse en el agua en 1967.',
    },
    fr: {
      name: 'Joni Eareckson Tada',
      shortName: 'Tada',
      tradition: 'Évangélique',
      lifespan: 'née en 1949',
      description:
        'Autrice américaine et fondatrice de Joni and Friends, un ministère auprès des personnes handicapées ; tétraplégique depuis un accident de plongeon en 1967.',
    },
  },
  'steven-estes': {
    en: 'Steven Estes',
    pt: {
      name: 'Steven Estes',
      shortName: 'Estes',
      tradition: 'Evangélico',
      description:
        'Pastor da Community Evangelical Church em Elverson, Pensilvânia, e coautor, com Joni Eareckson Tada, de When God Weeps.',
    },
    es: {
      name: 'Steven Estes',
      shortName: 'Estes',
      tradition: 'Evangélico',
      description:
        'Pastor de la Community Evangelical Church en Elverson, Pensilvania, y coautor, con Joni Eareckson Tada, de When God Weeps.',
    },
    fr: {
      name: 'Steven Estes',
      shortName: 'Estes',
      tradition: 'Évangélique',
      description:
        'Pasteur de la Community Evangelical Church à Elverson (Pennsylvanie) et coauteur, avec Joni Eareckson Tada, de When God Weeps.',
    },
  },
  'john-t-fitzgerald': {
    en: 'John T. Fitzgerald',
    pt: {
      name: 'John T. Fitzgerald',
      shortName: 'Fitzgerald',
      tradition: 'Estudioso do Novo Testamento',
      description:
        'Estudioso norte-americano do Novo Testamento; autor de Cracks in an Earthen Vessel (1988), um estudo dos catálogos de sofrimentos de Paulo.',
    },
    es: {
      name: 'John T. Fitzgerald',
      shortName: 'Fitzgerald',
      tradition: 'Estudioso del Nuevo Testamento',
      description:
        'Estudioso estadounidense del Nuevo Testamento; autor de Cracks in an Earthen Vessel (1988), un estudio de los catálogos de sufrimientos de Pablo.',
    },
    fr: {
      name: 'John T. Fitzgerald',
      shortName: 'Fitzgerald',
      tradition: 'Spécialiste du Nouveau Testament',
      description:
        'Spécialiste américain du Nouveau Testament ; auteur de Cracks in an Earthen Vessel (1988), une étude des catalogues d’épreuves de Paul.',
    },
  },
  'john-paul-ii': {
    en: 'Pope John Paul II',
    pt: {
      name: 'Papa João Paulo II',
      shortName: 'João Paulo II',
      tradition: 'Católico',
      description:
        'Karol Wojtyła, filósofo e teólogo polonês, papa de 1978 a 2005; autor da carta apostólica Salvifici Doloris (1984), sobre o sentido cristão do sofrimento humano.',
    },
    es: {
      name: 'Papa Juan Pablo II',
      shortName: 'Juan Pablo II',
      tradition: 'Católico',
      description:
        'Karol Wojtyła, filósofo y teólogo polaco, papa de 1978 a 2005; autor de la carta apostólica Salvifici Doloris (1984), sobre el sentido cristiano del sufrimiento humano.',
    },
    fr: {
      name: 'Pape Jean-Paul II',
      shortName: 'Jean-Paul II',
      tradition: 'Catholique',
      description:
        'Karol Wojtyła, philosophe et théologien polonais, pape de 1978 à 2005 ; auteur de la lettre apostolique Salvifici Doloris (1984) sur le sens chrétien de la souffrance humaine.',
    },
  },
  'justin-martyr': {
    en: 'Justin Martyr',
    pt: {
      name: 'Justino Mártir',
      shortName: 'Justino Mártir',
      tradition: 'Apologista cristão primitivo',
      lifespan: 'm. c. 165',
      description:
        'Filósofo convertido e apologista em Roma, autor de duas Apologias e do Diálogo com Trifão; martirizado em Roma.',
      aliases: ['são justino', 'justino'],
    },
    es: {
      name: 'Justino Mártir',
      shortName: 'Justino Mártir',
      tradition: 'Apologista cristiano primitivo',
      lifespan: 'm. c. 165',
      description:
        'Filósofo converso y apologista en Roma, autor de dos Apologías y del Diálogo con Trifón; murió mártir en Roma.',
      aliases: ['san justino', 'justino'],
    },
    fr: {
      name: 'Justin Martyr',
      shortName: 'Justin Martyr',
      tradition: 'Apologiste chrétien des premiers siècles',
      lifespan: 'mort v. 165',
      description:
        'Philosophe converti et apologiste à Rome, auteur de deux Apologies et du Dialogue avec Tryphon ; martyrisé à Rome.',
      aliases: ['saint justin'],
    },
  },
  'george-eldon-ladd': {
    en: 'George Eldon Ladd',
    pt: {
      name: 'George Eldon Ladd',
      shortName: 'Ladd',
      tradition: 'Evangélico (batista)',
      description:
        'Estudioso do Novo Testamento no Fuller Theological Seminary, conhecido por seus trabalhos sobre o reino de Deus e pelo pré-milenismo histórico.',
    },
    es: {
      name: 'George Eldon Ladd',
      shortName: 'Ladd',
      tradition: 'Evangélico (bautista)',
      description:
        'Estudioso del Nuevo Testamento en el Fuller Theological Seminary, conocido por sus trabajos sobre el reino de Dios y por el premilenarismo histórico.',
    },
    fr: {
      name: 'George Eldon Ladd',
      shortName: 'Ladd',
      tradition: 'Évangélique (baptiste)',
      description:
        'Spécialiste du Nouveau Testament au Fuller Theological Seminary, connu pour ses travaux sur le royaume de Dieu et pour le prémillénarisme historique.',
    },
  },
  'philip-melanchthon': {
    en: 'Philip Melanchthon',
    pt: {
      name: 'Filipe Melanchthon',
      shortName: 'Melanchthon',
      tradition: 'Luterano',
      description:
        'Erudito de Wittenberg e o colega mais próximo de Lutero; autor da Confissão de Augsburgo (1530) e de sua Apologia (1531).',
      aliases: ['melâncton', 'filipe melâncton'],
    },
    es: {
      name: 'Felipe Melanchthon',
      shortName: 'Melanchthon',
      tradition: 'Luterano',
      description:
        'Erudito de Wittenberg y el colega más cercano de Lutero; autor de la Confesión de Augsburgo (1530) y de su Apología (1531).',
      aliases: ['melanchton', 'felipe melanchton'],
    },
    fr: {
      name: 'Philippe Melanchthon',
      shortName: 'Melanchthon',
      tradition: 'Luthérien',
      description:
        'Érudit de Wittenberg et le plus proche collègue de Luther ; auteur de la Confession d’Augsbourg (1530) et de son Apologie (1531).',
      aliases: ['mélanchthon', 'philippe mélanchthon'],
    },
  },
  'thomas-hopko': {
    en: 'Thomas Hopko',
    pt: {
      name: 'Thomas Hopko',
      shortName: 'Hopko',
      tradition: 'Ortodoxo oriental (Igreja Ortodoxa na América)',
      description:
        'Protopresbítero da Igreja Ortodoxa na América, professor de teologia dogmática e deão do St Vladimir’s Orthodox Theological Seminary; autor da série catequética em quatro volumes The Orthodox Faith.',
    },
    es: {
      name: 'Thomas Hopko',
      shortName: 'Hopko',
      tradition: 'Ortodoxo oriental (Iglesia Ortodoxa en América)',
      description:
        'Protopresbítero de la Iglesia Ortodoxa en América, profesor de teología dogmática y decano del St Vladimir’s Orthodox Theological Seminary; autor de la serie catequética en cuatro volúmenes The Orthodox Faith.',
    },
    fr: {
      name: 'Thomas Hopko',
      shortName: 'Hopko',
      tradition: 'Orthodoxe (Église orthodoxe en Amérique)',
      description:
        'Protopresbytre de l’Église orthodoxe en Amérique, professeur de théologie dogmatique et doyen du St Vladimir’s Orthodox Theological Seminary ; auteur de la série catéchétique en quatre volumes The Orthodox Faith.',
    },
  },
  'theophilus-of-antioch': {
    en: 'Theophilus of Antioch',
    pt: {
      name: 'Teófilo de Antioquia',
      shortName: 'Teófilo de Antioquia',
      tradition: 'Padre grego da Igreja',
      description: 'Bispo de Antioquia e apologista do século II, autor dos três livros A Autólico.',
    },
    es: {
      name: 'Teófilo de Antioquía',
      shortName: 'Teófilo de Antioquía',
      tradition: 'Padre griego de la Iglesia',
      description: 'Obispo de Antioquía y apologista del siglo II, autor de los tres libros A Autólico.',
    },
    fr: {
      name: 'Théophile d’Antioche',
      shortName: 'Théophile d’Antioche',
      tradition: 'Père grec de l’Église',
      description: 'Évêque d’Antioche et apologiste du IIe siècle, auteur des trois livres À Autolycus.',
    },
  },
  photius: {
    en: 'Photius I of Constantinople',
    pt: {
      name: 'Fócio I de Constantinopla',
      shortName: 'Fócio',
      tradition: 'Ortodoxo oriental',
      lifespan: 'c. 815–893',
      description:
        'Patriarca de Constantinopla e erudito que rejeitou o ensino ocidental de que o Espírito procede do Filho e se opôs ao acréscimo do Filioque ao credo.',
      aliases: ['são fócio'],
    },
    es: {
      name: 'Focio I de Constantinopla',
      shortName: 'Focio',
      tradition: 'Ortodoxo oriental',
      lifespan: 'c. 815–893',
      description:
        'Patriarca de Constantinopla y erudito que rechazó la enseñanza occidental de que el Espíritu procede del Hijo y se opuso a añadir el Filioque al credo.',
      aliases: ['san focio'],
    },
    fr: {
      name: 'Photios Ier de Constantinople',
      shortName: 'Photios',
      tradition: 'Orthodoxe',
      lifespan: 'v. 815–893',
      description:
        'Patriarche de Constantinople et érudit qui rejeta l’enseignement occidental selon lequel l’Esprit procède du Fils et s’opposa à l’ajout du Filioque au credo.',
      aliases: ['saint photios'],
    },
  },
  'council-of-nicaea': {
    en: 'First Council of Nicaea',
    pt: {
      name: 'Primeiro Concílio de Niceia',
      shortName: 'Niceia',
      tradition: 'Concílio ecumênico',
      description:
        'O primeiro concílio ecumênico, convocado por Constantino em 325; condenou Ário e confessou o Filho “da mesma substância” que o Pai.',
      aliases: ['concílio de niceia', 'nicéia'],
    },
    es: {
      name: 'Primer Concilio de Nicea',
      shortName: 'Nicea',
      tradition: 'Concilio ecuménico',
      description:
        'El primer concilio ecuménico, convocado por Constantino en 325; condenó a Arrio y confesó al Hijo «de la misma sustancia» que el Padre.',
      aliases: ['concilio de nicea'],
    },
    fr: {
      name: 'Premier concile de Nicée',
      shortName: 'Nicée',
      tradition: 'Concile œcuménique',
      description:
        'Le premier concile œcuménique, convoqué par Constantin en 325 ; il condamna Arius et confessa le Fils « de même substance » que le Père.',
      aliases: ['concile de nicée'],
    },
  },
  'council-of-constantinople-381': {
    en: 'First Council of Constantinople',
    pt: {
      name: 'Primeiro Concílio de Constantinopla',
      shortName: 'Constantinopla I',
      tradition: 'Concílio ecumênico',
      description:
        'O segundo concílio ecumênico (381), que confirmou a fé de Niceia e confessou a divindade do Espírito Santo; o seu credo é o Credo Niceno tal como as igrejas o recitam.',
      aliases: ['concílio de constantinopla'],
    },
    es: {
      name: 'Primer Concilio de Constantinopla',
      shortName: 'Constantinopla I',
      tradition: 'Concilio ecuménico',
      description:
        'El segundo concilio ecuménico (381), que confirmó la fe de Nicea y confesó la divinidad del Espíritu Santo; su credo es el Credo niceno tal como lo recitan las iglesias.',
      aliases: ['concilio de constantinopla'],
    },
    fr: {
      name: 'Premier concile de Constantinople',
      shortName: 'Constantinople I',
      tradition: 'Concile œcuménique',
      description:
        'Le deuxième concile œcuménique (381), qui confirma la foi de Nicée et confessa la divinité du Saint-Esprit ; son credo est le Symbole de Nicée tel que les Églises le récitent.',
      aliases: ['concile de constantinople'],
    },
  },
  'council-of-chalcedon': {
    en: 'Council of Chalcedon',
    pt: {
      name: 'Concílio de Calcedônia',
      shortName: 'Calcedônia',
      tradition: 'Concílio ecumênico',
      description:
        'O quarto concílio ecumênico (451), que definiu que Cristo é uma só pessoa em duas naturezas, divina e humana.',
      aliases: ['concílio de calcedônia'],
    },
    es: {
      name: 'Concilio de Calcedonia',
      shortName: 'Calcedonia',
      tradition: 'Concilio ecuménico',
      description:
        'El cuarto concilio ecuménico (451), que definió que Cristo es una sola persona en dos naturalezas, divina y humana.',
      aliases: ['concilio de calcedonia'],
    },
    fr: {
      name: 'Concile de Chalcédoine',
      shortName: 'Chalcédoine',
      tradition: 'Concile œcuménique',
      description:
        'Le quatrième concile œcuménique (451), qui définit que le Christ est une seule personne en deux natures, divine et humaine.',
      aliases: ['concile de chalcédoine'],
    },
  },
  'westminster-assembly': {
    en: 'Westminster Assembly',
    pt: {
      name: 'Assembleia de Westminster',
      shortName: 'Assembleia de Westminster',
      tradition: 'Reformado (presbiteriano)',
      description:
        'A assembleia de teólogos convocada pelo Parlamento inglês que redigiu a Confissão de Fé de Westminster e os Catecismos Maior e Breve.',
      aliases: ['teólogos de westminster'],
    },
    es: {
      name: 'Asamblea de Westminster',
      shortName: 'Asamblea de Westminster',
      tradition: 'Reformado (presbiteriano)',
      description:
        'La asamblea de teólogos convocada por el Parlamento inglés que redactó la Confesión de Fe de Westminster y los Catecismos Mayor y Menor.',
      aliases: ['teólogos de westminster'],
    },
    fr: {
      name: 'Assemblée de Westminster',
      shortName: 'Assemblée de Westminster',
      tradition: 'Réformé (presbytérien)',
      description:
        'L’assemblée de théologiens convoquée par le Parlement anglais qui rédigea la Confession de foi de Westminster ainsi que le Grand et le Petit Catéchisme.',
      aliases: ['théologiens de westminster'],
    },
  },
  'ursinus-olevianus': {
    en: 'Zacharias Ursinus and Caspar Olevianus',
    pt: {
      name: 'Zacarias Ursino e Gaspar Oleviano',
      shortName: 'Ursino e Oleviano',
      tradition: 'Reformado',
      description:
        'Teólogos de Heidelberg tradicionalmente apontados como autores do Catecismo de Heidelberg (1563), preparado por ordem do eleitor Frederico III do Palatinado; Ursino é geralmente considerado o seu autor principal.',
      aliases: ['ursino', 'oleviano', 'zacarias ursinus'],
    },
    es: {
      name: 'Zacarías Ursino y Gaspar Oleviano',
      shortName: 'Ursino y Oleviano',
      tradition: 'Reformado',
      description:
        'Teólogos de Heidelberg a quienes la tradición atribuye el Catecismo de Heidelberg (1563), preparado por orden del elector Federico III del Palatinado; a Ursino se le considera generalmente su autor principal.',
      aliases: ['ursino', 'oleviano'],
    },
    fr: {
      name: 'Zacharias Ursinus et Caspar Olevianus',
      shortName: 'Ursinus et Olevianus',
      tradition: 'Réformé',
      description:
        'Théologiens de Heidelberg traditionnellement désignés comme les auteurs du Catéchisme de Heidelberg (1563), rédigé sur l’ordre de l’Électeur Frédéric III du Palatinat ; Ursinus est généralement considéré comme son auteur principal.',
    },
  },
  'guido-de-bres': {
    en: 'Guido de Brès',
    pt: {
      name: 'Guido de Brès',
      shortName: 'de Brès',
      tradition: 'Reformado',
      description:
        'Pregador reformado dos Países Baixos meridionais, autor da Confissão Belga (1561); executado em Valenciennes em 1567.',
      aliases: ['guy de brès'],
    },
    es: {
      name: 'Guido de Brès',
      shortName: 'de Brès',
      tradition: 'Reformado',
      description:
        'Predicador reformado de los Países Bajos meridionales, autor de la Confesión Belga (1561); ejecutado en Valenciennes en 1567.',
      aliases: ['guy de brès'],
    },
    fr: {
      name: 'Guy de Brès',
      shortName: 'de Brès',
      tradition: 'Réformé',
      description:
        'Prédicateur réformé des Pays-Bas méridionaux, auteur de la Confession belge (1561) ; exécuté à Valenciennes en 1567.',
      aliases: ['guido de brès'],
    },
  },
  'synod-of-dort': {
    en: 'Synod of Dort',
    pt: {
      name: 'Sínodo de Dort',
      shortName: 'Sínodo de Dort',
      tradition: 'Reformado',
      description:
        'O sínodo nacional da Igreja Reformada Holandesa em Dordrecht, com delegados de outras igrejas reformadas, que respondeu aos remonstrantes nos Cânones de Dort.',
      aliases: ['sínodo de dordrecht'],
    },
    es: {
      name: 'Sínodo de Dort',
      shortName: 'Sínodo de Dort',
      tradition: 'Reformado',
      description:
        'El sínodo nacional de la Iglesia Reformada Neerlandesa en Dordrecht, con delegados de otras iglesias reformadas, que respondió a los remonstrantes en los Cánones de Dort.',
      aliases: ['sínodo de dordrecht'],
    },
    fr: {
      name: 'Synode de Dordrecht',
      shortName: 'Synode de Dordrecht',
      tradition: 'Réformé',
      description:
        'Le synode national de l’Église réformée néerlandaise à Dordrecht, avec des délégués d’autres Églises réformées, qui répondit aux remontrants par les Canons de Dordrecht.',
      aliases: ['synode de dort'],
    },
  },
  'formula-of-concord-theologians': {
    en: 'The theologians of the Formula of Concord',
    pt: {
      name: 'Os teólogos da Fórmula de Concórdia',
      shortName: 'Fórmula de Concórdia',
      tradition: 'Luterano',
      description:
        'Jakob Andreae, Martin Chemnitz, Nikolaus Selnecker, David Chytraeus, Andreas Musculus e Christoph Körner, que redigiram a Fórmula de Concórdia (1577).',
    },
    es: {
      name: 'Los teólogos de la Fórmula de Concordia',
      shortName: 'Fórmula de Concordia',
      tradition: 'Luterano',
      description:
        'Jakob Andreae, Martin Chemnitz, Nikolaus Selnecker, David Chytraeus, Andreas Musculus y Christoph Körner, que redactaron la Fórmula de Concordia (1577).',
    },
    fr: {
      name: 'Les théologiens de la Formule de Concorde',
      shortName: 'Formule de Concorde',
      tradition: 'Luthérien',
      description:
        'Jakob Andreae, Martin Chemnitz, Nikolaus Selnecker, David Chytraeus, Andreas Musculus et Christoph Körner, qui rédigèrent la Formule de Concorde (1577).',
    },
  },
  'council-of-trent': {
    en: 'Council of Trent',
    pt: {
      name: 'Concílio de Trento',
      shortName: 'Trento',
      tradition: 'Católico',
      description:
        'O décimo nono concílio ecumênico da Igreja Católica, reunido em Trento em três períodos entre 1545 e 1563; definiu a doutrina católica em resposta à Reforma Protestante.',
      aliases: ['concílio de trento', 'tridentino'],
    },
    es: {
      name: 'Concilio de Trento',
      shortName: 'Trento',
      tradition: 'Católico',
      description:
        'El decimonoveno concilio ecuménico de la Iglesia católica, reunido en Trento en tres períodos entre 1545 y 1563; definió la doctrina católica en respuesta a la Reforma protestante.',
      aliases: ['concilio de trento', 'tridentino'],
    },
    fr: {
      name: 'Concile de Trente',
      shortName: 'Concile de Trente',
      tradition: 'Catholique',
      description:
        'Le dix-neuvième concile œcuménique de l’Église catholique, réuni à Trente en trois périodes entre 1545 et 1563 ; il définit la doctrine catholique en réponse à la Réforme protestante.',
      aliases: ['tridentin'],
    },
  },
  'philaret-of-moscow': {
    en: 'Philaret of Moscow',
    pt: {
      name: 'Filareto de Moscou',
      shortName: 'Filareto',
      tradition: 'Ortodoxo oriental (russo)',
      description:
        'Vasily Drozdov, metropolita de Moscou e o principal teólogo e pregador ortodoxo russo do seu século; autor do Catecismo Maior da Igreja Russa.',
      aliases: ['filaret', 'philaret'],
    },
    es: {
      name: 'Filareto de Moscú',
      shortName: 'Filareto',
      tradition: 'Ortodoxo oriental (ruso)',
      description:
        'Vasily Drozdov, metropolitano de Moscú y el principal teólogo y predicador ortodoxo ruso de su siglo; autor del Catecismo Mayor de la Iglesia rusa.',
      aliases: ['filaret', 'philaret'],
    },
    fr: {
      name: 'Philarète de Moscou',
      shortName: 'Philarète',
      tradition: 'Orthodoxe (russe)',
      description:
        'Vassili Drozdov, métropolite de Moscou, le principal théologien et prédicateur orthodoxe russe de son siècle ; auteur du Grand Catéchisme de l’Église russe.',
      aliases: ['philaret', 'filaret'],
    },
  },
  'synod-of-jerusalem-1672': {
    en: 'Synod of Jerusalem (1672)',
    pt: {
      name: 'Sínodo de Jerusalém (1672)',
      shortName: 'Sínodo de Jerusalém',
      tradition: 'Ortodoxo oriental',
      description:
        'Um sínodo de bispos ortodoxos orientais realizado em Jerusalém (Belém) em 1672 sob Dositeu II, patriarca de Jerusalém, cujos decretos (a Confissão de Dositeu) responderam à confissão calvinista publicada sob o nome de Cirilo Lucaris.',
      aliases: ['sínodo de belém', 'dositeu', 'confissão de dositeu'],
    },
    es: {
      name: 'Sínodo de Jerusalén (1672)',
      shortName: 'Sínodo de Jerusalén',
      tradition: 'Ortodoxo oriental',
      description:
        'Un sínodo de obispos ortodoxos orientales celebrado en Jerusalén (Belén) en 1672 bajo Dositeo II, patriarca de Jerusalén, cuyos decretos (la Confesión de Dositeo) respondieron a la confesión calvinista publicada bajo el nombre de Cirilo Lucaris.',
      aliases: ['sínodo de belén', 'dositeo', 'confesión de dositeo'],
    },
    fr: {
      name: 'Synode de Jérusalem (1672)',
      shortName: 'Synode de Jérusalem',
      tradition: 'Orthodoxe',
      description:
        'Un synode d’évêques orthodoxes tenu à Jérusalem (Bethléem) en 1672 sous Dosithée II, patriarche de Jérusalem, dont les décrets (la Confession de Dosithée) répondirent à la confession calviniste publiée sous le nom de Cyrille Loukaris.',
      aliases: ['synode de bethléem', 'dosithée', 'confession de dosithée'],
    },
  },
  'particular-baptist-assembly-1689': {
    en: 'General Assembly of Particular Baptists (London, 1689)',
    pt: {
      name: 'Assembleia Geral dos Batistas Particulares (Londres, 1689)',
      shortName: 'Assembleia Batista de Londres (1689)',
      tradition: 'Batista (particular)',
      description:
        'A assembleia de ministros e mensageiros das igrejas batistas particulares (calvinistas) da Inglaterra e do País de Gales que se reuniu em Londres em 1689 e adotou a Confissão publicada pela primeira vez em 1677.',
      aliases: ['confissão batista de 1689', 'batistas particulares'],
    },
    es: {
      name: 'Asamblea General de Bautistas Particulares (Londres, 1689)',
      shortName: 'Asamblea Bautista de Londres (1689)',
      tradition: 'Bautista (particular)',
      description:
        'La asamblea de ministros y mensajeros de las iglesias bautistas particulares (calvinistas) de Inglaterra y Gales que se reunió en Londres en 1689 y adoptó la Confesión publicada por primera vez en 1677.',
      aliases: ['confesión bautista de 1689', 'bautistas particulares'],
    },
    fr: {
      name: 'Assemblée générale des baptistes particuliers (Londres, 1689)',
      shortName: 'Assemblée baptiste de Londres (1689)',
      tradition: 'Baptiste (particulier)',
      description:
        'L’assemblée des pasteurs et messagers des Églises baptistes particulières (calvinistes) d’Angleterre et du pays de Galles, réunie à Londres en 1689, qui adopta la Confession publiée pour la première fois en 1677.',
      aliases: ['confession baptiste de 1689', 'baptistes particuliers'],
    },
  },
  'church-of-england': {
    en: 'Church of England',
    pt: {
      name: 'Igreja da Inglaterra',
      shortName: 'Igreja da Inglaterra',
      tradition: 'Anglicano',
      description:
        'A igreja estabelecida da Inglaterra, cuja Convocação aprovou os Trinta e Nove Artigos de Religião (1563; texto inglês fixado em 1571).',
      aliases: ['igreja anglicana'],
    },
    es: {
      name: 'Iglesia de Inglaterra',
      shortName: 'Iglesia de Inglaterra',
      tradition: 'Anglicano',
      description:
        'La iglesia establecida de Inglaterra, cuya Convocación aprobó los Treinta y Nueve Artículos de Religión (1563; texto inglés fijado en 1571).',
      aliases: ['iglesia anglicana'],
    },
    fr: {
      name: 'Église d’Angleterre',
      shortName: 'Église d’Angleterre',
      tradition: 'Anglican',
      description:
        'L’Église établie d’Angleterre, dont la Convocation adopta les Trente-Neuf Articles de religion (1563 ; texte anglais fixé en 1571).',
      aliases: ['église anglicane'],
    },
  },
};
