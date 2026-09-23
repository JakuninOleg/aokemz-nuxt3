<script setup lang="ts">
const props = defineProps<{ name: string }>();

/** Clean 24×24 stroke icons. Keep paths simple and geometric. */
const paths: Record<string, string[]> = {
  gear: [
    "M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z",
    "M19.4 15a7.7 7.7 0 0 0 .1-1.2 7.7 7.7 0 0 0-.1-1.2l2-1.6-1.9-3.3-2.4 1a7.4 7.4 0 0 0-2.1-1.2l-.4-2.5h-3.8l-.4 2.5a7.4 7.4 0 0 0-2.1 1.2l-2.4-1-1.9 3.3 2 1.6a7.7 7.7 0 0 0-.1 1.2c0 .4 0 .8.1 1.2l-2 1.6 1.9 3.3 2.4-1c.6.5 1.3.9 2.1 1.2l.4 2.5h3.8l.4-2.5c.8-.3 1.5-.7 2.1-1.2l2.4 1 1.9-3.3-2-1.6Z",
  ],
  shield: [
    "M12 3 4.8 6v5.2c0 4.4 3 8.2 7.2 9.8 4.2-1.6 7.2-5.4 7.2-9.8V6L12 3Z",
    "m8.6 12.1 2.2 2.2 4.6-4.6",
  ],
  chart: ["M4.5 19.5V11M10 19.5V6.5M15.5 19.5v-5M21 19.5V9", "M3.5 19.5h17"],
  cast: [
    "M8 4.5h8v3.2l2.8 3.2V19H5.2v-8.1L8 7.7V4.5Z",
    "M9.2 13.5h5.6M10 16.2h4",
  ],
  shaft: [
    "M3.5 9h3.2v6H3.5V9Zm13.8 0H20.5v6h-3.2V9Z",
    "M6.7 11.2h10.6v1.6H6.7v-1.6Z",
    "M10 7.2v9.6M14 7.2v9.6",
  ],
  bath: [
    "M5 7.2h14V18.5H5V7.2Z",
    "M5 10.2l3.5-1.8 2.8 1.8 2.8-1.8 3.9 1.8",
    "M8.2 4.5h7.6",
  ],
  alloy: [
    "m5 9.2 3.4-2.4 3.4 2.4v4.8L8.4 16.4 5 14Z",
    "m12.2 9.2 3.4-2.4 3.4 2.4v4.8l-3.4 2.4-3.4-2.4Z",
    "m8.6 13.8 3.4 2.2 3.4-2.2",
  ],
  clipboard: [
    "M8.2 4.8h2.1a1.7 1.7 0 0 0 3.4 0h2.1v2.2H8.2V4.8Z",
    "M8.2 5.8H6.5V20h11V5.8h-1.7",
    "M9.5 11.2h5M9.5 14.2h5M9.5 17.2h3.2",
  ],
  gearCheck: [
    "M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z",
    "M12 3v1.8M12 19.2V21M3 12h1.8M19.2 12H21M5.2 5.2l1.3 1.3M17.5 17.5l1.3 1.3M18.8 5.2l-1.3 1.3M6.5 17.5l-1.3 1.3",
    "m9.2 12.1 1.8 1.8 3.6-3.6",
  ],
};
</script>

<template>
  <svg
    class="production-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path
      v-for="path in paths[props.name] || paths.clipboard"
      :key="path"
      :d="path"
    />
  </svg>
</template>
