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
      name: plan.name,
      amount: plan.amount,
      id: plan.id,
    }
  })
})
</script>

<template>
  <main class="bg-white font-poppins rounded-[20px] md:p-7 relative">
    <UButton icon="i-lucide-arrow-left" to="/app/tvDecoders" variant="outline" class="absolute top-4 left-4 hidden md:inline-flex" :ui="{ base: 'bg-secondary/10 ring-secondary/25 text-secondary hover:bg-primary/25' }" />
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

    <section v-else-if="decodeInfo" class="max-w-180 mx-auto">
      <!-- blue banner/ header -->
      <div class="rounded-t-lg flex justify-start md:justify-center gap-4 md:gap-8 h-24 sm:h-40 items-center p-4 md:px-6 bg-[#DBF4FF] w-full">
        <div class="flex gap-4 md:gap-8 items-center">
          <UButton icon="i-lucide-arrow-left" to="/app/tvDecoders" variant="outline" class="md:hidden" :ui="{ base: 'bg-secondary/10 ring-secondary/25 text-secondary hover:bg-primary/25' }" />
          <span class="rounded-full bg-white p-0.5 overflow-hidden">
            <NuxtImg :src="decodeInfo?.image" class="object-contain w-16 h-16 md:w-24 md:h-24" />
          </span>
          <p class="text-[18px] sm:text-[32px] font-bold text-[#4D5155] md:mr-auto">
            {{ decodeInfo?.name?.toUpperCase() }}
          </p>
        </div>
      </div>
      <!-- form body -->
      <div class="border-2 border-[#E3EDF0] rounded-b-[20px]">
        <div class="w-full sm:max-w-lg mx-auto pt-9 pb-12.5">
          <div class="px-4 sm:px-6">
            <UForm :state :schema="formSchema" class="space-y-5 md:space-y-8" @submit="onSubmit">
              <UFormField class="w-full">
                <USelect
                  :items="selectPlan" value-key="id"
                  label-key="name" placeholder="plan"
                  size="xl" class="divide w-full placeholder:text-[#4D5155]"
                  :ui="{ group: 'p-0 divide-y', item: 'data-disabled:cursor-not-allowed data-disabled:opacity-75 text-[#676A6D] hover:text-[#1177FE]' }"
                >
                  <template #item="{ item }">
                    <p class="flex justify-between text-[#676A6D] text-[16px] md:text-[18px] w-full">
                      <span>{{ item.name }}</span>
                      <span>#{{ item.amount }}</span>
                    </p>
                  </template>
                </USelect>
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
        </div>
      </div>
    </section>
  </main>
</template>
