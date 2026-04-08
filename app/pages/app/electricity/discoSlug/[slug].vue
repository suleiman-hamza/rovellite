<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
definePageMeta({
  layout: 'dashboard-layout',
})

useSeoMeta({
  title: `Electricity - ${route.params.slug}` as string,
})
</script>

<template>
  <main class="border bg-white py-8 font-poppins">
    <div class="border max-w-lg mx-auto">
      <!-- blue banner/ header -->
      <div class="bg-[#DBF4FF] rounded-t-lg h-40 flex justify-center items-center">
        <div class="flex gap-6 justify-center items-center">
          <NuxtImg src="/images/electricity/Canva.png" class="w-25 h-25" />
          <h1 class="font-bold text-[#4D5155] text-[32px]">
            {{ route.params.slug }}
          </h1>
        </div>
      </div>
    </div>
  </main>
</template>
