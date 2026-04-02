<script setup lang="ts">
import type { Biller } from '#shared/types/biller-types'

useSeoMeta({
  title: 'Betting',
  // change this description to a more relevant one later
  description: () => `This is a description for the page`,
})
definePageMeta({
  layout: 'dashboard-layout',
})

const bettingData = ref<Biller[] | null>(null)

onBeforeMount(async () => {
  const { data, error } = await useFetch<Biller[]>('/api/betting')
  if (error.value) {
    console.error('Error fetching betting data:', error.value)
  }
  else {
    bettingData.value = data.value as Biller[]
  }
})
</script>

<template>
  <main class="bg-[#F2F2F4] min-h-full p-4">
    <section v-if="bettingData" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <NuxtLink
        v-for="betting in bettingData"
        :key="betting.id"
        :to="`betting/bettingId/${betting.id}`"
        class="block p-2 sm:p-3 bg-white rounded-md border-2 border-[#696969] mb-4 hover:bg-gray-100 transition-colors"
      >
        <div class="flex items-center gap-2 flex-col">
          <NuxtImg :src="betting.images" :alt="betting.name" class="object-contain" />
          <h2 class="hidden sm:inline-block text-[14px] font-semibold text-[#565252]">
            {{ betting.name.toUpperCase() }}
          </h2>
        </div>
      </NuxtLink>
    </section>
    <!-- Loading Skeleton when data is fetching from the API -->
    <div v-else class="flex items-center space-x-4">
      <p>loading...</p>
    </div>
  </main>
</template>
