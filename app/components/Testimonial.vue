<script setup lang="ts">
// const nextIcon = ref('i-lucide-chevron-right')
// const prevIcon = ref('i-lucide-chevron-left')
const items = ref([
  {
    name: 'Aisha Bello',
    title: 'Freelancer',
    description: 'Paying for my TV subscription and electricity bills has never been easier. The platform is intuitive and very user-friendly.',
    icon: 'i-lucide-smile',
  },
  {
    name: 'Suleiman',
    title: 'Frontend Engineer',
    description: 'RovelSub Point is the perfect choice for organizations, whether managing bulk payments, staff utilities, or business subscriptions, our platform ensures transactions are efficient, reliable, and seamless.',
    icon: 'i-lucide-a-large-small',
  },
  {
    name: 'Chukwuemeka Nwosu',
    title: 'RovelSub Agent',
    description: 'Becoming a RovelSub agent has been a game-changer. I earn extra income while providing my customers with fast and reliable services.',
    icon: 'i-lucide-globe',
  },
  {
    name: 'Justice Odoyi',
    title: 'Softwware Developer',
    description: 'RovelSub Express is the perfect choice for individuals, whether you need to renew subscriptions, recharge your phone, or pay bills, our platform makes transactions quick and hassle-free.',
    icon: 'i-lucide-book',
  },
  {
    name: 'Justice Odoyi',
    title: 'Softwware Developer',
    description: 'RovelSub Express is the perfect choice for individuals, whether you need to renew subscriptions, recharge your phone, or pay bills, our platform makes transactions quick and hassle-free.',
    icon: 'i-lucide-book',
  },
])
</script>

<template>
  <section class="">
    <UPageSection title="What Our User Say" headline="TESTIMONIAL" :ui="{ title: 'text-left text-[20px] sm:text-[52px] text-[#1A1F24] font-bold', headline: 'text-left size-fit text-[#1177FE] text-[12px] sm:text-[18px] mb-0' }">
      <UCarousel
        v-slot="item"
        dots
        loop
        wheel-gestures
        :prev="{ variant: 'solid' }"
        :next="{ variant: 'solid' }"
        prev-icon: prev-icon
        next-icon: next-icon
        :items="items"
        :ui="{
          item: 'ps-0 outline outline-taupe-600 sm:outline-amber-400 md:outline-blue-600 md:basis-1/3 pl-(--slide-spacing) h-full items-stretch',
          prev: '-top-10 left-10',
          next: ' top-0 right-10',
          container: 'ms-0 -ml-(--slide-spacing)',
          controls: '',
          dots: 'sm:justify-start',
          dot: 'data-[state=active]:bg-[#1177FE]',

        }"
      >
        <div class="pt-8 rounded-sm bg-white relative w-full">
          <span class="absolute top-0 w-24 h-24 rounded-full z-20 bg-white right-10"><NuxtImg src="/images/landing-page/testimonial-img.png" class="w-full h-auto" /></span>
          <div class="relative bg-[#F2FBFF] rounded-lg">
            <div class="font-poppins py-6 px-4 pb-18">
              <h4 class="leading-7.5 md:text-[24px] font-bold text-[#4D5155]">
                {{ item.item.name }}
              </h4>
              <h5 class="md:text-[18px] font-normal text-[#1A1F24] leading-[150%]">
                {{ item.item.title }}
              </h5>
              <USeparator class="w-50" />
              <p class="mt-2 tracking-[5%] text-[#34383D] leading-[190%] text-[16px] font-normal">
                {{ item.item.description }}
              </p>
              <NuxtImg src="/images/landing-page/quote.svg" class="absolute bottom-5 right-5" />
            </div>
          </div>
        </div>
      </UCarousel>
    </UPageSection>
  </section>
</template>
