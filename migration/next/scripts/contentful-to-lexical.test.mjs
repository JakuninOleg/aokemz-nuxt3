import test from 'node:test';
import assert from 'node:assert/strict';
import { contentfulToLexical } from '../src/lib/contentful-to-lexical.mjs';

const text = (value, marks = []) => ({
  nodeType: 'text',
  value,
  marks,
  data: {},
});

const paragraph = (...content) => ({
  nodeType: 'paragraph',
  data: {},
  content,
});

const document = (...content) => ({
  nodeType: 'document',
  data: {},
  content,
});

const linkTarget = (id, linkType = 'Entry') => ({
  sys: { type: 'Link', linkType, id },
});

function rootChildren(doc, options) {
  return contentfulToLexical(doc, options).root.children;
}

test('paragraphs, headings, quote, and text marks', () => {
  const [p, h2, quote] = rootChildren(document(
    paragraph(
      text('plain '),
      text('bold', [{ type: 'bold' }]),
      text(' '),
      text('combo', [{ type: 'italic' }, { type: 'underline' }, { type: 'code' }]),
    ),
    {
      nodeType: 'heading-2',
      data: {},
      content: [text('Заголовок')],
    },
    {
      nodeType: 'blockquote',
      data: {},
      content: [paragraph(text('цитата'))],
    },
  ));

  assert.equal(p.type, 'paragraph');
  assert.equal(p.children[1].format, 1);
  assert.equal(p.children[3].format, (1 << 1) | (1 << 3) | (1 << 4));
  assert.deepEqual({ type: h2.type, tag: h2.tag, text: h2.children[0].text }, {
    type: 'heading',
    tag: 'h2',
    text: 'Заголовок',
  });
  assert.equal(quote.type, 'quote');
  assert.equal(quote.children[0].type, 'paragraph');
  assert.equal(quote.children[0].children[0].text, 'цитата');
});

test('ordered and unordered lists unwrap list-item paragraphs', () => {
  const [ul, ol] = rootChildren(document(
    {
      nodeType: 'unordered-list',
      data: {},
      content: [{
        nodeType: 'list-item',
        data: {},
        content: [paragraph(text('один'))],
      }],
    },
    {
      nodeType: 'ordered-list',
      data: {},
      content: [{
        nodeType: 'list-item',
        data: {},
        content: [paragraph(text('первый'))],
      }],
    },
  ));

  assert.deepEqual({ type: ul.type, listType: ul.listType, tag: ul.tag }, {
    type: 'list',
    listType: 'bullet',
    tag: 'ul',
  });
  assert.equal(ul.children[0].type, 'listitem');
  assert.equal(ul.children[0].children[0].type, 'text');
  assert.equal(ul.children[0].children[0].text, 'один');
  assert.deepEqual({ type: ol.type, listType: ol.listType, tag: ol.tag, start: ol.start }, {
    type: 'list',
    listType: 'number',
    tag: 'ol',
    start: 1,
  });
});

test('tables map header cells to headerState ROW', () => {
  const [table] = rootChildren(document({
    nodeType: 'table',
    data: {},
    content: [{
      nodeType: 'table-row',
      data: {},
      content: [
        {
          nodeType: 'table-header-cell',
          data: {},
          content: [paragraph(text('Мощность'))],
        },
        {
          nodeType: 'table-cell',
          data: {},
          content: [paragraph(text('560 кВт'))],
        },
      ],
    }],
  }));

  assert.equal(table.type, 'table');
  assert.equal(table.children[0].type, 'tablerow');
  const [header, cell] = table.children[0].children;
  assert.equal(header.type, 'tablecell');
  assert.equal(header.headerState, 1);
  assert.equal(header.colSpan, 1);
  assert.equal(header.rowSpan, 1);
  assert.equal(header.children[0].children[0].text, 'Мощность');
  assert.equal(cell.headerState, 0);
  assert.equal(cell.children[0].children[0].text, '560 кВт');
});

test('safe hyperlinks and entry hyperlinks use custom link fields', () => {
  const [p] = rootChildren(document(paragraph(
    {
      nodeType: 'hyperlink',
      data: { uri: 'https://aokemz.ru/products' },
      content: [text('каталог')],
    },
    text(' / '),
    {
      nodeType: 'entry-hyperlink',
      data: { target: linkTarget('news1') },
      content: [text('новость')],
    },
  )), {
    resolveEntry: (target) => `/news/${target.sys.id}`,
  });

  const [external, , internal] = p.children;
  assert.equal(external.type, 'link');
  assert.equal(external.version, 3);
  assert.equal(external.fields.linkType, 'custom');
  assert.equal(external.fields.url, 'https://aokemz.ru/products');
  assert.equal(external.children[0].text, 'каталог');
  assert.equal(internal.fields.url, '/news/news1');
  assert.match(external.id, /^[a-f0-9]{24}$/);
});

