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
  </main>
</template>
