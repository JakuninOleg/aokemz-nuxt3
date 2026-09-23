# Graph Report - aokemz-nuxt3  (2026-09-23)

## Corpus Check
- 140 files · ~7,323,460 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 642 nodes · 833 edges · 63 communities (48 shown, 15 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `26c0e545`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CategorySpecifications.vue
- Дизайн-система КЭМЗ
- kemz-capabilities_bc7423f0.md
- Form.vue
- aboutContent.ts
- package.json
- check-category.cjs
- [product].vue
- [category]/index.vue
- ProductPage.vue
- [new].vue
- Nuxt Minimal Starter
- homeContent.ts
- tsconfig.json
- server/tsconfig.json
- AboutCta.vue
- prepare-home-assets.cjs
- app.vue
- contactsContent.ts
- check-home.cjs
- AppFooter.vue
- HomeEngineeringIcon.vue
- .eslintrc.cjs
- extract.js
- HomeActionButton.vue
- prepare-home-assets.cjs
- _extract_static.py
- Doc
- nitro-config.d.ts
- check-about.cjs
- check-category.cjs
- siteSeo.ts
- AppHeader.vue
- error.vue
- homeContent.ts
- assets/README.md
- check-home.cjs
- postcss.mjs
- pages/README.md
- HomeHero.vue
- AboutOutlineIcon.vue
- HomeActionButton.vue
- HomeHero.vue
- .eslintrc.cjs
- leaflet
- assets/README.md
- HomeCapabilities.vue
- HomeProduction.vue
- nuxt.config.ts
- production/index.vue

## God Nodes (most connected - your core abstractions)
1. `validateContactField()` - 13 edges
2. `КЭМЗ hybrid industrial design` - 10 edges
3. `catalogItem` - 9 edges
4. `renderContentfulHtml()` - 9 edges
5. `Работа с сайтом КЭМЗ` - 9 edges
6. `Дизайн-система КЭМЗ` - 9 edges
7. `ОАО КЭМЗ — факты и контент для сайта` - 9 edges
8. `validateContactLead()` - 8 edges
9. `canonicalUrl()` - 8 edges
10. `apply()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `onConsentChange()` --calls--> `validateContactField()`  [EXTRACTED]
  components/Form.vue → utils/contactValidation.ts
- `onBlur()` --calls--> `validateContactField()`  [EXTRACTED]
  components/contacts/ContactsSalesForm.vue → utils/contactValidation.ts
- `onEdit()` --calls--> `validateContactField()`  [EXTRACTED]
  components/contacts/ContactsSalesForm.vue → utils/contactValidation.ts
- `onConsentChange()` --calls--> `validateContactField()`  [EXTRACTED]
  components/contacts/ContactsSalesForm.vue → utils/contactValidation.ts
- `usePageSeo()` --calls--> `breadcrumbJsonLd()`  [EXTRACTED]
  composables/usePageSeo.ts → utils/siteSeo.ts

## Import Cycles
- None detected.

## Communities (63 total, 15 thin omitted)

### Community 0 - "CategorySpecifications.vue"
Cohesion: 0.10
Nodes (30): apply(), caretAfterDigitCount(), clearIncomplete(), digitCountBefore(), emit, formatFromDigits(), formattedPhone, inputEl (+22 more)

### Community 1 - "Дизайн-система КЭМЗ"
Cohesion: 0.05
Nodes (46): categoriesModel, query, typesModel, emit, items, props, selectedType, types (+38 more)

### Community 2 - "kemz-capabilities_bc7423f0.md"
Cohesion: 0.06
Nodes (34): eslint, eslint-config-prettier, eslint-plugin-prettier, eslint-plugin-vue, devDependencies, eslint, eslint-config-prettier, eslint-plugin-prettier (+26 more)

### Community 3 - "Form.vue"
Cohesion: 0.09
Nodes (23): titleLines, titleLines, titleLines, titleLines, ABOUT_CAPABILITIES, ABOUT_CYCLE, ABOUT_CYCLE_MEDIA, ABOUT_FACTS (+15 more)

### Community 4 - "aboutContent.ts"
Cohesion: 0.06
Nodes (30): Email HTML, Form block, Grid, Layout & component patterns, Product hotspot, Shell, Direction, Hard rules (+22 more)

### Community 5 - "package.json"
Cohesion: 0.05
Nodes (55): clearForm(), errors, form, onBlur(), onConsentChange(), onEdit(), sending, sent (+47 more)

### Community 7 - "check-category.cjs"
Cohesion: 0.09
Nodes (23): contentful, @contentful/rich-text-html-renderer, @contentful/rich-text-types, leaflet, nodemailer, nuxt, @nuxtjs/tailwindcss, dependencies (+15 more)

### Community 8 - "[product].vue"
Cohesion: 0.08
Nodes (28): Article, { $contentful }, cmsImageAlt, cmsImageUrl, dateLabel, figureAlt, figureSrc, id (+20 more)

### Community 10 - "ProductPage.vue"
Cohesion: 0.10
Nodes (26): categorySlug, descriptionHtml, Entry, imageUrl, leadText, paramsHtml, ProductFields, productId (+18 more)

### Community 11 - "[new].vue"
Cohesion: 0.13
Nodes (13): Keep, Phrases to cut (EN), Phrases to cut (RU), Punctuation tells, Stop-slop references (compact), Structures to avoid, Core rules (global), Examples (+5 more)

### Community 12 - "Nuxt Minimal Starter"
Cohesion: 0.13
Nodes (14): Главная, Дизайн-система КЭМЗ, Документы, новости и контакты, Каталог, категория и продукт, Композиция ключевых страниц, Контроль качества на каждой ключевой странице, Образ бренда, Повторяющиеся интерфейсные паттерны (+6 more)

### Community 14 - "homeContent.ts"
Cohesion: 0.09
Nodes (19): customers, facts, Category, { $contentful }, products, tiles, HOME_CAPABILITIES, HOME_GEO_REGIONS (+11 more)

### Community 15 - "tsconfig.json"
Cohesion: 0.14
Nodes (11): visible, emit, activeId, syncFromHash(), COOKIE_BANNER, LEGAL_CTA, LEGAL_DOWNLOAD, LEGAL_HERO (+3 more)

### Community 16 - "server/tsconfig.json"
Cohesion: 0.18
Nodes (10): closeMenu(), currentPath, drawerClose, drawerPanel, drawerToggle, isHome, { links, salesPhoneDisplay, salesPhoneHref, salesEmail, isActiveLink }, menuOpen (+2 more)

### Community 19 - "AboutCta.vue"
Cohesion: 0.20
Nodes (9): Git, Визуальное направление, Маршруты, данные и SEO, Назначение и границы изменений, Обязательный порядок UI-работы, Проверка перед передачей, Работа с сайтом КЭМЗ, Стек и архитектурные инварианты (+1 more)

### Community 20 - "prepare-home-assets.cjs"
Cohesion: 0.22
Nodes (5): CmsEntry, CmsResponse, SitemapEntry, STATIC_PATHS, getPublicContentfulClient()

### Community 22 - "app.vue"
Cohesion: 0.44
Nodes (6): PRODUCTION_CAPABILITIES, PRODUCTION_CTA, PRODUCTION_GALLERY, PRODUCTION_HERO, PRODUCTION_QUALITY, PRODUCTION_STAGES

### Community 23 - "contactsContent.ts"
Cohesion: 0.23
Nodes (8): iconPaths, ContactEntry, ContactPhone, CONTACTS_ADDRESS, CONTACTS_DIRECTORY, CONTACTS_FORM, CONTACTS_HERO, CONTACTS_LIST

### Community 24 - "check-home.cjs"
Cohesion: 0.33
Nodes (6): fs, main(), outDir, path, { PDFParse }, staticDir

### Community 25 - "AppFooter.vue"
Cohesion: 0.33
Nodes (5): isPublicSite, { links, salesPhoneDisplay, salesPhoneHref, salesEmail }, normalizedPath, route, year

### Community 26 - "HomeEngineeringIcon.vue"
Cohesion: 0.33
Nodes (5): Ассеты, Главная КЭМЗ: реализация нового референса, Компоненты и данные, Отличия от изображения, Проверки

### Community 27 - ".eslintrc.cjs"
Cohesion: 0.29
Nodes (6): Prompt, Prompt, `public/media/production/production-drive-hero-v1.png`, `public/media/production/production-factory-hero-v2.png`, `public/media/production/real/*`, Ассеты страницы `/production`

### Community 28 - "extract.js"
Cohesion: 0.40
Nodes (5): assert, { chromium }, fs, main(), viewports

### Community 29 - "HomeActionButton.vue"
Cohesion: 0.40
Nodes (5): geoToMapPercent(), MAP_GEO_BOUNDS, sitesWithMapPosition(), SUPPLY_SITES, SupplySite

### Community 30 - "prepare-home-assets.cjs"
Cohesion: 0.31
Nodes (4): DocumentItem, DOCUMENTS_CTA, DOCUMENTS_HERO, DOCUMENTS_LIST

### Community 32 - "_extract_static.py"
Cohesion: 0.70
Nodes (4): extract_docx(), extract_pdf(), main(), Path

### Community 33 - "Doc"
Cohesion: 0.60
Nodes (3): FPDF, Doc, main()

### Community 34 - "nitro-config.d.ts"
Cohesion: 0.40
Nodes (4): Development Server, Nuxt Minimal Starter, Production, Setup

### Community 35 - "check-about.cjs"
Cohesion: 0.40
Nodes (3): { chromium }, fs, viewports

### Community 36 - "check-category.cjs"
Cohesion: 0.50
Nodes (4): assert, { chromium }, fs, main()

### Community 37 - "siteSeo.ts"
Cohesion: 0.50
Nodes (4): assert, { chromium }, fs, main()

### Community 38 - "AppHeader.vue"
Cohesion: 0.50
Nodes (4): assert, { chromium }, fs, main()

### Community 39 - "error.vue"
Cohesion: 0.50
Nodes (4): fs, main(), path, sharp

### Community 46 - "postcss.mjs"
Cohesion: 0.67
Nodes (3): assert, { chromium }, main()

### Community 47 - "pages/README.md"
Cohesion: 0.67
Nodes (3): assert, { chromium }, main()

## Knowledge Gaps
- **300 isolated node(s):** `{ links, salesPhoneDisplay, salesPhoneHref, salesEmail }`, `year`, `route`, `normalizedPath`, `isPublicSite` (+295 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `validateContactField()` connect `package.json` to `CategorySpecifications.vue`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Why does `validateContactLead()` connect `package.json` to `CategorySpecifications.vue`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `ContactLeadField` connect `package.json` to `CategorySpecifications.vue`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **What connects `{ links, salesPhoneDisplay, salesPhoneHref, salesEmail }`, `year`, `route` to the rest of the system?**
  _300 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CategorySpecifications.vue` be split into smaller, more focused modules?**
  _Cohesion score 0.1021021021021021 - nodes in this community are weakly interconnected._
- **Should `Дизайн-система КЭМЗ` be split into smaller, more focused modules?**
  _Cohesion score 0.05141242937853107 - nodes in this community are weakly interconnected._
- **Should `kemz-capabilities_bc7423f0.md` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._