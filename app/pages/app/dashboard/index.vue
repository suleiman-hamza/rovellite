<script setup lang="ts">
import type { VirtualAccountResponse } from '@@/types/palmpay'
// import { createReusableTemplate, useClipboard, useMediaQuery } from '@vueuse/core'

import { useProfileStore } from '@/stores/profile'

const store = useProfileStore()
const toast = useToast()

definePageMeta({
  middleware: ['auth'],
  keepalive: true,
})

const items = [{
  label: 'Gift cards',
  icon: '/images/dashboard/giftcard.svg',
  to: '/app/giftCards',
}, {
  label: 'Data',
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
  label: 'Betting',
  icon: '/images/dashboard/betting.svg',
  to: '/app/betting',
}, {
  label: 'eSim',
  icon: '/images/dashboard/eSim.svg',
  to: '/app/eSim',
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
}]

// const virtualAccountDetails = ref<VirtualAccountResponse | null>(null)
const userID = store.userProfile?.user_id

// const virtualAccountDetails = ref<VirtualAccountResponse | null>(null)

const { data: virtualAccountDetails, status, error: VAerror } = await useLazyFetch<VirtualAccountResponse>(`/api/virtual-account/${userID}`, {
  key: 'virtual-account',
})

if (VAerror.value) {
  console.error('Error fetching virtual account:', VAerror.value)
}
// else {
//   virtualAccountDetails.value = VA.value as VirtualAccountResponse
// }

// what to copy to clipboard, in this case, the user's virtual account number
const source = virtualAccountDetails.value?.data?.virtual_account_no || ''
const { copy, copied } = useClipboard({ source, copiedDuring: 3000 })

const refferalCode = ref('vvshsiahehk;ssio')
const { copy: copyReferralCode, copied: copiedReferralCode } = useClipboard({ source: refferalCode, copiedDuring: 3000 })
const loading = ref(false)

const [DefineFormTemplate, ReuseFormTemplate] = createReusableTemplate()
const isDesktop = useMediaQuery('(min-width: 768px)')

const open = ref(false)

const state = reactive({
  bvn: undefined as string | undefined,
})

const bvnResult = ref<{ success: boolean, message: string } | null>(null)

watch(open, (val) => {
  if (!val) {
    bvnResult.value = null
    state.bvn = undefined
  }
})

const title = 'Create Wallet'
const description = 'You are required by the federal government of Nigeria, to submit your BVN information in order to use financial services provided by palmpay'

async function createWallet() {
  try {
    const response = await $fetch('/api/virtual-account/create', {
      method: 'POST',
      body: {
        userId: store.userProfile?.user_id,
      },
    })
    if (!response.success) {
      toast.add({
        title: 'Failed to create account number',
        description: response.message,
        color: 'error',
      })
    }
    else {
      toast.add({ title: 'Account Created Successfully' })
      await refreshNuxtData('virtual-account')
      open.value = false
    }
  }
  catch (error) {
    console.error('Error creating wallet:', error)
    toast.add({ title: 'Error', description: 'Failed to create wallet', color: 'error' })
  }
}

async function submitBvn() {
  if (!state.bvn) return
  loading.value = true
  bvnResult.value = null
  try {
    const response = await $fetch('/api/bvn/verify', {
      method: 'POST',
      body: {
        userId: store.userProfile?.user_id,
        bvn: state.bvn,
      },
    })
    if (response.success) {
      bvnResult.value = { success: true, message: 'BVN verified. Creating your wallet...' }
      await createWallet()
    }
    else {
      bvnResult.value = { success: false, message: response.message || 'BVN verification failed' }
    }
  }
  catch (error: any) {
    bvnResult.value = {
      success: false,
      message: error?.data?.message || error?.message || 'Failed to verify BVN',
    }
  }
  finally {
    loading.value = false
  }
}

// const { data: walletData, error: walletError } = await useFetch('/api/wallet', {
//   query: { userId: store.userProfile?.user_id },
// })
</script>

