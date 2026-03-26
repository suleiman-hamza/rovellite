<script setup lang="ts">
</script>

<template>
  <footer class="bg-[#F2FBFF] text-[#34383D] font-poppins py-16 md:py-18">
    <section class="flex flex-col md:flex-row justify-start gap-6 mx-5 sm:mx-6 md:mx-8 lg:mx-19 2xl:mx-25">
      <div class="flex-1">
        <NuxtLink
          to="#"
          class="flex items-center justify-center size-fit mb-6"
          aria-describedby="Go to Home"
        >
          <NuxtImg
            loading="eager"
            src="/images/landing-page/rovel-new-logo.svg"
            alt="Rovelsub point header logo"
            class="w-auto h-10 md:h-16 object-contain"
          />
        </NuxtLink>
        <p class="text-[14px] lg:text-[16px] tracking-[1px] md:tracking-[5%] font-poppins leading-[161%] md:leading-[191%] max-w-80 mb-6">
          Access airtime, data, subscriptions, and pay bills in one platform. RovelSub Point is your trusted and secure digital service platform.
        </p>
        <span class="gap-4 items-center justify-start hidden md:flex">
          <NuxtImg src="/images/landing-page/facebook.svg" width="36" height="36" alt="facebook" />
          <NuxtImg src="/images/landing-page/twitter.svg" width="36" height="36" alt="twitter(X)" />
          <NuxtImg src="/images/landing-page/instagram.svg" width="36" height="36" alt="instagram" />
        </span>
      </div>

      <section class="text-[#34383D] md:flex gap-12 w-full flex-1">
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

      <div class="flex flex-col gap-5 flex-1">
        <h4 class="font-extrabold text-[16px] leading-[150%] tracking-[1%] text-[#34383D] text-left">
          Subscribe To Our News Letter
        </h4>
        <div class="relative rounded-full bg-white w-full max-w-87.5">
          <input type="text" class="relative p-3 focus:outline-none" placeholder="Enter Email">
          <button class="absolute text-[14px] md:text-[16px] right-0 top-0 w-37.5 h-full rounded-full bg-[#1177FE] text-white tracking-[10%] font-bold flex items-center justify-center">
            Get Started
          </button>
        </div>
        <span class="flex gap-4 items-center justify-start md:hidden">
          <NuxtImg src="/images/landing-page/facebook.svg" width="36" height="36" alt="facebook" />
          <NuxtImg src="/images/landing-page/twitter.svg" width="36" height="36" alt="twitter(X)" />
          <NuxtImg src="/images/landing-page/instagram.svg" width="36" height="36" alt="instagram" />
        </span>
      </div>
    </section>

    <UContainer class="">
      <div>
        <USeparator :ui="{ root: 'my-10' }" />
        <p class="text-muted text-sm text-center">
          Copyright © {{ new Date().getFullYear() }} All right reserve RovelSubPoint.com
        </p>
      </div>
    </UContainer>
  </footer>
</template>
