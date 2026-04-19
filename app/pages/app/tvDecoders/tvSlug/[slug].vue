<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { z } from 'zod'

// import type { Package } from '@@/shared/types/biller-types'
const route = useRoute()
// const toast = useToast()
const { getUser } = useAuth()

definePageMeta({
  layout: 'dashboard-layout',
  middleware: 'auth',
})

useSeoMeta({
  title: `TV/Decoders - ${route.params.slug}` as string,
  description: () => 'This is a description for the page',
})

const { data: decodeInfo, error: fetcherror, refresh, status } = await useLazyFetch(`/api/paytv/${route.params.slug}`, {
  key: 'decoder-page-detail',
  immediate: !!getUser(),
  watch: false,
})

// if (import.meta.client) {
//   const stop = watch(() => getUser(), (user) => {
//     if (user && !discoSlug.value) {
//       refresh()
//       stop()
//     }
//   }, { immediate: true })
// }

// form validation schema w/ zod
const formSchema = z.object({
  plan: z
    .string(),
  decoderNumber: z.string()
    .regex(/^\d{11}$/, 'Enter a valid 11-digit meter number'),
  phoneNumber: z.string()
    .min(1, 'Amount is required.'),
  price: z.string()
    .min(10, 'Phone number must be at least 10 digits.'),
})

type Schema = z.output<typeof formSchema>

// form initial values
const state = reactive<Partial<Schema>>({
  plan: '',
  decoderNumber: '',
  phoneNumber: '',
  price: '',
})

function onSubmit(event: FormSubmitEvent<Schema>) {
  console.warn('Form submitted with values:', event.data)
}

const selectPlan = computed(() => {
  if (!decodeInfo.value) {
    return []
  }
  return decodeInfo.value?.paytvResponse.map((plan) => {
    return {
      label: plan.name,
      value: plan.id,
    }
  })
})
</script>

<template>
  <main class="bg-white md:py-8 md:px-4 rounded-[20px]">
    <!-- Loading Skeleton when data is fetching from the API -->
    <div v-if="status === 'pending'" class="flex items-center space-x-4">
      <span>Loading...</span>
    </div>

    <div v-if="fetcherror">
      {{ fetcherror }}
      <UButton variant="outline" @click="refresh()">
        Retry
      </UButton>
    </div>

    <section v-else-if="decodeInfo" class="border rounded-[20px] border-[#E3EDF0] max-w-200 mx-auto">
      <div class="bg-[#DBF4FF] flex justify-start md:justify-center gap-4 md:gap-8 h-24 sm:h-40 items-center w-full p-4 md:px-8 rounded-t-[20px]">
        <div class="flex items-center gap-4 md:gap-8">
          <UButton icon="i-lucide-arrow-left" to="/app/tvDecoders" variant="subtle" class="justify-items-start" :ui="{ base: 'bg-secondary/10 ring-secondary/25 text-secondary hover:bg-primary/25' }" />
          <div class="flex gap-4 md:gap-8 items-center">
            <span class="rounded-full">
              <NuxtImg :src="decodeInfo?.image" class="object-contain w-15 h-15 md:w-24 md:h-24" />
            </span>
            <p class="text-[18px] sm:text-[32px] font-bold text-[#4D5155] md:mr-auto">
              {{ decodeInfo?.name?.toUpperCase() }}
            </p>
          </div>
        </div>
      </div>
      <!-- form body -->
      <div class="max-w-135 mx-auto p-4 md:p-8">
        <UForm :state :schema="formSchema" class="space-y-5 md:space-y-8" @submit="onSubmit">
          <UFormField class="w-full">
            <USelect :items="selectPlan" placeholder="plan" size="xl" class="w-full placeholder:text-[#4D5155]" />
          </UFormField>

          <UFormField class="w-full">
            <UInput v-model="state.decoderNumber" placeholder="Decoder Number" size="xl" class="w-full placeholder:text-[#4D5155]" />
          </UFormField>

          <UFormField class="w-full">
            <UInput v-model="state.phoneNumber" placeholder="Phone Number" size="xl" class="w-full placeholder:text-[#4D5155]" />
          </UFormField>

          <UFormField class="w-full">
            <UInput v-model="state.price" placeholder="Generated Price" size="xl" class="w-full placeholder:text-[#4D5155]" />
          </UFormField>

          <div class="flex gap-4 md:gap-8 items-center">
            <UButton class="w-full flex justify-center items-center font-bold text-[16px] sm:text-[20px] text-black bg-[#999999] rounded-full">
              <template #leading>
                <Icon name="i-lucide-shopping-cart" class="hidden md:inline" />
              </template>
              Add to Cart
            </UButton>
            <UButton
              type="submit"
              class="w-full flex justify-center items-center font-bold text-[16px] sm:text-[20px] bg-[#1177FE] rounded-full text-white"
            >
              Checkout
            </UButton>
          </div>
        </UForm>
      </div>
    </section>
  </main>
</template>
