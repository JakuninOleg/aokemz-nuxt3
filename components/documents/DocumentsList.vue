<script setup lang="ts">
import { DOCUMENTS_LIST } from "~/utils/documentsContent";

const pad = (index: number) => String(index + 1).padStart(2, "0");
</script>

<template>
  <section class="docs-list" aria-labelledby="docs-list-title">
    <div class="ref-container">
      <h2 id="docs-list-title" class="visually-hidden">Файлы для скачивания</h2>
      <ul class="docs-list__rows">
        <li v-for="(doc, index) in DOCUMENTS_LIST" :key="doc.href">
          <a
            class="docs-row"
            :href="doc.href"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="docs-row__index">{{ pad(index) }}</span>
            <DocumentsFileIcon :ext="doc.ext" />
            <span class="docs-row__copy">
              <strong>{{ doc.title }}</strong>
              <small>{{ doc.note }}</small>
            </span>
            <span class="docs-row__action">
              <span class="docs-row__action-label">Открыть</span>
              <span class="docs-row__action-icon" aria-hidden="true">↗</span>
            </span>
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>
