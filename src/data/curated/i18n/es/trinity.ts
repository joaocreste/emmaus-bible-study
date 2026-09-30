/** Spanish overlay for the topic “The Trinity”. References, citations and confessional sources are unchanged. */
import type { TopicOverlay } from '../types';

const overlay: TopicOverlay = {
  topicId: 'trinity',
  locale: 'es',
  name: 'La Trinidad',
  aliases: [
    'trinidad',
    'la trinidad',
    'santísima trinidad',
    'la santísima trinidad',
    'dios trino',
    'trino',
    'trino y uno',
    'tres en uno',
    'dios en tres personas',
    'padre hijo y espíritu santo',
    'padre, hijo y espíritu santo',
    'qué es la trinidad',
    'doctrina de la trinidad',
    'está la trinidad en la biblia',
    'procesión del espíritu santo',
  ],
  question: '¿Qué enseña la Biblia sobre la Trinidad?',
  definition:
    'La doctrina de la Trinidad confiesa a un solo Dios que existe eternamente como Padre, Hijo y Espíritu Santo. La palabra misma no está en la Biblia —el griego trias aparece por primera vez en los escritos conservados hacia el año 180 d. C., en Teófilo de Antioquía—, pero da nombre a un patrón que la Escritura presenta. Israel confesaba que el SEÑOR es uno (Dt 6:4), y el Nuevo Testamento mantiene esa confesión (1 Co 8:4–6). Sin embargo, habla del Verbo que estaba con Dios y era Dios (Jn 1:1), del Espíritu como otro Consolador enviado por el Padre (Jn 14:16–17, 26) y del bautismo en el único nombre del Padre, del Hijo y del Espíritu Santo (Mt 28:19). En el bautismo de Jesús, el Padre habla y el Espíritu desciende (Mt 3:16–17). El credo del año 381 dio a esta fe su confesión clásica.',
  keyPassages: {
    'trinity:kp:1': {
      title: 'El SEÑOR es uno',
      group: 'Un solo Dios',
      note: 'La confesión diaria de Israel del único SEÑOR sigue siendo el punto de partida de la enseñanza cristiana sobre Dios; Jesús mismo la llama el mandamiento más importante (Mc 12:29–30).',
    },
    'trinity:kp:2': {
      title: 'Yo soy el primero y el último',
      group: 'Un solo Dios',
      note: 'El SEÑOR declara que no hay Dios fuera de él. Más tarde, el Apocalipsis pone el título “el primero y el último” en labios de Cristo resucitado (Ap 1:17; 22:13).',
    },
    'trinity:kp:3': {
      title: 'Un solo Dios, el Padre, y un solo Señor, Jesucristo',
      group: 'Un solo Dios',
      note: 'Pablo reformula la confesión israelita del Dios único en torno al Padre y al Hijo: un solo Dios, el Padre, de quien proceden todas las cosas, y un solo Señor, Jesucristo, por medio de quien son todas las cosas.',
    },
    'trinity:kp:4': {
      title: 'El bautismo de Jesús',
      group: 'Padre, Hijo y Espíritu revelados',
      note: 'En el Jordán, el Hijo es bautizado, el Espíritu desciende sobre él como paloma y la voz del Padre declara su amor: una escena que la iglesia ha leído desde antiguo como revelación de las tres personas.',
    },
    'trinity:kp:5': {
      title: 'El Verbo era Dios',
      group: 'Padre, Hijo y Espíritu revelados',
      note: 'El Verbo está con Dios y a la vez es Dios, aquel por medio de quien todas las cosas fueron hechas; este Verbo se hizo carne (1:14).',
    },
    'trinity:kp:6': {
      title: 'Otro Consolador',
      group: 'Padre, Hijo y Espíritu revelados',
      note: 'Jesús promete otro Consolador, el Espíritu de verdad, a quien el Padre enviará en su nombre; el Padre y el Hijo harán morada con los que lo aman (14:23).',
    },
    'trinity:kp:7': {
      title: 'El cual procede del Padre',
      group: 'Padre, Hijo y Espíritu revelados',
      note: 'Jesús enviará de parte del Padre el Espíritu de verdad, y el Espíritu procede del Padre. El versículo está en el centro del posterior debate entre Oriente y Occidente sobre el Filioque.',
    },
    'trinity:kp:8': {
      title: 'En forma de Dios',
      group: 'Padre, Hijo y Espíritu revelados',
      note: 'Cristo, siendo en forma de Dios, se humilló hasta la cruz. Dios le da después el nombre que es sobre todo nombre, y la escena de toda rodilla que se dobla hace eco de las propias palabras del SEÑOR en Isaías 45:23.',
    },
    'trinity:kp:9': {
      title: 'Bautizados en un solo nombre',
      group: 'Vida y adoración trinitarias',
      note: 'Jesús resucitado envía a sus discípulos a hacer discípulos de todas las naciones, bautizándolos en el nombre —en singular— del Padre, y del Hijo, y del Espíritu Santo.',
    },
    'trinity:kp:10': {
      title: 'Gracia, amor y comunión',
      group: 'Vida y adoración trinitarias',
      note: 'La bendición final de Pablo une la gracia del Señor Jesucristo, el amor de Dios y la comunión del Espíritu Santo.',
    },
    'trinity:kp:11': {
      title: 'Dios envió a su Hijo… y el Espíritu de su Hijo',
      group: 'Vida y adoración trinitarias',
      note: 'El Padre envía al Hijo para redimir y después envía el Espíritu de su Hijo a los corazones de los creyentes, de modo que llaman a Dios “Abba, Padre”.',
    },
    'trinity:kp:12': {
      title: 'Elegidos, santificados, rociados',
      group: 'Vida y adoración trinitarias',
      note: 'Pedro describe la salvación como obra de la presciencia del Padre, de la santificación del Espíritu y de la obediencia a Jesucristo y la aspersión de su sangre.',
    },
  },
  perspectives: {
    'trinity:ps:filioque': {
      question: '¿Procede el Espíritu Santo solo del Padre, o del Padre y del Hijo (el Filioque)?',
      intro:
        'La fe en un solo Dios en tres personas la comparten las iglesias ortodoxas, la católica y las protestantes históricas, y todas confiesan el credo del año 381, que en su forma original dice que el Espíritu procede del Padre. Las iglesias occidentales añadieron más tarde “y del Hijo” (en latín, filioque): parece haberse cantado por primera vez en Hispania después del III Concilio de Toledo (589); tras el Concilio de Aquisgrán (809), el papa León III aprobó la doctrina, pero aconsejó dejar la palabra fuera del credo; y la mayoría de los estudiosos fechan su adopción en Roma a comienzos del siglo XI. Se convirtió en un punto de división duradero entre Oriente y Occidente, y la reunión intentada en Florencia (1439) no se mantuvo.',
      commonGround:
        'Ambas partes confiesan a un solo Dios en tres personas coiguales y coeternas, ambas reconocen al Padre como fuente del Hijo y del Espíritu, y ambas confiesan el credo del año 381 (Occidente, con la cláusula añadida). La disputa se refiere a cómo se relaciona con el Hijo el origen eterno del Espíritu, y a quién puede modificar un credo que comparte toda la iglesia.',
      perspectives: {
        'trinity:ps:filioque:western': {
          tradition: 'Católica y protestante occidental',
          label: 'Del Padre y del Hijo',
          summary:
            'Agustín enseñó que el Espíritu procede principalmente del Padre, quien al engendrar al Hijo le dio que también de él procediera el Espíritu; así, el Espíritu es el Espíritu de ambos (De Trinitate XV.17.29; XV.26.47). Tomás de Aquino sostuvo que, si el Espíritu no procediera del Hijo, no podrían distinguirse personalmente el uno del otro (Suma teológica I, q. 36, a. 2). La teología occidental señala textos en los que el Espíritu es llamado el Espíritu del Hijo y es enviado por el Hijo (Gá 4:6; Jn 15:26; 16:14–15). La Iglesia católica definió la doctrina en Lyon (1274) y Florencia (1439), y confesiones protestantes como la Confesión de Westminster (2.3) y los Artículos metodistas (art. IV) la conservaron.',
        },
        'trinity:ps:filioque:orthodox': {
          tradition: 'Ortodoxa oriental',
          label: 'Solo del Padre, dado por medio del Hijo',
          summary:
            'Solo el Padre es causa y fuente dentro de la Deidad: el Hijo es engendrado de él y el Espíritu procede de él, como dicen Juan 15:26 y el credo del año 381. Juan Damasceno no quiere decir que el Espíritu proceda del Hijo, pero lo llama Espíritu del Hijo, revelado y comunicado a nosotros por medio del Hijo, y habla del Espíritu como procedente del Padre por medio del Hijo (Exposición de la fe ortodoxa I.8, I.12). En el siglo IX, el patriarca Focio rechazó la procesión desde el Hijo y se opuso a insertar la palabra en el credo, y los críticos orientales objetaron que añadir algo al credo común desatendía la prohibición conciliar de componer otro credo (Éfeso, 431). La Confesión de Dositeo (1672) confiesa que el Espíritu procede del Padre.',
        },
      },
    },
  },
  suggestedQuestions: [
    '¿Enseña la Biblia la Trinidad?',
    '¿Dónde aparecen juntos en la Escritura el Padre, el Hijo y el Espíritu?',
    '¿En qué consiste la controversia del Filioque?',
    '¿Cómo puede Dios ser uno y tres?',
    '¿Cómo habla el Nuevo Testamento del Hijo como Dios?',
  ],
};

export default overlay;
