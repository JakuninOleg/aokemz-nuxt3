---
name: kemz-industrial-design
description: Hybrid industrial UI for ОАО КЭМЗ (aokemz.ru) — dark heroes, light working surfaces, excavator/motor imagery, Contentful-aware Nuxt sections. Use when redesigning pages, building landing sections, choosing typography/color, generating marketing visuals, or matching Awwards-level industrial B2B polish.
---

# КЭМЗ hybrid industrial design

## When to use

Any visual work on `aokemz-nuxt3`: homepage, catalog, about, contacts, forms, email HTML, generated imagery.

## Direction

**Hybrid:** dark cinematic bands (hero, product story, final CTA) + light precise surfaces (nav working area, catalog grids, article/docs, form fields).

References to steal patterns from (not clone): Parvalux, Central Moloney, Lödige, belaz.by, uralmash-kartex.ru. ChatGPT full-dark mock is optional inspiration only.

## Hard rules

1. Brand/name readable as hero-level signal on marketing first viewport.
2. One job per section; hero budget: brand, one headline, one line support, one CTA group, one dominant visual.
3. No card soup in heroes; no floating promo chips on media.
4. Avoid: purple/indigo AI look, cream+terracotta, broadsheet hairlines, glow stacks, emoji.
5. Facts and inventable stats: `docs/brand-facts.md`. Prefer real anchors (1960, 590 kW БЕЛАЗ, 8000 м, ЭКГ/ЭШ).
6. **Copy:** follow `.cursor/skills/stop-slop/SKILL.md` — concrete plant language, no AI landing-page sludge.

## Tokens (baseline)

```css
:root {
  --kemz-ink: #0b0d10;
  --kemz-graphite: #1a1f26;
  --kemz-steel: #e8ecf1;
  --kemz-paper: #f5f7fa;
  --kemz-blue: #2f78cd;
  --kemz-blue-deep: #1e4f8c;
  --kemz-muted: #6b7280;
}
```

Extend in Tailwind theme; keep accent family consistent with existing `#2F78CD`.

## Section recipe (homepage)

1. **Hero (dark):** excavator/quarry atmosphere + headline about drives for quarry/walking excavators + CTA to catalog / contact.
2. **Trust strip (light or on hero edge):** only verified stats (year founded, power class, drilling depth) — no fake “98% / 30 countries”.
3. **Product focus:** motor/generator with callouts (cooling, bearings, stator/rotor) — CSS hotspots OK; 3D only if asset exists.
4. **Application:** excavator silhouette ↔ КЭМЗ machine callout (e.g. drive on ЭКГ / мотор-колесо БЕЛАЗ).
5. **Plant / capability (hybrid):** foundry/shop mood + short “полный цикл: конструкция → испытание”.
6. **CTA + form (dark band, light inputs)** + footer columns.

## Motion

Ship 2–3: e.g. hero fade/parallax subtle, hotspot draw-on, CTA hover. Prefer CSS / small Vue transitions over heavy GSAP unless needed.

## Imagery

- Prefer plant/product photos; else generate industrial-realistic stills (steel, copper windings, quarry dusk — not neon sci-fi).
- Log generated files in `docs/brand-facts.md` → «Сгенерированные ассеты».
- Always set meaningful `alt` in Russian.

## Implementation notes

- Nuxt 3 + Tailwind; components under `components/`, pages under `pages/`.
- Keep Contentful field contracts; redesign shells around data.
- Forms: follow `.cursor/rules/forms-antispam.mdc`.
- After UI merges: `graphify update .`.

## More detail

- Brand copy & facts: [docs/brand-facts.md](../../../docs/brand-facts.md)
- Layout patterns: [reference.md](reference.md)
