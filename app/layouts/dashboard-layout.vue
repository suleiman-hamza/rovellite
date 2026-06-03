<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
// import type { VirtualAccountResponse } from '../../types/palmpay'

import { useCartStore } from '#imports' // cart store
import { useAuth } from '@/composables/use-auth'
import { useProfileStore } from '@/stores/profile' // profile store

const toast = useToast()
const route = useRoute()

const { signOutUser } = useAuth()

const store = useProfileStore()
const cartStore = useCartStore()

const items: NavigationMenuItem[] = [{
  label: 'Dashboard',
  icon: '/images/icons/dashboard.svg',
  to: '/app/dashboard',
  // active: route.path.startsWith()
}, {
  label: 'Gift cards',
  icon: '/images/icons/giftcard.svg',
  to: '/app/giftCards',
  active: route.path.startsWith('/app/giftCards'),
}, {
  label: 'Data/Internet',
  icon: '/images/icons/data.svg',
  to: '/app/dataInternet',
  active: route.path.startsWith('/app/dataInternet'),
}, {
  label: 'Airtime',
  icon: '/images/icons/airtime.svg',
  to: '/app/airtime',
  active: route.path.startsWith('/app/airtime'),
}, {
  label: 'TV/Decoders',
  icon: '/images/icons/tv-decoder.svg',
  to: '/app/tvDecoders',
  active: route.path.startsWith('/app/tvDecoders'),
}, {
  label: 'Betting',
  icon: '/images/icons/betting.svg',
  to: '/app/betting',
  active: route.path.includes('/app/betting'),
}, {
  label: 'eSim',
  icon: '/images/icons/eSim.svg',
  to: '/app/eSim',
  active: route.path.startsWith('/app/eSim'),
}, {
  label: 'Electricity',
  icon: '/images/icons/electricity.svg',
  to: '/app/electricity',
  active: route.path.startsWith('/app/electricity'),
}, {
  label: 'Education',
  icon: '/images/icons/education.svg',
  to: '/app/education',
  active: route.path.startsWith('/app/education'),
}, {
  label: 'Transportation',
  icon: 'images/icons/transportation.svg',
  to: '/app/transportation',
  active: route.path.startsWith('/app/transportation'),
}, {
  label: 'Solar System',
  icon: '/images/icons/solar.svg',
  to: '/app/solarSystem',
  active: route.path.startsWith('/app/solarSystem'),
}, {
  label: 'Funding History',
  icon: '/images/icons/fundwallet.svg',
  to: '/app/fundingHistory',
  active: route.path.startsWith('/app/fundWallet'),
}, {
  label: 'Transactions',
  icon: '/images/icons/transactions.svg',
  to: '/app/transactions',
  active: route.path.startsWith('/app/transactions'),
}, {
  label: 'Settings',
  icon: '/images/icons/settings.svg',
  to: '/app/settings',
  active: route.path.startsWith('/app/settings'),
}]

const loading = ref(false)
async function logOut() {
  loading.value = true
  try {
    const result = await signOutUser()
    if (!result.success) {
      throw new Error('Logout failed')
    }
    navigateTo('/login')
  }
  catch {
    toast.add({
      title: 'Logout Failed',
      description: 'An error occurred while logging out. Please try again.',
      color: 'error',
    })
  }
  finally {
    loading.value = false
  }
}

const fullName = store.userProfile?.full_name as string

// Trim whitespace and split
const parts = fullName?.trim().split(' ')

// Extract first name and join the rest as the last name
const firstName = parts[0]
// const lastName = parts.slice(1).join(" ");
</script>

<template>
  <UDashboardGroup class="bg-[#F9F9FB]">
    <UDashboardSidebar collapsible :default-size="20" :ui="{ root: 'rounded-r-[40px] bg-white', footer: 'border-t border-default', header: 'flex items-center shrink justify-center p-1', body: 'px-0 py-4' }">
      <template #header="{ collapsed }">
        <div v-if="!collapsed" class="w-auto h-(--ui-header-height) flex items-center justify-center py-2">
          <NuxtImg
            loading="eager"
            src="/images/landing-page/rovel-new-logo.svg"
            width="100"
            height="100"
            alt="Rovelsub point header logo"
            class="w-auto h-20 mx-auto"
          />
        </div>
        <!-- Show a smaller logo when the sidebar is collapsed -->
        <div v-else class="w-auto flex items-center justify-center">
          <NuxtImg
            loading="eager"
            src="/images/landing-page/rovel-new-logo.svg"
            width="100"
            height="100"
            alt="Rovelsub point header logo"
            class="w-auto h-6 mx-auto"
          />
        </div>
      </template>
      <template #default="{ collapsed }">
        <nav class="font-poppins">
          <ul>
            <li v-for="item in items" :key="item.label">
              <NuxtLink v-if="collapsed" :to="item.to" class="flex gap-2 items-center p-2 text-sm font-medium text-gray-700 truncate">
                <NuxtImg :src="item.icon" :alt="item.label" width="30" height="30" class="w-5 h-5" />
              </NuxtLink>
              <NuxtLink v-else :to="item.to" class="flex gap-2 items-center px-6 p-2 text-sm font-medium text-gray-700 truncate">
                <NuxtImg :src="item.icon" :alt="item.label" width="30" height="30" class="w-6 h-6" />
                <span class="text-[20px]">{{ item.label }}</span>
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </template>

      <template #footer="{ collapsed }">
        <UButton :label="collapsed ? undefined : 'Log Out'" icon="i-lucide-log-out" variant="ghost" :loading :ui="{ label: 'text-[#676A6D]', leadingIcon: 'text-[#676A6D]' }" class="w-full justify-center" @click="logOut" />
      </template>
    </UDashboardSidebar>
    <UDashboardPanel resizable class="font-poppins">
      <template #header>
        <UDashboardNavbar>
          <template #title>
            <span class="text-[16px] md:text-[24px] font-normal">
              Welcome, <span class="text-[#1177FE] font-bold uppercase">{{ firstName }}</span>
            </span>
          </template>
          <template #leading>
            <UDashboardSidebarCollapse />
          </template>
          <template #right>
            <div class="gap-3 flex">
              <UChip size="3xl" color="error" :text="cartStore.cartItemCount > 0 ? cartStore.cartItemCount : undefined">
                <UButton icon="i-lucide-shopping-cart" to="/app/cart" active active-color="primary" size="lg" active-class="text-white" inactive-class="bg-secondary" class="p-2">
                  <span class="hidden sm:inline font-semibold text-[16px] tracking-[2%]">My Cart</span>
                </UButton>
              </UChip>
              <UUser
                :avatar="{
                  // src: store.userProfile?.avatar_url,
                  loading: 'lazy',
                  icon: 'i-lucide-image',
                }"
                :ui="{ avatar: 'border border-primary' }"
              />
            </div>
          </template>
        </UDashboardNavbar>
      </template>

      <template #body>
        <slot />
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>

<style scoped>
.scroll {
  scrollbar-width: thin;
}
.router-link-active {
  font-weight: 900;
  color: #34383D;
  background-color: #F2FBFF;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 8px;
    background-color: #1177FE;
  }
}

.cart-active.router-link-exact-active {
  background-color: #3b82f6 !important; /* Example Blue */
  color: white !important;
}
</style>
