<!-- components/MenuLink.vue -->
<template>
   <NuxtLink
     :to="to"
     :class="[
       baseClass,
       { [activeClass]: isActive }
     ]"
   >
     <slot />
   </NuxtLink>
 </template>
 
 <script setup lang="ts">
 import { useRoute } from 'vue-router'
 
 defineProps<{
   to: string
   baseClass?: string
   activeClass?: string
 }>()
 
 const route = useRoute()
 
 // Является ли текущий путь вложенным в to?
 const isActive = computed(() => {
   return route.path === to || route.path.startsWith(to + '/')
 })
 </script>