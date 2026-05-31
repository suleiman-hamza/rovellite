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
  { month: 'Jan', revenue: 50, expenses: 30, profit: 20 },
  { month: 'Feb', revenue: 70, expenses: 44, profit: 26 },
  { month: 'Mar', revenue: 30, expenses: 50, profit: -20 },
  { month: 'Apr', revenue: 50, expenses: 45, profit: 5 },
  { month: 'May', revenue: 20, expenses: 37, profit: -17 },
  { month: 'Jun', revenue: 10, expenses: 45, profit: -35 },
  { month: 'Jul', revenue: 60, expenses: 50, profit: 10 },
  { month: 'Aug', revenue: 80, expenses: 55, profit: 25 },
  { month: 'Sep', revenue: 40, expenses: 48, profit: -8 },
  { month: 'Oct', revenue: 90, expenses: 65, profit: 25 },
  { month: 'Nov', revenue: 75, expenses: 60, profit: 15 },
  { month: 'Dec', revenue: 100, expenses: 70, profit: 30 },
]
</script>

<template>
  <main class="">
    <MetricCard />
    <section class="border border-red-500 flex gap-4 mt-6">
      <StatisticalReportChart class="bg-white rounded-[20px] flex-1" :data="data" />
      <UserDonutChart class="bg-white rounded-[20px] w-fit max-w-80 flex-1" :data="chartData" />
    </section>
    <section class="border border-red-500 flex gap-4 mt-6">
      <ProductSales class="bg-white rounded-[20px] w-fit max-w-80 flex-1" />
      <TransactionsTable class="bg-white rounded-[20px] flex-1" />
    </section>
  </main>
</template>
