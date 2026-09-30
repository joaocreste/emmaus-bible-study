/**
 * Español — traducción del estudio curado «Romanos 8» (src/data/curated/studies/romans-8.ts).
 *
 * Las citas bíblicas entre comillas reproducen la Reina-Valera 1909 (RVR1909), la versión
 * predeterminada en español; cuando la redacción difiere, se parafrasea sin comillas. Las citas
 * verificadas de autores (Calvino, Crisóstomo, Owen…) no se reescriben: aquí solo se añade una
 * traducción libre (`quoteTranslation`), y en la prosa se parafrasean sin comillas.
 */
import type { StudyOverlay } from '../types';

const overlay: StudyOverlay = {
  studyId: 'romans-8',
  locale: 'es',
  title: 'Romanos 8',
  subtitle: 'La vida en el Espíritu — sin condenación, sin separación',
  summary:
    'Romanos 8 es la cumbre del argumento de Pablo en los capítulos 5–8. Comienza afirmando que «ninguna condenación hay para los que están en Cristo Jesús» (8:1) y termina con la certeza de que ninguna criatura «nos podrá apartar del amor de Dios, que es en Cristo Jesús Señor nuestro» (8:39). Entre ambos extremos, Pablo muestra al Espíritu Santo haciendo lo que la ley no podía: dar vida, guiar a los hijos de Dios, suscitar el clamor «Abba, Padre» e interceder en nuestra flaqueza; la palabra griega para Espíritu aparece aquí 21 veces, más que en ningún otro capítulo del Nuevo Testamento. El sufrimiento presente queda enmarcado en el propósito de Dios de renovar la creación y redimir nuestro cuerpo, y el capítulo culmina en un tribunal donde ningún acusador puede prevalecer, porque Dios justifica y Cristo intercede.',
  opening:
    'Esto es Romanos 8, un capítulo que muchos cristianos atesoran casi por encima de cualquier otro. Empieza con «ninguna condenación» y termina con la promesa de que nada podrá apartarnos del amor de Dios; entre medias, Pablo describe la obra del Espíritu, nuestra adopción como hijos de Dios y una esperanza lo bastante grande para sostener el sufrimiento presente. Al tocar una palabra resaltada aparece el griego que hay detrás; también se me puede preguntar por un versículo, por una palabra o por lo que han dicho de él los cristianos a lo largo de los siglos.',
  matchTopics: [
    'romanos 8',
    'romanos ocho',
    'romanos capítulo 8',
    'vida en el espíritu',
    'la vida en el espíritu',
    'ninguna condenación',
    'no hay condenación',
    'ahora pues ninguna condenación hay',
    'ninguna separación',
    'nada nos podrá apartar del amor de dios',
    'nada nos separará del amor de dios',
    'más que vencedores',
    'hacemos más que vencer',
    'todas las cosas les ayudan a bien',
    'todas las cosas ayudan a bien',
    'la cadena de oro',
    'espíritu de adopción',
    'abba padre',
    'gemidos indecibles',
    'primicias del espíritu',
  ],
  suggestedQuestions: [
    '¿Qué significa «condenación» en el versículo 1?',
    '¿Qué quiere decir Pablo aquí con «carne»?',
    '¿Qué palabra griega hay detrás de «adopción»?',
    '¿Qué dijo Tim Keller sobre este pasaje?',
    '¿Cómo habrían entendido los primeros oyentes «Abba, Padre»?',
    '¿Dónde más habla Pablo de esto?',
    'Quiero entender mejor el versículo 28.',
    '¿Hay distintas interpretaciones teológicas de los versículos 29–30?',
    '¿Cómo se relaciona este capítulo con el resto de Romanos?',
    '¿«Abba» significa «papi»?',
  ],

  keyWords: {
    'romans-8:kw:katakrima': {
      english: 'condenación',
      basicMeaning: 'condenación; la pena que sigue a una sentencia',
      semanticRange: [
        'condenación: el veredicto adverso pronunciado contra alguien (así la mayoría de las versiones)',
        'pena: la sentencia ya ejecutada (glosa de Abbott-Smith; la Revised Version inglesa traduce «condemnation»)',
      ],
      grammar: 'Sustantivo, nominativo singular neutro',
      significance:
        'Κατάκριμα aparece solo tres veces en el Nuevo Testamento, todas en Romanos: dos en 5:16–18, donde el único delito de Adán trae condenación sobre todos, y aquí. Así, 8:1 responde directamente a 5:18: para los que están «en Cristo Jesús» ya no rige el veredicto, con su pena, que pesaba sobre la humanidad en Adán. Pablo explica enseguida por qué: Dios «condenó al pecado en la carne» de su Hijo (8:3), y al final nadie puede condenar a quienes Dios justifica (8:34).',
      caution:
        '«Ninguna condenación» es un veredicto sobre la situación de una persona ante Dios. No significa que los creyentes ya no pequen ni luchen: Pablo sigue llamándolos a hacer morir, por el Espíritu, las obras del cuerpo (8:13).',
      notableNotes: [
        'El juicio que siguió a un solo pecado trajo condenación: el delito de Adán.',
        'Un solo delito trajo condenación a todos los hombres: el veredicto que 8:1 revierte para los que están en Cristo.',
      ],
      anchors: [{ verse: { book: 'ROM', chapter: 8, verse: 1 }, phrases: { RVR1909: 'condenación', BLM: 'condenación', VBL: 'condenación' } }],
    },
    'romans-8:kw:katakrino': {
      english: 'condenó',
      basicMeaning: 'condenar; dictar sentencia contra',
      semanticRange: [
        'dictar sentencia contra alguien, condenar (Mc 14:64; Jn 8:10–11)',
        'en pasiva: ser condenado (Ro 14:23; 1 Co 11:32)',
        'en sentido figurado, condenar por contraste o con el propio ejemplo (Mt 12:41–42; Heb 11:7; Abbott-Smith clasifica aquí también Ro 8:3)',
      ],
      grammar:
        'Verbo, aoristo activo indicativo, 3.ª persona del singular (8:3); participio en 8:34: TAGNT lo etiqueta como presente, aunque el acento de la forma impresa (κατακρινῶν) es el de un participio futuro: «¿Quién es el que condenará?»',
      significance:
        'Pablo usa el verbo emparentado (18 veces en el Nuevo Testamento) dos veces más en el capítulo, como eco del sustantivo de 8:1. En 8:3 el sujeto es Dios: al enviar a su Hijo como ofrenda por el pecado, «condenó al pecado en la carne»; la sentencia cayó sobre el pecado, en Cristo, y no sobre los que están en él (así la nota de Tyndale: Dios condenó el pecado en Cristo, nuestro sustituto). En 8:34 la pregunta «¿Quién es el que condenará?» se queda sin respuesta, porque el que murió, resucitó y ahora intercede es Cristo mismo.',
      caution:
        'El léxico de Abbott-Smith incluye 8:3 en el sentido figurado (condenar por contraste); la mayoría de los comentaristas lo leen como la sentencia judicial de Dios ejecutada sobre el pecado en la carne de Cristo. Es el contexto, y no la entrada del diccionario, lo que debe decidir.',
      notableNotes: [
        'Todo el concilio lo condenó como reo de muerte: Jesús mismo, condenado.',
        '«Ni yo te condeno»: Jesús a la mujer sorprendida en adulterio.',
        '«¿Quién es el que condenará?»: la pregunta a la que el capítulo no deja respuesta posible.',
      ],
      anchors: [
        { verse: { book: 'ROM', chapter: 8, verse: 3 }, phrases: { RVR1909: 'condenó al pecado', BLM: 'condenó al pecado' } },
        { verse: { book: 'ROM', chapter: 8, verse: 34 }, phrases: { RVR1909: 'condenará', BLM: 'condena', VBL: 'condenarnos' } },
      ],
    },
    'romans-8:kw:sarx': {
      english: 'carne',
      basicMeaning: 'carne',
      semanticRange: [
        'la sustancia física del cuerpo; el cuerpo mismo',
        'los seres humanos en su fragilidad y mortalidad («toda carne»)',
        'la ascendencia y el parentesco naturales («según la carne», Ro 1:3; 9:3, 5)',
        'en el uso ético de Pablo, la humanidad como sede y vehículo del deseo pecaminoso, opuesta al Espíritu (Ro 8:4–13; Gá 5:16–17)',
      ],
      grammar: 'Sustantivo, acusativo singular femenino (κατὰ σάρκα, «según la carne», 8:4)',
      significance:
        'Σάρξ aparece 13 veces solo en 8:3–13 (147 en el Nuevo Testamento). Pablo no dice que el cuerpo sea malo: Dios condenó al pecado en la carne, no a la carne misma (8:3), y el Espíritu vivificará nuestros cuerpos mortales (8:11). «Carne» es aquí la humanidad tal como está en Adán: débil, autosuficiente, inclinada al pecado y en «enemistad contra Dios» (8:7). Vivir según la carne y vivir según el Espíritu describen dos modos de existir y dos fuentes de vida, no dos partes de la persona.',
      caution:
        'No hay que leer «carne» en este capítulo como «cuerpo físico» ni como «sexualidad». Algunas traducciones la vierten «naturaleza pecaminosa» (así el texto inglés de la NLT que usan las notas de Tyndale y, entre las versiones españolas de Emmaus, la VBL); el contexto decide cada uso: compárese el sentido neutro de «según la carne» en Romanos 1:3 y 9:5.',
      notableNotes: [
        'Sentido neutro: Jesús, «hecho de la simiente de David según la carne».',
        'En mí, es decir, en mi carne, no mora el bien: la lucha que precede inmediatamente al capítulo 8.',
        '«La carne codicia contra el Espíritu»: el otro gran pasaje de Pablo sobre la carne y el Espíritu.',
      ],
      anchors: [
        { verse: { book: 'ROM', chapter: 8, verse: 4 }, phrases: { RVR1909: 'carne', BLM: 'carne', VBL: 'naturaleza pecaminosa' } },
        { verse: { book: 'ROM', chapter: 8, verse: 13 }, phrases: { RVR1909: 'carne', BLM: 'carne', VBL: 'naturaleza pecaminosa' } },
      ],
    },
    'romans-8:kw:pneuma': {
      english: 'Espíritu',
      basicMeaning: 'espíritu, aliento; el Espíritu (Santo)',
      semanticRange: [
        'viento; aliento',
        'el espíritu humano: «nuestro espíritu» (8:16)',
        'una disposición o un estado de ánimo: «el espíritu de servidumbre» (8:15)',
        'el Espíritu Santo: «el Espíritu de Dios», «el Espíritu de Cristo» (8:9)',
      ],
      grammar: 'Sustantivo, genitivo singular neutro (τοῦ πνεύματος τῆς ζωῆς, «del Espíritu de vida», 8:2)',
      significance:
        'Veintiuno de los 34 usos de πνεῦμα en Romanos están en este capítulo, frente a cinco en los capítulos 1–7; ningún otro capítulo del Nuevo Testamento se le acerca (le sigue 1 Corintios 12, con 12). En una sola frase es «el Espíritu de Dios» y «el Espíritu de Cristo» (8:9). Él libera (8:2), da vida ahora y resurrección después (8:10–11), guía a los hijos de Dios (8:14), da testimonio a nuestro espíritu (8:16) e intercede por nosotros (8:26–27).',
      caution:
        'En algunos versículos los traductores deben elegir entre «Espíritu» y «espíritu»: compárese 8:10 (la RVR1909 y la BLM, «el espíritu», con minúscula; la VBL, «el Espíritu»; en inglés, la BSB «your spirit» y la KJV «the Spirit») y 8:15 («el espíritu de servidumbre»). La RVR1909 escribe «espíritu» con minúscula incluso en 8:4 y 8:13. Las mayúsculas son una decisión interpretativa: el texto griego no marca la diferencia.',
      notableNotes: [
        '«El amor de Dios está derramado en nuestros corazones por el Espíritu Santo que nos es dado»: anunciado ya antes del capítulo 8.',
        'Servir «en novedad de espíritu, y no en vejez de letra».',
        '«Andad en el Espíritu»: la misma ética en Gálatas.',
      ],
      anchors: [
        { verse: { book: 'ROM', chapter: 8, verse: 2 }, phrases: { RVR1909: 'Espíritu de vida', BLM: 'Espíritu de vida', VBL: 'Espíritu de vida' } },
        { verse: { book: 'ROM', chapter: 8, verse: 16 }, phrases: { RVR1909: 'el mismo Espíritu', BLM: 'El Espíritu mismo', VBL: 'El Espíritu mismo' } },
      ],
    },
    'romans-8:kw:phronema': {
      english: 'intención (mentalidad)',
      basicMeaning: 'el pensamiento; aquello en que se fija la mente, el propósito',
      semanticRange: ['lo que hay en la mente: pensamiento, perspectiva, mentalidad', 'propósito (la glosa de STEPBible)'],
      grammar: 'Sustantivo, nominativo singular neutro',
      significance:
        'Los cuatro usos de este sustantivo en el Nuevo Testamento están en Romanos 8 (dos en 8:6, uno en 8:7 y otro en 8:27). La carne y el Espíritu tienen cada uno su «intención»: una orientación de la voluntad y del deseo, no solo un conjunto de ideas (la nota de Tyndale sobre el verbo emparentado de 8:5 señala lo mismo). Esa orientación desemboca en la muerte o en «vida y paz» (8:6); y en 8:27 el Padre sabe «cuál es el intento del Espíritu» mientras el Espíritu intercede.',
      notableNotes: [
        '«La intención de la carne es enemistad contra Dios.»',
        '«El que escudriña los corazones, sabe cuál es el intento del Espíritu»: la misma palabra, aplicada al Espíritu.',
      ],
      anchors: [
        { verse: { book: 'ROM', chapter: 8, verse: 6 }, phrases: { RVR1909: 'intención de la carne', BLM: 'mente de la carne', VBL: 'mente humana y pecaminosa' } },
      ],
    },
    'romans-8:kw:huiothesia': {
      english: 'adopción',
      basicMeaning: 'adopción (como hijo)',
      semanticRange: [
        'adopción de un hijo o una hija (término jurídico frecuente en las inscripciones)',
        'la relación de Dios con Israel (Ro 9:4)',
        'la relación de Dios con los cristianos (Ro 8:15; Gá 4:5; Ef 1:5)',
        'su consumación futura (Ro 8:23)',
      ],
      grammar: 'Sustantivo, genitivo singular femenino (πνεῦμα υἱοθεσίας, «espíritu de adopción», 8:15)',
      significance:
        'Solo Pablo usa esta palabra en el Nuevo Testamento (5 veces), y Romanos 8 la emplea en presente y en futuro: el espíritu de adopción ya se ha recibido (8:15), y sin embargo seguimos gimiendo, «esperando la adopción, es á saber, la redención de nuestro cuerpo» (8:23). Pablo toma un término jurídico grecorromano (el hijo adoptado recibía todos los derechos de heredero, según la nota de Tyndale sobre 8:15), pero lo llena con la historia de Israel, pues «la adopción» perteneció primero a Israel (9:4; Éx 4:22).',
      caution:
        'Conviene no aplicar a Pablo cada detalle del derecho romano de adopción; las notas de Tyndale remiten también a la imagen veterotestamentaria de Israel como hijo de Dios (Éx 4:22; Os 11:1).',
      notableNotes: [
        '«De los cuales es la adopción»: el privilegio perteneció primero a Israel.',
        'Para que «recibiésemos la adopción de hijos»: el Hijo, enviado para redimir.',
        '«Habiéndonos predestinado para ser adoptados hijos por Jesucristo».',
      ],
      anchors: [
        { verse: { book: 'ROM', chapter: 8, verse: 15 }, phrases: { RVR1909: 'adopción', BLM: 'adopción', VBL: 'los convierte en hijos' } },
        { verse: { book: 'ROM', chapter: 8, verse: 23 }, phrases: { RVR1909: 'adopción', BLM: 'adopción', VBL: 'adopte' } },
      ],
    },
    'romans-8:kw:abba': {
      english: 'Abba',
      basicMeaning: 'padre (arameo אַבָּא, forma enfática de אַב)',
      semanticRange: [
        'padre: la palabra aramea corriente en la familia, usada aquí como tratamiento directo',
        'en el Nuevo Testamento va siempre acompañada del griego ὁ πατήρ: «Abba, Padre»',
      ],
      grammar: 'Sustantivo, vocativo singular masculino: palabra aramea indeclinable escrita con letras griegas',
      significance:
        'Pablo deja sin traducir la palabra aramea en una carta escrita en griego y añade su equivalente griego. Sus únicos otros usos en el Nuevo Testamento son la oración de Jesús en Getsemaní (Marcos 14:36) y Gálatas 4:6, lo que sugiere que el tratamiento que usaba Jesús se convirtió en la oración atesorada de las iglesias de habla griega. Para Pablo es el Espíritu quien hace posible este clamor: los creyentes oran a Dios como oraba Jesús, como hijos y no como esclavos.',
      caution:
        'La enseñanza popular suele afirmar que abba significa «papi» o «papito» (algunas notas de estudio, incluida la de Tyndale sobre 8:15, todavía lo dicen). James Barr (1988) sostuvo que las pruebas no respaldan la idea de un lenguaje infantil: abba era una palabra familiar de uso diario, empleada por hijos e hijas pequeños y adultos, pero su matiz es «Padre», no «papi».',
      notableNotes: [
        'Jesús en Getsemaní: «Abba, Padre… no lo que yo quiero, sino lo que tú».',
        'El Espíritu del Hijo, enviado a los corazones, «el cual clama: Abba, Padre».',
      ],
      anchors: [{ verse: { book: 'ROM', chapter: 8, verse: 15 }, phrases: { RVR1909: 'Abba', BLM: 'Abba' } }],
    },
    'romans-8:kw:aparche': {
      english: 'primicias',
      basicMeaning: 'primicias',
      semanticRange: [
        'la primera porción de un sacrificio o de una cosecha, ofrecida a Dios',
        'las primicias de la cosecha (Lv 23:10 en el Antiguo Testamento griego) y de la masa (Ro 11:16; cf. Nm 15:20)',
        'en sentido figurado: los primeros convertidos de una región (Ro 16:5); el Cristo resucitado (1 Co 15:20, 23)',
      ],
      grammar: 'Sustantivo, acusativo singular femenino',
      significance:
        'En Levítico 23:10 el Antiguo Testamento griego usa esta misma palabra para la primera gavilla de la cosecha, mecida delante del Señor antes de que pudiera comerse nada de la mies. Pablo llama al Espíritu las «primicias» que los creyentes ya poseen: el primer anticipo y la garantía de la cosecha que aún ha de venir, la adopción plena y la resurrección del cuerpo (8:23). Usa la misma imagen para la resurrección de Cristo en 1 Corintios 15:20.',
      notableNotes: [
        '«Mas ahora Cristo ha resucitado de los muertos; primicias de los que durmieron es hecho.»',
        'La masa ofrecida como primicia hace santa toda la masa.',
      ],
      anchors: [{ verse: { book: 'ROM', chapter: 8, verse: 23 }, phrases: { RVR1909: 'primicias', BLM: 'primicias', VBL: 'anticipo' } }],
    },
    'romans-8:kw:sunergeo': {
      english: 'ayudan a bien (cooperan)',
      basicMeaning: 'colaborar; obrar juntamente',
      semanticRange: [
        'obrar juntamente con otro, cooperar (Mc 16:20; 1 Co 16:16; Stg 2:22)',
        'hacer que algo coopere: un sentido transitivo atestiguado en autores helenísticos, que algunos adoptan para Ro 8:28',
      ],
      grammar: 'Verbo, presente activo indicativo, 3.ª persona del singular',
      significance:
        'El griego de 8:28 admite más de una construcción, y por eso las traducciones difieren: «todas las cosas les ayudan á bien» (RVR1909; la BLM, «todas las cosas cooperan para el bien»; en inglés, la KJV y la WEB) o «en todas las cosas Dios obra para el bien» (VBL; en inglés, la BSB). Un pequeño grupo de manuscritos explicita el sujeto añadiendo «Dios» (ὁ θεός), lectura que adoptó la edición de Westcott y Hort, aunque las demás ediciones de los datos de STEPBible, incluido el texto bizantino, no la tienen. El léxico de Abbott-Smith recoge un sentido intransitivo y otro transitivo. En cualquier caso, el contexto hace decisivo el propósito de Dios (8:28b–30), y 8:29 define el «bien»: ser hechos conformes a la imagen de su Hijo.',
      caution:
        'Pablo no dice que todo acontecimiento sea bueno, ni que las cosas acaben bien para todo el mundo. La promesa es para «los que á Dios aman», los que «conforme al propósito son llamados», y el bien que tiene en mente es la semejanza con Cristo, que puede llegar a través del sufrimiento (8:17, 35–36).',
      notableNotes: [
        'En Abraham, «la fe obró con sus obras».',
        '«Como ayudadores juntamente con él»: el mismo verbo, para la cooperación humana con Dios.',
      ],
      anchors: [
        { verse: { book: 'ROM', chapter: 8, verse: 28 }, phrases: { RVR1909: 'todas las cosas les ayudan', BLM: 'cooperan', VBL: 'Dios obra para el bien' } },
      ],
    },
    'romans-8:kw:proginosko': {
      english: 'antes conoció',
      basicMeaning: 'conocer de antemano, preconocer (glosa de STEPBible: «conocer/escoger»)',
      semanticRange: [
        'conocer de antemano, cuando se trata de personas que saben algo por anticipado (Hch 26:5; 2 P 3:17)',
        'la presciencia de Dios (Ro 8:29; 11:2; 1 P 1:20)',
      ],
      grammar: 'Verbo, aoristo segundo activo indicativo, 3.ª persona del singular',
      significance:
        'Toda la cadena de 8:29–30 depende de este primer verbo, y su significado se discute. Su objeto son personas («á los que antes conoció»), no hechos acerca de ellas, y en el Antiguo Testamento «conocer» puede significar escoger a alguien o poner en él el amor (Amós 3:2). Por eso los lectores reformados lo entienden como «amar de antemano»; otros lo leen como el conocimiento anticipado que Dios tiene de quienes iban a creer. El verbo aparece cinco veces en el Nuevo Testamento. Las perspectivas sobre 8:29–30 se exponen en el apartado de Teología.',
      caution:
        'Un solo verbo no puede zanjar la doctrina de la elección; hay que sopesar también el argumento que lo rodea (8:28–39) y Romanos 9–11.',
      notableNotes: [
        '«No ha desechado Dios á su pueblo, al cual antes conoció»: el objeto vuelve a ser personas.',
        'Cristo, conocido ya antes de la fundación del mundo.',
        'Conocimiento humano anticipado: los acusadores de Pablo lo conocían desde hacía mucho tiempo.',
      ],
      anchors: [
        { verse: { book: 'ROM', chapter: 8, verse: 29 }, phrases: { RVR1909: 'antes conoció', BLM: 'conoció de antemano', VBL: 'escogiéndolos de antemano' } },
      ],
    },
  },

  crossReferences: {
    'romans-8:xr:rom-7-24': {
      title: 'Del «¡Miserable hombre de mí!» a «ninguna condenación»',
      explanation:
        'Romanos 7 termina con un grito —«¿quién me librará del cuerpo de esta muerte?»— y con una acción de gracias por Jesucristo. Romanos 8:1 saca la conclusión («Ahora pues»): la lucha del capítulo 7 es real, pero no decide la situación del creyente ante Dios. Donde 7:23 hablaba de «la ley del pecado» que lleva cautivo, 8:2 anuncia que «la ley del Espíritu de vida en Cristo Jesús me ha librado». La división en capítulos se añadió más tarde; el argumento de Pablo sigue de corrido.',
    },
    'romans-8:xr:rom-5-16': {
      title: 'Condenación en Adán, vida en Cristo',
      explanation:
        'Los únicos otros usos de κατάκριμα en el Nuevo Testamento están aquí: un solo delito trajo condenación a todos los hombres, pero por una sola justicia vino la gracia a todos «para justificación de vida». Romanos 8:1 aplica 5:18 a los que están en Cristo: el veredicto pronunciado sobre la humanidad en Adán ha sido sustituido.',
    },
    'romans-8:xr:jhn-3-17': {
      title: 'El que cree no es condenado',
      explanation:
        'Las palabras de Jesús a Nicodemo enuncian el mismo veredicto: Dios no envió a su Hijo al mundo «para que condene al mundo, mas para que el mundo sea salvo por él», y «el que en él cree, no es condenado». Juan usa el verbo más simple κρίνω («juzgar», aquí en el sentido de juzgar en contra) y vincula la libertad de la condenación a creer en el Hijo; Pablo, a estar «en Cristo Jesús». Son dos ángulos de una misma unión.',
    },
    'romans-8:xr:gal-5-16': {
      title: 'La carne contra el Espíritu',
      explanation:
        'Es el otro tratamiento extenso de Pablo sobre la carne y el Espíritu. Gálatas describe el conflicto («la carne codicia contra el Espíritu») y el fruto del Espíritu (5:22–23); Romanos 8 fundamenta la misma llamada —andar conforme al Espíritu (Ro 8:4) o «en el Espíritu» (Gá 5:16, 25)— en la obra vivificadora del Espíritu. Leídos juntos, muestran que la «carne» es un poder y una forma de vida, no simplemente el cuerpo.',
    },
    'romans-8:xr:gal-4-4': {
      title: '«Abba, Padre» en Gálatas',
      explanation:
        'Es el paralelo más cercano en Pablo. Dios envió a su Hijo para que «recibiésemos la adopción de hijos», y envió «el Espíritu de su Hijo en vuestros corazones, el cual clama: Abba, Padre»; por tanto, «ya no eres más siervo, sino hijo; y si hijo, también heredero». La misma secuencia (adopción, Espíritu, clamor de «Abba», de esclavo a hijo, heredero) recorre Romanos 8:14–17. En Gálatas clama el Espíritu; en Romanos somos nosotros quienes clamamos por el Espíritu.',
    },
    'romans-8:xr:exo-4-22': {
      title: 'Israel, el primogénito de Dios',
      explanation:
        'En el relato del éxodo, Dios llamó a Israel «mi hijo, mi primogénito» y ordenó al faraón que dejara ir a su hijo. El lenguaje de Pablo sobre hijos guiados por el Espíritu y liberados del «espíritu de servidumbre» evoca esa historia (la nota de Tyndale sobre 8:14 cita Éx 4:22; N. T. Wright sostiene que todo Romanos 5–8 vuelve a contar el éxodo). El Antiguo Testamento griego llama a Israel πρωτότοκος de Dios, «primogénito»: el título que Pablo da a Cristo «entre muchos hermanos» en 8:29.',
    },
    'romans-8:xr:gen-3-17': {
      title: 'La tierra, maldita por causa de Adán',
      explanation:
        'Tras el pecado de Adán, Dios dijo: «maldita será la tierra por amor de ti»: espinos, fatiga y el regreso al polvo. Cuando Pablo dice que la creación fue sujetada a vanidad «por causa del que las sujetó con esperanza», remite con toda naturalidad a este juicio: John Wesley identifica al que la sujetó con Dios y remite a Génesis 3:17, y la nota de Tyndale hace remontar el daño de la creación a la caída de Adán. Romanos añade lo que Génesis solo insinúa: la sujeción fue «con esperanza», y la creación participará de «la libertad gloriosa de los hijos de Dios».',
    },
    'romans-8:xr:lev-23-10': {
      title: 'La gavilla de las primicias',
      explanation:
        'Israel llevaba al sacerdote «un omer por primicia de los primeros frutos» de la siega —la primera gavilla—, y el sacerdote lo mecía delante del Señor; no se podía comer pan ni grano «hasta este mismo día, hasta que hayáis ofrecido la ofrenda de vuestro Dios». El Antiguo Testamento griego llama ἀπαρχή a esa gavilla, la palabra que Pablo usa para el Espíritu en 8:23. La primera gavilla consagraba y a la vez prometía toda la cosecha: así, el Espíritu es la prenda que Dios da de la redención plena que aún ha de venir.',
    },
    'romans-8:xr:1co-15-20': {
      title: 'Cristo, primicias de la resurrección',
      explanation:
        'Pablo usa la misma imagen de la cosecha para Cristo: resucitado como «primicias de los que durmieron», a quien seguirán «los que son de Cristo, en su venida». Romanos 8 nombra el vínculo entre las dos cosechas: el Espíritu del que levantó a Jesús vivificará también nuestros cuerpos mortales (8:11), y nosotros, que tenemos las primicias del Espíritu, esperamos «la redención de nuestro cuerpo» (8:23).',
    },
    'romans-8:xr:2co-5-2': {
      title: 'Gemidos en este tabernáculo',
      explanation:
        'También aquí los creyentes «gemimos» —el mismo verbo (στενάζω) que en Romanos 8:23—, anhelando ser revestidos de la vida de la resurrección, y es Dios quien «nos ha dado la prenda del Espíritu». Ambos pasajes sostienen a la vez el gemido presente y la gloria futura, con el Espíritu como garantía entre uno y otra.',
    },
    'romans-8:xr:eph-1-13': {
      title: 'El Espíritu, arras de la herencia',
      explanation:
        'Efesios llama al Espíritu Santo «las arras de nuestra herencia, para la redención de la posesión adquirida»: la misma lógica de Romanos 8:17 y 8:23 —herederos ya ahora, herencia plena y redención después—, con el Espíritu como garantía entre ambos momentos. La nota de Tyndale sobre 8:23 relaciona los dos pasajes.',
    },
    'romans-8:xr:ps-44-22': {
      title: '«Como ovejas de matadero»',
      explanation:
        'Pablo cita el Salmo griego casi palabra por palabra (Salmo 43:23 según la numeración de la Septuaginta). El Salmo 44 es el lamento de un pueblo que podía decir «no nos hemos olvidado de ti; y no hemos faltado á tu pacto», y que aun así sufría «por tu causa». Citarlo muestra que el sufrimiento no es señal de que Dios rechace a los suyos: los fieles siempre han sufrido por él (Calvino señala lo mismo); y Pablo responde enseguida a la queja del salmo: «en todas estas cosas hacemos más que vencer» (8:37).',
    },
    'romans-8:xr:isa-50-8': {
      title: '«¿Quién hay que me condene?»',
      explanation:
        'En el tercer cántico del Siervo, el Siervo dice: «Cercano está de mí el que me justifica… ¿quién hay que me condene?». También el Antiguo Testamento griego habla en la primera línea del que justifica (ὁ δικαιώσας με; en la traducción inglesa de Brenton, «he that has justified me draws near»). El tribunal de Pablo —«Dios es el que justifica. ¿Quién es el que condenará?»— hace eco de la confianza del Siervo y la extiende a todos los que pertenecen a Cristo.',
    },
    'romans-8:xr:gen-22-12': {
      title: '«El que aun á su propio Hijo no perdonó»',
      explanation:
        'Abraham recibe este elogio: «no me rehusaste tu hijo, tu único». El Antiguo Testamento griego dice οὐκ ἐφείσω —en la traducción inglesa de Brenton, «thou hast not spared thy beloved son»—, el mismo verbo que Pablo usa en 8:32 (οὐκ ἐφείσατο). La nota de Tyndale ve Génesis 22 detrás de las palabras de Pablo. El contraste es lo decisivo: a Isaac se le perdonó la vida en el último momento; al propio Hijo de Dios, no.',
    },
    'romans-8:xr:heb-7-25': {
      title: 'Cristo vive para interceder',
      explanation:
        'Hebreos usa el mismo verbo (ἐντυγχάνω) para el Cristo resucitado: está «viviendo siempre para interceder por ellos». Romanos 8 presenta dos intercesores —el Espíritu en nosotros (8:26–27) y Cristo a la diestra de Dios (8:34)—, y Hebreos fundamenta la intercesión de Cristo en su sacerdocio permanente.',
    },
    'romans-8:xr:ezk-36-26': {
      title: 'El Espíritu prometido cumple la ley',
      explanation:
        'Ezequiel prometió un corazón nuevo y el Espíritu de Dios dentro de su pueblo: «pondré dentro de vosotros mi espíritu, y haré que andéis en mis mandamientos» (compárese Jer 31:33, la ley escrita en el corazón). Pablo no cita aquí a Ezequiel, pero muchos intérpretes oyen esa promesa detrás de 8:4: «la justicia de la ley» se cumple «en nosotros, que no andamos conforme á la carne, mas conforme al espíritu». Lo que la ley no podía hacer desde fuera (8:3), el Espíritu prometido lo hace desde dentro.',
    },
    'romans-8:xr:rev-21-1': {
      title: '«He aquí, yo hago nuevas todas las cosas»',
      explanation:
        'Romanos 8 ve a la creación esperando ser librada «de la servidumbre de corrupción»; la visión final del Apocalipsis describe la misma esperanza: «un cielo nuevo, y una tierra nueva», sin muerte ni dolor, y el que está sentado en el trono dice: «He aquí, yo hago nuevas todas las cosas». La nota de Tyndale sobre 8:19–21 cita Ap 21:1–2 para mostrar que la creación participará de las bendiciones que Dios ha prometido a su pueblo. Ambos pasajes esperan la renovación del mundo, no la huida de él.',
    },
    'romans-8:xr:2co-4-16': {
      title: 'Tribulación momentánea, gloria eterna',
      explanation:
        'Pablo hace el mismo cálculo en otro lugar: «lo que al presente es momentáneo y leve de nuestra tribulación, nos obra un sobremanera alto y eterno peso de gloria». Romanos 8:18 dice que los sufrimientos presentes no son «de comparar con la gloria venidera»; 2 Corintios añade que la tribulación actúa de hecho a favor de esa gloria, algo muy cercano a la promesa de 8:28.',
    },
  },

  context: {
    'romans-8:ctx:authorship': {
      title: 'Pablo, desde Corinto, hacia el año 57 d. C.',
      summary:
        'Lo más probable es que Pablo escribiera Romanos durante una estancia de tres meses en Corinto, hacia el final de su tercer viaje misionero (Hch 20:2–3), en torno al año 57 d. C. Estaba a punto de llevar la colecta a la iglesia de Jerusalén (Ro 15:25–26) y esperaba visitar Roma de camino a España (15:24).',
      detail:
        'La recomendación de Febe, de Cencrea, el puerto vecino de Corinto (16:1), apunta al lugar de redacción. Pablo nunca había estado en Roma (1:13), así que la carta lo presenta, a él y a su evangelio, a una iglesia que no había fundado.',
    },
    'romans-8:ctx:occasion': {
      title: 'Por qué escribió Pablo Romanos',
      summary:
        'La introducción de Tyndale señala tres propósitos: exponer el evangelio de Pablo tal como lo había ido forjando durante unos veinticinco años, obtener el apoyo de la iglesia de Roma para una misión en España y sanar una división entre creyentes judíos y gentiles a propósito de la ley (14:1–15:13).',
      detail:
        'Romanos 8 sirve a los tres: es el clímax de la exposición del evangelio (caps. 5–8), da seguridad a misioneros e iglesias que sufren, y su lenguaje de una sola familia de hijos de Dios —judíos y gentiles que claman juntos «Abba, Padre»— sostiene la unidad que Pablo pedirá en los capítulos 14–15.',
    },
    'romans-8:ctx:audience': {
      title: 'Una iglesia de creyentes judíos y gentiles en Roma',
      summary:
        'Los creyentes de Roma se reunían en varias iglesias domésticas, formadas quizá al principio por judíos de Roma convertidos en Pentecostés (Hch 2:10). Después de que el emperador Claudio expulsara de Roma a los judíos (hecho que suele fecharse en el año 49 d. C.; Hch 18:2), probablemente tomaron la dirección los cristianos gentiles; según una reconstrucción muy extendida (que sigue la introducción de Tyndale), las tensiones sobre la ley surgieron cuando regresaron los creyentes judíos.',
      detail:
        'El biógrafo romano Suetonio refiere que Claudio expulsó de Roma a los judíos porque provocaban continuos disturbios a instigación de un tal Cresto (Chrestus; Claudius 25.4). Muchos historiadores ven en «Chrestus» una referencia deformada a Cristo, aunque la cuestión se discute. Para Romanos 8 importa este público mixto: «Abba, Padre» une una palabra aramea y otra griega, y el lenguaje de Pablo sobre la filiación y la herencia se nutre de la historia de Israel para una iglesia que está aprendiendo a ser una sola familia.',
    },
    'romans-8:ctx:adoption': {
      title: 'La adopción en el mundo romano',
      summary:
        'Según la costumbre grecorromana, un hombre podía adoptar a un hijo y conferirle todos los derechos y privilegios legales de un hijo natural, incluida la herencia. La práctica llegó hasta la familia imperial: Julio César adoptó a Octavio, que gobernó como Augusto.',
      detail:
        'Los lectores de Pablo en la capital lo habrían sabido. Pero su idea arraiga también en el Antiguo Testamento, donde Israel es hijo de Dios (Éx 4:22; Os 11:1) y «la adopción» pertenece a Israel (Ro 9:4). En Romanos 8 la adopción es a la vez una condición presente (8:15) y una culminación futura: «la adopción, es á saber, la redención de nuestro cuerpo» (8:23).',
    },
    'romans-8:ctx:abba': {
      title: 'Abba: la palabra aramea con la que oraba Jesús',
      summary:
        'Abba es la palabra aramea para «padre», la lengua cotidiana de la Galilea de Jesús. El Evangelio de Marcos la conserva en labios de Jesús en Getsemaní (Marcos 14:36), y Pablo la cita dos veces como el clamor de los creyentes, siempre con la palabra griega para «Padre» al lado (Ro 8:15; Gá 4:6).',
      detail:
        'Que la palabra aramea sobreviviera sin traducir en iglesias de habla griega sugiere cuánto valoraban los primeros cristianos orar como oraba Jesús. Era una palabra familiar de uso diario, empleada por hijos pequeños y adultos; James Barr (1988) sostuvo que las pruebas no respaldan la afirmación popular de que significa «papi». John Wesley sugirió que, al usar juntas la palabra aramea (él la llama «siríaca») y la griega, san Pablo parece señalar el clamor conjunto de los creyentes judíos y gentiles.',
    },
    'romans-8:ctx:exodus': {
      title: 'De la esclavitud a la filiación: la historia del éxodo',
      summary:
        'Pablo contrapone «el espíritu de servidumbre para estar otra vez en temor» al «espíritu de adopción» (8:15). La historia fundacional de Israel hace exactamente ese recorrido: Dios llamó a Israel «mi hijo, mi primogénito» y lo sacó de la esclavitud de Egipto (Éx 4:22–23).',
      detail:
        'N. T. Wright sostiene que Romanos 5–8 vuelve a contar el éxodo: el pecado tiene esclavizada a la humanidad como el faraón a Israel, la muerte y la resurrección del Mesías traen la liberación, el Espíritu se da allí donde Israel recibió la ley en el Sinaí, y un camino conduce a la herencia, que ahora es toda la creación renovada (8:17–25). No todos los lectores encuentran el esquema tan omnipresente, pero el lenguaje de esclavitud, hijos y herederos de 8:14–17 bebe claramente de la historia de Israel (nota de Tyndale sobre 8:14).',
    },
    'romans-8:ctx:firstfruits': {
      title: 'La ofrenda de las primicias',
      summary:
        'Al comienzo de la siega, Israel llevaba la primera gavilla al sacerdote, que la mecía delante del Señor; solo entonces podía comerse la nueva cosecha (Lv 23:9–14; compárese Éx 23:19).',
      detail:
        'La primera porción se consagraba a Dios y servía de prenda de toda la cosecha. Pablo aplica la imagen al Espíritu, ya dado a los creyentes (Ro 8:23), y en otro lugar a la resurrección de Cristo como la primera de muchas (1 Co 15:20).',
    },
    'romans-8:ctx:suffering': {
      title: 'Penalidades reales detrás de la lista de 8:35',
      summary:
        'Tribulación, angustia, persecución, hambre, desnudez, peligro o espada: la lista no es un adorno retórico. Pablo enumera esas mismas clases de penalidades en su propio ministerio —«en hambre y sed, en muchos ayunos, en frío y en desnudez» (2 Co 11:27)— y escribe a una iglesia algunos de cuyos miembros ya habían sufrido la expulsión de la ciudad.',
      detail:
        'Al citar el Salmo 44:22 en 8:36, Pablo sitúa ese sufrimiento en la larga fila del pueblo fiel de Dios que ha sufrido «por tu causa». La seguridad que ofrece el capítulo va dirigida a personas para quienes esas amenazas eran posibilidades reales, no a quienes viven cómodos.',
    },
  },

  literary: {
    placeInBook:
      'Romanos 8 cierra el segundo gran movimiento de la carta (caps. 5–8), en el que Pablo asegura a los creyentes que la salvación que Dios ha comenzado será llevada a término. El capítulo 5 anunció la paz con Dios y la inversión del pecado de Adán; los capítulos 6 y 7 mostraron que ni el pecado ni la ley pueden frustrar el propósito de Dios. El capítulo 8 lo recoge todo: el Espíritu libera de la muerte (8:1–17) y asegura a los creyentes que el sufrimiento no les impedirá llegar a la gloria (8:18–39). Los capítulos 9–11 abordan después la pregunta que esto plantea: si los propósitos de Dios no pueden fallar, ¿qué pasa con Israel?',
    argument:
      'Pablo avanza en tres pasos. (1) 8:1–17: como Dios condenó al pecado en la carne de Cristo, el Espíritu da la vida que la ley no podía dar, y los que son guiados por el Espíritu son hijos y herederos de Dios. (2) 8:18–30: los herederos comparten ahora los sufrimientos de Cristo; la creación y los creyentes gimen, y el Espíritu intercede «con gemidos indecibles», pero la esperanza descansa en el propósito de Dios, que va de la presciencia a la gloria. (3) 8:31–39: un tribunal hecho de preguntas —¿quién contra nosotros?, ¿quién acusará?, ¿quién condenará?, ¿quién nos apartará?— que termina en la certeza de que nada puede apartarnos del amor de Dios en Cristo.',
    placeInCanon:
      'Romanos 8 reúne hilos de toda la Biblia: la creación sujeta a vanidad después de Génesis 3 y a la espera de su renovación; Israel como primogénito de Dios sacado de la esclavitud (Éx 4:22); las primicias de la cosecha (Lv 23); la promesa del propio Espíritu de Dios dentro de su pueblo (Ez 36:26–27); y la confianza del Siervo en que Dios lo vindicará (Is 50:8–9). Y mira hacia adelante, al cielo nuevo y la tierra nueva del Apocalipsis (Ap 21:1–5).',
    bookOutline: [
      'Saludo y tema: la buena noticia de la justicia de Dios',
      'Todos han pecado: gentiles y judíos bajo el pecado',
      'La justicia por la fe en Cristo; Abraham',
      'La seguridad de la salvación: Adán y Cristo, el pecado, la ley y el Espíritu',
      'La fidelidad de Dios a Israel',
      'La vida transformada y la unidad de la iglesia',
      'Planes misioneros de Pablo, saludos y doxología',
    ],
    passageOutline: [
      'Ninguna condenación: el Espíritu hace lo que la ley no podía',
      'Carne y Espíritu: dos formas de vida',
      'Hijos y herederos: el espíritu de adopción',
      'Gemidos y esperanza: la creación, los creyentes y el Espíritu',
      'El propósito de Dios: todas las cosas para bien',
      'Ninguna separación: el tribunal del amor de Dios',
    ],
    features: {
      'romans-8:lit:inclusio': {
        title: 'Ninguna condenación… ninguna separación — «en Cristo Jesús»',
        description:
          'El capítulo se abre y se cierra con la misma expresión: «ninguna condenación hay para los que están en Cristo Jesús» (8:1), y nada «nos podrá apartar del amor de Dios, que es en Cristo Jesús Señor nuestro» (8:39). En griego, 8:1 termina con ἐν Χριστῷ Ἰησοῦ, y 8:39 con ἐν Χριστῷ Ἰησοῦ τῷ κυρίῳ ἡμῶν. El marco muestra la lógica del capítulo: la unión con Cristo es a la vez el fundamento del veredicto y la garantía del amor.',
        structure: [
          { label: '8:1', text: 'Ninguna condenación — para los que están en Cristo Jesús' },
          { label: '8:2–38', text: 'La vida del Espíritu, la adopción, los gemidos y la esperanza, el propósito de Dios, el tribunal' },
          { label: '8:39', text: 'Ninguna separación — del amor de Dios en Cristo Jesús, Señor nuestro' },
        ],
      },
      'romans-8:lit:spirit-repetition': {
        title: 'El Espíritu, veintiuna veces',
        description:
          'La palabra πνεῦμα aparece 21 veces en este capítulo —más que en ningún otro capítulo del Nuevo Testamento— tras solo cinco usos en Romanos 1–7. «Carne» (σάρξ) se concentra en la primera mitad (13 veces en 8:3–13) y luego desaparece, a medida que el capítulo pasa del contraste entre carne y Espíritu a la obra del Espíritu en el sufrimiento y la esperanza.',
      },
      'romans-8:lit:three-groans': {
        title: 'Tres gemidos',
        description:
          'Las criaturas «gimen á una» (8:22, συστενάζει), «nosotros también gemimos dentro de nosotros mismos» (8:23, στενάζομεν), y el Espíritu intercede «con gemidos indecibles» (8:26, στεναγμοῖς). La raíz repetida une la frustración del mundo, el anhelo del creyente y la oración del Espíritu en un solo movimiento hacia la redención.',
        structure: [
          { label: '8:22', text: 'La creación gime, como con dolores de parto' },
          { label: '8:23', text: 'Nosotros gemimos, esperando la adopción y la redención del cuerpo' },
          { label: '8:26', text: 'El Espíritu intercede con gemidos sin palabras' },
        ],
      },
      'romans-8:lit:golden-chain': {
        title: 'La «cadena de oro» de 8:29–30',
        description:
          'Cinco verbos forman una cadena en la que cada eslabón retoma el anterior: antes conoció → predestinó → llamó → justificó → glorificó. La exposición de Romanos del comentario de Matthew Henry —escrita después de la muerte de Henry (1714) por el ministro no conformista John Evans, uno de los que completaron la obra— la llama una cadena de oro que no puede romperse. Llama la atención que «glorificó» esté en pasado, aunque en el resto del capítulo la gloria sigue siendo futura (8:18, 21); la nota de Tyndale lo explica como la decisión firme de Dios, tan segura como si ya se hubiera cumplido.',
        structure: [
          { label: 'antes conoció', text: 'A los que antes conoció…' },
          { label: 'predestinó', text: '…también predestinó para que fuesen hechos conformes a la imagen de su Hijo' },
          { label: 'llamó', text: 'A los que predestinó, a estos también llamó' },
          { label: 'justificó', text: 'A los que llamó, a estos también justificó' },
          { label: 'glorificó', text: 'A los que justificó, a estos también glorificó' },
        ],
      },
      'romans-8:lit:courtroom': {
        title: 'Un tribunal hecho de preguntas (8:31–39)',
        description:
          'Pablo termina con una cascada de preguntas retóricas —«Si Dios por nosotros, ¿quién contra nosotros?», «¿Quién acusará á los escogidos de Dios?», «¿Quién es el que condenará?», «¿Quién nos apartará del amor de Cristo?»—, y cada una se responde con lo que Dios ha hecho en Cristo, el mismo fundamento sobre el que descansa el veredicto de 8:1. Las enumeraciones de 8:35 y 8:38–39 dan al cierre un carácter rítmico, casi de himno, aunque sigue siendo argumentación.',
      },
    },
  },

  theology: {
    'romans-8:th:no-condemnation': {
      title: 'Ninguna condenación: el veredicto y la vida nueva',
      summary:
        'Porque Dios condenó al pecado en la carne de su Hijo, enviado como ofrenda por el pecado (8:3), los que están en Cristo Jesús no están bajo ninguna sentencia de condenación (8:1), y al final ninguna acusación puede prosperar contra los escogidos de Dios (8:33–34).',
      detail:
        'Los cristianos de todas las tradiciones confiesan que los creyentes quedan libres de la condenación por la muerte y la resurrección de Cristo. Los protestantes subrayan el veredicto judicial —Calvino, sobre 8:34: no queda condenación cuando se ha satisfecho a las leyes y la pena ya está pagada—, aunque Calvino insistía también en que la gracia de la regeneración nunca se separa de la imputación de la justicia (sobre 8:2). Juan Crisóstomo leyó 8:1 como liberación no solo de los pecados pasados, sino para una vida nueva sostenida por el Espíritu. Las tradiciones siguen difiriendo en cómo se relacionan el veredicto y la renovación. Las confesiones protestantes distinguen la justificación —Dios perdona a los pecadores y los acepta como justos por causa de Cristo, no infundiéndoles justicia (Confesión de Westminster 11.1)— de la santificación que siempre la acompaña (cap. 13), mientras que el Concilio de Trento definió la justificación misma como no solo la remisión de los pecados, sino también la santificación y renovación del hombre interior. Romanos 8 mantiene unidos el veredicto y la vida nueva; cómo se relacionan ambos sigue siendo una diferencia entre confesiones.',
    },
    'romans-8:th:spirit': {
      title: 'El Espíritu que habita en el creyente',
      summary:
        'El Espíritu es «el Espíritu de Dios» y «el Espíritu de Cristo» (8:9). Habita en todo creyente, da vida ahora y resurrección después (8:10–11), guía a los hijos de Dios (8:14), da testimonio a su espíritu (8:16) e intercede en su flaqueza (8:26–27).',
      detail:
        'Romanos 8 es uno de los capítulos más ricamente trinitarios del Nuevo Testamento: el Padre envía al Hijo (8:3), lo resucita (8:11) y escucha la intercesión del Espíritu (8:27); el Hijo muere, resucita e intercede (8:34); el Espíritu habita, guía y ora. El Espíritu no suprime la responsabilidad humana ni hace imposible el pecado, pero es el poder decisivo de la vida cristiana (nota de Tyndale sobre 8:9).',
    },
    'romans-8:th:adoption': {
      title: 'La adopción: hijos y herederos',
      summary:
        'Los creyentes han recibido «el espíritu de adopción», por el cual llaman a Dios «Abba, Padre»; como hijos, son «herederos de Dios, y coherederos de Cristo» (8:15–17), aunque todavía esperan la adopción plena, la redención del cuerpo (8:23).',
      detail:
        'J. I. Packer situaba la adopción en la cumbre de las bendiciones del evangelio, por encima incluso de la justificación: la justificación resuelve nuestra situación ante Dios como Juez, mientras que la adopción nos introduce en su familia como hijos suyos, y Packer instaba a los cristianos a entender toda su vida a esa luz. Es también una familia que sufre: los coherederos padecen «juntamente con él, para que juntamente con él seamos glorificados» (8:17).',
    },
    'romans-8:th:mortification': {
      title: 'Hacer morir el pecado por el Espíritu',
      summary:
        '«Si por el espíritu mortificáis las obras de la carne, viviréis» (8:13). La libertad de la condenación no pone fin a la lucha contra el pecado; la hace posible y esperanzada, porque se libra por el Espíritu.',
      detail:
        'La obra de John Owen Of the Mortification of Sin in Believers (1656) está construida sobre este versículo. Su tesis: los creyentes más escogidos, aunque estén con toda certeza libres del poder condenatorio del pecado, deben ocuparse todos los días de su vida en mortificar el poder del pecado que mora en ellos. Owen advertía también que la mortificación hecha con las propias fuerzas, para establecer la propia justicia, es la esencia de la religión falsa: mortificar el pecado es obra del Espíritu.',
    },
    'romans-8:th:new-creation': {
      title: 'Gemidos y gloria: la redención de la creación y del cuerpo',
      summary:
        'Toda la creación, sujeta a vanidad «con esperanza», aguarda con anhelo ser librada «de la servidumbre de corrupción» cuando los hijos de Dios sean manifestados en gloria; también los creyentes esperan «la redención de nuestro cuerpo» (8:19–23).',
      detail:
        'La esperanza cristiana de Romanos 8 no es la huida del mundo material, sino su liberación, junto con la resurrección del cuerpo. El Espíritu es las primicias de esa cosecha (8:23). N. T. Wright extrae de ello una consecuencia práctica: si el pueblo de Dios ha de heredar la creación liberada, debe cuidar ya ahora del orden creado.',
    },
    'romans-8:th:providence': {
      title: 'El propósito de Dios y la seguridad del creyente',
      summary:
        'Para los que aman a Dios y son llamados conforme a su propósito, Dios hace que todas las cosas cooperen para bien: el bien de ser hechos conformes a su Hijo (8:28–29). Nada en toda la creación puede apartarlos de su amor en Cristo (8:38–39).',
      detail:
        'Todas las tradiciones cristianas leen 8:28–39 como palabra de seguridad para creyentes que sufren. Difieren en cómo se relacionan la presciencia y la predestinación de Dios con la fe y la perseverancia humanas (véanse las perspectivas sobre 8:29–30), pero coinciden en que el fundamento de la confianza es el amor de Dios manifestado al no perdonar a su propio Hijo (8:32).',
    },
  },

  perspectives: {
    'romans-8:ps:foreknowledge': {
      question: '¿Qué significa que Dios «antes conoció» y «predestinó» (8:29–30)?',
      intro:
        'Todas las tradiciones cristianas afirman que la salvación comienza en el propósito lleno de gracia de Dios y que Pablo escribió 8:29–30 para dar seguridad. Difieren en cómo se relaciona la presciencia de Dios con la fe humana, y en si cada eslabón de la cadena se cumple siempre en las mismas personas.',
      commonGround:
        'Todos coinciden en que la salvación tiene su origen en la iniciativa de la gracia de Dios, en que nadie se salva sin la gracia y sin la fe en Cristo, en que la meta de la predestinación es la conformidad con la imagen del Hijo, y en que Pablo escribió 8:28–39 para dar seguridad a creyentes que sufren, no para invitar a especular.',
      perspectives: {
        'romans-8:ps:foreknowledge:reformed': {
          tradition: 'Reformada',
          label: 'La presciencia como amor que elige; una cadena irrompible',
          summary:
            'El conocer de antemano de Dios es su elección previa y personal de poner su amor en personas concretas —el objeto de «antes conoció» son personas, no sus decisiones previstas—, y cada eslabón sigue infaliblemente al anterior: todos los predestinados son llamados, todos los llamados justificados, todos los justificados glorificados. La Confesión de Westminster (3.5, que cita Ro 8:30) dice que Dios eligió sin prever la fe ni las buenas obras; los Cánones de Dort (I.9), que la elección no se fundó en la fe prevista. R. C. Sproul y John Piper defienden esta lectura en sermones sobre este pasaje.',
        },
        'romans-8:ps:foreknowledge:wesleyan': {
          tradition: 'Arminiana / wesleyana',
          label: 'Elección de aquellos que Dios previó que creerían; la cadena como método de Dios',
          summary:
            'Dios, en Cristo, se propuso salvar a quienes por la gracia creerían y perseverarían (Artículos de la Remonstrancia, 1610, art. I). La gracia va primero: los Artículos enseñan que el ser humano caído no puede por sí mismo pensar, querer ni hacer nada verdaderamente bueno —tampoco la fe salvadora—, sino que necesita nacer de nuevo de Dios en Cristo por el Espíritu Santo (art. III); que ni siquiera el regenerado puede hacer bien alguno sin la gracia preveniente o auxiliadora, que despierta, acompaña y coopera; y que esta gracia no es irresistible (art. IV). John Wesley leyó 8:29–30 como la descripción del método por el que Dios nos conduce paso a paso hacia el cielo: Pablo, sostenía, no afirma que sea exactamente el mismo número de personas el que es llamado, justificado y glorificado.',
        },
        'romans-8:ps:foreknowledge:lutheran': {
          tradition: 'Luterana',
          label: 'La elección es causa de la salvación, nunca de la condenación — y se busca en Cristo',
          summary:
            'La Fórmula de Concordia (art. XI) distingue la presciencia de Dios, que se extiende a todos, de la elección, que se extiende solo a los hijos de Dios buenos y amados y es la causa de su salvación. Pero rechaza toda predestinación a la condenación: Cristo desea de veras que todos vengan a él, y los que se pierden lo hacen por su propio desprecio de la Palabra. La elección no ha de indagarse en el consejo oculto de Dios, sino en Cristo y en el evangelio, y, siguiendo el orden de Pablo en Romanos, ha de enseñarse después del arrepentimiento y la fe, para consuelo. El Prefacio de Lutero a Romanos ya había recomendado ese orden: fijar primero la atención en Cristo y en el evangelio, luchar contra el pecado como enseñan los capítulos 1–8 y solo entonces, bajo la cruz y el sufrimiento del capítulo 8, aprender de los capítulos 9–11 el consuelo de la providencia de Dios. (La Fórmula misma es de 1577, tres décadas después de la muerte de Lutero.)',
        },
        'romans-8:ps:foreknowledge:catholic': {
          tradition: 'Católica',
          label: 'Predestinación por gracia con libre cooperación',
          summary:
            'El Concilio de Trento enseña que la justificación comienza con la gracia preveniente de Dios, que llama a las personas sin mérito alguno por su parte, y que estas se disponen asintiendo libremente a esa gracia y cooperando con ella, pudiendo también rechazarla (sesión 6, cap. 5). Advierte contra la presunción de contarse con certeza, sin una revelación especial, entre los predestinados (cap. 12), y rechaza la idea de que quienes son llamados pero no se salvan estuvieran predestinados al mal (canon 17). Dentro de estos límites, los teólogos católicos difieren: los tomistas sostienen una predestinación a la gloria anterior a los méritos previstos; muchos molinistas, en vista de ellos.',
        },
        'romans-8:ps:foreknowledge:orthodox': {
          tradition: 'Ortodoxa oriental',
          label: 'Presciencia sin coacción; participar por gracia en la semejanza del Hijo',
          summary:
            'La tradición oriental lee el pasaje en clave de la presciencia de Dios y de una respuesta humana libre. Juan Crisóstomo subrayaba que el llamamiento no se impuso por la fuerza ni fue obligatorio: todos fueron llamados, pero no todos obedecieron; y Juan Damasceno enseñó que, aunque Dios conoce de antemano todas las cosas, no las predetermina todas. El acento recae en la meta de 8:29: en palabras de Crisóstomo, lo que el Unigénito era por naturaleza, ellos lo han llegado a ser por gracia.',
        },
      },
    },
    'romans-8:ps:groanings': {
      question: '¿Qué son los «gemidos indecibles» de 8:26?',
      intro:
        'Intérpretes cuidadosos no están seguros de quién gime ni de si se trata de una oración audible. La cuestión afecta a cómo entienden los cristianos la oración en la debilidad, no a ninguna doctrina central.',
      commonGround:
        'Todos coinciden en que el Espíritu ayuda a los creyentes precisamente cuando no saben orar, y en que Dios entiende la oración que no puede expresarse con palabras y la atiende «conforme á la voluntad de Dios» (8:27).',
      perspectives: {
        'romans-8:ps:groanings:spirit': {
          tradition: 'Lectura moderna común',
          label: 'La intercesión sin palabras del propio Espíritu',
          summary:
            'Los gemidos son del Espíritu, no nuestros: cuando no sabemos orar, el Espíritu mismo intercede ante Dios de maneras que no pueden expresarse con palabras, y el Padre, que escudriña los corazones, las entiende (8:27). Es la lectura de la nota de estudio de Tyndale.',
        },
        'romans-8:ps:groanings:prompted': {
          tradition: 'Comentario y predicación reformados (Calvino, Spurgeon)',
          label: 'Nuestros gemidos, suscitados por el Espíritu',
          summary:
            'El Espíritu no gime literalmente; suscita en los creyentes anhelos demasiado hondos para sus propias palabras, y esos anhelos se le atribuyen a él. Así lo explica Calvino: el Espíritu intercede no porque se rebaje realmente a orar o a gemir, sino porque despierta en nuestro corazón los deseos que debemos albergar. Spurgeon dijo lo mismo en su sermón sobre estos versículos (1880).',
        },
        'romans-8:ps:groanings:charism': {
          tradition: 'Patrística (Juan Crisóstomo)',
          label: 'Un don espiritual de oración en la iglesia primitiva',
          summary:
            'Crisóstomo explicaba el versículo a partir de los dones de la iglesia apostólica: junto a la profecía y las lenguas existía un don de oración, llamado también espíritu, concedido a alguien que oraba con gemidos por toda la iglesia. «Espíritu» significa aquí, sostenía, esa gracia y la persona espiritual que la recibe, no directamente el Consolador.',
        },
        'romans-8:ps:groanings:ecstatic': {
          tradition: 'Algunos intérpretes',
          label: 'Oración inarticulada o extática',
          summary:
            'Algunos entienden que la expresión describe una oración que no adopta la forma del lenguaje humano: sonidos que se emiten cuando los creyentes no saben qué pedir. La nota de Tyndale menciona esta posibilidad, aunque concluye que los gemidos son del Espíritu. Para muchos lectores, el adjetivo «indecibles» hace menos probable que se trate de un habla audible.',
        },
      },
    },
    'romans-8:ps:romans-7': {
      question: '¿Quién es el «yo» que lucha en Romanos 7:14–25, justo antes de «ninguna condenación»?',
      intro:
        'Cómo se lee 8:1 depende en parte de quién habla en 7:14–25: un cristiano que sigue luchando contra el pecado, una persona bajo la ley sin el Espíritu, o Israel bajo la Torá. El debate es antiguo y sigue abierto.',
      commonGround:
        'Todos coinciden en que 8:1 responde al grito de 7:24, en que los creyentes deben seguir haciendo morir el pecado (8:13) y en que la diferencia decisiva es la unión con Cristo y el don del Espíritu.',
      perspectives: {
        'romans-8:ps:romans-7:believer': {
          tradition: 'Luterana y reformada',
          label: 'La lucha continua del creyente',
          summary:
            'Pablo describe su vida de creyente: los regenerados siguen luchando contra el pecado que mora en ellos y, sin embargo —como dice enseguida 8:1—, no están condenados. El Prefacio de Lutero a Romanos dice que en el capítulo 7 san Pablo se presenta a sí mismo como todavía pecador, mientras que en el capítulo 8 afirma que en los que están en Cristo no hay nada condenable; Calvino abre su comentario a 8:1 hablando del combate que los piadosos sostienen sin cesar con su propia carne; y Spurgeon confesaba no haber sabido nunca lo que era estar fuera del capítulo siete de Romanos, ni tampoco fuera del ocho.',
        },
        'romans-8:ps:romans-7:under-law': {
          tradition: 'Padres griegos y tradición wesleyana',
          label: 'La vida bajo la ley, antes del Espíritu',
          summary:
            'Juan Crisóstomo leyó «yo soy carnal» como un retrato del hombre que vive en la ley y antes de la ley —la humanidad sin la gracia—, de modo que el capítulo 8 describe una liberación real de esa condición. De forma parecida, John Wesley vio en 7:7–25 a un hombre que razona, gime, se esfuerza y pasa del estado legal al evangélico.',
        },
        'romans-8:ps:romans-7:israel': {
          tradition: 'Estudios paulinos contemporáneos',
          label: 'Israel bajo la Torá',
          summary:
            'N. T. Wright sostiene que el «yo» de Pablo da voz a la propia historia de Israel bajo la Torá: cuando llegó la ley, Israel repitió la caída de Adán y, aunque quería el bien, siguió «en Adán», hasta que Dios se ocupó del pecado en el Mesías y dio el Espíritu para hacer «lo que era imposible á la ley» (8:1–11).',
        },
      },
    },
  },

  commentary: {
    'romans-8:cm:chrysostom-8-28': {
      lead: 'Sobre «todas las cosas les ayudan á bien» (8:28)',
      quoteTranslation:
        'Ahora bien, cuando habla de todas las cosas, menciona incluso las que parecen dolorosas. … Y así no dice que a los que aman a Dios no les sobreviene ninguna aflicción, sino que les ayuda a bien; es decir, que Él se sirve de las mismas cosas penosas para que aquellos contra quienes así se conspira salgan aprobados.',
    },
    'romans-8:cm:chrysostom-8-29': {
      lead: 'Sobre ser «hechos conformes á la imagen de su Hijo» (8:29)',
      quoteTranslation: 'Porque lo que el Unigénito era por naturaleza, eso han llegado a ser también ellos por gracia.',
    },
    'romans-8:cm:luther-8-1': {
      lead: 'Sobre cómo el capítulo 8 responde a la lucha del capítulo 7',
      quoteTranslation: 'En el capítulo 8, san Pablo consuela a luchadores como estos y les dice que esta carne no les traerá condenación.',
    },
    'romans-8:cm:calvin-8-34': {
      lead: 'Sobre «¿Quién es el que condenará?» (8:34)',
      quoteTranslation:
        'Así como nadie puede prevalecer acusando cuando el juez absuelve, tampoco queda condenación alguna cuando se ha dado satisfacción a las leyes y la pena ya ha sido pagada.',
    },
    'romans-8:cm:owen-8-13': {
      lead: 'Sobre hacer morir las obras del cuerpo (8:13)',
      quoteTranslation:
        'Mortificad; haced de ello vuestra tarea diaria; estad siempre en ello mientras viváis; no dejéis esta obra ni un solo día; estad matando el pecado, o él os estará matando a vosotros.',
    },
    'romans-8:cm:wesley-8-16': {
      lead: 'Sobre «el mismo Espíritu da testimonio á nuestro espíritu» (8:16)',
      quoteTranslation:
        'Con el espíritu de todo verdadero creyente, mediante un testimonio distinto del de su propio espíritu, o del testimonio de una buena conciencia.',
    },
    'romans-8:cm:spurgeon-8-1': {
      lead: 'Sobre luchar y, aun así, no estar condenado (8:1)',
      quoteTranslation:
        'El hecho es que los creyentes están en un estado de conflicto, pero no en un estado de condenación; y que justo cuando el conflicto es más encarnizado, el creyente sigue estando justificado.',
    },
    'romans-8:cm:packer-8-15': {
      lead: 'Sobre la adopción como la mayor bendición del evangelio (8:14–17)',
      text: 'Packer sitúa la adopción en la cumbre misma de las bendiciones del evangelio, por encima incluso de la justificación. La justificación resuelve nuestra situación ante Dios como Juez; la adopción nos hace miembros de su familia, con Dios como Padre y nosotros como sus hijos y herederos. Packer sostiene además que toda la vida cristiana debe entenderse, y vivirse, a la luz de ser hijo de Dios.',
    },
    'romans-8:cm:wright-8-17': {
      lead: 'Sobre Romanos 8 como un nuevo éxodo (8:12–25)',
      text: 'Wright lee Romanos 5–8 como un nuevo relato del éxodo: el pecado esclaviza como lo hizo Egipto, la muerte y la resurrección del Mesías liberan, el Espíritu ocupa el lugar que la Torá tenía en el Sinaí, y los hijos de Dios no deben volver a la esclavitud (8:12–17). Su herencia ya no es una tierra, sino toda la creación, liberada de la esclavitud; así, Romanos 8 cumple la promesa de Romanos 4:13 de que la familia de Abraham heredaría el mundo.',
    },
    'romans-8:cm:piper-8-1': {
      lead: 'Sobre el «ahora» de «ninguna condenación» (8:1)',
      text: 'Piper oye dos sentidos en el «ahora» de Pablo. Es ahora, por fin: en la cruz Dios condenó al pecado en la carne de Cristo (8:3), de modo que el Hijo cargó con la sentencia en que habían incurrido los pecadores. Y es ahora, ya: aunque el juicio final aún ha de venir, los que están en Cristo pueden conocer de antemano su resultado (8:33–34). El don pertenece a los que están en Cristo, y todos están invitados a venir a él.',
    },
    'romans-8:cm:keller-8-1': {
      lead: 'Sobre la experiencia de Dios por medio del Espíritu (8:1–4)',
      text: 'Keller se pregunta cómo pueden los creyentes conocer la presencia de Dios en su propia experiencia, y su respuesta es la obra del Espíritu Santo. En su lectura de Romanos 8, el Espíritu nos une a Cristo y a todo lo que él ha realizado, y así nos asegura que nada puede apartarnos del amor de Dios (8:39). De 8:1–4 extrae dos verdades que deben sostenerse juntas: la lucha contra el pecado continúa en la vida cristiana y, sin embargo, no hay condenación (8:1).',
    },
    'romans-8:cm:sproul-8-29': {
      lead: 'Sobre la «cadena de oro» de 8:29–30',
      text: 'Sproul sostiene que nada en el texto hace depender la predestinación de la presciencia; esa conclusión se extrae únicamente del verbo que aparece primero. Dios conoció de antemano a personas, no sus decisiones, en el sentido personal y amoroso de «conocer», y la cadena se mantiene sin ningún eslabón roto. Contrapone esta lectura a la visión presciente (la elección basada en la fe prevista), cuyo origen sitúa en la modificación que Melanchthon hizo de Lutero y que considera la postura mayoritaria entre los evangélicos modernos.',
    },
  },

  sermons: {
    'romans-8:sermon:spurgeon-1917': {
      summary:
        'Spurgeon se niega a separar Romanos 7 de Romanos 8: el creyente vive en ambos a la vez, luchando contra el pecado interior mientras está plenamente justificado; está en un estado de conflicto, pero no de condenación. Advierte contra un mensaje de «ninguna condenación» que niegue las amenazas de la ley, describe la posición del creyente «en Cristo Jesús», señala que la cláusula de 8:1 sobre no andar conforme a la carne no es original (la Revised Version inglesa la omite) y termina con la absolución del creyente.',
    },
    'romans-8:sermon:spurgeon-1532': {
      summary:
        'Un sermón en tres partes: la ayuda que da el Espíritu Santo, la oración que inspira y el éxito seguro de tales oraciones. Spurgeon enseña que el Espíritu guía las peticiones de los creyentes e intercede, no gimiendo él mismo, sino suscitando en ellos deseos intensos y gemidos indecibles que se le atribuyen a él, y que esas oraciones son escuchadas porque son conformes a la voluntad de Dios.',
    },
    'romans-8:sermon:piper-2001': {
      summary:
        'Piper trata 8:1 como algo central en el mensaje cristiano y explica su «ahora» de dos maneras: la espera ha terminado, porque Dios condenó al pecado en la carne de Cristo (8:3); y el resultado del juicio final está decidido de antemano para los que están en Cristo (8:33–34).',
    },
    'romans-8:sermon:keller-1997': {
      summary:
        'Keller lee el final de Romanos 8 como la culminación de la obra del Espíritu: dar a los creyentes una confianza firme en que nada puede apartarlos del amor de Dios. Lo que les falta a los creyentes, sugiere, es la convicción de ello, y el Espíritu la da frente a las dudas que surgen tanto dentro de nosotros como fuera.',
    },
    'romans-8:sermon:sproul-2006': {
      summary:
        'Sproul sitúa 8:29–30 en la historia del debate desde los remonstrantes y el Sínodo de Dort en adelante, y defiende la elección incondicional: en este texto, la presciencia es el conocimiento personal y amoroso que Dios tiene de las personas, no su previsión de las decisiones de estas.',
    },
  },

  verseNotes: {
    'ROM.8.1': [
      '«Ahora pues» saca la conclusión de los capítulos 5–7: para los que están «en Cristo Jesús» ya no hay condenación, ni veredicto adverso ni pena (κατάκριμα, palabra que Pablo usa solo aquí y en 5:16–18). El versículo sigue sin pausa a la lucha de 7:14–25; por eso Spurgeon podía decir que los creyentes están en un estado de conflicto, pero no de condenación. Las palabras adicionales «los que no andan conforme á la carne, mas conforme al espíritu», que tienen aquí la RVR1909 y la BLM (y en inglés la KJV), solo se encuentran en la tradición manuscrita bizantina, más tardía (el Textus Receptus, base de la KJV y de la Reina-Valera), y faltan en los manuscritos más antiguos. La mayoría de las traducciones modernas —entre ellas la VBL y, en inglés, la BSB— tienen esa frase solo en 8:4; la WEB inglesa, cuyo Nuevo Testamento sigue el Texto Mayoritario griego, la conserva en 8:1 con una nota.',
    ],
    'ROM.8.3': [
      'La ley no podía liberarnos, no porque fuera mala, sino porque «era débil por la carne»: podía mandar, pero no capacitar. Por eso Dios envió a su Hijo «en semejanza de carne de pecado»: verdaderamente humano, pero sin pecado. La expresión que la RVR1909 traduce «á causa del pecado» es la que usa el Antiguo Testamento griego para el sacrificio por el pecado (Tyndale); de ahí que algunas versiones la traduzcan «como ofrenda por el pecado». En la cruz Dios «condenó al pecado en la carne»: la sentencia cayó sobre el pecado en Cristo, para que no tuviera que caer sobre los que están en él.',
    ],
    'ROM.8.9': [
      'Pablo da por supuesto que todo creyente tiene el Espíritu: «si alguno no tiene el Espíritu de Cristo, el tal no es de él». En una sola frase, el mismo Espíritu es «el Espíritu de Dios» y «el Espíritu de Cristo». Estar «en el espíritu» (así, literalmente, la RVR1909; la BSB inglesa lo parafrasea como «controlled… by the Spirit») no es pertenecer a una clase superior de cristianos, sino el nuevo ámbito en que vive todo creyente. El Espíritu no suprime la responsabilidad ni hace imposible el pecado, pero es el poder más fuerte en la vida del creyente (Tyndale).',
    ],
    'ROM.8.12': [
      '«Deudores somos» (ὀφειλέται), traduce literalmente la RVR1909, como la KJV inglesa. Pablo empieza a decir qué debemos, pero solo formula la parte negativa: a la carne no le debemos nada. Juan Crisóstomo observó que Pablo lo expresa de un modo más llamativo que con una simple orden de no vivir según la carne: el acreedor implícito es el Espíritu. Tras haber recibido vida del Espíritu (8:11), los creyentes no tienen ninguna obligación de vivir en los términos de la carne; 8:13 explica lo que eso significa.',
    ],
    'ROM.8.13': [
      '«Si por el espíritu mortificáis las obras de la carne, viviréis.» Se sostienen dos cosas a la vez: los creyentes deben actuar —el verbo está en presente, un hacer morir continuo— y solo pueden hacerlo «por el espíritu». John Owen construyó sobre este versículo su clásico Of the Mortification of Sin in Believers (1656): los liberados de la condenación deben hacer de matar el pecado la tarea de toda su vida; en su célebre fórmula, o se mata el pecado, o el pecado nos matará.',
    ],
    'ROM.8.15': [
      'Pablo contrapone dos «espíritus»: el espíritu de servidumbre, que devuelve al temor, y el espíritu de adopción, «por el cual clamamos, Abba, Padre». El verbo (κράζω) significa gritar en voz alta: un clamor que sale del corazón, no una fórmula. En el mundo romano la adopción daba al hijo plenos derechos de heredero (Tyndale), e Israel era hijo de Dios desde mucho antes (Éx 4:22); Pablo se sirve de ambas cosas para decir que los creyentes pertenecen a la familia de Dios y oran con la misma palabra que usaba Jesús para decir Padre (Marcos 14:36).',
    ],
    'ROM.8.16': [
      'El Espíritu «da testimonio á nuestro espíritu»: el verbo (συμμαρτυρέω) significa dar testimonio juntamente; nuestro propio espíritu, y el Espíritu de Dios que lo confirma, atestiguan que somos hijos de Dios. Los cristianos han entendido este testimonio de maneras distintas: John Wesley enseñó un testimonio interior y directo del Espíritu, distinto del de nuestro propio espíritu, mientras que Calvino lo vinculó a la confianza que nos abre la boca para llamar Padre a Dios en la oración. Ambos tratan la seguridad como un don de Dios, no como autoconvencimiento.',
    ],
    'ROM.8.18': [
      '«Tengo por cierto» (λογίζομαι) expresa un juicio meditado: Pablo ha puesto en la balanza los sufrimientos presentes y la gloria que ha de manifestarse en nosotros, y concluye que aquellos sencillamente no son «de comparar con la gloria venidera». No minimiza el dolor —la lista de 8:35 es real—, sino que lo pesa en una balanza en la que la gloria venidera pesa más. 2 Corintios 4:17 hace el mismo cálculo: lo que es «momentáneo y leve» de la tribulación frente a un «eterno peso de gloria».',
    ],
    'ROM.8.20': [
      'La creación fue sujeta a «vanidad»: ματαιότης, la palabra que el Antiguo Testamento griego usa en todo Eclesiastés («Vanidad de vanidades… todo vanidad», Ec 1:2). El que la sujetó es, con toda probabilidad, Dios, que pronunció la maldición sobre la tierra tras el pecado de Adán (Gn 3:17; así John Wesley). Pero fue «con esperanza»: la creación será librada de la servidumbre de corrupción y participará de «la libertad gloriosa de los hijos de Dios» (8:21).',
    ],
    'ROM.8.23': [
      'Los creyentes tienen «las primicias del Espíritu»: la primera gavilla que consagraba y garantizaba toda la cosecha (Lv 23:10, donde el Antiguo Testamento griego usa la misma palabra, ἀπαρχή). Y sin embargo, «nosotros también gemimos dentro de nosotros mismos, esperando la adopción, es á saber, la redención de nuestro cuerpo». La adopción ya es nuestra (8:15) y todavía no está completa: los cristianos viven entre el «ya» de la redención y el «todavía no» de la gloria (Tyndale).',
    ],
    'ROM.8.26': [
      '«Y asimismo» vincula al Espíritu con el gemido de la creación y de los creyentes. El Espíritu «ayuda nuestra flaqueza»: Calvino señala que el verbo (συναντιλαμβάνομαι) evoca a alguien que toma una carga junto con nosotros. Cuando no sabemos qué pedir, «el mismo Espíritu pide por nosotros con gemidos indecibles». Los intérpretes discrepan sobre si son gemidos del propio Espíritu o suspiros nuestros suscitados por él, pero todos coinciden en que Dios los entiende (8:27).',
    ],
    'ROM.8.28': [
      'Pablo no dice que todo sea bueno, sino que a «los que á Dios aman», a los que «conforme al propósito son llamados», todas las cosas les ayudan a bien. El griego puede leerse «todas las cosas les ayudan á bien» (RVR1909; en inglés, la KJV) o «en todas las cosas Dios obra para el bien» (VBL; en inglés, la BSB; algunos manuscritos añaden «Dios» como sujeto, la lectura que imprimieron Westcott y Hort), pero en cualquier caso la razón es el propósito de Dios. El versículo siguiente define el bien: ser «hechos conformes á la imagen de su Hijo», lo cual puede llegar a través del sufrimiento (8:17, 35–36). Juan Crisóstomo ya lo vio: «todas las cosas» incluye incluso las que parecen dolorosas.',
    ],
    'ROM.8.29': [
      '«Á los que antes conoció, también predestinó para que fuesen hechos conformes á la imagen de su Hijo.» La meta del propósito de Dios es el parecido de familia: que el Hijo sea «el primogénito entre muchos hermanos», y primogénito (πρωτότοκος) es el título que el Antiguo Testamento griego da a Israel como hijo de Dios (Éx 4:22). Qué significa «antes conoció» se discute entre las tradiciones, pero la meta no: Dios quiere hacer a sus hijos semejantes a Cristo, en el carácter ahora y en la gloria del cuerpo en la resurrección (Flp 3:21).',
    ],
    'ROM.8.34': [
      '«¿Quién es el que condenará?» Pablo responde con cuatro hechos acerca de Cristo: murió; más aún, resucitó; está a la diestra de Dios; e intercede por nosotros. La pregunta hace eco de la confianza del Siervo en Isaías 50:9, y Calvino desarrolla la lógica: no queda condenación cuando se ha satisfecho a las leyes y la pena ya está pagada. El capítulo que empezó con «ninguna condenación» vuelve a ella en forma de pregunta que ningún acusador puede responder.',
    ],
    'ROM.8.39': [
      'La lista de Pablo abarca todas las categorías que puede nombrar —la muerte y la vida, ángeles y principados, lo presente y lo por venir, potestades, lo alto y lo bajo, «ni ninguna criatura»—, y nada de ello «nos podrá apartar del amor de Dios, que es en Cristo Jesús Señor nuestro». El capítulo empezó con «ninguna condenación hay para los que están en Cristo Jesús» (8:1) y termina sin separación posible en Cristo Jesús: la unión con Cristo funda tanto el veredicto como el amor.',
    ],
  },

  concepts: {
    'romans-8:concept:condemnation': {
      label: 'Condenación',
      aliases: [
        'condenación',
        'ninguna condenación',
        'no hay condenación',
        'qué significa condenación',
        'condenar',
        'condena',
        'condenado',
        'condenados',
        'condenó',
        'veredicto',
        'culpa',
        'culpable',
        'acusación',
        'acusar',
      ],
      answer:
        'Κατάκριμα (katakrima, 8:1) es una palabra de tribunal: el veredicto adverso y la pena que lo sigue. Pablo la usa solo aquí y en 5:16–18, donde el delito de Adán trajo condenación a todos. «Ninguna condenación» significa que, para los que están en Cristo Jesús, esa sentencia ya no está en vigor, porque Dios «condenó al pecado en la carne» de su Hijo (8:3) y nadie puede condenar a quienes Dios justifica (8:34). No significa que los creyentes ya no luchen con el pecado (7:14–25; 8:13).',
    },
    'romans-8:concept:flesh': {
      label: 'Carne',
      aliases: [
        'carne',
        'la carne',
        'qué significa carne',
        'naturaleza pecaminosa',
        'carne de pecado',
        'carnal',
        'carnales',
        'según la carne',
        'conforme a la carne',
        'intención de la carne',
        'mente de la carne',
        'mentalidad',
      ],
      answer:
        'En Romanos 8, «carne» (σάρξ, 13 veces en 8:3–13) no es el cuerpo como tal, sino la vida humana tal como está en Adán: débil, autosuficiente, inclinada al pecado y en «enemistad contra Dios» (8:7). Vivir según la carne es sacar de esa fuente la vida y la dirección; vivir según el Espíritu es dejarse guiar por el Espíritu de Dios. Cada una tiene su propia «intención» (φρόνημα), que desemboca en la muerte o en vida y paz (8:6). El contraste es entre dos poderes y dos formas de vida, no entre cuerpo y alma: el Espíritu vivificará incluso nuestros cuerpos mortales (8:11).',
    },
    'romans-8:concept:spirit': {
      label: 'El Espíritu Santo',
      aliases: [
        'espíritu',
        'el espíritu',
        'espíritu santo',
        'el espíritu santo',
        'espíritu de dios',
        'espíritu de cristo',
        'espíritu de vida',
        'el espíritu que mora',
        'guiados por el espíritu',
        'vida en el espíritu',
        'andar en el espíritu',
        'conforme al espíritu',
        'según el espíritu',
      ],
      answer:
        'El Espíritu Santo domina Romanos 8: πνεῦμα aparece aquí 21 veces —la mayoría, aunque no todas, referidas al Espíritu de Dios (compárese «el espíritu de servidumbre», 8:15, y «nuestro espíritu», 8:16)—, más que en ningún otro capítulo del Nuevo Testamento. El Espíritu es a la vez «el Espíritu de Dios» y «el Espíritu de Cristo» (8:9). Libra de la ley del pecado y de la muerte (8:2), cumple la justa exigencia de la ley en los que andan conforme a él (8:4), da vida ahora y resurrección después (8:11), guía a los hijos de Dios y les asegura su filiación (8:14–16), e intercede en su flaqueza (8:26–27).',
    },
    'romans-8:concept:adoption': {
      label: 'Adopción',
      aliases: [
        'adopción',
        'qué significa adopción',
        'adoptados',
        'adoptar',
        'adopción de hijos',
        'filiación',
        'hijos de dios',
        'herederos',
        'heredero',
        'coherederos',
        'herencia',
        'espíritu de adopción',
        'espíritu de servidumbre',
        'espíritu de esclavitud',
      ],
      answer:
        'Adopción (υἱοθεσία) es una palabra que en el Nuevo Testamento solo usa Pablo. En el mundo romano, el hijo adoptado recibía todos los derechos de heredero; en el Antiguo Testamento, Israel era hijo de Dios (Éx 4:22; Ro 9:4). Pablo une ambas cosas: los creyentes han recibido «el espíritu de adopción» y claman «Abba, Padre», y como hijos son «herederos de Dios, y coherederos de Cristo» (8:15–17). Pero la adopción es también futura: «la redención de nuestro cuerpo» (8:23). J. I. Packer situaba la adopción por encima incluso de la justificación entre las bendiciones del evangelio.',
    },
    'romans-8:concept:abba': {
      label: 'Abba, Padre',
      aliases: ['abba', 'abba padre', 'qué significa abba', 'papi', 'papito', 'papá', 'arameo', 'dios padre', 'clamar abba'],
      answer:
        'Abba es la palabra aramea para «padre», la lengua que hablaba Jesús; él la usó al orar en Getsemaní (Marcos 14:36). Pablo la conserva sin traducir en una carta escrita en griego y añade la palabra griega para Padre (8:15; Gá 4:6): por el Espíritu, los creyentes oran a Dios como oraba Jesús. Era una palabra familiar de uso diario, empleada por hijos pequeños y adultos —James Barr sostuvo que las pruebas no respaldan la traducción popular «papi»—, y John Wesley vio en la combinación de ambas palabras el clamor conjunto de los creyentes judíos y gentiles.',
    },
    'romans-8:concept:creation': {
      label: 'El gemido y la esperanza de la creación',
      aliases: [
        'creación',
        'toda la creación',
        'las criaturas',
        'gemido de la creación',
        'gemir',
        'gemidos',
        'gime',
        'dolores de parto',
        'vanidad',
        'futilidad',
        'servidumbre de corrupción',
        'corrupción',
        'nueva creación',
        'redención de nuestro cuerpo',
        'anhelo',
        'ardiente espera',
      ],
      answer:
        'Pablo presenta a toda la creación sujeta a «vanidad» —la palabra que el Antiguo Testamento griego usa en todo Eclesiastés—, muy probablemente por el juicio de Dios tras el pecado de Adán (Gn 3:17), pero «con esperanza». La creación aguarda con anhelo ardiente (ἀποκαραδοκία, un compuesto expresivo que Abbott-Smith explica por la imagen de quien mira con la cabeza estirada, aunque en el uso significa simplemente una espera ansiosa) y gime como una mujer de parto, deseando ser librada de la corrupción cuando se manifiesten los hijos de Dios. También los creyentes gimen, esperando la redención de su cuerpo (8:19–23). La esperanza cristiana es una creación renovada (Ap 21:1–5), no la huida de ella.',
    },
    'romans-8:concept:firstfruits': {
      label: 'Las primicias del Espíritu',
      aliases: ['primicias', 'primeros frutos', 'primicias del espíritu', 'primera cosecha', 'prenda', 'arras', 'garantía', 'anticipo'],
      answer:
        'Las primicias (ἀπαρχή) eran la primera gavilla de la cosecha, mecida delante del Señor antes de que pudiera comerse nada de la mies (Lv 23:9–14); el Antiguo Testamento griego usa allí la misma palabra. Pablo dice que los creyentes tenemos «las primicias del Espíritu» (8:23): el Espíritu es el primer anticipo y la garantía de la cosecha que aún ha de venir, la adopción plena y la redención de nuestro cuerpo. Usa la misma imagen para la resurrección de Cristo (1 Co 15:20).',
    },
    'romans-8:concept:all-things-for-good': {
      label: 'Todas las cosas les ayudan a bien',
      aliases: [
        'todas las cosas les ayudan a bien',
        'todas las cosas ayudan a bien',
        'todas las cosas cooperan para bien',
        'todo coopera para bien',
        'todo obra para bien',
        'ayudan a bien',
        'cooperan para bien',
        'para bien',
        'el bien',
        'conforme al propósito son llamados',
        'llamados conforme a su propósito',
        'su propósito',
        'providencia',
      ],
      answer:
        'Romanos 8:28 no dice que todo sea bueno, ni que todo acabe bien para todo el mundo. Promete que para «los que á Dios aman», los que «conforme al propósito son llamados», Dios hace que todas las cosas cooperen para bien, y 8:29 define ese bien como ser hechos conformes a la imagen de su Hijo. El griego puede leerse en el sentido de que todas las cosas cooperan para bien o en el de que Dios obra en todas las cosas para bien; en cualquier caso, el propósito de Dios es lo decisivo. Juan Crisóstomo observó que «todas las cosas» incluye incluso las que parecen dolorosas.',
    },
    'romans-8:concept:predestination': {
      label: 'Presciencia y predestinación',
      aliases: [
        'predestinación',
        'predestinó',
        'predestinados',
        'predestinar',
        'presciencia',
        'antes conoció',
        'conocer de antemano',
        'elección',
        'elegidos',
        'escogidos',
        'cadena de oro',
        'llamados',
        'llamamiento',
        'justificados',
        'glorificados',
        'conformes a la imagen',
      ],
      answer:
        'Romanos 8:29–30 es una cadena de cinco verbos: Dios antes conoció, predestinó, llamó, justificó y glorificó. Los cristianos coinciden en que la salvación comienza en el propósito lleno de gracia de Dios y apunta a la semejanza con Cristo. Difieren en cuanto a «antes conoció»: los reformados lo entienden como el amor electivo de Dios por personas concretas; los arminianos y wesleyanos, como su conocimiento previo de quienes iban a creer; las tradiciones luterana, católica y ortodoxa lo plantean, cada una, de otra manera. El panel de Perspectivas expone estas posturas. «Glorificó» está en pasado aunque la gloria sigue siendo futura (8:18): la nota de Tyndale lo explica como la decisión firme de Dios, tan segura como si ya estuviera cumplida, mientras que John Wesley oía a Pablo hablar como quien mira hacia atrás desde la meta.',
    },
    'romans-8:concept:mortification': {
      label: 'Hacer morir el pecado',
      aliases: [
        'hacer morir',
        'mortificar',
        'mortificación',
        'mortificáis',
        'obras de la carne',
        'obras del cuerpo',
        'matar el pecado',
        'deudores',
        'deudores somos',
        'obligación',
        'santificación',
        'santidad',
      ],
      answer:
        '«Si por el espíritu mortificáis las obras de la carne, viviréis» (8:13). Los creyentes no le deben nada a la carne (8:12), así que han de seguir dando muerte al pecado —el verbo está en presente, una acción continua—, pero solo por el Espíritu, no con sus propias fuerzas. La obra de John Owen Of the Mortification of Sin in Believers (1656), construida sobre este versículo, insiste en que quienes han sido liberados de la condenación deben hacer de esto la tarea de toda su vida: o se mata el pecado, o el pecado mata.',
    },
    'romans-8:concept:intercession': {
      label: 'La ayuda del Espíritu en la oración',
      aliases: [
        'intercesión',
        'interceder',
        'intercede',
        'intercede por nosotros',
        'oración',
        'orar',
        'gemidos indecibles',
        'flaqueza',
        'debilidad',
        'no sabemos orar',
        'no sabemos qué pedir',
      ],
      answer:
        'Cuando no sabemos «qué hemos de pedir como conviene», el Espíritu «ayuda nuestra flaqueza» —el verbo evoca a alguien que toma una carga junto con otro— y «pide por nosotros con gemidos indecibles» (8:26). Dios, que escudriña los corazones, sabe cuál es el intento del Espíritu, que intercede conforme a la voluntad de Dios (8:27). Mientras tanto, Cristo intercede a la diestra de Dios (8:34). Se discute si estos gemidos son del propio Espíritu o nuestros, suscitados por él; véase el panel de Perspectivas.',
    },
    'romans-8:concept:separation': {
      label: 'Nada nos podrá apartar',
      aliases: [
        'separar',
        'separación',
        'apartar',
        'ninguna separación',
        'nada nos podrá apartar',
        'amor de dios',
        'amor de cristo',
        'más que vencedores',
        'hacemos más que vencer',
        'vencedores',
        'si dios por nosotros',
        'quién contra nosotros',
        'seguridad',
        'certeza',
        'persecución',
        'ovejas de matadero',
      ],
      answer:
        'El capítulo termina en un tribunal de preguntas: si Dios está por nosotros, ¿quién contra nosotros? ¿Quién acusará a los escogidos de Dios, si Dios es el que justifica? ¿Quién condenará, si Cristo murió, resucitó e intercede? ¿Quién nos apartará del amor de Cristo? Pablo cita el Salmo 44:22 para mostrar que el sufrimiento no es señal de rechazo, y luego dice que «en todas estas cosas hacemos más que vencer» (ὑπερνικάω, palabra que solo aparece aquí en el Nuevo Testamento). Nada en toda la creación puede apartarnos del amor de Dios en Cristo Jesús (8:31–39).',
    },
  },
};

export default overlay;
