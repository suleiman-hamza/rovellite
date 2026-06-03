<script setup lang="ts">
const { getUser } = useAuth()
useSeoMeta({
  title: 'Education',
  // change this description to a more relevant one later
  description: () => `This is a description for the page`,
})
definePageMeta({
  title: 'Education',
  layout: 'dashboard-layout',
  middleware: 'auth',
  keepalive: true,
})

const { data: educationData, error: fetcherror, refresh, status } = await useLazyFetch('/api/education', {
  key: 'Education-list',
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
  <main>
    <!-- Loading Skeleton when data is fetching from the API -->
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
    <section v-else-if="educationData">
      <UPageGrid class="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <NuxtLink
          v-for="platform in educationData"
          :key="platform.slug"
          :to="`education/eduSlug/${platform.slug}`"
          class="p-2 sm:p-4 bg-white rounded-lg border-2 border-[#DBF4FF] hover:border-primary transition-colors flex flex-col gap-2 items-center justify-center text-center"
        >
          <span class="rounded-lg sm:p-2 flex items-center justify-center w-15 h-8.75 sm:w-20 sm:h-12.5 p-1">
            <NuxtImg :src="platform.logo" alt="Education Logo" class="object-contain" />
          </span>
          <h4 class="font-poppins text-[14px] md:text-[16px] text-[#676A6D] leading-[150%] tracking-[1%] sm:font-bold">
            {{ platform.name }}
          </h4>
        </NuxtLink>
      </UPageGrid>
    </section>
  </main>
</template>
