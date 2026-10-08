# Release gate КЭМЗ Next / OJ CMS — 8 октября 2026

Область: безопасность, формы, миграции и переключение Timeweb. SEO и полное
покрытие PageSpeed принимаются отдельно. Production `aokemz.ru` не переключён.

## Свежие проверки

- `test-leads.ts`: PASS — валидация, consent, Origin, honeypot, лимит тела,
  телефон, rate limit, экранирование и отказ SMTP. Настоящие письма не отправлялись.
- `test-mail-transport.ts`: PASS — 465 использует implicit TLS, 587 требует
  STARTTLS; проверено имя отправителя «ОАО «КЭМЗ»». Правка опубликована в
  migration-ветке commit `1e6fddc`, не в production.
- `test-database-pool.ts`: 7 PASS — сертификат CA, hostname/TLS verification,
  удаление конфликтующих URL SSL-параметров. Это не тест настроек панели Timeweb.
- `test-media-policy.ts`, `test-media-references.ts` (8), `test-product-path.ts` (7): PASS,
  без записи в БД/S3.
- Анонимные GET на `https://staging.aokemz.ru`: `/api/users`, `/api/leads`,
  `/api/analytics`, `/api/media` — 403; `/api/products?limit=1` — 200, без
  `sourceRecord`. `/admin` — 200: штатный shell/login допустим, защищённые данные
  и операции проверяются серверными ACL, не HTTP-статусом HTML-оболочки.
- PostgreSQL: свежая READ ONLY проверка `check-database-baseline.ts` подтвердила
  единственную migration-запись `dev / batch -1`, таблицы leads/news/products/users
  и колонки media.prefix/media._objectkey. **Baseline не установлен.**
