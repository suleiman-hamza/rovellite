<script setup lang="ts">
defineProps<{
  total: number
  deactivated: number
  active: number
  newAccounts: number
  deleted: number
}>()
</script>

<template>
  <div class="my-4">
    <UPageGrid :ui="{ base: '' }" class="bg-[#FFFFFF] gap-3 sm:gap-4 rounded-xl grid-cols-3 md:grid-cols-3 lg:grid-cols-5">
      <div class="bg-[#DBF4FF] rounded-lg flex flex-col text-center justify-center items-center p-3">
        <h3 class="text-[#4D5155] font-bold text-[14px] md:text-[16px] tracking-[1%]">
          {{ total }}
        </h3>
        <h4 class="text-[#565252] text-[12px] md:text-[16px] md:tracking-[5%]">
          Total Account
        </h4>
      </div>
      <div class="bg-[#DBF4FF] rounded-lg flex flex-col text-center justify-center items-center p-3">
        <h3 class="text-[#4D5155] font-bold text-[14px] md:text-[16px]">
          {{ deactivated }}
        </h3>
        <h4 class="text-[#565252] text-[12px] md:text-[16px] md:tracking-[5%]">
          Deactivated
        </h4>
      </div>
      <div class="bg-[#DBF4FF] rounded-lg flex flex-col text-center justify-center items-center p-3">
        <h3 class="text-[#4D5155] font-bold text-[14px] md:text-[16px]">
          {{ active }}
        </h3>
        <h4 class="text-[#565252] text-[12px] md:text-[16px] text-center md:tracking-[5%]">
          Active
        </h4>
      </div>
      <div class="bg-[#DBF4FF] rounded-lg flex flex-col text-center justify-center items-center p-3">
        <h3 class="text-[#4D5155] font-bold text-[14px] md:text-[16px]">
          {{ newAccounts }}
        </h3>
        <h4 class="text-[#565252] text-[12px] md:text-[16px] text-center md:tracking-[5%]">
          New Accounts
        </h4>
      </div>
      <div class="bg-[#DBF4FF] rounded-lg flex flex-col text-center justify-center items-center p-3">
        <h3 class="text-[#4D5155] font-bold text-[14px] md:text-[16px]">
          {{ deleted }}
        </h3>
        <h4 class="text-[#565252] text-[12px] md:text-[16px] text-center md:tracking-[5%]">
          Deleted Accounts
        </h4>
      </div>
    </UPageGrid>
  </div>
</template>
