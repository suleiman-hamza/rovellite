<script setup lang="ts"></script>

<template>
  <UPageSection
    id="howitworks"
    headline="HOW DOES IT WORK"
    title="How It Works"
    class="relative"
    :ui="{ container: 'py-12 sm:py-18 lg:py-24', title: 'text-left text-[20px] sm:text-[52px] text-[#1A1F24] font-bold', headline: 'text-left size-fit text-[#1177FE] text-[12px] sm:text-[18px] mb-0' }"
  >
    <span class="absolute top-17 md:top-30 left-35 md:left-100">
      <NuxtImg src="/images/landing-page/polygon 7.svg" class="w-5 h-5 md:h-8 md:w-8" />
    </span>
    <div
      class="grid grid-cols-1 gap-y-6 md:grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] md:grid-rows-[auto_auto_auto_auto]"
    >
      <!-- first one -->
      <div
        class="md:col-start-1 md:col-end-7 row-[1/2]"
      >
        <UPageFeature class="bg-[#F2FBFF]">
          <template #default>
            <div class="p-4 flex gap-4 md:gap-6 items-start">
              <span class="bg-[#1177FE] w-10 md:w-18 h-10 md:h-18 text-[18px] md:text-[32px] text-white font-bold flex items-center justify-center rounded-sm">
                1
              </span>
              <div class="flex-1">
                <h4 class="text-[#4D5155] text-base sm:text-[22px] leading-[150%] tracking-[1%] font-bold">
                  SIGN UP
                </h4>
                <p class="text-[14px] text-[#34383D] leading-[161%] sm:leading-[190%] tracking-[1%] sm:tracking-[5%] font-normal">
                  Sign up in minutes by providing your basic details. Once registered, you gain full access to all our services on a secure and easy-to-use dashboard
                </p>
              </div>
            </div>
          </template>
        </UPageFeature>
      </div>
      <!-- second one -->
      <div
        class="md:col-start-7 md:col-end-13 row-[2/3]"
      >
        <UPageFeature class="bg-[#F2FBFF]">
          <template #default>
            <div class="p-4 flex gap-4 md:gap-6 items-start">
              <span class="bg-[#1177FE] w-10 md:w-18 h-10 md:h-18 text-[18px] md:text-[32px] text-white font-bold flex items-center justify-center rounded-sm">
                2
              </span>
              <div class="flex-1">
                <h4 class="text-[#4D5155] text-base sm:text-[22px] leading-[150%] tracking-[1%] font-bold">
                  Fund Your Wallet or Pay with Paystack
                </h4>
                <p class="text-[14px] text-[#34383D] leading-[161%] sm:leading-[190%] tracking-[1%] sm:tracking-[5%] font-normal">
                  Add money to your wallet using any of our available payment options for immediate transactions. You can also skip wallet funding and pay directly with Paystack i.e ATM Card, bank transfer etc.
                </p>
              </div>
            </div>
          </template>
        </UPageFeature>
      </div>
      <div
        class="md:col-start-1 md:col-end-7 row-[3/4]"
      >
        <UPageFeature class="bg-[#F2FBFF]">
          <template #default>
            <div class="p-4 flex gap-4 md:gap-6 items-start">
              <span class="bg-[#1177FE] w-10 md:w-18 h-10 md:h-18 text-[18px] md:text-[32px] text-white font-bold flex items-center justify-center rounded-sm">
                3
              </span>
              <div class="flex-1">
                <h4 class="text-[#4D5155] text-base sm:text-[22px] leading-[150%] tracking-[1%] font-bold">
                  SELECT A SERVICE
                </h4>
                <p class="text-[14px] text-[#34383D] leading-[161%] sm:leading-[190%] tracking-[1%] sm:tracking-[5%] font-normal">
                  Choose the service you need — data, airtime, electricity, TV subscription, betting, and more. Enter the required details and review your transaction before confirming.
                </p>
              </div>
            </div>
          </template>
        </UPageFeature>
      </div>
      <div
        class="md:col-start-7 md:col-end-13 row-[4/5]"
      >
        <UPageFeature class="bg-[#F2FBFF]">
          <template #default>
            <div class="p-4 flex gap-4 md:gap-6 items-start">
              <span class="bg-[#1177FE] w-10 md:w-18 h-10 md:h-18 text-[18px] md:text-[32px] text-white font-bold flex items-center justify-center rounded-sm">
                4
              </span>
              <div class="flex-1">
                <h4 class="text-[#4D5155] text-base sm:text-[22px] leading-[150%] tracking-[1%] font-bold">
                  ENJOY INSTANT DELIVERY
                </h4>
                <p class="text-[14px] text-[#34383D] leading-[161%] sm:leading-[190%] tracking-[1%] sm:tracking-[5%] font-normal">
                  Complete your payment and receive instant confirmation. Your service is delivered immediately, whether it’s data activation, airtime recharge, or electricity token.
                </p>
              </div>
            </div>
          </template>
        </UPageFeature>
      </div>
    </div>
  </UPageSection>
</template>
