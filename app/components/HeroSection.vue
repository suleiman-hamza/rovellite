<template>
  <section class="md:h-screen bg-[url(/images/landing-page/hero-radial-grad.png)] bg-right bg-no-repeat">
    <UContainer class="pt-4 pb-4 md:h-full gap-4 sm:gap-y-6 grid md:grid-cols-2 font-poppins">
      <div class="flex md:order-2 justify-start items-center">
        <NuxtImg src="/images/landing-page/herol.png" class="object-cover aspect-auto" alt="MDN Web Docs" />
      </div>
      <div class="flex flex-col gap-6 h-full overflow-visible">
        <span class="size-fit">
          <NuxtImg src="/images/landing-page/lightbluediamondborder.svg" class="w-5 h-5" />
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
</template>

<style lang="css" scoped>
</style>
