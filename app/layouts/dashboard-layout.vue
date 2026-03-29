<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items: NavigationMenuItem[] = [{
  label: 'Dashboard',
  icon: 'i-lucide-house',
  to: '/app/dashboard',
}, {
  label: 'Inbox',
  icon: 'i-lucide-inbox',
}, {
  label: 'Contacts',
  icon: 'i-lucide-users',
}, {
  label: 'Settings',
  icon: 'i-lucide-settings',
  to: '/app/settings',
}]
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar collapsible resizable :ui="{ footer: 'border-t border-default', header: 'border', body: 'px-0 py-0' }">
      <template #header="{ collapsed }">
        <div v-if="!collapsed" class="w-auto shrink-0 border">
          <NuxtImg
            loading="eager"
            src="/images/landing-page/rovel-new-logo.svg"
            width="100"
            height="100"
            alt="Rovelsub point header logo"
            class=""
          />
        </div>
        <UIcon v-else name="i-simple-icons-nuxtdotjs" class="size-5 text-primary mx-auto" />
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu
          :collapsed="collapsed"
          :items="items"
          orientation="vertical"
          :ui="{ link: 'before:bg-transparent before:rounded-none', linkLeadingIcon: 'text-secondary data-active:border', linkLabel: 'border', item: '' }"
        />
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

<style scoped></style>
