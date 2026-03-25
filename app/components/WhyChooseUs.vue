<script setup lang="ts">
</script>

<template>
  <section id="whychooseus" class="bg-[#F2FBFF] py-8 sm:py-12 font-poppins relative">
    <section class="mx-5 sm:mx-6 md:mx-8 lg:mx-19 2xl:mx-25">
      <span class="absolute w-8 h-8 md:w-13.75 md:h-13.75 top-5 right-5 bg-[#C4ECFE] rounded-full block" />
      <div class="flex flex-col md:grid gap-4 md:grid-cols-3 md:grid-rows-[50px_50px_50px_50px_50px_50px_50px_50px_50px_50px_50px_50px_50px] lg:grid-rows-[50px_50px_50px_50px_30px_30px_50px_50px_50px_50px_50px]">
        <div class="col-start-1 col-end-3 row-start-1">
          <h4 class="flex gap-3 items-center text-left font-bold  size-fit text-[#1177FE] text-[12px] sm:text-[18px]">
            CHOOSE US
            <span class="size-fit">
              <NuxtImg src="/images/landing-page/lightbluediamondborder.svg" class="w-5 h-5" />
            </span>
          </h4>
          <h4 class="text-left text-[20px] sm:text-[52px] text-[#1A1F24] tracking-[2px] font-extrabold">
            Why Choose Us?
          </h4>
        </div>
        <div class="col-start-1 row-start-3 row-end-8">
          <div class="border-l-8 border-[#1177FE] bg-white p-4 rounded-md">
            <h2 class="mb-2 text-[#4D5155] font-extrabold sm:text-[24px]">
              INSTANT TRANSACTIONS
            </h2>
            <p class="text-[#34383D]">
              Enjoy quick processing and real-time confirmation on all payments. Our platform is optimized for speed so you can complete transactions in seconds without unnecessary delays.
            </p>
          </div>
        </div>
        <div class="row-start-9 lg:row-start-8 row-end-12 col-start-1">
          <div class="border-l-8 border-[#1177FE] bg-white p-4 rounded-md">
            <h2 class="mb-2 text-[#4D5155] font-extrabold sm:text-[24px]">
              SECURE AND RELIABLE
            </h2>
            <p class="text-[#34383D]">
              Your security is our priority. We use safe and trusted payment systems to ensure every transaction is protected, giving you peace of mind every time you use our services.
            </p>
          </div>
        </div>

        <div class="row-start-3 row-end-8 col-start-2 col-end-3 flex flex-col gap-4 items-center p-4">
          <NuxtImg src="/images/landing-page/grid-avatar-group.png" class="w-full h-auto" />
          <UButton label="Get Started" size="lg" class="bg-[#1177FE] rounded-full px-8" />
        </div>

        <div class="col-start-3 row-start-1 row-end-6">
          <div class="border-l-8 border-[#1177FE] bg-white p-4 rounded-md">
            <h2 class="mb-2 text-[#4D5155] font-extrabold sm:text-[24px]">
              ALL SERVICE IN ONE PLATFORM
            </h2>
            <p class="text-[#34383D]">
              From data and airtime to electricity, subscriptions, and more, everything you need is available on a single, easy-to-use platform designed for convenience.
            </p>
          </div>
        </div>
        <div class="col-start-3 lg:row-start-5 row-start-6 row-end-11">
          <div class="border-l-8 border-[#1177FE] bg-white p-4 rounded-md">
            <h2 class="mb-2 text-[#4D5155] font-extrabold sm:text-[24px]">
              YOU CAN EARN AND GROW
            </h2>
            <p class="text-[#34383D]">
              Become an agent and unlock earning opportunities with every transaction. Our system is built to help individuals and businesses grow while serving customers efficiently.
            </p>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>
