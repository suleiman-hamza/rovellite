<script setup lang="ts">
const items = ref([
  {
    name: 'Aisha Bello',
    title: 'Freelancer',
    description: 'RovelSub Point is the perfect choice for individuals, whether you need to buy data, recharge airtime, or pay bills, our platform makes transactions fast, secure, and stress-free.',
    icon: 'i-lucide-smile',
  },
  {
    name: 'Suleiman',
    title: 'Frontend Engineer',
    description: 'RovelSub Point is the perfect choice for organizations, whether managing bulk payments, staff utilities, or business subscriptions, our platform ensures transactions are efficient, reliable, and seamless.',
    icon: 'i-lucide-a-large-small',
  },
  {
    name: 'Chukwuemeka Nwosu',
    title: 'RovelSub Agent',
    description: 'RovelSub Express is the perfect choice for individuals, whether you need to renew subscriptions, recharge your phone, or pay bills, our platform makes transactions quick and hassle-free.',
    icon: 'i-lucide-globe',
  },
  {
    name: 'Justice Odoyi',
    title: 'Softwware Developer',
    description: 'RovelSub Express is the perfect choice for individuals, whether you need to renew subscriptions, recharge your phone, or pay bills, our platform makes transactions quick and hassle-free.',
    icon: 'i-lucide-book',
  },
])
</script>

<template>
  <section class="">
    <UPageSection title="What Our User Say" headline="TESTIMONIAL" :ui="{ title: 'text-left text-[20px] sm:text-[52px] text-[#1A1F24] font-bold', headline: 'text-left size-fit text-[#1177FE] text-[12px] sm:text-[18px] mb-0' }">
      <UCarousel
        v-slot="item"
        loop
        arrows
        dots
        :autoplay="{ delay: 2000 }"
        wheel-gestures
        :prev="{ variant: 'solid' }"
        :next="{ variant: 'solid' }"
        :items="items"
        :ui="{
          item: 'ps-0',
          prev: 'sm:start-8',
          next: 'sm:end-8',
          container: 'ms-0',
          dots: 'border sm:justify-start',
          dot: 'data-[state=active]:bg-[#053169]',

        }"
      >
        <div class="border p-4 rounded-sm bg-white">
          <div class="relative">
            <span class="border"><UIcon :name="item.item.icon" /></span>
            <div class="border p-2">
              <h4>{{ item.item.name }}</h4>
              <h5>{{ item.item.title }}</h5>
              <p>{{ item.item.description }}</p>
            </div>
          </div>
        </div>
      </UCarousel>
    </UPageSection>
  </section>
</template>
