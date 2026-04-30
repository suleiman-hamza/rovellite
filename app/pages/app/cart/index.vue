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
  <main class="bg-white p-4 md:p-5 rounded-[20px] h-full">
    <div v-if="cartStore.items.length === 0">
      <p>You do not have any items here</p>
    </div>
    <div v-else>
      <CartItem v-for="items in cartStore.items" :key="items.productId" :product-id="items.productId" :amount="items.amount" :biller-id="items.billerId" :product-name="items.productName" :image="items.image" />
    </div>
    <!-- should this section show if cart is empty -->
    <div class="mt-5">
      <div class="border-primary border p-3 flex justify-between">
        <p>Products</p>
        <p>{{ cartStore.cartItemCount }}</p>
      </div>
      <div class="bg-[#DBF4FF] p-3 flex justify-between">
        <p>Total Cost</p>
        <p>{{ cartStore.cartTotalAmount }}</p>
      </div>
    </div>
    <div class="mt-5 flex justify-center items-center">
      <NuxtLink to="/app/checkout" class="bg-primary flex items-center justify-center text-white w-full max-w-[500px] mx-auto py-3 rounded-[40px] md:text-[24px] font-bold">
        Transfer
      </NuxtLink>
    </div>
  </main>
</template>
