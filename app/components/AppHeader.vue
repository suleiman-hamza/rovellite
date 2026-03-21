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
  {
    label: 'How it Works',
    to: '#howitworks',
    type: 'link',
    active: route.path.includes('#howitworks'),
  },
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
  <UHeader mode="slideover" :ui="{ root: 'h-(--ui-header-height-mobile) sm:h-(--ui-header-height)' }" :toggle="{ size: 'xl' }">
    <template #title>
      <NuxtImg
        loading="eager"
        src="/images/landing-page/header-logo.svg"
        alt="Rovelsub point header logo"
        class="w-auto h-10 md:h-16 object-contain"
      />
      <!-- <NuxtLink
        to="#"
        class="flex items-center justify-center"
        aria-describedby="Go to Home"
      >

      </NuxtLink> -->
    </template>

    <UNavigationMenu
      :items="items" variant="link" highlight
      highlight-color="secondary"
      color="secondary"
      :ui="{ linkLabel: 'font-semibold text-[18px] leading-[150%] tracking-[2%]' }"
    />
    <template #right>
      <div class="items-center gap-4 lg:gap-6 md:flex font-poppins hidden text-base">
        <UButton to="/login" size="xl" variant="ghost" class="border-[#1177FE] border text-[#1177FE] rounded-[40px] font-semibold px-8 leading-[150%] tracking-[2%]" aria-label="Login">
          Login
        </UButton>

        <UButton to="/register" size="xl" class="bg-[#1177FE] text-white rounded-[40px] font-semibold px-8 leading-[150%] tracking-[2%]" aria-label="Sign Up">
          Register
        </UButton>
      </div>
    </template>

    <template #body>
      <p>Show this on toggle open</p>
      <!-- <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" /> -->
    </template>
  </UHeader>
</template>
