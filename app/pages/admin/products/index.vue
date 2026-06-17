<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'

definePageMeta({
  title: 'Products',
  layout: 'admin',
  keepalive: true,
})

const tabItems: TabsItem[] = [
  { label: 'Gift Cards', value: 'gift-cards' },
  { label: 'Data', value: 'data' },
  { label: 'Airtime', value: 'airtime' },
  { label: 'TV/Decoders', value: 'tv-decoders' },
  { label: 'Betting', value: 'betting' },
  { label: 'eSim', value: 'esim' },
  { label: 'Electricity', value: 'electricity' },
  { label: 'Education', value: 'education' },
  { label: 'Transportation', value: 'transportation' },
  { label: 'Solar System', value: 'solar-system' },
]

const categoryFilters = ['All', 'Games', 'Entertainment', 'Electronics', 'Fashion', 'Food', 'Cinema']
const activeCategory = ref('All')

interface Product {
  name: string
}

interface ProductSection {
  title: string
  category: string
  products: Product[]
}

const giftCardSections: ProductSection[] = [
  {
    title: 'Movie & TV Streaming',
    category: 'Entertainment',
    products: [
      { name: 'Netflix' },
      { name: 'Prime Video' },
      { name: 'YouTube' },
      { name: 'Disney+' },
      { name: 'Apple TV' },
      { name: 'Hulu' },
      { name: 'Crunchyroll' },
      { name: 'Paramount+' },
      { name: 'Showtime' },
      { name: 'HBO Max' },
      { name: 'Peacock' },
    ],
  },
  {
    title: 'Music & Audio',
    category: 'Entertainment',
    products: [
      { name: 'Apple Music' },
      { name: 'Spotify' },
      { name: 'Amazon Music' },
      { name: 'Deezer' },
      { name: 'Tidal' },
      { name: 'Audible' },
      { name: 'Pandora' },
    ],
  },
  {
    title: 'Professional Tools and Storage',
    category: 'Electronics',
    products: [
      { name: 'Office 365' },
      { name: 'Canva' },
      { name: 'Grammarly' },
      { name: 'QuillBot' },
      { name: 'ChatGPT' },
      { name: 'PIA VPN' },
      { name: 'Freepik' },
      { name: 'Adobe Creative Cloud' },
      { name: 'Dropbox' },
      { name: 'Adobe Creative Cloud' },
      { name: 'Evernote' },
      { name: 'Google One' },
      { name: 'iCloud' },
    ],
  },
  {
    title: 'Gaming',
    category: 'Games',
    products: [
      { name: 'PlayStation Plus' },
      { name: 'Xbox Game Pass' },
      { name: 'Nintendo' },
      { name: 'Roblox' },
      { name: 'Google Play' },
      { name: 'Minecraft Realms' },
      { name: 'Riot Games' },
      { name: 'Fortnite' },
      { name: 'FC 26' },
      { name: 'NBA 2K26' },
      { name: 'Warzone' },
      { name: 'Apex Legends' },
      { name: 'Destiny 2' },
      { name: 'Overwatch 2' },
      { name: 'The Sims 4' },
      { name: 'Madden NFL' },
      { name: 'Elden Ring' },
      { name: 'World of Warcraft' },
      { name: 'Free Fire' },
      { name: 'Steam' },
      { name: 'PUBG' },
      { name: 'Genshin Impact' },
      { name: 'Honkai: Star Rail' },
      { name: 'Mobile Legends' },
      { name: 'Clash of Clans' },
      { name: 'Google Play Pass' },
      { name: 'Pokémon GO' },
      { name: 'Candy Crush' },
      { name: 'Coin Master' },
      { name: 'Diablo Immortal' },
      { name: 'Apple Arcade' },
      { name: 'Among Us' },
    ],
  },
]

const filteredSections = computed(() => {
  if (activeCategory.value === 'All')
    return giftCardSections
  return giftCardSections.filter(s => s.category === activeCategory.value)
})
</script>

<template>
  <main class="bg-white rounded-[20px] p-4">
    <UTabs
      :items="tabItems"
      default-value="gift-cards"
      variant="link"
      color="primary"
      :ui="{
        list: 'overflow-x-auto scrollbar-hide flex-nowrap',
        trigger: 'whitespace-nowrap shrink-0 font-medium',
      }"
      class="w-full"
    >
      <template #content="{ item }">
        <div class="pt-4">
          <!-- Gift Cards Tab -->
          <template v-if="item.value === 'gift-cards'">
            <!-- Category Filter Pills -->
            <div class="flex flex-wrap gap-2 mb-6">
              <UButton
                v-for="cat in categoryFilters"
                :key="cat"
                :label="cat"
                size="sm"
                :color="activeCategory === cat ? 'primary' : 'neutral'"
                :variant="activeCategory === cat ? 'solid' : 'outline'"
                class="rounded-full"
                @click="activeCategory = cat"
              />
            </div>

            <!-- Product Sections -->
            <div v-if="filteredSections.length" class="flex flex-col gap-8">
              <div v-for="section in filteredSections" :key="section.title">
                <h3 class="text-primary font-semibold text-[15px] mb-4">
                  {{ section.title }}
                </h3>
                <div class="grid grid-cols-[repeat(auto-fill,minmax(82px,1fr))] gap-x-3 gap-y-4">
                  <div
                    v-for="(product, i) in section.products"
                    :key="`${section.title}-${i}`"
                    class="flex flex-col items-center gap-1.5"
                  >
                    <USkeleton class="w-full aspect-square rounded-xl" />
                    <span class="text-[11px] text-[#6B7280] leading-tight line-clamp-2 text-center w-full px-0.5">
                      {{ product.name }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="py-16 text-center text-[#9CA3AF] text-sm">
              No products in this category.
            </div>
          </template>

          <!-- Other Tabs Placeholder -->
          <template v-else>
            <div class="py-16 text-center text-[#9CA3AF] text-sm">
              Coming soon.
            </div>
          </template>
        </div>
      </template>
    </UTabs>
  </main>
</template>
