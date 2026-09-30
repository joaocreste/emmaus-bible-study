/**
 * Spanish overlay — John 1 (“El Verbo se hizo carne”).
 *
 * Scripture words inside quotation marks follow the Reina-Valera 1909 (the default Spanish
 * version) verbatim; other Scripture allusions are paraphrased without quotation marks.
 * Anchors were checked against the RVR1909, BLM and VBL text of John 1 (bible.helloao.org).
 * Verified quotations keep their English words; only a free translation is added here.
 */
import type { StudyOverlay } from '../types';

const J1 = (verse: number) => ({ book: 'JHN', chapter: 1, verse });

const overlay: StudyOverlay = {
  studyId: 'john-1',
  locale: 'es',
  title: 'Juan 1',
  subtitle: 'El Verbo se hizo carne',
  summary:
    'Juan 1 abre el cuarto Evangelio remontándose a antes de la creación: el Verbo que era con Dios y era Dios, por medio del cual todas las cosas fueron hechas, «fué hecho carne, y habitó entre nosotros». Con ecos de Génesis 1 y de la memoria de Israel sobre el tabernáculo y el Sinaí, el prólogo (1:1–18) presenta a Jesús como aquel en quien por fin se ven la gloria, la gracia y la verdad de Dios, y que da a conocer al Padre invisible. El resto del capítulo pasa a la historia: Juan el Bautista da testimonio y señala a Jesús como «el Cordero de Dios, que quita el pecado del mundo», y los primeros discípulos comienzan a seguirlo, confesándolo con un título tras otro —Rabí, Mesías, Hijo de Dios, Rey de Israel— hasta que Jesús les promete el cielo abierto sobre el Hijo del hombre.',
  opening:
    'Juan 1 es uno de los capítulos más queridos y profundos de la Biblia. Podemos empezar «en el principio», con el Verbo; escuchar los ecos del Génesis y del Éxodo; mirar de cerca algunas palabras griegas, y luego acompañar a los primeros discípulos cuando oyen la invitación «Venid y ved». Cualquier pregunta sobre un versículo, una palabra o una voz de la historia de la iglesia es bienvenida: el estudio de al lado seguirá la conversación.',
  matchTopics: [
    'juan 1',
    'juan capítulo 1',
    'juan capitulo 1',
    'evangelio de juan 1',
    'el verbo se hizo carne',
    'el verbo fue hecho carne',
    'aquel verbo fue hecho carne',
    'la palabra se hizo carne',
    'en el principio era el verbo',
    'en el principio era la palabra',
    'logos',
    'el logos',
    'prólogo de juan',
    'prologo de juan',
    'el prólogo de juan',
    'el prologo de juan',
    'cordero de dios',
    'el cordero de dios',
    'encarnación',
    'encarnacion',
  ],
  suggestedQuestions: [
    '¿Qué palabra griega hay detrás de «Verbo»?',
    '¿Cómo se relaciona Juan 1 con el Génesis?',
    'Explicar el versículo 14 con más detalle',
    '¿Cómo entendían «Logos» los primeros destinatarios?',
    '¿Hay distintas interpretaciones de «unigénito»?',
    '¿Qué dijo Agustín sobre este pasaje?',
    '¿Por qué se llama a Jesús el Cordero de Dios?',
    '¿Qué dijo Tim Keller sobre esto?',
    '¿Qué enseña este capítulo sobre quién es Jesús?',
  ],
  keyWords: {
    'john-1:kw:logos': {
      english: 'Verbo (Palabra)',
      basicMeaning: 'palabra',
      semanticRange: [
        'una palabra que expresa un pensamiento o una idea',
        'un dicho, una declaración o un mensaje; sobre todo, la palabra de Dios',
        'habla, enseñanza, relato o narración',
        'razón; cuenta o rendición de cuentas',
        'el Verbo divino (Logos): Juan 1:1, 14; 1 Juan 1:1; Apocalipsis 19:13',
      ],
      grammar: 'Sustantivo, nominativo singular masculino, con artículo (ὁ λόγος) — forma en 1:1',
      significance:
        'Juan no nombra a Jesús hasta 1:17; comienza con «el Verbo». Para los lectores del Antiguo Testamento griego, λόγος era la traducción habitual del hebreo dāvār: la palabra con la que Dios crea (Sal 33:6), habla por medio de los profetas y cumple su voluntad. Los lectores griegos oían en ella el orden racional que sostiene el mundo. Juan recoge ambas resonancias y luego dice lo que ninguna de las dos esperaba: este Verbo es personal, «era con Dios» y «era Dios», y «fué hecho carne» (1:14). El Verbo es la autoexpresión de Dios; por eso el prólogo termina con el Hijo que «le declaró» (1:18).',
      caution:
        'Una sola palabra no carga con toda la doctrina. En la mayoría de sus 330 usos en el Nuevo Testamento (según el recuento de TAGNT de STEPBible; 40 de ellos en Juan), λόγος significa sencillamente palabra, mensaje o relato. Su sentido en 1:1 procede de las frases de Juan —lo que dice que el Verbo era e hizo—, no solo del diccionario.',
      notableNotes: [
        'En el Antiguo Testamento griego (Sal 32:6 LXX), los cielos fueron hechos por la palabra —τῷ λόγῳ— del Señor: la palabra creadora de la que Juan se hace eco en 1:3.',
        'El «Verbo de vida», lo que era «desde el principio» y fue visto y palpado: el prólogo paralelo de la misma tradición.',
        'Al jinete que regresa se le da por nombre «EL VERBO DE DIOS».',
        '«La palabra de Dios es viva y eficaz»: el sentido ordinario del mensaje hablado de Dios, sobre el que se apoya el uso personal que hace Juan.',
      ],
      anchors: [
        { verse: J1(1), phrases: { RVR1909: 'Verbo', BLM: 'Verbo', VBL: 'Palabra' } },
        { verse: J1(14), phrases: { RVR1909: 'Verbo', BLM: 'Verbo', VBL: 'Palabra' } },
      ],
    },
    'john-1:kw:arche': {
      english: 'principio',
      basicMeaning: 'principio, comienzo',
      semanticRange: [
        'principio, origen; en sentido absoluto, el principio de todas las cosas',
        'el primer principio o la fuente (de Cristo, Ap 3:14; Col 1:18)',
        'un comienzo relativo (el «principio de señales», Juan 2:11)',
        'dominio, soberanía; (en plural) principados y autoridades',
      ],
      grammar: 'Sustantivo, dativo singular femenino, sin artículo (ἐν ἀρχῇ, «en [el] principio») — forma en 1:1',
      significance:
        'Al abrir con las primeras palabras de la Biblia griega, Juan invita a sus lectores a releer Génesis 1 con Jesús a la vista. Pero conviene fijarse en el verbo: Génesis dice que en el principio Dios creó; Juan dice que en el principio el Verbo ya «era». Cuando el principio comenzó, el Verbo no llegó a existir: ya estaba allí. Así, el Evangelio de Juan se presenta como un nuevo Génesis: aquel por medio del cual el mundo fue hecho viene ahora a hacer nuevas a las personas (1:12–13).',
      caution:
        'ἀρχή no significa por sí misma «eternidad»; significa principio. La eternidad del Verbo se desprende de la combinación de ἀρχή con el verbo «era» (ἦν) y de 1:3, que sitúa todo lo que llegó a existir al otro lado de la línea.',
      notableNotes: [
        'El Antiguo Testamento griego comienza con las mismas dos palabras, Ἐν ἀρχῇ: las primeras palabras de Juan evocan deliberadamente el Génesis.',
        '«Lo que era desde el principio» (ἀπ’ ἀρχῆς): el comienzo paralelo de la carta joánica.',
        'Cristo es «el principio, el primogénito de los muertos».',
        'Caná es el «principio de señales» (ἀρχή): un comienzo relativo, el inicio de la revelación pública de Jesús.',
      ],
      anchors: [
        { verse: J1(1), phrases: { RVR1909: 'En el principio', BLM: 'En el principio', VBL: 'En el principio' } },
        { verse: J1(2), phrases: { RVR1909: 'en el principio', BLM: 'en el principio', VBL: 'En el principio' } },
      ],
    },
    'john-1:kw:theos': {
      english: 'Dios («el Verbo era Dios»)',
      basicMeaning: 'Dios; un dios',
      semanticRange: [
        'el único Dios verdadero (normalmente con artículo, ὁ θεός)',
        'Dios, sin artículo, sobre todo tras preposición y como predicado (TBESG cita Juan 1:1)',
        'un dios o una divinidad (en contextos politeístas)',
      ],
      grammar: 'Sustantivo, nominativo singular masculino; nombre predicativo antepuesto al verbo y sin artículo (θεὸς ἦν ὁ λόγος) — 1:1c',
      significance:
        'Aquí importan el orden de las palabras y el artículo. El sujeto es ὁ λόγος («el Verbo», con artículo); θεός («Dios») va delante por énfasis y sin artículo. Si Juan hubiera escrito ὁ θεὸς ἦν ὁ λόγος, habría identificado al Verbo con aquel a quien acaba de llamar «Dios» (el Padre), contradiciendo que el Verbo «era con Dios». Como sostuvo Philip Harner, la construcción es cualitativa: el Verbo tiene la naturaleza misma de Dios; es verdaderamente Dios, no un ser divino inferior, y no es el Padre.',
      caution:
        'La falta de artículo no convierte θεός en indefinido. La Traducción del Nuevo Mundo vierte 1:1c como «the Word was a god» («un dios»), pero el griego omite con regularidad el artículo con Dios (p. ej., 1:6, 1:18), y el contexto excluye un «dios» inferior y creado: todo lo que fue hecho, fue hecho por medio del Verbo (1:3). Harner, cuyo estudio se cita a menudo a propósito de este versículo, concluyó él mismo que el Verbo comparte la misma naturaleza que Dios y rechazó la traducción «un dios».',
      notableNotes: [
        'En 1:1b, «con Dios» lleva artículo (πρὸς τὸν θεόν); en 1:1c, «era Dios» no lo lleva (θεὸς ἦν ὁ λόγος).',
        'Los manuscritos más antiguos leen μονογενὴς θεός, «el único, [él mismo] Dios»; los posteriores leen «Hijo».',
        'Tomás confiesa: «¡Señor mío, y Dios mío!». El Evangelio termina donde empezó.',
      ],
      anchors: [{ verse: J1(1), phrases: { RVR1909: 'era Dios', BLM: 'era Dios', VBL: 'era Dios' } }],
    },
    'john-1:kw:phos': {
      english: 'luz',
      basicMeaning: 'luz',
      semanticRange: [
        'la luz física (lo opuesto a las tinieblas, σκότος / σκοτία)',
        'en sentido figurado, de Dios (1 Juan 1:5)',
        'la verdad espiritual y su efecto en la vida humana (Juan 1:4–5; 3:19–21)',
        'aquel de quien irradia la verdad, sobre todo Cristo, «la luz del mundo» (8:12; 9:5)',
      ],
      grammar: 'Sustantivo, nominativo singular neutro (τὸ φῶς) — forma en 1:4',
      significance:
        'La luz y las tinieblas (σκοτία, dos veces en 1:5) enmarcan el drama del prólogo. En el Génesis, la luz es el primer don creador de Dios; en Juan, la vida del Verbo «era la luz de los hombres» (1:4), sigue resplandeciendo en unas tinieblas que no pueden apagarla (1:5) y es «la luz verdadera» que viene al mundo (1:9). Como señala D. A. Carson, una primera lectura oye la luz de la creación, mientras que el resto del Evangelio añade la luz de la revelación y la de la exposición moral (3:19–21): Juan se refiere a ambas. φῶς aparece 23 veces en Juan (73 en el Nuevo Testamento).',
      caution:
        '«Luz» es una imagen, no un término técnico: en Juan oscila entre la creación, la revelación y la exposición moral, y el contexto decide cuál ocupa el primer plano en cada versículo.',
      notableNotes: [
        '«Sea la luz»: la primera palabra de la creación, de la que se hace eco Juan 1:4–5 (LXX γενηθήτω φῶς).',
        'Cita de Isaías 9:2: «El pueblo asentado en tinieblas, vió gran luz», cumplido en el ministerio de Jesús.',
        '«Yo soy la luz del mundo»: la imagen del prólogo se convierte en la propia afirmación de Jesús.',
        '«Dios es luz, y en él no hay ningunas tinieblas».',
      ],
      anchors: [
        { verse: J1(4), phrases: { RVR1909: 'la luz de los hombres', BLM: 'la luz de los hombres', VBL: 'la luz de todos' } },
        { verse: J1(9), phrases: { RVR1909: 'la luz verdadera', BLM: 'La verdadera luz', VBL: 'La luz verdadera' } },
      ],
    },
    'john-1:kw:katalambano': {
      english: 'vencer / comprender',
      basicMeaning: 'asir, captar',
      semanticRange: [
        'echar mano de, apoderarse de, tomar posesión (Flp 3:12)',
        'alcanzar, sorprender, dicho de las tinieblas o del día (Juan 12:35; 1 Ts 5:4)',
        'captar con la mente, comprender (normalmente en voz media: Ef 3:18; Hch 4:13)',
      ],
      grammar: 'Verbo, aoristo segundo activo de indicativo, tercera persona del singular (κατέλαβεν) — 1:5',
      significance:
        'El verbo de 1:5 es célebremente ambivalente. La KJV inglesa («comprehended it not»), como la RVR1909 («no la comprendieron»), lo entiende de la comprensión; la BSB y la WEB, como la BLM («no la han vencido») y la VBL («no la ha apagado»), lo entienden de un ataque hostil. El verbo de 1:5 está en voz activa (el sentido mental suele ir en voz media), el léxico clasifica este versículo bajo «alcanzar, sorprender», y el único otro uso de Juan (12:35, aparte del discutido 8:3–4) presenta a las tinieblas persiguiendo a las personas. Eso encaja con la lectura «vencer» (la nota de la WEB explica el verbo como agarrar a un enemigo para derrotarlo) y con la conclusión de las notas de Tyndale de que en Juan la palabra expresa hostilidad. En cualquier caso, el versículo anticipa todo el Evangelio: la Luz encuentra rechazo, pero las tinieblas no tienen la última palabra. El panel de perspectivas expone ambas lecturas.',
      caution:
        'El verbo aparece 13 veces en el texto de Nestle–Aland (15 si se cuenta el discutido Juan 8:3–4). Con tan pocos usos, y con sentidos que se superponen, aquí no es posible alcanzar certeza.',
      notableNotes: [
        'El único otro uso de Juan (aparte del discutido 8:3–4): «porque no os sorprendan las tinieblas»; de nuevo las tinieblas como sujeto hostil.',
        'Voz media: «comprender con todos los santos cuál sea la anchura y la longura y la profundidad y la altura»; es el sentido mental.',
        '«Por ver si alcanzo aquello para lo cual fuí también alcanzado de Cristo Jesús»: el sentido de asir.',
      ],
      anchors: [{ verse: J1(5), phrases: { RVR1909: 'no la comprendieron', BLM: 'no la han vencido', VBL: 'no la ha apagado' } }],
    },
    'john-1:kw:skenoo': {
      english: 'habitó (plantó su tienda)',
      basicMeaning: 'habitar',
      semanticRange: [
        'tener la tienda (σκηνή), acampar',
        'habitar, establecer la residencia (a veces de una morada temporal)',
      ],
      grammar: 'Verbo, aoristo activo de indicativo, tercera persona del singular (ἐσκήνωσεν) — 1:14',
      significance:
        'σκηνόω se forma sobre σκηνή, la palabra de la Biblia griega para el tabernáculo, y en el Antiguo Testamento griego traduce sobre todo el hebreo shakan, «habitar». Por eso «habitó entre nosotros» puede oírse como «plantó su tienda» o «acampó» entre nosotros. Juan añade enseguida: «vimos su gloria» (δόξα, la palabra con que la Biblia griega designaba la gloria que llenaba el tabernáculo). El Dios que antes vivía en medio de Israel en una tienda vive ahora entre nosotros en la carne de Jesús. El verbo aparece solo cinco veces en el Nuevo Testamento: aquí y cuatro veces en el Apocalipsis.',
      caution:
        'El verbo no implica necesariamente que la humanidad de Jesús fuera temporal o endeble; lo que importa en la alusión es la presencia y la gloria de Dios, como en el tabernáculo, no el tejido de la tienda.',
      notableNotes: [
        '«He aquí el tabernáculo (σκηνή) de Dios con los hombres, y morará (σκηνώσει) con ellos»: la promesa cumplida al final.',
        '«El que está sentado en el trono tenderá su pabellón sobre ellos».',
        'No es el verbo en sí, sino el sustantivo del que se forma: en el Antiguo Testamento griego, la gloria (δόξα) del SEÑOR llena la σκηνή, el tabernáculo; es el trasfondo que Juan evoca.',
      ],
      anchors: [{ verse: J1(14), phrases: { RVR1909: 'habitó entre nosotros', BLM: 'vivió entre nosotros', VBL: 'vivió entre nosotros' } }],
    },
    'john-1:kw:monogenes': {
      english: 'unigénito / único',
      basicMeaning: 'único',
      semanticRange: [
        'único, unigénito: de un hijo o una hija únicos (Lc 7:12; 8:42; 9:38; el léxico de STEPBible incluye aquí también Heb 11:17)',
        'único, singular, sin igual (así muchos léxicos modernos; se discute si Isaac en Heb 11:17 pertenece a este sentido o al de «unigénito»)',
        'de Cristo como el Hijo único (Juan 1:14, 18; 3:16, 18; 1 Juan 4:9)',
      ],
      grammar: 'Adjetivo, genitivo singular masculino (μονογενοῦς) en 1:14; nominativo (μονογενής) en 1:18',
      significance:
        'La declaración de gloria de 1:14 dice literalmente «gloria como de un único de parte de un padre» (δόξαν ὡς μονογενοῦς παρὰ πατρός; la BSB añade «Son», es decir, «Hijo»): la gloria propia del Hijo único que viene del Padre. En 1:18 los manuscritos más antiguos leen μονογενὴς θεός, «el único, [él mismo] Dios», mientras que los posteriores leen «Hijo», lectura que siguen la KJV («the only begotten Son»), la WEB («the only born Son») y también la RVR1909 («el unigénito Hijo»). Las traducciones se dividen entre «unigénito» (la KJV, siguiendo el latín unigenitus, y con ella la RVR1909) y «único» (la BSB); el «only born» («nacido único») de la WEB queda entre ambas. La palabra aparece 9 veces en el Nuevo Testamento, 4 de ellas en Juan.',
      caution:
        'Argumentar a partir de las partes de una palabra (μόνος + γένος) puede inducir a error en ambas direcciones: γένος puede significar «clase» o «descendencia». Deciden el uso y el contexto. El panel de perspectivas expone ambas lecturas; ninguna de las dos partes duda de que Jesús es el Hijo en un sentido único y plenamente Dios.',
      notableNotes: [
        '«Ha dado á su Hijo unigénito»: la misma palabra en el versículo más conocido del Evangelio.',
        'Isaac es el μονογενής de Abraham aunque Abraham tenía otro hijo: un texto clave en el debate sobre el sentido de la palabra.',
        'El hijo de la viuda de Naín, «unigénito de su madre»: el sentido familiar ordinario.',
        '«Dios envió á su Hijo unigénito al mundo, para que vivamos por él».',
      ],
      anchors: [
        { verse: J1(14), phrases: { RVR1909: 'unigénito', BLM: 'Hijo unigénito', VBL: 'único hijo' } },
        { verse: J1(18), phrases: { RVR1909: 'el unigénito Hijo', BLM: 'El Hijo único', VBL: 'el Único e Incomparable' } },
      ],
    },
    'john-1:kw:charis': {
      english: 'gracia',
      basicMeaning: 'gracia',
      semanticRange: [
        'gracia, encanto (Lc 4:22; Col 4:6)',
        'favor, benevolencia; sobre todo, el favor libre e inmerecido de Dios',
        'un don o una muestra de gracia (Juan 1:16)',
        'gratitud, acción de gracias',
      ],
      grammar:
        'Sustantivo, genitivo singular femenino (χάριτος) en 1:14; en 1:16, χάριν ἀντὶ χάριτος: χάριν (acusativo) es el complemento de «hemos recibido», y χάριτος (genitivo) sigue a la preposición ἀντί',
      significance:
        'χάρις aparece solo cuatro veces en el Evangelio de Juan, todas en el prólogo (1:14; dos veces en 1:16; 1:17); John Piper observa que después el Evangelio habla de la verdad una y otra vez, pero nunca más de la gracia. «Lleno de gracia y de verdad» describe la gloria vista en Jesús, y muchos intérpretes oyen detrás la descripción que Dios hizo de sí mismo ante Moisés: «grande en benignidad y verdad» (Éx 34:6). En 1:16, «gracia por gracia» (RVR1909; «gracia sobre gracia» en la BLM; literalmente, «gracia en lugar de gracia», con ἀντί) se ha leído como gracia acumulada sobre gracia, como la gracia derramada sobre Cristo que fluye hacia los creyentes, o como la nueva gracia en Cristo que sucede a la gracia dada por medio de Moisés (1:17); Matthew Henry enumera las tres entre seis sentidos posibles.',
      caution:
        'No hay que importar a Juan 1 todos los matices paulinos de «gracia». Aquí el acento recae en la plenitud de la generosa entrega de Dios que se ve en Jesús, puesta junto al don de la ley por medio de Moisés; no es una polémica contra la ley.',
      notableNotes: [
        '«Porque ya sabéis la gracia de nuestro Señor Jesucristo, que por amor de vosotros se hizo pobre, siendo rico»: la gracia vista en la encarnación.',
        '«Y si por gracia, luego no por las obras»: el sentido paulino de un favor que no puede ganarse.',
        '«Porque por gracia sois salvos por la fe»: la palabra en el centro del evangelio de Pablo.',
      ],
      anchors: [
        { verse: J1(14), phrases: { RVR1909: 'gracia y de verdad', BLM: 'gracia y de verdad', VBL: 'gracia y verdad' } },
        { verse: J1(16), phrases: { RVR1909: 'gracia por gracia', BLM: 'gracia sobre gracia', VBL: 'un don gratuito tras otro' } },
        { verse: J1(17), phrases: { RVR1909: 'la gracia y la verdad', BLM: 'La gracia y la verdad', VBL: 'la gracia y la verdad' } },
      ],
    },
    'john-1:kw:exegeomai': {
      english: 'le declaró (lo dio a conocer)',
      basicMeaning: 'contar, relatar',
      semanticRange: [
        'relatar, contar, narrar (Lc 24:35; Hch 10:8; 15:12, 14; 21:19)',
        'dar a conocer, declarar (a Dios, en Juan 1:18)',
        'literalmente, «conducir, mostrar el camino» (el primer sentido del léxico, aunque no es el uso del Nuevo Testamento)',
      ],
      grammar: 'Verbo, aoristo medio (deponente) de indicativo, tercera persona del singular (ἐξηγήσατο) — 1:18',
      significance:
        'En sus otros cinco usos en el Nuevo Testamento, este verbo significa relatar o contar lo sucedido. En 1:18 su complemento es Dios mismo: el Hijo, que está en el seno del Padre, ha narrado a Dios, lo ha contado en una vida humana. (La palabra castellana «exégesis» procede de la misma familia griega). Es el clímax del prólogo: nadie ha visto jamás a Dios, pero en Jesús el Dios invisible ha sido explicado plena y fielmente.',
      caution:
        'El derivado castellano ayuda a recordar, pero no define: Juan no dice que Jesús sea un intérprete de la Biblia, sino que toda su persona y su vida son la autorrevelación de Dios.',
      notableNotes: [
        'Los discípulos de Emaús «contaban las cosas que les habían acontecido en el camino»: el sentido ordinario de relatar.',
        'Bernabé y Pablo «contaban cuán grandes maravillas y señales Dios había hecho».',
        'Pablo «contó por menudo lo que Dios había hecho».',
      ],
      anchors: [{ verse: J1(18), phrases: { RVR1909: 'él le declaró', BLM: 'lo ha declarado', VBL: 'nos ha mostrado cómo es Dios' } }],
    },
    'john-1:kw:amnos': {
      english: 'Cordero',
      basicMeaning: 'cordero',
      semanticRange: [
        'un cordero (sobre todo, un cordero para el sacrificio)',
        'en sentido figurado, de Cristo (Juan 1:29, 36; Hch 8:32; 1 P 1:19)',
      ],
      grammar: 'Sustantivo, nominativo singular masculino (ὁ ἀμνός) — 1:29, seguido del participio presente ὁ αἴρων, «que quita»',
      significance:
        'ἀμνός aparece solo cuatro veces en el Nuevo Testamento, y todas señalan a Jesús. El anuncio del Bautista condensa toda una teología en una frase: este Cordero es de Dios —designado y provisto por él (compárese Gn 22:8)— y «quita» (en presente: es lo que hace) «el pecado del mundo», no solo el de Israel. La palabra griega remite sobre todo a Isaías 53:7 y a los corderos diarios del templo; el cordero pascual (llamado πρόβατον en el griego de Éxodo 12) entra por el marco pascual más amplio de Juan (19:14, 36).',
      caution:
        'Los estudiosos sopesan varios trasfondos para «Cordero de Dios» (la Pascua, el sacrificio diario, el Siervo de Isaías). Puede que Juan quiera evocar más de uno; es más sensato dejar que se enriquezcan mutuamente que forzar una sola fuente.',
      notableNotes: [
        'El Antiguo Testamento griego usa ἀμνός para el cordero que enmudece delante de su esquilador, imagen del Siervo: la misma palabra que en Juan 1:29. (El animal llevado al matadero en ese mismo versículo es un πρόβατον, una oveja).',
        'El funcionario etíope lee Isaías 53:7, y Felipe le anuncia a Jesús.',
        'Rescatados «con la sangre preciosa de Cristo, como de un cordero sin mancha y sin contaminación».',
        'La ofrenda diaria del templo: dos corderos (ἀμνοί en el Antiguo Testamento griego), uno por la mañana y otro al caer la tarde.',
      ],
      anchors: [
        { verse: J1(29), phrases: { RVR1909: 'el Cordero de Dios', BLM: 'el Cordero de Dios', VBL: 'el Cordero de Dios' } },
        { verse: J1(36), phrases: { RVR1909: 'el Cordero de Dios', BLM: 'el Cordero de Dios', VBL: 'el Cordero de Dios' } },
      ],
    },
  },
  crossReferences: {
    'john-1:xr:gen-1': {
      title: 'En el principio: un nuevo Génesis',
      explanation:
        'Las primeras palabras de Juan, Ἐν ἀρχῇ («En el principio»), son las mismas dos palabras con que empieza el Génesis en el Antiguo Testamento griego, y el eco se mantiene. En el Génesis, Dios habla y la creación llega a existir; en Juan, «Todas las cosas por él fueron hechas» (1:3). El Génesis pasa de las tinieblas sobre el abismo a «Sea la luz»; el Verbo de Juan es vida y «la luz de los hombres», que resplandece en unas tinieblas que no la han vencido (1:4–5). Juan no reemplaza el Génesis, sino que lo lee más a fondo: la palabra con que Dios creó era el Verbo que estaba con Dios, y que ahora viene a traer una nueva creación, dando a quienes lo reciben un nacimiento que viene de Dios (1:12–13). Lutero, al remontar el comienzo de Juan a Génesis 1, llamó a los libros de Moisés la verdadera mina de oro de la que se tomó la enseñanza del Nuevo Testamento sobre la divinidad de Cristo.',
    },
    'john-1:xr:ps-33': {
      title: 'Por la palabra de Jehová fueron hechos los cielos',
      explanation:
        'El Salmo 33 celebra la creación por la palabra: «Por la palabra de Jehová fueron hechos los cielos… Porque él dijo, y fué hecho». El Antiguo Testamento griego (Sal 32:6) usa aquí λόγος. Juan toma esta confesión familiar de la palabra creadora de Dios y hace una afirmación asombrosa: el Verbo por medio del cual todas las cosas fueron hechas (1:3) no es simplemente algo que Dios dice, sino alguien que «era con Dios» y «era Dios». La tradición judía también siguió reflexionando sobre este versículo: la Jewish Encyclopedia recoge un dicho rabínico según el cual Dios creó el mundo por su palabra, citando el Salmo 33:6.',
    },
    'john-1:xr:prov-8': {
      title: 'La Sabiduría junto al Creador',
      explanation:
        'En Proverbios 8 la Sabiduría habla como alguien presente antes de la creación: «Cuando formaba los cielos, allí estaba yo… Con él estaba yo ordenándolo todo» (8:27, 30). Escritos judíos posteriores desarrollaron la imagen (Sabiduría de Salomón 9:1–2 asocia la palabra y la sabiduría de Dios en la creación), y muchos intérpretes la oyen detrás del Verbo de Juan, que «era con Dios» y por medio del cual todas las cosas fueron hechas. El vínculo es temático, no una equivalencia, y requiere cuidado. Proverbios es poesía que personifica un atributo de Dios, y en el siglo IV los arrianos argumentaron a partir de 8:22 —donde la Sabiduría dice que el SEÑOR la creó (la RVR1909 traduce «me poseía»)— que el Hijo es una criatura. Atanasio respondió que, leído de Cristo, el versículo habla de su humanidad encarnada, no de su ser divino; y Juan 1:1–3 insiste en que el Verbo no fue hecho.',
    },
    'john-1:xr:exod-33-34': {
      title: '«Ruégote que me muestres tu gloria»: el Sinaí de nuevo',
      explanation:
        'Varios hilos de 1:14–18 se remontan a Éxodo 33–34. Moisés pide: «Ruégote que me muestres tu gloria»; el SEÑOR responde que nadie puede ver su rostro y vivir, y luego pasa proclamándose «grande en benignidad y verdad» (34:6), en hebreo ḥesed y ʾemet. Juan responde: «vimos su gloria… lleno de gracia y de verdad»; «la ley por Moisés fué dada: mas la gracia y la verdad por Jesucristo fué hecha»; y «A Dios nadie le vió jamás: el unigénito Hijo… él le declaró». D. A. Carson, entre otros, oye en «gracia y verdad» la versión joánica de ḥesed y ʾemet, y John Piper lee igualmente 1:17–18 a la luz de la petición de Moisés en Éxodo 33–34. (El Antiguo Testamento griego vertió 34:6 como «muy compasivo y verdadero», πολυέλεος καὶ ἀληθινός, sin χάρις, aunque ἀληθινός pertenece a la misma familia de palabras que el ἀλήθεια de Juan; así que el vínculo es sobre todo conceptual). No se trata de que al Sinaí le faltara gracia, sino de que lo que Moisés vislumbró desde la hendidura de la peña se ve ahora en el rostro de Jesús.',
    },
    'john-1:xr:exod-40': {
      title: 'El tabernáculo lleno de gloria',
      explanation:
        'Juan dice que el Verbo «habitó entre nosotros»: σκηνόω, plantar una tienda, de σκηνή, la palabra de la Biblia griega para el tabernáculo. En el Sinaí, Dios mandó que le hicieran un santuario para habitar en medio de su pueblo (Éx 25:8), y cuando el tabernáculo estuvo terminado, la gloria del SEÑOR lo llenó (40:34–35). Juan une ambas ideas en una sola frase: el Verbo «habitó entre nosotros», y enseguida: «vimos su gloria». La presencia de Dios, antes centrada en una tienda y después en un templo, se encarna ahora en una persona; en el capítulo siguiente Jesús habla de su cuerpo como del templo (2:19–21). Spurgeon desarrolló la misma imagen: la carne de Cristo es el lugar donde Dios se encuentra con la humanidad.',
    },
    'john-1:xr:isa-40': {
      title: '«Voz que clama en el desierto»',
      explanation:
        'Cuando le preguntan quién es, Juan el Bautista responde con Isaías 40:3, el comienzo del mensaje de consuelo de Isaías, que anuncia que el SEÑOR mismo viene a su pueblo y que «manifestaráse la gloria de Jehová» (40:5). Las palabras de Juan siguen la tradición griega, en la que la voz está en el desierto (en el hebreo, tal como lo traduce la BSB, lo que se prepara en el desierto es el camino), y dicen «Enderezad» donde la Septuaginta tiene «preparad». En cualquier caso, el Bautista se hace pequeño —solo una voz— y engrandece al que viene: el camino que se prepara es el camino del SEÑOR.',
    },
    'john-1:xr:deut-18': {
      title: '«¿Eres tú el profeta?»',
      explanation:
        'La pregunta de la comitiva, «¿Eres tú el profeta?», remite a la promesa de Moisés de que Dios levantaría un profeta «como yo», al que Israel debería escuchar (Dt 18:15, 18). Juan el Bautista dice que no. El Evangelio deja la pregunta en el aire y la responde por medio de Jesús: más tarde las multitudes dicen: «Este verdaderamente es el profeta» (6:14; compárese 7:40), y Felipe anuncia que ha hallado a aquel de quien escribió Moisés en la ley (1:45). En Hechos 3:22 Pedro aplica directamente Deuteronomio 18:15 a Jesús. Jesús es el profeta como Moisés, y más: Moisés recibió las palabras de Dios, mientras que Jesús es el Verbo de Dios.',
    },
    'john-1:xr:mal-4': {
      title: 'Elías antes del día del SEÑOR',
      explanation:
        '«¿Eres tú Elías?» presupone la promesa de Malaquías: «He aquí, yo os envío á Elías el profeta, antes que venga el día de Jehová grande y terrible» (Mal 4:5), donde Elías es el precursor de la venida del Señor (compárese el mensajero que prepara el camino en 3:1). Juan niega ser Elías; probablemente niega ser el antiguo profeta que vuelve en persona, como imaginaban quienes le preguntaban. Por su función, sin embargo, es el precursor que describió Malaquías, como observan las notas de Tyndale (compárese Mt 11:14; Lc 1:17).',
    },
    'john-1:xr:matt-11': {
      title: '«Él es aquel Elías que había de venir»',
      explanation:
        'Aquí los Evangelios parecen, a primera vista, contradecirse. Juan dice de sí mismo que no es Elías: «No soy» (1:21), mientras que Jesús dice de Juan: «él es aquel Elías que había de venir» (Mt 11:14; compárese 17:10–13). La tensión se disipa cuando se escucha cada afirmación en sus propios términos. El Bautista rechaza la identidad que tenían en mente quienes le interrogaban; Jesús, al añadir «si queréis recibir», habla del papel que Juan cumplió: como prometió el ángel, iría delante del Señor «con el espíritu y virtud de Elías» (Lc 1:17). El Evangelio de Juan aparta el foco del Bautista; el dicho de Mateo explica su importancia.',
    },
    'john-1:xr:isa-53': {
      title: 'El cordero mudo de Isaías 53',
      explanation:
        '«He aquí el Cordero de Dios, que quita el pecado del mundo». La palabra griega para cordero aquí, ἀμνός, es la que usa la Septuaginta en Isaías 53:7 para el cordero que enmudece ante su esquilador: el Siervo que «no abrió su boca». En el griego de ese versículo, el animal llevado al matadero es un πρόβατον, una oveja: lo contrario de la BSB, que traduce el hebreo, como también la RVR1909: «como cordero fué llevado al matadero; y como oveja delante de sus trasquiladores». Hechos 8:32 cita la formulación griega. El mismo Siervo llevó «el pecado de muchos» (53:12). La iglesia primitiva leyó así Isaías 53: cuando el funcionario etíope pregunta por 53:7, Felipe parte de esa Escritura y le anuncia la buena noticia de Jesús (Hch 8:32–35). El título del Bautista reúne este trasfondo del Siervo con los corderos sacrificiales de Israel; Isaías 53 aporta la idea de un inocente que sufre por los pecados de otros.',
    },
    'john-1:xr:exod-12': {
      title: 'El cordero pascual',
      explanation:
        'En el clímax del Evangelio de Juan, Jesús es condenado en «la víspera de la Pascua» (19:14), y ninguno de sus huesos es quebrado, lo cual Juan lee como cumplimiento de la Escritura (19:36), recordando la norma sobre el cordero pascual (Éx 12:46). Por eso, cuando el Bautista lo llama «el Cordero de Dios», muchos lectores oyen al cordero cuya sangre marcó los postes de las puertas de Israel en la noche de la liberación (Éx 12:3–7); también Pablo dice que «nuestra pascua, que es Cristo, fué sacrificada por nosotros» (1 Co 5:7). Los intérpretes sopesan este trasfondo junto con otros —el Siervo de Isaías y los corderos diarios del templo (Éx 29:38–39)—, y tanto las notas de Tyndale como Matthew Henry mencionan el sacrificio diario además de la Pascua. La Septuaginta de Éxodo 12 llama al animal pascual πρόβατον, no ἀμνός; así que el vínculo es temático más que verbal.',
    },
    'john-1:xr:gen-28': {
      title: 'La escalera de Jacob y el Hijo del hombre',
      explanation:
        'La promesa de Jesús —«veréis el cielo abierto, y los ángeles de Dios que suben y descienden sobre el Hijo del hombre»— evoca el sueño de Jacob en Betel, donde vio «ángeles de Dios que subían y descendían por ella» (el Antiguo Testamento griego usa el mismo par de verbos, subir y descender). La escena ya estaba preparada: Jesús llamó a Natanael «un verdadero Israelita, en el cual no hay engaño» (1:47), a diferencia del intrigante Jacob. Lo que Jacob llamó «casa de Dios, y puerta del cielo» (28:17) es ahora una persona: el Hijo del hombre es el lugar de encuentro entre el cielo y la tierra. Tim Keller predicó sobre este vínculo, sosteniendo que en Jesús el cielo se abre para quienes se acercan con humildad.',
    },
    'john-1:xr:col-1': {
      title: 'La imagen del Dios invisible, agente de la creación',
      explanation:
        'El gran himno cristológico de Pablo dice con su propio vocabulario lo que dice el prólogo de Juan. El Hijo es «la imagen del Dios invisible» (compárese Juan 1:18); «todo fué criado por él y para él» (compárese 1:3); «él es antes de todas las cosas» (compárese 1:1–2, 15); y «agradó al Padre que en él habitase toda plenitud» (compárese 1:14, 16). Dos voces distintas del Nuevo Testamento, un Evangelio y una carta, confiesan al mismo Hijo preexistente, creador y revelador.',
    },
    'john-1:xr:heb-1': {
      title: 'Dios ha hablado por el Hijo',
      explanation:
        'Hebreos comienza como Juan, con el hablar de Dios. Dios habló de muchas maneras «por los profetas», pero «En estos postreros días nos ha hablado por el Hijo… por el cual asimismo hizo el universo». El Hijo es «el resplandor de su gloria, y la misma imagen de su sustancia». Juan llama al Hijo «el Verbo»; Hebreos lo presenta como la palabra final de Dios. Ambos mantienen unidas la creación (Juan 1:3; Heb 1:2) y la revelación (Juan 1:14, 18; Heb 1:3), y Hebreos añade la purificación de los pecados que Juan 1:29 anuncia en el Cordero. John Piper establece exactamente esta conexión al explicar por qué Juan llama a Jesús «el Verbo».',
    },
    'john-1:xr:phil-2': {
      title: 'El descenso del Hijo',
      explanation:
        'Juan dice que el Verbo, que «era Dios», «fué hecho carne». Pablo dice que Cristo Jesús, «siendo en forma de Dios», «se anonadó á sí mismo, tomando forma de siervo, hecho semejante á los hombres», y descendió hasta la muerte de cruz. Ambos describen un único movimiento —de la gloria divina a una vida humana verdadera— e insisten en que quien desciende es la misma persona de principio a fin. Agustín advirtió el paralelo. En los libros platónicos encontró ideas semejantes a Juan 1:1–5, e incluso que el Hijo estaba en la forma del Padre y era igual a Dios (compárese Flp 2:6). Pero no encontró allí que el Verbo se hizo carne, ni que el Hijo se anonadó a sí mismo y tomó forma de siervo (Flp 2:7–11; Confesiones 7.9).',
    },
    'john-1:xr:1jn-1': {
      title: '«Lo que era desde el principio»',
      explanation:
        '1 Juan comienza con un prólogo muy paralelo a Juan 1: «desde el principio», el «Verbo de vida», una vida que «estaba con el Padre» y «nos ha aparecido», y un fuerte énfasis en lo que «hemos visto con nuestros ojos, lo que hemos mirado, y palparon nuestras manos». El Evangelio subraya que el Verbo se hizo carne y que «vimos su gloria» (1:14); la carta subraya la realidad física de ese ver y ese tocar. Leídos juntos, muestran que el testimonio joánico sostiene a la vez la eternidad del Verbo y la humanidad tangible de Jesús.',
    },
    'john-1:xr:rev-19': {
      title: 'Su nombre es El Verbo de Dios',
      explanation:
        'Solo los escritos joánicos dan a Jesús el título de «el Verbo»: el prólogo (1:1, 14), 1 Juan 1:1 (el «Verbo de vida») y Apocalipsis 19:13, donde el jinete que regresa, vestido de una ropa teñida en sangre, es llamado «EL VERBO DE DIOS». Los escenarios no podrían ser más distintos —el sereno comienzo de un Evangelio y una visión del juicio final—, pero el título hace la misma afirmación: la palabra decisiva de Dios al mundo es una persona, que revela, salva y juzga.',
    },
    'john-1:xr:matt-3': {
      title: 'El Espíritu que desciende como paloma',
      explanation:
        'El Evangelio de Juan no narra el bautismo de Jesús; recoge el testimonio del Bautista sobre lo que vio: «Vi al Espíritu que descendía del cielo como paloma, y reposó sobre él… éste es el Hijo de Dios» (1:32–34). Mateo y Marcos cuentan el hecho mismo: los cielos abiertos, el Espíritu que desciende como paloma y la voz del Padre: «Este es mi Hijo amado» (Mt 3:16–17; compárese Mr 1:10–11: «Tú eres mi Hijo amado»). Los relatos convergen en la misma revelación del Padre, el Espíritu y el Hijo. Juan añade que la señal se dio para que el Bautista pudiera reconocerlo y dar testimonio (1:33) y, como observan las notas de Tyndale, que el Espíritu permaneció sobre Jesús.',
    },
  },
  context: {
    'john-1:ctx:authorship': {
      title: '¿Quién escribió el cuarto Evangelio, y cuándo?',
      summary:
        'El Evangelio no nombra a su autor. Fundamenta su relato en el testimonio de un testigo ocular anónimo, el discípulo «al cual Jesús amaba» (13:23; compárese 19:35; 21:24). La tradición de la iglesia antigua lo identificó con el apóstol Juan, hijo de Zebedeo; Ireneo de Lyon (finales del siglo II) escribió que Juan, el discípulo que se había recostado sobre el pecho del Señor, publicó su Evangelio mientras vivía en Éfeso, en Asia.',
      detail:
        'Las notas de Tyndale aceptan la identificación tradicional —Juan, uno de los Doce y, con Pedro y Santiago, parte del círculo íntimo de Jesús—, aunque su resumen presenta al autor como probablemente el discípulo amado, identificado por la tradición con Juan, hijo de Zebedeo. La identificación no se hace en el propio Evangelio, y se ha cuestionado desde hace mucho: ya Eusebio señaló que Papías mencionaba tanto al apóstol Juan como a un «presbítero Juan» (Historia eclesiástica 3.39.4–6), y la Catholic Encyclopedia (1910), aunque defendía la autoría del apóstol, reconocía que desde el siglo XIX la mayoría de los críticos ajenos a la Iglesia católica la habían negado. En cuanto a la fecha, las notas de Tyndale dicen que la mayoría de los estudiosos cree que el Evangelio se terminó hacia el año 90 d. C. Esa fecha de finales del siglo I es la opinión común, aunque no la única: J. A. T. Robinson sostuvo en Redating the New Testament (1976) que todos los libros del Nuevo Testamento, incluido Juan, se escribieron antes del año 70 d. C. La tradición de Éfeso se remonta a Ireneo. Cuando Juan 1:14 dice «vimos su gloria», lo más natural es que hable con la voz de quienes conocieron a Jesús.',
    },
    'john-1:ctx:audience': {
      title: 'Destinatarios y propósito',
      summary:
        'Juan declara su propósito cerca del final: «Estas empero son escritas, para que creáis que Jesús es el Cristo, el Hijo de Dios; y para que creyendo, tengáis vida en su nombre» (20:31). El capítulo 1 sirve a ese fin acumulando testimonios y títulos de Jesús.',
      detail:
        'Las notas de Tyndale sugieren que los primeros lectores fueron probablemente cristianos judíos de la región de Éfeso y del resto del Mediterráneo, familiarizados con las fiestas y las ideas judías, pero necesitados de que se les explicaran algunos términos. Juan les traduce «Rabí» («Maestro», 1:38) y «Mesías» («Cristo», 1:41). Ese entorno mixto es importante para 1:1: la palabra Logos podía hablar tanto a lectores empapados del Antiguo Testamento griego como a quienes se habían formado en el pensamiento griego.',
    },
    'john-1:ctx:occasion': {
      title: 'Contra un Cristo dividido: Ireneo y el porqué del Evangelio',
      summary:
        'Ireneo creía que Juan escribió en parte para refutar a Cerinto y a otros maestros afines, que separaban al Creador del mundo del Padre de Jesús y enseñaban que un Cristo celestial descendió sobre el hombre Jesús y más tarde lo abandonó.',
      detail:
        'En esos sistemas, incluso Monogenes («Unigénito») y Logos («Verbo») eran nombres de seres celestiales. Ireneo leía el prólogo como la afirmación de que hay un solo Dios, que hizo todas las cosas por su Verbo, y de que el Verbo por medio del cual Dios creó es el mismo por medio del cual salva. Lutero repite la tradición de que Juan escribió contra Cerinto. Fuera o no Cerinto el blanco directo de Juan, la insistencia del prólogo en que el Verbo es Dios, es el Creador y verdaderamente se hizo carne habla directamente a tales ideas.',
    },
    'john-1:ctx:greek-logos': {
      title: 'El Logos en el pensamiento griego',
      summary:
        'Mucho antes de Juan, los filósofos griegos usaban logos para el principio racional que ordena el mundo. Heráclito exhortaba a sus oyentes a escuchar no a él, sino al Logos, que es común a todos; los estoicos identificaban a Dios con la razón eterna (logos) que impregna el cosmos.',
      detail:
        'Los lectores griegos cultos podían oír en Juan 1:1 el eco de algo que apreciaban: la razón que subyace a la realidad. Juan afirma que el mundo tiene esa fuente, pero la hace personal («era con Dios»), divina («era Dios») y —lo más escandaloso de todo— encarnada («fué hecho carne»). Agustín cuenta que un platónico decía que el comienzo del prólogo merecía escribirse con letras de oro y exponerse en todas las iglesias; y, sin embargo, los soberbios se negaban a aprender de un Dios que se hizo carne (La ciudad de Dios 10.29). En su propia lectura de los libros platónicos encontró ideas como las de 1:1–5, pero no al Verbo hecho carne (Confesiones 7.9). Tim Keller subraya también lo sorprendente que sonaba, tanto para judíos como para griegos, la afirmación de que el Verbo se hizo carne.',
    },
    'john-1:ctx:jewish-word': {
      title: 'Palabra, Sabiduría y Memra en la tradición judía',
      summary:
        'Para los oyentes judíos, la palabra del SEÑOR era la palabra que hizo los cielos (Sal 33:6), vino a los profetas y cumplió los propósitos de Dios. Los escritos sapienciales judíos presentaban a la Sabiduría junto a Dios en la creación (Pr 8) e incluso recibiendo la orden de fijar su morada —literalmente, de plantar su tienda— en Jacob (Eclesiástico 24:8).',
      detail:
        'Con frecuencia se proponen otros dos trasfondos; ambos son discutidos. Filón de Alejandría, filósofo judío contemporáneo de Jesús, llamó al Logos el primogénito de Dios y dijo que la imagen de Dios es su palabra más antigua (Sobre la confusión de las lenguas 146–147); pero el Logos de Filón nunca se convierte en un ser humano. Los tárgumes arameos (paráfrasis judías de la Escritura) hablan a menudo de la Memra, «la Palabra», del SEÑOR donde el hebreo habla de Dios actuando directamente. Matthew Henry señaló que la paráfrasis aramea llama a menudo al Mesías la Memra, y John Gill consideraba más probable que Juan tomara la expresión de los tárgumes, que creía escritos antes de la época de Juan, que de Platón. Daniel Boyarin (2001) ha sostenido que la teología del Logos del prólogo tiene profundas raíces judías. Hasta qué punto estas ideas influyeron en Juan, o unas en otras, es objeto de debate. La Jewish Encyclopedia (1904) consideró difícil precisar hasta qué punto la Memra rabínica había sido influida por el Logos griego, aunque sostenía que el Logos de Filón preparó el camino a las ideas cristianas sobre la Encarnación. Lo que está claro es que el lenguaje de Juan habría sonado arraigado en las Escrituras de Israel, no ajeno a ellas.',
    },
    'john-1:ctx:tabernacle': {
      title: 'Tabernáculo, templo y gloria',
      summary:
        'En la historia de Israel, la presencia de Dios habitaba en medio de su pueblo en el tabernáculo, y su gloria lo llenaba (Éx 25:8; 40:34–35). La tradición judía posterior llamó a esta presencia que habita la Shekiná, un término emparentado con el verbo hebreo shakan, «habitar».',
      detail:
        'El verbo de Juan, σκηνόω («habitó», literalmente «plantó su tienda»), se forma sobre σκηνή, «tabernáculo», y en el Antiguo Testamento griego traduce sobre todo shakan. El léxico griego señala que δόξα, «gloria», se usaba para el resplandor de la presencia de Dios en la columna de nube y en el Lugar Santísimo, lo que el hebreo posterior llamó la Shekiná. Así, cuando 1:14 dice que el Verbo «habitó entre nosotros» y añade «vimos su gloria», los lectores judíos recordarían el tabernáculo lleno de gloria: la presencia de Dios, antes centrada en una tienda y después en un templo, se encuentra ahora en Jesús (compárese 2:19–21).',
    },
    'john-1:ctx:baptist': {
      title: 'Juan el Bautista y su movimiento',
      summary:
        'Juan el Bautista era conocido mucho más allá de los Evangelios. El historiador judío Josefo lo describe como un hombre bueno que exhortaba a los judíos a practicar la justicia unos con otros y la piedad hacia Dios, y a acudir al bautismo; añade que Herodes el tetrarca hizo ejecutar a Juan porque temía su influencia sobre las multitudes.',
      detail:
        'El movimiento de Juan parece haberle sobrevivido: años después, en Éfeso, Pablo encontró a unos «discípulos» que solo conocían «el bautismo de Juan» (Hch 19:1–7). Las notas de Tyndale los consideran creyentes con una comprensión incompleta de la fe; Matthew Henry pensaba que habían sido bautizados en nombre de Juan por alguno de sus seguidores, que lo mantenía como cabeza de un partido. El recuerdo de tales grupos puede ayudar a explicar por qué el prólogo cuida tanto de aclarar: «No era él la luz, sino para que diese testimonio de la luz» (1:8), y por qué el Bautista insiste: «No soy yo el Cristo» (1:20); las notas de Tyndale observan que algunos especulaban con que Juan fuera el Mesías. Los lavamientos rituales de purificación eran conocidos en el judaísmo; el bautismo de Juan llamaba al arrepentimiento ante la llegada del que había de venir (1:25–27).',
    },
    'john-1:ctx:expectations': {
      title: 'Mesías, Elías y el Profeta',
      summary:
        'Las preguntas que le hacen a Juan —¿Eres el Cristo? ¿Elías? ¿El profeta?— trazan el mapa de las esperanzas vigentes en el judaísmo del siglo I: un libertador ungido (Mesías es el equivalente hebreo de la palabra griega Cristo), el regreso de Elías antes del día del SEÑOR (Mal 4:5) y un profeta como Moisés (Dt 18:15).',
      detail:
        'La comitiva trata estas figuras como tres personajes distintos, y Juan rechaza cada papel, apartando la atención de sí mismo. El resto del capítulo aplica luego esos títulos a Jesús en rápida sucesión: Mesías (1:41), aquel de quien escribieron Moisés y los profetas (1:45), Hijo de Dios y Rey de Israel (1:49). Las notas de Tyndale añaden que se esperaba que el Mesías diera a Israel liderazgo espiritual y redención política.',
    },
    'john-1:ctx:geography': {
      title: 'Betania, al otro lado del Jordán, y de allí a Galilea',
      summary:
        'Juan bautizaba en Betania, al otro lado del Jordán (1:28), en la orilla opuesta a Judea; no en la Betania cercana a Jerusalén donde vivía Lázaro (11:18). La KJV lee aquí «Bethabara», siguiendo el texto griego del que se tradujo (el Textus Receptus), y lo mismo hace la RVR1909 («Betábara»); la BSB y la WEB leen «Bethany», como la BLM y la VBL («Betania»), en consonancia con el texto crítico de Nestle–Aland y con el texto bizantino (mayoritario).',
      detail:
        'La segunda mitad del capítulo se desplaza al norte, a Galilea. Felipe, Andrés y Pedro eran de Betsaida, una aldea en la orilla norte del mar de Galilea; la pregunta de Natanael, «¿De Nazaret puede haber algo de bueno?», refleja la oscuridad de una pequeña aldea de montaña. Las notas de Tyndale observan también que Felipe (nombre griego) y Natanael (nombre hebreo) reflejan la mezcla de culturas de Galilea.',
    },
  },
  literary: {
    placeInBook:
      'Juan 1 es la puerta de entrada a todo el Evangelio. El prólogo (1:1–18) anuncia de antemano los temas que la historia irá desplegando: la identidad divina del Verbo, la vida y la luz, el testimonio, el rechazo y la acogida, la gloria, la gracia y la verdad. Después, 1:19–51 inicia la narración: el testimonio de Juan el Bautista y la reunión de los primeros discípulos, que conduce directamente a la primera señal en Caná, donde Jesús «manifestó su gloria» (2:11). Los capítulos 1–12 suelen llamarse el Libro de las Señales, y los capítulos 13–21, el Libro de la Gloria.',
    argument:
      'El prólogo avanza de la eternidad a la historia. Comienza con la existencia del Verbo y su relación con Dios (1–2); pasa a su obra en la creación y como vida y luz (3–5); presenta a Juan como testigo (6–8); sigue la venida de la Luz, su rechazo y su acogida (9–13); llega a la encarnación y a la gloria contemplada (14); repite el testimonio de Juan (15), y concluye con la plenitud recibida, el contraste con Moisés y el Hijo que da a conocer a Dios (16–18). La narración responde luego a la pregunta «¿Tú, quién eres?» (19–28), señala al Cordero y al Hijo ungido por el Espíritu (29–34) y muestra cómo el testimonio produce discípulos que responden a la invitación «Venid y ved» (35–51), para terminar con la promesa del cielo abierto sobre el Hijo del hombre.',
    placeInCanon:
      'Juan 1 reúne la historia del Antiguo Testamento en una sola persona. Relee Génesis 1 (el principio, la palabra, la luz), el Éxodo (el tabernáculo lleno de gloria, la petición de Moisés de ver a Dios, el cordero pascual), Isaías (la voz en el desierto, el Siervo semejante a un cordero) y Génesis 28 (la escalera de Jacob). Se sitúa junto a otras confesiones neotestamentarias del Hijo preexistente —Colosenses 1, Hebreos 1, Filipenses 2— y apunta hacia el Apocalipsis, donde el Verbo de Dios regresa y la morada de Dios está por fin con la humanidad (Ap 19:13; 21:3).',
    bookOutline: [
      'Prólogo: el Verbo hecho carne',
      'El testimonio de Juan y los primeros discípulos',
      'Primeras señales: de Caná a Caná',
      'Jesús en las fiestas',
      'La resurrección de Lázaro y el último llamamiento público',
      'El aposento alto: despedida y oración',
      'Arresto, juicio y crucifixión',
      'Resurrección y envío',
    ],
    passageOutline: [
      'El Verbo, la creación y la luz',
      'Juan, enviado como testigo',
      'Llega la Luz: rechazada y recibida',
      'El Verbo se hizo carne: gloria, gracia y verdad',
      'El testimonio de Juan ante la comitiva de Jerusalén',
      '«He aquí el Cordero de Dios»',
      'Los primeros discípulos: «Venid y ved»',
      'Felipe y Natanael: el cielo abierto',
    ],
    features: {
      'john-1:lit:inclusio': {
        title: 'Un marco: Dios y el Verbo (1:1 y 1:18)',
        description:
          'El prólogo empieza y termina con las mismas dos notas. En 1:1 el Verbo «era con Dios» y «era Dios»; en 1:18, según los manuscritos más antiguos, el Hijo único es él mismo Dios, y está «en el seno del Padre». Entre ambos extremos, el Verbo entra en el mundo. El efecto es enmarcar toda la historia de la encarnación con la cercanía eterna del Hijo al Padre, la misma cercanía que lo capacita para dar a conocer al Padre.',
      },
      'john-1:lit:chiasm': {
        title: 'Un quiasmo con centro en «hijos de Dios» (una propuesta)',
        description:
          'Algunos intérpretes ven el prólogo como un quiasmo: líneas dispuestas en espejo alrededor de un centro. R. Alan Culpepper («The Pivot of John’s Prologue», New Testament Studies 27, 1980) propuso que su centro es 1:12b: «dióles potestad de ser hechos hijos de Dios». Según esta lectura, la meta del prólogo no es solo quién es el Verbo, sino lo que da. El esquema siguiente resume la propuesta con las palabras de este estudio; los lectores discrepan en los detalles, pero las correspondencias (1:1–2 con 1:18, 1:6–8 con 1:15, y 1:9–10 con 1:14) son fáciles de comprobar.',
        structure: [
          { label: 'A', text: 'El Verbo con Dios' },
          { label: 'B', text: 'Todas las cosas llegaron a existir por medio del Verbo' },
          { label: 'C', text: 'Lo que recibimos: vida y luz' },
          { label: 'D', text: 'Juan, enviado a dar testimonio' },
          { label: 'E', text: 'La Luz que viene al mundo' },
          { label: 'F', text: 'Los suyos no lo recibieron' },
          { label: 'G', text: 'Todos los que sí lo recibieron' },
          { label: 'H', text: 'Les dio potestad de ser hechos hijos de Dios' },
          { label: 'G′', text: 'Los que creen en su nombre' },
          { label: 'F′', text: 'Nacidos no de voluntad humana, sino de Dios' },
          { label: 'E′', text: 'El Verbo se hizo carne' },
          { label: 'D′', text: 'El testimonio de Juan' },
          { label: 'C′', text: 'Lo que recibimos: gracia sobre gracia' },
          { label: 'B′', text: 'La gracia y la verdad vinieron por medio de Jesucristo' },
          { label: 'A′', text: 'El Hijo, en el seno del Padre, lo da a conocer' },
        ],
      },
      'john-1:lit:staircase': {
        title: 'Versos «en escalera» en 1:1–5',
        description:
          'Los versículos iniciales están construidos como peldaños: cada cláusula retoma una palabra clave de la anterior; en griego, λόγος … λόγος, θεόν … θεός, ζωή … ζωή, φῶς … φῶς, σκοτία … σκοτία. El castellano conserva parte del efecto: «En él estaba la vida, y la vida era la luz de los hombres. Y la luz en las tinieblas resplandece; mas las tinieblas no la comprendieron». El ritmo ha llevado a muchos a pensar que 1:1–5 pudo ser un himno o un poema; las notas de Tyndale sugieren que quizá lo cantaban los primeros cristianos.',
      },
      'john-1:lit:witness': {
        title: 'Testimonio y visión',
        description:
          'El testimonio es el motor del capítulo. El verbo μαρτυρέω («dar testimonio») y el sustantivo μαρτυρία («testimonio») aparecen siete veces en el capítulo 1 (dos veces en 1:7, y en 1:8, 15, 19, 32 y 34), y junto a ellos corren los verbos de ver: «vimos su gloria» (1:14), «yo le vi, y he dado testimonio» (1:34), «Venid y ved» (1:39), «Ven y ve» (1:46), «cosas mayores que éstas verás» (1:50–51). El Evangelio de Juan presenta la fe como respuesta a un testimonio fiable.',
      },
      'john-1:lit:days-and-titles': {
        title: 'Una secuencia de días y una cascada de títulos',
        description:
          'La narración está marcada por indicaciones de tiempo: «El siguiente día» (1:29, 35, 43) y luego «al tercer día» (2:1). Algunos intérpretes las cuentan como una semana que culmina en Caná, quizá con eco de los días de la creación; el cómputo se discute, pero la secuencia es clara. Por el camino, Jesús recibe un título tras otro: el Verbo, la Luz, el Hijo único, el Cordero de Dios, el Hijo de Dios, Rabí, Mesías, aquel de quien escribieron Moisés y los profetas, el Rey de Israel y, finalmente, en su propia boca, el Hijo del hombre.',
      },
    },
  },
  theology: {
    'john-1:th:eternal-word': {
      title: 'El Verbo eterno y divino',
      summary:
        'Juan 1:1–2 hace tres afirmaciones sobre el Verbo: ya «era» en el principio (no llegó a existir), «era con Dios» (distinto del Padre) y «era Dios» (comparte la naturaleza de Dios). El prólogo termina del mismo modo: el Hijo es él mismo Dios y está «en el seno del Padre» (1:18).',
      detail:
        'Los verbos son elocuentes. Según 1:3, todas las cosas «fueron hechas» (ἐγένετο, llegaron a existir); el Verbo simplemente «era» (ἦν). El contraste reaparece en 1:14, donde el Verbo que siempre era «fué hecho carne». Por eso la iglesia, frente a Arrio en el siglo IV, apeló a Juan 1: como argumentó Agustín, aquel por medio del cual todas las cosas fueron hechas no puede ser él mismo una de las cosas hechas; y Piper señala que las palabras finales de 1:3 lo dejan fuera de toda duda.',
    },
    'john-1:th:trinity': {
      title: '«Con Dios» y «era Dios»: las raíces de la fe trinitaria',
      summary:
        'Juan 1:1 mantiene juntas dos afirmaciones sin disolver ninguna: el Verbo es distinto de Dios («era con Dios») y, sin embargo, es Dios. Más adelante en el capítulo, Dios, que envió al Bautista (1:6, 33), le da una señal: el Espíritu desciende y reposa sobre Jesús, y el Bautista testifica que este es el Hijo de Dios (1:32–34).',
      detail:
        'La doctrina de la Trinidad —un solo Dios, eternamente Padre, Hijo y Espíritu Santo— se formuló en el siglo IV en gran medida reflexionando sobre textos como estos. El credo de 381 confiesa al Hijo como Hijo unigénito de Dios, Luz de Luz, Dios verdadero de Dios verdadero, aquel por quien todas las cosas fueron hechas: un lenguaje empapado de Juan 1. Juan no usa el vocabulario técnico posterior, pero proporciona su materia prima: una distinción real sin división. Lutero observó que el evangelista dispuso sus palabras para refutar a la vez ambos errores: el de quienes funden al Padre y al Hijo en una sola persona y el de quienes niegan que el Hijo sea verdaderamente Dios.',
    },
    'john-1:th:incarnation': {
      title: 'El Verbo se hizo carne',
      summary:
        '«Aquel Verbo fué hecho carne» (1:14) es el centro de la fe cristiana acerca de Jesús: el Verbo eterno asumió una vida humana completa —«carne» en el sentido bíblico de humanidad frágil y mortal— sin dejar de ser el Verbo.',
      detail:
        'Los primeros intérpretes protegieron ambas mitades. Crisóstomo insistía en que «fué hecho» no significa que la naturaleza divina se transformara en carne: el Verbo tomó la carne para sí, sin que su naturaleza sufriera alteración. Calvino lo expresó diciendo que el Hijo de Dios comenzó a ser hombre sin dejar de ser el Verbo eterno. Frente a los maestros que decían que Jesús solo parecía humano, «carne» es una palabra rotunda: se trata de una humanidad real, que se puede tocar (compárese 1 Juan 1:1). Las notas de Tyndale observan que la idea asombró tanto a los griegos, que separaban lo divino del mundo carnal, como a los judíos.',
    },
    'john-1:th:creation': {
      title: 'La creación por medio del Verbo',
      summary:
        '«Todas las cosas por él fueron hechas» (1:3): el Verbo no forma parte de la creación, sino que es su agente. Juan sitúa a Jesús del lado del Creador en la línea que separa a Dios de todo lo demás.',
      detail:
        'Esto tiene dos consecuencias en Juan 1. Primero, el mundo pertenece al Verbo, lo que hace aún más triste que no lo reconociera (1:10–11). Segundo, el que hizo todas las cosas puede hacer nuevas a las personas: quienes lo reciben son engendrados de Dios (1:12–13). Ireneo vio la conexión: el Verbo por quien Dios hizo la creación es aquel por quien concede la salvación a los hombres de esa creación. Colosenses 1:16 y Hebreos 1:2 hacen la misma confesión.',
    },
    'john-1:th:revelation': {
      title: 'El Hijo que da a conocer a Dios',
      summary:
        '«A Dios nadie le vió jamás: el unigénito Hijo, que está en el seno del Padre, él le declaró» (1:18). El verbo ἐξηγέομαι significa narrar o exponer por completo: Jesús es la autoexplicación de Dios.',
      detail:
        'El prólogo llega a esta afirmación a través de sus imágenes: el Verbo (la autoexpresión de Dios), la Luz que resplandece en las tinieblas, la gloria vista en la carne, la gracia y la verdad venidas en plenitud. A Moisés no se le permitió ver el rostro de Dios (Éx 33:20); el Hijo, que está en el seno del Padre, puede darlo a conocer; por eso Jesús dirá más tarde: «El que me ha visto, ha visto al Padre» (14:9). Atanasio expresó en estos términos el propósito de la encarnación: el Verbo se manifestó en un cuerpo para que recibiéramos la noción del Padre invisible.',
    },
    'john-1:th:children-lamb': {
      title: 'Hijos de Dios y el Cordero que quita el pecado',
      summary:
        'Juan 1 describe la salvación desde dos lados. A quienes reciben al Verbo y creen en su nombre se les da potestad de ser hechos hijos de Dios, engendrados no por descendencia ni por decisión humana, sino por Dios (1:12–13). Y Jesús es anunciado como «el Cordero de Dios, que quita el pecado del mundo» (1:29).',
      detail:
        'Lo primero es el nuevo nacimiento, obra de Dios mismo, que Jesús explicará a Nicodemo (3:3–6); R. Alan Culpepper sostuvo que 1:12 es el eje de todo el prólogo. Lo segundo es el sacrificio: el Cordero quita el pecado, y no solo el de Israel, sino el del mundo; Calvino lo llama el oficio principal de Cristo. Crisóstomo vinculó el primer tema a la encarnación: el Hijo de Dios se hizo Hijo del hombre para que los hijos de los hombres llegaran a ser hijos de Dios.',
    },
  },
  perspectives: {
    'john-1:ps:nicene': {
      question: '¿Es el Verbo plenamente Dios, o la primera y más alta de las criaturas de Dios?',
      intro:
        'Los cristianos de las tradiciones católica, ortodoxa y protestante coinciden en que Juan 1:1 y 1:14 confiesan la plena divinidad y la verdadera humanidad de Cristo. La cuestión se debatió con ardor en el siglo IV, cuando Arrio enseñó que el Hijo tuvo un comienzo. El Concilio de Nicea (325), y el credo ampliado en 381, respondieron que el Hijo es engendrado, no creado. La postura arriana se expone aquí para la comprensión histórica; no es una opción viva dentro del cristianismo histórico.',
      commonGround:
        'Ambas partes coincidían en que el Hijo existía antes de la creación y en que todas las cosas fueron hechas por medio de él. La disputa era si pertenece al lado del Creador o al de la creación, y Juan 1:1–3 es donde la iglesia encontró su respuesta.',
      perspectives: {
        'john-1:ps:nicene:nicene': {
          tradition: 'Cristianismo niceno (católico, ortodoxo, protestante)',
          label: 'El Verbo es plenamente Dios, eternamente distinto del Padre',
          summary:
            'En 1:1 el Verbo ya «era» antes de que nada fuera hecho, se distingue del Padre («era con Dios») y comparte la naturaleza divina («era Dios»); 1:3 lo sitúa del lado del Creador; 1:14 dice que verdaderamente se hizo hombre; 1:18 llama al Hijo él mismo Dios. El credo lo confiesa como Hijo unigénito de Dios, engendrado del Padre antes de todos los siglos, Dios verdadero de Dios verdadero, engendrado, no creado; aquel por quien todas las cosas fueron hechas y que, por nosotros los hombres y por nuestra salvación, descendió del cielo y se hizo hombre.',
        },
        'john-1:ps:nicene:arian': {
          tradition: 'Arrianismo (siglo IV; rechazado en Nicea)',
          label: 'El Hijo es un ser exaltado que tuvo un comienzo',
          summary:
            'Arrio quería salvaguardar la singularidad de Dios como el único no engendrado y sin principio. Según sus propias palabras, el Hijo tiene un principio, mientras que Dios no lo tiene; aunque todavía podía llamar al Hijo Dios perfecto, unigénito e inmutable. Los arrianos aplicaban al Hijo textos como Proverbios 8:22, donde la Sabiduría dice que el SEÑOR la creó, y concluían que es una obra, una criatura. Sus adversarios respondieron desde el propio Juan 1: el Verbo ya «era» en el principio, y nada de lo que ha sido hecho fue hecho sin él; por tanto, no puede ser él mismo algo hecho. El Concilio de Nicea anatematizó la afirmación de que hubo un tiempo en que el Hijo no existía.',
        },
      },
    },
    'john-1:ps:monogenes': {
      question: '¿Significa μονογενής «unigénito» o «único»?',
      intro:
        'Las Biblias inglesas antiguas, siguiendo la Vulgata latina, dicen «only begotten» (KJV); muchas modernas dicen «one and only» u «only» (BSB), es decir, «único», y la WEB dice «only born». Entre las versiones castellanas de este estudio, la RVR1909 dice «unigénito»; la VBL, «único»; y la BLM usa ambas palabras (1:14 y 1:18). El debate se da dentro del cristianismo ortodoxo: ambas partes afirman la plena divinidad del Hijo. La cuestión es qué aporta esta palabra en concreto.',
      commonGround:
        'Ambas lecturas afirman que Jesús es el Hijo en un sentido único, plenamente Dios, y que los creyentes llegan a ser hijos de Dios solo por medio de él (1:12). Quienes sostienen la generación eterna del Hijo la fundamentan en más textos que este; la cuestión aquí es si μονογενής es uno de sus apoyos.',
      perspectives: {
        'john-1:ps:monogenes:unique': {
          tradition: 'Consenso léxico del siglo XX',
          label: '«Único»: singular, sin igual',
          summary:
            'Dale Moody (1953) sostuvo que μονογενής procede de μόνος («solo») y γένος («clase»), no del verbo «engendrar», de modo que significa «solo» o «único». Señaló Hebreos 11:17, donde Isaac es el μονογενής de Abraham aunque Abraham tenía otro hijo —Isaac era único como hijo de la promesa—, y la Vetus Latina, que tenía unicus («único») en Juan antes de que Jerónimo introdujera unigenitus («unigénito»), aunque dejó unicus en Lucas. Como documenta Denny Burk, muchos comentarios y léxicos posteriores lo siguieron. El propio Moody afirmaba la divinidad preexistente de Cristo, y quienes adoptan esta postura por lo general no niegan la relación eterna del Hijo con el Padre; sencillamente no la apoyan en esta palabra.',
        },
        'john-1:ps:monogenes:begotten': {
          tradition: 'Lectura tradicional (nicena), recuperada recientemente',
          label: '«Unigénito»: el Hijo único engendrado del Padre',
          summary:
            'El Credo niceno llama al Hijo unigénito de Dios, engendrado del Padre antes de todos los siglos, leyendo μονογενής como una palabra sobre el origen, y algunos estudiosos recientes han recuperado esa lectura. Charles Lee Irons (2017), tras examinar las palabras compuestas terminadas en -γενής en la literatura griega, sostiene que la gran mayoría se refieren al nacimiento o al origen más que a la «clase», y que Isaac podía ser llamado μονογενής de Abraham (Heb 11:17) porque era su único heredero. Denny Burk añade que Hebreos 11:17 encaja con «engendrado de manera única» —Isaac como el heredero prometido, nacido del propio cuerpo de Abraham— y que Juan usa μονογενής justo después de hablar del nacimiento de los creyentes a partir de Dios (1:13–14; 3:3–16), distinguiendo así la generación única del Hijo del nuevo nacimiento de ellos. Según esta postura, los padres nicenos leyeron correctamente el griego de Juan.',
        },
      },
    },
    'john-1:ps:katalambano': {
      question: 'En 1:5, ¿las tinieblas no «vencieron» a la Luz, o no la «comprendieron»?',
      intro:
        'El verbo καταλαμβάνω puede significar apoderarse de algo o alcanzarlo, o bien (normalmente en voz media) captarlo con la mente. Las Biblias se dividen: la KJV dice que las tinieblas «comprehended it not», como la RVR1909 («no la comprendieron»); la BSB («has not overcome it») y la WEB entienden que no la vencieron, como la BLM («no la han vencido») y, a su manera, la VBL («no la ha apagado»). Es una cuestión exegética genuina en la que lectores cuidadosos discrepan.',
      commonGround:
        'Ambas lecturas coinciden en que la Luz no es derrotada y en que la humanidad, abandonada a sí misma, se le resiste. La diferencia es de énfasis —hostilidad o incomprensión—, y el verbo admite cualquiera de las dos, como observan las notas de Tyndale.',
      perspectives: {
        'john-1:ps:katalambano:overcome': {
          tradition: 'Traducciones modernas como la BSB y la WEB (en castellano, la BLM y la VBL); las notas de Tyndale',
          label: 'Hostilidad: las tinieblas no han vencido a la Luz',
          summary:
            'En el único otro uso del verbo en Juan (aparte del discutido 8:3–4), las tinieblas vuelven a ser el sujeto y el sentido es hostil: «porque no os sorprendan las tinieblas» (12:35). El verbo de 1:5 está en voz activa, no en la voz media que suele usarse para la captación mental, y el léxico de STEPBible clasifica este versículo bajo «alcanzar, sorprender». Las notas de Tyndale concluyen que en Juan la palabra expresa hostilidad: las tinieblas intentarían destruir la Luz y fracasarían, y la Luz traería salvación al mundo. (Los lectores pueden ver aquí un anticipo de la cruz y la resurrección).',
        },
        'john-1:ps:katalambano:comprehend': {
          tradition: 'Lecturas de la Reforma y versiones antiguas (Calvino; la KJV; en castellano, la RVR1909)',
          label: 'Incomprensión: las tinieblas no captaron la Luz',
          summary:
            'Según esta lectura, las tinieblas son el entendimiento humano caído: la Luz resplandece, pero las mentes cegadas no la captan. Calvino aplica el versículo a los restos de razón que quedan en la humanidad caída, que por sí mismos nunca llegan a Dios; por eso no hay esperanza a menos que Dios conceda una nueva ayuda. La lectura encaja con los versículos siguientes, donde «el mundo no le conoció» (1:10) y «los suyos no le recibieron» (1:11).',
        },
      },
    },
  },
  commentary: {
    'john-1:cm:augustine-tractate-1': {
      lead: 'Sobre «En el principio era el Verbo», en respuesta a quienes decían que el Verbo fue creado',
      quoteTranslation:
        'Quizá salga ahora algún arriano incrédulo y diga que el Verbo de Dios fue hecho. ¿Cómo puede ser que el Verbo de Dios fuera hecho, si Dios hizo todas las cosas por el Verbo?',
    },
    'john-1:cm:augustine-confessions': {
      lead: 'Sobre lo que encontró —y lo que no encontró— en los libros de los platónicos',
      quoteTranslation:
        'Del mismo modo, leí allí que Dios, el Verbo, no nació de la carne, ni de la sangre, ni de la voluntad del varón, ni de la voluntad de la carne, sino de Dios. Pero que el Verbo se hizo carne y habitó entre nosotros, eso no lo leí allí.',
    },
    'john-1:cm:chrysostom-homily-11': {
      lead: 'Sobre por qué el Verbo se hizo carne (1:12–14)',
      quoteTranslation:
        'Porque se hizo Hijo del hombre el que era Hijo propio de Dios, a fin de hacer hijos de Dios a los hijos de los hombres.',
    },
    'john-1:cm:athanasius-incarnation': {
      lead: 'Sobre lo que logra la encarnación: la formulación clásica detrás de la enseñanza oriental sobre la theosis (la participación por gracia en la vida de Dios)',
      quoteTranslation:
        'Porque él se hizo hombre para que nosotros fuéramos hechos Dios; y se manifestó por medio de un cuerpo para que recibiéramos la noción del Padre invisible…',
    },
    'john-1:cm:luther-postil': {
      lead: 'Sobre leer «vida» y «luz» (1:4) desde Cristo y no desde la especulación',
      quoteTranslation:
        'Todos estos son pensamientos humanos, platónicos y filosóficos, que nos apartan de Cristo y nos llevan hacia nosotros mismos; pero el evangelista quiere sacarnos de nosotros mismos y llevarnos a Cristo.',
    },
    'john-1:cm:calvin-speech': {
      lead: 'Sobre por qué Juan llama al Hijo «el Verbo» (el traductor inglés de Calvino vierte Logos como «Speech», es decir, la Palabra hablada)',
      quoteTranslation:
        'En cuanto a que el evangelista llame al Hijo de Dios la Palabra, la razón sencilla me parece ser, primero, que él es la Sabiduría y la Voluntad eternas de Dios; y, en segundo lugar, que es la imagen viva de su propósito; porque, así como se dice que entre los hombres la palabra es la imagen de la mente, no es impropio aplicar esto a Dios y decir que él se nos revela por su Palabra.',
    },
    'john-1:cm:henry-fullness': {
      lead: 'Sobre «de su plenitud tomamos todos» (1:16)',
      quoteTranslation:
        'Como la cisterna recibe el agua de la plenitud de la fuente, las ramas la savia de la plenitud de la raíz, y el aire la luz de la plenitud del sol, así recibimos nosotros la gracia de la plenitud de Cristo.',
    },
    'john-1:cm:spurgeon-tabernacle': {
      lead: 'Sobre «habitó entre nosotros»: Cristo como tabernáculo de Dios (1:14)',
      quoteTranslation:
        'Pues bien, la carne humana de Cristo era el tabernáculo de Dios, y es en Cristo donde Dios se encuentra con el hombre, y en Cristo donde el hombre tiene trato con Dios.',
    },
    'john-1:cm:lewis-begetting': {
      lead: 'Sobre la fórmula del Credo según la cual el Hijo es engendrado, no creado, expresión que procede en parte del «unigénito» de Juan',
      text:
        'Lewis explica la afirmación del credo de que el Hijo es engendrado, no creado, y de que esta generación sucedió antes del tiempo, no en Belén. Engendrar, dice, produce descendencia de la misma clase que el progenitor, mientras que hacer produce algo de otra clase; así, el Hijo, engendrado del Padre, es Dios como el Padre es Dios, mientras que todo lo que Dios hace es criatura. Luego se vuelve hacia la oferta cristiana: los seres humanos, que son hechos, pueden llegar a participar de la vida engendrada del Hijo y llegar así a ser hijos de Dios (compárese Juan 1:12).',
    },
    'john-1:cm:carson-talk': {
      lead: 'Sobre Juan 1:1–18 como cumplimiento de Éxodo 33–34',
      text:
        'Carson presenta «el Verbo» como la autoexpresión de Dios —la palabra por la que Dios revela, crea y transforma en el Antiguo Testamento— y sostiene que Juan 1:14–18 retoma la escena en la que Moisés pide ver la gloria de Dios (Éx 33–34). Jesús habitó entre nosotros como lugar de encuentro entre Dios y los pecadores; su gloria se manifiesta sobre todo en la cruz; y la gracia y la verdad evocan la descripción que Dios hizo de sí mismo ante Moisés. Lee 1:16 como una gracia que sustituye a otra: la ley fue un don de gracia, al que ahora sucede la gracia mayor del nuevo pacto en Jesús. Concluye instando a quien quiera conocer el carácter de Dios —su santidad, su perdón y su gloria— a mirar a Jesús, hasta la cruz.',
    },
    'john-1:cm:keller-incarnation': {
      lead: 'Sobre por qué la encarnación del Verbo debería transformarnos',
      text:
        'Keller señala que, para los primeros oyentes de Juan, judíos y griegos por igual, la afirmación de que el Verbo de Dios se había hecho un ser humano de carne y hueso era sorprendente; muchos estudiosos, observa, la consideran un punto de inflexión en la historia de las ideas. Sin embargo, la Navidad a menudo nos deja igual que estábamos. Extrae tres consecuencias de la encarnación: como Dios ha compartido nuestra condición humana, tenemos un profundo consuelo en el sufrimiento; tenemos un poderoso motivo para servir a los demás; y tenemos una esperanza que es honesta respecto a la ruptura del mundo y que, sin embargo, no puede fallar.',
    },
    'john-1:cm:piper-fullness': {
      lead: 'Sobre la gloria, la gracia y Moisés en Juan 1:14–18',
      text:
        'Piper observa que Juan subraya la gracia en el prólogo y nunca vuelve a usar la palabra en el Evangelio, mientras que «verdad» se repite en todo él. Leyendo 1:16 como la razón de 1:14, sostiene que solo el don de la gracia permite a alguien ver la gloria de Cristo. Relaciona 1:17–18 con la petición de Moisés de ver la gloria de Dios en Éxodo 33–34: la ley fue en sí misma un don de gracia, y en Cristo ha venido una gracia mayor. El contraste no es entre una ley mala y un evangelio bueno, sino entre aquel que fue mediador de la ley de Dios y aquel en quien la gracia de Dios y su autorrevelación están presentes en persona.',
    },
  },
  sermons: {
    'john-1:sermon:spurgeon-glory': {
      summary:
        'Spurgeon lee 1:14 en el sentido de que el Verbo plantó su tabernáculo entre nosotros: así como el tabernáculo, con la gloria de la Shekiná, era el mayor privilegio de Israel, la humanidad de Cristo es el lugar donde Dios y la humanidad se encuentran; pero, a diferencia del tabernáculo, él está lleno de gracia y de verdad: es la sustancia y no la sombra. Después considera al pueblo favorecido que contempló su gloria y la naturaleza de esa gloria.',
    },
    'john-1:sermon:spurgeon-lamb': {
      summary:
        'Spurgeon señala que el Bautista, que podría haber presentado a Jesús como maestro o como ejemplo, eligió proclamarlo ante todo como el sacrificio por el pecado, y sostiene que esta doctrina es intensamente práctica: toda la vida del Bautista existía para señalar a Jesús, como debería existir la de los creyentes.',
    },
    'john-1:sermon:piper-beginning': {
      summary:
        'Piper sostiene que Juan llama a Jesús «el Verbo» porque la persona y la obra de Jesús —su venida, su vida, su muerte y su resurrección, y no solo su enseñanza— son el centro de lo que Dios revela (relacionando Hebreos 1:1–2 y Apocalipsis 19:13). Luego extrae de 1:1–3 cuatro observaciones —el tiempo de la existencia del Verbo, su identidad como Dios, su relación con Dios y su relación con el mundo— y muestra cómo las últimas palabras de 1:3 excluyen la afirmación de que el Hijo fue creado.',
    },
    'john-1:sermon:keller-word-made-flesh': {
      summary:
        'Meditando en 1:14, Keller presenta a Jesús como el Verbo de Dios: Dios se hace personalmente cognoscible en Jesús, del mismo modo que las personas se dan a conocer por lo que dicen. Pero Jesús no vino solo a hablar, sino a compartir nuestra vida —de modo que ningún sufrimiento nuestro le es ajeno— y, sobre todo, a morir por nosotros.',
    },
    'john-1:sermon:keller-heaven-open': {
      summary:
        'Keller vincula el sentido de la venida de Cristo con el sueño de Jacob en Betel: en Jesús se abre el acceso a Dios, y son los humillados, no los seguros de sí mismos, quienes entran.',
    },
  },
  verseNotes: {
    'JHN.1.1': [
      'El comienzo de Juan evoca Génesis 1:1: en griego, las dos primeras palabras son idénticas. Siguen tres afirmaciones. El Verbo ya existía cuando el principio comenzó; el Verbo «era con Dios», en relación con él y distinto de él; y «el Verbo era Dios», pues comparte la naturaleza misma de Dios. En griego, «Dios» en la última cláusula va en primer lugar y sin artículo, lo que gramáticos como Philip Harner interpretan como una descripción de lo que el Verbo es, no como una identificación con el Padre, a quien Juan acaba de llamar «Dios».',
    ],
    'JHN.1.3': [
      'Todo lo que existe llegó a existir (ἐγένετο) por medio del Verbo, y la segunda mitad del versículo cierra toda escapatoria: ni una sola de las cosas que han llegado a ser llegó a ser sin él. Eso sitúa al Verbo fuera de la categoría de las cosas hechas, un argumento que Agustín esgrimió contra los arrianos y que John Piper esgrime hoy. Algunos lectores antiguos, entre ellos Ireneo y Agustín, dividieron la frase de otro modo y unieron «lo que ha sido hecho» al versículo 4 (ὃ γέγονεν ἐν αὐτῷ ζωὴ ἦν, «lo que ha llegado a ser en él era vida»). El texto griego de Nestle–Aland (28.ª edición) la puntúa también así. Lutero y Calvino discuten ambas opciones y mantienen esas palabras en el versículo 3, como hacen la BSB, la KJV y la WEB, y también la RVR1909 y la BLM.',
    ],
    'JHN.1.5': [
      '«Y la luz en las tinieblas resplandece» está en presente: sigue resplandeciendo. La segunda cláusula usa un verbo en aoristo, κατέλαβεν, que puede significar que las tinieblas no han vencido a la Luz o que no la comprendieron (compárense la BLM y la RVR1909, como en inglés la BSB y la KJV); el panel de perspectivas expone ambas lecturas. En cualquier caso, el versículo anticipa todo el Evangelio: el rechazo, la cruz y una Luz que no se extingue.',
    ],
    'JHN.1.9': [
      'La «luz verdadera» es la luz genuina, frente a luces parciales o prestadas como Juan el Bautista (1:8). El participio griego ἐρχόμενον («que viene») puede referirse a la Luz (así la BSB y la WEB, y la BLM: la verdadera luz «venía a este mundo») o a todo hombre (así la KJV, y la RVR1909: «que alumbra á todo hombre que viene á este mundo»); su forma admite ambas cosas. Lutero insiste en que la luz de la que aquí se habla es la luz de la gracia en Cristo, no simplemente la razón natural.',
    ],
    'JHN.1.12': [
      'Recibir a Jesús se define como creer «en su nombre»: confiar en quién es él. A quienes lo hacen, él les da la potestad (ἐξουσία, autoridad) de ser hechos hijos de Dios (τέκνα θεοῦ). Esa condición es un don, no un derecho de nacimiento; por eso el versículo 13 descarta enseguida como fuente la sangre, el deseo humano y la voluntad de varón. R. Alan Culpepper sostuvo que este versículo es el eje sobre el que gira todo el prólogo.',
    ],
    'JHN.1.14': [
      'El versículo gira en torno a tres verbos. El Verbo fue hecho (ἐγένετο) carne: entró en la humanidad frágil y mortal, no solo en apariencia. Habitó (ἐσκήνωσεν, «plantó su tienda») entre nosotros: el lenguaje del tabernáculo donde moraba la gloria de Dios. Y vimos (ἐθεασάμεθα) su gloria: el testimonio de quienes lo conocieron. Esa gloria es «gloria como del unigénito del Padre», y su carácter es estar «lleno de gracia y de verdad», lo que recuerda el amor y la fidelidad del pacto que Dios proclamó ante Moisés (Éx 34:6).',
    ],
    'JHN.1.16': [
      '«Porque de su plenitud tomamos todos, y gracia por gracia». El griego, χάριν ἀντὶ χάριτος, dice literalmente «gracia por (o en lugar de) gracia», y se ha leído de tres maneras principales: gracia acumulada sobre gracia, un don tras otro (la BSB y la WEB; en castellano, la BLM: «gracia sobre gracia»); la gracia derramada sobre Cristo que fluye hacia los creyentes como por un canal (Calvino); o una gracia nueva que sustituye a la anterior —el generoso don de la ley por medio de Moisés, al que sucede la plenitud de la gracia en Cristo—, lo que encaja con el versículo 17 (D. A. Carson; John Piper). Matthew Henry, que califica la expresión de singular, enumera las tres entre seis sentidos posibles.',
    ],
    'JHN.1.17': [
      'Moisés y Jesucristo aparecen uno junto al otro: «la ley por Moisés fué dada: mas la gracia y la verdad por Jesucristo fué hecha». No es un contraste entre una ley mala y un evangelio bueno —la ley era en sí misma un don de Dios—, sino entre un don que apuntaba hacia adelante y la realidad a la que apuntaba. Y aquí, por primera vez en el Evangelio, el Verbo recibe nombre: Jesucristo.',
    ],
    'JHN.1.18': [
      '«A Dios nadie le vió jamás» recuerda la palabra del SEÑOR a Moisés: «no me verá hombre, y vivirá» (Éx 33:20). Quien puede dar a conocer a Dios es el Hijo único, que es él mismo Dios y está en el seno del Padre. Los manuscritos más antiguos leen μονογενὴς θεός («el único, [él mismo] Dios»); los posteriores, seguidos por la KJV («the only begotten Son»), la WEB («the only born Son») y la RVR1909 («el unigénito Hijo»), leen «Hijo», y el Tyndale House Greek New Testament también lee «Hijo». «En el seno del Padre» traduce literalmente la expresión griega con κόλπος (la BSB dice «at the Father’s side», junto al Padre); Juan usa esa palabra solo una vez más, cuando el discípulo amado «estaba recostado en el seno de Jesús» (13:23).',
    ],
    'JHN.1.21': [
      'La comitiva ofrece a Juan los papeles más esperados antes del fin: Elías (Mal 4:5) y el Profeta semejante a Moisés (Dt 18:15), después de que él ya ha negado ser el Cristo. Él los rechaza todos. Su negativa a ser Elías parece chocar con las palabras de Jesús en Mateo 11:14, pero Juan rechaza la identidad que tenían en mente quienes le preguntaban, mientras que Jesús habla del papel que Juan cumplió «con el espíritu y virtud de Elías» (Lc 1:17).',
    ],
    'JHN.1.29': [
      '«He aquí el Cordero de Dios, que quita el pecado del mundo». El participio αἴρων, «que quita», está en presente: es lo que el Cordero hace. Detrás del título están el Siervo semejante a un cordero de Isaías 53:7 (la Septuaginta usa la misma palabra, ἀμνός), el cordero pascual (Éx 12; Juan 19:36) y los corderos diarios del templo (Éx 29:38–39). «Del mundo» va más allá de Israel: el Cordero se ocupa del pecado de toda la humanidad.',
    ],
    'JHN.1.34': [
      'El testimonio del Bautista alcanza su clímax: «éste es el Hijo de Dios». Algunos manuscritos leen en su lugar «el Escogido de Dios», eco de Isaías 42:1, donde Dios pone su Espíritu sobre su Siervo escogido. El Nuevo Testamento griego de la SBL adopta esa lectura (y las notas de Tyndale la comentan), mientras que la mayoría de las ediciones y la BSB, la KJV y la WEB —como las tres versiones castellanas de este estudio— leen «Hijo».',
    ],
    'JHN.1.51': [
      'El capítulo termina con el primero de los dichos joánicos con doble «De cierto, de cierto» (ἀμὴν ἀμήν). Jesús promete a Natanael —y, con un «veréis» en plural, a todos los discípulos— que verán el cielo abierto y a los ángeles de Dios subiendo y descendiendo sobre el Hijo del hombre. La imagen es la escalera de Jacob en Betel (Gn 28:12): Jesús mismo es el vínculo entre el cielo y la tierra, la verdadera «casa de Dios».',
    ],
  },
  concepts: {
    'john-1:concept:logos': {
      label: 'El Verbo (Logos)',
      aliases: [
        'verbo',
        'el verbo',
        'palabra',
        'la palabra',
        'logos',
        'el logos',
        'palabra de dios',
        'la palabra de dios',
        'verbo de dios',
        'verbo de vida',
        'en el principio era el verbo',
        'palabra griega',
        'palabra griega detrás de verbo',
        'qué palabra griega',
        'dabar',
        'davar',
        'memra',
        'filón',
        'filon',
        'heráclito',
        'heraclito',
        'estoicos',
        'estoico',
        'filosofía griega',
        'filosofia griega',
        'primeros destinatarios',
        'primeros oyentes',
        'primeros lectores',
        'audiencia original',
      ],
      answer:
        'Detrás de «Verbo» está el griego λόγος (logos), la palabra corriente para una palabra, un mensaje o un relato. Para los lectores del Antiguo Testamento griego evocaba la palabra creadora y profética de Dios (en hebreo, dāvār: «Por la palabra de Jehová fueron hechos los cielos», Sal 33:6); los lectores griegos oían en ella el principio racional que sostiene el mundo. Juan retoma ambas cosas y va más allá: este Verbo era con Dios, era Dios y se hizo carne; es la autoexpresión de Dios en una persona (1:1, 14, 18).',
    },
    'john-1:concept:genesis': {
      label: 'En el principio: Juan y el Génesis',
      aliases: [
        'génesis',
        'genesis',
        'génesis 1',
        'genesis 1',
        'el génesis',
        'en el principio',
        'principio',
        'arche',
        'archē',
        'ἀρχή',
        'creación',
        'creacion',
        'creado',
        'creó',
        'nueva creación',
        'nueva creacion',
        'todas las cosas fueron hechas',
        'todas las cosas por él fueron hechas',
        'juan 1 con el génesis',
        'juan 1 y el génesis',
      ],
      answer:
        'Juan comienza con las mismas dos palabras que el Génesis griego, Ἐν ἀρχῇ, «En el principio». Luego vuelve a contar la creación: todas las cosas fueron hechas por medio del Verbo (1:3), y la vida y la luz resplandecen en las tinieblas (1:4–5; compárese Gn 1:3). La diferencia está en el verbo: en el Génesis, Dios «crió»; en Juan, el Verbo ya «era». Aquel por medio del cual el mundo fue hecho trae ahora una nueva creación y hace de las personas hijos de Dios (1:12–13).',
    },
    'john-1:concept:deity': {
      label: '«El Verbo era Dios»',
      aliases: [
        'el verbo era dios',
        'verbo era dios',
        'la palabra era dios',
        'deidad',
        'deidad de cristo',
        'divinidad de cristo',
        'divinidad de jesús',
        'divinidad de jesus',
        'jesús es dios',
        'jesus es dios',
        'es jesús dios',
        'es jesus dios',
        'un dios',
        'theos',
        'θεός',
        'con dios',
        'era con dios',
        'trinidad',
        'arrio',
        'arriano',
        'arrianismo',
        'nicea',
        'credo niceno',
        'niceno',
        'cristología',
        'cristologia',
        'cristológico',
        'quién es jesús',
        'quien es jesus',
        'quién era jesús',
        'quien era jesus',
        'preexistencia',
      ],
      answer:
        'Juan 1:1 dice a la vez que el Verbo «era con Dios» —distinto del Padre— y que «era Dios». En griego, θεός va en primer lugar y sin artículo, lo que subraya lo que el Verbo es: tiene la naturaleza misma de Dios, sin ser idéntico al Padre. El versículo 3 lo sitúa del lado del Creador frente a todo lo que fue hecho; por eso la iglesia del siglo IV, respondiendo a Arrio, confesó al Hijo como engendrado, no creado.',
    },
    'john-1:concept:incarnation': {
      label: 'El Verbo se hizo carne',
      aliases: [
        'encarnación',
        'encarnacion',
        'se hizo carne',
        'hecho carne',
        'fue hecho carne',
        'fué hecho carne',
        'el verbo se hizo carne',
        'aquel verbo fue hecho carne',
        'carne',
        'sarx',
        'σάρξ',
        'navidad',
        'humano',
        'humanidad de jesús',
        'humanidad de jesus',
        'versículo 14',
        'versiculo 14',
        'explicar el versículo 14',
      ],
      answer:
        '«Aquel Verbo fué hecho carne» (1:14) significa que el Verbo eterno entró en una vida humana completa —«carne» en el sentido bíblico de humanidad frágil y mortal— sin dejar de ser Dios. Crisóstomo subrayó que el Verbo no se transformó en carne, sino que tomó la carne para sí; Agustín advirtió que eso era precisamente lo que los filósofos no podían decir. Juan añade, con la voz de quienes lo conocieron: «vimos su gloria».',
    },
    'john-1:concept:tabernacle': {
      label: 'Morada y gloria: el tabernáculo',
      aliases: [
        'habitó',
        'habito',
        'habitó entre nosotros',
        'habito entre nosotros',
        'vivió entre nosotros',
        'morada',
        'morar',
        'tabernáculo',
        'tabernaculo',
        'plantó su tienda',
        'planto su tienda',
        'tienda',
        'skenoo',
        'skēnoō',
        'σκηνόω',
        'gloria',
        'doxa',
        'δόξα',
        'shekiná',
        'shekina',
        'shekinah',
        'templo',
      ],
      answer:
        '«Habitó» traduce σκηνόω, «plantar una tienda», de σκηνή, la palabra griega para el tabernáculo. Juan recuerda la tienda donde Dios vivía en medio de Israel y cuya gloria llenaba el santuario (Éx 25:8; 40:34–35); por eso añade enseguida: «vimos su gloria». La presencia de Dios, antes centrada en el tabernáculo y el templo, se encuentra ahora en Jesús (compárese 2:19–21).',
    },
    'john-1:concept:monogenes': {
      label: 'Unigénito / único',
      aliases: [
        'unigénito',
        'unigenito',
        'el unigénito',
        'hijo unigénito',
        'hijo unigenito',
        'unigénito hijo',
        'hijo único',
        'hijo unico',
        'único',
        'unico',
        'monogenes',
        'monogenēs',
        'μονογενής',
        'engendrado',
        'generación eterna',
        'generacion eterna',
        'engendrado no creado',
        'engendrado no hecho',
      ],
      answer:
        'La palabra griega es μονογενής (monogenēs), usada de un hijo único (Lc 7:12) y de Isaac como hijo singular de Abraham (Heb 11:17). La KJV, siguiendo el latín, dice «only begotten», como la RVR1909 («unigénito»); la BSB dice «one and only», es decir, «único». Desde Dale Moody (1953), muchos la han entendido como «único», mientras que estudiosos recientes como Charles Lee Irons defienden «unigénito». Ambas partes afirman que Jesús es el Hijo en un sentido único y plenamente Dios; en 1:18 los manuscritos más antiguos llegan a llamarlo «el único, [él mismo] Dios».',
    },
    'john-1:concept:light': {
      label: 'Luz y tinieblas',
      aliases: [
        'luz',
        'tinieblas',
        'oscuridad',
        'phos',
        'phōs',
        'φῶς',
        'skotia',
        'σκοτία',
        'luz verdadera',
        'la luz verdadera',
        'luz de los hombres',
        'vencer',
        'vencido',
        'no la han vencido',
        'comprender',
        'comprendieron',
        'no la comprendieron',
        'katalambano',
        'katalambanō',
        'καταλαμβάνω',
        'versículo 5',
        'versiculo 5',
      ],
      answer:
        'El Verbo de Juan es vida y «la luz de los hombres» (1:4), eco de la primera palabra creadora de Dios: «Sea la luz». La Luz sigue resplandeciendo en unas tinieblas que no la han vencido (BLM) o que «no la comprendieron» (RVR1909): el verbo καταλαμβάνω puede significar ambas cosas. El único otro uso de Juan (12:35, aparte del discutido 8:3–4) es hostil, lo que encaja con la traducción «vencer» (BSB, WEB, BLM); el panel de perspectivas expone ambas lecturas.',
    },
    'john-1:concept:grace-truth': {
      label: 'Gracia y verdad',
      aliases: [
        'gracia',
        'gracia y verdad',
        'gracia y de verdad',
        'gracia sobre gracia',
        'gracia por gracia',
        'charis',
        'χάρις',
        'verdad',
        'aletheia',
        'ἀλήθεια',
        'plenitud',
        'ley',
        'moisés',
        'moises',
        'hesed',
        'jésed',
        'jesed',
        'benignidad',
        'amor leal',
        'versículo 16',
        'versiculo 16',
        'versículo 17',
        'versiculo 17',
      ],
      answer:
        'χάρις (gracia) aparece en el Evangelio de Juan solo en el prólogo (1:14, 16, 17). «Lleno de gracia y de verdad» recuerda la descripción que Dios hizo de sí mismo ante Moisés: «grande en benignidad y verdad» (Éx 34:6). En 1:16, «gracia por gracia» se ha leído como gracia acumulada sobre gracia, como la gracia que nos llega desde la gracia derramada sobre Cristo (Calvino) o como la gracia de Cristo que sucede a la gracia de la ley dada por medio de Moisés (Carson, Piper), lo que encaja con 1:17. Matthew Henry enumera las tres entre seis sentidos posibles.',
    },
    'john-1:concept:revelation': {
      label: 'El Hijo da a conocer a Dios',
      aliases: [
        'le declaró',
        'le declaro',
        'lo ha declarado',
        'lo dio a conocer',
        'dar a conocer',
        'declaró',
        'exégesis',
        'exegesis',
        'exegeomai',
        'exēgeomai',
        'ἐξηγέομαι',
        'nadie ha visto a dios',
        'a dios nadie le vio jamás',
        'a dios nadie le vió jamás',
        'ver a dios',
        'seno del padre',
        'en el seno del padre',
        'versículo 18',
        'versiculo 18',
        'revelación',
        'revelacion',
      ],
      answer:
        '«A Dios nadie le vió jamás: el unigénito Hijo, que está en el seno del Padre, él le declaró» (1:18). En otros pasajes, el verbo ἐξηγέομαι significa contar o narrar; aquí su complemento es Dios. Moisés no pudo ver el rostro de Dios (Éx 33:20), pero el Hijo, que está en el seno del Padre, ha narrado a Dios en una vida humana; por eso Jesús podrá decir más tarde: «El que me ha visto, ha visto al Padre» (14:9).',
    },
    'john-1:concept:lamb': {
      label: 'El Cordero de Dios',
      aliases: [
        'cordero',
        'cordero de dios',
        'el cordero de dios',
        'amnos',
        'ἀμνός',
        'pascua',
        'cordero pascual',
        'sacrificio',
        'quita el pecado',
        'que quita el pecado',
        'pecado del mundo',
        'expiación',
        'expiacion',
        'versículo 29',
        'versiculo 29',
      ],
      answer:
        '«He aquí el Cordero de Dios, que quita el pecado del mundo» (1:29). La palabra ἀμνός vincula a Jesús con el Siervo mudo, semejante a un cordero, de Isaías 53:7 y con los corderos diarios del templo; el Evangelio de Juan enmarca además su muerte en la Pascua (19:14, 36). El Cordero pertenece a Dios, y quita el pecado no solo de Israel, sino del mundo.',
    },
    'john-1:concept:baptist': {
      label: 'Juan el Bautista y el testimonio',
      aliases: [
        'juan el bautista',
        'juan bautista',
        'el bautista',
        'bautista',
        'testigo',
        'testimonio',
        'dar testimonio',
        'testificar',
        'testificó',
        'voz en el desierto',
        'voz que clama en el desierto',
        'la voz del que clama',
        'elías',
        'elias',
        'el profeta',
        'eres tú elías',
        'eres tu elias',
        'bautizar',
        'bautismo',
        'paloma',
        'el espíritu que desciende',
        'venid y ved',
        'ven y ve',
      ],
      answer:
        'Juan el Bautista se presenta ante todo como testigo: «No era él la luz, sino para que diese testimonio de la luz» (1:8). Rechaza todos los títulos que se le ofrecen —el Cristo, Elías, el profeta— y se llama a sí mismo solo «la voz del que clama en el desierto» (1:23; Is 40:3), y señala a Jesús como el Cordero de Dios y el Hijo de Dios sobre quien reposa el Espíritu (1:29–34). Josefo confirma lo conocido que era Juan, y Hechos 19 sugiere que su movimiento le sobrevivió.',
    },
    'john-1:concept:children': {
      label: 'Hijos de Dios y nuevo nacimiento',
      aliases: [
        'hijos de dios',
        'nacidos de dios',
        'engendrados de dios',
        'nuevo nacimiento',
        'nacer de nuevo',
        'nacido de nuevo',
        'adopción',
        'adopcion',
        'potestad de ser hechos hijos',
        'derecho de ser hijos',
        'los que le recibieron',
        'le recibieron',
        'creen en su nombre',
        'creer en su nombre',
        'versículo 12',
        'versiculo 12',
        'versículo 13',
        'versiculo 13',
      ],
      answer:
        'A todos los que reciben al Verbo —a los que creen en su nombre— les da potestad de ser hechos hijos de Dios, engendrados no por descendencia ni por decisión humana, sino por Dios (1:12–13). R. Alan Culpepper sostuvo que este es el eje del prólogo. Crisóstomo vio aquí el propósito de la encarnación: el Hijo de Dios se hizo Hijo del hombre para hacer hijos de Dios a los hijos de los hombres.',
    },
  },
};

export default overlay;
