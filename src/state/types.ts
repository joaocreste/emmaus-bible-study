/**
 * Session state contract shared by the app shell, chat and study workspace.
 * Implemented by `SessionProvider` / `useSession()` in src/state/session.tsx.
 *
 * Nothing here is persisted to a server. Reader settings are kept in
 * localStorage; everything else lives for the page session. The shape is
 * intentionally serialisable so it can later be synced per user/device.
 */
import type {
  ChatMessage,
  ConversationState,
  DashboardFocus,
  PassageRef,
  SectionId,
  Study,
  TranslationId,
  VerseRef,
} from '../domain/models';

export type ThemePreference = 'system' | 'parchment' | 'evening';

export interface ReaderSettings {
  /** interface & study language */
  locale: import('../i18n/locales').Locale;
  /** multiplier for reading text (Scripture, commentary); 0.9 – 1.4 */
  fontScale: number;
  theme: ThemePreference;
  translation: TranslationId;
  showVerseNumbers: boolean;
  /** 'reader' = English text; 'interlinear' = English with original-language words beneath */
  scriptureMode: 'reader' | 'interlinear';
  /** compose a new study page live from the knowledge base when no curated study matches (docs/INFERENCE.md) */
  liveComposition: boolean;
}

export type InspectorTarget =
  | { type: 'word'; keyWordId?: string; strong?: string; verse?: VerseRef; surface?: string; gloss?: string }
  | { type: 'passage'; ref: PassageRef; title?: string }
  /** `excerpt`/`locator`: the retrieved text a generated statement rests on (shown as "Cited passage") */
  | { type: 'source'; sourceId: string; excerpt?: string; locator?: string }
  | { type: 'author'; authorId: string };

/** iPhone-style navigation panes (spec §16). */
export type MobilePane = 'chat' | 'study' | 'sources';

export interface SessionState {
  /** 'welcome' until the first study opens */
  phase: 'welcome' | 'study';
  /** engine activity; 'thinking' shows the cross loader + pipeline steps */
  status: 'idle' | 'thinking' | 'error';
  study: Study | null;
  messages: ChatMessage[];
  /** last directive from the engine (or from UI navigation) */
  focus: DashboardFocus | null;
  /** increments on every new focus so the workspace re-applies scroll/highlight even for equal objects */
  focusSeq: number;
  conversation: ConversationState;
  inspector: InspectorTarget | null;
  settings: ReaderSettings;
  mobilePane: MobilePane;
  /** tablet/desktop: chat collapsed for full-width reading */
  chatCollapsed: boolean;
  /** mobile: study changed while user was on the chat pane (badge on the Study tab) */
  studyUpdatedWhileAway: boolean;
}

export interface SessionActions {
  /**
   * Send a chat message through the StudyEngine (also used by the welcome screen).
   * If another request is being answered, the message waits its turn — it is never dropped.
   */
  send(text: string): Promise<void>;
  /**
   * Open a study directly (featured cards, search palette, "Study this passage").
   * Waits its turn if another request is being answered. Resolves to the id of the
   * study open once the reply has been applied — compare it with the requested id to
   * know whether the engine actually opened it — or undefined if the request failed.
   */
  openStudy(query: { studyId?: string; passage?: PassageRef; topic?: string }): Promise<string | undefined>;
  /** Dashboard-originated focus (e.g. clicking a section chip in chat, or "show in context"). */
  focusDashboard(focus: DashboardFocus): void;
  /** Convenience: jump to a section. */
  goToSection(section: SectionId): void;
  openInspector(target: InspectorTarget): void;
  closeInspector(): void;
  updateSettings(patch: Partial<ReaderSettings>): void;
  setMobilePane(pane: MobilePane): void;
  toggleChat(collapsed?: boolean): void;
  /** Return to the welcome screen (starts a fresh conversation). */
  reset(): void;
}

export type Session = SessionState & SessionActions;
