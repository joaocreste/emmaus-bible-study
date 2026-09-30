/**
 * Español — traducción del estudio curado «Salmo 23» (src/data/curated/studies/psalm-23.ts).
 *
 * Las citas bíblicas entre comillas angulares («…») reproducen la Reina-Valera 1909 (RVR1909),
 * la versión predeterminada en español; las glosas de palabras hebreas van entre comillas simples
 * (‘…’). Las citas verificadas de autores (Agustín, Calvino, Spurgeon…) no se reescriben: aquí solo
 * se añade una traducción libre (`quoteTranslation`), y en la prosa se parafrasean sin comillas.
 */
import type { StudyOverlay } from '../types';

const overlay: StudyOverlay = {
  studyId: 'psalm-23',
  locale: 'es',
  title: 'Salmo 23',
  subtitle: 'Jehová es mi pastor',
  summary:
    'El Salmo 23 es un salmo de confianza en el que David confiesa al SEÑOR —el Dios del pacto de Israel— primero como su pastor y luego como su anfitrión. Sus imágenes proceden del trabajo diario de un pastor de Judea y de la costumbre del antiguo Cercano Oriente de llamar pastores a los reyes: pastos y agua, guía por sendas rectas, protección en un barranco oscuro, una mesa servida delante de los enemigos, aceite para la cabeza del invitado y una copa que rebosa. En su centro —según un recuento de las palabras hebreas, exactamente en el medio— está la confesión «porque tú estarás conmigo», y termina con la bondad y el amor leal (ḥesed) del SEÑOR persiguiendo al salmista hasta la casa del SEÑOR. Los profetas retomaron la imagen del pastor para hablar del cuidado que Dios prometía a su pueblo disperso, y el Nuevo Testamento presenta a Jesús como el buen pastor, el gran pastor y el Príncipe de los pastores.',
  opening:
    'Esto es el Salmo 23, quizá el canto más amado de la Biblia, y uno que recompensa la lectura pausada. Podemos detenernos en las palabras hebreas que hay detrás de «pastor», «faltará» y «sombra de muerte», en el mundo antiguo en que a los reyes se los llamaba pastores, y en cómo esta imagen de Dios llega hasta Jesús, el buen pastor. ¿Por dónde empezamos?',
  matchTopics: [
    'salmo 23',
    'salmo veintitrés',
    'salmos 23',
    'jehová es mi pastor',
    'el señor es mi pastor',
    'mi pastor',
    'nada me faltará',
    'el salmo del pastor',
    'salmo del pastor',
    'pastor',
    'valle de sombra de muerte',
    'valle de la sombra de muerte',
    'delicados pastos',
    'verdes pastos',
    'aguas de reposo',
    'aguas tranquilas',
  ],
  suggestedQuestions: [
    '¿Qué palabra hebrea hay detrás de «pastor»?',
    '¿Qué significa en hebreo «valle de sombra de muerte»?',
    '¿Cómo lo habrían entendido sus primeros oyentes?',
    '¿Dónde más llama la Biblia pastor a Dios?',
    'Quiero entender mejor el versículo 5.',
    '¿Hay distintas interpretaciones de este pasaje?',
    '¿Qué dijo Spurgeon sobre este salmo?',
    '¿Qué relación hay entre el Salmo 23 y Juan 10?',
  ],

  keyWords: {
    'psalm-23:kw:yhwh': {
      english: 'el SEÑOR (Jehová)',
      basicMeaning: 'SEÑOR: el nombre propio del único Dios verdadero',
      semanticRange: [
        'el nombre personal del Dios de Israel, el nombre del pacto, revelado a Moisés (Éx 3:14–15)',
        'leído en voz alta como ’Adonai (‘Señor’) en la tradición judía; de ahí «SEÑOR» en versalitas en muchas Biblias (en inglés, «LORD»)',
        'vertido «Jehová» en traducciones más antiguas (así la Reina-Valera y los traductores ingleses de Calvino) y «Yahvé» o «Yahweh» en los estudios modernos (así la BLM y la World English Bible)',
      ],
      grammar: 'Nombre propio: el nombre personal de Dios',
      significance:
        'David no empieza con una palabra genérica para Dios, sino con su nombre del pacto: el Dios que se comprometió con Israel en el éxodo es aquel a quien llama «mi pastor». En el texto hebreo etiquetado de STEPBible el nombre aparece solo dos veces en este salmo —como primera palabra tras el encabezado «Salmo de David» y en su última línea—, de modo que todo lo que hay entre medias queda dentro del cuidado del SEÑOR. Muchas Biblias modernas imprimen SEÑOR (en inglés, LORD) en versalitas para señalar este nombre, que los lectores judíos pronuncian ’Adonai (‘Señor’); el léxico explica que el nombre se escribía con las vocales de ’Adonai, y de ahí procede la forma antigua «Jehová», la que usa la RVR1909. En toda la Biblia hebrea el nombre aparece etiquetado más de 6500 veces.',
      caution:
        'El texto hebreo conserva solo las consonantes YHWH con vocales prestadas; «Yahvé» (o «Yahweh») es la reconstrucción académica habitual de una pronunciación que el texto masorético no conserva.',
      notableNotes: [
        'Dios revela su nombre a Moisés y lo vincula con «YO SOY EL QUE SOY».',
        '«Jehová tu Dios fué contigo; y ninguna cosa te ha faltado»: el nombre unido a la presencia y a la provisión.',
        'El nombre vuelve en la última línea del salmo —«la casa de Jehová»— y enmarca todo el salmo.',
      ],
      anchors: [
        { verse: { book: 'PSA', chapter: 23, verse: 1 }, phrases: { RVR1909: 'JEHOVÁ', BLM: 'Yahvé', VBL: 'El Señor' } },
        { verse: { book: 'PSA', chapter: 23, verse: 6 }, phrases: { RVR1909: 'Jehová', BLM: 'Yahvé', VBL: 'Señor' } },
      ],
    },
    'psalm-23:kw:raah': {
      english: 'pastor',
      basicMeaning: 'apacentar, cuidar, pastorear',
      semanticRange: [
        'cuidar y apacentar un rebaño',
        'como participio: pastor, pastor de ganado',
        'en sentido figurado, de un gobernante o un maestro que cuida de las personas',
        'de los animales: pacer, pastar',
      ],
      grammar: 'Verbo, participio activo qal, masculino singular constructo, con sufijo de 1.ª persona — rōʿî, ‘mi pastor’ (literalmente, ‘el que me pastorea’)',
      significance:
        'El hebreo usa aquí un participio: rōʿî es ‘el que me pastorea’, una actividad en curso más que un título estático. En Israel y entre sus vecinos era lenguaje regio —a los reyes se los llamaba pastores de su pueblo—, así que llamar al SEÑOR «mi pastor» es confesarlo a la vez como rey y como quien cuida; y David, rey él mismo, se sitúa entre las ovejas. Las palabras etiquetadas con este verbo aparecen 169 veces en la Biblia hebrea de STEPBible, desde la bendición de Jacob (Gn 48:15) hasta la promesa de Ezequiel de que Dios mismo apacentará su rebaño (Ez 34:15).',
      caution:
        'La palabra en sí no conlleva «ternura» ni «autoridad» en todos sus usos; esos matices provienen de cómo el salmo y el resto del Antiguo Testamento desarrollan la imagen.',
      notableNotes: [
        'Jacob bendice al Dios que lo ha pastoreado toda su vida (la RVR1909 traduce «el Dios que me mantiene desde que yo soy hasta este día»): el mismo participio, la primera confesión personal de Dios como pastor en la Biblia.',
        '«Tú apacentarás á mi pueblo Israel»: el verbo describe la realeza de David.',
        '«Yo apacentaré mis ovejas»: Dios promete pastorear a su pueblo en persona.',
        '«Como pastor apacentará su rebaño»: el sustantivo y el verbo juntos.',
      ],
      anchors: [{ verse: { book: 'PSA', chapter: 23, verse: 1 }, phrases: { RVR1909: 'pastor', BLM: 'pastor', VBL: 'pastor' } }],
    },
    'psalm-23:kw:chaser': {
      english: 'faltará',
      basicMeaning: 'carecer, faltar',
      semanticRange: ['carecer, estar sin algo, tener necesidad', 'faltar, escasear', 'disminuir, menguar'],
      grammar: 'Verbo, imperfecto qal (yiqtol), 1.ª persona común singular — ʾeḥsār, ‘carezco / careceré’',
      significance:
        '«Nada me faltará» es una afirmación de suficiencia, no de lujo: el verbo significa carecer o estar sin algo. Es el verbo que resume los años de Israel en el desierto —«ninguna cosa te ha faltado» (Dt 2:7; compárese Neh 9:21)—, de modo que la línea puede oírse como la aplicación de la experiencia de Israel en el desierto a la vida de una sola persona, un vínculo que establecen tanto las notas de Tyndale como Sinclair Ferguson: el Dios que proveyó para Israel en el desierto es también el pastor del salmista. El verbo aparece 23 veces en la Biblia hebrea (según el etiquetado de STEPBible, recuento hecho para este estudio).',
      caution:
        'La línea promete que a la oveja no le faltará lo que el Pastor sabe que necesita —el Salmo 34:10 habla de no tener «falta de ningún bien»—, no que se le concederá todo deseo.',
      notableNotes: [
        '«Ninguna cosa te ha faltado»: Moisés, sobre los cuarenta años de Israel en el desierto.',
        '«De ninguna cosa tuvieron necesidad»: el mismo recuerdo en la gran oración de confesión de Israel.',
        'La tierra prometida, donde «no te faltará nada».',
        '«Los que buscan á Jehová, no tendrán falta de ningún bien.»',
      ],
      anchors: [
        { verse: { book: 'PSA', chapter: 23, verse: 1 }, phrases: { RVR1909: 'nada me faltará', BLM: 'No me faltará nada', VBL: 'tengo todo lo que necesito' } },
      ],
    },
    'psalm-23:kw:nephesh': {
      english: 'alma',
      basicMeaning: 'alma, uno mismo, vida',
      semanticRange: [
        'la vida, el ser viviente',
        'la persona: «yo mismo»',
        'apetito, deseo',
        'el ser interior, sede de las emociones y de la voluntad',
        'cuello (en un par de textos)',
      ],
      grammar: 'Sustantivo, femenino singular constructo, con sufijo de 1.ª persona — nafšî, ‘mi alma / mi vida / yo mismo’',
      significance:
        'Néfesh abarca todo el ser viviente —aliento, apetito, emoción, voluntad y la vida misma—, además de lo que el léxico describe como el ser interior del hombre. En 23:3 la imagen pastoril apunta a la persona entera: «Confortará mi alma» significa que el Pastor devuelve la vida y la fuerza a la oveja agotada o extraviada, no solo que refresca una facultad espiritual. El sustantivo aparece 754 veces en el etiquetado de STEPBible, con sentidos que van de ‘vida’ y ‘persona’ a ‘apetito’.',
      caution:
        'La palabra «alma» puede sugerir solo una parte interior y espiritual; aquí el contexto apunta a todo el ser. El estudio de la palabra no zanja por sí solo cuestiones más amplias de antropología bíblica, en las que los cristianos difieren.',
      notableNotes: [
        'El hombre llegó a ser «alma viviente» (néfesh) cuando Dios sopló en él aliento de vida.',
        'La ley de Jehová es perfecta, «que vuelve el alma»: el mismo sustantivo con el mismo verbo (šûb) en otra conjugación.',
        'Amar al SEÑOR «de toda tu alma»: con todo el ser.',
      ],
      anchors: [{ verse: { book: 'PSA', chapter: 23, verse: 3 }, phrases: { RVR1909: 'alma', BLM: 'alma' } }],
    },
    'psalm-23:kw:shuv': {
      english: 'confortará (hace volver)',
      basicMeaning: 'volver, regresar; (polel) hacer volver, restaurar, reanimar',
      semanticRange: ['volverse, regresar', 'volverse a Dios: arrepentirse', '(polel, hifil) hacer volver, restaurar, reanimar', 'devolver, pagar'],
      grammar:
        'Verbo, imperfecto polel (etiquetado como piel en STEPBible; el polel es la conjugación intensiva de las raíces huecas como šûb), 3.ª persona masculina singular — yəšôbēb, ‘hace volver, restaura’ (en 23:6 el texto masorético tiene wəšabtî, perfecto qal con waw, ‘y volveré’)',
      significance:
        'El movimiento básico del verbo es ‘volverse’. En esta conjugación significa hacer volver a alguien —una oveja extraviada que regresa, una vida desfallecida que se reanima—, y por eso las traducciones oscilan entre «confortará» (RVR1909), «restaura» (BLM) y ‘hace volver’. Franz Delitzsch, en el comentario de Keil y Delitzsch, lo describe como hacer volver un alma que, por así decirlo, se ha ido volando, para que vuelva en sí. El verbo puede resonar también al final del salmo: el texto hebreo, tal como está vocalizado, dice ‘y volveré’ en el versículo 6, de modo que al Pastor que me hace volver (v. 3) le corresponde mi regreso a su casa.',
      caution:
        'Se discute si 23:3 se refiere a una restauración moral (el arrepentimiento) o a fuerzas renovadas; la imagen pastoril admite sin dificultad ambas cosas, pero ninguna debe forzarse a partir de la palabra sola.',
      notableNotes: [
        '«Que vuelve el alma»: šûb (hifil) con néfesh, como en 23:3.',
        '«Harélas volver á sus moradas»: Dios hace volver a su rebaño disperso.',
        'Las vocales masoréticas leen ‘y volveré’; las versiones antiguas leen ‘moraré’ (véase la nota textual).',
      ],
      anchors: [
        { verse: { book: 'PSA', chapter: 23, verse: 3 }, phrases: { RVR1909: 'Confortará', BLM: 'restaura', VBL: 'consuela' } },
        { verse: { book: 'PSA', chapter: 23, verse: 6 }, phrases: { RVR1909: 'moraré', BLM: 'habitaré', VBL: 'viviré' } },
      ],
    },
    'psalm-23:kw:tsalmavet': {
      english: 'sombra de muerte',
      basicMeaning: 'sombra de muerte, oscuridad profunda',
      semanticRange: [
        'oscuridad profunda, tinieblas densas',
        'sombra de muerte: peligro o angustia extremos',
        'la oscuridad del reino de los muertos (Job 10:21–22; 38:17)',
        'la oscuridad amenazante del desierto (Jer 2:6)',
      ],
      grammar: 'Sustantivo, masculino singular absoluto — en la expresión bəgêʾ ṣalmāwet, ‘en un valle de sombra de muerte / de oscuridad profunda’',
      significance:
        'Un lector del hebreo podía oír dos cosas en esta palabra poco frecuente: ‘sombra’ (ṣēl) + ‘muerte’ (māwet), y una palabra para la oscuridad densa. Las vocales masoréticas y la Septuaginta griega (skia thanatou) respaldan «sombra de muerte»; muchos estudiosos modernos la derivan de una raíz que significa ‘estar oscuro’, de ahí la nota al pie de la BSB inglesa, «the valley of deep darkness» (‘el valle de oscuridad profunda’). Aparece 18 veces, 10 de ellas en Job, casi siempre para la oscuridad en su forma más amenazante (Amós 5:8 la usa simplemente para las tinieblas que Dios convierte en mañana). En cualquier caso, la imagen es la de un desfiladero tan oscuro que la muerte parece cercana, y es precisamente allí donde el salmo dice «tú estarás conmigo».',
      caution:
        'El versículo trata de atravesar el peligro en compañía de Dios, no solo del momento de morir; con razón se lee en los funerales, pero su primer sentido es más amplio.',
      notableNotes: [
        '«Las puertas de la sombra de muerte», en paralelo con «las puertas de la muerte».',
        'El desierto como «tierra seca y de sombra de muerte»: la misma palabra para la amenaza del desierto.',
        '«Tierra de sombra de muerte», sobre la que resplandece una gran luz (citado en Mt 4:16).',
      ],
      anchors: [
        { verse: { book: 'PSA', chapter: 23, verse: 4 }, phrases: { RVR1909: 'sombra de muerte', BLM: 'sombra de la muerte', VBL: 'oscuro de la muerte' } },
      ],
    },
    'psalm-23:kw:shevet': {
      english: 'vara',
      basicMeaning: 'vara, bastón, cetro; tribu',
      semanticRange: [
        'vara o garrote: un instrumento del pastor',
        'cetro: el distintivo de la autoridad de un gobernante',
        'vara de corrección',
        'tribu (el sentido más frecuente de la palabra)',
      ],
      grammar: 'Sustantivo, masculino singular constructo, con sufijo de 2.ª persona — šibṭəkā, ‘tu vara’',
      significance:
        'El šēbeṭ del pastor era un garrote o vara para ahuyentar a los depredadores y para guiar y contar el rebaño; su compañero en este versículo, el mišʿenet («cayado», H4938B), está emparentado con una palabra que significa ‘apoyo’: algo en que apoyarse. La misma palabra šēbeṭ designa también el cetro de un gobernante, de modo que la imagen une discretamente la protección y la autoridad regia. El consuelo del versículo 4 no procede de la ausencia de peligro, sino de ver al alcance de la mano el arma y el apoyo del Pastor.',
      notableNotes: [
        '«Apacienta tu pueblo con tu cayado»: la misma palabra, en una oración a Dios como pastor.',
        'Los animales se contaban al pasar «bajo la vara».',
        '«No será quitado el cetro de Judá»: el sentido regio.',
      ],
      anchors: [{ verse: { book: 'PSA', chapter: 23, verse: 4 }, phrases: { RVR1909: 'tu vara', BLM: 'Tu vara', VBL: 'Tu vara' } }],
    },
    'psalm-23:kw:dashan': {
      english: 'ungiste',
      basicMeaning: 'prosperar, engordar; (piel) engordar, ungir',
      semanticRange: [
        'estar gordo, engordar: imagen de prosperidad',
        '(piel) engordar, ungir',
        '(piel) hallar ‘gruesa’ una ofrenda, es decir, aceptable',
        '(piel) quitar la ceniza grasa del altar',
      ],
      grammar: 'Verbo, perfecto piel, 2.ª persona masculina singular — diššantā, ‘has ungido / has engordado’',
      significance:
        'No es māšaḥ, el verbo con que se ungía a reyes y sacerdotes (la raíz de «Mesías», usado cuando Samuel ungió a David, 1 S 16:13), sino un verbo doméstico que significa ‘engordar’: derramar aceite en abundancia sobre un invitado. El margen de la KJV inglesa lo señala: «Heb. makest fat» (‘en hebreo, engordas’). El anfitrión del versículo 5 no se limita a admitir a David a su mesa: lo honra con la abundancia que un anfitrión generoso mostraba a un invitado bienvenido (compárese Lucas 7:46). El verbo aparece 11 veces.',
      notableNotes: [
        'Que Dios acepte tus holocaustos: literalmente, que los halle ‘gruesos’ (la RVR1909 traduce «reduzca á ceniza tu holocausto», otro sentido del mismo verbo).',
        '«El alma liberal será engordada»: el engorde como imagen de prosperidad.',
        '«La buena fama engorda los huesos»: la misma conjugación piel que «ungiste» en 23:5.',
      ],
      anchors: [{ verse: { book: 'PSA', chapter: 23, verse: 5 }, phrases: { RVR1909: 'ungiste', BLM: 'Unges', VBL: 'ungiendo' } }],
    },
    'psalm-23:kw:hesed': {
      english: 'misericordia (amor leal)',
      basicMeaning: 'bondad, benevolencia, fidelidad',
      semanticRange: [
        'amor leal dentro de una relación o de un pacto',
        'bondad mostrada más allá de la obligación',
        'fidelidad, amor constante: el compromiso de Dios con su pacto',
      ],
      grammar: 'Sustantivo, masculino singular absoluto, unido por ‘y’ — wāḥesed',
      significance:
        'Ḥesed es amor leal y comprometido: la bondad de quien se ha obligado con otro. El interlineal de STEPBible lo glosa aquí como ‘lealtad al pacto’, y las traducciones recurren a «misericordia» (RVR1909), «amor» (BLM), «amor inagotable» (VBL) y, en inglés, «mercy», «loving kindness», «steadfast love» o «loving devotion». Unido a la bondad («el bien», en la RVR1909), convierte el último versículo en una afirmación sobre el carácter del SEÑOR: el Dios que condujo a Israel en su misericordia hasta la morada de su santuario (Éx 15:13) hará lo mismo con una sola oveja. Aparece unas 245 veces en el texto etiquetado.',
      caution:
        'Ninguna palabra española recoge por sí sola el sentido de ḥesed; conviene no tratar una traducción (por ejemplo, «gracia») como su significado fijo.',
      notableNotes: [
        '«Condujiste en tu misericordia á este pueblo, al cual salvaste»: un ḥesed que conduce a la morada de Dios.',
        'El SEÑOR, «grande en benignidad y verdad».',
        'El estribillo de Israel: «porque para siempre es su misericordia».',
      ],
      anchors: [{ verse: { book: 'PSA', chapter: 23, verse: 6 }, phrases: { RVR1909: 'misericordia', BLM: 'amor', VBL: 'amor inagotable' } }],
    },
    'psalm-23:kw:radaph': {
      english: 'seguirán (perseguirán)',
      basicMeaning: 'perseguir',
      semanticRange: [
        'perseguir, dar caza, sobre todo a enemigos',
        'perseguir, acosar',
        'ir en pos de algo, procurar alcanzarlo (p. ej., la justicia)',
        'correr detrás de',
      ],
      grammar: 'Verbo, imperfecto qal, 3.ª persona masculina plural, con sufijo de 1.ª persona — yirdəpûnî, ‘me perseguirán’',
      significance:
        '«Me seguirán» es suave; el hebreo es más fuerte. Rādap̄ es el verbo que se usa para dar caza a un enemigo o perseguir a un fugitivo: la palabra con que los salmos de David hablan de quienes lo acosan. Aquí los perseguidores son la bondad y el ḥesed de Dios. Franz Delitzsch, en el comentario de Keil y Delitzsch, destaca el contraste: los enemigos del salmista lo persiguen, pero ahora solo la bondad y el favor lo perseguirán, todos los días de su vida. El verbo aparece 143 veces en el texto etiquetado.',
      notableNotes: [
        'Los egipcios, «siguiéndolos», alcanzaron a Israel junto al mar.',
        '«Persiga el enemigo mi alma»: en los salmos de David el verbo describe casi siempre a enemigos que lo persiguen (Sal 7:1; 31:15; 143:3).',
        '«La justicia, la justicia seguirás.»',
      ],
      anchors: [{ verse: { book: 'PSA', chapter: 23, verse: 6 }, phrases: { RVR1909: 'me seguirán', BLM: 'me seguirán', VBL: 'estarán conmigo' } }],
    },
  },

  crossReferences: {
    'psalm-23:xr:gen-48-15': {
      title: 'El Dios pastor de Jacob',
      explanation:
        'La primera persona de la Escritura que llama a Dios su pastor es Jacob, cuando bendice a los hijos de José al final de una vida larga y atribulada: el Dios que lo ha pastoreado toda su vida, «hasta este día» (la RVR1909 traduce «el Dios que me mantiene desde que yo soy hasta este día»). El hebreo usa el mismo participio de rāʿâ que el Salmo 23:1. La confesión de Jacob mira atrás a toda una vida de cuidado; David hace la misma confesión personal, y Sinclair Ferguson sugiere que aprendió a decirla de Jacob.',
    },
    'psalm-23:xr:exod-15-13': {
      title: 'Conducidos con ḥesed a la santa morada de Dios',
      explanation:
        'El cántico de Moisés tras el mar Rojo comparte con el Salmo 23 un grupo poco común de palabras. Dios conduce con su ḥesed (23:6) al pueblo que redimió —«Condujiste», nāḥâ, el verbo de «guiaráme» en 23:3— y lo lleva —«llevástelo», nāhal, el verbo de «me pastoreará» en 23:2— a su santa morada («la habitación de tu santuario»; nāweh, palabra que también significa pastizal o majada de un rebaño). La coincidencia sugiere que el salmo lee la vida de una persona según el modelo del éxodo: rescatada, conducida, sustentada y llevada a la casa de Dios.',
    },
    'psalm-23:xr:deut-2-7': {
      title: 'Cuarenta años, y «ninguna cosa te ha faltado»',
      explanation:
        'Moisés resume los años del desierto: «estos cuarenta años Jehová tu Dios fué contigo; y ninguna cosa te ha faltado». El verbo es el mismo de «nada me faltará» (ḥāsēr), y el versículo une la presencia de Dios («contigo») a su provisión: los dos temas de Salmo 23:1 y 23:4. Nehemías 9:21 recuerda la misma historia con el mismo verbo. El salmo no menciona el desierto, pero tanto las notas de Tyndale sobre 23:1 como Sinclair Ferguson remiten a este versículo: leída a su lado, la oveja solitaria del Salmo 23 disfruta de lo que todo el rebaño de Israel experimentó en el desierto.',
    },
    'psalm-23:xr:ps-80-1': {
      title: 'Pastor de Israel',
      explanation:
        'El Salmo 80 ora a Dios como «Pastor de Israel», el que pastorea «como á ovejas á José» y está entronizado entre querubines. Muestra la cara comunitaria y regia de la imagen: el SEÑOR pastorea a todo su pueblo como su rey. El Salmo 23 convierte esa confesión nacional en una confesión personal: «mi pastor».',
    },
    'psalm-23:xr:ps-27-4': {
      title: 'Morar en la casa del SEÑOR todos mis días',
      explanation:
        'El Salmo 27:4 es el paralelo más cercano a 23:6: «que esté yo en la casa de Jehová todos los días de mi vida». Comparte la expresión hebrea ‘todos los días de mi vida’ y usa šibtî, ‘mi morar’, de yāšab, el verbo que las traducciones antiguas leen en 23:6. Muestra además lo que significaba para David «la casa de Jehová»: el lugar para «contemplar la hermosura de Jehová» e «inquirir en su templo».',
    },
    'psalm-23:xr:ps-16-5': {
      title: 'El SEÑOR, mi porción y mi copa',
      explanation:
        'Otro salmo de David usa la copa como imagen de la porción asignada a cada uno: «Jehová es la porción de mi parte y de mi copa; tú sustentarás mi suerte». Leída junto a 23:5, la copa que rebosa es más que una bebida abundante: es una vida cuya porción, dada por Dios, es más que suficiente.',
    },
    'psalm-23:xr:isa-40-11': {
      title: '«Pastoreará suavemente las paridas»',
      explanation:
        'El mensaje de consuelo de Isaías a los desterrados presenta al SEÑOR que viene como pastor: recoge los corderos en su brazo y «pastoreará suavemente las paridas». El hebreo usa las mismas dos palabras que el Salmo 23: rāʿâ, ‘pastorear’, y nāhal, ‘conducir’, un verbo poco frecuente (10 apariciones) para guiar con cuidado hacia el descanso y el refrigerio. Lo que David confesó en primera persona, el profeta lo promete a todo un pueblo que vuelve a casa.',
    },
    'psalm-23:xr:isa-43-2': {
      title: '«Yo seré contigo» en las aguas y en el fuego',
      explanation:
        'La promesa de Dios a Israel —«Cuando pasares por las aguas, yo seré contigo… Cuando pasares por el fuego, no te quemarás»— sigue la misma lógica que 23:4. Ninguno de los dos textos promete que el pueblo de Dios evitará el peligro; ambos prometen su presencia en él. Por eso el salmista puede decir: «no temeré mal alguno; porque tú estarás conmigo».',
    },
    'psalm-23:xr:jer-23-1': {
      title: 'Malos pastores y el renuevo justo',
      explanation:
        'Jeremías denuncia a los reyes de Judá como pastores «que desperdician y derraman las ovejas», y promete luego que el SEÑOR mismo recogerá a su rebaño y lo hará volver a sus moradas, y que despertará a David un «renuevo justo». Es el Salmo 23 al revés: donde los pastores humanos no supieron proveer, guiar ni proteger, Dios hará lo que el salmo confiesa. El nombre del rey que ha de venir, «JEHOVÁ, JUSTICIA NUESTRA» (ṣidqēnû, de la misma raíz que ṣedeq, ‘justicia’, en 23:3), puede oírse como respuesta a las «sendas de justicia» del salmo.',
    },
    'psalm-23:xr:ezek-34-11': {
      title: 'Dios mismo apacentará su rebaño',
      explanation:
        'Ezequiel 34 se lee como el Salmo 23 convertido en promesa divina. Tras condenar a los pastores egoístas de Israel, Dios dice: «yo, yo requeriré mis ovejas», «En buenos pastos las apacentaré… allí dormirán en buena majada», «Yo apacentaré mis ovejas, y yo les haré tener majada» (el mismo verbo y la misma conjugación que «me hará yacer», 23:2) y «Yo buscaré la perdida, y tornaré la amontada». Después promete «un pastor… á mi siervo David» (34:23): el capítulo que Jesús tiene presente cuando se llama a sí mismo el buen pastor, según las notas de Tyndale sobre Juan 10.',
    },
    'psalm-23:xr:luke-7-44': {
      title: 'Ungir con aceite la cabeza del invitado',
      explanation:
        'Cuando Simón el fariseo descuidó las cortesías habituales, Jesús le hizo notar: «No ungiste mi cabeza con óleo». Las notas de Tyndale explican que ungir con aceite de oliva la cabeza de un invitado era una manera de honrar a un visitante respetado. La escena muestra la costumbre que hay detrás de 23:5: el SEÑOR no trata al salmista como a un extraño tolerado, sino como a un invitado de honor.',
    },
    'psalm-23:xr:mark-6-34': {
      title: 'Ovejas sin pastor, recostadas sobre la hierba verde',
      explanation:
        'Marcos cuenta que Jesús tuvo compasión de la multitud «porque eran como ovejas que no tenían pastor» (eco de Nm 27:17), les enseñó, los hizo recostar «sobre la hierba verde» y les dio de comer hasta que «comieron todos, y se hartaron». Muchos lectores oyen el Salmo 23 detrás de la escena —el pastor que hace descansar a su rebaño en verdes pastos y provee para que no le falte nada—, con Jesús haciendo lo que el salmo dice que hace el SEÑOR. Kenneth Bailey dedica a este pasaje un capítulo de su estudio sobre el tema del pastor.',
    },
    'psalm-23:xr:luke-15-3': {
      title: 'El pastor que hace volver a la perdida',
      explanation:
        'En la parábola de Jesús, el pastor deja las noventa y nueve, va tras la oveja perdida «hasta que la halle» y la lleva a casa sobre sus hombros, gozoso. El relato da forma narrativa a «Confortará mi alma»: el Pastor hace volver a la que se había extraviado; y Jesús lo aplica al gozo de Dios por un pecador que se arrepiente. Matthew Henry lee así 23:3: el Pastor me restaura cuando me extravío.',
    },
    'psalm-23:xr:john-10-11': {
      title: '«Yo soy el buen pastor»',
      explanation:
        'Jesús reclama para sí el papel que el Salmo 23 da al SEÑOR y que Ezequiel 34 prometió que Dios asumiría en persona: «Yo soy el buen pastor». Conoce a sus ovejas y ellas lo conocen; a diferencia del asalariado, «su vida da por las ovejas» y la vuelve a tomar. Por eso los cristianos leen el Salmo 23 como cumplido en Cristo: no porque David escribiera directamente sobre Jesús, sino porque el Pastor en quien confiaba se ha acercado en Jesús. Las notas de Tyndale sobre Juan 10 sitúan el Salmo 23 dentro de la tradición veterotestamentaria de Dios como pastor de Israel en la que se apoya Jesús, y dicen que él reflexiona sobre los dirigentes de Israel a la luz de Ezequiel 34. Franz Delitzsch, en el comentario de Keil y Delitzsch, establece la relación: el «mi pastor» del salmista encuentra su respuesta en el «Yo soy el buen pastor».',
    },
    'psalm-23:xr:heb-13-20': {
      title: 'El gran pastor, sacado de entre los muertos',
      explanation:
        'Hebreos bendice al «Dios de paz que sacó de los muertos á nuestro Señor Jesucristo, el gran pastor de las ovejas». La expresión griega ‘el pastor de las ovejas’, con Dios que lo hace subir, recuerda el Antiguo Testamento griego de Isaías 63:11, que habla de Dios haciendo subir del mar a Moisés, ‘el pastor de las ovejas’. El Pastor que conduce a su rebaño por el valle de sombra de muerte ha atravesado él mismo la muerte y ha salido de ella.',
    },
    'psalm-23:xr:1pet-2-25': {
      title: 'De vuelta al Pastor de las almas',
      explanation:
        'Pedro, citando Isaías 53:6, dice a los creyentes que eran «como ovejas descarriadas», pero que ahora «habéis vuelto al Pastor y Obispo de vuestras almas». Su griego comparte tres palabras clave con la Septuaginta del Salmo 23 (Sal 22 en su numeración): el verbo de volver (epistrephō; ‘hizo volver mi alma’, 22:3 LXX), ‘alma’ (psychē) y ‘pastor’ (poimēn/poimainō). Lo que el salmo describe desde el lado de la oveja —el Pastor que restaura el alma— Pedro lo describe como la conversión a Cristo.',
    },
    'psalm-23:xr:1pet-5-4': {
      title: 'Cuando aparezca el Príncipe de los pastores',
      explanation:
        'Pedro exhorta a los ancianos de la iglesia a apacentar «la grey de Dios» de buena gana y con humildad, como ejemplos y no como señores, porque aparecerá «el Príncipe de los pastores». La imagen del pastoreo de Dios en el Salmo 23 se convierte en el modelo para los dirigentes de la iglesia, pastores subordinados que rinden cuentas a Cristo. F. B. Meyer relaciona los tres títulos del Nuevo Testamento con los Salmos 22–24: el Buen Pastor que murió, el Gran Pastor que guarda a su rebaño y el Príncipe de los pastores que ha de volver.',
    },
    'psalm-23:xr:rev-7-17': {
      title: 'El Cordero los pastoreará',
      explanation:
        'La propia nota de la BSB a Salmo 23:1 remite aquí. En la visión de Juan, «el Cordero que está en medio del trono los pastoreará, y los guiará á fuentes vivas de aguas», y Dios enjugará toda lágrima. Los verbos griegos para ‘pastorear’ (poimainō) y ‘guiar’ (hodēgeō) son los que la Septuaginta usa en el Salmo 23:1 y 3, y la escena retoma además Isaías 49:10, donde Dios guía a su pueblo —con nāhal, el verbo de 23:2— a «manaderos de aguas» (las notas de la BSB a Ap 7:17 remiten a ambos pasajes, Salmo 23:1 e Isaías 49:10). El Apocalipsis cumple la promesa de Isaías con un lenguaje que resuena con el Salmo 23: los pastos y las aguas del salmo se convierten en imagen del hogar definitivo del pueblo de Dios.',
    },
  },

  context: {
    'psalm-23:ctx:shepherd-kings': {
      title: 'Los reyes como pastores en el antiguo Cercano Oriente',
      summary:
        'En todo el antiguo Cercano Oriente era habitual llamar a los gobernantes pastores de su pueblo. En el epílogo de su código de leyes, Hammurabi de Babilonia (reinó c. 1792–1750 a. C.) se presenta como el pastor portador de salvación, cuyo cayado es recto. Cuando David llama al SEÑOR «mi pastor», usa lenguaje regio y, siendo él mismo rey, se sitúa entre las ovejas.',
      detail:
        'Las notas de Tyndale observan que el rey terrenal se entendía como representante del pastor divino que lo había puesto sobre su pueblo, y que los buenos reyes, que guiaban a su pueblo con firmeza y sabiduría, se parecían a los pastores. Las Escrituras de Israel usan la imagen para David («Tú apacentarás á mi pueblo Israel», 2 S 5:2), para el rey persa Ciro («Es mi pastor», Is 44:28) y, en sentido negativo, para los reyes que dispersaron el rebaño (Jer 23:1–2; Ez 34:2–6). El epílogo de Hammurabi reúne incluso imágenes que recuerdan el salmo —un cayado recto, una sombra benéfica extendida sobre su ciudad, un pueblo al que se deja reposar en paz—, pero el salmo atribuye el papel de pastor a Dios y no a un rey humano.',
    },
    'psalm-23:ctx:shepherding': {
      title: 'El oficio de pastor en el antiguo Israel',
      summary:
        'Pastorear era un trabajo duro y a la intemperie. David estaba con las ovejas de su padre cuando Samuel mandó llamarlo (1 S 16:11), y contó a Saúl cómo había librado corderos de un león y de un oso (1 S 17:34–35). Los pastores tenían que proteger el rebaño de las fieras, soportar el calor, el frío, el viento y la lluvia, conocer a cada oveja y conducirlas a buenos pastos y a aguas tranquilas.',
      detail:
        'De noche, un pastor del desierto podía guardar el rebaño en un redil: un cercado de muros bajos de piedra coronados de ramas espinosas. De día iba delante, y las ovejas seguían una voz que conocían (Jn 10:3–4); un buen pastor guía, no arrea. Jacob se niega a forzar a los animales que crían y avanza «poco á poco al paso de la hacienda» (Gn 33:13–14), con una forma de nāhal, el verbo que la RVR1909 traduce «me pastoreará» en 23:2.',
    },
    'psalm-23:ctx:wilderness': {
      title: 'Pastos, barrancos y desierto',
      summary:
        'El paisaje del salmo es uno que David conocía: las pocas ovejas de su padre pastaban «en el desierto» (1 S 17:28), donde los pastos verdes y el agua tranquila son preciosos. El «valle» del versículo 4 (gêʾ) es, según el léxico, un valle escarpado o un desfiladero estrecho, y Jeremías usa la palabra ṣalmāwet para la amenaza del desierto: «tierra seca y de sombra de muerte» (Jer 2:6).',
      detail:
        'Franz Delitzsch, en el comentario de Keil y Delitzsch, explica la palabra para ‘pastos’ (nāʾôt) como un lugar de descanso o de morada, incluso un oasis: un rincón verde en el desierto. El recuerdo que Israel guardaba del desierto también dio forma al lenguaje del salmo: allí el SEÑOR condujo a su pueblo «como un rebaño» (Sal 78:52) y «ninguna cosa» le faltó (Dt 2:7).',
    },
    'psalm-23:ctx:rod-staff': {
      title: 'La vara y el cayado',
      summary:
        'El pastor llevaba dos instrumentos. El šēbeṭ era una vara o garrote —un instrumento de pastor, como dice el léxico— que servía para rechazar a los depredadores y para guiar y contar el rebaño; el mišʿenet era un cayado en que apoyarse. Las notas de Tyndale observan que el pastor usaba la vara y el cayado para alejar el peligro.',
      detail:
        'Levítico menciona los animales que se contaban al pasar «bajo la vara» (Lv 27:32), y David salió al encuentro de Goliat con «su cayado en su mano» (1 S 17:40); las notas de Tyndale observan que Goliat solo podía ver el cayado, no la honda escondida. La misma palabra šēbeṭ se usa para el cetro de un gobernante (Gn 49:10), y Miqueas ora: «Apacienta tu pueblo con tu cayado» (Mi 7:14).',
    },
    'psalm-23:ctx:hospitality': {
      title: 'La mesa del anfitrión y el invitado ungido',
      summary:
        'El versículo 5 se inspira en las costumbres de la hospitalidad. El anfitrión prepara una comida para su invitado a la vista de unos enemigos que pueden mirar pero no molestarlo, y lo honra ungiendo su cabeza con aceite. En tiempos de Jesús, ungir con aceite de oliva la cabeza de un invitado seguía siendo una manera de honrar a un visitante respetado (Lc 7:44–46).',
      detail:
        'Las notas de Tyndale añaden que ungir la cabeza expresaba honor, hospitalidad y refrigerio para el invitado (compárese Sal 92:10; 133:2). Franz Delitzsch, en el comentario de Keil y Delitzsch, sugiere un momento concreto de la vida de David: cuando huía de Absalón, unos aliados llevaron camas, comida y bebida a su gente agotada en el desierto (2 S 17:27–29). Sin embargo, el salmo mismo no nombra ninguna ocasión.',
    },
    'psalm-23:ctx:superscription': {
      title: '«Salmo de David»',
      summary:
        'El encabezado hebreo, mizmôr lədāwid, suele traducirse «Salmo de David». La preposición lə- puede significar ‘de’, ‘para’, ‘dedicado a’ o ‘acerca de’, así que el encabezado puede nombrar a David como autor o simplemente relacionar el salmo con él; la introducción de Tyndale recomienda cautela antes de leer cada uno de estos encabezados como indicación de autoría, aunque admite que muchos de estos salmos pudieron ser escritos por David.',
      detail:
        'En las Biblias hebreas el encabezado cuenta como parte del versículo 1, razón por la cual la numeración hebrea de los versículos difiere a menudo de la de las Biblias en español o en inglés. Los intérpretes que aceptan la autoría davídica discrepan sobre cuándo lo escribió: Calvino lo lee como palabras de David en la cumbre de su prosperidad como rey, Spurgeon y Maclaren imaginan al rey recordando sus años de pastor, y Franz Delitzsch (en el comentario de Keil y Delitzsch) lo relaciona con la huida de David ante Absalón (2 S 17:27–29). El texto mismo no indica ninguna ocasión.',
    },
    'psalm-23:ctx:genre': {
      title: 'Un salmo de confianza',
      summary:
        'El Salmo 23 pertenece a los salmos de confianza: no contiene queja ni petición, solo afirmaciones confiadas sobre Dios y dirigidas a Dios. Las notas de Tyndale lo llaman un salmo de confianza y seguridad en el Señor y lo sitúan en un grupo (Sal 23–28) que desarrolla el cuidado pastoral de Dios, su guía, su bondad y el anhelo de habitar en su casa.',
      detail:
        'Se encuentra en el Libro Primero del Salterio (Sal 1–41), donde predomina el nombre divino YHWH. Matthew Henry lo contrapone a los muchos salmos de David que están llenos de quejas: este, dice, está lleno de consuelos. Su poesía funciona sobre todo con líneas e imágenes emparejadas más que con la rima (si la poesía hebrea tiene un metro regular es cuestión debatida).',
    },
    'psalm-23:ctx:christian-worship': {
      title: 'El Salmo 23 en el culto cristiano',
      summary:
        'Los cristianos han orado y cantado este salmo desde la iglesia primitiva. A finales del siglo IV, las catequesis mistagógicas atribuidas a Cirilo de Jerusalén (algunos estudiosos las asignan a su sucesor, Juan) usaban el versículo 5 para instruir a los recién bautizados sobre la Mesa del Señor y la unción que habían recibido, y Agustín leyó su ‘agua del refrigerio’ como el bautismo. La versión métrica escocesa «The Lord’s my shepherd» apareció por primera vez en el Salterio métrico escocés de 1650, y Spurgeon comentó que el versículo 4 se había cantado junto a innumerables lechos de muerte.',
      detail:
        'Spurgeon abrió su sermón de 1880 sobre el versículo 4 citando la versión métrica escocesa. El himno de Henry W. Baker «The King of love my Shepherd is» parafrasea el salmo con referencia explícita a Cristo y a su cruz; F. B. Meyer lo imprimió al comienzo de The Shepherd Psalm.',
    },
    'psalm-23:ctx:jewish-tradition': {
      title: 'El Salmo 23 en la lectura y la oración judías',
      summary:
        'En la práctica judía, el salmo (Mizmor leDavid) se reza especialmente en sábado: un artículo de Chabad.org lo describe como un canto célebre sobre todo en la tercera comida del sábado, añade que algunas comunidades (entre ellas Chabad) lo dicen también antes de las otras comidas del sábado, y remonta la costumbre al cabalista del siglo XVI Isaac Luria. El artículo lo presenta como una confesión de que Dios provee.',
      detail:
        'Los intérpretes judíos han leído el salmo a la luz de la historia de Israel. Según las notas de John Gill, el Targum arameo parafrasea el versículo 1 como Dios que alimenta a Israel en el desierto, lee el valle oscuro como el cautiverio y entiende la casa del versículo 6 como el santuario, mientras que los comentaristas medievales Rashi y David Kimchi relacionaron el valle con la huida de David ante Saúl en el desierto de Zif.',
    },
  },

  literary: {
    placeInBook:
      'El Salmo 23 se encuentra en el Libro Primero del Salterio (Sal 1–41), entre los salmos vinculados con David (Sal 3–32; 34–41), donde predomina el nombre divino YHWH. Sigue al Salmo 22, que comienza «Dios mío, Dios mío, ¿por qué me has dejado?», y precede al Salmo 24, donde el Rey de gloria entra por sus puertas. Spurgeon observa que sigue al Salmo 22, al que llama de modo muy particular el salmo de la cruz, y que el salmo del pastor viene solo después de él; F. B. Meyer refiere que al Salmo 23 se lo ha llamado a veces el salmo del cayado, situado entre el salmo de la cruz y el salmo de la corona. Las notas de Tyndale agrupan además los Salmos 23–28 en torno al cuidado pastoral de Dios, su guía, su bondad y el anhelo de habitar en su casa.',
    argument:
      'El salmo avanza en dos etapas. En los versículos 1–4 el SEÑOR es el pastor: provee (v. 1), da descanso y agua (v. 2), restaura y guía (v. 3) y acompaña a la oveja a través del valle más oscuro (v. 4). En los versículos 5–6 la imagen se convierte en un banquete: el SEÑOR es el anfitrión que prepara una mesa delante de los enemigos, honra al invitado con aceite y llena su copa, hasta que la bondad y el ḥesed persiguen al salmista todos sus días y lo llevan a la casa del SEÑOR. Por el camino, David deja de hablar acerca de Dios y empieza a hablarle a él: el «él» se convierte en «tú» en el momento en que el valle se oscurece.',
    placeInCanon:
      'La imagen del pastor recorre toda la Biblia. Jacob bendice al Dios que lo ha pastoreado (Gn 48:15); Dios conduce a Israel por el desierto como a un rebaño (Sal 78:52); David es tomado de las majadas de las ovejas para apacentar a Israel (Sal 78:70–72; 2 S 5:2). Cuando los reyes de Israel fallan como pastores, los profetas prometen que Dios mismo pastoreará a su pueblo y levantará un pastor del linaje de David (Jer 23:1–6; Ez 34:11–24). Jesús reclama ese papel (Jn 10:11), las cartas del Nuevo Testamento lo llaman el gran pastor y el Príncipe de los pastores (Heb 13:20; 1 P 5:4), y el Apocalipsis cierra la historia con el Cordero que pastorea a su pueblo hacia fuentes de aguas de vida (Ap 7:17).',
    bookOutline: [
      'Libro Primero — Salmos 1–41',
      'Libro Segundo — Salmos 42–72',
      'Libro Tercero — Salmos 73–89',
      'Libro Cuarto — Salmos 90–106',
      'Libro Quinto — Salmos 107–150',
    ],
    passageOutline: [
      'El SEÑOR, mi pastor: provisión, descanso y guía',
      'A través del valle más oscuro: «tú estarás conmigo»',
      'El SEÑOR, mi anfitrión: mesa, aceite y copa',
      'Perseguido por la bondad, en casa del SEÑOR',
    ],
    features: {
      'psalm-23:lit:centre': {
        title: '«Porque tú estarás conmigo» en el centro (según un recuento de palabras)',
        description:
          'Si se cuentan las palabras hebreas de los versículos 1–6 tal como están divididas en el texto etiquetado de STEPBible (dejando aparte el encabezado «Salmo de David» y contando por separado las palabras unidas por maqqef, el guion hebreo), el salmo tiene 55 palabras. Las tres palabras kî-ʾattāh ʿimmādî, ‘porque tú [estás] conmigo’ (v. 4), son las palabras 27–29: exactamente 26 palabras van antes y exactamente 26 después. Contara o no el poeta, la confesión de la presencia de Dios está en el centro aritmético y emocional del salmo. El resultado depende de la convención de recuento —si las palabras unidas por maqqef se cuentan como una sola, las mitades ya no se equilibran—, así que conviene presentarlo como una observación, no como prueba de un diseño.',
        structure: [
          { label: 'Palabras 1–26', text: 'vv. 1–4a: el SEÑOR como pastor, hasta «no temeré mal alguno»' },
          { label: 'Palabras 27–29', text: 'kî-ʾattāh ʿimmādî — «porque tú estarás conmigo»' },
          { label: 'Palabras 30–55', text: 'vv. 4b–6: vara y cayado, mesa, aceite y copa, bondad y ḥesed, la casa del SEÑOR' },
        ],
      },
      'psalm-23:lit:he-to-you': {
        title: 'Del «él» al «tú»',
        description:
          'En los versículos 1–3 David habla del SEÑOR en tercera persona («me hará yacer… me pastoreará. Confortará mi alma; guiaráme»). En el versículo 4, cuando el valle se oscurece, se vuelve para dirigirse directamente a Dios —«porque tú estarás conmigo: tu vara y tu cayado»— y sigue hablándole durante el versículo 5 («Aderezarás mesa… ungiste»). El versículo 6 vuelve a cerrar con el nombre: «la casa de Jehová». La gramática escenifica lo que el salmo quiere decir: en el peligro, hablar acerca de Dios se convierte en hablar con Dios.',
      },
      'psalm-23:lit:inclusio': {
        title: 'Enmarcado por el nombre del SEÑOR',
        description:
          'El nombre divino YHWH aparece solo dos veces en el salmo: como primera palabra tras el encabezado «Salmo de David» (v. 1) y en su última línea (v. 6, «la casa de Jehová»). El marco mantiene todo lo que hay entre medias —pastos, valle, mesa— dentro del nombre del SEÑOR.',
      },
      'psalm-23:lit:two-images': {
        title: 'Pastor y anfitrión, ¿o un solo viaje?',
        description:
          'La mayoría de los comentaristas ven dos cuadros: el SEÑOR como pastor (vv. 1–4) y como anfitrión (vv. 5–6). Franz Delitzsch, en el comentario de Keil y Delitzsch, señala que la figura del pastor se desvanece después del versículo 4 y aparece la del anfitrión; Maclaren divide el salmo en dos mitades: las ovejas de su prado y los invitados a su mesa y a su casa. Las imágenes pueden leerse también como un único viaje continuo, desde el pasto, a través del valle, hasta la casa del anfitrión, y el vocabulario que el salmo comparte con Éxodo 15:13 (los verbos de conducir y guiar, ḥesed, la ‘morada’ de Dios) sugiere un eco del viaje de Israel en el éxodo.',
      },
      'psalm-23:lit:return-echo': {
        title: 'Traído de vuelta, y de regreso a casa',
        description:
          'El verbo šûb (‘volverse, regresar’) aparece en el versículo 3 —«Confortará mi alma», literalmente ‘hace volver mi alma’— y, en el texto hebreo tal como lo vocalizaron los masoretas, otra vez en el versículo 6: wəšabtî, ‘y volveré’ a la casa del SEÑOR. Según esa lectura, el salmo queda enmarcado por un doble regreso: el Pastor me hace volver, y yo vuelvo a casa. Muchas traducciones siguen las versiones antiguas y leen ‘moraré’ (así la RVR1909, «moraré»; véase la nota textual en Perspectivas).',
      },
    },
  },

  theology: {
    'psalm-23:th:shepherd-king': {
      title: 'El SEÑOR como pastor y rey: provisión, guía, protección',
      summary:
        'Llamar al SEÑOR «mi pastor» es usar lenguaje regio, porque en Israel y en todo el antiguo Cercano Oriente a los reyes se los llamaba pastores. El salmo llena el título de cuidados concretos: provisión para que no falte nada necesario, descanso y agua, restauración, guía por sendas rectas y protección con la vara y el cayado. Calvino lo lee como una confesión de la providencia de Dios: a quienes él ha tomado a su cargo no les faltará lo que es bueno.',
      detail:
        'El título es también un reproche a los pastores humanos que fallan (Jer 23:1–2; Ez 34:2–6): lo que los reyes de Israel hicieron mal, el SEÑOR promete hacerlo él mismo (Ez 34:11–16). Su guía es «por amor de su nombre»: se funda no en el mérito de las ovejas, sino en su propio carácter y reputación, un punto en el que insisten tanto Calvino como las notas de Tyndale.',
    },
    'psalm-23:th:presence': {
      title: 'La presencia de Dios en el valle oscuro',
      summary:
        'El salmo no promete un camino que rodee el valle oscuro, sino compañía dentro de él: «no temeré mal alguno; porque tú estarás conmigo». Calvino observa que David no pretendía estar libre de todo temor, sino vencerlo fijando los ojos en el cayado de su Pastor. La promesa de la presencia de Dios en el peligro se repite en toda la Escritura —«Cuando pasares por las aguas, yo seré contigo» (Is 43:2)— y se hace carne en Jesús, llamado Emmanuel, «Con nosotros Dios» (Mt 1:23).',
      detail:
        'Agustín leyó el valle como esta misma vida mortal, vivida bajo la sombra de la muerte, y la presencia de Dios como Cristo que habita en el corazón por la fe, para que, pasada la sombra de muerte, el creyente pueda estar con él.',
    },
    'psalm-23:th:hesed': {
      title: 'Bondad y ḥesed: un amor del pacto que persigue',
      summary:
        'El último versículo nombra lo que ha estado actuando desde el principio: «el bien y la misericordia», el amor leal del SEÑOR a su pacto (ḥesed). El verbo no es un suave ‘seguir’, sino ‘perseguir’, la palabra que se usa para dar caza a un enemigo, aplicada ahora a la bondad de Dios que va tras su siervo todos sus días. Ese mismo ḥesed sacó a Israel de Egipto y lo condujo a la santa morada de Dios (Éx 15:13), y es el que celebra el estribillo de Israel: «porque para siempre es su misericordia» (Sal 136:1).',
      detail:
        'Como el Pastor actúa «por amor de su nombre» (v. 3), la seguridad del salmista descansa en el carácter de Dios y no en su propio desempeño: el Dios del pacto se ha comprometido con su pueblo.',
    },
    'psalm-23:th:house': {
      title: 'Acogido a la mesa y en la casa del SEÑOR',
      summary:
        'El salmo termina ante una mesa y en una casa. El SEÑOR es anfitrión además de pastor: prepara una comida a la vista de enemigos que no pueden intervenir, honra a su invitado con aceite y llena su copa. La meta es «la casa de Jehová», el lugar del culto y de la presencia de Dios, en la que el Salmo 27:4 anhela estar «todos los días de mi vida». Las notas de Tyndale relacionan el banquete con el banquete mesiánico prometido en Isaías 25:6 y representado en Apocalipsis 19:9.',
      detail:
        'Los maestros cristianos antiguos oyeron en él resonancias sacramentales. Las catequesis mistagógicas atribuidas a Cirilo de Jerusalén aplican la mesa a la Cena del Señor y el aceite a la unción de los recién bautizados; Agustín lee el ‘agua del refrigerio’ como el bautismo, pero entiende la mesa como el alimento sólido de la fe madura (ya no la leche de los niños) y el aceite como la alegría espiritual. Calvino mantiene como referencia primera la provisión diaria de Dios para David y el culto en el santuario, donde David anhelaba ofrecer sacrificios junto con los demás adoradores.',
    },
    'psalm-23:th:christ-shepherd': {
      title: 'El Pastor revelado en Jesús',
      summary:
        'Los cristianos leen el Salmo 23 a la luz de la afirmación de Jesús: «Yo soy el buen pastor» (Jn 10:11). En el Antiguo Testamento, el pastor del Salmo 23 es el SEÑOR mismo, y Ezequiel prometió tanto que Dios pastorearía en persona a su rebaño como que pondría sobre él «un pastor… á mi siervo David» (Ez 34:15, 23). Jesús reúne ambas líneas: es el pastor que da su vida por las ovejas, a quien Dios sacó de entre los muertos como el gran pastor (Heb 13:20), y el que aparecerá como Príncipe de los pastores (1 P 5:4).',
      detail:
        'La mayoría de los intérpretes actuales lo describen como tipología, no como la afirmación de que David escribiera conscientemente sobre Jesús, mientras que algunos lectores cristianos de otras épocas (Agustín, John Gill) entendieron que el SEÑOR del salmo era el Hijo mismo; en cualquier caso, el Nuevo Testamento presenta a Jesús como el cumplimiento del modelo que trazan el salmo y los profetas. Calvino lo expresa diciendo que Dios se ha mostrado ahora como nuestro pastor en la persona de su Hijo unigénito con mucha más claridad que a quienes vivieron bajo la Ley.',
    },
    'psalm-23:th:hope': {
      title: '«Por largos días»: ¿esperanza más allá de esta vida?',
      summary:
        'El hebreo del versículo 6 dice literalmente ‘por largura de días’ (como indican las notas al pie de la BSB y de la KJV inglesas, y como traduce la RVR1909: «por largos días»), una expresión que puede significar una vida larga (compárese Sal 91:16) o, dicho de la casa de Dios en el Salmo 93:5, ‘por todos los días venideros’; muchas traducciones la vierten «para siempre» (así la BLM y la VBL). Dentro del Antiguo Testamento, la línea expresa con toda naturalidad la comunión con Dios en su casa a lo largo de toda la vida. Los lectores cristianos, guiados por la imagen neotestamentaria del Cordero que pastorea a su pueblo hacia fuentes de aguas de vida (Ap 7:17), han oído también en ella la esperanza de morar con Dios más allá de la muerte, como hacen Matthew Henry y Spurgeon. El texto admite un horizonte presente y otro futuro.',
      detail:
        'La Septuaginta griega dice eis makrotēta hēmerōn, literalmente ‘por largura de días’ (en la traducción inglesa de Brenton, «for a very long time»). Matthew Henry ofrece ambas lecturas: la resolución de David de permanecer cerca de Dios mientras viva, y la perspectiva de una dicha perfecta en la casa del Padre.',
    },
  },

  perspectives: {
    'psalm-23:ps:tsalmavet': {
      question: 'En el versículo 4, ¿es «valle de sombra de muerte» o ‘valle de oscuridad profunda’?',
      intro:
        'La palabra hebrea ṣalmāwet puede entenderse de dos maneras, y las traducciones se dividen. Algunos intérpretes combinan ambas: Franz Delitzsch, en el comentario de Keil y Delitzsch, deriva la palabra de una raíz que significa ‘cubrir de sombra, oscurecer’ y no de un compuesto, pero sostiene que, tal como se pronuncia, significa la sombra de la muerte como epíteto de la oscuridad más terrible. Es una cuestión de filología más que de doctrina, y el sentido del versículo no cambia mucho en uno u otro caso.',
      commonGround:
        'Ambas lecturas representan la oscuridad más amenazante que una persona puede atravesar —el propio léxico da ‘sombra de muerte, sombra profunda, oscuridad profunda’— y ambas ponen el peso del versículo en las palabras siguientes: «no temeré mal alguno; porque tú estarás conmigo».',
      perspectives: {
        'psalm-23:ps:tsalmavet:shadow': {
          tradition: 'Traducción tradicional',
          label: '«Sombra de muerte»',
          summary:
            'Las vocales masoréticas dividen la palabra como ṣal + māwet, ‘sombra de muerte’, y así la leen la Septuaginta griega (skia thanatou) y, tras ella, las tradiciones latina, inglesa y española (la RVR1909: «valle de sombra de muerte»); Calvino recoge la opinión de gramáticos judíos que la tomaban como un compuesto: ‘sombra mortal’. El Nuevo Testamento usa la misma expresión griega para la oscuridad que Cristo disipa (Mt 4:16; Lc 1:79). Según esta lectura, el valle es explícitamente un lugar donde amenaza la muerte.',
        },
        'psalm-23:ps:tsalmavet:darkness': {
          tradition: 'Traducción filológica',
          label: '‘Oscuridad profunda’',
          summary:
            'Muchos estudiosos modernos remontan la palabra a una raíz que significa ‘estar oscuro’, de modo que significaría oscuridad densa o profunda. La lectura no es solo moderna: Rashi, siguiendo al gramático del siglo X Dunash ben Labrat, explica todas las apariciones de ṣalmāwet como oscuridad. La nota al pie de la BSB inglesa ofrece «the valley of deep darkness», y el interlineal de STEPBible glosa la palabra del mismo modo. Su uso para la oscuridad sin caminos del desierto (Jer 2:6) y para la oscuridad de una mina (Job 28:3) respalda un sentido amplio de oscuridad aterradora.',
        },
      },
    },
    'psalm-23:ps:dwell-return': {
      question: 'En el versículo 6, ¿el salmista «morará» en la casa del SEÑOR o ‘volverá’ a ella, y por cuánto tiempo?',
      intro:
        'Las consonantes de la palabra hebrea (wšbty) pueden leerse de dos maneras. Las vocales masoréticas dan wəšabtî, de šûb, ‘y volveré’; las antiguas traducciones griega y latina leen ‘mi morada’ y ‘que yo more’, como si viniera de yāšab, ‘morar’. La expresión final es literalmente ‘por largura de días’. Es una cuestión textual e interpretativa, no confesional.',
      commonGround:
        'En cualquier caso, el salmo termina con el salmista en la casa del SEÑOR por largos días, en presencia del Dios que lo ha perseguido con bondad y ḥesed. Si ‘largura de días’ significa una vida entera o llega más allá de la muerte es otra cuestión de interpretación.',
      perspectives: {
        'psalm-23:ps:dwell-return:dwell': {
          tradition: 'Versiones antiguas y la mayoría de las traducciones',
          label: '«Moraré»',
          summary:
            'La Septuaginta dice literalmente ‘y mi morada en la casa del Señor por largura de días’ (Brenton: «and my dwelling shall be in the house of the Lord for a very long time»), y la Vulgata latina la sigue («ut inhabitem», ‘para que yo more’); la mayoría de las versiones —en inglés, la KJV, la BSB y la WEB; en español, la RVR1909 («moraré»), la BLM («habitaré») y la VBL («viviré»)— leen ‘moraré’. El Salmo 27:4, muy paralelo, usa el infinitivo de yāšab —«que esté yo en la casa de Jehová todos los días de mi vida»— con la misma expresión ‘todos los días de mi vida’. Según esta lectura, el salmo termina con una residencia estable junto a Dios.',
        },
        'psalm-23:ps:dwell-return:return': {
          tradition: 'Texto hebreo masorético',
          label: '‘Volveré’',
          summary:
            'El hebreo, tal como está vocalizado, dice ‘y volveré’, el mismo verbo que «Confortará» en el versículo 3, y el texto etiquetado de STEPBible lo glosa así. Franz Delitzsch, en el comentario de Keil y Delitzsch, defiende esta lectura como una construcción pregnante (constructio praegnans): tras haber vuelto, el salmista morará de nuevo en la casa del SEÑOR; es un regreso al hogar, no una primera llegada. Según esta lectura, el salmo queda enmarcado por dos regresos: el Pastor me hace volver, y yo vuelvo a casa.',
        },
      },
    },
    'psalm-23:ps:readings': {
      question: '¿Quién es el Pastor, y hasta qué punto debe leerse el salmo a la luz de Cristo y de los sacramentos?',
      intro:
        'Lectores judíos y cristianos han amado este salmo durante milenios y lo han leído de maneras distintas, a veces superpuestas. También dentro del cristianismo existe una antigua diferencia de método entre las lecturas que pasan enseguida a Cristo y a los sacramentos y las que parten de la situación del propio David.',
      commonGround:
        'Todas estas lecturas coinciden en que el Pastor es el SEÑOR, el Dios de Israel, en que el salmo expresa confianza en su cuidado personal en medio del peligro y en que su meta es la vida en la presencia de Dios. Los cristianos añaden que este mismo Dios se ha acercado en Jesús como el buen pastor (Jn 10:11).',
      perspectives: {
        'psalm-23:ps:readings:jewish': {
          tradition: 'Tradición interpretativa judía',
          label: 'El SEÑOR que pastorea a Israel',
          summary:
            'La tradición judía entiende que el Pastor es el SEÑOR, el Dios de Israel, y a menudo oye el salmo a la luz de la historia de Israel. Según el testimonio de John Gill, el Targum parafrasea el versículo 1 como Dios que alimenta a Israel en el desierto, lee el valle oscuro como el cautiverio y toma la casa del versículo 6 como el santuario, mientras que Rashi y David Kimchi relacionaron el valle con la huida de David ante Saúl en el desierto de Zif. El salmo ocupa un lugar muy querido en la oración del sábado como confesión de que Dios provee.',
        },
        'psalm-23:ps:readings:patristic': {
          tradition: 'Iglesia antigua (lectura cristológica y sacramental)',
          label: 'Cristo, el Pastor que alimenta a su Iglesia',
          summary:
            'Agustín oye el salmo como la voz de la Iglesia que habla a Cristo: entiende ‘el Señor me apacienta’ de Cristo que pastorea a su pueblo, el ‘agua del refrigerio’ como el bautismo y el valle como esta vida mortal. Las catequesis mistagógicas atribuidas a Cirilo de Jerusalén, dirigidas a los recién bautizados, aplican la mesa a la mística Mesa de la Eucaristía y el aceite a la unción que los sella. Según esta lectura, el salmo se convierte en un canto de la iniciación cristiana.',
        },
        'psalm-23:ps:readings:reformation': {
          tradition: 'La Reforma y la exégesis protestante posterior',
          label: 'La confesión de David sobre la providencia, cumplida en Cristo',
          summary:
            'Calvino lee el salmo ante todo como la confesión de David —un rey rico— que se reconoce una pobre oveja bajo la providencia de Dios, y se resiste a la alegoría: se niega, por ejemplo, a leer las «sendas de justicia» como la dirección del Espíritu, porque la metáfora del pastor sigue en marcha. Pero añade que Dios se ha mostrado como nuestro pastor con mucha más claridad en su Hijo. Los comentaristas protestantes posteriores varían: Matthew Henry y Spurgeon aplican el salmo con calidez a Cristo y a su pueblo, mientras que John Gill va más allá y entiende que «Jehová» es aquí el Hijo mismo.',
        },
      },
    },
  },

  commentary: {
    'psalm-23:cm:augustine': {
      lead: 'Sobre el valle de sombra de muerte (su Salmo 22, según la numeración latina)',
      quoteTranslation:
        'Aunque ande en medio de esta vida, que es la sombra de la muerte. No temeré mal alguno, porque tú estás conmigo. No temeré mal alguno, porque tú habitas en mi corazón por la fe; y tú estás ahora conmigo, para que, después de la sombra de la muerte, también yo esté contigo.',
    },
    'psalm-23:cm:cyril': {
      lead: 'Enseñanza a los recién bautizados sobre la mesa del versículo 5 (de las catequesis mistagógicas atribuidas tradicionalmente a Cirilo)',
      quoteTranslation:
        'Cuando el hombre dice a Dios: Has preparado delante de mí una mesa, ¿qué otra cosa indica sino aquella Mesa mística y espiritual que Dios nos ha preparado frente a —es decir, en contra y en oposición a— los espíritus malignos?',
    },
    'psalm-23:cm:rashi': {
      lead: 'Una lectura judía medieval del versículo 4 (resumida del hebreo)',
      text: 'Rashi entiende ‘el valle de ṣalmāwet’ como una tierra de oscuridad y dice que David lo pronunció a propósito del desierto de Zif; siguiendo al gramático Dunash ben Labrat, explica toda aparición de ṣalmāwet como oscuridad. Lee «tu vara y tu cayado» como los sufrimientos que habían venido sobre David y el apoyo de su confianza en el ḥesed de Dios: ambos lo consuelan, porque los sufrimientos sirven para el perdón del pecado, y está seguro de que Dios pondrá una mesa delante de él, que Rashi identifica con la realeza.',
    },
    'psalm-23:cm:calvin': {
      lead: 'Por qué Dios se llama a sí mismo pastor',
      quoteTranslation:
        'Dios, en la Escritura, se atribuye con frecuencia el nombre y asume el papel de pastor, y esta no es una pequeña muestra de su tierno amor hacia nosotros. Como es una manera humilde y sencilla de hablar, aquel que no desdeña rebajarse tanto por nuestra causa debe de tenernos un afecto singularmente intenso.',
    },
    'psalm-23:cm:henry': {
      lead: 'Sobre la «sombra de muerte» (v. 4)',
      quoteTranslation:
        'No es más que la sombra de la muerte; no hay en ella ningún mal sustancial; la sombra de una serpiente no pica, ni la sombra de una espada mata.',
    },
    'psalm-23:cm:gill': {
      lead: 'Una lectura cristológica, con notas sobre la interpretación judía',
      text: 'Gill entiende que «Jehová» en el versículo 1 es Cristo, el Hijo, a quien, según él, la Escritura da con más frecuencia el título de pastor, y así oye el salmo como la voz de las ovejas de Cristo. Por el camino recoge lecturas judías: el Targum entiende el versículo 1 como Dios que alimenta a Israel en el desierto y la casa del versículo 6 como el santuario, y los comentaristas medievales Rashi (a quien llama Jarchi) y Kimchi relacionaron el valle oscuro con la huida de David ante Saúl en el desierto de Zif.',
    },
    'psalm-23:cm:spurgeon': {
      lead: 'Sobre la pequeña palabra «mi» (v. 1)',
      quoteTranslation:
        'La palabra más dulce de todas es ese monosílabo: “mi”. No dice: “El Señor es el pastor del mundo entero, y conduce a la multitud como su rebaño”, sino: “El Señor es mi pastor”; si no es pastor de nadie más, es pastor mío; cuida de mí, vela por mí y me preserva.',
    },
    'psalm-23:cm:delitzsch': {
      lead: 'Del pastor al anfitrión (vv. 4–5), del volumen de Franz Delitzsch sobre los Salmos',
      quoteTranslation:
        'Después de que la figura del pastor se desvanece en el v. 4, aparece la del anfitrión. Sus enemigos tienen que mirar en silencio… sin poder hacer nada, y ver cómo Jahvé provee con largueza para su invitado, lo unge con dulces perfumes como en un banquete alegre y espléndido… y llena su copa hasta rebosar.',
    },
    'psalm-23:cm:maclaren': {
      lead: 'Sobre las sendas de justicia (v. 3): el descanso se da para el camino',
      quoteTranslation:
        'La vida no es un redil en el que las ovejas se tumben, sino un camino por el que han de andar. … El descanso es para capacitar para el trabajo; el trabajo, para endulzar el descanso.',
    },
    'psalm-23:cm:meyer': {
      lead: 'El Salmo 23 entre los Salmos 22 y 24',
      quoteTranslation:
        'A este salmo se lo ha llamado a veces el salmo del cayado. Está situado entre el salmo de la cruz y el salmo de la corona. Si el veintidós habla del Buen Pastor, que murió, y si el veinticuatro habla del Príncipe de los pastores, que ha de volver, el veintitrés habla del Gran Pastor, que guarda a su rebaño con sagacidad infalible y devoción incansable.',
    },
    'psalm-23:cm:phillip-keller': {
      lead: 'La lectura de un ganadero moderno (ilustrativa, no testimonio antiguo)',
      text: 'W. Phillip Keller, que trabajó durante años en la gestión de ranchos y crió ovejas él mismo, lee el Salmo 23 frase por frase a través de las realidades prácticas del pastoreo —lo que necesitan las ovejas para descansar, la indefensión de una oveja volcada que no puede levantarse, el traslado del rebaño a los pastos altos de verano, el tratamiento de las ovejas con aceite contra moscas y parásitos— y aplica cada una al cuidado de Cristo por su pueblo. (No debe confundirse con Timothy Keller.)',
    },
    'psalm-23:cm:bailey': {
      lead: 'La imagen del pastor desde David hasta los apóstoles',
      text: 'Bailey sigue el tema del buen pastor a lo largo de nueve pasajes —Salmo 23, Jeremías 23, Ezequiel 34, Zacarías 10, Marcos 6, Lucas 15, Mateo 18, Juan 10 y 1 Pedro 5— y trata el Salmo 23 como el punto de partida de una larga tradición bíblica en la que profetas, Jesús y los apóstoles vuelven a la imagen de David y la adaptan a nuevas circunstancias. Analiza cómo está compuesto cada pasaje y los lee a la luz de las costumbres pastoriles de Oriente Medio y de los primeros comentaristas de la región.',
    },
    'psalm-23:cm:ferguson': {
      lead: '«Nada me faltará» como la confianza de una larga experiencia',
      text: 'Ferguson sostiene que el Salmo 23 no lo escribió el pastorcillo idealizado de los libros infantiles, sino un creyente probado por una larga experiencia —alguien que había conocido el valle oscuro, el mal y los enemigos—, y que David aprendió de Jacob a llamar a Dios su pastor (Gn 48:15–16). Remonta el verbo ‘faltar’ a la provisión de Israel en el desierto (Éx 16:18; Dt 2:7; 8:9) y concluye que Jesús, el buen pastor que da su vida por las ovejas (Jn 10:11; Zac 13:7), garantiza que a su pueblo no le faltará lo que de verdad necesita (Ro 8:32).',
    },
  },

  sermons: {
    'psalm-23:sm:spurgeon-1595': {
      summary:
        'Spurgeon confiesa que había querido reservar este versículo para su lecho de muerte, pero que necesitó su consuelo en una prueba presente, e insiste en que es para los vivos tanto como para los moribundos. Bajo tres encabezados —el paso y sus terrores, el peregrino y su avance, y el alma y su Pastor— presenta el valle como un estrecho desfiladero de montaña y sostiene que pasar por el dolor no es en sí mismo señal de pecado, puesto que Cristo mismo estuvo triste hasta la muerte.',
    },
    'psalm-23:sm:spurgeon-3006': {
      summary:
        'Spurgeon desarrolla lo que la metáfora garantiza, lo que exige y lo que pregunta. Sus privilegios son la guía (el pastor oriental va delante de su rebaño), la provisión para las necesidades del cuerpo y del espíritu, y la protección; su primer deber es la confianza de la oveja en su pastor; y suscita preguntas penetrantes sobre si el oyente lleva las marcas de las ovejas de Cristo. Sugiere que el salmo se escribió probablemente cuando David era rey y aún no se avergonzaba de sus años de pastor.',
    },
    'psalm-23:sm:spurgeon-3060': {
      summary:
        'Sobre «JEHOVÁ es mi pastor; nada me faltará», Spurgeon avanza en tres pasos: la confesión necesaria antes de que alguien pueda decirlo (somos ovejas necias y dependientes), la seguridad que nace del trato pasado de Dios (que nos ha hecho volver de nuestros extravíos y ha suplido nuestras necesidades), y la santa confianza de «nada me faltará», que aplica a necesidades reales y no a deseos imaginarios.',
    },
    'psalm-23:sm:maclaren-shepherd-king': {
      summary:
        'Maclaren oye el salmo como el anciano rey que recuerda sus años de pastor. Lo divide en dos mitades —Dios como Pastor (vv. 1–4), que guía a su rebaño a través del descanso, el trabajo y el dolor, y Dios como Anfitrión (vv. 5–6), cuya hospitalidad culmina en la casa del Padre— y subraya que el descanso de los verdes pastos se da para fortalecernos para las sendas de justicia, y que la mano que conduce al valle oscuro conduce a través de él y fuera de él.',
    },
  },

  verseNotes: {
    'PSA.23.1': [
      'El salmo empieza con el nombre del pacto de Dios, YHWH (la RVR1909 dice «JEHOVÁ»; la BLM, «Yahvé»; la VBL, «El Señor»), y con un participio hebreo, rōʿî: ‘el que me pastorea’. En el antiguo Cercano Oriente «pastor» era un título de los reyes, así que David, un pastor que llegó a ser rey, confiesa que el SEÑOR es su verdadero rey y quien cuida de él. Jacob usó la misma palabra para Dios al final de su vida: el Dios que lo había pastoreado toda su vida (Gn 48:15).',
      '«Nada me faltará» usa el verbo ḥāsēr, ‘carecer’. Es la palabra que Moisés usó para los años del desierto —«ninguna cosa te ha faltado» (Dt 2:7)—, de modo que la línea puede oírse como la aplicación de la experiencia de Israel en el desierto a la vida de una sola persona, un vínculo que establecen tanto las notas de Tyndale como Sinclair Ferguson. Comentaristas desde Calvino hasta Spurgeon señalan que promete lo que el Pastor sabe que necesitamos, no todo lo que podríamos desear.',
    ],
    'PSA.23.2': [
      'Los «delicados pastos» son literalmente ‘pastos de hierba tierna’ (margen de la KJV: «pastures of tender grass»), y las «aguas de reposo» son eso mismo, ‘aguas de descanso’: menûḥôt, la palabra para un lugar de reposo (margen de la KJV: «waters of quietness»). El verbo que la RVR1909 traduce «me pastoreará» (nāhal) es poco frecuente (10 apariciones) y significa conducir con cuidado hacia el agua, el descanso o el refrigerio; se usa de un rebaño (Gn 33:14; Is 40:11, donde Dios pastorea suavemente a las ovejas que crían) y de personas (Éx 15:13; Is 49:10). Franz Delitzsch, en el comentario de Keil y Delitzsch, lo llama una palabra pastoril para la conducción suave, lo cual encaja con este versículo. El pastor hace descansar al rebaño y lo conduce al agua: descanso y refrigerio a la vez.',
    ],
    'PSA.23.3': [
      '«Confortará mi alma» podría traducirse ‘hace volver mi vida’: el verbo es šûb, ‘volverse’, y néfesh es todo el ser viviente. Las «sendas de justicia» son literalmente ‘huellas de rectitud’: caminos rectos y derechos que llevan adonde deben. El Pastor guía por ellas «por amor de su nombre», para honrar su propio carácter y no por mérito de las ovejas.',
    ],
    'PSA.23.4': [
      'El «valle» (gêʾ) es un barranco escarpado o un desfiladero estrecho, y ṣalmāwet significa ‘sombra de muerte’ u ‘oscuridad profunda’ (nota al pie de la BSB inglesa): un lugar donde el peligro está cerca. El salmo no promete que la oveja evitará esos valles, sino que los atravesará acompañada: «no temeré mal alguno; porque tú estarás conmigo». Aquí, en el centro del salmo (según un recuento de sus palabras hebreas), David deja de hablar acerca de Dios y empieza a hablarle a él.',
      'La vara del pastor (šēbeṭ) era un garrote para defender el rebaño y un instrumento para guiarlo y contarlo; el cayado (mišʿenet) era algo en que apoyarse. Las notas de Tyndale observan que los pastores usaban ambos para alejar el peligro. «Me infundirán aliento» porque muestran que el Pastor está presente y armado; y šēbeṭ puede significar también el cetro de un rey.',
    ],
    'PSA.23.5': [
      'La imagen pasa del pastor al anfitrión. La mesa se prepara a la vista de enemigos que pueden mirar pero no intervenir; se unge con aceite la cabeza del invitado, señal de honor (compárese Lc 7:46), con un verbo que significa literalmente ‘engordas’: aceite en abundancia (margen de la KJV). La copa «está rebosando»: rəwāyâ significa saturación, y solo aparece además en el Salmo 66:12, donde Dios saca a su pueblo «á hartura».',
    ],
    'PSA.23.6': [
      '«Ciertamente» puede leerse también ‘solo’: Spurgeon menciona la lectura ‘solo el bien y la misericordia’. El verbo traducido «me seguirán» es rādap̄, ‘perseguir’, que normalmente se usa de enemigos que acosan a alguien. Franz Delitzsch, en el comentario de Keil y Delitzsch, destaca el contraste: los enemigos del salmista lo persiguen, pero ahora solo la bondad de Dios y su ḥesed —su amor leal, el amor del pacto— lo perseguirán, todos los días de su vida.',
      'La última línea plantea dos cuestiones textuales. El hebreo, tal como está vocalizado, dice ‘y volveré’ (šûb), mientras que la Septuaginta griega y la mayoría de las traducciones leen ‘moraré’ (así la RVR1909, «moraré»); compárese el Salmo 27:4. Y la expresión final es literalmente ‘por largura de días’ (notas al pie de la BSB y de la KJV inglesas; la RVR1909 traduce «por largos días»): un modismo que puede significar una vida larga o, dicho de la casa de Dios en el Salmo 93:5, todos los días venideros; los lectores cristianos han oído también en ella la esperanza de morar con Dios más allá de la muerte.',
    ],
  },

  concepts: {
    'psalm-23:c:shepherd': {
      label: 'El SEÑOR como pastor',
      aliases: [
        'pastor',
        'pastores',
        'mi pastor',
        'qué significa pastor',
        'pastorear',
        'pastoreo',
        'pastor y rey',
        'reyes como pastores',
        'rebaño',
        'ovejas',
        'oveja',
        'apacentar',
        'jehová es mi pastor',
        'el señor es mi pastor',
      ],
      answer:
        'Rōʿî, ‘mi pastor’, es un participio del verbo rāʿâ, ‘apacentar, cuidar’: el SEÑOR es el que pastorea activamente a David. En todo el antiguo Cercano Oriente los reyes se llamaban a sí mismos pastores (Hammurabi se presenta como el pastor portador de salvación), así que el título une la autoridad regia y el cuidado. La Escritura lo aplica a Dios desde Jacob (Gn 48:15) hasta los profetas (Ez 34:15), y Jesús lo reclama para sí en Juan 10:11.',
    },
    'psalm-23:c:divine-name': {
      label: 'El SEÑOR (YHWH)',
      aliases: [
        'el señor',
        'señor en versalitas',
        'versalitas',
        'mayúsculas',
        'jehová',
        'por qué jehová',
        'yahvé',
        'yahveh',
        'nombre divino',
        'nombre de dios',
        'tetragrámaton',
      ],
      answer:
        'Donde muchas Biblias imprimen SEÑOR en versalitas, y la RVR1909 dice «Jehová», el hebreo tiene el nombre personal de Dios, YHWH, revelado a Moisés (Éx 3:14–15). Por reverencia, los lectores judíos dicen en su lugar ’Adonai (‘Señor’), y el nombre se escribía con las vocales de esa palabra: de ahí la forma antigua «Jehová»; «Yahvé» es la reconstrucción académica habitual. En el Salmo 23 el nombre aparece solo dos veces, como primera palabra tras el encabezado y en la última línea, y enmarca todo el salmo.',
    },
    'psalm-23:c:want': {
      label: 'Nada me faltará',
      aliases: [
        'nada me faltará',
        'qué significa nada me faltará',
        'faltar',
        'faltará',
        'no me faltará nada',
        'carecer',
        'carencia',
        'ninguna cosa te ha faltado',
        'provisión',
        'proveer',
        'necesidades',
        'contentamiento',
      ],
      answer:
        'El verbo es ḥāsēr, ‘carecer’. Es la palabra que Moisés usó para los cuarenta años de Israel en el desierto —«ninguna cosa te ha faltado» (Dt 2:7; compárese Neh 9:21)—, de modo que la línea puede oírse como la aplicación de la experiencia de Israel en el desierto a la vida de una sola persona, un vínculo que establecen tanto las notas de Tyndale como Sinclair Ferguson. La promesa es suficiencia, no lujo: Spurgeon la aplica a necesidades reales y no a deseos imaginarios, y el Salmo 34:10 habla de no tener «falta de ningún bien».',
    },
    'psalm-23:c:rest': {
      label: 'Delicados pastos y aguas de reposo',
      aliases: [
        'delicados pastos',
        'verdes pastos',
        'pastos',
        'pasto',
        'aguas de reposo',
        'aguas tranquilas',
        'aguas',
        'agua',
        'me hará yacer',
        'me hace descansar',
        'descanso',
        'reposo',
        'me pastoreará',
        'me conduce',
        'hierba',
      ],
      answer:
        'Los «delicados pastos» son literalmente ‘pastos de hierba tierna’, y las «aguas de reposo» son ‘aguas de descanso’: menûḥâ significa lugar de reposo. El verbo que la RVR1909 traduce «me pastoreará» (nāhal) es una palabra poco frecuente para conducir con cuidado hacia el agua, el descanso o el refrigerio; Isaías la usa de Dios que pastorea suavemente a las ovejas que crían (Is 40:11), y aparece de nuevo en la promesa de que Dios conducirá a su pueblo a manaderos de aguas (Is 49:10), promesa de la que el Apocalipsis se hace eco al hablar del Cordero (Ap 7:17). Como señala Maclaren, este descanso se da para fortalecer al rebaño para el camino que tiene por delante.',
    },
    'psalm-23:c:restore': {
      label: 'Confortará mi alma; sendas de justicia',
      aliases: [
        'confortará',
        'confortará mi alma',
        'restaura',
        'restaurar',
        'restaura mi alma',
        'alma',
        'néfesh',
        'hacer volver',
        'volver',
        'arrepentimiento',
        'arrepentirse',
        'sendas de justicia',
        'sendas rectas',
        'justicia',
        'por amor de su nombre',
        'por amor a su nombre',
        'guiaráme',
        'me guía',
      ],
      answer:
        '«Confortará mi alma» es literalmente ‘hace volver mi néfesh’: mi vida, todo mi ser. El verbo šûb, ‘volverse’, puede describir la reanimación de una vida desfallecida o la vuelta de una oveja extraviada, y en otros lugares significa arrepentimiento. Las «sendas de justicia» son caminos rectos y derechos, y el Pastor guía por ellas «por amor de su nombre»: por lo que él es, no por mérito de las ovejas.',
    },
    'psalm-23:c:valley': {
      label: 'El valle de sombra de muerte — «tú estarás conmigo»',
      aliases: [
        'valle',
        'valle de sombra de muerte',
        'valle de la sombra de muerte',
        'sombra de muerte',
        'sombra de la muerte',
        'sombra',
        'valle oscuro',
        'oscuridad profunda',
        'oscuridad',
        'muerte',
        'morir',
        'no temeré mal alguno',
        'temor',
        'miedo',
        'tú estarás conmigo',
        'tú estás conmigo',
        'conmigo',
        'presencia de dios',
        'centro del salmo',
      ],
      answer:
        'El hebreo es gêʾ ṣalmāwet: un barranco escarpado de ‘sombra de muerte’ o de ‘oscuridad profunda’ (nota al pie de la BSB inglesa). La traducción tradicional sigue las vocales masoréticas y la Septuaginta griega (skia thanatou); muchos estudiosos modernos derivan la palabra de una raíz que significa ‘estar oscuro’. En cualquier caso es la oscuridad más amenazante, y lo que el salmo quiere decir es que la oveja la atraviesa con el Pastor: «no temeré mal alguno; porque tú estarás conmigo», palabras que, según un recuento habitual de las palabras hebreas, están en el centro del salmo.',
    },
    'psalm-23:c:rod-staff': {
      label: 'Tu vara y tu cayado',
      aliases: ['vara', 'cayado', 'bastón', 'vara y cayado', 'tu vara y tu cayado', 'consuelo', 'me infundirán aliento', 'consolar', 'cetro'],
      answer:
        'La vara del pastor (šēbeṭ) era un garrote para ahuyentar a los depredadores y un instrumento para guiar y contar el rebaño; el cayado (mišʿenet) era un apoyo en que apoyarse. Las notas de Tyndale observan que los pastores usaban ambos para alejar el peligro. Como šēbeṭ puede significar también el cetro de un gobernante, la imagen une la autoridad regia y el cuidado, y a la oveja la consuela ver a su Pastor armado y cerca.',
    },
    'psalm-23:c:table': {
      label: 'Una mesa, aceite y una copa rebosante',
      aliases: [
        'mesa',
        'aderezarás mesa',
        'preparas una mesa',
        'enemigos',
        'angustiadores',
        'en presencia de mis angustiadores',
        'ungir',
        'ungiste',
        'unges',
        'ungiste mi cabeza',
        'unción',
        'aceite',
        'copa',
        'mi copa',
        'rebosando',
        'rebosa',
        'anfitrión',
        'banquete',
        'hospitalidad',
        'cena del señor',
        'santa cena',
        'eucaristía',
      ],
      answer:
        'En el versículo 5 el Pastor se convierte en anfitrión. Prepara una mesa a la vista de enemigos que pueden mirar pero no intervenir, honra a su invitado ungiendo su cabeza con aceite —el verbo significa literalmente ‘engordas’, es decir, aceite en abundancia (compárese Lc 7:46)— y llena la copa hasta saturarla. En la iglesia antigua, las catequesis mistagógicas atribuidas a Cirilo de Jerusalén oyeron en ello la Mesa del Señor y la unción de los recién bautizados.',
    },
    'psalm-23:c:goodness-mercy': {
      label: 'El bien y el ḥesed me perseguirán',
      aliases: [
        'bien',
        'bondad',
        'misericordia',
        'el bien y la misericordia',
        'la bondad y el amor',
        'jésed',
        'amor leal',
        'amor inagotable',
        'amor del pacto',
        'benignidad',
        'seguirán',
        'me seguirán',
        'perseguir',
        'me perseguirán',
        'ciertamente',
      ],
      answer:
        'Ḥesed es el amor leal del SEÑOR a su pacto: el interlineal de STEPBible lo glosa ‘lealtad al pacto’, y se traduce «misericordia» (RVR1909; en inglés, «mercy» en la BSB y la KJV), «amor» (BLM) o «amor inagotable» (VBL; en inglés, «loving kindness» en la WEB). El verbo «seguirán» es rādap̄, ‘perseguir’, que normalmente se usa de enemigos que dan caza a alguien; aquí los perseguidores son la bondad y el ḥesed de Dios, todos los días de la vida del salmista.',
    },
    'psalm-23:c:house-forever': {
      label: 'Morar en la casa de Jehová por largos días',
      aliases: [
        'casa de jehová',
        'casa del señor',
        'la casa',
        'morar',
        'moraré',
        'habitaré',
        'morada',
        'para siempre',
        'por largos días',
        'largura de días',
        'cielo',
        'templo',
        'santuario',
        'volveré',
        'volver a casa',
        'eterno',
        'vida eterna',
        'más allá de la muerte',
        'hogar',
      ],
      answer:
        'La última línea plantea dos cuestiones. El hebreo, tal como está vocalizado, dice ‘y volveré’ (de šûb), mientras que la Septuaginta y la mayoría de las traducciones leen ‘moraré’ (la RVR1909, «moraré»); compárese el Salmo 27:4: «que esté yo en la casa de Jehová todos los días de mi vida». Y la expresión final es literalmente ‘por largura de días’ —la RVR1909 traduce «por largos días»—, un modismo que puede significar una vida larga o, dicho de la casa de Dios en el Salmo 93:5, ‘por todos los días venideros’; lectores cristianos como Matthew Henry y Spurgeon han oído también en ella la esperanza del cielo.',
    },
    'psalm-23:c:good-shepherd': {
      label: 'Jesús, el buen pastor',
      aliases: [
        'buen pastor',
        'el buen pastor',
        'jesús',
        'cristo',
        'juan 10',
        'gran pastor',
        'príncipe de los pastores',
        'cordero',
        'mesías',
        'cumplimiento',
        'tipología',
        'nuevo testamento',
      ],
      answer:
        'En el Salmo 23 el pastor es el SEÑOR mismo, y Ezequiel prometió que Dios pastorearía en persona a su rebaño y que pondría sobre él «un pastor… á mi siervo David» (Ez 34:15, 23). El Nuevo Testamento presenta a Jesús como el cumplimiento de ambas promesas: el buen pastor que da su vida (Jn 10:11), el gran pastor sacado de entre los muertos (Heb 13:20), el Príncipe de los pastores que ha de aparecer (1 P 5:4) y el Cordero que pastoreará a su pueblo hacia fuentes de aguas de vida (Ap 7:17).',
    },
    'psalm-23:c:david': {
      label: 'David y el encabezado «Salmo de David»',
      aliases: [
        'david',
        'salmo de david',
        'autor',
        'autoría',
        'quién lo escribió',
        'quién escribió el salmo 23',
        'encabezado',
        'título',
        'inscripción',
        'absalón',
        'cuándo se escribió',
      ],
      answer:
        'El encabezado mizmôr lədāwid suele leerse «Salmo de David», aunque la preposición hebrea puede significar también ‘para’ o ‘acerca de’ David, por lo que la introducción de Tyndale aconseja cautela antes de tratar cada uno de estos encabezados como indicación de autoría. Quienes lo leen como obra del propio David lo sitúan de maneras distintas: Calvino lo lee como palabras de David en la cumbre de su prosperidad como rey, Spurgeon y Maclaren imaginan al rey recordando sus años de pastor, y Franz Delitzsch (en el comentario de Keil y Delitzsch) lo relaciona con su huida ante Absalón (2 S 17:27–29). El salmo mismo no nombra ninguna ocasión.',
    },
  },
};

export default overlay;
