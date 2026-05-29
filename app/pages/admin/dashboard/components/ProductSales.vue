<script setup lang="ts">
import { VisAxis, VisGroupedBar, VisXYContainer } from '@unovis/vue'

interface DataRecord {
  x: number
  y: number // Revenue
  y1: number // Expenses
  y2: number // Profit
}

const data: DataRecord[] = [
  { x: 0, y: 120, y1: 80, y2: 40 },
  { x: 1, y: 95, y1: 70, y2: 25 },
  { x: 2, y: 150, y1: 90, y2: 60 },
  { x: 3, y: 200, y1: 110, y2: 90 },
  { x: 4, y: 175, y1: 100, y2: 75 },
  { x: 5, y: 220, y1: 130, y2: 90 },
]

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']

const x = (d: DataRecord) => d.x
const y = [
  (d: DataRecord) => d.y,
  (d: DataRecord) => d.y1,
  (d: DataRecord) => d.y2,
]

const xTickFormat = (i: number) => months[i] ?? ''
</script>

<template>
  <VisXYContainer :data="data" :height="300">
    <VisGroupedBar :x="x" :y="y" />
    <VisAxis type="x" :tick-format="xTickFormat" />
    <VisAxis type="y" />
  </VisXYContainer>
</template>
