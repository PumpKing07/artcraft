-- Обновляет image_url для всех курсов и товаров на локальные пути.
-- Картинки лежат в public/images/ и раздаются с того же домена, что и фронт.
-- Запуск:
--   psql -U artcraft_user -d artcraft_db -f scripts/update-image-urls.sql
-- Или открой psql и выполни содержимое файла.

BEGIN;

-- Курсы
UPDATE courses SET image_url = '/images/courses/01.jpg' WHERE slug = 'akvarelnyj-sketching-5-dnej';
UPDATE courses SET image_url = '/images/courses/02.jpg' WHERE slug = 'digital-illustraciya-ot-idei-do-shedevra';
UPDATE courses SET image_url = '/images/courses/03.jpg' WHERE slug = 'lepka-iz-polimernoj-gliny-ukrasheniya';
UPDATE courses SET image_url = '/images/courses/04.jpg' WHERE slug = 'sovremennaya-kalligrafiya-osnovy';
UPDATE courses SET image_url = '/images/courses/05.jpg' WHERE slug = 'osnovy-fotografii-kompoziciya-i-svet';
UPDATE courses SET image_url = '/images/courses/06.jpg' WHERE slug = 'maslyanaya-zhivopis-dlya-nachinayushchih';
UPDATE courses SET image_url = '/images/courses/07.jpg' WHERE slug = 'keramika-sozdanie-posudy-na-gonch-kruge';
UPDATE courses SET image_url = '/images/courses/08.jpg' WHERE slug = 'akrilovaya-zhivopis-abstrakciya';
UPDATE courses SET image_url = '/images/courses/09.jpg' WHERE slug = 'sketching-markerami-interery';
UPDATE courses SET image_url = '/images/courses/10.jpg' WHERE slug = 'kalligrafiya-kistyu-vostochnye-tehniki';
UPDATE courses SET image_url = '/images/courses/11.jpg' WHERE slug = 'portretnaya-zhivopis-tehnika-i-praktika';
UPDATE courses SET image_url = '/images/courses/12.jpg' WHERE slug = 'tvorcheskaya-fotografiya-avtorskij-stil';

-- Товары
UPDATE products SET image_url = '/images/products/01.jpg' WHERE slug = 'nabor-kistej-akvarel';
UPDATE products SET image_url = '/images/products/02.jpg' WHERE slug = 'akvarelnye-kraski-24';
UPDATE products SET image_url = '/images/products/03.jpg' WHERE slug = 'holst-50x70';
UPDATE products SET image_url = '/images/products/04.jpg' WHERE slug = 'akrilovye-kraski-36';
UPDATE products SET image_url = '/images/products/05.jpg' WHERE slug = 'sketchbook-a4-karandashi';
UPDATE products SET image_url = '/images/products/06.jpg' WHERE slug = 'polimernaya-glina-24';
UPDATE products SET image_url = '/images/products/07.jpg' WHERE slug = 'derevyannyj-molbert';
UPDATE products SET image_url = '/images/products/08.jpg' WHERE slug = 'nabor-mastihinov-5';
UPDATE products SET image_url = '/images/products/09.jpg' WHERE slug = 'kalligraficheskij-nabor-premium';
UPDATE products SET image_url = '/images/products/10.jpg' WHERE slug = 'spirtovye-markery-120';
UPDATE products SET image_url = '/images/products/11.jpg' WHERE slug = 'nabor-instrumentov-keramika';
UPDATE products SET image_url = '/images/products/12.jpg' WHERE slug = 'organajzer-dlya-hudozh-materialov';

COMMIT;

-- Проверка: покажет первые 5 курсов и товаров с их новыми URL.
SELECT slug, image_url FROM courses ORDER BY slug LIMIT 5;
SELECT slug, image_url FROM products ORDER BY slug LIMIT 5;
