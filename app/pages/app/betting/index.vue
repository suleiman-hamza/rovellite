<script setup lang="ts">
// import type { Biller } from '#shared/types/biller-types'

useSeoMeta({
  title: 'Betting',
  // change this description to a more relevant one later
  description: () => `This is a description for the page`,
})
definePageMeta({
  layout: 'dashboard-layout',
  middleware: 'auth',
  keepalive: true,
})
const { getUser } = useAuth()

const { data: bettingData, error: fetcherror, refresh, status } = await useLazyFetch('/api/betting', {
  key: 'betting-provider',
  immediate: !!getUser(),
  watch: false,
})

// if (import.meta.client) {
//   const stop = watch(() => getUser(), (user) => {
//     if (user && !bettingData.value) {
//       refresh()
//       stop()
//     }
//   }, { immediate: true })
// }
</script>

<template>
  <main class="min-h-full font-poppins">
    <!-- Loading Skeleton when data is fetching from the API -->
    <div v-if="status === 'pending'" class="min-h-full">
      <UPageGrid class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 gap-y-4 md:gap-x-5 md:gap-y-7">
        <div class="bg-white rounded-lg aspect-square flex items-center justify-center">
          <USkeleton class="object-contain w-12 h-12 md:w-24 md:h-24 rounded-full" />
        </div>
        <div class="bg-white rounded-lg aspect-square flex items-center justify-center">
          <USkeleton class="object-contain w-12 h-12 md:w-24 md:h-24 rounded-full" />
        </div>
        <div class="bg-white rounded-lg aspect-square flex items-center justify-center">
          <USkeleton class="object-contain w-12 h-12 md:w-24 md:h-24 rounded-full" />
        </div>
        <div class="bg-white rounded-lg aspect-square flex items-center justify-center">
          <USkeleton class="object-contain w-12 h-12 md:w-24 md:h-24 rounded-full" />
        </div>
      </UPageGrid>
    </div>
    <div v-else-if="fetcherror" class="flex items-center space-x-4">
      <p>Error fetching betting data.</p>
      <p>{{ fetcherror }}</p>
      <UButton variant="outline" @click="refresh()">
        Retry
      </UButton>
    </div>
    <section v-else-if="bettingData" class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-x-5 md:gap-y-8">
      <NuxtLink
        v-for="betting in bettingData"
        :key="betting.id"
        :to="`betting/bettingId/${betting.id}`"
        class="block p-2 sm:p-3 bg-white rounded-lg border-2 border-[#DBF4FF] hover:border-primary transition-colors"
      >
        <div class="flex items-center gap-2 flex-col">
          <NuxtImg :src="betting.images" :alt="betting.name" class="object-contain w-12 h-12 md:w-24 md:h-24" />
          <h2 class="hidden sm:inline-block text-[16px] tracking-[2%] font-semibold text-[#676A6D] leading-[150%]">
            {{ betting.name.toUpperCase() }}
          </h2>
        </div>
      </NuxtLink>
    </section>
  </main>
</template>
