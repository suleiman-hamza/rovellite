<script setup lang="ts">
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()

definePageMeta({
  title: 'Cart',
  layout: 'dashboard-layout',
  middleware: 'auth',
  // keepalive: true,
})
</script>

<template>
  <main class="rounded-[20px] font-poppins">
    <div v-if="cartStore.items.length === 0" class="flex flex-col gap-20 items-center min-h-full bg-white rounded-[20px]">
      <!-- blue background element -->
      <span class="bg-[rgb(219,244,255)] w-full h-8 md:h-25 rounded-t-[20px]" />
      <div class="flex flex-col px-4 text-center items-center justify-center w-full mx-auto">
        <span class="size-fit mb-4">
          <NuxtImg src="/images/cart-empty.svg" alt="empty cart image" class="md:w-25 md:h-25 w-20 h-20" />
        </span>
        <h4 class="text-[#34383D] text-[20px] md:text-[24px] font-bold mb-4 md:mb-2">
          Empty Cart
        </h4>
        <p class="text-[14px] md:text-[18px] text-[#808385] max-w-100 mb-12">
          Oops... Your cart appears to be empty!
          <br>
          Add items to your cart
        </p>
        <NuxtLink to="/app/dashboard" class="bg-primary flex items-center justify-center text-white w-full max-w-120 mx-auto py-2.5 rounded-[40px] md:text-[22px] font-bold mb-4">
          Back to Dashboard
        </NuxtLink>
      </div>
    </div>

    <!-- if item is in cart, show Cart items and summary -->
    <div v-else class="flex flex-col gap-4 md:flex-row">
      <!-- Main Cart items -->
      <section class="p-4 bg-white rounded-[20px] md:flex-1">
        <div class="flex justify-between gap-4 items-center mb-4">
          <p class="text-base md:text-[28px] font-bold text-[#4D5155]">
            Cart
          </p>
          <UButton label="Clear all" variant="ghost" class="rounded-sm px-1 py-0.5 text-[#808385] outline outline-[#80838554] text-sm" :ui="{ leadingIcon: 'size-3' }" @click="cartStore.clearCart" />
        </div>
        <CartItem v-for="items in cartStore.items" :key="items.productId" class="py-3 border-b border-muted" :product-id="items.productId" :amount="items.amount || 0" :biller-id="items.billerId" :product-name="items.productName" :image="items.image" :customer-reference="items.customerReference" :quantity="items.quantity" />
      </section>

      <!-- Cart Summary -->
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

        <section class="flex flex-col sm:flex-row md:flex-col gap-4 justify-center items-center mt-5">
          <NuxtLink to="/app/checkout" class="bg-primary flex items-center justify-center text-white w-full max-w-100 mx-auto py-3 rounded-[40px] font-bold">
            Checkout
          </NuxtLink>
          <NuxtLink to="" class="bg-[#E6E6E7] flex items-center justify-center text-black w-full max-w-100 mx-auto py-3 rounded-[40px] font-bold">
            Countinue Shopping
          </NuxtLink>
        </section>
      </div>
    </div>
  </main>
</template>
