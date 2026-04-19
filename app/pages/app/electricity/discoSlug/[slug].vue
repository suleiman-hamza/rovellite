<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { z } from 'zod'

// import type { Package } from '@@/shared/types/biller-types'
const route = useRoute()
const toast = useToast()
const { getUser } = useAuth()

definePageMeta({
  layout: 'dashboard-layout',
  middleware: 'auth',
})

useSeoMeta({
  title: `Electricity - ${route.params.slug}` as string,
  description: () => 'This is a description for the page',
})

const { data: discoSlug, error: fetcherror, refresh, status } = await useLazyFetch(`/api/electricity/${route.params.slug}`, {
  key: 'disco-page-detail',
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
  package: z
    .string(),
  meterNumber: z.string()
    .regex(/^\d{11}$/, 'Enter a valid 11-digit meter number'),
  amount: z.string()
    .min(1, 'Amount is required.'),
  phoneNumber: z.string()
    .min(10, 'Phone number must be at least 10 digits.'),
})

type Schema = z.output<typeof formSchema>

// form initial values
const state = reactive<Partial<Schema>>({
  package: '',
  meterNumber: '',
  amount: '',
  phoneNumber: '',
})

function onSubmit(event: FormSubmitEvent<Schema>) {
  console.warn('Form submitted with values:', event.data)
  toast.add({
    title: 'Form Submitted',
    description: `Package Selected: ${event.data.package}, Meter Number: ${event.data.meterNumber}, Amount: ${event.data.amount}`,
    duration: 4000,
  })
}

const selectPlan = computed(() => {
  if (!discoSlug.value) {
    return []
  }
  return discoSlug.value.discoResponse.map((plan) => {
    return {
      label: plan.name,
      value: plan.id,
    }
  })
})
</script>

<template>
  <main class="rounded-[20px] md:py-7 bg-white font-poppins h-full">
    <!-- Loading Skeleton when data is fetching from the API -->
    <div v-if="status === 'pending'" class="flex items-center space-x-4">
      <p>loading...</p>
    </div>
    <div v-if="fetcherror" class="text-center p-4 flex flex-col justify-center gap-4 h-full items-center space-x-4">
      <p>{{ fetcherror }}</p>
      <UButton variant="outline" @click="refresh()">
        Retry
      </UButton>
    </div>
    <div v-else-if="discoSlug" class="max-w-207 mx-auto border border-[#E3EDF0] rounded-lg">
      <!-- blue banner/ header -->
      <div class="rounded-t-lg flex justify-start md:justify-center gap-4 md:gap-8 h-24 sm:h-40 items-center p-4 md:px-6 bg-[#DBF4FF] w-full">
        <UButton icon="i-lucide-arrow-left" to="/app/electricity" variant="subtle" class="justify-items-start" :ui="{ base: 'bg-secondary/10 ring-secondary/25 text-secondary hover:bg-primary/25' }" />
        <div class="flex gap-8 items-center">
          <span class="rounded-full">
            <NuxtImg :src="discoSlug?.image" class="object-contain w-16 h-16 md:w-24 md:h-24" />
          </span>
          <p class="text-[18px] sm:text-[32px] font-bold text-[#4D5155] md:mr-auto">
            {{ discoSlug?.name?.toUpperCase() }}
          </p>
        </div>
      </div>
      <div>
        <div class="w-full sm:max-w-lg mx-auto mt-9 mb-17.5">
          <div class="px-4 sm:px-6">
            <UForm :schema="formSchema" :state="state" class="space-y-4 md:space-y-6" @submit="onSubmit">
              <UFormField name="package">
                <USelect placeholder="Select Meter Type" :items="selectPlan" size="xl" class="w-full placeholder:text-[#4D5155]" />
              </UFormField>

              <UFormField name="meterNumber">
                <UInput v-model="state.meterNumber" size="xl" placeholder="Meter Number" class="w-full placeholder:text-[#4D5155]" />
              </UFormField>

              <UFormField name="amount">
                <UInput v-model="state.amount" size="xl" placeholder="Amount" class="w-full placeholder:text-amber-200" />
              </UFormField>

              <UFormField name="phoneNumber">
                <UInput v-model="state.phoneNumber" size="xl" placeholder="Phone Number" class="w-full placeholder:text-amber-200" />
              </UFormField>

              <div class="flex gap-4 md:justify-between px-0 sm:px-6">
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
        </div>
      </div>
    </div>
  </main>
</template>
