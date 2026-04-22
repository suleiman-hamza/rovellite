<script setup lang="ts">
// import type { Biller } from '#shared/types/biller-types'
const { getUser } = useAuth()
useSeoMeta({
  title: 'Electricity',
  // change this description to a more relevant one later
  description: () => `This is a description for the page`,
})

definePageMeta({
  layout: 'dashboard-layout',
  middleware: 'auth',
  keepalive: true,
})
const { data: availableDiscos, error: fetcherror, refresh, status } = await useLazyFetch('/api/electricity', {
  key: 'disco-list',
  immediate: !!getUser(),
  watch: false,
})

// if (import.meta.client) {
//   const stop = watch(() => getUser(), (user) => {
//     if (user && !availableDiscos.value) {
//       refresh()
//       stop()
//     }
//   }, { immediate: true })
// }
</script>

<template>
  <main class="font-poppins">
    <!-- Loading Skeleton when data is fetching from the API -->
    <div v-if="status === 'pending'" class="flex items-center space-x-4">
      <p>loading...</p>
    </div>
    <div v-if="fetcherror" class="flex items-center space-x-4">
      <p>{{ fetcherror }}</p>
      <UButton variant="outline" @click="refresh()">
        Retry
      </UButton>
    </div>
    <section v-else-if="availableDiscos" class="rounded-[20px] bg-white">
      <NuxtImg
        src="/images/electricity/electricity-banner.png"
        loading="eager"
        alt="Electricity Image"
        class="w-full h-48 object-cover rounded-[20px] mb-4 sm:mb-8"
      />
      <main class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 gap-y-3 md:gap-x-5 md:gap-y-7 h-full bg-white p-4 rounded-lg">
        <NuxtLink
          v-for="discos in availableDiscos"
          :key="discos.slug"
          :to="`electricity/discoSlug/${discos.slug}`"
          class="p-2 sm:p-4 bg-white rounded-lg border md:border-2 border-[#DBF4FF] hover:border-primary transition-colors flex flex-col gap-2 items-center justify-center text-center"
        >
          <span class="rounded-lg sm:p-2 flex items-center justify-center w-15 h-9.5 sm:w-20 sm:h-12.5">
            <NuxtImg :src="discos.logo" alt="Education Logo" class="object-contain" />
          </span>
          <h4 class="font-poppins text-[14px] md:text-[16px] text-[#676A6D] leading-[150%] tracking-[1%] sm:font-bold">
            {{ discos.name }}
          </h4>
        </NuxtLink>
      </main>
    </section>
  </main>
</template>
