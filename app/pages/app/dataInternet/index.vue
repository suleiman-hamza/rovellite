<script setup lang="ts">
definePageMeta({
  title: 'Data',
  layout: 'dashboard-layout',
  middleware: 'auth',
})

const { getUser } = useAuth()

// const isLoading = ref(false)

const { data: dataValue, error: fetcherror, refresh } = await useFetch('/api/data', {
  key: 'data-plans',
  immediate: !!getUser(),
  watch: false,
})

if (import.meta.client) {
  const stop = watch(() => getUser(), (user) => {
    if (user && !dataValue.value) {
      refresh()
      stop()
    }
  }, { immediate: true })
}

// Now 'data' and 'error' are reactive and will update automatically
</script>

<template>
  <main class="">
    <UPageGrid v-if="dataValue" class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 gap-y-4 md:gap-x-5 md:gap-y-7">
      <NuxtLink
        v-for="dataPlan in dataValue"
        :key="dataPlan.id"
        :to="`dataInternet/dataId/${dataPlan.id}`"
        class="block p-2 sm:p-3 bg-white rounded-lg border-2 border-[#DBF4FF] hover:bg-[#E3EDF0] transition-colors"
      >
        <div class="flex items-center gap-2 flex-col">
          <NuxtImg :src="dataPlan.image" :alt="dataPlan.name" class="object-contain w-12 h-12 md:w-24 md:h-24" />
          <h2 class="hidden sm:inline-block text-[16px] tracking-[2%] font-semibold text-[#676A6D] leading-[150%]">
            {{ dataPlan.name.toUpperCase() }}
          </h2>
        </div>
      </NuxtLink>
    </UPageGrid>

    <div v-else-if="fetcherror" class="flex items-center space-x-4">
      <p>{{ fetcherror }}</p>
    </div>
    <!-- Loading Skeleton when data is fetching from the API -->
    <div v-else class="flex items-center space-x-4">
      <p>loading...</p>
    </div>
  </main>
</template>
