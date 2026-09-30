import type { VerseRef } from '../../../../domain/models';
import type { StudyOverlay } from '../types';

/**
 * Salmo 23 — overlay em português do Brasil.
 * Citações bíblicas entre aspas seguem a Bíblia Livre (BLIVRE); fora disso, paráfrase sem aspas.
 * Citações verificadas (comentário) ficam em inglês; aqui só a tradução livre (quoteTranslation).
 */
const v = (verse: number): VerseRef => ({ book: 'PSA', chapter: 23, verse });

const overlay: StudyOverlay = {
  studyId: 'psalm-23',
  locale: 'pt',
  title: 'Salmo 23',
  subtitle: 'O SENHOR é meu pastor',
  summary:
    'O Salmo 23 é um salmo de confiança em que Davi confessa o SENHOR — o Deus da aliança de Israel — primeiro como seu pastor e depois como seu anfitrião. Suas imagens vêm da lida diária de um pastor da Judeia e do costume, no antigo Oriente Próximo, de chamar os reis de pastores: pasto e água, orientação por caminhos retos, proteção num desfiladeiro escuro, uma mesa posta diante dos inimigos, azeite na cabeça do convidado e um cálice que transborda. No seu centro — segundo uma contagem das palavras hebraicas, exatamente no meio — está a confissão “porque tu estás comigo”, e o salmo termina com a bondade e o amor leal (ḥesed) do SENHOR perseguindo o salmista até a casa do SENHOR. Os profetas retomaram a imagem do pastor para falar do cuidado prometido por Deus ao seu povo disperso, e o Novo Testamento apresenta Jesus como o bom, o grande e o supremo Pastor.',
  opening:
    'Boas-vindas ao Salmo 23 — talvez o cântico mais amado da Bíblia, e um texto que recompensa a leitura sem pressa. Podemos olhar as palavras hebraicas por trás de “pastor”, “nada me faltará” e “sombra da morte”, o mundo antigo em que os reis eram chamados de pastores e o modo como essa imagem de Deus percorre toda a Bíblia até chegar a Jesus, o Bom Pastor. Por onde você gostaria de começar?',
  matchTopics: [
    'salmo 23',
    'salmos 23',
    'sl 23',
    'salmo vinte e três',
    'o senhor é meu pastor',
    'o senhor é o meu pastor',
    'senhor é meu pastor',
    'nada me faltará',
    'salmo do pastor',
    'o salmo do pastor',
    'pastor',
    'vale da sombra da morte',
    'pastos verdes',
    'pastos verdejantes',
    'águas tranquilas',
    'águas quietas',
  ],
  suggestedQuestions: [
    'Qual é a palavra hebraica por trás de “pastor”?',
    'O que significa “o vale da sombra da morte” em hebraico?',
    'Como os primeiros ouvintes teriam entendido isso?',
    'Onde mais a Bíblia chama Deus de pastor?',
    'Explique o versículo 5 com mais detalhes.',
    'Há diferentes interpretações desta passagem?',
    'O que Spurgeon disse sobre este salmo?',
    'Como o Salmo 23 se relaciona com João 10?',
  ],

  keyWords: {
    'psalm-23:kw:yhwh': {
      english: 'o SENHOR',
      anchors: [
        { verse: v(1), phrases: { BLIVRE: 'O SENHOR', NBV: 'O Senhor', BPM: 'Yahweh' } },
        { verse: v(6), phrases: { BLIVRE: 'SENHOR', NBV: 'Senhor', BPM: 'Yahweh' } },
      ],
      grammar: 'Nome próprio — o nome pessoal de Deus',
      basicMeaning: 'SENHOR — o nome próprio do único Deus verdadeiro',
      semanticRange: [
        'o nome pessoal e pactual do Deus de Israel, revelado a Moisés (Êx 3:14–15)',
        'lido em voz alta como ’Adonai (“Senhor”) na tradição judaica — daí “SENHOR” em maiúsculas nas Bíblias em português (e LORD em versaletes nas inglesas)',
        'vertido “Jehovah” no inglês antigo (como nos tradutores de Calvino) — em português, “Jeová” — e “Yahweh” nos estudos modernos e na clássica World English Bible (também na BPM)',
      ],
      significance:
        'Davi não começa com uma palavra genérica para Deus, mas com o seu nome pactual: o Deus que se comprometeu com Israel no êxodo é aquele a quem ele chama de “meu pastor”. No texto hebraico etiquetado do STEPBible, o nome aparece apenas duas vezes neste salmo — como a primeira palavra depois do título “Salmo de Davi” e na sua última linha —, de modo que tudo o que está entre uma ocorrência e outra fica envolvido pelo cuidado do SENHOR. As Bíblias imprimem SENHOR em maiúsculas (LORD em versaletes, nas inglesas) para sinalizar esse nome, que os leitores judeus pronunciam ’Adonai (“Senhor”); o léxico observa que o nome era escrito com as vogais de ’Adonai, e daí vem a forma mais antiga “Jeová”. Em toda a Bíblia Hebraica, o nome está etiquetado mais de 6.500 vezes.',
      caution:
        'O texto hebraico preserva apenas as consoantes YHWH com vogais emprestadas; “Yahweh” (em português, também “Javé”) é a reconstrução acadêmica habitual de uma pronúncia que o texto massorético não preserva.',
      notableNotes: [
        'Deus revela o seu nome a Moisés, ligando-o a “EU SOU O QUE SOU”.',
        '“O SENHOR teu Deus foi contigo; e nenhuma coisa te faltou” — o nome unido à presença e à provisão.',
        'O nome volta na última linha do salmo — “a casa do SENHOR” —, emoldurando o salmo inteiro.',
      ],
    },
    'psalm-23:kw:raah': {
      english: 'pastor',
      anchors: [{ verse: v(1), phrases: { BLIVRE: 'pastor', NBV: 'pastor', BPM: 'pastor' } }],
      grammar:
        'Verbo, particípio ativo Qal, masculino singular construto, com sufixo de 1ª pessoa — rōʿî, “meu pastor” (literalmente, “aquele que me pastoreia”)',
      basicMeaning: 'apascentar, cuidar, pastorear',
      semanticRange: [
        'cuidar de um rebanho e levá-lo a pastar',
        'como particípio: pastor, vaqueiro',
        'em sentido figurado, de um governante ou mestre que cuida de pessoas',
        'de animais: alimentar-se, pastar',
      ],
      significance:
        'O hebraico usa aqui um particípio: rōʿî é “aquele que me pastoreia”, uma atividade contínua, e não um título estático. Em Israel e entre os seus vizinhos, essa era uma linguagem régia — os reis eram chamados de pastores do seu povo —, de modo que chamar o SENHOR de “meu pastor” é confessá-lo ao mesmo tempo como rei e como aquele que cuida; e Davi, ele mesmo rei, coloca-se entre as ovelhas. No texto hebraico do STEPBible, as palavras etiquetadas com este verbo ocorrem 169 vezes, desde a bênção de Jacó (Gn 48:15) até a promessa de Ezequiel de que o próprio Deus apascentará o seu rebanho (Ez 34:15).',
      caution:
        'A palavra em si não carrega “ternura” ou “autoridade” em todos os seus usos; essas nuances vêm do modo como o salmo e o restante do Antigo Testamento desenvolvem a imagem.',
      notableNotes: [
        'Jacó abençoa em nome do Deus que foi o seu pastor por toda a vida, até aquele dia (a BLIVRE traduz “o Deus que me mantém”) — o mesmo particípio, a primeira confissão pessoal de Deus como pastor na Bíblia.',
        '“Tu apascentarás a meu povo Israel” — o verbo descreve a realeza de Davi.',
        '“Eu apascentarei minhas ovelhas” — Deus promete pastorear pessoalmente o seu povo.',
        '“Como pastor ele apascentará seu rebanho” — o substantivo e o verbo juntos.',
      ],
    },
    'psalm-23:kw:chaser': {
      english: 'faltar',
      anchors: [{ verse: v(1), phrases: { BLIVRE: 'nada me faltará', NBV: 'tudo de que preciso', BPM: 'Nada me faltará' } }],
      grammar: 'Verbo, imperfeito Qal (yiqtol), 1ª pessoa comum do singular — ʾeḥsār, “careço / carecerei”',
      basicMeaning: 'faltar, carecer',
      semanticRange: ['carecer, estar sem, ter necessidade', 'faltar, escassear', 'diminuir, decrescer'],
      significance:
        '“Nada me faltará” é uma afirmação de suficiência, não de luxo: o verbo significa carecer ou estar sem algo. É o verbo que resume os anos de Israel no deserto — “nenhuma coisa te faltou” (Dt 2:7; compare Ne 9:21) —, de modo que a linha pode ser ouvida como a aplicação da experiência de Israel no deserto à vida de uma só pessoa, ligação que tanto as notas da Tyndale quanto Sinclair Ferguson estabelecem: o Deus que proveu para Israel no deserto é também o pastor do salmista. O verbo ocorre 23 vezes na Bíblia Hebraica (etiquetagem do STEPBible, contada para este estudo).',
      caution:
        'A linha promete que à ovelha não faltará aquilo de que o Pastor sabe que ela precisa — o Salmo 34:10 fala dos que “não têm falta de bem algum” —, não que todo desejo será atendido.',
      notableNotes: [
        '“Nenhuma coisa te faltou” — Moisés sobre os quarenta anos de Israel no deserto.',
        '“De nenhuma coisa tiveram falta” — a mesma memória na grande oração de confissão de Israel.',
        'A terra prometida, onde “não te faltará nada”.',
        '“Os que buscam ao SENHOR não têm falta de bem algum.”',
      ],
    },
    'psalm-23:kw:nephesh': {
      english: 'alma',
      anchors: [{ verse: v(3), phrases: { BLIVRE: 'alma', BPM: 'alma' } }],
      grammar: 'Substantivo, feminino singular construto, com sufixo de 1ª pessoa — nafšî, “minha alma / minha vida / eu mesmo”',
      basicMeaning: 'alma, eu, vida',
      semanticRange: [
        'vida, o ser vivente',
        'a pessoa — “eu mesmo”',
        'apetite, desejo',
        'o ser interior, sede das emoções e da vontade',
        'pescoço (em alguns poucos textos)',
      ],
      significance:
        'Nefesh abrange o ser vivo inteiro — fôlego, apetite, emoção, vontade e a própria vida —, além daquilo que o léxico chama de ser interior do homem. Em 23:3, a imagem pastoril aponta para a pessoa inteira: “Ele restaura minha alma” significa que o Pastor devolve a vida e as forças à ovelha exausta ou desgarrada, e não apenas que ele renova uma faculdade espiritual. O substantivo ocorre 754 vezes na etiquetagem do STEPBible, em sentidos que vão de “vida” e “pessoa” a “apetite”.',
      caution:
        'A palavra “alma” pode sugerir apenas uma parte interior e espiritual; aqui o contexto aponta para o eu inteiro. O estudo da palavra, por si só, não resolve questões mais amplas de antropologia bíblica, sobre as quais os cristãos divergem.',
      notableNotes: [
        'O homem se tornou “alma vivente” (nefesh) quando Deus lhe soprou o fôlego de vida.',
        'A lei do SENHOR é perfeita e “restaura a alma” — o mesmo substantivo com o mesmo verbo (šûb), noutro tronco.',
        'Amar o SENHOR “de toda tua alma” — o eu inteiro.',
      ],
    },
    'psalm-23:kw:shuv': {
      english: 'restaura',
      anchors: [
        { verse: v(3), phrases: { BLIVRE: 'restaura', NBV: 'devolve', BPM: 'restaura' } },
        { verse: v(6), phrases: { BLIVRE: 'habitarei', NBV: 'viverei', BPM: 'morarei' } },
      ],
      grammar:
        'Verbo, imperfeito Polel (etiquetado como Piel no STEPBible; o Polel é o tronco intensivo de raízes ocas como šûb), 3ª pessoa masculina do singular — yəšôbēb, “ele traz de volta, restaura” (em 23:6, o texto massorético traz wəšabtî, perfeito Qal com waw, “e voltarei”)',
      basicMeaning: 'voltar, retornar; (Polel) trazer de volta, restaurar, reanimar',
      semanticRange: [
        'voltar-se, retornar',
        'voltar-se para Deus — arrepender-se',
        '(Polel, Hifil) trazer de volta, restaurar, reanimar',
        'devolver, retribuir',
      ],
      significance:
        'O movimento básico do verbo é “voltar”. Neste tronco, significa fazer alguém voltar — a ovelha desgarrada trazida de volta, a vida desfalecida reanimada —, e é por isso que as traduções variam entre “restaura”, “refrigera” e “traz de volta”. Franz Delitzsch, no comentário de Keil–Delitzsch, descreve-o como trazer de volta uma alma que, por assim dizer, fugira, para que ela torne a si. O verbo pode também ecoar no fim do salmo: o texto hebraico, tal como vocalizado, diz “e voltarei” no versículo 6, de modo que ao Pastor que me faz voltar (v. 3) corresponde a minha volta para casa, para a casa dele.',
      caution:
        'Se 23:3 significa restauração moral (arrependimento) ou renovação das forças é algo debatido; a imagem pastoril comporta bem as duas coisas, mas nenhuma delas deve ser forçada a partir da palavra isolada.',
      notableNotes: [
        '“Restaura a alma” — šûb (Hifil) com nefesh, como em 23:3.',
        '“E as farei voltar a seus apriscos” — Deus trazendo de volta o seu rebanho disperso.',
        'As vogais massoréticas leem “e voltarei”; as versões antigas leem “habitarei” (veja a nota textual).',
      ],
    },
    'psalm-23:kw:tsalmavet': {
      english: 'sombra da morte',
      anchors: [{ verse: v(4), phrases: { BLIVRE: 'sombra da morte', NBV: 'onde a morte está bem perto', BPM: 'sombra da morte' } }],
      grammar: 'Substantivo, masculino singular absoluto — na expressão bəgêʾ ṣalmāwet, “num vale de sombra de morte / de escuridão profunda”',
      basicMeaning: 'sombra de morte, escuridão profunda',
      semanticRange: [
        'escuridão profunda, trevas espessas',
        'sombra de morte — perigo ou aflição extremos',
        'a escuridão do mundo dos mortos (Jó 10:21–22; 38:17)',
        'a escuridão ameaçadora do deserto (Jr 2:6)',
      ],
      significance:
        'Quem lia hebraico podia ouvir duas coisas nesta palavra rara: “sombra” (ṣēl) + “morte” (māwet), e uma palavra para escuridão espessa. As vogais massoréticas e a Septuaginta grega (skia thanatou) sustentam “sombra da morte”; muitos estudiosos modernos a derivam de uma raiz que significa “ser escuro”, daí a nota de rodapé da BSB, “the valley of deep darkness” (o vale da escuridão profunda). Ela ocorre 18 vezes, 10 delas em Jó, geralmente para a escuridão no seu grau mais ameaçador (Amós 5:8 a usa simplesmente para a escuridão que Deus transforma em manhã). Seja como for, a imagem é a de um desfiladeiro tão escuro que a morte parece próxima — e é ali que o salmo diz “porque tu estás comigo”.',
      caution:
        'O versículo fala de atravessar o perigo na companhia de Deus, não apenas do momento da morte; é lido com razão em funerais, mas o seu primeiro sentido é mais amplo.',
      notableNotes: [
        '“As portas da sombra de morte”, em paralelo com “as portas da morte”.',
        'O deserto como “uma terra seca e de sombra de morte” — a mesma palavra para a ameaça do deserto.',
        '“Os que habitavam em terra de sombra de morte” — sobre eles brilha uma grande luz (citado em Mt 4:16).',
      ],
    },
    'psalm-23:kw:shevet': {
      english: 'vara',
      anchors: [{ verse: v(4), phrases: { BLIVRE: 'tua vara', NBV: 'a sua vara', BPM: 'Seu bastão' } }],
      grammar: 'Substantivo, masculino singular construto, com sufixo de 2ª pessoa — šibṭəkā, “tua vara”',
      basicMeaning: 'vara, bastão, cetro; tribo',
      semanticRange: [
        'vara ou clava — instrumento do pastor',
        'cetro — sinal da autoridade de um governante',
        'vara de disciplina',
        'tribo (o sentido mais comum da palavra)',
      ],
      significance:
        'O šēbeṭ do pastor era uma clava ou vara para afastar predadores e para guiar e contar o rebanho; o seu par neste versículo, a mišʿenet (“cajado”, H4938B), está ligado a uma palavra para “apoio” — algo em que se apoiar. A mesma palavra šēbeṭ também significa o cetro de um governante, de modo que a imagem une discretamente proteção e autoridade régia. O consolo do versículo 4 não vem da ausência de perigo, mas de ver a arma e o apoio do Pastor ao alcance da mão.',
      notableNotes: [
        '“Apascenta teu povo com teu cajado” — a mesma palavra, numa oração a Deus como pastor.',
        'Animais contados enquanto passam “sob a vara”.',
        '“Não será tirado o cetro de Judá” — o sentido régio.',
      ],
    },
    'psalm-23:kw:dashan': {
      english: 'ungir',
      anchors: [{ verse: v(5), phrases: { BLIVRE: 'unges', NBV: 'ungindo', BPM: 'unta' } }],
      grammar: 'Verbo, perfeito Piel, 2ª pessoa masculina do singular — diššantā, “ungiste / tornaste gordo”',
      basicMeaning: 'prosperar, engordar; (Piel) tornar gordo, ungir',
      semanticRange: [
        'ser gordo, engordar — imagem de prosperidade',
        '(Piel) tornar gordo, ungir',
        '(Piel) considerar uma oferta “gorda”, isto é, aceitável',
        '(Piel) remover as cinzas gordurosas do altar',
      ],
      significance:
        'Este não é māšaḥ, o verbo usado para ungir reis e sacerdotes (a raiz de “Messias”, usada quando Samuel ungiu Davi, 1Sm 16:13), mas um verbo caseiro que significa “tornar gordo” — derramar azeite em abundância sobre um convidado. A margem da KJV o registra: “Heb. makest fat”, isto é, no hebraico, “tornas gordo”. O anfitrião do versículo 5 não apenas admite Davi à sua mesa; ele o honra com a fartura com que um anfitrião generoso tratava um hóspede bem-vindo (compare Lc 7:46). O verbo ocorre 11 vezes.',
      notableNotes: [
        '“Aceite os teus holocaustos” — literalmente, que os considere gordos.',
        '“A alma generosa prosperará” — ser engordado como imagem de florescimento.',
        '“A boa notícia fortalece os ossos” — literalmente “engorda”, o mesmo tronco Piel de “unges” em 23:5.',
      ],
    },
    'psalm-23:kw:hesed': {
      english: 'bondade / misericórdia (amor leal)',
      anchors: [{ verse: v(6), phrases: { BLIVRE: 'bondade', NBV: 'misericórdia', BPM: 'bondade amorosa' } }],
      grammar: 'Substantivo, masculino singular absoluto, ligado por “e” — wāḥesed',
      basicMeaning: 'bondade, benignidade, fidelidade',
      semanticRange: [
        'amor leal dentro de uma relação ou aliança',
        'bondade demonstrada além da obrigação',
        'fidelidade, amor constante — o compromisso pactual de Deus',
      ],
      significance:
        'Ḥesed é amor leal e comprometido — a bondade de alguém que se vinculou a você. O interlinear do STEPBible o glosa aqui como lealdade pactual (“covenant loyalty”), enquanto as traduções buscam “misericórdia”, “bondade”, “benignidade”, “amor constante” ou “amor leal”. Unido à palavra para “bem” (a BLIVRE traz “o bem e a bondade”; outras versões, “a bondade e a misericórdia”), ele transforma o último versículo numa afirmação sobre o caráter do SENHOR: o Deus que conduziu Israel “em tua misericórdia” até a sua santa habitação (Êx 15:13) fará o mesmo por uma única ovelha. Ocorre cerca de 245 vezes no texto etiquetado.',
      caution:
        'Nenhuma palavra em português capta sozinha o sentido de ḥesed; evite tratar uma única tradução (por exemplo, “graça”) como o seu significado fixo.',
      notableNotes: [
        '“Conduziste em tua misericórdia a este povo, ao qual salvaste” — ḥesed que conduz à habitação de Deus.',
        'O SENHOR, “grande em benignidade e verdade”.',
        'O refrão de Israel: “sua bondade dura para sempre”.',
      ],
    },
    'psalm-23:kw:radaph': {
      english: 'seguir (perseguir)',
      anchors: [{ verse: v(6), phrases: { BLIVRE: 'seguirão', NBV: 'acompanharão', BPM: 'acompanharão' } }],
      grammar: 'Verbo, imperfeito Qal, 3ª pessoa masculina do plural, com sufixo de 1ª pessoa — yirdəpûnî, “eles me perseguirão”',
      basicMeaning: 'perseguir',
      semanticRange: [
        'perseguir, caçar — sobretudo inimigos',
        'perseguir, atormentar',
        'ir atrás de, buscar alcançar (por exemplo, a justiça)',
        'correr atrás de',
      ],
      significance:
        '“Seguir” é suave; o hebraico é mais forte. Rādap̄ é o verbo usado para caçar um inimigo ou perseguir um fugitivo — a palavra que os salmos de Davi usam para os que o caçam. Aqui, os perseguidores são a bondade de Deus e o seu ḥesed. Franz Delitzsch, no comentário de Keil–Delitzsch, ressalta a inversão: os inimigos do salmista o perseguem, mas agora somente a bondade e o favor o perseguirão, todos os dias da sua vida. O verbo ocorre 143 vezes no texto etiquetado.',
      notableNotes: [
        'Os egípcios foram no encalço de Israel até o mar (a BLIVRE traz “seguindo-os”).',
        '“Então que o inimigo persiga a minha alma” — nos salmos de Davi, o verbo geralmente descreve inimigos no encalço (Sl 7:1; 31:15; 143:3).',
        '“A justiça, a justiça seguirás.”',
      ],
    },
  },

  crossReferences: {
    'psalm-23:xr:gen-48-15': {
      title: 'O Deus pastor de Jacó',
      explanation:
        'A primeira pessoa nas Escrituras a chamar Deus de seu pastor é Jacó, ao abençoar os filhos de José no fim de uma vida longa e atribulada: o Deus que foi o seu pastor por toda a vida, até aquele dia (a BLIVRE traduz “o Deus que me mantém desde que eu sou até hoje”). O hebraico usa o mesmo particípio de rāʿâ que o Salmo 23:1. A confissão de Jacó olha para trás, para uma vida inteira de cuidado; Davi faz a mesma confissão pessoal, e Sinclair Ferguson sugere que ele aprendeu a fazê-la com Jacó.',
    },
    'psalm-23:xr:exod-15-13': {
      title: 'Conduzidos com ḥesed à santa habitação de Deus',
      explanation:
        'O cântico de Moisés depois do mar Vermelho compartilha com o Salmo 23 um conjunto incomum de palavras: com o seu ḥesed (23:6), Deus conduz o povo que redimiu (nāḥâ — o verbo que a BLIVRE traduz por “guia” em 23:3) e o leva com a sua força (nāhal — o verbo de “me leva” em 23:2) à “habitação” do seu santuário (nāweh, palavra que também significa pastagem ou morada de um rebanho). A coincidência sugere que o salmo lê a vida de uma pessoa segundo o padrão do êxodo — resgatada, conduzida, sustentada e levada à casa de Deus.',
    },
    'psalm-23:xr:deut-2-7': {
      title: 'Quarenta anos, e “nenhuma coisa te faltou”',
      explanation:
        'Moisés resume os anos no deserto: “estes quarenta anos o SENHOR teu Deus foi contigo; e nenhuma coisa te faltou”. O verbo é o mesmo de “nada me faltará” (ḥāsēr), e o versículo une a presença de Deus (“foi contigo”) à sua provisão — os dois temas de Salmo 23:1 e 23:4. Neemias 9:21 relembra a mesma história com o mesmo verbo. O salmo não menciona o deserto, mas as notas da Tyndale sobre 23:1 e Sinclair Ferguson apontam para este versículo: lida ao lado dele, a ovelha solitária do Salmo 23 desfruta do que todo o rebanho de Israel experimentou no deserto.',
    },
    'psalm-23:xr:ps-80-1': {
      title: 'Pastor de Israel',
      explanation:
        'O Salmo 80 ora a Deus como “Pastor de Israel”, que pastoreia José “como a ovelhas” e habita entre os querubins. Mostra o lado comunitário e régio da imagem: o SENHOR pastoreia todo o seu povo como o seu rei. O Salmo 23 transforma essa confissão nacional numa confissão pessoal — “meu pastor”.',
    },
    'psalm-23:xr:ps-27-4': {
      title: 'Morar na casa do SENHOR todos os dias',
      explanation:
        'O Salmo 27:4 é o paralelo mais próximo de 23:6: “que eu possa morar na casa do SENHOR todos os dias de minha vida”. Compartilha a expressão hebraica “todos os dias de minha vida” e usa šibtî, “meu habitar”, de yāšab — o verbo que as traduções antigas leram em 23:6. Também mostra o que “a casa do SENHOR” significava para Davi: o lugar de contemplar a beleza do SENHOR e de buscá-lo no seu templo.',
    },
    'psalm-23:xr:ps-16-5': {
      title: 'O SENHOR, minha porção e meu cálice',
      explanation:
        'Outro salmo de Davi usa o cálice como imagem da porção que cabe a alguém: “O SENHOR é a porção da minha herança e o meu cálice; tu sustentas a minha sorte.” Lido ao lado de 23:5, o cálice que transborda é mais do que uma bebida farta: é uma vida cuja porção, dada por Deus, é mais do que suficiente.',
    },
    'psalm-23:xr:isa-40-11': {
      title: 'Ele guia mansamente as ovelhas que amamentam',
      explanation:
        'A mensagem de consolo de Isaías aos exilados retrata o SENHOR vindo como pastor: ele recolhe os cordeirinhos nos braços e “guiará mansamente as que tiveram filhotes”. O hebraico usa as mesmas duas palavras do Salmo 23 — rāʿâ, “pastorear”, e nāhal, “conduzir”, um verbo raro (10 ocorrências) para conduzir com cuidado ao descanso e ao refrigério. O que Davi confessou pessoalmente, o profeta promete a um povo inteiro que volta para casa.',
    },
    'psalm-23:xr:isa-43-2': {
      title: '“Estarei contigo” nas águas e no fogo',
      explanation:
        'A promessa de Deus a Israel — “Quando passares pelas águas, estarei contigo; … quando passares pelo fogo, não te queimarás” — segue a mesma lógica de 23:4. Nenhum dos dois textos promete que o povo de Deus evitará o perigo; ambos prometem a presença dele no perigo. É por isso que o salmista pode dizer: “não temerei mal algum, porque tu estás comigo”.',
    },
    'psalm-23:xr:jer-23-1': {
      title: 'Maus pastores e o Renovo justo',
      explanation:
        'Jeremias denuncia os reis de Judá como pastores que “destroem e dispersam as ovelhas”, e então promete que o próprio SENHOR reunirá o seu rebanho e o fará voltar aos seus apriscos, e que levantará para Davi um “justo Renovo”. É o Salmo 23 ao avesso: onde os pastores humanos falharam em prover, guiar e proteger, Deus fará o que o salmo confessa. O nome do rei vindouro, “O SENHOR é nossa justiça” (ṣidqēnû, da mesma raiz de ṣedeq, “justiça”, em 23:3), pode ser ouvido como resposta aos “caminhos da justiça” do salmo.',
    },
    'psalm-23:xr:ezek-34-11': {
      title: 'Deus mesmo apascentará o seu rebanho',
      explanation:
        'Ezequiel 34 soa como o Salmo 23 transformado em promessa divina. Depois de condenar os pastores egoístas de Israel, Deus diz: “eu, eu mesmo, procurarei minhas ovelhas”, “em bons pastos eu as apascentarei… ali se deitarão”, “Eu apascentarei minhas ovelhas, e eu farei elas se deitarem” (o mesmo verbo e o mesmo tronco de “Ele me faz deitar”, 23:2) e “Eu buscarei a perdida, e trarei de volta a desgarrada”. Depois promete “um pastor… a meu servo Davi” (34:23) — o capítulo que Jesus tem em vista quando se chama de bom pastor, segundo as notas da Tyndale sobre João 10.',
    },
    'psalm-23:xr:luke-7-44': {
      title: 'Ungir com óleo a cabeça do convidado',
      explanation:
        'Quando Simão, o fariseu, deixou de lado as cortesias habituais, Jesus observou: “Não ungiste a minha cabeça com óleo”. As notas da Tyndale explicam que ungir a cabeça de um convidado com azeite de oliva era uma forma de honrar um visitante respeitado. A cena mostra o costume por trás de 23:5: o SENHOR trata o salmista não como um estranho tolerado, mas como um convidado de honra.',
    },
    'psalm-23:xr:mark-6-34': {
      title: 'Ovelhas sem pastor, sentadas na grama verde',
      explanation:
        'Marcos conta que Jesus teve compaixão da multidão “porque eram como ovelhas que não têm pastor” (ecoando Nm 27:17), ensinou-a, mandou que todos se sentassem “sobre a grama verde” e a alimentou até que “todos comeram e se saciaram”. Muitos leitores ouvem o Salmo 23 por trás da cena — o pastor que faz o rebanho deitar-se em pastos verdes e provê de modo que nada lhe falte —, com Jesus fazendo o que o salmo diz que o SENHOR faz. Kenneth Bailey dedica um capítulo do seu estudo sobre o tema do pastor a esta passagem.',
    },
    'psalm-23:xr:luke-15-3': {
      title: 'O pastor que traz de volta a perdida',
      explanation:
        'Na parábola de Jesus, o pastor deixa as noventa e nove, vai em busca da ovelha perdida “até que a encontre” e a carrega para casa sobre os ombros, com alegria. A história dá forma narrativa a “Ele restaura minha alma” — o Pastor traz de volta a que se desgarrou —, e Jesus a aplica à alegria de Deus por um único pecador que se arrepende. Matthew Henry lê 23:3 exatamente assim: o Pastor me restaura quando me desvio.',
    },
    'psalm-23:xr:john-10-11': {
      title: '“Eu sou o bom Pastor”',
      explanation:
        'Jesus reivindica para si o papel que o Salmo 23 atribui ao SENHOR e que, segundo Ezequiel 34, o próprio Deus assumiria: “Eu sou o bom Pastor”. Ele conhece as suas ovelhas e elas o conhecem; ao contrário do mercenário, ele “dá sua vida pelas ovelhas” e a retoma. Por isso os cristãos leem o Salmo 23 como cumprido em Cristo — não porque Davi escrevesse diretamente sobre Jesus, mas porque o Pastor em quem ele confiava se aproximou em Jesus. As notas da Tyndale sobre João 10 situam o Salmo 23 na tradição veterotestamentária de Deus como pastor de Israel, da qual Jesus se vale, e dizem que ele reflete sobre os líderes de Israel à luz de Ezequiel 34. Franz Delitzsch, no comentário de Keil–Delitzsch, faz a ligação: o “meu pastor” do salmista encontra a sua resposta em “Eu sou o bom Pastor”.',
    },
    'psalm-23:xr:heb-13-20': {
      title: 'O grande Pastor, trazido de volta dentre os mortos',
      explanation:
        'Hebreus bendiz “o Deus da paz”, que “voltou a trazer dentre os mortos o grande Pastor das ovelhas, o nosso Senhor Jesus”. A expressão grega “o pastor das ovelhas”, com Deus fazendo-o subir, ecoa o Antigo Testamento grego de Isaías 63:11, que fala de Deus fazendo subir do mar Moisés, o pastor das ovelhas. O Pastor que conduz o seu rebanho pelo vale da sombra da morte passou ele mesmo pela morte e saiu dela.',
    },
    'psalm-23:xr:1pet-2-25': {
      title: 'Convertidos ao Pastor das vossas almas',
      explanation:
        'Pedro, citando Isaías 53:6, diz aos crentes que eles eram “como ovelhas desviadas do caminho”, mas agora estão “convertidos ao Pastor e Supervisor de vossas almas”. O seu grego compartilha três palavras-chave com a Septuaginta do Salmo 23 (Sl 22 na sua numeração): o verbo para fazer voltar (epistrephō — literalmente, fez voltar a minha alma, 22:3 LXX), “alma” (psychē) e “pastor” (poimēn/poimainō). O que o salmo descreve do lado da ovelha — o Pastor restaurando a alma —, Pedro descreve como conversão a Cristo.',
    },
    'psalm-23:xr:1pet-5-4': {
      title: 'O Pastor Principal aparecerá',
      explanation:
        'Pedro exorta os presbíteros da igreja a pastorear o rebanho de Deus de boa vontade e com humildade, como exemplos e não como senhores, porque “o Pastor Principal” aparecerá. A imagem do pastoreio de Deus no Salmo 23 torna-se o modelo para os líderes da igreja, que são subpastores responsáveis diante de Cristo. F. B. Meyer relaciona os três títulos do Novo Testamento com os Salmos 22–24: o Bom Pastor que morreu, o Grande Pastor que guarda o seu rebanho e o Supremo Pastor que voltará.',
    },
    'psalm-23:xr:rev-7-17': {
      title: 'O Cordeiro será o seu pastor',
      explanation:
        'A própria nota da BSB sobre o Salmo 23:1 aponta para cá. Na visão de João, “o Cordeiro, que está no meio do trono, os apascentará, e os guiará até fontes vivas de águas”, e toda lágrima será enxugada. Os verbos gregos para “apascentar” (poimainō) e “guiar” (hodēgeō) são os que a Septuaginta usa no Salmo 23:1 e 3, e a cena retoma também Isaías 49:10, onde Deus conduz o seu povo — com nāhal, o verbo de 23:2 — a mananciais de águas (as notas da BSB sobre Ap 7:17 apontam para o Salmo 23:1 e para Isaías 49:10). O Apocalipse cumpre a promessa de Isaías numa linguagem que ecoa o Salmo 23: os pastos e as águas do salmo tornam-se imagem do lar definitivo do povo de Deus.',
    },
  },

  context: {
    'psalm-23:ctx:shepherd-kings': {
      title: 'Reis como pastores no antigo Oriente Próximo',
      summary:
        'Em todo o antigo Oriente Próximo, os governantes eram habitualmente chamados de pastores do seu povo. No epílogo do seu código de leis, Hamurábi da Babilônia (reinou c. 1792–1750 a.C.) chama a si mesmo de pastor portador de salvação, cujo cetro é reto. Quando Davi chama o SENHOR de “meu pastor”, está usando linguagem régia — e, sendo ele mesmo rei, coloca-se entre as ovelhas.',
      detail:
        'As notas da Tyndale observam que o rei terreno era entendido como representante do pastor divino que o pusera sobre o seu povo, e que os bons reis, que conduziam o seu povo com firmeza e sabedoria, se assemelhavam a pastores. As Escrituras de Israel usam a imagem para Davi (“Tu apascentarás a meu povo Israel”, 2Sm 5:2), para o rei persa Ciro (“Ele é meu pastor”, Is 44:28) e, negativamente, para os reis que dispersaram o rebanho (Jr 23:1–2; Ez 34:2–6). O epílogo de Hamurábi chega a reunir imagens que lembram o salmo — um cetro reto, uma boa sombra estendida sobre a sua cidade, um povo a quem se permite repousar em paz —, mas o salmo atribui o papel de pastor a Deus, e não a um rei humano.',
    },
    'psalm-23:ctx:shepherding': {
      title: 'O trabalho de um pastor no antigo Israel',
      summary:
        'Pastorear era um trabalho duro e exposto às intempéries. Davi estava com as ovelhas do pai quando Samuel mandou chamá-lo (1Sm 16:11), e contou a Saul como havia livrado cordeiros de um leão e de um urso (1Sm 17:34–35). Os pastores tinham de proteger o rebanho dos animais selvagens, suportar calor, frio, vento e chuva, conhecer cada ovelha e conduzi-las a bons pastos e a águas tranquilas.',
      detail:
        'À noite, um pastor no deserto podia guardar o rebanho num aprisco — um cercado de muretas de pedra coroadas de galhos espinhosos. De dia, ele ia à frente, e as ovelhas seguiam uma voz que conheciam (Jo 10:3–4); um bom pastor conduz, em vez de tanger o rebanho. A recusa de Jacó em forçar demais os animais que amamentavam, seguindo “pouco a pouco ao passo do gado” (Gn 33:13–14), usa uma forma de nāhal, o verbo traduzido “me leva” em 23:2.',
    },
    'psalm-23:ctx:wilderness': {
      title: 'Pastagens, desfiladeiros e o deserto',
      summary:
        'A paisagem do salmo é uma que Davi conhecia: as poucas ovelhas do seu pai pastavam “no deserto” (1Sm 17:28), onde pasto verde e água tranquila são preciosos. O “vale” do versículo 4 (gêʾ) é, segundo o léxico, um vale íngreme ou um desfiladeiro estreito, e Jeremias usa a palavra ṣalmāwet para a ameaça do deserto — “uma terra seca e de sombra de morte” (Jr 2:6).',
      detail:
        'Franz Delitzsch, no comentário de Keil–Delitzsch, explica a palavra para “pastos” (nāʾôt) como um lugar de repouso ou de morada, e até um oásis — um ponto verdejante no deserto. A memória de Israel sobre o deserto também moldou a linguagem do salmo: ali o SENHOR guiou o seu povo “como a um rebanho” (Sl 78:52), e nada lhe faltou (Dt 2:7).',
    },
    'psalm-23:ctx:rod-staff': {
      title: 'Vara e cajado',
      summary:
        'O pastor levava dois instrumentos. O šēbeṭ era uma vara ou clava — um instrumento de pastor, como define o léxico — usada para afastar predadores e para guiar e contar o rebanho; a mišʿenet era um cajado em que se apoiar. As notas da Tyndale observam que o pastor usava a vara e o cajado para afastar o perigo.',
      detail:
        'Levítico menciona animais contados enquanto passam “sob a vara” (Lv 27:32), e Davi saiu ao encontro de Golias com o “seu cajado em sua mão” (1Sm 17:40) — as notas da Tyndale observam que Golias só conseguia ver o cajado, não a funda escondida. A mesma palavra šēbeṭ é usada para o cetro de um governante (Gn 49:10), e Miqueias ora: “Apascenta teu povo com teu cajado” (Mq 7:14).',
    },
    'psalm-23:ctx:hospitality': {
      title: 'A mesa do anfitrião e o convidado ungido',
      summary:
        'O versículo 5 recorre aos costumes da hospitalidade. O anfitrião prepara uma refeição para o seu convidado à vista de inimigos que podem observar, mas não podem incomodá-lo, e o honra ungindo-lhe a cabeça com azeite. No tempo de Jesus, ungir a cabeça de um convidado com azeite de oliva ainda era uma forma de honrar um visitante respeitado (Lc 7:44–46).',
      detail:
        'As notas da Tyndale acrescentam que ungir a cabeça demonstrava honra, hospitalidade e refrigério ao convidado (compare Sl 92:10; 133:2). Franz Delitzsch, no comentário de Keil–Delitzsch, sugere um momento concreto da vida de Davi: quando ele fugia de Absalão, aliados levaram camas, comida e bebida ao seu povo exausto no deserto (2Sm 17:27–29). O salmo em si, porém, não menciona nenhuma ocasião.',
    },
    'psalm-23:ctx:superscription': {
      title: '“Salmo de Davi”',
      summary:
        'O título hebraico, mizmôr lədāwid, costuma ser traduzido “Salmo de Davi”. A preposição lə- pode significar “de”, “para”, “dedicado a” ou “a respeito de”, de modo que o título pode indicar Davi como autor ou apenas ligar o salmo a ele; a introdução da Tyndale recomenda cautela em ler todo título desse tipo como indicação de autoria, embora admita que muitos desses salmos possam ter sido escritos por Davi.',
      detail:
        'Nas Bíblias hebraicas, o título é contado como parte do versículo 1, e por isso a numeração dos versículos em hebraico e nas traduções muitas vezes difere. Os intérpretes que aceitam a autoria davídica divergem quanto ao momento em que ele o escreveu: Calvino o lê como palavras de Davi no auge da sua prosperidade como rei, Spurgeon e Maclaren imaginam o rei relembrando os seus anos de pastor, e Franz Delitzsch (no comentário de Keil–Delitzsch) o relaciona com a fuga de Davi diante de Absalão (2Sm 17:27–29). O próprio texto não indica nenhuma ocasião.',
    },
    'psalm-23:ctx:genre': {
      title: 'Um salmo de confiança',
      summary:
        'O Salmo 23 pertence aos salmos de confiança: não contém queixa nem pedido, apenas afirmações confiantes sobre Deus e dirigidas a Deus. As notas da Tyndale o chamam de salmo de confiança e segurança no Senhor e o situam num grupo (Sl 23–28) que desenvolve o cuidado pastoral de Deus, a sua orientação, a sua bondade e o anseio de morar na sua casa.',
      detail:
        'Ele está no Livro I do Saltério (Sl 1–41), onde predomina o nome divino YHWH. Matthew Henry o contrasta com os muitos salmos de Davi cheios de queixas: este, diz ele, está cheio de consolos. A sua poesia funciona sobretudo por meio de linhas e imagens em paralelo, e não de rima (se a poesia hebraica tem ou não um metro regular é debatido).',
    },
    'psalm-23:ctx:christian-worship': {
      title: 'O Salmo 23 no culto cristão',
      summary:
        'Os cristãos oram e cantam este salmo desde a igreja primitiva. No fim do século IV, as catequeses mistagógicas atribuídas a Cirilo de Jerusalém (alguns estudiosos as atribuem ao seu sucessor, João) usavam o versículo 5 para ensinar os recém-batizados sobre a Mesa do Senhor e a unção que haviam recebido, e Agostinho leu a sua água de refrigério como o batismo. A versão métrica escocesa “The Lord’s my shepherd” apareceu pela primeira vez no Saltério Métrico Escocês de 1650, e Spurgeon observou que o versículo 4 havia sido cantado junto a incontáveis leitos de morte.',
      detail:
        'Spurgeon abriu o seu sermão de 1880 sobre o versículo 4 citando a versão métrica escocesa. O hino de Henry W. Baker “The King of love my Shepherd is” parafraseia o salmo com referência explícita a Cristo e à sua cruz; F. B. Meyer o imprimiu no início de The Shepherd Psalm.',
    },
    'psalm-23:ctx:jewish-tradition': {
      title: 'O Salmo 23 na leitura e na oração judaicas',
      summary:
        'Na prática judaica, o salmo (Mizmor leDavid) é orado especialmente no sábado: um artigo do Chabad.org o descreve como cantado sobretudo na terceira refeição do sábado, acrescenta que algumas comunidades (incluindo a Chabad) também o recitam antes das outras refeições do sábado e remonta o costume ao cabalista Isaac Luria, do século XVI. O artigo o apresenta como uma confissão de que Deus provê.',
      detail:
        'Intérpretes judeus leram o salmo à luz da história de Israel. Segundo as notas de John Gill, o Targum aramaico parafraseia o versículo 1 como Deus alimentando Israel no deserto, lê o vale escuro como o cativeiro e entende a casa do versículo 6 como o santuário, enquanto os comentaristas medievais Rashi e David Kimchi ligavam o vale à fuga de Davi diante de Saul, no deserto de Zife.',
    },
  },

  literary: {
    placeInBook:
      'O Salmo 23 está no Livro I do Saltério (Sl 1–41), entre os salmos ligados a Davi (Sl 3–32; 34–41), onde predomina o nome divino YHWH. Vem depois do Salmo 22, que começa com “Deus meu, Deus meu, por que me desamparaste?”, e antes do Salmo 24, em que o Rei da Glória entra pelas suas portas. Spurgeon observa que ele vem depois do Salmo 22, que chama de o Salmo da Cruz por excelência, e que o salmo do pastor só vem depois dele; F. B. Meyer relata que o Salmo 23 já foi chamado de Salmo do Cajado, situado entre o Salmo da Cruz e o Salmo da Coroa. As notas da Tyndale também agrupam os Salmos 23–28 em torno do cuidado pastoral de Deus, da sua orientação, da sua bondade e do anseio de morar na sua casa.',
    argument:
      'O salmo avança em dois estágios. Nos versículos 1–4, o SENHOR é o pastor: ele provê (v. 1), dá descanso e água (v. 2), restaura e guia (v. 3) e acompanha a ovelha pelo vale mais escuro (v. 4). Nos versículos 5–6, a imagem se torna um banquete: o SENHOR é o anfitrião que prepara uma mesa diante dos inimigos, honra o convidado com azeite e enche o seu cálice, até que a bondade e o ḥesed persigam o salmista todos os seus dias e o levem à casa do SENHOR. No caminho, Davi deixa de falar sobre Deus e passa a falar com ele — “ele” se torna “tu” no momento em que o vale escurece.',
    placeInCanon:
      'A imagem do pastor percorre a Bíblia inteira. Jacó abençoa em nome do Deus que foi o seu pastor (Gn 48:15); Deus guia Israel pelo deserto como a um rebanho (Sl 78:52); Davi é tirado dos apriscos para apascentar Israel (Sl 78:70–72; 2Sm 5:2). Quando os reis de Israel falham como pastores, os profetas prometem que o próprio Deus apascentará o seu povo e levantará um pastor da linhagem de Davi (Jr 23:1–6; Ez 34:11–24). Jesus reivindica esse papel (Jo 10:11), as cartas do Novo Testamento o chamam de grande Pastor e de Pastor Principal (Hb 13:20; 1Pe 5:4), e o Apocalipse fecha a história com o Cordeiro apascentando o seu povo e guiando-o a fontes de águas vivas (Ap 7:17).',
    bookOutline: [
      'Livro I — Salmos 1–41',
      'Livro II — Salmos 42–72',
      'Livro III — Salmos 73–89',
      'Livro IV — Salmos 90–106',
      'Livro V — Salmos 107–150',
    ],
    passageOutline: [
      'O SENHOR, meu pastor: provisão, descanso e orientação',
      'Pelo vale mais escuro: “porque tu estás comigo”',
      'O SENHOR, meu anfitrião: mesa, azeite e cálice',
      'Perseguido pela bondade, morando na casa do SENHOR',
    ],
    features: {
      'psalm-23:lit:centre': {
        title: '“Porque tu estás comigo” no centro (segundo uma contagem de palavras)',
        description:
          'Contando as palavras hebraicas dos versículos 1–6 tal como estão divididas no texto etiquetado do STEPBible (deixando de lado o título “Salmo de Davi” e contando separadamente as palavras unidas por maqqef), o salmo tem 55 palavras. As três palavras kî-ʾattāh ʿimmādî, “porque tu estás comigo” (v. 4), são as palavras 27–29: exatamente 26 palavras vêm antes delas e exatamente 26 depois. Quer o poeta as tenha contado, quer não, a confissão da presença de Deus está no centro aritmético e emocional do salmo. O resultado depende da convenção de contagem — se as palavras unidas por maqqef forem tratadas como uma só, as metades deixam de se equilibrar —, de modo que é melhor apresentá-lo como uma observação, não como prova de um desígnio.',
        structure: [
          { label: 'Palavras 1–26', text: 'vv. 1–4a: o SENHOR como pastor, até “não temerei mal algum”' },
          { label: 'Palavras 27–29', text: 'kî-ʾattāh ʿimmādî — “porque tu estás comigo”' },
          { label: 'Palavras 30–55', text: 'vv. 4b–6: vara e cajado, mesa, azeite e cálice, bondade e ḥesed, a casa do SENHOR' },
        ],
      },
      'psalm-23:lit:he-to-you': {
        title: 'De “ele” para “tu”',
        description:
          'Nos versículos 1–3, Davi fala do SENHOR na terceira pessoa (“Ele me faz deitar… me leva… restaura minha alma… me guia”). No versículo 4, quando o vale escurece, ele se volta para falar diretamente a Deus — “porque tu estás comigo; tua vara e teu cajado” — e continua a falar com ele no versículo 5 (“Tu preparas… unges”). O versículo 6 fecha de novo com o nome: “a casa do SENHOR”. A gramática encena o argumento do salmo: no perigo, falar sobre Deus se torna falar com Deus.',
      },
      'psalm-23:lit:inclusio': {
        title: 'Emoldurado pelo nome do SENHOR',
        description:
          'O nome divino YHWH ocorre apenas duas vezes no salmo — como a primeira palavra depois do título “Salmo de Davi” (v. 1) e na sua última linha (v. 6, “a casa do SENHOR”). A moldura mantém tudo o que está no meio — pasto, vale, mesa — dentro do nome do SENHOR.',
      },
      'psalm-23:lit:two-images': {
        title: 'Pastor e anfitrião — ou uma só jornada?',
        description:
          'A maioria dos comentaristas vê duas imagens: o SENHOR como pastor (vv. 1–4) e como anfitrião (vv. 5–6). Franz Delitzsch, no comentário de Keil–Delitzsch, observa que a figura do pastor se esvai depois do versículo 4 e aparece a do anfitrião; Maclaren divide o salmo em duas metades — as ovelhas do seu pasto e os convidados à sua mesa e na sua casa. As imagens também podem ser lidas como uma única jornada contínua, do pasto ao vale e à casa do anfitrião, e o vocabulário que o salmo compartilha com Êxodo 15:13 (os verbos de conduzir e guiar, ḥesed, a “habitação” de Deus) sugere um eco da jornada de Israel no êxodo.',
      },
      'psalm-23:lit:return-echo': {
        title: 'Trazido de volta — e voltando para casa',
        description:
          'O verbo šûb (“voltar, retornar”) aparece no versículo 3 — “Ele restaura (faz voltar) minha alma” — e, no texto hebraico tal como vocalizado pelos massoretas, de novo no versículo 6: wəšabtî, “e voltarei” à casa do SENHOR. Nessa leitura, o salmo é emoldurado por um duplo retorno: o Pastor me traz de volta, e eu volto para casa. Muitas traduções seguem as versões antigas e leem “habitarei” (veja a nota textual em Perspectivas).',
      },
    },
  },

  theology: {
    'psalm-23:th:shepherd-king': {
      title: 'O SENHOR como pastor-rei: provisão, orientação, proteção',
      summary:
        'Chamar o SENHOR de “meu pastor” é usar linguagem régia, pois em Israel e em todo o antigo Oriente Próximo os reis eram chamados de pastores. O salmo preenche o título com cuidado concreto: provisão para que nada de necessário falte, descanso e água, restauração, orientação por caminhos retos e proteção com a vara e o cajado. Calvino o lê como uma confissão da providência de Deus: aos que ele tomou sob o seu cuidado não faltará o que é bom.',
      detail:
        'O título também é uma repreensão aos pastores humanos que falham (Jr 23:1–2; Ez 34:2–6): o que os reis de Israel fizeram mal, o SENHOR promete fazer ele mesmo (Ez 34:11–16). A sua orientação é “por seu nome” — fundamentada não no mérito das ovelhas, mas no seu próprio caráter e reputação, ponto que tanto Calvino quanto as notas da Tyndale ressaltam.',
    },
    'psalm-23:th:presence': {
      title: 'A presença de Deus no vale escuro',
      summary:
        'O salmo não promete um caminho que contorne o vale escuro, mas companhia dentro dele: “não temerei mal algum, porque tu estás comigo”. Calvino observa que Davi não afirmava estar livre de todo medo, mas vencê-lo fixando os olhos no cajado do seu Pastor. A promessa da presença de Deus no perigo se repete nas Escrituras — “Quando passares pelas águas, estarei contigo” (Is 43:2) — e se faz carne em Jesus, chamado Emanuel, “Deus conosco” (Mt 1:23).',
      detail:
        'Agostinho leu o vale como a própria vida mortal, vivida sob a sombra da morte, e a presença de Deus como Cristo habitando no coração pela fé, para que, depois da sombra da morte, o crente possa estar com ele.',
    },
    'psalm-23:th:hesed': {
      title: 'Bondade e ḥesed: o amor da aliança que persegue',
      summary:
        'O último versículo nomeia o que esteve em ação desde o começo: a bondade e o ḥesed, o amor leal da aliança do SENHOR. O verbo não é um suave “seguir”, mas “perseguir”, a palavra usada para caçar um inimigo, agora descrevendo a bondade de Deus correndo atrás do seu servo todos os seus dias. O mesmo ḥesed conduziu Israel do Egito à santa habitação de Deus (Êx 15:13) e é celebrado no refrão de Israel: “sua bondade dura para sempre” (Sl 136:1).',
      detail:
        'Porque o Pastor age “por seu nome” (v. 3), a segurança do salmista repousa no caráter de Deus, e não no seu próprio desempenho: o Deus da aliança se comprometeu com o seu povo.',
    },
    'psalm-23:th:house': {
      title: 'Acolhido à mesa e na casa do SENHOR',
      summary:
        'O salmo termina a uma mesa e numa casa. O SENHOR é anfitrião, além de pastor: prepara uma refeição à vista de inimigos que não podem interferir, honra o seu convidado com azeite e enche o seu cálice. O destino é “a casa do SENHOR”, o lugar do culto e da presença de Deus, onde o Salmo 27:4 anseia morar “todos os dias de minha vida”. As notas da Tyndale ligam o banquete ao banquete messiânico prometido em Isaías 25:6 e retratado em Apocalipse 19:9.',
      detail:
        'Os primeiros mestres cristãos ouviram aqui ressonâncias sacramentais. As catequeses mistagógicas atribuídas a Cirilo de Jerusalém aplicam a mesa à Ceia do Senhor e o óleo à unção dos recém-batizados; Agostinho lê a água de refrigério como o batismo, mas entende a mesa como o alimento sólido da fé madura (não mais o leite das crianças) e o óleo como alegria espiritual. Calvino mantém a referência primeira à provisão diária de Deus para Davi e ao culto no santuário, onde Davi ansiava oferecer sacrifícios junto com os demais adoradores.',
    },
    'psalm-23:th:christ-shepherd': {
      title: 'O Pastor revelado em Jesus',
      summary:
        'Os cristãos leem o Salmo 23 à luz da afirmação de Jesus: “Eu sou o bom Pastor” (Jo 10:11). No Antigo Testamento, o pastor do Salmo 23 é o próprio SENHOR, e Ezequiel prometeu tanto que Deus apascentaria pessoalmente o seu rebanho quanto que levantaria sobre ele um só pastor, o seu servo Davi (Ez 34:15, 23). Jesus assume os dois fios: é o pastor que dá a vida pelas ovelhas, a quem Deus trouxe de volta dentre os mortos como o grande Pastor (Hb 13:20), e que aparecerá como o Pastor Principal (1Pe 5:4).',
      detail:
        'A maioria dos intérpretes hoje descreve isso como tipologia, e não como afirmação de que Davi tenha escrito conscientemente sobre Jesus, enquanto alguns leitores cristãos mais antigos (Agostinho, John Gill) entenderam que o SENHOR do salmo é o próprio Filho; de um modo ou de outro, o Novo Testamento apresenta Jesus como o cumprimento do padrão traçado pelo salmo e pelos profetas. Calvino afirma que Deus agora se mostrou nosso pastor na pessoa do seu Filho unigênito com muito mais clareza do que aos que viveram sob a Lei.',
    },
    'psalm-23:th:hope': {
      title: 'Por longos dias ou para sempre — esperança além desta vida?',
      summary:
        'O hebraico do versículo 6 diz literalmente “por extensão de dias” (como indicam as notas de rodapé da BSB e da KJV), expressão idiomática que pode significar uma vida longa (compare Sl 91:16) ou, como a respeito da casa de Deus no Salmo 93:5, por todos os dias vindouros; muitas traduções vertem “para sempre” (a BLIVRE traz “por muitos e muitos dias”). Dentro do Antigo Testamento, a linha expressa mais naturalmente a comunhão com Deus na sua casa durante toda a vida. Os leitores cristãos, guiados pela imagem neotestamentária do Cordeiro que apascenta o seu povo e o guia a fontes de águas vivas (Ap 7:17), também ouviram nela a esperança de morar com Deus além da morte — como fazem Matthew Henry e Spurgeon. O texto admite tanto um horizonte presente quanto um futuro.',
      detail:
        'A Septuaginta grega traz eis makrotēta hēmerōn, literalmente “por extensão de dias” (no inglês de Brenton: “for a very long time”). Matthew Henry apresenta as duas leituras: a resolução de Davi de permanecer perto de Deus enquanto viver e a perspectiva de uma felicidade perfeita na casa do Pai.',
    },
  },

  perspectives: {
    'psalm-23:ps:tsalmavet': {
      question: 'No versículo 4, é “o vale da sombra da morte” ou “o vale da escuridão profunda”?',
      intro:
        'A palavra hebraica ṣalmāwet pode ser entendida de duas maneiras, e as traduções se dividem. Alguns intérpretes combinam as duas: Franz Delitzsch, no comentário de Keil–Delitzsch, deriva a palavra de uma raiz que significa “fazer sombra, escurecer”, e não de um composto, mas sustenta que, tal como é pronunciada, ela significa a sombra da morte como epíteto da mais terrível escuridão. Trata-se de uma questão de filologia, não de doutrina, e o sentido do versículo não muda muito de um modo ou de outro.',
      commonGround:
        'As duas leituras retratam a escuridão mais ameaçadora que alguém pode atravessar — o próprio léxico registra os sentidos de sombra de morte, sombra profunda e escuridão profunda —, e ambas põem o peso do versículo nas palavras seguintes: “não temerei mal algum, porque tu estás comigo”.',
      perspectives: {
        'psalm-23:ps:tsalmavet:shadow': {
          tradition: 'Tradução tradicional',
          label: '“A sombra da morte”',
          summary:
            'As vogais massoréticas dividem a palavra em ṣal + māwet, “sombra da morte”, e é assim que a leem a Septuaginta grega (skia thanatou) e, depois dela, as tradições latina e inglesa (e também a portuguesa); Calvino relata a opinião de gramáticos judeus que a tomavam como um composto — sombra mortífera. O Novo Testamento usa a mesma expressão grega para as trevas que Cristo dissipa (Mt 4:16; Lc 1:79). Nessa leitura, o vale é explicitamente um lugar onde a morte ameaça.',
        },
        'psalm-23:ps:tsalmavet:darkness': {
          tradition: 'Tradução filológica',
          label: '“Escuridão profunda”',
          summary:
            'Muitos estudiosos modernos remontam a palavra a uma raiz que significa “ser escuro”, de modo que ela significaria escuridão espessa ou profunda. A leitura não é apenas moderna: Rashi, seguindo o gramático do século X Dunash ben Labrat, explica toda ocorrência de ṣalmāwet como escuridão. A nota de rodapé da BSB oferece “the valley of deep darkness” (o vale da escuridão profunda), e o interlinear do STEPBible glosa a palavra do mesmo modo. O seu uso para a escuridão sem caminhos do deserto (Jr 2:6) e para a escuridão de uma mina (Jó 28:3) sustenta um sentido amplo de escuridão aterradora.',
        },
      },
    },
    'psalm-23:ps:dwell-return': {
      question: 'No versículo 6, o salmista “habita” na casa do SENHOR ou “volta” para ela — e por quanto tempo?',
      intro:
        'As consoantes da palavra hebraica (wšbty) podem ser lidas de duas maneiras. As vogais massoréticas dão wəšabtî, de šûb, “e voltarei”; as antigas traduções grega e latina leem “minha habitação” e “para que eu habite”, como se viesse de yāšab, “habitar”. A expressão final é literalmente “por extensão de dias”. Trata-se de uma questão textual e interpretativa, não denominacional.',
      commonGround:
        'De um modo ou de outro, o salmo termina com o salmista na casa do SENHOR pela extensão dos seus dias, na presença do Deus que o perseguiu com bondade e ḥesed. Se “extensão de dias” significa uma vida inteira ou se estende além da morte é outra questão de interpretação.',
      perspectives: {
        'psalm-23:ps:dwell-return:dwell': {
          tradition: 'Versões antigas e a maioria das traduções',
          label: '“Habitarei”',
          summary:
            'A Septuaginta diz literalmente “e a minha habitação na casa do Senhor por extensão de dias” (Brenton: “and my dwelling shall be in the house of the Lord for a very long time”), e a Vulgata latina a acompanha (“ut inhabitem”, para que eu habite); a maioria das versões, incluindo a KJV, a BSB e a WEB — e, em português, a BLIVRE —, lê “habitarei”. O Salmo 27:4, muito próximo, usa o infinitivo de yāšab — “que eu possa morar na casa do SENHOR todos os dias de minha vida” — com a mesma expressão “todos os dias de minha vida”. Nessa leitura, o salmo termina numa residência estável junto de Deus.',
        },
        'psalm-23:ps:dwell-return:return': {
          tradition: 'Texto hebraico massorético',
          label: '“Voltarei”',
          summary:
            'O hebraico, tal como vocalizado, diz “e voltarei”, o mesmo verbo de “Ele restaura” no versículo 3, e o texto etiquetado do STEPBible o glosa assim. Franz Delitzsch, no comentário de Keil–Delitzsch, defende a leitura como uma construção pregnante (constructio praegnans): tendo voltado, o salmista habitará de novo na casa do SENHOR — um regresso ao lar, e não uma primeira chegada. Nessa leitura, o salmo é emoldurado por dois retornos: o Pastor me traz de volta, e eu volto para casa.',
        },
      },
    },
    'psalm-23:ps:readings': {
      question: 'Quem é o Pastor, e até que ponto o salmo deve ser lido à luz de Cristo e dos sacramentos?',
      intro:
        'Leitores judeus e cristãos amam este salmo há milênios e o leem de maneiras diferentes, às vezes sobrepostas. Também dentro do cristianismo há uma antiga diferença de método entre leituras que passam rapidamente a Cristo e aos sacramentos e leituras que começam pela situação do próprio Davi.',
      commonGround:
        'Todas essas leituras concordam que o Pastor é o SENHOR, o Deus de Israel, que o salmo expressa confiança no seu cuidado pessoal em meio ao perigo e que o seu alvo é a vida na presença de Deus. Os cristãos acrescentam que esse mesmo Deus se aproximou como o Bom Pastor em Jesus (Jo 10:11).',
      perspectives: {
        'psalm-23:ps:readings:jewish': {
          tradition: 'Tradição interpretativa judaica',
          label: 'O SENHOR que pastoreia Israel',
          summary:
            'A tradição judaica entende o Pastor como o SENHOR, o Deus de Israel, e muitas vezes ouve o salmo à luz da história de Israel. Segundo o relato de John Gill, o Targum parafraseia o versículo 1 como Deus alimentando Israel no deserto, lê o vale escuro como o cativeiro e entende a casa do versículo 6 como o santuário, enquanto Rashi e David Kimchi ligavam o vale à fuga de Davi diante de Saul, no deserto de Zife. O salmo tem um lugar precioso na oração do sábado, como confissão de que Deus provê.',
        },
        'psalm-23:ps:readings:patristic': {
          tradition: 'Igreja antiga (leitura cristológica e sacramental)',
          label: 'Cristo, o Pastor que alimenta a sua Igreja',
          summary:
            'Agostinho ouve o salmo como a voz da Igreja falando a Cristo: lê o primeiro versículo da sua versão latina (o Senhor me apascenta) como Cristo pastoreando o seu povo, a água de refrigério como o batismo e o vale como esta vida mortal. As catequeses mistagógicas atribuídas a Cirilo de Jerusalém, ensinando os recém-batizados, aplicam a mesa à Mesa mística da Eucaristia e o óleo à unção que os sela. Nessa leitura, o salmo se torna um cântico da iniciação cristã.',
        },
        'psalm-23:ps:readings:reformation': {
          tradition: 'Exegese da Reforma e protestante posterior',
          label: 'A confissão da providência por Davi, cumprida em Cristo',
          summary:
            'Calvino lê o salmo primeiro como Davi — um rei rico — confessando-se uma pobre ovelha sob a providência de Deus, e resiste à alegoria: recusa-se, por exemplo, a ler os “caminhos da justiça” como a direção do Espírito, porque a metáfora do pastor ainda está em curso. Mas acrescenta que Deus se mostrou nosso pastor com muito mais clareza no seu Filho. Os comentaristas protestantes posteriores variam: Matthew Henry e Spurgeon aplicam o salmo calorosamente a Cristo e ao seu povo, ao passo que John Gill vai além e entende que “o SENHOR”, aqui, é o próprio Filho.',
        },
      },
    },
  },

  commentary: {
    'psalm-23:cm:augustine': {
      lead: 'Sobre o vale da sombra da morte (o seu Salmo 22, segundo a numeração latina)',
      quoteTranslation:
        'Ainda que eu ande no meio desta vida, que é a sombra da morte. Não temerei mal algum, porque tu estás comigo. Não temerei mal algum, porque habitas no meu coração pela fé; e estás agora comigo, para que, depois da sombra da morte, também eu esteja contigo.',
    },
    'psalm-23:cm:cyril': {
      lead: 'Ensinando os recém-batizados sobre a mesa do versículo 5 (das catequeses mistagógicas tradicionalmente atribuídas a Cirilo)',
      quoteTranslation:
        'Quando o homem diz a Deus: Preparaste diante de mim uma mesa, que outra coisa indica senão aquela Mesa mística e espiritual que Deus preparou para nós em frente, isto é, contra e em oposição aos espíritos malignos?',
    },
    'psalm-23:cm:rashi': {
      lead: 'Uma leitura judaica medieval do versículo 4 (resumida a partir do hebraico)',
      text: 'Rashi entende “o vale de ṣalmāwet” como uma terra de escuridão e diz que Davi o disse a respeito do deserto de Zife; seguindo o gramático Dunash ben Labrat, explica toda ocorrência de ṣalmāwet como escuridão. Ele lê “tua vara e teu cajado” como os sofrimentos que haviam sobrevindo a Davi e o apoio da sua confiança no ḥesed de Deus: ambos o consolam, porque os sofrimentos servem para o perdão do pecado, e ele confia que Deus porá uma mesa diante dele — que Rashi identifica com a realeza.',
    },
    'psalm-23:cm:calvin': {
      lead: 'Por que Deus se chama de pastor',
      quoteTranslation:
        'Deus, na Escritura, frequentemente toma para si o nome e assume o caráter de pastor, e este não é um sinal pequeno do seu terno amor por nós. Como esta é uma maneira humilde e familiar de falar, aquele que não desdenha rebaixar-se tanto por nossa causa deve ter por nós uma afeição singularmente forte.',
    },
    'psalm-23:cm:henry': {
      lead: 'Sobre “a sombra da morte” (v. 4)',
      quoteTranslation:
        'É apenas a sombra da morte; não há nela nenhum mal substancial; a sombra de uma serpente não pica, nem a sombra de uma espada mata.',
    },
    'psalm-23:cm:gill': {
      lead: 'Uma leitura cristológica, com notas sobre a interpretação judaica',
      text: 'Gill entende “o SENHOR” do versículo 1 como Cristo, o Filho, a quem, segundo ele, as Escrituras dão com mais frequência o título de pastor, e por isso ouve o salmo como a voz das ovelhas de Cristo. Ao longo do caminho, registra leituras judaicas: o Targum entende o versículo 1 como Deus alimentando Israel no deserto e a casa do versículo 6 como o santuário, e os comentaristas medievais Rashi (a quem ele chama de Jarchi) e Kimchi relacionavam o vale escuro com a fuga de Davi diante de Saul, no deserto de Zife.',
    },
    'psalm-23:cm:spurgeon': {
      lead: 'Sobre a pequena palavra “meu” (v. 1)',
      quoteTranslation:
        'A palavra mais doce de todas é aquele monossílabo, “meu”. Ele não diz: “O Senhor é o pastor do mundo inteiro e conduz a multidão como o seu rebanho”, mas: “O Senhor é o meu pastor”; ainda que ele não seja Pastor de mais ninguém, é Pastor para mim; ele cuida de mim, vela por mim e me preserva.',
    },
    'psalm-23:cm:delitzsch': {
      lead: 'Do pastor ao anfitrião (vv. 4–5) — do volume de Franz Delitzsch sobre os Salmos',
      quoteTranslation:
        'Depois que a figura do pastor se esvai no v. 4, aparece a do anfitrião. Os seus inimigos têm de olhar calados … sem poder fazer nada, e ver como Jahve provê fartamente para o Seu hóspede, o unge com perfumes suaves como num banquete alegre e magnífico … e enche o seu cálice até transbordar.',
    },
    'psalm-23:cm:maclaren': {
      lead: 'Sobre os caminhos da justiça (v. 3): o descanso é dado para a estrada',
      quoteTranslation:
        'A vida não é um aprisco para as ovelhas se deitarem, mas uma estrada para elas caminharem. … O descanso existe para preparar para o trabalho; o trabalho, para adoçar o descanso.',
    },
    'psalm-23:cm:meyer': {
      lead: 'O Salmo 23 entre os Salmos 22 e 24',
      quoteTranslation:
        'Este salmo às vezes foi chamado de Salmo do Cajado. Ele está entre o Salmo da Cruz e o Salmo da Coroa. Se o Vigésimo Segundo fala do Bom Pastor, que morreu, e se o Vigésimo Quarto fala do Pastor Principal, que há de voltar, o Vigésimo Terceiro fala do Grande Pastor, que guarda o Seu rebanho com sagacidade infalível e devoção incansável.',
    },
    'psalm-23:cm:phillip-keller': {
      lead: 'A leitura de um criador de ovelhas moderno (ilustrativa, não evidência antiga)',
      text: 'W. Phillip Keller, que trabalhou por anos na administração de fazendas e ele mesmo criou ovelhas, lê o Salmo 23 frase por frase à luz das realidades práticas da criação de ovelhas — o que é preciso para que as ovelhas descansem, o desamparo de uma ovelha caída de costas sem conseguir se levantar, a mudança do rebanho para as pastagens altas de verão, o tratamento das ovelhas com óleo contra moscas e parasitas — e aplica cada uma delas ao cuidado de Cristo pelo seu povo. (Não deve ser confundido com Timothy Keller.)',
    },
    'psalm-23:cm:bailey': {
      lead: 'A imagem do pastor, de Davi aos apóstolos',
      text: 'Bailey acompanha o tema do bom pastor em nove passagens — Salmo 23, Jeremias 23, Ezequiel 34, Zacarias 10, Marcos 6, Lucas 15, Mateus 18, João 10 e 1 Pedro 5 —, tratando o Salmo 23 como ponto de partida de uma longa tradição bíblica em que profetas, Jesus e os apóstolos retomam a imagem de Davi e a adaptam a novas circunstâncias. Ele analisa como cada passagem é composta e as lê à luz dos costumes pastoris do Oriente Médio e de comentaristas antigos da região.',
    },
    'psalm-23:cm:ferguson': {
      lead: '“Nada me faltará” como a confiança de uma longa experiência',
      text: 'Ferguson argumenta que o Salmo 23 não foi escrito pelo pastorzinho idealizado dos livros infantis, mas por um crente provado ao longo de muita experiência — alguém que conhecera o vale escuro, o mal e os inimigos —, e que Davi aprendeu com Jacó a chamar Deus de seu pastor (Gn 48:15–16). Ele remonta o verbo para “faltar” à provisão de Israel no deserto (Êx 16:18; Dt 2:7; 8:9) e conclui que Jesus, o bom pastor que dá a vida pelas ovelhas (Jo 10:11; Zc 13:7), garante que ao seu povo não faltará aquilo de que realmente precisa (Rm 8:32).',
    },
  },

  sermons: {
    'psalm-23:sm:spurgeon-1595': {
      summary:
        'Spurgeon admite que pretendia guardar este versículo para o seu leito de morte, mas precisou do seu consolo numa provação presente, e insiste em que ele é tanto para os vivos quanto para os que estão morrendo. Sob três tópicos — o desfiladeiro e os seus terrores, o peregrino e o seu progresso, e a alma e o seu Pastor —, ele retrata o vale como um estreito desfiladeiro nas montanhas e argumenta que passar pela tristeza não é, em si, sinal de pecado, pois o próprio Cristo esteve triste até a morte.',
    },
    'psalm-23:sm:spurgeon-3006': {
      summary:
        'Spurgeon desenvolve o que a metáfora garante, exige e pergunta. Os seus privilégios são orientação (o pastor oriental vai à frente do rebanho), provisão para as necessidades do corpo e do espírito e proteção; o seu primeiro dever é a confiança da ovelha no seu pastor; e ela suscita perguntas penetrantes sobre se o ouvinte traz as marcas das ovelhas de Cristo. Ele sugere que o salmo provavelmente foi escrito quando Davi já era rei e ainda não se envergonhava dos seus anos de pastor.',
    },
    'psalm-23:sm:spurgeon-3060': {
      summary:
        'Sobre “O SENHOR é meu pastor, nada me faltará”, Spurgeon avança em três passos: a confissão necessária antes que alguém possa dizê-lo (somos ovelhas tolas e dependentes), a certeza que cresce a partir do modo como Deus nos tratou no passado (trazendo-nos de volta dos nossos desvios e suprindo as nossas necessidades) e a santa confiança de “nada me faltará”, que ele aplica às necessidades reais, e não a desejos imaginários.',
    },
    'psalm-23:sm:maclaren-shepherd-king': {
      summary:
        'Maclaren ouve o salmo como o rei idoso relembrando os seus anos de pastor. Divide-o em duas metades — Deus como Pastor (vv. 1–4), que conduz o seu rebanho pelo descanso, pelo trabalho e pela tristeza, e Deus como Anfitrião (vv. 5–6), cuja hospitalidade termina na casa do Pai — e sublinha que o descanso dos pastos verdes é dado para nos fortalecer para os caminhos da justiça, e que a mão que conduz ao vale escuro conduz através dele e para fora dele.',
    },
  },

  verseNotes: {
    'PSA.23.1': [
      'O salmo começa com o nome pactual de Deus, YHWH (impresso SENHOR), e com um particípio hebraico, rōʿî — “aquele que me pastoreia”. No antigo Oriente Próximo, “pastor” era um título de reis, de modo que Davi, um pastor que se tornou rei, confessa que o SENHOR é o seu verdadeiro rei e aquele que cuida dele. Jacó usou a mesma palavra a respeito de Deus no fim da vida, falando do Deus que fora o seu pastor por toda a vida (Gn 48:15).',
      '“Nada me faltará” usa o verbo ḥāsēr, “faltar, carecer”. É a palavra que Moisés usou para os anos no deserto — “nenhuma coisa te faltou” (Dt 2:7) —, de modo que a linha pode ser ouvida como a aplicação da experiência de Israel no deserto à vida de uma só pessoa, ligação que tanto as notas da Tyndale quanto Sinclair Ferguson estabelecem. Comentaristas, de Calvino a Spurgeon, observam que ela promete aquilo de que o Pastor sabe que precisamos, não tudo o que poderíamos desejar.',
    ],
    'PSA.23.2': [
      '“Pastos verdes” são literalmente “pastos de relva nova” (margem da KJV: “pastures of tender grass”), e “águas quietas” são “águas de repouso” — menûḥôt, palavra para lugar de descanso (margem da KJV: “waters of quietness”). O verbo “leva” (nāhal) é uma palavra rara (10 ocorrências) para conduzir com cuidado — à água, ao descanso ou ao refrigério; é usado para um rebanho (Gn 33:14; Is 40:11, onde Deus guia mansamente as ovelhas que amamentam) e para pessoas (Êx 15:13; Is 49:10). Franz Delitzsch, no comentário de Keil–Delitzsch, chama-o de palavra pastoril para uma condução suave, o que combina com este versículo. O pastor faz o rebanho deitar-se e o conduz à água: descanso e refrigério juntos.',
    ],
    'PSA.23.3': [
      '“Ele restaura minha alma” poderia ser traduzido “ele traz de volta a minha vida”: o verbo é šûb, “voltar”, e nefesh é o eu vivo por inteiro. Os “caminhos da justiça” são literalmente “trilhas de retidão” — caminhos retos, direitos, que levam aonde devem levar. O Pastor conduz por eles “por seu nome”, para honrar o seu próprio caráter, e não por causa do mérito das ovelhas.',
    ],
    'PSA.23.4': [
      'O “vale” (gêʾ) é uma ravina íngreme ou um desfiladeiro estreito, e ṣalmāwet significa “sombra da morte” ou “escuridão profunda” (nota de rodapé da BSB) — um lugar onde o perigo está próximo. O salmo não promete que a ovelha evitará esses vales, mas que os atravessará acompanhada: “não temerei mal algum, porque tu estás comigo”. Aqui, no centro do salmo (segundo uma contagem das suas palavras hebraicas), Davi deixa de falar sobre Deus e começa a falar com ele.',
      'A vara do pastor (šēbeṭ) era uma clava para defender o rebanho e um instrumento para guiá-lo e contá-lo; o cajado (mišʿenet) era algo em que se apoiar. As notas da Tyndale observam que os pastores usavam os dois para afastar o perigo. Eles consolam porque mostram que o Pastor está presente e armado — e šēbeṭ pode também significar o cetro de um rei.',
    ],
    'PSA.23.5': [
      'A imagem passa de pastor a anfitrião. A mesa é posta à vista de inimigos que podem observar, mas não interferir; a cabeça do convidado é ungida com azeite, sinal de honra (compare Lc 7:46), com um verbo que significa literalmente “tornas gordo” — azeite em abundância (margem da KJV). O cálice “transborda”: rəwāyâ significa saturação e só aparece mais uma vez, no Salmo 66:12, onde Deus leva o seu povo à abundância (a BLIVRE traz ali “um lugar confortável”).',
    ],
    'PSA.23.6': [
      '“Certamente” também pode ser lido “somente” — Spurgeon registra essa leitura: somente a bondade e a misericórdia. O verbo traduzido “seguirão” é rādap̄, “perseguir”, normalmente usado para inimigos no encalço de alguém. Franz Delitzsch, no comentário de Keil–Delitzsch, ressalta a inversão: os inimigos do salmista o perseguem, mas agora somente a bondade de Deus e o seu ḥesed — o seu amor leal da aliança — o perseguirão, todos os dias da sua vida.',
      'A última linha encerra duas questões textuais. O hebraico, tal como vocalizado, diz “e voltarei” (šûb), enquanto a Septuaginta grega e a maioria das traduções leem “habitarei” — compare o Salmo 27:4. E “para sempre” é literalmente “por extensão de dias” (notas de rodapé da BSB e da KJV; a BLIVRE traduz “por muitos e muitos dias”) — expressão idiomática que pode significar uma vida longa ou, como a respeito da casa de Deus no Salmo 93:5, todos os dias vindouros; os leitores cristãos também ouviram nela a esperança de morar com Deus além da morte.',
    ],
  },

  concepts: {
    'psalm-23:c:shepherd': {
      label: 'O SENHOR como pastor',
      aliases: [
        'pastor',
        'pastores',
        'meu pastor',
        'o senhor é meu pastor',
        'pastorear',
        'pastoreio',
        'apascentar',
        'rei pastor',
        'pastor-rei',
        'reis como pastores',
        'hamurábi',
        'rebanho',
        'ovelha',
        'ovelhas',
        'o que significa pastor',
      ],
      answer:
        'Rōʿî, “meu pastor”, é um particípio do verbo rāʿâ, “apascentar, cuidar” — o SENHOR é aquele que pastoreia Davi ativamente. Em todo o antigo Oriente Próximo, os reis se chamavam de pastores (Hamurábi se apresenta como pastor portador de salvação), de modo que o título une autoridade régia e cuidado. As Escrituras o usam para Deus desde Jacó (Gn 48:15) até os profetas (Ez 34:15), e Jesus o reivindica em João 10:11.',
    },
    'psalm-23:c:divine-name': {
      label: 'O SENHOR (YHWH)',
      aliases: [
        'o senhor',
        'senhor em maiúsculas',
        'maiúsculas',
        'letras maiúsculas',
        'versaletes',
        'javé',
        'jeová',
        'nome de deus',
        'nome divino',
        'tetragrama',
        'o que significa senhor em maiúsculas',
      ],
      answer:
        'Onde as Bíblias em português imprimem SENHOR em maiúsculas (e as inglesas, LORD em versaletes), o hebraico traz o nome pessoal de Deus, YHWH, revelado a Moisés (Êx 3:14–15). Por reverência, os leitores judeus dizem ’Adonai (“Senhor”) em seu lugar, e o nome era escrito com as vogais dessa palavra — a origem da forma mais antiga “Jeová”; “Yahweh” (ou “Javé”) é a reconstrução acadêmica habitual. No Salmo 23, o nome aparece apenas duas vezes, como a primeira palavra depois do título e na última linha, emoldurando o salmo inteiro.',
    },
    'psalm-23:c:want': {
      label: 'Nada me faltará',
      aliases: [
        'nada me faltará',
        'nada me falta',
        'faltar',
        'faltará',
        'falta',
        'carecer',
        'necessidade',
        'necessidades',
        'nenhuma coisa te faltou',
        'provisão',
        'prover',
        'contentamento',
        'o que significa nada me faltará',
      ],
      answer:
        'O verbo é ḥāsēr, “faltar, carecer”. É a palavra que Moisés usou para os quarenta anos de Israel no deserto — “nenhuma coisa te faltou” (Dt 2:7; compare Ne 9:21) —, de modo que a linha pode ser ouvida como a aplicação da experiência de Israel no deserto à vida de uma só pessoa, ligação que tanto as notas da Tyndale quanto Sinclair Ferguson estabelecem. A promessa é suficiência, não luxo: Spurgeon a aplica às necessidades reais, e não a desejos imaginários, e o Salmo 34:10 fala dos que “não têm falta de bem algum”.',
    },
    'psalm-23:c:rest': {
      label: 'Pastos verdes e águas tranquilas',
      aliases: [
        'pastos verdes',
        'pastos verdejantes',
        'pastos',
        'pasto',
        'pastagens',
        'águas quietas',
        'águas tranquilas',
        'águas de descanso',
        'águas',
        'água',
        'deitar',
        'me faz deitar',
        'descanso',
        'repouso',
        'me leva',
        'me conduz',
        'grama',
        'relva',
      ],
      answer:
        '“Pastos verdes” são literalmente “pastos de relva nova”, e “águas quietas” são “águas de repouso” — menûḥâ significa lugar de descanso. O verbo “leva” (nāhal) é uma palavra rara para conduzir com cuidado à água, ao descanso ou ao refrigério; Isaías o usa para Deus guiando mansamente as ovelhas que amamentam (Is 40:11), e ele reaparece na promessa de que Deus conduzirá o seu povo a mananciais de águas (Is 49:10), promessa que o Apocalipse ecoa a respeito do Cordeiro (Ap 7:17). Como observa Maclaren, esse descanso é dado para fortalecer o rebanho para a estrada adiante.',
    },
    'psalm-23:c:restore': {
      label: 'Ele restaura minha alma; os caminhos da justiça',
      aliases: [
        'restaura',
        'restaurar',
        'restaura minha alma',
        'refrigera a minha alma',
        'refrigera-me a alma',
        'alma',
        'minha alma',
        'trazer de volta',
        'arrepender',
        'arrependimento',
        'caminhos da justiça',
        'veredas da justiça',
        'caminhos retos',
        'justiça',
        'por seu nome',
        'por amor do seu nome',
        'me guia',
      ],
      answer:
        '“Ele restaura minha alma” é literalmente “ele traz de volta a minha nefesh” — a minha vida, o meu eu inteiro. O verbo šûb, “voltar”, pode descrever tanto reanimar uma vida desfalecida quanto trazer de volta uma ovelha desgarrada, e em outros lugares significa arrependimento. Os “caminhos da justiça” são trilhas retas e direitas, e o Pastor conduz por elas “por seu nome” — por causa de quem ele é, e não do mérito das ovelhas.',
    },
    'psalm-23:c:valley': {
      label: 'O vale da sombra da morte — “tu estás comigo”',
      aliases: [
        'vale',
        'vale da sombra da morte',
        'sombra da morte',
        'sombra',
        'vale escuro',
        'vale mais escuro',
        'escuridão profunda',
        'escuridão',
        'trevas',
        'morte',
        'morrer',
        'não temerei mal algum',
        'não temerei mal nenhum',
        'medo',
        'temor',
        'tu estás comigo',
        'comigo',
        'presença',
        'centro do salmo',
      ],
      answer:
        'O hebraico é gêʾ ṣalmāwet — uma ravina íngreme de “sombra de morte” ou de “escuridão profunda” (nota de rodapé da BSB). A tradução tradicional segue as vogais massoréticas e a Septuaginta grega (skia thanatou); muitos estudiosos modernos derivam a palavra de uma raiz que significa “ser escuro”. Seja como for, é a escuridão mais ameaçadora, e o ponto do salmo é que a ovelha a atravessa com o Pastor: “não temerei mal algum, porque tu estás comigo” — palavras que, segundo uma contagem comum das palavras hebraicas, estão no centro do salmo.',
    },
    'psalm-23:c:rod-staff': {
      label: 'A tua vara e o teu cajado',
      aliases: ['vara', 'cajado', 'vara e cajado', 'tua vara e teu cajado', 'bastão', 'bordão', 'consolo', 'me consolam', 'cetro'],
      answer:
        'A vara do pastor (šēbeṭ) era uma clava para afastar predadores e um instrumento para guiar e contar o rebanho; o cajado (mišʿenet) era um apoio em que se escorar. As notas da Tyndale observam que os pastores usavam os dois para afastar o perigo. Como šēbeṭ também pode significar o cetro de um governante, a imagem une autoridade régia e cuidado, e a ovelha se consola ao ver o seu Pastor armado e por perto.',
    },
    'psalm-23:c:table': {
      label: 'Uma mesa, azeite e um cálice que transborda',
      aliases: [
        'mesa',
        'preparas uma mesa',
        'preparar uma mesa',
        'inimigos',
        'adversários',
        'na presença dos meus inimigos',
        'ungir',
        'unges',
        'ungir a cabeça',
        'unção',
        'azeite',
        'óleo',
        'cálice',
        'meu cálice',
        'transborda',
        'anfitrião',
        'banquete',
        'festa',
        'hospitalidade',
        'ceia do senhor',
        'santa ceia',
        'eucaristia',
      ],
      answer:
        'No versículo 5, o Pastor se torna anfitrião. Ele põe a mesa à vista de inimigos que podem observar, mas não interferir, honra o seu convidado ungindo-lhe a cabeça com azeite — o verbo significa literalmente “tornas gordo”, isto é, azeite em abundância (compare Lc 7:46) — e enche o cálice até a saturação. Na igreja antiga, as catequeses mistagógicas atribuídas a Cirilo de Jerusalém ouvem nisso a Mesa do Senhor e a unção dos recém-batizados.',
    },
    'psalm-23:c:goodness-mercy': {
      label: 'A bondade e o ḥesed me perseguirão',
      aliases: [
        'bondade',
        'misericórdia',
        'bondade e misericórdia',
        'o bem e a bondade',
        'benignidade',
        'amor leal',
        'amor constante',
        'amor da aliança',
        'bondade amorosa',
        'seguir',
        'me seguirão',
        'perseguir',
        'certamente',
      ],
      answer:
        'Ḥesed é o amor leal da aliança do SENHOR — glosado como lealdade pactual (“covenant loyalty”) no interlinear do STEPBible e vertido “bondade” (BLIVRE), “misericórdia” (NBV; em inglês, “mercy” na BSB e na KJV) ou “bondade amorosa” (BPM; em inglês, “loving kindness” na WEB). O verbo “seguir” é rādap̄, “perseguir”, normalmente usado para inimigos que caçam alguém; aqui, os perseguidores são a bondade e o ḥesed de Deus, todos os dias da vida do salmista.',
    },
    'psalm-23:c:house-forever': {
      label: 'Habitar na casa do SENHOR para sempre',
      aliases: [
        'casa do senhor',
        'casa',
        'habitar',
        'habitarei',
        'morar',
        'morada',
        'para sempre',
        'por longos dias',
        'por muitos e muitos dias',
        'extensão de dias',
        'céu',
        'templo',
        'santuário',
        'voltar',
        'voltarei',
        'eternidade',
        'vida eterna',
        'vida após a morte',
        'lar',
      ],
      answer:
        'A última linha levanta duas questões. O hebraico, tal como vocalizado, diz “e voltarei” (de šûb), enquanto a Septuaginta e a maioria das traduções leem “habitarei” — compare o Salmo 27:4: “que eu possa morar na casa do SENHOR todos os dias de minha vida”. E “para sempre” é literalmente “por extensão de dias” (a BLIVRE traz “por muitos e muitos dias”) — expressão idiomática que pode significar uma vida longa ou, como a respeito da casa de Deus no Salmo 93:5, todos os dias vindouros; leitores cristãos como Matthew Henry e Spurgeon também ouviram nela a esperança do céu.',
    },
    'psalm-23:c:good-shepherd': {
      label: 'Jesus, o Bom Pastor',
      aliases: [
        'bom pastor',
        'o bom pastor',
        'jesus',
        'cristo',
        'joão 10',
        'grande pastor',
        'supremo pastor',
        'pastor principal',
        'cordeiro',
        'messias',
        'cumprimento',
        'tipologia',
        'novo testamento',
      ],
      answer:
        'No Salmo 23, o pastor é o próprio SENHOR, e Ezequiel prometeu que Deus apascentaria pessoalmente o seu rebanho e levantaria sobre ele “um pastor… a meu servo Davi” (Ez 34:15, 23). O Novo Testamento apresenta Jesus como o cumprimento das duas promessas: o bom Pastor que dá a vida (Jo 10:11), o grande Pastor trazido de volta dentre os mortos (Hb 13:20), o Pastor Principal que aparecerá (1Pe 5:4) e o Cordeiro que apascentará o seu povo e o guiará a fontes de águas vivas (Ap 7:17).',
    },
    'psalm-23:c:david': {
      label: 'Davi e o título “Salmo de Davi”',
      aliases: [
        'davi',
        'salmo de davi',
        'autor',
        'autoria',
        'quem escreveu',
        'quem escreveu o salmo 23',
        'título',
        'título do salmo',
        'sobrescrito',
        'inscrição',
        'absalão',
        'quando foi escrito',
      ],
      answer:
        'O título mizmôr lədāwid costuma ser lido “Salmo de Davi”, embora a preposição hebraica também possa significar “para” ou “a respeito de” Davi, e por isso a introdução da Tyndale recomenda cautela em tratar todo título desse tipo como indicação de autoria. Os que o leem como obra do próprio Davi o situam de modos diferentes: Calvino o lê como palavras de Davi no auge da sua prosperidade como rei, Spurgeon e Maclaren imaginam o rei relembrando os seus anos de pastor, e Franz Delitzsch (no comentário de Keil–Delitzsch) o relaciona com a fuga diante de Absalão (2Sm 17:27–29). O próprio salmo não menciona nenhuma ocasião.',
    },
  },
};

export default overlay;
