<script setup lang="ts">
const cards = ref([
  {
    title: 'Wallet Balance',
    icon: '/images/icons/wallet-ballance.svg',
  },
  {
    title: 'Wallet In',
    icon: '/images/icons/wallet-in.svg',
  },
  {
    title: 'Wallet Out',
    icon: '/images/icons/wallet-out.svg',
  },
])
const cards2 = ref([
  {
    title: 'Icons',
  },
  {
    title: 'Fonts',
  },
  {
    title: 'Color Mode',
  },
  {
    title: 'Color',
  },
])
</script>

<template>
  <main>
    <UPageGrid class="bg-[#1177FE] p-4">
      <UPageCard
        v-for="(card, index) in cards"
        :key="index"
        :ui="{ container: 'p-0 sm:p-0' }"
      >
        <template #default>
          <div class="bg-white p-4 rounded-lg">
            <div class="border flex gap-1 items-center">
              <span class="bg-[#1177FE] p-2">
                <NuxtImg :src="card.icon" :alt="card.title" class="w-10 h-10" />
              </span>
              <div class="border">
                <h3 class="text-[14px] text-[#1177FE] font-medium">
                  {{ card.title }}
                </h3>
                <p class="text-[20px] font-bold">
                  N0.00
                </p>
              </div>
            </div>
          </div>
        </template>
      </UPageCard>
    </UPageGrid>
    <UPageGrid :ui="{ base: 'lg:grid-cols-4' }" class="bg-[#FFFFFF] p-2">
      <UPageCard
        v-for="(card, index) in cards2"
        :key="index"
        v-bind="card"
        :ui="{ container: 'bg-[#F9F9FB]' }"
      />
    </UPageGrid>
  </main>
</template>
