<script setup lang="ts">
import type { AccordionItem } from '@nuxt/ui'

const items = ref<AccordionItem[]>([
  {
    label: 'What is RovelSub Point?',
    content: 'Yes! Nuxt UI is completely free and open source under the MIT license. All 125+ components are available to everyone.',
  },
  {
    label: 'Is RovelSub Point secure?',
    content: 'Yes! While optimized for Nuxt, Nuxt UI works perfectly with standalone Vue projects via our Vite plugin. You can follow the [installation guide](/docs/getting-started/installation/vue) to get started.',
  },
  {
    label: 'How do I create an account?',
    content: 'You can fund your wallet using any of the available payment options on the platform. Your wallet balance updates instantly and is ready for immediate transactions. You can also skip wallet funding and pay directly with Paystack when selecting a service.',
  },
  {
    label: 'How do I fund my wallet?',
    content: 'You can fund your wallet using any of the available payment options on the platform. Your wallet balance updates instantly and is ready for immediate transactions. You can also skip wallet funding and pay directly with Paystack when selecting a service.',
  },
  {
    label: 'Can I pay without funding my wallet?',
    content: 'Yes! Nuxt UI is used in production by thousands of applications with extensive tests, regular updates, and active maintenance.',
  },
  {
    label: 'How fast are transactions processed?',
    content: 'Yes! Nuxt UI is used in production by thousands of applications with extensive tests, regular updates, and active maintenance.',
  },
  {
    label: 'What should I do if my transaction fails?',
    content: 'Yes! Nuxt UI is used in production by thousands of applications with extensive tests, regular updates, and active maintenance.',
  },
  {
    label: 'Can I pay without funding my wallet?',
    content: 'Yes! Nuxt UI is used in production by thousands of applications with extensive tests, regular updates, and active maintenance.',
  },
])
</script>

<template>
  <section id="faqs" class="bg-[#F2FBFF] font-poppins relative py-13 md:py-18">
    <section class="mx-5 sm:mx-6 md:mx-8 lg:mx-19 2xl:mx-25">
      <span class="absolute top-17 md:top-28 right-10 sm:right-15">
        <NuxtImg src="/images/landing-page/lightbluediamondborder.svg" class="w-5 h-5 md:h-8 md:w-8" />
      </span>
      <div>
        <div class="mb-8 md:mb-10">
          <h4 class="text-left size-fit text-[#1177FE] text-[12px] leading-[150%] sm:text-[18px] mb-3">
            EXPLORE ANSWERS TO FREQUENTLY ASKED QUESTIONS
          </h4>
          <h4 class="text-left text-[20px] sm:text-[52px] text-[#1A1F24] font-bold tracking-[2%] leading-[150%] md:leading-16.25">
            Frequently Asked Question
          </h4>
        </div>
        <UAccordion :items="items" :ui="{ item: 'mb-4 bg-white rounded-md', trigger: 'p-4 sm:py-6 sm:px-8', label: 'tracking-[10%] md:tracking-normal text-[#676A6D] font-bold text-[14px] sm:text-[24px]', content: 'border-t border-[#CCCDCE] p-4 sm:px-8 tracking-[1%] md:tracking-[5%] leading-[190%] text-[#34383D] font-normal' }" />
      </div>
    </section>
  </section>
</template>
