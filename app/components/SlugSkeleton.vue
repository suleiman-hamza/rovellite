<template>
  <div class="max-w-180 mx-auto">
    <!-- blue banner/ header -->
    <div class="rounded-t-[20px] flex justify-start md:justify-center gap-4 md:gap-8 h-24 sm:h-40 items-center p-4 md:px-6 bg-[#DBF4FF] w-full">
      <div class="flex gap-4 md:gap-8 items-center">
        <USkeleton class="rounded-full w-15 h-15" />
        <USkeleton class="w-40 h-6" />
      </div>
    </div>
  </div>
  <!-- form body -->
  <div class="rounded-b-[20px]">
    <div class="w-full sm:max-w-lg mx-auto pt-9 pb-12.5">
      <div class="px-4 sm:px-6">
        <div class="space-y-4">
          <div>
            <USkeleton class="w-full" />
            <USkeleton class="w-40 h-6" />
          </div>

          <div>
            <USkeleton class="w-full" />
            <USkeleton class="w-40 h-6" />
          </div>

          <div class="flex gap-4 px-0 sm:px-6">
            <USkeleton class="w-full  rounded-full" />
            <USkeleton class="w-full  rounded-full" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
