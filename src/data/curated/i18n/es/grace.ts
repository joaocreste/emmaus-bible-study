/**
 * Spanish overlay — Grace (“La gracia”), anchored in Ephesians 2:1–10.
 *
 * Scripture words inside quotation marks follow the Reina-Valera 1909 (the default Spanish
 * version) verbatim; other Scripture allusions are paraphrased without quotation marks.
 * Anchors were checked against the RVR1909, BLM and VBL text of Ephesians 2 (bible.helloao.org).
 * Verified quotations keep their English words; only a free translation is added here.
 */
import type { StudyOverlay } from '../types';

const E2 = (verse: number) => ({ book: 'EPH', chapter: 2, verse });

const OT = 'La gracia en el Antiguo Testamento';
const CHRIST = 'La gracia revelada en Cristo';
const SAVED = 'Salvos por gracia';
const LIVING = 'Vivir por la gracia';

const overlay: StudyOverlay = {
  studyId: 'grace',
  locale: 'es',
  title: 'La gracia',
  subtitle: 'El favor inmerecido de Dios en Cristo',
  summary:
    'Este estudio sigue una de las palabras más ricas de la Biblia —la gracia— desde el lenguaje veterotestamentario del favor y del amor leal hasta su expresión más plena en Jesucristo. Se centra en Efesios 2:1–10, donde Pablo pasa de la situación de la humanidad, a través del giro «Empero Dios», a una salvación que viene por gracia, por medio de la fe, como don de Dios y no como salario. Por el camino examina las principales palabras hebreas y griegas, explica qué significaba charis en un mundo de patronos y benefactores, y muestra cómo la gracia produce una nueva manera de vivir (2:10). También expone, con la mayor imparcialidad posible, en qué coinciden las tradiciones cristianas acerca de la gracia y en qué han discrepado durante siglos.',
  opening:
    'La gracia está en el corazón de la fe cristiana, y pocos pasajes lo dicen con más claridad que Efesios 2:1–10: aquí al lado está abierto, con las palabras clave señaladas. También he reunido el trasfondo del Antiguo Testamento, el griego que hay detrás de «gracia», lo que habrían oído los primeros lectores y voces que van de Agustín a Tim Keller. ¿Por dónde empezamos: por el significado de la palabra, por el argumento de Pablo en estos versículos o por la manera en que la gracia transforma una vida?',
  matchTopics: [
    'gracia',
    'la gracia',
    'la gracia de dios',
    'gracia de dios',
    'favor inmerecido',
    'qué es la gracia',
    'que es la gracia',
    'salvos por gracia',
    'salvados por gracia',
    'por gracia sois salvos',
    'sublime gracia',
    'charis',
    'qué dice la biblia sobre la gracia',
    'que dice la biblia sobre la gracia',
    'qué enseña la biblia sobre la gracia',
  ],
  suggestedQuestions: [
    '¿Qué palabra griega hay detrás de «gracia»?',
    '¿Qué quiere decir Pablo aquí con «carne»?',
    'Explicar el versículo 8 con más detalle',
    '¿Cómo habrían entendido la gracia los primeros destinatarios?',
    '¿Dónde más habla Pablo de ser salvos por gracia?',
    '¿Cómo se relaciona esto con Romanos?',
    '¿Cómo encaja Efesios 2:10 con Santiago 2?',
    '¿Qué dijo Tim Keller sobre la gracia?',
    '¿Hay distintas interpretaciones teológicas de este pasaje?',
  ],
  topic: {
    name: 'La gracia',
    question: '¿Qué entiende la Biblia por gracia?',
    definition:
      'En la Escritura, la gracia es el favor libre e inmerecido de Dios hacia personas que no tienen ningún derecho a él, junto con los dones que brotan de ese favor. Israel aprendió su vocabulario mucho antes que Pablo: chen (favor), chanan (ser clemente) y hesed (amor leal y constante) describen a un Dios que se reveló como clemente y compasivo (Éx 34:6–7) y que escogió a Israel por puro amor, no por mérito (Dt 7:7–8). En el Nuevo Testamento, el griego charis nombra lo que Dios ha hecho en Cristo: los pecadores son justificados gratuitamente por su gracia (Ro 3:24) y salvados por gracia por medio de la fe, como un don y no por obras (Ef 2:8–9). La gracia es también poder: enseña a los creyentes a vivir piadosamente (Tit 2:11–12), los sostiene en la debilidad (2 Co 12:9) y da forma a una nueva manera de andar (Ef 2:10).',
  },
  topicPassages: {
    'grace:kp:gen-6-8': {
      title: 'Noé halló gracia',
      group: OT,
      note: 'El primer uso bíblico de chen (favor). Sobre un fondo de corrupción universal (6:5–7), el narrador menciona el favor del SEÑOR hacia Noé antes de describir su justicia en la nueva sección que comienza en 6:9 («Estas son las generaciones de Noé»). Muchos lectores ven aquí un primer indicio de que el rescate comienza con la disposición de Dios y no con el logro humano, aunque la expresión hallar gracia a los ojos de alguien puede, en otros lugares, seguir a una conducta observada (Gn 39:4).',
    },
    'grace:kp:exod-34-6': {
      title: 'El SEÑOR, clemente y compasivo',
      group: OT,
      note: 'La descripción que Dios hizo de sí mismo ante Moisés después del becerro de oro: compasivo, clemente (channun), grande en amor leal (hesed) y en fidelidad, que perdona la iniquidad, pero que no pasa por alto la culpa. Esta confesión resuena en todo el Antiguo Testamento (Sal 103:8; Jon 4:2) y es la tierra en la que crece el lenguaje neotestamentario de la gracia.',
    },
    'grace:kp:deut-7-7': {
      title: 'Escogidos porque él os amó',
      group: OT,
      note: 'Moisés niega que Israel fuera escogido por su tamaño o su fuerza; la única razón que se da es que el SEÑOR los amó y quiso guardar su juramento. Una elección basada en el amor de Dios y no en el valor de quienes la reciben es gracia, aunque no se use la palabra.',
    },
    'grace:kp:ps-103-8': {
      title: 'No nos trata conforme a nuestros pecados',
      group: OT,
      note: 'David canta la confesión de Éxodo 34 (103:8) y desarrolla su sentido: Dios no nos ha pagado conforme a nuestras iniquidades, ha alejado de nosotros nuestras rebeliones cuanto está lejos el oriente del occidente, y se compadece de nosotros como un padre se compadece de sus hijos, porque se acuerda de que somos polvo.',
    },
    'grace:kp:jonah-4-2': {
      title: 'Enojado por la gracia',
      group: OT,
      note: 'Jonás cita la misma confesión —clemente, piadoso, de grande misericordia— como queja: huyó porque sabía que Dios perdonaría a Nínive. La gracia ofende cuando alcanza a personas que consideramos indignas, un tema que Jesús subraya en la parábola del hermano mayor (Lc 15:25–32).',
    },
    'grace:kp:john-1-14': {
      title: 'Lleno de gracia y de verdad',
      group: CHRIST,
      note: 'El Verbo hecho carne está lleno de gracia y de verdad, y de su plenitud recibimos gracia sobre gracia. Juan contrasta la ley dada por medio de Moisés con la gracia y la verdad que vinieron por medio de Jesucristo; no descarta la ley como algo malo, sino que presenta a Cristo como la revelación más plena del favor de Dios.',
    },
    'grace:kp:2-cor-8-9': {
      title: 'Por amor de vosotros se hizo pobre',
      group: CHRIST,
      note: 'Pablo define la gracia de nuestro Señor Jesucristo como un intercambio costoso: siendo rico, se hizo pobre para que nosotros fuéramos enriquecidos. Aquí la gracia no es una actitud abstracta, sino un acto de entrega de sí mismo.',
    },
    'grace:kp:luke-15': {
      title: 'El padre y sus dos hijos',
      group: CHRIST,
      note: 'Jesús la cuenta a fariseos que murmuraban porque él recibía a los pecadores (15:1–2). El padre corre hacia el hijo menor que vuelve y también sale a rogar al hijo mayor, lleno de resentimiento. La gracia sale al encuentro tanto del abiertamente rebelde como del cumplidor que cree haberse ganado su lugar.',
    },
    'grace:kp:matt-20': {
      title: 'El propietario generoso',
      group: CHRIST,
      note: 'Los obreros contratados a última hora reciben el mismo salario que quienes trabajaron todo el día. La respuesta del propietario —¿no me es lícito hacer lo que quiero con lo mío?— desenmascara el instinto de medir los dones de Dios por nuestro trabajo.',
    },
    'grace:kp:eph-2-1': {
      title: 'Por gracia sois salvos',
      group: SAVED,
      note: 'El pasaje central de este estudio. Pablo pasa de la muerte espiritual (2:1–3) a la intervención de Dios (2:4–7), resume la salvación como por gracia, por medio de la fe, don de Dios y no por obras (2:8–9), y termina con la nueva vida de buenas obras que Dios ha preparado (2:10).',
    },
    'grace:kp:rom-3-21': {
      title: 'Justificados gratuitamente por su gracia',
      group: SAVED,
      note: 'Puesto que todos pecaron (3:23), la justicia de Dios debe venir aparte de la ley, por medio de la fe en Jesucristo. Los creyentes son justificados como un don (dōrean) por su gracia, mediante la redención que es en Cristo, a quien Dios presentó como propiciación.',
    },
    'grace:kp:rom-5-15': {
      title: 'Cuando el pecado creció, sobrepujó la gracia',
      group: SAVED,
      note: 'Pablo contrasta el delito de Adán con el don de Cristo: el don no es como el delito. La gracia no se limita a igualar al pecado; lo desborda, de modo que la gracia reina por la justicia para vida eterna.',
    },
    'grace:kp:rom-11-5': {
      title: 'De otra manera la gracia ya no es gracia',
      group: SAVED,
      note: 'Un remanente es escogido por gracia, y Pablo saca la conclusión lógica: si es por gracia, ya no es por obras. Mezclar ambas cosas vaciaría la gracia de su sentido.',
    },
    'grace:kp:gal-2-21': {
      title: 'No desecho la gracia de Dios',
      group: SAVED,
      note: 'Si la justicia viniera por la ley, Cristo habría muerto en vano (dōrean, la misma palabra que en Ro 3:24 significa «gratuitamente»). Pablo rechaza cualquier camino hacia la justicia que haga innecesaria la cruz.',
    },
    'grace:kp:titus-3-4': {
      title: 'No por obras de justicia, sino por su misericordia',
      group: SAVED,
      note: 'Un paralelo cercano a Efesios 2: se manifestaron la bondad y el amor de Dios; él nos salvó no por las obras de justicia que hubiéramos hecho, sino por su misericordia, mediante el lavamiento de la regeneración y la renovación del Espíritu Santo, para que, justificados por su gracia, llegáramos a ser herederos.',
    },
    'grace:kp:rom-6-1': {
      title: '¿Perseveraremos en pecado para que la gracia crezca?',
      group: LIVING,
      note: 'Pablo anticipa el abuso de la gracia y lo rechaza: los creyentes murieron al pecado con Cristo en el bautismo y ahora andan en novedad de vida. El pecado no se enseñoreará de ellos, precisamente porque no están bajo la ley, sino bajo la gracia (6:14).',
    },
    'grace:kp:titus-2-11': {
      title: 'La gracia que enseña',
      group: LIVING,
      note: 'La gracia de Dios que trae salvación enseña también a los creyentes a renunciar a la impiedad y a vivir con sobriedad, justicia y piedad mientras aguardan la manifestación de Cristo. La gracia es maestra además de don, y forma un pueblo celoso de buenas obras.',
    },
    'grace:kp:2-cor-12-9': {
      title: 'Bástate mi gracia',
      group: LIVING,
      note: 'Al no ser librado de su aguijón en la carne, Pablo recibe en su lugar una promesa: la gracia de Cristo basta, y su poder se perfecciona en la debilidad. La gracia no es solo el comienzo de la vida cristiana, sino su fuerza diaria.',
    },
    'grace:kp:heb-4-16': {
      title: 'El trono de la gracia',
      group: LIVING,
      note: 'Porque Jesús es un sumo sacerdote que se compadece, los creyentes pueden acercarse confiadamente al trono de Dios —llamado aquí trono de la gracia— para alcanzar misericordia y hallar gracia para el oportuno socorro.',
    },
    'grace:kp:1-pet-4-10': {
      title: 'Administradores de la multiforme gracia de Dios',
      group: LIVING,
      note: 'Cada creyente ha recibido un don (charisma) y debe usarlo para servir a los demás como buen administrador de la multiforme gracia de Dios. La gracia recibida se convierte en gracia compartida.',
    },
  },
  keyWords: {
    'grace:kw:charis': {
      english: 'gracia',
      basicMeaning: 'gracia; favor, bondad, benevolencia',
      semanticRange: [
        'favor o benevolencia por parte de quien da; en el Nuevo Testamento, sobre todo el favor libre de Dios',
        'un don o una prueba concreta de favor',
        'gratitud, acción de gracias (la respuesta de quien recibe)',
        'gracia, encanto (p. ej., en el hablar)',
        'un estado de gracia en el que los creyentes están firmes',
      ],
      grammar: 'Sustantivo, dativo singular femenino (χάριτι, «por gracia») en 2:5 y 2:8; genitivo singular (χάριτος) en 2:7',
      significance:
        'Charis aparece 155 veces en el Nuevo Testamento griego NA28 (156 en la concordancia de la aplicación, que cuenta también Ro 16:24, un versículo que figura en el Textus Receptus y en el texto bizantino, pero no en NA28), 12 de ellas en Efesios y tres en este pasaje (2:5, 7, 8). Aquí nombra el favor de Dios como única fuente del rescate: los muertos no pueden contribuir a su propia resurrección (2:5), las riquezas de ese favor se mostrarán en los siglos venideros (2:7) y ese favor excluye todo motivo de jactancia (2:8–9). En el mundo de Pablo, la misma palabra podía nombrar también el don y el agradecimiento que este reclamaba (véase el contexto histórico), y el propio Pablo pasa directamente de la gracia a las buenas obras de 2:10; pero ese vínculo procede de su argumento, no de los otros sentidos de la palabra.',
      caution:
        'Charis no es un término técnico con un único sentido fijo: en Lucas 17:9 significa «gracias», y en Colosenses 4:6 describe una manera de hablar agradable. Su fuerza en Efesios 2 procede del argumento de Pablo (la gracia contrapuesta a las obras, 2:8–9), no de la palabra por sí sola.',
      notableNotes: [
        'Gracia por gracia de la plenitud de Cristo; la gracia y la verdad vinieron por medio de Jesucristo.',
        'Justificados gratuitamente (dōrean) por su gracia (charis): el paralelo más cercano a Ef 2:8.',
        'Al que obra, el salario no se le cuenta como gracia (kata charin), sino como deuda: la gracia es lo contrario de la deuda.',
        'Si es por gracia, ya no es por obras; de otra manera, la gracia ya no es gracia.',
        'Los creyentes tienen entrada a «esta gracia en la cual estamos firmes»: la gracia como un estado estable.',
        'Charis con el sentido de «gracias»: «Gracias á Dios por su don inefable».',
        'La gracia de Cristo basta; su poder se perfecciona en la debilidad.',
      ],
      anchors: [
        { verse: E2(5), phrases: { RVR1909: 'gracia', BLM: 'gracia' } },
        { verse: E2(7), phrases: { RVR1909: 'gracia', BLM: 'gracia', VBL: 'gracia' } },
        { verse: E2(8), phrases: { RVR1909: 'gracia', BLM: 'gracia', VBL: 'gracia' } },
      ],
    },
    'grace:kw:eleos': {
      english: 'misericordia',
      basicMeaning: 'misericordia, piedad, compasión',
      semanticRange: [
        'la misericordia que unas personas muestran a otras (Mt 9:13; Lc 10:37)',
        'la misericordia de Dios hacia los necesitados y hacia quienes no la merecen',
        'la misericordia de Cristo (Jud 21)',
        'la misericordia invocada en saludos y bendiciones (1 Ti 1:2; 2 Jn 3)',
      ],
      grammar: 'Sustantivo, dativo singular neutro (ἐλέει) tras ἐν: «rico en misericordia» (2:4)',
      significance:
        'Pablo arraiga el rescate de Dios en dos rasgos de Dios mismo: es rico en misericordia y actúa movido por su mucho amor (2:4). La misericordia mira a la miseria de 2:1–3; la gracia, al don inmerecido de 2:5–8. En el Antiguo Testamento griego, eleos traduce sobre todo hesed, de modo que «rico en misericordia» se inscribe en la larga confesión de Israel sobre un Dios grande en amor leal (Éx 34:6). Eleos aparece 27 veces en NA28.',
      caution:
        'La distinción nítida según la cual la misericordia retiene lo que merecemos y la gracia da lo que no merecemos es un resumen útil, pero los autores bíblicos usan a menudo ambas palabras juntas (Tit 3:5–7; Heb 4:16) sin trazar una línea tajante.',
      notableNotes: [
        'Nos salvó no por obras de justicia, sino «por su misericordia»: un paralelo cercano a Ef 2:4–9.',
        'Jesús cita Os 6:6 («Misericordia quiero, y no sacrificio»); el hebreo dice hesed, y el griego, eleos.',
        'Los «vasos de misericordia» que Dios preparó de antemano para gloria.',
        'El cántico de María: su misericordia es de generación en generación para los que le temen.',
        'Ante el trono de la gracia alcanzamos misericordia y hallamos gracia.',
      ],
      anchors: [{ verse: E2(4), phrases: { RVR1909: 'misericordia', BLM: 'misericordia', VBL: 'misericordia' } }],
    },
    'grace:kw:sozo': {
      english: 'salvos',
      basicMeaning: 'salvar, rescatar, librar; sanar',
      semanticRange: [
        'rescatar de un peligro, un daño o la muerte (Mt 8:25)',
        'sanar, devolver la salud (Mr 5:34)',
        'salvar del pecado y de sus consecuencias; dicho como algo pasado, presente o futuro',
      ],
      grammar:
        'Participio perfecto pasivo, nominativo plural masculino (σεσῳσμένοι), con ἐστε (presente, «sois»): un perfecto perifrástico, «sois personas que han sido salvadas» (2:5, 2:8)',
      significance:
        'Sōzō aparece 106 veces en NA28 (107 en la concordancia de la aplicación, que cuenta también Mt 18:11, un versículo que solo figura en el Textus Receptus y en el texto bizantino), pero el participio perfecto σεσῳσμένοι aparece únicamente aquí, en 2:5 y 2:8 (TAGNT). El perfecto presenta la salvación como un acto consumado con resultados duraderos: los que estaban muertos son ahora, y siguen siendo, personas rescatadas. En otros lugares, Pablo habla de la salvación como algo pasado, en curso y todavía futuro (Ro 8:24; 1 Co 1:18; Ro 5:9–10); Efesios subraya su realidad presente y firme, y por eso Pablo puede decir que los creyentes ya han sido resucitados y sentados con Cristo (2:6).',
      caution:
        'El tiempo perfecto describe la situación presente de los lectores tal como Pablo la ve; no zanja por sí mismo los debates posteriores sobre la seguridad de la salvación o la perseverancia, que se apoyan en muchos otros textos.',
      notableNotes: [
        'Aoristo: en esperanza fuimos salvados.',
        'Presente: para nosotros, los que nos salvamos, la palabra de la cruz es potencia de Dios.',
        'Futuro: «mucho más… seremos salvos» de la ira y por su vida.',
        'Perfecto de indicativo: «Tu fe te ha salvado»; la fe vinculada a un rescate consumado.',
        'Aoristo: «por su misericordia nos salvó».',
      ],
      anchors: [
        { verse: E2(5), phrases: { RVR1909: 'sois salvos', BLM: 'habéis sido salvados', VBL: 'los ha salvado' } },
        { verse: E2(8), phrases: { RVR1909: 'sois salvos', BLM: 'habéis sido salvados', VBL: 'han sido salvos' } },
      ],
    },
    'grace:kw:pistis': {
      english: 'fe',
      basicMeaning: 'fe, creencia, confianza',
      semanticRange: [
        'fe, confianza (en el Nuevo Testamento, en Dios o en Cristo)',
        'creencia, convicción',
        'fidelidad, lealtad (Ro 3:3; Gá 5:22)',
        'una promesa de fidelidad (1 Ti 5:12)',
      ],
      grammar: 'Sustantivo, genitivo singular femenino (πίστεως) tras διά: «por medio de la fe» (2:8)',
      significance:
        'Pablo dice que somos salvos por gracia (un dativo simple: la gracia es lo que salva) por medio de la fe (διά con genitivo: el cauce por el que se recibe), y usa ἐκ, «de», solo para negar otras fuentes: «no de vosotros… No por obras» (2:8–9). La fe recibe en lugar de ganar; por eso encaja con «No por obras» (2:9) y por eso queda excluida la jactancia. Pistis aparece 243 veces en NA28 —40 en Romanos, 22 en Gálatas, 16 en Santiago—, de modo que la relación entre la fe y las obras es una conversación que recorre todo el Nuevo Testamento, no un solo versículo.',
      caution:
        'Los estudiosos debaten si la expresión paulina pistis Christou significa la fe en Cristo o la propia fidelidad de Cristo (p. ej., Ro 3:22); Ef 2:8 no contiene esa expresión y nombra simplemente la confianza del creyente.',
      notableNotes: [
        'La justicia de Dios viene por la fe en Jesucristo a todos los que creen.',
        'Justificados por la fe, tenemos entrada por la fe a esta gracia.',
        'La vida que vivo, la vivo por la fe en el Hijo de Dios, que me amó.',
        'La fe como la certeza de lo que se espera.',
        'La fe sin obras está muerta: el desafío de Santiago a una fe meramente de palabra.',
      ],
      anchors: [{ verse: E2(8), phrases: { RVR1909: 'la fe', BLM: 'la fe', VBL: 'la fe' } }],
    },
    'grace:kw:doron': {
      english: 'don',
      basicMeaning: 'don, regalo',
      semanticRange: [
        'un don o un regalo (Mt 2:11)',
        'una ofrenda presentada a Dios (Mt 5:23–24; Heb 5:1)',
        'el don de Dios a las personas (Ef 2:8)',
      ],
      grammar:
        'Sustantivo, nominativo singular neutro (δῶρον) en 2:8, en la expresión θεοῦ τὸ δῶρον («de Dios [es] el don»), con θεοῦ antepuesto por énfasis',
      significance:
        'De los 19 usos de dōron en NA28, la mayoría describen ofrendas que las personas presentan a Dios; Ef 2:8 invierte la dirección y hace de Dios el dador. Pablo, con otra palabra, charisma (de charis), dice algo semejante en Ro 6:23: la dádiva de Dios es vida eterna. «Esto» (τοῦτο) en 2:8 es neutro y no concuerda con los sustantivos femeninos gracia y fe, por lo que muchos intérpretes lo refieren a todo el acontecimiento —ser salvos por gracia por medio de la fe— como don de Dios y no como logro nuestro.',
      caution:
        'Desde la iglesia antigua se discute si «esto» se refiere específicamente a la fe: Crisóstomo y Agustín incluían la fe en el don, mientras que Calvino entendía que el don es la salvación misma. La gramática admite una referencia al conjunto.',
      notableNotes: [
        'Los dones de los magos: oro, incienso y mirra.',
        'Una ofrenda presentada en el altar: el sentido habitual de dōron como ofrenda a Dios.',
        'El sumo sacerdote ofrece «presentes y sacrificios por los pecados».',
        'Los ricos echaban sus ofrendas (dōra) en el tesoro del templo, ofrendas a Dios, junto a las dos blancas de la viuda.',
      ],
      anchors: [{ verse: E2(8), phrases: { RVR1909: 'don', BLM: 'don', VBL: 'regalo' } }],
    },
    'grace:kw:poiema': {
      english: 'hechura',
      basicMeaning: 'lo que se hace, una obra',
      semanticRange: [
        'una cosa hecha, una obra',
        'las obras de Dios en la creación (Ro 1:20)',
        'la nueva creación de Dios en Cristo (Ef 2:10)',
      ],
      grammar:
        'Sustantivo, nominativo singular neutro (ποίημα), predicado de ἐσμεν —«somos [su] hechura»—, con αὐτοῦ («su») antepuesto por énfasis (2:10)',
      significance:
        'Poiēma aparece solo dos veces en el Nuevo Testamento: referido a la creación en Ro 1:20 y a los creyentes aquí. El paralelo es sugerente: el Dios que hizo el mundo ha hecho un pueblo nuevo, «criados en Cristo Jesús» (2:10), lo que evoca el lenguaje paulino de la nueva creación (2 Co 5:17). Las buenas obras no son la materia prima de la salvación, sino el propósito de la nueva hechura de Dios. En el Antiguo Testamento griego, poiēma traduce sobre todo ma‘aseh, «obra, hecho».',
      caution:
        'La enseñanza popular traduce a veces poiēma como «obra maestra» o «poema». El sentido del léxico es sencillamente «lo que se hace, una obra»; la dignidad de la idea procede del Hacedor y de su propósito, no de la palabra misma.',
      notableNotes: ['El único otro uso en el Nuevo Testamento: el poder de Dios se entiende «por las cosas que son hechas» en la creación.'],
      anchors: [{ verse: E2(10), phrases: { RVR1909: 'hechura', BLM: 'hechura', VBL: 'la obra de Dios' } }],
    },
    'grace:kw:dorean': {
      english: 'gratuitamente, como don',
      basicMeaning: 'gratuitamente, como regalo; en vano, sin motivo',
      semanticRange: [
        'gratuitamente, sin pago (Mt 10:8; Ap 22:17)',
        'como regalo, de balde (Ro 3:24)',
        'sin causa (Jn 15:25)',
        'en vano, para nada (Gá 2:21)',
      ],
      grammar: 'Adverbio: acusativo de δωρεά («don») usado adverbialmente, «gratuitamente, como don» (Ro 3:24)',
      significance:
        'Dōrean no aparece en Efesios 2, pero está detrás de «justificados gratuitamente por su gracia» en Ro 3:24, el paralelo más cercano a Ef 2:8. Aparece nueve veces en NA28. Pablo usa la misma palabra en Gá 2:21 en su otro sentido: si la justicia viniera por la ley, «por demás murió Cristo». O la gracia es gratuita, o la cruz no tuvo sentido.',
      caution:
        'Los dos sentidos («como don» y «en vano») son usos distintos de una misma palabra, no un doble sentido oculto en cada texto; decide el contexto.',
      notableNotes: [
        'Justificados gratuitamente (dōrean) por su gracia.',
        'Si la justicia viniera por la ley, Cristo habría muerto en vano (dōrean).',
        '«De gracia recibisteis, dad de gracia».',
        'El que tiene sed, tome del agua de la vida gratuitamente.',
        '«Sin causa me aborrecieron»: el mismo adverbio con el sentido de «sin motivo».',
      ],
      anchors: [],
    },
    'grace:kw:chen': {
      english: 'favor, gracia',
      basicMeaning: 'favor, gracia, encanto',
      semanticRange: [
        'favor, aceptación a los ojos de alguien (Gn 6:8; Éx 33:12–17)',
        'la gracia que Dios da (Pr 3:34; Zac 12:10)',
        'encanto, elegancia (Pr 31:30)',
      ],
      grammar: 'Sustantivo, masculino singular absoluto (Gn 6:8), en la expresión hallar gracia (favor) a los ojos de alguien',
      significance:
        'Chen aparece 69 veces en la Biblia hebrea (TAHOT), 14 de ellas en Génesis y 13 en Proverbios, casi siempre en la expresión hallar gracia a los ojos de alguien. Su primera aparición es Gn 6:8, donde el favor del SEÑOR hacia Noé se menciona antes que su justicia (6:9). En el Antiguo Testamento griego, charis traduce sobre todo chen: uno de los puentes entre el vocabulario de Israel y el de Pablo.',
      caution:
        'Muchos usos de chen describen un favor social corriente (Gn 39:4) o el encanto (Pr 31:30); no todas sus apariciones tienen el peso teológico de la charis paulina.',
      notableNotes: [
        'Primera aparición: «Noé halló gracia en los ojos de Jehová».',
        'Moisés suplica apoyándose en haber hallado gracia; chen aparece cinco veces en Éxodo 33.',
        'Dios da gracia a los humildes; el versículo se cita en Stg 4:6 y 1 P 5:5 con charis.',
        'La piedra principal sacada «con aclamaciones de Gracia, gracia á ella».',
        'Dios derramará sobre Jerusalén «espíritu de gracia y de oración».',
      ],
      anchors: [],
    },
    'grace:kw:hesed': {
      english: 'amor leal, misericordia',
      basicMeaning: 'bondad, benignidad, fidelidad',
      semanticRange: [
        'bondad, benignidad',
        'amor leal, fidelidad dentro de una relación o un pacto',
        'misericordia hacia quienes no la merecen (Sal 51:1; Lm 3:22)',
      ],
      grammar: 'Sustantivo, masculino singular absoluto en Éx 34:6: «grande en benignidad» (rav-chesed)',
      significance:
        'Hesed aparece unas 245 veces en la Biblia hebrea (TAHOT), 127 de ellas en los Salmos, y describe el amor comprometido y leal de Dios, sobre todo dentro de su pacto con Israel. No es simplemente la palabra hebrea para charis (el Antiguo Testamento griego suele traducirla por eleos, «misericordia»), pero aporta buena parte de lo que Pablo quiere decir cuando llama a Dios rico en misericordia y habla de su mucho amor (Ef 2:4): un amor que se mantiene fiel a los infieles.',
      caution:
        'Las versiones inglesas traducen hesed como steadfast love, lovingkindness, loving devotion o mercy; la RVR1909 suele decir «misericordia» (y «benignidad» en Éx 34:6). Ninguna palabra lo abarca por completo, y no debe reducirse ni a «gracia» ni a mera «lealtad».',
      notableNotes: [
        '«Grande en benignidad y verdad; que guarda la misericordia en millares, que perdona la iniquidad».',
        'El Dios fiel «guarda el pacto y la misericordia».',
        'El estribillo «porque para siempre es su misericordia»: hesed aparece 26 veces en este salmo.',
        '«Es por la misericordia de Jehová que no somos consumidos»; sus misericordias son nuevas cada mañana.',
        '«Misericordia quise, y no sacrificio», citado por Jesús en Mt 9:13 con eleos.',
        'Hacer juicio, «amar misericordia» (hesed) y humillarse para andar con Dios.',
      ],
      anchors: [],
    },
    'grace:kw:chanan': {
      english: 'tener piedad, ser clemente',
      basicMeaning: 'ser clemente, mostrar favor, tener piedad',
      semanticRange: [
        'mostrar favor, ser clemente (qal)',
        'ser objeto de piedad o de favor (nifal, hofal)',
        'buscar o implorar favor (hitpael)',
      ],
      grammar:
        'Verbo, imperativo qal masculino singular con sufijo de primera persona en Sal 51:1 (chonneni, «ten piedad de mí» en la RVR1909; literalmente, sé clemente conmigo)',
      significance:
        'Chanan (77 veces en TAHOT) es el verbo de la bendición sacerdotal (Nm 6:25) y del clamor del penitente (Sal 51:1). Su adjetivo channun, «clemente», aparece 13 veces y se usa casi exclusivamente de Dios, a menudo en la fórmula de tipo credal de Éx 34:6 que resuena en Sal 103:8 y Jon 4:2. En Éx 33:19 Dios declara que será clemente con quien él quiera serlo (la RVR1909 dice «tendré misericordia del que tendré misericordia»); Pablo lo cita en Ro 9:15–16 para mostrar que la misericordia depende de Dios, no del querer ni del esfuerzo humano.',
      caution:
        'Las palabras de la misma raíz (chen, chanan, channun) tienen un aire de familia, pero el sentido de cada una lo fija su uso en contexto, no la raíz por sí sola.',
      notableNotes: [
        'La bendición sacerdotal: «Haga resplandecer Jehová su rostro sobre ti, y haya de ti misericordia».',
        'La súplica de David tras su pecado: «Ten piedad de mí, oh Dios, conforme á tu misericordia» (hesed).',
        '«Tendré misericordia del que tendré misericordia» (chanan; literalmente, seré clemente con quien seré clemente), citado por Pablo en Ro 9:15, donde el griego traduce chanan con eleeō, «tener misericordia».',
        '«Jehová esperará para tener piedad de vosotros» (chanan) y se levanta para mostraros compasión.',
      ],
      anchors: [],
    },
  },
  crossReferences: {
    'grace:xr:rom-3-23': {
      title: 'Justificados gratuitamente por su gracia',
      explanation:
        'Romanos expresa en términos jurídicos lo que Efesios expresa en términos de rescate. Todos pecaron (compárese Ef 2:1–3), y todos los que son puestos en paz con Dios son justificados como un don (dōrean) por su gracia (charis). Ambos pasajes sitúan la causa enteramente en Dios y el medio en la redención de Cristo.',
    },
    'grace:xr:rom-5-6': {
      title: 'Siendo aún pecadores… y enemigos',
      explanation:
        'Ef 2:5 dice que Dios nos dio vida «Aun estando nosotros muertos en pecados»; Romanos 5 dice que Cristo murió por nosotros cuando éramos débiles, pecadores y enemigos. Ambos pasajes insisten en que el amor de Dios actuó antes de cualquier cambio en nosotros, y eso es exactamente lo que lo convierte en gracia. Romanos añade la mirada hacia adelante: si ya hemos sido reconciliados, mucho más seremos salvos.',
    },
    'grace:xr:col-2-13': {
      title: 'Muertos en pecados, vivificados con Cristo',
      explanation:
        'El paralelo verbal más cercano del Nuevo Testamento. También Colosenses describe a los lectores como muertos en sus pecados y vivificados juntamente con Cristo, con el mismo verbo poco común, συζωοποιέω, que solo aparece en Ef 2:5 y Col 2:13. Colosenses añade el cómo: Dios perdonó todos nuestros pecados y anuló el acta de la deuda clavándola en la cruz.',
    },
    'grace:xr:titus-3-4': {
      title: 'Bondad y misericordia, no obras',
      explanation:
        'Tito 3 corre por las mismas vías que Efesios 2: se manifestaron la bondad (χρηστότης, como en Ef 2:7) y el amor de Dios; él nos salvó «No por obras de justicia que nosotros habíamos hecho, mas por su misericordia» (ἔλεος, como en Ef 2:4); y somos «justificados por su gracia». Tito añade la obra del Espíritu en la regeneración y la renovación.',
    },
    'grace:xr:gal-2-20': {
      title: 'No desecho la gracia de Dios',
      explanation:
        'Gálatas presenta la versión personal y polémica de Ef 2:8–9. Pablo vive «en la fe del Hijo de Dios, el cual me amó, y se entregó á sí mismo por mí», y se niega a anular la gracia: si la justicia viniera por la ley, Cristo habría muerto en vano. Añadir las obras como fundamento de la aceptación vaciaría de sentido tanto la gracia como la cruz.',
    },
    'grace:xr:rom-11-6': {
      title: 'La gracia y las obras no se pueden mezclar',
      explanation:
        'Ro 11:6 explica la lógica que hay detrás de «No por obras» en Ef 2:9: «si por gracia, luego no por las obras; de otra manera la gracia ya no es gracia». El contraste no es entre el don de Dios y la obediencia humana en general, sino entre dos fundamentos incompatibles para ser aceptados.',
    },
    'grace:xr:rom-4-4': {
      title: 'Salario frente a don',
      explanation:
        'Pablo contrasta dos economías. Al trabajador el salario se le debe; no se le da como un regalo. Pero Dios justifica al impío que confía en él en lugar de trabajar para obtenerlo. Efesios 2:8–9 vive en el mismo contraste —don, no salario; fe, no obras—, y por eso queda excluida la jactancia (compárese Ro 4:2).',
    },
    'grace:xr:jas-2-14': {
      title: 'La fe sin obras es muerta',
      explanation:
        'Santiago parece a primera vista contradecir a Pablo: «el hombre es justificado por las obras, y no solamente por la fe» (2:24). Pero Santiago apunta a una fe que dice creer y no produce nada, mientras que Pablo excluye las obras como fundamento de la salvación. Ef 2:10 muestra dónde se encuentran: aquellos a quienes Dios salva por gracia son creados para buenas obras, así que una fe que nunca anda en ellas no es la fe de la que habla Pablo. Los cristianos no siempre han encontrado fácil reconciliar ambos textos, y todavía los ponderan de manera distinta, pero la mayoría de las tradiciones los leen hoy como complementarios.',
    },
    'grace:xr:ezek-36-26': {
      title: 'Un corazón nuevo y un nuevo andar',
      explanation:
        'Ezequiel prometió que Dios cambiaría el corazón de piedra por un corazón de carne y pondría su Espíritu dentro de su pueblo, haciendo que anduviera en sus mandamientos. Efesios no cita a Ezequiel, pero, leídos juntos, ambos textos comparten un patrón: en 2:1–10 los muertos reciben vida (2:5) y son creados de nuevo para que anden en buenas obras (2:10), lo que invierte el antiguo andar de 2:2. En ambos textos la iniciativa es de Dios.',
    },
    'grace:xr:deut-7-7': {
      title: 'Amados porque él os amó',
      explanation:
        'Israel no fue escogido por ser numeroso o impresionante; el SEÑOR puso su amor en ellos sencillamente porque los amó y quiso guardar su juramento. El «por su mucho amor» de Pablo (Ef 2:4) está en la misma línea: el amor de Dios es su propia razón, no una respuesta al valor de quienes lo reciben.',
    },
    'grace:xr:exod-34-6': {
      title: 'La confesión fundacional de Israel: un Dios clemente',
      explanation:
        'En el Sinaí, después de la idolatría de Israel con el becerro de oro, Dios proclamó su nombre: misericordioso y clemente, tardo para la ira, grande en hesed y en fidelidad, que perdona la iniquidad. Esta autorrevelación se convirtió en el credo de Israel (Sal 103:8; Jon 4:2). Cuando Pablo llama a Dios «rico en misericordia» y habla de las riquezas de su gracia y de su bondad (Ef 2:4, 7), habla como heredero de esa historia.',
    },
    'grace:xr:john-1-16': {
      title: 'Gracia por gracia',
      explanation:
        'Pablo habla de «las abundantes riquezas de su gracia» mostradas en Cristo Jesús (2:7); Juan dice que de la plenitud del Verbo encarnado hemos recibido «gracia por gracia», y que la gracia y la verdad vinieron por medio de Jesucristo. Ambos autores hacen de Cristo mismo el lugar donde la gracia de Dios se muestra plenamente.',
    },
    'grace:xr:2-cor-5-17': {
      title: 'Una nueva criatura',
      explanation:
        '«Criados en Cristo Jesús» (Ef 2:10) es lenguaje de nueva creación. En 2 Co 5:17, si alguno está en Cristo, «nueva criatura es: las cosas viejas pasaron; he aquí todas son hechas nuevas», y Pablo añade: «todo esto es de Dios». La salvación por gracia no es una reparación a la que contribuimos, sino un acto creador de Dios.',
    },
    'grace:xr:phil-1-6': {
      title: 'El que comenzó la buena obra la perfeccionará',
      explanation:
        'Los creyentes son hechura de Dios (Ef 2:10), y la confianza de Pablo en Flp 1:6 descansa en la misma lógica: el Dios que comenzó en ellos la buena obra la llevará a término. La gracia inicia y sostiene la vida cristiana. (Cómo se relaciona esto con la perseverancia es objeto de debate; véase la nota sobre sōzō).',
    },
    'grace:xr:luke-18-9': {
      title: 'El fariseo y el publicano',
      explanation:
        'Jesús cuenta esta parábola a unos que confiaban en sí mismos como justos. El fariseo enumera sus ayunos y sus diezmos; el publicano solo pide a Dios misericordia, y es él quien vuelve a su casa justificado. Es una imagen narrativa de Ef 2:9: la salvación no es por obras, «para que nadie se gloríe».',
    },
    'grace:xr:rom-6-1': {
      title: 'La gracia no es licencia para pecar',
      explanation:
        'La gracia gratuita suscita una objeción: ¿perseveraremos en pecado para que la gracia crezca? Pablo responde que quienes están unidos a Cristo en su muerte y resurrección andan ahora «en novedad de vida». Ef 2:10 dice lo mismo en positivo —la gracia vuelve a crear a las personas para buenas obras—, de modo que la gracia y la santidad van juntas.',
    },
  },
  context: {
    'grace:ctx:authorship': {
      title: '¿Quién escribió Efesios?',
      summary:
        'La carta nombra a Pablo como su autor y tradicionalmente se recibió como una de sus cartas de la prisión. Sin embargo, muchos estudiosos modernos piensan que la escribió un discípulo posterior de Pablo.',
      detail:
        'Las dudas se basan en diferencias de vocabulario, estilo, situación y énfasis teológico respecto de las cartas indiscutidas de Pablo; algunos proponen un discípulo que escribió en nombre de Pablo, o una carta paulina reelaborada por un editor. Otros responden que esas diferencias pueden explicarse por el contenido litúrgico de la carta, el uso de secretarios por parte de Pablo, el desarrollo de su pensamiento y su carácter de carta general; las notas de Tyndale concluyen que no hay ninguna razón convincente para negar la autoría paulina. La cuestión afecta al lugar que ocupa Efesios en el desarrollo de Pablo (por ejemplo, el gran estudio de John Barclay sobre la gracia en Pablo se centra en las cartas que él considera indiscutidas), pero no a lo que Ef 2:1–10 dice sobre la gracia.',
    },
    'grace:ctx:recipients': {
      title: 'Una carta para varias iglesias de Asia',
      summary:
        'Aunque tradicionalmente se considera dirigida a Éfeso, la carta pudo ser una carta general que circulaba entre las iglesias de la provincia romana de Asia.',
      detail:
        'La mención de Éfeso en 1:1 falta en muchos de los manuscritos más antiguos, y la carta no tiene saludos personales, algo sorprendente si Pablo escribía a una iglesia en la que había pasado de dos a tres años (Hch 19:10; 20:31). Muchas iglesias de la provincia se fundaron durante el ministerio de Pablo en Éfeso, algunas por medio de sus convertidos y no por él mismo. Los lectores eran en su mayoría convertidos de origen gentil, lo que da forma al argumento del capítulo 2.',
    },
    'grace:ctx:ephesus': {
      title: 'Éfeso y la fecha de la carta',
      summary:
        'Éfeso era la capital y el puerto de la provincia romana de Asia, una de las ciudades más grandes del imperio, famosa por su templo de Artemisa. La carta presenta a Pablo escribiendo desde la prisión (3:1; 4:1): tradicionalmente en Roma, hacia los años 60–62 d. C., aunque algunos estudiosos proponen un encarcelamiento en Éfeso hacia los años 53–56 d. C.',
      detail:
        'Las notas de Tyndale describen Éfeso como la cuarta ciudad más grande del Imperio romano, con una población de quizá 500 000 habitantes. Tras una breve primera visita (Hch 18:19–21), Pablo permaneció allí de dos a tres años (Hch 19:1–20:1) en medio de una seria oposición. La postura tradicional sitúa las cartas de la prisión (Efesios, Filipenses, Colosenses, Filemón) en Roma, al final de la vida de Pablo; una alternativa las sitúa durante un encarcelamiento en Éfeso, lo que les daría una fecha anterior.',
    },
    'grace:ctx:patronage': {
      title: 'Charis en un mundo de patronos y benefactores',
      summary:
        'Los lectores de Pablo usaban charis a diario para el favor de un patrono o benefactor, para el propio don y para la gratitud que este reclamaba. La gracia era el lenguaje de la generosidad y de la respuesta agradecida.',
      detail:
        'En el mundo grecorromano, la gente obtenía a menudo protección, cargos o ayuda material mediante vínculos personales con los poderosos más que a través de instituciones públicas. David deSilva muestra que charis tenía tres sentidos relacionados: la disposición favorable del que da, el beneficio otorgado y la gratitud de quien lo recibe. Moralistas como Séneca (De beneficiis) insistían en que el favor debía corresponderse con gratitud; Séneca ilustraba el ideal con las tres Gracias, cuya danza en círculo representa un beneficio que pasa del que da al que recibe y vuelve de nuevo. Al oír que eran salvos «por gracia», los primeros lectores habrían imaginado muy probablemente a Dios como el benefactor supremo, y habrían esperado que esa gracia reclamara una respuesta de lealtad y de gratitud (compárese 2:10).',
    },
    'grace:ctx:surprising-grace': {
      title: 'Lo que hacía sorprendente la gracia de Dios',
      summary:
        'Los benefactores antiguos daban libremente en principio, pero normalmente elegían destinatarios dignos. La sorpresa del Nuevo Testamento es que Dios da su mayor don a los indignos, incluso a sus enemigos.',
      detail:
        'DeSilva señala que, para Séneca, el dador más generoso podía incluso ayudar a quienes se habían mostrado ingratos, siempre que le quedara algo después de ayudar a los que lo merecían. El Nuevo Testamento va mucho más allá: Dios da su mayor don a personas que se habían puesto en su contra (Ro 5:6–10; Lc 6:35), y es él quien da el primer paso para reconciliarlas. Paul and the Gift (2015), de John Barclay, describe esto como una gracia dada sin tener en cuenta si el destinatario es digno (lo que él llama su incongruencia); en su lectura, Pablo no hace de la gracia algo libre de toda respuesta esperada: es incondicionada, pero apunta a una vida transformada. Ef 2:1–10 encaja con ambos puntos: Dios actúa hacia los muertos (2:5) y los crea para buenas obras (2:10).',
    },
    'grace:ctx:hesed-covenant': {
      title: 'Hesed y pacto: la gramática de la gracia en Israel',
      summary:
        'El vocabulario de Pablo tiene raíces judías. Las Escrituras de Israel ya confesaban a un Dios clemente, grande en hesed, que escogió a Israel por amor y no por mérito.',
      detail:
        'El Antiguo Testamento griego tradujo en general chen (favor) por charis y hesed (amor leal del pacto) por eleos (misericordia); así que, cuando Pablo une misericordia y gracia en Ef 2:4–8, se apoya en esa herencia. Textos como Éx 34:6–7, Dt 7:7–9 y el Salmo 103 muestran que la gracia no fue un invento cristiano; lo nuevo en Efesios es su foco en Cristo y su extensión a los gentiles, que habían sido extranjeros a los pactos de la promesa (2:12).',
    },
    'grace:ctx:gentiles': {
      title: 'Gentiles «sin esperanza y sin Dios»',
      summary:
        'La mayoría de los primeros lectores eran gentiles que habían estado fuera de los pactos de Israel. Pablo les recuerda que en otro tiempo estaban sin Cristo, extranjeros a los pactos de la promesa, «sin esperanza y sin Dios en el mundo» (2:12).',
      detail:
        'Efesios 2:11–22 aplica enseguida la gracia de 2:1–10 a la división entre judíos y gentiles. Los judíos consideraban tradicionalmente a los gentiles excluidos del pueblo de Dios, y una barrera baja en el templo de Jerusalén marcaba el límite que los gentiles no podían traspasar. Las notas de Tyndale sugieren que el énfasis puede reflejar tensiones entre creyentes judíos y gentiles. Para tales lectores, «por gracia sois salvos» significaba que su posición ante Dios no descansaba en nada que ellos hubieran aportado: ni en su ascendencia ni en sus logros.',
    },
    'grace:ctx:powers': {
      title: 'El «príncipe de la potestad del aire»',
      summary:
        'Pablo describe la vida sin Cristo como moldeada por la corriente de este mundo y por el diablo, el «príncipe de la potestad del aire» (2:2). En una ciudad conocida por la magia, no era una idea abstracta.',
      detail:
        'Las notas de Tyndale leen 2:2 como una referencia al diablo, que gobierna los poderes del mal y actúa en quienes se niegan a obedecer a Dios (compárese 6:11–12). Hechos relata que, durante el ministerio de Pablo en Éfeso, muchos creyentes acudían a confesar sus prácticas, y bastantes de los que habían practicado la magia quemaron públicamente sus libros, valorados en cincuenta mil dracmas (Hch 19:18–19). La gracia en Efesios es, por tanto, también liberación de los poderes espirituales, no solo perdón.',
    },
  },
  literary: {
    placeInBook:
      'Efesios se divide en dos mitades: los capítulos 1–3 alaban a Dios por su gracia, y los capítulos 4–6 describen la vida que responde a ella. Ef 2:1–10 viene justo después de la oración de Pablo para que los lectores comprendan el poder con que Dios resucitó a Cristo y lo sentó en los lugares celestiales (1:19–20); 2:5–6 aplica ese mismo poder a los creyentes. El pasaje fundamenta después 2:11–22, donde la gracia une a judíos y gentiles en un solo pueblo nuevo.',
    argument:
      'El argumento avanza en cinco pasos: la situación de toda la humanidad, muerta, esclavizada y bajo la ira (2:1–3); el giro hacia el carácter de Dios, rico en misericordia y grande en amor (2:4); la acción de Dios con Cristo, que da vida, resucita y hace sentar (2:5–6); el propósito de Dios, mostrar las riquezas de su gracia en los siglos venideros (2:7); y la explicación: salvos por gracia, por medio de la fe, como don, no por obras, y creados para buenas obras (2:8–10). En griego, 2:1–7 es una sola frase larga, un rasgo del estilo de Pablo en Efesios.',
    placeInCanon:
      'Efesios 2 recoge un hilo que recorre toda la Biblia: el Dios que miró con favor a Noé, se reveló como clemente en el Sinaí y escogió a Israel por amor muestra ahora en Cristo las abundantes riquezas de su gracia. Es la formulación más compacta, dentro de las cartas de Pablo, de lo que Romanos y Gálatas argumentan por extenso, y anticipa la esperanza de nueva creación del resto del Nuevo Testamento.',
    bookOutline: [
      'Saludo',
      'Alabanza por toda bendición espiritual',
      'Oración por el entendimiento espiritual',
      'De la muerte a la vida: salvos por gracia',
      'Un solo pueblo nuevo en Cristo',
      'Pablo, administrador de la gracia de Dios para los gentiles',
      'Oración para conocer el amor de Cristo',
      'Unidad y dones en el cuerpo',
      'La vida nueva: andar como hijos de luz',
      'Hogares moldeados por Cristo',
      'La armadura de Dios',
      'Palabras finales',
    ],
    passageOutline: [
      'La situación: muertos, esclavizados, bajo la ira',
      'El giro: «Empero Dios», rico en misericordia',
      'Vivificados, resucitados y sentados con Cristo',
      'El propósito: la gracia expuesta por los siglos',
      'Por gracia, por medio de la fe, un don; no por obras',
      'Hechura de Dios, creados para buenas obras',
    ],
    features: {
      'grace:lit:but-god': {
        title: 'El punto de inflexión: «Empero Dios»',
        description:
          'Tras tres versículos que describen la impotencia humana, 2:4 comienza con Ὁ δὲ θεός, «Empero Dios» (pero Dios). El sujeto gramatical del rescate es solo Dios; todos los verbos principales que siguen (dio vida, resucitó, hizo sentar) tienen a Dios como sujeto.',
      },
      'grace:lit:refrain': {
        title: 'El estribillo «por gracia sois salvos»',
        description:
          'Pablo se interrumpe a sí mismo en 2:5 con «por gracia sois salvos» (entre paréntesis en la KJV) y luego lo repite y amplía en 2:8. La repetición lo convierte en la tesis del pasaje. Calvino dudaba de si el paréntesis procedía de Pablo o de una mano posterior, pero lo aceptó como apropiado al contexto y lo vio como señal de que Pablo nunca sentía haber dicho lo suficiente sobre la gracia de Dios.',
        structure: [
          { label: 'A', text: 'Por gracia sois salvos (interjección)' },
          { label: 'A′', text: 'Por gracia sois salvos por la fe… don de Dios… no por obras' },
        ],
      },
      'grace:lit:with-christ': {
        title: 'Tres verbos «con» que evocan la historia de Cristo',
        description:
          'Pablo usa tres verbos compuestos que empiezan por syn- («con»): dar vida juntamente, resucitar juntamente y hacer sentar juntamente (2:5–6). Reflejan lo que Dios hizo por Cristo en 1:20 —resucitarlo y sentarlo en los lugares celestiales—, de modo que la historia del creyente queda incorporada a la de Cristo.',
        structure: [
          { label: 'Cristo', text: 'Dios lo resucitó y lo sentó en los lugares celestiales' },
          { label: 'Creyentes', text: 'vivificados con… resucitados con… sentados con Cristo' },
        ],
      },
      'grace:lit:walk': {
        title: 'Dos maneras de andar',
        description:
          'El verbo «andar» (περιπατέω) enmarca el pasaje: los lectores anduvieron en otro tiempo en delitos y pecados (2:2), y el pasaje termina —es su última palabra en griego— con las buenas obras que Dios preparó «para que anduviésemos en ellas» (2:10; la BSB lo traduce «our way of life», nuestra manera de vivir). La gracia no solo cambia la condición de alguien; cambia la dirección de una vida.',
        structure: [
          { label: 'Antes', text: 'anduvisteis en delitos y pecados, conforme a la corriente de este mundo' },
          { label: 'Ahora', text: 'buenas obras que Dios preparó para que anduviésemos en ellas' },
        ],
      },
      'grace:lit:works': {
        title: '«No por obras» y «para buenas obras»',
        description:
          'Pablo usa el mismo sustantivo, ἔργα (obras), en versículos consecutivos con preposiciones distintas: la salvación no procede de las obras (ἐξ ἔργων, 2:9), pero los creyentes son creados para buenas obras (ἐπὶ ἔργοις ἀγαθοῖς, 2:10). Las obras quedan excluidas como fuente de la salvación y restituidas como su fruto.',
      },
    },
  },
  theology: {
    'grace:th:gift': {
      title: 'La salvación como don de Dios',
      summary:
        'Ef 2:8–9 condensa el evangelio en tres contrastes: por gracia, no por obras; por medio de la fe, no de vosotros; don de Dios, no motivo de jactancia. La salvación se origina en el favor de Dios, se recibe por la confianza y no deja lugar a la autocomplacencia.',
      detail:
        'Los cristianos de todas las tradiciones afirman que nadie puede ganar ni merecer la gracia de la salvación. Las notas de Tyndale llaman a 2:8–9 un resumen conciso de cómo se salva una persona y un principio cardinal del evangelio. Las tradiciones difieren en cómo se relaciona la gracia con la voluntad humana y con el proceso de renovación: véanse las perspectivas más abajo.',
    },
    'grace:th:election': {
      title: 'Elección y llamamiento: la gracia antes del tiempo',
      summary:
        'Efesios sitúa la gracia antes de que el mundo comenzara: Dios escogió a los creyentes en Cristo antes de la fundación del mundo, para alabanza de la gloria de su gracia (1:4–6), y preparó de antemano buenas obras para ellos (2:10).',
      detail:
        'El patrón aparece en toda la Escritura: Israel fue escogido por amor, no por mérito (Dt 7:7–8); un remanente es escogido por gracia (Ro 11:5–6); Dios nos salvó y llamó según su propio propósito y la gracia que nos fue dada en Cristo Jesús antes de los tiempos de los siglos (2 Ti 1:9). Los cristianos coinciden en que la elección es por gracia; discrepan sobre su fundamento. Los Artículos de los Remonstrantes (1610) describen el decreto eterno de Dios de salvar a quienes, por la gracia del Espíritu, creerán y perseverarán; los Cánones de Dort (1619) responden que la elección no se fundó en la fe prevista, sino que es la fuente de la fe misma. Las perspectivas más abajo exploran la cuestión más amplia.',
    },
    'grace:th:justification': {
      title: 'La gracia y la justificación',
      summary:
        'Efesios 2 habla de ser salvos más que de ser justificados, pero las ideas se encuentran: en Romanos, Gálatas y Tito, los creyentes son justificados gratuitamente por la gracia de Dios por medio de la fe, no por obras de la ley.',
      detail:
        'Agustín resumió así la relación entre la ley y la gracia: la ley se dio para que se buscara la gracia, y la gracia se dio para que se cumpliera la ley. Las tradiciones protestantes subrayan la justificación como la declaración de Dios de que los pecadores son justos por causa de Cristo; la enseñanza católica sostiene que la justificación incluye también la renovación interior. En las últimas décadas, N. T. Wright ha sostenido que el lenguaje paulino de la justificación debe leerse dentro del plan del pacto de Dios, por medio de Israel, para el mundo: un énfasis que él encuentra en Ef 2:11–22 junto a los énfasis clásicos de la Reforma en 2:1–10.',
    },
    'grace:th:sanctification': {
      title: 'La gracia que enseña: las buenas obras como fruto',
      summary:
        'La gracia salva sin las obras, pero nunca deja a las personas sin ellas. Los creyentes son hechura de Dios, creados para buenas obras (Ef 2:10); la gracia que trae salvación les enseña también a vivir piadosamente (Tit 2:11–12).',
      detail:
        'Pablo rechaza la idea de que la gracia gratuita fomente el pecado (Ro 6:1–2) y describe su propio trabajo como la gracia de Dios que actuaba con él (1 Co 15:10). Las notas de Tyndale lo dicen con sencillez: las buenas obras son el resultado, no la causa, de la salvación. Filipenses 2:12–13 mantiene unidos ambos lados: ocupaos en vuestra salvación, porque Dios es el que en vosotros obra.',
    },
    'grace:th:common-grace': {
      title: 'Gracia común y gracia salvadora',
      summary:
        'La Escritura habla de la bondad de Dios hacia todas las personas —el sol y la lluvia sobre malos y buenos, alimento y alegría para las naciones— junto a la gracia salvadora de Ef 2. Los teólogos han relacionado ambas de distintas maneras; la teología reformada usa la expresión gracia común para la gracia que no salva.',
      detail:
        'Charles Hodge, por ejemplo, definió la gracia común como la influencia del Espíritu Santo concedida en alguna medida a todos los que oyen la verdad, distinta de la gracia eficaz que regenera. Los wesleyanos hablan en cambio de una gracia preveniente dada a todos, que despierta la conciencia y está destinada a conducir a la salvación. La teología ortodoxa oriental, tal como la presenta Vladimir Lossky, no concibe la naturaleza humana como un orden natural autosuficiente al que después se añade la gracia como un extra; en su exposición, el don de Dios actúa en la creación desde el principio. En todas estas tradiciones, el bien del que las personas disfrutan al margen de la fe salvadora sigue siendo un don inmerecido.',
    },
    'grace:th:means': {
      title: 'Los medios de gracia',
      summary:
        'Muchas tradiciones cristianas —entre ellas la católica, la luterana, la reformada y la metodista— enseñan que Dios da y alimenta ordinariamente la gracia por medios establecidos, sobre todo la Palabra y los sacramentos, junto con la oración, aunque describen esos medios de manera distinta. No todos los cristianos usan este lenguaje: algunas tradiciones de iglesias libres hablan del bautismo y de la Cena del Señor como ordenanzas de obediencia y memoria, y la enseñanza cuáquera primitiva sostenía que los ritos externos ya no eran necesarios en absoluto.',
      detail:
        'El Catecismo Menor de Westminster (preg. 88) señala la palabra, los sacramentos y la oración como los medios externos y ordinarios por los que Cristo comunica los beneficios de la redención. La Confesión de Augsburgo (art. V) enseña que por la Palabra y los sacramentos, como por instrumentos, se da el Espíritu Santo, que obra la fe. El Catecismo de la Iglesia Católica habla de gracias sacramentales propias de cada sacramento y de gracias especiales o carismas (§2003). El sermón de John Wesley The Means of Grace señala la oración, el escudriñar las Escrituras y la Cena del Señor como los principales cauces ordinarios por los que Dios comunica la gracia. En cambio, la Baptist Faith and Message (2000, art. VII) de la Convención Bautista del Sur presenta ambos ritos como símbolos y actos de obediencia: el bautismo representa la fe del creyente y su nueva vida, y la Cena recuerda la muerte de Cristo y mira hacia su regreso. La Apology (1678) de Robert Barclay, una defensa de los principios cuáqueros, trata el verdadero bautismo y la verdadera comunión como realidades interiores y espirituales, y los ritos externos como figuras destinadas solo a un tiempo (props. 12–13). La iglesia primitiva perseveraba en la doctrina de los apóstoles, en el partimiento del pan y en las oraciones (Hch 2:42).',
    },
  },
  perspectives: {
    'grace:ps:grace-and-response': {
      question: '¿Cómo se relaciona la gracia de Dios con la respuesta humana de la fe?',
      intro:
        'Todas las tradiciones que siguen confiesan que la salvación es por la gracia de Dios y no puede ganarse. Difieren en cómo actúa la gracia en la voluntad humana: si es eficaz por sí misma, si obra sola la conversión pero puede ser resistida, si capacita para una respuesta libre que puede rechazarse, si sana la naturaleza e invita a cooperar, o si une las energías propias de Dios con la libertad humana. El debate tiene raíces profundas: la controversia de Agustín con Pelagio, el concilio africano de 418, que enseñó que la gracia da no solo el perdón, sino también la voluntad y la fuerza para obedecer, y el Concilio de Orange (529), que sostuvo que incluso el comienzo de la fe es un don de la gracia. Todas las partes reivindican sinceramente Ef 2:8–10.',
      commonGround:
        'Todas estas tradiciones confiesan que la salvación es iniciativa bondadosa de Dios en Cristo; que nadie gana ni merece la gracia de la salvación; que la fe es posible gracias a la gracia; y que la gracia auténtica da fruto en una vida transformada, como insiste Ef 2:10.',
      perspectives: {
        'grace:ps:grace-and-response:reformed': {
          tradition: 'Reformada',
          label: 'Gracia eficaz: Dios da la fe que pide',
          summary:
            'Los Cánones de Dort (1619) enseñan que la conversión debe atribuirse enteramente a Dios: la regeneración es una nueva creación y una resurrección de entre los muertos, no una mera persuasión moral que deje en poder del hombre convertirse o no; la fe es don de Dios porque Dios produce realmente tanto la voluntad de creer como el acto mismo de creer. Sin embargo, la gracia no trata a las personas como objetos inertes ni destruye la voluntad: la renueva, de modo que la persona cree y se arrepiente de verdad. Los lectores reformados ven esto en Ef 2: los muertos reciben vida (2:5), y toda la salvación es «no de vosotros» (2:8).',
        },
        'grace:ps:grace-and-response:wesleyan': {
          tradition: 'Arminiana / wesleyana',
          label: 'Gracia preveniente: una respuesta capacitada y resistible',
          summary:
            'Los Artículos de los Remonstrantes (1610) sostienen que nadie puede pensar, querer ni hacer el bien sin la gracia, que es el principio, la continuación y la consumación de todo bien; pero la gracia no es irresistible, pues la Escritura dice que muchos resistieron al Espíritu Santo (Hch 7:51). John Wesley enseñó que nadie queda en un estado de mera naturaleza: la gracia preveniente de Dios despierta en cada persona la conciencia y los primeros deseos hacia él, de modo que las personas no pecan por falta de gracia, sino por no usar la gracia que tienen. En su sermón sobre Ef 2:8 llamó a la gracia la fuente y a la fe la condición de la salvación, y en Free Grace sostuvo que la gracia de Dios es libre en todos y para todos.',
        },
        'grace:ps:grace-and-response:catholic': {
          tradition: 'Católica',
          label: 'Una gracia que sana y eleva, con verdadera cooperación',
          summary:
            'El Concilio de Trento (sesión 6, 1547) enseña que el comienzo de la justificación procede de la gracia preveniente de Dios, sin mérito alguno; Dios toca el corazón, y la persona, que podría rechazar esa gracia, asiente libremente y coopera con ella, aunque sin ella no puede moverse hacia Dios. Se dice que somos justificados gratuitamente porque nada de lo que precede a la justificación —ni la fe ni las obras— merece la gracia misma de la justificación. El Catecismo describe la gracia como la ayuda gratuita e inmerecida de Dios y una participación en su vida, y distingue la gracia habitual (santificante) de las gracias actuales; después de la justificación, el mérito es a su vez un don de la gracia. El tratado de Tomás de Aquino sobre la gracia da forma a este vocabulario.',
        },
        'grace:ps:grace-and-response:lutheran': {
          tradition: 'Luterana',
          label: 'Sola gratia: solo Dios convierte, pero la gracia puede rechazarse',
          summary:
            'La Confesión de Augsburgo (1530, art. IV) enseña que las personas no pueden ser justificadas ante Dios por sus propias fuerzas, méritos u obras, sino que son justificadas gratuitamente por causa de Cristo mediante la fe, que Dios cuenta por justicia; el artículo V añade que el Espíritu Santo, que obra la fe, se da por medio de la Palabra y los sacramentos como por instrumentos. La Fórmula de Concordia (1577, Epítome, art. II) sostiene que la conversión es obra exclusiva de la gracia del Espíritu Santo: la voluntad no convertida no aporta nada, aunque, una vez renovada, coopera con el Espíritu en las obras que siguen. Sin embargo, esta gracia puede ser resistida: según el Epítome, art. XI, quienes se pierden lo hacen porque desprecian la Palabra y endurecen su corazón, no porque Dios no quisiera que se salvaran. En el contexto de la justificación, la enseñanza luterana trata la gracia ante todo como el favor inmerecido de Dios hacia los pecadores, más que como una cualidad infundida en el alma. Dietrich Bonhoeffer advirtió que esta gracia gratuita nunca debe convertirse en un principio que excuse el pecado.',
        },
        'grace:ps:grace-and-response:orthodox': {
          tradition: 'Ortodoxa oriental',
          label: 'La gracia como energías increadas de Dios; sinergia hacia la theosis',
          summary:
            'Siguiendo a Gregorio Palamás, Vladimir Lossky presenta la gracia no como una cualidad creada en el alma, sino como la propia energía increada de Dios: Dios se da verdaderamente a sí mismo en sus energías, mientras que su esencia permanece incognoscible. La salvación es unión con Dios (theosis), una participación real en la naturaleza divina (2 P 1:4) en la que la persona humana sigue siendo criatura. Esa unión implica sinergia: la voluntad humana obra junto con la gracia divina, y en la exposición de Lossky la gracia y la libertad actúan juntas y no como rivales. Lossky observa que la teología oriental nunca convirtió la relación entre gracia y libre albedrío en la controversia candente que llegó a ser en el Occidente latino después de Agustín, y que el lenguaje del mérito tiene poco lugar en la literatura espiritual oriental. Crisóstomo, comentando Ef 2:8, dice igualmente que la fe misma es don de Dios, al tiempo que Pablo salvaguarda el libre albedrío humano.',
        },
      },
    },
    'grace:ps:joint-declaration': {
      question: '¿Resolvió la Declaración conjunta de 1999 la disputa de la Reforma sobre la justificación por gracia?',
      intro:
        'El 31 de octubre de 1999, en Augsburgo, la Federación Luterana Mundial y la Iglesia católica firmaron la Declaración conjunta sobre la doctrina de la justificación. El Consejo Metodista Mundial se adhirió en 2006, y las comuniones anglicana y reformada la suscribieron más tarde. Los cristianos siguen valorando su alcance de manera distinta.',
      commonGround:
        'Ambas valoraciones coinciden en que la justificación es obra bondadosa de Dios en Cristo, recibida por la fe, y en que tanto el acuerdo honesto como el desacuerdo honesto importan más que disimular las diferencias.',
      perspectives: {
        'grace:ps:joint-declaration:consensus': {
          tradition: 'Iglesias firmantes (Federación Luterana Mundial, Iglesia católica y, más tarde, organismos metodistas, anglicanos y reformados)',
          label: 'Un consenso real en verdades básicas',
          summary:
            'La Declaración afirma que luteranos y católicos pueden confesar ahora juntos que Dios acepta a los pecadores, y les da el Espíritu que los renueva y los capacita para las buenas obras, solo por gracia, mediante la fe en lo que Cristo ha hecho y nunca sobre la base del mérito humano. Trata las diferencias que subsisten entre las exposiciones de ambas iglesias como diferencias de vocabulario, de énfasis y de desarrollo teológico que no deshacen ese consenso básico. Concluye que las condenas mutuas del siglo XVI no se aplican a la enseñanza de la otra parte tal como la Declaración la expone.',
        },
        'grace:ps:joint-declaration:differences': {
          tradition: 'Luteranos confesionales y otros críticos',
          label: 'Subsisten diferencias importantes',
          summary:
            'La Iglesia Luterana–Sínodo de Misuri concluyó que la Declaración no supone un avance decisivo: a su juicio, la enseñanza católica sigue definiendo la justificación como algo que incluye la renovación interior y permite que los justificados merezcan un aumento de gracia, mientras que los luteranos sostienen que la justificación es el perdón gratuito de Dios recibido solo por la fe. Su guía de estudio añade que tampoco todos los teólogos católicos consideran la Declaración una ruptura con la enseñanza católica tradicional, y cita el juicio de Leonardo De Chirico de que su exposición de la justificación deja esencialmente intacta la teología del Concilio de Trento.',
        },
      },
    },
  },
  commentary: {
    'grace:cm:augustine': {
      lead: 'Sobre «No por obras» y «criados en Cristo Jesús para buenas obras» (Ef 2:9–10)',
      quoteTranslation:
        '«No por obras» se dice de las obras que supones que tienen su origen solo en ti mismo; pero has de pensar en las obras para las que Dios te ha modelado (es decir, te ha formado y creado).',
    },
    'grace:cm:chrysostom': {
      lead: 'Sobre «y esto no de vosotros» (Ef 2:8)',
      quoteTranslation:
        'Tampoco la fe, quiere decir, es «de nosotros mismos». Porque, si él no hubiera venido, si no nos hubiera llamado, ¿cómo habríamos podido creer?',
    },
    'grace:cm:aquinas': {
      lead: 'Sobre los sentidos corrientes de «gracia»',
      quoteTranslation:
        'Según el modo común de hablar, la gracia suele tomarse en tres sentidos. Primero, por el amor de alguien, como solemos decir que el soldado goza de la gracia del rey… En segundo lugar, se toma por cualquier don concedido gratuitamente… En tercer lugar, se toma por la correspondencia a un don dado «gratis», en cuanto se dice que estamos «agradecidos» por los beneficios.',
    },
    'grace:cm:calvin': {
      lead: 'Sobre «por gracia… por la fe» (Ef 2:8)',
      quoteTranslation:
        'Dios declara que no nos debe nada; de modo que la salvación no es premio ni recompensa, sino pura gracia… La fe, pues, lleva al hombre vacío ante Dios, para que sea llenado de las bendiciones de Cristo.',
    },
    'grace:cm:wesley': {
      lead: 'Predicando sobre Ef 2:8 en Oxford, 1738',
      quoteTranslation:
        'Todas las bendiciones que Dios ha concedido al hombre proceden de su mera gracia, bondad o favor; de su favor libre e inmerecido; un favor del todo inmerecido, pues el hombre no tiene derecho alguno a la menor de sus misericordias… La gracia es la fuente, y la fe la condición, de la salvación.',
    },
    'grace:cm:newton': {
      lead: 'Del himno conocido hoy como «Amazing Grace»',
      quoteTranslation:
        'Fue la gracia la que enseñó a mi corazón a temer, / y la gracia alivió mis temores; / ¡qué preciosa me pareció esa gracia / en la hora en que creí por primera vez!',
    },
    'grace:cm:spurgeon': {
      lead: 'Sobre la gracia como fuente y la fe como canal (Ef 2:8)',
      quoteTranslation:
        'La fe ocupa el lugar de un canal o conducto. La gracia es la fuente y la corriente; la fe es el acueducto por el que desciende el caudal de la misericordia para refrescar a los sedientos hijos de los hombres.',
    },
    'grace:cm:bonhoeffer': {
      lead: 'Sobre la «gracia barata» y la «gracia cara»',
      text:
        'Bonhoeffer abre Discipleship (1937) contrastando lo que llamó gracia barata y gracia cara. La gracia barata, según él, es el perdón tratado como si no reclamara nada del perdonado —ni apartarse del pecado ni seguir a Cristo—, de modo que la vida sigue igual. La gracia cara es la llamada del propio Jesús al discipulado, que reclama toda la vida de una persona y, al mismo tiempo, da gratuitamente una vida nueva. Su advertencia aplica Ef 2:8–10 desde el otro lado: una gracia que nunca anda en buenas obras ha sido malentendida.',
    },
    'grace:cm:packer': {
      lead: 'Por qué la gracia parece poco notable a muchas personas',
      text:
        'En el capítulo sobre la gracia de Dios de Knowing God (1973), Packer sostiene que muchos que hablan de la gracia no la encuentran asombrosa porque no han captado cuatro verdades que ella presupone: que los seres humanos son moralmente culpables ante Dios; que Dios es justo y debe castigar el pecado; que somos incapaces de restaurar por nosotros mismos nuestra relación con él; y que Dios es libre, sin obligación alguna de mostrarnos favor. Solo cuando se sienten estas verdades aparece la gracia como lo asombroso que describe Ef 2:1–10.',
    },
    'grace:cm:keller': {
      lead: 'Gracia para el rebelde y para el moralista',
      text:
        'En The Prodigal God (2008), Keller lee Lucas 15 como una historia sobre dos hijos, ambos alejados de su padre. El menor se rebela abiertamente; el mayor obedece para poner al padre en deuda con él, y al final es él quien se niega a entrar en la fiesta. Keller sostiene que el evangelio desenmascara tanto la autoindulgencia como el moralismo farisaico como maneras de intentar controlar a Dios, y que solo la gracia lleva a casa a cualquiera de los dos hijos: la misma lógica de Ef 2:9, que excluye la jactancia.',
    },
    'grace:cm:piper': {
      lead: '¿Debemos intentar pagarle a Dios?',
      text:
        'En Future Grace (publicado por primera vez en 1995; revisado en 2012), Piper insiste en que la gratitud a Dios es correcta y bíblica, pero advierte contra lo que llama una ética del deudor: tratar la obediencia como pago por lo que Dios ha hecho. A su juicio, intentar pagarle a Dios convertiría la gracia en algo debido en lugar de algo dado gratuitamente. Sostiene, en cambio, que la obediencia se alimenta de la fe en la gracia que Dios promete para el futuro. Más adelante en el libro cita Ef 2:8–10 para recordar a los lectores que son salvos para buenas obras: la obediencia paciente es fruto de la fe y de la ayuda del Espíritu, no la base de su aceptación, que descansa en Cristo.',
    },
    'grace:cm:wright': {
      lead: 'Efesios 2 y las perspectivas «antigua» y «nueva» sobre Pablo',
      text:
        'En Justification (2009), escrito en el debate con John Piper y otros, Wright lee el lenguaje paulino de la justificación dentro del plan único de Dios, por medio de Israel, para el mundo, al tiempo que afirma que los pecadores son declarados justos sobre la base de la muerte y la resurrección de Cristo. Observa que Efesios mantiene unidos énfasis que a menudo se contraponen: la salvación por gracia mediante la fe, que produce buenas obras (2:1–10), y judíos y gentiles unidos como una sola familia en el Mesías (2:11–22). Críticos como Piper han cuestionado aspectos de su exposición de la justificación, pero su lectura muestra por qué Ef 2:1–10 no debe leerse aislado de 2:11–22.',
    },
  },
  sermons: {
    'grace:sermon:wesley-salvation-by-faith': {
      summary:
        'Predicado ante la Universidad de Oxford el 11 de junio de 1738, fiesta de San Bernabé (las ediciones de 1746 y 1872 lo fechan erróneamente el 18 de junio, cuando Wesley estaba en Alemania), el sermón comienza fundamentando toda bendición en el favor libre e inmerecido de Dios; luego pregunta qué es la fe salvadora (no una mera creencia como la de un pagano o la de un demonio, sino la confianza en Cristo), qué incluye la salvación por la fe y cómo responder a las objeciones.',
    },
    'grace:sermon:spurgeon-salvation-all-of-grace': {
      summary:
        'Spurgeon sigue la gracia a través de la elección, la redención, el llamamiento y la justificación, y sugiere que Pablo insiste en ello porque el corazón humano se resiste a ser salvado por gracia. Los pecadores no vienen como inocentes ni como excusables, sino como culpables que se arrojan en brazos de la misericordia. Después extrae cinco consecuencias prácticas: la doctrina da esperanza a todo pecador, enseña cómo suplicar a Dios, reconcilia a los creyentes con los caminos que Dios ha establecido (la fe y el bautismo), proporciona un poderoso motivo para la santidad y pone a prueba cómo responde cada oyente.',
    },
    'grace:sermon:piper-but-god': {
      summary:
        'Un sermón del tiempo de Navidad que contrapone cada aspecto de la situación descrita en 2:1–3 con la respuesta de Dios en 2:4–7: bondad en lugar de ira (2:3 y 2:7), libertad y un lugar junto a Cristo en lugar de cautiverio (2:2 y 2:6), y vida en lugar de muerte (2:1 y 2:5–6); todo gira en torno a las palabras «Empero Dios» (en inglés, But God).',
    },
    'grace:sermon:keller-grace-of-god': {
      summary:
        'Forma parte de una serie sobre los atributos de Dios. Según la presentación del sermón, Keller sostiene a partir de Ef 2:1–10 que la gracia es un don sin el que no podemos vivir y que a Dios le costó un precio inconmensurable, y que ver ambas cosas cambia la manera en que la gracia se apodera de una vida.',
    },
  },
  verseNotes: {
    'EPH.2.1': [
      'Pablo empieza por el diagnóstico: sus lectores estaban muertos en sus delitos y pecados. «Muertos» expresa más que debilidad: sin la acción de Dios no podían darse vida a sí mismos, y por eso el remedio de 2:5 es la resurrección, no una mejora. (Las tradiciones difieren sobre el alcance de esta incapacidad y sobre cómo la gracia la afronta; véanse las perspectivas). La misma imagen aparece en Col 2:13.',
    ],
    'EPH.2.2': [
      'La vida sin Cristo era un andar moldeado por la corriente de este mundo y por el «príncipe de la potestad del aire»: el diablo, que obra en quienes desobedecen a Dios. El pecado aparece no solo como una elección individual, sino como esclavitud a poderes externos. El verbo «andar» reaparece en 2:10 con una nueva dirección.',
    ],
    'EPH.2.3': [
      'Pablo se incluye a sí mismo —«todos nosotros»— y describe una vida movida por los deseos de la carne y de los pensamientos. «Carne» se refiere aquí a la naturaleza humana caída (las notas de Tyndale hablan de nuestra naturaleza pecaminosa), no simplemente al cuerpo físico. «Por naturaleza hijos de ira» significa que, sin la gracia, todos están bajo el justo juicio de Dios sobre el pecado; judíos y gentiles comparten la misma situación.',
    ],
    'EPH.2.4': [
      '«Empero Dios» es la bisagra del pasaje. Pablo fundamenta todo lo que sigue en el carácter de Dios: rico en misericordia (eleos, la palabra con que el Antiguo Testamento griego tradujo hesed) y movido por su mucho amor. Nada en los lectores provocó el rescate; la razón está enteramente en Dios.',
    ],
    'EPH.2.5': [
      'Dios nos dio vida juntamente con Cristo aun estando nosotros muertos. Pablo interrumpe entonces su propia frase —«por gracia sois salvos»— con un participio perfecto que presenta la salvación como un rescate consumado de efecto duradero. Es el único lugar del Nuevo Testamento, además de 2:8, donde aparece esa forma.',
    ],
    'EPH.2.6': [
      'Los creyentes son resucitados con Cristo y sentados con él en los lugares celestiales, un lenguaje que evoca lo que Dios hizo por Cristo en 1:20. Pablo lo presenta como algo ya verdadero porque los creyentes están unidos a Cristo; su experiencia plena es todavía futura, pero su posición está segura en él.',
    ],
    'EPH.2.7': [
      'El propósito de Dios va más allá del rescate de los lectores: en los siglos venideros mostrará «las abundantes riquezas de su gracia», expresadas en su bondad para con nosotros en Cristo. Las personas salvadas se convierten en una muestra perdurable de cómo es Dios. La bondad (chrēstotēs) de este versículo es la misma palabra que se usa en Tito 3:4.',
    ],
    'EPH.2.8': [
      'La tesis del pasaje: salvos por gracia (lo que salva), por la fe (cómo se recibe), y esto no de vosotros, sino don de Dios. Como «esto» es neutro, mientras que gracia y fe son femeninos, muchos lectores lo entienden referido a todo el acontecimiento salvador. Los cristianos han discutido desde hace mucho si la fe misma está incluida en el don: Crisóstomo y Agustín dijeron que sí; Calvino entendió que el don es la salvación misma.',
    ],
    'EPH.2.9': [
      'No por obras, para que nadie se gloríe. Si la salvación se ganara, aunque fuera en parte, los salvados podrían atribuirse algún mérito; la gracia elimina todo motivo de orgullo ante Dios (compárese Ro 3:27; 1 Co 1:29–31). Las obras excluidas aquí son las obras como fundamento de la aceptación: Pablo afirmará las buenas obras en el versículo siguiente.',
    ],
    'EPH.2.10': [
      'Somos hechura de Dios (poiēma), criados en Cristo Jesús para buenas obras que Dios preparó de antemano para que anduviésemos en ellas. Las buenas obras son el resultado, no la causa, de la salvación. El versículo cierra el círculo abierto en 2:2: el antiguo andar en el pecado es sustituido por un andar nuevo en las obras que Dios ha dispuesto.',
    ],
  },
  concepts: {
    'grace:concept:grace': {
      label: 'La gracia (charis)',
      aliases: [
        'gracia',
        'la gracia',
        'gratuita',
        'gratuito',
        'charis',
        'kharis',
        'χάρις',
        'χάριτι',
        'favor inmerecido',
        'favor',
        'inmerecido',
        'inmerecida',
        'por gracia',
        'sublime gracia',
        'palabra griega para gracia',
        'palabra griega detrás de gracia',
        'qué palabra griega',
        'gracia común',
        'gracia comun',
      ],
      answer:
        'La palabra griega que hay detrás de «gracia» en Ef 2:5, 7 y 8 es charis: favor o benevolencia por parte de quien da, y sobre todo el favor libre e inmerecido de Dios. También podía significar el propio don y la gratitud que este reclama. En este pasaje Pablo la usa para nombrar la única fuente de la salvación: Dios actuó hacia personas que estaban espiritualmente muertas, de modo que la salvación es don suyo y no logro de ellas (2:8–9). Los teólogos distinguen además esta gracia salvadora de la bondad común de Dios hacia todas las personas: véase la sección de teología.',
    },
    'grace:concept:mercy': {
      label: 'Misericordia y amor (Ef 2:4)',
      aliases: [
        'misericordia',
        'misericordioso',
        'rico en misericordia',
        'eleos',
        'ἔλεος',
        'compasión',
        'compasion',
        'gran amor',
        'mucho amor',
        'amor de dios',
        'bondad',
        'chrestotes',
        'χρηστότης',
      ],
      answer:
        'En 2:4 Pablo fundamenta el rescate de Dios en su carácter: es rico en misericordia (eleos) y actúa movido por su mucho amor. La misericordia mira a la miseria descrita en 2:1–3; la gracia, al don inmerecido de 2:5–8. En el Antiguo Testamento griego, eleos suele traducir hesed, el amor leal de Dios en el pacto; así que Pablo se hace eco de la confesión de Israel sobre un Dios «grande en benignidad» (Éx 34:6).',
    },
    'grace:concept:saved': {
      label: 'Salvos (sōzō)',
      aliases: [
        'salvos',
        'salvo',
        'salvados',
        'salvar',
        'salvación',
        'salvacion',
        'sozo',
        'sōzō',
        'σῴζω',
        'σεσῳσμένοι',
        'sois salvos',
        'habéis sido salvados',
        'han sido salvos',
        'tiempo perfecto',
        'rescatados',
        'rescate',
      ],
      answer:
        'Las dos veces que Pablo dice «por gracia sois salvos» (2:5, 8) usa un participio perfecto de sōzō, σεσῳσμένοι, con «sois», y presenta así la salvación como un rescate consumado cuyos efectos continúan. En todo el Nuevo Testamento esta forma solo aparece en estos dos versículos. En otros lugares Pablo habla también de la salvación como algo en curso y todavía futuro (1 Co 1:18; Ro 5:9–10), de modo que Efesios destaca su realidad presente y segura.',
    },
    'grace:concept:faith': {
      label: 'Por la fe',
      aliases: [
        'fe',
        'pistis',
        'πίστις',
        'por la fe',
        'por medio de la fe',
        'creer',
        'creencia',
        'confianza',
        'solo por la fe',
        'sola fide',
        'es la fe un don',
        'la fe es un don',
      ],
      answer:
        'Pablo dice que somos salvos por gracia por la fe (2:8): la gracia es lo que salva, y la fe es el modo en que se recibe el don. La fe no es una obra que gane la salvación; por eso encaja con «No por obras» (2:9). Spurgeon comparó la gracia con la fuente y la fe con el acueducto; Wesley llamó a la gracia la fuente y a la fe la condición de la salvación. Desde la iglesia antigua se discute si la fe misma forma parte del «don» de 2:8.',
    },
    'grace:concept:gift': {
      label: 'El don de Dios: «no de vosotros»',
      aliases: [
        'don',
        'regalo',
        'don de dios',
        'doron',
        'dōron',
        'δῶρον',
        'no de vosotros',
        'esto no de vosotros',
        'no de ustedes',
        'no por ustedes mismos',
        'don gratuito',
        'gratuitamente',
        'dorean',
        'dōrean',
        'δωρεάν',
      ],
      answer:
        'En 2:8 Pablo llama a la salvación «don de Dios» (dōron), con una palabra que en otros lugares suele designar una ofrenda que las personas presentan a Dios: aquí el dador es Dios. El «esto» de «esto no de vosotros» es neutro y no concuerda con las palabras femeninas gracia y fe, así que lo más natural es referirlo a todo el acontecimiento de ser salvos por gracia por medio de la fe. Crisóstomo y Agustín incluían la fe en el don; Calvino entendía que el don es la salvación misma.',
    },
    'grace:concept:works': {
      label: 'Las obras, la jactancia y Santiago',
      aliases: [
        'obras',
        'no por obras',
        'buenas obras',
        'gloriarse',
        'se gloríe',
        'jactancia',
        'jactarse',
        'mérito',
        'merito',
        'ganar',
        'ganarse',
        'merecer',
        'santiago',
        'fe y obras',
        'fe sin obras',
        'santiago 2',
      ],
      answer:
        'Pablo excluye las obras como fundamento de la salvación, «para que nadie se gloríe» (2:9), y enseguida dice que fuimos criados para buenas obras (2:10): el mismo sustantivo griego, primero con «de» y luego con «para». La advertencia de Santiago de que la fe sin obras está muerta (Stg 2:14–26) apunta a una fe que no produce nada; Pablo excluye las obras como base de la aceptación. Juntos enseñan que la gracia salva sin las obras y nunca deja a las personas sin ellas.',
    },
    'grace:concept:workmanship': {
      label: 'Hechura de Dios (poiēma)',
      aliases: [
        'hechura',
        'poiema',
        'poiēma',
        'ποίημα',
        'obra maestra',
        'obra de dios',
        'nueva creación',
        'nueva creacion',
        'criados en cristo',
        'creados en cristo',
        'preparó de antemano',
        'versículo 10',
        'versiculo 10',
      ],
      answer:
        'En 2:10 Pablo llama a los creyentes hechura de Dios (poiēma), una palabra que el Nuevo Testamento usa solo una vez más: para la creación misma, en Ro 1:20. El Dios que hizo el mundo ha hecho un pueblo nuevo, «criados en Cristo Jesús para buenas obras», que él preparó de antemano. Las buenas obras son el propósito y el fruto de la salvación, no su causa, y el andar de 2:10 sustituye al antiguo andar de 2:2.',
    },
    'grace:concept:dead-alive': {
      label: 'De la muerte a la vida: «Empero Dios»',
      aliases: [
        'muertos',
        'muerto',
        'muertos en pecados',
        'muertos en delitos',
        'delitos',
        'nos dio vida',
        'vivificados',
        'empero dios',
        'pero dios',
        'carne',
        'hijos de ira',
        'ira',
        'príncipe de la potestad del aire',
        'principe de la potestad del aire',
        'resucitados con cristo',
        'sentados con cristo',
        'lugares celestiales',
        'unión con cristo',
        'union con cristo',
      ],
      answer:
        'Pablo describe la vida sin Cristo como muerte (2:1), esclavitud al mundo y al diablo (2:2) y una vida movida por la carne —la naturaleza humana caída— bajo la justa ira de Dios (2:3). Luego llega la bisagra: «Empero Dios» (2:4). Los muertos no se reaniman a sí mismos: Dios nos dio vida, nos resucitó y nos hizo sentar con Cristo (2:5–6), como había hecho con Cristo en 1:20.',
    },
    'grace:concept:grace-and-response': {
      label: 'La gracia y la respuesta humana: en qué difieren los cristianos',
      aliases: [
        'distintas interpretaciones',
        'interpretaciones teológicas',
        'interpretaciones teologicas',
        'calvinismo',
        'calvinista',
        'reformado',
        'reformada',
        'arminiano',
        'arminianismo',
        'wesleyano',
        'católico',
        'catolico',
        'luterano',
        'ortodoxo',
        'libre albedrío',
        'libre albedrio',
        'predestinación',
        'predestinacion',
        'elección',
        'eleccion',
        'monergismo',
        'sinergia',
        'gracia preveniente',
        'gracia irresistible',
        'pelagio',
        'pelagianismo',
        'theosis',
        'teosis',
        'declaración conjunta',
        'declaracion conjunta',
      ],
      answer:
        'Todas las grandes tradiciones afirman que la salvación es por la gracia de Dios y no puede ganarse; difieren en cómo actúa la gracia en la voluntad humana. La teología reformada enseña una gracia eficaz que da la fe que pide; la teología arminiana y wesleyana, una gracia preveniente que capacita para una respuesta libre y resistible; la enseñanza católica habla de una gracia que sana y eleva, con verdadera cooperación; los luteranos confiesan que solo Dios convierte por medio de la Palabra y los sacramentos, aunque su gracia puede ser resistida, y subrayan la gracia como favor de Dios recibido solo por la fe; y la ortodoxia habla de sinergia con las energías increadas de Dios. La sección de teología expone cada postura con sus fuentes.',
    },
    'grace:concept:original-audience': {
      label: 'Cómo oyeron «gracia» los primeros lectores',
      aliases: [
        'primeros destinatarios',
        'primeros lectores',
        'audiencia original',
        'destinatarios originales',
        'patronazgo',
        'patrono',
        'benefactor',
        'beneficencia',
        'reciprocidad',
        'gratitud',
        'mundo romano',
        'éfeso',
        'efeso',
        'gentiles',
        'quién escribió efesios',
        'quien escribio efesios',
        'autoría',
        'autoria',
      ],
      answer:
        'Los lectores de Pablo, en su mayoría gentiles de la provincia de Asia, usaban charis para el favor de un patrono o benefactor, para el propio don y para la gratitud que este obligaba a mostrar. Al oír que eran salvos por gracia, lo más probable es que imaginaran a Dios como el benefactor supremo; pero el Dios de Pablo da su mayor don a los indignos, incluso a los enemigos, y su don crea una manera de vivir nueva y agradecida (2:10). Estudiosos como David deSilva y John Barclay han explorado este trasfondo.',
    },
    'grace:concept:living-by-grace': {
      label: 'Vivir por gracia: gracia barata, gracia cara',
      aliases: [
        'gracia barata',
        'gracia cara',
        'gracia costosa',
        'licencia',
        'licencia para pecar',
        'seguir pecando',
        'perseverar en pecado',
        'santificación',
        'santificacion',
        'santidad',
        'la gracia enseña',
        'deudor',
        'bonhoeffer',
      ],
      answer:
        'Como la gracia es gratuita, algunos la han tratado como permiso para pecar; Pablo responde que quienes están unidos a Cristo andan en novedad de vida (Ro 6:1–4), y la gracia que salva también nos enseña a vivir piadosamente (Tit 2:11–12). Bonhoeffer llamó gracia barata a la gracia sin discipulado, en contraste con la gracia cara del llamamiento de Cristo. Ef 2:10 dice lo mismo: no somos salvos por las buenas obras, sino para ellas.',
    },
    'grace:concept:means-of-grace': {
      label: 'Los medios de gracia: Palabra, sacramentos, oración',
      aliases: [
        'medios de gracia',
        'sacramentos',
        'sacramento',
        'ordenanzas',
        'ordenanza',
        'palabra y sacramento',
        'cena del señor',
        'cena del senor',
        'santa cena',
        'bautismo',
      ],
      answer:
        'Muchas tradiciones —entre ellas la católica, la luterana, la reformada y la metodista— enseñan que Dios da y alimenta ordinariamente la gracia por medios establecidos, sobre todo la Palabra y los sacramentos, junto con la oración. El Catecismo Menor de Westminster (preg. 88) nombra la palabra, los sacramentos y la oración; la Confesión de Augsburgo (art. V) dice que el Espíritu, que obra la fe, se da por medio de la Palabra y los sacramentos; y Wesley llamó a la oración, a las Escrituras y a la Cena del Señor los principales cauces ordinarios de la gracia. Algunos cristianos de iglesias libres describen, en cambio, el bautismo y la Cena como actos simbólicos de obediencia, y los primeros cuáqueros sostenían que los ritos externos ya no eran necesarios. La sección de teología los expone con sus fuentes.',
    },
    'grace:concept:old-testament': {
      label: 'La gracia en el Antiguo Testamento',
      aliases: [
        'antiguo testamento',
        'hebreo',
        'palabra hebrea para gracia',
        'chen',
        'חֵן',
        'hesed',
        'chesed',
        'jésed',
        'jesed',
        'חֶסֶד',
        'benignidad',
        'amor leal',
        'chanan',
        'חָנַן',
        'halló gracia',
        'hallar gracia',
        'noé',
        'noe',
        'clemente y compasivo',
        'misericordioso y clemente',
      ],
      answer:
        'La gracia no es un invento del Nuevo Testamento. El hebreo chen significa favor («Noé halló gracia en los ojos de Jehová», Gn 6:8), el verbo chanan significa ser clemente (Nm 6:25; Sal 51:1), y hesed es el amor leal y constante de Dios. En el Sinaí, Dios se reveló como clemente y misericordioso, grande en hesed (Éx 34:6–7), y escogió a Israel por amor, no por mérito (Dt 7:7–8). El Antiguo Testamento griego tradujo chen por charis y hesed por eleos: las mismas palabras que usa Pablo en Ef 2:4–8.',
    },
  },
};

export default overlay;
