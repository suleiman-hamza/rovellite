<script setup lang="ts">
const cards = ref([
  {
    title: 'Icons',
  },
  {
    title: 'Fonts',
  },
  {
    title: 'Color Mode',
  },
])
const cards2 = ref([
  {
    title: 'Icons',
  },
  {
    title: 'Fonts',
  },
  {
    title: 'Color Mode',
  },
  {
    title: 'Color',
  },
])
</script>

<template>
  <main>
    <UPageGrid class="bg-[#1177FE] p-4">
      <UPageCard
        v-for="(card, index) in cards"
        :key="index"
        v-bind="card"
      />
    </UPageGrid>
    <UPageGrid :ui="{ base: 'lg:grid-cols-4' }" class="bg-[#FFFFFF] p-2">
      <UPageCard
        v-for="(card, index) in cards2"
        :key="index"
        v-bind="card"
        :ui="{ container: 'bg-[#F9F9FB]' }"
      />
    </UPageGrid>
  </main>
</template>
