# КЭМЗ Next/Payload — schema migrations и Timeweb standalone

Production Nuxt (`aokemz.ru`) не переключается этим документом. Здесь только versioned PostgreSQL migrations для миграционного приложения `migration/next` и порядок безопасного применения на Timeweb.

## Артефакты

| Путь | Назначение |
| --- | --- |
| `src/migrations/*.ts` | Versioned up/down SQL, сгенерированные Payload/Drizzle Kit |
| `src/migrations/*.json` | Drizzle schema snapshot для следующих `migrate:create` |
| `src/migrations/index.ts` | Экспорт `migrations` для `prodMigrations` (подключает основной конфиг) |
| `scripts/test-migrations.ts` | Локальная проверка на изолированном embedded-postgres |

Конфиг `payload.config.ts` пока может не указывать `migrationDir` явно: адаптер сам выбирает `src/migrations`, если существует `src/`. Интеграция `prodMigrations: migrations` в adapter — шаг основной ветки конфига; без него production init **не** прогоняет SQL сам, нужно явное `payload migrate` / `db.migrate()`.

## Storage schema (S3 plugin)

Production runtime включает `@payloadcms/storage-s3` при заданном `S3_BUCKET`. Плагин добавляет в коллекцию `media` поля `prefix` и `_objectKey` (колонки `prefix`, `_objectkey` — Drizzle lowercases имя поля).

Initial migration **должна** создаваться с включённым storage plugin. `scripts/test-migrations.ts --create` выставляет **dummy** S3 env (локальный несуществующий endpoint), не читает `.env` / `.env.local` и не делает внешних вызовов. Генерация без `S3_BUCKET` даёт схему без `prefix` / `_objectkey` — такая initial непригодна для fresh deploy с S3.

Проверка содержимого SQL после `--create`:

```powershell
Select-String -Path src\migrations\*_initial.ts -Pattern '"prefix"|"_objectkey"'
```

Ожидаются совпадения внутри `CREATE TABLE "media"`.

## Переменные окружения (только имена)

Секреты и значения сюда не записываются. На Timeweb/standalone задайте имена:

| Имя | Назначение |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string миграционного/staging приложения |
| `PAYLOAD_SECRET` | Секрет Payload |
| `PUBLIC_SITE_URL` | Публичный origin preview/staging (не production Nuxt) |
| `SITE_INDEXABLE` | `true` только вместе с `PUBLIC_SITE_URL=https://aokemz.ru`; иначе robots/noindex |
| `ALLOW_LOCAL_PREVIEW` | `true` разрешает Origin `http://127.0.0.1:3100` для `/api/sendMail` в production-сборке |
| `TRUST_PROXY` | `true` только если прокси подменяет `X-Forwarded-For`; иначе rate limit всех заявок сходится в ключ `unknown` |
| `NODE_ENV` | `production` для runtime без schema push |
| `S3_BUCKET` | Бакет медиа (если storage включён) |
| `S3_ENDPOINT` | S3-совместимый endpoint |
| `S3_REGION` | Регион S3 |
| `S3_ACCESS_KEY_ID` | Ключ S3 |
| `S3_SECRET_ACCESS_KEY` | Секрет S3 |
| `SMTP_HOST` | SMTP host (CMS mail / заявки) |
| `SMTP_PORT` | SMTP port |
| `SMTP_USER` | SMTP user / from |
| `SMTP_PASS` | SMTP password |
| `MAIL_FROM` | From для заявок (иначе `"ОАО «КЭМЗ»" <SMTP_USER>`) |
| `MAIL_TO` | Получатели заявок; на staging задавать явно (иначе код падает на production sales) |
| `PORT` | Порт standalone Node (`3100` локально) |
| `HOSTNAME` | Bind host standalone (`127.0.0.1` локально) |

Не коммитьте `.env` / `.env.local`. Локальный тест миграций **не** загружает эти файлы и не использует удалённый `DATABASE_URL`.

## Локальная проверка (изолированный кластер)

Из `migration/next`, без `.env`:

```powershell
# Пересоздать full initial (dummy S3 schema; не руками SQL)
node --import tsx scripts/test-migrations.ts --create

# Применить на НОВОМ embedded-postgres (push выключен, NODE_ENV=production)
node --import tsx scripts/test-migrations.ts --apply
```

Требования:

- Node ≥ 22, зависимости установлены (`npm ci` в `migration/next`).
- Процесс **не** должен быть elevated Administrator: PostgreSQL на Windows откажется стартовать. Если терминал elevated, запускайте apply с пониженными правами, например:

