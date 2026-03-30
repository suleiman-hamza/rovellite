<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items: NavigationMenuItem[] = [{
  label: 'Dashboard',
  icon: 'i-lucide-house',
  to: '/app/dashboard',
}, {
  label: 'Subscriptions',
  icon: 'i-lucide-inbox',
}, {
  label: 'eSim',
  icon: 'i-lucide-inbox',
}, {
  label: 'Gift cards',
  icon: 'i-lucide-inbox',
}, {
  label: 'Data/Internet',
  icon: 'i-lucide-inbox',
}, {
  label: 'Airtime',
  icon: 'i-lucide-inbox',
}, {
  label: 'TV/Decoders',
  icon: 'i-lucide-inbox',
}, {
  label: 'Betting',
  icon: 'i-lucide-inbox',
}, {
  label: 'eSim',
  icon: 'i-lucide-inbox',
}, {
  label: 'Electricity',
  icon: 'i-lucide-users',
}, {
  label: 'Education',
  icon: 'i-lucide-settings',
  to: '/',
}, {
  label: 'Solar System',
  icon: 'i-lucide-settings',
  to: '/',
}, {
  label: 'Fund wallet',
  icon: 'i-lucide-settings',
  to: '/',
}, {
  label: 'Transactions',
  icon: 'i-lucide-settings',
  to: '/',
}, {
  label: 'Settings',
  icon: 'i-lucide-settings',
  to: '/app/settings',
}]
</script>

<template>
  <UDashboardGroup class="bg-[#F9F9FB]">
    <UDashboardSidebar collapsible resizable :ui="{ root: 'rounded-r-[16px] bg-white', footer: 'border-t border-default', header: 'flex items-center shrink justify-center p-1', body: 'px-0 py-0' }">
      <template #header="{ collapsed }">
        <div v-if="!collapsed" class="w-auto border h-(--ui-header-height) flex items-center justify-center py-2">
          <NuxtImg
            loading="eager"
            src="/images/landing-page/rovel-new-logo.svg"
            width="100"
            height="100"
            alt="Rovelsub point header logo"
            class="w-auto h-20 mx-auto"
          />
        </div>
      </template>
      <template #default="{ collapsed }">
        <nav class="border">
          <ul>
            <li v-for="item in items" :key="item.label">
              <NuxtLink :to="item.to" class="flex items-center p-2 text-sm font-medium text-gray-700 truncate">
                <UIcon :name="item.icon" class="mr-2" />
                {{ item.label }}
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
        <UButton :label="collapsed ? undefined : 'Log Out'" icon="i-lucide-log-out" variant="ghost" :ui="{ label: 'text-[#676A6D]', leadingIcon: 'text-[#676A6D]' }" class="w-full justify-center" />
      </template>
    </UDashboardSidebar>
    <UDashboardPanel resizable>
      <template #header>
        <UDashboardNavbar title="Welcome Back Rovel">
          <template #leading>
            <UDashboardSidebarCollapse />
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
* {
  scrollbar-width: thin;
}
.router-link-active {
  font-weight: 900;
  color: #34383D;
  background-color: #F2FBFF;
}
</style>
