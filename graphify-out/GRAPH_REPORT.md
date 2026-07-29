# Graph Report - aokemz-nuxt3  (2026-07-29)

## Corpus Check
- 42 files · ~508,426 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 219 nodes · 218 edges · 33 communities (25 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `dabfc0d0`
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

## God Nodes (most connected - your core abstractions)
1. `КЭМЗ hybrid industrial design` - 10 edges
2. `ОАО КЭМЗ — факты и контент для сайта` - 9 edges
3. `scripts` - 7 edges
4. `formatRuPhoneDisplay()` - 6 edges
5. `Layout & component patterns` - 6 edges
6. `buildLeadEmail()` - 5 edges
7. `digitsOnly()` - 5 edges
8. `submit()` - 4 edges
9. `normalizeRuPhone()` - 4 edges
10. `validateContactLead()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `formatPhone()` --calls--> `digitsOnly()`  [EXTRACTED]
  components/InputPhone.vue → utils/contactValidation.ts
- `submit()` --calls--> `validateContactLead()`  [EXTRACTED]
  components/Form.vue → utils/contactValidation.ts
- `blurPhone()` --calls--> `formatRuPhoneDisplay()`  [EXTRACTED]
  components/InputPhone.vue → utils/contactValidation.ts
- `blurPhone()` --calls--> `normalizeRuPhone()`  [EXTRACTED]
  components/InputPhone.vue → utils/contactValidation.ts
- `buildLeadEmail()` --calls--> `formatRuPhoneDisplay()`  [EXTRACTED]
  server/utils/leadEmail.ts → utils/contactValidation.ts

## Import Cycles
- None detected.

## Communities (33 total, 8 thin omitted)

### Community 0 - "dependencies"
Cohesion: 0.06
Nodes (35): contentful, @contentful/rich-text-html-renderer, @contentful/rich-text-types, csv-parse, nodemailer, nuxt, @nuxtjs/pwa, @nuxtjs/svg (+27 more)

### Community 1 - "ОАО КЭМЗ — факты и контент для сайта"
Cohesion: 0.18
Nodes (11): Ассеты, Документы владельцев в `static/` (первичный источник), История / люди (проверено, осторожно в маркетинге), ОАО КЭМЗ — факты и контент для сайта, Полезные ссылки, Продукция (каталог + открытые источники), Производственные возможности (`Возможности КЭМЗ.docx`), Сгенерированные / выдуманные ассеты (+3 more)

### Community 2 - "Nav.vue"
Cohesion: 0.15
Nodes (6): emit, route, toggleMenu(), route, links, menuOpened

### Community 3 - "Form.vue"
Cohesion: 0.13
Nodes (13): applyFieldErrors(), clearFieldErrors(), email, error, fieldErrors, loader, message, name (+5 more)

### Community 4 - "devDependencies"
Cohesion: 0.15
Nodes (13): eslint, eslint-config-prettier, eslint-plugin-prettier, eslint-plugin-vue, devDependencies, eslint, eslint-config-prettier, eslint-plugin-prettier (+5 more)

### Community 5 - "package.json"
Cohesion: 0.17
Nodes (11): license, name, private, scripts, build, dev, generate, lint (+3 more)

### Community 6 - "КЭМЗ hybrid industrial design"
Cohesion: 0.11
Nodes (16): Email HTML, Form block, Grid, Layout & component patterns, Product hotspot, Shell, Direction, Hard rules (+8 more)

### Community 7 - "InputPhone.vue"
Cohesion: 0.13
Nodes (18): blurPhone(), emit, formatPhone(), formattedPhone, phone, props, buildLeadEmail(), escapeHtml() (+10 more)

### Community 8 - "[product].vue"
Cohesion: 0.29
Nodes (5): ContentfulEntry, options, richTextHtml, richTextHtml2, route

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

## Knowledge Gaps
- **112 isolated node(s):** `route`, `name`, `phone`, `email`, `message` (+107 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **What connects `route`, `name`, `phone` to the rest of the system?**
  _112 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._
- **Should `Form.vue` be split into smaller, more focused modules?**
  _Cohesion score 0.1286549707602339 - nodes in this community are weakly interconnected._
- **Should `КЭМЗ hybrid industrial design` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `InputPhone.vue` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._