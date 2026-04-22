<script setup lang="ts">
const { getUser } = useAuth()
useSeoMeta({
  title: 'Education',
  // change this description to a more relevant one later
  description: () => `This is a description for the page`,
})
definePageMeta({
  title: 'Education',
  layout: 'dashboard-layout',
  middleware: 'auth',
  keepalive: true,
})

const { data: educationData, error: fetcherror, refresh, status } = await useLazyFetch('/api/education', {
  key: 'Education-list',
  immediate: !!getUser(),
  watch: false,
})

// if (import.meta.client) {
//   const stop = watch(() => getUser(), (user) => {
//     if (user && !availableDiscos.value) {
//       refresh()
//       stop()
//     }
//   }, { immediate: true })
// }
</script>

<template>
  <main>
    <!-- Loading Skeleton when data is fetching from the API -->
    <div v-if="status === 'pending'" class="flex items-center space-x-4">
      <p>loading...</p>
    </div>
    <div v-if="fetcherror" class="flex items-center space-x-4">
      <p>{{ fetcherror }}</p>
      <UButton variant="outline" @click="refresh()">
        Retry
      </UButton>
    </div>
    <section v-else-if="educationData">
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Error tempora atque, quis veritatis delectus iste cumque eligendi. Expedita earum optio sapiente, recusandae repudiandae qui quas dignissimos error iste. Saepe, dicta.</p>
    </section>
  </main>
</template>
