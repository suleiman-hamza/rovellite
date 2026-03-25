<script setup lang="ts">
// import useEmblaCarousel from 'embla-carousel-vue'
// import {  } from ''
// const nextIcon = ref('i-lucide-chevron-right')
// const prevIcon = ref('i-lucide-chevron-left')
const items = ref([
  {
    name: 'Tobi Adeyemi',
    title: 'Entrepreneur',
    description: 'RovelSub Point has made managing my daily transactions so easy. From recharging airtime to paying bills, everything is fast and seamless.',
  },
  {
    name: 'Funke Okafor',
    title: 'HR Manager',
    description: 'As an HR manager, handling staff allowances and utility payments used to be stressful. RovelSub Point saves me time and ensures everything is secure.',
  },
  {
    name: 'Aisha Bello',
    title: 'Freelancer',
    description: 'Paying for my TV subscription and electricity bills has never been easier. The platform is intuitive and very user-friendly.',
  },
  {
    name: 'Chukwuemeka Nwosu',
    title: 'RovelSub Agent',
    description: 'Becoming a RovelSub agent has been a game-changer. I earn extra income while providing my customers with fast and reliable services.',
  },
  {
    name: 'Kemi Adebayo',
    title: 'Student',
    description: 'Recharging my phone while catching up on my favorite shows is so effortless. RovelSub Point really makes life simpler!',
  },
  {
    name: 'Daniel Ibrahim',
    title: 'Small Business Owner',
    description: 'Paying bills used to be such a headache, but now it’s quick, simple, and hassle-free. I actually look forward to it!',
  },
  {
    name: 'Sandra Okeke',
    title: 'RovelSub Agent',
    description: 'Being an agent is super fun! My customers are happy, and I’m making extra cash without stress. RovelSub Point rocks!',
  },
  {
    name: 'Emeka Udo',
    title: 'Freelancer',
    description: 'I no longer worry about running out of data in the middle of work. Everything I need is just a few clicks away!',
  },
])
</script>

<template>
  <section class="">
    <section class="mx-5 sm:mx-6 md:mx-8 lg:mx-19 2xl:mx-25 py-15">
      <div class="flex justify-between items-start border">
        <div>
          <h4 class="text-left size-fit text-[#1177FE] text-[12px] sm:text-[18px] mb-0">
            TESTIMONIAL
          </h4>
          <h4 class="text-left text-[20px] sm:text-[52px] text-[#1A1F24] font-bold">
            What Our User Say
          </h4>
        </div>
        <div class="border size-fit flex gap-8">
          <UButton icon="i-lucide-chevron-left" :ui="{ leadingIcon: 'text-black' }" class="rounded-full bg-transparent outline outline-black" />
          <UButton icon="i-lucide-chevron-right" :ui="{ leadingIcon: 'text-black' }" class="rounded-full bg-transparent outline outline-black" />
        </div>
      </div>
      <UCarousel
        v-slot="item"
        dots
        loop
        arrows
        wheel-gestures
        :prev="{ variant: 'solid' }"
        :next="{ variant: 'solid' }"
        :items="items"
        class="w-full mx-auto"
        :ui="{
          item: 'ps-0 sm:basis-2/3 md:basis-[33%] pl-(--slide-spacing) h-full',
          container: 'ms-0 -ml-(--slide-spacing) h-69 md:h-80',
          controls: 'border relative',
          arrows: 'relative border border-red-600 top-0',
          prev: 'md:-top-90 -top-69 left-0',
          next: 'md:-top-90 -top-69 right-0',
          dots: 'sm:justify-start',
          dot: 'data-[state=active]:bg-[#1177FE]',

        }"
      >
        <div class="pt-8 md:pt-12 rounded-sm bg-white relative h-full">
          <span class="absolute top-0 w-25 h-25 md:h-32 md:w-32 rounded-full z-20 bg-white right-10 md:right-7"><NuxtImg src="/images/landing-page/carousel-img.png" class="w-full h-auto" /></span>
          <div class="relative bg-[#F2FBFF] rounded-lg h-full">
            <div class="font-poppins py-6 px-4 pb-18">
              <h4 class="leading-7.5 text-[14px] md:text-[24px] font-bold text-[#4D5155]">
                {{ item.item.name }}
              </h4>
              <h5 class="md:text-[18px] text-[12px] mb-1 font-normal text-[#1A1F24] leading-[150%]">
                {{ item.item.title }}
              </h5>
              <USeparator class="w-50" />
              <p class="mt-2 tracking-[5%] text-[14px] text-[#34383D] leading-[190%] font-normal">
                {{ item.item.description }}
              </p>
              <NuxtImg src="/images/landing-page/quote.svg" class="absolute bottom-5 right-5" />
            </div>
          </div>
        </div>
      </UCarousel>
    </section>
  </section>
</template>
