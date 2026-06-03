<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { z } from 'zod'

// import type { Package } from '@@/shared/types/biller-types'
// const route = useRoute()
const toast = useToast()
// const { getUser } = useAuth()

definePageMeta({
  title: 'Solar',
  layout: 'dashboard-layout',
  middleware: 'auth',
})

useSeoMeta({
  title: 'Solar',
  description: () => 'This is a description for the page',
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
  provider: z
    .string(),
  userId: z.string()
    .regex(/^\d{11}$/, 'Enter a valid 11-digit meter number'),
  amount: z.string()
    .min(1, 'Amount is required.'),
})

type Schema = z.output<typeof formSchema>

// form initial values
const state = reactive<Partial<Schema>>({
  provider: '',
  userId: '',
  amount: '',
})

const items = ref(['Sunrun', 'Lumos Nigeria', 'Palmetto', 'Tesla Solar'])

function onSubmit(event: FormSubmitEvent<Schema>) {
  console.warn('Form submitted with values:', event.data)
  toast.add({
    title: 'Form Submitted',
    description: `Provider Selected: ${event.data.provider}, User Id Number: ${event.data.userId}, Amount: ${event.data.amount}`,
    duration: 4000,
  })
}
</script>

<template>
  <main class="bg-white rounded-[20px]">
    <div class="mb-4">
      <NuxtImg src="/images/solar-banner.png" alt="solar page banner img" class="w-full h-25 md:h-40 object-contain rounded-[20px]" />
    </div>
    <div class="p-4">
      <div class="max-w-120 mx-auto md:p-5">
        <h2 class="text-center text-[#565252] text-[18px] md:text-[28px] font-bold mb-4">
          Enter Details For Your Solar
        </h2>
        <UForm :schema="formSchema" :state="state" class="space-y-4 md:space-y-6" @submit="onSubmit">
          <UFormField name="provider">
            <USelect :items placeholder="Select Solar Provider" size="xl" class="w-full placeholder:text-[#4D5155]" />
          </UFormField>

          <UFormField name="userId">
            <UInput v-model="state.userId" size="xl" placeholder="User ID" class="w-full placeholder:text-[#4D5155]" />
          </UFormField>

          <div class="flex items-center justify-between font-sourcePro">
            <UCheckbox label="Save" size="xl" :ui="{ indicator: 'bg-[#1177FE]', label: 'text-[12px] md:text-[16px] text-[#333333]', root: 'items-center' }" />
            <UButton variant="link" class="text-[#0045A5] text-[14px] py-0 px-0 w-auto leading-none">
              Use Saved Beneficiary
            </UButton>
          </div>

          <UFormField name="amount">
            <UInput v-model="state.amount" size="xl" placeholder="Choose an Amount" class="w-full placeholder:text-amber-200" />
          </UFormField>

          <div class="flex gap-4 md:justify-between px-0">
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
  </main>
</template>
