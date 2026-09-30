/**
 * Français overlay for the topic "resurrection". The English module (src/data/curated/topics/resurrection.ts)
 * stays the source of truth for ids, references and citations. Scripture quoted in prose follows LSG.
 */
import type { TopicOverlay } from '../types';

const overlay: TopicOverlay = {
  topicId: 'resurrection',
  locale: 'fr',
  name: 'La résurrection',
  aliases: [
    'résurrection',
    'la résurrection',
    'résurrection de jésus',
    'résurrection du christ',
    'jésus est-il ressuscité',
    'jésus est-il vraiment ressuscité',
    'il est ressuscité',
    'ressuscité',
    'pâques',
    'tombeau vide',
    'le tombeau vide',
    'ressuscité des morts',
    'résurrection des morts',
    'résurrection de la chair',
    'résurrection du corps',
    'résurrection corporelle',
    'corps ressuscité',
    'vie après la mort',
    'que se passe-t-il quand on meurt',
  ],
  question: 'Qu’enseigne la Bible sur la résurrection ?',
  definition:
    'La résurrection est au cœur de l’espérance chrétienne. Paul transmet, comme étant de première importance, que Christ est mort pour nos péchés, qu’il a été enseveli, qu’il est ressuscité le troisième jour selon les Écritures et qu’il est apparu à de nombreux témoins (1 Co 15.3–8). Les Évangiles insistent sur un tombeau vide et sur un Jésus corporel, que l’on pouvait toucher et qui mangeait (Mt 28.1–10 ; Lc 24.36–43). Si Christ n’est pas ressuscité, la foi est vaine ; mais il est ressuscité, prémices de ceux qui sont morts (1 Co 15.14–20). L’Ancien Testament entrevoyait cette espérance (Es 26.19 ; Dn 12.2), et Pierre lit le Psaume 16 comme une annonce prophétique de David (Ac 2.25–32). Les croyants partagent déjà la vie du Christ ressuscité (Rm 6.4–5) et attendent la résurrection du corps — incorruptible et glorieux —, quand la mort elle-même sera vaincue (1 Co 15.42–57 ; Ph 3.20–21).',
  keyPassages: {
    'resurrection:kp:1': {
      title: 'Tes morts revivront',
      group: 'Une espérance entrevue',
      note: 'Dans un cantique de confiance en l’Éternel (Es 26), Ésaïe promet que les morts de Dieu revivront, que leurs corps se relèveront et que les habitants de la poussière se réveilleront en chantant. Les interprètes divergent : l’image évoque-t-elle la restauration de la nation après l’exil ou la résurrection du corps ? Les notes d’étude Tyndale jugent la seconde lecture plus probable.',
    },
    'resurrection:kp:2': {
      title: 'Plusieurs de ceux qui dorment dans la poussière se réveilleront',
      group: 'Une espérance entrevue',
      note: 'Daniel parle explicitement de beaucoup de ceux qui dorment dans la poussière et qui se réveilleront — les uns pour la vie éternelle, les autres pour l’opprobre et la honte éternelle —, et des sages qui brilleront comme les étoiles.',
    },
    'resurrection:kp:3': {
      title: 'La vallée des ossements desséchés',
      group: 'Une espérance entrevue',
      note: 'Le souffle de Dieu rend la vie à des ossements desséchés. La vision promet d’abord le relèvement national d’Israël après l’exil (les ossements sont identifiés à toute la maison d’Israël, 37.11), en recourant à l’image de sépulcres ouverts.',
    },
    'resurrection:kp:4': {
      title: 'Tu ne permettras pas que ton bien-aimé voie la corruption',
      group: 'Une espérance entrevue',
      note: 'David se confie en Dieu, qui ne l’abandonnera pas au séjour des morts ; à la Pentecôte, Pierre soutient que David, qui est mort et a été enseveli, parlait de la résurrection du Christ (Ac 2.25–32).',
    },
    'resurrection:kp:5': {
      title: 'Il n’est point ici ; il est ressuscité',
      group: 'Christ est ressuscité',
      note: 'De grand matin, le premier jour de la semaine, les femmes voient un ange rouler la pierre, entendent son annonce et rencontrent Jésus ressuscité, qui les envoie vers ses frères.',
    },
    'resurrection:kp:6': {
      title: 'Touchez-moi et voyez',
      group: 'Christ est ressuscité',
      note: 'Jésus ressuscité montre ses mains et ses pieds et mange du poisson rôti pour prouver à ses disciples saisis de frayeur qu’il n’est pas un esprit, mais qu’il a chair et os.',
    },
    'resurrection:kp:7': {
      title: 'Mon Seigneur et mon Dieu',
      group: 'Christ est ressuscité',
      note: 'Thomas, qui refusait de croire sans voir, est invité à toucher les plaies et répond par la plus haute confession de l’Évangile ; Jésus déclare heureux ceux qui croient sans avoir vu.',
    },
    'resurrection:kp:8': {
      title: 'Christ, les prémices',
      group: 'Christ est ressuscité',
      note: 'Paul récite la tradition de l’Évangile qu’il a reçue et ses nombreux témoins, montre que tout tient ou tombe avec la résurrection du Christ, et présente Christ comme les prémices de la moisson à venir.',
    },
    'resurrection:kp:9': {
      title: 'Dieu l’a ressuscité',
      group: 'Christ est ressuscité',
      note: 'À la Pentecôte, Pierre proclame qu’il n’était pas possible que Jésus soit retenu par la mort, et que les apôtres sont témoins que Dieu l’a ressuscité.',
    },
    'resurrection:kp:10': {
      title: 'Je suis la résurrection et la vie',
      group: 'Notre résurrection',
      note: 'Marthe croit à une résurrection au dernier jour ; Jésus révèle que la vie de la résurrection se trouve en lui-même, avant de ressusciter son frère Lazare (11.43–44).',
    },
    'resurrection:kp:11': {
      title: 'Ressuscité incorruptible',
      group: 'Notre résurrection',
      note: 'Comme la semence et la plante qu’elle devient, le corps ressuscité sera en continuité avec le corps présent tout en étant transformé — incorruptible, glorieux, plein de force et spirituel —, quand la mort elle-même sera définitivement vaincue.',
    },
    'resurrection:kp:12': {
      title: 'Semblable au corps de sa gloire',
      group: 'Notre résurrection',
      note: 'Les croyants, citoyens des cieux, attendent de là un Sauveur qui transformera le corps de leur humiliation pour le rendre semblable au corps de sa gloire.',
    },
  },
  suggestedQuestions: [
    'Quelles preuves Paul donne-t-il de la résurrection ?',
    'Pourquoi la résurrection est-elle essentielle à la foi chrétienne ?',
    'À quoi ressemblera notre corps ressuscité ?',
    'L’Ancien Testament enseigne-t-il la résurrection ?',
    'Que signifie « prémices » en 1 Corinthiens 15.20 ?',
  ],
};

export default overlay;
