import { randomBytes } from 'node:crypto';

/** Lexical text format flags (Payload 3.90.2 / lexical 0.50 NodeFormat). */
const FORMAT = {
  bold: 1,
  italic: 1 << 1,
  strikethrough: 1 << 2,
  underline: 1 << 3,
  code: 1 << 4,
  subscript: 1 << 5,
  superscript: 1 << 6,
};

/** @lexical/table TableCellHeaderStates */
const HEADER = {
  NO_STATUS: 0,
  ROW: 1,
};

function nodeId() {
  return randomBytes(12).toString('hex');
}

function element(type, children, extra = {}) {
  return {
    type,
    children,
    direction: null,
    format: '',
    indent: 0,
    version: 1,
    ...extra,
  };
}

function textNode(text, format = 0) {
  return {
    type: 'text',
    detail: 0,
    format,
    mode: 'normal',
    style: '',
    text,
    version: 1,
  };
}

function emptyParagraph() {
  return element('paragraph', [textNode('')], { textFormat: 0, textStyle: '' });
}

/** Allow only intentional navigation protocols, never executable URLs. */
function isSafeUrl(url) {
  if (!url || typeof url !== 'string' || /[\s\\]/u.test(url)
    || [...url].some(character => character.codePointAt(0) < 32 || character.codePointAt(0) === 127)) return false;
  if (url.startsWith('#')) return true;
  if (url.startsWith('/')) return !url.startsWith('//');
  try {
    const urlObj = new URL(url);
    if (['http:', 'https:'].includes(urlObj.protocol)) return Boolean(urlObj.hostname) && !urlObj.username && !urlObj.password;
    return ['mailto:', 'tel:', 'sms:'].includes(urlObj.protocol) && Boolean(urlObj.pathname);
  } catch {
    return false;
  }
}

function requireTarget(node) {
  const target = node?.data?.target;
  const id = target?.sys?.id;
  if (!id) {
    throw new Error(`Missing link target on ${node?.nodeType || 'node'}`);
  }
  return target;
}

function marksToFormat(marks) {
  if (!marks?.length) return 0;
  let format = 0;
  for (const mark of marks) {
    const flag = FORMAT[mark?.type];
    if (flag == null) {
      throw new Error(`Unknown text mark: ${mark?.type}`);
    }
    format |= flag;
  }
  return format;
}

function resolveMedia(resolveAsset, target, nodeType) {
  if (typeof resolveAsset !== 'function') {
    throw new Error(`resolveAsset is required for ${nodeType}`);
  }
  const resolved = resolveAsset(target);
  if (resolved == null) {
    throw new Error(`Unresolved asset ${target.sys.id}`);
  }
  if (typeof resolved === 'number' && Number.isFinite(resolved)) {
    return { id: resolved, url: null };
  }
  if (
    resolved
    && typeof resolved === 'object'
    && typeof resolved.id === 'number'
    && Number.isFinite(resolved.id)
  ) {
    return { id: resolved.id, url: typeof resolved.url === 'string' ? resolved.url : null };
  }
  throw new Error(`resolveAsset must return a numeric media id or {id,url} for ${target.sys.id}`);
}

function uploadNode(mediaId) {
  return {
    type: 'upload',
    version: 3,
    format: '',
    id: nodeId(),
    fields: {},
    relationTo: 'media',
    value: mediaId,
  };
}

function linkNode(url, children) {
  if (!isSafeUrl(url)) {
    throw new Error(`Unsafe or invalid hyperlink URL: ${url}`);
  }
  return element('link', children, {
    version: 3,
    id: nodeId(),
    fields: {
      linkType: 'custom',
      newTab: false,
      url,
    },
  });
}

/**
 * Convert Contentful rich text document JSON to Payload 3.90.2 Lexical editor state.
 * Tables use EXPERIMENTAL_TableFeature node shapes (table / tablerow / tablecell).
 *
 * @param {object} document Contentful rich text document (`nodeType: 'document'`)
 * @param {{ resolveAsset?: Function, resolveEntry?: Function }} [options]
 * @returns {{ root: object }}
 */
export function contentfulToLexical(document, options = {}) {
  if (!document || document.nodeType !== 'document') {
    throw new Error('Expected Contentful rich text document');
  }

  const ctx = {
    resolveAsset: options.resolveAsset,
    resolveEntry: options.resolveEntry,
  };

  const children = (document.content || []).map((node) => convertBlock(node, ctx));
  return {
    root: element('root', children.length ? children : [emptyParagraph()]),
  };
}

