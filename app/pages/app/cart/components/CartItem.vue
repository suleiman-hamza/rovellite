<script setup lang="ts">
import { useCartStore } from '#imports'

const props = defineProps<Props>()
const cartStore = useCartStore()
interface Props {
  productName: string
  productId: number
  image?: string
  amount: number
  billerId: number
}
</script>

<template>
  <div class="border-b py-4 flex justify-between items-center">
    <!-- right side -->
    <div class="border flex items-center gap-4">
      <NuxtImg v-if="props.image" :src="props.image" :alt="props.productName" width="90" height="90" class="rounded-full" />
      <span v-else class="w-[90px] h-[90px] rounded-full border" />
      <span class="flex flex-col gap-2 border w-fit">
        <h3>{{ props.productName }}</h3>
        <UButton label="Remove" size="sm" variant="ghost" icon="i-lucide-trash" @click="cartStore.removeFromCart(props.productId)" />
      </span>
    </div>

    <!-- amount side -->
    <div>
      <p>#{{ props.amount }}</p>
    </div>
  </div>
</template>
