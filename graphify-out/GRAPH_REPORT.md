# Graph Report - aokemz-nuxt3  (2026-07-30)

## Corpus Check
- 65 files · ~124,176 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 319 nodes · 368 edges · 34 communities (26 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `cf44d30c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dependencies
- leadEmail.ts
- Form.vue
- aboutContent.ts
- package.json
- КЭМЗ hybrid industrial design
- HomeSupplyMap.vue
- [product].vue
- [category]/index.vue
- Agent notes — aokemz-nuxt3
- [new].vue
- Nuxt Minimal Starter
- tsconfig.json
- server/tsconfig.json
- assets/README.md
- layouts/README.md
- pages/README.md
- contentful.ts
- sendMail.post.ts
- _extract_static.py
- Stop slop (КЭМЗ)
- legalContent.ts
- AppHeader.vue
- error.vue
- AppFooter.vue
- useSiteNav.ts
- HomeCapabilities.vue
- InputPhone.vue

## God Nodes (most connected - your core abstractions)
1. `validateContactField()` - 11 edges
2. `КЭМЗ hybrid industrial design` - 10 edges
3. `ОАО КЭМЗ — факты и контент для сайта` - 9 edges
4. `apply()` - 7 edges
5. `scripts` - 7 edges
6. `Stop slop (КЭМЗ)` - 7 edges
7. `onBlur()` - 6 edges
8. `digitsOnly()` - 6 edges
9. `formatRuPhoneDisplay()` - 6 edges
10. `validateContactLead()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `onConsentChange()` --calls--> `validateContactField()`  [EXTRACTED]
  components/Form.vue → utils/contactValidation.ts
- `onBlur()` --calls--> `validateContactField()`  [EXTRACTED]
  components/home/HomeContactLead.vue → utils/contactValidation.ts
- `onEdit()` --calls--> `validateContactField()`  [EXTRACTED]
  components/home/HomeContactLead.vue → utils/contactValidation.ts
- `onConsentChange()` --calls--> `validateContactField()`  [EXTRACTED]
  components/home/HomeContactLead.vue → utils/contactValidation.ts
- `onBlur()` --calls--> `validateContactField()`  [EXTRACTED]
  components/Form.vue → utils/contactValidation.ts

## Import Cycles
- None detected.

## Communities (34 total, 8 thin omitted)

### Community 0 - "dependencies"
Cohesion: 0.09
Nodes (23): contentful, @contentful/rich-text-html-renderer, @contentful/rich-text-types, nodemailer, nuxt, @nuxtjs/tailwindcss, dependencies, contentful (+15 more)

### Community 1 - "leadEmail.ts"
Cohesion: 0.18
Nodes (11): Ассеты, Деплой / почта заявок, Документы владельцев в `static/` (первичный источник), История / люди (проверено, осторожно в маркетинге), ОАО КЭМЗ — факты и контент для сайта, Продукция (каталог + открытые источники), Производственные возможности (`Возможности КЭМЗ.docx`), Сгенерированные / выдуманные ассеты (в проде) (+3 more)

### Community 3 - "Form.vue"
Cohesion: 0.10
Nodes (29): consent, email, error, fieldErrors, fieldValues(), loader, message, name (+21 more)

### Community 4 - "aboutContent.ts"
Cohesion: 0.14
Nodes (12): ABOUT_CYCLE, ABOUT_FACTS, ABOUT_GALLERY, ABOUT_HERO, ABOUT_LINES, ABOUT_PLANT, ABOUT_STORY, AboutCycleStep (+4 more)

### Community 5 - "package.json"
Cohesion: 0.08
Nodes (24): eslint, eslint-config-prettier, eslint-plugin-prettier, eslint-plugin-vue, devDependencies, eslint, eslint-config-prettier, eslint-plugin-prettier (+16 more)

### Community 6 - "КЭМЗ hybrid industrial design"
Cohesion: 0.11
Nodes (16): Email HTML, Form block, Grid, Layout & component patterns, Product hotspot, Shell, Direction, Hard rules (+8 more)

### Community 7 - "HomeSupplyMap.vue"
Cohesion: 0.21
Nodes (8): failed, fallbackSites, mapRoot, geoToMapPercent(), MAP_GEO_BOUNDS, sitesWithMapPosition(), SUPPLY_SITES, SupplySite

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

### Community 37 - "legalContent.ts"
Cohesion: 0.09
Nodes (11): emit, Contact, contacts, Phone, docs, NewsEntry, ContentfulEntry, filteredCategories (+3 more)

### Community 38 - "AppHeader.vue"
Cohesion: 0.29
Nodes (6): closeMenu(), currentPath, { links, salesPhoneDisplay, salesPhoneHref, salesEmail, isActiveLink }, menuOpen, nuxtApp, onKeydown()

### Community 39 - "error.vue"
Cohesion: 0.50
Nodes (3): description, props, title

### Community 42 - "HomeCapabilities.vue"
Cohesion: 0.12
Nodes (16): activeProduct, currentProduct, tabsEl, HOME_CAPABILITIES, HOME_GEO_REGIONS, HOME_PROCESS, HOME_PROCESS_PHOTOS, HOME_PRODUCTS (+8 more)

### Community 57 - "InputPhone.vue"
Cohesion: 0.11
Nodes (29): apply(), caretAfterDigitCount(), clearIncomplete(), digitCountBefore(), emit, formatFromDigits(), formattedPhone, inputEl (+21 more)

## Knowledge Gaps
- **154 isolated node(s):** `{ links, salesPhoneDisplay, salesPhoneHref, salesEmail }`, `year`, `nuxtApp`, `{ links, salesPhoneDisplay, salesPhoneHref, salesEmail, isActiveLink }`, `menuOpen` (+149 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `{ links, salesPhoneDisplay, salesPhoneHref, salesEmail }`, `year`, `nuxtApp` to the rest of the system?**
  _154 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `Form.vue` be split into smaller, more focused modules?**
  _Cohesion score 0.0989247311827957 - nodes in this community are weakly interconnected._
- **Should `aboutContent.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1368421052631579 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `КЭМЗ hybrid industrial design` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._