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
  <div class="border p-2">
    <div class="embla bg-[#1177FE] p-4 rounded-[20.75px]">
      <div ref="emblaRef" class="embla__viewport">
        <div class="embla__container">
          <UPageCard
            v-for="(card, index) in cards"
            :key="index"
            class="embla__slide rounded-none bg-[#1177FE] ring-0"
            :ui="{ container: 'p-0 sm:p-0 rounded-none bg-transparent', root: 'ring-0' }"
          >
            <template #default>
              <div class="bg-white p-4 rounded-[20px]">
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
        <UIcon name="i-lucide-circle-small" />
      </button>
    </div>
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
  opacity: 1;
}
</style>
