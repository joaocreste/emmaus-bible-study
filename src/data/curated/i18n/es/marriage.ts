/** Spanish overlay for the topic “Marriage”. References, citations and confessional sources are unchanged. */
import type { TopicOverlay } from '../types';

const overlay: TopicOverlay = {
  topicId: 'marriage',
  locale: 'es',
  name: 'El matrimonio',
  aliases: [
    'matrimonio',
    'el matrimonio',
    'casado',
    'casada',
    'casados',
    'casarse',
    'casamiento',
    'esposo',
    'esposa',
    'marido',
    'esposos',
    'maridos y esposas',
    'cónyuge',
    'boda',
    'una sola carne',
    'una carne',
    'divorcio',
    'santo matrimonio',
    'matrimonio cristiano',
    'es el matrimonio un sacramento',
    'sacramento del matrimonio',
    'soltería',
    'qué dice la biblia sobre el matrimonio',
  ],
  question: '¿Qué dice la Biblia sobre el matrimonio?',
  definition:
    'La Escritura presenta el matrimonio como un don de la creación: una unión de pacto entre un hombre y una mujer en la que los dos llegan a ser una sola carne (Gn 2:18–25). No es bueno que el hombre esté solo, y la mujer es formada como compañera idónea. Cuando le preguntan por el divorcio, Jesús vuelve a ese “principio”: lo que Dios juntó, que nadie lo separe (Mt 19:3–9). Malaquías llama a la esposa compañera por pacto, con el SEÑOR como testigo (Mal 2:14), y Oseas usa el matrimonio para ilustrar el amor fiel de Dios hacia un Israel infiel (Os 2:14–20). Pablo llama a los maridos a amar como Cristo amó a la iglesia y dice que la unión en una sola carne es un gran misterio referido a Cristo y a su iglesia (Ef 5:21–33). El matrimonio debe ser honrado por todos (Heb 13:4), pero la soltería es también un don, que deja libre para una entrega sin divisiones al Señor (1 Co 7:7, 32–35).',
  keyPassages: {
    'marriage:kp:1': {
      title: 'Varón y mujer, a imagen de Dios',
      group: 'El matrimonio en la creación',
      note: 'La humanidad, varón y mujer juntos, lleva la imagen de Dios y recibe la bendición de fructificar y gobernar la tierra.',
    },
    'marriage:kp:2': {
      title: 'No es bueno que el hombre esté solo',
      group: 'El matrimonio en la creación',
      note: 'Dios forma a la mujer como ayuda idónea para el hombre; el hombre deja a sus padres y se une a su mujer, y los dos llegan a ser una sola carne, sin vergüenza.',
    },
    'marriage:kp:3': {
      title: 'Lo que Dios juntó',
      group: 'El matrimonio en la creación',
      note: 'Cuando le preguntan por el divorcio, Jesús se remonta a la creación: el matrimonio es la obra de Dios que une a dos en uno, y el permiso de Moisés para divorciarse respondía a la dureza del corazón, no al designio de Dios.',
    },
    'marriage:kp:4': {
      title: 'La mujer de tu pacto',
      group: 'El matrimonio en la creación',
      note: 'Malaquías reprende a los hombres que traicionan a la esposa de su juventud: el SEÑOR fue testigo de su pacto matrimonial. El hebreo de 2:16 es difícil, y la BSB indica una traducción alternativa.',
    },
    'marriage:kp:5': {
      title: 'Fuerte como la muerte es el amor',
      group: 'Amor y fidelidad',
      note: 'El Cantar de los Cantares celebra el amor comprometido como intenso, exclusivo y de valor incalculable: las muchas aguas no pueden apagarlo ni la riqueza comprarlo.',
    },
    'marriage:kp:6': {
      title: 'Alégrate con la mujer de tu juventud',
      group: 'Amor y fidelidad',
      note: 'Después de advertir contra la mujer ajena (5:1–14), el padre recomienda el deleite y la fidelidad dentro del matrimonio.',
    },
    'marriage:kp:7': {
      title: 'Pertenencia mutua',
      group: 'Amor y fidelidad',
      note: 'Pablo da al marido y a la mujer los mismos derechos sobre el cuerpo del otro y desaconseja negarse el uno al otro, a la vez que llama a la soltería un don de Dios.',
    },
    'marriage:kp:8': {
      title: 'Honroso es el matrimonio',
      group: 'Amor y fidelidad',
      note: 'Todos deben honrar el matrimonio y mantener sin mancilla el lecho conyugal, porque Dios juzgará la inmoralidad sexual y el adulterio.',
    },
    'marriage:kp:9': {
      title: 'Cristo y la iglesia',
      group: 'El matrimonio y el evangelio',
      note: 'Después del llamado a someterse unos a otros en el temor de Cristo (5:21), Pablo llama a las esposas a someterse y a los maridos a amar con sacrificio como Cristo amó a la iglesia, y dice que la unión en una sola carne es un gran misterio referido a Cristo y a la iglesia. Los cristianos interpretan de maneras distintas su lenguaje de autoridad y sumisión.',
    },
    'marriage:kp:10': {
      title: 'Te desposaré conmigo para siempre',
      group: 'El matrimonio y el evangelio',
      note: 'Dios se compromete a reconquistar al Israel infiel y a desposarlo consigo en justicia, amor y fidelidad: el matrimonio como imagen del pacto de Dios.',
    },
    'marriage:kp:11': {
      title: 'Las bodas del Cordero',
      group: 'El matrimonio y el evangelio',
      note: 'La historia termina con una boda: la iglesia, vestida de lino fino, que son las acciones justas de los santos, es la esposa del Cordero.',
    },
  },
  perspectives: {
    'marriage:ps:sacrament': {
      question: '¿Es el matrimonio un sacramento?',
      intro:
        'Todos los cristianos honran el matrimonio como instituido por Dios y bendecido por Cristo. Difieren sobre si es un sacramento en el mismo sentido que el bautismo y la Cena del Señor, es decir, un rito por medio del cual Dios da la gracia. Mucho depende de Efesios 5:32, donde Pablo llama a la unión en una sola carne un gran misterio (en griego, mystērion), que la Vulgata latina traduce sacramentum.',
      commonGround:
        'Las tres tradiciones fundamentan el matrimonio en la institución de Dios en la creación y en la enseñanza de Cristo (Gn 2:24; Mt 19:4–6), lo llaman santo y ven en él una imagen del amor de Cristo por la iglesia (Ef 5:25–32).',
      perspectives: {
        'marriage:ps:sacrament:catholic': {
          tradition: 'Católica',
          label: 'Uno de los siete sacramentos',
          summary:
            'El Concilio de Trento enseñó que Cristo mereció con su pasión la gracia que perfecciona el amor natural, confirma la unión indisoluble y santifica a los esposos, y remitió a las palabras de Pablo sobre Cristo y la iglesia (Ef 5:25, 32). Puesto que el matrimonio en la ley evangélica supera en gracia a los matrimonios antiguos, los Padres, los concilios y la tradición siempre lo han contado entre los sacramentos; Trento condenó la opinión de que el matrimonio no es verdaderamente uno de los siete sacramentos instituidos por Cristo y no confiere la gracia (sesión XXIV, doctrina y canon 1).',
        },
        'marriage:ps:sacrament:orthodox': {
          tradition: 'Ortodoxa oriental',
          label: 'Un santo misterio de la Iglesia',
          summary:
            'La Confesión de Dositeo cuenta el matrimonio entre los siete misterios de la Iglesia: Cristo lo selló cuando prohibió separar a los que Dios ha unido, y el Apóstol lo llama un gran misterio (decreto XV; Mt 19:6; Ef 5:32). La catequesis ortodoxa describe el sacramento como el don del Espíritu Santo para que el amor de la pareja se cumpla en el Reino de Dios; los esposos son coronados, y el rito no es un contrato legal ni contiene votos (Orthodox Church in America).',
        },
        'marriage:ps:sacrament:protestant': {
          tradition: 'Protestante (reformada, metodista, luterana)',
          label: 'Una ordenanza santa, no un sacramento del evangelio',
          summary:
            'La Confesión de Westminster reconoce solo dos sacramentos instituidos por Cristo, el bautismo y la Cena del Señor (27.4), y trata el matrimonio como una ordenanza de Dios para la ayuda mutua, la propagación del género humano y la prevención de la impureza (24.2). Los Artículos metodistas (tomados de los Artículos anglicanos) no cuentan el matrimonio entre los sacramentos del evangelio, sino que lo agrupan con ritos que en parte han surgido de una imitación corrupta de los apóstoles y en parte son “states of life allowed in the Scriptures” (estados de vida permitidos en las Escrituras) (art. XVI). La Apología de Melanchthon señala que el matrimonio fue instituido en la creación y tiene el mandato y las promesas de Dios para esta vida corporal; si alguien quiere llamarlo sacramento, aun así debe distinguirse de los signos del Nuevo Testamento (art. XIII).',
        },
      },
    },
  },
  suggestedQuestions: [
    '¿Qué palabra hebrea hay detrás de “ayuda”?',
    '¿Qué enseñó Jesús sobre el divorcio?',
    '¿Cómo relaciona Pablo el matrimonio con Cristo y la iglesia?',
    '¿Es el matrimonio un sacramento?',
    '¿Qué dice la Biblia sobre la soltería?',
  ],
};

export default overlay;
