<script setup lang="ts">
import type { Package } from '@@/shared/types/biller-types'
import type { FormSubmitEvent } from '@nuxt/ui'
import { z } from 'zod'

const { addToCart } = useAddToCart()
const route = useRoute()
const toast = useToast()
const { getUser } = useAuth()

definePageMeta({
  layout: 'dashboard-layout',
  middleware: 'auth',
})

useSeoMeta({
  title: `Education - ${route.params.slug}` as string,
  description: () => 'This is a description for the page',
})

const { data: eduSlug, error: fetcherror, refresh, status } = await useLazyFetch(`/api/education/${route.params.slug}`, {
  key: 'education-page-detail',
  immediate: !!getUser(),
  watch: false,
})

// if (import.meta.client) {
//   const stop = watch(() => getUser(), (user) => {
//     if (user && !eduSlug.value) {
//       refresh()
//       stop()
//     }
//   }, { immediate: true })
// }

// form validation schema w/ zod
const formSchema = z.object({
  plan: z
    .string(),
  profileId: z.string()
    .regex(/^\d{11}$/, 'Enter a valid 11-digit profile ID'),
  amount: z.string()
    .min(1, 'Amount is required.'),
  phoneNumber: z.string()
    .min(10, 'Phone number must be at least 10 digits.'),
})

type Schema = z.output<typeof formSchema>

// form initial values
const state = reactive<Partial<Schema>>({
  plan: '',
  profileId: '',
  amount: '',
  phoneNumber: '',
})

function onSubmit(event: FormSubmitEvent<Schema>) {
  console.warn('Form submitted with values:', event.data)
  toast.add({
    title: 'Form Submitted',
    description: `Package Selected: ${event.data.plan}, Profile Number: ${event.data.profileId}, Amount: ${event.data.amount}`,
    duration: 4000,
  })
}

const selectPlan = computed(() => {
  return eduSlug.value?.platformResponse?.map(plan => ({
    label: plan.name,
    value: plan.name,
  })) ?? []
})

const selectedPlan = computed(() =>
  (eduSlug.value?.platformResponse as Package[] | undefined)?.find(p => p.name === state.plan),
)

function cart() {
  addToCart({
    productName: selectedPlan.value?.name ?? '',
    productId: selectedPlan.value?.id ?? 0,
    billerId: selectedPlan.value?.billerId ?? 0,
    amount: (selectedPlan.value?.amount ?? Number(state.amount)) || null,
    customerReference: state.profileId ?? '',
    image: eduSlug.value?.image,
  })
}
</script>

<template>
  <main class="bg-white font-poppins rounded-[20px] md:p-7 relative">
    <UButton icon="i-lucide-arrow-left" to="/app/education" variant="outline" class="hidden md:inline-block" :ui="{ base: 'bg-secondary/10 ring-secondary/25 text-primary hover:bg-primary/25' }" />
    <!-- Loading Skeleton when data is fetching from the API -->
    <div v-if="status === 'pending'" class="">
      <SlugSkeleton />
    </div>
    <div v-if="fetcherror" class="flex items-center space-x-4">
      <p>{{ fetcherror }}</p>
      <UButton variant="outline" @click="refresh()">
        Retry
      </UButton>
    </div>
    <section v-else-if="eduSlug" class="max-w-180 mx-auto">
      <!-- blue banner/ header -->
      <div class="rounded-t-lg flex justify-start md:justify-center gap-4 md:gap-8 h-24 sm:h-40 items-center p-4 md:px-6 bg-[#DBF4FF] w-full">
        <div class="flex gap-4 md:gap-8 items-center">
          <UButton icon="i-lucide-arrow-left" to="/app/education" variant="outline" class="md:hidden" :ui="{ base: 'bg-secondary/10 ring-secondary/25 text-primary hover:bg-primary/25' }" />
          <span class="rounded-full bg-white p-0.5 overflow-hidden">
            <NuxtImg :src="eduSlug?.image" class="object-contain w-16 h-16 md:w-24 md:h-24" />
          </span>
          <p class="text-[18px] sm:text-[32px] font-bold text-[#4D5155] md:mr-auto">
            {{ eduSlug?.name?.toUpperCase() }}
          </p>
        </div>
      </div>
      <!-- form body -->
      <div class="border-2 border-[#E3EDF0] rounded-b-[20px]">
        <div class="w-full sm:max-w-lg mx-auto pt-9 pb-12.5">
          <div class="px-4 sm:px-6">
            <UForm :schema="formSchema" :state="state" class="space-y-4 md:space-y-6" @submit="onSubmit">
              <UFormField name="plan">
                <USelect v-model="state.plan" placeholder="Plan" :items="selectPlan" size="xl" class="w-full placeholder:text-[#4D5155]" />
              </UFormField>

              <UFormField name="profileId">
                <UInput v-model="state.profileId" size="xl" placeholder="Profile ID" class="w-full placeholder:text-[#4D5155]" />
              </UFormField>

              <UFormField name="phoneNumber">
                <UInput v-model="state.phoneNumber" size="xl" placeholder="Phone Number" class="w-full placeholder:text-amber-200" />
              </UFormField>

              <UFormField name="amount">
                <UInput v-model="state.amount" size="xl" placeholder="Price" class="w-full placeholder:text-amber-200" />
              </UFormField>

              <div class="flex gap-4 md:justify-between px-0 sm:px-6">
                <UButton class="w-full flex justify-center items-center font-bold text-[16px] sm:text-[20px] text-black bg-[#999999] rounded-full" @click="cart">
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
    </section>
  </main>
</template>
