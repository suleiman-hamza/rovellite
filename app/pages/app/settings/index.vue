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
  <main class="border bg-white rounded-[20px]">
    <!--header/profile img-->
    <div class="">
      <div class="relative rounded-full w-20 h-20 border border-primary">
        <UUser class="w-full h-full" :avatar="{
          src: store.userProfile?.avatar_url,
          loading: 'lazy',
          icon: 'i-lucide-image'
        }" />
        <span class="absolute right-0 bottom-5 bg-white rounded-full shadow">
          <UFileUpload icon="i-lucide-camera" variant="button" :ui="{ base: 'rounded-full', icon: 'text-primary' }"
            class="rounded-full" />
        </span>
      </div>
      <span class="bg-[#DBF4FF]"></span>
      <span class="bg-white"></span>
    </div>
  </main>
</template>
