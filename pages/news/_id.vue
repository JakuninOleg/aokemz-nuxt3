<template>
  <section class="section mt-8 lg:mt-24 mb-10 lg:mb-16">
    <div class="grid gap-2">
      <h2 class="font-semibold text-2xl">
        {{ article.fields.header }}
      </h2>
      <p>
        {{
          new Date(article.fields.date).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'numeric',
          })
        }}
      </p>
      <img
        class="xl:w-1/2 mb-4"
        :src="article.fields.image.fields.file.url"
        :alt="article.fields.header"
        loading="lazy"
      />
      <div class="grid gap-4 mb-5" v-html="richTextHtml" />
      <NuxtLink to="/news" class="flex items-center w-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 mr-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Все новости
      </NuxtLink>
    </div>
  </section>
</template>

<script>
// import Form from '~/components/Form.vue'
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import { BLOCKS, MARKS, INLINES } from '@contentful/rich-text-types'
import { createClient } from '~/plugins/contentful.js'

const client = createClient()

export default {
  asyncData({ env, params }) {
    return Promise.all([
      client.getEntries({
        content_type: 'news',
        'sys.id': params.id,
      }),
    ]).then(([entries]) => {
      const options = {
        renderMark: {
          [MARKS.BOLD]: (text) => `<span class="font-bold">${text}</span>`,
          [MARKS.ITALIC]: (text) => `<p class="article__red">${text}</p>`,
        },
        renderNode: {
          [BLOCKS.HEADING_2]: (node, children) =>
            `<h2 class="heading-2">${children(node.content)}</h2>`,
          [BLOCKS.UL_LIST]: (node, children) =>
            `<ul class="ul mt-4">${children(node.content)}</ul>`,
          [BLOCKS.LIST_ITEM]: (node, children) =>
            `<li class="">${children(node.content)}</li>`,
          [BLOCKS.EMBEDDED_ASSET]: (node) =>
            `<img class="image-article" src="${node.data.target.fields.file.url}"/>`,
          [INLINES.ENTRY_HYPERLINK]: (node) =>
            `<a class="link" href="/products/another/${node.data.target.fields.url}">${node.content[0].value}</a>`,
          [BLOCKS.TABLE]: (node, children) =>
            `<table class="table-fixed border-collapse border-spacing-4 border-slate-500">
            <tbody>${children(node.content)}</tbody></table>`,
          [BLOCKS.TABLE_HEADER_CELL]: (node, children) =>
            `<th class="bg-gray-300 px-4 border border-slate-700">${children(
              node.content
            )}</th>`,
          [BLOCKS.TABLE_CELL]: (node, children) =>
            `<td class="px-4 border border-slate-700">${children(
              node.content
            )}</td>`,
        },
      }

      return {
        article: entries.items[0],
        richTextHtml: documentToHtmlString(
          entries.items[0].fields.htmlText,
          options
        ),
        richTextHtml2: documentToHtmlString(
          entries.items[0].fields.params,
          options
        ),
      }
    })
  },
}
</script>
