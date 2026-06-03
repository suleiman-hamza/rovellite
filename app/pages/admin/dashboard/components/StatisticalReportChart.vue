<script setup lang="ts">
import { VisAxis, VisBulletLegend, VisLine, VisXYContainer } from '@unovis/vue'

interface FinancialRecord {
  month: string
  revenue: number
  expenses: number
  profit: number
}
const _props = defineProps<{ data: FinancialRecord[] }>()
const height = 220

// 1. Use the index 'i' for the X-axis mapping
const x = (_d: FinancialRecord, i: number) => i

// 2. Define your array of Y accessors
const y = [
  (d: FinancialRecord) => d.revenue,
  (d: FinancialRecord) => d.expenses,
  (d: FinancialRecord) => d.profit,
]

const seriesColors = { revenue: 'blue', expenses: 'red', profit: 'green' }

const items = computed(() => {
  const keys: ('revenue' | 'expenses' | 'profit')[] = ['revenue', 'expenses', 'profit']
  return keys.map(key => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    color: seriesColors[key],
  }))
})
</script>

<template>
  <div class="p-4">
    <p class="text-[#4D5155] font-semibold md:font-bold text-[18px] md:text-[20px] font-poppins tracking-[2%] mb-2">
      Statistical Report
    </p>
    <VisXYContainer :data="data" :height="height">
      <VisLine :x="x" :y="y[0]" color="blue" />
      <VisLine :x="x" :y="y[1]" color="red" />
      <VisLine :x="x" :y="y[2]" color="green" />
      <VisAxis type="x" :tick-format="(tick: number) => data[tick]?.month" :num-ticks="data.length" />
      <VisAxis type="y" />
    </VisXYContainer>
    <div class="mt-2 p-1">
      <VisBulletLegend :items="items" />
    </div>
  </div>
</template>