- Backup/restore PostgreSQL: **PASS**. Portable pg_dump/pg_restore 18.6 получены
  по официальной цепочке [PostgreSQL.org](https://www.postgresql.org/download/windows/)
  → [EDB ZIP](https://www.enterprisedb.com/download-postgresql-binaries), без установки
  сервиса. Создан приватный verified-TLS logical dump (448 538 bytes), восстановлен
  в отдельную localhost PostgreSQL. Совпали counts: users 2, media 82, categories 9,
  products 46, news 11, documents 1, leads 0, migrations 1; 31 foreign key validated.
  Ограничение административного Windows-токена решено `runas /trustlevel:0x20000`
  в скрытом процессе. Локальный сервер после проверки остановлен.
- Schema/baseline на restored clone: **PASS**, удалённый baseline **не применён**.
  Initial + leads UP SQL выполнены только на отдельной ПУСТОЙ expected-schema DB.
  Каталоги совпали точно: 267 columns, 134 constraints, 138 indexes, 25 enum labels,
  zero differences. History-only baseline clone сохранил все content counts и схему;
  установленный native migrator проверен с real clone history / SELECT-only adapter:
  обе существующие версии пропущены, UP-функции не вызваны. Полный Payload init при
  этой проверке не проверялся. Следующих реальных миграций сейчас нет.
- Итоговые локальные lint/typecheck/build — PASS, 79 generated paths. Public crawl —
  PASS: 75 routes, 79 links, 792 assets, 73 sitemap URLs, 53 tables; graphify update PASS.
  Эти проверки не заменяют final Linux smoke и полный PageSpeed-прогон.
- Cursor CLI выполнен в `--mode ask`, read-only, без чтения env/секретов:
  подтвердил ограничения proxy/лимитера, риск дефолтных получателей и требования
  TLS/baseline. Не выполнял отправки, миграции или изменения файлов.

## Dependency audit: 15 пакетов, но 2 исходных advisory

Свежий `npm audit --omit=dev --json`: 10 high, 5 moderate, 0 critical.
Это число затронутых пакетов в цепочках, не 15 независимых уязвимостей.

| Advisory | Цепочка в npm install | Применимость |
| --- | --- | --- |
| [braces stack exhaustion](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) | Payload Next → sass 1.77.4 → chokidar 3 → braces 3.0.3; S3 plugin → find-node-modules → findup-sync → micromatch → braces | Уязвима обработка недоверенного глубоко вложенного glob. Нельзя передавать ввод пользователя в эти инструменты. На момент проверки patched version отсутствует. |
| [esbuild dev-server CORS](https://github.com/advisories/GHSA-67mh-4wv8-2f99) | PostgreSQL adapter → drizzle-kit → esm-loader → core-utils → esbuild 0.18.20 | Не открывать esbuild dev server; production запускает standalone Node, не dev server. |

В текущем локальном `.next/standalone/node_modules` отсутствуют braces,
micromatch, find-node-modules, sass, chokidar, esm-loader и вложенный уязвимый
esbuild. В `.next/server` не обнаружены соответствующие строковые импорты.
Это доказательство для данного артефакта, не универсальная гарантия: сверить
окончательный Linux standalone перед релизом и зафиксировать остаточный риск.
Не выполнять `npm audit fix --force`: предложенный downgrade richtext-lexical
до 0.11.4 разрушает совместимость Payload 3. Пакеты и lockfile этим аудитом не менялись.

## Блокирующие проверки до переключения

- [ ] **Proxy/IP.** Получить точный контракт Timeweb: прокси перезаписывает или
  дописывает X-Forwarded-For? Текущий код при TRUST_PROXY=true берёт первый hop.
  Ответ поддержки «получает клиентский IP» не подтверждает защиту от подмены.
  Пока TRUST_PROXY=false, все посетители разделяют bucket `unknown` (5/15 минут).
  Не включать true наугад. После подтверждения проверить spoofed XFF и два клиента.
- [x] **SMTP — согласована стратегия, новая доставка не тестировалась.** Пользователь
  подтвердил, что SMTP уже работает в действующем Nuxt-приложении Timeweb 252079,
  и отказался от дополнительных проверок/открытия staging-порта. В отдельном 266961
  dashboard показывает 465/587 closed. При cutover заменять код в existing 252079,
  сохраняя network policy; не считать настройки отдельного staging унаследованными.
  Новых писем не отправляли; DB success не является подтверждением доставки Next.
- [ ] **Env.** Проверить настройки именно публичного Timeweb, не локальный env:
  явные MAIL_TO, MAIL_FROM, TLS CA для PostgreSQL, сильный PAYLOAD_SECRET,
  S3 с ограниченным пользователем, ALLOW_LOCAL_PREVIEW=false. Локальная проверка
  показала ожидаемые для localhost отказы HTTPS origin / preview / TRUST_PROXY;
  это не результат проверки серверной панели.
- [ ] **Лимитер.** Зафиксировать один runtime instance либо внедрить shared limiter
  перед несколькими инстансами: текущий Map process-local и сбрасывается при рестарте.
- [x] **Backup/restore БД.** Logical dump успешно восстановлен на isolated clone,
  counts и FK проверены; приватные proof/dump сохранены. Сохранение объектов S3,
  функциональные роли и открытие страниц остаются отдельными проверками.
- [ ] **Baseline.** После backup сверить текущую схему с initial и leads migration,
  затем пометить уже применённые версии, без повторного initial CREATE TABLE.
  Автомиграция при старте намеренно не подключена. Schema equality и history-only
  baseline проверены на restored clone, но на удалённой БД всё ещё `dev / batch -1`.
  Применение туда — отдельное согласованное действие, не часть read-only аудита.
- [ ] **Права.** Повторить editor workflow на итоговом staging: запрет повышения
  роли, создания пользователей, удаления и чтения заявок; публикация/черновики;
  проверить OAuth analytics и admin-search только в авторизованном контексте.
- [ ] **Окончательный artifact.** Lint/typecheck/build и Linux smoke после всех
  правок; проверить остаточные advisory в deployed standalone и runtime ошибки.

## Порядок production cutover

### Проверенный baseline SQL (НЕ исполнен на удалённой БД)

Только после свежего backup, заморозки schema-изменений и повторной проверки
соответствия schema текущим двум миграциям. Этот блок меняет лишь migration history;
initial CREATE / down запрещены на наполненной БД. Проверенный локальный helper —
`scripts/check-clone-baseline.mjs --native`, он жёстко привязан к private localhost clone.

```sql
BEGIN;
LOCK TABLE payload_migrations IN SHARE ROW EXCLUSIVE MODE;
INSERT INTO payload_migrations(name,batch)
SELECT '20261007_221720_initial'::varchar,1
WHERE NOT EXISTS (SELECT 1 FROM payload_migrations WHERE name='20261007_221720_initial');
INSERT INTO payload_migrations(name,batch)
SELECT '20261008_105450_leads'::varchar,1
WHERE NOT EXISTS (SELECT 1 FROM payload_migrations WHERE name='20261008_105450_leads');
DELETE FROM payload_migrations WHERE name='dev' AND batch=-1;
COMMIT;
```

После — проверить обе строки batch 1, отсутствие dev/-1 и прежние content counts.
Наличие dev/-1 заставляет установленный Payload migrator предупреждать о schema push;
простое добавление двух строк без удаления этого маркера не закрывает baseline.

1. Зафиксировать commit и полный комплект пройденных gates, период заморозки
   редактирования Contentful и необходимость финальной синхронизации контента.
2. Сохранить работающий Nuxt и его параметры; подготовить rollback привязки домена
   и контрольный список главная/каталог/товар/новость/контакты/формы/админка.
3. Подготовить production Next env: `PUBLIC_SITE_URL=https://aokemz.ru`,
   `SITE_INDEXABLE=true`, `ALLOW_LOCAL_PREVIEW=false`; staged origin остаётся noindex.
   Не менять mail/vpn DNS. Открытие индексации не выполнять до согласованного релиза.
4. Переназначить основной домен на готовый Next только после явного согласования;
   проверить HTTPS, выбранное главное зеркало, HTTP/www → HTTPS без цепочек,
   canonical, robots, sitemap и отсутствие production noindex.
5. Выполнить final crawl и PageSpeed на новом production, проверить CMS; новые
   контрольные письма отправлять только если пользователь отменит отказ от тестов.
   При критическом сбое вернуть рабочий Nuxt;
   не пытаться откатывать наполненную БД через непроверенные destructive down SQL.

Backup и baseline-test выполнены только в рамках read-only remote dump + isolated
localhost clone. Удалённый baseline, переключение production и новые реальные письма
не выполнялись на момент аудита 08.10. Ниже — обновлённое состояние подготовки.

## Подготовка релиза 09.10.2026

- Свежий логический backup 448505 байт сохранён приватно в
  `.migration-private/release-restore-20261009/kemz-staging.dump`.
- Backup восстановлен в изолированный localhost clone: users 2, media 82,
  categories 9, products 46, news 11, documents 1, leads 0. Схема соответствует
  initial + leads: 267 columns, 134 constraints, 138 indexes, 25 enum values.
- History-only baseline применён к удалённой БД: обе версии отмечены batch 1,
  dev/-1 удалён. Контент и схема не изменились. Приватный proof —
  `remote-baseline-proof.json`. Initial CREATE TABLE и down не запускались.
- Timeweb staging 266961 подтвердил успешный запуск `44d98e5`.
- В приложение production 252079 добавлено окружение Next: DATABASE_URL с
  verify-full и переносимым DATABASE_CA_CERT, PAYLOAD_SECRET, ограниченные S3
  credentials, чтение Метрики, PUBLIC_SITE_URL=https://aokemz.ru,
  SITE_INDEXABLE=true, ALLOW_LOCAL_PREVIEW=false, TRUST_PROXY=false.
  Существующие SMTP/MAIL_* и Contentful переменные сохранены без изменений.
- Сохранение окружения запустило пересборку прежнего Nuxt 4fe1eef;
  команды и ветка production пока не заменены. Staging остаётся noindex.
- Новые PageSpeed-замеры и контрольные письма запрещены пользователем и не запускались.

### Параметры переключения и отката

Приложение 252079 сохраняет прежнюю network policy и SMTP-доступ.
При согласованном переключении: Next.js, Node.js 22+, рабочая директория
`migration/next`, build `npm ci && npm run build`, start
`npm start`, переменная окружения `HOSTNAME=0.0.0.0`, health path `/`.
Timeweb не поддерживает inline assignment в поле запуска: он интерпретирует
`HOSTNAME=0.0.0.0` как имя Node-файла. Не включать schema push или
автоматический initial при запуске. Не менять mail/vpn DNS.

Проверенный staging имеет 2 ГБ RAM; текущий Nuxt production — 1 ГБ.
Перед переключением согласовать 2 ГБ на production либо явно принять риск
меньшего лимита. Тариф production в ходе подготовки не менялся.

Для rollback выбрать Nuxt, Node.js 24, корень репозитория (пустая директория),
build `npm ci && NITRO_PRESET=node-server npm run build`, start
`node .output/server/index.mjs`, ветку master и commit `4fe1eef`.
Старые CTF/SMTP/MAIL_* переменные, домены и сертификаты сохранены.
Новые переменные Next Nuxt не использует. Не откатывать наполненную БД через down.

Оставшиеся этапы: финальный commit админки/операционных scripts, подтверждение
его Linux staging, согласованный push/merge production и переключение framework.
Proxy/IP контракт остаётся отдельным зафиксированным риском, TRUST_PROXY не включён
без подтверждения. Существующие условия отказа от почтовых тестов сохраняются.
