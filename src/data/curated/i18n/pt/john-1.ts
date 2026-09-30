/**
 * Português (Brasil) — tradução do estudo curado “João 1” (src/data/curated/studies/john-1.ts).
 *
 * Citações bíblicas entre aspas seguem a Bíblia Livre (BLIVRE), versão padrão em português;
 * quando outra redação é discutida, a versão é nomeada. Âncoras conferidas com o texto de
 * BLIVRE, NBV e BPM (bible.helloao.org). Citações verificadas não são reescritas: recebem
 * apenas uma tradução livre (quoteTranslation).
 */
import type { StudyOverlay } from '../types';

const jv = (verse: number) => ({ book: 'JHN', chapter: 1, verse });

const overlay: StudyOverlay = {
  studyId: 'john-1',
  locale: 'pt',
  title: 'João 1',
  subtitle: 'A Palavra se fez carne',
  summary:
    'João 1 abre o Quarto Evangelho recuando até antes da criação: a Palavra que estava junto de Deus e era Deus, por meio da qual todas as coisas foram feitas, “se fez carne, e habitou entre nós”. Ecoando Gênesis 1 e a memória de Israel sobre o tabernáculo e o Sinai, o prólogo (1:1–18) apresenta Jesus como aquele em quem a glória, a graça e a verdade de Deus finalmente se veem, e que dá a conhecer o Pai invisível. O restante do capítulo volta-se para a história: João Batista dá testemunho e aponta para “o Cordeiro de Deus, que tira o pecado do mundo”, e os primeiros discípulos começam a seguir Jesus, confessando-o com um título após outro — Rabi, Messias, Filho de Deus, Rei de Israel — até que Jesus lhes promete o céu aberto sobre o Filho do Homem.',
  opening:
    'Boas-vindas a João 1 — um dos capítulos mais amados e mais profundos da Bíblia. Podemos começar “No princípio”, com a Palavra, ouvir os ecos de Gênesis e de Êxodo, examinar de perto algumas palavras gregas e depois acompanhar os primeiros discípulos quando atendem ao convite “Vinde, e vede-o”. Pergunte sobre qualquer versículo, palavra ou voz da história da igreja, e o estudo ao lado acompanhará você.',
  matchTopics: [
    'joão 1',
    'joao 1',
    'jo 1',
    'joão capítulo 1',
    'joao capitulo 1',
    'evangelho de joão 1',
    'a palavra se fez carne',
    'o verbo se fez carne',
    'no princípio era a palavra',
    'no principio era a palavra',
    'no princípio era o verbo',
    'no principio era o verbo',
    'o verbo',
    'prólogo de joão',
    'prologo de joao',
    'o prólogo de joão',
    'cordeiro de deus',
    'encarnação',
    'encarnacao',
  ],
  suggestedQuestions: [
    'Qual é a palavra grega por trás de “Palavra”?',
    'Como João 1 se relaciona com Gênesis?',
    'Explique o versículo 14 com mais detalhes.',
    'Como o público original teria entendido “Logos”?',
    'Existem interpretações diferentes de “unigênito”?',
    'O que Agostinho disse sobre esta passagem?',
    'Por que Jesus é chamado de Cordeiro de Deus?',
    'O que Tim Keller disse sobre isso?',
    'O que este capítulo ensina sobre quem é Jesus?',
  ],

  /* ------------------------------------------------------------------ */
  /* Palavras-chave                                                      */
  /* ------------------------------------------------------------------ */
  keyWords: {
    'john-1:kw:logos': {
      english: 'Palavra (Verbo)',
      grammar: 'Substantivo, nominativo singular masculino, com artigo (ὁ λόγος) — forma em 1:1',
      basicMeaning: 'palavra',
      semanticRange: [
        'palavra que expressa um pensamento ou uma ideia',
        'dito, declaração ou mensagem — sobretudo “a palavra de Deus”',
        'fala, ensino, relato ou narrativa',
        'razão; conta ou prestação de contas',
        'a Palavra divina (o Logos): João 1:1, 14; 1 João 1:1; Apocalipse 19:13',
      ],
      notableNotes: [
        'No Antigo Testamento grego (Sl 32:6 LXX), os céus foram feitos pela palavra — τῷ λόγῳ — do Senhor: a palavra criadora que João ecoa em 1:3.',
        'A “Palavra da vida”, que era “desde o princípio” e foi vista e tocada — o prólogo paralelo da mesma tradição.',
        'O cavaleiro que retorna é chamado “Palavra de Deus”.',
        '“A palavra de Deus é viva e eficaz” — o sentido comum da mensagem falada de Deus, sobre o qual se constrói o uso pessoal que João faz do termo.',
      ],
      significance:
        'João só menciona o nome de Jesus em 1:17; ele começa com “a Palavra”. Para os leitores do Antigo Testamento grego, λόγος era a tradução habitual do hebraico dāvār — a palavra pela qual Deus cria (Sl 33:6), fala por meio dos profetas e realiza a sua vontade. Os leitores gregos ouviam nela a ordem racional por trás do mundo. João reúne as duas associações e então diz o que nenhuma delas esperava: essa Palavra é pessoal, estava “junto de Deus” e “era Deus”, e “se fez carne” (1:14). A Palavra é a autoexpressão de Deus — por isso o prólogo termina com o Filho que “o declarou” (1:18).',
      caution:
        'Uma única palavra não carrega a doutrina inteira. Na maioria de seus 330 usos no Novo Testamento (contagem do TAGNT do STEPBible; 40 deles em João), λόγος significa simplesmente palavra, mensagem ou relato. Seu sentido em 1:1 vem das frases de João — do que ele diz que a Palavra era e fez —, e não apenas do dicionário.',
      anchors: [
        { verse: jv(1), phrases: { BLIVRE: 'Palavra', NBV: 'Palavra', BPM: 'Palavra' } },
        { verse: jv(14), phrases: { BLIVRE: 'Palavra', NBV: 'Palavra', BPM: 'Palavra' } },
      ],
    },
    'john-1:kw:arche': {
      english: 'princípio',
      grammar: 'Substantivo, dativo singular feminino, sem artigo (ἐν ἀρχῇ, “em [o] princípio”) — forma em 1:1',
      basicMeaning: 'princípio, começo',
      semanticRange: [
        'princípio, origem — em sentido absoluto, o princípio de todas as coisas',
        'o primeiro princípio ou fonte (dito de Cristo, Ap 3:14; Cl 1:18)',
        'um começo relativo (“princípio de sinais”, Jo 2:11)',
        'domínio, soberania; (no plural) governantes e autoridades',
      ],
      notableNotes: [
        'O Antigo Testamento grego começa com as mesmas duas palavras, Ἐν ἀρχῇ — as primeiras palavras de João ecoam Gênesis de propósito.',
        '“O que era desde o princípio” (ἀπ’ ἀρχῆς) — a abertura paralela da carta joanina.',
        'Cristo é “o princípio e o primogênito dentre os mortos”.',
        'Em Caná, Jesus realiza o “princípio de sinais” (ἀρχή) — um começo relativo, o início de sua revelação pública.',
      ],
      significance:
        'Ao abrir com as primeiras palavras da Bíblia grega, João convida seus leitores a reler Gênesis 1 com Jesus em vista. Mas repare no verbo: Gênesis diz que no princípio Deus criou; João diz que no princípio a Palavra já “era”. Quando o princípio começou, a Palavra não veio a existir — ela já estava lá. O Evangelho de João se apresenta, assim, como um novo Gênesis: aquele por meio de quem o mundo foi feito vem agora fazer novas as pessoas (1:12–13).',
      caution:
        'ἀρχή não significa, por si só, “eternidade”; significa princípio. A eternidade da Palavra decorre da combinação de ἀρχή com o verbo “era” (ἦν) e de 1:3, que coloca tudo o que veio a existir do outro lado da linha.',
      anchors: [
        { verse: jv(1), phrases: { BLIVRE: 'No princípio', NBV: 'No princípio', BPM: 'No início' } },
        { verse: jv(2), phrases: { BLIVRE: 'no princípio', NBV: 'no princípio', BPM: 'no início' } },
      ],
    },
    'john-1:kw:theos': {
      english: 'Deus (“a Palavra era Deus”)',
      grammar: 'Substantivo, nominativo singular masculino — predicativo colocado antes do verbo e sem artigo (θεὸς ἦν ὁ λόγος) — 1:1c',
      basicMeaning: 'Deus; um deus',
      semanticRange: [
        'o único Deus verdadeiro (em geral com artigo, ὁ θεός)',
        'Deus, sem artigo — sobretudo depois de preposições e como predicativo (o TBESG cita João 1:1)',
        'um deus ou divindade (em contextos politeístas)',
      ],
      notableNotes: [
        'Em 1:1b, “junto de Deus” tem artigo (πρὸς τὸν θεόν); em 1:1c, “era Deus” não tem (θεὸς ἦν ὁ λόγος).',
        'Os manuscritos mais antigos trazem μονογενὴς θεός, “o único, [ele mesmo] Deus”; os posteriores trazem “Filho”.',
        'Tomé confessa: “Senhor meu, e Deus meu!” — o Evangelho termina onde começou.',
      ],
      significance:
        'A ordem das palavras e o artigo importam aqui. O sujeito é ὁ λόγος (“a Palavra”, com artigo); θεός (“Deus”) vem primeiro, para dar ênfase, e não tem artigo. Se João tivesse escrito ὁ θεὸς ἦν ὁ λόγος, teria identificado a Palavra com aquele a quem acabara de chamar “Deus” (o Pai) — contradizendo “a Palavra estava junto de Deus”. Como argumentou Philip Harner, a construção é qualitativa: a Palavra tem a própria natureza de Deus — verdadeiramente Deus, não um ser divino inferior, e não o Pai.',
      caution:
        'A ausência do artigo não torna θεός indefinido. A Tradução do Novo Mundo verte 1:1c como se a Palavra fosse “um deus” (em inglês, “the Word was a god”), mas o grego omite regularmente o artigo com Deus (por exemplo, 1:6 e 1:18), e o contexto exclui um “deus” inferior e criado: tudo o que foi feito foi feito por meio da Palavra (1:3). Harner, cujo estudo é frequentemente citado a respeito deste versículo, concluiu ele mesmo que a Palavra partilha a mesma natureza de Deus e rejeitou a tradução “um deus”.',
      anchors: [{ verse: jv(1), phrases: { BLIVRE: 'era Deus', NBV: 'era Deus', BPM: 'era Deus' } }],
    },
    'john-1:kw:phos': {
      english: 'luz',
      grammar: 'Substantivo, nominativo singular neutro (τὸ φῶς) — forma em 1:4',
      basicMeaning: 'luz',
      semanticRange: [
        'luz física (o oposto das trevas, σκότος / σκοτία)',
        'metaforicamente, de Deus (1 João 1:5)',
        'a verdade espiritual e seu efeito na vida humana (João 1:4–5; 3:19–21)',
        'daquele de quem a verdade irradia — sobretudo Cristo, “a luz do mundo” (8:12; 9:5)',
      ],
      notableNotes: [
        '“Haja luz” — a primeira palavra da criação, ecoada em João 1:4–5 (LXX γενηθήτω φῶς).',
        'Citando Isaías 9:2: o povo sentado em trevas “viu uma grande luz” — o que se cumpre no ministério de Jesus.',
        '“Eu sou a luz do mundo” — a imagem do prólogo torna-se a reivindicação do próprio Jesus.',
        '“Deus é luz, e não há nele nada de trevas.”',
      ],
      significance:
        'Luz e trevas (σκοτία, duas vezes em 1:5) emolduram o drama do prólogo. Em Gênesis, a luz é o primeiro dom criador de Deus; em João, a vida da Palavra “era a luz dos seres humanos” (1:4), continua a brilhar numa escuridão que não consegue apagá-la (1:5) e é “a luz verdadeira” que vem ao mundo (1:9). Como observa D. A. Carson, uma primeira leitura ouve aqui a luz da criação, ao passo que o restante do Evangelho acrescenta a luz da revelação e da exposição moral (3:19–21) — João quer dizer as duas coisas. φῶς aparece 23 vezes em João (73 no Novo Testamento).',
      caution:
        '“Luz” é uma imagem, não um termo técnico: em João ela transita entre criação, revelação e exposição moral, e o contexto decide qual sentido está em primeiro plano em cada versículo.',
      anchors: [
        { verse: jv(4), phrases: { BLIVRE: 'a luz dos seres humanos', NBV: 'a luz de toda a humanidade', BPM: 'a luz dos homens' } },
        { verse: jv(9), phrases: { BLIVRE: 'a luz verdadeira', NBV: 'a verdadeira luz', BPM: 'A verdadeira luz' } },
      ],
    },
    'john-1:kw:katalambano': {
      english: 'vencer / compreender',
      grammar: 'Verbo, aoristo segundo ativo indicativo, terceira pessoa do singular (κατέλαβεν) — 1:5',
      basicMeaning: 'agarrar, apanhar',
      semanticRange: [
        'apoderar-se, agarrar, tomar posse de (Fp 3:12)',
        'alcançar, surpreender — dito das trevas ou do dia (João 12:35; 1Ts 5:4)',
        'apreender mentalmente, compreender (em geral na voz média: Ef 3:18; At 4:13)',
      ],
      notableNotes: [
        'O único outro uso em João (à parte o trecho disputado de 8:3–4): “para que as trevas vos não apanhem” — de novo as trevas como sujeito hostil.',
        'Na voz média: “compreender, com todos os santos, qual é a largura, comprimento, profundidade, e altura” — o sentido mental.',
        '“alcançar aquilo para o qual eu também fui alcançado por Cristo Jesus” — o sentido de agarrar.',
      ],
      significance:
        'O verbo que a BSB traduz por “has not overcome it” (“não a venceram”) tem, notoriamente, dois gumes. A KJV (“comprehended it not”), como a Bíblia Livre (“não a compreenderam”), entende-o como compreensão; a BSB e a WEB — e, em português, a BPM (“não a superou”) e a NBV (“nunca pode ser apagada”) — entendem-no como ataque hostil. O verbo em 1:5 está na voz ativa (o sentido mental costuma vir na voz média), o léxico classifica este versículo em “alcançar”, e o único outro uso em João (12:35, à parte o disputado 8:3–4) mostra as trevas perseguindo as pessoas — o que se ajusta a “vencer”, da BSB e da WEB (a nota da WEB explica o verbo como agarrar um inimigo para derrotá-lo), e à conclusão das notas da Tyndale de que, em João, a palavra indica hostilidade. Seja como for, o versículo antecipa todo o Evangelho: a Luz encontra rejeição, mas as trevas não têm a última palavra. Veja o painel de perspectivas para as duas leituras.',
      caution:
        'O verbo ocorre 13 vezes no texto Nestle–Aland (15, se contado o disputado João 8:3–4). Com tão poucos usos, e com sentidos que se sobrepõem, não é possível ter certeza aqui.',
      anchors: [{ verse: jv(5), phrases: { BLIVRE: 'não a compreenderam', NBV: 'nunca pode ser apagada', BPM: 'não a superou' } }],
    },
    'john-1:kw:skenoo': {
      english: 'habitou / armou sua tenda',
      grammar: 'Verbo, aoristo ativo indicativo, terceira pessoa do singular (ἐσκήνωσεν) — 1:14',
      basicMeaning: 'habitar',
      semanticRange: ['ter a própria tenda (σκηνή), acampar', 'habitar, fixar residência (às vezes, de uma habitação temporária)'],
      notableNotes: [
        '“Eis que o tabernáculo de Deus está com os seres humanos; e com eles habitará” (σκηνή, σκηνώσει) — a promessa cumprida no fim.',
        '“aquele que está sentado sobre o trono armará sua tenda e habitará com eles.”',
        'Não o próprio verbo, mas o substantivo de que ele deriva: no Antigo Testamento grego, a glória (δόξα) do Senhor enche a σκηνή, o tabernáculo — o pano de fundo que João evoca.',
      ],
      significance:
        'σκηνόω deriva de σκηνή, a palavra da Bíblia grega para o tabernáculo, e no Antigo Testamento grego traduz sobretudo o hebraico shakan, “habitar”. Assim, “habitou entre nós” pode ser ouvido como “armou sua tenda” ou “tabernaculou entre nós”. João acrescenta de imediato: “vimos sua glória” (δόξα — a palavra que a Bíblia grega usou para a glória que encheu o tabernáculo). O Deus que outrora habitou no meio de Israel numa tenda agora habita entre nós na carne de Jesus. O verbo ocorre apenas cinco vezes no Novo Testamento: aqui e quatro vezes em Apocalipse.',
      caution:
        'O verbo não implica necessariamente que a humanidade de Jesus fosse temporária ou frágil; o sentido da alusão é a presença e a glória de Deus, como no tabernáculo — e não o tecido da tenda.',
      anchors: [{ verse: jv(14), phrases: { BLIVRE: 'habitou entre nós', NBV: 'morou aqui na terra entre nós', BPM: 'viveu entre nós' } }],
    },
    'john-1:kw:monogenes': {
      english: 'unigênito / único',
      grammar: 'Adjetivo, genitivo singular masculino (μονογενοῦς) em 1:14; nominativo (μονογενής) em 1:18',
      basicMeaning: 'único',
      semanticRange: [
        'único, unigênito — de um filho único ou de uma filha única (Lucas 7:12; 8:42; 9:38; o léxico do STEPBible também inclui aqui Hb 11:17)',
        'único, singular, sem igual (assim muitos léxicos modernos; é debatido se Isaque, em Hb 11:17, pertence a este sentido ou a “unigênito”)',
        'de Cristo, como o Filho único (João 1:14, 18; 3:16, 18; 1 João 4:9)',
      ],
      notableNotes: [
        '“deu o seu Filho unigênito” — a mesma palavra no versículo mais conhecido do Evangelho.',
        'Isaque é o μονογενής de Abraão, embora Abraão tivesse outro filho — um texto-chave no debate sobre o sentido da palavra.',
        'O “filho único” da viúva de Naim — o sentido familiar comum.',
        '“Deus enviou o seu Filho unigênito ao mundo, para que por meio dele vivamos.”',
      ],
      significance:
        'A declaração de João sobre a glória, em 1:14, é literalmente “glória como de um único da parte de um pai” (δόξαν ὡς μονογενοῦς παρὰ πατρός; a BSB supre “Filho”): a glória própria do Filho único que vem do Pai. Em 1:18, os manuscritos mais antigos trazem μονογενὴς θεός — “o único, [ele mesmo] Deus” —, enquanto os posteriores trazem “Filho”, seguidos pela KJV (“the only begotten Son”) e pela WEB (“the only born Son”). As traduções dividem-se entre “unigênito” (KJV, “only begotten”, seguindo o latim unigenitus) e “único” (BSB, “one and only”); o “only born” da WEB fica no meio. Em português, a Bíblia Livre diz “unigênito” (1:14, 18), enquanto a NBV e a BPM trazem “Filho único” e “único Filho”. A palavra ocorre 9 vezes no Novo Testamento, 4 delas em João.',
      caution:
        'Argumentar a partir das partes de uma palavra (μόνος + γένος) pode enganar nas duas direções: γένος pode significar “espécie” ou “descendência”. O uso e o contexto decidem. O painel de perspectivas apresenta as duas leituras; nenhum dos lados duvida de que Jesus é, de modo único, o Filho e plenamente Deus.',
      anchors: [
        { verse: jv(14), phrases: { BLIVRE: 'unigênito', NBV: 'Filho único', BPM: 'único Filho' } },
        { verse: jv(18), phrases: { BLIVRE: 'unigênito Filho', NBV: 'Filho único', BPM: 'único Filho' } },
      ],
    },
    'john-1:kw:charis': {
      english: 'graça',
      grammar:
        'Substantivo, genitivo singular feminino (χάριτος) em 1:14; em 1:16, χάριν ἀντὶ χάριτος — χάριν (acusativo) é o objeto de “recebemos”, e χάριτος (genitivo) segue a preposição ἀντί',
      basicMeaning: 'graça',
      semanticRange: [
        'graciosidade, encanto (Lucas 4:22; Cl 4:6)',
        'favor, benevolência — especialmente o favor livre e imerecido de Deus',
        'um dom ou prova de graça (João 1:16)',
        'agradecimento, gratidão',
      ],
      notableNotes: [
        '“Porque já conheceis a graça de nosso Senhor Jesus Cristo, que, sendo rico, por causa de vós se fez pobre” — a graça vista na encarnação.',
        '“se é pela graça, logo não é pelas obras” — o sentido paulino de um favor que não se pode conquistar.',
        '“Porque pela graça sois salvos, por meio da fé” — a palavra no centro do evangelho de Paulo.',
      ],
      significance:
        'χάρις aparece apenas quatro vezes no Evangelho de João, todas no prólogo (1:14; duas vezes em 1:16; 1:17) — John Piper observa que o Evangelho depois fala de verdade repetidas vezes, mas nunca mais de graça. “Cheio de graça e de verdade” descreve a glória vista em Jesus, e muitos intérpretes ouvem por trás disso a autodescrição de Deus a Moisés: “grande em benignidade e verdade” (Êx 34:6). Em 1:16, “graça por graça” (na BPM, “graça sobre graça”; literalmente, “graça em lugar de / por graça”, com ἀντί) foi lido como graça acumulada sobre graça, como a graça derramada sobre Cristo que flui para os crentes ou como a nova graça em Cristo que sucede a graça dada por meio de Moisés (1:17); Matthew Henry lista as três entre seis sentidos possíveis.',
      caution:
        'Convém não importar para João 1 todas as nuances paulinas de “graça”. Aqui a ênfase recai sobre a plenitude da generosa autodoação de Deus vista em Jesus, posta ao lado do dom da Lei por meio de Moisés — não sobre uma polêmica contra a Lei.',
      anchors: [
        { verse: jv(14), phrases: { BLIVRE: 'graça e de verdade', NBV: 'graça e de verdade', BPM: 'graça e de verdade' } },
        { verse: jv(16), phrases: { BLIVRE: 'graça por graça', NBV: 'dádiva sobre dádiva', BPM: 'graça sobre graça' } },
        { verse: jv(17), phrases: { BLIVRE: 'a graça e a verdade', NBV: 'a graça e a verdade', BPM: 'A graça e a verdade' } },
      ],
    },
    'john-1:kw:exegeomai': {
      english: 'declarou / deu a conhecer',
      grammar: 'Verbo, aoristo médio (depoente) indicativo, terceira pessoa do singular (ἐξηγήσατο) — 1:18',
      basicMeaning: 'contar, relatar',
      semanticRange: [
        'relatar, contar, narrar (Lucas 24:35; Atos 10:8; 15:12, 14; 21:19)',
        'dar a conhecer, declarar (Deus, em João 1:18)',
        'literalmente “conduzir, mostrar o caminho” (o primeiro sentido do léxico, mas não o modo como o Novo Testamento usa a palavra)',
      ],
      notableNotes: [
        'Os discípulos de Emaús “contaram as coisas que lhes aconteceram no caminho” — o sentido comum de relatar.',
        'Barnabé e Paulo “contavam quão grandes sinais e milagres Deus tinha feito”.',
        'Paulo “lhes contou em detalhes o que Deus tinha feito entre os gentios”.',
      ],
      significance:
        'Em seus outros cinco usos no Novo Testamento, este verbo significa relatar ou contar o que aconteceu. Em 1:18, seu objeto é o próprio Deus: o Filho, que está no seio do Pai, narrou Deus — contou-o numa vida humana. (A palavra “exegese” vem da mesma família grega.) Este é o clímax do prólogo: ninguém jamais viu a Deus, mas em Jesus o Deus invisível foi explicado de modo pleno e fiel.',
      caution:
        'O derivado em português é um recurso de memória, não uma definição: João não está dizendo que Jesus é um intérprete da Bíblia, mas que toda a sua pessoa e toda a sua vida são a autorrevelação de Deus.',
      anchors: [{ verse: jv(18), phrases: { BLIVRE: 'ele o declarou', NBV: 'o tornou conhecido', BPM: 'o declarou' } }],
    },
    'john-1:kw:amnos': {
      english: 'Cordeiro',
      grammar: 'Substantivo, nominativo singular masculino (ὁ ἀμνός) — 1:29, seguido do particípio presente ὁ αἴρων, “que tira”',
      basicMeaning: 'cordeiro',
      semanticRange: ['cordeiro (especialmente cordeiro sacrificial)', 'figuradamente, de Cristo (João 1:29, 36; Atos 8:32; 1Pe 1:19)'],
      notableNotes: [
        'O Antigo Testamento grego usa ἀμνός para o cordeiro que fica mudo diante do tosquiador, imagem do Servo — a mesma palavra de João 1:29. (O animal levado ao matadouro, no mesmo versículo, é um πρόβατον, uma ovelha.)',
        'O oficial etíope lê Isaías 53:7, e Filipe lhe fala de Jesus.',
        'Resgatados “pelo sangue precioso, como de um cordeiro sem falha e sem contaminação: o sangue de Cristo”.',
        'A oferta diária do templo, de dois cordeiros (ἀμνοί no Antigo Testamento grego), pela manhã e à tarde.',
      ],
      significance:
        'ἀμνός ocorre apenas quatro vezes no Novo Testamento, e todas as vezes aponta para Jesus. O anúncio do Batista concentra toda uma teologia numa única frase: este Cordeiro pertence a Deus — designado e providenciado por ele (compare Gn 22:8) —, e ele “tira” (no presente: é o que ele faz) “o pecado do mundo”, e não apenas o de Israel. A palavra grega liga-se mais diretamente a Isaías 53:7 e aos cordeiros diários do templo; o cordeiro da Páscoa (chamado πρόβατον no grego de Êxodo 12) entra pela moldura pascal mais ampla de João (19:14, 36).',
      caution:
        'Os estudiosos ponderam vários panos de fundo para “Cordeiro de Deus” (a Páscoa, o sacrifício diário, o Servo de Isaías). João pode ter em mente mais de um; é mais sábio deixar que se enriqueçam mutuamente do que forçar uma única fonte.',
      anchors: [
        { verse: jv(29), phrases: { BLIVRE: 'o Cordeiro de Deus', NBV: 'o Cordeiro de Deus', BPM: 'o Cordeiro de Deus' } },
        { verse: jv(36), phrases: { BLIVRE: 'o Cordeiro de Deus', NBV: 'o Cordeiro de Deus', BPM: 'o Cordeiro de Deus' } },
      ],
    },
  },

  /* ------------------------------------------------------------------ */
  /* Referências cruzadas                                                */
  /* ------------------------------------------------------------------ */
  crossReferences: {
    'john-1:xr:gen-1': {
      title: 'No princípio — um novo Gênesis',
      explanation:
        'As primeiras palavras de João, Ἐν ἀρχῇ (“No princípio”), são as mesmas duas palavras que abrem Gênesis no Antigo Testamento grego, e o eco se mantém. Em Gênesis, Deus fala e a criação passa a existir; em João, “foram feitas todas as coisas” por meio da Palavra (1:3). Gênesis vai das trevas sobre o abismo ao “Haja luz”; a Palavra de João é vida e “a luz dos seres humanos”, brilhando numa escuridão que não a venceu (1:4–5). João não substitui Gênesis, mas o lê com mais profundidade: a fala pela qual Deus criou era a Palavra que estava junto de Deus — e que agora vem trazer uma nova criação, dando aos que a recebem um nascimento “de Deus” (1:12–13). Lutero, remontando a abertura de João a Gênesis 1, chamou os livros de Moisés de “a verdadeira mina de ouro” da qual foi extraído o ensino do Novo Testamento sobre a divindade de Cristo.',
    },
    'john-1:xr:ps-33': {
      title: 'Pela palavra do SENHOR foram feitos os céus',
      explanation:
        'O Salmo 33 celebra a criação pela palavra: pela palavra do SENHOR foram feitos os céus, “Porque ele falou, e logo se fez” (Sl 33:6, 9). O Antigo Testamento grego (Sl 32:6) usa λόγος aqui. João toma essa conhecida confissão da palavra criadora de Deus e faz uma afirmação surpreendente a respeito dela: a Palavra por meio da qual “foram feitas todas as coisas” (1:3) não é apenas algo que Deus diz, mas alguém que “estava junto de Deus” e “era Deus”. A tradição judaica também continuou a refletir sobre este versículo — a Jewish Encyclopedia menciona um dito rabínico segundo o qual Deus criou o mundo por sua palavra, citando o Salmo 33:6.',
    },
    'john-1:xr:prov-8': {
      title: 'A Sabedoria ao lado do Criador',
      explanation:
        'Em Provérbios 8, a Sabedoria fala como alguém presente antes da criação — “Quando preparava os céus, ali eu estava”; “eu estava com ele” (8:27, 30). Escritos judaicos posteriores desenvolveram a imagem (Sabedoria de Salomão 9:1–2 associa a palavra e a sabedoria de Deus na criação), e muitos intérpretes a ouvem por trás da Palavra de João, que “estava junto de Deus” e por meio da qual todas as coisas foram feitas. O vínculo é temático, não uma equação, e exige cuidado. Provérbios é poesia que personifica um atributo de Deus, e no século IV os arianos argumentavam, a partir de 8:22 — onde a Septuaginta diz que o Senhor criou a Sabedoria (ἔκτισέν με; a Bíblia Livre traduz o hebraico por “me adquiriu”) —, que o Filho é uma criatura. Atanásio respondeu que, lido a respeito de Cristo, o versículo fala de sua humanidade encarnada, não de seu ser divino — e João 1:1–3 insiste em que a Palavra não foi feita.',
    },
    'john-1:xr:exod-33-34': {
      title: '“Rogo-te que me mostres tua glória” — o Sinai revisitado',
      explanation:
        'Vários fios de 1:14–18 remontam a Êxodo 33–34. Moisés pede: “Rogo-te que me mostres tua glória”; o SENHOR responde que ninguém pode ver o seu rosto e viver, e então passa diante dele proclamando-se “grande em benignidade e verdade” (34:6) — em hebraico, ḥesed e ʾemet. João responde: “vimos sua glória … cheio de graça e de verdade”; “a Lei foi dada por Moisés; a graça e a verdade foi feita por Jesus Cristo”; e “A Deus nunca ninguém o viu; o unigênito Filho, que está no seio do Pai, ele o declarou”. D. A. Carson, entre outros, ouve no par graça e verdade a tradução joanina de ḥesed e ʾemet, e John Piper também lê 1:17–18 à luz do pedido de Moisés em Êxodo 33–34. (O Antigo Testamento grego traduziu 34:6 por πολυέλεος καὶ ἀληθινός, muito compassivo e verdadeiro, sem χάρις, embora ἀληθινός pertença à mesma família de palavras que o ἀλήθεια de João; o vínculo, portanto, é sobretudo conceitual.) O ponto não é que faltasse graça no Sinai, mas que aquilo que Moisés vislumbrou da fenda da rocha agora se vê no rosto de Jesus.',
    },
    'john-1:xr:exod-40': {
      title: 'O tabernáculo cheio de glória',
      explanation:
        'João diz que a Palavra “habitou entre nós” — σκηνόω, armar uma tenda, de σκηνή, a palavra da Bíblia grega para o tabernáculo. No Sinai, Deus disse: “farão para mim um santuário, e eu habitarei entre eles” (Êx 25:8), e, quando o tabernáculo ficou pronto, “a glória do SENHOR encheu o tabernáculo” (40:34–35). João une as duas ideias numa só frase: a Palavra “habitou entre nós”, e “vimos sua glória”. A presença de Deus, antes concentrada numa tenda e depois num templo, está agora encarnada numa pessoa; no capítulo seguinte, Jesus fala de seu corpo como o templo (2:19–21). Spurgeon desenvolveu a mesma imagem: a carne de Cristo é o lugar onde Deus se encontra com a humanidade.',
    },
    'john-1:xr:isa-40': {
      title: '“Voz do que clama no deserto”',
      explanation:
        'Quando lhe perguntam quem é, João Batista responde com Isaías 40:3 — a abertura da mensagem de consolo de Isaías, que anuncia que o próprio SENHOR está vindo ao seu povo e que “a glória do SENHOR se manifestará” (40:5). As palavras de João seguem a tradição grega, na qual a voz está “no deserto” (no hebraico, como traduz a BSB, é o caminho que se prepara no deserto), e dizem “Endireitai” onde a Septuaginta tem “Preparai”. Seja como for, o Batista se faz pequeno — apenas uma voz — e engrandece aquele que vem: o caminho que se prepara é o caminho do SENHOR.',
    },
    'john-1:xr:deut-18': {
      title: '“Tu és o Profeta?”',
      explanation:
        'A pergunta da delegação, “Tu és o Profeta?”, remete à promessa de Moisés de que Deus suscitaria um profeta “como eu”, a quem Israel deveria ouvir (Dt 18:15, 18). João Batista diz que não. O Evangelho deixa a pergunta em suspenso e a responde por meio de Jesus: mais tarde as multidões dizem “Este é verdadeiramente o Profeta” (6:14; 7:40), e Filipe anuncia ter achado “aquele de quem Moisés escreveu na Lei” (1:45). Em Atos 3:22, Pedro aplica Deuteronômio 18:15 diretamente a Jesus. Jesus é o profeta como Moisés — e mais que isso, pois Moisés recebeu as palavras de Deus, ao passo que Jesus é a Palavra de Deus.',
    },
    'john-1:xr:mal-4': {
      title: 'Elias antes do Dia do SENHOR',
      explanation:
        '“És tu Elias?” pressupõe a promessa de Malaquias: “Eis que eu vos envio o profeta Elias, antes que venha o grande e temível dia do SENHOR” (Ml 4:5), onde Elias é o precursor da vinda do Senhor (compare o mensageiro que prepara o caminho em 3:1). João nega ser Elias — provavelmente negando ser o antigo profeta de volta em pessoa, como seus interrogadores imaginavam. Em sua função, porém, ele é o precursor descrito por Malaquias, como observam as notas da Tyndale (compare Mt 11:14; Lc 1:17).',
    },
    'john-1:xr:matt-11': {
      title: '“Este é o Elias que havia de vir”',
      explanation:
        'Aqui os Evangelhos parecem, à primeira vista, discordar. João diz de si mesmo: “Não sou” Elias (1:21), enquanto Jesus diz de João: “este é o Elias que havia de vir” (Mt 11:14; compare 17:10–13). A tensão se desfaz quando cada afirmação é ouvida em seus próprios termos. O Batista recusa a identidade que seus interrogadores tinham em mente; Jesus, acrescentando “se estais dispostos a aceitar”, fala do papel que João cumpriu — como o anjo havia prometido, ele foi adiante do Senhor “no espírito e virtude de Elias” (Lc 1:17). O Evangelho de João mantém os holofotes longe do Batista; o dito de Mateus explica a sua importância.',
    },
    'john-1:xr:isa-53': {
      title: 'O cordeiro silencioso de Isaías 53',
      explanation:
        '“Eis o Cordeiro de Deus, que tira o pecado do mundo.” A palavra grega para cordeiro aqui, ἀμνός, é a que a Septuaginta usa em Isaías 53:7 para o cordeiro que fica mudo diante do tosquiador: o Servo que “não abriu sua boca”. No grego desse versículo, o animal levado ao matadouro é um πρόβατον, uma ovelha — o inverso do texto hebraico, seguido pela BSB e pela Bíblia Livre (“tal como cordeiro ele foi levado ao matadouro, e como ovelha muda perante seus tosquiadores”); Atos 8:32 cita a forma grega. O mesmo Servo “levou sobre si o pecado de muitos” (53:12). A igreja primitiva leu Isaías 53 dessa maneira: quando o oficial etíope pergunta sobre 53:7, Filipe começa por aquela Escritura e lhe anuncia as boas-novas sobre Jesus (At 8:32–35). O título dado pelo Batista reúne esse pano de fundo do Servo com os cordeiros sacrificiais de Israel; Isaías 53 fornece a ideia de um inocente que sofre pelos pecados de outros.',
    },
    'john-1:xr:exod-12': {
      title: 'O cordeiro pascal',
      explanation:
        'No clímax do Evangelho de João, Jesus é condenado na “preparação da páscoa” (19:14), e nenhum de seus ossos é quebrado — o que João lê como cumprimento da Escritura (19:36), lembrando a regra para o cordeiro da Páscoa (Êx 12:46). Por isso, quando o Batista o chama de “o Cordeiro de Deus”, muitos leitores ouvem o cordeiro cujo sangue marcou os umbrais das portas de Israel na noite do livramento (Êx 12:3–7); também Paulo chama Cristo de “nosso cordeiro da páscoa” (1Co 5:7). Os intérpretes ponderam esse pano de fundo junto com outros — o Servo de Isaías e os cordeiros diários do templo (Êx 29:38–39) —, e tanto as notas da Tyndale quanto Matthew Henry mencionam o sacrifício diário além da Páscoa. A Septuaginta de Êxodo 12 chama o animal pascal de πρόβατον, não de ἀμνός; o vínculo, portanto, é temático, e não verbal.',
    },
    'john-1:xr:gen-28': {
      title: 'A escada de Jacó e o Filho do Homem',
      explanation:
        'A promessa de Jesus — “vereis o céu aberto, e aos anjos de Deus subir e descer sobre o Filho do homem” — ecoa o sonho de Jacó em Betel, onde “anjos de Deus subiam e desciam” pela escada (o Antigo Testamento grego usa o mesmo par de verbos, subir e descer). A cena foi preparada: Jesus chamou Natanael de “verdadeiramente um israelita, em quem não há engano” (1:47), ao contrário do astuto Jacó. Aquilo que Jacó chamou de “casa de Deus e porta do céu” (28:17) é agora uma pessoa: o Filho do Homem é o ponto de encontro entre o céu e a terra. Tim Keller pregou sobre esse vínculo, argumentando que em Jesus o céu se abre aos que chegam com humildade.',
    },
    'john-1:xr:col-1': {
      title: 'A imagem do Deus invisível, agente da criação',
      explanation:
        'O grande hino cristológico de Paulo diz, com seu próprio vocabulário, o que diz o prólogo de João. O Filho é “a imagem do Deus invisível” (compare João 1:18); “todas as coisas foram criadas por ele e para ele” (compare 1:3); “Ele existe antes de todas as coisas” (compare 1:1–2, 15); e “foi do agrado do Pai que toda a plenitude habitasse nele” (compare 1:14, 16). Duas vozes diferentes do Novo Testamento, um Evangelho e uma carta, confessam o mesmo Filho preexistente, criador e revelador.',
    },
    'john-1:xr:heb-1': {
      title: 'Deus nos falou pelo Filho',
      explanation:
        'Hebreus começa como João, com a fala de Deus. Deus falou “pelos profetas” de muitas maneiras, mas “nestes últimos falou a nós por meio do seu Filho … pelo qual também fez o universo”. O Filho é “o resplendor da sua glória, a expressa imagem da sua pessoa”. João chama o Filho de “a Palavra”; Hebreus o apresenta como a fala final de Deus. Ambos mantêm juntas a criação (João 1:3; Hb 1:2) e a revelação (João 1:14, 18; Hb 1:3), e Hebreus acrescenta a purificação dos pecados que João 1:29 anuncia no Cordeiro. John Piper faz exatamente essa ligação ao explicar por que João chama Jesus de “a Palavra”.',
    },
    'john-1:xr:phil-2': {
      title: 'A descida do Filho',
      explanation:
        'João diz que a Palavra, que “era Deus”, “se fez carne”. Paulo diz que Cristo Jesus, “sendo em forma de Deus”, “esvaziou a si mesmo, tomando a forma de servo, e se tornou semelhante aos homens”, e desceu até a morte de cruz. Ambos descrevem um único movimento — da glória divina para uma vida humana genuína — e ambos insistem em que aquele que desce é a mesma pessoa do começo ao fim. Agostinho notou o par. Nos livros platônicos encontrou ideias semelhantes a João 1:1–5, e até que o Filho estava na forma do Pai e era igual a Deus (compare Fp 2:6). Mas não encontrou ali que a Palavra se fez carne, nem que o Filho esvaziou a si mesmo e tomou a forma de servo (Fp 2:7–11; Confissões 7.9).',
    },
    'john-1:xr:1jn-1': {
      title: '“O que era desde o princípio”',
      explanation:
        '1 João começa com um prólogo muito próximo de João 1: “desde o princípio”, a “Palavra da vida”, a vida “que estava com o Pai, e a nós foi manifesta”, e uma forte ênfase naquilo que “vimos com os nossos olhos”, contemplamos e nossas mãos tocaram. O Evangelho enfatiza que a Palavra se fez carne e que “vimos sua glória” (1:14); a carta enfatiza a realidade física desse ver e tocar. Lidos juntos, mostram o testemunho joanino sustentando tanto a eternidade da Palavra quanto a humanidade tangível de Jesus.',
    },
    'john-1:xr:rev-19': {
      title: 'Seu nome é Palavra de Deus',
      explanation:
        'Somente os escritos joaninos dão a Jesus o título de “a Palavra”: o prólogo (1:1, 14), 1 João 1:1 (“Palavra da vida”) e Apocalipse 19:13, onde o cavaleiro que retorna, vestido de uma roupa tingida em sangue, é chamado “Palavra de Deus”. Os cenários dificilmente poderiam ser mais diferentes — a abertura serena de um Evangelho e uma visão do juízo final —, mas o título faz a mesma afirmação: a fala decisiva de Deus ao mundo é uma pessoa, que revela, salva e julga.',
    },
    'john-1:xr:matt-3': {
      title: 'O Espírito descendo como pomba',
      explanation:
        'O Evangelho de João não narra o batismo de Jesus; relata o testemunho do Batista sobre o que viu: “Eu vi o Espírito como pomba descer do céu, e repousou sobre ele … este é o Filho de Deus” (1:32–34). Mateus e Marcos narram o próprio acontecimento — os céus abertos, o Espírito descendo como pomba e a voz do Pai: “Este é o meu Filho amado” (Mt 3:16–17; compare Mc 1:10–11, “Tu és meu Filho amado”). Os relatos convergem na mesma revelação do Pai, do Espírito e do Filho. João acrescenta que o sinal foi dado para que o Batista pudesse reconhecer e testemunhar (1:33) e — como observam as notas da Tyndale — que o Espírito permaneceu sobre Jesus.',
    },
  },

  /* ------------------------------------------------------------------ */
  /* Contexto histórico e cultural                                       */
  /* ------------------------------------------------------------------ */
  context: {
    'john-1:ctx:authorship': {
      title: 'Quem escreveu o Quarto Evangelho — e quando?',
      summary:
        'O Evangelho não nomeia seu autor. Ele fundamenta seu relato no testemunho de uma testemunha ocular anônima, “um dos discípulos, a quem Jesus amava” (13:23; 19:35; 21:24). A tradição da igreja antiga identificou-o como o apóstolo João, filho de Zebedeu; Ireneu de Lyon (fim do século II) escreveu que João, o discípulo que se reclinara sobre o peito do Senhor, publicou o seu Evangelho quando vivia em Éfeso, na Ásia.',
      detail:
        'As notas da Tyndale aceitam a identificação tradicional — João, um dos Doze e, com Pedro e Tiago, parte do círculo mais próximo de Jesus —, embora seu resumo chame o autor de “provavelmente” o discípulo amado, “tradicionalmente identificado” como João, filho de Zebedeu. A identificação não é feita no próprio Evangelho e há muito é questionada: Eusébio já observava que Papias nomeava tanto o apóstolo João quanto um “presbítero João” (História Eclesiástica 3.39.4–6), e a Catholic Encyclopedia (1910), embora defendesse a autoria apostólica, reconhecia que, desde o século XIX, a maioria dos críticos de fora da Igreja Católica a negava. Quanto à data, as notas da Tyndale dizem que a maioria dos estudiosos acredita que o Evangelho foi concluído por volta de 90 d.C. Essa data no fim do século I é a posição comum, embora não a única: J. A. T. Robinson argumentou em Redating the New Testament (1976) que todos os livros do Novo Testamento, inclusive João, foram escritos antes de 70 d.C. A tradição de Éfeso remonta a Ireneu. Quando João 1:14 diz “vimos sua glória”, fala mais naturalmente com a voz dos que conheceram Jesus.',
    },
    'john-1:ctx:audience': {
      title: 'Público e propósito',
      summary:
        'João declara seu propósito perto do fim: “estes estão escritos, para que creiais que Jesus é o Cristo, o Filho de Deus; e para que crendo, tenhais vida em seu nome” (20:31). O capítulo 1 serve a esse objetivo acumulando testemunhos e títulos de Jesus.',
      detail:
        'As notas da Tyndale sugerem que os primeiros leitores eram provavelmente cristãos judeus da região de Éfeso e de todo o Mediterrâneo — familiarizados com as festas e as ideias judaicas, mas precisando que alguns termos lhes fossem explicados. João traduz “Rabi” (“Mestre”, 1:38) e “Messias” (“Cristo”, 1:41) para eles. Esse ambiente misto importa para 1:1: a palavra Logos podia falar tanto aos leitores imersos no Antigo Testamento grego quanto aos formados pelo pensamento grego.',
    },
    'john-1:ctx:occasion': {
      title: 'Contra um Cristo dividido: Ireneu sobre por que João escreveu',
      summary:
        'Ireneu acreditava que João escreveu em parte para refutar Cerinto e mestres afins, que separavam o Criador do mundo do Pai de Jesus e ensinavam que um Cristo celestial descera sobre o homem Jesus e depois o deixara.',
      detail:
        'Nesses sistemas, até Monogenes (“Unigênito”) e Logos (“Palavra”) eram nomes de seres celestiais. Ireneu lia o prólogo como a afirmação de que há um só Deus, que fez todas as coisas por sua Palavra, e de que a Palavra por meio da qual Deus criou é a mesma por meio da qual ele salva. Lutero repete a tradição de que João escreveu contra Cerinto. Seja ou não Cerinto o alvo direto de João, a insistência do prólogo em que a Palavra é Deus, é o Criador e verdadeiramente se fez carne responde diretamente a tais ideias.',
    },
    'john-1:ctx:greek-logos': {
      title: 'O Logos no pensamento grego',
      summary:
        'Muito antes de João, filósofos gregos usavam logos para o princípio racional que ordena o mundo. Heráclito exortava seus ouvintes a escutar não a ele, mas ao Logos, que é comum a todos; os estoicos identificavam Deus com a razão (logos) eterna que permeia o cosmo.',
      detail:
        'Leitores gregos instruídos podiam ouvir em João 1:1 o eco de algo que prezavam: a razão por trás da realidade. João afirma que o mundo tem essa fonte, mas a torna pessoal (“junto de Deus”), divina (“era Deus”) e — o mais chocante de tudo — encarnada (“se fez carne”). Agostinho conta que um platônico dizia que a abertura do prólogo merecia ser escrita em letras de ouro e exposta em todas as igrejas, mas os soberbos se recusavam a aprender de um Deus que se fez carne (Cidade de Deus 10.29); em sua própria leitura dos livros platônicos, ele encontrou ideias semelhantes a 1:1–5, mas não a Palavra feita carne (Confissões 7.9). Tim Keller também ressalta quão surpreendente a afirmação de que a Palavra “se fez carne” soava tanto para judeus quanto para gregos.',
    },
    'john-1:ctx:jewish-word': {
      title: 'Palavra, Sabedoria e Memra na tradição judaica',
      summary:
        'Para ouvintes judeus, “a palavra do SENHOR” era a palavra que fez os céus (Sl 33:6), que veio aos profetas e realizou os propósitos de Deus. Os escritos sapienciais judaicos retratavam a Sabedoria ao lado de Deus na criação (Pv 8) e até recebendo a ordem de fazer morada — literalmente, de armar sua tenda — em Jacó (Eclesiástico 24:8).',
      detail:
        'Outros dois panos de fundo são frequentemente propostos; ambos são debatidos. Fílon de Alexandria, filósofo judeu contemporâneo de Jesus, chamou o Logos de “primogênito” de Deus e disse que “a imagem de Deus é a sua palavra mais antiga” (De confusione linguarum [Sobre a confusão das línguas] 146–147) — mas o Logos de Fílon nunca se torna um ser humano. Os Targuns aramaicos (paráfrases judaicas das Escrituras) frequentemente falam do Memra, “a Palavra”, do SENHOR, onde o hebraico fala de Deus agindo diretamente. Matthew Henry observou que a paráfrase aramaica muitas vezes chama o Messias de Memra, e John Gill achava mais provável que João tivesse tomado a expressão dos Targuns — que ele acreditava terem sido escritos antes da época de João — do que de Platão. Daniel Boyarin (2001) argumentou que a teologia do Logos no prólogo tem raízes judaicas profundas. Até que ponto essas ideias moldaram João, ou umas às outras, é debatido. A Jewish Encyclopedia (1904) julgou “difícil dizer” até que ponto o Memra rabínico fora influenciado pelo Logos grego, embora sustentasse que o Logos de Fílon preparou o caminho para as ideias cristãs sobre a Encarnação. O que está claro é que a linguagem de João soaria enraizada nas Escrituras de Israel, e não estranha a elas.',
    },
    'john-1:ctx:tabernacle': {
      title: 'Tabernáculo, templo e glória',
      summary:
        'Na história de Israel, a presença de Deus habitava no meio do seu povo, no tabernáculo, e a sua glória o enchia (Êx 25:8; 40:34–35). A tradição judaica posterior chamou essa presença que habita de Shekinah, termo relacionado ao verbo hebraico shakan, “habitar”.',
      detail:
        'O verbo de João, σκηνόω (“habitou”, literalmente “armou sua tenda”), deriva de σκηνή, “tabernáculo”, e no Antigo Testamento grego traduz sobretudo shakan. O léxico grego observa que δόξα, “glória”, era usada para o esplendor da presença de Deus na coluna de nuvem e no Santo dos Santos — o que o hebraico posterior chamou de Shekinah. Assim, quando João diz que a Palavra “habitou entre nós” e que “vimos sua glória” (1:14), leitores judeus se lembrariam do tabernáculo cheio de glória: a presença de Deus, antes concentrada numa tenda e depois num templo, encontra-se agora em Jesus (compare 2:19–21).',
    },
    'john-1:ctx:baptist': {
      title: 'João Batista e seu movimento',
      summary:
        'João Batista era conhecido muito além dos Evangelhos. O historiador judeu Josefo o descreve como um homem bom, que exortava os judeus a praticar a justiça uns para com os outros e a piedade para com Deus, e a vir ao batismo; acrescenta que Herodes, o tetrarca, mandou executar João porque temia sua influência sobre as multidões.',
      detail:
        'O movimento de João parece ter sobrevivido a ele: em Éfeso, anos depois, Paulo encontrou “discípulos” que conheciam apenas o “batismo de João” (At 19:1–7). As notas da Tyndale os tratam como crentes com uma compreensão incompleta da fé; Matthew Henry pensava que tinham sido batizados em nome de João por um de seus seguidores, que o mantinha como cabeça de um partido. A memória de tais grupos pode ajudar a explicar por que o prólogo tem tanto cuidado em dizer que João “não era a Luz”, mas veio testemunhar dela (1:8), e por que o Batista insiste: “Eu não sou o Cristo” (1:20); as notas da Tyndale observam que alguns especulavam que João fosse o Messias. Abluções rituais de purificação eram conhecidas no judaísmo; o batismo de João chamava ao arrependimento em vista daquele que viria (1:25–27).',
    },
    'john-1:ctx:expectations': {
      title: 'Messias, Elias e o Profeta',
      summary:
        'As perguntas feitas a João — És tu o Cristo? Elias? O Profeta? — retratam esperanças correntes no judaísmo do século I: um libertador ungido (Messias é o equivalente hebraico da palavra grega Cristo), o retorno de Elias antes do Dia do SENHOR (Ml 4:5) e um profeta como Moisés (Dt 18:15).',
      detail:
        'A delegação trata essas figuras como três pessoas distintas, e João recusa cada papel, apontando para longe de si. O restante do capítulo aplica então esses títulos a Jesus em rápida sucessão: Messias (1:41), aquele sobre quem escreveram Moisés e os profetas (1:45), Filho de Deus e Rei de Israel (1:49). As notas da Tyndale acrescentam que se esperava que o Messias trouxesse liderança espiritual e redenção política a Israel.',
    },
    'john-1:ctx:geography': {
      title: 'Betânia, além do Jordão — e rumo à Galileia',
      summary:
        'João batizava em Betânia, além do Jordão (1:28), do outro lado do rio em relação à Judeia — não na Betânia perto de Jerusalém, onde morava Lázaro (11:18). A KJV traz aqui “Bethabara”, seguindo o texto grego a partir do qual foi traduzida (o Textus Receptus); a BSB e a WEB trazem “Bethany”, como tanto o texto crítico Nestle–Aland quanto o texto bizantino (majoritário). Em português, a Bíblia Livre segue a leitura “Betábara”, enquanto a NBV e a BPM trazem “Betânia”.',
      detail:
        'A segunda metade do capítulo desloca-se para o norte, rumo à Galileia. Filipe, André e Pedro vinham de Betsaida, aldeia na margem norte do mar da Galileia; a pergunta de Natanael, “Pode haver alguma coisa boa de Nazaré?”, reflete a obscuridade de um pequeno povoado nas colinas. As notas da Tyndale observam também que Filipe (nome grego) e Natanael (nome hebraico) refletem a mistura de culturas da Galileia.',
    },
  },

  /* ------------------------------------------------------------------ */
  /* Contexto literário                                                  */
  /* ------------------------------------------------------------------ */
  literary: {
    placeInBook:
      'João 1 é a porta de entrada de todo o Evangelho. O prólogo (1:1–18) enuncia de antemão os temas que a história desenvolverá — a identidade divina da Palavra, vida e luz, testemunho, rejeição e acolhida, glória, graça e verdade. Então 1:19–51 dá início à narrativa: o testemunho de João Batista e a reunião dos primeiros discípulos, que desembocam diretamente no primeiro sinal, em Caná, onde Jesus “manifestou sua glória” (2:11). Os capítulos 1–12 costumam ser chamados de Livro dos Sinais, e os capítulos 13–21, de Livro da Glória.',
    argument:
      'O prólogo vai da eternidade à história. Começa com a existência da Palavra e sua relação com Deus (1–2), passa à sua obra na criação e como vida e luz (3–5), apresenta João como testemunha (6–8), acompanha a vinda da Luz, sua rejeição e sua acolhida (9–13), chega à encarnação e à glória contemplada (14), repete o testemunho de João (15) e conclui com a plenitude recebida, o contraste com Moisés e o Filho que dá a conhecer Deus (16–18). A narrativa então responde à pergunta “Tu quem és?” (19–28), aponta para o Cordeiro e para o Filho ungido pelo Espírito (29–34) e mostra o testemunho gerando discípulos que vêm e veem (35–51), terminando com a promessa do céu aberto sobre o Filho do Homem.',
    placeInCanon:
      'João 1 reúne a história do Antigo Testamento numa só pessoa. Relê Gênesis 1 (o princípio, a palavra, a luz), o Êxodo (o tabernáculo cheio de glória, o pedido de Moisés para ver Deus, o cordeiro da Páscoa), Isaías (a voz no deserto, o Servo semelhante a um cordeiro) e Gênesis 28 (a escada de Jacó). Coloca-se ao lado de outras confissões neotestamentárias do Filho preexistente — Colossenses 1, Hebreus 1, Filipenses 2 — e aponta para o Apocalipse, onde a Palavra de Deus retorna e a morada de Deus está finalmente com a humanidade (Ap 19:13; 21:3).',
    bookOutline: [
      'Prólogo: a Palavra feita carne',
      'O testemunho de João e os primeiros discípulos',
      'Primeiros sinais: de Caná a Caná',
      'Jesus nas festas',
      'Lázaro ressuscitado e o último apelo público',
      'O cenáculo: despedida e oração',
      'Prisão, julgamento e crucificação',
      'Ressurreição e comissionamento',
    ],
    passageOutline: [
      'A Palavra, a criação e a luz',
      'João, enviado como testemunha',
      'A Luz vem: rejeitada e acolhida',
      'A Palavra se fez carne: glória, graça e verdade',
      'O testemunho de João à delegação de Jerusalém',
      '“Eis o Cordeiro de Deus”',
      'Os primeiros discípulos: “Vinde, e vede-o”',
      'Filipe e Natanael: o céu aberto',
    ],
    features: {
      'john-1:lit:inclusio': {
        title: 'Molduras: Deus e a Palavra (1:1 e 1:18)',
        description:
          'O prólogo abre e fecha com as mesmas duas notas. Em 1:1, a Palavra está “junto de Deus” e “era Deus”; em 1:18, o Filho único é — segundo os manuscritos mais antigos — ele mesmo Deus (μονογενὴς θεός) e está “no seio do Pai”. Entre essas molduras, a Palavra entra no mundo. O efeito é enquadrar toda a história da encarnação pela eterna proximidade do Filho com o Pai — a mesma proximidade que o habilita a dar a conhecer o Pai.',
      },
      'john-1:lit:chiasm': {
        title: 'Um quiasmo centrado em “filhos de Deus” (uma proposta)',
        description:
          'Alguns intérpretes veem o prólogo como um quiasmo — linhas espelhadas em torno de um centro. R. Alan Culpepper (“The Pivot of John’s Prologue”, New Testament Studies 27, 1980) propôs que seu centro é 1:12b: “deu-lhes poder de serem feitos filhos de Deus”. Nessa leitura, o objetivo do prólogo não é apenas quem a Palavra é, mas o que ela dá. O esquema abaixo resume a proposta com as palavras deste estudo; os leitores discordam em detalhes, mas as correspondências (1:1–2 com 1:18, 1:6–8 com 1:15 e 1:9–10 com 1:14) são fáceis de verificar.',
        structure: [
          { text: 'A Palavra junto de Deus' },
          { text: 'Todas as coisas vieram a existir por meio da Palavra' },
          { text: 'O que recebemos: vida e luz' },
          { text: 'João, enviado para testemunhar' },
          { text: 'A Luz que vem ao mundo' },
          { text: 'Os seus não o receberam' },
          { text: 'Todos os que o receberam' },
          { text: 'Deu-lhes o poder de serem feitos filhos de Deus' },
          { text: 'Os que creem em seu nome' },
          { text: 'Gerados não da vontade humana, mas de Deus' },
          { text: 'A Palavra se fez carne' },
          { text: 'O testemunho de João' },
          { text: 'O que recebemos: graça por graça' },
          { text: 'A graça e a verdade vieram por meio de Jesus Cristo' },
          { text: 'O Filho, no seio do Pai, o dá a conhecer' },
        ],
      },
      'john-1:lit:staircase': {
        title: 'Linhas poéticas “em escada” em 1:1–5',
        description:
          'Os versículos iniciais são construídos como degraus: cada oração retoma uma palavra-chave da anterior — em grego, λόγος … λόγος, θεόν … θεός, ζωή … ζωή, φῶς … φῶς, σκοτία … σκοτία. O português preserva parte do efeito: “Nela estava a vida, e a vida era a luz dos seres humanos. E a luz brilha nas trevas; e as trevas não a compreenderam.” O ritmo levou muitos a pensar que 1:1–5 talvez tenha sido um hino ou poema; as notas da Tyndale sugerem que pode ter sido cantado pelos primeiros cristãos.',
      },
      'john-1:lit:witness': {
        title: 'Testemunho e visão',
        description:
          'O testemunho é o motor do capítulo. O verbo μαρτυρέω (“testemunhar”) e o substantivo μαρτυρία (“testemunho”) ocorrem sete vezes no capítulo 1 (duas vezes em 1:7, e em 1:8, 15, 19, 32, 34), e verbos de ver os acompanham: “vimos sua glória” (1:14), “eu o vi, e testemunhado tenho” (1:34), “Vinde, e vede-o” (1:39; compare “Vem, e vê”, 1:46), “verás coisas maiores” (1:50–51). O Evangelho de João apresenta a fé como resposta a um testemunho confiável.',
      },
      'john-1:lit:days-and-titles': {
        title: 'Uma sequência de dias e uma cascata de títulos',
        description:
          'A narrativa é marcada por indicações de tempo — no dia seguinte (1:29, 35, 43) e depois “no terceiro dia” (2:1). Alguns intérpretes contam esses dias como uma semana que culmina em Caná, talvez ecoando os dias da criação; a contagem é debatida, mas a sequência é clara. Ao longo do caminho, Jesus recebe título após título: a Palavra, a Luz, o Filho único, o Cordeiro de Deus, o Filho de Deus, Rabi, Messias, aquele sobre quem escreveram Moisés e os profetas, Rei de Israel — e, por fim, em sua própria boca, o Filho do Homem.',
      },
    },
  },

  /* ------------------------------------------------------------------ */
  /* Teologia                                                            */
  /* ------------------------------------------------------------------ */
  theology: {
    'john-1:th:eternal-word': {
      title: 'A Palavra eterna e divina',
      summary:
        'João 1:1–2 faz três afirmações sobre a Palavra: ela já “era” no princípio (não veio a existir), estava “junto de Deus” (distinta do Pai) e “era Deus” (partilhando a natureza de Deus). O prólogo termina do mesmo modo: o Filho é — segundo os manuscritos mais antigos — ele mesmo Deus, e está “no seio do Pai” (1:18).',
      detail:
        'Os verbos são reveladores. Tudo o que 1:3 menciona “foi feito” (ἐγένετο, veio a existir); a Palavra simplesmente “era” (ἦν). O contraste retorna em 1:14, onde a Palavra que sempre era “se fez” carne. Por isso a igreja, diante de Ário no século IV, apelou a João 1: como argumentou Agostinho, aquele por meio de quem todas as coisas foram feitas não pode ser ele mesmo uma das coisas feitas — e Piper observa que as palavras finais de 1:3 tornam isso inequívoco.',
    },
    'john-1:th:trinity': {
      title: '“Junto de Deus” e “era Deus”: as raízes da fé trinitária',
      summary:
        'João 1:1 mantém juntas duas afirmações sem dissolver nenhuma delas: a Palavra é distinta de Deus (“junto de Deus”) e, contudo, é Deus. Mais adiante no capítulo, Deus, que enviou o Batista (1:6, 33), dá-lhe um sinal: o Espírito desce e permanece sobre Jesus, e o Batista testemunha que este é o Filho de Deus (1:32–34).',
      detail:
        'A doutrina da Trindade — um só Deus, eternamente Pai, Filho e Espírito Santo — foi formulada no século IV em grande parte pela reflexão sobre textos como estes. O credo de 381, em sua forma recebida, confessa o Filho como “Filho Unigênito de Deus”, “Luz da Luz, Deus verdadeiro de Deus verdadeiro”, aquele por quem “todas as coisas foram feitas” — linguagem impregnada de João 1. João não usa o vocabulário técnico posterior, mas fornece a sua matéria-prima: distinção real sem divisão. Lutero observou que o evangelista dispôs suas palavras de modo a refutar dois erros ao mesmo tempo — o dos que fundem Pai e Filho numa só pessoa e o dos que negam que o Filho seja verdadeiramente Deus.',
    },
    'john-1:th:incarnation': {
      title: 'A Palavra se fez carne',
      summary:
        'A Palavra “se fez carne” (1:14) é o centro da fé cristã sobre Jesus: a Palavra eterna assumiu uma vida humana plena — “carne” no sentido bíblico de humanidade frágil e mortal — sem deixar de ser a Palavra.',
      detail:
        'Os intérpretes antigos protegeram as duas metades. Crisóstomo insistiu em que “se fez” não significa que a natureza divina se transformou em carne; a Palavra tomou a carne para si, sem que sua natureza fosse alterada. Calvino disse que o Filho de Deus começou a ser homem, continuando a ser a Palavra eterna. Contra mestres que diziam que Jesus apenas parecia humano, “carne” é uma palavra direta: trata-se de uma humanidade real e tangível (compare 1 João 1:1). As notas da Tyndale observam que a ideia chocava tanto os gregos, que separavam o divino do mundo carnal, quanto os judeus.',
    },
    'john-1:th:creation': {
      title: 'A criação por meio da Palavra',
      summary:
        '“Por esta foram feitas todas as coisas” (1:3): a Palavra não é parte da criação, mas o seu agente. João coloca Jesus do lado do Criador na linha que separa Deus de tudo o mais.',
      detail:
        'Isso tem duas consequências em João 1. Primeiro, o mundo pertence à Palavra — o que torna ainda mais triste o fato de o mundo não a reconhecer (1:10–11). Segundo, aquele que fez todas as coisas pode fazer novas as pessoas: os que o recebem são gerados de Deus (1:12–13). Ireneu percebeu a ligação: a Palavra pela qual Deus fez a criação é aquela pela qual ele concede a salvação às pessoas dessa criação. Colossenses 1:16 e Hebreus 1:2 fazem a mesma confissão.',
    },
    'john-1:th:revelation': {
      title: 'O Filho que dá a conhecer Deus',
      summary:
        '“A Deus nunca ninguém o viu; o unigênito Filho, que está no seio do Pai, ele o declarou” (1:18). O verbo ἐξηγέομαι significa narrar ou expor por completo: Jesus é a autoexplicação de Deus.',
      detail:
        'O prólogo constrói essa afirmação por meio de suas imagens: a Palavra (a autoexpressão de Deus), a Luz que brilha nas trevas, a glória vista na carne, a graça e a verdade vindas em plenitude. Moisés não teve permissão de ver o rosto de Deus (Êx 33:20); o Filho, que está no seio do Pai, pode dá-lo a conhecer — por isso Jesus dirá mais tarde: “Quem a mim tem visto, já tem visto ao Pai” (14:9). Atanásio expressou nestes termos o propósito da encarnação: a Palavra se manifestou num corpo para que recebêssemos a ideia do Pai invisível.',
    },
    'john-1:th:children-lamb': {
      title: 'Filhos de Deus e o Cordeiro que tira o pecado',
      summary:
        'João 1 descreve a salvação por dois lados. Aos que recebem a Palavra e creem em seu nome é dado o direito de se tornarem filhos de Deus — gerados não por descendência nem por decisão humana, mas de Deus (1:12–13). E Jesus é anunciado como “o Cordeiro de Deus, que tira o pecado do mundo” (1:29).',
      detail:
        'O primeiro é o novo nascimento, obra do próprio Deus, que Jesus explicará a Nicodemos (3:3–6); R. Alan Culpepper argumentou que 1:12 é o eixo de todo o prólogo. O segundo é o sacrifício: o Cordeiro leva embora o pecado — e não apenas o de Israel, mas o do mundo; Calvino chama isso de ofício principal de Cristo. Crisóstomo ligou o primeiro tema à encarnação: o Filho de Deus tornou-se Filho do Homem para que os filhos dos homens se tornassem filhos de Deus.',
    },
  },

  /* ------------------------------------------------------------------ */
  /* Perspectivas                                                        */
  /* ------------------------------------------------------------------ */
  perspectives: {
    'john-1:ps:nicene': {
      question: 'A Palavra é plenamente Deus — ou a primeira e mais elevada das criaturas de Deus?',
      intro:
        'Cristãos das tradições católica, ortodoxa e protestante concordam que João 1:1 e 1:14 confessam a plena divindade e a verdadeira humanidade de Cristo. A questão foi ferozmente debatida no século IV, quando Ário ensinou que o Filho teve um começo. O Concílio de Niceia (325) e o credo ampliado em 381 responderam que o Filho é “gerado, não criado”. A visão ariana é apresentada aqui para compreensão histórica; não é uma opção viva dentro do cristianismo histórico.',
      perspectives: {
        'john-1:ps:nicene:nicene': {
          tradition: 'Cristianismo niceno (católico, ortodoxo, protestante)',
          label: 'A Palavra é plenamente Deus, eternamente distinta do Pai',
          summary:
            'Em 1:1, a Palavra já “era” antes que qualquer coisa fosse feita, distingue-se do Pai (“junto de Deus”) e partilha a natureza divina (“era Deus”); 1:3 a coloca do lado do Criador; 1:14 diz que ela verdadeiramente se tornou humana; 1:18, segundo os manuscritos mais antigos, chama o Filho de ele mesmo Deus. O credo, em sua forma recebida, confessa-o como “Filho Unigênito de Deus, nascido do Pai antes de todos os séculos … Deus verdadeiro de Deus verdadeiro, gerado, não criado”, aquele por quem “todas as coisas foram feitas” e que, “por nós, homens, e para nossa salvação, desceu dos céus … e se fez homem”.',
        },
        'john-1:ps:nicene:arian': {
          tradition: 'Arianismo (século IV; rejeitado em Niceia)',
          label: 'O Filho é um ser exaltado que teve um começo',
          summary:
            'Ário queria proteger a singularidade de Deus como o único não gerado e sem princípio. Em suas próprias palavras, “o Filho tem um princípio, mas … Deus é sem princípio” — embora ainda pudesse chamar o Filho de “Deus perfeito, unigênito e imutável”. Os arianos liam a respeito do Filho textos como Provérbios 8:22 (onde a Septuaginta diz que o Senhor criou a Sabedoria) e concluíam que ele é uma obra, uma criatura. Seus opositores responderam a partir do próprio João 1: a Palavra já “era” no princípio, e nada do que foi feito se fez sem ela — logo, ela mesma não pode ser algo feito. O Concílio de Niceia anatematizou a afirmação de que houve um tempo em que o Filho não existia.',
        },
      },
      commonGround:
        'Os dois lados concordavam que o Filho existia antes da criação e que todas as coisas foram feitas por meio dele. A disputa era se ele pertence ao lado do Criador ou ao da criação — e foi em João 1:1–3 que a igreja encontrou sua resposta.',
    },
    'john-1:ps:monogenes': {
      question: 'μονογενής significa “unigênito” ou “único”?',
      intro:
        'As Bíblias inglesas mais antigas, seguindo a Vulgata latina, dizem “only begotten” (KJV); muitas modernas dizem “one and only” ou “only” (BSB), e a WEB traz “only born”. Em português, a tradição de Almeida — e a Bíblia Livre — diz “unigênito”, ao passo que a NBV traz “Filho único”. O debate se dá dentro da ortodoxia cristã: os dois lados afirmam a plena divindade do Filho. A questão é o que esta palavra específica contribui.',
      perspectives: {
        'john-1:ps:monogenes:unique': {
          tradition: 'Consenso lexical do século XX',
          label: '“Único” — singular, sem igual',
          summary:
            'Dale Moody (1953) argumentou que μονογενής vem de μόνος (“só, único”) e γένος (“espécie”), e não do verbo “gerar”, e que, portanto, significa “único” ou “singular”. Ele apontou para Hebreus 11:17, onde Isaque é o μονογενής de Abraão, embora Abraão tivesse outro filho — Isaque era singular como filho da promessa —, e para a Vetus Latina, que tinha unicus (“único”) em João antes que Jerônimo introduzisse unigenitus (“unigênito”), deixando unicus em Lucas. Como documenta Denny Burk, muitos comentários e léxicos posteriores seguiram essa linha. O próprio Moody afirmava a divindade preexistente de Cristo, e os que adotam essa leitura em geral não negam a relação eterna do Filho com o Pai; apenas não a fundamentam nesta palavra.',
        },
        'john-1:ps:monogenes:begotten': {
          tradition: 'Leitura tradicional (nicena), recentemente retomada',
          label: '“Unigênito” — o Filho único, gerado pelo Pai',
          summary:
            'O Credo Niceno chama o Filho de “Filho Unigênito de Deus, nascido do Pai antes de todos os séculos”, lendo μονογενής como uma palavra sobre origem, e estudiosos recentes retomaram essa leitura. Charles Lee Irons (2017), examinando compostos terminados em -γενής em toda a literatura grega, argumenta que a grande maioria diz respeito a nascimento ou origem, e não a “espécie”, e que Isaque podia ser chamado de μονογενής de Abraão (Hb 11:17) por ser seu único herdeiro. Denny Burk acrescenta que Hebreus 11:17 se ajusta a “gerado de modo único” — Isaque como o herdeiro prometido, nascido do próprio corpo de Abraão — e que João usa μονογενής logo depois de falar do nascimento dos crentes a partir de Deus (1:13–14; 3:3–16), distinguindo a geração única do Filho do novo nascimento deles. Nessa visão, os pais nicenos leram corretamente o grego de João.',
        },
      },
      commonGround:
        'As duas leituras afirmam que Jesus é, de modo único, o Filho, plenamente Deus, e que os crentes só se tornam filhos de Deus por meio dele (1:12). Os que sustentam a geração eterna do Filho a fundamentam em mais textos do que este; a questão aqui é se μονογενής é um de seus apoios.',
    },
    'john-1:ps:katalambano': {
      question: 'Em 1:5, as trevas não “venceram” a Luz — ou não a “compreenderam”?',
      intro:
        'O verbo καταλαμβάνω pode significar agarrar ou alcançar, ou (em geral na voz média) apreender com a mente. As Bíblias se dividem: a KJV diz que as trevas “comprehended it not”, como a Bíblia Livre (“não a compreenderam”); a BSB e a WEB dizem “has not overcome it”, como a BPM (“não a superou”). Trata-se de uma questão exegética genuína, sobre a qual leitores cuidadosos divergem.',
      perspectives: {
        'john-1:ps:katalambano:overcome': {
          tradition: 'Traduções modernas como a BSB e a WEB (em português, a BPM); as notas da Tyndale',
          label: 'Hostilidade: as trevas não venceram a Luz',
          summary:
            'No único outro uso do verbo em João (à parte o disputado 8:3–4), as trevas são de novo o sujeito e o sentido é hostil: “para que as trevas vos não apanhem” (12:35). O verbo em 1:5 está na voz ativa, e não na média, que costuma indicar a apreensão mental, e o léxico do STEPBible classifica este versículo em “alcançar”. As notas da Tyndale concluem que, em João, a palavra indica hostilidade: as trevas tentariam destruir a Luz e fracassariam, e a Luz traria salvação ao mundo. (Os leitores podem ver aqui uma antecipação da cruz e da ressurreição.)',
        },
        'john-1:ps:katalambano:comprehend': {
          tradition: 'Leituras da Reforma e versões mais antigas (Calvino; a KJV; em português, a Almeida Revista e Corrigida)',
          label: 'Incompreensão: as trevas não apreenderam a Luz',
          summary:
            'Nessa leitura, as trevas são o entendimento humano decaído: a Luz brilha, mas as mentes cegas não a apreendem. Calvino aplica o versículo aos resquícios de razão na humanidade decaída, que por si mesmos nunca chegam a Deus — de modo que não há esperança, a menos que Deus conceda um novo auxílio. A leitura combina com os versículos seguintes, em que o mundo “não o conheceu” (1:10) e os seus “não o receberam” (1:11).',
        },
      },
      commonGround:
        'As duas leituras concordam que a Luz não é derrotada e que a humanidade, entregue a si mesma, resiste a ela. A diferença é de ênfase — hostilidade ou incompreensão —, e o verbo comporta as duas, como observam as notas da Tyndale.',
    },
  },

  /* ------------------------------------------------------------------ */
  /* Comentário e pensadores cristãos                                    */
  /* ------------------------------------------------------------------ */
  commentary: {
    'john-1:cm:augustine-tractate-1': {
      lead: 'Sobre “No princípio era a Palavra”, respondendo aos que diziam que a Palavra foi criada',
      quoteTranslation:
        'Pode agora aparecer algum ariano incrédulo e dizer que a Palavra de Deus foi feita. Como pode a Palavra de Deus ter sido feita, se Deus fez todas as coisas pela Palavra?',
    },
    'john-1:cm:augustine-confessions': {
      lead: 'Sobre o que encontrou — e o que não encontrou — nos livros dos platônicos',
      quoteTranslation:
        'Do mesmo modo, li ali que Deus, a Palavra, nasceu não da carne, nem do sangue, nem da vontade do homem, nem da vontade da carne, mas de Deus. Mas que a Palavra se fez carne e habitou entre nós, isso não li ali.',
    },
    'john-1:cm:chrysostom-homily-11': {
      lead: 'Sobre por que a Palavra se fez carne (1:12–14)',
      quoteTranslation:
        'Pois ele, que era o próprio Filho de Deus, tornou-se Filho do homem, a fim de fazer dos filhos dos homens filhos de Deus.',
    },
    'john-1:cm:athanasius-incarnation': {
      lead: 'Sobre o que a encarnação realiza — a formulação clássica por trás do ensino oriental sobre a theosis (participação, pela graça, na vida de Deus)',
      quoteTranslation:
        'Pois ele se fez homem para que nós fôssemos feitos Deus; e manifestou-se por meio de um corpo para que recebêssemos a ideia do Pai invisível…',
    },
    'john-1:cm:luther-postil': {
      lead: 'Sobre ler “vida” e “luz” (1:4) a partir de Cristo, e não da especulação',
      quoteTranslation:
        'Todos esses são pensamentos humanos, platônicos e filosóficos, que nos afastam de Cristo e nos levam para dentro de nós mesmos; mas o evangelista quer nos tirar de nós mesmos e nos levar para Cristo.',
    },
    'john-1:cm:calvin-speech': {
      lead: 'Sobre por que João chama o Filho de “a Palavra” (o tradutor inglês de Calvino verte Logos por “Speech”, isto é, “Fala”)',
      quoteTranslation:
        'Quanto ao fato de o evangelista chamar o Filho de Deus de a Fala, a razão simples parece-me ser, primeiro, que ele é a eterna Sabedoria e Vontade de Deus; e, segundo, que ele é a imagem viva do seu propósito; pois, assim como se diz que, entre os homens, a fala é a imagem da mente, não é impróprio aplicar isso a Deus e dizer que ele se revela a nós por sua Fala.',
    },
    'john-1:cm:henry-fullness': {
      lead: 'Sobre “E de sua plenitude recebemos todos” (1:16)',
      quoteTranslation:
        'Assim como a cisterna recebe água da plenitude da fonte, os ramos recebem seiva da plenitude da raiz e o ar recebe luz da plenitude do sol, assim nós recebemos graça da plenitude de Cristo.',
    },
    'john-1:cm:spurgeon-tabernacle': {
      lead: 'Sobre “habitou” — Cristo como o tabernáculo de Deus (1:14)',
      quoteTranslation:
        'Ora, a carne humana de Cristo era o tabernáculo de Deus, e é em Cristo que Deus se encontra com o homem, e em Cristo que o homem tem trato com Deus.',
    },
    'john-1:cm:lewis-begetting': {
      lead: 'Sobre o “gerado, não criado” do Credo — linguagem extraída em parte do “unigênito” de João',
      text: 'Lewis explica a afirmação do credo de que o Filho é gerado, não criado, e de que essa geração ocorreu antes do tempo, e não em Belém. Gerar, diz ele, produz descendência da mesma espécie que o genitor, ao passo que fazer produz algo de espécie diferente; assim, o Filho, gerado pelo Pai, é Deus como o Pai é Deus, enquanto tudo o que Deus faz é criatura. Em seguida, ele se volta para a oferta cristã: os seres humanos, que são feitos, podem vir a partilhar a vida gerada do Filho e assim tornar-se filhos de Deus (compare João 1:12).',
    },
    'john-1:cm:carson-talk': {
      lead: 'Sobre João 1:1–18 como cumprimento de Êxodo 33–34',
      text: 'Carson apresenta “a Palavra” como a autoexpressão de Deus — a palavra pela qual Deus revela, cria e transforma no Antigo Testamento — e argumenta que João 1:14–18 retoma a cena em que Moisés pede para ver a glória de Deus (Êx 33–34). Jesus tabernaculou entre nós como o lugar de encontro entre Deus e os pecadores; sua glória se manifesta supremamente na cruz; e graça e verdade ecoam a autodescrição de Deus a Moisés. Ele lê 1:16 como uma graça que substitui outra: a Lei foi um dom gracioso, agora sucedido pela graça maior da nova aliança em Jesus. Conclui exortando quem quer conhecer o caráter de Deus — sua santidade, seu perdão e sua glória — a olhar para Jesus, até a cruz.',
    },
    'john-1:cm:keller-incarnation': {
      lead: 'Sobre por que a Palavra “se fez carne” deveria nos transformar',
      text: 'Keller observa que, para os primeiros ouvintes de João, judeus e gregos, a afirmação de que a Palavra de Deus se tornara um ser humano de carne e osso era surpreendente — muitos estudiosos, observa ele, a consideram um ponto de virada na história das ideias. No entanto, o Natal muitas vezes nos deixa inalterados. Ele extrai três consequências da encarnação: como Deus partilhou nossa condição humana, temos profundo consolo no sofrimento; temos um motivo poderoso para servir aos outros; e temos uma esperança que é honesta quanto à ruína do mundo e, ainda assim, não pode falhar.',
    },
    'john-1:cm:piper-fullness': {
      lead: 'Sobre glória, graça e Moisés em João 1:14–18',
      text: 'Piper observa que João enfatiza a graça no prólogo e nunca mais usa a palavra no Evangelho, enquanto “verdade” reaparece do começo ao fim. Lendo 1:16 como a razão de 1:14, argumenta que somente o dom da graça permite a alguém ver a glória de Cristo. Relaciona 1:17–18 com o pedido de Moisés para ver a glória de Deus em Êxodo 33–34: a própria Lei foi um dom da graça, e em Cristo veio uma graça maior. O contraste não é entre uma Lei má e um evangelho bom, mas entre aquele que mediou a Lei de Deus e aquele em quem a graça e a autorrevelação de Deus estão pessoalmente presentes.',
    },
  },

  /* ------------------------------------------------------------------ */
  /* Sermões                                                             */
  /* ------------------------------------------------------------------ */
  sermons: {
    'john-1:sermon:spurgeon-glory': {
      summary:
        'Spurgeon lê 1:14 como “tabernaculou entre nós”: assim como o tabernáculo, com sua glória da Shekinah, era o maior privilégio de Israel, a humanidade de Cristo é o lugar onde Deus e a humanidade se encontram — mas, ao contrário do tabernáculo, ele é cheio de graça e de verdade, a substância, e não a sombra. Em seguida, considera o povo favorecido que contemplou a sua glória e a natureza dessa glória.',
    },
    'john-1:sermon:spurgeon-lamb': {
      summary:
        'Spurgeon observa que o Batista, que poderia ter apresentado Jesus como mestre ou exemplo, escolheu proclamá-lo antes de tudo como o sacrifício pelo pecado, e argumenta que essa doutrina é intensamente prática: toda a vida do Batista existia para apontar para Jesus, como deve ser a vida dos crentes.',
    },
    'john-1:sermon:piper-beginning': {
      summary:
        'Piper argumenta que João chama Jesus de “a Palavra” porque a pessoa e a obra de Jesus — sua vinda, vida, morte e ressurreição, e não apenas o seu ensino — são o coração do que Deus revela (relacionando Hebreus 1:1–2 e Apocalipse 19:13). Em seguida, extrai de 1:1–3 quatro observações — o tempo da existência da Palavra, sua identidade como Deus, sua relação com Deus e sua relação com o mundo — e mostra como as últimas palavras de 1:3 excluem a afirmação de que o Filho foi criado.',
    },
    'john-1:sermon:keller-word-made-flesh': {
      summary:
        'Meditando em 1:14, Keller apresenta Jesus como a Palavra de Deus: Deus se torna pessoalmente conhecível em Jesus, assim como as pessoas se dão a conhecer pelo que dizem. Mas Jesus não veio apenas para falar, e sim para partilhar a nossa vida — de modo que nenhum sofrimento nosso lhe é estranho — e, acima de tudo, para morrer por nós.',
    },
    'john-1:sermon:keller-heaven-open': {
      summary:
        'Keller relaciona o sentido da vinda de Cristo ao sonho de Jacó em Betel: em Jesus, o acesso a Deus é aberto, e são os humilhados, e não os autoconfiantes, que entram.',
    },
  },

  /* ------------------------------------------------------------------ */
  /* Notas de versículos                                                 */
  /* ------------------------------------------------------------------ */
  verseNotes: {
    'JHN.1.1': [
      'A abertura de João ecoa Gênesis 1:1 — em grego, as duas primeiras palavras são idênticas. Seguem-se três afirmações. A Palavra já existia quando o princípio começou; a Palavra estava “junto de Deus”, em relação com ele e distinta dele; e “a Palavra era Deus”, partilhando a própria natureza de Deus. Em grego, “Deus”, na última oração, vem primeiro e sem artigo, o que gramáticos como Philip Harner entendem como descrição do que a Palavra é, e não como identificação dela com o Pai, a quem João acabara de chamar “Deus”.',
    ],
    'JHN.1.3': [
      'Tudo o que existe veio a existir (ἐγένετο) por meio da Palavra, e a segunda metade do versículo fecha todas as brechas: nem uma só coisa que veio a existir veio a existir sem ela. Isso coloca a Palavra fora da categoria das coisas feitas — argumento que Agostinho usou contra os arianos e que John Piper retoma hoje. Alguns leitores antigos, entre eles Ireneu e Agostinho, dividiam a frase de outro modo, ligando “o que foi feito” ao versículo 4 (ὃ γέγονεν ἐν αὐτῷ ζωὴ ἦν, “o que veio a existir nele era vida”). O texto grego de Nestle–Aland (28ª edição) também pontua assim. Lutero e Calvino discutem as duas opções e mantêm as palavras no versículo 3, como fazem a BSB, a KJV e a WEB — e, em português, a Bíblia Livre.',
    ],
    'JHN.1.5': [
      'Em “a luz brilha”, o verbo está no presente — a luz continua brilhando. A segunda oração usa um verbo no aoristo, κατέλαβεν, que pode significar que as trevas não venceram a Luz ou que não a compreenderam (compare a BSB e a BPM com a KJV e a Bíblia Livre); o painel de perspectivas apresenta as duas leituras. Seja como for, o versículo antecipa todo o Evangelho: rejeição, cruz e uma Luz que não se apaga.',
    ],
    'JHN.1.9': [
      'A “luz verdadeira” é a luz genuína, em oposição a luzes parciais ou emprestadas, como João Batista (1:8). O particípio grego traduzido por “que vem ao mundo” pode descrever a Luz (BSB, WEB e BPM: a Luz estava vindo ao mundo) ou “todo ser humano” (KJV: “every man that cometh into the world”; assim também a Bíblia Livre: “todo ser humano que vem ao mundo”); sua forma admite as duas coisas. Lutero insiste em que a luz aqui referida é a luz da graça em Cristo, e não apenas a razão natural.',
    ],
    'JHN.1.12': [
      'Receber Jesus é definido como crer “em seu nome” — confiar em quem ele é. A essas pessoas ele dá o direito (ἐξουσία, autoridade) de se tornarem filhos de Deus (τέκνα θεοῦ). Essa condição é um dom, não um direito de nascença, e por isso o versículo 13 exclui de imediato o sangue, o desejo humano e a vontade de um marido como sua origem. R. Alan Culpepper argumentou que este versículo é o eixo sobre o qual gira todo o prólogo.',
    ],
    'JHN.1.14': [
      'O versículo gira em torno de três verbos. A Palavra se fez (ἐγένετο) carne — entrando na humanidade frágil e mortal, e não apenas aparentando ser humana. Ela habitou (ἐσκήνωσεν, “armou sua tenda”) entre nós — a linguagem do tabernáculo onde habitava a glória de Deus. E vimos (ἐθεασάμεθα) a sua glória — o testemunho dos que o conheceram. Essa glória é “glória do unigênito do Pai”, e seu caráter é “cheio de graça e de verdade”, lembrando o amor e a fidelidade da aliança que Deus proclamou a Moisés (Êx 34:6).',
    ],
    'JHN.1.16': [
      '“E de sua plenitude recebemos todos também graça por graça.” O grego, χάριν ἀντὶ χάριτος, é literalmente “graça por (ou em lugar de) graça” e foi lido de três maneiras principais: graça acumulada sobre graça, um dom após outro (BSB, WEB; em português, a BPM: “graça sobre graça”); a graça derramada sobre Cristo que flui para os crentes, como por um canal (Calvino); ou uma nova graça que substitui a anterior — o dom gracioso da Lei por meio de Moisés sucedido pela plenitude da graça em Cristo, o que se ajusta ao versículo 17 (D. A. Carson; John Piper). Matthew Henry, chamando a expressão de “singular”, lista as três entre seis sentidos possíveis.',
    ],
    'JHN.1.17': [
      'Moisés e Jesus Cristo estão lado a lado: “a Lei foi dada por Moisés”; a graça e a verdade vieram por Jesus Cristo. Não se trata de um contraste entre uma Lei má e um evangelho bom — a própria Lei foi dom de Deus —, mas entre um dom que apontava para a frente e a realidade para a qual ele apontava. E aqui, pela primeira vez no Evangelho, a Palavra recebe um nome: Jesus Cristo.',
    ],
    'JHN.1.18': [
      '“A Deus nunca ninguém o viu” lembra a palavra do SENHOR a Moisés: “não me verá homem, e viverá” (Êx 33:20). Aquele que pode dar a conhecer Deus é o Filho único, que está “no seio do Pai”. Os manuscritos mais antigos trazem μονογενὴς θεός (“o único, [ele mesmo] Deus”); os posteriores — seguidos pela KJV (“the only begotten Son”), pela WEB (“the only born Son”) e, em português, pela Bíblia Livre (“o unigênito Filho”) — trazem “Filho”, e o Tyndale House Greek New Testament também traz “Filho”. “No seio do Pai” é a tradução literal de κόλπος (a BSB diz “at the Father’s side”); João usa essa palavra apenas mais uma vez, quando o discípulo amado está reclinado “no seio de Jesus” (13:23).',
    ],
    'JHN.1.21': [
      'A delegação oferece a João os papéis mais esperados antes do fim: Elias (Ml 4:5) e o Profeta semelhante a Moisés (Dt 18:15), depois que ele já negou ser o Cristo. Ele recusa todos. Sua negação de ser Elias parece colidir com as palavras de Jesus em Mateus 11:14, mas João recusa a identidade que seus interrogadores tinham em mente, ao passo que Jesus fala do papel que João cumpriu “no espírito e virtude de Elias” (Lc 1:17).',
    ],
    'JHN.1.29': [
      '“Eis o Cordeiro de Deus, que tira o pecado do mundo.” O particípio αἴρων, “que tira”, está no presente: é isso o que o Cordeiro faz. Por trás do título estão o Servo semelhante a um cordeiro de Isaías 53:7 (a Septuaginta usa a mesma palavra, ἀμνός), o cordeiro da Páscoa (Êx 12; João 19:36) e os cordeiros diários do templo (Êx 29:38–39). A expressão “do mundo” vai além de Israel: o Cordeiro trata do pecado de toda a humanidade.',
    ],
    'JHN.1.34': [
      'O testemunho do Batista atinge seu clímax: “este é o Filho de Deus”. Alguns manuscritos trazem, em vez disso, o Escolhido de Deus (ἐκλεκτός) — um eco de Isaías 42:1, onde Deus põe o seu Espírito sobre o seu Servo escolhido. O Novo Testamento Grego da SBL adota essa leitura (e as notas da Tyndale a comentam), ao passo que a maioria das edições, bem como a BSB, a KJV e a WEB — e as três versões em português deste aplicativo —, trazem “Filho”.',
    ],
    'JHN.1.51': [
      'O capítulo termina com o primeiro dos ditos de João introduzidos pelo duplo “Em verdade, em verdade” (ἀμὴν ἀμήν). Jesus promete a Natanael — e, com um “vos” plural, a todos os discípulos — que verão o céu aberto e os anjos de Deus subindo e descendo sobre o Filho do Homem. A imagem é a escada de Jacó em Betel (Gn 28:12): o próprio Jesus é o elo entre o céu e a terra, a verdadeira “casa de Deus”.',
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Conceitos (índice de busca do motor)                                */
  /* ------------------------------------------------------------------ */
  concepts: {
    'john-1:concept:logos': {
      label: 'A Palavra (Logos)',
      aliases: [
        'palavra',
        'a palavra',
        'verbo',
        'o verbo',
        'logos',
        'o logos',
        'palavra de deus',
        'palavra da vida',
        'no princípio era a palavra',
        'no principio era a palavra',
        'no princípio era o verbo',
        'palavra grega por trás de palavra',
        'palavra grega por tras de palavra',
        'qual é a palavra grega por trás de palavra',
        'o que significa logos',
        'o que é o logos',
        'dabar',
        'davar',
        'memra',
        'fílon',
        'filon',
        'heráclito',
        'heraclito',
        'estoicos',
        'estoico',
        'filosofia grega',
        'público original',
        'publico original',
        'leitores originais',
        'primeiros leitores',
      ],
      answer:
        'Por trás de “Palavra” está o grego λόγος (logos), o termo comum para palavra, mensagem ou relato. Para os leitores do Antigo Testamento grego, ele lembrava a palavra criadora e profética de Deus (em hebraico, dāvār; pela palavra do SENHOR foram feitos os céus, Sl 33:6); os leitores gregos ouviam nele o princípio racional por trás do mundo. João retoma as duas coisas e vai além delas: essa Palavra estava junto de Deus, era Deus e se fez carne — a própria autoexpressão de Deus numa pessoa (1:1, 14, 18). (As Bíblias da tradição de Almeida dizem “o Verbo”, do latim Verbum.)',
    },
    'john-1:concept:genesis': {
      label: 'No princípio: João e Gênesis',
      aliases: [
        'gênesis',
        'genesis',
        'gênesis 1',
        'genesis 1',
        'no princípio',
        'no principio',
        'princípio',
        'principio',
        'arche',
        'archē',
        'criação',
        'criacao',
        'criado',
        'nova criação',
        'nova criacao',
        'todas as coisas foram feitas',
        'por ela foram feitas todas as coisas',
        'por ele foram feitas todas as coisas',
        'relação com gênesis',
        'como joão 1 se relaciona com gênesis',
      ],
      answer:
        'João começa com as mesmas duas palavras do Gênesis grego, Ἐν ἀρχῇ, “No princípio”. Em seguida, reconta a criação: todas as coisas foram feitas por meio da Palavra (1:3), e a vida e a luz brilham nas trevas (1:4–5; compare Gn 1:3). A diferença está no verbo — em Gênesis, Deus “criou”; em João, a Palavra já “era”. Aquele por meio de quem o mundo foi feito traz agora uma nova criação, fazendo das pessoas filhos de Deus (1:12–13).',
    },
    'john-1:concept:deity': {
      label: '“A Palavra era Deus”',
      aliases: [
        'a palavra era deus',
        'palavra era deus',
        'o verbo era deus',
        'divindade',
        'divindade de cristo',
        'deidade de cristo',
        'divindade de jesus',
        'jesus é deus',
        'jesus e deus',
        'jesus era deus',
        'um deus',
        'theos',
        'junto de deus',
        'trindade',
        'ário',
        'ario',
        'ariano',
        'arianismo',
        'niceia',
        'nicéia',
        'credo niceno',
        'niceno',
        'cristologia',
        'cristológico',
        'quem é jesus',
        'quem jesus é',
        'preexistência',
        'preexistencia',
        'o que este capítulo ensina sobre quem é jesus',
      ],
      answer:
        'João 1:1 diz tanto que a Palavra estava “junto de Deus” — distinta do Pai — quanto que ela “era Deus”. Em grego, θεός vem primeiro e sem artigo, o que ressalta o que a Palavra é: ela tem a própria natureza de Deus, sem ser idêntica ao Pai. O versículo 3 a coloca do lado do Criador em relação a tudo o que foi feito; por isso a igreja do século IV, respondendo a Ário, confessou o Filho como “gerado, não criado”.',
    },
    'john-1:concept:incarnation': {
      label: 'A Palavra se fez carne',
      aliases: [
        'encarnação',
        'encarnacao',
        'se fez carne',
        'fez-se carne',
        'feito carne',
        'a palavra se fez carne',
        'o verbo se fez carne',
        'carne',
        'sarx',
        'natal',
        'humano',
        'humanidade de jesus',
        'versículo 14',
        'versiculo 14',
        'explique o versículo 14',
        'explique o versiculo 14',
      ],
      answer:
        'A Palavra “se fez carne” (1:14) significa que a Palavra eterna entrou numa vida humana plena — “carne” no sentido bíblico de humanidade frágil e mortal — sem deixar de ser Deus. Crisóstomo ressaltou que a Palavra não se transformou em carne, mas tomou a carne para si; Agostinho notou que era justamente isso que os filósofos não podiam dizer. João acrescenta, com a voz dos que o conheceram: “vimos sua glória”.',
    },
    'john-1:concept:tabernacle': {
      label: 'Habitação e glória: o tabernáculo',
      aliases: [
        'habitou',
        'habitar',
        'habitação',
        'habitacao',
        'habitou entre nós',
        'habitou entre nos',
        'tabernáculo',
        'tabernaculo',
        'tabernaculou',
        'armou sua tenda',
        'armou a sua tenda',
        'tenda',
        'skenoo',
        'skēnoō',
        'glória',
        'gloria',
        'doxa',
        'shekinah',
        'shekiná',
        'templo',
      ],
      answer:
        '“Habitou” traduz σκηνόω, “armar uma tenda”, de σκηνή, a palavra grega para o tabernáculo. João está lembrando a tenda onde Deus habitava no meio de Israel e cuja glória enchia o santuário (Êx 25:8; 40:34–35) — por isso acrescenta de imediato: “vimos sua glória”. A presença de Deus, antes concentrada no tabernáculo e no templo, encontra-se agora em Jesus (compare 2:19–21).',
    },
    'john-1:concept:monogenes': {
      label: 'Unigênito / único',
      aliases: [
        'unigênito',
        'unigenito',
        'filho unigênito',
        'filho unigenito',
        'unigênito filho',
        'filho único',
        'filho unico',
        'único filho',
        'monogenes',
        'monogenēs',
        'único',
        'gerado',
        'geração eterna',
        'geracao eterna',
        'gerado não criado',
        'gerado, não criado',
        'o que significa unigênito',
        'interpretações de unigênito',
      ],
      answer:
        'A palavra grega é μονογενής (monogenēs), usada para um filho único (Lc 7:12) e para Isaque como filho singular de Abraão (Hb 11:17). A KJV, seguindo o latim, diz “only begotten”, e a Bíblia Livre, na tradição de Almeida, “unigênito”; a BSB diz “one and only”, e a NBV, “Filho único”. Desde Dale Moody (1953), muitos a leem como “único”, enquanto estudiosos recentes, como Charles Lee Irons, defendem “unigênito”. Os dois lados afirmam que Jesus é, de modo único, o Filho e plenamente Deus; em 1:18, os manuscritos mais antigos chegam a chamá-lo de “o único, [ele mesmo] Deus”.',
    },
    'john-1:concept:light': {
      label: 'Luz e trevas',
      aliases: [
        'luz',
        'trevas',
        'escuridão',
        'escuridao',
        'phos',
        'phōs',
        'skotia',
        'luz verdadeira',
        'a luz verdadeira',
        'luz dos homens',
        'luz dos seres humanos',
        'vencer',
        'venceram',
        'não a venceram',
        'superou',
        'compreender',
        'compreenderam',
        'não a compreenderam',
        'katalambano',
        'katalambanō',
        'versículo 5',
        'versiculo 5',
      ],
      answer:
        'A Palavra de João é vida e “a luz dos seres humanos” (1:4), ecoando a primeira palavra criadora de Deus: “Haja luz”. A Luz continua a brilhar, e a escuridão “não a superou” (BPM; na BSB, “has not overcome it”) — ou as trevas “não a compreenderam” (Bíblia Livre; na KJV, “comprehended it not”): o verbo καταλαμβάνω pode significar as duas coisas. O único outro uso em João (12:35, à parte o disputado 8:3–4) é hostil, o que favorece a tradução “vencer”, da BSB e da WEB; o painel de perspectivas apresenta as duas leituras.',
    },
    'john-1:concept:grace-truth': {
      label: 'Graça e verdade',
      aliases: [
        'graça',
        'graca',
        'graça e verdade',
        'graça e de verdade',
        'graça por graça',
        'graça sobre graça',
        'graca sobre graca',
        'charis',
        'verdade',
        'aletheia',
        'plenitude',
        'lei',
        'moisés',
        'moises',
        'hesed',
        'chesed',
        'benignidade',
        'amor leal',
        'versículo 16',
        'versiculo 16',
        'versículo 17',
        'versiculo 17',
      ],
      answer:
        'χάρις (graça) aparece apenas no prólogo do Evangelho de João (1:14, 16, 17). “Cheio de graça e de verdade” lembra a autodescrição de Deus a Moisés, “grande em benignidade e verdade” (Êx 34:6). Em 1:16, “graça por graça” (na BPM, “graça sobre graça”) foi lido como graça acumulada sobre graça, como a graça que flui para nós a partir da graça derramada sobre Cristo (Calvino) ou como a graça de Cristo que sucede a graça da Lei dada por meio de Moisés (Carson, Piper) — o que se ajusta a 1:17. Matthew Henry lista as três entre seis sentidos possíveis.',
    },
    'john-1:concept:revelation': {
      label: 'O Filho dá a conhecer Deus',
      aliases: [
        'deu a conhecer',
        'o declarou',
        'ele o declarou',
        'declarou',
        'tornou conhecido',
        'exegese',
        'exegeomai',
        'exēgeomai',
        'ninguém jamais viu a deus',
        'nunca ninguém viu a deus',
        'a deus nunca ninguém o viu',
        'ver a deus',
        'ver deus',
        'seio do pai',
        'no seio do pai',
        'ao lado do pai',
        'versículo 18',
        'versiculo 18',
        'revelação',
        'revelacao',
      ],
      answer:
        '“A Deus nunca ninguém o viu; o unigênito Filho, que está no seio do Pai, ele o declarou” (1:18). O verbo ἐξηγέομαι, em outros lugares, significa relatar ou narrar; aqui, seu objeto é Deus. Moisés não pôde ver o rosto de Deus (Êx 33:20), mas o Filho, que está no seio do Pai, narrou Deus numa vida humana — de modo que Jesus pode dizer mais tarde: “Quem a mim tem visto, já tem visto ao Pai” (14:9).',
    },
    'john-1:concept:lamb': {
      label: 'O Cordeiro de Deus',
      aliases: [
        'cordeiro',
        'cordeiro de deus',
        'o cordeiro de deus',
        'amnos',
        'páscoa',
        'pascoa',
        'cordeiro pascal',
        'cordeiro da páscoa',
        'sacrifício',
        'sacrificio',
        'tira o pecado',
        'que tira o pecado do mundo',
        'pecado do mundo',
        'expiação',
        'expiacao',
        'versículo 29',
        'versiculo 29',
        'por que jesus é chamado de cordeiro de deus',
      ],
      answer:
        '“Eis o Cordeiro de Deus, que tira o pecado do mundo” (1:29). A palavra ἀμνός liga Jesus ao Servo silencioso, semelhante a um cordeiro, de Isaías 53:7 e aos cordeiros diários do templo; o Evangelho de João também emoldura sua morte com a Páscoa (19:14, 36). O Cordeiro pertence a Deus e tira o pecado não só de Israel, mas do mundo.',
    },
    'john-1:concept:baptist': {
      label: 'João Batista e o testemunho',
      aliases: [
        'joão batista',
        'joao batista',
        'o batista',
        'batista',
        'testemunho',
        'testemunha',
        'testemunhar',
        'testemunhou',
        'voz que clama no deserto',
        'voz do que clama no deserto',
        'elias',
        'o profeta',
        'és tu elias',
        'batizar',
        'batismo',
        'pomba',
        'espírito descendo',
        'vinde e vede',
        'vem e vê',
        'venham e vejam',
      ],
      answer:
        'João Batista é apresentado sobretudo como testemunha: ele “não era a Luz”, mas veio testemunhar dela (1:8). Recusa todos os títulos que lhe oferecem — Cristo, Elias, o Profeta —, chamando a si mesmo apenas de “voz” (Is 40:3), e aponta para Jesus como o Cordeiro de Deus e o Filho de Deus, sobre quem repousa o Espírito (1:29–34). Josefo confirma quão amplamente João era conhecido, e Atos 19 sugere que seu movimento sobreviveu a ele.',
    },
    'john-1:concept:children': {
      label: 'Filhos de Deus e novo nascimento',
      aliases: [
        'filhos de deus',
        'ser filho de deus',
        'nascidos de deus',
        'gerados de deus',
        'novo nascimento',
        'nascer de novo',
        'nascido de novo',
        'adoção',
        'adocao',
        'poder de serem feitos filhos de deus',
        'direito de se tornarem filhos',
        'o receberam',
        'crer em seu nome',
        'creem em seu nome',
        'versículo 12',
        'versiculo 12',
        'versículo 13',
        'versiculo 13',
      ],
      answer:
        'A todos os que recebem a Palavra — os que creem em seu nome — ela dá o direito de se tornarem filhos de Deus, gerados não por descendência nem por decisão humana, mas de Deus (1:12–13). R. Alan Culpepper argumentou que este é o eixo do prólogo. Crisóstomo viu nisso o propósito da encarnação: o Filho de Deus tornou-se Filho do Homem para fazer dos filhos dos homens filhos de Deus.',
    },
  },
};

export default overlay;
