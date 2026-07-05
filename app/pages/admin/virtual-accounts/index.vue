<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Column, Row } from '@tanstack/vue-table'
import { getPaginationRowModel } from '@tanstack/vue-table'
import { h, resolveComponent } from 'vue'
import StatusStats from './components/StatusStats.vue'

const toast = useToast()
const { copy } = useClipboard()

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UAvatar = resolveComponent('UAvatar')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const table = useTemplateRef('table')
const globalFilter = ref('')
const columnFilters = ref<{ id: string, value: unknown }[]>([])

const activeStatusFilter = computed(() =>
  (columnFilters.value.find(f => f.id === 'status')?.value ?? null) as 'active' | 'deactivated' | null,
)

function setStatusFilter(value: 'active' | 'deactivated' | null) {
  columnFilters.value = value
    ? [{ id: 'status', value }]
    : []
}

interface UsersInfo {
  id: string
  created_at: string
  last_seen: string
  name: string
  email: string
  account: number
  status: 'active' | 'deleted' | 'deactivated'
}

const users = ref<UsersInfo[]>([
  {
    id: '4600',
    created_at: '2024-03-11T15:30:00',
    last_seen: '2024-03-11T16:45:00',
    name: 'James Anderson',
    email: 'james.anderson@example.com',
    account: 59483999938,
    status: 'active',
  },
  {
    id: '4599',
    created_at: '2024-03-11T10:10:00',
    last_seen: '2024-03-11T11:20:00',
    name: 'Mia White',
    email: 'mia.white@example.com',
    account: 48573920192,
    status: 'deactivated',
  },
  {
    id: '4598',
    created_at: '2024-03-11T08:50:00',
    last_seen: '2024-03-11T09:15:00',
    name: 'William Brown',
    email: 'william.brown@example.com',
    account: 10293847565,
    status: 'active',
  },
  {
    id: '4597',
    created_at: '2024-03-10T19:45:00',
    last_seen: '2024-03-10T20:30:00',
    name: 'Emma Davis',
    email: 'emma.davis@example.com',
    account: 99887766554,
    status: 'active',
  },
  {
    id: '4596',
    created_at: '2024-03-10T15:55:00',
    last_seen: '2024-03-10T18:00:00',
    name: 'Ethan Harris',
    email: 'ethan.harris@example.com',
    account: 12345678901,
    status: 'deactivated',
  },
  {
    id: '4595',
    created_at: '2024-03-10T13:20:00',
    last_seen: '2024-03-10T14:10:00',
    name: 'Sophia Miller',
    email: 'sophia.miller@example.com',
    account: 55667788990,
    status: 'deactivated',
  },
  {
    id: '4594',
    created_at: '2024-03-10T11:05:00',
    last_seen: '2024-03-10T12:00:00',
    name: 'Noah Wilson',
    email: 'noah.wilson@example.com',
    account: 11223344556,
    status: 'deactivated',
  },
  {
    id: '4593',
    created_at: '2024-03-09T22:15:00',
    last_seen: '2024-03-09T23:50:00',
    name: 'Olivia Jones',
    email: 'olivia.jones@example.com',
    account: 44332211009,
    status: 'active',
  },
  {
    id: '4592',
    created_at: '2024-03-09T20:30:00',
    last_seen: '2024-03-09T21:15:00',
    name: 'Liam Taylor',
    email: 'liam.taylor@example.com',
    account: 77889900112,
    status: 'active',
  },
  {
    id: '4591',
    created_at: '2024-03-09T18:45:00',
    last_seen: '2024-03-09T19:00:00',
    name: 'Ava Thomas',
    email: 'ava.thomas@example.com',
    account: 33445566778,
    status: 'active',
  },
  {
    id: '4590',
    created_at: '2024-03-09T16:20:00',
    last_seen: '2024-03-09T17:40:00',
    name: 'Lucas Martin',
    email: 'lucas.martin@example.com',
    account: 22334455667,
    status: 'deactivated',
  },
  {
    id: '4589',
    created_at: '2024-03-09T14:10:00',
    last_seen: '2024-03-09T15:00:00',
    name: 'Isabella Clark',
    email: 'isabella.clark@example.com',
    account: 66554433221,
    status: 'active',
  },
  {
    id: '4588',
    created_at: '2024-03-09T12:05:00',
    last_seen: '2024-03-09T13:30:00',
    name: 'Mason Rodriguez',
    email: 'mason.rodriguez@example.com',
    account: 88776655443,
    status: 'deactivated',
  },
  {
    id: '4587',
    created_at: '2024-03-09T10:30:00',
    last_seen: '2024-03-09T11:15:00',
    name: 'Sophia Lee',
    email: 'sophia.lee@example.com',
    account: 99001122334,
    status: 'deactivated',
  },
  {
    id: '4586',
    created_at: '2024-03-09T08:15:00',
    last_seen: '2024-03-09T08:45:00',
    name: 'Ethan Walker',
    email: 'ethan.walker@example.com',
    account: 55443322110,
    status: 'active',
  },
  {
    id: '4585',
    created_at: '2024-03-08T23:40:00',
    last_seen: '2024-03-09T00:10:00',
    name: 'Amelia Hall',
    email: 'amelia.hall@example.com',
    account: 11221122112,
    status: 'active',
  },
  {
    id: '4584',
    created_at: '2024-03-08T21:25:00',
    last_seen: '2024-03-08T22:00:00',
    name: 'Oliver Young',
    email: 'oliver.young@example.com',
    account: 33443344334,
    status: 'active',
  },
  {
    id: '4583',
    created_at: '2024-03-08T19:50:00',
    last_seen: '2024-03-08T20:15:00',
    name: 'Aria King',
    email: 'aria.king@example.com',
    account: 55665566556,
    status: 'active',
  },
  {
    id: '4582',
    created_at: '2024-03-08T17:35:00',
    last_seen: '2024-03-08T18:10:00',
    name: 'Henry Wright',
    email: 'henry.wright@example.com',
    account: 77887788778,
    status: 'deactivated',
  },
  {
    id: '4581',
    created_at: '2024-03-08T15:20:00',
    last_seen: '2024-03-08T16:00:00',
    name: 'Luna Lopez',
    email: 'luna.lopez@example.com',
    account: 99009900990,
    status: 'active',
  },
])

