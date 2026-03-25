<script setup lang="ts"></script>

<template>
  <section
    id="howitworks"
    class="relative py-15 md:py-25 mx-5 sm:mx-6 md:mx-8 lg:mx-19 2xl:mx-25"
  >
    <section>
      <h4 class="text-left size-fit text-[#1177FE] text-[12px] sm:text-[18px] md:mb-1">
        HOW DOES IT WORK
      </h4>
      <h4 class="text-left text-[20px] tracking-[1%] sm:text-[52px] text-[#1A1F24] font-bold">
        How It Works
      </h4>
      <span class="absolute top-17 md:top-30 left-35 md:left-100">
        <NuxtImg src="/images/landing-page/lightbluediamondborder.svg" class="w-5 h-5 md:h-8 md:w-8" />
      </span>
      <div
        class="grid grid-cols-1 gap-y-6 md:grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] md:grid-rows-[auto_auto_auto_auto_auto_auto_auto_auto_auto] mt-8 md:mt-15"
      >
        <div class="hidden md:block border-t border-r border-dashed w-full h-full self-end col-span-4 col-start-6 row-start-2 row-end-4" />
        <div class="hidden md:block border-t border-l border-dashed w-full h-full self-end col-span-4 col-start-4 row-start-4 row-end-6" />
        <div class="hidden md:block border-t border-r border-dashed w-full h-full self-end col-span-4 col-start-6 row-start-6 row-end-8" />
        <!-- first one -->
        <div
          class="md:col-start-1 md:col-end-7 row-[1/3]"
        >
          <UPageFeature class="bg-[#F2FBFF]">
            <template #default>
              <div class="p-4 md:p-6 pt-5 md:pt-7 h-58 md:h-56 flex gap-4 md:gap-6 items-start">
                <span class="bg-[#1177FE] w-12 md:w-18 lg:w-22 h-12 md:h-18 lg:h-22 text-[18px] md:text-[32px] text-white font-bold flex items-center justify-center rounded-sm">
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
          class="md:col-start-7 md:col-end-13 row-[3/5]"
        >
          <UPageFeature class="bg-[#F2FBFF]">
            <template #default>
              <div class="p-4 md:p-6 pt-5 md:pt-7 h-58 md:h-56 flex gap-4 md:gap-6 items-start">
                <span class="bg-[#1177FE] w-12 md:w-18 lg:w-22 h-12 md:h-18 lg:h-22 text-[18px] md:text-[32px] text-white font-bold flex items-center justify-center rounded-sm">
                  2
                </span>
                <div class="flex-1">
                  <h4 class="text-[#4D5155] text-[16px] sm:text-[22px] leading-[150%] tracking-[1%] font-bold">
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
          class="md:col-start-1 md:col-end-7 row-[5/7]"
        >
          <UPageFeature class="bg-[#F2FBFF]">
            <template #default>
              <div class="p-4 md:p-6 pt-5 md:pt-7 h-58 md:h-56 flex gap-4 md:gap-6 items-start">
                <span class="bg-[#1177FE] w-12 md:w-18 lg:w-22 h-12 md:h-18 lg:h-22 text-[18px] md:text-[32px] text-white font-bold flex items-center justify-center rounded-sm">
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
          class="md:col-start-7 md:col-end-13 row-[7/9]"
        >
          <UPageFeature class="bg-[#F2FBFF]">
            <template #default>
              <div class="p-4 md:p-6 pt-5 md:pt-7 h-58 md:h-56 flex gap-4 md:gap-6 items-start">
                <span class="bg-[#1177FE] w-12 md:w-18 lg:w-22 h-12 md:h-18 lg:h-22 text-[18px] md:text-[32px] text-white font-bold flex items-center justify-center rounded-sm">
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
    </section>
  </section>
</template>
