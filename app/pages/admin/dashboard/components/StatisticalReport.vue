<!-- <script setup lang="ts">
import { VisAxis, VisLine, VisXYContainer } from '@unovis/vue'

interface FinancialRecord {
  month: string
  revenue: number
  expenses: number
}

const _props = defineProps<{ data: FinancialRecord[] }>()
</script>

<template>
  <VisXYContainer :data="data"> -->
    <!-- Plotting two lines on the same container -->
    <!-- <VisLine :x="(d: FinancialRecord) => d.month" :y="(d: FinancialRecord) => d.revenue" color="red" /> -->
    <!-- <VisLine :x="(d: FinancialRecord) => d.month" :y="(d: FinancialRecord) => d.expenses" /> -->
    <!-- <VisAxis type="x" />
    <VisAxis type="y" />
  </VisXYContainer>
</template> -->

<script setup lang="ts">
import { VisAxis, VisLine, VisXYContainer } from '@unovis/vue'
import { ref } from 'vue'

interface DataRecord { x: number, y: number }
const data = ref<DataRecord[]>([
  { x: 0, y: 0 },
  { x: 1, y: 2 },
  { x: 2, y: 1 },
])
</script>

<template>
  <div class="p-4">
    <VisXYContainer>
      <VisLine :data="data" :x="(d: DataRecord) => d.x" :y="(d: DataRecord) => d.y" />
      <VisAxis type="x" />
      <VisAxis type="y" />
    </VisXYContainer>
  </div>
</template>
