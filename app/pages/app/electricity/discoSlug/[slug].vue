<script setup lang="ts">
// import type { Package } from '@@/shared/types/biller-types'
import { useRoute } from 'vue-router'
// import { z } from 'zod'

const route = useRoute()
definePageMeta({
  layout: 'dashboard-layout',
  middleware: 'auth',
})

useSeoMeta({
  title: `Electricity - ${route.params.slug}` as string,
  description: () => 'This is a description for the page',
})

// form validation schema w/ zod
// const formSchema = z.object({
//   package: z
//     .string(),
//   customerId: z.string()
//     .regex(/^\d{11}$/, 'Enter a valid 11-digit meter number'),
//   amount: z.string()
//     .min(1, 'Amount is required.'),
//   phoneNumber: z.string()
//     .min(10, 'Phone number must be at least 10 digits.'),
// })

// form initial values
// const formState = reactive({
//   package: '',
//   customerId: '',
//   amount: '',
//   phoneNumber: '',
// })

// const loading = ref<boolean>(false)
// const slug = route.params.slug
const discoSlug = ref()
const pageerror = ref()

onBeforeMount(async () => {
  const { data: result, error } = await useFetch(`/api/electricity/${route.params.slug}`)

  if (error.value) {
    pageerror.value = error.value
    console.error('Error fetching electricity data:', error.value)
  }
  else {
    discoSlug.value = result.value
  }
})
</script>

<template>
  <main class="rounded-[20px] bg-white py-8 font-poppins">
    <div class="max-w-lg mx-auto">
      <!-- blue banner/ header -->
      <div class="bg-[#DBF4FF] rounded-t-[20px] h-40 flex justify-center items-center">
        <div class="flex gap-6 justify-center items-center">
          <NuxtImg :src="discoSlug?.image" class="w-25 h-25" />
          <h1 class="font-bold text-[#4D5155] text-[32px]">
            {{ route.params.slug }}
          </h1>
        </div>
      </div>
      <div>
        <p>{{ discoSlug }}</p>
      </div>
    </div>
  </main>
</template>
