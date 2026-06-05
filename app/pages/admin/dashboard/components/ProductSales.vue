<script setup lang="ts">
import { GroupedBar } from '@unovis/ts'

import {
  VisAxis,
  VisBulletLegend,
  VisGroupedBar,
  VisTooltip,
  VisXYContainer,
} from '@unovis/vue'

interface DataRecord {
  x: number
  value: number
  label: string
  color: string
}

const categories = ['Gift Cards', 'Data', 'Airtime', 'TV/Decoder', 'Betting', 'Esim', 'Electricity', 'Solar', 'Education', 'Transportation']

const colors = ['#1177FE', '#E22828', '#F9DB3F', '#9BD9FE', '#1CB452', '#34383D', '#F6A07E', '#7F30DC', '#FF672C', '#FBABAB']

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const monthlyValues: Record<string, number[]> = {
  January: [32000, 48000, 55000, 60000, 41000, 38000, 29000, 50000, 62000, 43000],
  February: [38000, 52000, 61000, 65000, 49000, 42000, 35000, 58000, 70000, 47000],
  March: [45000, 62000, 68000, 78000, 67000, 50000, 40000, 65000, 78000, 55000],
  April: [50000, 70000, 72000, 82000, 71000, 55000, 43000, 69000, 80000, 60000],
  May: [55000, 75000, 80000, 88000, 76000, 60000, 47000, 73000, 85000, 65000],
  June: [62000, 80000, 85000, 92000, 80000, 64000, 52000, 78000, 90000, 70000],
  July: [68000, 85000, 90000, 95000, 84000, 68000, 55000, 82000, 93000, 74000],
  August: [72000, 88000, 93000, 97000, 87000, 71000, 58000, 85000, 95000, 77000],
  September: [65000, 82000, 88000, 90000, 82000, 65000, 53000, 80000, 88000, 72000],
  October: [58000, 76000, 82000, 85000, 77000, 60000, 48000, 75000, 83000, 67000],
  November: [52000, 70000, 75000, 80000, 72000, 55000, 44000, 70000, 78000, 62000],
  December: [42000, 58000, 65000, 72000, 60000, 46000, 36000, 60000, 68000, 50000],
}

const selectedMonth = ref('January')

const data = computed<DataRecord[]>(() =>
  categories.map((label, i) => ({
    x: i,
    value: monthlyValues[selectedMonth.value]![i]!,
    label,
    color: colors[i]!,
  })),
)

const x = (d: DataRecord) => d.x
const y = (d: DataRecord) => d.value
const color = (d: DataRecord) => d.color

const yTickFormat = (v: number) => `#${v.toLocaleString()}`
const xTickFormat = (_tick: number) => ''

const items = categories.map((name, i) => ({ name, color: colors[i] }))

const triggers = {
  [GroupedBar.selectors.bar]: (d: DataRecord) =>
    `<b>${d.label}</b>: ${d.value.toLocaleString()}`,
}
</script>

<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-2">
      <p class="text-[#4D5155] font-semibold md:font-bold text-[18px] md:text-[20px] font-poppins tracking-[2%] mb-2">
        Product Sales
      </p>
      <USelect v-model="selectedMonth" :items="months" />
    </div>
    <!--
    VisXYContainer
    ──────────────
    The root container. Everything lives inside it.
    Props:
      :data       → the array of DataRecord objects. All child components inherit this.
      :height     → pixel height of the chart area (number). Default is 300.
      :width      → optional pixel width. Defaults to 100% of parent.
      :padding    → { top, right, bottom, left } in pixels — inner spacing
      :xDomain    → [min, max] to manually set X range (auto-calculated by default)
      :yDomain    → [min, max] to manually set Y range (auto-calculated by default)
  -->
    <VisXYContainer
      :height="300"
      :data="data"
      :padding="{ top: 1, right: 1, bottom: 1, left: 1 }"
    >
      <!--
    VisGroupedBar
    ─────────────
    Renders the grouped (or individual) bars.
    Props:
        :x        → accessor fn: (d) => d.x — which field is the X position
        :y        → array of accessor fns, one per series/color group
                    Each fn reads one "layer" of bars at each X position
        :color    → fn(d, seriesIndex) => string — color per series
        :barPadding → 0–1 gap between bars within a group (default 0.1)
        :groupPadding → 0–1 gap between groups (default 0.1)
        :roundedCorners → px radius on bar tops (number or boolean)
        :barMinHeight → minimum rendered bar height in px (prevents invisible bars)
        :dataStep   → spacing between X positions if not auto-inferred
    -->
      <VisGroupedBar
        :x="x"
        :y="y"
        :color="color"
        :rounded-corners="2"
        :bar-padding="0.4"
        :group-padding="0.1"
      />

      <!--
      VisAxis (X)
      ───────────
      Renders the horizontal axis at the bottom.
      Props:
        type        → 'x' or 'y' — which axis to render
        :tickFormat → fn(value) => string — formats each tick label
        :numTicks   → how many ticks to show (Unovis auto-picks if omitted)
        :tickValues → explicit array of values to tick at
        :gridLine   → true/false — show/hide horizontal grid lines
        :label      → axis title string (shows below/beside axis)
        :tickPadding → px gap between tick mark and label
    -->
      <VisAxis
        type="x"
        :tick-format="xTickFormat"
        :tick-values="data.map(d => d.x)"
        :grid-line="true"
      />

      <!--
      VisAxis (Y)
      ───────────
      Renders the vertical axis on the left.
      Same props as X axis above.
    -->
      <VisAxis
        type="y"
        :tick-format="yTickFormat"
        :grid-line="true"
      />

      <!--
      VisTooltip
      ──────────
      Shows a popover on bar hover.
      Props:
        :triggers → object mapping CSS selectors to content fns
                    VisGroupedBar.selectors.bar = the CSS selector for bar elements
                    The fn receives the data point and returns an HTML string
        :container → DOM element to render tooltip into (defaults to chart container)
        horizontalPlacement → 'auto' | 'left' | 'right' | 'center'
        verticalPlacement   → 'auto' | 'top' | 'bottom' | 'center'
    -->
      <VisTooltip :triggers="triggers" />
    </VisXYContainer>
    <VisBulletLegend :items="items" />
  </div>
</template>