const columns: TableColumn<UsersInfo>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => getHeader(column, 'S/N', 'left'),
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => getHeader(column, 'Users', 'left'),
    cell: ({ row }) => {
      return h('div', { class: 'flex items-center gap-3' }, [
        h(UAvatar, {
          loading: 'lazy',
          size: 'lg',
        }),
        h('div', undefined, [
          h('p', { class: 'font-medium text-highlighted' }, row.original.name),
        ]),
      ])
    },
    size: 172,
  },
  {
    accessorKey: 'account',
    header: 'Account',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    filterFn: (row, columnId, filterValue) => row.getValue(columnId) === filterValue,
    cell: ({ row }) => {
      const color = row.original.status === 'active' ? 'primary' : 'error'
      return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () => row.original.status)
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Date Created',
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
    header: 'Last Transaction',
    cell: ({ row }) => {
      return new Date(row.getValue('last_seen')).toLocaleString('en-US', {
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

function getHeader(column: Column<UsersInfo>, label: string, position: 'left' | 'right') {
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

const columnPinning = ref({
  left: [], // You can specify column IDs to be pinned on the left or right. For example: ['name']
  right: [],
})

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
          title: 'Email copied to clipboard!',
          color: 'success',
          icon: 'i-lucide-circle-check',
        })
      },
    },
    {
      label: 'Copy User ID',
      onSelect() {
        copy(row.original.id)

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
        // Navigate to the dynamic route using the user's ID
        navigateTo(`/admin/virtual-accounts/${row.original.id}`)
      },
    },
  ]
}
</script>

