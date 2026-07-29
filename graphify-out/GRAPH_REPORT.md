# Graph Report - aokemz-nuxt3  (2026-07-29)

## Corpus Check
- 37 files · ~506,742 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 182 nodes · 156 edges · 32 communities (24 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1808946f`
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

## God Nodes (most connected - your core abstractions)
1. `КЭМЗ hybrid industrial design` - 10 edges
2. `ОАО КЭМЗ — факты и контент для сайта` - 8 edges
3. `scripts` - 7 edges
4. `Layout & component patterns` - 6 edges
5. `Agent notes — aokemz-nuxt3` - 4 edges
6. `Nuxt Minimal Starter` - 4 edges
7. `emit` - 2 edges
8. `toggleMenu()` - 2 edges
9. `error` - 2 edges
10. `submit()` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (32 total, 8 thin omitted)

### Community 0 - "dependencies"
Cohesion: 0.06
Nodes (33): contentful, @contentful/rich-text-html-renderer, @contentful/rich-text-types, csv-parse, nodemailer, nuxt, @nuxtjs/pwa, @nuxtjs/svg (+25 more)

### Community 1 - "ОАО КЭМЗ — факты и контент для сайта"
Cohesion: 0.11
Nodes (15): Email HTML, Form block, Grid, Layout & component patterns, Product hotspot, Shell, Ассеты, История / люди (проверено, осторожно в маркетинге) (+7 more)

### Community 2 - "Nav.vue"
Cohesion: 0.15
Nodes (6): emit, route, toggleMenu(), route, links, menuOpened

### Community 3 - "Form.vue"
Cohesion: 0.15
Nodes (8): email, error, loader, message, name, phone, sent, submit()

### Community 4 - "devDependencies"
Cohesion: 0.15
Nodes (13): eslint, eslint-config-prettier, eslint-plugin-prettier, eslint-plugin-vue, devDependencies, eslint, eslint-config-prettier, eslint-plugin-prettier (+5 more)

### Community 5 - "package.json"
Cohesion: 0.17
Nodes (11): license, name, private, scripts, build, dev, generate, lint (+3 more)

### Community 6 - "КЭМЗ hybrid industrial design"
Cohesion: 0.20
Nodes (10): Direction, Hard rules, Imagery, Implementation notes, More detail, Motion, Section recipe (homepage), Tokens (baseline) (+2 more)

### Community 7 - "InputPhone.vue"
Cohesion: 0.25
Nodes (4): emit, formattedPhone, phone, props

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

## Knowledge Gaps
- **99 isolated node(s):** `route`, `name`, `phone`, `email`, `message` (+94 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **What connects `route`, `name`, `phone` to the rest of the system?**
  _99 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._
- **Should `ОАО КЭМЗ — факты и контент для сайта` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._