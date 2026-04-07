<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

const source = ref('Hello')
const { copy, copied } = useClipboard({ source })

definePageMeta({
  title: 'Subscriptions',
  layout: 'dashboard-layout',
})
</script>

<template>
  <main>
    <h1>Sub page</h1>
    <div>
      <button @click="copy(source)">
        <!-- by default, `copied` will be reset in 1.5s -->
        <span v-if="!copied">Copy</span>
        <span v-else>Copied!</span>
      </button>
    </div>
  </main>
</template>
