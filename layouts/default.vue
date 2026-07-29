<template>
  <div class="flex min-h-screen flex-col bg-white text-kemz-ink">
    <AppHeader />
    <main class="flex-1 w-full">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
