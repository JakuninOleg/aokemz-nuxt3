<script setup lang="ts">
const props = defineProps<{ name: string }>();
const paths: Record<string, string> = {
  energy: "M14 2 5 14h6l-1 8 9-13h-6l1-7Z",
  pulse: "M2 12h4l2-7 3 15 3-17 3 14 2-5h3",
  "test-bench": "M4 3h16v13H4V3ZM2 21h20M7 16v5m10-5v5M7 10h2l2-4 2 7 2-3h2",
  gauge:
    "M4.2 18a9 9 0 1 1 15.6 0H4.2ZM12 5v2M5.5 8.5 7 10m11.5-1.5L17 10M12 14l3-4M11 14a1 1 0 1 0 2 0 1 1 0 0 0-2 0Z",
  globe: "M2 12h20M12 2c6 6 6 14 0 20-6-6-6-14 0-20ZM4 6h16M4 18h16",
  document: "M14 2H5v20h14V7l-5-5ZM14 2v6h5M8 12h7M8 16h4",
  design: "M4 4h10M4 4v16h16V10M8 16l1-5L18 2l4 4-9 9-5 1ZM16 4l4 4",
  cast: "M7 3h10v6l4 4v8H3v-8l4-4V3ZM9 8h6M8 14h8M10 18h4",
  gear: "m9 3 1-1h4l1 3 3 1 3-1 2 4-2 3 1 3-3 3-3-1-3 2-3-2-3 1-3-3 1-3-2-3 2-4 3 1 3-1 1-2ZM9 12a3 3 0 1 0 6 0a3 3 0 1 0-6 0",
  assembly: "m3 3 5 2 1 5-3 3-4-3V5M9 10l11 10-3 2L7 13M16 3l4-1-1 4-6 6",
  test: "M8 3h8v4H8V3ZM6 5H3v17h18V5h-3M7 14l3 3 7-7",
  shield: "M12 2 3 6v7c0 5 9 9 9 9s9-4 9-9V6l-9-4ZM8 12l3 3 5-6",
  team: "M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM16 10a2.5 2.5 0 1 0 0-5M2.5 20c.4-4 2.3-6 5.5-6s5.1 2 5.5 6M14 15c3 0 5.1 1.5 5.5 5",
  factory:
    "M3 21V9l6 3V8l6 3V5h3l3 3v13H3ZM7 17h2m3 0h2m3 0h2M7 13h2m3 0h2m3 0h2",
  cycle: "M20 7V3m0 0h-4m4 0-4 4A8 8 0 1 0 20 12M4 17v4m0 0h4m-4 0 4-4",
};
</script>

<template>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.35"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <circle v-if="props.name === 'globe'" cx="12" cy="12" r="10" />
    <path :d="paths[props.name] || paths.document" />
  </svg>
</template>
