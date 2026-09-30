import { defineMessages } from '../translate';

/**
 * 'inference' namespace — the live-composition server's codes, localised on the client:
 * why composition is unavailable (status.<InferenceUnavailableCode>, from GET /api/inference/status
 * `reasonCode`) and why a run failed (error.<InferenceErrorCode>, from the SSE `error` event `code`).
 * The server's English `reason` / `message` stays the fallback (and carries details these do not).
 */
const en = {
  'status.no-credentials': 'Live composition needs an Anthropic API key. Add ANTHROPIC_API_KEY=… to .env.local and restart npm run dev.',
  'status.no-credit': 'The Claude API account behind this server has no remaining credit, so live composition is unavailable until it is topped up. Curated and library pages still work.',
  'status.loading': 'The knowledge base is still loading (building the search index) — try again in a moment.',
  'status.kb-error': 'The knowledge base failed to load. Check the server log and restart npm run dev.',
  'status.rejected': 'The Claude API is rejecting this server’s requests, so live composition is unavailable. The server log has the details.',

  'error.no-credentials': 'Live composition needs an Anthropic API key. Add ANTHROPIC_API_KEY=… to .env.local and restart npm run dev.',
  'error.no-credit': 'The Claude API account behind this server has no remaining credit, so live composition is unavailable until it is topped up. Curated and library pages still work.',
  'error.refusal': 'The model declined to compose this page, so nothing was generated.',
  'error.rate-limited': 'The Claude API rate limit was reached. Please wait a minute and try again.',
  'error.overloaded': 'The Claude API is temporarily unavailable or overloaded. Please try again shortly.',
  'error.invalid-output': 'The model could not produce a page that passes the source-grounding checks.',
  'error.aborted': 'Stopped.',
  'error.internal': 'Something went wrong while composing the page.',

  // follow-up answers: what the answer changed on the page (focus banner, update chips)
  'answer.reason': 'Added to the page for your question: {list}',
  'answer.added': 'Added {what}',
  'answer.opened': 'Opened {section}',
  'answer.count.key-passages': '{count, plural, one {# passage} other {# passages}} to {section}',
  'answer.count.cross-references': '{count, plural, one {# cross-reference} other {# cross-references}} to {section}',
  'answer.count.original-languages': '{count, plural, one {# key word} other {# key words}} to {section}',
  'answer.count.historical-context': '{count, plural, one {# background note} other {# background notes}} to {section}',
  'answer.count.literary-context': '{count, plural, one {# literary feature} other {# literary features}} to {section}',
  'answer.count.theology': '{count, plural, one {# theology item} other {# theology items}} to {section}',
  'answer.count.commentary': '{count, plural, one {# voice} other {# voices}} to {section}',
};

