<script setup lang="ts">
import { useProfileStore } from '@/stores/profile'

const store = useProfileStore()
definePageMeta({
  title: 'Settings',
  layout: 'dashboard-layout',
  middleware: 'auth',
})
</script>

<template>
  <div>
    <h3>Settings</h3>
    <p>{{ store.userProfile?.email }}</p>
  </div>
</template>
