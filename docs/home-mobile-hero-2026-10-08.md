# Мобильный hero КЭМЗ

Отдельная вертикальная иллюстрация создана встроенным Image Generation 08.10.2026 по просьбе владельца. Не документальное фото завода и не подтверждение конкретной модели техники.

Исходник: `.design/hero-quarry-mobile-v1-source.png`, 1024×1536. Публичные WebP: `migration/next/public/media/generated/hero-quarry-mobile-v1-640.webp` (107 KiB), `hero-quarry-mobile-v1-1024.webp` (234 KiB). AVIF-варианты: 640 px (60 KiB), 1024 px (127 KiB). Скрипт: `migration/next/scripts/prepare-home-mobile-hero.mjs`, WebP quality 82 / AVIF quality 55, без увеличения исходника. Браузеры с AVIF получают его; остальные — WebP.

Только главная при ширине до 600 px. `picture` и preload используют одинаковый srcset и sizes, поэтому браузер выбирает один вариант с учётом плотности экрана. Desktop не изменён. Прежняя панорама 480×160 сильно увеличивалась при object-fit: cover в блоке высотой 540 px.

## Prompt

Use case: ads-marketing. Create a photorealistic industrial editorial background image for a mobile website hero for a Russian electric machinery manufacturer. Portrait 1024 x 1536 composition, no text, no logo, no watermark, no UI. A large realistic weathered yellow rope shovel mining excavator in an open-pit rock quarry, detailed steel boom, cables, tracks and shovel bucket, engineering realism, not futuristic. Cool blue-gray dusk clouds with muted warm sunlight at far right, slate rock textures, crisp natural detail, photographic sharpness without artificial halos. Composition specifically for white website headline overlay: top 45 percent is calm dark blue-gray clouded sky with no busy detail; excavator body is at approximately 65 percent height, centered slightly right, boom extends upward in right half but does not dominate top left. Bottom 20 percent gravel quarry floor. Full excavator and bucket should fit the portrait, clear subject identity at phone width. Spacious dramatic quarry environment. Do not bake dark gradient or text into image; site applies its own gradient. This is an illustrative scene, not an actual named plant or exact certified product model.
