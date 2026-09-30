# Product spec — Christian Bible Study & Theological Research App (Web MVP)

> Original brief for the first MVP, preserved verbatim-in-substance for contributors and agents.

## 1. Objective
Create the first MVP of a Christian Bible study and theological research application. It begins as a local web application, but architecture, components, data models and UX must anticipate: a hosted web app, iPhone, iPad, user accounts/authentication, persistent study history, saved studies/notes/highlights/bookmarks, and cross-device sync. For this version keep it local and lightweight: no authentication, cloud persistence, accounts, or unnecessary backend. Prove the core product experience.

## 2. Product concept
Two combined experiences: (1) a conversational Bible-study assistant, (2) a dynamically generated theological study dashboard. The chatbot is the primary input; the dashboard is the primary research environment.

**Conversation → interpretation of study intent → structured theological research → dynamically updated study dashboard.**

The user should feel they are conversing with a knowledgeable theological research assistant while a rich Bible study is assembled beside them. The chatbot should not return walls of text; it understands what the user wants to investigate and progressively constructs a structured study.

## 3. Starting a study
Calm welcome: **“What would you like to study today?”** Two paths:
- **Study a Passage** — a verse, range, chapter, multiple chapters or a book (John 1:1, Romans 8, Matthew 5–7, Genesis, Psalm 23).
- **Explore a Topic** — Grace, Faith, Forgiveness, Suffering, Prayer, Salvation, The Trinity, The Holy Spirit, Marriage, Anxiety, Predestination, The Kingdom of God, “What does the Bible say about wealth?”, “Why does God allow suffering?”
Free-form conversation should also work without choosing a category.

## 4. Core interface
After a study begins: **A. Chat** (always visible; follow-ups like “What does Paul mean by flesh here?”, “Show me other passages where this idea appears.”, “What is the Greek word behind ‘grace’?”, “What did Tim Keller say about this?”, “How would the original audience have understood this?”, “How does this connect with Romans?”, “Explain verse 12 in more detail.”, “Are there different theological interpretations of this passage?”) — each interaction can update the dashboard. **B. Study dashboard** — a living theological research notebook, not a second chatbot response.

## 5. Dashboard modules
- **Scripture** — principal passage; distinct verse numbers; highlight/underline important words; clicking a word opens deeper linguistic information.
- **Cross-references** — reference, short excerpt (licensing permitting), why relevant, relationship to the primary passage; classify: parallel, prophecy/fulfilment, thematic, quotation, allusion, same theological concept, contrast, historical. Explain *why* they connect.
- **Original languages** — Hebrew, Biblical Aramaic, Koine Greek: original word, transliteration, pronunciation, lemma, basic meaning, semantic range, grammar, other important occurrences, why the word matters here. Don’t imply a lexicon solves theology; context stays primary.
- **Historical & cultural context** — period, geography, politics, social structures, economics, religious practice, Jewish traditions, Greco-Roman culture, customs, audience, authorship, genre, circumstances — only when genuinely relevant.
- **Literary context** — place in chapter, book, author’s argument, broader biblical narrative; repetition, parallelism, chiasm, metaphor, poetry, narrative/argument structure, transitions.
- **Theology** — major concepts (Christology, soteriology, pneumatology, ecclesiology, eschatology, covenant, creation, sin, grace, sanctification…), without forcing categories.
- **Commentary & Christian thinkers** — e.g. Tim Keller, John Piper, Billy Graham, C. S. Lewis, Augustine, Martin Luther, John Calvin, Charles Spurgeon, J. I. Packer, John Stott, N. T. Wright, D. A. Carson, R. C. Sproul (illustrative). Favour substantial theological/pastoral/academic work over popularity. **Do not fabricate quotations.** Every direct quotation must be traceable: author, quote or clearly labelled paraphrase, work title, date, source, link. If a quotation cannot be verified, present the idea as a clearly identified summary, not in quotation marks.

## 6. Theological integrity & source grounding (fundamental)
Never invent sources, quotations, historical claims, linguistic definitions or biblical references. Every important claim should be able to carry provenance: **claim → source → author → work → location → URL/reference**. Distinguish: biblical text, linguistic information, historical information, commentary, direct quotation, paraphrase/summary, AI-generated synthesis — understandably, without academic clutter. For the MVP, where live retrieval isn’t implemented, use a small curated dataset with clearly identified real or placeholder source metadata; never pretend generated information was retrieved; never create fake citations.

## 7. Theological perspectives
Christian, but recognise serious disagreement: present interpretations (e.g. Reformed, Arminian/Wesleyan, Catholic) only when genuinely relevant; distinguish broad Christian consensus, denominational differences, historical debates and interpretive uncertainty. Encourage serious study; don’t artificially eliminate complexity.

