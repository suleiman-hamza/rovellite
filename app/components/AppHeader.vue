<script lang="ts" setup>
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Home',
    to: '/',
    type: 'link',
    active: route.path.startsWith('/'),
  },
  {
    label: 'Features',
    to: '#features',
    type: 'link',
    active: route.path.includes('#features'),
  },
  {
    label: 'Why Choose us',
    to: '#whychooseus',
    type: 'link',
    active: route.path.includes('#whychooseus'),
  },
  // {
  //   label: 'How it Works',
  //   to: '#howitworks',
  //   type: 'link',
  //   active: route.path.includes('#howitworks'),
  // },
  {
    label: 'FAQs',
    to: '#faqs',
    type: 'link',
    active: route.path.includes('#faqs'),
  },
  {
    label: 'Contact us',
    to: '#contactus',
    type: 'link',
    active: route.path.includes('#contactus'),
  },
])
</script>

<template>
  <section class="fixed w-full border-b border-[#dedede] top-0 z-20 h-(--ui-header-height-mobile) md:h-(--ui-header-height) flex items-center bg-white">
    <section class="w-full mx-5 sm:mx-6 md:mx-8 lg:mx-19 2xl:mx-25 flex gap-6 items-center">
      <div>
        <NuxtImg
          loading="eager"
          src="/images/landing-page/rovel-new-logo.svg"
          alt="Rovelsub point header logo"
          class="w-auto h-10 md:h-16 object-contain"
        />
      </div>
      <!-- <NuxtLink
        to="#"
        class="flex items-center justify-center"
        aria-describedby="Go to Home"
        >

      </NuxtLink> -->

      <div class="hidden lg:flex ml-auto">
        <UNavigationMenu
          :items="items" variant="link" highlight
          highlight-color="secondary"
          color="secondary"
          :ui="{ linkLabel: 'font-semibold text-[18px] leading-[150%] tracking-[2%]' }"
        />
      </div>

      <div class="items-center gap-4 lg:gap-6 lg:flex font-poppins hidden text-base">
        <UButton to="/login" size="xl" variant="ghost" class="w-33.25 h-12 border-[#1177FE] border text-[#1177FE] items-center justify-center rounded-[40px] font-semibold leading-[150%] tracking-[2%]" aria-label="Login">
          Login
        </UButton>

        <UButton to="/register" size="xl" class="w-33.25 h-12 bg-[#1177FE] text-white rounded-[40px] font-semibold items-center justify-center leading-[150%] tracking-[2%]" aria-label="Sign Up">
          Register
        </UButton>
      </div>

      <div class="lg:hidden ml-auto">
        <UButton icon="i-lucide-menu" variant="soft" aria-label="Open SideMenu" />
      </div>
    </section>
  </section>
</template>
