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

const categories = ['Gift Cards', 'Data', 'Airtime', 'TV/Decoder', 'Betting', 'Esim', 'Electricity', 'Education', 'Transportation', 'Solar']

const colors = ['#378ADD', '#E24B4A', '#EF9F27', '#5DCAA5', '#D4537E', '#2C2C2A', '#F0997B', '#7F77DD', '#D85A30', '#ED93B1']

const data: DataRecord[] = categories.map((label, i) => ({
  x: i,
  value: [45000, 62000, 68000, 78000, 67000, 50000, 40000, 65000, 78000, 55000][i]!,
  label,
  color: colors[i]!,
}))

// Single x accessor — positional index
const x = (d: DataRecord) => d.x

// Single y accessor — each bar reads its own value
const y = (d: DataRecord) => d.value

// Color per bar — reads the color field directly from the datum
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
    <p class="text-[#4D5155] font-semibold md:font-bold text-[18px] md:text-[20px] font-poppins tracking-[2%] mb-2">
      Product Sales
    </p>
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
      :padding="{ top: 2, right: 2, bottom: 2, left: 2 }"
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
        :bar-padding="0.05"
        :group-padding="0.2"
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
