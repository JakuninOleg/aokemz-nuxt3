# КЭМЗ — миграционное приложение

Next.js 16.3.8 + Payload 3.90.2. Публичные страницы перенесены в отдельное приложение рядом с production Nuxt. Это не переключение `aokemz.ru` и не согласованный production release. Проверенные результаты и оставшиеся release-проверки: `VERIFICATION.md`.

## Что есть

- PostgreSQL adapter, модели users / categories / products / news / documents / media.
- Роли administrator/editor; анонимный Local/REST read опубликованного контента через `publishedOrEditor`. Поля `sourceRecord` / `sourceHash` и ряд import-метаданных — только administrator. Коллекция `media` в REST закрыта для анонимов; публичные страницы собирают URL вариантов через Local API + S3.
- Автоматические ЧПУ для новых записей, запрет смены существующего slug до registry 301. Импортированные URL сохранены.
- WebP-производные 480/960/1600 (quality 85), оригинал сохраняется; frontend обязан использовать srcset/sizes.
- Опциональный S3; без S3 загрузки в `.data/media` (публичная выдача картинок каталога/новостей рассчитана на S3 URL).
- `/admin` — единственная штатная админка Payload с оформлением OJ CMS под КЭМЗ. Используются native RootPage/RootLayout, авторизация, коллекции, формы и Lexical; OJ добавляет shell, dashboard и стили, а не вторую админку. Старые `/payload-admin` адреса перенаправляются в `/admin`. Подробности: `docs/native-oj-admin.md`.
- Это пока интеграция OJ в проект КЭМЗ, не выпущенный универсальный starter: настройки сайта read-only, registry полей привязан к коллекциям КЭМЗ. Исходный репозиторий `oj-cms` этим переносом не изменён. Требования к общей базе — `OJ-STARTER.md`.
- Публичные App Router routes: `/`, `/about`, `/production`, `/products`, `/products/[category]`, `/products/[category]/[product]`, `/news`, `/news/[article]`, `/documents`, `/contacts`, `/legal`, `/special`, 404/`[...slug]`, `/api/sendMail`, `robots.txt`, `sitemap.xml`.
- Preview по умолчанию закрыт от индексации (`SITE_INDEXABLE` + `PUBLIC_SITE_URL`, `X-Robots-Tag`, `robots.ts`).
- Versioned SQL migrations в `src/migrations`; `prodMigrations` в `payload.config.ts` **ещё не подключён** — на пустой БД нужен явный `npx payload migrate` (см. `DEPLOY.md`).

## Локальный запуск

1. `npm ci`
2. Создать `.env.local` по `.env.example` с отдельной тестовой PostgreSQL и случайным `PAYLOAD_SECRET`. Не подключать production БД.
3. `npm run generate:types` и `npm run generate:importmap`
4. `npm run dev` — порт 3100, отдельно от Nuxt на 3000.

Standalone: `npm run build` (копирует `public` и `.next/static` в `.next/standalone` через `scripts/prepare-standalone.mjs`), затем `PORT=3100`, `HOSTNAME=127.0.0.1`, `npm run start`.

До публичного развёртывания: администратор безопасным способом, роли, migrations/baseline, SMTP, `TRUST_PROXY` за reverse proxy. Не выставлять незавершённый preview как готовый сайт и не открывать индексацию до release gate.

## Архив и карта импорта

Из корня Nuxt-репозитория:

```powershell
node --env-file=.env scripts/migration/contentful-snapshot.mjs
node scripts/migration/prepare-import.mjs .migration-private/contentful/<snapshot>
node --test scripts/migration/*.test.mjs
```

Архивы исключены из git. CDA даёт только опубликованный контент. Подробности импорта: `IMPORT.md`. Checklist: `../../.design/next-payload/TASKS.md`. Deploy/migrations: `DEPLOY.md`.

## Проверки (локально, без секретов в отчёте)

| Команда | Что доказывает |
| --- | --- |
| `npm run typecheck` | TypeScript основы |
| `npm run build` | production build + prepare-standalone |
| `node --import tsx scripts/test-leads.ts` | honeypot, Origin, size, consent, phone, rate limit, HTML escape, SMTP failure path (без реальной почты) |
| `node --test scripts/contentful-to-lexical.test.mjs` | Lexical converter unit tests |
| `node --import tsx scripts/test-slug.ts` | slug transliteration / immutability helpers |
| `node --import tsx scripts/test-media.ts` | MIME/magic-byte upload guards |
| `node --import tsx scripts/test-migrations.ts --apply` | versioned migrate на embedded-postgres (не elevated Admin; не remote DB) |
| `node --env-file=.env.local --import tsx scripts/verify-public-next.mjs` | HTTP 200/404, h1, canonical, JSON-LD, noindex, sitemap — **только при запущенном standalone + доступной БД** |

Успешная сборка не доказывает SMTP delivery, PageSpeed, визуальную эквивалентность Nuxt или готовность DNS cutover.
