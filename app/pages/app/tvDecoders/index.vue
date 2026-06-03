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
    <div v-if="status === 'pending'" class="">
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
          class="block p-2 sm:p-3 bg-white rounded-lg border-2 border-[#DBF4FF] hover:border-primary transition-colors"
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
