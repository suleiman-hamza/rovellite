<script setup lang="ts">
definePageMeta({
  title: 'Airtime',
  layout: 'dashboard-layout',
  middleware: 'auth',
  keepalive: true,
})

const { getUser } = useAuth()

// const isLoading = ref(false)
const { data: airtimeValue, error: fetcherror, refresh, status } = await useLazyFetch('/api/airtime', {
  key: 'airtime-plan',
  immediate: !!getUser(),
  watch: false,
})

// if (import.meta.client) {
//   const stop = watch(() => getUser(), (user) => {
//     if (user && !airtimeValue.value) {
//       refresh()
//       stop()
//     }
//   }, { immediate: true })
// }
</script>

<template>
  <main class="">
    <!-- Loading Skeleton when data is fetching from the API -->
    <div v-if="status === 'pending'" class="min-h-full flex items-center justify-center">
      <div class="bg-[#D6E7FF80] flex items-center justify-center w-26 h-26 md:w-36 md:h-36">
        <div class="bg-[#D6E7FF99] flex items-center justify-center w-22 h-22 md:w-32 md:h-32">
          <div class="bg-[#D6E7FFCC] flex items-center justify-center w-18 h-18 md:w-28 md:h-28">
            <USkeleton class="flex items-center justify-center w-14 h-14 md:w-24 md:h-24">
              <NuxtImg src="/images/RovelSubPointLogo.png" alt="rovel loading logo" class="object-contain block" />
            </USkeleton>
          </div>
        </div>
      </div>
    </div>

    <div v-if="fetcherror" class="flex items-center space-x-4">
      <p>Error: {{ fetcherror }}</p>
      <UButton variant="outline" @click="refresh()">
        Retry
      </UButton>
    </div>

    <UPageGrid v-else-if="airtimeValue" class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 gap-y-4 md:gap-x-5 md:gap-y-7">
      <NuxtLink
        v-for="airtimePlan in airtimeValue"
        :key="airtimePlan.id"
        :to="`airtime/airtimeId/${airtimePlan.slug}`"
        class="block p-2 sm:p-3 bg-white rounded-lg border-2 border-[#DBF4FF] hover:border-primary transition-colors transition-colors"
      >
        <div class="flex items-center gap-2 flex-col">
          <NuxtImg :src="airtimePlan.image" :alt="airtimePlan.name" class="object-contain w-12 h-12 md:w-24 md:h-24" />
          <h2 class="hidden sm:inline-block text-[16px] tracking-[2%] font-semibold text-[#676A6D] leading-[150%]">
            {{ airtimePlan.name.toUpperCase() }}
          </h2>
        </div>
      </NuxtLink>
    </UPageGrid>
  </main>
</template>
