<script setup lang="ts">
import { VisAxis, VisBulletLegend, VisLine, VisXYContainer } from '@unovis/vue'

interface FinancialRecord {
  month: string
  revenue: number
  expenses: number
  profit: number
}
const _props = defineProps<{ data: FinancialRecord[] }>()

// 1. Use the index 'i' for the X-axis mapping
const x = (_d: FinancialRecord, i: number) => i

// 2. Define your array of Y accessors
const y = [
  (d: FinancialRecord) => d.revenue,
  (d: FinancialRecord) => d.expenses,
  (d: FinancialRecord) => d.profit,
]

const items = computed(() => {
  // Define the keys you want to show in your legend
  const keys: ('revenue' | 'expenses' | 'profit')[] = ['revenue', 'expenses', 'profit']

  return keys.map(key => ({
    // Capitalize the first letter for a clean display name (e.g., "Revenue")
    name: key.charAt(0).toUpperCase() + key.slice(1),
  }))
})
</script>

<template>
  <div class="p-4">
    <VisXYContainer :data="data">
      <VisLine :x="x" :y="y[0]" color="blue" />
      <VisLine :x="x" :y="y[1]" color="red" />
      <VisLine :x="x" :y="y[2]" color="green" />
      <VisAxis type="x" :tick-format="(tick: number) => data[tick]?.month" :num-ticks="data.length" />
      <VisAxis type="y" />
    </VisXYContainer>
    <div class="mt-2 border p-1">
      <VisBulletLegend :items="items" />
    </div>
  </div>
</template>
