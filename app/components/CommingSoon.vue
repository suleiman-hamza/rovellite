<template>
  <section class="bg-[#F2FBFF]">
    <section class="py-13 mx-5 sm:mx-6 md:mx-8 lg:mx-19 2xl:mx-25 lg:pt-18 lg:pb-10">
      <div class="flex flex-col sm:flex-row-reverse gap-4 md:gap-12 xl:justify-between">
        <div class="flex-1 border">
          <NuxtImg src="/images/new-phone.png" class="max-h-200" />
        </div>
        <div class="flex-1 flex flex-col gap-2 justify-center sm:items-start items-center">
          <h3 class="text-[#1177FE] text-[clamp(0.85rem,4vw,1.2rem)] tracking-[1%] leading-[150%]">
            RovelSub App Update
          </h3>
          <h3 class="text-[#1A1F24] text-center sm:text-left mb-3 text-[clamp(1.4rem,4vw,3.8rem)] leading-[150%] md:leading-16 tracking-[2%] font-extrabold">
            RovelSub Point App Is Coming Soon
          </h3>
          <div class="flex justify-between gap-4 md:mt-8">
            <UButton class="bg-white border flex gap-2 items-center border-[#1177FE] rounded-full text-[#1177FE] font-bold tracking-[10%] md:px-3">
              <NuxtImg src="/images/landing-page/apple-filled.svg" class="w-4 h-4" />
              <span>Apple Store</span>
            </UButton>
            <UButton class="bg-white border flex gap-2 items-center border-[#1177FE] rounded-full text-[#1177FE] font-bold tracking-[10%] md:px-3">
              <NuxtImg src="/images/landing-page/playstore.svg" class="w-4 h-4" />
              <span>Play Store</span>
            </UButton>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>
