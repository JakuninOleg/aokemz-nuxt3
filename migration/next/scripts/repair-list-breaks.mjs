// One-time migration correction. Refuse to overwrite any editor modifications.
import { getPayload } from 'payload';
import config from '../src/payload.config.ts';
import { contentfulToLexical } from '../src/lib/contentful-to-lexical.mjs';
const target = new URL(process.env.DATABASE_URL);
if (target.hostname !== 'a1b261b9619c2200fd8955fe.twc1.net' || target.pathname !== '/default_db') throw new Error('Wrong migration target');
const payload = await getPayload({ config });
const canonical = value => JSON.stringify(value, (key, node) => key === 'id' ? undefined :
  node && typeof node === 'object' && !Array.isArray(node)
    ? Object.fromEntries(Object.keys(node).sort().map(name => [name, node[name]])) : node);
const stripBreaks = node => ({ ...node, ...(node.children ? {
  children: node.children.filter(child => child.type !== 'linebreak').map(stripBreaks),
} : {}) });
let repaired = 0;
try {
  for (const collection of ['products', 'news']) {
    const records = await payload.find({ collection, depth: 0, limit: 100, overrideAccess: true });
    for (const doc of records.docs) {
      for (const [field, sourceField] of collection === 'products'
        ? [['description', 'sourceDescription'], ['specifications', 'sourceSpecifications']] : [['body', 'sourceBody']]) {
        const source = doc[sourceField];
        let affected = false;
        const walk = node => {
          if (node?.nodeType === 'list-item' && node.content.filter(child => child.nodeType === 'paragraph').length > 1) affected = true;
          node?.content?.forEach(walk);
        };
        walk(source);
        if (!affected) continue;
        const corrected = contentfulToLexical(source);
        if (canonical(corrected) === canonical(doc[field])) continue;
        if (canonical({ root: stripBreaks(corrected.root) }) !== canonical(doc[field])) throw new Error('Record changed; refusing correction');
        await payload.update({ collection, id: doc.id, overrideAccess: true, data: { [field]: corrected } });
        repaired++;
      }
    }
  }
  console.log(JSON.stringify({ repairedListFields: repaired }));
} finally { await payload.destroy(); }
process.exit(0);
