<script setup lang="ts">
import {
  CONTACTS_ADDRESS,
  CONTACTS_DIRECTORY,
  CONTACTS_LIST,
  type ContactEntry,
} from "~/utils/contactsContent";

const iconPaths: Record<ContactEntry["icon"], string> = {
  reception:
    "M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z",
  sales:
    "M4 7h16v12H4Zm2 2v8h12V9Zm3 2h2v2H9Zm4 0h2v2h-2ZM7 4h2v2H7Zm8 0h2v2h-2Z",
  supply:
    "M7 18a2 2 0 1 0 2 2 2 2 0 0 0-2-2Zm10 0a2 2 0 1 0 2 2 2 2 0 0 0-2-2ZM3 4h2l2.4 9.2a2 2 0 0 0 2 1.5h7.4a2 2 0 0 0 1.9-1.4L21 7H7",
  otk: "M12 2 4 6v6c0 5 3.4 9.4 8 10 4.6-.6 8-5 8-10V6Zm0 4.2 4 1.8v3.5c0 3.2-2 6-4 6.7-2-.7-4-3.5-4-6.7V8Z",
  quality:
    "M12 2 3 6v6c0 5.2 3.5 9.7 9 11 5.5-1.3 9-5.8 9-11V6Zm-1.2 13-3.8-3.8 1.4-1.4 2.4 2.4 4.6-4.6 1.4 1.4Z",
  hr: "M9 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3Zm6 0a3 3 0 1 0-3-3 3 3 0 0 0 3 3ZM3 19c0-2.5 2.7-4.5 6-4.5.7 0 1.4.1 2 .3A5.6 5.6 0 0 1 15 14.5c3.3 0 6 2 6 4.5v1H3Z",
};
</script>

<template>
  <section class="contacts-dir" aria-labelledby="contacts-dir-title">
    <div class="ref-container contacts-dir__grid">
      <div class="contacts-dir__list">
        <header class="contacts-dir__head">
          <h2 id="contacts-dir-title">{{ CONTACTS_DIRECTORY.title }}</h2>
          <p>{{ CONTACTS_DIRECTORY.lead }}</p>
        </header>

        <ul class="contacts-dir__rows">
          <li
            v-for="item in CONTACTS_LIST"
            :key="item.position"
            class="contacts-dir__row"
          >
            <span class="contacts-dir__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                <path :d="iconPaths[item.icon]" />
              </svg>
            </span>
            <div class="contacts-dir__meta">
              <h3>{{ item.position }}</h3>
              <p v-if="item.person">{{ item.person }}</p>
            </div>
            <div class="contacts-dir__links">
              <a
                v-for="tel in item.phones"
                :key="tel.href"
                :href="tel.href"
                >{{ tel.label }}</a
              >
              <a :href="`mailto:${item.email}`">{{ item.email }}</a>
            </div>
          </li>
        </ul>
      </div>

      <aside class="contacts-dir__aside">
        <div class="contacts-dir__address">
          <span class="contacts-dir__pin" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <path
                d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 14.5 9 2.5 2.5 0 0 1 12 11.5Z"
              />
            </svg>
          </span>
          <h3>{{ CONTACTS_ADDRESS.title }}</h3>
          <p>
            <template v-for="(line, i) in CONTACTS_ADDRESS.lines" :key="line">
              {{ line }}<br v-if="i < CONTACTS_ADDRESS.lines.length - 1" />
            </template>
          </p>
          <a
            class="contacts-dir__map"
            :href="CONTACTS_ADDRESS.mapHref"
            target="_blank"
            rel="noopener noreferrer"
            >{{ CONTACTS_ADDRESS.mapLabel }}
            <span aria-hidden="true">→</span></a
          >
        </div>

        <figure class="contacts-dir__entrance">
          <img
            :src="CONTACTS_ADDRESS.entranceImage"
            :alt="CONTACTS_ADDRESS.entranceAlt"
            width="960"
            height="720"
            loading="lazy"
            decoding="async"
          />
          <figcaption>{{ CONTACTS_ADDRESS.entranceCaption }}</figcaption>
        </figure>
      </aside>
    </div>
  </section>
</template>