test('embedded asset becomes upload; asset-hyperlink needs {id,url}', () => {
  const assets = {
    img1: { id: 42, url: 'https://cdn.example/a.jpg' },
  };
  const resolveAsset = (target) => assets[target.sys.id] ?? null;

  const [upload] = rootChildren(document({
    nodeType: 'embedded-asset-block',
    data: { target: linkTarget('img1', 'Asset') },
    content: [],
  }), { resolveAsset });

  assert.equal(upload.type, 'upload');
  assert.equal(upload.version, 3);
  assert.equal(upload.relationTo, 'media');
  assert.equal(upload.value, 42);
  assert.deepEqual(upload.fields, {});

  const [p] = rootChildren(document(paragraph({
    nodeType: 'asset-hyperlink',
    data: { target: linkTarget('img1', 'Asset') },
    content: [text('файл')],
  })), { resolveAsset });
  assert.equal(p.children[0].fields.url, 'https://cdn.example/a.jpg');

  const [uploadFromId] = rootChildren(document({
    nodeType: 'embedded-asset-block',
    data: { target: linkTarget('img1', 'Asset') },
    content: [],
  }), { resolveAsset: () => 7 });
  assert.equal(uploadFromId.value, 7);
});

test('empty document yields a single empty paragraph', () => {
  const state = contentfulToLexical(document());
  assert.equal(state.root.type, 'root');
  assert.equal(state.root.children.length, 1);
  assert.equal(state.root.children[0].type, 'paragraph');
  assert.equal(state.root.children[0].children[0].text, '');
});

test('rejects disguised executable URLs and preserves multi-paragraph list separation', () => {
  for (const uri of ['javascript:evil.example', '//evil.example', '/\\evil.example', 'https://', 'data:text/html,x']) {
    assert.throws(() => contentfulToLexical(document(paragraph({ nodeType: 'hyperlink', data: { uri }, content: [text('x')] }))), /Unsafe/);
  }
  const [list] = rootChildren(document({ nodeType: 'unordered-list', content: [
    { nodeType: 'list-item', content: [paragraph(text('a')), paragraph(text('b'))] },
  ] }));
  assert.equal(list.children[0].children[1].type, 'linebreak');
});

test('throws on unknown nodes, unsafe links, and missing resolvers', () => {
  assert.throws(
    () => contentfulToLexical({ nodeType: 'paragraph', content: [] }),
    /Expected Contentful rich text document/,
  );
  assert.throws(
    () => contentfulToLexical(document({ nodeType: 'hr', data: {}, content: [] })),
    /Unsupported Contentful node type: hr/,
  );
  assert.throws(
    () => contentfulToLexical(document(paragraph(text('x', [{ type: 'rainbow' }])))),
    /Unknown text mark: rainbow/,
  );
  assert.throws(
    () => contentfulToLexical(document(paragraph({
      nodeType: 'hyperlink',
      data: { uri: 'javascript:alert(1)' },
      content: [text('x')],
    }))),
    /Unsafe or invalid hyperlink URL/,
  );
  assert.throws(
    () => contentfulToLexical(document(paragraph({
      nodeType: 'entry-hyperlink',
      data: { target: linkTarget('missing') },
      content: [text('x')],
    })), { resolveEntry: () => null }),
    /Unresolved entry hyperlink missing/,
  );
  assert.throws(
    () => contentfulToLexical(document({
      nodeType: 'embedded-asset-block',
      data: { target: linkTarget('gone', 'Asset') },
      content: [],
    }), { resolveAsset: () => null }),
    /Unresolved asset gone/,
  );
  assert.throws(
    () => contentfulToLexical(document(paragraph({
      nodeType: 'asset-hyperlink',
      data: { target: linkTarget('img', 'Asset') },
      content: [text('x')],
    })), { resolveAsset: () => 9 }),
    /requires resolveAsset to return \{id,url\}/,
  );
  assert.throws(
    () => contentfulToLexical(document(paragraph({
      nodeType: 'entry-hyperlink',
      data: {},
      content: [text('x')],
    })), { resolveEntry: () => '/x' }),
    /Missing link target/,
  );
  assert.throws(
    () => contentfulToLexical(document({
      nodeType: 'embedded-entry-block',
      data: { target: linkTarget('e1') },
      content: [],
    })),
    /Unsupported Contentful node type: embedded-entry-block/,
  );
});
