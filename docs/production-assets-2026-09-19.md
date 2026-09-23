# Ассеты страницы `/production`

Для доставки в браузер активные изображения страницы имеют WebP-варианты
шириной до 1600 px и quality 82. PNG/JPEG остаются исходными мастер-файлами.

## `public/media/production/production-drive-hero-v1.png`

Сгенерированная иллюстрация для hero. Она показывает обобщённую тяжёлую электрическую машину и не подтверждает конкретную модель, параметры или реальный цех КЭМЗ. Случайный сгенерированный знак был удалён перед подключением. Реальная эмблема КЭМЗ добавляется в интерфейсе отдельным существующим ассетом `assets/images/kemz-logo.webp`.

### Prompt

Use case: product-mockup. Asset type: hero image for an industrial B2B product page. Image 1 is composition reference only; Image 2 is the authentic KEMZ circular logo reference. Create a premium photorealistic studio product shot of a heavy brushed blue-gray DC traction motor for quarry excavator drives, matching the product silhouette and scale in Image 1. It is a generic illustrative electric machine, not a claim about a specific model. Scene/backdrop: near-white engineering studio, soft pale-blue blueprint linework of a dragline excavator fading behind the motor, airy white margins. Subject: one large heavy cylindrical electric motor, three-quarter front-left view, shaft projecting toward the lower-left, heavy bolted housing, cooling fins and terminal boxes, entire machine and its feet visible. Center the motor on the left 60% with roomy white space at the right for HTML product copy. Style/medium: high-end industrial catalog photography, realistic steel paint and machining, clean soft shadow. Composition/framing: 4:3 wide editorial crop, no cut-off machine, no people. Color palette: cool steel gray, navy-blue details, white, light blueprint blue. Constraints: no model number, no text, no watermark, no UI, no labels.

## `public/media/production/production-factory-hero-v2.png`

Сгенерированная иллюстрация для текущего hero-экрана `/production`: обобщённый цех, крупная электрическая машина и специалист. Она не подтверждает конкретный цех, сотрудника, машину или технологический процесс КЭМЗ.

### Prompt

Use case: photorealistic-natural. Asset type: wide website production page hero. Realistic heavy electrical-machine factory interior, a massive cylindrical electric motor stator with copper windings and one engineer in unmarked navy workwear. Ultra-wide composition with dark negative space at left for HTML copy. Constraints: no visible text, no labels, no lettering on clothing, no logos, no watermarks, no fake brand marks.

## `public/media/production/real/*`

Подлинные фотографии КЭМЗ, извлечённые из `master` (`assets/images/about_1.jpg` — `about_5.jpg`) 19 сентября 2026 года. На странице `/production` они используются в галерее «Наше производство». Файлы сохранены отдельно, чтобы исходные пути исторической ветки не менялись.
