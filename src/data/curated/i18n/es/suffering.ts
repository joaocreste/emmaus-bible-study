/**
 * Spanish overlay for the curated study “Suffering” (2 Corinthians 4:7–18).
 * Translated from the English module; references, citations, lexical data and verified
 * quotations are unchanged (quotations get a labelled free translation only).
 */
import type { StudyOverlay } from '../types';

const overlay: StudyOverlay = {
  studyId: 'suffering',
  locale: 'es',
  title: 'El sufrimiento',
  subtitle: '¿Por qué permite Dios el sufrimiento?',
  summary:
    'Este estudio plantea la pregunta difícil más antigua de la fe —por qué un Dios bueno y poderoso permite el sufrimiento— y la ancla en 2 Corintios 4:7–18, donde Pablo, atribulado por todas partes, habla de un tesoro en vasos de barro y de una tribulación leve y momentánea que produce un eterno peso de gloria. En torno a ese pasaje reúne el testimonio más amplio de la Biblia: la caída y una creación que gime, los salmos de lamento y Job, el rechazo a equiparar el sufrimiento con el castigo, el Dios que en Cristo entra en el sufrimiento humano y la promesa de un mundo sin lágrimas. También expone cómo han respondido al problema del mal los pensadores cristianos —desde Ireneo y Agustín hasta las tradiciones reformada, católica, wesleyana y ortodoxa y los filósofos modernos—, en qué coinciden y en qué difieren.',
  opening:
    'Pocas preguntas pesan tanto como esta, y la Biblia no pasa de largo ante ella. Anclaremos el estudio en 2 Corintios 4, donde Pablo escribe como alguien sometido a una presión real y, sin embargo, no aplastado; después seguiremos la respuesta bíblica más amplia: el lamento sincero, el misterio de Job, la cruz y la esperanza de un mundo sin lágrimas. Cabe preguntar por cualquier versículo, por cualquier palabra o por la manera en que los cristianos han luchado con el problema del mal.',
  matchTopics: [
    'sufrimiento',
    'el sufrimiento',
    'sufrir',
    'por qué dios permite el sufrimiento',
    'por qué dios permite el mal',
    'por qué permite dios el sufrimiento',
    'el problema del mal',
    'problema del mal',
    'problema del dolor',
    'teodicea',
    'dolor',
    'el mal',
    'pruebas',
    'aflicción',
    'aflicciones',
    'tribulación',
    'padecimiento',
    'lamento',
    'duelo',
    'dificultades',
    'vasos de barro',
    '2 corintios 4',
  ],
  suggestedQuestions: [
    '¿Por qué permite Dios el sufrimiento?',
    '¿Qué quiere decir Pablo con “vasos de barro”?',
    '¿Qué palabra griega hay detrás de “tribulación”?',
    '¿Qué dijo Tim Keller sobre el sufrimiento?',
    '¿Cómo lo habrían entendido los primeros destinatarios?',
    '¿En qué otros lugares habla Pablo del sufrimiento?',
    '¿Qué relación tiene esto con Romanos?',
    'Explicar el versículo 17 con más detalle.',
    '¿Hay distintas interpretaciones teológicas del problema del mal?',
  ],
  topic: {
    name: 'El sufrimiento',
    question: '¿Por qué permite Dios el sufrimiento?',
    definition:
      'La Escritura no da una respuesta única y ordenada a por qué Dios permite el sufrimiento. Ofrece, más bien, un conjunto de verdades que hay que sostener juntas. Dios es bueno y soberano, y sin embargo el mal es real y nunca es simplemente bueno: el pecado y la muerte entraron en el buen mundo de Dios por la rebelión humana, y ahora toda la creación gime (Gn 3; Ro 5:12; 8:20–22). El sufrimiento no siempre es castigo por un pecado concreto (Job; Jn 9; Lc 13). Dios acoge el lamento sincero: el clamor repetido del salmista, ¿hasta cuándo?, es en sí mismo una oración de fe (Sal 13). Dios no se ha quedado a distancia: en Cristo entró en el dolor humano, fue desamparado en la cruz y resucitó (Is 53; Mc 15:34). En sus manos, la aflicción puede refinar la fe e incluso obrar para gloria (Gn 50:20; Ro 5:3–5; 2 Co 4:17). Y la historia termina con Dios mismo enjugando toda lágrima (Ap 21:3–5).',
  },
  topicPassages: {
    'suffering:kp:gen-3-16': {
      title: 'Dolor, fatiga y polvo',
      group: 'El sufrimiento y la caída',
      note: 'Tras la primera rebelión, el dolor entra en el parto, la tierra queda maldita, el trabajo se convierte en fatiga y al hombre se le dice que volverá al polvo. La Escritura remonta el quebranto del mundo —incluido mucho sufrimiento que nadie eligió personalmente— a este primer alejamiento de Dios.',
    },
    'suffering:kp:rom-8-20': {
      title: 'Una creación que gime con esperanza',
      group: 'El sufrimiento y la caída',
      note: 'Pablo dice que la creación fue sujetada a vanidad y a la servidumbre de corrupción, pero “con esperanza”, y describe su gemido como dolores de parto. El sufrimiento en el mundo natural es real, pero es un parto que conduce a un nuevo nacimiento, no un final sin sentido.',
    },
    'suffering:kp:psa-13': {
      title: '¿Hasta cuándo, SEÑOR?',
      group: 'El lamento y la fe sincera',
      note: 'Cuatro veces en dos versículos pregunta David hasta cuándo: hasta cuándo lo olvidará Dios y esconderá de él su rostro, hasta cuándo tendrá que luchar con la tristeza, hasta cuándo triunfará su enemigo. Sin embargo, el breve salmo termina en confianza y canto. El lamento no es un desliz de la fe; es la fe que lleva su queja al único que puede responder.',
    },
    'suffering:kp:psa-88': {
      title: 'Un lamento que termina en tinieblas',
      group: 'El lamento y la fe sincera',
      note: 'El Salmo 88 es inusual: se cierra sin un giro hacia la alabanza, y su última palabra es tiniebla. Aun así, de principio a fin se dirige al Dios de mi salvación (88:1). Su lugar en la Escritura da a quienes sufren permiso para orar aunque todavía no haya llegado ningún alivio.',
    },
    'suffering:kp:lam-3-19': {
      title: 'Misericordias nuevas entre las ruinas',
      group: 'El lamento y la fe sincera',
      note: 'Escrito entre los escombros de Jerusalén, el poeta recuerda su aflicción y luego trae deliberadamente a la memoria el amor inquebrantable de Dios y sus misericordias, que son nuevas cada mañana. El pasaje termina con una afirmación sorprendente sobre el corazón de Dios: no aflige por gusto (3:33).',
    },
    'suffering:kp:hab-1-2': {
      title: '¿Por qué toleras la maldad?',
      group: 'El lamento y la fe sincera',
      note: 'Habacuc comienza con la misma pregunta del Salmo 13, ¿hasta cuándo?, ahora sobre la injusticia en la sociedad: violencia, una ley paralizada y una justicia torcida. La queja del profeta se convierte en el comienzo de un diálogo con Dios, no en el final de la fe.',
    },
    'suffering:kp:hab-3-17': {
      title: 'Gozo cuando la higuera no florece',
      group: 'El lamento y la fe sincera',
      note: 'Al final del libro el profeta sigue esperando el día de la angustia (3:16) y afronta la perspectiva de una pérdida total —sin fruto, sin cosechas, sin rebaños—; aun así, Habacuc decide alegrarse en el Dios de su salvación. Es una de las imágenes más claras de la Escritura de una fe que ya no depende de las circunstancias.',
    },
    'suffering:kp:job-1-20': {
      title: 'El SEÑOR dio, y el SEÑOR quitó',
      group: 'Job: el sufrimiento y el misterio',
      note: 'Después de perder a sus hijos y sus bienes, Job rasga su manto, cae en tierra… y adora. El narrador añade que no pecó ni atribuyó a Dios despropósito alguno. Aquí el duelo y la adoración no son opuestos; suceden en un mismo acto.',
    },
    'suffering:kp:job-38-1': {
      title: 'La respuesta desde el torbellino',
      group: 'Job: el sufrimiento y el misterio',
      note: 'Cuando por fin habla Dios, no explica la escena celestial de los capítulos 1–2. Pregunta a Job dónde estaba cuando se fundó la tierra. Las notas de Tyndale observan que el libro no explica el sufrimiento; muestra a Dios rechazando las explicaciones fáciles mientras llama a Job a confiar en su sabiduría.',
    },
    'suffering:kp:job-42-1': {
      title: 'Ahora mis ojos te ven',
      group: 'Job: el sufrimiento y el misterio',
      note: 'Job no recibe una lista de razones, pero recibe a Dios mismo: había oído hablar de él, y ahora lo ve. El libro sugiere que lo que más necesita quien sufre no es una explicación, sino un encuentro.',
    },
    'suffering:kp:gen-50-20': {
      title: 'Ustedes pensaron mal; Dios lo encaminó a bien',
      group: 'Los propósitos de Dios en el dolor',
      note: 'José llama mal al acto de sus hermanos y, en la misma frase, dice que Dios lo encaminó a bien, para preservar la vida de mucha gente. El versículo mantiene juntas la culpa humana y el propósito divino sin dejar que una anule al otro.',
    },
    'suffering:kp:rom-5-3': {
      title: 'La tribulación produce paciencia',
      group: 'Los propósitos de Dios en el dolor',
      note: 'Pablo traza una cadena: tribulación, paciencia, carácter probado, esperanza; y una esperanza que no avergüenza, porque el amor de Dios ha sido derramado en nuestros corazones por el Espíritu. Lo bueno no está en el dolor mismo, sino en lo que Dios obra por medio de él.',
    },
    'suffering:kp:heb-12-5': {
      title: 'La disciplina de un Padre',
      group: 'Los propósitos de Dios en el dolor',
      note: 'Hebreos interpreta algunas dificultades como la formación que un padre amoroso da a sus hijos: dolorosa en el momento, pero que después da fruto de justicia y de paz. El pasaje no dice que toda prueba sea disciplina por una falta concreta; sitúa la perseverancia en el marco de la filiación.',
    },
    'suffering:kp:2co-12-7': {
      title: 'El poder que se perfecciona en la debilidad',
      group: 'Los propósitos de Dios en el dolor',
      note: 'Tres veces pidió Pablo que se le quitara el aguijón en la carne; la respuesta fue una gracia suficiente para él. No sabemos qué era el aguijón, pero sí lo que le enseñó: el poder de Cristo reposa sobre los débiles.',
    },
    'suffering:kp:jhn-9-1': {
      title: '¿Quién pecó?',
      group: 'No siempre es castigo',
      note: 'Los discípulos dan por hecho que la ceguera de un hombre tiene que ser culpa de alguien. Jesús rechaza ambas opciones y señala, en cambio, lo que Dios va a manifestar en él. La Escritura se niega a la ecuación simple según la cual el sufrimiento siempre equivale a culpa personal.',
    },
    'suffering:kp:luk-13-1': {
      title: 'La torre de Siloé',
      group: 'No siempre es castigo',
      note: 'Cuando le hablan de las víctimas de la violencia de Pilato, y añadiendo su propio ejemplo de una torre que se derrumbó, Jesús niega que fueran más pecadores que los demás; luego convierte la pregunta en un llamado: todos necesitan arrepentirse. La tragedia no es un veredicto sobre sus víctimas, pero sí un recordatorio de que todos necesitamos a Dios.',
    },
    'suffering:kp:isa-53-3': {
      title: 'Varón de dolores',
      group: 'Dios con nosotros en el sufrimiento: Cristo',
      note: 'El Siervo está familiarizado con el quebranto, carga con nuestros dolores y es molido por nuestros pecados. El Nuevo Testamento aplica este cántico a Jesús (por ejemplo, 1 P 2:24): el Dios de la Biblia responde al sufrimiento no desde la distancia, sino cargándolo.',
    },
    'suffering:kp:mrk-15-34': {
      title: 'Dios mío, ¿por qué me has desamparado?',
      group: 'Dios con nosotros en el sufrimiento: Cristo',
      note: 'En la cruz Jesús ora con el primer verso del Salmo 22, un lamento. El Hijo de Dios mismo pregunta por qué. Los cristianos han encontrado aquí desde antiguo tanto la hondura de lo que Cristo cargó como el permiso para llevar a Dios su propio porqué.',
    },
    'suffering:kp:heb-4-15': {
      title: 'Un sumo sacerdote que se compadece',
      group: 'Dios con nosotros en el sufrimiento: Cristo',
      note: 'Porque Jesús fue tentado en todo según nuestra semejanza, puede compadecerse de nuestras debilidades. Quien sufre ora a alguien que conoce el dolor desde dentro.',
    },
    'suffering:kp:rev-21-3': {
      title: 'Ya no habrá muerte ni llanto',
      group: 'La esperanza final',
      note: 'La última palabra de la Biblia sobre el sufrimiento no es una explicación, sino un final: Dios habitando con su pueblo, toda lágrima enjugada, la muerte y el dolor desaparecidos, todas las cosas hechas nuevas. El sufrimiento presente es real, pero no es permanente.',
    },
  },
  keyWords: {
    'suffering:kw:thlipsis': {
      english: 'tribulación (aflicción)',
      basicMeaning: 'presión; (en sentido figurado) aflicción, tribulación, angustia',
      semanticRange: ['presión (sentido literal)', 'aflicción', 'tribulación', 'angustia'],
      grammar: 'Sustantivo, genitivo singular femenino',
      significance:
        'Según nuestro recuento en el Nuevo Testamento griego etiquetado de STEPBible, θλῖψις aparece 45 veces, y 2 Corintios la usa más que ningún otro libro (9): es una carta escrita bajo presión. En 4:17 Pablo llama a esta tribulación leve y momentánea, no porque sea trivial (4:8–9 y 11:23–29 muestran lo contrario), sino porque la está poniendo en la balanza frente a un eterno peso de gloria. El verbo emparentado θλίβω abre la lista de dificultades de 4:8 (atribulados), de modo que la lista comienza con la presión (4:8) y la conclusión vuelve a nombrarla (4:17).',
      caution:
        'El sentido literal que da el léxico es presión, pero eso no significa que cada uso evoque una imagen vívida de aplastamiento. En el Nuevo Testamento la palabra se usa en sentido figurado para la aflicción y la angustia; es el contexto, no la etimología, el que decide el matiz.',
      notableNotes: [
        'La carta comienza con el Dios que nos consuela en todas nuestras tribulaciones; la palabra aparece dos veces en este versículo.',
        'La tribulación que Pablo sufrió en la provincia de Asia, tan grave que perdió la esperanza de conservar la vida.',
        'Aparece dos veces: los creyentes se glorían en las tribulaciones porque la tribulación produce paciencia.',
        'Jesús advierte que sus seguidores tendrán aflicción en el mundo, y les asegura que él ha vencido al mundo.',
        'La discutida expresión sobre lo que falta de las aflicciones de Cristo.',
      ],
      anchors: [
        {
          verse: { book: '2CO', chapter: 4, verse: 17 },
          phrases: { RVR1909: 'tribulación', BLM: 'aflicción', VBL: 'tribulaciones' },
        },
      ],
    },
    'suffering:kw:ostrakinos': {
      english: 'vasos de barro (de barro, de arcilla)',
      basicMeaning: 'hecho de barro, de arcilla',
      semanticRange: ['hecho de barro', 'de arcilla, de loza'],
      grammar: 'Adjetivo, dativo plural neutro (con σκεῦος, “vaso”, G4632)',
      significance:
        'El adjetivo procede de ὄστρακον, vasija de barro o tiesto, y aparece solo dos veces en el Nuevo Testamento (2 Co 4:7; 2 Ti 2:20). La imagen de Pablo coloca el tesoro inestimable de 4:6 —la luz del conocimiento de la gloria de Dios en el rostro de Cristo— dentro de algo barato y frágil: su cuerpo mortal y su ministerio maltrecho. El sentido se dice en el mismo versículo: para que se vea que la extraordinaria grandeza del poder es de Dios y no de nosotros. La debilidad no es una vergüenza para el evangelio; es el lugar donde el poder de Dios se hace visible.',
      caution:
        'La vasija es una metáfora de la fragilidad y la condición ordinaria del ser humano, no una afirmación de que el cuerpo no vale nada. Pablo espera que el cuerpo mismo sea resucitado (4:14).',
      notableNotes: [
        'El único otro uso en el Nuevo Testamento: en una casa grande hay utensilios de oro y de plata, y también de madera y de barro.',
        'No es la misma palabra, sino su raíz: en el Antiguo Testamento griego, Job se rasca las llagas con un ὄστρακον, un tiesto.',
      ],
      anchors: [
        {
          verse: { book: '2CO', chapter: 4, verse: 7 },
          phrases: { RVR1909: 'vasos de barro', BLM: 'vasos de barro', VBL: 'vasijas de barro' },
        },
      ],
    },
    'suffering:kw:exaporeo': {
      english: 'desesperar',
      basicMeaning: 'no saber en absoluto qué hacer, estar desesperado',
      semanticRange: ['estar completamente sin salida', 'estar desesperado'],
      grammar: 'Verbo, participio presente medio/pasivo (deponente), nominativo plural masculino',
      significance:
        'En 4:8 Pablo juega con dos verbos emparentados: ἀπορούμενοι (perplejos, sin saber qué hacer), pero no ἐξαπορούμενοι (completamente sin salida, desesperados). El prefijo intensifica la palabra, y el juego de palabras se oye en griego. El verbo aparece solo dos veces en el Nuevo Testamento: aquí y en 1:8, donde Pablo reconoce que en Asia llegaron a perder la esperanza de conservar la vida. Leídos juntos, estos versículos sugieren que el “no desesperamos” de 4:8 no es la pretensión de una calma inalterable, sino el testimonio de que la desesperación no tuvo la última palabra, porque aprendieron a confiar en el Dios que resucita a los muertos (1:9).',
      caution:
        'El juego de palabras es claro en griego, pero las traducciones no pueden reproducirlo; no se debe construir una doctrina solo sobre el prefijo.',
      notableNotes: [
        'El único otro uso en el Nuevo Testamento: Pablo admite que en Asia perdieron incluso la esperanza de vivir.',
        'El Antiguo Testamento griego usa este verbo en la queja del salmista: estoy desesperado.',
      ],
      anchors: [
        {
          verse: { book: '2CO', chapter: 4, verse: 8 },
          phrases: { RVR1909: 'desesperamos', BLM: 'desesperados', VBL: 'desesperados' },
        },
      ],
    },
    'suffering:kw:nekrosis': {
      english: 'muerte (el morir)',
      basicMeaning: 'acción de dar muerte; estado de muerte',
      semanticRange: ['acción de dar muerte', 'estado de muerte, condición de muerto'],
      grammar: 'Sustantivo, acusativo singular femenino',
      significance:
        'Pablo no usa aquí la palabra corriente para muerte (θάνατος), sino la más rara νέκρωσις, que el léxico traduce como acción de dar muerte o estado de muerte. Sugiere un proceso —el morir diario de un cuerpo desgastado por la persecución— que Pablo lleva consigo como marca de la propia muerte de Jesús. La cláusula de finalidad importa tanto como lo anterior: para que también la vida de Jesús se manifieste en nuestro cuerpo. Calvino tradujo la palabra por mortificatio, y una nota de la edición de la Calvin Translation Society cita a Beza, que usó la misma traducción, y explica que aquí no describe la muerte misma, sino una condición expuesta a la muerte cada día.',
      caution:
        'Pablo no dice que sus sufrimientos expíen el pecado. Comparte la forma de la muerte de Cristo, no su obra salvadora única.',
      notableNotes: [
        'El único otro uso en el Nuevo Testamento: el estado de muerte (la esterilidad) de la matriz de Sara, del cual Dios hizo brotar vida.',
      ],
      anchors: [
        {
          verse: { book: '2CO', chapter: 4, verse: 10 },
          phrases: { RVR1909: 'muerte', BLM: 'muerte', VBL: 'muerte' },
        },
      ],
    },
    'suffering:kw:ekkakeo': {
      english: 'desanimarse (desmayar)',
      basicMeaning: 'desanimarse, perder el ánimo',
      semanticRange: ['perder el ánimo', 'desalentarse', 'cansarse (de hacer el bien)'],
      grammar:
        'Verbo, presente activo de indicativo, primera persona del plural (ἐγκακοῦμεν en el texto de Nestle-Aland; ἐκκακοῦμεν en el Textus Receptus)',
      significance:
        'Según nuestro recuento, el verbo aparece seis veces en el Nuevo Testamento, dos de ellas en este capítulo (4:1, 4:16). Los dos usos enmarcan la mayor parte del capítulo: Pablo no desmaya gracias a la misericordia que le dio su ministerio (4:1), y no desmaya porque el hombre interior se renueva de día en día (4:16). En otros lugares describe el cansarse de hacer el bien (Gá 6:9; 2 Ts 3:13) o el desanimarse por los sufrimientos de un apóstol (Ef 3:13), y Lucas 18:1 lo une a la oración: un indicio de dónde se renueva el ánimo.',
      caution:
        'Los léxicos antiguos relacionan la palabra con κακός (“cobarde”), pero es el uso, no la etimología, el que decide el significado: en el Nuevo Testamento significa desanimarse o cansarse, no específicamente acobardarse.',
      notableNotes: [
        'El capítulo comienza con las mismas palabras: no desmayamos.',
        'Jesús cuenta una parábola para enseñar a orar con perseverancia en lugar de desanimarse.',
        'Pablo exhorta a los creyentes a no cansarse de hacer el bien, porque se acerca la cosecha.',
      ],
      anchors: [
        {
          verse: { book: '2CO', chapter: 4, verse: 16 },
          phrases: { RVR1909: 'desmayamos', BLM: 'desmayamos', VBL: 'nos rendimos' },
        },
      ],
    },
    'suffering:kw:baros': {
      english: 'peso',
      basicMeaning: 'peso, carga',
      semanticRange: ['peso', 'carga', 'dignidad, autoridad (en griego posterior)'],
      grammar: 'Sustantivo, acusativo singular neutro',
      significance:
        'Pablo establece un contrapeso deliberado: ἐλαφρόν, la levedad de la tribulación presente, frente a βάρος, un eterno peso de gloria, y acumula la expresión καθ᾽ ὑπερβολὴν εἰς ὑπερβολήν (literalmente, de exceso en exceso). Una antigua línea de interpretación, citada en una nota de la edición de la Calvin Translation Society a partir del lexicógrafo del siglo XVIII John Parkhurst, percibe aquí un eco hebreo: la palabra para gloria, כָּבוֹד (kavod, H3519), está relacionada con el verbo כָּבֵד (H3513), cuyo campo de sentido incluye tanto ser pesado como ser honrado. El léxico señala un pasaje del Antiguo Testamento griego en el que βάρος traduce esta raíz hebrea (Jue 18:21). La sugerencia es atractiva —la gloria como el verdadero peso de la realidad—, pero Pablo no la explicita.',
      caution:
        'La conexión con kavod es una propuesta, no una certeza: Pablo escribió en griego y no señala ningún juego de palabras hebreo. Conviene tratarla como una posibilidad esclarecedora, no como la clave del versículo.',
      notableNotes: [
        'Los creyentes deben llevar las cargas los unos de los otros; aquí la palabra designa un peso que agobia a la persona.',
        'El concilio de Jerusalén resuelve no imponer a los creyentes gentiles ninguna carga más allá de lo indispensable.',
      ],
      anchors: [
        {
          verse: { book: '2CO', chapter: 4, verse: 17 },
          phrases: { RVR1909: 'peso', BLM: 'peso' },
        },
      ],
    },
    'suffering:kw:pascho': {
      english: 'padecer (sufrir)',
      basicMeaning: 'sufrir, padecer; ser objeto de una acción',
      semanticRange: ['sufrir (desgracia, dolor)', 'experimentar, ser objeto de una acción'],
      grammar: 'Verbo, participio presente activo, nominativo plural masculino (en 1 P 4:19)',
      significance:
        'El verbo básico del Nuevo Testamento para sufrir no aparece en 2 Corintios 4, pero enmarca el tema. Según nuestro recuento aparece 42 veces, y 1 Pedro lo usa más que ningún otro libro (12 veces): es una carta a creyentes dispersos que afrontan hostilidad. El léxico señala su sentido básico de ser objeto de una acción más que actuar: el sufrimiento es lo que nos sucede. Los Evangelios lo usan para la necesidad del sufrimiento del Mesías (Lc 24:26), y 1 Pedro 4:19 pide a los que padecen según la voluntad de Dios que encomienden sus almas al fiel Creador.',
      notableNotes: [
        'Jesús resucitado explica que era necesario que el Mesías padeciera antes de entrar en su gloria.',
        'Aun el Hijo aprendió la obediencia por lo que padeció.',
        'El sufrir por Cristo se describe como algo concedido a los creyentes, junto con la fe misma.',
        'En 2 Corintios Pablo habla de que los corintios soportan los mismos sufrimientos que él padece.',
      ],
      anchors: [
        {
          verse: { book: '1PE', chapter: 4, verse: 19 },
          phrases: { RVR1909: 'afligidos', BLM: 'sufren', VBL: 'sufren' },
        },
      ],
    },
    'suffering:kw:oni': {
      english: 'aflicción',
      basicMeaning: 'aflicción, pobreza, miseria',
      semanticRange: ['aflicción', 'pobreza', 'miseria'],
      grammar: 'Sustantivo común masculino singular en estado constructo, con sufijo de primera persona (mi aflicción)',
      significance:
        'Según nuestro recuento en el texto hebreo etiquetado de STEPBible, עֳנִי aparece 36 veces, sobre todo en los Salmos (10), Job (6) y Lamentaciones (5). Su campo de sentido va de la aflicción a la pobreza y la miseria, y con frecuencia es algo que Dios ve: la historia del éxodo comienza con el SEÑOR diciendo que ha visto la aflicción de su pueblo (Éx 3:7). En Lamentaciones 3:19 el poeta pide a Dios que se acuerde de su aflicción, y pocos versículos después recuerda las misericordias de Dios (3:21–23). La misma palabra que nombra el sufrimiento pasa a formar parte del culto de Israel, en el pan de aflicción de la Pascua.',
      notableNotes: [
        'En la zarza ardiente Dios le dice a Moisés que ha visto la aflicción de su pueblo en Egipto.',
        'El pan sin levadura de la Pascua se llama pan de aflicción, y se come en memoria de Egipto.',
        'Dios habla de probar a su pueblo en el horno de la aflicción.',
        'El salmista halla consuelo en la aflicción en la promesa vivificadora de Dios.',
        'Eliú afirma que Dios libra al afligido por medio de su misma aflicción.',
      ],
      anchors: [
        {
          verse: { book: 'LAM', chapter: 3, verse: 19 },
          phrases: { RVR1909: 'aflicción', BLM: 'aflicción', VBL: 'lo que he sufrido' },
        },
      ],
    },
    'suffering:kw:an': {
      english: 'hasta cuándo',
      basicMeaning: '¿dónde?, ¿adónde?; (de tiempo) ¿cuándo?, ¿hasta cuándo?',
      semanticRange: ['¿dónde?, ¿adónde? (de lugar)', '¿cuándo?, ¿hasta cuándo? (de tiempo)'],
      grammar: 'Partícula interrogativa; en Sal 13:1 (v. 2 en hebreo), dentro de la expresión עַד־אָנָה (con עַד, “hasta”, H5704)',
      significance:
        'El “hasta cuándo” de nuestras Biblias traduce una expresión hebrea de dos palabras, עַד־אָנָה, literalmente ¿hasta dónde? Según nuestro recuento, la combinación aparece 14 veces en la Biblia hebrea, cuatro de ellas en los dos primeros versículos del Salmo 13, donde, como observan las notas de Tyndale, la repetición transmite agitación y una angustia profunda. El hebreo tiene una segunda expresión para “hasta cuándo”, עַד־מָתַי (con מָתַי, H4970, ¿cuándo?), usada por ejemplo en el Salmo 6:3. En cualquier caso, la pregunta misma es significativa: da por supuesto que Dios puede actuar y que actuará. Es una queja sobre el momento, no una negación de Dios.',
      caution:
        'אָן por sí sola suele significar ¿dónde?; es la combinación con עַד la que da el sentido de “hasta cuándo”. La ficha muestra el interrogativo, pero el significado pertenece a la expresión completa.',
      notableNotes: [
        'El “hasta cuándo” del profeta ante la violencia y la injusticia.',
        'Job vuelve la pregunta contra sus amigos y les pregunta hasta cuándo lo atormentarán.',
        'El SEÑOR mismo pregunta hasta cuándo lo menospreciará su pueblo: la pregunta va en ambas direcciones.',
      ],
      anchors: [
        {
          verse: { book: 'PSA', chapter: 13, verse: 1 },
          phrases: { RVR1909: 'Hasta cuándo', BLM: 'Hasta cuándo', VBL: 'Por cuánto tiempo más' },
        },
      ],
    },
  },
  crossReferences: {
    'suffering:xr:rom-5-3': {
      title: 'Una tribulación que produce algo',
      explanation:
        'Ambos pasajes dicen que la tribulación produce algo, y ambos usan el mismo verbo griego (κατεργάζομαι, obrar, producir) con el mismo sustantivo θλῖψις. En 2 Corintios 4:17 la tribulación está produciendo un eterno peso de gloria; en Romanos 5:3–4 produce paciencia, carácter probado y esperanza. Romanos describe el cambio que Dios obra ahora en el creyente; 2 Corintios mira hacia la gloria que lo superará con creces. Juntos descartan la idea de que el sufrimiento se desperdicia en las manos de Dios.',
    },
    'suffering:xr:rom-8-18': {
      title: 'No es comparable con la gloria',
      explanation:
        'Escrito más o menos un año después de 2 Corintios, Romanos 8:18 hace la misma comparación en palabras más sencillas: los sufrimientos del tiempo presente no son comparables con la gloria que ha de manifestarse. Pablo no minimiza el dolor; lo coloca en una balanza cuyo otro platillo pesa tanto que cambia la manera de vivir el presente. El estudio de Romanos 8 explora este versículo y la creación que gime a continuación.',
    },
    'suffering:xr:2co-1-3': {
      title: 'El Dios de toda consolación, y la desesperación en Asia',
      explanation:
        'El comienzo de la carta es el mejor comentario del capítulo 4. Dios nos consuela en todas nuestras tribulaciones (θλῖψις, dos veces en 1:4) para que podamos consolar a otros; y Pablo relata una crisis en Asia tan grave que perdieron incluso la esperanza de vivir (1:8): es el mismo verbo que niega en 4:8. La finalidad que extrae de ella coincide exactamente con el capítulo 4: no confiar en nosotros mismos, sino en Dios, que resucita a los muertos (1:9; compárese 4:7, 14). No se sabe con certeza qué ocurrió en Asia; las notas de Tyndale mencionan como posibilidades el motín de Éfeso o un juicio con la perspectiva de una ejecución.',
    },
    'suffering:xr:2co-11-23': {
      title: 'Lo que significaba de verdad estar atribulado',
      explanation:
        'El capítulo 11 completa la historia que hay detrás de 4:8–9: azotes, tres palizas con varas, una lapidación, tres naufragios, peligros de ríos y de bandidos, hambre, frío… y la presión diaria de la preocupación por todas las iglesias. Algunos de estos episodios pueden identificarse en Hechos (azotado con varas en Filipos, Hch 16:22–23; apedreado en Listra, Hch 14:19). Como 2 Corintios se escribió antes del último viaje de Pablo a Jerusalén y a Roma, ninguno de los tres naufragios puede ser el famoso de Hechos 27. La tribulación leve de Pablo era cualquier cosa menos leve según la medida humana.',
    },
    'suffering:xr:2co-12-7': {
      title: 'El poder que se perfecciona en la debilidad',
      explanation:
        'El capítulo 4 enuncia el principio; el capítulo 12 cuenta la historia. En 4:7 la extraordinaria grandeza del poder (δύναμις) pertenece a Dios, no a la frágil vasija. En 12:9, después de que Pablo pidiera tres veces que se le quitara el aguijón, el Señor respondió negando la petición y prometiendo otra cosa: su gracia basta, y su poder (δύναμις) se perfecciona en la debilidad. Juan Crisóstomo, al comentar 4:7, ya relacionaba ambos versículos. El aguijón sigue sin identificarse, pero la lección es clara: la debilidad es el lugar donde reposa el poder de Cristo.',
    },
    'suffering:xr:php-3-10': {
      title: 'La participación en sus padecimientos',
      explanation:
        'En Filipenses Pablo dice que quiere conocer a Cristo —el poder de su resurrección y la participación en sus padecimientos, llegando a ser semejante a él en su muerte—. Es el mismo doble movimiento de 2 Corintios 4:10–11: llevar la muerte de Jesús para que la vida de Jesús se manifieste. Para Pablo, sufrir por Cristo no es un desvío en el camino de conocerlo, sino una de las maneras en que se lo conoce.',
    },
    'suffering:xr:col-1-24': {
      title: 'Sufrir por amor de la iglesia',
      explanation:
        'La frase de 4:12 —la muerte actúa en nosotros, y en ustedes la vida— tiene un pariente cercano en Colosenses 1:24, donde Pablo se goza en sus padecimientos por la iglesia y habla de completar lo que falta de las aflicciones de Cristo. Las propias notas de Tyndale relacionan ambos versículos. La expresión de Colosenses requiere cuidado. La nota de Tyndale explica que el sufrimiento redentor de Cristo es único y está consumado, mientras que Cristo sigue sufriendo en su pueblo en medio de un mundo hostil. Los cristianos coinciden en que nada puede añadirse a la obra salvadora de Cristo, pero leen el versículo de maneras distintas. Calvino entendía que Cristo, habiendo sufrido una vez en su propia persona, sigue sufriendo en sus miembros, cuyas aflicciones fortalecen la fe de la iglesia, y rechazaba toda lectura que las hiciera expiatorias. La enseñanza católica (Juan Pablo II, Salvifici Doloris §24, 1984) afirma también que nadie puede añadir nada a la redención, pero habla de que los creyentes, unidos a Cristo, participan en su sufrimiento redentor por la Iglesia.',
    },
    'suffering:xr:1pe-1-6': {
      title: 'Por un poco de tiempo: probados como el oro',
      explanation:
        'Al “momentáneo” de Pablo, Pedro responde con su propio “un poco de tiempo”, y añade una imagen: la fe probada en las pruebas como el oro refinado por el fuego, que resultará en alabanza y gloria cuando Cristo se manifieste. Pedro, como Pablo, describe las pruebas presentes como breves y con propósito cuando se las compara con la gloria venidera.',
    },
    'suffering:xr:1pe-4-12': {
      title: 'Participar en los padecimientos de Cristo',
      explanation:
        'Pedro dice a los creyentes que no se extrañen del fuego de la prueba, como si les sucediera algo extraño, sino que se gocen de participar en los padecimientos de Cristo (4:12–13): la misma unión con Cristo que Pablo expresa como llevar la muerte de Jesús. Pedro añade dos distinciones que Pablo compartiría: no es lo mismo sufrir como malhechor que sufrir como cristiano (4:15–16), y los que sufren deben encomendarse al fiel Creador y seguir haciendo el bien (4:19).',
    },
    'suffering:xr:jas-1-2': {
      title: 'La prueba que produce paciencia',
      explanation:
        'Santiago, como Pablo, usa κατεργάζομαι (producir): la prueba de la fe produce paciencia, que conduce a la madurez. Donde Pablo habla del hombre interior que se renueva de día en día, Santiago habla de llegar a ser perfectos y cabales, sin que falte nada. Ninguno de los dos llama agradables a las pruebas; ambos las llaman fecundas.',
    },
    'suffering:xr:gen-1-3': {
      title: 'Que de las tinieblas resplandezca la luz',
      explanation:
        'El tesoro de 4:7 es la luz de 4:6, y Pablo describe a Dios como aquel que mandó que de las tinieblas resplandeciera la luz y que ha resplandecido en nuestros corazones. Crisóstomo oía aquí la creación de la luz de Génesis 1:3 (con las tinieblas de 1:2), y muchos comentaristas posteriores lo siguen: Jamieson, Fausset y Brown citan Génesis 1:3, y Calvino consideraba esta la más natural de varias lecturas, aunque dejaba abierta la cuestión. La redacción griega exacta (φῶς λάμψει, la luz resplandecerá) coincide con Isaías 9:2 en la Septuaginta más que con Génesis 1:3, de modo que Pablo quizá esté combinando la creación con el amanecer prometido por Isaías. En cualquier caso, el punto importa para el sufrimiento: el Dios que hizo la luz al principio está haciendo ahora una nueva creación, y pone esa luz en vasijas frágiles.',
    },
    'suffering:xr:psa-116-10': {
      title: 'Creí, por tanto hablé',
      explanation:
        'Pablo cita palabra por palabra el Antiguo Testamento griego: ἐπίστευσα, διὸ ἐλάλησα. En la Septuaginta estas palabras abren un salmo distinto (Sal 115 LXX), porque el griego divide en dos el Salmo 116 hebreo. Calvino observó que Pablo sigue la traducción griega común. El contexto es elocuente: el salmista añade que estaba muy afligido. Pablo toma prestada la voz de alguien que sufrió y siguió creyendo y hablando: el mismo espíritu de fe que reclama para sí.',
    },
    'suffering:xr:isa-53-3': {
      title: 'El Siervo que cargó nuestros dolores',
      explanation:
        'La muerte de Jesús que Pablo lleva consigo es la muerte del Siervo que fue despreciado, experimentado en quebranto y molido por nuestros pecados. El cántico de Isaías muestra que el camino del escogido de Dios pasa por el sufrimiento hasta la vindicación; el ministerio de Pablo sigue a distancia el mismo patrón: comparte la forma del sufrimiento de Cristo, no su obra expiatoria.',
    },
    'suffering:xr:job-1-9': {
      title: '¿Acaso teme Job a Dios de balde?',
      explanation:
        'La acusación del adversario en Job es que la fe solo existe cuando todo va bien: si se le quitan las bendiciones, el creyente maldecirá a Dios. La adoración de Job tras la pérdida es la primera refutación; el “abatidos, mas no perecemos” de Pablo es otra. Ambos muestran una fe que se mantiene cuando ha desaparecido el cerco de protección. Los dos textos responden a la cínica teoría del acusador con lo que la gracia hace realmente en quienes sufren.',
    },
    'suffering:xr:rev-21-3': {
      title: 'Lo invisible hecho visible',
      explanation:
        'Pablo fija la mirada en lo que no se ve y es eterno. Apocalipsis 21 lo describe: Dios habitando con su pueblo, las lágrimas enjugadas (eco de la promesa de Isaías 25:8 de que Dios destruirá la muerte y enjugará las lágrimas) y ya no habrá muerte, ni llanto, ni clamor, ni dolor. El eterno peso de gloria no es una abstracción, sino una creación renovada en la presencia de Dios.',
    },
    'suffering:xr:heb-12-1': {
      title: 'Jesús sufrió la cruz por el gozo puesto delante de él',
      explanation:
        'Hebreos llama a los creyentes a correr con paciencia, con los ojos puestos en Jesús, quien por el gozo puesto delante de él sufrió la cruz. Es la misma lógica de 2 Corintios 4:17–18 —el sufrimiento presente soportado a la vista de lo que viene—, pero aplicada primero a Jesús mismo. (La BSB inglesa traduce ambos pasajes con la misma expresión, fix our eyes, aunque los verbos griegos son distintos: σκοπέω en 2 Corintios, ἀφοράω en Hebreos).',
    },
    'suffering:xr:mrk-15-34': {
      title: 'Desamparado, y no desamparado',
      explanation:
        'Pablo dice que es perseguido, pero no desamparado, usando ἐγκαταλείπω; Marcos traduce el clamor de Jesús en la cruz, ¿por qué me has desamparado?, con el mismo verbo. Pablo no está citando a Marcos, y el vínculo es verbal y teológico más que literario. Pero apunta al corazón de la esperanza cristiana en el sufrimiento: muchos cristianos han visto en el Cristo desamparado la garantía de que Dios no desamparará a su pueblo, una promesa que Hebreos 13:5 repite con el mismo verbo.',
    },
    'suffering:xr:psa-88': {
      title: 'Espacio para la oración que termina en tinieblas',
      explanation:
        'El “no desesperamos” de Pablo usa un verbo que el Antiguo Testamento griego emplea en el Salmo 88 para la queja del salmista: estoy desesperado (88:15; LXX 87:16). El Salmo 88 es un lamento que termina sin resolución y, sin embargo, sigue siendo oración, dirigida al Dios de mi salvación. Leídos juntos, los dos textos mantienen honestos a los cristianos: la Escritura ni niega la desesperación ni le deja la última palabra.',
    },
  },
  context: {
    'suffering:ctx:occasion': {
      title: 'Una relación tensa con Corinto',
      summary:
        'Pablo escribió 2 Corintios hacia el año 56 d. C. desde Macedonia, después de una visita dolorosa a Corinto, de una carta severa (probablemente perdida) y del alentador informe de Tito. Algunos en la iglesia dudaban de su autoridad precisamente porque parecía débil y afligido.',
      detail:
        'Según las Tyndale Open Study Notes, 1 Corintios fue mal recibida; Pablo hizo una visita personal desde Éfeso que fracasó, escribió entre lágrimas una “carta severa” que llevó Tito y luego, tras salir de Éfeso en medio de duras pruebas, se encontró con Tito en Macedonia y recibió la buena noticia del arrepentimiento de la iglesia. A algunos corintios, su sufrimiento y su debilidad les parecían contradecir su pretensión de ser apóstol. El capítulo 4 responde de frente a esa objeción: la debilidad es precisamente el lugar donde se manifiesta el poder de Dios.',
    },
    'suffering:ctx:asia': {
      title: 'La crisis en Asia',
      summary:
        'Poco antes de escribir, Pablo afrontó una crisis que puso en peligro su vida en la provincia romana de Asia (1:8–11). Se desconoce su naturaleza exacta: se han propuesto el motín de Éfeso (Hch 19:23–41), un juicio con la perspectiva de una ejecución o —menos probable— una enfermedad grave.',
    },
    'suffering:ctx:clay-jars': {
      title: 'La cerámica de Corinto y un tesoro en vasos de barro',
      summary:
        'Los artesanos de Corinto fabricaban cerámica, y sobre todo lámparas de terracota muy conocidas en todo el mundo antiguo, y comentaristas antiguos señalan que los tesoros solían guardarse en vasijas de barro. La imagen de Pablo habría resultado inmediatamente concreta: un recipiente barato y frágil que contiene algo de valor incalculable.',
      detail:
        'La introducción de Tyndale relaciona directamente las conocidas lámparas de terracota de Corinto con 2 Corintios 4:7, lo que encaja con las imágenes de la luz y la vasija de 4:6–7. Jamieson, Fausset y Brown observan que los antiguos guardaban a menudo sus tesoros en vasijas de barro. Algunos comentaristas antiguos (el comentario de Matthew Henry, en la sección de 2 Corintios que completó Daniel Mayo tras la muerte de Henry, y Jamieson, Fausset y Brown) vieron también una alusión a los soldados de Gedeón, que escondían sus antorchas dentro de cántaros (Jue 7:16–20); esto sigue siendo una sugerencia, ya que Pablo no menciona a Gedeón.',
    },
    'suffering:ctx:triumph': {
      title: 'Llevados en un triunfo romano (2:14)',
      summary:
        'La sección que contiene el capítulo 4 se abre con la imagen de una procesión triunfal romana, en la que un general llevaba cautivos y se esparcía incienso a lo largo del recorrido. Pablo se presenta como cautivo de Cristo en esa procesión: es el marco de lo que dice sobre la debilidad y la gloria.',
      detail:
        'Las notas de Tyndale explican que los cautivos de un desfile triunfal iban camino de la arena y de la muerte, y que el incienso del recorrido olía para ellos a muerte y para los vencedores a vida (2:15–16). El autorretrato de Pablo como cautivo prepara el llevar consigo la muerte de Jesús del capítulo 4.',
    },
    'suffering:ctx:hardship-lists': {
      title: 'Catálogos de dificultades',
      summary:
        'Las listas de dificultades eran una forma reconocida de la filosofía moral grecorromana, usada para mostrar la entereza del sabio. Las listas de Pablo en 1 y 2 Corintios (incluida la de 4:8–9) se han estudiado sobre ese trasfondo, con una diferencia clave: Pablo atribuye su supervivencia al poder de Dios, no a su propia virtud.',
      detail:
        'La obra de John T. Fitzgerald Cracks in an Earthen Vessel (1988), cuyo título procede de 2 Co 4:7, examina los catálogos de dificultades de la correspondencia corintia junto al uso filosófico de esas listas (el término griego es peristasis, circunstancia o adversidad), apoyándose en autores como Epicteto y Dión Crisóstomo. El contraste de 4:7 (el poder es de Dios y no de nosotros) es propio de Pablo: las listas no muestran la autosuficiencia de un sabio, sino la fuerza de Dios en una vasija frágil.',
    },
    'suffering:ctx:lament-psalms': {
      title: 'El lamento como género bíblico',
      summary:
        'Los lamentos constituyen la mayoría de los salmos de los libros 1–3 del Salterio e incluyen lamentos individuales y comunitarios. Normalmente avanzan de la queja y la súplica hacia la confianza —aunque el Salmo 88 no lo hace— y dan a Israel un lenguaje autorizado para el dolor.',
      detail:
        'La introducción de Tyndale a los Salmos clasifica la mayoría de los salmos de los libros 1–3 como lamentos, subdivididos en individuales y comunitarios. El Salmo 13 muestra el movimiento habitual desde el cuádruple ¿hasta cuándo? hacia la confianza y el canto; el Salmo 88 muestra que el canon conserva también un lamento sin resolución. Lamentaciones, Job y Habacuc prolongan la misma tradición más allá del Salterio.',
    },
    'suffering:ctx:ane-wisdom': {
      title: 'Job entre los textos antiguos sobre el sufrimiento',
      summary:
        'Otros textos del antiguo Oriente Próximo luchan con la figura del justo que sufre, en particular las obras babilónicas conocidas como “I Will Praise the Lord of Wisdom” (Alabaré al señor de la sabiduría) y la “Teodicea babilónica”. Job comparte con la Teodicea la forma de diálogo, pero difiere radicalmente: es monoteísta, y su protagonista nunca abandona su compromiso con Dios.',
      detail:
        'La introducción de Tyndale a Job, basándose en Ancient Near Eastern Texts de Pritchard, señala que en el babilónico “I Will Praise the Lord of Wisdom” el que sufre supone algún pecado desconocido y es sanado mediante exorcismos, mientras que la “Teodicea babilónica” usa un diálogo muy parecido al de Job, pero dentro de un mundo politeísta y con un sufriente que amenaza con abandonar la obediencia. El marco de Job es patriarcal; la fecha de composición del libro es incierta.',
    },
    'suffering:ctx:retribution': {
      title: '¿Se lo merecía quien sufre?',
      summary:
        'Una suposición muy extendida en el mundo bíblico —expresada por los amigos de Job y por los discípulos de Jesús— sostenía que el sufrimiento es siempre consecuencia directa del pecado de quien sufre. La Escritura afirma que el pecado tiene consecuencias, pero niega una y otra vez que toda calamidad sea un veredicto sobre sus víctimas.',
      detail:
        'Las notas de Tyndale sobre Job describen el razonamiento cerrado de los amigos —Dios es justo, luego el sufrimiento de Job tiene que ser castigo— y muestran que el libro rechaza su aplicación de toma y daca. En Juan 9:2 los discípulos suponen que el pecado de alguien causó la ceguera de un hombre, y Jesús los corrige. En Lucas 13 Jesús responde a la idea popular de que las cosas malas solo les pasan a los malos; las notas añaden que el incidente de los galileos no se conoce por otras fuentes, aunque por Josefo se sabe que Pilato reprimía con violencia los disturbios.',
    },
  },
  literary: {
    placeInBook:
      '2 Corintios 4:7–18 se encuentra dentro de una larga sección (2:14–7:4) en la que Pablo interrumpe el relato de su búsqueda de Tito y defiende la naturaleza de su ministerio; el relato se retoma en 7:5. Después de describir la gloria incomparable del ministerio del nuevo pacto (3:1–4:6), Pablo afronta ahora la objeción evidente —si el mensaje es tan glorioso, ¿por qué su mensajero está tan maltrecho?— y convierte su debilidad en prueba a favor del evangelio.',
    argument:
      'El pasaje avanza en cinco pasos. (1) Tesis: el tesoro está en vasos de barro para que se vea que el poder es de Dios (4:7). (2) Evidencia: cuatro contrastes en parejas —atribulados, pero no aplastados; perplejos, pero no desesperados; perseguidos, pero no desamparados; derribados, pero no destruidos (4:8–9)—. (3) Interpretación: esto es la muerte de Jesús llevada en el cuerpo para que se manifieste su vida, y produce vida en los corintios (4:10–12). (4) Fundamento de la confianza: la fe del salmista que habla, y la certeza de la resurrección (4:13–15). (5) Conclusión: por tanto no desmayamos, porque la tribulación presente se pone en la balanza frente a la gloria eterna, y lo que no se ve perdura más que lo que se ve (4:16–18).',
    placeInCanon:
      'El pasaje recoge toda la historia de la Biblia. Evoca la creación (la luz que resplandece de las tinieblas, 4:6, que muy probablemente recuerda Génesis 1:3), convive con honestidad con la caída (un hombre exterior que se va desgastando, 4:16), encuentra su centro en la muerte y la resurrección de Cristo (4:10, 14) y se inclina hacia la nueva creación (4:17–5:5; compárese 5:17). Ese arco —creación, caída, redención, nueva creación— es el marco en el que la Biblia sitúa toda pregunta sobre el sufrimiento.',
    bookOutline: [
      'Saludo y el Dios de toda consolación',
      'Cambio de planes y la carta dolorosa',
      'La gloria del ministerio del nuevo pacto',
      'Un tesoro en vasos de barro: sufrimiento y esperanza',
      'El ministerio de la reconciliación',
      'Un llamado a abrir el corazón',
      'El informe de Tito y el gozo de Pablo',
      'La colecta para Jerusalén',
      'Pablo defiende su apostolado',
    ],
    passageOutline: [
      'Un tesoro en vasos de barro',
      'Cuatro contrastes con “mas no”',
      'La muerte y la vida de Jesús',
      'La fe que habla',
      'Renovados de día en día: el peso de gloria',
    ],
    features: {
      'suffering:lit:antitheses': {
        title: 'Cuatro contrastes con “mas no”',
        description:
          'Los versículos 8–9 presentan cuatro parejas paralelas, cada una formada por un participio de dificultad seguido de “mas no” y de un participio más fuerte. El ritmo transmite la idea: cada golpe es real, pero ninguno es definitivo. El segundo contraste contiene un juego de palabras en griego: ἀπορούμενοι (sin saber qué hacer), pero no ἐξαπορούμενοι (completamente sin salida).',
        structure: [
          { label: '1', text: 'Presionados por todos lados, pero no aplastados' },
          { label: '2', text: 'Sin saber qué hacer, pero no del todo sin salida (desesperados)' },
          { label: '3', text: 'Perseguidos, pero no abandonados' },
          { label: '4', text: 'Derribados, pero no destruidos' },
        ],
      },
      'suffering:lit:inclusio': {
        title: 'No desmayamos (4:1; 4:16)',
        description:
          'La misma cláusula, con el mismo verbo griego, abre el capítulo 4 y reaparece cerca de su final (4:16). En 4:1 la razón es la misericordia de Dios al conceder el ministerio; en 4:16 es la renovación diaria del hombre interior y la gloria venidera. El marco muestra el propósito del capítulo: explicar cómo un ministro que sufre sigue adelante.',
      },
      'suffering:lit:death-life': {
        title: 'La muerte y la vida de Jesús',
        description:
          'En 4:10–14 el nombre de Jesús aparece seis veces, y muerte y vida se alternan tres veces cada una (4:10, 11, 12). La experiencia de Pablo se describe enteramente en términos de la propia historia de Jesús: su morir llevado en el cuerpo, su vida manifestada en la carne mortal, su resurrección como garantía de la nuestra.',
      },
      'suffering:lit:scales': {
        title: 'La tribulación en la balanza frente a la gloria',
        description:
          'Los versículos 17–18 están construidos con parejas de opuestos: momentáneo y eterno, levedad y peso, tribulación y gloria, lo que se ve y lo que no se ve, lo temporal y lo eterno. Juan Crisóstomo ya advirtió cómo Pablo contrapone lo presente a lo futuro, lo breve a lo eterno, lo leve a lo pesado y la tribulación a la gloria, y cómo además duplica su expresión para mayor énfasis.',
        structure: [
          { label: 'A', text: 'Una tribulación leve y momentánea' },
          { label: 'A′', text: 'Un eterno peso de gloria, más allá de toda comparación' },
          { label: 'B', text: 'Lo que se ve: temporal' },
          { label: 'B′', text: 'Lo que no se ve: eterno' },
        ],
      },
      'suffering:lit:jars': {
        title: 'Un tesoro en vasos de barro',
        description:
          'La imagen que domina el pasaje une 4:6 con 4:7: la luz de la gloria de Dios en el rostro de Cristo es el tesoro, y los frágiles cuerpos y ministerios humanos son las vasijas. La metáfora explica todo el argumento: la debilidad del recipiente hace inconfundible el poder de su contenido.',
      },
    },
  },
  theology: {
    'suffering:th:providence': {
      title: 'Un Dios bueno y soberano en un mundo caído',
      summary:
        'La Escritura mantiene juntas la bondad de Dios, su soberanía sobre todas las cosas, la realidad del mal y la responsabilidad humana, sin pretender que sea fácil conciliarlas.',
      detail:
        'José puede decir en una misma frase que sus hermanos pensaron mal y que Dios lo encaminó a bien (Gn 50:20). El narrador de Job muestra a Dios permitiendo lo que hace Satanás sin explicárselo nunca a Job. Lamentaciones dice que Dios no aflige de corazón (Lm 3:33). La respuesta cristiana histórica, formulada clásicamente por Agustín y reformulada de maneras distintas en la Confesión de Westminster (cap. 5) y en el Catecismo de la Iglesia Católica (§§311–312), es que nada, ni siquiera el mal, queda fuera de la providencia de Dios: Dios nunca es autor del pecado, pero es capaz de sacar bien del mal. Los cristianos difieren en cómo describir la relación de Dios con los actos malos —la enseñanza católica dice que permite el mal moral, mientras que la Confesión de Westminster dice que gobierna el pecado no mediante un simple permiso (véanse las perspectivas más abajo)—, pero coinciden en que el mal no es una ilusión ni está fuera del gobierno de Dios.',
    },
    'suffering:th:cross': {
      title: 'La teología de la cruz: Dios en lo más hondo',
      summary:
        'La respuesta más plena de Dios al sufrimiento no es un argumento, sino un acto: en Cristo entró en el dolor humano, fue desamparado en la cruz y resucitó. El poder se revela por medio de la debilidad.',
      detail:
        'El Siervo de Isaías es varón de dolores; Jesús ora desde la cruz con el lamento del Salmo 22; Hebreos insiste en que se compadece de nuestras debilidades. Las tesis de Heidelberg de Martín Lutero (1518) convirtieron esto en un principio: a Dios no se lo conoce de verdad ascendiendo hasta él por el razonamiento a partir de las obras y la gloria, sino en el sufrimiento y la cruz. 2 Corintios 4 aplica el principio al ministerio cristiano —el poder de Dios se muestra en una vasija agrietada—, y John Stott, en el último capítulo de The Cross of Christ, contempló el sufrimiento del mundo desde el Calvario, donde se ve a Dios soportando él mismo el dolor y la injusticia en lugar de observarlos desde lejos.',
    },
    'suffering:th:union': {
      title: 'La unión con Cristo en el sufrimiento',
      summary:
        'Los creyentes comparten la historia de Cristo: llevan su morir y compartirán su resurrección. Sufrir por Cristo es una de las maneras en que los creyentes participan de su vida, no una señal de que hayan sido abandonados.',
      detail:
        'Pablo habla de llevar la muerte de Jesús para que se manifieste su vida (2 Co 4:10–11), de la participación en sus padecimientos (Flp 3:10) y de padecer con Cristo para ser glorificados con él (Ro 8:17). Pedro dice a los creyentes que se gocen de participar en los padecimientos de Cristo (1 P 4:13). Los cristianos coinciden en que estos textos no añaden nada a la obra expiatoria única de Cristo, aunque las tradiciones describen de maneras distintas la participación de los creyentes en sus sufrimientos (véase Col 1:24). Los textos describen el patrón de una vida moldeada por la cruz y la certeza de la resurrección (2 Co 4:14).',
    },
    'suffering:th:lament': {
      title: 'El lamento: la fe que se queja ante Dios',
      summary:
        'La Biblia da a quienes sufren palabras para protestar, preguntar y llorar, dirigidas a Dios. El lamento no es lo contrario de la fe, sino una de sus formas.',
      detail:
        'Buena parte de los Salmos son lamentos; Job discute con Dios; Lamentaciones (atribuido tradicionalmente a Jeremías) llora por una ciudad destruida; Habacuc pregunta hasta cuándo; Jesús mismo ora con un lamento en la cruz. El ¿hasta cuándo? del Salmo 13 y la oscuridad sin resolver del Salmo 88 muestran que la sinceridad ante Dios no es irreverencia. A Grief Observed de C. S. Lewis es un ejemplo moderno de esa misma lucha sincera.',
    },
    'suffering:th:refining': {
      title: 'Pruebas que refinan',
      summary:
        'Dios usa la aflicción para producir paciencia, carácter y esperanza, y para aflojar nuestro apego a lo pasajero. Lo bueno no está en el dolor, sino en lo que Dios obra por medio de él.',
      detail:
        'Pablo, Santiago y Pedro describen las pruebas como algo que produce fruto: paciencia, madurez, una fe probada (Ro 5:3–5; Stg 1:2–4; 1 P 1:6–7). Hebreos presenta las dificultades como la formación que da un padre (Heb 12:5–11), y 2 Corintios 4:16 habla del hombre interior que se renueva de día en día mientras el exterior se va desgastando. La Escritura no dice que toda prueba se envíe para corregir una falta concreta (Jn 9:3), ni que el sufrimiento sea bueno en sí mismo.',
    },
    'suffering:th:hope': {
      title: 'El peso de gloria: la esperanza más allá del sufrimiento',
      summary:
        'La esperanza cristiana no niega el dolor presente; lo pone en la balanza frente a la resurrección y la nueva creación, donde la gloria supera a la tribulación más allá de toda comparación.',
      detail:
        'Pablo fundamenta la perseverancia en la resurrección (2 Co 4:14) y en un eterno peso de gloria (4:17), y continúa con la esperanza de una morada celestial en 5:1–5. Romanos 8:18 dice que los sufrimientos del tiempo presente no son comparables con la gloria venidera, y Apocalipsis 21 describe el final: Dios con su pueblo, las lágrimas enjugadas, la muerte vencida. Esta esperanza es lo que permite a Pablo llamar leve a un sufrimiento pesado.',
    },
  },
  perspectives: {
    'suffering:ps:why-evil': {
      question: '¿Por qué permite Dios el mal y el sufrimiento?',
      intro:
        'Los cristianos coinciden en que Dios es bueno, en que es soberano y en que el mal es real. Se han dado varias respuestas a por qué un Dios así permite el mal. Algunas son énfasis filosóficos o pastorales que cristianos de muchas iglesias combinan. Hay un punto, sin embargo, en el que las tradiciones difieren de verdad: la enseñanza católica dice que Dios permite el mal moral por respeto a la libertad de sus criaturas (CIC 311), y John Wesley sostuvo que Dios no podría abolir el pecado sin destruir la libertad que él mismo dio; la Confesión de Westminster, en cambio, enseña que Dios ordena todo lo que acontece y gobierna incluso el pecado no mediante un simple permiso (CFW 3.1; 5.4), a la vez que niega que sea su autor.',
      commonGround:
        'En sus formas cristianas históricas, estos enfoques afirman que Dios es bueno y todopoderoso; que el mal es real, no es bueno en sí mismo y nunca es pecado de Dios; que la rebelión humana ha estropeado una creación buena; que la muerte y la resurrección de Cristo son la respuesta decisiva de Dios al mal; y que Dios pondrá fin definitivamente al sufrimiento y a la muerte. Difieren en cómo relacionan la voluntad de Dios con males concretos y en cuánto creen que puede explicarse antes de la nueva creación.',
      perspectives: {
        'suffering:ps:why-evil:augustinian': {
          tradition: 'Agustiniana',
          label: 'El mal es privación del bien; Dios lo permite porque puede sacar bien de él',
          summary:
            'Agustín enseñó que todo lo que Dios hizo es bueno y que el mal no es una sustancia, sino la ausencia o corrupción del bien, como la enfermedad es la ausencia de la salud. El mal entró por el mal uso del libre albedrío creado. Dios lo permite solo porque es lo bastante poderoso y bueno para sacar bien incluso del mal; juzgó mejor sacar bien del mal que no permitir mal alguno.',
        },
        'suffering:ps:why-evil:irenaean': {
          tradition: 'Ireneana (formación del alma)',
          label: 'La humanidad fue creada inmadura; el mundo es un lugar de crecimiento hacia Dios',
          summary:
            'Ireneo de Lyon sostuvo que los seres humanos no podían recibir la perfección en el momento de la creación, pues eran como niños pequeños; debían crecer, por la experiencia del bien y del mal y por la libre elección, hacia la semejanza de Dios (Contra las herejías 4.37–39). En 1966 el filósofo John Hick desarrolló esta idea como una teodicea moderna de la formación del alma, en contraste con la de Agustín. Conviene advertir que la versión de Hick trataba la caída como un mito y exigía la salvación final de todas las personas (un universalismo que criticó el teólogo Henri Blocher), y que su obra posterior derivó hacia el pluralismo religioso y una visión metafórica de la encarnación, muy fuera de la ortodoxia histórica. El énfasis ireneano en el crecimiento no depende de esos pasos.',
        },
        'suffering:ps:why-evil:reformed': {
          tradition: 'Reformada',
          label: 'Dios ordena todas las cosas, incluidos los actos malos, para fines santos, sin ser autor del pecado',
          summary:
            'La teología reformada subraya que la providencia de Dios se extiende a todo acontecimiento, incluido el pecado, no por un simple permiso, sino limitándolo sabiamente y dirigiéndolo a sus santos propósitos; aun así, el pecado procede solo de la criatura, y Dios no es su autor ni lo aprueba (Confesión de Westminster 5.4). Las palabras de José en Génesis 50:20 son el modelo. D. A. Carson defiende esto como compatibilismo: Dios es plenamente soberano y los seres humanos son plenamente responsables, un misterio de la providencia que la Escritura afirma sin explicarlo del todo. Los escritos pastorales de John Piper lo aplican directamente e instan a los creyentes a ver incluso la enfermedad como algo que Dios dispone para su bien.',
        },
        'suffering:ps:why-evil:catholic': {
          tradition: 'Católica',
          label: 'Dios permite el mal moral, respetando la libertad de las criaturas, y saca bien de él',
          summary:
            'El Catecismo de la Iglesia Católica dice que ningún argumento aislado zanja la cuestión del mal; la respuesta es el conjunto de la fe cristiana. Dios no causa el mal moral, ni directa ni indirectamente, pero lo permite por respeto a la libertad de sus criaturas, y puede sacar bien de él. El Catecismo cita el Enchiridion de Agustín y las palabras de José en Génesis 50:20, y remite a la cruz, donde el mayor mal jamás cometido se convirtió en ocasión del mayor bien (CIC 309–314, 324). En la carta apostólica Salvifici Doloris (1984), Juan Pablo II añade que la redención de Cristo es completa y nada puede añadírsele, pero que quienes sufren unidos a él se hacen partícipes de su sufrimiento redentor (§§19, 24); y lee 2 Corintios 4:8–11 a esta luz (§20).',
        },
        'suffering:ps:why-evil:wesleyan': {
          tradition: 'Arminiana / wesleyana',
          label: 'Dios gobierna todas las cosas, pero no destruirá la libertad que dio para abolir el pecado',
          summary:
            'John Wesley defendió una providencia particular además de general: Dios ve a cada criatura y cada sufrimiento de sus hijos, y cuida de cada uno (Sermón 67, “On Divine Providence”, §§12–13, 18–26). ¿Por qué, entonces, no acaba sin más con el pecado y el dolor? Porque, argumentaba Wesley, Dios hizo a los seres humanos a su imagen, con entendimiento, voluntad y libertad, sin la cual no serían capaces ni de virtud ni de vicio; abolir el pecado por la sola fuerza sería deshacer su propia obra. Así, Dios gobierna a las personas como seres libres e inteligentes y no como máquinas, dándoles toda ayuda hacia el bien que no anule su libertad (§15).',
        },
        'suffering:ps:why-evil:free-will-defence': {
          tradition: 'Defensa del libre albedrío (filosofía analítica de la religión)',
          label: 'Un mundo con criaturas verdaderamente libres puede valer el riesgo del mal',
          summary:
            'La defensa del libre albedrío de Alvin Plantinga responde a la forma lógica del problema del mal (tal como la planteó J. L. Mackie): no es contradictorio sostener que existe un Dios todopoderoso y totalmente bueno junto al mal, porque un mundo con criaturas dotadas de verdadera libertad moral —y, por tanto, de la capacidad de obrar mal— puede ser mejor que un mundo sin criaturas libres, y ni siquiera Dios puede hacer que unas criaturas libres elijan siempre libremente el bien. Plantinga la presenta como una defensa (que muestra la coherencia), no como una teodicea completa que explique cada mal.',
        },
        'suffering:ps:why-evil:orthodox': {
          tradition: 'Ortodoxa oriental',
          label: 'La muerte y la corrupción son enemigos que Dios ha derrotado en Cristo',
          summary:
            'El pensamiento cristiano oriental suele hablar menos de explicar el mal y más de la victoria de Dios sobre él. Atanasio describe a una humanidad que se desliza hacia la corrupción y la muerte, y a Dios, que no quiso que su obra pereciera, tomando un cuerpo como el nuestro para vencer a la muerte y restaurar la incorrupción (Sobre la encarnación del Verbo 6–10). El filósofo ortodoxo David Bentley Hart, escribiendo después del tsunami del océano Índico de 2004, sostuvo que los cristianos no deben describir tales catástrofes como expresiones de la voluntad de Dios, sino como marcas de un mundo cautivo de poderes hostiles, un cautiverio al que Dios se opone y al que pondrá fin definitivamente en su reino.',
        },
        'suffering:ps:why-evil:pastoral': {
          tradition: 'Pastoral y bíblica (entre tradiciones)',
          label: 'La Escritura ofrece la presencia de Dios y un futuro más que una explicación completa',
          summary:
            'Muchos autores subrayan que la Biblia, como el libro de Job, no da a quienes sufren una explicación completa, sino a Dios mismo: su presencia, su sufrimiento en Cristo y su promesa de ponerlo todo en orden. Timothy Keller combina enfoques filosóficos, bíblicos y prácticos, y sostiene que Dios produce gozo por medio del sufrimiento, como muestra la cruz. N. T. Wright sostiene que la Biblia cuenta cómo Dios se ocupa del mal más que explicar de dónde vino. Joni Eareckson Tada, escribiendo con Steven Estes desde décadas de tetraplejia, sostiene que Dios comprende nuestro dolor, lo permite solo por razones sabias y es capaz de usarlo para bien.',
        },
      },
    },
  },
  commentary: {
    'suffering:cm:chrysostom-4-7': {
      lead: 'Sobre el tesoro en vasos de barro (4:7). En la traducción inglesa citada, “vile” significa humilde o de poco valor.',
      quoteTranslation:
        '…esto mismo es, en verdad, la mayor maravilla y una prueba grandísima del poder de Dios: que un vaso de barro haya sido capacitado para llevar un resplandor tan grande y guardar un tesoro tan alto. … Porque el poder de Dios se hace especialmente visible cuando por medios humildes obra cosas grandes.',
    },
    'suffering:cm:augustine-enchiridion': {
      lead: 'Sobre por qué un Dios totalmente bueno permite el mal',
      quoteTranslation:
        'Porque el Dios todopoderoso, que, como reconocen incluso los paganos, tiene poder supremo sobre todas las cosas, siendo él mismo sumamente bueno, jamás permitiría la existencia de mal alguno entre sus obras si no fuera tan omnipotente y bueno que puede sacar bien incluso del mal. Pues ¿qué es lo que llamamos mal sino la ausencia del bien?',
    },
    'suffering:cm:luther-heidelberg': {
      lead: 'Sobre la teología de la cruz (tesis 19–21)',
      text:
        'En unas tesis preparadas para una disputa de su orden agustina en Heidelberg en abril de 1518, Lutero distingue dos clases de teólogos. El teólogo de la gloria pretende discernir los atributos invisibles de Dios —su sabiduría, su justicia y su bondad— a partir de las cosas creadas y de las obras humanas, y por eso prefiere los logros al sufrimiento, la gloria a la cruz y la fuerza a la debilidad. El verdadero teólogo comprende lo visible de Dios por medio del sufrimiento y de la cruz. La teología de la gloria, dice Lutero, confunde el bien y el mal, mientras que la teología de la cruz llama a las cosas por su nombre.',
    },
    'suffering:cm:calvin-4-17': {
      lead: 'Sobre la tribulación leve y momentánea (4:17)',
      quoteTranslation:
        'Pablo, por tanto, prescribe el mejor antídoto para no hundirte bajo el peso de las aflicciones, cuando opone a ellas la bienaventuranza futura que te está reservada en el cielo. … Porque esta comparación vuelve ligero lo que antes parecía pesado, y hace breve y momentáneo lo que parecía de duración ilimitada.',
    },
    'suffering:cm:mayo-4-8': {
      lead: 'Sobre los cuatro contrastes de 4:8–9. Del comentario de Matthew Henry: la sección de 2 Corintios la completó Daniel Mayo tras la muerte de Henry.',
      quoteTranslation:
        'Sea cual sea la condición en que se encuentren los hijos de Dios en este mundo, tienen un “mas no” con el cual consolarse; su situación es a veces mala, sí, muy mala, pero no tan mala como podría ser.',
    },
    'suffering:cm:spurgeon-light-affliction': {
      lead: 'Sobre por qué Pablo podía llamar leve a su tribulación',
      quoteTranslation:
        'Escribió que nuestra tribulación era leve aun cuando estaba gravemente afligido, y mientras sentía agudamente esa aflicción. … Sentía su peso, y era plenamente consciente de la presión que ejercía sobre su espíritu…',
    },
    'suffering:cm:lewis-problem-of-pain': {
      lead: 'Sobre el poder de Dios, el amor de Dios y el dolor humano',
      text:
        'Lewis sostiene que el dolor no refuta la existencia de un Dios bueno y todopoderoso una vez que esas palabras se entienden correctamente. La omnipotencia no incluye hacer lo que es contradictorio en sí mismo, y un mundo en el que criaturas libres puedan encontrarse unas con otras necesita un orden natural estable que también puede hacer daño. El amor divino es más exigente que una amabilidad que solo quiere vernos cómodos; busca nuestra perfección y por eso puede causar dolor. En los capítulos sobre el dolor humano sostiene que, a diferencia del placer o incluso del pecado, el dolor no se puede ignorar fácilmente, de modo que puede despertar a quienes viven satisfechos sin Dios a su necesidad de él. No pretende explicar cada caso de sufrimiento, sino solo mostrar que la bondad y el sufrimiento no son contradictorios.',
    },
    'suffering:cm:lewis-grief-observed': {
      lead: 'Sobre el duelo sin respuestas ordenadas',
      text:
        'Compilado a partir de los cuadernos que Lewis llevó tras la muerte de su esposa, Joy Davidman, por cáncer en 1960, y publicado primero bajo el seudónimo de N. W. Clerk, A Grief Observed registra el duelo con una franqueza poco común. Lewis expresa enojo y desconcierto ante Dios y cuestiona asuntos de fe que antes había tratado con seguridad, y solo poco a poco avanza hacia una confianza renovada y más humilde y hacia la gratitud por el amor que había recibido. Leído junto a The Problem of Pain, muestra al mismo autor viviendo aquello sobre lo que antes había razonado.',
    },
    'suffering:cm:stott-cross': {
      lead: 'Sobre la cruz y el problema del sufrimiento',
      text:
        'En el capítulo final de The Cross of Christ, “Suffering and Glory”, Stott aborda el desafío del mal y del dolor en el mundo de Dios. Reconoce que la cruz deja sin respuesta muchas preguntas sobre el dolor, pero la convierte en la lente a través de la cual los creyentes han de mirar todo sufrimiento, porque allí Dios no aparece como un espectador lejano, sino como alguien que ha entrado él mismo en el sufrimiento humano, la injusticia y la muerte.',
    },
    'suffering:cm:keller-walking': {
      lead: 'Sobre atravesar el sufrimiento, no solo explicarlo',
      text:
        'El libro de Keller reúne tres enfoques que suelen mantenerse separados: el problema filosófico del sufrimiento, la enseñanza de la Biblia al respecto y la experiencia práctica de atravesarlo. Su tesis, expuesta en la introducción, es que a lo largo de la Biblia Dios no se limita a dar gozo a su pueblo después del sufrimiento o junto a él, sino que lo produce por medio del sufrimiento, a imagen de la cruz, donde el propio sufrimiento de Jesús fue precisamente el camino por el que llegó la salvación.',
    },
    'suffering:cm:piper-cancer': {
      lead: 'Sobre no desperdiciar la aflicción',
      text:
        'Escrito en febrero de 2006, en vísperas de su propia cirugía por cáncer de próstata, el artículo de Piper enumera diez maneras en que un creyente puede desperdiciar una enfermedad. Entre ellas: negarse a verla como algo dispuesto por Dios para el bien del creyente; buscar consuelo en las estadísticas de supervivencia en lugar de en Dios (cita 2 Co 1:9); evitar todo pensamiento sobre la muerte; medir la victoria por seguir con vida en lugar de por atesorar a Cristo; aislarse de los demás; entristecerse sin esperanza; y desaprovechar la oportunidad que ofrece de dar testimonio de Cristo.',
    },
    'suffering:cm:wright-evil': {
      lead: 'Sobre lo que Dios hace con el mal',
      text:
        'Wright sostiene que la cultura occidental moderna se ha vuelto ingenua respecto al mal: tiende a ignorarlo hasta que golpea de cerca y entonces reacciona culpando a otros. En lugar de ofrecer una teodicea filosófica, traza cómo la Biblia cuenta que Dios se ocupa del mal —juzgándolo a la vez que ofrece gracia a lo largo de la historia de Israel, y de modo culminante en la muerte y la resurrección de Jesús, donde ve que la respuesta de Dios al mal llega a su punto decisivo—. Después exhorta a los cristianos a orar y a trabajar por la justicia ahora, anticipando un mundo libre del mal, y sobre todo a practicar el perdón.',
    },
  },
  sermons: {
    'suffering:sm:spurgeon-3244': {
      summary:
        'Predicado un jueves por la tarde en el Metropolitan Tabernacle, el sermón insiste primero en que Pablo no era ingenuo, ni insensible, ni indiferente ante el sufrimiento, y luego sostiene que la aflicción es leve por comparación: con los objetivos y el gran motivo del servicio cristiano, con los sufrimientos de otros, con lo que merecemos, con los sufrimientos de Cristo y con las bendiciones de las que los creyentes ya disfrutan. Añade que se siente leve a medida que los creyentes experimentan la gracia sustentadora de Dios y ven el crecimiento en la gracia al que conduce, y finalmente que es leve comparada con la gloria que pronto será revelada.',
    },
    'suffering:sm:spurgeon-35': {
      summary:
        'Un sermón temprano sobre el horno de la aflicción (la redacción de Is 48:10 en la KJV). Spurgeon subraya que el amor de Dios no cambia en el horno, luego da razones por las que los creyentes son probados —todo lo precioso se pone a prueba, y el sufrimiento los hace semejantes a Cristo— y describe los beneficios del horno, empezando por la purificación.',
    },
    'suffering:sm:keller-2004': {
      summary:
        'Keller presenta la esperanza cristiana como una confianza firme en el futuro final del creyente con Dios en la nueva creación, una confianza que cambia la manera de afrontar el sufrimiento y la decepción. A partir de 2 Corintios hace después tres observaciones sobre el sufrimiento: nadie se libra de él, tiene un patrón y tiene un futuro.',
    },
  },
  verseNotes: {
    '2CO.4.7': [
      'Este tesoro es la luz de 4:6: el conocimiento de la gloria de Dios en el rostro de Cristo. Pablo dice que se lleva en vasos de barro: cuerpos y ministerios humanos frágiles y corrientes. La razón se da enseguida: para que se vea que la extraordinaria grandeza del poder es de Dios y no nuestra. Corinto era conocida por sus lámparas de terracota, lo que hace especialmente concreta la imagen de la luz dentro de una vasija.',
    ],
    '2CO.4.8': [
      'Los dos primeros de cuatro contrastes: atribulados por todas partes, pero no aplastados; perplejos, pero no desesperados. El primer participio procede de θλίβω, el verbo que está detrás de θλῖψις (tribulación) en 4:17. El segundo contraste es un juego de palabras griego: sin saber qué hacer, pero no del todo sin salida. Pablo admite una presión y una confusión reales; lo que niega es la derrota final.',
    ],
    '2CO.4.9': [
      'Los dos últimos contrastes: persecución sin abandono, ser derribado sin ser destruido. La palabra desamparados (ἐγκαταλείπω) es el mismo verbo que usa Marcos para el clamor de Jesús en la cruz. Pablo puede ser abandonado por la gente, pero no por Dios: una promesa que Hebreos 13:5 formula con el mismo verbo.',
    ],
    '2CO.4.10': [
      'Pablo lee sus sufrimientos a través de la historia de Jesús: lleva siempre en su cuerpo el morir (νέκρωσις) de Jesús, para que también la vida de Jesús se manifieste en él. La exposición diaria al peligro es una especie de muerte continua; su supervivencia y su perseverancia muestran al Cristo resucitado. Esto es unión con Cristo, no un añadido a la muerte expiatoria de Cristo.',
    ],
    '2CO.4.11': [
      'El versículo 11 repite el 10 con más claridad: aunque siguen vivos, Pablo y sus compañeros son entregados continuamente a la muerte por causa de Jesús. La finalidad es la misma, ahora con un adjetivo elocuente: la vida de Jesús manifestada en una carne mortal. La vida de la resurrección se muestra precisamente en lo que está muriendo.',
    ],
    '2CO.4.12': [
      'La muerte actúa en el apóstol; la vida, en los corintios. Los sufrimientos de Pablo no son algo privado; sirven a la iglesia, porque a través de su exposición al peligro el evangelio alcanza y fortalece a otros. Las notas de Tyndale relacionan esto con Colosenses 1:24, donde Pablo habla de sufrir por el cuerpo de Cristo.',
    ],
    '2CO.4.13': [
      'Pablo cita el Salmo 116:10 en su forma griega: creí, por lo cual hablé. En el salmo, el que habla añade que estaba muy afligido; Pablo reclama el mismo espíritu de fe, que sigue creyendo y sigue hablando bajo presión. Las notas de Tyndale llaman a esta fe el secreto de la resiliencia de Pablo.',
    ],
    '2CO.4.14': [
      'El contenido de la fe de Pablo: el Dios que resucitó a Jesús resucitará también a Pablo y lo llevará, junto con los corintios, a su presencia. La resurrección es el fundamento de la perseverancia. El sufrimiento no es el último capítulo, porque la tumba de Jesús tampoco lo fue.',
    ],
    '2CO.4.15': [
      'Pablo insiste en que todo lo que soporta es para el bien de los corintios. Sus dificultades sirven a una cadena de gracia: la gracia que alcanza a más personas, que provoca más acción de gracias, para gloria de Dios. El sufrimiento en el ministerio se sitúa dentro del propósito de Dios de extender la alabanza.',
    ],
    '2CO.4.16': [
      'Pablo repite las palabras de 4:1 —no desmayamos— de modo que enmarcan la mayor parte del capítulo. Mientras el hombre exterior se va desgastando por la edad y las dificultades, el interior se renueva cada día. Las notas de Tyndale observan que Pablo estaba agotado física y emocionalmente, pero su espíritu era revitalizado por el poder de Dios. La renovación es diaria, no de una vez para siempre.',
    ],
    '2CO.4.17': [
      'Pablo llama leve y momentánea a la tribulación presente, y dice que está produciendo un eterno peso de gloria más allá de toda comparación. Contrapone opuestos —levedad frente a peso, momentáneo frente a eterno, tribulación frente a gloria— y duplica su superlativo (literalmente, de exceso en exceso). No está llamando triviales a sus sufrimientos (véase 11:23–29); los está poniendo en la balanza frente a lo que producen. Algunos intérpretes perciben un eco hebreo, ya que kavod (gloria) está relacionado con una raíz que significa pesado, pero eso sigue siendo una sugerencia.',
    ],
    '2CO.4.18': [
      'Pablo mantiene la mirada en lo que no se ve más que en lo que se ve, porque lo que se ve es temporal y lo que no se ve es eterno. El verbo (σκοπέω) significa mirar con atención, mantener la atención fija en algo. Las notas de Tyndale lo dicen con sencillez: mirar solo los problemas presentes nos hace desfallecer, pero ver la vida a la luz de la realidad eterna muestra que los problemas pasarán.',
    ],
  },
  concepts: {
    'suffering:c:why-god-allows': {
      label: 'Por qué Dios permite el sufrimiento',
      aliases: [
        'por qué dios permite el sufrimiento',
        'por qué dios permite el mal',
        'por qué permite dios el sufrimiento',
        'por qué permite dios el mal',
        'por qué dios deja que pasen cosas malas',
        'por qué pasan cosas malas',
        'por qué le pasan cosas malas a la gente buena',
        'problema del mal',
        'el problema del mal',
        'problema del dolor',
        'teodicea',
        'teodiceas',
        'si dios es bueno',
        'por qué el sufrimiento',
        'por qué sufrimos',
        'por qué a mí',
        'libre albedrío',
        'defensa del libre albedrío',
        'formación del alma',
        'privación del bien',
        'dios permite el mal',
        'es dios el autor del mal',
        'es dios responsable del mal',
        'controla dios el mal',
        'soberanía y mal',
        'soberanía de dios y el mal',
        'simple permiso',
        'visión católica del sufrimiento',
        'visión wesleyana del sufrimiento',
        'visión arminiana del sufrimiento',
        'visión reformada del sufrimiento',
        'visión ortodoxa del sufrimiento',
      ],
      answer:
        'La Escritura no da una única respuesta ordenada, pero sí verdades firmes: Dios es bueno y soberano; el pecado y la muerte entraron en su buen mundo por la rebelión humana; el sufrimiento no siempre es castigo; y Dios ha entrado en nuestro sufrimiento en Cristo y le pondrá fin. Los cristianos han explicado de maneras distintas por qué Dios permite el mal —el bien que Agustín ve surgir del mal, el énfasis ireneano en el crecimiento, el acento reformado en los propósitos soberanos de Dios, el énfasis católico y wesleyano en la libertad que Dios dio a sus criaturas, la defensa del libre albedrío y el foco ortodoxo en la victoria de Cristo sobre la muerte—, y la sección de Teología los presenta lado a lado, incluidos los puntos en que las tradiciones difieren de verdad.',
    },
    'suffering:c:affliction': {
      label: 'La tribulación (θλῖψις)',
      aliases: [
        'aflicción',
        'aflicciones',
        'afligido',
        'afligidos',
        'tribulación',
        'tribulaciones',
        'atribulados',
        'problemas',
        'angustia',
        'presión',
        'tribulación leve',
        'leve tribulación',
        'tribulación momentánea',
        'qué significa tribulación',
        'qué significa thlipsis',
      ],
      answer:
        'La palabra griega que hay detrás de tribulación en 4:17 es θλῖψις (thlipsis, Strong G2347): literalmente presión y, en sentido figurado, aflicción o angustia. Según nuestro recuento aparece 45 veces en el Nuevo Testamento —9 de ellas en 2 Corintios, más que en ningún otro libro—, y su verbo emparentado abre la lista de dificultades de 4:8 (atribulados). Pablo llama leve y momentánea a esta tribulación solo porque la pone en la balanza frente a un eterno peso de gloria.',
    },
    'suffering:c:jars-of-clay': {
      label: 'Vasos de barro',
      aliases: [
        'vasos de barro',
        'vaso de barro',
        'vasijas de barro',
        'vasija de barro',
        'vasos de arcilla',
        'tesoro en vasos de barro',
        'este tesoro',
        'tesoro',
        'debilidad',
        'frágil',
        'fragilidad',
        'cerámica',
        'qué significa vasos de barro',
      ],
      answer:
        'En 4:7 el tesoro es la luz del evangelio de 4:6, y los vasos de barro (ὀστράκινος, de barro) son los frágiles cuerpos y ministerios humanos. Pablo dice que Dios lo dispuso así para que la extraordinaria grandeza del poder fuera claramente de Dios y no nuestra. Corinto era famosa por sus lámparas de terracota, y los tesoros solían guardarse en vasijas de barro, de modo que la imagen era vívida; comentaristas antiguos sugirieron también una alusión a los cántaros de Gedeón, aunque Pablo no lo dice.',
    },
    'suffering:c:lament': {
      label: 'El lamento y el “¿hasta cuándo?”',
      aliases: [
        'lamento',
        'lamentos',
        'lamentarse',
        'hasta cuándo',
        'hasta cuándo señor',
        'queja',
        'quejarse ante dios',
        'quejarse a dios',
        'puedo enojarme con dios',
        'puedo enfadarme con dios',
        'enojado con dios',
        'enfadado con dios',
        'salmo 13',
        'salmo 88',
        'lamentaciones',
        'habacuc',
        'duelo',
        'llorar una pérdida',
      ],
      answer:
        'El lamento es la oración que lleva ante Dios el dolor, la protesta y las preguntas. El “hasta cuándo” de la Biblia (en hebreo עַד־אָנָה, literalmente ¿hasta dónde?) aparece cuatro veces solo en el Salmo 13:1–2, y el Salmo 88 incluso termina en tinieblas; y, sin embargo, ambos se dirigen a Dios. La Escritura trata la queja sincera como una forma de fe, y Jesús mismo oró con un lamento desde la cruz.',
    },
    'suffering:c:despair': {
      label: 'Perplejos, pero no desesperados',
      aliases: [
        'desesperación',
        'desesperado',
        'desesperados',
        'no desesperados',
        'perplejos',
        'perplejo',
        'sin esperanza',
        'desesperanza',
        'depresión',
        'aplastado',
        'aplastados',
        'sin salida',
        'perder la esperanza de vivir',
      ],
      answer:
        'En 4:8 Pablo dice que está perplejo (ἀπορέω, sin saber qué hacer), pero no desesperado (ἐξαπορέω, completamente sin salida): un juego de palabras griego. El segundo verbo aparece solo otra vez en el Nuevo Testamento, en 1:8, donde Pablo admite que en Asia llegaron a perder incluso la esperanza de vivir. Así pues, el “no desesperamos” no es la pretensión de una calma constante; es el testimonio de que la desesperación no tuvo la última palabra, porque aprendieron a confiar en el Dios que resucita a los muertos.',
    },
    'suffering:c:lose-heart': {
      label: 'No desmayar',
      aliases: [
        'desmayar',
        'no desmayamos',
        'no desmayar',
        'desanimarse',
        'desánimo',
        'desanimado',
        'desalentado',
        'desaliento',
        'rendirse',
        'darse por vencido',
        'tirar la toalla',
        'perseverancia',
        'perseverar',
        'aguante',
        'se renueva de día en día',
        'hombre interior',
        'hombre exterior',
      ],
      answer:
        'No desmayamos (ἐκκακέω, G1573) enmarca la mayor parte de 2 Corintios 4: aparece en 4:1 y en 4:16. Las razones de Pablo son la misericordia de Dios al llamarlo (4:1), la renovación diaria del hombre interior aunque el exterior se vaya desgastando (4:16) y la gloria eterna que supera a la tribulación presente (4:17). El mismo verbo aparece en la llamada de Jesús a orar siempre y no desanimarse (Lc 18:1).',
    },
    'suffering:c:weight-of-glory': {
      label: 'El peso de gloria',
      aliases: [
        'peso de gloria',
        'eterno peso de gloria',
        'gloria',
        'peso',
        'cielo',
        'eterno',
        'lo que no se ve',
        'las cosas que no se ven',
        'lo invisible',
        'mirar lo que no se ve',
        'qué significa peso de gloria',
      ],
      answer:
        'En 4:17 Pablo contrapone la levedad de la tribulación presente a un eterno peso (βάρος) de gloria, de exceso en exceso. Una antigua línea de interpretación, recogida en la edición de la Calvin Translation Society, percibe aquí el hebreo kavod (gloria), relacionado con una raíz que significa pesado: una sugerencia atractiva, pero no demostrada. En cualquier caso, el sentido es claro: lo que no se ve y es eterno pesa más que lo que se ve y es temporal (4:18).',
    },
    'suffering:c:death-and-life': {
      label: 'Llevar la muerte de Jesús',
      aliases: [
        'muerte de jesús',
        'la muerte de jesús',
        'el morir de jesús',
        'vida de jesús',
        'unión con cristo',
        'participación en sus padecimientos',
        'participar de sus padecimientos',
        'participar en sus sufrimientos',
        'padecer con cristo',
        'sufrir con cristo',
        'cuerpo mortal',
        'carne mortal',
        'la muerte obra en nosotros',
        'colosenses 1:24',
        'lo que falta de las aflicciones de cristo',
        'sufrimiento redentor',
        'participar de los sufrimientos de cristo',
      ],
      answer:
        'Pablo describe sus sufrimientos como llevar consigo el morir (νέκρωσις) de Jesús para que la vida de Jesús se manifieste en su cuerpo mortal (4:10–11). Es unión con Cristo: los creyentes comparten el patrón de su muerte y el poder de su resurrección (Flp 3:10; 1 P 4:13). Los cristianos coinciden en que esto no añade nada a su obra expiatoria única —como dicen las notas de Tyndale sobre Colosenses 1:24, el sufrimiento redentor de Cristo es único y está consumado—, aunque las tradiciones describen de maneras distintas la participación de los creyentes en sus sufrimientos: Calvino hablaba de Cristo sufriendo en sus miembros para fortalecimiento de la iglesia, mientras que la enseñanza católica (Salvifici Doloris) habla de que los creyentes participan en el sufrimiento redentor de Cristo.',
    },
    'suffering:c:punishment': {
      label: '¿Es el sufrimiento un castigo?',
      aliases: [
        'castigo',
        'castigado',
        'me está castigando dios',
        'dios me está castigando',
        'es un castigo de dios',
        'me lo merecía',
        'merecer',
        'lo merezco',
        'karma',
        'retribución',
        'quién pecó',
        'los amigos de job',
        'amigos de job',
        'la torre de siloé',
        'torre de siloé',
        'ciego de nacimiento',
        'nació ciego',
        'cosas malas a gente buena',
      ],
      answer:
        'La Escritura afirma que el pecado tiene consecuencias, pero niega una y otra vez que toda calamidad sea un veredicto sobre sus víctimas. Los amigos de Job insistían en que su sufrimiento tenía que ser un castigo, y el libro les quita la razón; Jesús dijo a sus discípulos que la ceguera de un hombre no se debía a su pecado ni al de sus padres (Jn 9:3), y afirmó que las víctimas de Pilato y de la torre de Siloé no eran más pecadoras que los demás (Lc 13:1–5).',
    },
    'suffering:c:purpose': {
      label: 'Los propósitos de Dios en el sufrimiento',
      aliases: [
        'propósito',
        'propósito del sufrimiento',
        'tiene sentido el sufrimiento',
        'tiene propósito el sufrimiento',
        'para qué sirve el sufrimiento',
        'qué está haciendo dios',
        'refinar',
        'refinamiento',
        'refinados',
        'horno',
        'horno de aflicción',
        'paciencia',
        'carácter',
        'disciplina',
        'pruebas',
        'prueba',
        'probados',
        'produce',
        'dios lo encaminó a bien',
        'lo encaminó a bien',
      ],
      answer:
        'El Nuevo Testamento dice repetidamente que la aflicción produce algo. Romanos 5:3, Santiago 1:3 y 2 Corintios 4:17 usan el mismo verbo griego (κατεργάζομαι): la tribulación produce paciencia y esperanza, la prueba produce perseverancia y la tribulación presente está produciendo un eterno peso de gloria. Las palabras de José —ustedes pensaron mal, Dios lo encaminó a bien (Gn 50:20)— muestran que el propósito de Dios no convierte el mal en bueno; lo domina y lo reconduce.',
    },
    'suffering:c:suffering-god': {
      label: 'Dios con nosotros en el sufrimiento',
      aliases: [
        'sufre dios',
        'puede dios sufrir',
        'dios sufre',
        'un dios que sufre',
        'impasibilidad',
        'es dios impasible',
        'siente dios dolor',
        'dónde está dios',
        'dónde estaba dios',
        'dios con nosotros',
        'emanuel',
        'desamparado',
        'por qué me has desamparado',
        'dios mío dios mío',
        'teología de la cruz',
        'la cruz',
        'varón de dolores',
        'se compadece',
      ],
      answer:
        'La respuesta más profunda de la Escritura al sufrimiento es que Dios ha entrado en él. El Siervo de Isaías es varón de dolores, Jesús clama desde la cruz con las palabras del Salmo 22 y Hebreos dice que se compadece de nuestras debilidades. En 4:9 Pablo es perseguido, pero no desamparado, y usa el mismo verbo que el clamor de Jesús al sentirse desamparado. La teología de la cruz de Lutero y el capítulo de John Stott sobre el sufrimiento sostienen ambos que la cruz es el lugar donde Dios se ve de verdad. La teología cristiana clásica sitúa este sufrimiento en el Hijo encarnado, que sufrió en su naturaleza humana —la Confesión de Westminster, por ejemplo, confiesa que Dios no tiene cuerpo, partes ni pasiones (2.1)—, y hasta qué punto puede hablarse de sufrimiento en Dios mismo es una cuestión debatida entre los teólogos.',
    },
    'suffering:c:hope': {
      label: 'La esperanza más allá del sufrimiento',
      aliases: [
        'esperanza',
        'no más lágrimas',
        'ya no habrá llanto',
        'enjugará toda lágrima',
        'nueva creación',
        'cielo nuevo y tierra nueva',
        'cielos nuevos y tierra nueva',
        'resurrección',
        'terminará el sufrimiento',
        'acabará el sufrimiento',
        'se acabará',
        'vida después de la muerte',
        'vida eterna',
        'gloria futura',
        'apocalipsis 21',
      ],
      answer:
        'La esperanza cristiana no niega el dolor presente; lo pone en la balanza. Pablo fundamenta la perseverancia en la resurrección (2 Co 4:14) y en un eterno peso de gloria (4:17); Romanos 8:18 dice que los sufrimientos del tiempo presente no son comparables con la gloria venidera; y Apocalipsis 21 describe a Dios habitando con su pueblo, toda lágrima enjugada y la muerte desaparecida. La Biblia no termina con una explicación del sufrimiento, sino con su final.',
    },
  },
};

export default overlay;
