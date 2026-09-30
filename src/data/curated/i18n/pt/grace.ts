/**
 * Português (Brasil) — tradução do estudo temático curado “Graça” (src/data/curated/studies/grace.ts),
 * ancorado em Efésios 2:1–10.
 *
 * Citações bíblicas entre aspas seguem a Bíblia Livre (BLIVRE), versão padrão em português;
 * quando outra redação é discutida, a versão é nomeada. Âncoras conferidas com o texto de
 * BLIVRE, NBV e BPM (bible.helloao.org). Citações verificadas não são reescritas: recebem
 * apenas uma tradução livre (quoteTranslation). Títulos de obras modernas ficam como citados.
 */
import type { StudyOverlay } from '../types';

const e2 = (verse: number) => ({ book: 'EPH', chapter: 2, verse });

const overlay: StudyOverlay = {
  studyId: 'grace',
  locale: 'pt',
  title: 'Graça',
  subtitle: 'O favor imerecido de Deus em Cristo',
  summary:
    'Este estudo acompanha uma das palavras mais ricas da Bíblia — graça — desde a linguagem de favor e de amor leal do Antigo Testamento até sua expressão mais plena em Jesus Cristo. Ele se ancora em Efésios 2:1–10, onde Paulo passa da condição da humanidade, pela virada do “Mas Deus”, a uma salvação que vem pela graça, por meio da fé, como dom de Deus, e não como salário. Ao longo do caminho, examina as principais palavras hebraicas e gregas, explica o que charis significava num mundo de patronos e benfeitores e mostra como a graça produz um novo modo de vida (2:10). Também apresenta, com a maior imparcialidade possível, onde as tradições cristãs concordam sobre a graça e onde há muito divergem.',
  opening:
    'A graça está no coração da fé cristã, e poucas passagens a expressam com mais clareza do que Efésios 2:1–10 — abri o texto aqui ao lado, com as palavras-chave marcadas. Reuni também o pano de fundo do Antigo Testamento, o grego por trás de “graça”, o que os primeiros leitores teriam ouvido e vozes que vão de Agostinho a Tim Keller. Você prefere começar pelo sentido da palavra, pelo argumento de Paulo nestes versículos ou por como a graça transforma uma vida?',
  matchTopics: [
    'graça',
    'graca',
    'a graça de deus',
    'graça de deus',
    'graca de deus',
    'favor imerecido',
    'o que é graça',
    'o que e graca',
    'salvos pela graça',
    'salvo pela graça',
    'salvos pela graca',
    'pela graça sois salvos',
    'maravilhosa graça',
    'sublime graça',
    'charis',
    'o que a bíblia diz sobre a graça',
    'o que a biblia diz sobre a graca',
  ],
  suggestedQuestions: [
    'Qual é a palavra grega por trás de “graça”?',
    'O que Paulo quer dizer com “carne” aqui?',
    'Explique o versículo 8 com mais detalhes.',
    'Como o público original teria entendido a graça?',
    'Em que outros lugares Paulo fala de ser salvo pela graça?',
    'Como isto se relaciona com Romanos?',
    'Como Efésios 2:10 se harmoniza com Tiago 2?',
    'O que Tim Keller disse sobre a graça?',
    'Existem diferentes interpretações teológicas desta passagem?',
  ],

  /* ---------------- Tema ---------------- */
  topic: {
    name: 'Graça',
    question: 'O que a Bíblia quer dizer com graça?',
    definition:
      'Nas Escrituras, graça é o favor livre e imerecido de Deus para com pessoas que não têm nenhum direito a ele, junto com os dons que fluem desse favor. Israel aprendeu esse vocabulário muito antes de Paulo: chen (favor), chanan (ser gracioso) e hesed (amor leal e constante) descrevem um Deus que se revelou gracioso e compassivo (Êx 34:6–7) e escolheu Israel por puro amor, e não por mérito (Dt 7:7–8). No Novo Testamento, o grego charis nomeia o que Deus fez em Cristo: os pecadores são justificados gratuitamente pela sua graça (Rm 3:24) e salvos pela graça, por meio da fé, como dom, e não por obras (Ef 2:8–9). A graça é também poder. Ela educa os crentes para uma vida piedosa (Tt 2:11–12), sustenta-os na fraqueza (2Co 12:9) e molda um novo modo de andar (Ef 2:10).',
  },
  topicPassages: {
    'grace:kp:gen-6-8': {
      title: 'Noé achou favor',
      group: 'A graça no Antigo Testamento',
      note: 'O primeiro uso bíblico de chen (favor). Contra um pano de fundo de corrupção universal (6:5–7), o narrador menciona o favor do SENHOR para com Noé antes de descrever a justiça de Noé, na nova seção que começa em 6:9 (“Estas são as gerações de Noé”). Muitos leitores veem aqui um primeiro indício de que o resgate começa na disposição de Deus, e não na realização humana, embora a expressão idiomática de achar favor aos olhos de alguém possa, em outros lugares, seguir-se a uma conduta observada (Gn 39:4).',
    },
    'grace:kp:exod-34-6': {
      title: 'O SENHOR, gracioso e compassivo',
      group: 'A graça no Antigo Testamento',
      note: 'A autodescrição de Deus a Moisés depois do bezerro de ouro: compassivo, gracioso (channun), grande em amor leal (hesed) e em fidelidade, que perdoa a iniquidade — sem, contudo, deixar de levar em conta a culpa. Essa confissão ecoa por todo o Antigo Testamento (Sl 103:8; Jn 4:2) e é o solo no qual cresce a linguagem neotestamentária da graça.',
    },
    'grace:kp:deut-7-7': {
      title: 'Escolhidos porque ele vos amou',
      group: 'A graça no Antigo Testamento',
      note: 'Moisés nega que Israel tenha sido escolhido por seu tamanho ou por sua força; a única razão dada é que o SENHOR o amou e quis guardar o seu juramento. Uma eleição fundada no amor de Deus, e não no valor de quem a recebe, é graça em tudo, menos no nome.',
    },
    'grace:kp:ps-103-8': {
      title: 'Ele não nos trata conforme nossos pecados',
      group: 'A graça no Antigo Testamento',
      note: 'Davi canta a confissão de Êxodo 34 (103:8) e extrai o seu sentido: Deus não nos retribuiu segundo as nossas iniquidades, afastou de nós as nossas transgressões tanto quanto o oriente está longe do ocidente e se compadece de nós como um pai se compadece dos filhos, lembrando-se de que somos pó.',
    },
    'grace:kp:jonah-4-2': {
      title: 'Irado com a graça',
      group: 'A graça no Antigo Testamento',
      note: 'Jonas cita a mesma confissão — gracioso, misericordioso, grande em amor leal — como queixa: ele fugiu porque sabia que Deus pouparia Nínive. A graça ofende quando alcança pessoas que julgamos indignas, tema que Jesus desenvolve na parábola do irmão mais velho (Lc 15:25–32).',
    },
    'grace:kp:john-1-14': {
      title: 'Cheio de graça e de verdade',
      group: 'A graça revelada em Cristo',
      note: 'A Palavra feita carne é cheia de graça e de verdade, e de sua plenitude recebemos graça por graça. João contrasta a Lei dada por meio de Moisés com a graça e a verdade que vieram por Jesus Cristo — não para rejeitar a Lei como má, mas para apresentar Cristo como a revelação mais plena do favor de Deus.',
    },
    'grace:kp:2-cor-8-9': {
      title: 'Por causa de vós se fez pobre',
      group: 'A graça revelada em Cristo',
      note: 'Paulo define a graça de nosso Senhor Jesus Cristo como uma troca custosa: sendo rico, ele se fez pobre para que nós nos tornássemos ricos. A graça, aqui, não é uma atitude abstrata, mas um ato de entrega de si mesmo.',
    },
    'grace:kp:luke-15': {
      title: 'O pai e seus dois filhos',
      group: 'A graça revelada em Cristo',
      note: 'Contada a fariseus que murmuravam porque Jesus acolhia pecadores (15:1–2). O pai corre ao encontro do filho mais novo que volta e também sai para rogar ao filho mais velho, ressentido. A graça alcança tanto o rebelde declarado quanto o cumpridor de deveres que pensa ter conquistado o seu lugar.',
    },
    'grace:kp:matt-20': {
      title: 'O proprietário generoso',
      group: 'A graça revelada em Cristo',
      note: 'Trabalhadores contratados na última hora recebem o mesmo salário que os que trabalharam o dia inteiro. A resposta do proprietário — não me é permitido ser generoso com o que é meu? — expõe o instinto de medir os dons de Deus pelo nosso trabalho.',
    },
    'grace:kp:eph-2-1': {
      title: 'Pela graça sois salvos',
      group: 'Salvos pela graça',
      note: 'A passagem-âncora deste estudo. Paulo passa da morte espiritual (2:1–3) à intervenção de Deus (2:4–7), resume a salvação como pela graça, por meio da fé, dom de Deus e não por obras (2:8–9), e termina com a vida nova de boas obras que Deus preparou (2:10).',
    },
    'grace:kp:rom-3-21': {
      title: 'Justificados gratuitamente pela sua graça',
      group: 'Salvos pela graça',
      note: 'Porque todos pecaram (3:23), a justiça que vem de Deus precisa vir sem a Lei, por meio da fé em Jesus Cristo. Os crentes são justificados como dom (dōrean) pela sua graça, por meio da redenção em Cristo, a quem Deus apresentou como propiciação.',
    },
    'grace:kp:rom-5-15': {
      title: 'Onde o pecado aumentou, a graça superabundou',
      group: 'Salvos pela graça',
      note: 'Paulo contrasta a transgressão de Adão com o dom de Cristo: o dom não é como a transgressão. A graça não apenas iguala o pecado; ela o ultrapassa, de modo que a graça reina pela justiça para a vida eterna.',
    },
    'grace:kp:rom-11-5': {
      title: 'De outra maneira, a graça já não é graça',
      group: 'Salvos pela graça',
      note: 'Um remanescente é escolhido pela graça, e Paulo traça a linha lógica: se é pela graça, já não é pelas obras. Misturar as duas coisas esvaziaria a graça de seu sentido.',
    },
    'grace:kp:gal-2-21': {
      title: 'Não anulo a graça de Deus',
      group: 'Salvos pela graça',
      note: 'Se a justiça viesse por meio da Lei, Cristo teria morrido por nada (dōrean, a mesma palavra que significa “gratuitamente”, “como dom”, em Rm 3:24). Paulo recusa qualquer caminho para a justiça que torne a cruz desnecessária.',
    },
    'grace:kp:titus-3-4': {
      title: 'Não pelas obras de justiça, mas segundo a sua misericórdia',
      group: 'Salvos pela graça',
      note: 'Um paralelo próximo de Efésios 2: manifestaram-se a bondade e o amor de Deus; ele nos salvou não por causa de nossas obras de justiça, mas segundo a sua misericórdia, pelo banho do novo nascimento e da renovação do Espírito Santo, para que, justificados pela sua graça, nos tornássemos herdeiros.',
    },
    'grace:kp:rom-6-1': {
      title: 'Continuaremos no pecado, para que a graça aumente?',
      group: 'Vivendo pela graça',
      note: 'Paulo antecipa o abuso da graça e o rejeita: os crentes morreram para o pecado com Cristo no batismo e agora andam em novidade de vida. O pecado não terá domínio justamente porque eles estão debaixo da graça, e não debaixo da Lei (6:14).',
    },
    'grace:kp:titus-2-11': {
      title: 'A graça que educa',
      group: 'Vivendo pela graça',
      note: 'A graça de Deus, que traz salvação, também ensina os crentes a renunciar à impiedade e a viver de maneira sóbria, justa e piedosa enquanto aguardam a manifestação de Cristo. A graça é mestra, além de dom, e forma um povo zeloso de boas obras.',
    },
    'grace:kp:2-cor-12-9': {
      title: 'Minha graça te basta',
      group: 'Vivendo pela graça',
      note: 'Sem ser livrado de seu espinho na carne, Paulo recebe, em vez disso, uma promessa: a graça de Cristo basta, e o seu poder se aperfeiçoa na fraqueza. A graça não é apenas o começo da vida cristã, mas a sua força diária.',
    },
    'grace:kp:heb-4-16': {
      title: 'O trono da graça',
      group: 'Vivendo pela graça',
      note: 'Porque Jesus é um sumo sacerdote que se compadece de nós, os crentes podem aproximar-se com confiança do trono de Deus — aqui chamado trono da graça — para receber misericórdia e encontrar graça para socorro no tempo oportuno.',
    },
    'grace:kp:1-pet-4-10': {
      title: 'Administradores da variada graça de Deus',
      group: 'Vivendo pela graça',
      note: 'Cada crente recebeu um dom (charisma) e deve usá-lo para servir aos outros, como bom administrador da multiforme graça de Deus. A graça recebida torna-se graça repassada.',
    },
  },

  /* ---------------- Palavras-chave ---------------- */
  keyWords: {
    'grace:kw:charis': {
      english: 'graça',
      grammar: 'Substantivo, dativo singular feminino (χάριτι, “pela graça”) em 2:5 e 2:8; genitivo singular (χάριτος) em 2:7',
      basicMeaning: 'graça; favor, bondade, benevolência',
      semanticRange: [
        'favor ou benevolência da parte de quem dá — no Novo Testamento, especialmente o favor livre de Deus',
        'um dom ou uma prova concreta de favor',
        'agradecimento, gratidão (a resposta de quem recebe)',
        'graciosidade, encanto (por exemplo, no falar)',
        'um estado de graça no qual os crentes estão firmes',
      ],
      notableNotes: [
        'Graça por graça, da plenitude de Cristo; a graça e a verdade vieram por meio de Jesus Cristo.',
        'Justificados gratuitamente (dōrean) pela sua graça (charis) — o paralelo mais próximo de Ef 2:8.',
        'Ao que trabalha, o pagamento é considerado dívida, e não favor (kata charin): a graça é o oposto da dívida.',
        'Se é pela graça, já não é pelas obras — do contrário, a graça já não seria graça.',
        'Os crentes têm acesso “a esta graça, na qual estamos firmes”: a graça como estado estável.',
        'Charis com o sentido de “agradecimento”: “graças a Deus por seu dom indescritível”.',
        'A graça de Cristo basta; o seu poder se aperfeiçoa na fraqueza.',
      ],
      significance:
        'Charis ocorre 155 vezes no Novo Testamento grego NA28 (156 na concordância do aplicativo, que também conta Rm 16:24, versículo impresso no Textus Receptus e no texto bizantino, mas não no NA28), 12 delas em Efésios e três nesta passagem (2:5, 7, 8). Aqui ela nomeia o favor de Deus como a única fonte do resgate: os mortos não podem contribuir para a própria ressurreição (2:5), as riquezas desse favor serão exibidas nos tempos futuros (2:7), e ele exclui todo motivo de orgulho (2:8–9). No mundo de Paulo, a mesma palavra podia designar também o dom e a gratidão que ele exigia (veja Contexto histórico), e o próprio Paulo passa direto da graça às boas obras de 2:10 — mas esse vínculo vem do seu argumento, e não dos outros sentidos da palavra.',
      caution:
        'Charis não é um termo técnico com um único sentido fixo: em Lucas 17:9 significa “agradecimento”, e em Cl 4:6 descreve a fala graciosa. Sua força em Efésios 2 vem do argumento de Paulo (a graça contraposta às obras, 2:8–9), e não da palavra isoladamente.',
      anchors: [
        { verse: e2(5), phrases: { BLIVRE: 'graça', NBV: 'graça', BPM: 'graça' } },
        { verse: e2(7), phrases: { BLIVRE: 'graça', NBV: 'graça', BPM: 'graça' } },
        { verse: e2(8), phrases: { BLIVRE: 'graça', NBV: 'graça', BPM: 'graça' } },
      ],
    },
    'grace:kw:eleos': {
      english: 'misericórdia',
      grammar: 'Substantivo, dativo singular neutro (ἐλέει) depois de ἐν: “rico em misericórdia” (2:4)',
      basicMeaning: 'misericórdia, piedade, compaixão',
      semanticRange: [
        'misericórdia demonstrada por pessoas a outras (Mt 9:13; Lc 10:37)',
        'a misericórdia de Deus para com os necessitados e os que não a merecem',
        'a misericórdia de Cristo (Jd 21)',
        'misericórdia invocada em saudações e bênçãos (1Tm 1:2; 2Jo 3)',
      ],
      notableNotes: [
        'Ele nos salvou não por nossas obras de justiça, mas segundo a sua misericórdia — um paralelo próximo de Ef 2:4–9.',
        'Jesus cita Os 6:6 (“Quero misericórdia”); ali o hebraico traz hesed, e o grego, eleos.',
        'Os “vasos da misericórdia”, que Deus “preparou com antecedência para a glória”.',
        'O cântico de Maria: a sua misericórdia é de geração em geração sobre os que o temem.',
        'Junto ao trono da graça, recebemos misericórdia e encontramos graça.',
      ],
      significance:
        'Paulo enraíza o resgate divino em duas coisas a respeito do próprio Deus: ele é rico em misericórdia e age por causa do seu grande amor (2:4). A misericórdia olha para a miséria de 2:1–3; a graça, para o dom imerecido de 2:5–8. No Antigo Testamento grego, eleos traduz sobretudo hesed, de modo que “rico em misericórdia” se insere na longa confissão de Israel sobre um Deus grande em amor leal (Êx 34:6). Eleos ocorre 27 vezes no NA28.',
      caution:
        'A distinção bem arrumada — “a misericórdia retém o que merecemos; a graça dá o que não merecemos” — é um resumo útil, mas os autores bíblicos muitas vezes usam as palavras juntas (Tt 3:5–7; Hb 4:16) sem traçar uma linha nítida.',
      anchors: [{ verse: e2(4), phrases: { BLIVRE: 'misericórdia', NBV: 'misericórdia', BPM: 'misericórdia' } }],
    },
    'grace:kw:sozo': {
      english: 'salvos',
      grammar:
        'Particípio perfeito passivo, nominativo plural masculino (σεσῳσμένοι), com ἐστε (presente, “sois”): um perfeito perifrástico — “sois pessoas que foram salvas” (2:5, 2:8)',
      basicMeaning: 'salvar, resgatar, livrar; curar',
      semanticRange: [
        'livrar de perigo, dano ou morte (Mt 8:25)',
        'curar, restaurar a saúde (Mc 5:34)',
        'salvar do pecado e de suas consequências — dito como passado, presente ou futuro',
      ],
      notableNotes: [
        'Aoristo: “fomos salvos na esperança”.',
        'Presente: “para os que se salvam”, a palavra da cruz é poder de Deus.',
        'Futuro: “seremos por ele salvos da ira” e “seremos salvos pela sua vida”.',
        'Perfeito do indicativo: “A tua fé te salvou” — a fé associada a um resgate concluído.',
        'Aoristo: “segundo sua misericórdia, ele nos salvou”.',
      ],
      significance:
        'Sōzō ocorre 106 vezes no NA28 (107 na concordância do aplicativo, que também conta Mt 18:11, versículo presente apenas no Textus Receptus e no texto bizantino), mas o particípio perfeito σεσῳσμένοι aparece somente aqui, em 2:5 e 2:8 (TAGNT). O perfeito apresenta a salvação como um ato concluído com resultados duradouros: os que estavam mortos são agora — e continuam sendo — pessoas resgatadas. Em outros lugares, Paulo fala da salvação como passada, em curso e ainda por vir (Rm 8:24; 1Co 1:18; Rm 5:9–10); Efésios enfatiza sua realidade presente e estabelecida, e por isso Paulo pode dizer que os crentes já foram ressuscitados e estão assentados com Cristo (2:6).',
      caution:
        'O tempo perfeito descreve a situação presente dos leitores tal como Paulo a vê; ele não resolve, por si só, debates posteriores sobre a certeza da salvação ou a perseverança, que se apoiam em muitos outros textos.',
      anchors: [
        { verse: e2(5), phrases: { BLIVRE: 'sois salvos', NBV: 'fomos salvos', BPM: 'nos salvou' } },
        { verse: e2(8), phrases: { BLIVRE: 'sois salvos', NBV: 'são salvos', BPM: 'fostes salvos' } },
      ],
    },
    'grace:kw:pistis': {
      english: 'fé',
      grammar: 'Substantivo, genitivo singular feminino (πίστεως) depois de διά: “por meio da fé” (2:8)',
      basicMeaning: 'fé, crença, confiança',
      semanticRange: [
        'fé, confiança (no Novo Testamento, em Deus ou em Cristo)',
        'crença, convicção',
        'fidelidade, lealdade (Rm 3:3; Gl 5:22)',
        'compromisso de fidelidade (1Tm 5:12)',
      ],
      notableNotes: [
        'A justiça de Deus vem por meio da fé em Jesus Cristo, para todos os que creem.',
        'Justificados pela fé, temos acesso pela fé a esta graça.',
        'A vida que vivo, vivo-a pela fé no Filho de Deus, que me amou.',
        'A fé como certeza das coisas que se esperam.',
        'A fé sem obras está morta — o desafio de Tiago a uma fé meramente verbal.',
      ],
      significance:
        'Paulo diz que somos salvos pela graça (um dativo simples: a graça é o que salva) por meio da fé (διά com genitivo: o canal pelo qual ela é recebida), e usa ἐκ, “de”, apenas para negar outras fontes — “não vem de vós … não por obras” (2:8–9). A fé recebe, em vez de conquistar; por isso ela combina com o “não por obras” de 2:9, e por isso o orgulho fica excluído. Pistis ocorre 243 vezes no NA28 — 40 em Romanos, 22 em Gálatas, 16 em Tiago —, de modo que a relação entre fé e obras é uma conversa que atravessa o Novo Testamento, e não um único versículo.',
      caution:
        'Os estudiosos debatem se a expressão paulina pistis Christou significa fé em Cristo ou a própria fidelidade de Cristo (por exemplo, Rm 3:22); Ef 2:8 não tem essa expressão e simplesmente nomeia a confiança do crente.',
      anchors: [{ verse: e2(8), phrases: { BLIVRE: 'fé', NBV: 'fé', BPM: 'fé' } }],
    },
    'grace:kw:doron': {
      english: 'dom',
      grammar:
        'Substantivo, nominativo singular neutro (δῶρον) em 2:8, na expressão θεοῦ τὸ δῶρον (“de Deus [é] o dom”), com θεοῦ colocado primeiro para dar ênfase',
      basicMeaning: 'dom, presente',
      semanticRange: ['dom ou presente (Mt 2:11)', 'oferta trazida a Deus (Mt 5:23–24; Hb 5:1)', 'o dom de Deus às pessoas (Ef 2:8)'],
      notableNotes: [
        'Os presentes dos magos: ouro, incenso e mirra.',
        'Uma oferta apresentada no altar — o sentido habitual de dōron como oferta a Deus.',
        'O sumo sacerdote apresenta “tanto ofertas como sacrifícios pelos pecados”.',
        'Os ricos lançam suas ofertas (dōra) no tesouro do templo — ofertas a Deus, ao lado das duas pequenas moedas da viúva.',
      ],
      significance:
        'Das 19 ocorrências de dōron no NA28, a maioria descreve ofertas que as pessoas trazem a Deus; Ef 2:8 inverte isso e faz de Deus o doador. A outra palavra de Paulo, charisma (de charis), expressa algo semelhante em Rm 6:23: o dom gratuito de Deus é a vida eterna. “Isto” (τοῦτο), em 2:8, é neutro e não concorda com os substantivos femininos graça e fé; por isso muitos intérpretes entendem que se refere ao acontecimento inteiro — ser salvo pela graça, por meio da fé — como dom de Deus, e não como realização nossa.',
      caution:
        'Se “isto” se refere especificamente à fé é algo debatido desde a igreja antiga: Crisóstomo e Agostinho incluíam a fé no dom, ao passo que Calvino entendia o dom como a própria salvação. A gramática permite uma referência ao todo.',
      anchors: [{ verse: e2(8), phrases: { BLIVRE: 'dom de Deus', NBV: 'dádiva de Deus', BPM: 'dom de Deus' } }],
    },
    'grace:kw:poiema': {
      english: 'feitura, obra',
      grammar:
        'Substantivo, nominativo singular neutro (ποίημα), predicativo de ἐσμεν — “somos [sua] feitura” —, com αὐτοῦ (“dele”) colocado primeiro para dar ênfase (2:10)',
      basicMeaning: 'aquilo que é feito, uma obra',
      semanticRange: ['coisa feita, obra', 'as obras de Deus na criação (Rm 1:20)', 'a nova criação de Deus em Cristo (Ef 2:10)'],
      notableNotes: ['O único outro uso no Novo Testamento: o poder de Deus é entendido “por meio das coisas criadas”.'],
      significance:
        'Poiēma aparece apenas duas vezes no Novo Testamento: a respeito da criação, em Rm 1:20, e dos crentes, aqui. A combinação é sugestiva — o Deus que fez o mundo fez um novo povo, “criados em Cristo Jesus” (2:10), ecoando a linguagem paulina da nova criação (2Co 5:17). As boas obras não são a matéria-prima da salvação, mas o propósito da nova obra de Deus. No Antigo Testamento grego, poiēma traduz sobretudo ma‘aseh, “obra, feito”.',
      caution:
        'O ensino popular às vezes traduz poiēma por “obra-prima” ou “poema”. O sentido do léxico é simplesmente “aquilo que é feito, uma obra”; a dignidade da ideia vem do Autor e do seu propósito, e não da palavra em si.',
      anchors: [{ verse: e2(10), phrases: { BLIVRE: 'fomos feitos por ele', NBV: 'fez de nós o que somos', BPM: 'sua obra' } }],
    },
    'grace:kw:dorean': {
      english: 'gratuitamente, como dom',
      grammar: 'Advérbio — o acusativo de δωρεά (“dom”) usado adverbialmente: “gratuitamente, como dom” (Rm 3:24)',
      basicMeaning: 'gratuitamente, como dom; em vão, por nada',
      semanticRange: [
        'gratuitamente, sem pagamento (Mt 10:8; Ap 22:17)',
        'como dom, de graça (Rm 3:24)',
        'sem causa (Jo 15:25)',
        'em vão, por nada (Gl 2:21)',
      ],
      notableNotes: [
        'Justificados gratuitamente (dōrean) pela sua graça.',
        'Se a justiça viesse por meio da Lei, Cristo teria morrido por nada (dōrean).',
        '“recebestes de graça, dai de graça.”',
        'Quem tem sede, “tome de graça da água da vida”.',
        '“Sem causa me odiaram” — o mesmo advérbio com o sentido de “sem motivo”.',
      ],
      significance:
        'Dōrean não ocorre em Efésios 2, mas está por trás de “justificados gratuitamente pela sua graça”, em Rm 3:24, o paralelo mais próximo de Ef 2:8. Aparece nove vezes no NA28. Paulo usa a mesma palavra em Gl 2:21 em seu outro sentido: se a justiça viesse por meio da Lei, Cristo teria morrido “por nada”. Ou a graça é gratuita, ou a cruz foi inútil.',
      caution:
        'Os dois sentidos (“como dom” e “por nada”) são usos diferentes de uma mesma palavra, e não um duplo sentido oculto em todos os textos; o contexto decide.',
    },
    'grace:kw:chen': {
      english: 'favor, graça',
      grammar: 'Substantivo, masculino singular absoluto (Gn 6:8), na expressão idiomática “achar favor aos olhos de”',
      basicMeaning: 'favor, graça, encanto',
      semanticRange: [
        'favor, aceitação aos olhos de alguém (Gn 6:8; Êx 33:12–17)',
        'graça dada por Deus (Pv 3:34; Zc 12:10)',
        'encanto, elegância (Pv 31:30)',
      ],
      notableNotes: [
        'Primeira ocorrência: “Noé achou favor aos olhos do SENHOR”.',
        'Moisés intercede com base em ter achado favor; chen ocorre cinco vezes em Êxodo 33.',
        'Ele “dará graça aos humildes” — citado em Tg 4:6 e 1Pe 5:5 com charis.',
        'A pedra angular é trazida “com gritos de: Graça! graça seja!”',
        'Deus derramará sobre Jerusalém “o Espírito de graça e de orações”.',
      ],
      significance:
        'Chen ocorre 69 vezes na Bíblia Hebraica (TAHOT), 14 delas em Gênesis e 13 em Provérbios, na maioria das vezes na expressão “achar favor aos olhos de”. Sua primeira aparição é Gn 6:8, onde o favor do SENHOR para com Noé é mencionado antes da justiça dele (6:9). No Antigo Testamento grego, charis traduz sobretudo chen — uma ponte entre o vocabulário de Israel e o de Paulo.',
      caution:
        'Muitos usos de chen descrevem o favor social comum (Gn 39:4) ou o encanto (Pv 31:30); nem toda ocorrência carrega o peso teológico da charis de Paulo.',
    },
    'grace:kw:hesed': {
      english: 'amor leal, bondade',
      grammar: 'Substantivo, masculino singular absoluto em Êx 34:6: rav-chesed, “grande em amor leal” (na Bíblia Livre, “grande em benignidade”)',
      basicMeaning: 'bondade, benignidade, fidelidade',
      semanticRange: [
        'bondade, benignidade',
        'amor leal, fidelidade dentro de uma relação ou aliança',
        'misericórdia para com quem não a merece (Sl 51:1; Lm 3:22)',
      ],
      notableNotes: [
        'Grande em amor leal, que o mantém por milhares de gerações, perdoando a iniquidade.',
        'O Deus fiel “guarda o pacto e a misericórdia” aos que o amam.',
        'O refrão “sua bondade dura para sempre” — hesed ocorre 26 vezes neste salmo.',
        '“É pelas bondades do SENHOR que não somos consumidos”; as suas misericórdias “são novas a cada manhã”.',
        '“Quero misericórdia, e não sacrifício” — citado por Jesus em Mt 9:13 com eleos.',
        'Praticar a justiça, amar a bondade (hesed) e andar humildemente com o teu Deus.',
      ],
      significance:
        'Hesed ocorre cerca de 245 vezes na Bíblia Hebraica (TAHOT), 127 delas nos Salmos, e descreve o amor comprometido e leal de Deus — sobretudo dentro de sua aliança com Israel. Não é simplesmente a palavra hebraica correspondente a charis (o Antigo Testamento grego costuma traduzi-la por eleos, “misericórdia”), mas fornece boa parte do que Paulo quer dizer quando chama Deus de rico em misericórdia e fala do seu grande amor (Ef 2:4): um amor que permanece fiel aos infiéis.',
      caution:
        'As traduções vertem hesed de muitas maneiras — só a Bíblia Livre usa benignidade, bondade e misericórdia; em inglês, steadfast love, lovingkindness ou loving devotion. Nenhuma palavra isolada a capta, e ela não deve ser achatada nem em “graça” nem em mera “lealdade”.',
    },
    'grace:kw:chanan': {
      english: 'ser gracioso',
      grammar:
        'Verbo, imperativo Qal masculino singular com sufixo de 1ª pessoa em Sl 51:1 (chonneni, “sê gracioso para comigo”; na Bíblia Livre, “Tem misericórdia de mim”)',
      basicMeaning: 'ser gracioso, mostrar favor, ter compaixão',
      semanticRange: [
        'mostrar favor, ser gracioso (Qal)',
        'receber compaixão, ser favorecido (Nifal, Hofal)',
        'buscar ou implorar favor (Hitpael)',
      ],
      notableNotes: [
        'A bênção sacerdotal: o SENHOR faça resplandecer o seu rosto sobre ti e “tenha de ti misericórdia”.',
        'A súplica de Davi depois do seu pecado: tem misericórdia de mim, ó Deus, segundo a tua hesed.',
        'Deus declara que será gracioso (chanan) com quem ele quiser ser gracioso — Paulo cita o texto em Rm 9:15, onde o grego traduz chanan por eleeō, “ter misericórdia”.',
        'O SENHOR espera para ter piedade (chanan) de vós e se levanta para se compadecer de vós.',
      ],
      significance:
        'Chanan (77 vezes no TAHOT) é o verbo da bênção sacerdotal (Nm 6:25) e do clamor do penitente (Sl 51:1). O adjetivo correspondente, channun, “gracioso”, ocorre 13 vezes e é usado quase exclusivamente para Deus, muitas vezes na fórmula quase credal de Êx 34:6, que ecoa em Sl 103:8 e Jn 4:2. Em Êx 33:19, Deus declara que será gracioso com quem ele quiser ser gracioso; Paulo cita o texto em Rm 9:15–16 para mostrar que a misericórdia depende de Deus, e não do querer ou do esforço humano.',
      caution:
        'Palavras da mesma raiz (chen, chanan, channun) têm um ar de família, mas o sentido de cada uma é determinado pelo uso no contexto, e não apenas pela raiz.',
    },
  },

  /* ---------------- Referências cruzadas ---------------- */
  crossReferences: {
    'grace:xr:rom-3-23': {
      title: 'Justificados gratuitamente pela sua graça',
      explanation:
        'Romanos diz em termos jurídicos o que Efésios diz em termos de resgate. Todos pecaram (compare Ef 2:1–3), e todos os que são postos em paz com Deus são justificados como dom (dōrean) pela sua graça (charis). As duas passagens situam a causa inteiramente em Deus e o meio na redenção de Cristo.',
    },
    'grace:xr:rom-5-6': {
      title: 'Quando ainda éramos pecadores — e inimigos',
      explanation:
        'Ef 2:5 diz que Deus nos deu vida “estando nós ainda mortos”; Rm 5 diz que Cristo morreu por nós quando éramos fracos, pecadores e inimigos. As duas passagens insistem em que o amor de Deus agiu antes de qualquer mudança em nós — e é exatamente isso que o torna graça. Romanos acrescenta o olhar para a frente: tendo sido reconciliados, muito mais seremos salvos.',
    },
    'grace:xr:col-2-13': {
      title: 'Mortos nas ofensas, vivificados com Cristo',
      explanation:
        'O paralelo verbal mais próximo no Novo Testamento. Colossenses também descreve os leitores como mortos nas ofensas e vivificados com Cristo, usando o mesmo verbo raro, συζωοποιέω, encontrado apenas em Ef 2:5 e Cl 2:13. Colossenses acrescenta o como: Deus perdoou todas as nossas ofensas e cancelou o registro da dívida, cravando-o na cruz.',
    },
    'grace:xr:titus-3-4': {
      title: 'Bondade, misericórdia, não por obras',
      explanation:
        'Tito 3 corre nos mesmos trilhos de Efésios 2: manifestaram-se a bondade (χρηστότης, como em Ef 2:7) e o amor de Deus; ele nos salvou não por obras de justiça, mas segundo a sua misericórdia (ἔλεος, como em Ef 2:4); e somos justificados pela sua graça. Tito acrescenta a obra do Espírito no novo nascimento e na renovação.',
    },
    'grace:xr:gal-2-20': {
      title: 'Não anulo a graça de Deus',
      explanation:
        'Gálatas apresenta a versão pessoal e polêmica de Ef 2:8–9. Paulo vive pela fé no Filho de Deus, que o amou e se entregou por ele, e se recusa a anular a graça: se a justiça viesse por meio da Lei, Cristo teria morrido por nada. Acrescentar obras como fundamento da aceitação esvaziaria tanto a graça quanto a cruz.',
    },
    'grace:xr:rom-11-6': {
      title: 'Graça e obras não se misturam',
      explanation:
        'Rm 11:6 explicita a lógica por trás do “não por obras” de Ef 2:9: se algo é pela graça, já não é pelas obras; do contrário, “a graça já não é graça”. O contraste não é entre o dom de Deus e a obediência humana em geral, mas entre dois fundamentos incompatíveis para ser aceito.',
    },
    'grace:xr:rom-4-4': {
      title: 'Salário versus dom',
      explanation:
        'Paulo contrasta duas economias. O pagamento de quem trabalha é devido, e não dado como favor; mas Deus justifica o ímpio que confia nele, em vez de trabalhar para isso. Efésios 2:8–9 vive do mesmo contraste — dom, não salário; fé, não obras —, e por isso o orgulho fica excluído (compare Rm 4:2).',
    },
    'grace:xr:jas-2-14': {
      title: 'A fé sem obras está morta',
      explanation:
        'À primeira vista, Tiago parece contradizer Paulo: “o ser humano é justificado pelas obras, e não somente pela fé” (2:24). Mas Tiago tem em vista uma fé que afirma crer e nada produz, enquanto Paulo exclui as obras como fundamento da salvação. Ef 2:10 mostra onde os dois se encontram: as pessoas que Deus salva pela graça são criadas para as boas obras, de modo que uma fé que nunca anda nelas não é a fé de que Paulo fala. Os cristãos nem sempre acharam fácil conciliar os dois e ainda os ponderam de modos diferentes, mas a maioria das tradições hoje os lê como complementares.',
    },
    'grace:xr:ezek-36-26': {
      title: 'Um novo coração e um novo andar',
      explanation:
        'Ezequiel prometeu que Deus trocaria o coração de pedra por um coração de carne e poria o seu Espírito dentro do seu povo, fazendo-o andar nos seus estatutos. Efésios não cita Ezequiel, mas, lidos lado a lado, os dois textos partilham um padrão: em 2:1–10, os mortos recebem vida (2:5) e são recriados para andar em boas obras (2:10), invertendo o antigo andar de 2:2. Nos dois textos, a iniciativa é de Deus.',
    },
    'grace:xr:deut-7-7': {
      title: 'Amados porque ele vos amou',
      explanation:
        'Israel não foi escolhido por ser numeroso ou impressionante; o SENHOR pôs nele o seu amor simplesmente porque o amou e quis guardar o seu juramento. O “pelo seu muito amor” de Paulo (Ef 2:4) está na mesma linha: o amor de Deus é a sua própria razão, e não uma resposta ao valor dos seus objetos.',
    },
    'grace:xr:exod-34-6': {
      title: 'A confissão fundamental de Israel sobre um Deus gracioso',
      explanation:
        'No Sinai, depois da idolatria de Israel com o bezerro de ouro, Deus proclamou o seu nome: compassivo e gracioso, tardio para a ira, grande em hesed e em fidelidade, que perdoa a iniquidade. Essa autorrevelação tornou-se o credo de Israel (Sl 103:8; Jn 4:2). Quando Paulo chama Deus de rico em misericórdia e fala das riquezas de sua graça e de sua bondade (Ef 2:4, 7), ele fala como herdeiro dessa história.',
    },
    'grace:xr:john-1-16': {
      title: 'Graça por graça',
      explanation:
        'Paulo fala das abundantes riquezas da graça de Deus manifestadas em Cristo Jesus (2:7); João diz que da plenitude da Palavra encarnada recebemos graça por graça e que a graça e a verdade vieram por meio de Jesus Cristo. Os dois autores fazem do próprio Cristo o lugar onde a graça de Deus se manifesta plenamente.',
    },
    'grace:xr:2-cor-5-17': {
      title: 'Uma nova criação',
      explanation:
        'A expressão “criados em Cristo Jesus” (Ef 2:10) é linguagem de nova criação. Em 2Co 5:17, quem está em Cristo é nova criatura — as coisas velhas já passaram, tudo se fez novo —, e Paulo acrescenta que tudo isso vem de Deus. A salvação pela graça não é um conserto para o qual contribuímos, mas um ato criador de Deus.',
    },
    'grace:xr:phil-1-6': {
      title: 'Aquele que começou a boa obra irá completá-la',
      explanation:
        'Os crentes são feitura de Deus (Ef 2:10), e a confiança de Paulo em Fp 1:6 repousa na mesma lógica: o Deus que começou a boa obra neles a levará até o fim. A graça inicia e sustenta a vida cristã. (Como isso se relaciona com a perseverança é debatido; veja a nota sobre sōzō.)',
    },
    'grace:xr:luke-18-9': {
      title: 'O fariseu e o publicano',
      explanation:
        'Jesus conta esta parábola a pessoas que confiavam em sua própria justiça. O fariseu enumera seus jejuns e seus dízimos; o publicano apenas pede misericórdia a Deus — e volta para casa justificado. É um retrato narrativo de Ef 2:9: a salvação não vem das obras, para que ninguém se orgulhe.',
    },
    'grace:xr:rom-6-1': {
      title: 'A graça não é licença para pecar',
      explanation:
        'A graça gratuita provoca uma objeção: continuaremos no pecado para que a graça aumente? Paulo responde que os que estão unidos a Cristo em sua morte e ressurreição agora andam em novidade de vida. Ef 2:10 diz o mesmo de forma positiva — a graça recria as pessoas para as boas obras —, de modo que graça e santidade andam juntas.',
    },
  },

  /* ---------------- Contexto histórico e cultural ---------------- */
  context: {
    'grace:ctx:authorship': {
      title: 'Quem escreveu Efésios?',
      summary:
        'A carta nomeia Paulo como autor e foi tradicionalmente recebida como uma de suas Cartas da Prisão. Muitos estudiosos modernos, porém, pensam que foi escrita por um discípulo posterior de Paulo.',
      detail:
        'As dúvidas se apoiam em diferenças de vocabulário, estilo, contexto e ênfase teológica em relação às cartas incontestes de Paulo; alguns propõem um discípulo escrevendo em nome de Paulo ou uma carta paulina retrabalhada por um editor. Outros respondem que as diferenças podem ser explicadas pelo conteúdo litúrgico da carta, pelo uso de secretários por Paulo, pelo desenvolvimento de seu pensamento e por seu caráter de carta circular — as notas da Tyndale concluem que não há razão convincente para negar a autoria paulina. A questão afeta o modo como Efésios é situada no desenvolvimento de Paulo (por exemplo, o grande estudo de John Barclay sobre a graça em Paulo concentra-se nas cartas que ele considera incontestes), mas não o que Ef 2:1–10 diz sobre a graça.',
    },
    'grace:ctx:recipients': {
      title: 'Uma carta para várias igrejas da Ásia',
      summary:
        'Embora tradicionalmente endereçada a Éfeso, a carta talvez tenha sido uma carta circular, que passava pelas igrejas da província romana da Ásia.',
      detail:
        'As palavras “em Éfeso” (1:1) faltam em muitos dos manuscritos mais antigos, e a carta não traz saudações pessoais — algo surpreendente se Paulo estivesse escrevendo a uma igreja onde passara de dois a três anos (At 19:10; 20:31). Muitas igrejas da província foram fundadas durante o ministério de Paulo em Éfeso, algumas por convertidos seus, e não pelo próprio Paulo. Os leitores eram, em sua maioria, gentios convertidos, o que molda o argumento do capítulo 2.',
    },
    'grace:ctx:ephesus': {
      title: 'Éfeso e a data da carta',
      summary:
        'Éfeso era a capital e o porto da província romana da Ásia, uma das maiores cidades do império, famosa por seu templo de Ártemis. A carta apresenta Paulo escrevendo da prisão (3:1; 4:1) — tradicionalmente em Roma, por volta de 60–62 d.C., embora alguns estudiosos proponham uma prisão em Éfeso, por volta de 53–56 d.C.',
      detail:
        'As notas da Tyndale descrevem Éfeso como a quarta maior cidade do Império Romano, com uma população de talvez 500 mil habitantes. Depois de uma breve primeira visita (At 18:19–21), Paulo permaneceu ali de dois a três anos (At 19:1–20:1), em meio a séria oposição. A visão tradicional situa as Cartas da Prisão (Efésios, Filipenses, Colossenses, Filemom) em Roma, no fim da vida de Paulo; uma alternativa as situa durante uma prisão em Éfeso, o que as dataria mais cedo.',
    },
    'grace:ctx:patronage': {
      title: 'Charis num mundo de patronos e benfeitores',
      summary:
        'Os leitores de Paulo usavam charis no dia a dia para o favor de um patrono ou benfeitor, para o próprio presente e para a gratidão que ele exigia. Graça era a linguagem da doação generosa e da resposta agradecida.',
      detail:
        'No mundo greco-romano, as pessoas muitas vezes obtinham proteção, cargos ou ajuda material por meio de laços pessoais com os poderosos, e não por meio de instituições públicas. David deSilva mostra que charis carregava três sentidos interligados: a disposição favorável de quem dá, o benefício concedido e a gratidão de quem recebe. Moralistas como Sêneca (De beneficiis) insistiam em que o favor deve ser correspondido com gratidão; Sêneca ilustrava o ideal com as três Graças, cuja dança em roda representa um benefício que passa de quem dá para quem recebe e volta de novo. Ao ouvir que eram salvos “pela graça”, os primeiros leitores muito provavelmente imaginariam Deus como o benfeitor supremo e esperariam que essa graça pedisse uma resposta de lealdade e gratidão (compare 2:10).',
    },
    'grace:ctx:surprising-grace': {
      title: 'O que tornava surpreendente a graça de Deus',
      summary:
        'Em princípio, os benfeitores antigos davam livremente, mas normalmente escolhiam destinatários dignos. A surpresa do Novo Testamento é que Deus dá o seu maior dom aos indignos — até aos inimigos.',
      detail:
        'DeSilva observa que, para Sêneca, o doador mais generoso poderia até ajudar pessoas que se mostraram ingratas, desde que lhe sobrasse algo depois de ajudar os merecedores. O Novo Testamento vai muito além: Deus dá o seu maior dom a pessoas que se haviam posto contra ele (Rm 5:6–10; Lc 6:35) e toma a iniciativa de reconciliá-las. Paul and the Gift (2015), de John Barclay, descreve isso como uma graça dada independentemente de o destinatário ser digno (o que ele chama de sua “incongruência”); em sua leitura, Paulo não torna a graça livre de toda resposta esperada — ela é incondicionada, mas visa uma vida transformada. Ef 2:1–10 se ajusta aos dois pontos: Deus age em favor dos mortos (2:5) e os cria para as boas obras (2:10).',
    },
    'grace:ctx:hesed-covenant': {
      title: 'Hesed e aliança: a gramática da graça em Israel',
      summary:
        'O vocabulário de Paulo tem raízes judaicas. As Escrituras de Israel já confessavam um Deus gracioso, grande em hesed, que escolheu Israel por amor, e não por mérito.',
      detail:
        'O Antigo Testamento grego geralmente traduziu chen (favor) por charis e hesed (amor leal, de aliança) por eleos (misericórdia); assim, quando Paulo une misericórdia e graça em Ef 2:4–8, ele se vale dessa herança. Textos como Êx 34:6–7, Dt 7:7–9 e o Salmo 103 mostram que a graça não foi uma invenção cristã; o que há de novo em Efésios é o foco em Cristo e a extensão da graça aos gentios, que eram “estranhos aos pactos da promessa” (2:12).',
    },
    'grace:ctx:gentiles': {
      title: 'Gentios “não tendo esperança, e sem Deus no mundo”',
      summary:
        'A maioria dos primeiros leitores era de gentios que haviam estado fora das alianças de Israel. Paulo lhes lembra que antes estavam sem Cristo, eram estranhos às promessas e viviam “não tendo esperança, e sem Deus no mundo” (2:12).',
      detail:
        'Efésios 2:11–22 aplica imediatamente a graça de 2:1–10 à divisão entre judeus e gentios. Os judeus tradicionalmente consideravam os gentios excluídos do povo de Deus, e uma barreira baixa no templo de Jerusalém marcava o limite além do qual os gentios não podiam passar. As notas da Tyndale sugerem que a ênfase talvez reflita tensões entre crentes judeus e gentios. Para esses leitores, “pela graça sois salvos” significava que sua posição diante de Deus não dependia de nada que eles tivessem trazido — nem ascendência nem realizações.',
    },
    'grace:ctx:powers': {
      title: '“O príncipe do poder do ar”',
      summary:
        'Paulo descreve a vida sem Cristo como moldada pelo curso deste mundo e pelo diabo, “o príncipe do poder do ar” (2:2). Numa cidade conhecida pela magia, essa não era uma ideia abstrata.',
      detail:
        'As notas da Tyndale leem 2:2 como referência ao diabo, que governa os poderes do mal e age nos que se recusam a obedecer a Deus (compare 6:11–12). Atos registra que, durante o ministério de Paulo em Éfeso, muitos crentes vieram confessar suas práticas, e vários dos que tinham praticado magia queimaram publicamente seus livros, avaliados em cinquenta mil dracmas (At 19:18–19). A graça, em Efésios, é portanto também libertação dos poderes espirituais, e não apenas perdão.',
    },
  },

  /* ---------------- Contexto literário ---------------- */
  literary: {
    placeInBook:
      'Efésios divide-se em duas metades: os capítulos 1–3 louvam a Deus por sua graça, e os capítulos 4–6 descrevem a vida que responde a ela. Ef 2:1–10 vem logo depois da oração de Paulo para que os leitores compreendam o poder que Deus usou para ressuscitar Cristo e fazê-lo sentar nas regiões celestiais (1:19–20); 2:5–6 aplica esse mesmo poder aos crentes. A passagem, então, fundamenta 2:11–22, onde a graça une judeus e gentios num só povo novo.',
    argument:
      'O argumento avança em cinco passos: a condição de toda a humanidade — morta, escravizada e sob a ira (2:1–3); a virada para o caráter de Deus — rico em misericórdia, grande em amor (2:4); a ação de Deus com Cristo — deu-nos vida, ressuscitou-nos e fez-nos sentar (2:5–6); o propósito de Deus — mostrar as riquezas da sua graça nos tempos futuros (2:7); e a explicação — salvos pela graça, por meio da fé, como dom, não por obras, e criados para as boas obras (2:8–10). Em grego, 2:1–7 é uma única frase longa, traço do estilo de Paulo em Efésios.',
    placeInCanon:
      'Efésios 2 reúne um fio que percorre toda a Bíblia: o Deus aos olhos de quem Noé achou favor, que se revelou gracioso no Sinai e escolheu Israel por amor, mostra agora as abundantes riquezas da sua graça em Cristo. É a formulação mais compacta, nas cartas de Paulo, daquilo que Romanos e Gálatas argumentam longamente, e antecipa a esperança da nova criação no restante do Novo Testamento.',
    bookOutline: [
      'Saudação',
      'Louvor por toda bênção espiritual',
      'Oração por entendimento espiritual',
      'Da morte para a vida: salvos pela graça',
      'Um só povo novo em Cristo',
      'Paulo, administrador da graça de Deus para os gentios',
      'Oração para conhecer o amor de Cristo',
      'Unidade e dons no corpo',
      'A vida nova: andar como filhos da luz',
      'Lares moldados por Cristo',
      'A armadura de Deus',
      'Palavras finais',
    ],
    passageOutline: [
      'A condição: mortos, escravizados, sob a ira',
      'A virada: “Mas Deus”, rico em misericórdia',
      'Vivificados, ressuscitados e assentados com Cristo',
      'O propósito: a graça em exibição pelos séculos',
      'Pela graça, por meio da fé, um dom — não por obras',
      'Feitura de Deus, criados para as boas obras',
    ],
    features: {
      'grace:lit:but-god': {
        title: 'A virada: “Mas Deus”',
        description:
          'Depois de três versículos que descrevem o desamparo humano, 2:4 começa com Ὁ δὲ θεός — “Mas Deus”. O sujeito gramatical do resgate é somente Deus; todos os verbos principais que se seguem (deu vida, ressuscitou, fez sentar) têm Deus como sujeito.',
      },
      'grace:lit:refrain': {
        title: 'O refrão “pela graça sois salvos”',
        description:
          'Paulo interrompe a si mesmo em 2:5 com “pela graça sois salvos” (entre parênteses na KJV e na Bíblia Livre) e depois o repete e amplia em 2:8. A repetição faz dele a tese da passagem. Calvino não tinha certeza se o parêntese vinha de Paulo ou de outra mão, mas o aceitou como adequado ao contexto e o tomou como sinal de que Paulo nunca achava ter dito o bastante sobre a graça de Deus.',
        structure: [
          { text: 'Pela graça sois salvos (interjeição)' },
          { text: 'Pela graça sois salvos, por meio da fé … dom de Deus … não por obras' },
        ],
      },
      'grace:lit:with-christ': {
        title: 'Três verbos com “com” que ecoam a própria história de Cristo',
        description:
          'Paulo usa três verbos compostos iniciados por syn- (“com”): vivificados com, ressuscitados com, assentados com (2:5–6). Eles espelham o que Deus fez por Cristo em 1:20 — ressuscitou-o e o fez sentar nas regiões celestiais —, de modo que a história do crente é incorporada à de Cristo.',
        structure: [
          { label: 'Cristo', text: 'Deus o ressuscitou e o fez sentar nas regiões celestiais' },
          { label: 'Os crentes', text: 'vivificados com … ressuscitados com … assentados com Cristo' },
        ],
      },
      'grace:lit:walk': {
        title: 'Dois modos de andar',
        description:
          'O verbo “andar” (περιπατέω) emoldura a passagem: os leitores antes andavam em ofensas e pecados (2:2), e a passagem termina — com sua última palavra grega — nas boas obras que Deus preparou “para que nelas andássemos” (2:10; a BSB traduz por “our way of life”). A graça não muda apenas a posição; muda a direção de uma vida.',
        structure: [
          { label: 'Antes', text: 'andastes em ofensas e pecados, conforme o proceder deste mundo' },
          { label: 'Agora', text: 'boas obras, que Deus preparou para que nelas andássemos' },
        ],
      },
      'grace:lit:works': {
        title: '“Não por obras” e “para as boas obras”',
        description:
          'Paulo usa o mesmo substantivo, ἔργα (obras), em versículos consecutivos com preposições diferentes: a salvação não vem das obras (ἐξ ἔργων, 2:9), mas os crentes são criados para as boas obras (ἐπὶ ἔργοις ἀγαθοῖς, 2:10). As obras são excluídas como fonte da salvação e restauradas como seu fruto.',
      },
    },
  },

  /* ---------------- Teologia ---------------- */
  theology: {
    'grace:th:gift': {
      title: 'A salvação como dom de Deus',
      summary:
        'Ef 2:8–9 condensa o evangelho em três contrastes: pela graça, não por obras; por meio da fé, não de vós; dom de Deus, não motivo de orgulho. A salvação se origina no favor de Deus, é recebida pela confiança e não deixa espaço para a autocongratulação.',
      detail:
        'Cristãos de todas as tradições afirmam que ninguém pode conquistar ou merecer a graça da salvação. As notas da Tyndale chamam 2:8–9 de resumo conciso de como uma pessoa é salva e de princípio cardeal do evangelho. As tradições diferem quanto ao modo como a graça se relaciona com a vontade humana e com o processo de renovação — veja as perspectivas abaixo.',
    },
    'grace:th:election': {
      title: 'Eleição e chamado: graça antes do tempo',
      summary:
        'Efésios situa a graça antes da criação do mundo: Deus escolheu os crentes em Cristo “antes da fundação do mundo”, “para louvor da glória de sua graça” (1:4–6), e de antemão preparou boas obras para eles (2:10).',
      detail:
        'O padrão aparece por toda a Escritura: Israel foi escolhido por amor, e não por mérito (Dt 7:7–8); um remanescente é escolhido pela graça (Rm 11:5–6); Deus nos salvou e chamou segundo o seu próprio propósito e a graça que nos foi dada em Cristo Jesus antes dos tempos eternos (2Tm 1:9). Os cristãos concordam que a eleição é graciosa; discordam quanto ao seu fundamento. Os Artigos da Remonstrância (1610) descrevem o decreto eterno de Deus de salvar os que, pela graça do Espírito, crerão e perseverarão; os Cânones de Dort (1619) respondem que a eleição não se fundamentou na fé prevista, mas é a própria fonte da fé. As perspectivas abaixo exploram a questão mais ampla.',
    },
    'grace:th:justification': {
      title: 'Graça e justificação',
      summary:
        'Efésios 2 fala em ser salvo, e não em ser justificado, mas as ideias se encontram: em Romanos, Gálatas e Tito, os crentes são justificados gratuitamente pela graça de Deus, por meio da fé, e não pelas obras da Lei.',
      detail:
        'Agostinho resumiu assim a relação entre a Lei e a graça: a Lei foi dada para que se buscasse a graça, e a graça foi dada para que se cumprisse a Lei. As tradições protestantes enfatizam a justificação como a declaração de Deus de que os pecadores são justos por causa de Cristo; o ensino católico sustenta que a justificação inclui também a renovação interior. Nas últimas décadas, N. T. Wright argumentou que a linguagem paulina da justificação deve ser lida dentro do plano da aliança de Deus, por meio de Israel, para o mundo — ênfase que ele encontra em Ef 2:11–22, ao lado das ênfases clássicas da Reforma em 2:1–10.',
    },
    'grace:th:sanctification': {
      title: 'A graça que educa: as boas obras como fruto',
      summary:
        'A graça salva sem as obras, mas nunca deixa as pessoas sem elas. Os crentes são feitura de Deus, criados para as boas obras (Ef 2:10); a graça que traz salvação também os educa para viver de maneira piedosa (Tt 2:11–12).',
      detail:
        'Paulo rejeita a ideia de que a graça gratuita estimule o pecado (Rm 6:1–2) e descreve o seu próprio trabalho como a graça de Deus que está com ele (1Co 15:10). As notas da Tyndale dizem de modo simples: as boas obras são o resultado, e não a causa, da salvação. Filipenses 2:12–13 mantém os dois lados juntos — exercei a vossa salvação, pois é Deus quem opera em vós.',
    },
    'grace:th:common-grace': {
      title: 'Graça comum e graça salvadora',
      summary:
        'A Escritura fala da bondade de Deus para com todas as pessoas — sol e chuva sobre maus e bons, alimento e alegria para as nações — ao lado da graça salvadora de Ef 2. Os teólogos relacionaram essas duas coisas de maneiras diferentes; a teologia reformada usa a expressão “graça comum” para a graça que não salva.',
      detail:
        'Charles Hodge, por exemplo, definiu a graça comum como a influência do Espírito Santo concedida em alguma medida a todos os que ouvem a verdade, distinta da graça eficaz que regenera. Os wesleyanos falam, em vez disso, de uma graça preveniente dada a todos, que desperta a consciência e se destina a conduzir à salvação. A teologia ortodoxa oriental, tal como Vladimir Lossky a apresenta, não retrata a natureza humana como uma ordem natural autossuficiente à qual a graça seria depois acrescentada como um extra; em sua exposição, o dom de Deus está em ação na criação desde o princípio. Em todas essas tradições, a bondade de que as pessoas desfrutam sem a fé salvadora continua sendo um dom imerecido.',
    },
    'grace:th:means': {
      title: 'Os meios de graça',
      summary:
        'Muitas tradições cristãs — entre elas a católica, a luterana, a reformada e a metodista — ensinam que Deus normalmente concede e nutre a graça por meios estabelecidos, sobretudo a Palavra e os sacramentos, junto com a oração, embora descrevam esses meios de maneiras diferentes. Nem todos os cristãos usam essa linguagem: algumas tradições de igreja livre falam do batismo e da ceia do Senhor como ordenanças de obediência e memória, e o ensino quacre primitivo sustentava que os ritos exteriores já não eram necessários.',
      detail:
        'O Breve Catecismo de Westminster (P. 88) nomeia a palavra, os sacramentos e a oração como os meios exteriores e ordinários pelos quais Cristo comunica os benefícios da redenção. A Confissão de Augsburgo (art. V) ensina que, pela Palavra e pelos sacramentos, como por instrumentos, é dado o Espírito Santo, que opera a fé. O Catecismo da Igreja Católica fala das graças sacramentais próprias de cada sacramento e de graças especiais, ou carismas (§2003). O sermão de John Wesley The Means of Grace nomeia a oração, o exame das Escrituras e a ceia do Senhor como os principais canais ordinários pelos quais Deus comunica a graça. Em contraste, a Baptist Faith and Message (2000, art. VII), da Convenção Batista do Sul, apresenta ambos como símbolos e atos de obediência: o batismo retrata a fé do crente e sua nova vida, e a ceia recorda a morte de Cristo e aguarda o seu retorno. A Apology (1678) de Robert Barclay, uma defesa dos princípios quacres, trata o verdadeiro batismo e a verdadeira comunhão como interiores e espirituais, e os ritos exteriores como figuras destinadas a durar apenas por um tempo (Proposições 12–13). A igreja primitiva perseverava na doutrina dos apóstolos, no partir do pão e nas orações (At 2:42).',
    },
  },

  /* ---------------- Perspectivas ---------------- */
  perspectives: {
    'grace:ps:grace-and-response': {
      question: 'Como a graça de Deus se relaciona com a resposta humana da fé?',
      intro:
        'Todas as tradições abaixo confessam que a salvação é pela graça de Deus e não pode ser conquistada. Elas diferem quanto ao modo como a graça atua na vontade humana: se é por si mesma eficaz; se opera sozinha a conversão, mas pode ser resistida; se capacita uma resposta livre, que pode ser recusada; se cura a natureza e convida à cooperação; ou se une as próprias energias de Deus à liberdade humana. O debate tem raízes profundas — na controvérsia de Agostinho com Pelágio, no concílio africano de 418, que ensinou que a graça concede não apenas o perdão, mas também a vontade e a força para obedecer, e no Concílio de Orange (529), que sustentou que até o início da fé é dom da graça. Ef 2:8–10 é reivindicado, com sinceridade, por todos os lados.',
      perspectives: {
        'grace:ps:grace-and-response:reformed': {
          tradition: 'Reformada',
          label: 'Graça eficaz: Deus dá a fé que ele pede',
          summary:
            'Os Cânones de Dort (1619) ensinam que a conversão deve ser inteiramente atribuída a Deus: a regeneração é uma nova criação e uma ressurreição dentre os mortos, e não mera persuasão moral que deixaria em poder do ser humano converter-se ou não; a fé é dom de Deus porque Deus efetivamente produz tanto a vontade de crer quanto o próprio ato de crer. Contudo, a graça não trata as pessoas como objetos sem vida nem destrói a vontade — ela a renova, de modo que a pessoa verdadeiramente crê e se arrepende. Os leitores reformados veem isso em Ef 2: os mortos recebem vida (2:5), e toda a salvação “não vem de vós” (2:8).',
        },
        'grace:ps:grace-and-response:wesleyan': {
          tradition: 'Arminiana / Wesleyana',
          label: 'Graça preveniente: uma resposta capacitada e resistível',
          summary:
            'Os Artigos da Remonstrância (1610) sustentam que ninguém pode pensar, querer ou fazer o bem sem a graça, que é o princípio, a continuação e a consumação de todo bem — mas a graça não é irresistível, pois a Escritura diz que muitos resistiram ao Espírito Santo (At 7:51). John Wesley ensinava que ninguém é deixado num estado de mera natureza: a graça preveniente de Deus desperta a consciência e os primeiros desejos voltados para ele em cada pessoa, de modo que as pessoas pecam não por falta de graça, mas por não usarem a graça que têm. Em seu sermão sobre Ef 2:8, ele chamou a graça de fonte e a fé de condição da salvação, e em Free Grace argumentou que a graça de Deus é livre em todos e para todos.',
        },
        'grace:ps:grace-and-response:catholic': {
          tradition: 'Católica',
          label: 'A graça que cura e eleva, com cooperação real',
          summary:
            'O Concílio de Trento (Sessão 6, 1547) ensina que o início da justificação vem da graça preveniente de Deus, sem mérito algum; Deus toca o coração, e a pessoa, que poderia rejeitar essa graça, livremente assente a ela e com ela coopera, embora não possa mover-se em direção a Deus sem ela. Diz-se que somos justificados gratuitamente porque nada do que precede a justificação — nem a fé nem as obras — merece a própria graça da justificação. O Catecismo descreve a graça como o socorro gratuito e imerecido de Deus e como participação em sua vida, distinguindo a graça habitual (santificante) das graças atuais; depois da justificação, o próprio mérito é dom da graça. O tratado de Tomás de Aquino sobre a graça molda esse vocabulário.',
        },
        'grace:ps:grace-and-response:lutheran': {
          tradition: 'Luterana',
          label: 'Sola gratia: só Deus converte, mas a graça pode ser recusada',
          summary:
            'A Confissão de Augsburgo (1530, art. IV) ensina que as pessoas não podem ser justificadas diante de Deus por suas próprias forças, méritos ou obras, mas são justificadas gratuitamente por causa de Cristo, mediante a fé, que Deus imputa como justiça; o artigo V acrescenta que o Espírito Santo, que opera a fé, é dado pela Palavra e pelos sacramentos, como por instrumentos. A Fórmula de Concórdia (1577, Epítome, art. II) sustenta que a conversão é obra exclusiva da graça do Espírito Santo: a vontade não convertida nada contribui para ela, embora, uma vez renovada, coopere com o Espírito nas obras que se seguem. Ainda assim, essa graça pode ser resistida: segundo o Epítome, art. XI, os que se perdem perecem porque desprezam a Palavra e endurecem o coração, e não porque Deus não quisesse que fossem salvos. No contexto da justificação, o ensino luterano trata a graça sobretudo como o favor imerecido de Deus para com os pecadores, e não como uma qualidade infundida na alma. Dietrich Bonhoeffer advertiu que essa graça gratuita jamais deve ser transformada num princípio que desculpe o pecado.',
        },
        'grace:ps:grace-and-response:orthodox': {
          tradition: 'Ortodoxa oriental',
          label: 'A graça como energias incriadas de Deus; sinergia rumo à theosis',
          summary:
            'Seguindo Gregório Palamas, Vladimir Lossky apresenta a graça não como uma qualidade criada na alma, mas como a própria energia incriada de Deus: Deus realmente se dá em suas energias, enquanto sua essência permanece incognoscível. A salvação é a união com Deus (theosis) — uma participação real na natureza divina (2Pe 1:4), na qual a pessoa humana permanece criatura. Essa união envolve sinergia: a vontade humana coopera com a graça divina, e, na exposição de Lossky, graça e liberdade agem juntas, e não como rivais. Lossky observa que a teologia oriental nunca fez da relação entre graça e livre-arbítrio a controvérsia ardente em que ela se transformou no Ocidente latino depois de Agostinho, e que a linguagem do mérito tem pouco lugar nos escritos espirituais orientais. Crisóstomo, comentando Ef 2:8, também diz que a própria fé é dom de Deus, observando ao mesmo tempo que Paulo resguarda o livre-arbítrio humano.',
        },
      },
      commonGround:
        'Todas essas tradições confessam que a salvação é a iniciativa graciosa de Deus em Cristo; que ninguém conquista ou merece a graça da salvação; que a fé é capacitada pela graça; e que a graça genuína dá fruto numa vida transformada, como insiste Ef 2:10.',
    },
    'grace:ps:joint-declaration': {
      question: 'A Declaração Conjunta de 1999 resolveu a disputa da Reforma sobre a justificação pela graça?',
      intro:
        'Em 31 de outubro de 1999, em Augsburgo, a Federação Luterana Mundial e a Igreja Católica assinaram a Declaração Conjunta sobre a Doutrina da Justificação. O Conselho Metodista Mundial aderiu a ela em 2006, e as comunhões anglicana e reformada a afirmaram mais tarde. Os cristãos ainda avaliam de maneiras diferentes o seu alcance.',
      perspectives: {
        'grace:ps:joint-declaration:consensus': {
          tradition: 'Igrejas signatárias (Federação Luterana Mundial, Igreja Católica e, mais tarde, organismos metodistas, anglicanos e reformados)',
          label: 'Um consenso real em verdades básicas',
          summary:
            'A Declaração afirma que luteranos e católicos podem agora confessar juntos que Deus aceita os pecadores — e lhes dá o Espírito, que os renova e os capacita para as boas obras — somente pela graça, mediante a fé na obra de Cristo, e nunca com base no mérito humano. Ela trata as diferenças que permanecem entre as explicações das duas igrejas como diferenças de vocabulário, de ênfase e de desenvolvimento teológico que não desfazem esse consenso básico. E conclui que as condenações mútuas do século XVI não se aplicam ao ensino do parceiro tal como a Declaração o apresenta.',
        },
        'grace:ps:joint-declaration:differences': {
          tradition: 'Luteranos confessionais e outros críticos',
          label: 'Permanecem diferenças significativas',
          summary:
            'A Igreja Luterana–Sínodo de Missouri (LCMS) concluiu que a Declaração não representa um avanço decisivo: a seu ver, o ensino católico ainda define a justificação como incluindo a renovação interior e permite que os justificados mereçam mais graça, ao passo que os luteranos sustentam que a justificação é o perdão gratuito de Deus recebido somente pela fé. Seu guia de estudo acrescenta que nem todos os estudiosos católicos consideram a Declaração uma ruptura com o ensino católico tradicional e cita o juízo de Leonardo De Chirico de que sua exposição da justificação deixa essencialmente intacta a teologia do Concílio de Trento.',
        },
      },
      commonGround:
        'As duas avaliações concordam que a justificação é obra graciosa de Deus em Cristo, recebida pela fé, e que tanto o acordo honesto quanto a discordância honesta importam mais do que disfarçar as diferenças.',
    },
  },

  /* ---------------- Comentário e pensadores cristãos ---------------- */
  commentary: {
    'grace:cm:augustine': {
      lead: 'Sobre “não por obras” e “criados … para as boas obras” (Ef 2:9–10)',
      quoteTranslation:
        '“Não por obras” é dito das obras que supões terem origem somente em ti mesmo; mas deves pensar nas obras para as quais Deus te moldou (isto é, te formou e criou).',
    },
    'grace:cm:chrysostom': {
      lead: 'Sobre “e isto não vem de vós” (Ef 2:8)',
      quoteTranslation:
        'Nem a fé, quer ele dizer, vem “de nós mesmos”. Pois, se ele não tivesse vindo, se não nos tivesse chamado, como poderíamos ter crido?',
    },
    'grace:cm:aquinas': {
      lead: 'Sobre os sentidos comuns de “graça”',
      quoteTranslation:
        'Segundo o modo comum de falar, graça costuma ser entendida de três maneiras. Primeiro, como o amor de alguém, como costumamos dizer que o soldado está nas boas graças do rei … Segundo, como qualquer dom concedido gratuitamente … Terceiro, como a retribuição de um dom dado “gratuitamente”, na medida em que se diz que somos “gratos” pelos benefícios.',
    },
    'grace:cm:calvin': {
      lead: 'Sobre “pela graça … por meio da fé” (Ef 2:8)',
      quoteTranslation:
        'Deus declara que nada nos deve; de modo que a salvação não é prêmio nem recompensa, mas graça pura. … A fé, portanto, leva o homem vazio a Deus, para que seja cheio das bênçãos de Cristo.',
    },
    'grace:cm:wesley': {
      lead: 'Pregando sobre Ef 2:8 em Oxford, em 1738',
      quoteTranslation:
        'Todas as bênçãos que Deus concedeu ao homem procedem de sua mera graça, bondade ou favor; de seu favor livre e imerecido; favor totalmente imerecido, não tendo o homem direito algum à menor de suas misericórdias. … A graça é a fonte, e a fé, a condição da salvação.',
    },
    'grace:cm:newton': {
      lead: 'Do hino hoje conhecido como “Amazing Grace”',
      quoteTranslation:
        'Foi a graça que ensinou meu coração a temer, / e a graça aliviou meus temores; / quão preciosa me pareceu aquela graça / na hora em que primeiro cri!',
    },
    'grace:cm:spurgeon': {
      lead: 'Sobre a graça como fonte e a fé como canal (Ef 2:8)',
      quoteTranslation:
        'A fé ocupa a posição de um canal ou tubo condutor. A graça é a fonte e a corrente; a fé é o aqueduto pelo qual a torrente de misericórdia desce para refrescar os sedentos filhos dos homens.',
    },
    'grace:cm:bonhoeffer': {
      lead: 'Sobre a “graça barata” e a “graça preciosa”',
      text: 'Bonhoeffer abre Discipleship (1937) contrastando o que chamou de graça barata e graça preciosa. A graça barata, em sua exposição, é o perdão tratado como se não fizesse nenhuma reivindicação sobre quem é perdoado — sem abandono do pecado e sem seguimento de Cristo, de modo que a vida continua inalterada. A graça preciosa é o próprio chamado de Jesus ao discipulado, que reivindica a vida inteira de uma pessoa e, ao mesmo tempo, concede gratuitamente vida nova. Sua advertência aplica Ef 2:8–10 pelo outro lado: uma graça que nunca anda nas boas obras foi mal compreendida.',
    },
    'grace:cm:packer': {
      lead: 'Por que a graça parece banal para muitas pessoas',
      text: 'No capítulo sobre a graça de Deus em Knowing God (1973), Packer argumenta que muitos que falam de graça não a acham maravilhosa porque não compreenderam quatro verdades que ela pressupõe: que os seres humanos são moralmente culpados diante de Deus; que Deus é justo e precisa punir o pecado; que somos impotentes para restaurar nosso próprio relacionamento com ele; e que Deus é livre — não tem nenhuma obrigação de nos mostrar favor. Só quando essas verdades são sentidas a graça aparece como a coisa assombrosa que Ef 2:1–10 descreve.',
    },
    'grace:cm:keller': {
      lead: 'Graça para o rebelde e para o moralista',
      text: 'Em The Prodigal God (2008), Keller lê Lucas 15 como a história de dois filhos, ambos afastados do pai. O mais novo se rebela abertamente; o mais velho obedece para colocar o pai em dívida com ele e, no fim, é quem se recusa a entrar na festa. Keller argumenta que o evangelho expõe tanto a autoindulgência quanto o moralismo presunçoso como maneiras de tentar controlar a Deus, e que somente a graça leva qualquer dos dois filhos para casa — a mesma lógica de Ef 2:9, que exclui o orgulho.',
    },
    'grace:cm:piper': {
      lead: 'Devemos tentar retribuir a Deus?',
      text: 'Em Future Grace (publicado em 1995; revisto em 2012), Piper insiste em que a gratidão a Deus é correta e bíblica, mas adverte contra o que chama de “ética do devedor”: tratar a obediência como pagamento pelo que Deus fez. A seu ver, tentar retribuir a Deus transformaria a graça em algo devido, e não livremente dado. Ele argumenta, em vez disso, que a obediência é sustentada pela fé na graça que Deus prometeu para o futuro. Mais adiante no livro, cita Ef 2:8–10 para lembrar aos leitores que foram salvos para as boas obras: a obediência paciente é fruto da fé e da ajuda do Espírito, e não a base de sua aceitação, que repousa em Cristo.',
    },
    'grace:cm:wright': {
      lead: 'Efésios 2 e as perspectivas “antiga” e “nova” sobre Paulo',
      text: 'Em Justification (2009), escrito no debate com John Piper e outros, Wright lê a linguagem paulina da justificação dentro do único plano de Deus, por meio de Israel, para o mundo, ao mesmo tempo que afirma que os pecadores são declarados justos com base na morte e na ressurreição de Cristo. Ele observa que Efésios mantém juntas ênfases muitas vezes contrapostas: a salvação pela graça, por meio da fé, que produz boas obras (2:1–10), e judeus e gentios unidos como uma só família no Messias (2:11–22). Críticos como Piper questionaram partes de sua exposição da justificação, mas sua leitura mostra por que Ef 2:1–10 não deve ser lido isoladamente de 2:11–22.',
    },
  },

  /* ---------------- Sermões ---------------- */
  sermons: {
    'grace:sermon:wesley-salvation-by-faith': {
      summary:
        'Pregado diante da Universidade de Oxford em 11 de junho de 1738, festa de São Barnabé (as edições de 1746 e 1872 o datam erroneamente de 18 de junho, quando Wesley estava na Alemanha), o sermão começa fundamentando toda bênção no favor livre e imerecido de Deus e então pergunta o que é a fé salvadora (não a mera crença de um pagão ou de um demônio, mas a confiança em Cristo), o que inclui a salvação pela fé e como responder às objeções.',
    },
    'grace:sermon:spurgeon-salvation-all-of-grace': {
      summary:
        'Spurgeon acompanha a graça na eleição, na redenção, no chamado e na justificação, e sugere que Paulo insiste no ponto porque o coração humano resiste a ser salvo pela graça. Os pecadores não vêm como inocentes ou desculpáveis, mas como culpados que se lançam sobre a misericórdia. Em seguida, extrai cinco consequências práticas: a doutrina dá esperança a todo pecador, mostra como suplicar a Deus, reconcilia os crentes com os caminhos estabelecidos por Deus (a fé e o batismo), fornece um motivo poderoso para a santidade e põe à prova a resposta de cada ouvinte.',
    },
    'grace:sermon:piper-but-god': {
      summary:
        'Um sermão do período do Natal que contrapõe cada parte da condição descrita em 2:1–3 à resposta de Deus em 2:4–7: bondade no lugar da ira (2:3 e 2:7), liberdade e um lugar ao lado de Cristo no lugar do cativeiro (2:2 e 2:6), e vida no lugar da morte (2:1 e 2:5–6) — tudo girando em torno das palavras “Mas Deus”.',
    },
    'grace:sermon:keller-grace-of-god': {
      summary:
        'Parte de uma série sobre os atributos de Deus. Segundo o resumo do sermão, Keller argumenta a partir de Ef 2:1–10 que a graça é um dom de que não podemos prescindir e que custou a Deus imensamente, e que enxergar as duas coisas muda o modo como a graça toma conta de uma vida.',
    },
  },

  /* ---------------- Notas de versículos ---------------- */
  verseNotes: {
    'EPH.2.1': [
      'Paulo começa com o diagnóstico: seus leitores “estáveis mortos em ofensas e pecados”. “Mortos” retrata mais do que fraqueza — sem a ação de Deus, eles não podiam dar vida a si mesmos —, e por isso o remédio, em 2:5, é ressurreição, e não melhoria. (As tradições divergem sobre o alcance dessa incapacidade e sobre como a graça a enfrenta; veja Perspectivas.) A mesma imagem aparece em Cl 2:13.',
    ],
    'EPH.2.2': [
      'A vida sem Cristo era um “andar” moldado pelo curso deste mundo e pelo “príncipe do poder do ar” — o diabo, que atua nos que desobedecem a Deus. O pecado é retratado não apenas como escolha individual, mas como escravidão a poderes externos. O verbo “andar” volta em 2:10 com nova direção.',
    ],
    'EPH.2.3': [
      'Paulo inclui a si mesmo — “todos nós” — e descreve uma vida movida pelos desejos da carne e dos pensamentos. “Carne”, aqui, refere-se à natureza humana decaída (as notas da Tyndale falam de nossa natureza pecaminosa), e não simplesmente ao corpo físico. “Por natureza filhos da ira” significa que, sem a graça, todos estão sob o justo juízo de Deus sobre o pecado; judeus e gentios partilham a mesma condição.',
    ],
    'EPH.2.4': [
      '“Mas Deus” é a dobradiça da passagem. Paulo fundamenta tudo o que se segue no caráter de Deus — rico em misericórdia (eleos, a palavra que o Antigo Testamento grego usou para hesed) e agindo movido por um grande amor. Nada nos leitores provocou o resgate; a razão está inteiramente em Deus.',
    ],
    'EPH.2.5': [
      'Deus nos deu vida juntamente com Cristo, “estando nós ainda mortos”. Paulo então interrompe a própria frase — “pela graça sois salvos” —, usando um particípio perfeito que apresenta a salvação como um resgate concluído, de efeito duradouro. Este é o único lugar do Novo Testamento, além de 2:8, em que essa forma aparece.',
    ],
    'EPH.2.6': [
      'Os crentes são ressuscitados com Cristo e assentados com ele nas regiões celestiais — linguagem que ecoa o que Deus fez por Cristo em 1:20. Paulo fala disso como algo já verdadeiro porque os crentes estão unidos a Cristo; a experiência plena ainda é futura, mas a posição deles está segura nele.',
    ],
    'EPH.2.7': [
      'O propósito de Deus vai além do resgate dos leitores: nos tempos futuros, ele mostrará as abundantes riquezas da sua graça, expressas em bondade para conosco em Cristo. Os salvos tornam-se uma exposição permanente de como Deus é. A bondade (chrēstotēs) aqui é a mesma palavra usada em Tito 3:4.',
    ],
    'EPH.2.8': [
      'A tese da passagem: salvos pela graça (o que salva), por meio da fé (como a salvação é recebida), e isto não vem de vós, mas é dom de Deus. Como “isto” é neutro, enquanto graça e fé são femininos, muitos leitores entendem que abrange todo o acontecimento salvífico. Os cristãos há muito discutem se a própria fé está incluída no dom — Crisóstomo e Agostinho disseram que sim; Calvino entendeu o dom como a própria salvação.',
    ],
    'EPH.2.9': [
      'Não por obras, para que ninguém se orgulhe. Se a salvação fosse conquistada, ainda que em parte, os salvos poderiam reivindicar algum crédito; a graça remove todo motivo de orgulho diante de Deus (compare Rm 3:27; 1Co 1:29–31). As obras aqui excluídas são as obras como base para a aceitação — Paulo afirmará as boas obras logo no versículo seguinte.',
    ],
    'EPH.2.10': [
      'Somos feitura de Deus (poiēma), criados em Cristo Jesus para as boas obras que Deus preparou de antemão para que nelas andássemos. As boas obras são o resultado, e não a causa, da salvação. O versículo fecha o círculo aberto em 2:2: o antigo andar no pecado é substituído por um novo andar nas obras que Deus planejou.',
    ],
  },

  /* ---------------- Conceitos (índice de busca do motor) ---------------- */
  concepts: {
    'grace:concept:grace': {
      label: 'Graça (charis)',
      aliases: [
        'graça',
        'graca',
        'graças',
        'gracioso',
        'graciosa',
        'charis',
        'kharis',
        'favor imerecido',
        'favor',
        'imerecido',
        'imerecida',
        'pela graça',
        'maravilhosa graça',
        'sublime graça',
        'palavra grega para graça',
        'palavra grega por trás de graça',
        'palavra grega por tras de graca',
        'qual é a palavra grega por trás de graça',
        'graça comum',
        'o que é graça',
      ],
      answer:
        'A palavra grega por trás de “graça” em Ef 2:5, 7 e 8 é charis — favor ou benevolência da parte de quem dá, e especialmente o favor livre e imerecido de Deus. Ela podia designar também o próprio dom e a gratidão que ele exige. Nesta passagem, Paulo a usa para nomear a única fonte da salvação: Deus agiu em favor de pessoas espiritualmente mortas, de modo que a salvação é dom dele, e não realização delas (2:8–9). Os teólogos também distinguem essa graça salvadora da bondade comum de Deus para com todas as pessoas — veja a seção de Teologia.',
    },
    'grace:concept:mercy': {
      label: 'Misericórdia e amor (Ef 2:4)',
      aliases: [
        'misericórdia',
        'misericordia',
        'misericordioso',
        'rico em misericórdia',
        'eleos',
        'compaixão',
        'compaixao',
        'grande amor',
        'muito amor',
        'amor de deus',
        'bondade',
        'benignidade',
        'chrestotes',
      ],
      answer:
        'Em 2:4, Paulo fundamenta o resgate divino no caráter de Deus: ele é rico em misericórdia (eleos) e age por causa do seu grande amor. A misericórdia olha para a miséria descrita em 2:1–3; a graça, para o dom imerecido de 2:5–8. No Antigo Testamento grego, eleos geralmente traduz hesed, o amor leal e constante de Deus na aliança; assim, Paulo ecoa a confissão de Israel sobre um Deus “grande em benignidade e verdade” (Êx 34:6).',
    },
    'grace:concept:saved': {
      label: 'Salvos (sōzō)',
      aliases: [
        'salvos',
        'salvo',
        'salvar',
        'salvação',
        'salvacao',
        'sozo',
        'sōzō',
        'sois salvos',
        'fostes salvos',
        'fomos salvos',
        'tempo perfeito',
        'resgatados',
        'resgate',
      ],
      answer:
        'As duas vezes em que Paulo diz “pela graça sois salvos” (2:5, 8), ele usa um particípio perfeito de sōzō, σεσῳσμένοι, com “sois” — apresentando a salvação como um resgate concluído cujos efeitos continuam. Em todo o Novo Testamento, essa forma aparece apenas nesses dois versículos. Em outros lugares, Paulo também fala da salvação como algo em curso e ainda por vir (1Co 1:18; Rm 5:9–10); Efésios, por isso, destaca sua realidade presente e segura.',
    },
    'grace:concept:faith': {
      label: 'Por meio da fé',
      aliases: [
        'fé',
        'pistis',
        'por meio da fé',
        'mediante a fé',
        'crer',
        'crença',
        'confiança',
        'somente pela fé',
        'só pela fé',
        'sola fide',
        'a fé é um dom',
        'a fé é dom de deus',
      ],
      answer:
        'Paulo diz que somos salvos pela graça, por meio da fé (2:8): a graça é o que salva, e a fé é o modo como o dom é recebido. A fé não é uma obra que conquista a salvação — por isso ela combina com o “não por obras” (2:9). Spurgeon retratou a graça como a fonte e a fé como o aqueduto; Wesley chamou a graça de fonte e a fé de condição da salvação. Se a própria fé faz parte do “dom” de 2:8 é algo discutido desde a igreja antiga.',
    },
    'grace:concept:gift': {
      label: 'O dom de Deus — “isto não vem de vós”',
      aliases: [
        'dom',
        'dom de deus',
        'dádiva',
        'dadiva',
        'presente',
        'doron',
        'dōron',
        'não vem de vós',
        'nao vem de vos',
        'não de vós mesmos',
        'dom gratuito',
        'gratuitamente',
        'de graça',
        'dorean',
        'dōrean',
        'isto não vem de vós',
      ],
      answer:
        'Em 2:8, Paulo chama a salvação de “dom de Deus” (dōron), usando uma palavra que em outros lugares geralmente designa uma oferta que as pessoas trazem a Deus — aqui, Deus é quem dá. O “isto” de “isto não vem de vós” é neutro e não concorda com as palavras femininas graça e fé; por isso, refere-se mais naturalmente a todo o acontecimento de ser salvo pela graça, por meio da fé. Crisóstomo e Agostinho incluíam a fé no dom; Calvino entendia o dom como a própria salvação.',
    },
    'grace:concept:works': {
      label: 'Obras, orgulho e Tiago',
      aliases: [
        'obras',
        'não por obras',
        'nao por obras',
        'boas obras',
        'orgulho',
        'orgulhar',
        'vanglória',
        'gloriar-se',
        'mérito',
        'merito',
        'conquistar',
        'merecer',
        'merecido',
        'tiago',
        'fé e obras',
        'fé sem obras',
        'tiago 2',
        'efésios 2:10 e tiago 2',
      ],
      answer:
        'Paulo exclui as obras como fundamento da salvação, “para que ninguém tenha orgulho de si mesmo” (2:9), e logo em seguida diz que fomos criados “para as boas obras” (2:10) — o mesmo substantivo grego, primeiro com “de”, depois com “para”. A advertência de Tiago de que a fé sem obras está morta (Tg 2:14–26) visa uma fé que nada produz; Paulo exclui as obras como base da aceitação. Juntos, ensinam que a graça salva sem as obras e nunca deixa as pessoas sem elas.',
    },
    'grace:concept:workmanship': {
      label: 'Feitura de Deus (poiēma)',
      aliases: [
        'feitura',
        'obra de deus',
        'poiema',
        'poiēma',
        'obra-prima',
        'obra prima',
        'nova criação',
        'criados em cristo',
        'criados em cristo jesus',
        'preparou de antemão',
        'versículo 10',
        'versiculo 10',
      ],
      answer:
        'Em 2:10, Paulo chama os crentes de feitura de Deus (poiēma), palavra usada só mais uma vez no Novo Testamento — para a própria criação, em Rm 1:20. O Deus que fez o mundo fez um novo povo, “criados em Cristo Jesus” para as boas obras que ele preparou de antemão. As boas obras são o propósito e o fruto da salvação, e não a sua causa, e o “andar” de 2:10 substitui o antigo andar de 2:2.',
    },
    'grace:concept:dead-alive': {
      label: 'Da morte para a vida: “Mas Deus”',
      aliases: [
        'mortos',
        'morto',
        'mortos em pecados',
        'mortos em ofensas',
        'mortos em ofensas e pecados',
        'ofensas',
        'transgressões',
        'deu vida',
        'vivificados',
        'mas deus',
        'carne',
        'o que paulo quer dizer com carne',
        'filhos da ira',
        'ira',
        'príncipe do poder do ar',
        'principe do poder do ar',
        'ressuscitados com cristo',
        'assentados com cristo',
        'lugares celestiais',
        'regiões celestiais',
        'união com cristo',
      ],
      answer:
        'Paulo descreve a vida sem Cristo como morte (2:1), escravidão ao mundo e ao diabo (2:2) e uma vida movida pela carne — a natureza humana decaída — sob a justa ira de Deus (2:3). Então vem a dobradiça: “Mas Deus” (2:4). Os mortos não se reanimam a si mesmos; Deus nos deu vida, nos ressuscitou e nos fez sentar com Cristo (2:5–6), ecoando o que fez por Cristo em 1:20.',
    },
    'grace:concept:grace-and-response': {
      label: 'Graça e resposta humana: onde os cristãos divergem',
      aliases: [
        'interpretações diferentes',
        'interpretacoes diferentes',
        'interpretações teológicas',
        'diferentes interpretações teológicas',
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
        'livre-arbítrio',
        'livre arbítrio',
        'livre arbitrio',
        'predestinação',
        'predestinacao',
        'eleição',
        'eleicao',
        'monergismo',
        'sinergia',
        'graça preveniente',
        'graça irresistível',
        'pelágio',
        'pelagio',
        'pelagianismo',
        'theosis',
        'teose',
        'declaração conjunta',
      ],
      answer:
        'Todas as grandes tradições afirmam que a salvação é pela graça de Deus e não pode ser conquistada; diferem quanto ao modo como a graça atua na vontade humana. A teologia reformada ensina uma graça eficaz, que dá a fé que pede; a teologia arminiana e wesleyana ensina uma graça preveniente, que capacita uma resposta livre e resistível; o ensino católico fala de uma graça que cura e eleva, com cooperação real; os luteranos confessam que só Deus converte, pela Palavra e pelo sacramento, mas que sua graça pode ser resistida, e enfatizam a graça como favor de Deus recebido somente pela fé; e a ortodoxia fala de sinergia com as energias incriadas de Deus. A seção de Teologia apresenta cada uma delas com suas fontes.',
    },
    'grace:concept:original-audience': {
      label: 'Como os primeiros leitores ouviam “graça”',
      aliases: [
        'público original',
        'publico original',
        'primeiros leitores',
        'leitores originais',
        'primeiro público',
        'patronato',
        'patrono',
        'benfeitor',
        'benfeitoria',
        'reciprocidade',
        'gratidão',
        'gratidao',
        'mundo romano',
        'éfeso',
        'efeso',
        'gentios',
        'quem escreveu efésios',
        'quem escreveu efesios',
        'autoria',
      ],
      answer:
        'Os leitores de Paulo, em sua maioria gentios da província da Ásia, usavam charis para o favor de um patrono ou benfeitor, para o próprio presente e para a gratidão que ele impunha. Ao ouvir que eram salvos pela graça, muito provavelmente imaginariam Deus como o benfeitor supremo — embora o Deus de Paulo dê o seu maior dom aos indignos, até aos inimigos, e o seu dom crie um modo de vida novo e agradecido (2:10). Estudiosos como David deSilva e John Barclay exploraram esse pano de fundo.',
    },
    'grace:concept:living-by-grace': {
      label: 'Viver pela graça: graça barata, graça preciosa',
      aliases: [
        'graça barata',
        'graca barata',
        'graça preciosa',
        'graça cara',
        'licença',
        'licença para pecar',
        'continuar pecando',
        'continuar no pecado',
        'santificação',
        'santificacao',
        'santidade',
        'a graça educa',
        'devedor',
        'ética do devedor',
        'bonhoeffer',
      ],
      answer:
        'Porque a graça é gratuita, alguns a trataram como permissão para pecar; Paulo responde que os que estão unidos a Cristo andam em novidade de vida (Rm 6:1–4), e a graça que salva também nos educa para viver de maneira piedosa (Tt 2:11–12). Bonhoeffer chamou a graça sem discipulado de “graça barata”, contrapondo-a à graça preciosa do chamado de Cristo. Ef 2:10 diz o mesmo: não somos salvos pelas boas obras, mas para elas.',
    },
    'grace:concept:means-of-grace': {
      label: 'Os meios de graça: Palavra, sacramentos, oração',
      aliases: [
        'meios de graça',
        'meios da graça',
        'sacramentos',
        'sacramento',
        'ordenanças',
        'ordenança',
        'palavra e sacramento',
        'ceia do senhor',
        'santa ceia',
        'eucaristia',
        'batismo',
      ],
      answer:
        'Muitas tradições — entre elas a católica, a luterana, a reformada e a metodista — ensinam que Deus normalmente concede e nutre a graça por meios estabelecidos, sobretudo a Palavra e os sacramentos, junto com a oração. O Breve Catecismo de Westminster (P. 88) nomeia a palavra, os sacramentos e a oração; a Confissão de Augsburgo (art. V) diz que o Espírito, que opera a fé, é dado pela Palavra e pelos sacramentos; e Wesley chamou a oração, as Escrituras e a ceia do Senhor de principais canais ordinários da graça. Alguns cristãos de igrejas livres descrevem, em vez disso, o batismo e a ceia como atos simbólicos de obediência, e os primeiros quacres sustentavam que os ritos exteriores já não eram necessários. A seção de Teologia apresenta essas posições com suas fontes.',
    },
    'grace:concept:old-testament': {
      label: 'A graça no Antigo Testamento',
      aliases: [
        'antigo testamento',
        'hebraico',
        'palavra hebraica para graça',
        'chen',
        'hesed',
        'chesed',
        'amor leal',
        'benignidade',
        'chanan',
        'achou favor',
        'achar favor',
        'noé',
        'noe',
        'misericordioso e piedoso',
        'gracioso e compassivo',
      ],
      answer:
        'A graça não é uma invenção do Novo Testamento. O hebraico chen significa favor (“Noé achou favor aos olhos do SENHOR”, Gn 6:8), o verbo chanan significa ser gracioso (Nm 6:25; Sl 51:1), e hesed é o amor leal e constante de Deus. No Sinai, Deus se revelou gracioso e compassivo, grande em hesed (Êx 34:6–7), e escolheu Israel por amor, e não por mérito (Dt 7:7–8). O Antigo Testamento grego traduziu chen por charis e hesed por eleos — exatamente as palavras que Paulo usa em Ef 2:4–8.',
    },
  },
};

export default overlay;
