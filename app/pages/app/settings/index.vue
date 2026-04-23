<script setup lang="ts">
import { useProfileStore } from '@/stores/profile'
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const store = useProfileStore()
definePageMeta({
  title: 'Settings',
  layout: 'dashboard-layout',
  middleware: 'auth',
})


const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
const MIN_DIMENSIONS = { width: 200, height: 1600 } // min dimension
const MAX_DIMENSIONS = { width: 200, height: 1600 } // max dimension
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'] // acepted image formats

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

const schema = z.object({
  avatar: z
    .instanceof(File, {
      message: 'Please select an image file.'
    })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `The image is too large. Please choose an image smaller than ${formatBytes(MAX_FILE_SIZE)}.`
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: 'Please upload a valid image file (JPEG, PNG, or WebP).'
    })
    .refine(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader()
          reader.onload = (e) => {
            const img = new Image()
            img.onload = () => {
            }
            img.src = e.target?.result as string
          }
          reader.readAsDataURL(file)
        }),
    )
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  avatar: undefined
})

function createObjectUrl(file: File): string {
  return URL.createObjectURL(file)
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log(event.data)
}
</script>

<template>
  <main class="bg-white rounded-[20px]">
    <!--header/profile img-->
    <div class="">
      <UForm :schema="schema" :state="state" class="" @submit="onSubmit">
        <div
          class="flex justify-center items-center rounded-[20px] border h-40 md:h-45 bg-[linear-gradient(to_bottom,#DBF4FF_60%,#fff_40%)] sm:bg-[linear-gradient(to_bottom,#DBF4FF_70%,#fff_30%)]">
          <UFormField name="avatar" class="h-fit">
            <UFileUpload v-slot="{ open, removeFile }" v-model="state.avatar" accept="image/*"
              :ui="{ root: 'items-center' }">
              <div class="relative w-fit">
                <UAvatar :src="state.avatar ? createObjectUrl(state.avatar) : undefined" icon="i-lucide-image"
                  width="200" height="200" class="w-25 h-25 border-[1.5px] border-primary" />
                <UButton :icon="state.avatar ? 'i-lucide-pencil' : 'i-lucide-camera'" color="neutral"
                  class="absolute top-1/2 -right-2 rounded-full text-primary shadow bg-white" @click="open()" />
              </div>

              <p v-if="state.avatar" class="text-xs text-muted mt-1.5">
                {{ state.avatar.name }}

                <UButton label="Remove" color="error" variant="link" size="xs" class="p-0" @click="removeFile()" />
              </p>
            </UFileUpload>
          </UFormField>
        </div>


        <UButton type="submit" label="Submit" color="neutral" />
      </UForm>
    </div>
  </main>
</template>
