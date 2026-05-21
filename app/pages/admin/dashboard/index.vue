<script setup lang="ts">
definePageMeta({
  // middleware: ['auth'],
  keepalive: true,
})

// Provide an array of numbers for the donut slices
const chartData = ref([
  { name: 'Active users', value: 60 },
  { name: 'Non active users', value: 40 },
])

const data = [
  { month: 'Jan', revenue: 5000, expenses: 3000 },
  { month: 'Feb', revenue: 7000, expenses: 4500 },
  { month: 'Mar', revenue: 3000, expenses: 2500 },
  { month: 'Apr', revenue: 5000, expenses: 4500 },
  { month: 'May', revenue: 2000, expenses: 1000 },
  { month: 'Jun', revenue: 6000, expenses: 4500 },
]

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
              <NuxtImg src="/images/admin-dashboard/eyeicon.svg" alt="eyeicon" />
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
                <NuxtImg src="/images/admin-dashboard/eyeicon.svg" alt="eyeicon" />
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
                  <NuxtImg src="/images/admin-dashboard/eyeicon.svg" alt="eyeicon" />
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="border border-red-500 flex gap-4 mt-6">
      <StatisticalReport class="bg-white rounded-[20px] flex-1" :data="data" />
      <UserDonuts class="bg-white rounded-[20px] w-fit max-w-80 flex-1" :data="chartData" />
    </section>
  </main>
</template>
