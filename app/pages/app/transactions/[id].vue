<script setup lang="ts">
definePageMeta({
  title: 'Transactions Details',
  layout: 'dashboard-layout',
  middleware: 'auth',
  keepalive: true,
})

const route = useRoute()

const transactionId = route.params.id
</script>

<template>
  <main class="bg-white rounded-[20px] h-full px-5 py-6 md:p-8">
    <div class="text-center mb-8">
      <h2 class="text-[#565252] font-bold text-[18px] md:text-[24px] md:leading-[30px]">
        Transaction ID: {{ transactionId }}
      </h2>
      <p class="text-[#34383D] font-normal tracking-[2%] md:leading-[150%] text-[18px] md:text-[20px]">
        Know What You Paid For, Share, Download and Print Easily
      </p>
    </div>
    <div class="border border-[#DBF4FF] px-8 py-7">
      <div class="bg-secondary p-4">
        <h4 class="font-semibold md:font-bold text-[14px] md:text-[20px] text-[#34383D] tracking-[1%] md:tracking-[2%] md:leading-[150%]">
          Transaction Summary
        </h4>
      </div>
    </div>
  </main>
</template>
