/**
 * Português (Brasil) overlay for the curated study "suffering" (2 Coríntios 4:7–18).
 * English module (src/data/curated/studies/suffering.ts) stays the source of truth for ids,
 * references, citations and provenance. Verified quotations keep their English words;
 * only a free translation (quoteTranslation) is added here.
 */
import type { StudyOverlay } from '../types';

const overlay: StudyOverlay = {
  studyId: 'suffering',
  locale: 'pt',
  title: 'Sofrimento',
  subtitle: 'Por que Deus permite o sofrimento?',
  summary:
    'Este estudo enfrenta a pergunta mais antiga e difícil da fé — por que um Deus bom e poderoso permite o sofrimento — e a ancora em 2 Coríntios 4:7–18, onde Paulo, pressionado por todos os lados, fala de um tesouro em vasos de barro e de uma aflição leve e momentânea que produz um peso eterno de glória. Em torno dessa passagem, reúne o testemunho mais amplo da Bíblia: a queda e uma criação que geme, os salmos de lamento e Jó, a recusa em igualar sofrimento a castigo, Deus entrando no sofrimento humano em Cristo e a promessa de um mundo sem lágrimas. Apresenta também como pensadores cristãos — de Irineu e Agostinho às tradições reformada, católica, wesleyana e ortodoxa e aos filósofos modernos — responderam ao problema do mal, onde concordam e onde divergem.',
  opening:
    'Poucas perguntas pesam tanto quanto esta, e a Bíblia não passa por ela às pressas. Vamos ancorar o estudo em 2 Coríntios 4, onde Paulo escreve como alguém sob pressão real, mas não esmagado, e depois seguir a resposta bíblica mais ampla — o lamento honesto, o mistério de Jó, a cruz e a esperança de um mundo sem lágrimas. Pergunte sobre qualquer versículo, qualquer palavra, ou sobre como os cristãos têm lutado com o problema do mal.',
  matchTopics: [
    'sofrimento',
    'sofrimentos',
    'por que deus permite o sofrimento',
    'por que deus permite o mal',
    'por que deus deixa a gente sofrer',
    'por que deus permite coisas ruins',
    'por que sofremos',
    'dor e sofrimento',
    'o problema do mal',
    'problema do mal',
    'problema da dor',
    'teodiceia',
    'dor',
    'mal',
    'provações',
    'aflição',
    'aflições',
    'lamento',
    'luto',
    'tristeza',
    'dificuldades',
    'tribulação',
    '2 coríntios 4',
    '2 corintios 4',
    '2co 4',
    'vasos de barro',
  ],
  suggestedQuestions: [
    'Por que Deus permite o sofrimento?',
    'O que Paulo quer dizer com vasos de barro?',
    'Qual é a palavra grega por trás de “aflição”?',
    'O que Tim Keller disse sobre o sofrimento?',
    'Como os primeiros leitores teriam entendido isto?',
    'Onde mais Paulo fala sobre o sofrimento?',
    'Como isto se relaciona com Romanos?',
    'Explique o versículo 17 com mais detalhes.',
    'Existem diferentes interpretações teológicas do problema do mal?',
  ],
  topic: {
    name: 'Sofrimento',
    question: 'Por que Deus permite o sofrimento?',
    definition:
      'A Escritura não dá uma resposta única e arrumada à pergunta de por que Deus permite o sofrimento. Ela oferece um conjunto de verdades que precisam ser mantidas juntas. Deus é bom e soberano, e no entanto o mal é real e nunca é simplesmente bom: o pecado e a morte entraram no mundo bom de Deus pela rebelião humana, e toda a criação agora geme (Gn 3; Rm 5:12; 8:20–22). O sofrimento nem sempre é castigo por um pecado específico (Jó; Jo 9; Lc 13). Deus acolhe o lamento honesto — o repetido até quando do salmista é, em si, uma oração de fé (Sl 13). Deus não ficou à distância: em Cristo ele entrou na dor humana, foi desamparado na cruz e ressuscitou (Is 53; Mc 15:34). Em suas mãos, a aflição pode refinar a fé e até mesmo operar para a glória (Gn 50:20; Rm 5:3–5; 2Co 4:17). E a história termina com o próprio Deus enxugando toda lágrima (Ap 21:3–5).',
  },
  topicPassages: {
    'suffering:kp:gen-3-16': {
      title: 'Dor, fadiga e pó',
      group: 'O sofrimento e a queda',
      note: 'Depois da primeira rebelião, a dor entra no parto, a terra é amaldiçoada, o trabalho se torna fadiga e o homem ouve que voltará ao pó. A Escritura atribui a esse primeiro afastamento de Deus a ruptura do mundo — inclusive muito sofrimento que ninguém escolheu.',
    },
    'suffering:kp:rom-8-20': {
      title: 'Uma criação que geme na esperança',
      group: 'O sofrimento e a queda',
      note: 'Paulo diz que a criação foi submetida à futilidade e à escravidão da degradação — mas com esperança — e descreve seu gemido como dores de parto. O sofrimento no mundo natural é real, mas é trabalho de parto rumo a um novo nascimento, e não um fim sem sentido.',
    },
    'suffering:kp:psa-13': {
      title: 'Até quando, SENHOR?',
      group: 'Lamento e fé honesta',
      note: 'Quatro vezes em dois versículos Davi pergunta até quando: até quando Deus se esquecerá dele e esconderá o rosto, até quando terá de lutar com a tristeza, até quando seu inimigo triunfará. Ainda assim, o breve salmo termina em confiança e cântico. O lamento não é um lapso da fé; é a fé levando sua queixa ao único que pode responder.',
    },
    'suffering:kp:psa-88': {
      title: 'Um lamento que termina nas trevas',
      group: 'Lamento e fé honesta',
      note: 'O Salmo 88 é incomum: termina sem uma virada para o louvor, e sua última palavra é trevas. Mesmo assim, do começo ao fim ele se dirige ao Deus da minha salvação (88:1). Seu lugar na Escritura dá aos que sofrem permissão para orar mesmo quando nenhum alívio chegou.',
    },
    'suffering:kp:lam-3-19': {
      title: 'Misericórdias novas entre as ruínas',
      group: 'Lamento e fé honesta',
      note: 'Escrevendo entre os escombros de Jerusalém, o poeta se lembra de sua aflição e, em seguida, traz deliberadamente à memória o amor leal de Deus e suas misericórdias, que se renovam a cada manhã. A passagem termina com uma afirmação surpreendente sobre o coração de Deus: não é de boa vontade que ele aflige (3:33).',
    },
    'suffering:kp:hab-1-2': {
      title: 'Por que me fazes ver a injustiça?',
      group: 'Lamento e fé honesta',
      note: 'Habacuque começa com a mesma pergunta do Salmo 13 — até quando? —, agora sobre a injustiça na sociedade: violência, lei paralisada e justiça pervertida. A queixa do profeta se torna o início de um diálogo com Deus, e não o fim da fé.',
    },
    'suffering:kp:hab-3-17': {
      title: 'Alegria quando a figueira não floresce',
      group: 'Lamento e fé honesta',
      note: 'No fim do livro, o profeta ainda aguarda o dia da angústia (3:16) e encara a perspectiva de perda total — nenhum fruto, nenhuma colheita, nenhum rebanho —, e mesmo assim Habacuque decide alegrar-se no Deus da sua salvação. É um dos retratos mais claros, na Escritura, de uma fé que já não depende das circunstâncias.',
    },
    'suffering:kp:job-1-20': {
      title: 'O SENHOR deu, e o SENHOR tomou',
      group: 'Jó: sofrimento e mistério',
      note: 'Depois de perder os filhos e os bens, Jó rasga o manto, cai por terra — e adora. O narrador acrescenta que ele não pecou nem atribuiu a Deus falta alguma. Luto e adoração não são opostos aqui; acontecem no mesmo gesto.',
    },
    'suffering:kp:job-38-1': {
      title: 'A resposta do meio do redemoinho',
      group: 'Jó: sofrimento e mistério',
      note: 'Quando Deus finalmente fala, não explica a cena celestial dos capítulos 1–2. Ele pergunta a Jó onde ele estava quando a terra foi fundada. As notas da Tyndale observam que o livro não explica o sofrimento; mostra Deus rejeitando explicações fáceis enquanto chama Jó a confiar em sua sabedoria.',
    },
    'suffering:kp:job-42-1': {
      title: 'Agora meus olhos te veem',
      group: 'Jó: sofrimento e mistério',
      note: 'Jó não recebe uma lista de razões, mas recebe o próprio Deus: antes tinha ouvido falar dele, e agora o vê. O livro sugere que aquilo de que o sofredor mais precisa não é uma explicação, mas um encontro.',
    },
    'suffering:kp:gen-50-20': {
      title: 'Vós pensastes mal, mas Deus o encaminhou para o bem',
      group: 'Os propósitos de Deus na dor',
      note: 'José chama de mal o que seus irmãos fizeram e, na mesma frase, diz que Deus o destinou para o bem — para preservar a vida de muita gente. O versículo mantém juntas a culpa humana e a intenção divina, sem deixar que uma anule a outra.',
    },
    'suffering:kp:rom-5-3': {
      title: 'O sofrimento produz perseverança',
      group: 'Os propósitos de Deus na dor',
      note: 'Paulo traça uma corrente: sofrimento, perseverança, caráter aprovado, esperança — e uma esperança que não decepciona, porque o amor de Deus foi derramado em nosso coração pelo Espírito. O bem não está na dor em si, mas no que Deus opera por meio dela.',
    },
    'suffering:kp:heb-12-5': {
      title: 'A disciplina de um Pai',
      group: 'Os propósitos de Deus na dor',
      note: 'Hebreus lê certas dificuldades como a educação que um pai amoroso dá aos filhos: dolorosa no momento, mas que depois produz justiça e paz. A passagem não diz que toda provação é disciplina por uma falta específica; ela situa a perseverança dentro da filiação.',
    },
    'suffering:kp:2co-12-7': {
      title: 'O poder que se aperfeiçoa na fraqueza',
      group: 'Os propósitos de Deus na dor',
      note: 'Três vezes Paulo pediu que o espinho na carne fosse removido; a resposta foi uma graça suficiente para ele. Não sabemos o que era o espinho, mas sabemos o que ele ensinou: o poder de Cristo repousa sobre os fracos.',
    },
    'suffering:kp:jhn-9-1': {
      title: 'Quem pecou?',
      group: 'Nem sempre é castigo',
      note: 'Os discípulos supõem que a cegueira de um homem precisa ser culpa de alguém. Jesus rejeita as duas opções e aponta, em vez disso, para o que Deus vai manifestar nele. A Escritura recusa a equação simplista de que sofrimento sempre significa culpa pessoal.',
    },
    'suffering:kp:luk-13-1': {
      title: 'A torre de Siloé',
      group: 'Nem sempre é castigo',
      note: 'Informado sobre as vítimas da violência de Pilatos, e acrescentando seu próprio exemplo de uma torre que desabou, Jesus nega que elas fossem mais pecadoras que as outras — e então transforma a pergunta em um chamado: todos precisam se arrepender. A tragédia não é um veredito sobre suas vítimas, mas lembra a todos a sua necessidade de Deus.',
    },
    'suffering:kp:isa-53-3': {
      title: 'Homem de dores',
      group: 'Deus conosco no sofrimento: Cristo',
      note: 'O Servo conhece a dor, carrega as nossas tristezas e é esmagado por nossas iniquidades. O Novo Testamento aplica esse cântico a Jesus (por exemplo, 1Pe 2:24): o Deus da Bíblia responde ao sofrimento não de longe, mas carregando-o.',
    },
    'suffering:kp:mrk-15-34': {
      title: 'Deus meu, Deus meu, por que me desamparaste?',
      group: 'Deus conosco no sofrimento: Cristo',
      note: 'Na cruz, Jesus ora a primeira linha do Salmo 22, um lamento. O próprio Filho de Deus pergunta por quê. Há muito tempo os cristãos encontram aqui tanto a profundidade do que Cristo suportou quanto a permissão para levar a Deus o seu próprio porquê.',
    },
    'suffering:kp:heb-4-15': {
      title: 'Um sumo sacerdote que se compadece',
      group: 'Deus conosco no sofrimento: Cristo',
      note: 'Porque Jesus foi provado em tudo, como nós, ele é capaz de se compadecer das nossas fraquezas. Quem sofre ora a alguém que conhece a dor por dentro.',
    },
    'suffering:kp:rev-21-3': {
      title: 'Não haverá mais morte nem pranto',
      group: 'A esperança final',
      note: 'A última palavra da Bíblia sobre o sofrimento não é uma explicação, mas um desfecho: Deus habitando com o seu povo, toda lágrima enxugada, a morte e a dor desaparecidas, todas as coisas feitas novas. O sofrimento presente é real, mas não é permanente.',
    },
  },
  keyWords: {
    'suffering:kw:thlipsis': {
      english: 'aflição',
      basicMeaning: 'pressão; (figurado) aflição, tribulação, angústia',
      semanticRange: ['pressão (sentido literal)', 'aflição', 'tribulação', 'angústia'],
      grammar: 'Substantivo, genitivo singular feminino',
      significance:
        'Pela nossa contagem no Novo Testamento grego etiquetado do STEPBible, θλῖψις ocorre 45 vezes, e 2 Coríntios tem mais ocorrências (9) do que qualquer outro livro — é uma carta escrita sob pressão. Em 4:17 Paulo chama essa aflição de leve e momentânea, não porque seja trivial (4:8–9 e 11:23–29 mostram o contrário), mas porque ela está sendo pesada contra um peso eterno de glória. O verbo cognato θλίβω abre a lista de dificuldades em 4:8 (pressionados, atribulados), de modo que a lista começa com pressão (4:8) e a conclusão volta a nomeá-la (4:17).',
      caution:
        'O sentido literal registrado no léxico é pressão, mas isso não significa que todo uso traga uma imagem vívida de esmagamento. No Novo Testamento a palavra é usada em sentido figurado para aflição e angústia; é o contexto, e não a etimologia, que decide a nuance.',
      notableNotes: [
        'A carta começa com o Deus que nos consola em toda a nossa aflição — a palavra aparece duas vezes neste versículo.',
        'A aflição que Paulo sofreu na província da Ásia, tão grave que ele chegou a perder a esperança de sobreviver.',
        'Usada duas vezes: os crentes se alegram nas tribulações, porque a tribulação produz perseverança.',
        'Jesus avisa que seus seguidores terão aflições no mundo e lhes garante que ele venceu o mundo.',
        'A expressão controvertida sobre o que falta das aflições de Cristo.',
      ],
      anchors: [{ verse: { book: '2CO', chapter: 4, verse: 17 }, phrases: { BLIVRE: 'aflição', NBV: 'aflições', BPM: 'aflição' } }],
    },
    'suffering:kw:ostrakinos': {
      english: 'de barro (vasos de barro)',
      basicMeaning: 'feito de barro, de argila',
      semanticRange: ['feito de barro', 'de argila, de cerâmica'],
      grammar: 'Adjetivo, dativo plural neutro (com σκεῦος, “vaso”, G4632)',
      significance:
        'O adjetivo vem de ὄστρακον, vaso de barro ou caco de cerâmica, e aparece só duas vezes no Novo Testamento (2Co 4:7; 2Tm 2:20). A imagem de Paulo coloca o tesouro inestimável de 4:6 — a luz do conhecimento da glória de Deus na face de Cristo — dentro de algo barato e quebradiço: seu corpo mortal e seu ministério castigado. O objetivo é dito no mesmo versículo: para que a excelência do poder se veja como de Deus, e não nossa. A fraqueza não é um constrangimento para o evangelho; é onde o poder de Deus se torna visível.',
      caution:
        'O vaso é uma metáfora da fragilidade e da simplicidade humanas, não uma afirmação de que o corpo não tem valor. Paulo espera que o próprio corpo seja ressuscitado (4:14).',
      notableNotes: [
        'O único outro uso no Novo Testamento: numa casa grande há vasos de ouro e de prata, e também de madeira e de barro.',
        'Não é a mesma palavra, mas a sua raiz: no Antigo Testamento grego, Jó se raspa com um ὄστρακον, um caco de cerâmica.',
      ],
      anchors: [{ verse: { book: '2CO', chapter: 4, verse: 7 }, phrases: { BLIVRE: 'vasos de barro', NBV: 'vaso de barro', BPM: 'vasos de barro' } }],
    },
    'suffering:kw:exaporeo': {
      english: 'desesperar-se',
      basicMeaning: 'ficar totalmente sem saída, desesperar-se',
      semanticRange: ['ficar totalmente sem saída', 'estar desesperado'],
      grammar: 'Verbo, particípio presente médio/passivo (depoente), nominativo plural masculino',
      significance:
        'Paulo joga com dois verbos aparentados em 4:8: ἀπορούμενοι (perplexos, sem saber o que fazer), mas não ἐξαπορούμενοι (totalmente sem saída, desesperados). O prefixo intensifica a palavra, e o trocadilho é audível em grego. O verbo aparece só duas vezes no Novo Testamento — aqui e em 1:8, onde Paulo admite que na Ásia chegaram a perder a esperança de sobreviver. Lidos juntos, os versículos sugerem que o não desesperados não é a pretensão de uma calma inabalável, mas o testemunho de que o desespero não teve a última palavra, porque aprenderam a confiar no Deus que ressuscita os mortos (1:9).',
      caution:
        'O jogo de palavras é claro em grego, mas as traduções não conseguem reproduzi-lo; não construa uma doutrina apenas sobre o prefixo.',
      notableNotes: [
        'O único outro uso no Novo Testamento: Paulo admite que na Ásia chegaram a perder a esperança até de viver.',
        'O Antigo Testamento grego usa este verbo quando o salmista confessa estar desesperado.',
      ],
      anchors: [{ verse: { book: '2CO', chapter: 4, verse: 8 }, phrases: { BLIVRE: 'desesperados', NBV: 'desesperados', BPM: 'desesperados' } }],
    },
    'suffering:kw:nekrosis': {
      english: 'morte (mortificação)',
      basicMeaning: 'ato de dar a morte; estado de morte',
      semanticRange: ['ato de dar a morte, mortificação', 'estado de morte, amortecimento'],
      grammar: 'Substantivo, acusativo singular feminino',
      significance:
        'Paulo não usa aqui a palavra comum para morte (θάνατος), mas a mais rara νέκρωσις, que o léxico traduz como ato de dar a morte ou estado de morte. Ela sugere um processo — o morrer diário de um corpo desgastado pela perseguição — que Paulo leva consigo como a marca da própria morte de Jesus. A oração de finalidade pesa tanto quanto: para que também a vida de Jesus se manifeste em nosso corpo. Calvino traduziu a palavra por mortificatio, e uma nota da edição da Calvin Translation Society cita Beza, que usou a mesma tradução, explicando que aqui ela descreve não a morte em si, mas uma condição exposta à morte todos os dias.',
      caution:
        'Paulo não está dizendo que seus sofrimentos expiam o pecado. Ele compartilha o padrão da morte de Cristo, não a sua obra salvadora única.',
      notableNotes: ['O único outro uso no Novo Testamento: o amortecimento do ventre de Sara — do qual Deus fez surgir vida.'],
      anchors: [{ verse: { book: '2CO', chapter: 4, verse: 10 }, phrases: { BLIVRE: 'mortificação', NBV: 'morte', BPM: 'morte' } }],
    },
    'suffering:kw:ekkakeo': {
      english: 'desanimar',
      basicMeaning: 'perder o ânimo, desanimar',
      semanticRange: ['perder o ânimo', 'desanimar-se', 'cansar-se (de fazer o bem)'],
      grammar:
        'Verbo, presente do indicativo ativo, primeira pessoa do plural (ἐγκακοῦμεν no texto Nestle-Aland; ἐκκακοῦμεν no Textus Receptus)',
      significance:
        'Pela nossa contagem, o verbo ocorre seis vezes no Novo Testamento, duas delas neste capítulo (4:1, 4:16). Os dois usos emolduram a maior parte do capítulo: Paulo não desanima por causa da misericórdia que lhe confiou o ministério (4:1), e não desanima porque o homem interior se renova dia a dia (4:16). Em outros lugares, o verbo descreve o cansar-se de fazer o bem (Gl 6:9; 2Ts 3:13) ou o desanimar diante dos sofrimentos de um apóstolo (Ef 3:13), e Lucas 18:1 o associa à oração — uma pista de onde a coragem se renova.',
      caution:
        'Léxicos mais antigos ligam a palavra a κακός (“covarde”), mas é o uso, e não a etimologia, que decide o sentido: no Novo Testamento ela significa perder o ânimo ou cansar-se, não especificamente covardia.',
      notableNotes: [
        'O capítulo começa com as mesmas palavras: não desanimamos.',
        'Jesus conta uma parábola para ensinar a orar sempre, em vez de desanimar.',
        'Paulo exorta os crentes a não se cansarem de fazer o bem, porque a colheita virá.',
      ],
      anchors: [{ verse: { book: '2CO', chapter: 4, verse: 16 }, phrases: { BLIVRE: 'desfalecemos', NBV: 'desanimamos', BPM: 'desmaiamos' } }],
    },
    'suffering:kw:baros': {
      english: 'peso',
      basicMeaning: 'peso, fardo',
      semanticRange: ['peso', 'fardo', 'dignidade, autoridade (no grego posterior)'],
      grammar: 'Substantivo, acusativo singular neutro',
      significance:
        'Paulo estabelece um contrapeso deliberado: ἐλαφρόν, a leveza da aflição presente, contra βάρος, um peso eterno de glória, e acumula a expressão καθ᾽ ὑπερβολὴν εἰς ὑπερβολήν (literalmente de excesso em excesso). Uma antiga linha de interpretação, citada numa nota da edição da Calvin Translation Society a partir do lexicógrafo do século XVIII John Parkhurst, ouve aqui um eco hebraico: a palavra para glória, כָּבוֹד (kavod, H3519), está ligada ao verbo כָּבֵד (H3513), cujo campo de sentido inclui tanto ser pesado quanto ser honrado. O léxico registra uma passagem do Antigo Testamento grego em que βάρος traduz essa raiz hebraica (Jz 18:21). A sugestão é atraente — a glória como o verdadeiro peso da realidade —, mas Paulo não a explicita.',
      caution:
        'A ligação com kavod é uma proposta, não uma certeza: Paulo escreveu em grego e não sinaliza nenhum jogo de palavras hebraico. Trate-a como uma possibilidade esclarecedora, não como a chave do versículo.',
      notableNotes: [
        'Os crentes devem levar as cargas uns dos outros — aqui a palavra designa um peso que oprime a pessoa.',
        'O concílio de Jerusalém decide não impor aos crentes gentios nenhum fardo além do essencial.',
      ],
      anchors: [{ verse: { book: '2CO', chapter: 4, verse: 17 }, phrases: { BLIVRE: 'peso', BPM: 'peso' } }],
    },
    'suffering:kw:pascho': {
      english: 'sofrer',
      basicMeaning: 'sofrer; ser objeto de uma ação',
      semanticRange: ['sofrer (infortúnio, dor)', 'experimentar, ser objeto de uma ação'],
      grammar: 'Verbo, particípio presente ativo, nominativo plural masculino (em 1Pe 4:19)',
      significance:
        'O verbo básico do Novo Testamento para sofrer não aparece em 2 Coríntios 4, mas emoldura o tema. Pela nossa contagem, ocorre 42 vezes, e 1 Pedro o usa mais do que qualquer outro livro (12 vezes) — uma carta a crentes dispersos que enfrentavam hostilidade. O léxico observa seu sentido básico de ser objeto de uma ação, e não de agir: o sofrimento é aquilo que nos acontece. Os Evangelhos o usam para a necessidade do sofrimento do Messias (Lc 24:26), e 1 Pedro 4:19 diz aos que sofrem segundo a vontade de Deus que se entreguem a um Criador fiel.',
      notableNotes: [
        'Jesus ressuscitado explica que o Messias tinha de sofrer antes de entrar na sua glória.',
        'Até o Filho aprendeu a obediência por meio daquilo que sofreu.',
        'Sofrer por Cristo é descrito como algo concedido aos crentes, ao lado da própria fé.',
        'Em 2 Coríntios, Paulo fala dos coríntios suportando os mesmos sofrimentos que ele experimenta.',
      ],
      anchors: [{ verse: { book: '1PE', chapter: 4, verse: 19 }, phrases: { BLIVRE: 'sofrem', NBV: 'sofrendo', BPM: 'sofrem' } }],
    },
    'suffering:kw:oni': {
      english: 'aflição',
      basicMeaning: 'aflição, pobreza, miséria',
      semanticRange: ['aflição', 'pobreza', 'miséria'],
      grammar: 'Substantivo, masculino singular, estado construto, com sufixo de primeira pessoa (minha aflição)',
      significance:
        'Pela nossa contagem no texto hebraico etiquetado do STEPBible, עֳנִי ocorre 36 vezes, sobretudo em Salmos (10), Jó (6) e Lamentações (5). Seu campo de sentido vai de aflição a pobreza e miséria, e com frequência é algo que Deus vê: a história do êxodo começa com o SENHOR dizendo que viu a aflição do seu povo (Êx 3:7). Em Lamentações 3:19 o poeta pede a Deus que se lembre de sua aflição — e poucos versículos depois é ele quem se lembra das misericórdias de Deus (3:21–23). A mesma palavra que nomeia o sofrimento passa também a fazer parte do culto de Israel, no pão de aflição da Páscoa.',
      notableNotes: [
        'Na sarça ardente, Deus diz a Moisés que viu a aflição do seu povo no Egito.',
        'O pão sem fermento da Páscoa é chamado pão de aflição, comido em memória do Egito.',
        'Deus fala de provar o seu povo na fornalha da aflição.',
        'Na aflição, o salmista encontra consolo na promessa de Deus, que lhe dá vida.',
        'Eliú afirma que Deus livra os aflitos por meio da própria aflição.',
      ],
      anchors: [{ verse: { book: 'LAM', chapter: 3, verse: 19 }, phrases: { BLIVRE: 'aflição', NBV: 'sofrimento', BPM: 'aflição' } }],
    },
    'suffering:kw:an': {
      english: 'até quando',
      basicMeaning: 'onde? para onde?; (de tempo) quando? até quando?',
      semanticRange: ['onde? para onde? (de lugar)', 'quando? até quando? (de tempo)'],
      grammar: 'Partícula interrogativa; em Sl 13:1 (v. 2 no hebraico), na expressão עַד־אָנָה (com עַד, “até”, H5704)',
      significance:
        'O até quando traduz uma expressão hebraica de duas palavras, עַד־אָנָה — literalmente até onde? Pela nossa contagem, a combinação ocorre 14 vezes na Bíblia Hebraica, quatro delas nos dois primeiros versículos do Salmo 13, onde, como observam as notas da Tyndale, a repetição transmite agitação e profunda angústia. O hebraico tem uma segunda expressão para até quando, עַד־מָתַי (com מָתַי, H4970, quando?), usada, por exemplo, no Salmo 6:3. De um modo ou de outro, a própria pergunta é significativa: ela pressupõe que Deus é capaz de agir e que agirá. É uma queixa sobre o tempo, não uma negação de Deus.',
      caution:
        'Sozinho, אָן geralmente significa onde?; é a combinação com עַד que produz até quando. O cartão da palavra-chave mostra o interrogativo, mas o sentido pertence à expressão.',
      notableNotes: [
        'O até quando do profeta diante da violência e da injustiça.',
        'Jó devolve a pergunta aos amigos, perguntando até quando o atormentarão.',
        'O próprio SENHOR pergunta até quando o seu povo o desprezará — a pergunta corre nas duas direções.',
      ],
      anchors: [{ verse: { book: 'PSA', chapter: 13, verse: 1 }, phrases: { BLIVRE: 'Até quando', NBV: 'até quando', BPM: 'Por quanto tempo' } }],
    },
  },
  crossReferences: {
    'suffering:xr:rom-5-3': {
      title: 'Uma aflição que produz algo',
      explanation:
        'As duas passagens dizem que a aflição produz algo, e ambas usam o mesmo verbo grego (κατεργάζομαι, operar, produzir) com o mesmo substantivo θλῖψις. Em 2 Coríntios 4:17 a aflição está produzindo um peso eterno de glória; em Romanos 5:3–4 ela produz perseverança, caráter aprovado e esperança. Romanos descreve a transformação que Deus opera no crente agora; 2 Coríntios olha para a glória que a superará. Juntas, as duas passagens excluem a ideia de que o sofrimento seja desperdiçado nas mãos de Deus.',
    },
    'suffering:xr:rom-8-18': {
      title: 'Não se comparam com a glória',
      explanation:
        'Escrito mais ou menos um ano depois de 2 Coríntios, Romanos 8:18 faz a mesma comparação com palavras mais simples: os sofrimentos do tempo presente não se comparam com a glória que será revelada. Paulo não está minimizando a dor; está colocando-a numa balança cujo outro prato é tão pesado que muda a maneira como o presente é sentido. O estudo de Romanos 8 explora este versículo e a criação que geme, logo em seguida.',
    },
    'suffering:xr:2co-1-3': {
      title: 'O Deus de toda consolação — e o desespero na Ásia',
      explanation:
        'A abertura da carta é o melhor comentário ao capítulo 4. Deus nos consola em toda a nossa aflição (θλῖψις, duas vezes em 1:4) para que possamos consolar outros; e Paulo relata uma crise na Ásia tão grave que chegaram a perder a esperança até de viver (1:8) — o mesmo verbo que ele nega em 4:8. O propósito que ele extrai dela corresponde exatamente ao capítulo 4: não confiar em nós mesmos, mas em Deus, que ressuscita os mortos (1:9; compare 4:7, 14). O que exatamente aconteceu na Ásia é incerto; as notas da Tyndale mencionam como possibilidades o tumulto de Éfeso ou um julgamento com risco de execução.',
    },
    'suffering:xr:2co-11-23': {
      title: 'O que significava, na prática, ser atribulado',
      explanation:
        'O capítulo 11 preenche a história por trás de 4:8–9: açoites, três vezes espancado com varas, um apedrejamento, três naufrágios, perigos de rios e de salteadores, fome, frio — e a pressão diária da preocupação com as igrejas. Alguns itens podem ser associados a Atos (espancado com varas em Filipos, At 16:22–23; apedrejado em Listra, At 14:19). Como 2 Coríntios foi escrita antes da última viagem de Paulo a Jerusalém e a Roma, nenhum dos três naufrágios pode ser o famoso naufrágio de Atos 27. A aflição leve de Paulo era tudo, menos leve, pela medida humana.',
    },
    'suffering:xr:2co-12-7': {
      title: 'O poder que se aperfeiçoa na fraqueza',
      explanation:
        'O capítulo 4 enuncia o princípio; o capítulo 12 conta a história. Em 4:7 a excelência do poder (δύναμις) pertence a Deus, e não ao frágil vaso. Em 12:9, depois de Paulo pedir três vezes que o espinho fosse removido, o Senhor respondeu recusando o pedido e prometendo outra coisa: a sua graça basta, e o seu poder (δύναμις) se aperfeiçoa na fraqueza. João Crisóstomo, comentando 4:7, já ligava os dois versículos. O espinho não é identificado, mas a lição é clara: a fraqueza é o lugar onde repousa o poder de Cristo.',
    },
    'suffering:xr:php-3-10': {
      title: 'A comunhão dos seus sofrimentos',
      explanation:
        'Em Filipenses, Paulo diz que deseja conhecer a Cristo — o poder da sua ressurreição e a comunhão dos seus sofrimentos, tornando-se semelhante a ele na sua morte. É o mesmo duplo movimento de 2 Coríntios 4:10–11: levar a morte de Jesus para que a vida de Jesus se manifeste. Para Paulo, sofrer por Cristo não é um desvio no caminho de conhecê-lo, mas uma das maneiras pelas quais ele é conhecido.',
    },
    'suffering:xr:col-1-24': {
      title: 'Sofrer por amor da igreja',
      explanation:
        '“A morte opera em nós, mas em vós opera a vida” (4:12) tem um parente próximo em Colossenses 1:24, onde Paulo se alegra nos sofrimentos pela igreja e fala de completar o que falta das aflições de Cristo. As próprias notas da Tyndale ligam os dois versículos. A expressão de Colossenses exige cuidado. A nota da Tyndale explica que o sofrimento redentor de Cristo é único e está consumado, ao passo que Cristo continua a sofrer por meio do seu povo num mundo hostil. Os cristãos concordam que nada pode ser acrescentado à obra salvadora de Cristo, mas leem o versículo de maneiras diferentes. Calvino entendeu que Cristo, tendo sofrido uma vez em sua própria pessoa, ainda sofre em seus membros, cujas aflições fortalecem a fé da igreja — e rejeitou qualquer leitura que as tornasse expiatórias. O ensino católico (João Paulo II, Salvifici Doloris §24, 1984) também afirma que ninguém pode acrescentar nada à redenção, mas fala dos crentes que, unidos a Cristo, participam do seu sofrimento redentor em favor da Igreja.',
    },
    'suffering:xr:1pe-1-6': {
      title: 'Por pouco tempo — refinados como o ouro',
      explanation:
        'Ao momentâneo de Paulo corresponde o por pouco tempo de Pedro, que acrescenta uma imagem: a fé provada nas provações, como o ouro refinado pelo fogo, resultando em louvor e glória quando Cristo for revelado. Pedro, como Paulo, descreve as provações presentes como breves e cheias de propósito quando postas diante da glória vindoura.',
    },
    'suffering:xr:1pe-4-12': {
      title: 'Participar dos sofrimentos de Cristo',
      explanation:
        'Pedro diz aos crentes que não se surpreendam com a prova de fogo, como se algo estranho estivesse acontecendo, mas que se alegrem por participar dos sofrimentos de Cristo (4:12–13) — a mesma união com Cristo que Paulo expressa como levar consigo a morte de Jesus. Pedro acrescenta duas distinções que Paulo também faria: sofrer como malfeitor não é o mesmo que sofrer como cristão (4:15–16), e os que sofrem devem entregar-se a um Criador fiel e continuar a fazer o bem (4:19).',
    },
    'suffering:xr:jas-1-2': {
      title: 'Uma prova que produz perseverança',
      explanation:
        'Tiago, como Paulo, usa κατεργάζομαι (produzir): a prova da fé produz perseverança, que conduz à maturidade. Onde Paulo fala do homem interior que se renova dia a dia, Tiago fala de se tornar completo, sem que falte coisa alguma. Nenhum dos dois chama as provações de agradáveis; ambos dizem que elas produzem fruto.',
    },
    'suffering:xr:gen-1-3': {
      title: 'Que das trevas brilhasse a luz',
      explanation:
        'O tesouro de 4:7 é a luz de 4:6, e Paulo descreve Deus como aquele que disse que das trevas brilhasse a luz e que brilhou em nossos corações. Crisóstomo ouviu aqui a criação da luz em Gênesis 1:3 (com as trevas de 1:2), e muitos comentaristas posteriores o seguem: Jamieson, Fausset e Brown citam Gênesis 1:3, e Calvino considerou esta a mais natural entre várias leituras, embora deixasse a questão em aberto. A redação grega exata (φῶς λάμψει, a luz brilhará) corresponde a Isaías 9:2 na Septuaginta, e não a Gênesis 1:3; assim, Paulo talvez esteja combinando a criação com a aurora prometida por Isaías. Seja como for, o ponto importa para o sofrimento: o Deus que fez a luz no princípio está fazendo agora uma nova criação, e coloca essa luz em vasos frágeis.',
    },
    'suffering:xr:psa-116-10': {
      title: 'Cri, e por isso falei',
      explanation:
        'Paulo cita o Antigo Testamento grego palavra por palavra: ἐπίστευσα, διὸ ἐλάλησα. Na Septuaginta, essas palavras abrem um salmo separado (Sl 115 LXX), porque o grego divide em dois o Salmo 116 hebraico. Calvino observou que Paulo segue a tradução grega corrente. O contexto é revelador: o salmista continua dizendo que estava muito aflito. Paulo empresta a voz de um sofredor que continuou crendo e continuou falando — o mesmo espírito de fé que ele reivindica para si.',
    },
    'suffering:xr:isa-53-3': {
      title: 'O Servo que levou as nossas dores',
      explanation:
        'A morte de Jesus que Paulo leva consigo é a morte do Servo que foi desprezado, familiarizado com o sofrimento e esmagado por nossas iniquidades. O cântico de Isaías mostra que o caminho do escolhido de Deus passa pelo sofrimento até a vindicação; o ministério de Paulo segue o mesmo padrão, a distância — partilhando a forma do sofrimento de Cristo, não a sua obra expiatória.',
    },
    'suffering:xr:job-1-9': {
      title: 'Jó teme a Deus por nada?',
      explanation:
        'A tese do acusador, em Jó, é que a fé só existe com tempo bom: tire as bênçãos, e o crente amaldiçoará a Deus. A adoração de Jó depois da perda é a primeira refutação; o abatidos, porém não destruídos de Paulo é outra. Ambos mostram uma fé que se mantém quando a cerca de proteção já não existe. Os dois textos respondem à teoria cínica do acusador com aquilo que a graça de fato realiza nos que sofrem.',
    },
    'suffering:xr:rev-21-3': {
      title: 'As coisas invisíveis tornadas visíveis',
      explanation:
        'Paulo fixa os olhos no que é invisível e eterno. Apocalipse 21 o retrata: Deus habitando com o seu povo, as lágrimas enxugadas (ecoando a promessa de Isaías 25:8 de que Deus tragará a morte e enxugará as lágrimas), e já não haverá morte, nem pranto, nem clamor, nem dor. O peso eterno de glória não é uma abstração, mas uma criação renovada na presença de Deus.',
    },
    'suffering:xr:heb-12-1': {
      title: 'Jesus suportou a cruz pela alegria que tinha diante de si',
      explanation:
        'Hebreus chama os crentes a correr com perseverança, olhando para Jesus, que, pela alegria que lhe estava proposta, suportou a cruz. É a mesma lógica de 2 Coríntios 4:17–18 — o sofrimento presente suportado em vista do que está adiante —, mas aplicada primeiro ao próprio Jesus. (A BSB traduz as duas passagens com fix our eyes, fixar os olhos, embora os verbos gregos sejam diferentes: σκοπέω em 2 Coríntios, ἀφοράω em Hebreus.)',
    },
    'suffering:xr:mrk-15-34': {
      title: 'Desamparado — e não desamparado',
      explanation:
        'Paulo diz que é perseguido, mas não desamparado, usando ἐγκαταλείπω; Marcos traduz o clamor de Jesus na cruz — por que me desamparaste? — com o mesmo verbo. Paulo não está citando Marcos, e a ligação é verbal e teológica, não literária. Mas ela aponta para o coração da esperança cristã no sofrimento: muitos cristãos viram no Cristo desamparado a garantia de que Deus não desamparará o seu povo — promessa que Hebreus 13:5 repete com o mesmo verbo.',
    },
    'suffering:xr:psa-88': {
      title: 'Espaço para a oração que termina nas trevas',
      explanation:
        'O não desesperados de Paulo usa um verbo que o Antigo Testamento grego emprega no Salmo 88 para o estou desesperado do salmista (88:15; LXX 87:16). O Salmo 88 é um lamento que termina sem resolução, mas continua sendo oração, dirigida ao Deus da minha salvação. Lidos juntos, os dois textos mantêm os cristãos honestos: a Escritura nem nega o desespero nem lhe concede a última palavra.',
    },
  },
  context: {
    'suffering:ctx:occasion': {
      title: 'Uma relação tensa com Corinto',
      summary:
        'Paulo escreveu 2 Coríntios por volta de 56 d.C., da Macedônia, depois de uma visita dolorosa a Corinto, de uma carta severa (provavelmente perdida) e do relatório animador de Tito. Alguns na igreja duvidavam de sua autoridade justamente porque ele parecia fraco e aflito.',
      detail:
        'Segundo as Tyndale Open Study Notes, 1 Coríntios foi mal recebida; Paulo fez uma visita pessoal a partir de Éfeso, que fracassou, escreveu entre lágrimas uma “carta severa”, levada por Tito, e depois, tendo deixado Éfeso em meio a duras provações, encontrou Tito na Macedônia com boas notícias sobre o arrependimento da igreja. Para alguns coríntios, seu sofrimento e sua fraqueza pareciam contradizer sua pretensão de ser apóstolo. O capítulo 4 responde de frente a essa objeção: a fraqueza é exatamente o lugar onde o poder de Deus se manifesta.',
    },
    'suffering:ctx:asia': {
      title: 'A crise na Ásia',
      summary:
        'Pouco antes de escrever, Paulo enfrentou uma crise que pôs sua vida em risco na província romana da Ásia (1:8–11). Sua natureza exata é desconhecida: já se sugeriram o tumulto de Éfeso (At 19:23–41), um julgamento com perspectiva de execução ou — menos provável — uma doença grave.',
    },
    'suffering:ctx:clay-jars': {
      title: 'A cerâmica de Corinto e o tesouro em vasos de barro',
      summary:
        'Os artesãos de Corinto produziam cerâmica e, sobretudo, lamparinas de terracota conhecidas em todo o mundo antigo, e comentaristas mais antigos observam que tesouros eram muitas vezes guardados em vasos de barro. A imagem de Paulo teria sido imediatamente concreta: um recipiente barato e quebradiço guardando algo inestimável.',
      detail:
        'A introdução da Tyndale liga diretamente as conhecidas lamparinas de terracota de Corinto a 2 Coríntios 4:7, o que combina com a imagem da luz e do vaso em 4:6–7. Jamieson, Fausset e Brown observam que os antigos costumavam guardar tesouros em vasos de barro. Alguns comentaristas mais antigos (o Comentário de Matthew Henry, na seção de 2 Coríntios concluída por Daniel Mayo após a morte de Henry, e Jamieson, Fausset e Brown) também viram uma alusão aos soldados de Gideão, cujas tochas estavam escondidas em cântaros (Jz 7:16–20); isso continua sendo uma sugestão, já que Paulo não menciona Gideão.',
    },
    'suffering:ctx:triumph': {
      title: 'Conduzido num triunfo romano (2:14)',
      summary:
        'A seção que contém o capítulo 4 começa com a imagem de um desfile de vitória romano, em que um general conduzia prisioneiros e se espalhava incenso ao longo do trajeto. Paulo se retrata como prisioneiro de Cristo nesse cortejo — o pano de fundo de sua fala sobre fraqueza e glória.',
      detail:
        'As notas da Tyndale explicam que os prisioneiros de um desfile triunfal seguiam para a arena e para a morte, e que o incenso ao longo do caminho tinha para eles cheiro de morte e, para os vencedores, cheiro de vida (2:15–16). O autorretrato de Paulo como prisioneiro prepara o tema do capítulo 4: levar consigo a morte de Jesus.',
    },
    'suffering:ctx:hardship-lists': {
      title: 'Catálogos de adversidades',
      summary:
        'Listas de adversidades eram uma forma reconhecida na filosofia moral greco-romana, usada para exibir a firmeza do sábio. As listas de Paulo em 1 e 2 Coríntios (inclusive 4:8–9) têm sido estudadas contra esse pano de fundo — com a diferença decisiva de que Paulo atribui sua sobrevivência ao poder de Deus, e não à sua própria virtude.',
      detail:
        'Cracks in an Earthen Vessel (1988), de John T. Fitzgerald — cujo título vem de 2Co 4:7 —, examina os catálogos de adversidades da correspondência coríntia ao lado do uso filosófico dessas listas (o termo grego é peristasis, circunstância ou adversidade), recorrendo a autores como Epicteto e Dion Crisóstomo. O contraste de 4:7 (o poder vem de Deus, e não de nós) é próprio de Paulo: as listas não exibem a autossuficiência de um sábio, mas a força de Deus num vaso frágil.',
    },
    'suffering:ctx:lament-psalms': {
      title: 'O lamento como gênero bíblico',
      summary:
        'Os lamentos formam a maior parte dos salmos dos Livros 1–3 do Saltério e incluem lamentos individuais e comunitários. Em geral, movem-se da queixa e da súplica para a confiança — embora o Salmo 88 não o faça —, dando a Israel uma linguagem legítima para a dor.',
      detail:
        'A introdução da Tyndale aos Salmos classifica como lamentos a maioria dos salmos dos Livros 1–3, subdivididos em lamentos individuais e comunitários. O Salmo 13 mostra o movimento comum, do quádruplo até quando à confiança e ao cântico; o Salmo 88 mostra que o cânon também preserva um lamento sem resolução. Lamentações, Jó e Habacuque estendem a mesma tradição para além do Saltério.',
    },
    'suffering:ctx:ane-wisdom': {
      title: 'Jó entre os textos antigos sobre o sofrimento',
      summary:
        'Outros textos do antigo Oriente Próximo lutam com a figura do justo sofredor, especialmente as obras babilônicas conhecidas em inglês como I Will Praise the Lord of Wisdom (Louvarei o Senhor da Sabedoria) e Babylonian Theodicy (Teodiceia Babilônica). Jó compartilha a forma de diálogo da Teodiceia, mas difere dela profundamente: é monoteísta, e seu herói nunca abandona o compromisso com Deus.',
      detail:
        'A introdução da Tyndale a Jó, baseada nos Ancient Near Eastern Texts de Pritchard, observa que em “I Will Praise the Lord of Wisdom” o sofredor supõe algum pecado desconhecido e é curado por meio de exorcismos, ao passo que a “Babylonian Theodicy” usa um diálogo muito parecido com o de Jó, mas dentro de um mundo politeísta e com um sofredor que ameaça abandonar a obediência. O cenário de Jó é patriarcal; a data de composição do livro é incerta.',
    },
    'suffering:ctx:retribution': {
      title: 'O sofredor mereceu?',
      summary:
        'Uma suposição difundida no mundo bíblico — expressa pelos amigos de Jó e pelos discípulos de Jesus — sustentava que o sofrimento é sempre resultado direto do pecado de quem sofre. A Escritura afirma que o pecado tem consequências, mas nega repetidamente que toda calamidade seja um veredito sobre suas vítimas.',
      detail:
        'As notas da Tyndale sobre Jó descrevem o raciocínio fechado dos amigos — Deus é justo, logo o sofrimento de Jó tem de ser castigo — e mostram o livro rejeitando essa aplicação do “toma lá, dá cá”. Em João 9:2 os discípulos supõem que o pecado de alguém causou a cegueira de um homem, e Jesus os corrige. Em Lucas 13 Jesus responde à ideia popular de que coisas ruins só acontecem a pessoas ruins; as notas acrescentam que o incidente dos galileus não é conhecido por outras fontes, embora se saiba por Josefo que Pilatos reprimia distúrbios com violência.',
    },
  },
  literary: {
    placeInBook:
      '2 Coríntios 4:7–18 está dentro de uma longa seção (2:14–7:4) em que Paulo interrompe o relato de sua busca por Tito e defende a natureza do seu ministério; o relato é retomado em 7:5. Depois de descrever a glória superior do ministério da nova aliança (3:1–4:6), Paulo enfrenta agora a objeção óbvia — se a mensagem é tão gloriosa, por que o mensageiro está tão castigado? — e transforma sua fraqueza em prova a favor do evangelho.',
    argument:
      'A passagem avança em cinco passos. (1) Tese: o tesouro está em vasos de barro para que o poder seja visto como de Deus (4:7). (2) Evidência: quatro contrastes em pares — pressionados, mas não esmagados; perplexos, mas não desesperados; perseguidos, mas não desamparados; abatidos, mas não destruídos (4:8–9). (3) Interpretação: é a morte de Jesus levada no corpo para que a sua vida se manifeste, e isso opera vida nos coríntios (4:10–12). (4) Fundamento da confiança: a fé do salmista, que fala, e a certeza da ressurreição (4:13–15). (5) Conclusão: por isso não desanimamos, porque a aflição presente é pesada contra a glória eterna, e o invisível dura mais que o visível (4:16–18).',
    placeInCanon:
      'A passagem recolhe toda a história da Bíblia. Ecoa a criação (a luz que brilha das trevas, 4:6, muito provavelmente lembrando Gênesis 1:3), convive honestamente com a queda (um homem exterior que se desgasta, 4:16), encontra seu centro na morte e ressurreição de Cristo (4:10, 14) e se inclina para a nova criação (4:17–5:5; compare 5:17). Esse arco — criação, queda, redenção, nova criação — é a moldura em que a Bíblia situa toda pergunta sobre o sofrimento.',
    bookOutline: [
      'Saudação e o Deus de toda consolação',
      'Mudança de planos e a carta dolorosa',
      'A glória do ministério da nova aliança',
      'Tesouro em vasos de barro: sofrimento e esperança',
      'O ministério da reconciliação',
      'Um apelo a corações abertos',
      'O relatório de Tito e a alegria de Paulo',
      'A coleta para Jerusalém',
      'Paulo defende seu apostolado',
    ],
    passageOutline: [
      'Tesouro em vasos de barro',
      'Quatro contrastes com “mas não”',
      'A morte e a vida de Jesus',
      'A fé que fala',
      'Renovados dia a dia: o peso de glória',
    ],
    features: {
      'suffering:lit:antitheses': {
        title: 'Quatro contrastes com “mas não”',
        description:
          'Os versículos 8–9 apresentam quatro pares correspondentes, cada um com um particípio de adversidade seguido de mas não e de um particípio mais forte. O ritmo transmite a mensagem: cada golpe é real, mas nenhum é definitivo. O segundo contraste contém um trocadilho em grego — ἀπορούμενοι (sem saber o que fazer), mas não ἐξαπορούμενοι (totalmente sem saída).',
        structure: [
          { label: '1', text: 'Pressionados por todos os lados — mas não esmagados' },
          { label: '2', text: 'Sem saber o que fazer — mas não totalmente sem saída (desesperados)' },
          { label: '3', text: 'Perseguidos — mas não desamparados' },
          { label: '4', text: 'Abatidos — mas não destruídos' },
        ],
      },
      'suffering:lit:inclusio': {
        title: 'Não desanimamos (4:1, 4:16)',
        description:
          'A mesma oração, com o mesmo verbo grego, abre o capítulo 4 e volta perto do fim (4:16). Em 4:1 a razão é a misericórdia de Deus ao confiar-lhe o ministério; em 4:16, a renovação diária do homem interior e a glória que virá. A moldura mostra o propósito do capítulo: explicar como um ministro que sofre continua de pé.',
      },
      'suffering:lit:death-life': {
        title: 'A morte e a vida de Jesus',
        description:
          'Em 4:10–14 o nome Jesus aparece seis vezes, e morte e vida se alternam três vezes cada uma (4:10, 11, 12). A experiência de Paulo é descrita inteiramente nos termos da própria história de Jesus: o seu morrer levado no corpo, a sua vida manifestada na carne mortal, a sua ressurreição como garantia da nossa.',
      },
      'suffering:lit:scales': {
        title: 'Pesando a aflição contra a glória',
        description:
          'Os versículos 17–18 são construídos com pares de opostos: momentâneo e eterno, leveza e peso, aflição e glória, visível e invisível, temporário e eterno. João Crisóstomo já notava como Paulo contrapõe presente e futuro, breve e eterno, leve e pesado, aflição e glória — e ainda redobra a expressão, para não deixar dúvidas.',
        structure: [
          { label: 'A', text: 'Aflição leve e momentânea' },
          { label: 'A′', text: 'Um peso eterno de glória, acima de toda comparação' },
          { label: 'B', text: 'O que se vê — temporário' },
          { label: 'B′', text: 'O que não se vê — eterno' },
        ],
      },
      'suffering:lit:jars': {
        title: 'Tesouro em vasos de barro',
        description:
          'A imagem que governa a passagem une 4:6 a 4:7: a luz da glória de Deus na face de Cristo é o tesouro, e os frágeis corpos e ministérios humanos são os vasos. A metáfora explica todo o argumento — a fraqueza do recipiente torna inconfundível o poder do conteúdo.',
      },
    },
  },
  theology: {
    'suffering:th:providence': {
      title: 'Um Deus bom e soberano num mundo caído',
      summary:
        'A Escritura mantém juntas a bondade de Deus, a sua soberania sobre todas as coisas, a realidade do mal e a responsabilidade humana — sem fingir que seja fácil conciliá-las.',
      detail:
        'José pode dizer, no mesmo fôlego, que seus irmãos intentaram o mal e que Deus o encaminhou para o bem (Gn 50:20). O narrador de Jó mostra Deus permitindo o que Satanás faz, sem nunca explicá-lo a Jó. Lamentações diz que não é de bom grado que Deus aflige (Lm 3:33). A resposta cristã histórica, formulada classicamente por Agostinho e reformulada de maneiras diferentes na Confissão de Fé de Westminster (cap. 5) e no Catecismo da Igreja Católica (§§311–312), é que nada, nem mesmo o mal, fica fora da providência de Deus: Deus nunca é o autor do pecado, mas é capaz de tirar o bem do mal. Os cristãos divergem sobre como descrever a relação de Deus com os atos maus — o ensino católico diz que ele permite o mal moral, enquanto a Confissão de Westminster diz que ele governa o pecado não por uma simples permissão (veja as perspectivas abaixo) —, mas concordam que o mal não é uma ilusão nem está fora do governo de Deus.',
    },
    'suffering:th:cross': {
      title: 'A teologia da cruz: Deus nas profundezas',
      summary:
        'A resposta mais plena de Deus ao sofrimento não é um argumento, mas um ato: em Cristo ele entrou na dor humana, foi desamparado na cruz e ressuscitou. O poder se revela por meio da fraqueza.',
      detail:
        'O Servo de Isaías é um homem de dores; Jesus ora na cruz o lamento do Salmo 22; Hebreus insiste que ele se compadece das nossas fraquezas. As teses de Martinho Lutero para a Disputa de Heidelberg (1518) transformaram isso num princípio: Deus é verdadeiramente conhecido não quando raciocinamos até ele a partir das obras e da glória, mas no sofrimento e na cruz. 2 Coríntios 4 aplica o princípio ao ministério cristão — o poder de Deus aparece num vaso rachado —, e John Stott, no capítulo final de A cruz de Cristo (The Cross of Christ), olhou para o sofrimento do mundo a partir do Calvário, onde Deus é visto suportando ele mesmo a dor e a injustiça, em vez de observá-las de longe.',
    },
    'suffering:th:union': {
      title: 'A união com Cristo no sofrimento',
      summary:
        'Os crentes participam da história de Cristo: levam consigo o seu morrer e participarão da sua ressurreição. Sofrer por Cristo é uma das maneiras de participar da sua vida, e não um sinal de abandono.',
      detail:
        'Paulo fala de levar a morte de Jesus para que a sua vida se manifeste (2Co 4:10–11), da comunhão dos seus sofrimentos (Fp 3:10) e de sofrer com Cristo para com ele ser glorificado (Rm 8:17). Pedro diz aos crentes que se alegrem por participar dos sofrimentos de Cristo (1Pe 4:13). Os cristãos concordam que esses textos nada acrescentam à obra expiatória única de Cristo, embora as tradições descrevam de modos diferentes a participação dos crentes nos seus sofrimentos (veja Cl 1:24). Os textos descrevem o padrão de uma vida moldada pela cruz e a certeza da ressurreição (2Co 4:14).',
    },
    'suffering:th:lament': {
      title: 'Lamento: a fé que se queixa a Deus',
      summary:
        'A Bíblia dá aos que sofrem palavras para protestar, questionar e chorar — dirigidas a Deus. O lamento não é o oposto da fé, mas uma de suas formas.',
      detail:
        'Grande parte dos Salmos é formada por lamentos; Jó discute com Deus; Lamentações (tradicionalmente atribuído a Jeremias) chora uma cidade destruída; Habacuque pergunta até quando; o próprio Jesus ora um lamento na cruz. O até quando do Salmo 13 e as trevas sem resolução do Salmo 88 mostram que a honestidade diante de Deus não é irreverência. A Grief Observed, de C. S. Lewis, é um exemplo moderno da mesma luta honesta.',
    },
    'suffering:th:refining': {
      title: 'Provações que refinam',
      summary:
        'Deus usa a aflição para produzir perseverança, caráter e esperança, e para afrouxar o nosso apego ao que é passageiro. O bem não está na dor, mas no que Deus opera por meio dela.',
      detail:
        'Paulo, Tiago e Pedro descrevem as provações como algo que produz fruto — perseverança, maturidade, fé provada (Rm 5:3–5; Tg 1:2–4; 1Pe 1:6–7). Hebreus apresenta a adversidade como a educação dada por um pai (Hb 12:5–11), e 2 Coríntios 4:16 fala do homem interior que se renova dia a dia enquanto o exterior se desgasta. A Escritura não diz que toda provação seja enviada para corrigir uma falta específica (Jo 9:3), nem que o sofrimento seja bom em si mesmo.',
    },
    'suffering:th:hope': {
      title: 'O peso de glória: esperança para além do sofrimento',
      summary:
        'A esperança cristã não nega a dor presente; coloca-a numa balança diante da ressurreição e da nova criação, onde a glória supera a aflição muito além de qualquer comparação.',
      detail:
        'Paulo fundamenta a perseverança na ressurreição (2Co 4:14) e num peso eterno de glória (4:17), prosseguindo com a esperança de uma habitação celestial em 5:1–5. Romanos 8:18 diz que os sofrimentos presentes não se comparam com a glória vindoura, e Apocalipse 21 retrata o fim: Deus com o seu povo, as lágrimas enxugadas, a morte extinta. É essa esperança que permite a Paulo chamar de leve um sofrimento pesado.',
    },
  },
  perspectives: {
    'suffering:ps:why-evil': {
      question: 'Por que Deus permite o mal e o sofrimento?',
      intro:
        'Os cristãos concordam que Deus é bom, que é soberano e que o mal é real. Várias respostas já foram dadas à pergunta de por que um Deus assim permite o mal. Algumas são ênfases filosóficas ou pastorais que cristãos de muitas igrejas combinam entre si. Um ponto, porém, é uma diferença real entre as tradições: o ensino católico diz que Deus permite o mal moral por respeito à liberdade de suas criaturas (CIC 311), e John Wesley argumentou que Deus não poderia abolir o pecado sem destruir a liberdade que concedeu; a Confissão de Fé de Westminster, por sua vez, ensina que Deus ordena tudo o que acontece e governa até o pecado não por uma simples permissão (CFW 3.1; 5.4), ao mesmo tempo que nega ser ele o seu autor.',
      commonGround:
        'Em suas formas cristãs históricas, essas abordagens afirmam que Deus é bom e todo-poderoso; que o mal é real, não é bom em si mesmo e nunca é pecado de Deus; que a rebelião humana desfigurou uma criação boa; que a morte e a ressurreição de Cristo são a resposta decisiva de Deus ao mal; e que Deus finalmente porá fim ao sofrimento e à morte. Divergem na maneira de relacionar a vontade de Deus com males particulares e em quanto julgam possível explicar deste lado da nova criação.',
      perspectives: {
        'suffering:ps:why-evil:augustinian': {
          tradition: 'Agostiniana',
          label: 'O mal é privação do bem; Deus o permite porque é capaz de tirar dele o bem',
          summary:
            'Agostinho ensinou que tudo o que Deus fez é bom e que o mal não é uma substância, mas a ausência ou corrupção do bem, como a doença é a ausência da saúde. O mal entrou pelo mau uso do livre-arbítrio criado. Deus só o permite porque é poderoso e bom o bastante para tirar o bem até do mal; julgou melhor tirar o bem do mal do que não permitir mal algum.',
        },
        'suffering:ps:why-evil:irenaean': {
          tradition: 'Irineana (formação da alma)',
          label: 'A humanidade foi criada imatura; o mundo é um lugar de crescimento rumo a Deus',
          summary:
            'Irineu de Lyon argumentou que os seres humanos não podiam receber a perfeição no momento da criação, sendo como crianças pequenas; precisavam crescer, pela experiência do bem e do mal e pela livre escolha, rumo à semelhança de Deus (Contra as Heresias 4.37–39). Em 1966, o filósofo John Hick desenvolveu essa ideia numa teodiceia moderna da formação da alma (soul-making), contrastando-a com a de Agostinho. O leitor deve notar que a versão de Hick tratava a queda como mito e exigia a salvação final de todas as pessoas (um universalismo criticado pelo teólogo Henri Blocher), e que sua obra posterior passou ao pluralismo religioso e a uma visão metafórica da encarnação, bem fora da ortodoxia histórica. A ênfase irineana no crescimento não depende desses passos.',
        },
        'suffering:ps:why-evil:reformed': {
          tradition: 'Reformada',
          label: 'Deus ordena todas as coisas, inclusive os atos maus, para fins santos — sem ser o autor do pecado',
          summary:
            'A teologia reformada enfatiza que a providência de Deus se estende a todo acontecimento, inclusive ao pecado, não por mera permissão, mas limitando-o e dirigindo-o sabiamente para os seus santos propósitos; ainda assim, o pecado procede apenas da criatura, e Deus não é nem seu autor nem quem o aprova (Confissão de Westminster 5.4). As palavras de José em Gênesis 50:20 são o modelo. D. A. Carson defende essa posição como compatibilismo: Deus é plenamente soberano e os seres humanos são plenamente responsáveis — um mistério da providência que a Escritura afirma sem explicar por completo. Os escritos pastorais de John Piper a aplicam diretamente, exortando os crentes a ver até a doença como algo que Deus designou para o seu bem.',
        },
        'suffering:ps:why-evil:catholic': {
          tradition: 'Católica',
          label: 'Deus permite o mal moral, respeitando a liberdade das criaturas, e dele tira o bem',
          summary:
            'O Catecismo da Igreja Católica diz que nenhum argumento isolado resolve a questão do mal; é o conjunto da fé cristã que constitui a resposta. Deus não causa o mal moral, nem direta nem indiretamente, mas o permite por respeito à liberdade de suas criaturas, e pode tirar dele o bem. O Catecismo cita o Enchiridion de Agostinho e as palavras de José em Gênesis 50:20, e aponta para a cruz, onde o maior mal jamais cometido se tornou ocasião do maior bem (CIC 309–314, 324). Na carta apostólica Salvifici Doloris (1984), João Paulo II acrescenta que a redenção de Cristo é completa e nada se lhe pode acrescentar, mas que aqueles que sofrem em união com ele se tornam participantes do seu sofrimento redentor (§§19, 24); ele lê 2 Coríntios 4:8–11 sob essa luz (§20).',
        },
        'suffering:ps:why-evil:wesleyan': {
          tradition: 'Arminiana / Wesleyana',
          label: 'Deus governa todas as coisas, mas não destruirá a liberdade que concedeu para abolir o pecado',
          summary:
            'John Wesley defendia uma providência particular, e não apenas geral: Deus vê cada criatura e cada sofrimento de seus filhos, e cuida de cada um (Sermão 67, “On Divine Providence”, §§12–13, 18–26). Por que, então, ele simplesmente não acaba com o pecado e a dor? Porque, argumentava Wesley, Deus criou os seres humanos à sua imagem, com entendimento, vontade e liberdade, sem os quais não seriam capazes nem de virtude nem de vício; abolir o pecado pela pura força desfaria a sua própria obra. Assim, Deus governa as pessoas como seres livres e inteligentes, e não como máquinas, dando-lhes toda a ajuda para o bem que não anule a sua liberdade (§15).',
        },
        'suffering:ps:why-evil:free-will-defence': {
          tradition: 'Defesa do livre-arbítrio (filosofia analítica da religião)',
          label: 'Um mundo com criaturas verdadeiramente livres pode valer o risco do mal',
          summary:
            'A defesa do livre-arbítrio de Alvin Plantinga responde à forma lógica do problema do mal (tal como formulada por J. L. Mackie): não é contraditório sustentar que um Deus todo-poderoso e sumamente bom existe ao lado do mal, porque um mundo com criaturas dotadas de real liberdade moral — e, portanto, capazes de fazer o mal — pode ser melhor que um mundo sem criaturas livres, e nem mesmo Deus pode fazer com que criaturas livres sempre escolham livremente o bem. Plantinga a apresenta como uma defesa (que mostra a coerência), não como uma teodiceia completa que explique cada mal.',
        },
        'suffering:ps:why-evil:orthodox': {
          tradition: 'Ortodoxa Oriental',
          label: 'A morte e a corrupção são inimigas que Deus derrotou em Cristo',
          summary:
            'O pensamento cristão oriental tende a falar menos em explicar o mal e mais na vitória de Deus sobre ele. Atanásio descreve uma humanidade que desliza para a corrupção e a morte, e Deus, que não quer que a sua obra pereça, assumindo um corpo como o nosso para vencer a morte e restaurar a incorruptibilidade (A Encarnação do Verbo 6–10). O filósofo ortodoxo David Bentley Hart, escrevendo após o tsunami de 2004 no Oceano Índico, argumentou que os cristãos não deveriam descrever tais catástrofes como expressões da vontade de Deus, mas como marcas de um mundo mantido cativo por poderes hostis — um cativeiro ao qual Deus se opõe e ao qual finalmente porá fim em seu reino.',
        },
        'suffering:ps:why-evil:pastoral': {
          tradition: 'Pastoral-bíblica (entre tradições)',
          label: 'A Escritura oferece mais a presença de Deus e um futuro do que uma explicação completa',
          summary:
            'Muitos autores enfatizam que a Bíblia, como o livro de Jó, não dá aos que sofrem uma explicação completa, mas lhes dá o próprio Deus — a sua presença, o seu sofrimento em Cristo e a sua promessa de endireitar todas as coisas. Timothy Keller combina abordagens filosóficas, bíblicas e práticas e argumenta que Deus produz alegria por meio do sofrimento, como mostra a cruz. N. T. Wright argumenta que a Bíblia conta como Deus lida com o mal, em vez de explicar de onde ele veio. Joni Eareckson Tada, escrevendo com Steven Estes a partir de décadas de tetraplegia, argumenta que Deus compreende a nossa dor, só a permite por razões sábias e é capaz de usá-la para o bem.',
        },
      },
    },
  },
  commentary: {
    'suffering:cm:chrysostom-4-7': {
      lead: 'Sobre o tesouro em vasos de barro (4:7). “Vile”, aqui, significa humilde ou sem valor.',
      quoteTranslation:
        '…esta mesma coisa é, de fato, a maior das maravilhas e um exemplo grandíssimo do poder de Deus: que um vaso de barro tenha sido capacitado a suportar tão grande esplendor e a guardar tão alto tesouro. … Pois é então que o poder de Deus mais se evidencia, quando por meios vis realiza coisas grandiosas.',
    },
    'suffering:cm:augustine-enchiridion': {
      lead: 'Sobre por que um Deus sumamente bom permite o mal',
      quoteTranslation:
        'Pois o Deus Todo-Poderoso, que, como reconhecem até os pagãos, tem poder supremo sobre todas as coisas, sendo ele mesmo sumamente bom, jamais permitiria a existência de mal algum entre as suas obras se não fosse tão onipotente e bom que pode tirar o bem até do mal. Pois o que é aquilo que chamamos mal senão a ausência do bem?',
    },
    'suffering:cm:luther-heidelberg': {
      lead: 'Sobre a teologia da cruz (teses 19–21)',
      text: 'Em teses preparadas para uma disputa de sua ordem agostiniana em Heidelberg, em abril de 1518, Lutero distingue dois tipos de teólogo. O teólogo da glória pretende discernir os atributos invisíveis de Deus — sua sabedoria, justiça e bondade — a partir das coisas criadas e das obras humanas, e por isso valoriza o êxito acima do sofrimento, a glória acima da cruz e a força acima da fraqueza. O verdadeiro teólogo compreende o que é visível de Deus por meio do sofrimento e da cruz. A teologia da glória, diz Lutero, inverte o bem e o mal, ao passo que a teologia da cruz chama as coisas pelo que realmente são.',
    },
    'suffering:cm:calvin-4-17': {
      lead: 'Sobre a aflição leve e momentânea (4:17)',
      quoteTranslation:
        'Paulo, portanto, prescreve o melhor antídoto para que não sucumbas sob a pressão das aflições, quando lhes contrapõe aquela bem-aventurança futura que te está reservada no céu. … Pois esta comparação torna leve o que antes parecia pesado, e torna breve e momentâneo o que parecia de duração sem limites.',
    },
    'suffering:cm:mayo-4-8': {
      lead: 'Sobre os quatro contrastes de 4:8–9. Do Comentário de Matthew Henry — a seção de 2 Coríntios foi concluída por Daniel Mayo após a morte de Henry.',
      quoteTranslation:
        'Seja qual for a condição em que os filhos de Deus se encontrem neste mundo, eles têm um “mas não” com que se consolar; o seu caso às vezes é ruim, sim, muito ruim, mas não tão ruim quanto poderia ser.',
    },
    'suffering:cm:spurgeon-light-affliction': {
      lead: 'Sobre por que Paulo podia chamar de leve a sua aflição',
      quoteTranslation:
        'Ele escreveu sobre a “nossa leve aflição” mesmo quando estava pesadamente afligido, e enquanto sentia agudamente essa aflição. … Ele sentia o peso dela e tinha plena consciência da pressão que ela exercia sobre o seu espírito…',
    },
    'suffering:cm:lewis-problem-of-pain': {
      lead: 'Sobre o poder de Deus, o amor de Deus e a dor humana',
      text: 'Lewis argumenta que a dor não refuta um Deus bom e todo-poderoso quando essas palavras são bem entendidas. A onipotência não inclui fazer o que é contraditório em si mesmo, e um mundo em que criaturas livres possam se encontrar precisa de uma ordem natural estável, que também pode ferir. O amor divino é mais exigente do que uma bondade que apenas nos quer confortáveis; busca a nossa perfeição e, por isso, pode causar dor. Nos capítulos sobre a dor humana, ele argumenta que, ao contrário do prazer ou mesmo do pecado, a dor não pode ser facilmente ignorada, e por isso pode despertar para a sua necessidade de Deus pessoas que vivem satisfeitas sem ele. Ele não pretende explicar cada caso de sofrimento, apenas mostrar que bondade e sofrimento não são contraditórios.',
    },
    'suffering:cm:lewis-grief-observed': {
      lead: 'Sobre o luto sem respostas arrumadas',
      text: 'Compilado a partir dos cadernos que Lewis manteve depois que sua esposa, Joy Davidman, morreu de câncer em 1960, e publicado primeiro sob o pseudônimo N. W. Clerk, A anatomia de uma dor (A Grief Observed) registra o luto com rara franqueza. Lewis expressa raiva e perplexidade diante de Deus e dúvidas de fé que antes tratava com segurança, e só aos poucos avança para uma confiança renovada e mais humilde e para a gratidão pelo amor que lhe fora dado. Lido ao lado de O problema do sofrimento (The Problem of Pain), mostra o mesmo autor vivendo aquilo sobre o que antes havia raciocinado.',
    },
    'suffering:cm:stott-cross': {
      lead: 'Sobre a cruz e o problema do sofrimento',
      text: 'No capítulo final de A cruz de Cristo (The Cross of Christ), “Suffering and Glory”, Stott enfrenta o desafio do mal e da dor no mundo de Deus. Ele admite que a cruz deixa sem resposta muitas perguntas sobre a dor, mas faz dela a lente pela qual os crentes devem ver todo sofrimento, porque ali Deus é visto não como um espectador distante, mas como alguém que entrou ele mesmo no sofrimento humano, na injustiça e na morte.',
    },
    'suffering:cm:keller-walking': {
      lead: 'Sobre atravessar o sofrimento, e não apenas explicá-lo',
      text: 'O livro de Keller reúne três abordagens que costumam ficar separadas: o problema filosófico do sofrimento, o ensino da Bíblia sobre ele e a experiência prática de atravessá-lo. Sua tese, apresentada na introdução, é que, ao longo da Bíblia, Deus não apenas dá alegria ao seu povo depois do sofrimento ou ao lado dele, mas a produz por meio do sofrimento — espelhando a cruz, onde o próprio sofrimento de Jesus foi o caminho pelo qual veio a salvação.',
    },
    'suffering:cm:piper-cancer': {
      lead: 'Sobre não desperdiçar a aflição',
      text: 'Escrito em fevereiro de 2006, na véspera de sua própria cirurgia de câncer de próstata, o artigo de Piper enumera dez maneiras pelas quais um crente pode desperdiçar uma doença. Entre elas: recusar-se a vê-la como designada por Deus para o bem do crente, buscar consolo nas estatísticas de sobrevivência em vez de em Deus (ele cita 2Co 1:9), evitar todo pensamento sobre a morte, medir a vitória por continuar vivo em vez de por ter Cristo como tesouro, isolar-se das outras pessoas, entristecer-se sem esperança e perder a oportunidade que ela oferece de dar testemunho de Cristo.',
    },
    'suffering:cm:wright-evil': {
      lead: 'Sobre o que Deus faz a respeito do mal',
      text: 'Wright argumenta que a cultura ocidental moderna se tornou ingênua em relação ao mal, tendendo a ignorá-lo até que ele bata à porta e então a reagir culpando os outros. Em vez de oferecer uma teodiceia filosófica, ele mostra como a Bíblia narra Deus lidando com o mal — julgando-o enquanto oferece graça por meio da história de Israel e, de modo culminante, na morte e ressurreição de Jesus, onde ele vê a resposta de Deus ao mal chegar ao seu ponto decisivo. Em seguida, exorta os cristãos a orar e a trabalhar pela justiça agora, antecipando um mundo livre do mal, e sobretudo a praticar o perdão.',
    },
  },
  sermons: {
    'suffering:sm:spurgeon-3244': {
      summary:
        'Pregado numa noite de quinta-feira no Metropolitan Tabernacle, o sermão primeiro insiste que Paulo não era ingênuo, insensível nem descuidado em relação ao sofrimento, e depois argumenta que a aflição é leve por comparação — com os objetivos e o grande motivo do serviço cristão, com os sofrimentos dos outros, com o que merecemos, com os sofrimentos de Cristo e com as bênçãos de que os crentes já desfrutam. Acrescenta que ela se torna leve à medida que os crentes experimentam a graça sustentadora de Deus e veem o crescimento na graça a que ela conduz, e, por fim, que é leve em comparação com a glória que em breve será revelada.',
    },
    'suffering:sm:spurgeon-35': {
      summary:
        'Um sermão do início do ministério de Spurgeon sobre a fornalha da aflição (expressão da KJV em Is 48:10). Spurgeon enfatiza que o amor de Deus não muda na fornalha, depois dá razões pelas quais os crentes são provados — todas as coisas preciosas são testadas, e o sofrimento os torna semelhantes a Cristo — e descreve os benefícios da fornalha, a começar pela purificação.',
    },
    'suffering:sm:keller-2004': {
      summary:
        'Keller apresenta a esperança cristã como uma confiança firme quanto ao futuro final do crente com Deus na nova criação, uma confiança que muda a maneira de enfrentar o sofrimento e a decepção. A partir de 2 Coríntios, faz então três observações sobre o sofrimento: ninguém escapa dele, ele tem um padrão e ele tem um futuro.',
    },
  },
  verseNotes: {
    '2CO.4.7': [
      'Este tesouro é a luz de 4:6 — o conhecimento da glória de Deus na face de Cristo. Paulo diz que ele é levado em vasos de barro: corpos e ministérios humanos frágeis e comuns. A razão vem logo em seguida: para que a excelência do poder se veja como de Deus, e não nossa. Corinto era conhecida por suas lamparinas de terracota, o que torna especialmente concreta a imagem da luz dentro de um vaso.',
    ],
    '2CO.4.8': [
      'Os dois primeiros dos quatro contrastes: pressionados por todos os lados, mas não esmagados; perplexos, mas não desesperados. O primeiro particípio vem de θλίβω, o verbo por trás de θλῖψις (aflição) em 4:17. O segundo contraste é um trocadilho grego — sem saber o que fazer, mas não totalmente sem saída. Paulo admite pressão e confusão reais; o que ele nega é a derrota definitiva.',
    ],
    '2CO.4.9': [
      'Os dois últimos contrastes: perseguição sem abandono, ser derrubado sem ser destruído. A palavra desamparados (ἐγκαταλείπω) é o mesmo verbo que Marcos usa para o clamor de Jesus na cruz. Paulo pode ser abandonado pelas pessoas, mas não por Deus — promessa que Hebreus 13:5 formula com o mesmo verbo.',
    ],
    '2CO.4.10': [
      'Paulo lê seus sofrimentos à luz da história de Jesus: leva sempre no corpo o morrer (νέκρωσις) de Jesus, para que também a vida de Jesus se manifeste ali. A exposição diária ao perigo é uma espécie de morte contínua; sua sobrevivência e sua perseverança exibem o Cristo ressuscitado. Isso é união com Cristo, e não um acréscimo à morte expiatória de Cristo.',
    ],
    '2CO.4.11': [
      'O versículo 11 reafirma o versículo 10 de forma mais direta: ainda vivos, Paulo e seus companheiros estão sendo continuamente entregues à morte por causa de Jesus. O propósito é o mesmo, agora com um adjetivo revelador — a vida de Jesus manifestada numa carne mortal. A vida da ressurreição se mostra justamente naquilo que está morrendo.',
    ],
    '2CO.4.12': [
      'A morte opera no apóstolo; a vida, nos coríntios. Os sofrimentos de Paulo não são assunto privado; servem à igreja, porque, por meio de sua exposição ao perigo, o evangelho alcança e fortalece outras pessoas. As notas da Tyndale ligam isto a Colossenses 1:24, onde Paulo fala de sofrer por amor do corpo de Cristo.',
    ],
    '2CO.4.13': [
      'Paulo cita o Salmo 116:10 em sua forma grega — cri, e por isso falei. No salmo, o autor continua dizendo que estava muito aflito; Paulo reivindica o mesmo espírito de fé, que continua crendo e continua falando sob pressão. As notas da Tyndale chamam essa fé de segredo da resiliência de Paulo.',
    ],
    '2CO.4.14': [
      'O conteúdo da fé de Paulo: o Deus que ressuscitou Jesus também ressuscitará Paulo e o apresentará, junto com os coríntios, em sua presença. A ressurreição é o fundamento da perseverança. O sofrimento não é o último capítulo, porque o túmulo de Jesus também não foi.',
    ],
    '2CO.4.15': [
      'Paulo insiste que tudo o que ele suporta é para o benefício dos coríntios. Suas dificuldades servem a uma corrente de graça: a graça alcançando mais pessoas, gerando mais ação de graças, para a glória de Deus. O sofrimento no ministério está inserido no propósito de Deus de multiplicar o louvor.',
    ],
    '2CO.4.16': [
      'Paulo repete as palavras de 4:1 — não desanimamos —, de modo que elas emolduram a maior parte do capítulo. Enquanto o homem exterior se desgasta com a idade e as dificuldades, o interior se renova a cada dia. As notas da Tyndale observam que Paulo estava desgastado física e emocionalmente, mas seu espírito estava sendo revigorado pelo poder de Deus. A renovação é diária, não de uma vez por todas.',
    ],
    '2CO.4.17': [
      'Paulo chama a aflição presente de leve e momentânea, e diz que ela está produzindo um peso eterno de glória, acima de toda comparação. Ele emparelha opostos — leveza contra peso, momentâneo contra eterno, aflição contra glória — e redobra o superlativo (literalmente de excesso em excesso). Não está chamando seus sofrimentos de triviais (veja 11:23–29); está pesando-os contra aquilo que eles estão produzindo. Alguns intérpretes ouvem um eco hebraico, já que kavod (glória) se relaciona com uma raiz que significa pesado, mas isso continua sendo uma sugestão.',
    ],
    '2CO.4.18': [
      'Paulo mantém o olhar no invisível, e não no visível, porque o que se vê é temporário e o que não se vê dura para sempre. O verbo (σκοπέω) significa olhar atentamente, manter a atenção fixa em algo. As notas da Tyndale o dizem de modo simples: olhar só para os problemas presentes nos faz desfalecer, mas ver a vida à luz da realidade eterna mostra que os problemas passarão.',
    ],
  },
  concepts: {
    'suffering:c:why-god-allows': {
      label: 'Por que Deus permite o sofrimento',
      aliases: [
        'por que deus permite o sofrimento',
        'por que deus permite o sofrimento?',
        'por que deus permite o mal',
        'por que deus permite o mal?',
        'por que deus deixa coisas ruins acontecerem',
        'por que coisas ruins acontecem',
        'por que acontecem coisas ruins',
        'problema do mal',
        'o problema do mal',
        'problema da dor',
        'teodiceia',
        'teodiceias',
        'se deus é bom',
        'se deus é bom por que existe o mal',
        'por que o sofrimento',
        'por que eu',
        'livre-arbítrio',
        'livre arbítrio',
        'defesa do livre-arbítrio',
        'formação da alma',
        'privação',
        'privação do bem',
        'deus permite o mal',
        'deus é o autor do mal',
        'deus é responsável pelo mal',
        'deus controla o mal',
        'soberania e o mal',
        'mera permissão',
        'visão católica do sofrimento',
        'visão wesleyana do sofrimento',
        'visão arminiana do sofrimento',
        'visão reformada do sofrimento',
        'visão ortodoxa do sofrimento',
      ],
      answer:
        'A Escritura não dá uma resposta única e arrumada, mas oferece verdades firmes: Deus é bom e soberano, o pecado e a morte entraram em seu mundo bom pela rebelião humana, o sofrimento nem sempre é castigo, e Deus entrou em nosso sofrimento em Cristo e lhe porá fim. Os cristãos têm explicado de maneiras diferentes por que Deus permite o mal — o bem que, segundo Agostinho, Deus tira do mal, a ênfase irineana no crescimento, a insistência reformada nos propósitos soberanos de Deus, a ênfase católica e wesleyana na liberdade que Deus deu às suas criaturas, a defesa do livre-arbítrio e o foco ortodoxo na vitória de Cristo sobre a morte —, e a seção de Teologia apresenta essas posições lado a lado, inclusive onde as tradições realmente divergem.',
    },
    'suffering:c:affliction': {
      label: 'Aflição (θλῖψις)',
      aliases: [
        'aflição',
        'aflições',
        'aflito',
        'aflitos',
        'afligido',
        'tribulação',
        'tribulações',
        'angústia',
        'problemas',
        'dificuldades',
        'pressionados',
        'atribulados',
        'pressão',
        'leve aflição',
        'aflição momentânea',
        'leve e momentânea aflição',
        'o que significa aflição',
        'thlipsis',
        'θλῖψις',
        'θλιψις',
        'thlibo',
        'θλίβω',
      ],
      answer:
        'A palavra grega por trás de aflição em 4:17 é θλῖψις (thlipsis, Strong G2347), literalmente pressão e, em sentido figurado, aflição ou angústia. Pela nossa contagem, aparece 45 vezes no Novo Testamento — 9 delas em 2 Coríntios, mais do que em qualquer outro livro —, e seu verbo cognato abre a lista de adversidades em 4:8 (pressionados, atribulados). Paulo só chama essa aflição de leve e momentânea porque a pesa contra um peso eterno de glória.',
    },
    'suffering:c:jars-of-clay': {
      label: 'Vasos de barro',
      aliases: [
        'vasos de barro',
        'vaso de barro',
        'vasos de argila',
        'jarros de barro',
        'tesouro',
        'este tesouro',
        'tesouro em vasos de barro',
        'o que são vasos de barro',
        'o que significa vasos de barro',
        'fraqueza',
        'frágil',
        'fragilidade',
        'cerâmica',
        'ostrakinos',
        'ὀστράκινος',
      ],
      answer:
        'Em 4:7 o tesouro é a luz do evangelho de 4:6, e os vasos de barro (ὀστράκινος, de barro) são os frágeis corpos e ministérios humanos. Paulo diz que Deus dispôs as coisas assim para que a excelência do poder fosse claramente de Deus, e não nossa. Corinto era famosa por suas lamparinas de terracota, e tesouros eram muitas vezes guardados em vasos de barro; por isso a imagem era vívida. Comentaristas mais antigos também sugeriram uma alusão aos cântaros de Gideão, embora Paulo não o diga.',
    },
    'suffering:c:lament': {
      label: 'O lamento e o “até quando?”',
      aliases: [
        'lamento',
        'lamentos',
        'lamentar',
        'lamentação',
        'até quando',
        'até quando senhor',
        'até quando, senhor',
        'queixa',
        'queixar-se a deus',
        'reclamar com deus',
        'posso ficar com raiva de deus',
        'posso ficar irado com deus',
        'raiva de deus',
        'salmo 13',
        'salmo 88',
        'lamentações',
        'habacuque',
        'ad anah',
        'עַד־אָנָה',
        'luto',
        'chorar',
      ],
      answer:
        'O lamento é a oração que leva a Deus a dor, o protesto e as perguntas. O até quando da Bíblia (em hebraico עַד־אָנָה, literalmente até onde?) aparece quatro vezes só em Salmos 13:1–2, e o Salmo 88 chega a terminar nas trevas — e, no entanto, ambos se dirigem a Deus. A Escritura trata a queixa honesta como uma forma de fé, e o próprio Jesus orou um lamento na cruz.',
    },
    'suffering:c:despair': {
      label: 'Perplexos, mas não desesperados',
      aliases: [
        'desespero',
        'desesperado',
        'desesperados',
        'não desesperados',
        'perplexo',
        'perplexos',
        'sem esperança',
        'desesperança',
        'depressão',
        'esmagado',
        'esmagados',
        'perdi a esperança',
        'perder a esperança de viver',
        'exaporeo',
        'ἐξαπορέω',
        'aporeo',
        'ἀπορέω',
      ],
      answer:
        'Em 4:8 Paulo diz que está perplexo (ἀπορέω, sem saber o que fazer), mas não desesperado (ἐξαπορέω, totalmente sem saída) — um trocadilho grego. O segundo verbo ocorre só mais uma vez no Novo Testamento, em 1:8, onde Paulo admite que na Ásia chegaram a perder a esperança até de viver. Assim, o não desesperados não é a pretensão de uma calma constante; é o testemunho de que o desespero não teve a última palavra, porque aprenderam a confiar no Deus que ressuscita os mortos.',
    },
    'suffering:c:lose-heart': {
      label: 'Não desanimar',
      aliases: [
        'desanimar',
        'desânimo',
        'desanimado',
        'não desanimamos',
        'não desfalecemos',
        'desfalecer',
        'perder o ânimo',
        'desistir',
        'vontade de desistir',
        'perseverar',
        'ekkakeo',
        'ἐκκακέω',
        'enkakeo',
        'ἐγκακέω',
        'renovado dia a dia',
        'se renova a cada dia',
        'homem interior',
        'homem exterior',
        'ser interior',
      ],
      answer:
        'Não desanimamos (ἐκκακέω, G1573) emoldura a maior parte de 2 Coríntios 4, aparecendo em 4:1 e 4:16. As razões de Paulo são a misericórdia de Deus ao chamá-lo (4:1), a renovação diária do homem interior mesmo enquanto o exterior se desgasta (4:16) e a glória eterna que supera a aflição presente (4:17). O mesmo verbo aparece no chamado de Jesus para orar sempre e não desanimar (Lc 18:1).',
    },
    'suffering:c:weight-of-glory': {
      label: 'O peso de glória',
      aliases: [
        'peso de glória',
        'peso eterno de glória',
        'eterno peso de glória',
        'glória',
        'peso',
        'baros',
        'βάρος',
        'kavod',
        'kabod',
        'כָּבוֹד',
        'céu',
        'eterno',
        'invisível',
        'o que não se vê',
        'as coisas invisíveis',
        'fixar os olhos',
      ],
      answer:
        'Em 4:17 Paulo contrapõe a leveza da aflição presente a um peso (βάρος) eterno de glória, de excesso em excesso. Uma antiga linha de interpretação, registrada na edição da Calvin Translation Society, ouve aqui o hebraico kavod (glória), ligado a uma raiz que significa pesado — uma sugestão atraente, mas não comprovada. O ponto é claro de qualquer forma: o que é invisível e eterno pesa mais do que o que é visível e temporário (4:18).',
    },
    'suffering:c:death-and-life': {
      label: 'Levar consigo a morte de Jesus',
      aliases: [
        'morte de jesus',
        'o morrer de jesus',
        'mortificação do senhor jesus',
        'vida de jesus',
        'união com cristo',
        'comunhão dos seus sofrimentos',
        'participar dos sofrimentos de cristo',
        'sofrer com cristo',
        'nekrosis',
        'νέκρωσις',
        'corpo mortal',
        'carne mortal',
        'a morte opera em nós',
        'colossenses 1:24',
        'o que falta das aflições de cristo',
        'sofrimento redentor',
        'salvifici doloris',
      ],
      answer:
        'Paulo descreve seus sofrimentos como levar consigo o morrer (νέκρωσις) de Jesus, para que a vida de Jesus se manifeste em seu corpo mortal (4:10–11). É união com Cristo: os crentes participam do padrão da sua morte e do poder da sua ressurreição (Fp 3:10; 1Pe 4:13). Os cristãos concordam que isso nada acrescenta à sua obra expiatória única — como dizem as notas da Tyndale sobre Colossenses 1:24, o sofrimento redentor de Cristo é único e está consumado —, embora as tradições descrevam de modos diferentes a participação dos crentes nos seus sofrimentos: Calvino falava de Cristo sofrendo em seus membros para fortalecer a igreja, ao passo que o ensino católico (Salvifici Doloris) fala dos crentes participando do sofrimento redentor de Cristo.',
    },
    'suffering:c:punishment': {
      label: 'O sofrimento é castigo?',
      aliases: [
        'castigo',
        'punição',
        'castigado',
        'deus está me castigando',
        'deus está me punindo',
        'eu mereci isso',
        'mereci isso',
        'merecer',
        'carma',
        'karma',
        'retribuição',
        'quem pecou',
        'amigos de jó',
        'torre de siloé',
        'cego de nascença',
        'nasceu cego',
        'coisas ruins acontecem com pessoas boas',
        'por que coisas ruins acontecem com pessoas boas',
      ],
      answer:
        'A Escritura afirma que o pecado tem consequências, mas nega repetidamente que toda calamidade seja um veredito sobre suas vítimas. Os amigos de Jó insistiam que seu sofrimento tinha de ser castigo, e o livro os desmente; Jesus disse aos discípulos que a cegueira de um homem não fora causada por pecado dele nem de seus pais (Jo 9:3), e afirmou que as vítimas de Pilatos e da torre de Siloé não eram mais pecadoras do que as outras (Lc 13:1–5).',
    },
    'suffering:c:purpose': {
      label: 'Os propósitos de Deus no sofrimento',
      aliases: [
        'propósito',
        'propósito do sofrimento',
        'o sofrimento tem propósito',
        'o sofrimento tem um propósito',
        'para que serve o sofrimento',
        'o que deus está fazendo',
        'refinar',
        'refino',
        'refinado',
        'fornalha',
        'fornalha da aflição',
        'perseverança',
        'caráter',
        'disciplina',
        'provações',
        'provação',
        'prova',
        'provado',
        'produz',
        'deus o encaminhou para o bem',
        'deus tornou em bem',
        'katergazomai',
        'κατεργάζομαι',
      ],
      answer:
        'O Novo Testamento diz repetidas vezes que a aflição produz algo. Romanos 5:3, Tiago 1:3 e 2 Coríntios 4:17 usam o mesmo verbo grego (κατεργάζομαι): o sofrimento produz perseverança e esperança, a prova da fé produz constância, e a aflição presente está produzindo um peso eterno de glória. As palavras de José — vós intentastes o mal, mas Deus o encaminhou para o bem (Gn 50:20) — mostram que o propósito de Deus não torna bom o mal; ele o domina e o reverte.',
    },
    'suffering:c:suffering-god': {
      label: 'Deus conosco no sofrimento',
      aliases: [
        'deus sofre',
        'deus sofre?',
        'deus pode sofrer',
        'um deus que sofre',
        'impassibilidade',
        'deus é impassível',
        'deus sente dor',
        'onde está deus',
        'onde estava deus',
        'deus conosco',
        'emanuel',
        'desamparado',
        'por que me desamparaste',
        'deus meu deus meu',
        'deus meu, deus meu',
        'teologia da cruz',
        'cruz',
        'homem de dores',
        'compadece',
        'se compadece das nossas fraquezas',
      ],
      answer:
        'A resposta mais profunda da Escritura ao sofrimento é que Deus entrou nele. O Servo de Isaías é um homem de dores, Jesus clama na cruz com as palavras do Salmo 22, e Hebreus diz que ele se compadece das nossas fraquezas. Em 4:9 Paulo é perseguido, mas não desamparado — usando o mesmo verbo do clamor de abandono de Jesus. A teologia da cruz de Lutero e o capítulo de John Stott sobre o sofrimento argumentam, ambos, que a cruz é o lugar onde Deus é verdadeiramente visto. A teologia cristã clássica situa esse sofrimento no Filho encarnado, que sofreu em sua natureza humana — a Confissão de Fé de Westminster, por exemplo, confessa que Deus não tem corpo, partes nem paixões (2.1) —, e até que ponto se pode falar de sofrimento no próprio Deus é assunto debatido entre os teólogos.',
    },
    'suffering:c:hope': {
      label: 'Esperança para além do sofrimento',
      aliases: [
        'esperança',
        'não haverá mais lágrimas',
        'enxugará toda lágrima',
        'toda lágrima',
        'nova criação',
        'novos céus e nova terra',
        'ressurreição',
        'isso vai acabar',
        'o sofrimento vai acabar',
        'o sofrimento vai acabar?',
        'vida após a morte',
        'vida eterna',
        'glória futura',
        'apocalipse 21',
      ],
      answer:
        'A esperança cristã não nega a dor presente; ela a pesa. Paulo fundamenta a perseverança na ressurreição (2Co 4:14) e num peso eterno de glória (4:17), Romanos 8:18 diz que os sofrimentos presentes não se comparam com a glória vindoura, e Apocalipse 21 retrata Deus habitando com o seu povo, toda lágrima enxugada e a morte extinta. A Bíblia não termina com uma explicação do sofrimento, mas com o seu fim.',
    },
  },
};

export default overlay;
