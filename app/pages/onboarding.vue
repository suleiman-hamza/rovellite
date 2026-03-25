<script setup lang="ts">
definePageMeta({
  layout: 'auth-layout',
})
</script>

<template>
  <section class="bg-[#1177FE] min-h-screen relative flex items-center justify-center">
    <NuxtImg src="/images/top-left.svg" class="absolute top-0 left-0" alt="ellipse top" />
    <NuxtImg src="/images/bottom-right.svg" class="absolute bottom-0 right-0" alt="ellipse bottom" />
    <div class="border font-poppins text-center flex flex-col gap-5 items-center justify-center">
      <div>
        <h3 class="font-bold text-2xl text-white leading-[38.17px]">
          Welcome To RovelSub Point
        </h3>
        <p class="text-[14px] text-white leading-[150%]">
          The home of data, airtime,  premium subscriptions, and easy bill payment.
        </p>
      </div>
      <div class="flex gap-4 items-center border border-white">
        <UButton label="Login" class="bg-white rounded-full px-8 text-[#1177FE] font-semibold tracking-[2%] leading-[150%]" />
        <UButton label="Register" class="bg-white rounded-full px-8 text-[#1177FE] font-semibold tracking-[2%] leading-[150%]" />
      </div>
    </div>
  </section>
</template>
