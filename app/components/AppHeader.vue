<script lang="ts" setup>
import type { NavigationMenuItem } from '@nuxt/ui'

// Current route information to calculate active navigation state.
const route = useRoute()

// Controls the mobile slide-over menu visibility.
const menuOpen = ref(false)

// Navigation items used by both desktop and mobile menus.
// Each item defines a label, target anchor or route, and whether it is active.
const items = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Home',
    to: '/',
    type: 'link',
    active: route.path === '/' && route.hash === '',
  },
  {
    label: 'Features',
    to: '#features',
    type: 'link',
    active: route.hash === '#features',
  },
  {
    label: 'Why Choose us',
    to: '#whychooseus',
    type: 'link',
    active: route.hash === '#whychooseus',
  },
  // The "How it Works" link is currently disabled in the nav.
  // {
  //   label: 'How it Works',
  //   to: '#howitworks',
  //   type: 'link',
  //   active: route.hash === '#howitworks',
  // },
  {
    label: 'FAQs',
    to: '#faqs',
    type: 'link',
    active: route.hash === '#faqs',
  },
  {
    label: 'Contact us',
    to: '#contactus',
    type: 'link',
    active: route.hash === '#contactus',
  },
])
</script>

<template>
  <!-- Fixed sticky header for landing page navigation. -->
  <section class="fixed w-full border-b border-[#dedede] top-0 z-20 h-(--ui-header-height-mobile) md:h-(--ui-header-height) flex items-center bg-white">
    <section class="w-full mx-5 sm:mx-6 md:mx-8 lg:mx-19 2xl:mx-25 flex gap-6 items-center">
      <!-- Brand logo on the left side of the header. -->
      <div>
        <NuxtImg
          loading="eager"
          src="/images/landing-page/rovel-new-logo.svg"
          alt="Rovelsub point header logo"
          class="w-auto h-10 md:h-16 object-contain"
        />
      </div>

      <!-- Desktop navigation visible on large screens only. -->
      <div class="hidden lg:flex ml-auto">
        <UNavigationMenu
          :items="items"
          variant="link"
          highlight
          highlight-color="primary"
          color="primary"
          :ui="{ linkLabel: 'font-semibold text-[18px] leading-[150%] tracking-[2%]' }"
        />
      </div>

      <!-- Desktop auth buttons: Login and Register. Visible only on large screens. -->
      <div class="items-center gap-4 lg:gap-6 lg:flex font-poppins hidden text-base">
        <UButton
          to="/login"
          size="xl"
          variant="ghost"
          class="w-33.25 h-12 border-[#1177FE] border text-[#1177FE] items-center justify-center rounded-[40px] font-semibold leading-[150%] tracking-[2%]"
          aria-label="Login"
        >
          Login
        </UButton>

        <UButton
          to="/register"
          size="xl"
          class="w-33.25 h-12 bg-[#1177FE] text-white rounded-[40px] font-semibold items-center justify-center leading-[150%] tracking-[2%]"
          aria-label="Sign Up"
        >
          Register
        </UButton>
      </div>

      <!-- Mobile menu button and slide-over drawer for navigation. Visible on smaller screens only. -->
      <div class="lg:hidden ml-auto">
        <USlideover
          v-model:open="menuOpen"
          :close="{
            color: 'primary',
            variant: 'outline',
            class: 'rounded-full',
          }"
          :ui="{
            header: 'justify-between min-h-(--ui-header-height-mobile) md:h-(--ui-header-height)',
          }"
          close-icon="i-lucide-x"
        >
          <!-- Trigger button displayed in the header to open the slide-over menu. -->
          <UButton icon="i-lucide-menu" variant="soft" aria-label="Open SideMenu" />

          <template #header>
            <!-- Mobile drawer header includes logo and close button. -->
            <NuxtImg
              loading="eager"
              src="/images/landing-page/rovel-new-logo.svg"
              alt="Rovelsub point header logo"
              class="w-auto h-10 md:h-16 object-contain"
            />
            <UButton icon="i-lucide-x" color="neutral" variant="ghost" @click="() => { menuOpen = false }" />
          </template>

          <template #body>
            <div class="flex flex-col h-full p-6 gap-6">
              <!-- Vertical navigation for mobile layout. -->
              <UNavigationMenu
                :items="items"
                orientation="vertical"
              />

              <!-- Mobile auth buttons placed at the bottom of the drawer. -->
              <div class="flex flex-col gap-4 mt-auto font-poppins">
                <UButton
                  to="/login"
                  size="xl"
                  variant="ghost"
                  class="w-full h-12 border border-[#1177FE] text-[#1177FE] justify-center rounded-[40px] font-semibold leading-[150%] tracking-[2%]"
                  aria-label="Login"
                >
                  Login
                </UButton>

                <UButton
                  to="/register"
                  size="xl"
                  class="w-full h-12 bg-[#1177FE] text-white justify-center rounded-[40px] font-semibold leading-[150%] tracking-[2%]"
                  aria-label="Register"
                >
                  Register
                </UButton>
              </div>
            </div>
          </template>
        </USlideover>
      </div>
    </section>
  </section>
</template>
