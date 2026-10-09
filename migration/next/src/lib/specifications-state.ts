type Node = { text?: string; type?: string; children?: Node[]; root?: Node };

/** Empty imported tables and the legacy sales placeholder are not technical data. */
export function specificationsNeedEnquiry(data: unknown): boolean {
  const parts: string[] = [];
  let hasMedia = false;
  const visit = (node: Node) => {
    if (node.type === 'upload') hasMedia = true;
    if (node.text) parts.push(node.text);
    node.children?.forEach(visit);
  };
  const root = (data as Node | null)?.root;
  if (root) visit(root);
  const text = parts.join(' ').replace(/\s+/g, ' ').trim();
  return !hasMedia && (!text || /^уточняйте в отделе продаж[.!]?$/i.test(text));
}
