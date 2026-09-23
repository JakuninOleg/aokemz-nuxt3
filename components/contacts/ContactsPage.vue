<script setup lang="ts">
import ContactsHero from "./ContactsHero.vue";
import ContactsDirectory from "./ContactsDirectory.vue";
import ContactsForm from "./ContactsForm.vue";
</script>

<template>
  <div class="kemz-home kemz-contacts">
    <ContactsHero />
    <ContactsDirectory />
    <ContactsForm />
  </div>
</template>

<style lang="scss" src="~/assets/css/home.scss"></style>
<style lang="scss" src="~/assets/css/contacts.scss"></style>
