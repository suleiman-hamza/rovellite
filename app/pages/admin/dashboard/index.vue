<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { BarChart } from 'echarts/charts'
import * as echarts from 'echarts/core'

echarts.use([BarChart])

// import { useProfileStore } from '@/stores/profile'

// const store = useProfileStore()
// const toast = useToast()

definePageMeta({
  middleware: ['auth'],
  keepalive: true,
})

// const userID = store.userProfile?.user_id
const source = 'vhehk;ssio' // This would be your referral code or any text you want to copy
const { copy } = useClipboard({ source, copiedDuring: 3000 })

const option = ref<ECOption>({
  dataset: {
    dimensions: ['Product', '2015', '2016', '2017'],
    source: [
      {
        Product: 'Matcha Latte',
        2015: 54,
        2016: 42,
        2017: 23,
      },
    ],
  },
  xAxis: { type: 'category' },
  yAxis: {},
  series: [{ type: 'bar' }],
})
</script>

<template>
  <main class="">
    <section class="rounded-[20px] bg-[#1177FE]">
      <Wallet />
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
            class="absolute top-4 right-4 bg-[#C4ECFE] p-1 px-2 rounded-sm h-fit text-[14px]" @click="copy(source)"
          >
            <span v-if="!copy">Copy</span>
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

    <section class="border p-4 bg-white">
      <VChart :option="option" />
    </section>
  </main>
</template>
