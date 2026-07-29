---
name: stop-slop
description: >-
  Anti-AI-slop writing for ОАО КЭМЗ (RU/EN UI, SEO, emails, marketing). Based on
  hardikpandya/stop-slop plus plant-specific rules. Use when drafting or editing
  any prose — headlines, about, product blurbs, i18n strings, alt text.
---

# Stop slop (КЭМЗ)

Пиши как сайт электромашиностроительного завода для снабжения и инженеров, не как лендинг нейросети.

Upstream patterns: [hardikpandya/stop-slop](https://github.com/hardikpandya/stop-slop) (MIT). Domain rules: `docs/brand-facts.md`.

## Core rules (global)

1. Cut filler: throat-clearing, emphasis crutches, empty intensifiers. Prefer zero adverbs unless they change meaning.
2. Break formula: no «not X, but Y», no dramatic one-line fragments stacked for effect, no rhetorical setups.
3. Active voice with a real actor. No «решение рождается», «качество достигается».
4. Be specific. Name kW, machine type, excavator model, city. No «implications are significant».
5. Put the reader in the room. «Вы» / «заказчик» beats «люди / компании сегодня».
6. Vary rhythm. Two items beat three. Mix sentence length. **No em dashes (—).** Use comma, period, colon, or parentheses. In RU also avoid decorative «–» spam between every clause.
7. Trust the reader. No hand-holding («важно отметить», «следует понимать»).
8. Cut quotables. If it sounds like a LinkedIn pull-quote, rewrite.

## Запрещено (RU + EN)

- Em dash `—` and habitual en-dash chains; ChatGPT ellipsis `…` as fake drama
- «Инновационный / передовой / комплексные решения / синергия / трансформация / бесшовный / next-gen / seamless / end-to-end»
- «Движение начинается здесь», «будущее уже здесь», «вместе мы можем»
- Fake stats without `docs/brand-facts.md` («98%», «30 стран», «1000+ проектов»)
- Triple adjective stacks; three parallel «мы + глагол» sentences
- Emoji in corporate UI copy
- Wh- openers as habit («What makes us different…», «Почему выбирают нас…» as empty H2)

## Делай так (завод)

1. Fact → one concrete buyer consequence.
2. Plant lexicon: экскаватор, привод, генератор, ДПЭ/4ГПЭ, ЭКГ/ЭШ, стенд, ГОСТ/ТУ, ЗИП, Карпинск.
3. Short. One job per headline.
4. Dry technical tone is fine. Cheerleading is not.
5. No data → omit the claim.

## Quick checks

- Em dash anywhere? Remove it.
- Adverbs / passive / inanimate agency? Fix.
- «Not X, but Y»? State Y.
- Three sentences same length? Break one.
- Drop the sentence — page still works? Then drop it.
- Plant noun present (кВт, ЭКГ, двигатель, Карпинск)? If only «качество/надёжность» — rewrite.
- Score Directness / Rhythm / Trust / Authenticity / Density out of 10. Below ~35/50 — revise.

## Examples

Bad:
> We deliver innovative end-to-end solutions — empowering mining teams to unlock new levels of efficiency.

OK:
> DC and AC machines for quarry and walking excavators. Kits for EKG and ESH types, tested on the plant stands in Karpinsk.

Bad:
> Мы создаём инновационные комплексные решения для горнодобывающей отрасли — надёжность, которой доверяют.

OK:
> Электродвигатели и генераторы для карьерных и шагающих экскаваторов. Комплекты под ЭКГ и ЭШ. Испытания на стендах в Карпинске.

More patterns: [references.md](references.md)

## Связано

- Design: `.cursor/skills/kemz-industrial-design/SKILL.md`
- Facts: `docs/brand-facts.md`