export const messages = defineMessages({
  en,
  pt: {
    'status.no-credentials': 'A composição ao vivo precisa de uma chave da API da Anthropic. Adicione ANTHROPIC_API_KEY=… ao .env.local e reinicie o npm run dev.',
    'status.no-credit': 'A conta da API do Claude usada por este servidor está sem créditos; a composição ao vivo fica indisponível até que seja recarregada. As páginas selecionadas e da biblioteca continuam funcionando.',
    'status.loading': 'A base de conhecimento ainda está carregando (construindo o índice de busca) — tente de novo em instantes.',
    'status.kb-error': 'A base de conhecimento não carregou. Verifique o log do servidor e reinicie o npm run dev.',
    'status.rejected': 'A API do Claude está recusando as solicitações deste servidor; a composição ao vivo está indisponível. O log do servidor traz os detalhes.',

    'error.no-credentials': 'A composição ao vivo precisa de uma chave da API da Anthropic. Adicione ANTHROPIC_API_KEY=… ao .env.local e reinicie o npm run dev.',
    'error.no-credit': 'A conta da API do Claude usada por este servidor está sem créditos; a composição ao vivo fica indisponível até que seja recarregada. As páginas selecionadas e da biblioteca continuam funcionando.',
    'error.refusal': 'O modelo se recusou a compor esta página; nada foi gerado.',
    'error.rate-limited': 'O limite de uso da API do Claude foi atingido. Aguarde um minuto e tente de novo.',
    'error.overloaded': 'A API do Claude está temporariamente indisponível ou sobrecarregada. Tente de novo em instantes.',
    'error.invalid-output': 'O modelo não conseguiu produzir uma página que passasse nas verificações de fontes.',
    'error.aborted': 'Interrompido.',
    'error.internal': 'Algo deu errado ao compor a página.',

    'answer.reason': 'Adicionado à página para a sua pergunta: {list}',
    'answer.added': 'Adicionado: {what}',
    'answer.opened': 'Aberto: {section}',
    'answer.count.key-passages': '{count, plural, one {# passagem} other {# passagens}} em {section}',
    'answer.count.cross-references': '{count, plural, one {# referência cruzada} other {# referências cruzadas}} em {section}',
    'answer.count.original-languages': '{count, plural, one {# palavra-chave} other {# palavras-chave}} em {section}',
    'answer.count.historical-context': '{count, plural, one {# nota de contexto} other {# notas de contexto}} em {section}',
    'answer.count.literary-context': '{count, plural, one {# traço literário} other {# traços literários}} em {section}',
    'answer.count.theology': '{count, plural, one {# item de teologia} other {# itens de teologia}} em {section}',
    'answer.count.commentary': '{count, plural, one {# voz} other {# vozes}} em {section}',
  },
  fr: {
    'status.no-credentials': 'La composition en direct nécessite une clé d’API Anthropic. Ajoutez ANTHROPIC_API_KEY=… à .env.local et relancez npm run dev.',
    'status.no-credit': 'Le compte de l’API Claude de ce serveur n’a plus de crédit : la composition en direct est indisponible jusqu’à son rechargement. Les pages sélectionnées et celles de la bibliothèque fonctionnent toujours.',
    'status.loading': 'La base de connaissances est encore en cours de chargement (construction de l’index de recherche) — réessayez dans un instant.',
    'status.kb-error': 'La base de connaissances n’a pas pu être chargée. Consultez le journal du serveur et relancez npm run dev.',
    'status.rejected': 'L’API Claude refuse les requêtes de ce serveur : la composition en direct est indisponible. Le journal du serveur donne les détails.',

    'error.no-credentials': 'La composition en direct nécessite une clé d’API Anthropic. Ajoutez ANTHROPIC_API_KEY=… à .env.local et relancez npm run dev.',
    'error.no-credit': 'Le compte de l’API Claude de ce serveur n’a plus de crédit : la composition en direct est indisponible jusqu’à son rechargement. Les pages sélectionnées et celles de la bibliothèque fonctionnent toujours.',
    'error.refusal': 'Le modèle a refusé de composer cette page ; rien n’a été généré.',
    'error.rate-limited': 'La limite de débit de l’API Claude a été atteinte. Patientez une minute et réessayez.',
    'error.overloaded': 'L’API Claude est temporairement indisponible ou surchargée. Réessayez dans un instant.',
    'error.invalid-output': 'Le modèle n’a pas pu produire une page qui passe les vérifications des sources.',
    'error.aborted': 'Arrêté.',
    'error.internal': 'Une erreur s’est produite pendant la composition de la page.',

    'answer.reason': 'Ajouté à la page pour votre question : {list}',
    'answer.added': 'Ajouté : {what}',
    'answer.opened': 'Ouvert : {section}',
    'answer.count.key-passages': '{count, plural, one {# passage} other {# passages}} dans {section}',
    'answer.count.cross-references': '{count, plural, one {# renvoi} other {# renvois}} dans {section}',
    'answer.count.original-languages': '{count, plural, one {# mot clé} other {# mots clés}} dans {section}',
    'answer.count.historical-context': '{count, plural, one {# note de contexte} other {# notes de contexte}} dans {section}',
    'answer.count.literary-context': '{count, plural, one {# trait littéraire} other {# traits littéraires}} dans {section}',
    'answer.count.theology': '{count, plural, one {# élément de théologie} other {# éléments de théologie}} dans {section}',
    'answer.count.commentary': '{count, plural, one {# voix} other {# voix}} dans {section}',
  },
  es: {
    'status.no-credentials': 'La composición en vivo necesita una clave de la API de Anthropic. Añada ANTHROPIC_API_KEY=… a .env.local y reinicie npm run dev.',
    'status.no-credit': 'La cuenta de la API de Claude de este servidor no tiene crédito disponible, así que la composición en vivo no estará disponible hasta que se recargue. Las páginas seleccionadas y de la biblioteca siguen funcionando.',
    'status.loading': 'La base de conocimiento todavía se está cargando (construyendo el índice de búsqueda); vuelva a intentarlo en un momento.',
    'status.kb-error': 'La base de conocimiento no se pudo cargar. Revise el registro del servidor y reinicie npm run dev.',
    'status.rejected': 'La API de Claude está rechazando las solicitudes de este servidor, así que la composición en vivo no está disponible. El registro del servidor tiene los detalles.',

    'error.no-credentials': 'La composición en vivo necesita una clave de la API de Anthropic. Añada ANTHROPIC_API_KEY=… a .env.local y reinicie npm run dev.',
    'error.no-credit': 'La cuenta de la API de Claude de este servidor no tiene crédito disponible, así que la composición en vivo no estará disponible hasta que se recargue. Las páginas seleccionadas y de la biblioteca siguen funcionando.',
    'error.refusal': 'El modelo se negó a componer esta página; no se generó nada.',
    'error.rate-limited': 'Se alcanzó el límite de uso de la API de Claude. Espere un minuto y vuelva a intentarlo.',
    'error.overloaded': 'La API de Claude no está disponible temporalmente o está sobrecargada. Vuelva a intentarlo en breve.',
    'error.invalid-output': 'El modelo no pudo producir una página que pase las comprobaciones de fuentes.',
    'error.aborted': 'Detenido.',
    'error.internal': 'Algo salió mal al componer la página.',

    'answer.reason': 'Añadido a la página para su pregunta: {list}',
    'answer.added': 'Añadido: {what}',
    'answer.opened': 'Abierto: {section}',
    'answer.count.key-passages': '{count, plural, one {# pasaje} other {# pasajes}} en {section}',
    'answer.count.cross-references': '{count, plural, one {# referencia cruzada} other {# referencias cruzadas}} en {section}',
    'answer.count.original-languages': '{count, plural, one {# palabra clave} other {# palabras clave}} en {section}',
    'answer.count.historical-context': '{count, plural, one {# nota de contexto} other {# notas de contexto}} en {section}',
    'answer.count.literary-context': '{count, plural, one {# rasgo literario} other {# rasgos literarios}} en {section}',
    'answer.count.theology': '{count, plural, one {# elemento de teología} other {# elementos de teología}} en {section}',
    'answer.count.commentary': '{count, plural, one {# voz} other {# voces}} en {section}',
  },
});
