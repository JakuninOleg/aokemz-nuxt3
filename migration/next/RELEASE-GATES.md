# Release gate КЭМЗ Next / OJ CMS — 8 октября 2026

Область: безопасность, формы, миграции и переключение Timeweb. SEO и полное
покрытие PageSpeed принимаются отдельно. Production `aokemz.ru` не переключён.

## Свежие проверки

- `test-leads.ts`: PASS — валидация, consent, Origin, honeypot, лимит тела,
  телефон, rate limit, экранирование и отказ SMTP. Настоящие письма не отправлялись.
- `test-mail-transport.ts`: PASS — 465 использует implicit TLS, 587 требует
  STARTTLS; проверено имя отправителя «ОАО «КЭМЗ»». Правка `requireTLS` пока локальная.
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
- Повторный `test-migrations.ts --apply` не завершился: PostgreSQL отказался
  стартовать под административным Windows-токеном. Удалённая БД не затрагивалась.
  Предыдущие успешные тесты не считаются новым подтверждением текущего restore.
- Попытка logical backup/restore: bundled embedded-postgres содержит только
  initdb/pg_ctl/postgres, но не pg_dump/pg_restore; PostgreSQL client tools в PATH
  и `C:/Program Files/PostgreSQL` не найдены. Dump не создан, restore не выполнен.
  Добавлен bounded `check-backup-restore.mjs`, который сначала проверяет наличие
  совместимых инструментов (`PG_DUMP_BIN`, `PG_RESTORE_BIN`), использует приватный
  root `.migration-private/release-restore-20261008`, не перезаписывает старые
  dump/cluster и не выводит данные/пароли. Удалённая схема не изменялась.
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
- [ ] **SMTP.** Подтвердить разрешённый исходящий 465/587 и выполнить тест из
  staging на согласованные sales@aokemz.ru и oleg.kemz@gmail.com; проверить запись
  заявки, mailStatus=sent и получение обоими ящиками. DB success не доказывает доставку.
- [ ] **Env.** Проверить настройки именно публичного Timeweb, не локальный env:
  явные MAIL_TO, SMTP_FROM/MAIL_FROM, TLS CA для PostgreSQL, сильный PAYLOAD_SECRET,
  S3 с ограниченным пользователем, ALLOW_LOCAL_PREVIEW=false. Локальная проверка
  показала ожидаемые для localhost отказы HTTPS origin / preview / TRUST_PROXY;
  это не результат проверки серверной панели.
- [ ] **Лимитер.** Зафиксировать один runtime instance либо внедрить shared limiter
  перед несколькими инстансами: текущий Map process-local и сбрасывается при рестарте.
- [ ] **Backup/restore.** Сделать snapshot/dump и реально восстановить в отдельную
  БД, сверить количество записей, связи, роли, файлы S3 и открытие страниц.
- [ ] **Baseline.** После backup сверить текущую схему с initial и leads migration,
  затем пометить уже применённые версии, без повторного initial CREATE TABLE.
  Автомиграция при старте намеренно не подключена. Проверить следующую аддитивную
  миграцию на restored clone, а не экспериментировать с наполненной БД.
- [ ] **Права.** Повторить editor workflow на итоговом staging: запрет повышения
  роли, создания пользователей, удаления и чтения заявок; публикация/черновики;
  проверить OAuth analytics и admin-search только в авторизованном контексте.
- [ ] **Окончательный artifact.** Lint/typecheck/build и Linux smoke после всех
  правок; проверить остаточные advisory в deployed standalone и runtime ошибки.

## Порядок production cutover

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
5. Отправить контрольные заявки, проверить обе почты и CMS, выполнить final crawl
   и PageSpeed на новом production. При критическом сбое вернуть домен на Nuxt;
   не пытаться откатывать наполненную БД через непроверенные destructive down SQL.

Ни backup, ни baseline, ни переключение домена, ни реальные письма этим аудитом
не выполнялись. На этом этапе готовность production не подтверждена.
