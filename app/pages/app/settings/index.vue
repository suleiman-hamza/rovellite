<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'
import { useProfileStore } from '@/stores/profile'

const store = useProfileStore()
definePageMeta({
  title: 'Settings',
  layout: 'dashboard-layout',
  middleware: 'auth',
})

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
const _MIN_DIMENSIONS = { width: 200, height: 1600 } // min dimension
const _MAX_DIMENSIONS = { width: 200, height: 1600 } // max dimension
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'] // acepted image formats

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0)
    return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`
}

const schema = z.object({
  avatar: z
    .instanceof(File, {
      message: 'Please select an image file.',
    })
    .refine(file => file.size <= MAX_FILE_SIZE, {
      message: `The image is too large. Please choose an image smaller than ${formatBytes(MAX_FILE_SIZE)}.`,
    })
    .refine(file => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: 'Please upload a valid image file (JPEG, PNG, or WebP).',
    })
    .refine(
      file =>
        new Promise((_resolve) => {
          const reader = new FileReader()
          reader.onload = (e) => {
            const img = new Image()
            img.onload = () => {
            }
            img.src = e.target?.result as string
          }
          reader.readAsDataURL(file)
        }),
    ),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  avatar: undefined,
})

function createObjectUrl(file: File): string {
  return URL.createObjectURL(file)
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.warn(event.data)
}
</script>

<template>
  <main class="bg-white rounded-[20px]">
    <!-- header/profile img -->
    <div class="">
      <UForm :schema="schema" :state="state" class="" @submit="onSubmit">
        <div
          class="p-4 flex md:justify-center relative items-center rounded-[20px] h-40 md:h-45 bg-[linear-gradient(to_bottom,#DBF4FF_60%,#fff_40%)] sm:bg-[linear-gradient(to_bottom,#DBF4FF_70%,#fff_30%)]"
        >
          <UButton label="Delete Account" variant="ghost" trailing-icon="i-lucide-trash" class="text-[#01060C] absolute top-3 right-2 md:top-5 md:right-5" :ui="{ label: 'text-[14px] md:text-[20px] tracking-[2%] leading-[150%] text-normal' }" />
          <UFormField name="avatar" class="h-fit">
            <UFileUpload
              v-slot="{ open, removeFile }" v-model="state.avatar" accept="image/*"
              :ui="{ root: 'items-center' }"
            >
              <div class="relative w-fit">
                <UAvatar
                  :src="state.avatar ? createObjectUrl(state.avatar) : undefined" icon="i-lucide-image"
                  width="200" height="200" class="w-25 h-25 border-[1.5px] border-primary"
                />
                <UButton
                  :icon="state.avatar ? 'i-lucide-pencil' : 'i-lucide-camera'" color="neutral"
                  class="absolute top-1/2 -right-2 rounded-full text-primary shadow bg-white" @click="open()"
                />
              </div>

              <p v-if="state.avatar" class="text-xs text-muted mt-1.5">
                {{ state.avatar.name }}

                <UButton label="Remove" color="error" variant="link" size="xs" class="p-0" @click="removeFile()" />
              </p>
            </UFileUpload>
          </UFormField>
        </div>
        <section class="flex flex-col gap-4 md:flex-row px-4 md:px-7 mb-2">
          <div class="flex-1">
            <h2 class="text-[#1D1C1C] text-[18px] md:text-[24px] font-bold leading-[30px] mb-4">
              Account
            </h2>
            <UFormField label="Name" :ui="{ label: 'text-[#1A1F24] text-[18px] leading-[150%] tracking-[2%] font-semibold' }">
              <p class="text-[#34383D] md:text-[18px]">
                {{ store.userProfile?.full_name }}
              </p>
            </UFormField>
            <UFormField label="Email" :ui="{ label: 'text-[#1A1F24] text-[18px] leading-[150%] tracking-[2%] font-semibold' }">
              <p class="text-[#34383D] md:text-[18px]">
                {{ store.userProfile?.email }}
              </p>
            </UFormField>

            <h2 class="text-[#1D1C1C] text-[18px] md:text-[24px] font-bold leading-[30px] mt-4 mb-4">
              Change Password
            </h2>
            <div class="space-y-4 max-w-[485px]">
              <UFormField label="Add Current Password" :ui="{ label: 'text-[#34383D] text-[18px]' }">
                <UInput size="xl" type="password" class="w-full" :ui="{ base: 'rounded-[5px]' }" />
              </UFormField>
              <UFormField label="New Password" :ui="{ label: 'text-[#34383D] text-[18px]' }">
                <UInput size="xl" type="password" class="w-full" :ui="{ base: 'rounded-[5px]' }" />
              </UFormField>
              <UFormField label="Re-enter New Password" :ui="{ label: 'text-[#34383D] text-[18px]' }">
                <UInput size="xl" type="password" class="w-full" :ui="{ base: 'rounded-[5px]' }" />
              </UFormField>
            </div>
          </div>

          <UButton type="submit" label="Update" color="primary" size="xl" class="rounded-full md:text-[24px] font-bold md:px-10 size-fit" />
        </section>
      </UForm>
    </div>
  </main>
</template>
