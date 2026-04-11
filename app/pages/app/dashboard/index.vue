<script setup lang="ts">
import type { VirtualAccountResponse } from '@@/types/palmpay'
import { useClipboard } from '@vueuse/core'

import { useProfileStore } from '@/stores/profile'

const store = useProfileStore()

definePageMeta({
  middleware: ['auth'],
})

const items = [{
  label: 'Gift cards',
  icon: '/images/dashboard/giftcard.svg',
  to: '/app/giftCards',
}, {
  label: 'Data/Internet',
  icon: '/images/dashboard/data.svg',
  to: '/app/dataInternet',
}, {
  label: 'Airtime',
  icon: '/images/dashboard/airtime.svg',
  to: '/app/airtime',
}, {
  label: 'TV/Decoders',
  icon: '/images/dashboard/tv-decoder.svg',
  to: '/app/tvDecoders',
}, {
  label: 'Electricity',
  icon: '/images/dashboard/electricity.svg',
  to: '/app/electricity',
}, {
  label: 'Education',
  icon: '/images/dashboard/education.svg',
  to: '/app/education',
}, {
  label: 'Transportation',
  icon: 'images/dashboard/airtime.svg',
  to: '/app/transportation',
}, {
  label: 'Solar System',
  icon: '/images/dashboard/solar.svg',
  to: '/app/solarSystem',
}, {
  label: 'Withdraw Referral Earning',
  icon: '/images/dashboard/referral.svg',
  to: '',
}]

const virtualAccountDetails = ref<VirtualAccountResponse | null>(null)

const { data: VA, status, error: VAerror } = await useAsyncData(
  'virtual-account',
  () => $fetch(`/api/virtual-account/${store.userProfile?.user_id}`),
)

if (VAerror.value) {
  console.error('Error fetching virtual account:', VAerror.value)
}
else {
  virtualAccountDetails.value = VA.value as VirtualAccountResponse
}

// what to copy to clipboard, in this case, the user's virtual account number
const source = virtualAccountDetails.value?.data?.virtual_account_no || ''
const { copy, copied } = useClipboard({ source, copiedDuring: 3000 })

const refferalCode = ref('vvshsiahehk;ssio')
const { copy: copyReferralCode, copied: copiedReferralCode } = useClipboard({ source: refferalCode, copiedDuring: 3000 })
const loading = ref(false)

