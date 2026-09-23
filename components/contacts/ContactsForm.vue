<script setup lang="ts">
import { CONTACTS_FORM } from "~/utils/contactsContent";
import ContactsSalesForm from "./ContactsSalesForm.vue";
</script>

<template>
  <section class="contacts-form-band" aria-labelledby="contacts-form-title">
    <div class="ref-container contacts-form-band__grid">
      <div class="contacts-form-band__copy">
        <h2 id="contacts-form-title">{{ CONTACTS_FORM.title }}</h2>
        <p>{{ CONTACTS_FORM.lead }}</p>
        <ContactsSalesForm />
      </div>

      <figure class="contacts-form-band__media">
        <img
          :src="CONTACTS_FORM.image"
          :alt="CONTACTS_FORM.imageAlt"
          width="1200"
          height="1600"
          loading="lazy"
          decoding="async"
        />
        <figcaption aria-hidden="true">
          <span v-for="line in CONTACTS_FORM.aside" :key="line">{{
            line
          }}</span>
        </figcaption>
      </figure>
    </div>
  </section>
</template>
