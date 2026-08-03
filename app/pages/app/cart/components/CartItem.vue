<script setup lang="ts">
import { useCartStore } from '#imports'

interface Props {
  productName: string
  productId: number
  image?: string
  amount: number
  billerId: number
  customerReference: string
  quantity: number
}

const props = defineProps<Props>()
const cartStore = useCartStore()
const { format } = useCurrency()

const quantityCount = computed({
  get: () => cartStore.items.find(item => item.productId === props.productId)?.quantity ?? props.quantity,
  set: (value: number) => cartStore.updateQuantity(props.productId, value),
})

// Unit price × quantity
// const lineTotal = computed(() =>
//   cartStore.getLineTotal({ ...props, quantity: quantityCount.value }),
// )
</script>

<template>
  <div class="">
    <!-- cart item -->
    <div class="flex gap-2.5 items-center md:gap-4">
      <!-- package/product icon -->
      <span class="border border-[#DBF4FF] rounded-md p-2 w-16 h-auto md:w-20 md:h-auto flex items-center justify-center">
        <NuxtImg
          v-if="props.image"
          :src="props.image"
          :alt="props.productName"
          class="rounded-full w-full h-full object-cover"
        />
        <span v-else class="w-full h-full rounded-full bg-gray-100" />
      </span>
      <!-- package/product name -->
      <div class="flex flex-col flex-1 gap-0.5 md:gap-2 w-fit text-ellipsis overflow-hidden">
        <h3 class="text-[#333333] text-[14px] md:text-[16px] truncate font-bold md:leading-[150%] tracking-[2%]">
          <span>{{ props.productName }}</span>
        </h3>
        <p class="text-[#565252] text-[14px] md:text-[16px] truncate tracking-[5%] font-normal leading-[150%]">
          <span>Id: {{ props.customerReference }}</span>
        </p>
        <p class="text-[#565252] text-[14px] md:text-[16px] tracking-[5%] font-bold leading-[150%]">
          <span>{{ format(props.amount) }}</span>
        </p>
      </div>
      <!-- remove btn and increase item -->
      <div class="max-w-18 ml-auto flex gap-2 flex-col items-end justify-between h-full">
        <UButton size="sm" variant="ghost" class="w-fit" icon="i-lucide-trash" :ui="{ leadingIcon: 'text-[#999999]' }" @click="cartStore.removeFromCart(props.productId)" />
        <UInputNumber v-model="quantityCount" size="xs" :min="1" />
      </div>
    </div>
  </div>
</template>
