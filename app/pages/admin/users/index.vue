<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Column, Row } from '@tanstack/vue-table'
import type { AdminUserListItem } from '~~/server/api/admin/users.get.js'
import { getPaginationRowModel } from '@tanstack/vue-table'
import { h, resolveComponent } from 'vue'
import UserStats from './components/UserStats.vue'

const toast = useToast()
const { copy } = useClipboard()

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UAvatar = resolveComponent('UAvatar')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const table = useTemplateRef('table')
const globalFilter = ref('')

// type for each user
// interface UsersInfo {
//   id: string
//   created_at: string
//   last_seen: string
//   name: string
//   email: string
//   account: number
//   status: 'active' | 'inactive'
// }

// users fetch data
const { data: Users, status } = await useLazyFetch('/api/admin/users', {
  method: 'get',
  transform: (response) => {
    if (response.success) {
      return response.data.users
    }
    return []
  },
  key: 'allUsers',
  query: {
    limit: 10,
    offset: 0,
  },
})

const items = ref([
  [
    {
      type: 'label',
      label: 'Actions',
    },
    {
      label: 'Copy Email',
      onSelect() {
        toast.add({
          title: 'Email copied to clipboard!',
          color: 'success',
          icon: 'i-lucide-circle-check',
        })
      },
    },
    {
      label: 'Copy User ID',
      onSelect() {
        toast.add({
          title: 'User ID copied to clipboard!',
          color: 'success',
          icon: 'i-lucide-circle-check',
        })
      },
    },
    {
      type: 'separator',
    },
    {
      label: 'View User',
      icon: 'i-lucide-eye',
      onSelect() {
        // navigateTo(`/admin/users/${}`)
        console.warn('View User clicked')
      },
    },
  ],
])

// column definition with user type
const columns: TableColumn<AdminUserListItem>[] = [
  // {
  //   accessorKey: 'id',
  //   header: ({ column }) => getHeader(column, 'S/N', 'left'),
  //   cell: ({ row }) => row.index + 1,
  // },
  {
    accessorKey: 'full_name',
    header: ({ column }) => getHeader(column, 'Users', 'left'),
    cell: ({ row }) => {
      return h('div', { class: 'flex items-center gap-3' }, [
        h(UAvatar, {
          loading: 'lazy',
          size: 'lg',
        }),
        h('div', undefined, [
          h('p', { class: 'font-medium text-highlighted uppercase' }, row.original.full_name),
        ]),
      ])
    },
    size: 172,
  },
  {
    accessorKey: 'phone',
    header: 'Account',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const color = row.original.status === 'active' ? 'primary' : 'error'
      return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () => row.original.status)
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Sign Up Date',
    cell: ({ row }) => {
      return new Date(row.getValue('created_at')).toLocaleString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    },
  },
  {
    accessorKey: 'updated_at',
    header: 'Last Login',
    cell: ({ row }) => {
      return new Date(row.getValue('updated_at')).toLocaleString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    },
  },
  {
    header: 'Action',
    id: 'actions',
    meta: {
      class: {
        td: 'text-right',
      },
    },
    cell: ({ row }) => {
      return h(
        UDropdownMenu,
        {
          'content': {
            align: 'end',
          },
          'items': getRowItems(row),
          'aria-label': 'Actions dropdown',
        },
        () =>
          h(UButton, {
            'icon': 'i-lucide-ellipsis-vertical',
            'color': 'neutral',
            'variant': 'ghost',
            'aria-label': 'Actions dropdown',
          }),
      )
    },
  },
]

// // pin function
function getHeader(column: Column<AdminUserListItem>, label: string, position: 'left' | 'right') {
  const isPinned = column.getIsPinned()

  return h(UButton, {
    color: 'neutral',
    variant: 'ghost',
    label,
    icon: isPinned ? 'i-lucide-pin-off' : 'i-lucide-pin',
    class: '-mx-2.5',
    onClick() {
      column.pin(isPinned === position ? false : position)
    },
  })
}

// You can specify column IDs to be pinned on the left or right. For example: ['name']
const columnPinning = ref({
  left: [],
  right: [],
})

// pagination
const pagination = ref({
  pageIndex: 0,
  pageSize: 10,
})

