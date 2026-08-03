<script setup lang="ts">
import type { Package } from '@@/shared/types/biller-types'
import type { FormSubmitEvent } from '@nuxt/ui'
import { z } from 'zod'

const { getUser } = useAuth()
const { addToCart } = useAddToCart()
const route = useRoute()
const toast = useToast()

definePageMeta({
  title: 'Betting Details',
  layout: 'dashboard-layout',
  middleware: 'auth',
})

const formSchema = z.object({
  plan: z.string().min(1, 'Please select a plan'),
  phoneNumber: z.string().length(11, 'Phone number must be 11 digits').regex(/^\d+$/, 'Phone number must contain only digits'),
})

type Schema = z.output<typeof formSchema>

const state = reactive<Partial<Schema>>({
  plan: '',
  phoneNumber: '',
})

function onSubmit(event: FormSubmitEvent<Schema>) {
  console.warn('Form submitted with values:', event.data)
  toast.add({
    title: 'Form Submitted',
    description: `Plan: ${event.data.plan}, Phone Number: ${event.data.phoneNumber}`,
    duration: 4000,
  })
}

const { data: result, error: fetcherror, refresh, status } = await useLazyFetch(`/api/data/${route.params.id}`, {
  key: 'data-plan-details',
  immediate: !!getUser(),
  watch: false,
})

// if (import.meta.client) {
//   const stop = watch(() => getUser(), (user) => {
//     if (user && !result.value) {
//       refresh()
//       stop()
//     }
//   }, { immediate: true })
// }

const selectPlan = computed(() => {
  return result.value?.dataplan?.map(plan => ({
    label: plan.name,
    value: plan.name,
  })) ?? []
})

const selectedPlan = computed(() =>
  (result.value?.dataplan as Package[] | undefined)?.find(p => p.name === state.plan),
)

function cart() {
  addToCart({
    productName: selectedPlan.value?.name ?? '',
    productId: selectedPlan.value?.id ?? 0,
    billerId: selectedPlan.value?.billerId ?? 0,
    amount: selectedPlan.value?.amount ?? 0,
    customerReference: state.phoneNumber ?? '',
    image: result.value?.image,
    quantity: 1,
  })
}
</script>

<template>
  <main class="bg-white font-poppins rounded-[20px] md:p-7 relative">
    <UButton icon="i-lucide-arrow-left" to="/app/dataInternet" variant="outline" class="hidden md:inline-block" :ui="{ base: 'bg-secondary/10 ring-secondary/25 text-primary hover:bg-primary/25' }" />
    <!-- Loading Skeleton when data is fetching from the API -->
    <div v-if="status === 'pending'" class="">
      <SlugSkeleton />
    </div>

    <div v-if="fetcherror">
      {{ fetcherror }}
      <UButton variant="outline" @click="refresh()">
        Retry
      </UButton>
    </div>
    <section v-else-if="result" class="max-w-200 mx-auto">
      <!-- blue banner/ header -->
      <div class="rounded-t-lg flex justify-start md:justify-center gap-4 md:gap-8 h-24 sm:h-40 items-center p-4 md:px-6 bg-[#DBF4FF] w-full">
        <div class="flex gap-4 md:gap-8 items-center">
          <UButton icon="i-lucide-arrow-left" to="/app/dataInternet" variant="outline" class="md:hidden" :ui="{ base: 'bg-secondary/10 ring-secondary/25 text-primary hover:bg-primary/25' }" />
          <span class="rounded-full bg-white p-0.5 overflow-hidden">
            <NuxtImg :src="result?.image" class="object-contain w-16 h-16 md:w-24 md:h-24" />
          </span>
          <p class="text-[18px] sm:text-[32px] font-bold text-[#4D5155] md:mr-auto">
            {{ result?.name?.toUpperCase() }}
          </p>
        </div>
      </div>
      <!-- form body -->
      <div class="border-2 border-[#E3EDF0] rounded-b-[20px]">
        <div class="w-full sm:max-w-lg mx-auto pt-9 pb-12.5">
          <div class="px-4 sm:px-6">
            <UForm :schema="formSchema" :state="state" class="space-y-4.5 sm:space-y-6" @submit="onSubmit">
              <UFormField name="agent">
                <USelect v-model="state.plan" placeholder="Plan" :items="selectPlan" size="xl" class="w-full" />
                <p class="text-[14px] mt-2">
                  Minimum: #100 | Maximun: #100
                </p>
              </UFormField>

              <UFormField name="id">
                <UInput v-model="state.phoneNumber" size="xl" inputmode="numeric" maxlength="11" placeholder="Phone Number" class="w-full" />
              </UFormField>

              <div class="flex gap-4 px-0">
                <UButton class="w-full flex justify-center items-center sm:flex-1 font-bold text-[16px] sm:text-[20px] text-black bg-[#999999] rounded-full" @click="cart">
                  Add to Cart
                </UButton>
                <UButton
                  type="submit"
                  class="w-full flex justify-center items-center sm:flex-1 font-bold text-[16px] sm:text-[20px] bg-[#1177FE] rounded-full text-white"
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
