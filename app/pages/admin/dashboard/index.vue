<script setup lang="ts">
// import { useClipboard } from '@vueuse/core'
// import { BarChart } from 'echarts/charts'
// import * as echarts from 'echarts/core'
// import VChart from 'nuxt-echarts'

// echarts.use([BarChart])

// import { useProfileStore } from '@/stores/profile'

// const store = useProfileStore()
// const toast = useToast()

definePageMeta({
  middleware: ['auth'],
  keepalive: true,
})

// const option = ref<ECOption>({
//   dataset: {
//     dimensions: ['Product', '2015', '2016', '2017'],
//     source: [
//       {
//         Product: 'Matcha Latte',
//         2015: 54,
//         2016: 42,
//         2017: 23,
//       },
//     ],
//   },
//   xAxis: { type: 'category' },
//   yAxis: {},
//   series: [{ type: 'bar' }],
// })

const isAmountVisible = ref(true)

function toggleAmountVisibility() {
  isAmountVisible.value = !isAmountVisible.value
}
</script>

<template>
  <main class="">
    <section class="rounded-[20px] bg-[#1177FE] p-5 px-6">
      <div class="bg-white p-3 rounded-[20px]">
        <div class="flex gap-2.5 items-center">
          <!-- wallet icon -->
          <span class="p-3 rounded-[8px]">
            <!-- <NuxtImg :src="card.icon" :alt="card.title" class="w-7 h-7" /> -->
          </span>
          <!-- wallet balance -->
          <div class="truncate">
            <p class="text-[18px] font-bold text-[#4D5155]">
              1,000
            </p>
            <h3 class="text-[16px] md:text-[18px] tracking-[5%] md:tracking-[10%] text-[#676A6D] font-regular">
              Total Expenses
            </h3>
          </div>
          <!-- wallet actions show or hide balance -->
          <div class="ml-auto">
            <UButton variant="soft" class="rounded-full" :ui="{ base: 'p-2 bg-[#DBF4FF]' }" @click="toggleAmountVisibility">
              <NuxtImg src="/images/admin-dashboard/eyeicon" alt="eyeicon" />
            </UButton>
          </div>
        </div>
        <div class="bg-white p-3 rounded-[20px]">
          <div class="flex gap-2.5 items-center">
            <!-- wallet icon -->
            <span class="p-3 rounded-[8px]">
              <!-- <NuxtImg :src="card.icon" :alt="card.title" class="w-7 h-7" /> -->
            </span>
            <!-- wallet balance -->
            <div class="truncate">
              <p class="text-[18px] font-bold text-[#4D5155]">
                1,000
              </p>
              <h3 class="text-[16px] md:text-[18px] tracking-[5%] md:tracking-[10%] text-[#676A6D] font-regular">
                Total Expenses
              </h3>
            </div>
            <!-- wallet actions show or hide balance -->
            <div class="ml-auto">
              <UButton variant="soft" class="rounded-full" :ui="{ base: 'p-2 bg-[#DBF4FF]' }" @click="toggleAmountVisibility">
                <NuxtImg src="/images/admin-dashboard/eyeicon" alt="eyeicon" />
              </UButton>
            </div>
          </div>
          <div class="bg-white p-3 rounded-[20px]">
            <div class="flex gap-2.5 items-center">
              <!-- wallet icon -->
              <span class="p-3 rounded-[8px]">
                <!-- <NuxtImg :src="card.icon" :alt="card.title" class="w-7 h-7" /> -->
              </span>
              <!-- wallet balance -->
              <div class="truncate">
                <p class="text-[18px] font-bold text-[#4D5155]">
                  1,000
                </p>
                <h3 class="text-[16px] md:text-[18px] tracking-[5%] md:tracking-[10%] text-[#676A6D] font-regular">
                  Total Expenses
                </h3>
              </div>
              <!-- wallet actions show or hide balance -->
              <div class="ml-auto">
                <UButton variant="soft" class="rounded-full" :ui="{ base: 'p-2 bg-[#DBF4FF]' }" @click="toggleAmountVisibility">
                  <NuxtImg src="/images/admin-dashboard/eyeicon" alt="eyeicon" />
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="border p-4 bg-white">
      <!-- <VChart :option="option" /> -->
    </section>
  </main>
</template>
