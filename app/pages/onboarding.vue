<script setup lang="ts">
useSeoMeta({ title: 'OnBoarding - RovelSub Point' })
definePageMeta({
  layout: 'auth-layout',
  middleware: 'guest',
})
</script>

<template>
  <section class="bg-[#1177FE] min-h-screen relative flex items-center justify-center p-4">
    <NuxtImg src="/images/top-left.svg" class="absolute top-0 left-0 z-1" alt="ellipse top" />
    <NuxtImg src="/images/bottom-right.svg" class="absolute bottom-0 right-0 z-0" alt="ellipse bottom" />
    <div class="relative z-100 font-poppins text-center flex flex-col gap-0 items-center justify-center">
      <NuxtImg src="/images/onboard-hero.png" width="403" height="451" alt="happy rovelsub user" />
      <div class="relative mb-11">
        <span class="absolute -bottom-8 left-10">
          <NuxtImg src="/images/landing-page/lightbluediamondborder.svg" class="w-5 h-5 md:h-8 md:w-8" />
        </span>
        <h3 class="font-bold text-2xl text-white leading-[38.17px]">
          Welcome To RovelSub Point
        </h3>
        <p class="text-[12px] text-white leading-[150%]">
          The home of data, airtime,  premium subscriptions, and easy bill payment.
        </p>
      </div>
      <div class="flex items-center border-white w-full justify-center mb-4">
        <UButton label="Register" to="/register" class="flex-1 w-full max-w-75 justify-center bg-white items-center rounded-full text-[#1177FE] font-semibold tracking-[2%] leading-[150%]" />
      </div>
      <p class="text-white text-[18px]">
        Already have an  account? <NuxtLink to="/login" class="text-white underline">
          Sign In
        </NuxtLink>
      </p>
    </div>
  </section>
</template>
