# Design proposal: hybrid redesign (for morning review)

Branch: `feature/hybrid-redesign`  
Direction: **hybrid** (dark cinematic bands + light working surfaces).  
Copy: `stop-slop` (no em dashes; patterns from [hardikpandya/stop-slop](https://github.com/hardikpandya/stop-slop)).  
Facts: `docs/brand-facts.md`.

## Current map

| Route | Status |
|-------|--------|
| `/` | Hero + form only |
| `/about` | Static copy + photos |
| `/products…` | Contentful |
| `/news…` | Contentful |
| `/contacts` | Hard-coded people |
| `/special`, `/documents` | Stubs + `public/docs/` (WIP on this branch) |
| PDFs | Copied to `public/docs/` |

Chrome **before**: fixed left gray rail. **On this branch (Option A WIP)**: sticky top header + footer, no sidebar.

## Option A: “Precision plant” (recommended)

Keep industrial seriousness, upgrade hierarchy.

- **Shell:** top sticky header (logo, nav, phone, CTA). Sidebar becomes optional desktop secondary or dies.
- **Home:** dark hero (excavator / shop) → light trust strip (1960, до 1250 кВт, −60…+40 °C) → product directions → application callout (ЭКГ/БЕЛАЗ) → plant capabilities → dark CTA + form.
- **Catalog:** light, dense, readable. Cards without toy hover-scale.
- **Motion:** 2–3 (hero fade, hotspot draw, CTA).

Best for RU B2B and portfolio to Western employers (modern without crypto-startup vibes).

## Option B: “Awwards dark”

Full-dark marketing, light only on forms/docs.

- Stronger mood, heavier asset need (photo/3D).
- Harder for long catalog ТТХ reading.
- Higher risk of looking like a generic AI dark landing if copy slips.

Use as accent for hero/CTA only (already in A).

## Option C: Keep left rail, restyle

Least disruptive. Restyle sidebar to ink/steel, polish type. Caps Awwards ceiling.

Good if stakeholders fear IA change. Weaker first impression.

**Default while you sleep: Option A foundation.**

## Product tables (mobile)

Contentful ТТХ tables cannot become pretty cards without losing density. Plan:

1. **Phone:** horizontal scroll tray (`overflow-x-auto`, `min-w` on table), sticky first column later if needed.
2. **Tablet+:** full table; drop `table-fixed` and fake `td{width:20%}`.
3. Optional later: 3–5 “key params” above the table if header row is detectable. Not required for v1.

## i18n EN/RU (for employers)

Add `@nuxtjs/i18n` with `ru` default + `en`.

| Source | Strategy |
|--------|----------|
| UI chrome, home, about shells | Vue I18n JSON |
| Contentful news/products | Phase 2: locale fields or separate entries; until then EN UI + note that catalog body stays RU |
| Contacts | Dual strings in JSON |

Locale switcher in header. Prefer `/en/...` prefix for SEO demos.

## Refactor queue (Nuxt3)

1. Composition API everywhere; kill `$store` / dead Pinia.
2. `composables/useNavLinks`, `useContentfulRichText`.
3. Real `/documents` (public PDFs) or remove nav item; `/special` → page or drop.
4. `static/` → `public/docs/`.
5. Fix product rich-text links + asset `https:`.
6. Real `error.vue`.
7. Design tokens in Tailwind (`kemz.*`) aligned with hybrid skill.

## What you will review when awake

- [ ] Option A vs B vs C
- [ ] New top header (dark on home hero → light on scroll / other pages)
- [ ] Home sections: hero, trust, directions, application, plant, CTA+form
- [ ] Table scroll on a real product page (`utils/contentfulRichText.ts`)
- [ ] Whether EN ships in same PR or follow-up

### Implemented overnight (branch `feature/hybrid-redesign`)

- `AppHeader` / `AppFooter` + `composables/useSiteNav`
- Home rebuilt as `components/home/*`
- `/documents`, `/special` pages; docs under `public/docs/`
- Product rich-text mobile table tray

Still pending: catalog/about/contacts polish, full `@nuxtjs/i18n` wiring, drop unused `Nav`/`Menu` if A sticks.

Locale JSON stubs live in `locales/ru.json` + `locales/en.json` (UI chrome). Module install + switcher: follow-up commit so EN demo does not block RU review.

## Permissions / what you do not need overnight

Agent can keep coding on `feature/hybrid-redesign` without waiting. Helpful if Cursor auto-approves network/shell for `npm`/`git push`. Do **not** need to grant destructive git.

## Blockers only you can clear

- Vercel env: SMTP_* / MAIL_* (prod restore sales@)
- Rotate leaked Gmail app password
- Confirm Option A (or switch B/C)
- Optional: better plant photos
- Optional: broad auto-approve so overnight runs do not pause on prompts
