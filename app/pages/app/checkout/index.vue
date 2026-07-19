<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'
import { useCartStore } from '@/stores/cart'

definePageMeta({
  title: 'Checkout',
  layout: 'dashboard-layout',
  middleware: 'auth',
  // keepalive: true,
})

const cartStore = useCartStore()

const isOpen = ref(false) // v-model to open or close the modal
const items = [
  {
    label: 'Pay With Wallet Balance',
    slot: 'wallet' as const,
  },
  {
    label: 'Pay With Other Methods',
    slot: 'paystack' as const,
  },
] satisfies TabsItem[]
</script>

<template>
  <main class="bg-white p-4 md:p-5 lg:p-6 rounded-[20px]">
    <div class="">
      <h2 class="text-[18px] md:text-[32px] md:leading-[42px] font-bold text-[#34383D] mb-2.5 md:mb-5">
        Payment Method
      </h2>
      <h3 class="text-[#676A6D] text-[16px] md:text-[24px] font-bold md:leading-[30px]">
        Select a payment method
      </h3>
    </div>
    <div class="mt-7">
      <UTabs
        :items="items"
        variant="pill"
        :ui="{
          root: '',
          list: 'bg-transparent gap-4 p-0 border',
          indicator: 'hidden',
          trigger: 'flex items-center gap-2 before:content-[\'\'] before:size-4 before:rounded-full before:border-2 before:border-primary data-[state=active]:before:bg-primary data-[state=active]:before:border-primary data-[state=inactive]:before:bg-transparent data-[state=inactive]:text-[#4D5155] data-[state=active]:text-primary md:before:size-6 md:text-[24px]',
        }"
      >
        <template #wallet>
          <div class="mt-5">
            <div class="border-b border-[#CCCDCE] p-3 md:px-0 md:py-5 flex justify-between text-primary font-bold md:text-[20px] leading-[150%]">
              <p>Total Cost</p>
              <p>{{ cartStore.cartTotalAmount }}</p>
            </div>
            <div class="border-b border-[#CCCDCE] p-3 md:px-0 md:py-5 flex justify-between text-[#4D5155] font-bold md:text-[20px] leading-[150%]">
              <p>Wallet Balance</p>
              <p>0.00</p>
            </div>
            <div class="mt-5 md:mt-15 flex flex-col gap-5 justify-center items-center">
              <UModal
                v-model:open="isOpen"
                :close="{
                  color: 'primary',
                  variant: 'outline',
                  class: 'rounded-full',
                }"
              >
                <UButton label="Continue Payment" color="neutral" class="bg-primary flex items-center justify-center text-white w-full max-w-[500px] mx-auto py-3 rounded-[40px] md:text-[24px] font-bold border-none" variant="subtle" />
                <template #content>
                  <div class="h-50 md:h-65 m-4 relative flex flex-col justify-center items-center gap-5">
                    <!-- Your custom close button -->
                    <UButton icon="i-lucide-x" color="neutral" size="sm" variant="subtle" class="rounded-full absolute top-2 right-2" @click="() => { isOpen = false }" />
                    <span class="rounded-full bg-green-500 p-4 flex items-center justify-center w-fit">
                      <UIcon name="i-lucide-check" class="size-10 text-white" />
                    </span>
                    <p class="text-[18px] md:text-[32px] font-bold text-[#34383D]">
                      Payment Successful!
                    </p>
                    <p class="text-center text-[15px] md:text-[18px] text-[#808385]">
                      Thank you for your purchase.
                      Your transaction has been completed successfully
                    </p>
                  </div>
                </template>
              </UModal>
              <p class="tracking-[5%] text-center">
                By clicking Make Payment, you agree to our <span class="text-primary">Terms of Use,</span> <span class="text-primary">Refund Policy,</span> and <span class="text-primary">Privacy Policy</span>
              </p>
            </div>
          </div>
        </template>
        <template #paystack>
          <div class="mt-5">
            <p>Paystack</p>
          </div>
        </template>
      </UTabs>
    </div>
  </main>
</template>
