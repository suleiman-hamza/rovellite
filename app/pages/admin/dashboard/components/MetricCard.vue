<script setup lang="ts">
import useEmblaCarousel from 'embla-carousel-vue'

const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false })
const scrollSnaps = ref([])
const selectedSnap = ref(0)

const scrollTo = (index: number) => emblaApi.value?.scrollTo(index)
const setupSnaps = (emblaApi: any) => (scrollSnaps.value = emblaApi.scrollSnapList())

function setActiveSnap(emblaApi: any) {
  return selectedSnap.value = emblaApi.selectedScrollSnap()
}

watch(
  emblaApi,
  (api) => {
    if (!api)
      return

    setupSnaps(api)
    setActiveSnap(api)

    api.on('reInit', setupSnaps)
    api.on('reInit', setActiveSnap)
    api.on('select', setActiveSnap)
    api.on('reInit', setupSnaps)
  },
  { immediate: true },
)

const cards = ref([
  {
    title: 'Total Expenses',
    icon: '/images/admin-dashboard/admin-wallet-expense.svg',
    bgColor: 'bg-[#FBABAB]',
    value: '20,000',
  },
  {
    title: 'Total Profit',
    icon: '/images/admin-dashboard/admin-wallet-profit.svg',
    bgColor: 'bg-[#1ED760]',
    value: '50,000',
  },
  {
    title: 'Total Products',
    icon: '/images/admin-dashboard/admin-total-prd-white.svg',
    bgColor: 'bg-[#F9DB3F]',
    value: '20',
  },
])

// const { data, error } = useFetch('/api/wallet')
const isAmountVisible = ref(true)
// const balance = ref(12550.50)

function toggleAmountVisibility() {
  isAmountVisible.value = !isAmountVisible.value
}
</script>

<template>
  <div class="rounded-[20.75px] p-4 bg-[#1177FE]">
    <section class="sm:hidden">
      <div class="embla rounded-[20.75px]">
        <div ref="emblaRef" class="embla__viewport">
          <div class="embla__container">
            <UPageCard
              v-for="(card, index) in cards"
              :key="index"
              class="embla__slide rounded-none bg-[#1177FE] ring-0"
              :ui="{ container: 'p-0 sm:p-0 rounded-none bg-transparent', root: 'ring-0' }"
            >
              <template #default>
                <div class="bg-white p-3 rounded-[20px]">
                  <div class="flex gap-2.5 items-center">
                    <!-- wallet icon -->
                    <span :class="card.bgColor" class="p-3 rounded-[8px]">
                      <NuxtImg :src="card.icon" :alt="card.title" class="w-7 h-7" />
                    </span>
                    <!-- wallet balance -->
                    <div class="truncate">
                      <p class="text-[18px] font-bold text-[#4D5155]">
                        {{ card.value }}
                      </p>
                      <h3 class="text-[16px] md:text-[18px] tracking-[5%] md:tracking-[10%] text-[#676A6D] font-regular">
                        {{ card.title }}
                      </h3>
                    </div>
                    <!-- wallet actions show or hide balance -->
                    <div class="ml-auto">
                      <UButton variant="soft" class="rounded-full" :ui="{ base: 'p-2 bg-[#DBF4FF]' }" @click="toggleAmountVisibility">
                        <UIcon v-if="isAmountVisible" name="i-lucide-eye" class="bg-[#34383D] size-5" />
                        <UIcon v-else name="i-lucide-eye-off" class="bg-[#34383D] size-5" />
                      </UButton>
                    </div>
                  </div>
                </div>
              </template>
            </UPageCard>
          </div>
        </div>
      </div>
      <div class="embla__dots flex gap-1 justify-center mt-3">
        <button
          v-for="(_, index) in scrollSnaps"
          :key="index"
          :class="[
            index === selectedSnap ? 'embla__dot--selected' : '',
          ]"
          class="embla__dot p-0 leading-0"
          @click="scrollTo(index)"
        >
          <UIcon name="i-lucide-circle-small" class="bg-[#8fd3f0]" />
        </button>
      </div>
    </section>
    <!-- desktop view -->
    <section class="hidden sm:block">
      <UPageGrid class="bg-[#1177FE] px-3 py-2 rounded-[20px] gap-4">
        <UPageCard
          v-for="(card, index) in cards"
          :key="index"
          class="bg-white rounded-[20px] px-2 py-3.5"
          :ui="{ container: 'p-0 sm:p-0 rounded-[20px]' }"
        >
          <template #default>
            <div class="rounded-[20px]">
              <div class="flex gap-2 items-center relative">
                <span :class="card.bgColor" class="p-2.5 rounded-[8px]">
                  <NuxtImg :src="card.icon" :alt="card.title" class="w-8 h-8" />
                </span>
                <div class="truncate">
                  <p class="text-[20px] font-bold text-[#4D5155]">
                    {{ card.value }}
                  </p>
                  <h3 class="text-[14px] md:text-[16px] lg:text-[18px] tracking-[2%] md:tracking-[10%] text-[#676A6D] font-medium">
                    {{ card.title }}
                  </h3>
                </div>
                <!-- wallet actions show or hide balance -->
                <div class="absolute top-2 right-0 p-0.5 h-fit">
                  <UButton variant="soft" class="rounded-full" :ui="{ base: 'p-1.5 bg-[#DBF4FF]' }" @click="toggleAmountVisibility">
                    <UIcon v-if="isAmountVisible" name="i-lucide-eye" class="bg-[#34383D] size-5" />
                    <UIcon v-else name="i-lucide-eye-off" class="bg-[#34383D] size-5" />
                  </UButton>
                </div>
              </div>
            </div>
          </template>
        </UPageCard>
      </UPageGrid>
    </section>
  </div>
</template>

<style scoped>
.embla__viewport {
  overflow: hidden;
}

.embla__container {
  display: flex;
  touch-action: pan-y pinch-zoom;
}

.embla__slide {
  flex: 0 0 100%;
  min-width: 0;
}

.embla__dot {
  opacity: 0.5;
}

.embla__dot--selected {
  background-color: #fff;
  border-radius: 50%;
  opacity: 1;
}
</style>
