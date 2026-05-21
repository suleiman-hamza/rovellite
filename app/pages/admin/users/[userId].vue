<script setup lang="ts">
const items = ref(['Account Activated', 'Account Deactivated'])
const value = ref('Account Activated')
</script>

<template>
  <main class="">
    <section class="bg-white  flex justify-between gap-4 mb-4">
      <div class="flex items-center gap-5 border">
        <div class="w-16 h-16 md:w-20 md:h-20 border rounded-full bg-gray-200" />
        <div>
          <p class="text-[18px] font-bold text-[#4D5155]">
            John Doe
          </p>
          <p class="text-[14px] text-[#676A6D]">
            john.doe@example.com
          </p>
          <p class="text-[14px] text-[#676A6D]">
            +234567890909
          </p>
          <p class="text-[14px] text-[#676A6D]">
            Active
          </p>
        </div>
      </div>
      <div class="">
        <USelect v-model="value" size="xl" :items="items" />
      </div>
    </section>
    <section class="bg-[#1177FE]">
      <UPageGrid class="p-5 rounded-[20px] gap-4">
        <UPageCard
          class="bg-white rounded-[20px] px-2 py-3.5"
          :ui="{ container: 'p-0 sm:p-0 rounded-[20px]' }"
        >
          <template #default>
            <div class="rounded-[20px]">
              <div class="flex gap-2 items-center relative">
                <span class="p-2.5 rounded-[8px]">
                  <NuxtImg src="/images/cart-empty.svg" alt="alt text here" class="w-8 h-8" />
                </span>
                <div class="truncate">
                  <p class="text-[20px] font-bold text-[#4D5155]">
                    0
                  </p>
                  <h3 class="text-[14px] md:text-[16px] lg:text-[18px] tracking-[2%] md:tracking-[10%] text-[#676A6D] font-medium">
                    No Wallet
                  </h3>
                </div>
              </div>
            </div>
          </template>
        </UPageCard>
        <UPageCard
          class="bg-white rounded-[20px] px-2 py-3.5"
          :ui="{ container: 'p-0 sm:p-0 rounded-[20px]' }"
        >
          <template #default>
            <div class="rounded-[20px]">
              <div class="flex gap-2 items-center relative">
                <span class="p-2.5 rounded-[8px]">
                  <NuxtImg src="/images/cart-empty.svg" alt="alt text here" class="w-8 h-8" />
                </span>
                <div class="truncate">
                  <p class="text-[20px] font-bold text-[#4D5155]">
                    0
                  </p>
                  <h3 class="text-[14px] md:text-[16px] lg:text-[18px] tracking-[2%] md:tracking-[10%] text-[#676A6D] font-medium">
                    No Wallet
                  </h3>
                </div>
              </div>
            </div>
          </template>
        </UPageCard>
        <UPageCard
          class="bg-white rounded-[20px] px-2 py-3.5"
          :ui="{ container: 'p-0 sm:p-0 rounded-[20px]' }"
        >
          <template #default>
            <div class="rounded-[20px]">
              <div class="flex gap-2 items-center relative">
                <span class="p-2.5 rounded-[8px]">
                  <NuxtImg src="/images/cart-empty.svg" alt="alt text here" class="w-8 h-8" />
                </span>
                <div class="truncate">
                  <p class="text-[20px] font-bold text-[#4D5155]">
                    0
                  </p>
                  <h3 class="text-[14px] md:text-[16px] lg:text-[18px] tracking-[2%] md:tracking-[10%] text-[#676A6D] font-medium">
                    No Wallet
                  </h3>
                </div>
              </div>
            </div>
          </template>
        </UPageCard>
      </UPageGrid>
      <div class="p-4 sm:px-6 text-white border">
        <div class="flex justify-between items-start md:gap-3 border">
          <div class="flex gap-1.5 md:gap-3 items-center font-bold text-[16px] md:text-[24px] mb-2 border">
            <NuxtImg src="/images/icons/palmpay-wallet.svg" alt="palmpay wallet" class="w-5.5 h-5.5 md:w-8 md:h-8" />
            <h3 class="text-[16px] md:text-[18px] tracking-[1%]">
              Palmpay
            </h3>
            <span class="tracking-[1%]">0450987873</span>
          </div>
          <UButton size="lg" class="text-[12px] md:text-[20px] md:font-bold hover:bg-secondary" :ui="{ base: 'text-[#1177FE] bg-white w-20 h-7 md:w-40 md:h-15 flex items-center justify-center rounded-[8px] sm:rounded-[12px]' }">
            SOMETHING
          </UButton>
        </div>
        <p class="tracking-[2%] text-[12px] md:text-[20px] leading-[150%] font-normal">
          Transfer to Fund wallet. #50 charge applies
        </p>
      </div>
    </section>
  </main>
</template>
