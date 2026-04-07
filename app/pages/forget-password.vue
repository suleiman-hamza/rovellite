<script setup lang="ts">
import z from 'zod'

definePageMeta({
  layout: 'auth-layout',
})
useSeoMeta({
  title: 'Forgot Password',
})

const step = ref<'email' | 'otp'>('email')
const loading = ref(false)

const emailSchema = z.email('Enter a valid email address')
const emailState = ref('')

// cross check otp schema later
const otpSchema = z.number('enter a valid otp')
const otpState = ref()

function sendCode() {
  loading.value = true
  try {
    step.value = 'otp'
  }
  catch (error) {
    console.warn('Error sending code:', error)
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="grid grid-cols-1 md:grid-cols-2 min-h-full">
    <div class="h-full flex justify-center items-center">
      <div class="flex flex-col w-full max-w-md mx-auto my-auto px-5 py-4">
        <div class="flex justify-center md:justify-start">
          <NuxtImg
            loading="eager"
            src="/images/landing-page/rovel-new-logo.svg"
            width="100"
            height="100"
            alt="Rovelsub point header logo"
            class="w-30 object-contain size-fit mb-6"
          />
        </div>
        <h3 class="text-[#1177FE] tracking-[2%] leading-[150%] font-semibold text-[18px] mb-4">
          Forgot Password
        </h3>
        <div v-if="step === 'email'">
          <p class="text-[18px] leading-[150%] font-normal text-[#34383D] mb-4">
            Enter your email used for your registration to receive a verification code.
          </p>
          <UForm :state="emailState" :schema="emailSchema" class="space-y-8 mb-4">
            <UFormField label="Email" name="email" :ui="{ label: 'font-normal text-[18px] text-[#3A3A3A]' }">
              <UInput size="xl" placeholder="john@gmail.com" :ui="{ base: 'rounded-sm ring-[#5C5B5C] focus-visible:ring-[#1177FE]' }" class="w-full placeholder:text-[#999999]" />
            </UFormField>

            <UButton type="submit" size="lg" loading-auto class="text-center bg-[#1177FE] rounded-full text-white leading-[150%] text-[16px] md:text-[20px] font-bold w-full tracking-[2%] justify-center" @click="sendCode">
              Send Code
            </UButton>
          </UForm>
          <p class="text-center md:text-right text-[18px] leading-[150%] font-normal text-[#ADADAD]">
            Remember your account? <NuxtLink to="/login" class="text-[#1177FE]">
              Sign In
            </NuxtLink>
          </p>
        </div>

        <section v-else>
          <p class="text-[18px] leading-[150%] font-normal text-[#34383D] mb-4">
            Enter the code sent to your number in the field below
          </p>
          <UForm :state="otpState" :schema="otpSchema" class="space-y-8 mb-4">
            <UFormField name="otp" :ui="{ label: 'font-normal text-[18px] text-[#3A3A3A]' }">
              <UInput size="xl" type="number" placeholder="Enter Code" :ui="{ base: 'rounded-sm ring-[#5C5B5C] focus-visible:ring-[#1177FE]' }" class="w-full placeholder:text-[#999999]" />
            </UFormField>

            <UButton type="submit" size="lg" loading-auto class="text-center bg-[#1177FE] rounded-full text-white leading-[150%] text-[16px] md:text-[20px] font-bold w-full tracking-[2%] justify-center">
              Verify
            </UButton>
          </UForm>
          <p class="text-center md:text-right text-[18px] leading-[150%] font-normal text-[#ADADAD]">
            Remember your account? <NuxtLink to="/login" class="text-[#1177FE]">
              Sign In
            </NuxtLink>
          </p>
        </section>
      </div>
    </div>
    <div class="hidden bg-[#1177FE] h-full relative md:flex items-center justify-center p-4">
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
  </main>
</template>
