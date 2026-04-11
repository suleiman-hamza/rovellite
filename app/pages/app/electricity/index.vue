<script setup lang="ts">
// import type { Biller } from '#shared/types/biller-types'
useSeoMeta({
  title: 'Electricity',
  // change this description to a more relevant one later
  description: () => `This is a description for the page`,
})
definePageMeta({
  layout: 'dashboard-layout',
  middleware: 'auth',
})
const availableDiscos = ref()
const fetcherror = ref()

onBeforeMount(async () => {
  const { data, error } = await useFetch('/api/electricity')

  if (data.value) {
    availableDiscos.value = data.value
  }
  if (error.value) {
    fetcherror.value = error.value
  }
})
</script>

<template>
  <main class="font-poppins">
    <section v-if="availableDiscos" class="rounded-[20px] bg-white">
      <NuxtImg
        src="/images/electricity/electricity-banner.png"
        loading="eager"
        alt="Electricity Image"
        class="w-full h-48 object-cover rounded-[20px] mb-4 sm:mb-8"
      />
      <main class="grid grid-cols-[repeat(auto-fit,minmax(100px,120px))] sm:grid-cols-[repeat(auto-fit,minmax(120px,150px))] md:grid-cols-[repeat(auto-fit,minmax(150px,200px))] justify-center items-center gap-4 md:gap-x-5 md:gap-y-8 h-full bg-white p-4 rounded-lg">
        <NuxtLink
          v-for="discos in availableDiscos"
          :key="discos.slug"
          :to="`/app/electricity/discoSlug/${discos.slug}`"
          class="p-2 sm:p-4 bg-white rounded-lg border-2 border-[#DBF4FF] hover:bg-[#E3EDF0] transition-colors flex flex-col gap-2 items-center justify-center text-center"
        >
          <span class="rounded-lg sm:p-2 flex items-center justify-center w-15 h-8.75 sm:w-20 sm:h-12.5">
            <NuxtImg :src="discos.logo" alt="Education Logo" class="object-contain" />
          </span>
          <h4 class="font-poppins text-[16px] text-[#676A6D] leading-[150%] tracking-[1%] sm:font-bold">
            {{ discos.name }}
          </h4>
        </NuxtLink>
      </main>
    </section>

    <div v-else-if="fetcherror" class="flex items-center space-x-4">
      <p>{{ fetcherror }}</p>
    </div>
    <!-- Loading Skeleton when data is fetching from the API -->
    <div v-else class="flex items-center space-x-4">
      <p>loading...</p>
    </div>
  </main>
</template>
