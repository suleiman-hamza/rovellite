<script setup lang="ts">
import useEmblaCarousel from 'embla-carousel-vue'

const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false })
const scrollSnaps = ref([])
const scrollTo = index => emblaApi.value?.scrollTo(index)
const setupSnaps = emblaApi => (scrollSnaps.value = emblaApi.scrollSnapList())

definePageMeta({
  title: 'Subscriptions',
  layout: 'dashboard-layout',
})

watch(
  emblaApi,
  (api) => {
    if (!api)
      return

    setupSnaps(api)
    api.on('reInit', setupSnaps)
  },
  { immediate: true },
)

// const scrollPrev = () => emblaApi.value?.scrollPrev()
// const scrollNext = () => emblaApi.value?.scrollNext()

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
</script>

<template>
  <main>
    <h1>Sub page</h1>
    <div class="border p-2">
      <div class="embla">
        <div ref="emblaRef" class="embla__viewport">
          <div class="embla__container">
            <!-- <div class="embla__slide">
              Slide 1
            </div>
            <div class="embla__slide">
              Slide 2
            </div>
            <div class="embla__slide">
              Slide 3
            </div> -->
            <UPageCard
              v-for="(card, index) in cards"
              :key="index"
              class="embla__slide"
              :ui="{ container: 'p-0 sm:p-0' }"
            >
              <template #default>
                <div class="bg-white p-4 rounded-lg">
                  <div class="flex gap-2 items-center">
                    <span class="bg-[#1177FE] p-2.5 rounded-sm">
                      <NuxtImg :src="card.icon" :alt="card.title" class="w-8 h-8" />
                    </span>
                    <div class="">
                      <p class="text-[20px] font-bold text-[#4D5155]">
                        N0.00
                      </p>
                      <h3 class="text-[14px] md:text-[18px] tracking-[2%] md:tracking-[10%] text-[#676A6D] font-medium">
                        {{ card.title }}
                      </h3>
                    </div>
                  </div>
                </div>
              </template>
            </UPageCard>
          </div>
        </div>

        <div class="embla__dots">
          <button
            v-for="(_, index) in scrollSnaps"
            :key="index"
            class="embla__dot border p-1"
            @click="scrollTo(index)"
          >
            {{ index + 1 }}
          </button>
        </div>
      </div>
    </div>
  </main>
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
</style>