async function createWallet() {
  loading.value = true
  try {
    const response = await $fetch('/api/virtual-account/create', {
      method: 'POST',
      body: {
        userId: store.userProfile?.user_id,
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
  finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="">
    <section class="bg-white rounded-lg">
      <Wallet />
      <div v-if="status === 'pending'" class="flex items-center gap-4 border">
        <USkeleton class="size-12 rounded-full" />

        <div class="grid gap-2">
          <USkeleton class="h-4 w-62" />
          <USkeleton class="h-4 w-62" />
        </div>
      </div>
      <!-- show palmpay wallet for users with a wallet -->
      <div v-else-if="status === 'success' && virtualAccountDetails?.success" class="p-4 sm:px-6">
        <div class="flex justify-between items-start md:gap-3">
          <div class="flex gap-1.5 md:gap-3 items-center font-bold text-[16px] md:text-[24px] mb-2">
            <NuxtImg src="/images/icons/palmpay-wallet.svg" alt="palmpay wallet" class="w-5.5 h-5.5 md:w-8 md:h-8" />
            <h3 class="text-[16px] md:text-[18px] text-[#01060C] tracking-[1%]">
              Palmpay
            </h3>
            <USeparator orientation="vertical" class="hidden md:inline h-4" />
            <span class="text-[#01060C] tracking-[1%]">{{ virtualAccountDetails?.data?.virtual_account_no }}</span>
          </div>
          <UButton size="lg" class="text-white text-[12px] md:text-[20px] md:font-bold" :ui="{ base: 'bg-[#1177FE] w-20 h-7 md:w-40 h-15 flex items-center justify-center rounded-[8px] sm:rounded-[12px]' }" @click="copy(source)">
            <span v-if="!copied">Copy</span>
            <span v-else>Copied!</span>
          </UButton>
        </div>
        <p class="tracking-[2%] text-[#3A3A3A] text-[12px] md:text-[20px] leading-[150%] font-normal">
          Transfer to Fund wallet. #50 charge applies
        </p>
        <!-- <p>{{ virtualAccountDetails?.data }}</p> -->
      </div>

      <!-- show create wallet option for users without a wallet -->
      <div v-else class="flex md:flex-row flex-col items-center justify-between p-4 sm:px-6">
        <p class="font-bold text-[18px] md:text-[24px] mb-2">
          You do not have a wallet
        </p>
        <UButton :loading :disabled="loading" size="lg" class="text-white text-[16px] md:text-[20px]" :ui="{ label: '', base: 'bg-[#1177FE] px-6' }" @click="createWallet">
          <span v-if="loading">Processing</span>
          <span v-else>Create Wallet</span>
        </UButton>
      </div>
    </section>

    <section class="mt-4 rounded-lg">
      <UPageGrid :ui="{ base: '' }" class="bg-[#FFFFFF] py-5 px-3 sm:px-6 sm:py-4.5 md:px-10 gap-4 rounded-xl grid-cols-2 md:grid-cols-3">
        <div class="col-span-2 md:col-span-1 bg-[#F2FBFF] rounded-xl flex justify-between p-4">
          <div>
            <h3 class="text-[#4D5155] font-bold text-[14px] md:text-[16px] tracking-[1%]">
              vvshsiahehk;ssio
            </h3>
            <h4 class="text-[#565252] text-[14px] md:text-[16px] md:tracking-[5%]">
              Referral Code
            </h4>
          </div>
          <button
            class="bg-[#C4ECFE] p-1 px-2 rounded-sm h-fit text-[14px]" @click="copyReferralCode(refferalCode)"
          >
            <span v-if="!copiedReferralCode">Copy</span>
            <span v-else>Copied!</span>
          </button>
        </div>
        <div class="bg-[#F2FBFF] rounded-lg flex flex-col justify-center items-center p-4">
          <h3 class="text-[#4D5155] font-bold text-[14px] md:text-[16px]">
            #20,000
          </h3>
          <h4 class="text-[#565252] text-[14px] md:text-[16px] md:tracking-[5%]">
            Referal Bonus
          </h4>
        </div>
        <div class="bg-[#F2FBFF] rounded-lg flex flex-col text-center justify-center items-center p-4">
          <h3 class="text-[#4D5155] font-bold text-[14px] md:text-[16px]">
            0
          </h3>
          <h4 class="text-[#565252] text-[14px] md:text-[16px] text-center md:tracking-[5%]">
            Total Referrals
          </h4>
        </div>
      </UPageGrid>
    </section>

    <section class="mt-4 rounded-[20px]">
      <UPageGrid :ui="{ base: '' }" class="bg-[#FFFFFF] p-3 py-4 sm:px-6 gap-2 md:gap-4 rounded-[20px] grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        <NuxtLink v-for="(item, index) in items" :key="index" :to="item.to" class="border border-[#DBF4FF] hover:bg-[#E3EDF0] rounded-lg flex flex-col justify-center items-center p-4 truncate">
          <span class="bg-[#DBF4FF] p-2 px-4 rounded-lg mb-1">
            <NuxtImg :src="item.icon" alt="come svg for pool" class="w-6 h-6 md:w-10 md:h-10" />
          </span>
          <h4 class="md:tracking-[5%] text-[12px] md:text-[16px] text-[#676A6D] font-normal truncate text-ellipsis">
            {{ item.label }}
          </h4>
        </NuxtLink>
      </UPageGrid>
    </section>
  </main>
</template>