<template>
  <main class="p-4 bg-white rounded-[20px]">
    <div class="flex gap-4 items-center sm:py-3.5 border-accented mb-4">
      <h2 class="hidden sm:inline-block text-nowrap text-[#34383D] text-[20px] font-bold leading-[150%] tracking-[2%]">
        Users
      </h2>
      <UInput v-model="globalFilter" leading-icon="i-lucide-search" class="max-w-200.5 w-full" :ui="{ base: 'rounded-[4px] md:rounded-[12px] md:px-5 md:pl-10 md:py-2.5' }" placeholder="Search users..." />
      <UPopover>
        <UButton
          :label="activeStatusFilter ? 'Filter (1)' : 'Filter'"
          leading-icon="i-lucide-list-filter"
          :ui="{ base: 'md:px-5 md:py-2.5 rounded-[4px] md:rounded-[12px]', label: 'font-semibold text-[16px]', leadingIcon: 'size-4 md:size-5' }"
          :color="activeStatusFilter ? 'primary' : 'neutral'"
          :variant="activeStatusFilter ? 'subtle' : 'ghost'"
          :style="!activeStatusFilter ? 'color: #4D5155; background: #DBF4FF;' : ''"
        />
        <template #content>
          <div class="p-3 flex flex-col gap-1 min-w-36">
            <p class="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide px-2 mb-1">
              Status
            </p>
            <UButton
              label="All"
              size="sm"
              :variant="!activeStatusFilter ? 'soft' : 'ghost'"
              :color="!activeStatusFilter ? 'primary' : 'neutral'"
              class="justify-start"
              @click="setStatusFilter(null)"
            />
            <UButton
              label="Active"
              size="sm"
              :variant="activeStatusFilter === 'active' ? 'soft' : 'ghost'"
              :color="activeStatusFilter === 'active' ? 'success' : 'neutral'"
              class="justify-start"
              @click="setStatusFilter('active')"
            />
            <UButton
              label="Disabled"
              size="sm"
              :variant="activeStatusFilter === 'deactivated' ? 'soft' : 'ghost'"
              :color="activeStatusFilter === 'deactivated' ? 'error' : 'neutral'"
              class="justify-start"
              @click="setStatusFilter('deactivated')"
            />
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
    <StatusStats :total="users.length" :deactivated="users.filter(u => u.status === 'deactivated').length" :active="users.filter(u => u.status === 'active').length" :new-accounts="2" :deleted="users.filter(u => u.status === 'deactivated').length" />
    <!-- table -->
    <UTable
      ref="table" v-model:pagination="pagination" v-model:global-filter="globalFilter" v-model:column-filters="columnFilters" v-model:column-pinning="columnPinning"
      :data="users" :columns="columns" :pagination-options="{
        getPaginationRowModel: getPaginationRowModel(),
      }" class="flex-1 font-poppins hidden md:block" :ui="{ th: 'pl-0 py-1.5 md:py-3 text-[#565252] tracking-[1%] text-[16px] font-bold leading-[150%]', td: 'pl-0 font-normal text-[16px] tracking-[5%] text-[#4D5155]', separator: 'bg-transparent' }"
    >
      <template #empty>
        <div>
          <p>Your Transactions will appear here</p>
        </div>
      </template>
    </UTable>
    <!-- mobile table layout -->
    <section class="md:hidden border p-1 divide-y divide-gray-300 flex flex-col gap-4">
      <div v-for="item in users" :key="item.id" class="">
        <div class="flex gap-4 justify-between">
          <div class="flex gap-2 flex-col">
            <p class="flex gap-2 items-center">
              <span class="border rounded-full bg-slate-500 h-5 w-5 inline-block" />
              <span>{{ item.name }}</span>
            </p>
            <p>{{ item.account }}</p>
          </div>
          <div class="flex gap-2 flex-col items-end">
            <UButton leading-icon="i-lucide-ellipsis-vertical" size="xs" variant="outline" class="w-fit" />
            <span>
              {{ item.status }}
            </span>
          </div>
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
