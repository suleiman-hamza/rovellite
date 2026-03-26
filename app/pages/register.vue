<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'

definePageMeta({
  layout: 'auth-layout',
})

const schema = z.object({
  email: z.email('Invalid email'),
  password: z.string('Password is required').min(8, 'Must be at least 8 characters'),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined,
})

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
  console.warn(event.data)
}
</script>

<template>
  <section class="grid grid-cols-1 md:grid-cols-2">
    <div class="border flex flex-col max-w-md mx-auto my-12 px-5 py-4">
      <NuxtImg
        loading="eager"
        src="/images/landing-page/header-logo.svg"
        alt="Rovelsub point header logo"
        class="h-10 md:h-16 object-contain size-fit"
      />
      <h3 class="text-[#1177FE] tracking-[2%] leading-[150%] font-semibold text-[18px]">
        Create a RovelSub Point Account Today
      </h3>
      <UForm :schema="schema" :state="state" class="space-y-6 border mb-6" @submit="onSubmit">
        <UFormField label="Email" name="email" class="text-[18px] text-[#3A3A3A]">
          <UInput v-model="state.email" size="xl" placeholder="john@gmail.com" :ui="{ base: 'rounded-sm ring-[#5C5B5C] focus-visible:ring-[#1177FE]' }" class="w-full placeholder:text-[#999999]" />
        </UFormField>

        <UFormField label="Password" name="password" class="text-[18px] text-[#3A3A3A]">
          <UInput v-model="state.password" type="password" size="xl" placeholder="john@gmail.com" :ui="{ base: 'rounded-sm ring-[#5C5B5C] focus-visible:ring-[#1177FE]' }" class="w-full placeholder:text-[#999999]" />
        </UFormField>

        <UButton type="submit" size="xl" class="text-center bg-[#1177FE] rounded-full text-white leading-[150%] text-[16px] w-full tracking-[2%] justify-center py-4">
          Sign In
        </UButton>
      </UForm>
      <USeparator label="Or continue with" class="mb-6" />
      <div class="space-y-6">
        <UButton type="submit" variant="outline" size="xl" class="text-center rounded-sm text-[#3A3A3A] leading-[150%] text-[18px] w-full justify-center py-4">
          Countinue with Google
        </UButton>
        <UButton type="submit" size="xl" class="text-center rounded-sm text-[#3A3A3A] leading-[150%] text-[18px] w-full justify-center py-4">
          Countinue with Facebook
        </UButton>
      </div>
    </div>
    <div class="hidden border bg-[#1177FE] min-h-screen relative md:flex items-center justify-center p-4">
      <NuxtImg src="/images/top-left.svg" class="absolute top-0 left-0 z-1" alt="ellipse top" />
      <NuxtImg src="/images/bottom-right.svg" class="absolute bottom-0 right-0 z-0" alt="ellipse bottom" />
      <div class="border font-poppins text-center flex flex-col gap-5 items-center justify-center">
        <NuxtImg src="/images/onboard-hero.png" width="403" height="451" alt="happy rovelsub user" />
        <div>
          <h3 class="font-bold text-2xl text-white leading-[38.17px]">
            Welcome To RovelSub Point
          </h3>
          <p class="text-[14px] text-white leading-[150%]">
            The home of data, airtime,  premium subscriptions, and easy bill payment.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
