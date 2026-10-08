import assert from 'node:assert/strict';
import { test } from 'node:test';
import { categorySearchCopy, productSearchCopy, seoSummary } from '../src/lib/catalog-seo';

test('known category gets meaningful search copy without changing its identity', () => {
  const category = { slug: 'mining', title: 'Шахтное оборудование' };
  const result = categorySearchCopy(category);
  assert.match(result.title, /Шахтные электродвигатели/);
  assert.match(result.description, /ДПТ 45/);
  assert.equal(category.title, 'Шахтное оборудование');
});

test('CMS category description takes precedence; unknown categories remain supported', () => {
  const result = categorySearchCopy({ slug: 'new-category', title: 'Новый раздел', description: '  Текст   редактора.  ' });
  assert.equal(result.title, 'Новый раздел: каталог');
  assert.equal(result.description, 'Текст редактора.');
});

test('product copy identifies record without fabricating stock, price or specifications', () => {
  const result = productSearchCopy({ title: 'Электродвигатель ДПТ 45' }, 'Для привода рудничных электровозов.');
  assert.match(result.description, /^Электродвигатель ДПТ 45\./);
  assert.doesNotMatch(result.description, /в наличии|гарантия|руб|45 кВт/i);
});

test('already named models are not repeated despite separators', () => {
  const result = productSearchCopy({ title: 'Электродвигатель ДПТ 45' }, '', 'ДПТ-45, ДПТ 45');
  assert.equal(result.title, 'Электродвигатель ДПТ 45');
});

test('specification model list is bounded and descriptions remain distinct', () => {
  const first = productSearchCopy({ title: 'Генераторы серии 4ГПЭ' }, 'Технические данные.', '4ГПЭ 300, 4ГПЭ 600, 4ГПЭ 1250');
  const second = productSearchCopy({ title: 'Генераторы серии 4ГПЭМ' }, 'Технические данные.');
  assert.match(first.title, /4ГПЭ 300, 4ГПЭ 600/);
  assert.doesNotMatch(first.title, /1250/);
  assert.notEqual(first.description, second.description);
});

test('snippets are trimmed on a word boundary and not duplicated', () => {
  assert.ok(seoSummary('слово '.repeat(100)).length <= 240);
  const result = productSearchCopy({ title: 'ДПТ 45' }, 'ДПТ 45 — рудничный двигатель.');
  assert.equal(result.description, 'ДПТ 45 — рудничный двигатель.');
});

test('same imported title is distinguished by real model or category context', () => {
  const first = productSearchCopy({ title: 'Тяговые электродвигатели ДАТЧ' }, 'Применение.', 'ДАТЧ63-4УХЛ1');
  const second = productSearchCopy({ title: 'Тяговые электродвигатели ДАТЧ' }, 'Применение.', 'ДАТЧ180-4УХЛ1');
  assert.notEqual(first.title, second.title);
  assert.notEqual(first.description, second.description);
  const historical = productSearchCopy({ title: 'Комплект ЭКГ-18/20' }, '', '', 'Другое');
  const main = productSearchCopy({ title: 'Комплект ЭКГ-18/20' }, '', '', 'Экскаваторное оборудование');
  assert.notEqual(historical.title, main.title);
  assert.notEqual(historical.description, main.description);
});
