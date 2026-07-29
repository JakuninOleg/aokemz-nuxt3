# Graph Report - aokemz-nuxt3  (2026-07-29)

## Corpus Check
- 65 files · ~729,540 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 313 nodes · 305 edges · 55 communities (38 shown, 17 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `28f1282c`
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
- contacts/index.vue
- news/index.vue
- pages/README.md
- about/index.vue
- sendMail.post.ts
- _extract_static.py
- Stop slop (КЭМЗ)
- Design proposal: hybrid redesign (for morning review)
- documents/index.vue
- package.json
- AppHeader.vue
- error.vue
- AppFooter.vue
- useSiteNav.ts
- HomeCapabilities.vue
- HomeDirections.vue
- HomeTrust.vue
- new-layout-2.vue
- DemoSwitcher.vue
- new-layouts/index.vue

## God Nodes (most connected - your core abstractions)
1. `Design proposal: hybrid redesign (for morning review)` - 12 edges
2. `КЭМЗ hybrid industrial design` - 10 edges
3. `ОАО КЭМЗ — факты и контент для сайта` - 9 edges
4. `apply()` - 7 edges
5. `scripts` - 7 edges
6. `Stop slop (КЭМЗ)` - 7 edges
7. `onBlur()` - 6 edges
8. `formatRuPhoneDisplay()` - 6 edges
9. `Layout & component patterns` - 6 edges
10. `Stop-slop references (compact)` - 6 edges

## Surprising Connections (you probably didn't know these)
- `buildLeadEmail()` --calls--> `formatRuPhoneDisplay()`  [EXTRACTED]
  server/utils/leadEmail.ts → utils/contactValidation.ts
- `submit()` --calls--> `validateContactLead()`  [EXTRACTED]
  components/Form.vue → utils/contactValidation.ts
- `toRuDigits()` --calls--> `digitsOnly()`  [EXTRACTED]
  components/InputPhone.vue → utils/contactValidation.ts
- `onBlur()` --calls--> `formatRuPhoneDisplay()`  [EXTRACTED]
  components/InputPhone.vue → utils/contactValidation.ts
- `onBlur()` --calls--> `normalizeRuPhone()`  [EXTRACTED]
  components/InputPhone.vue → utils/contactValidation.ts

## Import Cycles
- None detected.

## Communities (55 total, 17 thin omitted)

### Community 0 - "dependencies"
Cohesion: 0.06
Nodes (35): contentful, @contentful/rich-text-html-renderer, @contentful/rich-text-types, csv-parse, nodemailer, nuxt, @nuxtjs/pwa, @nuxtjs/svg (+27 more)

### Community 1 - "ОАО КЭМЗ — факты и контент для сайта"
Cohesion: 0.18
Nodes (11): Ассеты, Деплой / почта заявок, Документы владельцев в `static/` (первичный источник), История / люди (проверено, осторожно в маркетинге), ОАО КЭМЗ — факты и контент для сайта, Продукция (каталог + открытые источники), Производственные возможности (`Возможности КЭМЗ.docx`), Сгенерированные / выдуманные ассеты (+3 more)

### Community 2 - "Nav.vue"
Cohesion: 0.15
Nodes (7): emit, route, toggleMenu(), route, links, { links: siteLinks }, menuOpened

### Community 3 - "Form.vue"
Cohesion: 0.10
Nodes (22): applyFieldErrors(), clearFieldErrors(), email, error, fieldErrors, loader, message, name (+14 more)

### Community 4 - "devDependencies"
Cohesion: 0.08
Nodes (24): eslint, eslint-config-prettier, eslint-plugin-prettier, eslint-plugin-vue, devDependencies, eslint, eslint-config-prettier, eslint-plugin-prettier (+16 more)

### Community 5 - "package.json"
Cohesion: 0.22
Nodes (18): apply(), caretAfterDigitCount(), clearIncomplete(), digitCountBefore(), emit, formatFromDigits(), formattedPhone, inputEl (+10 more)

### Community 6 - "КЭМЗ hybrid industrial design"
Cohesion: 0.11
Nodes (16): Email HTML, Form block, Grid, Layout & component patterns, Product hotspot, Shell, Direction, Hard rules (+8 more)

### Community 7 - "InputPhone.vue"
Cohesion: 0.25
Nodes (6): links, { links: nav, isActiveLink }, open, route, { trust, directions, caps, media }, year

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

### Community 19 - "contacts/index.vue"
Cohesion: 0.50
Nodes (3): Contact, contacts, Phone

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
Cohesion: 0.14
Nodes (13): Blockers only you can clear, Current map, Design proposal: hybrid redesign (for morning review), i18n EN/RU (for employers), Implemented overnight (branch `feature/hybrid-redesign`), Live demos (branch `feature/hybrid-redesign`), Option A: “Precision plant” (recommended), Option B: “Awwards dark” (+5 more)

### Community 37 - "package.json"
Cohesion: 0.40
Nodes (4): links, { links: nav }, scrolled, { trust, directions, caps, media }

### Community 38 - "AppHeader.vue"
Cohesion: 0.29
Nodes (5): { links, salesPhoneDisplay, salesPhoneHref, salesEmail, isActiveLink }, menuOpen, route, scrolled, scrollPast

### Community 39 - "error.vue"
Cohesion: 0.50
Nodes (3): description, props, title

### Community 51 - "new-layout-2.vue"
Cohesion: 0.50
Nodes (3): links, { links: nav }, { trust, directions, caps, media }

## Knowledge Gaps
- **171 isolated node(s):** `{ links, salesPhoneDisplay, salesPhoneHref, salesEmail }`, `year`, `route`, `{ links, salesPhoneDisplay, salesPhoneHref, salesEmail, isActiveLink }`, `menuOpen` (+166 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `devDependencies`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **What connects `{ links, salesPhoneDisplay, salesPhoneHref, salesEmail }`, `year`, `route` to the rest of the system?**
  _171 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._
- **Should `Form.vue` be split into smaller, more focused modules?**
  _Cohesion score 0.10317460317460317 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `КЭМЗ hybrid industrial design` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `Stop slop (КЭМЗ)` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._