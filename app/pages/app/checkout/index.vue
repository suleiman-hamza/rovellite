<script setup lang="ts">
import { useCartStore } from '@/stores/cart'

definePageMeta({
  title: 'Checkout',
  layout: 'dashboard-layout',
  middleware: 'auth',
  // keepalive: true,
})

const { displayedBalance } = await useWallet()
const cartStore = useCartStore()

// const isOpen = ref(false) // v-model to open or close the modal
</script>

<template>
  <main class="">
    <div class="flex flex-col gap-4 md:flex-row">
      <section class="rounded-[20px] bg-white p-4 md:flex-1">
        <h2 class="text-[18px] md:text-[32px] md:leading-10.5 font-bold text-[#34383D] mb-2 md:mb-4">
          Checkout
        </h2>
        <div class="flex justify-between gap-4 items-center mb-4">
          <p class="text-base md:text-[18px] font-normal text-[#4D5155] capitalize">
            Item details
          </p>
          <UButton
            to="/app/cart"
            label="Edit Cart" leading-icon="i-lucide-edit-3" variant="ghost"
            class="rounded-sm px-1 py-0.5 text-[#808385] outline outline-[#80838554] text-sm"
            :ui="{ leadingIcon: 'size-3' }"
          />
        </div>

        <div class="border rounded-sm mb-4 overflow-x-auto p-1 flex gap-4">
          <div v-for="item in cartStore.items" :key="item.productId" class="border border-red-500 rounded-sm bg-[#F9F9FB] shadow-xs p-4 flex gap-2.5">
            <span class="border border-[#DBF4FF] bg-white rounded-md p-2 w-16 h-auto md:w-20 md:h-auto flex items-center justify-center">
              <NuxtImg
                :src="item.image"
                :alt="item.productName"
                class="rounded-full w-full h-full object-cover"
              />
            </span>
            <div class="flex flex-col flex-1 gap-0.5 md:gap-2 w-fit text-ellipsis overflow-hidden">
              <h3 class="text-[#333333] text-[14px] md:text-[16px] truncate font-bold md:leading-[150%] tracking-[2%]">
                <span>{{ item.productName }}</span>
              </h3>
              <p class="text-[#565252] text-[14px] md:text-[16px] truncate tracking-[5%] font-normal leading-[150%]">
                <span>Id: {{ item.customerReference }}</span>
              </p>
              <p class="text-[#565252] text-[14px] md:text-[16px] tracking-[5%] font-bold leading-[150%]">
                <span>#{{ item.amount }}</span>
              </p>
            </div>
          </div>
        </div>

        <div class="mb-4 md:mb-8">
          <p class="mb-4">
            Payment Method
          </p>
          <div class="border border-secondary p-3 rounded-sm flex gap-2.5 items-center md:gap-4 max-w-80">
            <span class="border border-primary rounded-sm p-2">
              <span class="bg-primary rounded-sm p-2 flex items-center justify-center">
                <UIcon name="i-lucide-credit-card" class="size-6 text-white" />
              </span>
            </span>

            <div>
              <p class="text-[15px] md:text-[16px] font-bold text-[#4D5155]">
                Wallet
              </p>
              <p class="text-[14px] md:text-[15px] text-[#808385]">
                Balance: {{ displayedBalance }}
              </p>
            </div>

            <span class="ml-auto">
              <UIcon name="i-lucide-circle-check" class="text-primary" />
            </span>
          </div>
        </div>
        <div class="p-4 text-center max-w-120 mx-auto hidden md:block">
          <NuxtLink
            to="/app/checkout"
            class="bg-primary flex items-center justify-center text-white md:text-[18px] w-full max-w-100 mx-auto py-3 rounded-[40px] font-bold mb-4"
          >
            Continue Payment
          </NuxtLink>
          <p>By clicking Make Payment, you agree to our <span class="text-primary">Terms of Use</span>, <span class="text-primary">Refund Policy</span>, and <span class="text-primary">Privacy Policy</span></p>
        </div>
      </section>

      <!-- summary section -->
      <div class="md:min-w-60 lg:min-w-80">
        <section class="p-4 bg-white rounded-[20px]">
          <!-- should this section show if cart is empty -->
          <div class="text-[#565252]">
            <h4 class="font-bold text-black">
              Summary
            </h4>
            <USeparator class="my-4" />
            <!-- total product count -->
            <div class="text-[15px] md:text-[16px] flex gap-8 justify-between mb-2">
              <p>Total Products</p>
              <p class="font-bold">
                {{ cartStore.cartItemCount }}
              </p>
            </div>
            <!-- rovelsub charges -->
            <div class="text-[15px] md:text-[16px] flex gap-8 justify-between mb-2">
              <p>Charges</p>
              <p class="font-bold">
                #0
              </p>
            </div>
            <!-- bonus to earn -->
            <div class="text-[15px] md:text-[16px] flex gap-8 justify-between mb-2">
              <p>Bonus to Earn</p>
              <p class="bg-secondary text-primary rounded-sm px-1 p-0.5">
                #0
              </p>
            </div>
            <!-- total amount -->
            <div class="md:text-[16px] flex gap-8 justify-between">
              <p>Total</p>
              <p class="text-primary font-bold">
                #{{ cartStore.cartTotalAmount }}
              </p>
            </div>
          </div>
        </section>

        <section class="hidden md:flex flex-col sm:flex-row md:flex-col gap-4 justify-center items-center mt-5">
          <NuxtLink
            to="/app/checkout"
            class="bg-[#E6E6E7] flex items-center justify-center md:text-[18px] text-black w-full max-w-100 mx-auto py-3 rounded-[40px] font-bold"
          >
            Edit Cart
          </NuxtLink>
          <NuxtLink
            to=""
            class="bg-[#E6E6E7] flex items-center justify-center md:text-[18px] text-black w-full max-w-100 mx-auto py-3 rounded-[40px] font-bold"
          >
            Countinue Shopping
          </NuxtLink>
        </section>

        <div class="sm:p-4 text-center max-w-120 mx-auto md:hidden">
          <NuxtLink
            to="/app/checkout"
            class="bg-primary flex items-center justify-center text-white md:text-[18px] w-full max-w-100 mx-auto py-3 rounded-[40px] font-bold mb-4"
          >
            Continue Payment
          </NuxtLink>
          <p>By clicking Make Payment, you agree to our <span class="text-primary">Terms of Use</span>, <span class="text-primary">Refund Policy</span>, and <span class="text-primary">Privacy Policy</span></p>
        </div>
      </div>
    </div>
    <!-- <div class="mt-5 md:mt-15 flex flex-col gap-5 justify-center items-center">
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
  By clicking Make Payment, you agree to our <span class="text-primary">Terms of Use,</span> <span
    class="text-primary">Refund Policy,</span> and <span class="text-primary">Privacy Policy</span>
</p>
</div> -->
  </main>
</template>
