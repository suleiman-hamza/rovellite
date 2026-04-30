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
  customerReference: string
}
</script>

<template>
  <div class="border-b border-[#CCCDCE] py-4 flex justify-between items-center">
    <!-- right side -->
    <div class="flex items-center gap-4">
      <NuxtImg v-if="props.image" :src="props.image" :alt="props.productName" width="90" height="90" class="rounded-full w-[50px] h-[50px] md:w-[90px] md:h-[90px]" />
      <span v-else class="w-[90px] h-[90px] rounded-full" />
      <span class="flex flex-col gap-1.5 md:gap-2 w-fit">
        <h3 class="text-[#333333] text-[14px] md:text-[20px] truncate font-bold md:leading-[150%] tracking-[2%]"><span>{{ props.productName }}</span></h3>
        <UButton label="Remove" size="sm" variant="ghost" class="w-fit p-0 md:px-1" icon="i-lucide-trash" :ui="{ label: 'text-[#565252] text-[14px] md:text-[16px] font-normal', leadingIcon: 'text-[#999999]' }" @click="cartStore.removeFromCart(props.productId)" />
      </span>
    </div>

    <p>{{ props.customerReference }}</p>
    <!-- amount side -->
    <div>
      <p class="text-[#7F7C7C] text-[18px] font-normal">
        #{{ props.amount }}
      </p>
    </div>
  </div>
</template>