```powershell
runas /trustlevel:0x20000 "cmd /c `"cd /d C:\path\to\migration\next && node --import tsx scripts/test-migrations.ts --apply > .migration-private\migrations-apply.log 2>&1`""
```

Тест создаёт кластер под `.migration-private/postgres/migrations-test-*`, прогоняет versioned migrate, проверяет колонки storage на `media`, делает `find`/`create` по коллекциям (без upload в S3) и останавливает БД. Удалённые БД/S3/SMTP не вызываются. Код выхода при ошибке migrate/verify сохраняется после `pg.stop`.

## Timeweb: standalone команды

Сборка и запуск миграционного приложения (после того как конфиг подключит `prodMigrations` или вы явно прогоните migrate):

```powershell
cd migration/next
npm ci
npm run build
```

### Свежая пустая БД (единственный безопасный путь для initial CREATE)

```powershell
$env:NODE_ENV = 'production'
# Задайте DATABASE_URL и PAYLOAD_SECRET в окружении процесса/панели Timeweb.
npx payload migrate
```

Затем standalone:

```powershell
$env:NODE_ENV = 'production'
$env:PORT = '3100'          # или порт из панели
$env:HOSTNAME = '0.0.0.0'   # если Timeweb слушает на всех интерфейсах контейнера
npm run start
```

`npm run start` использует `node --env-file-if-exists=.env.local .next/standalone/server.js`. На сервере предпочтительнее переменные панели Timeweb, а не файл в репозитории.

Повторный `npx payload migrate` безопасен для уже применённых файлов: Payload пропускает строки, уже есть в `payload-migrations`.

## Baseline: уже заполненная БД (dev push / импорт) — НЕ применять initial

Тестовая Timeweb PostgreSQL уже создавалась через **development schema push** и содержит импортированные данные. **Запрещено** запускать initial `CREATE TABLE…` / `npx payload migrate` с неприменённой initial на этой БД: повторный CREATE ломает схему и данные.

### Safe baseline (без DDL)

1. Снять backup БД (и при необходимости S3) до любых изменений.
2. Убедиться, что схема уже соответствует текущим коллекциям **включая** storage-колонки `media.prefix` и `media._objectkey` (как после push с включённым S3).
3. Проверить `payload_migrations`: какие `name` / `batch` уже есть; строка с `batch = -1` — маркер dev push, не чистая migration history.
4. Зафиксировать baseline **без** выполнения UP SQL initial:
   - вставьте в `payload_migrations` запись с `name` = имя файла initial **без** расширения (сейчас `20261007_221720_initial`) и `batch` ≥ 1 (не `-1`);
   - либо используйте поддерживаемый Payload baseline/status для уже применённой схемы.
5. Цель: пометить initial применённой, чтобы последующие **новые** versioned migrations могли накатываться, а `CREATE TABLE` initial **никогда** не выполнялся на populated DB.
6. Свежий пустой кластер / новая database: обычный `npx payload migrate` — путь, который проверяет `scripts/test-migrations.ts --apply`.

Если populated DB создавалась **без** S3 и колонок `prefix` / `_objectkey` нет — не «чините» initial CREATE. Нужен отдельный additive migration (`ALTER TABLE … ADD COLUMN`) после осознанной сверки схемы, либо новая пустая БД + re-import.

## Backup и rollback

Перед migrate / baseline / сменой приложения на Timeweb:

1. Logical backup PostgreSQL (`pg_dump` / штатный backup Timeweb) целевой database.
2. При использовании S3 — убедиться, что бакет и префикс медиа известны; объекты initial import не удалять «для очистки».
3. Rollback схемы: восстановить dump; не полагаться только на `migrate:down` на заполненной production-like БД без проверки.
4. Rollback приложения: оставить текущий Nuxt production нетронутым; миграционный Next/Payload откатывается выключением standalone/preview, DNS production не менять.
5. После неудачного migrate не «чинить» руками разрозненными DROP, пока нет свежего backup.

## Staging / preview: noindex

Незавершённый Next/Payload preview **не** открывать для индексации:

- Сохранить `robots.txt` / `X-Robots-Tag: noindex` для staging origin.
- Не добавлять staging URL в Search Console / Вебмастер как основное зеркало.
- `PUBLIC_SITE_URL` staging не подменять на `https://aokemz.ru` в индексаруемых метаданных до release gate.
- Production Nuxt на `aokemz.ru` остаётся источником истины до согласованного переключения.

## Что не делать

- Не направлять `scripts/test-migrations.ts` на remote `DATABASE_URL`.
- **Не применять initial migration к существующей заполненной remote БД** — только baseline (см. выше) или новая пустая database.
- Не включать schema push (`NODE_ENV` ≠ production / dev push) на уже наполненной staging БД «чтобы наверняка».
- Не генерировать initial при выключенном S3 plugin, если production будет с S3.
- Не коммитить секреты, dump’ы и `.migration-private`.
- Не удалять и не переименовывать production Nuxt routes ради этой миграции.
