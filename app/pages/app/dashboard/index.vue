<script setup lang="ts">
import { useProfileStore } from '@/stores/profile'

const profileStore = useProfileStore()

definePageMeta({
  middleware: ['auth'],
})

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

const accountNumber = ref('1234567890')

async function createWallet() {
  try {
    const response = await $fetch('/api/virtual-account/create', {
      method: 'POST',
      body: {
        userId: profileStore.userProfile?.user_id,
      },
    })
    if (!response.success) {
      console.error('Error creating wallet:', response.message)
    }
    else {
      console.warn('Wallet created successfully')
    }
  }
  catch (error) {
    console.error('Error creating wallet:', error)
  }
}
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
              <div class="flex gap-2 items-center">
                <span class="bg-[#1177FE] p-2.5 rounded-sm">
                  <NuxtImg :src="card.icon" :alt="card.title" class="w-8 h-8" />
                </span>
                <div class="">
                  <p class="text-[20px] font-bold text-[#4D5155]">
                    N0.00
                  </p>
                  <h3 class="text-[14px] md:text-[18px] tracking-[2%] md:tracking-[10%] text-[#676A6D] font-medium">
                    {{ card.title }}
                  </h3>
                </div>
              </div>
            </div>
          </template>
        </UPageCard>
      </UPageGrid>
      <!-- show create wallet option for users without a wallet -->

      <div class="flex md:flex-row flex-col items-center justify-between p-4 sm:px-6">
        <p class="font-bold text-[18px] md:text-[24px]">
          You do not have a wallet
        </p>
        <UButton label="Create Wallet" size="lg" :ui="{ label: 'text-white text-[16px] md:text-[20px]', base: 'bg-[#1177FE] px-6' }" @click="createWallet" />
      </div>

      <!-- show palmpay wallet for users with a wallet -->
      <div class="flex md:flex-row flex-col gap-4 md:gap-0 items-center justify-between p-4 sm:px-6">
        <div class="flex flex-col gap-3 text-center">
          <div class="flex gap-2 md:gap-3 items-center font-bold text-[18px] md:text-[24px]">
            <NuxtImg src="/images/icons/palmpay-wallet.svg" alt="palmpay wallet" class="w-8 h-8" />
            <h3>Palmpay</h3>
            <USeparator orientation="vertical" class="h-4" />
            <span>{{ accountNumber }}</span>
          </div>
          <p class="tracking-[2%] text-[#3A3A3A] leading-[150%] font-normal">
            Transfer to Fund wallet. #50 charge applies {{ profileStore.userProfile?.email }}
          </p>
        </div>
        <UButton label="Copy" size="lg" :ui="{ label: 'text-white text-[16px] md:text-[20px]', base: 'bg-[#1177FE] px-6' }" />
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

    <section class="mt-4 rounded-lg">
      <UPageGrid :ui="{ base: '' }" class="bg-[#FFFFFF] p-4 sm:px-6 gap-4 rounded-lg md:grid-cols-4 lg:grid-cols-5">
        <div v-for="(_, index) in 10" :key="index" class="border border-[#DBF4FF] rounded-lg flex flex-col justify-center items-center p-4">
          <span class="bg-[#DBF4FF] p-2 px-4 rounded-lg">
            <NuxtImg src="/images/icons/airtime.svg" alt="come svg for pool" class="w-10 h-10" />
          </span>
          <h4 class="tracking-[5%] text-[16px] text-[#676A6D] font-normal">
            Referal Bonus
          </h4>
        </div>
      </UPageGrid>
    </section>
  </main>
</template>
