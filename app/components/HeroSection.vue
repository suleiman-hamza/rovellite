<template>
  <section class="md:h-screen bg-[url(/images/hero-radial-grad.png)] bg-right bg-no-repeat">
    <UContainer class="pt-4 pb-4 md:h-full gap-4 sm:gap-y-6 grid md:grid-cols-2 font-poppins">
      <div class="flex md:order-2 justify-start items-center">
        <NuxtImg src="/images/landing-page/herol.png" class="object-cover aspect-auto" alt="MDN Web Docs" />
        <!-- <picture class="">
          <source srcset="/images/landing-page/herol.png" media="(width >= 800px)">
          <source srcset="/images/landing-page/mobile-herol.png" media="(width >= 600px)">
          <img src="/images/landing-page/mobile-herol.png" alt="MDN Web Docs">
        </picture> -->
      </div>
      <div class="flex flex-col gap-6 h-full overflow-visible">
        <span class="size-fit">
          <NuxtImg src="/images/landing-page/polygon 7.svg" class="w-5 h-5" />
        </span>
        <span class="text-[#1A1F24] font-extrabold tracking-normal font-poppins text-[32px] sm:text-4xl lg:text-[72px] leading-12 lg:leading-20 overflow-visible">
          <span class="text-[#1177FE]">Recharge, Subscribe And Pay Bills</span> With RovelSub Point
        </span>
        <p class="leading-[161%] md:leading-[190%] text-base', footer: 'mt-6">
          Access airtime, data, subscriptions, and pay bills in one platform. RovelSub  Point is your trusted and secure digital service platform.
        </p>
        <UButton to="/register" size="xl" class="size-fit bg-[#1177FE] text-white text-base rounded-full font-semibold px-8 tracking-[10%]" aria-label="Get Started">
          Get Started
        </UButton>
      </div>
    </UContainer>
  </section>
  <!-- <UPageHero
    orientation="horizontal"
    description="Access airtime, data, subscriptions, and pay bills in one platform. RovelSub  Point is your trusted and secure digital service platform."
    :ui="{ container: 'gap-4 sm:gap-y-6 py-0 pb-12 sm:py-12 lg:py-0 md:grid grid-cols-2 font-poppins', wrapper: 'order-2 sm:order-1', root: 'bg-[url(/images/hero-radial-grad.png)] bg-right bg-no-repeat', title: 'text-[#1A1F24] font-extrabold tracking-normal sm:tracking-[2px] text-[32px] sm:text-4xl lg:text-[58px] leading-12 lg:leading-20', description: 'mt-6 leading-[161%] md:leading-[190%] text-base', footer: 'mt-6' }"
  >
    <template #title>
      <span>
        <span class="text-[#1177FE]">Recharge, Subscribe And Pay Bills</span> With RovelSub Point
      </span>
    </template>
    <div class="flex order-1 sm:order-2 relative md:p-8 lg:p-12">
      <picture class="flex-1 block">
        <source srcset="/images/landing-page/herol.png" media="(width >= 800px)">
        <source srcset="/images/landing-page/mobile-herol.png" media="(width >= 600px)">
        <img src="/images/landing-page/mobile-herol.png" alt="MDN Web Docs">
      </picture>
    </div>
    <template #footer>
      <UButton to="/register" size="xl" class="bg-[#1177FE] text-white text-base rounded-full font-semibold px-8 tracking-[10%]" aria-label="Get Started">
        Get Started
      </UButton>
    </template>
  </UPageHero> -->
</template>

<style lang="css" scoped>
</style>
