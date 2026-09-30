# Content & source-grounding guidelines

Emmaus is built on one rule: **the app never manufactures theological evidence.** Scripture, lexical data, historical claims, quotations and citations must be traceable. Synthesis is welcome — as long as it is labelled as synthesis and points to its grounds.

```
claim → provenance (kind, verification) → citation (source, locator, url) → source (work, edition, license) → author
```

## 1. Content kinds

| Kind | Use for | Requirements |
|---|---|---|
| `scripture` | Bible text | Never typed into curated files. Always fetched from `ScriptureProvider` (BSB default; KJV, WEB). Reference only. |
| `original-text` | Hebrew/Aramaic/Greek words | From STEPBible TAHOT/TAGNT via `OriginalTextProvider`. |
| `lexical` | Lemma, gloss, definition, Strong’s number, occurrences | Must agree with STEPBible TBESG/TBESH (or Strong’s). Transliteration and lemma must match the lexicon. |
| `historical` | Dates, places, customs, politics, authorship | Cite a real source (Tyndale Open Study Notes intro, a public-domain dictionary/encyclopedia, a named scholarly work). Use `editorial` verification for synthesis of sources; hedge where scholars disagree (“probably”, “most scholars date…”). |
| `literary` | Structure, chiasm, parallelism, argument | Observations must be checkable in the text. Contested proposals (e.g. a chiasm) are presented as “some interpreters see…”. |
| `quotation` | Exact words of a named author | ONLY if (a) the source is public domain / openly licensed or the excerpt is short and properly attributed, (b) you fetched the actual text and matched it verbatim, (c) you give locator + a working URL. Set `verification: 'verified'`. |
| `summary` | Paraphrase of a named work | Accurate to what the work actually argues. Never in quotation marks. Give title, year, locator (chapter/sermon) and a real link (publisher page, free article, archive). |
| `synthesis` | Anything written for Emmaus | Label it. Cite what it rests on (Scripture refs as `bsb` citations with locators, lexicons, commentaries). |
| `dataset` | Machine-derived (e.g. OpenBible cross-refs) | Label “not individually reviewed”. |

## 2. Quotations — the strict rule

1. Public domain (Augustine, Chrysostom, Aquinas in 1920s Dominican trans., Luther in public-domain translations, Calvin, Owen, Henry, Wesley, Edwards, Spurgeon, Maclaren, F. B. Meyer, creeds/confessions): you may quote **after verifying the exact wording** in an accessible copy (CCEL, New Advent, Spurgeon Center/spurgeon.org, archive.org, Project Gutenberg, the Free Use Bible API commentaries). Record the edition/translation.
2. Copyrighted modern authors (Keller, Piper, Stott, Packer, Sproul, N. T. Wright, Carson, C. S. Lewis, Billy Graham, Bonhoeffer in modern translation, the Catholic Catechism…): **summaries only** (`kind: 'summary'`), with the work’s real title, year, publisher and a real URL (publisher/product page, the author’s ministry site article, or a library record). Do not reproduce distinctive phrases.
3. If a famous line cannot be verified in a real copy, do not use it as a quotation. Either summarise, or leave it out.
4. Never attribute a view to an author unless you are confident it is theirs and in the cited work. Prefer fewer, well-grounded entries over many shaky ones.

## 3. URLs

Use real, stable URLs you have actually opened (HTTP 200) during authoring: CCEL (ccel.org), New Advent Fathers (newadvent.org/fathers), spurgeon.org / Spurgeon Center, desiringgod.org, ligonier.org, thegospelcoalition.org, timothykeller.com / gospelinlife.com, ntwrightpage.com, publisher pages, Project Gutenberg, archive.org, Wikipedia (only for basic bibliographic/biographical facts). No guessed deep links.

## 4. Theological perspectives

- Present traditions as their own best representatives would recognise them (steel-man, not straw-man). Equal care for Reformed, Arminian/Wesleyan, Lutheran, Catholic, Eastern Orthodox and other positions *where genuinely relevant*.
- Mark the level: broad Christian consensus, denominational difference, historical debate, interpretive uncertainty.
- Do not force a “perspectives” block where Christians broadly agree.
- Where appropriate cite confessional sources (Westminster Confession 1646, Canons of Dort 1619, Council of Trent 1547, Articles of Remonstrance 1610, Augsburg Confession 1530, the Nicene Creed 381) — these are public domain.

## 5. Word studies

Context is primary. Every key word card should say why the word matters **in this passage** and, where relevant, include a caution against the root fallacy / illegitimate totality transfer (e.g. *agapē* is not a special “divine love” word in every use).

## 6. Licensing summary for the bundled data

| Data | Source | License |
|---|---|---|
| BSB, KJV, WEB | Free Use Bible API (bible.helloao.org) | Public domain |
| Tagged Hebrew/Greek (TAHOT/TAGNT), lexicons (TBESH/TBESG) | STEPBible.org / Tyndale House Cambridge | CC BY 4.0 — attribution shown in Sources |
| Cross references | OpenBible.info | CC BY 4.0 |
| Tyndale Open Study Notes (notes + book introductions) | Tyndale House Publishers | CC BY-SA 4.0 |
| Calvin, Matthew Henry, JFB, Keil & Delitzsch, Clarke, Gill | Free Use Bible API | Public domain |

The future production product will need a formal source/licensing policy per provider; the data model (`License.usage`) already encodes what each source permits.