function convertBlock(node, ctx) {
  switch (node.nodeType) {
    case 'paragraph':
      return element('paragraph', convertInlines(node.content || [], ctx), {
        textFormat: 0,
        textStyle: '',
      });
    case 'heading-1':
    case 'heading-2':
    case 'heading-3':
    case 'heading-4':
    case 'heading-5':
    case 'heading-6':
      return element('heading', convertInlines(node.content || [], ctx), {
        tag: `h${node.nodeType.slice(-1)}`,
      });
    case 'blockquote':
      return element(
        'quote',
        (node.content || []).map((child) => convertBlock(child, ctx)),
      );
    case 'unordered-list':
      return convertList(node, ctx, 'bullet', 'ul');
    case 'ordered-list':
      return convertList(node, ctx, 'number', 'ol');
    case 'table':
      return convertTable(node, ctx);
    case 'embedded-asset-block': {
      const target = requireTarget(node);
      const media = resolveMedia(ctx.resolveAsset, target, node.nodeType);
      return uploadNode(media.id);
    }
    case 'hr':
    case 'embedded-entry-block':
      throw new Error(`Unsupported Contentful node type: ${node.nodeType}`);
    default:
      throw new Error(`Unknown Contentful node type: ${node.nodeType}`);
  }
}

function convertList(node, ctx, listType, tag) {
  const items = (node.content || []).map((item, index) => {
    if (item.nodeType !== 'list-item') {
      throw new Error(`Expected list-item, got ${item.nodeType}`);
    }
    return element('listitem', convertListItemChildren(item.content || [], ctx), {
      value: index + 1,
    });
  });
  return element('list', items, { listType, start: 1, tag });
}

function convertListItemChildren(content, ctx) {
  const children = [];
  for (const child of content) {
    if (child.nodeType === 'paragraph') {
      if (children.length) children.push({ type: 'linebreak', version: 1 });
      children.push(...convertInlines(child.content || [], ctx));
    } else if (child.nodeType === 'unordered-list') {
      children.push(convertList(child, ctx, 'bullet', 'ul'));
    } else if (child.nodeType === 'ordered-list') {
      children.push(convertList(child, ctx, 'number', 'ol'));
    } else {
      throw new Error(`Unsupported node in list-item: ${child.nodeType}`);
    }
  }
  return children.length ? children : [textNode('')];
}

function convertTable(node, ctx) {
  const rows = (node.content || []).map((row) => {
    if (row.nodeType !== 'table-row') {
      throw new Error(`Expected table-row, got ${row.nodeType}`);
    }
    const cells = (row.content || []).map((cell) => convertTableCell(cell, ctx));
    return element('tablerow', cells);
  });
  return element('table', rows);
}

function convertTableCell(node, ctx) {
  if (node.nodeType !== 'table-cell' && node.nodeType !== 'table-header-cell') {
    throw new Error(`Expected table-cell or table-header-cell, got ${node.nodeType}`);
  }
  const children = (node.content || []).map((child) => convertBlock(child, ctx));
  return element('tablecell', children.length ? children : [emptyParagraph()], {
    backgroundColor: null,
    colSpan: 1,
    rowSpan: 1,
    headerState: node.nodeType === 'table-header-cell' ? HEADER.ROW : HEADER.NO_STATUS,
  });
}

function convertInlines(content, ctx) {
  return (content || []).map((node) => convertInline(node, ctx));
}

function convertInline(node, ctx) {
  switch (node.nodeType) {
    case 'text':
      return textNode(node.value ?? '', marksToFormat(node.marks));
    case 'hyperlink': {
      const url = node.data?.uri;
      if (!url) throw new Error('Missing hyperlink URI');
      return linkNode(url, convertInlines(node.content || [], ctx));
    }
    case 'entry-hyperlink': {
      const target = requireTarget(node);
      if (typeof ctx.resolveEntry !== 'function') {
        throw new Error('resolveEntry is required for entry-hyperlink');
      }
      const url = ctx.resolveEntry(target);
      if (url == null || url === '') {
        throw new Error(`Unresolved entry hyperlink ${target.sys.id}`);
      }
      if (typeof url !== 'string') {
        throw new Error(`resolveEntry must return a legacy relative URL string for ${target.sys.id}`);
      }
      return linkNode(url, convertInlines(node.content || [], ctx));
    }
    case 'asset-hyperlink': {
      const target = requireTarget(node);
      const media = resolveMedia(ctx.resolveAsset, target, node.nodeType);
      if (!media.url) {
        throw new Error(`Asset hyperlink ${target.sys.id} requires resolveAsset to return {id,url}`);
      }
      return linkNode(media.url, convertInlines(node.content || [], ctx));
    }
    case 'embedded-entry-inline':
      throw new Error(`Unsupported Contentful node type: ${node.nodeType}`);
    default:
      throw new Error(`Unknown Contentful inline node type: ${node.nodeType}`);
  }
}
