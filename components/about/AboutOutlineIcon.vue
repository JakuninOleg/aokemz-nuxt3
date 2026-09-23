<script setup lang="ts">
defineProps<{ name: string }>();
</script>
<template>
  <svg
    viewBox="0 0 32 32"
    fill="none"
    stroke="currentColor"
    stroke-width="1.3"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <g v-if="name === 'team'">
      <ellipse cx="16" cy="7" rx="3" ry="4" />
      <ellipse cx="6" cy="10" rx="2.5" ry="3.5" />
      <ellipse cx="26" cy="10" rx="2.5" ry="3.5" />
      <path
        d="M10 29V19c0-4 2-6 6-6s6 2 6 6v10H10Zm4 0v-8m4 8v-8M8 16c-5 0-6 3-6 7v5h5m17-12c5 0 6 3 6 7v5h-5"
      />
    </g>
    <g v-else-if="name === 'factory'">
      <path
        d="M3 29V5h4l1 15 7-5v5l7-5v5l7-5v14H3ZM3 10h4M7 24h3v2H7Zm8 0h3v2h-3Zm8 0h3v2h-3M12 7c0-3 5-3 5 0s5 3 5 0"
      />
    </g>
    <g v-else>
      <path
        d="m13 3-.8 3.2-2.8 1.6-3.2-.9-3 5.2 2.4 2.3v3.2l-2.4 2.3 3 5.2 3.2-.9 2.8 1.6.8 3.2h6l.8-3.2 2.8-1.6 3.2.9 3-5.2-2.4-2.3v-3.2l2.4-2.3-3-5.2-3.2.9-2.8-1.6L19 3h-6Z"
      />
      <circle cx="16" cy="16" r="5" />
    </g>
  </svg>
</template>
