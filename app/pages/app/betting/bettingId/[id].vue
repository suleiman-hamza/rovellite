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

const formSchema = z.object({
  agent: z.string().min(1, 'Please select a package'),
  id: z.string().min(1, 'Please select a package'),
  amount: z.string().min(1, 'Please enter an amount'),
})

type Schema = z.output<typeof formSchema>

const state = reactive<Partial<Schema>>({
  agent: undefined,
  id: undefined,
  amount: undefined,
})

function onSubmit(event: FormSubmitEvent<Schema>) {
  console.warn('Form submitted with values:', event.data)
  toast.add({
    title: 'Form Submitted',
    description: `Package Selected: ${event.data.agent}, User ID: ${event.data.id}, Amount: ${event.data.amount}`,
    duration: 4000,
  })
}

const betPlatform = ref()
const pageerror = ref()

onBeforeMount(async () => {
  const { data: result, error } = await useFetch(`/api/betting/${route.params.id}`)

  if (error.value) {
    pageerror.value = error.value
    console.error('Error fetching betting data:', error.value)
  }
  else {
    betPlatform.value = result.value
  }
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
  <main class="bg-white font-openSans rounded-lg p-7">
    <section v-if="betPlatform" class="border border-[#E3EDF0] max-w-200 mx-auto rounded-lg">
      <div class="rounded-lg flex justify-center gap-4 md:gap-8 h-24 sm:h-40 items-center p-5 md:px-6 bg-[#DBF4FF] w-full">
        <!-- :style="{ backgroundColor: result?.accentColor } -->
        <!-- <UButton variant="ghost" class="flex p-2 items-center justify-center" @click="$router.back()">
          <UIcon name="i-lucide-arrow-left" />
        </UButton> -->
        <span class="rounded-full">
          <NuxtImg :src="betPlatform?.image" class="object-contain w-24 h-24" />
        </span>
        <p class="text-[18px] sm:text-[32px] font-bold text-[#4D5155]">
          {{ betPlatform?.name.toUpperCase() }}
        </p>
      </div>
      <div class="w-full sm:max-w-lg mx-auto mt-9 mb-17.5">
        <div class="px-4 sm:px-6">
          <UForm :schema="formSchema" :state="state" class="space-y-4" @submit="onSubmit">
            <UFormField name="agent">
              <USelect placeholder="Choose Wallet" size="xl" class="w-full" />
            </UFormField>

            <UFormField name="id">
              <UInput size="xl" :placeholder="`${betPlatform.name} User Id`" class="w-full" />
            </UFormField>

            <div class="flex items-center justify-between font-sourcePro border">
              <p />
              <UButton variant="subtle" class="text-[#0045A5] text-[14px] py-0 leading-none">
                Use Saved Beneficiary
              </UButton>
            </div>

            <UFormField name="amount">
              <UInput size="xl" placeholder="Amount" class="w-full" />
              <p class="text-[14px]">
                Minimum: #100 | Maximun: #100
              </p>
            </UFormField>

            <div class="flex gap-4 px-4 sm:px-6">
              <UButton class="w-full flex justify-center items-center font-bold text-[16px] sm:text-[20px] text-black bg-[#999999] rounded-full" @click="addToCart">
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
    </section>
    <!-- Loading Skeleton when data is fetching from the API -->
    <div v-else class="flex items-center space-x-4">
      <span>Loading...</span>
    </div>

    <div v-if="pageerror">
      {{ pageerror }}
    </div>
  </main>
</template>