// action function
function getRowItems(row: Row<AdminUserListItem>) {
  return [
    {
      type: 'label',
      label: 'Actions',
    },
    {
      label: 'Copy Email',
      onSelect() {
        copy(row.original.email)

        toast.add({
          title: 'Email copied to clipboard!',
          color: 'success',
          icon: 'i-lucide-circle-check',
        })
      },
    },
    {
      label: 'Copy User ID',
      onSelect() {
        copy(row.original.user_id)

        toast.add({
          title: 'User ID copied to clipboard!',
          color: 'success',
          icon: 'i-lucide-circle-check',
        })
      },
    },
    {
      type: 'separator',
    },
    {
      label: 'View User',
      icon: 'i-lucide-eye',
      onSelect() {
        navigateTo(`/admin/users/${row.original.user_id}`)
      },
    },
  ]
}
</script>

<template>
  <main class="p-4 bg-white rounded-[20px]">
    <div class="flex gap-4 items-center py-3.5 border-accented mb-4">
      <h2 class="hidden sm:inline-block text-nowrap text-[#34383D] text-[20px] font-bold leading-[150%] tracking-[2%]">
        Users
      </h2>
      <UInput v-model="globalFilter" leading-icon="i-lucide-search" class="max-w-200.5 w-full" :ui="{ base: 'rounded-[4px] md:rounded-[12px] md:px-5 md:pl-10 md:py-2.5' }" placeholder="Search users..." />
      <UPopover>
        <UButton label="Filter" leading-icon="i-lucide-list-filter" :ui="{ base: 'md:px-5 md:py-2.5 text-[#4D5155] bg-[#DBF4FF] rounded-[4px] md:rounded-[12px]', label: 'text-[#4D5155] font-semibold text-[16px]', leadingIcon: 'size-4 md:size-5' }" />
        <template #content>
          <div class="p-4">
            <h2>Categories</h2>
          </div>
        </template>
      </UPopover>
      <UPagination
        :sibling-count="-1"
        :page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
        :items-per-page="table?.tableApi?.getState().pagination.pageSize"
        :total="table?.tableApi?.getFilteredRowModel().rows.length"
        :ui="{ first: 'hidden', last: 'hidden', list: 'gap-1 md:gap-3', prev: 'rounded-full', next: 'rounded-full' }"
        @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)"
      />
    </div>
    <!-- status text box 3 items -->
    <UserStats :total="Users?.length || 0" :non-active="Users?.filter(u => u.status === 'suspended').length || 0" :active="Users?.filter(u => u.status === 'active').length || 0" />
    <!-- table -->
    <UTable
      ref="table" v-model:pagination="pagination" v-model:global-filter="globalFilter" v-model:column-pinning="columnPinning"
      :data="Users" :columns="columns" :loading="status === 'pending' || status === 'idle'" :pagination-options="{
        getPaginationRowModel: getPaginationRowModel(),
      }" class="hidden md:block flex-1 font-poppins" :ui="{ th: 'pl-0 py-1.5 md:py-3 text-[#565252] tracking-[1%] text-[16px] font-bold leading-[150%]', td: 'pl-0 font-normal text-[16px] tracking-[5%] text-[#4D5155]', separator: 'bg-transparent' }"
    >
      <template #empty>
        <div>
          <p>Users will appear here</p>
        </div>
      </template>
    </UTable>

    <!-- mobile table layout -->
    <section v-if="Users" class="md:hidden divide-y divide-gray-300">
      <div v-for="item in Users" :key="item.user_id" class="flex justify-between items-center py-3 border-b border-gray-200">
        <!-- Left Column -->
        <div>
          <UUser
            :name="item.full_name" :avatar="{
              loading: 'lazy',
            }" :alt="item.full_name" class="font-semibold uppercase"
          />
          <p class="text-sm font-medium mt-1 text-primary capitalize">
            {{ item.status }}
          </p>
        </div>

        <!-- Right Column -->
        <div class="flex flex-col items-end">
          <UDropdownMenu :items="items">
            <UButton leading-icon="i-lucide-ellipsis-vertical" size="xs" variant="ghost" class="w-fit" />
          </UDropdownMenu>
          <!-- Dynamic status color example -->
        </div>
      </div>
    </section>

    <div class="flex justify-between border-t border-default pt-4">
      <div class="py-3.5 text-sm text-muted">
        {{ table?.tableApi?.getRowCount() }} of
        {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} entries.
      </div>
      <UPagination
        :show-controls="false"
        :page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
        :items-per-page="table?.tableApi?.getState().pagination.pageSize"
        :total="table?.tableApi?.getFilteredRowModel().rows.length"
        @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)"
      />
    </div>
  </main>
</template>
