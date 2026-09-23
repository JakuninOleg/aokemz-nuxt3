<template>
  <ContactsPage />
</template>

<script setup lang="ts">
import ContactsPage from "~/components/contacts/ContactsPage.vue";
import { PAGE_SEO } from "~/utils/siteSeo";

usePageSeo(PAGE_SEO.contacts);
</script>
