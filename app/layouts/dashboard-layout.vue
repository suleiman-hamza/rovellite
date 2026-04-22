<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
// import type { VirtualAccountResponse } from '../../types/palmpay'

import { useAuth } from '@/composables/use-auth'
import { useProfileStore } from '@/stores/profile'

const toast = useToast()

const { signOutUser } = useAuth()

const store = useProfileStore()

const items: NavigationMenuItem[] = [{
  label: 'Dashboard',
  icon: '/images/icons/dashboard.svg',
  to: '/app/dashboard',
}, {
  label: 'Gift cards',
  icon: '/images/icons/giftcard.svg',
  to: '/app/giftCards',
}, {
  label: 'Data/Internet',
  icon: '/images/icons/data.svg',
  to: '/app/dataInternet',
}, {
  label: 'Airtime',
  icon: '/images/icons/airtime.svg',
  to: '/app/airtime',
}, {
  label: 'TV/Decoders',
  icon: '/images/icons/tv-decoder.svg',
  to: '/app/tvDecoders',
}, {
  label: 'Betting',
  icon: '/images/icons/betting.svg',
  to: '/app/betting',
}, {
  label: 'eSim',
  icon: '/images/icons/eSim.svg',
  to: '/app/eSim',
}, {
  label: 'Electricity',
  icon: '/images/icons/electricity.svg',
  to: '/app/electricity',
}, {
  label: 'Education',
  icon: '/images/icons/education.svg',
  to: '/app/education',
}, {
  label: 'Transportation',
  icon: 'images/icons/transportation.svg',
  to: '/app/transportation',
}, {
  label: 'Solar System',
  icon: '/images/icons/solar.svg',
  to: '/app/solarSystem',
}, {
  label: 'Fund wallet',
  icon: '/images/icons/fundwallet.svg',
  to: '/app/fundWallet',
}, {
  label: 'Transactions',
  icon: '/images/icons/transactions.svg',
  to: '/app/transactions',
}, {
  label: 'Settings',
  icon: '/images/icons/settings.svg',
  to: '/app/settings',
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
</script>

<template>
  <UDashboardGroup class="bg-[#F9F9FB]">
    <UDashboardSidebar collapsible :default-size="20" :ui="{ root: 'rounded-r-[16px] bg-white', footer: 'border-t border-default', header: 'flex items-center shrink justify-center p-1', body: 'px-0 py-4' }">
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
                <NuxtImg :src="item.icon" :alt="item.label" width="30" height="30" class="w-8 h-8" />
                <span class="text-[20px]">{{ item.label }}</span>
              </NuxtLink>
            </li>
          </ul>
        </nav>
        <!-- <UNavigationMenu
          :collapsed="collapsed"
          :items="items"
          orientation="vertical"
          :ui="{ link: 'before:bg-transparent before:rounded-none', linkLeadingIcon: 'text-secondary data-active:border', linkLabel: 'border', item: '' }"
        /> -->
      </template>

      <template #footer="{ collapsed }">
        <UButton :label="collapsed ? undefined : 'Log Out'" icon="i-lucide-log-out" variant="ghost" :loading :ui="{ label: 'text-[#676A6D]', leadingIcon: 'text-[#676A6D]' }" class="w-full justify-center" @click="logOut" />
      </template>
    </UDashboardSidebar>
    <UDashboardPanel resizable class="font-poppins">
      <template #header>
        <UDashboardNavbar>
          <template #title>
            <span class="text-[16px] md:text-[24px] text-[#1177FE] font-normal">
              Welcome Back, <span class="font-bold uppercase">{{ store.userProfile?.full_name }}</span>
            </span>
          </template>
          <template #leading>
            <UDashboardSidebarCollapse />
          </template>
          <template #right>
            <div class="sm:flex gap-3 hidden">
              <UPopover
                arrow
                :content="{
                  align: 'center',
                  side: 'bottom',
                  sideOffset: 8,
                }"
              >
                <UChip :text="5" color="error" inset size="3xl">
                  <UButton icon="i-lucide-bell" size="md" color="primary" variant="ghost" :ui="{ leadingIcon: 'text-[#4D5155]' }" />
                </UChip>

                <template #content>
                  <UEmpty title="No Notification found" />
                </template>
              </UPopover>
              <!-- <UChip :text="5" color="error" inset size="3xl">
                <UButton icon="i-lucide-mail" size="md" color="primary" variant="ghost" :ui="{ leadingIcon: 'text-[#4D5155]' }" />
              </UChip> -->
              <UButton icon="i-lucide-shopping-cart" size="lg" variant="solid" :ui="{ base: 'bg-[#E6E6E7] text-[#4D5155]' }">
                <span class="hidden sm:inline text-[#4D5155] font-semibold text-[16px] tracking-[2%]">My Cart</span>
              </UButton>
              <UUser
                :name="store.userProfile?.full_name" :avatar="{
                  src: store.userProfile?.avatar_url || 'https://i.pravatar.cc/150?u=john-doe',
                  loading: 'lazy',
                  icon: 'i-lucide-image',
                }"
              />
            </div>
            <UChip :text="5" color="error" inset size="3xl" class="sm:hidden">
              <UButton icon="i-lucide-bell" size="md" color="primary" variant="ghost" :ui="{ leadingIcon: 'text-[#4D5155]' }" />
            </UChip>
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
</style>
