# Graph Report - aokemz-nuxt3  (2026-07-29)

## Corpus Check
- 48 files · ~510,272 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 258 nodes · 269 edges · 37 communities (28 shown, 9 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `072a9116`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dependencies
- ОАО КЭМЗ — факты и контент для сайта
- Nav.vue
- Form.vue
- devDependencies
- package.json
- КЭМЗ hybrid industrial design
- InputPhone.vue
- [product].vue
- [category]/index.vue
- Agent notes — aokemz-nuxt3
- [new].vue
- Nuxt Minimal Starter
- MenuLink.vue
- products/index.vue
- tsconfig.json
- server/tsconfig.json
- assets/README.md
- layouts/README.md
- news/index.vue
- pages/README.md
- sendMail.post.ts
- _extract_static.py
- Stop slop (КЭМЗ)
- Design proposal: hybrid redesign (for morning review)
- documents/index.vue

## God Nodes (most connected - your core abstractions)
1. `КЭМЗ hybrid industrial design` - 10 edges
2. `Design proposal: hybrid redesign (for morning review)` - 10 edges
3. `ОАО КЭМЗ — факты и контент для сайта` - 9 edges
4. `apply()` - 7 edges
5. `scripts` - 7 edges
6. `Stop slop (КЭМЗ)` - 7 edges
7. `onBlur()` - 6 edges
8. `formatRuPhoneDisplay()` - 6 edges
9. `Layout & component patterns` - 6 edges
10. `Stop-slop references (compact)` - 6 edges

## Surprising Connections (you probably didn't know these)
- `onBlur()` --calls--> `formatRuPhoneDisplay()`  [EXTRACTED]
  components/InputPhone.vue → utils/contactValidation.ts
- `submit()` --calls--> `validateContactLead()`  [EXTRACTED]
  components/Form.vue → utils/contactValidation.ts
- `toRuDigits()` --calls--> `digitsOnly()`  [EXTRACTED]
  components/InputPhone.vue → utils/contactValidation.ts
- `onBlur()` --calls--> `normalizeRuPhone()`  [EXTRACTED]
  components/InputPhone.vue → utils/contactValidation.ts
- `buildLeadEmail()` --calls--> `formatRuPhoneDisplay()`  [EXTRACTED]
  server/utils/leadEmail.ts → utils/contactValidation.ts

## Import Cycles
- None detected.

## Communities (37 total, 9 thin omitted)

### Community 0 - "dependencies"
Cohesion: 0.06
Nodes (35): contentful, @contentful/rich-text-html-renderer, @contentful/rich-text-types, csv-parse, nodemailer, nuxt, @nuxtjs/pwa, @nuxtjs/svg (+27 more)

### Community 1 - "ОАО КЭМЗ — факты и контент для сайта"
Cohesion: 0.18
Nodes (11): Ассеты, Деплой / почта заявок, Документы владельцев в `static/` (первичный источник), История / люди (проверено, осторожно в маркетинге), ОАО КЭМЗ — факты и контент для сайта, Продукция (каталог + открытые источники), Производственные возможности (`Возможности КЭМЗ.docx`), Сгенерированные / выдуманные ассеты (+3 more)

### Community 2 - "Nav.vue"
Cohesion: 0.15
Nodes (6): emit, route, toggleMenu(), route, links, menuOpened

### Community 3 - "Form.vue"
Cohesion: 0.13
Nodes (13): applyFieldErrors(), clearFieldErrors(), email, error, fieldErrors, loader, message, name (+5 more)

### Community 4 - "devDependencies"
Cohesion: 0.08
Nodes (24): eslint, eslint-config-prettier, eslint-plugin-prettier, eslint-plugin-vue, devDependencies, eslint, eslint-config-prettier, eslint-plugin-prettier (+16 more)

### Community 5 - "package.json"
Cohesion: 0.22
Nodes (17): apply(), caretAfterDigitCount(), clearIncomplete(), digitCountBefore(), emit, formatFromDigits(), formattedPhone, inputEl (+9 more)

### Community 6 - "КЭМЗ hybrid industrial design"
Cohesion: 0.11
Nodes (16): Email HTML, Form block, Grid, Layout & component patterns, Product hotspot, Shell, Direction, Hard rules (+8 more)

### Community 7 - "InputPhone.vue"
Cohesion: 0.21
Nodes (10): buildLeadEmail(), escapeHtml(), formatMoscowTime(), Bucket, buckets, checkRateLimit(), ContactLead, ContactLeadInput (+2 more)

### Community 8 - "[product].vue"
Cohesion: 0.28
Nodes (7): ContentfulEntry, descriptionHtml, paramsHtml, productId, route, assetUrl(), renderContentfulHtml()

### Community 9 - "[category]/index.vue"
Cohesion: 0.33
Nodes (5): ContentfulEntry, error, pending, products, route

### Community 10 - "Agent notes — aokemz-nuxt3"
Cohesion: 0.40
Nodes (4): Agent notes — aokemz-nuxt3, Cursor rules, Design skill, graphify

### Community 11 - "[new].vue"
Cohesion: 0.40
Nodes (4): id, NewsEntry, richTextHtml, route

### Community 12 - "Nuxt Minimal Starter"
Cohesion: 0.40
Nodes (4): Development Server, Nuxt Minimal Starter, Production, Setup

### Community 28 - "sendMail.post.ts"
Cohesion: 0.33
Nodes (6): fs, main(), outDir, path, { PDFParse }, staticDir

### Community 32 - "_extract_static.py"
Cohesion: 0.70
Nodes (4): extract_docx(), extract_pdf(), main(), Path

### Community 33 - "Stop slop (КЭМЗ)"
Cohesion: 0.13
Nodes (13): Keep, Phrases to cut (EN), Phrases to cut (RU), Punctuation tells, Stop-slop references (compact), Structures to avoid, Core rules (global), Examples (+5 more)

### Community 34 - "Design proposal: hybrid redesign (for morning review)"
Cohesion: 0.18
Nodes (10): Blockers only you can clear, Current map, Design proposal: hybrid redesign (for morning review), i18n EN/RU (for employers), Option A: “Precision plant” (recommended), Option B: “Awwards dark”, Option C: Keep left rail, restyle, Product tables (mobile) (+2 more)

## Knowledge Gaps
- **133 isolated node(s):** `route`, `name`, `phone`, `email`, `message` (+128 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `devDependencies`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **What connects `route`, `name`, `phone` to the rest of the system?**
  _133 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._
- **Should `Form.vue` be split into smaller, more focused modules?**
  _Cohesion score 0.1286549707602339 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `КЭМЗ hybrid industrial design` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `Stop slop (КЭМЗ)` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._