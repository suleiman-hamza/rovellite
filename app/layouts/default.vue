<script setup lang="ts">
</script>

<template>
  <div>
    <AppHeader />
    <main class="md:mt-(--ui-header-height)  mt-(--ui-header-height-mobile)">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
