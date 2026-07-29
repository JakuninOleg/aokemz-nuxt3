import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import { BLOCKS, MARKS, INLINES } from '@contentful/rich-text-types'

function assetUrl(url?: string) {
  if (!url) return ''
  return url.startsWith('//') ? `https:${url}` : url
}

/** Shared Contentful → HTML for product/news bodies (mobile-safe tables). */
export function renderContentfulHtml(doc: unknown): string {
  if (!doc) return ''

  const options = {
    renderMark: {
      [MARKS.BOLD]: (text: string) => `<strong class="font-semibold">${text}</strong>`,
      [MARKS.ITALIC]: (text: string) => `<em>${text}</em>`,
    },
    renderNode: {
      [BLOCKS.HEADING_2]: (node: any, next: any) =>
        `<h2 class="text-xl font-bold mt-8 mb-3">${next(node.content)}</h2>`,
      [BLOCKS.PARAGRAPH]: (node: any, next: any) =>
        `<p class="mb-3 leading-relaxed">${next(node.content)}</p>`,
      [BLOCKS.UL_LIST]: (node: any, next: any) =>
        `<ul class="list-disc pl-5 my-4 space-y-1">${next(node.content)}</ul>`,
      [BLOCKS.OL_LIST]: (node: any, next: any) =>
        `<ol class="list-decimal pl-5 my-4 space-y-1">${next(node.content)}</ol>`,
      [BLOCKS.LIST_ITEM]: (node: any, next: any) => `<li>${next(node.content)}</li>`,
      [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
        const file = node.data?.target?.fields?.file
        const title = node.data?.target?.fields?.title || ''
        const src = assetUrl(file?.url)
        if (!src) return ''
        return `<img class="my-4 max-w-full h-auto rounded" src="${src}" alt="${title}" loading="lazy" />`
      },
      [INLINES.ENTRY_HYPERLINK]: (node: any) => {
        const fields = node.data?.target?.fields
        const label = node.content?.[0]?.value || fields?.name || 'ссылка'
        const cat = fields?.category?.fields?.url
        const prod = fields?.url
        const href =
          cat && prod ? `/products/${cat}/${prod}` : prod ? `/products/${prod}` : '#'
        return `<a class="text-kemz-blue underline underline-offset-2 hover:text-kemz-blue-deep" href="${href}">${label}</a>`
      },
      [BLOCKS.TABLE]: (node: any, next: any) =>
        `<div class="kemz-table-scroll my-6 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto overscroll-x-contain">
          <table class="kemz-table min-w-[36rem] w-full border-collapse text-sm sm:text-base">
            <tbody>${next(node.content)}</tbody>
          </table>
        </div>`,
      [BLOCKS.TABLE_HEADER_CELL]: (node: any, next: any) =>
        `<th class="border border-slate-300 bg-slate-100 px-3 py-2 text-left font-semibold align-top whitespace-nowrap">${next(node.content)}</th>`,
      [BLOCKS.TABLE_CELL]: (node: any, next: any) =>
        `<td class="border border-slate-300 px-3 py-2 align-top">${next(node.content)}</td>`,
    },
  }

  return documentToHtmlString(doc as any, options as any)
}
