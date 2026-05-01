<script setup lang="ts">
definePageMeta({
  title: 'Solar',
  layout: 'dashboard-layout',
  middleware: 'auth',
})

async function onClick() {
  return new Promise<void>(res => setTimeout(res, 1000))
}
</script>

<template>
  <main>
    <h1>Error loading solar page component</h1>
    <UButton label="Retry" variant="outline" loading-auto @click="onClick" />
  </main>
</template>
