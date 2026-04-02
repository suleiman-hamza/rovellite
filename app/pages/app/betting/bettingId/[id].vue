<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { z } from 'zod'

const route = useRoute()
const toast = useToast()

definePageMeta({
  title: 'Betting Details',
  layout: 'dashboard-layout',
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
  <main class="bg-[#F2F2F4] min-h-full p-4 border">
    <section v-if="betPlatform" class="border bg-white font-openSans rounded-lg flex flex-col gap-4 sm:pb-4">
      <div class="rounded-md flex gap-4 md:gap-8 h-24 sm:h-32 items-center p-5 md:px-6 border w-full">
        <!-- :style="{ backgroundColor: result?.accentColor } -->
        <UButton variant="ghost" class="flex p-2 items-center justify-center" @click="$router.back()">
          <UIcon name="i-lucide-arrow-left" />
        </UButton>
        <span class="rounded-md p-2 border bg-white w-25 h-full flex items-center justify-center">
          <NuxtImg :src="betPlatform?.image" class="object-contain w-full h-full" />
        </span>
        <p class="text-[18px] sm:text-[24px] font-bold text-black">
          {{ betPlatform?.name.toUpperCase() }}
        </p>
      </div>
      <div class="border w-full sm:max-w-md mx-auto">
        <div class="border px-4 sm:px-6 text-center text-[#565252] font-openSans">
          <div class="bordertext-[18px] sm:text-[32px] font-extrabold">
            {{ betPlatform?.name }} Top Up
          </div>
        </div>
        <div class="border px-4 sm:px-6">
          <UForm :schema="formSchema" :state="state" class="space-y-4" @submit="onSubmit">
            <UFormField label="Choose Wallet" name="agent">
              <USelect :items="betPlatform" />
            </UFormField>

            <UFormField label="User Id" name="id">
              <UInput />
            </UFormField>

            <div class="flex items-center justify-between font-sourcePro border">
              <p />
              <UButton variant="subtle" class="text-[#0045A5] text-[14px] py-0 leading-none">
                Use Saved Beneficiary
              </UButton>
            </div>

            <UFormField label="Amount" name="amount">
              <UInput />
            </UFormField>

            <UButton type="submit">
              Submit
            </UButton>
          </UForm>
        </div>
        <div class="border px-4 sm:px-6">
          <UButton class="w-full font-bold text-[16px] sm:text-[20px] text-black bg-[#999999] rounded-full" @click="addToCart">
            Add to Cart
          </UButton>
          <UButton
            type="submit"
            class="w-full font-bold text-[16px] sm:text-[20px]"
          >
            Checkout
            <!-- <Icon name="ion:caret-down" width="512" height="512" /> -->
          </UButton>
        </div>
      </div>
    </section>
    <!-- Loading Skeleton when data is fetching from the API -->
    <div v-else class="flex items-center space-x-4">
      <span class="w-100 h-100 block bg-red-500" />
    </div>

    <div v-if="pageerror">
      {{ pageerror }}
    </div>
  </main>
</template>
