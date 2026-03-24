<template>
  <section class="md:h-screen bg-[url(/images/landing-page/hero-radial-grad.png)] bg-right bg-no-repeat">
    <div class="pt-4 pb-4 md:h-full gap-4 sm:gap-y-6 grid md:grid-cols-2 font-poppins mx-5 sm:mx-6 md:mx-8 lg:mx-19 2xl:mx-25">
      <div class="flex md:order-2 justify-start items-start border justify-items-start">
        <NuxtImg src="/images/landing-page/new-desktop-hero-img.png" class="object-cover aspect-auto w-full border" alt="Woman Using Rovelsub for utility payments" />
      </div>
      <div class="flex flex-col gap-6 h-full overflow-visible">
        <span class="size-fit">
          <NuxtImg src="/images/landing-page/lightbluediamondborder.svg" class="w-5 h-5" />
        </span>
        <span class="text-[#1A1F24] font-extrabold tracking-normal font-poppins text-[clamp(2rem,4vw,6.5rem)] leading-12 lg:leading-20 2xl:leading-28 overflow-visible">
          <span class="text-[#1177FE]">Recharge, Subscribe And Pay Bills</span> With RovelSub Point
        </span>
        <p class="leading-[161%] md:leading-[190%] xl:leading-[200%] text-[clamp(1rem,4vw,1.5rem)]">
          Access airtime, data, subscriptions, and pay bills in one platform. RovelSub  Point is your trusted and secure digital service platform.
        </p>
        <UButton to="/register" size="xl" class="size-fit bg-[#1177FE] text-white text-base rounded-full font-semibold px-8 tracking-[10%]" aria-label="Get Started">
          Get Started
        </UButton>
      </div>
    </div>
  </section>
</template>

<style lang="css" scoped>
</style>
