<script setup lang="ts">
import { Donut } from '@unovis/ts'
import { VisBulletLegend, VisDonut, VisSingleContainer, VisTooltip } from '@unovis/vue'

// Define the shape of your data objects
interface ChartDatum {
  name: string
  value: number
}

const props = defineProps<{ data: ChartDatum[] }>()
const height = 200
const width = 200

const value = (d: ChartDatum) => d.value
// Access the value property directly
const triggers = {
  [Donut.selectors.segment]: (d: ChartDatum) => `<span>${d.name}: ${d.value}</span>`,
}

const items = computed(() => props.data.map(d => ({
  name: d.name,
})))
</script>

<template>
  <div class="p-4">
    <p class="text-[#4D5155] font-semibold md:font-bold text-[18px] md:text-[20px] font-poppins tracking-[2%]">
      Users
    </p>
    <div class="flex justify-center items-center">
      <VisSingleContainer :height="height" :width="width" :data="data">
        <VisDonut
          :value="value"
          central-label="100"
          :radius="90"
          :arc-width="34"
          corner-radius="20"
          :show-background="true"
          central-sub-label="Total Users"
        />
        <VisTooltip :triggers="triggers" />
      </VisSingleContainer>
    </div>
    <div class="flex items-center justify-center p-1">
      <VisBulletLegend :items="items" label-class-name="text-[16px] font-normal text-[#34383D]" />
    </div>
  </div>
</template>
