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
  <main>
    <div class="border">
      <h2 class="text-[18px] md:text-[32px] md:leading-[42px] font-bold text-[#34383D] mb-2.5 md:mb-5">
        Payment Method
      </h2>
      <h3 class="text-[#676A6D] text-[16px] md:text-[24px] font-bold md:leading-[30px]">
        Select a payment method
      </h3>
    </div>
    <div>
      <UTabs
        :items="items"
        variant="pill"
        :ui="{
          root: 'items-start',
          list: 'bg-transparent gap-4 p-0 border w-fit',
          indicator: 'hidden',
          trigger: 'flex items-center gap-2 before:content-[\'\'] before:size-4 before:rounded-full before:border-2 before:border-primary data-[state=active]:before:bg-primary data-[state=active]:before:border-primary data-[state=inactive]:before:bg-transparent data-[state=inactive]:text-[#4D5155] data-[state=active]:text-primary md:before:size-6',
        }"
      >
        <template #wallet>
          <div class="">
            <div class="border-b p-3 flex justify-between">
              <p>Total Cost</p>
              <p>{{ cartStore.cartTotalAmount }}</p>
            </div>
            <div class="border-b p-3 flex justify-between">
              <p>Wallet Balance</p>
              <p>0.00</p>
            </div>
          </div>
        </template>
        <template #paystack>
          <p>Paystack</p>
        </template>
      </UTabs>
    </div>
  </main>
</template>
