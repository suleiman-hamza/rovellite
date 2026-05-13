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
      <h2 class="text-[#565252] font-bold text-[18px] md:text-[24px] md:leading-7.5">
        Transaction ID: {{ transactionId }}
      </h2>
      <p class="text-[#34383D] font-normal tracking-[2%] md:leading-[150%] text-[18px] md:text-[20px]">
        Know What You Paid For, Share, Download and Print Easily
      </p>
    </div>
    <div class="border border-[#DBF4FF] p-2.5 md:px-8 md:py-7 rounded-[12px]">
      <div class="bg-[#DBF4FF] p-4 rounded-[14px] md:rounded-[20px] flex flex-col md:flex-row justify-between gap-4">
        <div class="text-[14px] md:text-[18px] font-normal tracking-[1%] text-[#34383D]">
          <h4 class="font-semibold md:font-bold text-[14px] md:text-[20px] text-[#34383D] tracking-[1%] md:tracking-[2%] md:leading-[150%] mb-2 md:mb-2.5">
            Transaction Summary
          </h4>
          <p>Transaction ID: TXN128392</p>
          <p>Date: May 20, 2025</p>
          <p>Total Amount: ₦10,500</p>
          <p>Payment Method: Wallet</p>
          <p>Number of Products: 3</p>
          <p>Status: Successful</p>
        </div>
        <div class="bg-white flex justify-between gap-1 rounded-[12px] p-4 md:p-2 md:px-5 text-[14px] size-fit self-end md:gap-2.5">
          <span class="p-1 flex flex-col items-center gap-1 flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" d="m21 12l-7-7v4C7 10 4 15 3 20c2.5-3.5 6-5.1 11-5.1V19z" /></svg>
            <span>Share</span>
          </span>
          <span class="p-1 flex flex-col items-center gap-1 flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M18.22 20.75H5.78A2.64 2.64 0 0 1 3.25 18v-3a.75.75 0 0 1 1.5 0v3a1.16 1.16 0 0 0 1 1.25h12.47a1.16 1.16 0 0 0 1-1.25v-3a.75.75 0 0 1 1.5 0v3a2.64 2.64 0 0 1-2.5 2.75" /><path fill="currentColor" d="M12 15.75a.74.74 0 0 1-.53-.22l-4-4a.75.75 0 0 1 1.06-1.06L12 13.94l3.47-3.47a.75.75 0 0 1 1.06 1.06l-4 4a.74.74 0 0 1-.53.22" /><path fill="currentColor" d="M12 15.75a.76.76 0 0 1-.75-.75V4a.75.75 0 0 1 1.5 0v11a.76.76 0 0 1-.75.75" /></svg>
            <span>Download</span>
          </span>
          <span class="p-1 flex flex-col items-center gap-1 flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M15.753 3a2.25 2.25 0 0 1 2.25 2.25l-.001.753h.75a3.254 3.254 0 0 1 3.252 3.25l.003 5.997a2.25 2.25 0 0 1-2.248 2.25H18v1.25A2.25 2.25 0 0 1 15.75 21h-7.5A2.25 2.25 0 0 1 6 18.75V17.5H4.25A2.25 2.25 0 0 1 2 15.25V9.254a3.25 3.25 0 0 1 3.25-3.25l.749-.001L6 5.25A2.25 2.25 0 0 1 8.25 3zm-.003 10.5h-7.5a.75.75 0 0 0-.75.75v4.5c0 .414.336.75.75.75h7.5a.75.75 0 0 0 .75-.75v-4.5a.75.75 0 0 0-.75-.75m3.002-5.996H5.25a1.75 1.75 0 0 0-1.75 1.75v5.996c0 .414.336.75.75.75H6v-1.75A2.25 2.25 0 0 1 8.25 12h7.5A2.25 2.25 0 0 1 18 14.25V16h1.783a.75.75 0 0 0 .724-.749l-.003-5.997a1.754 1.754 0 0 0-1.752-1.75m-3-3.004H8.25a.75.75 0 0 0-.75.75l-.001.753h9.003V5.25a.75.75 0 0 0-.75-.75" /></svg>
            <span>Print</span>
          </span>
        </div>
      </div>
    </div>
    <div class="flex justify-between gap-4 mt-6 bg-[#DBF4FF] text-[14px] md:text-[18px] font-normal p-3">
      <span>Total Products</span>
      <span>3</span>
    </div>
  </main>
</template>
