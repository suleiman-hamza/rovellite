<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  keepalive: true,
})

// Provide an array of numbers for the donut slices
const chartData = ref([
  { name: 'Active users', value: 60 },
  { name: 'Non active users', value: 40 },
])

const WeeklyStatData = [
  { month: 'Mon', revenue: 50000, expenses: 30000, profit: 65000, new_products: 20022 },
  { month: 'Tue', revenue: 70000, expenses: 44000, profit: 26000, new_products: 45000 },
  { month: 'Wed', revenue: 30000, expenses: 50000, profit: 67000, new_products: 16550 },
  { month: 'Thur', revenue: 50000, expenses: 45000, profit: 25000, new_products: 25655 },
  { month: 'Fri', revenue: 20000, expenses: 37000, profit: 17000, new_products: 50000 },
  { month: 'Sat', revenue: 10000, expenses: 65006, profit: 30000, new_products: 300 },
]
</script>

<template>
  <main class="">
    <MetricCard />
    <section class="flex flex-col md:flex-row gap-4 mt-6">
      <StatisticalReportChart class="bg-white rounded-[20px] w-fit md:flex-1 shadow-md" :data="WeeklyStatData" />
      <UserDonutChart class="bg-white rounded-[20px] w-full md:w-fit md:max-w-80 shadow-md" :data="chartData" />
    </section>
    <section class="flex flex-col md:flex-row gap-4 mt-6">
      <ProductSales class="bg-white rounded-[20px] w-full md:max-w-100 shadow-md" />
      <TransactionsTable class="bg-white rounded-[20px] w-full md:flex-1 shadow-md" />
    </section>
  </main>
</template>
