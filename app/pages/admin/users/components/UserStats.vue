<script setup lang="ts">
defineProps<{
  total: number
  nonActive: number
  active: number
}>()
</script>

<template>
  <div class="my-4">
    <UPageGrid :ui="{ base: '' }" class="bg-[#FFFFFF] gap-4 rounded-xl grid-cols-3 md:grid-cols- lg:grid-cols-3">
      <div class="bg-[#F2FBFF] rounded-lg flex flex-col text-center justify-center items-center p-3">
        <h3 class="text-[#4D5155] font-bold text-[14px] md:text-[16px] tracking-[1%]">
          {{ total }}
        </h3>
        <h4 class="text-[#565252] text-[14px] md:text-[16px] md:tracking-[5%]">
          Total Users
        </h4>
      </div>
      <div class="bg-[#F2FBFF] rounded-lg flex flex-col text-center justify-center items-center p-3">
        <h3 class="text-[#4D5155] font-bold text-[14px] md:text-[16px]">
          {{ nonActive }}
        </h3>
        <h4 class="text-[#565252] text-[12px] md:text-[16px] md:tracking-[5%]">
          Non active users
        </h4>
      </div>
      <div class="bg-[#F2FBFF] rounded-lg flex flex-col text-center justify-center items-center p-3">
        <h3 class="text-[#4D5155] font-bold text-[14px] md:text-[16px]">
          {{ active }}
        </h3>
        <h4 class="text-[#565252] text-[12px] md:text-[16px] text-center md:tracking-[5%]">
          Total Users
        </h4>
      </div>
    </UPageGrid>
  </div>
</template>
