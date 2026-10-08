# Импорт Contentful в тестовый Payload

Production Nuxt не переключён. Ниже — состояние импорта и публичного среза на 8 октября 2026, без заявления о release-ready сайте.

## Источник

Приватный архив `2026-10-07T20-13-17-382Z-41518f52`: 67 опубликованных записей, 81 asset / 82 локализованных файла. Черновики Contentful не входят в Delivery API экспорт. `sourceRecord` сохраняет raw-данные всех locales; Rich Text дополнительно хранится в исходных полях. Публичные legacy URL сохранены в карте импорта.

## Команды

Из `migration/next`, с уже настроенным gitignored `.env.local`:

```powershell
# Проверка архива и конвертации, без обращения к БД/S3
node --env-file=.env.local --import tsx scripts/import-contentful.mjs ../../.migration-private/contentful/2026-10-07T20-13-17-382Z-41518f52

# Проверка существующего импорта. Не создаёт и не обновляет записи.
$env:NODE_ENV='production'
node --env-file=.env.local --import tsx scripts/import-contentful.mjs ../../.migration-private/contentful/2026-10-07T20-13-17-382Z-41518f52 --verify
npm run verify:cms
```

`--apply` разрешает создавать только отсутствующие записи. Изменение sourceHash или несовпадение существующих значений блокирует запуск; автоматического перезаписывания редакторских изменений и удаления нет. Скрипт ограничен конкретной тестовой БД/бакетом КЭМЗ. Первое создание схемы выполнено в development; повторные проверки запускать в production-режиме, без schema push. Перед deployment нужны versioned SQL migrations / baseline (см. `DEPLOY.md`).

Импорт создаёт отчёт в приватном архиве. Каждый оригинал сверяется по SHA-256 из S3; WebP проверяются по формату, размеру файла и отсутствию увеличения размеров. Сохраняются все оригиналы, PDF/DOCX не перекодируются. При частичном сбое записи/файлы не удаляются автоматически — отчёт нужно изучить и возобновить импорт.

## Результат 7–8 октября 2026

- PostgreSQL: 9 категорий, 46 товаров, 11 новостей, 1 пустая исходная запись документов, 82 media.
- S3: 82 оригинала (24 714 186 байт) и 222 WebP-варианта для 74 изображений.
- Общий вес вариантов: mobile — 1 565 580, content — 3 452 796, wide — 4 131 052 байт. Это не PageSpeed замер; frontend должен действительно использовать варианты.
- Повторная проверка: 149 записей reused, новых записей нет, значения и связи совпали.
- Lexical parser: 101 поле; HTML renderer: 45 таблиц. Source metadata скрыта, anonymous users read запрещён.
- 15 unit-тестов миграционных скриптов / converter, lint миграционных скриптов, Next TypeScript и production build проходили на срезе каталога/новостей.

WebP quality 85 — визуальная оптимизация, не математически lossless. Секреты, сертификаты, архивы и образцы проверки не входят в Git.

## Публичный Next-срез (код на месте; не = cutover)

К 8 октября в `migration/next` перенесены server-rendered routes главной, статических разделов (`/about`, `/production`, `/documents`, `/legal`, `/contacts`, `/special`), каталога, новостей, 404, `/api/sendMail`, `robots`/`sitemap`, cookie/Metrika client. OJ CMS: первый branded dashboard + admin; полный editor UX и publish/preview path реальных записей ещё не закрыты.

Ранее для среза каталога/новостей: 68 URL проверены на standalone (200, один h1, canonical aokemz.ru, JSON-LD, noindex preview, без sourceRecord/sourceHash) + 4 отсутствующих → 404. После расширения статических страниц и форм нужен повторный прогон `scripts/verify-public-next.mjs` на актуальном standalone.

Локальный запуск: после `npm run build` задать `PORT=3100`, `HOSTNAME=127.0.0.1` и `npm run start`. Build копирует selected public assets и `.next/static` в standalone. Timeweb DNS production не переключался.

Незакрыто до release gate (см. `.design/next-payload/TASKS.md`): live SMTP с тестовым адресатом, `TRUST_PROXY` за прокси, `prodMigrations` wiring или явный migrate/baseline на целевой БД, полная визуальная сверка shell/всех страниц, PageSpeed, registry 301 при смене slug, полный Management export черновиков. Preview не выдавать заказчику как готовый сайт; индексацию staging не открывать.
