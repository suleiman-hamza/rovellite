<script setup lang="ts">
definePageMeta({
  title: 'TV/Decoders',
  layout: 'dashboard-layout',
  middleware: 'auth',
  keepalive: true,
})

const { getUser } = useAuth()

const { data: tvDecoders, error: fetcherror, refresh, status } = await useLazyFetch('/api/paytv', {
  key: 'tv-decoder-plans',
  immediate: !!getUser(),
  watch: false,
})
</script>

<template>
  <main>
    <div v-if="status === 'pending'" class="flex items-center space-x-4">
      <p>loading...</p>
    </div>
    <div v-if="fetcherror" class="flex items-center space-x-4">
      <p>{{ fetcherror }}</p>
      <UButton variant="outline" @click="refresh()">
        Retry
      </UButton>
    </div>
    <div v-else-if="tvDecoders">
      <!-- Display TV decoder plans -->
      <UPageGrid class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 md:gap-x-5 md:gap-y-7">
        <NuxtLink
          v-for="paytv in tvDecoders"
          :key="paytv.id"
          :to="`tvDecoders/tvSlug/${paytv.slug}`"
          class="block p-2 sm:p-3 bg-white rounded-lg border-2 border-[#DBF4FF] hover:bg-[#E3EDF0] transition-colors"
        >
          <div class="flex items-center gap-2 flex-col">
            <NuxtImg :src="paytv.image" :alt="paytv.name" class="object-contain w-12 h-12 md:w-24 md:h-24" />
            <h2 class="hidden sm:inline-block text-[16px] tracking-[2%] font-semibold text-[#676A6D] leading-[150%]">
              {{ paytv.name.toUpperCase() }}
            </h2>
          </div>
        </NuxtLink>
      </UPageGrid>
    </div>
  </main>
</template>
