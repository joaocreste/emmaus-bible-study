import type { VerseRef } from '../../../../domain/models';
import type { StudyOverlay } from '../types';

/**
 * Romanos 8 — overlay em português do Brasil.
 * Citações bíblicas entre aspas seguem a Bíblia Livre (BLIVRE); fora disso, paráfrase sem aspas.
 * Citações verificadas (comentário) ficam em inglês; aqui só a tradução livre (quoteTranslation).
 */
const v = (verse: number): VerseRef => ({ book: 'ROM', chapter: 8, verse });

const overlay: StudyOverlay = {
  studyId: 'romans-8',
  locale: 'pt',
  title: 'Romanos 8',
  subtitle: 'A vida no Espírito — de nenhuma condenação a nenhuma separação',
  summary:
    'Romanos 8 é o ápice do argumento de Paulo nos capítulos 5–8. Começa com “nenhuma condenação há para os que estão em Cristo Jesus” (8:1) e termina com a certeza de que nada em toda a criação “poderá nos separar do amor de Deus, que está em Cristo Jesus, nosso Senhor” (8:39). Entre um ponto e outro, Paulo mostra o Espírito Santo fazendo o que a lei não podia fazer: dando vida, guiando os filhos de Deus, suscitando o clamor “Aba, Pai!” e intercedendo em nossa fraqueza — a palavra grega para Espírito aparece aqui 21 vezes, mais do que em qualquer outro capítulo do Novo Testamento. O sofrimento presente é situado dentro do propósito de Deus de renovar a criação e redimir o nosso corpo, e o capítulo termina num tribunal onde nenhum acusador pode prevalecer, porque Deus justifica e Cristo intercede.',
  opening:
    'Boas-vindas a Romanos 8 — um capítulo que muitos cristãos amam acima de quase todos os outros. Ele começa com “nenhuma condenação” e termina com a promessa de que nada pode nos separar do amor de Deus; no meio, Paulo descreve a obra do Espírito, a nossa adoção como filhos de Deus e uma esperança grande o bastante para sustentar o sofrimento presente. Toque numa palavra destacada para ver o grego por trás dela, ou me pergunte sobre um versículo, uma palavra ou o que cristãos de todos os séculos disseram a respeito.',
  matchTopics: [
    'romanos 8',
    'romanos oito',
    'romanos capítulo 8',
    'rm 8',
    'vida no espírito',
    'a vida no espírito',
    'nenhuma condenação',
    'nenhuma condenação há',
    'já não há condenação',
    'nenhuma separação',
    'nada pode nos separar do amor de deus',
    'quem nos separará do amor de cristo',
    'mais que vencedores',
    'todas as coisas cooperam para o bem',
    'todas as coisas contribuem para o bem',
    'se deus é por nós',
    'corrente de ouro',
    'cadeia de ouro',
    'espírito de adoção',
    'aba pai',
    'gemidos inexprimíveis',
    'primícias do espírito',
  ],
  suggestedQuestions: [
    'O que significa condenação no versículo 1?',
    'O que Paulo quer dizer com “carne” aqui?',
    'Qual é a palavra grega por trás de “adoção”?',
    'O que Tim Keller disse sobre isso?',
    'Como os primeiros leitores teriam entendido “Aba, Pai”?',
    'Onde mais Paulo fala sobre isso?',
    'Explique o versículo 28 com mais detalhes.',
    'Há diferentes interpretações teológicas dos versículos 29–30?',
    'Como este capítulo se relaciona com o restante de Romanos?',
    '“Aba” significa “papai”?',
  ],

  keyWords: {
    'romans-8:kw:katakrima': {
      english: 'condenação',
      anchors: [{ verse: v(1), phrases: { BLIVRE: 'condenação', NBV: 'condenação', BPM: 'condenação' } }],
      grammar: 'Substantivo, nominativo singular neutro',
      basicMeaning: 'condenação; a pena que se segue a uma sentença',
      semanticRange: [
        'condenação — o veredito adverso pronunciado contra alguém (assim a maioria das versões)',
        'pena — a sentença executada (glosa de Abbott-Smith; a Revised Version inglesa traz “condemnation”)',
      ],
      significance:
        'Κατάκριμα aparece apenas três vezes no Novo Testamento, todas em Romanos: duas em 5:16–18, onde a única transgressão de Adão traz condenação sobre todos, e aqui. Assim, 8:1 responde diretamente a 5:18 — para os que estão “em Cristo Jesus”, o veredito e a pena que pesavam sobre a humanidade em Adão já não valem. Paulo explica em seguida por quê: Deus “condenou o pecado na carne” do seu Filho (8:3), e, no fim, ninguém pode condenar aqueles a quem Deus justifica (8:34).',
      caution:
        '“Nenhuma condenação” é um veredito sobre a situação de uma pessoa diante de Deus. Não significa que os crentes já não pequem nem lutem — Paulo ainda os chama a fazer morrer, pelo Espírito, “as ações do corpo” (8:13).',
      notableNotes: [
        '“O julgamento de uma só transgressão trouxe condenação” — a transgressão de Adão.',
        '“Uma transgressão resultou em condenação sobre todos os seres humanos” — o veredito que 8:1 reverte para os que estão em Cristo.',
      ],
    },
    'romans-8:kw:katakrino': {
      english: 'condenou',
      anchors: [
        { verse: v(3), phrases: { BLIVRE: 'condenou o pecado', BPM: 'condenou o pecado' } },
        { verse: v(34), phrases: { BLIVRE: 'condenará', NBV: 'condenará', BPM: 'condena' } },
      ],
      grammar:
        'Verbo, aoristo do indicativo ativo, 3ª pessoa do singular (8:3); particípio em 8:34 — classificado como presente pelo TAGNT, embora a acentuação da forma impressa (κατακρινῶν) seja a de um particípio futuro: “quem condenará?”',
      basicMeaning: 'condenar; dar sentença contra',
      semanticRange: [
        'dar sentença contra alguém, condenar uma pessoa (Mc 14:64; Jo 8:10–11)',
        'na voz passiva: ser condenado (Rm 14:23; 1Co 11:32)',
        'em sentido figurado, condenar por contraste ou pelo exemplo (Mt 12:41–42; Hb 11:7 — Abbott-Smith também classifica Rm 8:3 aqui)',
      ],
      significance:
        'Paulo usa o verbo aparentado (18 vezes no Novo Testamento) mais duas vezes no capítulo, ecoando o substantivo de 8:1. Em 8:3, o sujeito é Deus: ao enviar o seu Filho como oferta pelo pecado, ele “condenou o pecado na carne” — a sentença recaiu sobre o pecado, em Cristo, e não sobre os que estão nele (assim a nota da Tyndale: Deus condenou o pecado em Cristo, nosso substituto). Em 8:34, a pergunta “Quem os condenará?” fica sem resposta, porque aquele que morreu, ressuscitou e agora intercede é o próprio Cristo.',
      caution:
        'O léxico de Abbott-Smith classifica 8:3 no sentido figurado (condenar por contraste); a maioria dos comentaristas o lê como a sentença judicial de Deus executada sobre o pecado na carne de Cristo. Quem decide é o contexto, não o verbete do dicionário.',
      notableNotes: [
        'O conselho: “todos o condenaram como culpado de morte” — o próprio Jesus condenado.',
        '“Nem eu também te condeno” — Jesus à mulher surpreendida em adultério.',
        '“Quem os condenará?” — a pergunta que o capítulo deixa sem resposta possível.',
      ],
    },
    'romans-8:kw:sarx': {
      english: 'carne',
      anchors: [
        { verse: v(4), phrases: { BLIVRE: 'carne', NBV: 'natureza pecaminosa', BPM: 'carne' } },
        { verse: v(13), phrases: { BLIVRE: 'carne', BPM: 'carne' } },
      ],
      grammar: 'Substantivo, acusativo singular feminino (κατὰ σάρκα, “segundo a carne”, 8:4)',
      basicMeaning: 'carne',
      semanticRange: [
        'a substância física do corpo; o próprio corpo',
        'o ser humano em sua fragilidade e mortalidade (“toda carne”)',
        'a descendência e o parentesco naturais (“segundo a carne”, Rm 1:3; 9:3, 5)',
        'no uso ético de Paulo, a humanidade como sede e veículo do desejo pecaminoso, em oposição ao Espírito (Rm 8:4–13; Gl 5:16–17)',
      ],
      significance:
        'Σάρξ aparece 13 vezes só em 8:3–13 (147 vezes no Novo Testamento). Paulo não está dizendo que o corpo é mau: Deus condenou o pecado na carne, não a carne em si (8:3), e o Espírito dará vida aos nossos corpos mortais (8:11). “Carne”, aqui, é a humanidade tal como está em Adão — fraca, autossuficiente, inclinada ao pecado e em “inimizade contra Deus” (8:7). “Segundo a carne” e “segundo o Espírito” descrevem dois modos de existir e duas fontes de vida, não duas partes da pessoa.',
      caution:
        'Não leia “carne” neste capítulo como “corpo físico” ou “sexualidade”. Algumas traduções vertem “natureza pecaminosa” (como a NBV em 8:4, ou a NLT usada pelas notas da Tyndale); o contexto decide cada ocorrência — compare o neutro “quanto à carne” em Romanos 1:3 e 9:5.',
      notableNotes: [
        'Sentido neutro: o Filho que, “quanto à carne, nasceu da descendência de Davi”.',
        '“Em mim, isto é, em minha carne, não habita bem algum” — a luta logo antes do capítulo 8.',
        '“A carne deseja contra o Espírito” — a outra grande passagem de Paulo sobre carne e Espírito.',
      ],
    },
    'romans-8:kw:pneuma': {
      english: 'Espírito',
      anchors: [
        { verse: v(2), phrases: { BLIVRE: 'Espírito de vida', NBV: 'Espírito doador da vida', BPM: 'Espírito da vida' } },
        { verse: v(16), phrases: { BLIVRE: 'O próprio Espírito', NBV: 'O próprio Espírito', BPM: 'O próprio Espírito' } },
      ],
      grammar: 'Substantivo, genitivo singular neutro (τοῦ πνεύματος τῆς ζωῆς, “do Espírito da vida”, 8:2)',
      basicMeaning: 'espírito, sopro; o Espírito (Santo)',
      semanticRange: [
        'vento; sopro',
        'o espírito humano — “o nosso espírito” (8:16)',
        'uma disposição ou estado de ânimo — “o espírito de escravidão” (8:15)',
        'o Espírito Santo — “o Espírito de Deus”, “o Espírito de Cristo” (8:9)',
      ],
      significance:
        'Vinte e uma das 34 ocorrências de πνεῦμα em Romanos estão neste capítulo, contra cinco nos capítulos 1–7; nenhum outro capítulo do Novo Testamento chega perto (1 Coríntios 12 vem em seguida, com 12). O Espírito é “o Espírito de Deus” e “o Espírito de Cristo” numa única frase (8:9). Ele liberta (8:2), dá vida agora e ressurreição depois (8:10–11), guia os filhos de Deus (8:14), dá testemunho com o nosso espírito (8:16) e intercede por nós (8:26–27).',
      caution:
        'Em alguns versículos, os tradutores precisam escolher entre “Espírito” e “espírito” — compare 8:10 (a BLIVRE traz “o Espírito é vida”; a NBV, “o espírito está vivo”; em inglês, a KJV e a BSB divergem da mesma forma) e 8:15 (“o espírito de escravidão”). As maiúsculas são uma decisão interpretativa; o texto grego não marca a diferença.',
      notableNotes: [
        '“O amor de Deus está derramado em nossos corações pelo Espírito Santo” — anunciado antes do capítulo 8.',
        'A “novidade de espírito” em contraste com a “velhice da norma escrita”.',
        '“Andai no Espírito” — a mesma ética em Gálatas.',
      ],
    },
    'romans-8:kw:phronema': {
      english: 'mentalidade (inclinação da mente)',
      anchors: [{ verse: v(6), phrases: { BLIVRE: 'mentalidade da carne', BPM: 'mente da carne' } }],
      grammar: 'Substantivo, nominativo singular neutro',
      basicMeaning: 'o pensamento; aquilo em que a mente está fixada, propósito',
      semanticRange: ['o que está na mente: pensamento, perspectiva, mentalidade', 'propósito (a glosa do STEPBible)'],
      significance:
        'Os quatro usos deste substantivo no Novo Testamento estão em Romanos 8 (8:6 duas vezes, 8:7, 8:27). A carne e o Espírito têm, cada um, a sua “mentalidade” — uma orientação da vontade e do desejo, não apenas um conjunto de ideias (a nota da Tyndale sobre o verbo aparentado em 8:5 diz o mesmo). Essa orientação resulta ou em morte ou em “vida e paz” (8:6); e em 8:27 o Pai conhece “a intenção do Espírito” — a mesma palavra, que a BLIVRE ali traduz por “intenção” — enquanto o Espírito intercede.',
      notableNotes: [
        '“A mentalidade da carne é inimizade contra Deus.”',
        '“Aquele que examina os corações sabe qual é a intenção do Espírito” — a mesma palavra, usada a respeito do Espírito.',
      ],
    },
    'romans-8:kw:huiothesia': {
      english: 'adoção',
      anchors: [
        { verse: v(15), phrases: { BLIVRE: 'adoção', NBV: 'adota', BPM: 'adoção' } },
        { verse: v(23), phrases: { BLIVRE: 'adoção', NBV: 'adotando', BPM: 'adoção' } },
      ],
      grammar: 'Substantivo, genitivo singular feminino (πνεῦμα υἱοθεσίας, “Espírito de adoção”, 8:15)',
      basicMeaning: 'adoção (como filho)',
      semanticRange: [
        'adoção de um filho ou filha (termo jurídico comum nas inscrições)',
        'a relação de Deus com Israel (Rm 9:4)',
        'a relação de Deus com os cristãos (Rm 8:15; Gl 4:5; Ef 1:5)',
        'sua consumação futura (Rm 8:23)',
      ],
      significance:
        'Só Paulo usa esta palavra no Novo Testamento (5 vezes), e Romanos 8 a emprega tanto para o presente quanto para o futuro: o Espírito de adoção já foi recebido (8:15), e ainda assim continuamos “esperando a adoção, isto é, a redenção do nosso corpo” (8:23). Paulo toma emprestado um termo jurídico greco-romano — o filho adotado recebia todos os direitos de herdeiro (nota da Tyndale sobre 8:15) —, mas o preenche com a história de Israel, pois “a adoção” pertencia primeiro a Israel (9:4; Êx 4:22).',
      caution:
        'Evite impor a Paulo cada detalhe do direito romano de adoção; as notas da Tyndale também apontam para a imagem veterotestamentária de Israel como filho de Deus (Êx 4:22; Os 11:1).',
      notableNotes: [
        '“A quem pertencem a adoção como filhos” — o privilégio pertencia primeiro a Israel.',
        '“A fim de que nós recebêssemos a adoção como filhos” — o Filho enviado para redimir.',
        '“Nos predestinou como filhos adotados por meio de Jesus Cristo.”',
      ],
    },
    'romans-8:kw:abba': {
      english: 'Aba',
      anchors: [{ verse: v(15), phrases: { BLIVRE: 'Aba', NBV: 'Aba', BPM: 'Abba' } }],
      grammar: 'Substantivo, vocativo singular masculino — palavra aramaica indeclinável escrita em letras gregas',
      basicMeaning: 'pai (aramaico אַבָּא, forma enfática de אַב)',
      semanticRange: [
        'pai — a palavra comum da família em aramaico, usada aqui como invocação direta',
        'no Novo Testamento, sempre acompanhada do grego ὁ πατήρ: “Aba, Pai”',
      ],
      significance:
        'Paulo deixa a palavra aramaica sem tradução numa carta escrita em grego e acrescenta o seu equivalente grego. Os únicos outros usos no Novo Testamento são a oração de Jesus no Getsêmani (Mc 14:36) e Gálatas 4:6, o que sugere que a forma de invocação usada por Jesus se tornou a oração preciosa das igrejas de fala grega. Para Paulo, é o Espírito quem torna possível esse clamor: os crentes oram a Deus como Jesus orava — como filhos, não como escravos.',
      caution:
        'O ensino popular costuma dizer que aba significa “papai” (algumas notas de estudo, incluindo a nota da Tyndale sobre 8:15, ainda o afirmam). James Barr (1988) argumentou que as evidências não sustentam a ideia de linguagem infantil: aba era uma palavra comum da família, usada por filhos e filhas pequenos e adultos, mas o seu matiz é “Pai”, não “papai”.',
      notableNotes: [
        'Jesus no Getsêmani: “Aba, Pai… não se faça o que eu quero, mas sim o que tu queres.”',
        'O Espírito do Filho, enviado aos corações dos crentes, que clama: “Aba, Pai!”',
      ],
    },
    'romans-8:kw:aparche': {
      english: 'primícias',
      anchors: [{ verse: v(23), phrases: { BLIVRE: 'primeiros frutos', NBV: 'amostra', BPM: 'primícias' } }],
      grammar: 'Substantivo, acusativo singular feminino',
      basicMeaning: 'primícias',
      semanticRange: [
        'a primeira porção de um sacrifício ou de uma colheita, oferecida a Deus',
        'as primícias da colheita (Lv 23:10 no Antigo Testamento grego) e da massa (Rm 11:16; cf. Nm 15:20)',
        'em sentido figurado: os primeiros convertidos de uma região (Rm 16:5); o Cristo ressuscitado (1Co 15:20, 23)',
      ],
      significance:
        'Em Levítico 23:10, o Antigo Testamento grego usa exatamente esta palavra para o primeiro feixe da colheita, movido diante do SENHOR antes que se pudesse comer qualquer parte da safra. Paulo chama o Espírito de “primeiros frutos” (assim a BLIVRE; muitas versões dizem “primícias”) que os crentes já possuem — a primeira parcela e a garantia da colheita ainda por vir: a adoção plena e a ressurreição do corpo (8:23). Ele usa a mesma imagem para a ressurreição de Cristo em 1 Coríntios 15:20.',
      notableNotes: [
        '“Cristo ressuscitou dos mortos, e foi feito as primícias dos que dormiram.”',
        'As primícias da massa tornam santa toda a massa.',
      ],
    },
    'romans-8:kw:sunergeo': {
      english: 'cooperar',
      anchors: [{ verse: v(28), phrases: { BLIVRE: 'juntamente contribuem', NBV: 'está operando', BPM: 'funcionam juntas' } }],
      grammar: 'Verbo, presente do indicativo ativo, 3ª pessoa do singular',
      basicMeaning: 'trabalhar com; cooperar',
      semanticRange: [
        'trabalhar juntamente com, cooperar (Mc 16:20; 1Co 16:16; Tg 2:22)',
        'fazer cooperar — sentido transitivo encontrado em autores helenísticos, que alguns adotam para Rm 8:28',
      ],
      significance:
        'O grego de 8:28 admite mais de uma construção, e por isso as traduções diferem: umas dizem que todas as coisas cooperam para o bem (assim a KJV e a WEB; a BLIVRE traz “todas as coisas juntamente contribuem para o bem”), outras que Deus faz todas as coisas cooperarem para o bem (assim a BSB). Um pequeno grupo de manuscritos explicita o sujeito acrescentando “Deus” (ὁ θεός) — leitura adotada pela edição de Westcott–Hort, embora as demais edições presentes nos dados do STEPBible, incluindo o texto bizantino, não a tragam. O léxico de Abbott-Smith registra um sentido intransitivo e outro transitivo. Seja como for, o contexto torna decisivo o propósito de Deus (8:28b–30), e 8:29 define o “bem”: ser conforme à imagem do seu Filho.',
      caution:
        'Paulo não diz que todo acontecimento é bom, nem que tudo acaba bem para todos. A promessa é para o bem “daqueles que amam a Deus, dos que são chamados segundo o seu propósito”, e o bem em vista é a semelhança com Cristo — que pode vir por meio do sofrimento (8:17, 35–36).',
      notableNotes: [
        '“A fé cooperou com as suas obras” — a fé de Abraão agindo com as suas obras.',
        '“Trabalhadores conjuntamente com ele” — o mesmo verbo, para a cooperação humana com Deus.',
      ],
    },
    'romans-8:kw:proginosko': {
      english: 'conheceu de antemão',
      anchors: [{ verse: v(29), phrases: { BLIVRE: 'desde antes conheceu', NBV: 'já conhecia', BPM: 'antepassou' } }],
      grammar: 'Verbo, aoristo segundo do indicativo ativo, 3ª pessoa do singular',
      basicMeaning: 'conhecer de antemão, preconhecer (glosa do STEPBible: “conhecer/escolher”)',
      semanticRange: [
        'conhecer de antemão, de pessoas que sabem algo previamente (At 26:5; 2Pe 3:17)',
        'da presciência de Deus (Rm 8:29; 11:2; 1Pe 1:20)',
      ],
      significance:
        'Toda a cadeia de 8:29–30 depende deste primeiro verbo, e o seu sentido é debatido. O seu objeto são pessoas (“aos que”), não fatos a respeito delas, e no Antigo Testamento “conhecer” pode significar escolher alguém ou pôr nele o seu amor (Am 3:2). Por isso os leitores reformados o entendem como “amou de antemão”; outros o leem como a presciência de Deus a respeito dos que haveriam de crer. O verbo ocorre cinco vezes no Novo Testamento. Veja as perspectivas sobre 8:29–30 em Teologia.',
      caution:
        'Um único verbo não basta para resolver a doutrina da eleição; é preciso pesar também o argumento ao redor (8:28–39) e Romanos 9–11.',
      notableNotes: [
        '“Deus não rejeitou seu povo, o qual desde antes conhecia” — o objeto, de novo, são pessoas.',
        'Cristo “já era conhecido desde antes da fundação do mundo”.',
        'Conhecimento prévio humano: os acusadores de Paulo o conheciam “desde o começo”.',
      ],
    },
  },

  crossReferences: {
    'romans-8:xr:rom-7-24': {
      title: 'De “miserável homem” a “nenhuma condenação”',
      explanation:
        'Romanos 7 termina com um grito — “Quem me livrará deste corpo de morte?” — e com uma ação de graças por meio de Jesus Cristo. Romanos 8:1 tira a conclusão (“Portanto”): a luta do capítulo 7 é real, mas não decide a situação do crente diante de Deus. Onde 7:23 falava da “lei do pecado” que mantém alguém cativo, 8:2 anuncia que “a Lei do Espírito de vida” libertou. A divisão em capítulos é um acréscimo posterior; o argumento de Paulo segue sem interrupção.',
    },
    'romans-8:xr:rom-5-16': {
      title: 'Condenação em Adão, vida em Cristo',
      explanation:
        'Os únicos outros usos de κατάκριμα no Novo Testamento estão aqui: uma só transgressão “resultou em condenação sobre todos os seres humanos”, mas um só ato de justiça “resultou em justificação da vida sobre todos os seres humanos”. Romanos 8:1 aplica 5:18 aos que estão em Cristo — o veredito pronunciado sobre a humanidade em Adão foi substituído.',
    },
    'romans-8:xr:jhn-3-17': {
      title: '“Quem nele crer não é condenado”',
      explanation:
        'As palavras de Jesus a Nicodemos declaram o mesmo veredito: Deus “não mandou seu Filho ao mundo para que condenasse ao mundo; mas sim para que o mundo por ele fosse salvo”, e “quem nele crer não é condenado”. João usa o verbo mais simples κρίνω (“julgar”, aqui no sentido de julgar contra) e liga a libertação da condenação ao crer no Filho; Paulo a liga a estar “em Cristo Jesus”. São dois ângulos de uma mesma união.',
    },
    'romans-8:xr:gal-5-16': {
      title: 'Carne contra Espírito',
      explanation:
        'É o outro tratamento extenso de Paulo sobre carne e Espírito. Gálatas descreve o conflito (“a carne deseja contra o Espírito”) e o fruto do Espírito (5:22–23); Romanos 8 fundamenta o mesmo chamado — andar “segundo o Espírito” (Rm 8:4) ou “no Espírito” (Gl 5:16, 25) — na obra vivificadora do Espírito. Lidos juntos, os dois textos mostram que “carne” é um poder e um modo de vida, não simplesmente o corpo.',
    },
    'romans-8:xr:gal-4-4': {
      title: '“Aba, Pai!” em Gálatas',
      explanation:
        'É o paralelo mais próximo em Paulo. Deus enviou o seu Filho “a fim de que nós recebêssemos a adoção como filhos”, e enviou aos corações dos crentes o Espírito do seu Filho, “que clama: Aba, Pai!” — de modo que “já não és mais servo, mas sim filho; e se és filho, também és herdeiro”. A mesma sequência (adoção, Espírito, o clamor “Aba”, de escravo a filho, herdeiro) percorre Romanos 8:14–17. Em Gálatas, é o Espírito quem clama; em Romanos, somos nós que clamamos pelo Espírito.',
    },
    'romans-8:xr:exo-4-22': {
      title: 'Israel, o primogênito de Deus',
      explanation:
        'Na narrativa do êxodo, Deus chamou Israel de “meu filho, meu primogênito” e ordenou a Faraó que deixasse ir o seu filho. A linguagem de Paulo sobre filhos guiados pelo Espírito e libertos do “espírito de escravidão” lembra essa história (a nota da Tyndale sobre 8:14 cita Êx 4:22; N. T. Wright argumenta que todo o trecho de Romanos 5–8 reconta o êxodo). O Antigo Testamento grego chama Israel de πρωτότοκος de Deus, “primogênito” — o título que Paulo dá a Cristo “entre muitos irmãos” em 8:29.',
    },
    'romans-8:xr:gen-3-17': {
      title: 'A terra amaldiçoada por causa de Adão',
      explanation:
        'Depois do pecado de Adão, Deus disse: “maldita será a terra por causa de ti” — espinhos, fadiga e o retorno ao pó. A afirmação de Paulo de que “a criação ficou sujeita à futilidade… por causa daquele que a sujeitou” remete com toda a naturalidade a esse juízo: John Wesley explicou que aquele que a sujeitou é Deus, remetendo a Gênesis 3:17, e a nota da Tyndale atribui o dano sofrido pela criação à queda de Adão. Romanos acrescenta o que Gênesis apenas insinua: a sujeição foi “na esperança”, e a criação participará da “liberdade da glória dos filhos de Deus”.',
    },
    'romans-8:xr:lev-23-10': {
      title: 'O feixe das primícias',
      explanation:
        'Israel levava ao sacerdote um feixe das primícias da colheita, e o sacerdote o movia diante do SENHOR; não se podia comer pão nem grão “até este mesmo dia, até que tenhais oferecido a oferta de vosso Deus”. O Antigo Testamento grego chama esse feixe de ἀπαρχή, a palavra que Paulo usa para o Espírito em 8:23. O primeiro feixe consagrava e, ao mesmo tempo, prometia a colheita inteira — assim o Espírito é o penhor de Deus da plena redenção ainda por vir.',
    },
    'romans-8:xr:1co-15-20': {
      title: 'Cristo, as primícias da ressurreição',
      explanation:
        'Paulo usa a mesma imagem da colheita para Cristo: ressuscitado como “as primícias dos que dormiram”, seguido pelos “que são de Cristo, em sua vinda”. Romanos 8 mostra o elo entre as duas colheitas: o Espírito daquele que ressuscitou Jesus também dará vida aos nossos corpos mortais (8:11), e nós, que temos os primeiros frutos do Espírito, aguardamos “a redenção do nosso corpo” (8:23).',
    },
    'romans-8:xr:2co-5-2': {
      title: 'Gemendo nesta tenda',
      explanation:
        'Também aqui os crentes gemem (“nesta casa gememos”) — o mesmo verbo (στενάζω) de Romanos 8:23 —, desejando ser revestidos da vida da ressurreição, e é Deus quem “também deu o penhor do Espírito”. As duas passagens mantêm juntos o gemido presente e a glória futura, com o Espírito como garantia entre um e outra.',
    },
    'romans-8:xr:eph-1-13': {
      title: 'O Espírito como garantia da herança',
      explanation:
        'Efésios chama o Espírito Santo de “garantia da nossa herança, até a libertação da propriedade de Deus” — a mesma lógica de Romanos 8:17 e 8:23: herdeiros agora, herança plena e redenção depois, com o Espírito como garantia entre um momento e outro. A nota da Tyndale sobre 8:23 liga as duas passagens.',
    },
    'romans-8:xr:ps-44-22': {
      title: '“Ovelhas para o matadouro”',
      explanation:
        'Paulo cita o salmo grego quase palavra por palavra (Salmo 43:23 na numeração da Septuaginta). O Salmo 44 é o lamento de um povo que não havia esquecido a Deus nem traído a sua aliança e, ainda assim, sofria “por causa de ti”. Citá-lo mostra que o sofrimento não é sinal de rejeição da parte de Deus — os fiéis sempre sofreram por causa dele (Calvino observa o mesmo) —, e Paulo responde de imediato à queixa do salmo: “em todas estas coisas somos mais que vencedores” (8:37).',
    },
    'romans-8:xr:isa-50-8': {
      title: 'Quem me condenará?',
      explanation:
        'No terceiro Cântico do Servo, o Servo declara: “Perto está aquele que me justifica”, e desafia quem pretenda condená-lo. O Antigo Testamento grego traz aqui o mesmo verbo de Paulo (ὁ δικαιώσας με, “aquele que me justificou”) — na tradução inglesa de Brenton, “he that has justified me draws near”. O tribunal de Paulo — “Deus é quem justifica. Quem os condenará?” — ecoa a confiança do Servo e a estende a todos os que pertencem a Cristo.',
    },
    'romans-8:xr:gen-22-12': {
      title: '“Aquele que nem mesmo ao seu próprio Filho poupou”',
      explanation:
        'Abraão foi aprovado porque “não me recusaste o teu filho, o teu único”; o Antigo Testamento grego diz οὐκ ἐφείσω — na tradução inglesa de Brenton, “thou hast not spared thy beloved son” —, o mesmo verbo que Paulo usa em 8:32 (οὐκ ἐφείσατο). A nota da Tyndale vê Gênesis 22 por trás das palavras de Paulo. O contraste é justamente o ponto: Isaque foi poupado no último instante; o próprio Filho de Deus, não.',
    },
    'romans-8:xr:heb-7-25': {
      title: 'Cristo vive para interceder',
      explanation:
        'Hebreus usa o mesmo verbo (ἐντυγχάνω) para o Cristo ressuscitado: “ele vive para sempre para interceder por eles”. Romanos 8 tem dois intercessores — o Espírito em nós (8:26–27) e Cristo à direita de Deus (8:34) —, e Hebreus fundamenta a intercessão de Cristo no seu sacerdócio permanente.',
    },
    'romans-8:xr:ezk-36-26': {
      title: 'O Espírito prometido cumpre a lei',
      explanation:
        'Ezequiel prometeu um novo coração — “porei meu Espírito dentro de vós” — para que o povo de Deus andasse nos seus estatutos (compare Jr 31:33, a lei escrita no coração). Paulo não cita Ezequiel aqui, mas muitos intérpretes ouvem essa promessa por trás de 8:4: “a exigência da lei” se cumpre “em nós, que andamos, não segundo a carne, mas sim, segundo o Espírito”. O que a lei não podia fazer de fora (8:3), o Espírito prometido faz de dentro.',
    },
    'romans-8:xr:rev-21-1': {
      title: '“Eis que eu faço novas todas as coisas”',
      explanation:
        'Romanos 8 vê a criação à espera de ser “liberta da escravidão da degradação”; a visão final do Apocalipse descreve a mesma esperança: “um novo céu e uma nova terra”, sem mais morte nem dor, e aquele que está sentado no trono dizendo: “Eis que eu faço novas todas as coisas.” A nota da Tyndale sobre 8:19–21 cita Ap 21:1–2 a propósito da participação da criação nas bênçãos que Deus prometeu ao seu povo. As duas passagens esperam a renovação do mundo, não a fuga dele.',
    },
    'romans-8:xr:2co-4-16': {
      title: 'Aflição momentânea, glória eterna',
      explanation:
        'Paulo faz o mesmo cálculo em outro lugar: “nossa leve e momentânea aflição nos produz um peso eterno de excelentíssima glória”. Romanos 8:18 diz que as aflições deste tempo presente “nem se comparam” com a glória vindoura; 2 Coríntios acrescenta que a aflição está, de fato, trabalhando em favor dessa glória — algo próximo da promessa de 8:28.',
    },
  },

  context: {
    'romans-8:ctx:authorship': {
      title: 'Paulo, escrevendo de Corinto, por volta de 57 d.C.',
      summary:
        'Paulo muito provavelmente escreveu Romanos durante uma estada de três meses em Corinto, perto do fim da sua terceira viagem missionária (At 20:2–3), por volta de 57 d.C. Estava prestes a levar a coleta para a igreja de Jerusalém (Rm 15:25–26) e esperava visitar Roma a caminho da Espanha (15:24).',
      detail:
        'A recomendação de Febe, de Cencreia — o porto vizinho de Corinto (16:1) —, aponta para o local da escrita. Paulo nunca havia estado em Roma (1:13), de modo que a carta o apresenta, com o seu evangelho, a uma igreja que ele não fundara.',
    },
    'romans-8:ctx:occasion': {
      title: 'Por que Paulo escreveu Romanos',
      summary:
        'A introdução da Tyndale identifica três propósitos: expor o evangelho de Paulo tal como ele o havia forjado ao longo de uns vinte e cinco anos, obter o apoio da igreja de Roma para uma missão na Espanha e sanar uma divisão entre crentes judeus e gentios a respeito da lei (14:1–15:13).',
      detail:
        'Romanos 8 serve aos três propósitos: é o clímax da exposição de Paulo sobre o evangelho (caps. 5–8), dá segurança a missionários e igrejas que sofrem, e a sua linguagem de uma só família de filhos de Deus — judeus e gentios igualmente clamando “Aba, Pai!” — sustenta a unidade que ele recomendará nos capítulos 14–15.',
    },
    'romans-8:ctx:audience': {
      title: 'Uma igreja de crentes judeus e gentios em Roma',
      summary:
        'Os crentes de Roma reuniam-se em várias igrejas domésticas, talvez formadas a princípio por judeus de Roma convertidos no Pentecostes (At 2:10). Depois que o imperador Cláudio expulsou os judeus de Roma (em geral, data-se o fato em 49 d.C.; At 18:2), os cristãos gentios provavelmente assumiram a liderança; segundo uma reconstrução amplamente aceita (seguida pela introdução da Tyndale), surgiram tensões a respeito da lei quando os crentes judeus voltaram.',
      detail:
        'O biógrafo romano Suetônio registra que Cláudio expulsou os judeus de Roma porque viviam provocando tumultos por instigação de Chrestus (Claudius 25.4). Muitos historiadores entendem “Chrestus” como uma referência deturpada a Cristo, embora isso seja debatido. Para Romanos 8, o público misto é importante: “Aba, Pai” une uma palavra aramaica e uma grega, e a linguagem paulina de filiação e herança recorre à história de Israel para uma igreja que aprendia a ser uma só família.',
    },
    'romans-8:ctx:adoption': {
      title: 'A adoção no mundo romano',
      summary:
        'Pelo costume greco-romano, um homem podia adotar um filho e conferir-lhe todos os direitos e privilégios legais de um filho natural, inclusive a herança. A prática chegava à família imperial: Júlio César adotou Otaviano, que governou como Augusto.',
      detail:
        'Os leitores de Paulo na capital conheciam isso. Mas a ideia de Paulo também está enraizada no Antigo Testamento, onde Israel é filho de Deus (Êx 4:22; Os 11:1) e “a adoção” pertence a Israel (Rm 9:4). Em Romanos 8, a adoção é ao mesmo tempo uma condição presente (8:15) e uma consumação futura — “a adoção, isto é, a redenção do nosso corpo” (8:23).',
    },
    'romans-8:ctx:abba': {
      title: 'Aba: a palavra aramaica com que Jesus orava',
      summary:
        'Aba é a palavra aramaica para “pai”, a língua do dia a dia na Galileia de Jesus. O Evangelho de Marcos a preserva nos lábios de Jesus no Getsêmani (Mc 14:36), e Paulo a cita duas vezes como o clamor dos crentes, sempre com a palavra grega para “Pai” ao lado (Rm 8:15; Gl 4:6).',
      detail:
        'O fato de a palavra aramaica ter sobrevivido sem tradução em igrejas de fala grega sugere o quanto os primeiros cristãos prezavam orar como Jesus orava. Era uma palavra comum da família, usada por filhos pequenos e adultos; James Barr (1988) argumentou que as evidências não sustentam a afirmação popular de que ela significa “papai”. John Wesley sugeriu que, ao usar tanto a palavra aramaica (que ele chama de siríaca) quanto a grega, Paulo parece indicar o clamor conjunto dos crentes judeus e gentios.',
    },
    'romans-8:ctx:exodus': {
      title: 'Da escravidão à filiação: a história do êxodo',
      summary:
        'Paulo contrasta “o espírito de escravidão, para voltardes ao medo” com “o Espírito de adoção” (8:15). A história fundadora de Israel faz exatamente esse movimento: Deus chamou Israel de “meu filho, meu primogênito” e o tirou da escravidão no Egito (Êx 4:22–23).',
      detail:
        'N. T. Wright argumenta que Romanos 5–8 reconta o êxodo: o pecado mantém a humanidade cativa como Faraó mantinha Israel, a morte e a ressurreição do Messias trazem libertação, o Espírito é dado no lugar em que Israel recebeu a lei no Sinai, e uma jornada conduz à herança — agora a criação inteira renovada (8:17–25). Nem todo leitor considera o padrão tão abrangente, mas a linguagem de escravidão, filhos e herdeiros de 8:14–17 claramente recorre à história de Israel (nota da Tyndale sobre 8:14).',
    },
    'romans-8:ctx:firstfruits': {
      title: 'A oferta das primícias',
      summary:
        'No início da colheita, Israel levava o primeiro feixe de cereal ao sacerdote, que o movia diante do SENHOR; só então se podia comer da nova safra (Lv 23:9–14; compare Êx 23:19).',
      detail:
        'A primeira porção era consagrada a Deus e servia de penhor da colheita inteira. Paulo aplica a imagem ao Espírito já dado aos crentes (Rm 8:23) e, em outro lugar, à ressurreição de Cristo como a primeira de muitas (1Co 15:20).',
    },
    'romans-8:ctx:suffering': {
      title: 'Sofrimentos reais por trás da lista de 8:35',
      summary:
        '“A aflição, a angústia, a perseguição, a fome, a nudez, o perigo, ou a espada” não é um floreio retórico. Paulo enumera o mesmo tipo de sofrimento no seu próprio ministério — “em fome e em sede… em frio e nudez” (2Co 11:27) — e escreve a uma igreja da qual alguns membros já haviam passado pela expulsão da cidade.',
      detail:
        'Ao citar o Salmo 44:22 em 8:36, Paulo situa esse sofrimento na longa linhagem do povo fiel de Deus que sofreu “por causa de ti”. A segurança que o capítulo oferece se dirige a pessoas para quem essas ameaças eram possibilidades reais, não aos acomodados.',
    },
  },

  literary: {
    placeInBook:
      'Romanos 8 encerra o segundo grande movimento da carta (caps. 5–8), no qual Paulo assegura aos crentes que a salvação que Deus começou será concluída. O capítulo 5 anunciou a paz com Deus e a reversão do pecado de Adão; os capítulos 6 e 7 mostraram que nem o pecado nem a lei podem frustrar o propósito de Deus. O capítulo 8 reúne tudo: o Espírito liberta da morte (8:1–17) e assegura aos crentes que o sofrimento não os impedirá de chegar à glória (8:18–39). Os capítulos 9–11 retomam então a pergunta que isso levanta — se os propósitos de Deus não podem falhar, o que dizer de Israel?',
    argument:
      'Paulo avança em três passos. (1) 8:1–17: porque Deus condenou o pecado na carne de Cristo, o Espírito dá a vida que a lei não podia dar, e os que são guiados pelo Espírito são filhos e herdeiros de Deus. (2) 8:18–30: os herdeiros participam agora dos sofrimentos de Cristo; a criação e os crentes gemem, e o Espírito intercede “com gemidos inexprimíveis”, mas a esperança repousa no propósito de Deus, que vai da presciência à glória. (3) 8:31–39: um tribunal de perguntas — quem será contra nós, quem acusará, quem condenará, quem separará? — que termina na certeza de que nada pode nos separar do amor de Deus em Cristo.',
    placeInCanon:
      'Romanos 8 reúne fios de toda a Bíblia: a criação sujeita à futilidade depois de Gênesis 3 e à espera de renovação; Israel como filho primogênito de Deus, tirado da escravidão (Êx 4:22); as primícias da colheita (Lv 23); a promessa do próprio Espírito de Deus dentro do seu povo (Ez 36:26–27); e a confiança do Servo de que Deus lhe fará justiça (Is 50:8–9). E aponta para o novo céu e a nova terra do Apocalipse (Ap 21:1–5).',
    bookOutline: [
      'Saudação e tema: a boa-nova da justiça de Deus',
      'Todos pecaram: gentios e judeus debaixo do pecado',
      'A justiça pela fé em Cristo; Abraão',
      'A certeza da salvação: Adão e Cristo, pecado, lei e Espírito',
      'A fidelidade de Deus a Israel',
      'A vida transformada e a unidade da igreja',
      'Os planos missionários de Paulo, saudações e doxologia',
    ],
    passageOutline: [
      'Nenhuma condenação: o Espírito faz o que a lei não podia fazer',
      'Carne e Espírito: dois modos de vida',
      'Filhos e herdeiros: o Espírito de adoção',
      'Gemido e esperança: a criação, os crentes e o Espírito',
      'O propósito de Deus: todas as coisas para o bem',
      'Nenhuma separação: o tribunal do amor de Deus',
    ],
    features: {
      'romans-8:lit:inclusio': {
        title: 'Nenhuma condenação… nenhuma separação — “em Cristo Jesus”',
        description:
          'O capítulo abre e fecha com a mesma expressão: “nenhuma condenação há para os que estão em Cristo Jesus” (8:1) e nada “poderá nos separar do amor de Deus, que está em Cristo Jesus, nosso Senhor” (8:39). Em grego, 8:1 termina com ἐν Χριστῷ Ἰησοῦ, e 8:39 com ἐν Χριστῷ Ἰησοῦ τῷ κυρίῳ ἡμῶν. A moldura revela a lógica do capítulo: a união com Cristo é, ao mesmo tempo, o fundamento do veredito e a garantia do amor.',
        structure: [
          { label: '8:1', text: 'Nenhuma condenação — para os que estão em Cristo Jesus' },
          { label: '8:2–38', text: 'A vida do Espírito, a adoção, o gemido e a esperança, o propósito de Deus, o tribunal' },
          { label: '8:39', text: 'Nenhuma separação — do amor de Deus em Cristo Jesus, nosso Senhor' },
        ],
      },
      'romans-8:lit:spirit-repetition': {
        title: 'O Espírito, vinte e uma vezes',
        description:
          'A palavra πνεῦμα aparece 21 vezes neste capítulo — mais do que em qualquer outro capítulo do Novo Testamento —, depois de apenas cinco usos em Romanos 1–7. “Carne” (σάρξ) concentra-se na primeira metade (13 vezes em 8:3–13) e depois desaparece, à medida que o capítulo passa do contraste entre carne e Espírito para a obra do Espírito no sofrimento e na esperança.',
      },
      'romans-8:lit:three-groans': {
        title: 'Três gemidos',
        description:
          'A criação “geme” (8:22, συστενάζει), “nós… gememos em nós mesmos” (8:23, στενάζομεν) e o Espírito intercede “com gemidos inexprimíveis” (8:26, στεναγμοῖς). A raiz repetida une a frustração do mundo, o anseio do crente e a oração do Espírito num único movimento rumo à redenção.',
        structure: [
          { label: '8:22', text: 'A criação geme, como em dores de parto' },
          { label: '8:23', text: 'Nós gememos, aguardando a adoção e a redenção do corpo' },
          { label: '8:26', text: 'O Espírito intercede com gemidos sem palavras' },
        ],
      },
      'romans-8:lit:golden-chain': {
        title: 'A corrente de ouro de 8:29–30',
        description:
          'Cinco verbos formam uma corrente em que cada elo retoma o anterior: conheceu de antemão → predestinou → chamou → justificou → glorificou. A exposição de Romanos no Comentário de Matthew Henry — escrita depois da morte de Henry (1714) pelo ministro não conformista John Evans, um dos que concluíram a obra — a chama de corrente de ouro que não pode ser quebrada. Chama a atenção que “glorificou” esteja no passado, embora a glória ainda seja futura em outras partes do capítulo (8:18, 21); a nota da Tyndale o explica como a decisão firme de Deus, tão certa como se já estivesse realizada.',
        structure: [
          { label: 'conheceu de antemão', text: 'Aos que desde antes conheceu…' },
          { label: 'predestinou', text: '…também os predestinou para serem conformes à imagem do seu Filho' },
          { label: 'chamou', text: 'Aos que predestinou, a esses também chamou' },
          { label: 'justificou', text: 'Aos que chamou, a esses também justificou' },
          { label: 'glorificou', text: 'Aos que justificou, a esses também glorificou' },
        ],
      },
      'romans-8:lit:courtroom': {
        title: 'Um tribunal em perguntas (8:31–39)',
        description:
          'Paulo termina com uma cascata de perguntas retóricas — “Se Deus é por nós, quem será contra nós?” “Quem fará acusação contra os escolhidos de Deus?” “Quem os condenará?” “Quem nos separará do amor de Cristo?” —, cada uma respondida pelo que Deus fez em Cristo, o mesmo fundamento em que repousa o veredito de 8:1. As listas de 8:35 e 8:38–39 dão ao desfecho uma qualidade rítmica, quase de hino, embora continue sendo argumento.',
      },
    },
  },

  theology: {
    'romans-8:th:no-condemnation': {
      title: 'Nenhuma condenação: o veredito e a vida nova',
      summary:
        'Porque Deus condenou o pecado na carne do seu Filho, enviado como oferta pelo pecado (8:3), os que estão em Cristo Jesus não estão sob nenhuma sentença de condenação (8:1), e, no fim, nenhuma acusação pode prevalecer contra os escolhidos de Deus (8:33–34).',
      detail:
        'Cristãos de todas as tradições confessam que os crentes são libertos da condenação pela morte e ressurreição de Cristo. Os protestantes enfatizam o veredito do tribunal — Calvino, comentando 8:34, diz que não resta condenação quando se deu satisfação às leis e a pena já foi paga —, mas o próprio Calvino insistia em que a graça da regeneração nunca se separa da imputação da justiça (comentando 8:2). João Crisóstomo leu 8:1 como libertação não só dos pecados passados, mas também para uma vida nova, fortalecida pelo Espírito. As tradições ainda divergem sobre como o veredito e a renovação se relacionam. As confissões protestantes distinguem a justificação — Deus perdoa os pecadores e os aceita como justos por causa de Cristo, não infundindo neles justiça (Confissão de Westminster 11.1) — da santificação que sempre a acompanha (cap. 13), ao passo que o Concílio de Trento definiu a própria justificação como não apenas a remissão dos pecados, mas também a santificação e a renovação do homem interior. Romanos 8 mantém juntos veredito e vida nova; como os dois se relacionam continua sendo uma diferença entre as denominações.',
    },
    'romans-8:th:spirit': {
      title: 'O Espírito que habita em nós',
      summary:
        'O Espírito é “o Espírito de Deus” e “o Espírito de Cristo” (8:9). Ele habita em todo crente, dá vida agora e ressurreição depois (8:10–11), guia os filhos de Deus (8:14), dá testemunho com o espírito deles (8:16) e intercede na sua fraqueza (8:26–27).',
      detail:
        'Romanos 8 é um dos capítulos mais ricamente trinitários do Novo Testamento: o Pai envia o Filho (8:3), o ressuscita (8:11) e ouve a intercessão do Espírito (8:27); o Filho morre, ressuscita e intercede (8:34); o Espírito habita, guia e ora. O Espírito não elimina a responsabilidade humana nem torna o pecado impossível, mas é o poder decisivo da vida cristã (nota da Tyndale sobre 8:9).',
    },
    'romans-8:th:adoption': {
      title: 'Adoção: filhos e herdeiros',
      summary:
        'Os crentes receberam “o Espírito de adoção”, pelo qual chamam a Deus de “Aba, Pai!”; como filhos, são “herdeiros de Deus, e coerdeiros de Cristo” (8:15–17), embora a adoção plena — a redenção do corpo — ainda seja aguardada (8:23).',
      detail:
        'J. I. Packer colocou a adoção no topo das bênçãos do evangelho, acima até da justificação: a justificação resolve a nossa situação diante de Deus como Juiz, ao passo que a adoção nos introduz na sua família como seus filhos, e Packer insistia em que os cristãos entendessem toda a sua vida a essa luz. É também uma família que sofre: os coerdeiros sofrem com Cristo “para que também com ele sejamos glorificados” (8:17).',
    },
    'romans-8:th:mortification': {
      title: 'Fazer morrer o pecado pelo Espírito',
      summary:
        '“Se, pelo Espírito, fizerdes morrer as ações do corpo, vivereis” (8:13). A libertação da condenação não encerra a luta contra o pecado; torna-a possível e cheia de esperança, porque ela é travada pelo Espírito.',
      detail:
        'A obra de John Owen Of the Mortification of Sin in Believers (1656) é construída sobre este versículo. Sua tese: os crentes mais seletos, que estão seguramente livres do poder condenatório do pecado, devem ainda assim fazer da mortificação do poder do pecado que neles habita a sua ocupação por todos os dias da vida. Owen também advertiu que a mortificação feita com as próprias forças, em busca da própria justiça, é a essência da falsa religião — ela é obra do Espírito.',
    },
    'romans-8:th:new-creation': {
      title: 'Gemido e glória: a redenção da criação e do corpo',
      summary:
        'A criação inteira, que “ficou sujeita à futilidade” “na esperança”, espera ansiosamente ser “liberta da escravidão da degradação” quando os filhos de Deus forem revelados em glória; os crentes também aguardam “a redenção do nosso corpo” (8:19–23).',
      detail:
        'A esperança cristã em Romanos 8 não é fuga do mundo material, mas a sua libertação, junto com a ressurreição do corpo. O Espírito é as primícias dessa colheita (8:23). N. T. Wright tira uma consequência prática: se o povo de Deus há de herdar a criação liberta, deve cuidar da ordem criada desde já.',
    },
    'romans-8:th:providence': {
      title: 'O propósito de Deus e a segurança do crente',
      summary:
        'Para os que amam a Deus e são chamados segundo o seu propósito, Deus faz todas as coisas cooperarem para o bem — o bem de serem conformes ao seu Filho (8:28–29). Nada em toda a criação pode separá-los do seu amor em Cristo (8:38–39).',
      detail:
        'Todas as tradições cristãs leem 8:28–39 como segurança para crentes que sofrem. Diferem quanto à relação entre a presciência e a predestinação de Deus, de um lado, e a fé e a perseverança humanas, de outro (veja as perspectivas sobre 8:29–30), mas concordam que o fundamento da confiança é o amor de Deus, demonstrado em não ter poupado o seu próprio Filho (8:32).',
    },
  },

  perspectives: {
    'romans-8:ps:foreknowledge': {
      question: 'O que significa que Deus “desde antes conheceu” e “predestinou” (8:29–30)?',
      intro:
        'Todas as tradições cristãs afirmam que a salvação começa no propósito gracioso de Deus e que Paulo escreveu 8:29–30 para dar segurança. Diferem quanto à relação entre a presciência de Deus e a fé humana, e quanto a saber se cada elo da corrente vale sempre para as mesmas pessoas.',
      commonGround:
        'Todos concordam que a salvação tem origem na iniciativa graciosa de Deus, que ninguém é salvo sem a graça e a fé em Cristo, que o alvo da predestinação é a conformidade com a imagem do Filho e que Paulo escreveu 8:28–39 para dar segurança a crentes que sofrem, e não para convidar à especulação.',
      perspectives: {
        'romans-8:ps:foreknowledge:reformed': {
          tradition: 'Reformada',
          label: 'Presciência como amor eletivo; uma corrente inquebrável',
          summary:
            'O conhecer de antemão de Deus é a sua escolha prévia e pessoal de pôr o seu amor em pessoas concretas — o objeto do verbo são pessoas (“aos que”), não as escolhas que elas fariam —, e cada elo decorre infalivelmente do anterior: todos os predestinados são chamados, todos os chamados são justificados, todos os justificados são glorificados. A Confissão de Westminster (3.5, citando Rm 8:30) afirma que Deus escolheu sem qualquer previsão de fé ou de boas obras; os Cânones de Dort (I.9), que a eleição não se fundamentou na fé prevista. R. C. Sproul e John Piper defendem esta leitura em sermões sobre esta passagem.',
        },
        'romans-8:ps:foreknowledge:wesleyan': {
          tradition: 'Arminiana / wesleyana',
          label: 'Eleição dos que Deus previu que creriam; a corrente como o método de Deus',
          summary:
            'Deus, em Cristo, propôs-se salvar os que, pela graça, cressem e perseverassem (Artigos da Remonstrância, 1610, art. I). A graça vem primeiro — os Artigos ensinam que o ser humano caído não pode, por si mesmo, pensar, querer ou fazer nada verdadeiramente bom, nem mesmo a fé salvadora, mas precisa nascer de novo de Deus, em Cristo, pelo Espírito Santo (art. III); que nem mesmo o regenerado pode fazer bem algum sem a graça preveniente ou auxiliadora, despertadora, subsequente e cooperante; e que essa graça não é irresistível (art. IV). John Wesley leu 8:29–30 como a descrição do método pelo qual Deus nos conduz, passo a passo, rumo ao céu: Paulo, argumentava ele, não afirma que exatamente o mesmo número de pessoas é chamado, justificado e glorificado.',
        },
        'romans-8:ps:foreknowledge:lutheran': {
          tradition: 'Luterana',
          label: 'A eleição é causa da salvação, nunca da condenação — e deve ser buscada em Cristo',
          summary:
            'A Fórmula de Concórdia (art. XI) distingue a presciência de Deus, que se estende a todos, da eleição, que se estende somente aos bons e amados filhos de Deus e é a causa da sua salvação. Mas rejeita toda predestinação para a condenação: Cristo deseja sinceramente que todos venham a ele, e os que perecem, perecem pelo próprio desprezo da Palavra. A eleição não deve ser investigada no conselho oculto de Deus, mas em Cristo e no evangelho — e, seguindo a ordem de Paulo em Romanos, ensinada depois do arrependimento e da fé, como consolo. O Prefácio de Lutero a Romanos já recomendava essa ordem: fixar a atenção primeiro em Cristo e no evangelho, lutar contra o pecado como ensinam os capítulos 1–8 e só então, sob a cruz e o sofrimento do capítulo 8, aprender com os capítulos 9–11 o consolo da providência de Deus. (A Fórmula em si é de 1577, três décadas depois da morte de Lutero.)',
        },
        'romans-8:ps:foreknowledge:catholic': {
          tradition: 'Católica',
          label: 'Predestinação graciosa com livre cooperação',
          summary:
            'O Concílio de Trento ensina que a justificação começa com a graça preveniente de Deus, que chama as pessoas sem que haja mérito algum da parte delas; elas são então dispostas a ela ao consentir livremente com essa graça e cooperar com ela — e podem rejeitá-la (Sessão 6, cap. 5). Adverte contra a presunção de estar, sem revelação especial, certamente entre os predestinados (cap. 12) e rejeita a ideia de que os chamados que não se salvam tenham sido predestinados para o mal (cânon 17). Dentro desses limites, os teólogos católicos divergem: os tomistas sustentam a predestinação para a glória anterior à previsão dos méritos; muitos molinistas, em vista deles.',
        },
        'romans-8:ps:foreknowledge:orthodox': {
          tradition: 'Ortodoxa oriental',
          label: 'Presciência sem coação; participar da semelhança do Filho pela graça',
          summary:
            'A tradição oriental lê a passagem em termos da presciência de Deus e de uma resposta humana livre. João Crisóstomo sublinhou que o chamado não lhes foi imposto à força nem era compulsório — todos foram chamados, mas nem todos obedeceram ao chamado —, e João Damasceno ensinou que, embora Deus conheça todas as coisas de antemão, não predetermina todas as coisas. A ênfase recai sobre o alvo de 8:29: como diz Crisóstomo, o que o Unigênito era por natureza, também eles se tornaram pela graça.',
        },
      },
    },
    'romans-8:ps:groanings': {
      question: 'O que são os “gemidos inexprimíveis” de 8:26?',
      intro:
        'Intérpretes cuidadosos têm dúvidas genuínas sobre quem geme e se há alguma oração audível em vista. A questão toca o modo como os cristãos entendem a oração na fraqueza, não uma doutrina central.',
      commonGround:
        'Todos concordam que o Espírito ajuda os crentes justamente quando eles não sabem orar, e que Deus entende a oração que não cabe em palavras e a atende “segundo a vontade de Deus” (8:27).',
      perspectives: {
        'romans-8:ps:groanings:spirit': {
          tradition: 'Leitura moderna comum',
          label: 'A intercessão do próprio Espírito, sem palavras',
          summary:
            'Os gemidos pertencem ao Espírito, não a nós: quando não sabemos orar, o próprio Espírito intercede diante de Deus de maneiras que não podem ser postas em palavras, e o Pai, que examina os corações, compreende (8:27). Esta é a leitura da nota de estudo da Tyndale.',
        },
        'romans-8:ps:groanings:prompted': {
          tradition: 'Comentário e pregação reformados (Calvino, Spurgeon)',
          label: 'Os nossos gemidos, despertados pelo Espírito',
          summary:
            'O Espírito não geme literalmente; ele desperta nos crentes anseios profundos demais para as suas próprias palavras, e esses anseios lhe são atribuídos. Calvino explica que o Espírito intercede não porque realmente se rebaixe a orar ou a gemer, mas porque desperta em nosso coração os desejos que devemos ter. Spurgeon disse o mesmo no seu sermão sobre estes versículos (1880).',
        },
        'romans-8:ps:groanings:charism': {
          tradition: 'Patrística (João Crisóstomo)',
          label: 'Um dom espiritual de oração na igreja primitiva',
          summary:
            'Crisóstomo explicava o versículo a partir dos dons da igreja apostólica: ao lado da profecia e das línguas, havia um dom de oração, também chamado espírito, concedido a alguém que orava por toda a igreja com gemidos. “Espírito”, aqui, argumentava ele, designa essa graça e a pessoa espiritual que a recebe — não diretamente o Consolador.',
        },
        'romans-8:ps:groanings:ecstatic': {
          tradition: 'Alguns intérpretes',
          label: 'Oração inarticulada ou extática',
          summary:
            'Alguns entendem a expressão como descrição de uma oração que não assume a forma de linguagem humana — sons emitidos quando os crentes não sabem o que orar. A nota da Tyndale menciona essa possibilidade, embora conclua que os gemidos são do Espírito. Para muitos leitores, o adjetivo “inexprimíveis” torna menos provável uma referência a uma fala audível.',
        },
      },
    },
    'romans-8:ps:romans-7': {
      question: 'Quem é o ‘eu’ que luta em Romanos 7:14–25, logo antes de ‘nenhuma condenação’?',
      intro:
        'O modo de ler 8:1 depende em parte de quem fala em 7:14–25: um cristão que ainda luta contra o pecado, uma pessoa debaixo da lei e sem o Espírito, ou Israel debaixo da Torá. O debate é antigo e continua aberto.',
      commonGround:
        'Todos concordam que 8:1 responde ao grito de 7:24, que os crentes ainda precisam fazer morrer o pecado (8:13) e que a diferença decisiva é a união com Cristo e o dom do Espírito.',
      perspectives: {
        'romans-8:ps:romans-7:believer': {
          tradition: 'Luterana e reformada',
          label: 'A luta contínua do crente',
          summary:
            'Paulo descreve a sua vida como crente: os regenerados ainda lutam contra o pecado que neles habita e, no entanto — como 8:1 diz logo em seguida —, não são condenados. O Prefácio de Lutero a Romanos diz que no capítulo 7 Paulo se retrata como ainda pecador, ao passo que no capítulo 8 afirma que nada há de condenável nos que estão em Cristo; Calvino abre o seu comentário sobre 8:1 falando do combate que os piedosos travam sem cessar com a própria carne; e Spurgeon dizia nunca ter sabido o que era estar fora do sétimo capítulo de Romanos — nem fora do oitavo.',
        },
        'romans-8:ps:romans-7:under-law': {
          tradition: 'Pais gregos e tradição wesleyana',
          label: 'A vida debaixo da lei, antes do Espírito',
          summary:
            'João Crisóstomo leu o “eu sou carnal” de 7:14 como um esboço do ser humano que vive sob a Lei e antes da Lei — a humanidade sem a graça —, de modo que o capítulo 8 descreve uma libertação real dessa condição. John Wesley, de modo semelhante, via em 7:7–25 um homem que raciocina, geme, luta e escapa do estado legal para o estado evangélico.',
        },
        'romans-8:ps:romans-7:israel': {
          tradition: 'Estudos paulinos contemporâneos',
          label: 'Israel debaixo da Torá',
          summary:
            'N. T. Wright argumenta que o “eu” de Paulo dá voz à própria história de Israel debaixo da Torá: quando veio a lei, Israel repetiu a queda de Adão e, embora desejasse o bem, permaneceu “em Adão” — até que Deus tratou do pecado no Messias e deu o Espírito para fazer o que a lei não podia fazer (8:1–11).',
        },
      },
    },
  },

  commentary: {
    'romans-8:cm:chrysostom-8-28': {
      lead: 'Sobre “todas as coisas juntamente contribuem para o bem” (8:28)',
      quoteTranslation:
        'Ora, quando fala de todas as coisas, menciona até mesmo as coisas que parecem dolorosas. … E assim ele não diz que nenhuma aflição se aproxima dos que amam a Deus, mas que ela coopera para o bem, isto é, que Ele usa as próprias coisas penosas para tornar aprovados aqueles contra quem se conspira.',
    },
    'romans-8:cm:chrysostom-8-29': {
      lead: 'Sobre ser “conformes à imagem do seu Filho” (8:29)',
      quoteTranslation: 'Pois o que o Unigênito era por natureza, isso também eles se tornaram pela graça.',
    },
    'romans-8:cm:luther-8-1': {
      lead: 'Sobre como o capítulo 8 responde à luta do capítulo 7',
      quoteTranslation: 'No capítulo 8, São Paulo consola esses combatentes e lhes diz que esta carne não lhes trará condenação.',
    },
    'romans-8:cm:calvin-8-34': {
      lead: 'Sobre “Quem os condenará?” (8:34)',
      quoteTranslation:
        'Assim como ninguém pode prevalecer acusando, quando o juiz absolve, assim também não resta condenação quando se deu satisfação às leis e a pena já foi paga.',
    },
    'romans-8:cm:owen-8-13': {
      lead: 'Sobre “fizerdes morrer as ações do corpo” (8:13)',
      quoteTranslation:
        'Mortifique; faça disso a sua obra de cada dia; dedique-se a ela sempre, enquanto viver; não deixe esta obra um só dia; esteja matando o pecado, ou ele estará matando você.',
    },
    'romans-8:cm:wesley-8-16': {
      lead: 'Sobre “O próprio Espírito dá testemunho com o nosso espírito” (8:16)',
      quoteTranslation:
        'Com o espírito de todo verdadeiro crente, por um testemunho distinto do testemunho do seu próprio espírito, ou do testemunho de uma boa consciência.',
    },
    'romans-8:cm:spurgeon-8-1': {
      lead: 'Sobre lutar e, ainda assim, não ser condenado (8:1)',
      quoteTranslation:
        'O fato é que os crentes estão em estado de conflito, mas não em estado de condenação; e que, no exato momento em que o conflito está mais acirrado, o crente continua justificado.',
    },
    'romans-8:cm:packer-8-15': {
      lead: 'Sobre a adoção como a maior bênção do evangelho (8:14–17)',
      text: 'Packer coloca a adoção no topo das bênçãos do evangelho, acima até mesmo da justificação. A justificação resolve a nossa situação diante de Deus como Juiz; a adoção nos torna membros da sua família, com Deus como nosso Pai e nós como seus filhos e herdeiros. Packer argumenta ainda que toda a vida cristã deve ser entendida — e vivida — à luz do fato de sermos filhos de Deus.',
    },
    'romans-8:cm:wright-8-17': {
      lead: 'Sobre Romanos 8 como um novo êxodo (8:12–25)',
      text: 'Wright lê Romanos 5–8 como uma releitura do êxodo: o pecado escraviza como o Egito escravizou, a morte e a ressurreição do Messias libertam, o Espírito ocupa o lugar que a Torá tinha no Sinai, e os filhos de Deus não devem voltar à escravidão (8:12–17). A herança deles já não é uma única terra, mas a criação inteira, liberta da escravidão — de modo que Romanos 8 cumpre a promessa de Romanos 4:13 de que a família de Abraão herdaria o mundo.',
    },
    'romans-8:cm:piper-8-1': {
      lead: 'Sobre o “agora” de “nenhuma condenação” (8:1)',
      text: 'Piper ouve dois sentidos na palavra agora, em Paulo. É agora, enfim: na cruz, Deus condenou o pecado na carne de Cristo (8:3), de modo que o Filho suportou a sentença em que os pecadores haviam incorrido. E é agora, já: embora o juízo final ainda esteja por vir, os que estão em Cristo podem conhecer de antemão o seu resultado (8:33–34). O dom pertence aos que estão em Cristo, e todos são convidados a vir a ele.',
    },
    'romans-8:cm:keller-8-1': {
      lead: 'Sobre experimentar Deus por meio do Espírito (8:1–4)',
      text: 'Keller pergunta como os crentes podem conhecer a presença de Deus na própria experiência, e a sua resposta é a obra do Espírito Santo. Na sua leitura de Romanos 8, o Espírito nos une a Cristo e a tudo o que ele realizou, e assim nos assegura de que nada pode nos separar do amor de Deus (8:39). De 8:1–4 ele extrai duas verdades que devem ser mantidas juntas: a luta contra o pecado continua na vida cristã e, ainda assim, não há condenação (8:1).',
    },
    'romans-8:cm:sproul-8-29': {
      lead: 'Sobre a corrente de ouro de 8:29–30',
      text: 'Sproul argumenta que nada no texto faz a predestinação depender da presciência; essa conclusão se tira apenas da ordem em que os verbos aparecem. Deus conheceu de antemão pessoas, não as decisões delas, no sentido pessoal e amoroso de “conhecer”, e a corrente se mantém sem nenhum elo partido. Ele contrapõe isso à visão presciente (a eleição baseada na fé prevista), que remonta, segundo ele, à modificação que Melanchthon fez no pensamento de Lutero e que ele considera a posição majoritária entre os evangélicos modernos.',
    },
  },

  sermons: {
    'romans-8:sermon:spurgeon-1917': {
      summary:
        'Spurgeon se recusa a separar Romanos 7 de Romanos 8: o crente vive nos dois ao mesmo tempo, lutando contra o pecado interior enquanto está plenamente justificado — em estado de conflito, mas não em estado de condenação. Ele adverte contra uma mensagem de nenhuma condenação que negue as ameaças da lei, descreve a posição do crente “em Cristo Jesus”, observa que a cláusula sobre não andar segundo a carne em 8:1 não é original (a Revised Version inglesa a omite) e termina com a absolvição do crente.',
    },
    'romans-8:sermon:spurgeon-1532': {
      summary:
        'Um sermão em três partes: o auxílio que o Espírito Santo dá, a oração que ele inspira e o êxito certo dessas orações. Spurgeon ensina que o Espírito guia as petições dos crentes e intercede não gemendo ele mesmo, mas despertando neles desejos intensos e gemidos inexprimíveis, que lhe são atribuídos — e que essas orações são ouvidas, porque são segundo a vontade de Deus.',
    },
    'romans-8:sermon:piper-2001': {
      summary:
        'Piper trata 8:1 como central para a mensagem cristã e explica o seu “agora” de dois modos: a espera terminou, porque Deus condenou o pecado na carne de Cristo (8:3); e o resultado do juízo final está decidido de antemão para os que estão em Cristo (8:33–34).',
    },
    'romans-8:sermon:keller-1997': {
      summary:
        'Keller lê o final de Romanos 8 como o clímax da obra do Espírito: dar aos crentes uma confiança firme de que nada pode separá-los do amor de Deus. O que falta aos crentes, sugere ele, é a convicção disso, e o Espírito a supre contra as dúvidas que vêm tanto de dentro quanto de fora de nós.',
    },
    'romans-8:sermon:sproul-2006': {
      summary:
        'Sproul situa 8:29–30 na história do debate, desde os remonstrantes e o Sínodo de Dort, e defende a eleição incondicional: presciência, neste texto, significa o conhecimento pessoal e amoroso que Deus tem das pessoas, não a previsão das escolhas delas.',
    },
  },

  verseNotes: {
    'ROM.8.1': [
      '“Portanto” tira a conclusão dos capítulos 5–7: para os que estão “em Cristo Jesus”, agora não há nenhuma condenação — nenhum veredito adverso e nenhuma pena (κατάκριμα, palavra que Paulo usa somente aqui e em 5:16–18). O versículo segue diretamente a luta de 7:14–25, e por isso Spurgeon podia dizer que os crentes estão em estado de conflito, mas não em estado de condenação. As palavras a mais que a KJV traz em 8:1 (que não andam segundo a carne, mas segundo o Espírito) só aparecem na tradição manuscrita bizantina, mais tardia (o Textus Receptus por trás da KJV), e estão ausentes dos manuscritos mais antigos. A maioria das traduções modernas, incluindo a BSB, só tem essa frase em 8:4; a WEB, cujo Novo Testamento segue o Texto Majoritário grego, a mantém em 8:1 com uma nota. Entre as versões em português disponíveis aqui, a BLIVRE e a BPM trazem a frase em 8:1; a NBV, não.',
    ],
    'ROM.8.3': [
      'A lei não podia libertar — não por ser má, mas porque “estava enferma pela carne”: podia ordenar, mas não capacitar. Por isso Deus enviou “o seu próprio Filho em semelhança da carne pecadora”: verdadeiramente humano, mas sem pecado. A expressão “por causa do pecado” (que várias versões entendem como oferta pelo pecado) usa a fórmula do Antigo Testamento grego para a oferta pelo pecado (Tyndale). Na cruz, Deus “condenou o pecado na carne” — a sentença recaiu sobre o pecado em Cristo, para que não precisasse recair sobre os que estão nele.',
    ],
    'ROM.8.9': [
      'Paulo pressupõe que todo crente tem o Espírito: “se alguém não tem o Espírito de Cristo, esse não lhe pertence”. Numa única frase, o mesmo Espírito é “o Espírito de Deus” e “o Espírito de Cristo”. A BLIVRE traduz literalmente “no Espírito” (algumas versões dizem “controlados pelo Espírito”, como a NBV): não se trata de uma classe superior de cristãos, mas do novo âmbito em que todo crente vive. O Espírito não elimina a responsabilidade nem torna o pecado impossível, mas é o poder mais forte na vida do crente (Tyndale).',
    ],
    'ROM.8.12': [
      '“Somos devedores” (ὀφειλέται) — assim traduz a BLIVRE, literalmente; outras versões dizem que temos uma obrigação. Paulo começa a dizer o que devemos, mas enuncia apenas o lado negativo: não devemos nada à carne. João Crisóstomo observou que Paulo formula isso de modo mais incisivo do que uma simples ordem de não viver segundo a carne: o credor implícito é o Espírito. Tendo recebido vida do Espírito (8:11), os crentes não têm obrigação alguma de viver nos termos da carne; 8:13 explica o que isso significa.',
    ],
    'ROM.8.13': [
      '“Se, pelo Espírito, fizerdes morrer as ações do corpo, vivereis.” Duas coisas são mantidas juntas: os crentes precisam agir — o verbo está no presente, um fazer morrer contínuo — e só podem fazê-lo “pelo Espírito”. John Owen construiu o seu clássico Of the Mortification of Sin in Believers (1656) sobre este versículo: os que foram libertos da condenação ainda precisam fazer de matar o pecado a ocupação de toda a vida — ou matam o pecado, ou o pecado os matará.',
    ],
    'ROM.8.15': [
      'Paulo contrasta dois “espíritos”: o espírito de escravidão, que leva de volta ao medo, e o Espírito de adoção, pelo qual clamamos: “Aba, Pai!” O verbo (κράζω) significa clamar em voz alta — um grito do coração, não uma fórmula. No mundo romano, a adoção dava ao filho todos os direitos de herdeiro (Tyndale), e Israel já era filho de Deus muito antes (Êx 4:22); Paulo usa as duas coisas para dizer que os crentes pertencem à família de Deus e oram com a própria palavra de Jesus para Pai (Mc 14:36).',
    ],
    'ROM.8.16': [
      'O Espírito “dá testemunho com o nosso espírito” — o verbo (συμμαρτυρέω) significa testemunhar juntamente: o nosso próprio espírito e o Espírito de Deus, que o confirma, atestam que somos filhos de Deus. Os cristãos entenderam esse testemunho de maneiras diferentes: John Wesley ensinava um testemunho interior direto do Espírito, distinto do testemunho do próprio espírito do crente, enquanto Calvino o ligava à confiança que nos abre a boca para chamar a Deus de Pai em oração. Ambos tratam a certeza da salvação como dom de Deus, não como autopersuasão.',
    ],
    'ROM.8.18': [
      '“Considero” (λογίζομαι) expressa um juízo ponderado: Paulo pesou as aflições presentes contra a glória que há de ser revelada e conclui que elas simplesmente “nem se comparam”. Ele não está minimizando a dor — a lista de 8:35 é real —, mas pesando-a numa balança em que a glória vindoura pesa mais. 2 Coríntios 4:17 faz o mesmo cálculo: “nossa leve e momentânea aflição” contra “um peso eterno de excelentíssima glória”.',
    ],
    'ROM.8.20': [
      'A criação “ficou sujeita à futilidade” — ματαιότης, a palavra que o Antigo Testamento grego usa ao longo de Eclesiastes (“Futilidade das futilidades! … Tudo é fútil!”, Ec 1:2). Aquele que a sujeitou é, com mais probabilidade, Deus, ao pronunciar a maldição sobre a terra depois do pecado de Adão (Gn 3:17; assim John Wesley). Mas foi “na esperança”: a criação será liberta da escravidão da degradação e participará da “liberdade da glória dos filhos de Deus” (8:21).',
    ],
    'ROM.8.23': [
      'Os crentes têm “os primeiros frutos do Espírito” — o primeiro feixe, que consagrava e garantia a colheita inteira (Lv 23:10, onde o Antigo Testamento grego usa a mesma palavra, ἀπαρχή). Ainda assim, “gememos em nós mesmos, esperando a adoção, isto é, a redenção do nosso corpo”. A adoção já é nossa (8:15) e ainda não está completa: os cristãos vivem entre o “já” da redenção e o “ainda não” da glória (Tyndale).',
    ],
    'ROM.8.26': [
      '“Da mesma maneira” liga o Espírito ao gemido da criação e dos crentes. O Espírito “ajuda em nossas fraquezas” — Calvino observa que o verbo (συναντιλαμβάνομαι) retrata alguém que segura um fardo junto conosco. Quando não sabemos orar como se deve, “o próprio Espírito intercede por nós com gemidos inexprimíveis”. Os intérpretes divergem sobre se esses gemidos são do próprio Espírito ou suspiros nossos despertados por ele, mas todos concordam que Deus os entende (8:27).',
    ],
    'ROM.8.28': [
      'Paulo não diz que tudo é bom, mas que todas as coisas contribuem “para o bem daqueles que amam a Deus, dos que são chamados segundo o seu propósito”. O grego pode ser lido com “todas as coisas” como sujeito (assim a KJV e a BLIVRE) ou com Deus como sujeito, que faz todas as coisas cooperarem (assim a BSB; alguns manuscritos acrescentam “Deus” como sujeito, a leitura impressa por Westcott e Hort); de um modo ou de outro, a razão é o propósito de Deus. O versículo seguinte define o bem: ser “conformes à imagem do seu Filho”, o que pode vir por meio do sofrimento (8:17, 35–36). João Crisóstomo o percebeu: “todas as coisas” inclui até as que parecem dolorosas.',
    ],
    'ROM.8.29': [
      '“Aos que desde antes conheceu, também os predestinou para serem conformes à imagem do seu Filho.” O alvo do propósito de Deus é a semelhança de família: que o Filho seja “o primogênito entre muitos irmãos” — primogênito (πρωτότοκος) é o título que o Antigo Testamento grego dá a Israel como filho de Deus (Êx 4:22). O sentido de “desde antes conheceu” é debatido entre as tradições, mas o alvo não: Deus quer tornar os seus filhos semelhantes a Cristo, no caráter agora e na glória do corpo na ressurreição (Fp 3:21).',
    ],
    'ROM.8.34': [
      '“Quem os condenará?” Paulo responde com quatro fatos sobre Cristo: ele morreu; mais do que isso, ressuscitou; está à direita de Deus; e intercede por nós. A pergunta ecoa a confiança do Servo em Isaías 50:9, e Calvino desenvolve a lógica: não resta condenação quando se deu satisfação às leis e a pena já foi paga. O capítulo que começou com “nenhuma condenação” volta ao tema sob a forma de uma pergunta que nenhum acusador consegue responder.',
    ],
    'ROM.8.39': [
      'A lista de Paulo percorre todas as categorias que ele consegue nomear — morte e vida, anjos e principados, presente e futuro, poderes, altura e profundeza, “qualquer outra criatura” —, e nada disso “poderá nos separar do amor de Deus, que está em Cristo Jesus, nosso Senhor”. O capítulo começou com “nenhuma condenação há para os que estão em Cristo Jesus” (8:1) e termina com nenhuma separação em Cristo Jesus: a união com Cristo fundamenta tanto o veredito quanto o amor.',
    ],
  },

  concepts: {
    'romans-8:concept:condemnation': {
      label: 'Condenação',
      aliases: [
        'condenação',
        'nenhuma condenação',
        'sem condenação',
        'condenar',
        'condena',
        'condenado',
        'condenou',
        'condenará',
        'veredito',
        'culpa',
        'culpado',
        'acusação',
        'acusar',
        'o que significa condenação',
        'o que é condenação',
      ],
      answer:
        'Κατάκριμα (katakrima, 8:1) é uma palavra de tribunal: o veredito adverso e a pena que se segue a ele. Paulo a usa somente aqui e em 5:16–18, onde a transgressão de Adão “resultou em condenação sobre todos os seres humanos”. “Nenhuma condenação” significa que, para os que estão em Cristo Jesus, essa sentença já não vale — porque Deus “condenou o pecado na carne” do seu Filho (8:3), e ninguém pode condenar aqueles a quem Deus justifica (8:34). Não significa que os crentes já não lutem contra o pecado (7:14–25; 8:13).',
    },
    'romans-8:concept:flesh': {
      label: 'Carne',
      aliases: [
        'carne',
        'a carne',
        'natureza pecaminosa',
        'carne pecadora',
        'carnal',
        'mentalidade da carne',
        'inclinação da carne',
        'pendor da carne',
        'segundo a carne',
        'mentalidade',
        'o que é a carne',
        'o que significa carne',
      ],
      answer:
        'Em Romanos 8, “carne” (σάρξ, 13 vezes em 8:3–13) não é o corpo como tal, mas a vida humana tal como está em Adão — fraca, autossuficiente, inclinada ao pecado e em “inimizade contra Deus” (8:7). Viver “segundo a carne” é tirar vida e direção dessa fonte; viver “segundo o Espírito” é ser guiado pelo Espírito de Deus. Cada uma tem a sua “mentalidade” (φρόνημα), que resulta em morte ou em vida e paz (8:6). O contraste é entre dois poderes e dois modos de vida, não entre corpo e alma — o Espírito dará vida até aos nossos corpos mortais (8:11).',
    },
    'romans-8:concept:spirit': {
      label: 'O Espírito Santo',
      aliases: [
        'espírito',
        'o espírito',
        'espírito santo',
        'espírito de deus',
        'espírito de cristo',
        'espírito de vida',
        'habitação do espírito',
        'o espírito habita em vós',
        'guiados pelo espírito',
        'vida no espírito',
        'andar no espírito',
        'segundo o espírito',
        'o que o espírito faz',
      ],
      answer:
        'O Espírito Santo domina Romanos 8: πνεῦμα aparece aqui 21 vezes — a maioria, embora não todas, referindo-se ao Espírito de Deus (compare “o espírito de escravidão”, 8:15, e “o nosso espírito”, 8:16) —, mais do que em qualquer outro capítulo do Novo Testamento. O Espírito é ao mesmo tempo “o Espírito de Deus” e “o Espírito de Cristo” (8:9). Ele liberta da lei do pecado e da morte (8:2), cumpre a exigência da lei nos que andam segundo ele (8:4), dá vida agora e ressurreição depois (8:11), guia os filhos de Deus e lhes assegura a filiação (8:14–16) e intercede na sua fraqueza (8:26–27).',
    },
    'romans-8:concept:adoption': {
      label: 'Adoção',
      aliases: [
        'adoção',
        'adotado',
        'adotados',
        'adotar',
        'adoção como filhos',
        'filiação',
        'filhos de deus',
        'herdeiros',
        'herdeiro',
        'coerdeiros',
        'co-herdeiros',
        'herança',
        'espírito de adoção',
        'espírito de escravidão',
        'o que é adoção',
      ],
      answer:
        'Adoção (υἱοθεσία) é uma palavra que, no Novo Testamento, só Paulo usa. No mundo romano, o filho adotado recebia todos os direitos de herdeiro; no Antigo Testamento, Israel era filho de Deus (Êx 4:22; Rm 9:4). Paulo une as duas coisas: os crentes receberam “o Espírito de adoção” e clamam “Aba, Pai!”, e, como filhos, são “herdeiros de Deus, e coerdeiros de Cristo” (8:15–17). Mas a adoção também é futura — “a redenção do nosso corpo” (8:23). J. I. Packer colocava a adoção acima até da justificação entre as bênçãos do evangelho.',
    },
    'romans-8:concept:abba': {
      label: 'Aba, Pai',
      aliases: ['aba', 'aba pai', 'abba', 'papai', 'paizinho', 'aramaico', 'deus pai', 'clamar aba', 'o que significa aba'],
      answer:
        'Aba é a palavra aramaica para “pai”, a língua que Jesus falava; ele a usou em oração no Getsêmani (Mc 14:36). Paulo a mantém sem tradução numa carta escrita em grego e acrescenta a palavra grega para Pai (8:15; Gl 4:6): pelo Espírito, os crentes oram a Deus como Jesus orava. Era uma palavra comum da família, usada por filhos pequenos e adultos — James Barr argumentou que a tradução popular “papai” não é sustentada pelas evidências —, e John Wesley via nessa combinação o clamor conjunto dos crentes judeus e gentios.',
    },
    'romans-8:concept:creation': {
      label: 'O gemido e a esperança da criação',
      aliases: [
        'criação',
        'toda a criação',
        'a criação geme',
        'gemido',
        'gemer',
        'gemidos',
        'dores de parto',
        'futilidade',
        'vaidade',
        'escravidão da degradação',
        'cativeiro da corrupção',
        'corrupção',
        'degradação',
        'nova criação',
        'redenção do corpo',
        'redenção do nosso corpo',
        'ardente expectativa',
        'expectativa ansiosa',
      ],
      answer:
        'Paulo retrata a criação inteira “sujeita à futilidade” — a palavra que o Antigo Testamento grego usa ao longo de Eclesiastes —, muito provavelmente por causa do juízo de Deus depois do pecado de Adão (Gn 3:17), mas “na esperança”. A criação espera com ardente expectativa (ἀποκαραδοκία, um composto expressivo que Abbott-Smith explica a partir da imagem de quem observa com a cabeça estendida, embora no uso signifique simplesmente uma expectativa ansiosa) e geme como uma mulher em trabalho de parto, ansiando ser liberta da degradação quando os filhos de Deus forem revelados. Os crentes também gemem, aguardando a redenção do corpo (8:19–23). A esperança cristã é uma criação renovada (Ap 21:1–5), não a fuga dela.',
    },
    'romans-8:concept:firstfruits': {
      label: 'As primícias do Espírito',
      aliases: [
        'primícias',
        'primícias do espírito',
        'primeiros frutos',
        'primeiros frutos do espírito',
        'primeira colheita',
        'penhor',
        'garantia',
        'o que são primícias',
      ],
      answer:
        'As primícias (ἀπαρχή) eram o primeiro feixe da colheita, movido diante do SENHOR antes que se pudesse comer qualquer parte da safra (Lv 23:9–14); o Antigo Testamento grego usa ali a mesma palavra. Paulo diz que os crentes têm “os primeiros frutos do Espírito” (8:23): o Espírito é a primeira parcela e a garantia da colheita ainda por vir — a adoção plena e a redenção do nosso corpo. Ele usa a mesma imagem para a ressurreição de Cristo (1Co 15:20).',
    },
    'romans-8:concept:all-things-for-good': {
      label: 'Todas as coisas cooperam para o bem',
      aliases: [
        'todas as coisas cooperam para o bem',
        'todas as coisas contribuem para o bem',
        'cooperam para o bem',
        'contribuem para o bem',
        'tudo coopera para o bem',
        'tudo contribui para o bem',
        'para o bem',
        'o bem',
        'cooperar',
        'chamados segundo o seu propósito',
        'seu propósito',
        'propósito de deus',
        'providência',
      ],
      answer:
        'Romanos 8:28 não diz que tudo é bom, nem que tudo acaba bem para todos. Promete que todas as coisas juntamente contribuem “para o bem daqueles que amam a Deus, dos que são chamados segundo o seu propósito” — e 8:29 define esse bem como ser conforme à imagem do seu Filho. O grego pode ser lido tendo “todas as coisas” ou Deus como sujeito; de um modo ou de outro, o propósito de Deus é decisivo. João Crisóstomo observou que “todas as coisas” inclui até as que parecem dolorosas.',
    },
    'romans-8:concept:predestination': {
      label: 'Presciência e predestinação',
      aliases: [
        'predestinação',
        'predestinou',
        'predestinados',
        'predestinar',
        'presciência',
        'conheceu de antemão',
        'desde antes conheceu',
        'eleição',
        'eleitos',
        'escolhidos',
        'corrente de ouro',
        'cadeia de ouro',
        'chamados',
        'chamado',
        'justificados',
        'glorificados',
        'conformes à imagem',
        'o que é predestinação',
      ],
      answer:
        'Romanos 8:29–30 é uma corrente de cinco verbos: Deus conheceu de antemão, predestinou, chamou, justificou e glorificou. Os cristãos concordam que a salvação começa no propósito gracioso de Deus e visa à semelhança com Cristo. Divergem quanto a “desde antes conheceu”: os leitores reformados o entendem como o amor eletivo de Deus por pessoas concretas; os arminianos e wesleyanos, como a sua presciência dos que haveriam de crer; as tradições luterana, católica e ortodoxa o enquadram, cada uma, de outro modo. O painel de Perspectivas apresenta essas leituras. “Glorificou” está no passado, embora a glória ainda seja futura (8:18): a nota da Tyndale o explica como a decisão firme de Deus, tão certa como se já estivesse realizada, enquanto John Wesley ouvia Paulo falar como quem olha para trás a partir da meta.',
    },
    'romans-8:concept:mortification': {
      label: 'Fazer morrer o pecado',
      aliases: [
        'fazer morrer',
        'mortificar',
        'mortificação',
        'mortificação do pecado',
        'ações do corpo',
        'obras do corpo',
        'matar o pecado',
        'devedores',
        'obrigação',
        'santificação',
        'santidade',
        'o que é mortificação',
      ],
      answer:
        '“Se, pelo Espírito, fizerdes morrer as ações do corpo, vivereis” (8:13). Os crentes não devem nada à carne (8:12); por isso devem continuar matando o pecado — o verbo está no presente, uma ação contínua —, mas somente “pelo Espírito”, não pelas próprias forças. A obra de John Owen Of the Mortification of Sin in Believers (1656), construída sobre este versículo, insiste em que os que foram libertos da condenação devem fazer disso a ocupação de toda a vida: ou matam o pecado, ou o pecado os matará.',
    },
    'romans-8:concept:intercession': {
      label: 'O auxílio do Espírito na oração',
      aliases: [
        'intercessão',
        'interceder',
        'intercede',
        'intercede por nós',
        'oração',
        'orar',
        'gemidos inexprimíveis',
        'gemidos',
        'fraqueza',
        'fraquezas',
        'não sabemos orar',
        'o espírito intercede',
      ],
      answer:
        'Quando “não sabemos orar como se deve”, o Espírito “ajuda em nossas fraquezas” — o verbo retrata alguém que segura um fardo junto com outra pessoa — e “intercede por nós com gemidos inexprimíveis” (8:26). Deus, que examina os corações, conhece a intenção do Espírito, que intercede segundo a vontade de Deus (8:27). Enquanto isso, Cristo intercede à direita de Deus (8:34). Se esses gemidos são do próprio Espírito ou nossos, despertados por ele, é algo debatido; veja Perspectivas.',
    },
    'romans-8:concept:separation': {
      label: 'Nada pode nos separar',
      aliases: [
        'separar',
        'separação',
        'nenhuma separação',
        'amor de deus',
        'amor de cristo',
        'mais que vencedores',
        'vencedores',
        'se deus é por nós',
        'quem será contra nós',
        'quem nos separará',
        'segurança',
        'certeza da salvação',
        'perseguição',
        'ovelhas para o matadouro',
      ],
      answer:
        'O capítulo termina num tribunal de perguntas: se Deus é por nós, quem será contra nós? Quem acusará os escolhidos de Deus, se é Deus quem justifica? Quem condenará, se Cristo morreu, ressuscitou e intercede? Quem nos separará do amor de Cristo? Paulo cita o Salmo 44:22 para mostrar que o sofrimento não é sinal de rejeição e então diz: “somos mais que vencedores” — ὑπερνικάω, palavra que só aparece aqui no Novo Testamento. Nada em toda a criação pode nos separar do amor de Deus em Cristo Jesus (8:31–39).',
    },
  },
};

export default overlay;
