<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import type { SignupInput } from '~~/shared/validations/auth'
import { signupSchema } from '~~/shared/validations/auth'

import { useAuth } from '@/composables/use-auth' // firebase auth store
import { mapFirebaseError } from '@/utils/firebase-error'

useSeoMeta({ title: 'Welcome - Get Started' })
definePageMeta({
  layout: 'auth-layout',
})

const toast = useToast()
const { signUp } = useAuth()

interface PhoneCode {
  name: string
  code: string
  emoji?: string
  dialCode: string
  mask: string
}

const countryCode = ref('NG')

const { data: phoneCodes, status, execute } = await useLazyFetch<PhoneCode[]>('/api/phone-codes.json', {
  key: 'api-phone-codes',
  immediate: false,
})

const country = computed(() => phoneCodes.value?.find(c => c.code === countryCode.value))
const dialCode = computed(() => country.value?.dialCode || '+234')
const mask = computed(() => country.value?.mask || '### ### ####')

function onOpen() {
  if (!phoneCodes.value?.length) {
    execute()
  }
}

const loading = ref(false)

const state = reactive<Partial<SignupInput>>({
  full_name: '',
  email: '',
  phone: '',
  location: 'Nigeria',
  referralCode: '',
  password: '',
  confirmPassword: '',
})

watch(countryCode, () => {
  state.phone = ''
})

async function onSubmit(event: FormSubmitEvent<SignupInput>) {
  try {
    loading.value = true
    await signUp(event.data)

    toast.add({
      title: 'Registration Successful',
      description: 'You have successfully registered, verify your email to continue.',
    })

    await navigateTo('/login') // Redirect to login
  }
  catch (error: any) {
    loading.value = false
    const message = error.statusMessage || mapFirebaseError(error)
    displayError(message)
  }
  finally {
    loading.value = false
  }
}

function displayError(error: any) {
  toast.add({
    title: 'Error',
    description: error,
  })
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
        Create a RovelSub Point Account Today
      </h3>
      <UForm :schema="signupSchema" :state="state" class="space-y-6 mb-6" @submit="onSubmit">
        <UFormField label="Full Name" name="full_name" :ui="{ label: 'font-normal text-[18px] text-[#3A3A3A]' }">
          <UInput v-model="state.full_name" size="xl" placeholder="" :ui="{ base: 'rounded-sm ring-[#5C5B5C] focus-visible:ring-[#1177FE]' }" class="w-full placeholder:text-[#999999]" />
        </UFormField>

        <UFormField label="Phone Number" name="phone" :ui="{ label: 'font-normal text-[18px] text-[#3A3A3A]' }">
          <UFieldGroup class="w-full">
            <USelectMenu
              v-model="countryCode"
              :items="phoneCodes"
              size="xl"
              value-key="code"
              :search-input="{
                placeholder: 'Search country...',
                icon: 'i-lucide-search',
                loading: status === 'pending',
              }"
              :filter-fields="['name', 'code', 'dialCode']"
              :content="{ align: 'start' }"
              :ui="{
                base: 'pe-8',
                content: 'w-48',
                placeholder: 'hidden',
                trailingIcon: 'size-4',
              }"
              trailing-icon="i-lucide-chevrons-up-down"
              @update:open="onOpen"
            >
              <span class="size-5 flex items-center text-lg">
                {{ country?.emoji || '\u{1F1FA}\u{1F1F8}' }}
              </span>

              <template #item-leading="{ item }">
                <span class="size-5 flex items-center text-lg">
                  {{ item.emoji }}
                </span>
              </template>

              <template #item-label="{ item }">
                {{ item.name }} ({{ item.dialCode }})
              </template>
            </USelectMenu>

            <UInput
              v-model="state.phone"
              v-maska="mask"
              type="tel"
              size="xl"
              :placeholder="mask.replaceAll('#', '_')"
              :style="{ '--dial-code-length': `${dialCode.length + 1.5}ch` }"
              class="w-full placeholder:text-[#999999]"
              :ui="{
                base: 'ps-(--dial-code-length) rounded-sm ring-[#5C5B5C] focus-visible:ring-[#1177FE]',
                leading: 'pointer-events-none text-base md:text-sm text-muted',
              }"
            >
              <template #leading>
                {{ dialCode }}
              </template>
            </UInput>
          </UFieldGroup>
        </UFormField>

        <UFormField label="Email" name="email" :ui="{ label: 'font-normal text-[18px] text-[#3A3A3A]' }">
          <UInput v-model="state.email" size="xl" placeholder="john@gmail.com" :ui="{ base: 'rounded-sm ring-[#5C5B5C] focus-visible:ring-[#1177FE]' }" class="w-full placeholder:text-[#999999]" />
        </UFormField>

        <UFormField label="Password" name="password" :ui="{ label: 'font-normal text-[18px] text-[#3A3A3A]' }">
          <UInput v-model="state.password" type="password" size="xl" :ui="{ base: 'rounded-sm ring-[#5C5B5C] focus-visible:ring-[#1177FE]' }" class="w-full placeholder:text-[#999999]" />
        </UFormField>

        <UFormField label="Confirm Password" name="confirmPassword" :ui="{ label: 'font-normal text-[18px] text-[#3A3A3A]' }">
          <UInput v-model="state.confirmPassword" type="password" size="xl" :ui="{ base: 'rounded-sm ring-[#5C5B5C] focus-visible:ring-[#1177FE]' }" class="w-full placeholder:text-[#999999]" />
        </UFormField>

        <UFormField label="Referral Code" hint="Optional" name="referralCode" :ui="{ label: 'font-normal text-[18px] text-[#3A3A3A]' }">
          <UInput v-model="state.referralCode" size="xl" placeholder="xyz123" :ui="{ base: 'rounded-sm ring-[#5C5B5C] focus-visible:ring-[#1177FE]' }" class="w-full placeholder:text-[#999999]" />
        </UFormField>

        <UButton type="submit" size="lg" :loading class="text-center bg-[#1177FE] rounded-full text-white leading-[150%] text-[16px] w-full tracking-[2%] justify-center py-3">
          Register
        </UButton>
      </UForm>

      <div class="">
        <p class="text-center md:text-right text-[18px] leading-[150%] font-normal text-[#ADADAD]">
          Already have an account? <NuxtLink to="/login" class="text-[#1177FE]">
            Sign In
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
