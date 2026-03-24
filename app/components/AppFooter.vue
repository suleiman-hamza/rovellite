<script setup lang="ts">
</script>

<template>
  <UFooter class="bg-[#F2FBFF] text-[#34383D] font-poppins" :ui="{ container: 'py-8 lg:py-12 flex flex-col gap-6 md:gap-4 md:flex-row md:items-start lg:items-start md:justify-between md:gap-x-3', left: 'block mt-0 order-1', right: 'order-3 sm:flex-1 flex flex-col items-start gap-6', center: 'items-start justify-start order-2 mt-0 md:flex-1', bottom: 'pt-0 lg:pt-0' }">
    <template #left>
      <NuxtLink
        to="#"
        class="flex items-center justify-center size-fit mb-2"
        aria-describedby="Go to Home"
      >
        <NuxtImg
          loading="eager"
          src="/images/landing-page/header-logo.svg"
          alt="Rovelsub point header logo"
          class="w-auto h-10 md:h-16 object-contain"
        />
      </NuxtLink>
      <p class="text-[14px] lg:text-[16px] tracking-[1px] font-poppins leading-[161%] max-w-80">
        Access airtime, data, subscriptions, and pay bills in one platform. RovelSub Point is your trusted and secure digital service platform.
      </p>
    </template>

    <section class="text-[#34383D] md:flex gap-12 w-full">
      <div class="mb-4">
        <h4 class="font-extrabold text-[16px] lg:text-[24px] mb-2">
          Company
        </h4>
        <ul class="text-[14px] font-semibold flex flex-col gap-2">
          <li>Home</li>
          <li>Features</li>
          <li>Why Choose Us</li>
          <li>How it works</li>
        </ul>
      </div>
      <div>
        <h4 class="font-extrabold text-[16px] lg:text-[24px] mb-2">
          Support
        </h4>
        <ul class="text-[14px] font-semibold flex flex-col gap-2">
          <li>Help/FAQ</li>
          <li>Contact us</li>
        </ul>
      </div>
    </section>

    <template #right>
      <h4 class="font-extrabold text-[16px] text-[#34383D] text-left">
        Subscribe To Our News Letter
      </h4>
      <div class="relative rounded-full bg-white w-full max-w-87.5">
        <input type="text" class="relative p-3 focus:outline-none" placeholder="Enter Email">
        <button class="absolute text-[14px] md:text-[16px] right-0 top-0 w-37.5 h-full rounded-full bg-[#1177FE] text-white tracking-[10%] font-bold flex items-center justify-center">
          Get Started
        </button>
        <!-- <UFieldGroup :ui="{ base: 'rounded-full' }">
          <UInput
            placeholder="Enter Email"
            class="border-none"
            variant="ghost"
            size="lg"
            :ui="{ base: 'rounded-full bg-white' }"
          />

          <UButton label="Get Started" size="lg" class="" />
        </UFieldGroup> -->
      </div>
    </template>

    <template #bottom>
      <UContainer>
        <div>
          <span class="flex gap-4 items-center justify-start">
            <NuxtImg src="/images/landing-page/facebook.svg" width="36" height="36" alt="facebook" />
            <NuxtImg src="/images/landing-page/twitter.svg" width="36" height="36" alt="twitter(X)" />
            <NuxtImg src="/images/landing-page/instagram.svg" width="36" height="36" alt="instagram" />
          </span>
          <USeparator :ui="{ root: 'my-6' }" />
          <p class="text-muted text-sm text-center">
            Copyright © {{ new Date().getFullYear() }} All right reserve RovelSubPoint.com
          </p>
        </div>
      </UContainer>
    </template>
  </UFooter>
</template>
