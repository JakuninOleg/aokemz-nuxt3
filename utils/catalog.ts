import { contentfulAssetUrl } from './productsContent';

export type CatalogCategory = { sys: { id: string }; fields: { Name: string; url: string; display: boolean; image?: { fields?: { file?: { url?: string } } } } };
type RichNode = { nodeType?: string; value?: string; content?: RichNode[] };
export type CatalogEntry = { sys: { id: string }; fields: { name: string; url: string; type?: string; order?: number; category?: CatalogCategory; image?: { fields?: { file?: { url?: string } } }; description?: RichNode; params?: RichNode } };
export type CatalogItem = ReturnType<typeof catalogItem>;

function plainText(node?: RichNode): string {
  if (!node) return '';
  return node.value ?? (node.content || []).map(plainText).join(node.nodeType === 'paragraph' ? '' : ' ').replace(/\s+/g, ' ').trim();
}

// Only simple label/value tables can be safely condensed. Multi-model tables
// stay on the detail page so their column context is never lost.
function specifications(node?: RichNode): { label: string; value: string }[] {
  if (!node) return [];
  if (node.nodeType === 'table') {
    if (node.content?.some(row => row.content?.length !== 2)) return [];
    return (node.content || []).filter(row => row.content?.every(cell => cell.nodeType === 'table-cell'))
      .map(row => ({ label: plainText(row.content?.[0]), value: plainText(row.content?.[1]) }))
      .filter(row => row.label && row.value && !/значени[ея] параметр/i.test(row.value) && row.label.length < 85 && row.value.length < 65);
  }
  return (node.content || []).flatMap(specifications);
}

export function catalogItem(entry: CatalogEntry) {
  const fields = entry.fields;
  return {
    id: entry.sys.id, name: fields.name, type: fields.type?.trim() || '', order: fields.order ?? 0,
    categoryId: fields.category?.sys.id || '', categoryName: fields.category?.fields?.Name || '',
    href: `/products/${fields.category?.fields?.url}/${fields.url}`,
    image: contentfulAssetUrl(fields.image?.fields?.file?.url),
    description: plainText(fields.description), specs: specifications(fields.params).slice(0, 3),
  };
}
