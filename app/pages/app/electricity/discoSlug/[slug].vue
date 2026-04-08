<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
definePageMeta({
  layout: 'dashboard-layout',
})

useSeoMeta({
  title: route.params.slug as string,
})
</script>

<template>
  <main>
    <h1>{{ route.params.slug }}</h1>
  </main>
</template>
