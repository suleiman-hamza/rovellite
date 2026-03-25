<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'

const schema = z.object({
  name: z.string(),
  email: z.string().email('Invalid email'),
  message: z.string().min(8, 'Must be at least 8 characters'),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  name: undefined,
  email: undefined,
  message: undefined,
})

// const toast = useToast()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.warn(event.data)
}
</script>

<template>
  <section id="contactus" class="bg-[url(/images/landing-page/Skyscrapper-city.png)] bg-contain md:bg-cover bg-bottom bg-no-repeat">
    <section class="pt-16 pb-24 md:pt-32 md:pb-42 mx-5 sm:mx-6 md:mx-8 lg:mx-19 2xl:mx-25">
      <div
        class="md:flex justify-between gap-18 w-full"
      >
        <div class="">
          <h5 class="md:text-[1.125rem] text-[0.85rem] text-[#1177FE] capitalize">
            Get in touch with us
          </h5>
          <h2 class="text-[1.58rem] md:text-[3.5rem] tracking-[1%] font-bold text-[#333333]">
            Contact Us
          </h2>

          <div class="contact-info mt-7 md:mt-9 max-w-125 mx-auto mb-16 font-poppins">
            <div class="flex gap-6 items-start mb-7.5">
              <span class="w-10 h-10 bg-[#1177FE] flex justify-center items-center rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 12.713L0.015 3H23.985L12 12.713ZM12 15.287L0 5.562V21H24V5.562L12 15.287Z" fill="white" />
                </svg>
              </span>
              <span>
                <h4 class="font-bold tracking-[10%] leading-[150%] text-[18px] text-[#4D5155]">Email Address</h4>
                <h5 class="text-[#34383D] tracking-[1%] leading-[150%] text-[14px]">roveltechworld@gmail.com</h5>
              </span>
            </div>
            <div class="flex gap-4 items-start mb-7.5">
              <span class="w-10 h-10 bg-[#1177FE] flex justify-center items-center rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M19.9995 22.621L16.4785 15.826C16.4705 15.83 14.5045 16.796 14.4145 16.837C12.1745 17.923 7.61555 9.017 9.80555 7.843L11.8885 6.817L8.39555 0L6.28955 1.039C-0.912452 4.794 10.5225 27.021 17.8895 23.654C18.0105 23.599 19.9915 22.625 19.9995 22.621Z"
                    fill="white"
                  />
                </svg>
              </span>
              <span>
                <h4 class="font-bold tracking-[10%] leading-[150%] text-[18px] text-[#4D5155]">Call Us</h4>
                <h5 class="text-[#34383D] tracking-[1%] leading-[150%] text-[14px]">+23481116694640</h5>
              </span>
            </div>
            <div class="flex gap-4 items-start mb-2.5">
              <span class="w-10 h-10 bg-[#1177FE] flex justify-center items-center rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <g clip-path="url(#clip0_4795_13124)">
                    <path
                      d="M12 2C15.196 2 18 4.618 18 7.602C18 10.695 15.507 14.734 12 20.263C8.493 14.734 6 10.695 6 7.602C6 4.618 8.804 2 12 2ZM12 0C7.802 0 4 3.403 4 7.602C4 11.8 7.469 16.812 12 24C16.531 16.812 20 11.8 20 7.602C20 3.403 16.199 0 12 0V0ZM12 13C10.343 13 9 11.657 9 10C9 8.343 10.343 7 12 7C13.657 7 15 8.343 15 10C15 11.657 13.657 13 12 13Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_4795_13124">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </span>
              <span>
                <h4 class="font-bold tracking-[10%] leading-[150%] text-[18px] text-[#4D5155]">Address</h4>
                <h5 class="text-[#34383D] tracking-[1%] leading-[150%] text-[14px]">
                  14 Gynoscope Drive Off New<br> Layout Rivers, Port Harcourt
                </h5>
              </span>
            </div>
          </div>
        </div>

        <div class="flex-1 bg-white rounded-md md:rounded-[20px] w-full p-4 md:px-10.5 md:py-15 shadow-form">
          <p class="text-[#333333] font-bold md:font-extrabold text-sm md:text-[24px] mb-4 font-poppins">
            Send Us A  Message
          </p>
          <UForm :schema="schema" :state="state" class="space-y-4 font-sans" @submit="onSubmit">
            <div class="flex gap-4 flex-col md:flex-row">
              <UFormField label="Name" name="name" size="xl" class="flex-1">
                <UInput v-model="state.name" :ui="{ base: 'focus-visible:ring-[#1177FE]' }" class="w-full" placeholder="Blessing" type="text" />
              </UFormField>
              <UFormField label="Email" name="email" size="xl" class="flex-1">
                <UInput v-model="state.email" :ui="{ base: 'focus-visible:ring-[#1177FE]' }" class="w-full" placeholder="Jordanrovel112@gmail.com" />
              </UFormField>
            </div>
            <UFormField label="Message" name="message" size="xl">
              <UTextarea v-model="state.message" :ui="{ base: 'focus-visible:ring-[#1177FE]' }" class="w-full" placeholder="How can I get started?" :rows="4" />
            </UFormField>
            <UButton type="submit" size="xl" class="bg-[#1177FE] text-white text-[14px] md:text-[16px] rounded-full px-12 md:px-18 py-3 md:py-4">
              Send
            </UButton>
          </UForm>
        </div>
      </div>
    </section>
  </section>
</template>
