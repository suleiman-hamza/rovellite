<script setup lang="ts">
defineProps<{
  total: number
  successful: number
  processing: number
  failed: number
  pending: number
}>()
</script>

<template>
  <div class="my-4">
    <UPageGrid :ui="{ base: '' }" class="bg-[#FFFFFF] gap-4 rounded-xl grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5">
      <div class="bg-[#DBF4FF] rounded-lg flex flex-col text-center justify-center items-center p-3">
        <h3 class="text-[#4D5155] font-bold text-[14px] md:text-[16px] tracking-[1%]">
          {{ total }}
        </h3>
        <h4 class="text-[#565252] text-[14px] md:text-[16px] md:tracking-[5%]">
          Total
        </h4>
      </div>
      <div class="bg-[#DBF4FF] rounded-lg flex flex-col text-center justify-center items-center p-3">
        <h3 class="text-[#4D5155] font-bold text-[14px] md:text-[16px]">
          {{ successful }}
        </h3>
        <h4 class="text-[#565252] text-[12px] md:text-[16px] md:tracking-[5%]">
          Successful
        </h4>
      </div>
      <div class="bg-[#DBF4FF] rounded-lg flex flex-col text-center justify-center items-center p-3">
        <h3 class="text-[#4D5155] font-bold text-[14px] md:text-[16px]">
          {{ processing }}
        </h3>
        <h4 class="text-[#565252] text-[12px] md:text-[16px] text-center md:tracking-[5%]">
          Processing
        </h4>
      </div>
      <div class="bg-[#DBF4FF] rounded-lg flex flex-col text-center justify-center items-center p-3">
        <h3 class="text-[#4D5155] font-bold text-[14px] md:text-[16px]">
          {{ failed }}
        </h3>
        <h4 class="text-[#565252] text-[12px] md:text-[16px] text-center md:tracking-[5%]">
          Failed
        </h4>
      </div>
      <div class="bg-[#DBF4FF] rounded-lg flex flex-col text-center justify-center items-center p-3">
        <h3 class="text-[#4D5155] font-bold text-[14px] md:text-[16px]">
          {{ pending }}
        </h3>
        <h4 class="text-[#565252] text-[12px] md:text-[16px] text-center md:tracking-[5%]">
          Pending
        </h4>
      </div>
    </UPageGrid>
  </div>
</template>
