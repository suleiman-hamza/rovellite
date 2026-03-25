<script lang="ts" setup>
// site's SEO meta tags
import type { PageFeatureProps } from '@nuxt/ui'

const title = ref('Home')
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - RovelSub-Point` : 'RovelSub-Point'
  },
})

useSeoMeta({
  title,
  // change this description to a more relevant one later
  description: () => `This is a description for the ${title.value} page`,
})

const userTypes = ref<PageFeatureProps[]>([
  {
    title: 'INDIVIDUALS',
    description: 'RovelSub Point is the perfect choice for individuals, whether you need to buy data, recharge airtime, or pay bills, our platform makes transactions fast, secure, and stress-free.',
    icon: '/images/landing-page/user-profile.svg',
  },
  {
    title: 'ORGANIZATIONS',
    description: 'RovelSub Point is the perfect choice for organizations, whether managing bulk payments, staff utilities, or business subscriptions, our platform ensures transactions are efficient, reliable, and seamless.',
    icon: '/images/landing-page/organization.svg',
  },
  {
    title: 'ROVELSUB AGENT',
    description: 'RovelSub Express is the perfect choice for individuals, whether you need to renew subscriptions, recharge your phone, or pay bills, our platform makes transactions quick and hassle-free.',
    icon: '/images/landing-page/support-agent.svg',
  },
])

const features = ref<PageFeatureProps[]>([
  {
    title: 'Data and Internet',
    description: 'Purchase affordable data bundles for all major networks and stay connected wherever you are. Enjoy fast activation, reliable service, and seamless browsing.',
    icon: '/images/landing-page/wifi.svg',
  },
  {
    title: 'Airtime Recharge',
    description: 'Top up airtime for any network in seconds with secure and instant processing. Whether for calls or SMS, your recharge is completed smoothly.',
    icon: '/images/landing-page/phone.svg',
  },
  {
    title: 'TV and Decoders',
    description: 'Renew your cable TV subscriptions and manage decoder payments easily from the comfort of your home. Avoid queues and service interruptions.',
    icon: '/images/landing-page/tv.svg',
  },
  {
    title: 'Betting',
    description: 'Fund your betting wallets quickly and securely with instant transaction confirmation. Enjoy a smooth payment experience.',
    icon: '/images/landing-page/betting.svg',
  },
  {
    title: 'Electricity',
    description: 'Pay your electricity bills conveniently and receive your token instantly after successful payment. Experience a hassle-free process.',
    icon: '/images/landing-page/light-bulb.svg',
  },
  {
    title: 'Education',
    description: 'Make payments for exams i.e Jamb, Weac, Neco etc easily and securely. Complete your transactions in minutes without visiting physical offices.',
    icon: '/images/landing-page/education.svg',
  },
  {
    title: 'E-SIM',
    description: 'Activate your eSIM digitally and enjoy instant mobile connectivity without the need for a physical SIM card and stay connected across locations.',
    icon: '/images/landing-page/sim.svg',
  },
  {
    title: 'Transportation',
    description: 'Handle transport bookings and travel-related payments conveniently online and experience quick confirmations and smooth transactions.',
    icon: '/images/landing-page/transportation.svg',
  },
  {
    title: 'Solar System',
    description: 'Purchase reliable solar systems and complete your payments securely through a simple process. Invest in clean, dependable energy solutions.',
    icon: '/images/landing-page/solar-panel.svg',
  },
])

const imgList = ref([
  {
    src: '/images/landing-page/mtn.png',
    alt: 'mtn-ng logo',
  },
  {
    src: '/images/landing-page/glo.png',
    alt: 'glo-ng logo',
  },
  {
    src: '/images/landing-page/airtel.png',
    alt: 'airtel logo',
  },
  {
    src: '/images/landing-page/9mobile.png',
    alt: '9mobile logo',
  },
  {
    src: '/images/landing-page/spectranet.png',
    alt: 'spectranet logo',
  },
  {
    src: '/images/landing-page/ipnx.png',
    alt: 'ipnx logo',
  },
  {
    src: '/images/landing-page/smile.png',
    alt: 'smile logo',
  },
  {
    src: '/images/landing-page/vdt.png',
    alt: 'vdt logo',
  },
  {
    src: '/images/landing-page/bet9ja.png',
    alt: 'bet9ja logo',
  },
  {
    src: '/images/landing-page/showmax.png',
    alt: 'showmax logo',
  },
  {
    src: '/images/landing-page/dstv.png',
    alt: 'dstv logo',
  },
  {
    src: '/images/landing-page/gotv.png',
    alt: 'gotv logo',
  },
  {
    src: '/images/landing-page/startimes.png',
    alt: 'startimes logo',
  },
  {
    src: '/images/landing-page/phedc.png',
    alt: 'phedc logo',
  },
  {
    src: '/images/landing-page/ibedc.png',
    alt: 'ibedc logo',
  },
  {
    src: '/images/landing-page/enuguelectric.png',
    alt: 'eedc logo',
  },
  {
    src: '/images/landing-page/ikejaelectric.png',
    alt: 'ikedc logo',
  },
  {
    src: '/images/landing-page/apl.png',
    alt: 'apl logo',
  },
])
</script>

<template>
  <div class="font-poppins">
    <HeroSection />
    <section id="features" class="font-poppins bg-[#F2FBFF] pt-14 md:py-18 pb-15">
      <section class="mx-5 sm:mx-6 md:mx-8 lg:mx-19 2xl:mx-25">
        <h4 class="text-left size-fit text-[#1177FE] text-[12px] leading-[150%] sm:text-[18px] mb-3">
          WHAT WE OFFER
        </h4>
        <h4 class="text-left text-[20px] sm:text-[52px] text-[#1A1F24] font-bold tracking-[2%] leading-[150%] md:leading-16.25">
          Our Services
        </h4>
        <div class="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full mt-7.8 md:mt-10">
          <UPageFeature
            v-for="group in features"
            :key="group.title"
            class="bg-white rounded-md"
          >
            <template #default>
              <div class="p-4 flex flex-col gap-4 items-start text-[#4D5155] font-poppins">
                <span class="bg-[#1177FE] p-3 flex items-center justify-center rounded-sm">
                  <NuxtImg :src="group.icon" class="block w-6 h-6 md:w-10 md:h-10" />
                </span>
                <div class="flex-1">
                  <h4 class="text-base font-bold md:text-[24px] leading-7.5 mb-2 uppercase text-[#4D5155]">
                    {{ group.title }}
                  </h4>
                  <p class="text-[#34383D] text-[16px] tracking-[5%] leading-[190%] font-normal">
                    {{ group.description }}
                  </p>
                </div>
              </div>
            </template>
          </UPageFeature>
        </div>
      </section>
    </section>
    <!-- Our partners -->
    <UPageSection headline="LEADING PARTNERS" class="border-y border-[#CCCDCE]" title="Our Partners" :ui="{ container: 'py-12 sm:py-18 lg:py-18', title: 'text-left sm:text-center sm:size-full text-[20px] sm:text-[52px] text-[#1A1F24] tracking-[2px] font-bold', headline: 'text-left sm:text-center sm:size-full size-fit text-[#1177FE] text-[12px] sm:text-[18px] mb-0' }">
      <div class="grid grid-cols-[repeat(auto-fill,minmax(65px,70px))] md:grid-cols-[repeat(auto-fill,minmax(95px,100px))] gap-4 items-center self-center justify-center-safe justify-items-center w-full md:max-w-275 md:mx-auto">
        <NuxtImg
          v-for="imglogo in imgList"
          :key="imglogo.alt"
          :src="imglogo.src"
          :alt="imglogo.alt"
          class="w-17 h-17 md:w-23.75 md:h-23.75 object-contain"
        />
      </div>
    </UPageSection>

    <section class="border">
      <section class="mx-5 sm:mx-6 md:mx-8 lg:mx-19 2xl:mx-25 border py-16">
        <h4 class="text-left size-fit text-[#1177FE] text-[12px] md:text-[18px] mb-0 tracking-[1%]">
          WHO IS ROVELSUB POINT FOR
        </h4>
        <h5 class="text-left text-[20px] md:text-[52px] text-[#1A1F24] tracking-[2%] font-extrabold">
          Who Can Be Our Users?
        </h5>
        <section class="flex flex-col md:grid grid-cols-2 gap-4">
          <div class="flex items-center justify-center">
            <div class="relative size-fit">
              <!-- Polygon anchored to this wrapper -->
              <span class="absolute top-10 left-8">
                <NuxtImg src="/images/landing-page/lightbluediamond.svg" class="w-5 h-5" />
              </span>

              <!-- Background image -->
              <div
                class="absolute inset-0 -z-10 object-top md:object-left border bg-sky-300/10 rounded-full shadow-2xs"
              />

              <!-- Main image (anchor target) -->
              <NuxtImg
                src="/images/landing-page/mobile-usertypes.png"
                alt="man standing png"
                width="390"
                height="436"
                class="w-full h-auto"
              />
            </div>
          </div>
          <div class="flex flex-col gap-4">
            <UPageFeature
              v-for="group in userTypes"
              :key="group.title"
              class="rounded-md bg-[#F2FBFF]"
            >
              <template #default>
                <div class="p-4 flex gap-4 md:gap-6 items-start h-52">
                  <span class="bg-[#1177FE] p-3 flex items-center justify-center rounded-sm">
                    <NuxtImg :src="group.icon" class="block w-6 h-6 md:w-8 md:h-8" />
                  </span>
                  <div class="flex-1">
                    <h4 class="text-[#4D5155] text-base sm:text-[24px] leading-[150%] tracking-[1%] font-bold">
                      {{ group.title }}
                    </h4>
                    <p class="text-[14px] text-[#34383D] leading-[161%] sm:leading-[190%] tracking-[1%] sm:tracking-[5%] font-normal">
                      {{ group.description }}
                    </p>
                  </div>
                </div>
              </template>
            </UPageFeature>
          </div>
        </section>
      </section>
    </section>

    <WhyChooseUs />
    <HowItWorks />
    <FAQs />
    <Testimonial />
    <CommingSoon />
    <ContactPage id="contactus" />
  </div>
</template>

<style scoped></style>
