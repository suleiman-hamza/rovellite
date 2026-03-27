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
    <div class="flex flex-col max-w-md mx-auto md:my-12 px-5 py-4">
      <NuxtImg
        loading="eager"
        src="/images/landing-page/rovel-new-logo.svg"
        width="100"
        height="100"
        alt="Rovelsub point header logo"
        class="w-30 object-contain size-fit mb-6"
      />
      <h3 class="text-[#1177FE] tracking-[2%] leading-[150%] font-semibold text-[18px] mb-4">
        Sign In To Your RovelSub Point Account Today
      </h3>
      <UForm :schema="schema" :state="state" class="space-y-6 mb-6" @submit="onSubmit">
        <UFormField label="Email" name="email" :ui="{ label: 'font-normal text-[18px] text-[#3A3A3A]' }">
          <UInput v-model="state.email" size="xl" placeholder="john@gmail.com" :ui="{ base: 'rounded-sm ring-[#5C5B5C] focus-visible:ring-[#1177FE]' }" class="w-full placeholder:text-[#999999]" />
        </UFormField>

        <UFormField label="Password" name="password" :ui="{ label: 'font-normal text-[18px] text-[#3A3A3A]' }">
          <UInput v-model="state.password" type="password" size="xl" placeholder="john@gmail.com" :ui="{ base: 'rounded-sm ring-[#5C5B5C] focus-visible:ring-[#1177FE]' }" class="w-full placeholder:text-[#999999]" />
        </UFormField>

        <UButton type="submit" size="lg" class="text-center bg-[#1177FE] rounded-full text-white leading-[150%] text-[16px] w-full tracking-[2%] justify-center py-3">
          Sign In
        </UButton>
      </UForm>
      <USeparator label="Or continue with" :ui="{ container: 'text-[#858585]', label: 'text-[#5D5B5C]' }" class="mb-6 tracking-[2%]" />
      <div class="space-y-5">
        <UButton type="submit" variant="outline" size="lg" :ui="{ base: 'ring-[#5D5B5C]' }" class="text-center rounded-sm text-[#3A3A3A] leading-[150%] text-[18px] w-full justify-center py-3">
          <template #leading>
            <NuxtImg src="/images/Google.svg" alt="google svg icon" />
          </template>
          Countinue with Google
        </UButton>
        <UButton type="submit" variant="outline" size="lg" :ui="{ base: 'ring-[#5D5B5C]' }" class="text-center rounded-sm text-[#3A3A3A] leading-[150%] text-[18px] w-full justify-center py-3">
          <template #leading>
            <NuxtImg src="/images/facebook.svg" alt="facebook svg icon" />
          </template>
          Countinue with Facebook
        </UButton>
        <p class="text-center md:text-right text-[18px] leading-[150%] font-normal text-[#ADADAD]">
          Don't have an account? <NuxtLink to="/register" class="text-[#1177FE]">
            Register
          </NuxtLink>
        </p>
      </div>
    </div>
    <div class="hidden bg-[#1177FE] min-h-screen relative md:flex items-center justify-center p-4">
      <NuxtImg src="/images/top-left.svg" class="absolute top-0 left-0 z-1" alt="ellipse top" />
      <NuxtImg src="/images/bottom-right.svg" class="absolute bottom-0 right-0 z-0" alt="ellipse bottom" />
      <div class="font-poppins text-center flex flex-col gap-5 items-center justify-center">
        <NuxtImg src="/images/onboard-hero.png" width="403" height="451" alt="happy rovelsub user" />
        <div class="relative max-w-md">
          <span class="absolute -bottom-10 left-10">
            <NuxtImg src="/images/landing-page/lightbluediamondborder.svg" class="w-5 h-5 md:h-8 md:w-8" />
          </span>
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
