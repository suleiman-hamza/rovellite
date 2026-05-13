<script setup lang="ts">
import type { AvatarProps, TableColumn } from '@nuxt/ui'
import type { Row } from '@tanstack/vue-table'
import { getPaginationRowModel } from '@tanstack/vue-table'
import { h, resolveComponent } from 'vue'

const toast = useToast()
const { copy } = useClipboard()

const UButton = resolveComponent('UButton')
// const UBadge = resolveComponent('UBadge')
const UAvatar = resolveComponent('UAvatar')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const table = useTemplateRef('table')
const globalFilter = ref('')

interface UsersInfo {
  id: string
  created_at: string
  last_seen: string
  email: string
  account: number
  status: 'active' | 'inactive'
}

const users = ref<UsersInfo[]>([
  {
    id: '4600',
    created_at: '2024-03-11T15:30:00',
    last_seen: '2024-03-11T16:45:00',
    email: 'james.anderson@example.com',
    account: 59483999938,
    status: 'active',
  },
  {
    id: '4599',
    created_at: '2024-03-11T10:10:00',
    last_seen: '2024-03-11T11:20:00',
    email: 'mia.white@example.com',
    account: 48573920192,
    status: 'inactive',
  },
  {
    id: '4598',
    created_at: '2024-03-11T08:50:00',
    last_seen: '2024-03-11T09:15:00',
    email: 'william.brown@example.com',
    account: 10293847565,
    status: 'active',
  },
  {
    id: '4597',
    created_at: '2024-03-10T19:45:00',
    last_seen: '2024-03-10T20:30:00',
    email: 'emma.davis@example.com',
    account: 99887766554,
    status: 'active',
  },
  {
    id: '4596',
    created_at: '2024-03-10T15:55:00',
    last_seen: '2024-03-10T18:00:00',
    email: 'ethan.harris@example.com',
    account: 12345678901,
    status: 'inactive',
  },
  {
    id: '4595',
    created_at: '2024-03-10T13:20:00',
    last_seen: '2024-03-10T14:10:00',
    email: 'sophia.miller@example.com',
    account: 55667788990,
    status: 'inactive',
  },
  {
    id: '4594',
    created_at: '2024-03-10T11:05:00',
    last_seen: '2024-03-10T12:00:00',
    email: 'noah.wilson@example.com',
    account: 11223344556,
    status: 'inactive',
  },
  {
    id: '4593',
    created_at: '2024-03-09T22:15:00',
    last_seen: '2024-03-09T23:50:00',
    email: 'olivia.jones@example.com',
    account: 44332211009,
    status: 'active',
  },
  {
    id: '4592',
    created_at: '2024-03-09T20:30:00',
    last_seen: '2024-03-09T21:15:00',
    email: 'liam.taylor@example.com',
    account: 77889900112,
    status: 'active',
  },
  {
    id: '4591',
    created_at: '2024-03-09T18:45:00',
    last_seen: '2024-03-09T19:00:00',
    email: 'ava.thomas@example.com',
    account: 33445566778,
    status: 'active',
  },
  {
    id: '4590',
    created_at: '2024-03-09T16:20:00',
    last_seen: '2024-03-09T17:40:00',
    email: 'lucas.martin@example.com',
    account: 22334455667,
    status: 'inactive',
  },
  {
    id: '4589',
    created_at: '2024-03-09T14:10:00',
    last_seen: '2024-03-09T15:00:00',
    email: 'isabella.clark@example.com',
    account: 66554433221,
    status: 'active',
  },
  {
    id: '4588',
    created_at: '2024-03-09T12:05:00',
    last_seen: '2024-03-09T13:30:00',
    email: 'mason.rodriguez@example.com',
    account: 88776655443,
    status: 'inactive',
  },
  {
    id: '4587',
    created_at: '2024-03-09T10:30:00',
    last_seen: '2024-03-09T11:15:00',
    email: 'sophia.lee@example.com',
    account: 99001122334,
    status: 'inactive',
  },
  {
    id: '4586',
    created_at: '2024-03-09T08:15:00',
    last_seen: '2024-03-09T08:45:00',
    email: 'ethan.walker@example.com',
    account: 55443322110,
    status: 'active',
  },
  {
    id: '4585',
    created_at: '2024-03-08T23:40:00',
    last_seen: '2024-03-09T00:10:00',
    email: 'amelia.hall@example.com',
    account: 11221122112,
    status: 'active',
  },
  {
    id: '4584',
    created_at: '2024-03-08T21:25:00',
    last_seen: '2024-03-08T22:00:00',
    email: 'oliver.young@example.com',
    account: 33443344334,
    status: 'active',
  },
  {
    id: '4583',
    created_at: '2024-03-08T19:50:00',
    last_seen: '2024-03-08T20:15:00',
    email: 'aria.king@example.com',
    account: 55665566556,
    status: 'active',
  },
  {
    id: '4582',
    created_at: '2024-03-08T17:35:00',
    last_seen: '2024-03-08T18:10:00',
    email: 'henry.wright@example.com',
    account: 77887788778,
    status: 'inactive',
  },
  {
    id: '4581',
    created_at: '2024-03-08T15:20:00',
    last_seen: '2024-03-08T16:00:00',
    email: 'luna.lopez@example.com',
    account: 99009900990,
    status: 'active',
  },
])

const columns: TableColumn<UsersInfo>[] = [
  {
    accessorKey: 'id',
    header: 'S/N',
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: 'name',
    header: 'Users',
    cell: ({ row }) => {
      return h('div', { class: 'flex items-center gap-3' }, [
        h(UAvatar, {
          ...row.original.avatar,
          loading: 'lazy',
          size: 'lg',
        }),
        h('div', undefined, [
          h('p', { class: 'font-medium text-highlighted' }, row.original.name),
        ]),
      ])
    },
  },
  {
    accessorKey: 'id',
    header: 'User ID',
    meta: {
      class: {
        th: 'whitespace-nowrap',
      },
    },
  },
  {
    accessorKey: 'account',
    header: 'Account',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'created_at',
    header: 'Created at',
    cell: ({ row }) => {
      return new Date(row.getValue('created_at')).toLocaleString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
      })
    },
  },
  {
    accessorKey: 'last_seen',
    header: 'Last Login',
    cell: ({ row }) => {
      return new Date(row.getValue('created_at')).toLocaleString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
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

const pagination = ref({
  pageIndex: 0,
  pageSize: 10,
})

function getRowItems(row: Row<UsersInfo>) {
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
          title: 'Payment Email copied to clipboard!',
          color: 'success',
          icon: 'i-lucide-circle-check',
        })
      },
    },
    {
      type: 'separator',
    },
    {
      label: 'View customer',
    },
    {
      label: 'View payment details',
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
    <UTable
      ref="table" v-model:pagination="pagination" v-model:global-filter="globalFilter" :data="users"
      :columns="columns" :pagination-options="{
        getPaginationRowModel: getPaginationRowModel(),
      }" class="flex-1 font-poppins" :ui="{ th: 'pl-0 py-1.5 md:py-3 text-[#565252] tracking-[1%] text-[16px] font-bold leading-[150%]', td: 'pl-0 font-normal text-[16px] tracking-[5%] text-[#4D5155]', separator: 'bg-transparent' }"
    >
      <template #empty>
        <div>
          <p>Your Transactions will appear here</p>
        </div>
      </template>
    </UTable>
  </main>
</template>
