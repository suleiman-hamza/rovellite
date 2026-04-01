<script setup lang="ts">
const cards = ref([
  {
    title: 'Wallet Balance',
    icon: '/images/icons/wallet-ballance.svg',
  },
  {
    title: 'Wallet In',
    icon: '/images/icons/wallet-in.svg',
  },
  {
    title: 'Wallet Out',
    icon: '/images/icons/wallet-out.svg',
  },
])
const cards2 = ref([
  {
    title: '#20,000',
  },
  {
    title: '0',
  },
  {
    title: 'ref-code',
  },
])
</script>

<template>
  <main class="">
    <section class="bg-white rounded-lg">
      <UPageGrid class="bg-[#1177FE] p-4 md:px-6 rounded-lg gap-4">
        <UPageCard
          v-for="(card, index) in cards"
          :key="index"
          :ui="{ container: 'p-0 sm:p-0' }"
        >
          <template #default>
            <div class="bg-white p-4 rounded-lg">
              <div class="flex gap-1 items-center">
                <span class="bg-[#1177FE] p-2">
                  <NuxtImg :src="card.icon" :alt="card.title" class="w-10 h-10" />
                </span>
                <div class="border">
                  <h3 class="text-[14px] text-[#1177FE] font-medium">
                    {{ card.title }}
                  </h3>
                  <p class="text-[20px] font-bold">
                    N0.00
                  </p>
                </div>
              </div>
            </div>
          </template>
        </UPageCard>
      </UPageGrid>
      <div class="flex items-center justify-between p-4 sm:px-6">
        <p>You do not have a wallet</p>
        <UButton label="Create Wallet" size="md" :ui="{ label: 'text-white text-[18px] md:text-[24px]' }" />
      </div>
    </section>

    <section class="mt-4 rounded-lg">
      <UPageGrid :ui="{ base: '' }" class="bg-[#FFFFFF] p-4 sm:px-6 gap-4 rounded-lg">
        <div class="bg-[#F2FBFF] rounded-lg flex flex-col justify-center items-center p-4">
          <h3>#20,000</h3>
          <h4>Referal Bonus</h4>
        </div>
        <div class="bg-[#F2FBFF] rounded-lg flex flex-col justify-center items-center p-4">
          <h3>0</h3>
          <h4>Total Referrals</h4>
        </div>
        <div class="bg-[#F2FBFF] rounded-lg flex flex-col justify-center items-center p-4">
          <h3>vvshsiahehk;ssio</h3>
          <h4>Referral Code</h4>
        </div>
      </UPageGrid>
    </section>
  </main>
</template>
