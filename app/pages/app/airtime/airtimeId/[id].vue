<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { z } from 'zod'

const { getUser } = useAuth()
const route = useRoute()
const toast = useToast()

definePageMeta({
  title: 'Buy Airtime',
  layout: 'dashboard-layout',
  middleware: 'auth',
})

const formSchema = z.object({
  amount: z.string().min(1, 'Enter a valid amount'),
  phoneNumber: z.string().length(11, 'Phone number must be 11 digits').regex(/^\d+$/, 'Phone number must contain only digits'),
})

type Schema = z.output<typeof formSchema>

const state = reactive<Partial<Schema>>({
  amount: '',
  phoneNumber: '',
})

function onSubmit(event: FormSubmitEvent<Schema>) {
  console.warn('Form submitted with values:', event.data)
  toast.add({
    title: 'Form Submitted',
    description: `Plan: ${event.data.amount}, Phone Number: ${event.data.phoneNumber}`,
    duration: 4000,
  })
}

const { data: airtimeResult, error: fetcherror, refresh, status } = await useLazyFetch(`/api/data/${route.params.id}`, {
  key: 'airtime-plan-details',
  immediate: !!getUser(),
  watch: false,
})

// if (import.meta.client) {
//   const stop = watch(() => getUser(), (user) => {
//     if (user && !airtimeResult.value) {
//       refresh()
//       stop()
//     }
//   }, { immediate: true })
// }

// loading state for add to cart button
const loading = ref(false)

// Simulate adding to cart with a loading state
function addToCart() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    toast.add({
      title: 'Added to Cart',
      description: 'The item has been added to your cart.',
    })
  }, 2000)
}
</script>

<template>
  <main class="bg-white font-poppins rounded-[20px] md:p-7 relative">
    <UButton icon="i-lucide-arrow-left" to="/app/airtime" variant="outline" class="absolute top-4 left-4 hidden md:inline-flex" :ui="{ base: 'bg-secondary/10 ring-secondary/25 text-secondary hover:bg-primary/25' }" />
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
    <section v-else-if="airtimeResult" class="max-w-180 mx-auto">
      <!-- blue banner/ header -->
      <div class="rounded-t-[20px] flex justify-start md:justify-center gap-4 md:gap-8 h-24 sm:h-40 items-center p-4 md:px-6 bg-[#DBF4FF] w-full">
        <div class="flex gap-4 md:gap-8 items-center">
          <UButton icon="i-lucide-arrow-left" to="/app/airtime" variant="outline" class="md:hidden" :ui="{ base: 'bg-secondary/10 ring-secondary/25 text-secondary hover:bg-primary/25' }" />
          <span class="rounded-full bg-white p-0.5 overflow-hidden">
            <NuxtImg :src="airtimeResult?.image" class="object-contain w-16 h-16 md:w-24 md:h-24" />
          </span>
          <p class="text-[18px] sm:text-[32px] font-bold text-[#4D5155] md:mr-auto">
            {{ airtimeResult?.name?.toUpperCase() }}
          </p>
        </div>
      </div>
      <!--form body-->
      <div class="border-2 border-[#E3EDF0] rounded-b-[20px]">
        <div class="w-full sm:max-w-lg mx-auto pt-9 pb-12.5">
          <div class="px-4 sm:px-6">
          <UForm :schema="formSchema" :state="state" class="space-y-4" @submit="onSubmit">
            <UFormField name="agent">
              <UInput v-model="state.amount" size="xl" inputmode="numeric" placeholder="Amount" class="w-full" />
              <p class="text-[14px] mt-2">
                Minimum: #100 | Maximun: #100
              </p>
            </UFormField>

            <UFormField name="id">
              <UInput v-model="state.phoneNumber" size="xl" inputmode="numeric" maxlength="11" placeholder="Phone Number" class="w-full" />
            </UFormField>

            <div class="flex gap-4 px-0 sm:px-6">
              <UButton class="w-full flex justify-center items-center font-bold text-[16px] sm:text-[20px] text-black bg-[#999999] rounded-full" @click="addToCart">
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
    </section>
  </main>
</template>
