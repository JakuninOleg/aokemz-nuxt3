<template>
  <div class="flex min-h-screen flex-col bg-white text-kemz-ink">
    <a href="#main-content" class="skip-link">К содержанию</a>
    <AppHeader />
    <main id="main-content" class="w-full flex-1">
      <slot />
    </main>
    <AppFooter />
    <CookieConsentBanner />
    <BackToTop />
  </div>
</template>

<script setup lang="ts">
import { organizationJsonLd, SITE_NAME } from '~/utils/siteSeo'

const config = useRuntimeConfig()
const activeError = useError()

useHead({
  titleTemplate: (title) => (title && !title.includes(SITE_NAME) ? `${title}` : title || SITE_NAME),
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(organizationJsonLd()),
    },
  ],
  htmlAttrs: { lang: 'ru' },
})

useSeoMeta({
  robots: () => activeError.value || !config.public.indexableDeployment
    ? 'noindex, nofollow'
    : 'index, follow',
})
</script>

<style scoped>
.skip-link {
  position: absolute;
  left: -9999px;
  top: 0;
  z-index: 100;
  background: #2f78cd;
  padding: 0.75rem 1rem;
  color: #fff;
  font-weight: 700;
}

.skip-link:focus {
  left: 1rem;
  top: 1rem;
}
</style>
