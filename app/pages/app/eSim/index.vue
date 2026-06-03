<script setup lang="ts">
definePageMeta({
  title: 'Esim',
  layout: 'dashboard-layout',
  middleware: 'auth',
})
</script>

<template>
  <main class="bg-white h-full flex items-center justify-center rounded-[20px]">
    <div class="bg-secondary border border-primary rounded-2xl flex flex-col gap-4 p-4 text-center items-center">
      <UIcon name="i-lucide-card-sim" class="size-20 text-primary" />
      <h1 class="text-2xl italic">
        Comming Soon
      </h1>
    </div>
  </main>
</template>
