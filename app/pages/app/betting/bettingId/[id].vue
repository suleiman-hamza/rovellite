<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { z } from 'zod'

const route = useRoute()
const toast = useToast()

definePageMeta({
  title: 'Betting Details',
  layout: 'dashboard-layout',
  middleware: 'auth',
})

const { getUser } = useAuth()

const { data: betPlatform, error: fetcherror, refresh, status } = await useLazyFetch(`/api/betting/${route.params.id}`, {
  key: 'betting-details',
  immediate: !!getUser(),
  watch: false,
})

// if (import.meta.client) {
//   const stop = watch(() => getUser(), (user) => {
//     if (user && !betPlatform.value) {
//       refresh()
//       stop()
//     }
//   }, { immediate: true })
// }

const formSchema = z.object({
  agent: z.string().min(1, 'Please select a package'),
  id: z.string().min(1, 'Enter a valid Betting Id'),
  amount: z.string().min(1, 'Please enter an amount'),
})

type Schema = z.output<typeof formSchema>

const state = reactive<Partial<Schema>>({
  agent: '',
  id: '',
  amount: '',
})

function onSubmit(event: FormSubmitEvent<Schema>) {
  console.warn('Form submitted with values:', event.data)
  toast.add({
    title: 'Form Submitted',
    description: `Package Selected: ${event.data.agent}, User ID: ${event.data.id}, Amount: ${event.data.amount}`,
    duration: 4000,
  })
}

const selectPlan = computed(() => {
  if (!betPlatform.value) {
    return []
  }
  return betPlatform.value.bettinPlan.map((plan) => {
    return plan.name
  })
})

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
    <UButton icon="i-lucide-arrow-left" to="/app/betting" variant="outline" class="absolute top-4 left-4 hidden md:inline-flex" :ui="{ base: 'bg-secondary/10 ring-secondary/25 text-secondary hover:bg-primary/25' }" />
    <!-- Loading Skeleton when data is fetching from the API -->
    <div v-if="status === 'pending'" class="">
      <SlugSkeleton />
    </div>
    <div v-if="fetcherror" class="flex items-center space-x-4">
      {{ fetcherror }}
      <UButton variant="outline" @click="refresh()">
        Retry
      </UButton>
    </div>
    <section v-else-if="betPlatform" class="max-w-180 mx-auto">
      <!-- blue banner/ header -->
      <div class="rounded-t-lg flex justify-start md:justify-center gap-4 md:gap-8 h-24 sm:h-40 items-center p-4 md:px-6 bg-[#DBF4FF] w-full">
        <div class="flex gap-4 md:gap-8 items-center">
          <UButton icon="i-lucide-arrow-left" to="/app/betting" variant="outline" class="md:hidden" :ui="{ base: 'bg-secondary/10 ring-secondary/25 text-secondary hover:bg-primary/25' }" />
          <span class="rounded-full bg-white p-0.5 overflow-hidden">
            <NuxtImg :src="betPlatform?.image" class="object-contain w-16 h-16 md:w-24 md:h-24" />
          </span>
          <p class="text-[18px] sm:text-[32px] font-bold text-[#4D5155] md:mr-auto">
            {{ betPlatform?.name?.toUpperCase() }}
          </p>
        </div>
      </div>
      <!-- form body -->
      <div class="border-2 border-[#E3EDF0] rounded-b-[20px]">
        <div class="w-full sm:max-w-lg mx-auto pt-9 pb-12.5">
          <div class="px-4 sm:px-6">
            <UForm :schema="formSchema" :state="state" class="space-y-4 md:space-y-6" @submit="onSubmit">
              <UFormField name="agent">
                <USelect v-model="state.agent" placeholder="Choose Wallet" :items="selectPlan" size="xl" class="w-full placeholder:text-[#4D5155]" />
              </UFormField>

              <UFormField name="id">
                <UInput v-model="state.id" size="xl" :placeholder="`${betPlatform?.name} User Id`" class="w-full placeholder:text-[#4D5155]" />
              </UFormField>

              <div class="flex items-center justify-between font-sourcePro">
                <UCheckbox label="Save" size="xl" :ui="{ indicator: 'bg-[#1177FE]', label: 'text-[12px] md:text-[16px] text-[#333333]', root: 'items-center' }" />
                <UButton variant="link" class="text-[#0045A5] text-[14px] py-0 px-0 w-auto leading-none">
                  Use Saved Beneficiary
                </UButton>
              </div>

              <UFormField name="amount">
                <UInput v-model="state.amount" size="xl" placeholder="Amount" class="w-full placeholder:text-amber-200" />
                <p class="text-[14px] mt-2">
                  Minimum: #100 | Maximun: #100
                </p>
              </UFormField>

              <div class="flex gap-4 md:justify-between px-0 sm:px-6">
                <UButton class="w-full flex justify-center items-center font-bold text-[16px] sm:text-[20px] text-black bg-[#999999] rounded-full" @click="addToCart">
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
                <!-- <Icon name="ion:caret-down" width="512" height="512" /> -->
                </UButton>
              </div>
            </UForm>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
