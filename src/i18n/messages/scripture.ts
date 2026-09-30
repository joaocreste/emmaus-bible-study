import { defineMessages } from '../translate';

/**
 * 'scripture' namespace — the Scripture section: reader and interlinear views, verse menu,
 * chapter stepper, loading/error states and attribution (see docs/I18N.md).
 * `ask.*` are questions sent to the conversation on the reader's behalf.
 * French strings use a no-break space before “:”, “;”, “?” and “!”.
 */
export const messages = defineMessages({
  en: {
    'view.label': 'Scripture view',
    'view.reader': 'Reader',
    'view.interlinear': 'Interlinear',
    'description.noKeyWords': 'The passage in your chosen translation — switch to Interlinear to see the original words beneath it.',
    'version.label': '{name} — {license}',

    'menu.explain': 'Explain this verse',
    'menu.xrefs': 'Show cross-references for this verse',
    'menu.copy': 'Copy verse',
    'ask.explainVerse': 'Explain verse {verse}',
    'reason.xrefs': 'Cross-references for {ref}',
    'copy.done': 'Copied {ref} ({version})',
    'copy.failed': 'Copying is blocked in this browser — select the text instead.',

    'keyWord.hint': 'Key word — opens its original-language study',
    'verse.hint': 'Opens a menu for this verse. Arrow keys move between verse numbers.',
    'verse.options': 'Verse {verse} — options',
    'note.label': '{count, plural, one {Translation note for verse {verse}} other {Translation notes for verse {verse}}}',
    'highlighted.prefix': 'Highlighted from your question:',
    'highlighted.suffix': '(highlighted from your question)',

    'glossKey.glosses': 'Word glosses ({inEnglish})',
    'glossKey.implied.sample': 'grey',
    'glossKey.implied.text': 'in the original, usually left untranslated',
    'glossKey.added.text': 'supplied in English for sense',
    'glossKey.join.sample': 'a middle dot',
    'glossKey.join.text': 'joins the parts of one Hebrew word',
    'glossKey.stress.sample': 'under',
    'glossKey.stress.rest': 'lined syllable: stressed',

    'interlinear.words': '{language, select, greek {Greek words} hebrew {Hebrew words} other {Aramaic words}}',
    'interlinear.noOriginal': 'No tagged original text for this verse.',
    'interlinear.strong': 'Strong’s',
    'interlinear.wordHint': 'Arrow keys move between words.',
    'interlinear.error': 'The tagged original-language text could not be loaded for this passage. The English text is shown on its own.',

    'error.title': 'This passage could not be loaded in the {version} text.',
    'error.detail':
      'Try again, or choose another translation from the top bar. Nothing is shown in its place — Emmaus never substitutes Scripture text.',
    'loading': 'Loading {ref}',
    'loading.passage': 'Loading passage',

    'legend.sample': 'word',
    'legend.reader': 'Underlined words are key words — select one for its original-language study.',
    'legend.interlinear':
      '{anchored, select, yes {Select any original word for its lexicon entry (underlined ones open their key-word study).} other {Select any original word for its lexicon entry.}}',
    'legend.rtl': 'Hebrew reads from right to left.',
    'attribution.text': 'Text',
    'attribution.original': 'Original',

    'chapter.navigation': 'Chapter navigation',
    'chapter.label': 'Chapter',
    'chapter.previous': 'Previous chapter',
    'chapter.previousTo': 'Previous chapter ({chapter})',
    'chapter.next': 'Next chapter',
    'chapter.nextTo': 'Next chapter ({chapter})',
  },
  pt: {
    'view.label': 'Exibição da Escritura',
    'view.reader': 'Leitura',
    'view.interlinear': 'Interlinear',
    'description.noKeyWords': 'O texto na tradução escolhida — mude para Interlinear para ver as palavras originais logo abaixo.',
    'version.label': '{name} — {license}',

    'menu.explain': 'Explicar este versículo',
    'menu.xrefs': 'Ver referências cruzadas deste versículo',
    'menu.copy': 'Copiar versículo',
    'ask.explainVerse': 'Explique o versículo {verse}',
    'reason.xrefs': 'Referências cruzadas de {ref}',
    'copy.done': '{ref} copiado ({version})',
    'copy.failed': 'Este navegador bloqueia a cópia — selecione o texto manualmente.',

    'keyWord.hint': 'Palavra-chave — abre o estudo na língua original',
    'verse.hint': 'Abre um menu para este versículo. As setas passam de um número de versículo a outro.',
    'verse.options': 'Versículo {verse} — opções',
    'note.label': '{count, plural, one {Nota de tradução do versículo {verse}} other {Notas de tradução do versículo {verse}}}',
    'highlighted.prefix': 'Destacado a partir da sua pergunta:',
    'highlighted.suffix': '(destacado a partir da sua pergunta)',

    'glossKey.glosses': 'Glosas das palavras ({inEnglish})',
    'glossKey.implied.sample': 'cinza',
    'glossKey.implied.text': 'no original, geralmente não traduzido',
    'glossKey.added.text': 'acrescentado em inglês para dar sentido',
    'glossKey.join.sample': 'um ponto médio',
    'glossKey.join.text': 'une as partes de uma mesma palavra hebraica',
    'glossKey.stress.sample': 'sí',
    'glossKey.stress.rest': 'laba sublinhada: tônica',

    'interlinear.words': '{language, select, greek {Palavras gregas} hebrew {Palavras hebraicas} other {Palavras aramaicas}}',
    'interlinear.noOriginal': 'Não há texto original etiquetado para este versículo.',
    'interlinear.strong': 'Strong',
    'interlinear.wordHint': 'As setas passam de uma palavra a outra.',
    'interlinear.error': 'Não foi possível carregar o texto original etiquetado desta passagem. O texto da tradução é exibido sozinho.',

    'error.title': 'Não foi possível carregar esta passagem no texto {version}.',
    'error.detail':
      'Tente de novo ou escolha outra tradução na barra superior. Nada é exibido no lugar — o Emmaus nunca substitui o texto da Escritura.',
    'loading': 'Carregando {ref}',
    'loading.passage': 'Carregando a passagem',

    'legend.sample': 'palavra',
    'legend.reader': 'As palavras sublinhadas são palavras-chave — selecione uma para ver o estudo na língua original.',
    'legend.interlinear':
      '{anchored, select, yes {Selecione qualquer palavra original para ver o verbete do léxico (as sublinhadas abrem o estudo da palavra-chave).} other {Selecione qualquer palavra original para ver o verbete do léxico.}}',
    'legend.rtl': 'O hebraico se lê da direita para a esquerda.',
    'attribution.text': 'Texto',
    'attribution.original': 'Original',

    'chapter.navigation': 'Navegação por capítulos',
    'chapter.label': 'Capítulo',
    'chapter.previous': 'Capítulo anterior',
    'chapter.previousTo': 'Capítulo anterior ({chapter})',
    'chapter.next': 'Próximo capítulo',
    'chapter.nextTo': 'Próximo capítulo ({chapter})',
  },
  fr: {
    'view.label': 'Affichage de l’Écriture',
    'view.reader': 'Lecture',
    'view.interlinear': 'Interlinéaire',
    'description.noKeyWords': 'Le passage dans la traduction choisie — passez en mode Interlinéaire pour voir les mots originaux en dessous.',
    'version.label': '{name} — {license}',

    'menu.explain': 'Expliquer ce verset',
    'menu.xrefs': 'Voir les références croisées de ce verset',
    'menu.copy': 'Copier le verset',
    'ask.explainVerse': 'Expliquez le verset {verse}',
    'reason.xrefs': 'Références croisées pour {ref}',
    'copy.done': '{ref} copié ({version})',
    'copy.failed': 'La copie est bloquée dans ce navigateur — sélectionnez plutôt le texte.',

    'keyWord.hint': 'Mot clé — ouvre son étude dans la langue originale',
    'verse.hint': 'Ouvre un menu pour ce verset. Les flèches permettent de passer d’un numéro de verset à l’autre.',
    'verse.options': 'Verset {verse} — options',
    'note.label': '{count, plural, one {Note de traduction du verset {verse}} other {Notes de traduction du verset {verse}}}',
    'highlighted.prefix': 'Mis en évidence à partir de votre question :',
    'highlighted.suffix': '(mis en évidence à partir de votre question)',

    'glossKey.glosses': 'Gloses des mots ({inEnglish})',
    'glossKey.implied.sample': 'gris',
    'glossKey.implied.text': 'dans l’original, généralement non traduit',
    'glossKey.added.text': 'ajouté en anglais pour le sens',
    'glossKey.join.sample': 'un point médian',
    'glossKey.join.text': 'relie les parties d’un même mot hébreu',
    'glossKey.stress.sample': 'syl',
    'glossKey.stress.rest': 'labe soulignée : accentuée',

    'interlinear.words': '{language, select, greek {Mots grecs} hebrew {Mots hébreux} other {Mots araméens}}',
    'interlinear.noOriginal': 'Aucun texte original annoté pour ce verset.',
    'interlinear.strong': 'Strong',
    'interlinear.wordHint': 'Les flèches permettent de passer d’un mot à l’autre.',
    'interlinear.error': 'Le texte original annoté n’a pas pu être chargé pour ce passage. Le texte de la traduction est affiché seul.',

    'error.title': 'Ce passage n’a pas pu être chargé dans le texte {version}.',
    'error.detail':
      'Réessayez, ou choisissez une autre traduction dans la barre du haut. Rien n’est affiché à sa place — Emmaus ne remplace jamais le texte de l’Écriture.',
    'loading': 'Chargement de {ref}',
    'loading.passage': 'Chargement du passage',

    'legend.sample': 'mot',
    'legend.reader': 'Les mots soulignés sont des mots clés — sélectionnez-en un pour son étude dans la langue originale.',
    'legend.interlinear':
      '{anchored, select, yes {Sélectionnez un mot original pour son article de lexique (les mots soulignés ouvrent leur étude de mot clé).} other {Sélectionnez un mot original pour son article de lexique.}}',
    'legend.rtl': 'L’hébreu se lit de droite à gauche.',
    'attribution.text': 'Texte',
    'attribution.original': 'Original',

    'chapter.navigation': 'Navigation entre les chapitres',
    'chapter.label': 'Chapitre',
    'chapter.previous': 'Chapitre précédent',
    'chapter.previousTo': 'Chapitre précédent ({chapter})',
    'chapter.next': 'Chapitre suivant',
    'chapter.nextTo': 'Chapitre suivant ({chapter})',
  },
  es: {
    'view.label': 'Vista de la Escritura',
    'view.reader': 'Lectura',
    'view.interlinear': 'Interlineal',
    'description.noKeyWords': 'El pasaje en la traducción elegida — con la vista Interlineal se ven debajo las palabras originales.',
    'version.label': '{name} — {license}',

    'menu.explain': 'Explicar este versículo',
    'menu.xrefs': 'Ver referencias cruzadas de este versículo',
    'menu.copy': 'Copiar versículo',
    'ask.explainVerse': 'Explica el versículo {verse}',
    'reason.xrefs': 'Referencias cruzadas de {ref}',
    'copy.done': '{ref} copiado ({version})',
    'copy.failed': 'Este navegador bloquea la copia; el texto se puede seleccionar a mano.',

    'keyWord.hint': 'Palabra clave — abre su estudio en la lengua original',
    'verse.hint': 'Abre un menú para este versículo. Las flechas pasan de un número de versículo a otro.',
    'verse.options': 'Versículo {verse} — opciones',
    'note.label': '{count, plural, one {Nota de traducción del versículo {verse}} other {Notas de traducción del versículo {verse}}}',
    'highlighted.prefix': 'Resaltado a partir de la pregunta:',
    'highlighted.suffix': '(resaltado a partir de la pregunta)',

    'glossKey.glosses': 'Glosas de las palabras ({inEnglish})',
    'glossKey.implied.sample': 'gris',
    'glossKey.implied.text': 'en el original, normalmente sin traducir',
    'glossKey.added.text': 'añadido en inglés para dar sentido',
    'glossKey.join.sample': 'un punto medio',
    'glossKey.join.text': 'une las partes de una misma palabra hebrea',
    'glossKey.stress.sample': 'sí',
    'glossKey.stress.rest': 'laba subrayada: tónica',

    'interlinear.words': '{language, select, greek {Palabras griegas} hebrew {Palabras hebreas} other {Palabras arameas}}',
    'interlinear.noOriginal': 'No hay texto original etiquetado para este versículo.',
    'interlinear.strong': 'Strong',
    'interlinear.wordHint': 'Las flechas pasan de una palabra a otra.',
    'interlinear.error': 'No se pudo cargar el texto original etiquetado de este pasaje. Se muestra solo el texto de la traducción.',

    'error.title': 'No se pudo cargar este pasaje en el texto {version}.',
    'error.detail':
      'Se puede intentar de nuevo o elegir otra traducción en la barra superior. No se muestra nada en su lugar — Emmaus nunca sustituye el texto de la Escritura.',
    'loading': 'Cargando {ref}',
    'loading.passage': 'Cargando el pasaje',

    'legend.sample': 'palabra',
    'legend.reader': 'Las palabras subrayadas son palabras clave — al seleccionar una se abre su estudio en la lengua original.',
    'legend.interlinear':
      '{anchored, select, yes {Al seleccionar una palabra original se abre su entrada del léxico (las subrayadas abren su estudio de palabra clave).} other {Al seleccionar una palabra original se abre su entrada del léxico.}}',
    'legend.rtl': 'El hebreo se lee de derecha a izquierda.',
    'attribution.text': 'Texto',
    'attribution.original': 'Original',

    'chapter.navigation': 'Navegación por capítulos',
    'chapter.label': 'Capítulo',
    'chapter.previous': 'Capítulo anterior',
    'chapter.previousTo': 'Capítulo anterior ({chapter})',
    'chapter.next': 'Capítulo siguiente',
    'chapter.nextTo': 'Capítulo siguiente ({chapter})',
  },
});
