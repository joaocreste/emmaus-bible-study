import { defineMessages } from '../translate';

/**
 * 'inference' namespace — the live-composition server's codes, localised on the client:
 * why composition is unavailable (status.<InferenceUnavailableCode>, from GET /api/inference/status
 * `reasonCode`) and why a run failed (error.<InferenceErrorCode>, from the SSE `error` event `code`).
 * The server's English `reason` / `message` stays the fallback (and carries details these do not).
 */
const en = {
  'status.unavailable': 'new studies cannot be composed right now. Studies from the library still open as usual',
  'status.no-credentials': 'Composing new studies is not set up here yet. Studies from the library still open as usual.',
  'status.no-credit': 'Composing new studies is paused for now. Studies from the library still open as usual.',
  'status.loading': 'The research library is still being prepared — try again in a moment.',
  'status.kb-error': 'The research library could not be opened, so new studies cannot be composed right now. Studies from the library still open as usual.',
  'status.rejected': 'Composing new studies is unavailable for now. Studies from the library still open as usual.',

  'error.no-credentials': 'Composing new studies is not set up here yet.',
  'error.no-credit': 'Composing new studies is paused for now.',
  'error.refusal': 'A study could not be composed for this question.',
  'error.rate-limited': 'Many studies are being composed right now — please try again in a minute.',
  'error.overloaded': 'Composing studies is busy right now — please try again shortly.',
  'error.invalid-output': 'A study could not be composed in which every statement rests on a cited source, so nothing unverified is shown.',
  'error.aborted': 'Stopped.',
  'error.internal': 'Something went wrong while composing the study.',

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
    'status.unavailable': 'não é possível gerar novos estudos agora. Os estudos da biblioteca continuam abrindo normalmente',
    'status.no-credentials': 'A geração de novos estudos ainda não está configurada aqui. Os estudos da biblioteca continuam abrindo normalmente.',
    'status.no-credit': 'A geração de novos estudos está pausada no momento. Os estudos da biblioteca continuam abrindo normalmente.',
    'status.loading': 'A biblioteca de pesquisa ainda está sendo preparada — tente de novo em instantes.',
    'status.kb-error': 'A biblioteca de pesquisa não pôde ser aberta; por isso não é possível gerar novos estudos agora. Os estudos da biblioteca continuam abrindo normalmente.',
    'status.rejected': 'A geração de novos estudos está indisponível no momento. Os estudos da biblioteca continuam abrindo normalmente.',

    'error.no-credentials': 'A geração de novos estudos ainda não está configurada aqui.',
    'error.no-credit': 'A geração de novos estudos está pausada no momento.',
    'error.refusal': 'Não foi possível gerar um estudo para esta pergunta.',
    'error.rate-limited': 'Muitos estudos estão sendo gerados agora — tente de novo em um minuto.',
    'error.overloaded': 'A geração de estudos está sobrecarregada agora — tente de novo em instantes.',
    'error.invalid-output': 'Não foi possível gerar um estudo em que cada afirmação se apoie numa fonte citada; por isso nada sem verificação é mostrado.',
    'error.aborted': 'Interrompido.',
    'error.internal': 'Algo deu errado ao gerar o estudo.',

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
    'status.unavailable': 'impossible de composer de nouvelles études pour le moment. Les études de la bibliothèque s’ouvrent toujours',
    'status.no-credentials': 'La composition de nouvelles études n’est pas encore configurée ici. Les études de la bibliothèque s’ouvrent toujours.',
    'status.no-credit': 'La composition de nouvelles études est en pause pour le moment. Les études de la bibliothèque s’ouvrent toujours.',
    'status.loading': 'La bibliothèque de recherche est encore en préparation — réessayez dans un instant.',
    'status.kb-error': 'La bibliothèque de recherche n’a pas pu être ouverte : impossible de composer de nouvelles études pour le moment. Les études de la bibliothèque s’ouvrent toujours.',
    'status.rejected': 'La composition de nouvelles études est indisponible pour le moment. Les études de la bibliothèque s’ouvrent toujours.',

    'error.no-credentials': 'La composition de nouvelles études n’est pas encore configurée ici.',
    'error.no-credit': 'La composition de nouvelles études est en pause pour le moment.',
    'error.refusal': 'Aucune étude n’a pu être composée pour cette question.',
    'error.rate-limited': 'Beaucoup d’études sont en cours de composition — réessayez dans une minute.',
    'error.overloaded': 'La composition d’études est très sollicitée en ce moment — réessayez sous peu.',
    'error.invalid-output': 'Aucune étude n’a pu être composée où chaque affirmation repose sur une source citée ; rien de non vérifié n’est donc affiché.',
    'error.aborted': 'Arrêté.',
    'error.internal': 'Un problème est survenu pendant la composition de l’étude.',

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
    'status.unavailable': 'no es posible generar estudios nuevos ahora. Los estudios de la biblioteca siguen abriéndose con normalidad',
    'status.no-credentials': 'La generación de estudios nuevos todavía no está configurada aquí. Los estudios de la biblioteca siguen abriéndose con normalidad.',
    'status.no-credit': 'La generación de estudios nuevos está en pausa por ahora. Los estudios de la biblioteca siguen abriéndose con normalidad.',
    'status.loading': 'La biblioteca de investigación todavía se está preparando; vuelva a intentarlo en un momento.',
    'status.kb-error': 'No se pudo abrir la biblioteca de investigación, así que ahora no es posible generar estudios nuevos. Los estudios de la biblioteca siguen abriéndose con normalidad.',
    'status.rejected': 'La generación de estudios nuevos no está disponible por ahora. Los estudios de la biblioteca siguen abriéndose con normalidad.',

    'error.no-credentials': 'La generación de estudios nuevos todavía no está configurada aquí.',
    'error.no-credit': 'La generación de estudios nuevos está en pausa por ahora.',
    'error.refusal': 'No se pudo generar un estudio para esta pregunta.',
    'error.rate-limited': 'Se están generando muchos estudios ahora; vuelva a intentarlo en un minuto.',
    'error.overloaded': 'La generación de estudios está muy ocupada ahora; vuelva a intentarlo en breve.',
    'error.invalid-output': 'No se pudo generar un estudio en el que cada afirmación se apoye en una fuente citada, así que no se muestra nada sin verificar.',
    'error.aborted': 'Detenido.',
    'error.internal': 'Algo salió mal al generar el estudio.',

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