<template>
  <main class="">
    <section class="rounded-[20px] bg-[#1177FE]">
      <Wallet />
      <div v-if="status === 'pending'" class="p-4">
        <UPageGrid class="grid grid-cols-2 gap-3">
          <div class="bg-white rounded-lg flex items-center justify-center w-full">
            <USkeleton class="object-contain w-full h-10 rounded-lg" />
          </div>
          <div class="bg-white rounded-lg flex items-center justify-center w-full">
            <USkeleton class="object-contain w-full h-10 rounded-lg" />
          </div>
        </UPageGrid>
      </div>
      <!-- show palmpay wallet for users with a wallet -->
      <div v-else-if="status === 'success' && virtualAccountDetails?.success" class="p-4 sm:px-6 text-white">
        <div class="flex justify-between items-start md:gap-3">
          <div class="flex gap-1.5 md:gap-3 items-center font-bold text-[16px] md:text-[24px] mb-2">
            <NuxtImg src="/images/icons/palmpay-wallet.svg" alt="palmpay wallet" class="w-5.5 h-5.5 md:w-8 md:h-8" />
            <h3 class="text-[16px] md:text-[18px] tracking-[1%]">
              Palmpay
            </h3>
            <USeparator orientation="vertical" class="hidden md:inline h-4" />
            <span class="tracking-[1%]">{{ virtualAccountDetails?.data?.virtual_account_no }}</span>
          </div>
          <UButton size="lg" class="text-[12px] md:text-[20px] md:font-bold hover:bg-secondary" :ui="{ base: 'text-[#1177FE] bg-white w-20 h-7 md:w-40 md:h-15 flex items-center justify-center rounded-[8px] sm:rounded-[12px]' }" @click="copy(source)">
            <span v-if="!copied">Copy</span>
            <span v-else>Copied!</span>
          </UButton>
        </div>
        <p class="tracking-[2%] text-[12px] md:text-[20px] leading-[150%] font-normal">
          Transfer to Fund wallet. #50 charge applies
        </p>
      </div>

      <!-- show create wallet option for users without a wallet -->
      <div v-else class="flex flex-row items-center gap-4 justify-between p-4 pt-5 sm:px-6">
        <p class="font-semibold md:font-bold text-white text-[14px] md:text-[24px]">
          You have no wallet
        </p>

        <DefineFormTemplate>
          <UForm :state="state" class="space-y-4" @submit="submitBvn">
            <UFormField label="Bank Verification Number (BVN)" name="bvn" required>
              <UInput v-model="state.bvn" placeholder="12345678901" required />
            </UFormField>

            <p v-if="bvnResult" :class="bvnResult.success ? 'text-green-600' : 'text-red-500'" class="text-sm">
              {{ bvnResult.message }}
            </p>

            <UButton label="Submit" :loading="loading" :disabled="loading" type="submit" />
          </UForm>
        </DefineFormTemplate>

        <!-- create wallet btn for desktop activates modal for validating bvn -->
        <UModal v-if="isDesktop" v-model:open="open" :title="title" :description="description">
          <UButton size="lg" class="text-[12px] md:text-[20px] md:font-bold hover:bg-secondary" :ui="{ base: 'text-[#1177FE] bg-white flex items-center justify-center rounded-[8px] sm:rounded-[12px]' }">
            Create Wallet
          </UButton>

          <template #body>
            <ReuseFormTemplate />
          </template>
        </UModal>

        <!-- create wallet btn for mobile activates drawer for validating bvn -->
        <UDrawer v-else v-model:open="open" :title="title" :description="description">
          <UButton class="text-[12px] md:text-[20px] md:font-bold hover:bg-secondary" :ui="{ base: 'text-[#1177FE] bg-white flex items-center justify-center rounded-[8px] sm:rounded-[12px]' }">
            Create Wallet
          </UButton>

          <template #body>
            <ReuseFormTemplate />
          </template>
        </UDrawer>
      </div>
    </section>

    <section class="mt-4 rounded-lg">
      <UPageGrid :ui="{ base: '' }" class="bg-[#FFFFFF] py-5 px-3 sm:px-4 sm:py-4.5 lg:px-6 gap-4 rounded-xl grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
        <div class="relative col-span-3 md:col-span-1 bg-[#F2FBFF] rounded-xl flex justify-between p-3">
          <div>
            <h3 class="text-[#4D5155] font-bold text-[14px] md:text-[16px] tracking-[1%]">
              vhehk;ssio
            </h3>
            <h4 class="text-[#565252] text-[14px] md:text-[16px] md:tracking-[5%]">
              Referral Code
            </h4>
          </div>
          <button
            class="absolute top-4 right-4 bg-[#C4ECFE] p-1 px-2 rounded-sm h-fit text-[14px]" @click="copyReferralCode(refferalCode)"
          >
            <span v-if="!copiedReferralCode">Copy</span>
            <span v-else>Copied!</span>
          </button>
        </div>
        <div class="bg-[#F2FBFF] rounded-lg flex flex-col text-center justify-center items-center p-3">
          <h3 class="text-[#4D5155] font-bold text-[14px] md:text-[16px]">
            #20,000
          </h3>
          <h4 class="text-[#565252] text-[12px] md:text-[16px] md:tracking-[5%]">
            Referal Bonus
          </h4>
        </div>
        <div class="bg-[#F2FBFF] rounded-lg flex flex-col text-center justify-center items-center p-3">
          <h3 class="text-[#4D5155] font-bold text-[14px] md:text-[16px]">
            0
          </h3>
          <h4 class="text-[#565252] text-[12px] md:text-[16px] text-center md:tracking-[5%]">
            Total Referrals
          </h4>
        </div>
        <div class="bg-[#F2FBFF] rounded-lg flex flex-col text-center justify-center items-center p-3 py-2">
          <span>
            <NuxtImg src="images/dashboard/giftboxblue.svg" alt="Withdraw earnings" class="text-primary w-6 h-6" />
          </span>
          <h4 class="text-[#565252] text-[12px] md:text-[16px] text-center md:tracking-[5%]">
            Withdraw Earning
          </h4>
        </div>
      </UPageGrid>
    </section>

    <section class="mt-4 rounded-[20px]">
      <UPageGrid :ui="{ base: '' }" class="bg-[#FFFFFF] p-3 py-4 sm:px-6 gap-2 md:gap-4 rounded-[20px] grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        <NuxtLink v-for="(item, index) in items" :key="index" :to="item.to" class="border border-[#DBF4FF] hover:border-primary transition-colors rounded-lg flex flex-col justify-center items-center p-4 text-center truncate">
          <span class="bg-[#DBF4FF] p-2 px-3 rounded-lg mb-1">
            <NuxtImg :src="item.icon" alt="come svg for pool" class="w-6 h-6 md:w-10 md:h-10" />
          </span>
          <h4 class="md:tracking-[5%] text-[12px] md:text-[16px] text-[#676A6D] font-normal truncate text-ellipsis">
            {{ item.label }}
          </h4>
        </NuxtLink>
      </UPageGrid>
    </section>

    <section class="mt-4 rounded-[20px] bg-white p-3 py-4 sm:px-6 ">
      <h2 class="text-[#4D5155] mb-2.5 tracking-[2%] text-[20px] font-bold">
        Recent Transactions
      </h2>
      <Transactions />
      <!-- <h2>Wallet Balance</h2>
      <pre>{{ walletData }}</pre>
      <p class="text-red-500">
        {{ walletError }}
      </p> -->
    </section>
  </main>
</template>
