<script setup lang="ts">
definePageMeta({
  layout: 'auth-layout',
})
useSeoMeta({
  title: 'Forgot Password',
})
</script>

<template>
  <main class="grid grid-cols-1 md:grid-cols-2 min-h-full">
    <div>
      <div class="flex flex-col w-full max-w-md mx-auto my-auto px-5 py-4 border">
        <div class="flex justify-center md:justify-start">
          <NuxtImg
            loading="eager"
            src="/images/landing-page/rovel-new-logo.svg"
            width="100"
            height="100"
            alt="Rovelsub point header logo"
            class="w-30 object-contain size-fit mb-6"
          />
        </div>
        <h3 class="text-[#1177FE] tracking-[2%] leading-[150%] font-semibold text-[18px] mb-4">
          Forgot Password
        </h3>
      </div>
    </div>
    <div class="hidden bg-[#1177FE] h-full relative md:flex items-center justify-center p-4">
      <NuxtImg src="/images/top-left.svg" class="absolute top-0 left-0 z-1" alt="ellipse top" />
      <NuxtImg src="/images/bottom-right.svg" class="absolute bottom-0 right-0 z-0" alt="ellipse bottom" />
      <div class="font-poppins text-center flex flex-col gap-5 items-center justify-center">
        <NuxtImg src="/images/onboard-hero.png" width="403" height="451" alt="happy rovelsub user" />
        <div class="relative max-w-md">
          <span class="absolute -bottom-10 left-10">
            <NuxtImg src="/images/landing-page/lightbluediamondborder.svg" class="w-5 h-5 md:h-8 md:w-8" />
          </span>
          <h3 class="font-bold text-2xl text-white leading-[38.17px]">
            Welcome To RovelSub Point
          </h3>
          <p class="text-[14px] text-white leading-[150%]">
            The home of data, airtime,  premium subscriptions, and easy bill payment.
          </p>
        </div>
      </div>
    </div>
  </main>
</template>
