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
  <main class="bg-white rounded-[20px] h-full overflow-hidden font-poppins">
    <div v-if="cartStore.items.length === 0" class="relative flex justify-center items-center h-full">
      <span class="bg-[rgb(219,244,255)] absolute top-0 w-full h-7 md:h-18" />
      <div class="flex flex-col text-center items-center justify-center w-full max-w-125 mx-auto">
        <span class="size-fit mb-4">
          <NuxtImg src="/images/cart-empty.svg" alt="empty cart image" class="md:w-25 md:h-25 w-20 h-20" />
        </span>
        <h4 class="text-[#34383D] text-[20px] md:text-[24px] font-bold mb-4 md:mb-2">
          Empty Cart
        </h4>
        <p class="text-[14px] md:text-[18px] text-[#808385] max-w-85 mb-12">
          Oooops ..... Your cart appears to be empty!
          Add items to your cart
        </p>
        <NuxtLink to="/app/dashboard" class="bg-primary flex items-center justify-center text-white w-full max-w-120 mx-auto py-2 rounded-[40px] md:text-[22px] font-bold">
          Back to Dashboard
        </NuxtLink>
      </div>
    </div>
    <div v-else class="p-4 md:p-5 lg:p-6">
      <CartItem v-for="items in cartStore.items" :key="items.productId" :product-id="items.productId" :amount="items.amount || 0" :biller-id="items.billerId" :product-name="items.productName" :image="items.image" :customer-reference="items.customerReference" />

      <!-- should this section show if cart is empty -->
      <div class="mt-5 text-[#565252] font-bold">
        <div class="border-primary border md:text-[20px] p-3 flex justify-between">
          <p>Products</p>
          <p>{{ cartStore.cartItemCount }}</p>
        </div>
        <div class="bg-[#DBF4FF] md:text-[24px] p-3 flex justify-between">
          <p>Total Cost</p>
          <p>#{{ cartStore.cartTotalAmount }}</p>
        </div>
      </div>
      <div class="mt-5 flex justify-center items-center">
        <NuxtLink to="/app/checkout" class="bg-primary flex items-center justify-center text-white w-full max-w-100 mx-auto py-3 rounded-[40px] md:text-[24px] font-bold">
          Checkout
        </NuxtLink>
      </div>
    </div>
  </main>
</template>
