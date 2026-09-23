# Изображения страницы «О заводе», 19 сентября 2026

Созданы встроенным Image Generation. Это визуальные иллюстрации, а не свидетельство реального внешнего вида предприятия, сотрудников или архивных событий. Технические характеристики берутся отдельно из подтверждённых документов. Исходники не удалены.

Все новые файлы находятся в `public/media/about/`:

- `about-worker-rotor-brand.png`: специалист у ротора, широкий кадр. Референс эмблемы: `assets/images/kemz-logo.webp`.
- `about-plant-brand.png`: исправлены эмблемы на ранее сгенерированном фасаде.
- `about-engineer-brand.png`: исправлены эмблемы на кепке и спецодежде; используется как осветлённый фон правой колонки.
- `about-galvanic-line.png`: иллюстрация гальванических ванн вместо изображения механически обработанных деталей.
- `about-history-aerial.png`: синтетическая чёрно-белая иллюстрация промышленной площадки, не подлинная архивная фотография КЭМЗ.

## Промпты

Worker: “Create photorealistic industrial editorial website photograph, wide 2.5:1 landscape 1920x768. A worker in navy blue work jacket and navy cap viewed from back/side at LEFT third, carefully assembling a huge electric motor rotor with copper winding at center/right. Rotor cylindrical with copper winding and steel laminated rings, massive steel shaft protrudes left, in authentic machinery workshop, overhead windows, steel blue and copper palette. Composition like professional factory photography: worker waist up fully visible, motor occupies right 65%, no crop to worker head. The supplied image is the EXACT authentic company emblem, supporting logo reference. Reproduce that identical circular blue monogram emblem (not hexagon, NOT web, NOT gear) on a white rectangular stitched patch on worker's upper back, followed by exact Cyrillic text 'КЭМЗ'. No other brands/logos/text. Do not reinvent logo. Crisp realistic fabric and machinery, natural daylight, no graphic overlays.”

Plant: “Edit image1 factory photo. Replace ALL fake hexagonal web logos on roof and entry with EXACT circular monogram supplied image2. Roof inscription just КЭМЗ, no other roof text. Entry sign just КЭМЗ with real circular logo. Preserve entire building and photograph unchanged, aspect2.5:1. No invented marks.”

Engineer: “Edit image1: replace BOTH fake web logos on cap and shirt with EXACT supplied image2 circular monogram in white embroidery followed by КЭМЗ. All other photograph content unchanged.”

Galvanic: “Photoreal industrial editorial photograph of galvanic electroplating production line, stainless steel rectangular open vats with blue metal supports and overhead yellow pipework inside factory. Cropped medium wide view, no people no text no brands no logos. Cold natural daylight, documentary engineering photography, horizontal 3:2 composition. For small manufacturing capability card.”

History: “Generate a black and white historical-style photographic illustration of a Soviet electrical machinery industrial complex seen from an elevated aerial oblique view. Long brick production halls, sawtooth roofs, railway siding, Ural town trees and low buildings in distance. Archival film grain, subdued contrast, circa 1960s aesthetic, horizontal 2.4:1 composition. No labels, dates, brands, text, logos, borders. This is a clearly internally documented synthetic illustration for a history collage, not an actual archival document.”

## Осознанные отличия от макета

- Общие header/footer не подгоняются под изображение по прямому указанию пользователя.
- Вместо фильма в hero используется действующая ссылка на каталог.
- Карта предоставлена пользователем: `about-geography-map.png`.

Для доставки на сайт активные иллюстрации имеют WebP-варианты шириной до 1600 px и quality 82; PNG остаются исходниками и не используются в markup.
- Даты и события хронологии сохранены из фактов проекта; неподтверждённые даты макета не добавлялись.
- Вместо вымышленных логотипов заказчиков показаны подтверждённые названия площадок. Поиск и переключатель языка не имитируются без существующих функций.
