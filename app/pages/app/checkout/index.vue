<script setup lang="ts">
import { useCartStore } from '@/stores/cart'
import { useProfileStore } from '#imports'

definePageMeta({
  title: 'Checkout',
  layout: 'dashboard-layout',
  middleware: 'auth',
  // keepalive: true,
})

const { displayedBalance } = await useWallet()
const cartStore = useCartStore()
const store = useProfileStore()

const isOpen = ref(false) // v-model to open or close the modal
</script>

<template>
  <main class="border">
    <div class="">
      <h2 class="text-[18px] md:text-[32px] md:leading-10.5 font-bold text-[#34383D] mb-2.5 md:mb-5">
        Checkout
      </h2>
    </div>
    <div class="rounded-[20px] bg-white p-4 border border-red-500">
      <div class="flex justify-between gap-4 items-center mb-4">
          <p class="text-base md:text-[28px] font-normal text-[#4D5155] capitalize">Item details</p>
          <UButton label="Edit Cart" leadingIcon="i-lucide-edit-3" variant="ghost" class="rounded-sm px-1 py-0.5 text-[#808385] outline outline-[#80838554] text-sm" :ui="{ leadingIcon: 'size-3' }" />
        </div>

        <div class="border h-20 rounded-sm mb-4">
        </div>

          <div class="">
            <p class="mb-4">Payment Method</p>
            <div class="border border-secondary p-3 rounded-sm flex gap-2.5 items-center md:gap-4">
              <span class="border border-primary rounded-sm p-2">
                <span class="bg-primary rounded-sm p-2 flex items-center justify-center">
                  <UIcon name="i-lucide-credit-card" class="size-6 text-white" />
                </span>
              </span>

              <div>
                <p class="text-[15px] md:text-[16px] font-bold text-[#4D5155]">Wallet</p>
                <p class="text-[14px] md:text-[15px] text-[#808385]">Wallet Balance: {{ displayedBalance }}</p>
              </div>

              <span class="ml-auto">
              <UIcon name="i-lucide-circle-check" class="text-primary" />
            </span>
            </div>
          </div>

            <div class="border-b border-[#CCCDCE] p-3 md:px-0 md:py-5 flex justify-between text-primary font-bold md:text-[20px] leading-[150%]">
              <p>Total Cost</p>
              <p>{{ cartStore.cartTotalAmount }}</p>
            </div>
            <div class="border-b border-[#CCCDCE] p-3 md:px-0 md:py-5 flex justify-between text-[#4D5155] font-bold md:text-[20px] leading-[150%]">
              <p>Wallet Balance</p>
              <p>{{ displayedBalance }}</p>
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
                <UButton label="Continue Payment" color="neutral" class="bg-primary flex items-center justify-center text-white w-full max-w-125 mx-auto py-3 rounded-[40px] md:text-[24px] font-bold border-none" variant="subtle" />
                <template #content>
                  <div class="h-50 md:h-65 m-4 relative flex flex-col justify-center items-center gap-5">
                    <!-- Your custom close button -->
                    <UButton icon="i-lucide-x" color="neutral" size="sm" variant="subtle" class="rounded-full absolute top-2 right-2" @click="isOpen = false" />
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
  </main>
</template>