## 8. Source architecture
Provider abstraction, e.g. ScriptureProvider, LexiconProvider, CrossReferenceProvider, CommentaryProvider, SermonProvider, HistoricalContextProvider — so local/mock data can be replaced by APIs/databases (Bible APIs, public-domain translations, Strong’s, lexicons, dictionaries, public-domain commentaries, sermon transcripts, licensed books/articles, ministry archives, academic sources, curated databases).

## 9. Search & source experience
Sources are part of the research experience, not hidden footnotes: source cards (author, work, insight, “Read source →”); Scripture cards (reference, excerpt, “Open passage →”).

## 10–13. Visual direction, palette, typography, cross motif
Warm, Mediterranean, scholarly, contemplative, historical, premium, calm, modern — “a beautiful modern theological library combined with a carefully annotated Bible”, not a generic AI chatbot. Avoid SaaS dashboard look, excessive gradients, glassmorphism, neon, techy AI aesthetics. Palette: parchment off-white, olive, sage, terracotta, sand, warm stone, dark charcoal, restrained antique gold (accents only). Excellent contrast. Readable serif for Scripture/quotations/excerpts; clean humanist sans for navigation/chat/metadata/controls; typography subtly distinguishes Scripture, commentary, original languages, AI synthesis, historical context; Greek/Hebrew/Aramaic render correctly. The cross is the primary motif — app icon, logo, loading indicator, separators, small navigation details, empty states — tasteful, never covering the interface.

## 14. UX principles
Reading comfort; exploration (Verse → Word → Cross-reference → Context → Commentary → Source); progressive disclosure; conversation + research connected. Example: “What does grace mean in this verse?” → brief chat answer, highlight the word, open/update Original Languages, add cross-references, surface commentary.

## 15. Desktop layout
Top bar (✝ app name, search, menu); left chat; right, larger study panel with Scripture, cross-references, Greek/Hebrew, historical context, theology, commentary & sermons. A starting point, not a rigid spec.

## 16. Mobile / iPad preparation
iPad: split Chat + Study, full-screen reading, landscape comfort, touch. iPhone: Chat | Study | Sources navigation. No native apps now; avoid decisions that make them hard.

## 17. Technical
Modern component-based stack (React, TypeScript, Vite, CSS variables/tokens, responsive components). `npm install` then `npm run dev`. No auth, DB, persistent memory, or cloud deployment.

## 18. MVP data
Several realistic scenarios: **Romans 8** (Scripture, Greek terminology, cross-references, historical context, theology, commentary); **John 1** (Logos, Greek analysis, Genesis cross-reference, Christological interpretation); **Psalm 23** (Hebrew terminology, ANE shepherd imagery, cross-references, historical commentary); **Topic: Grace** (topic-driven study). Mock data clearly separated from the production source layer.

## 19. Components & models
Reusable components (ChatPanel, ChatMessage, StudyWorkspace, ScriptureCard, Verse, CrossReferenceCard, OriginalLanguageCard, ContextCard, TheologyCard, CommentaryCard, SourceCard, PerspectiveCard, StudyNavigation, StudySection, SearchInput) and TypeScript models (Passage, Verse, BiblicalWord, CrossReference, Commentary, Source, TheologicalPerspective, Study, ChatMessage). Domain logic separate from presentation.

## 20. Important behaviour
The dashboard must respond visibly to the conversation. “Romans 8” → load the study; “What does condemnation mean?” → update/highlight linguistic and theological sections; “Show me what Tim Keller says about this” → bring commentary into focus; “Where else does Paul talk about this?” → prioritise Pauline cross-references. Simulated locally, built so an LLM + retrieval can drive it later.

## 21. Future AI architecture
User question → intent/passage/topic extraction → biblical retrieval → lexical retrieval → cross-reference retrieval → commentary/sermon retrieval → source ranking → LLM synthesis → structured Study object → chat response + dashboard update. The LLM synthesises retrieved information rather than manufacturing evidence. A future StudyEngine replaces local logic without a frontend redesign.

## 22. Copyright & licensing
Be conservative: no long excerpts from copyrighted books, sermons, commentaries or translations. Use public domain, short attributed excerpts where legally appropriate, metadata and links, clearly identified summaries. Model licensing in the data.

## 23. Accessibility
Semantic HTML, keyboard navigation, contrast, visible focus, screen-reader-friendly controls, adjustable readable text, no colour-only interactions; Scripture comfortable at different font sizes.

## 24. Not yet
Authentication, payments, subscriptions, cloud DB, profiles, social, native iOS, push notifications, production RAG, admin systems. Focus on the loop: **Ask → Explore → Cross-reference → Understand → Go deeper.**

## 25. First deliverable
Launches locally; polished start-study experience; passage or topic; natural transition into Chat + Study; multiple realistic scenarios; chat modifies/focuses the dashboard; Scripture, cross-references, original languages, historical context, theology, commentary and sources; responsive; coherent Mediterranean Christian identity; reusable components and clean architecture; ready for real APIs, RAG, LLMs, auth, persistence and native clients. Not wireframes — visually polished.
