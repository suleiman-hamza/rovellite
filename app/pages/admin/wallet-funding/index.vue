<script setup lang="ts">
// import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
// import { useProfileStore } from '@/stores/profile'
import type { Column, Row } from '@tanstack/vue-table'
// import { getPaginationRowModel } from '@tanstack/vue-table'
import { h, resolveComponent } from 'vue'

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
  (columnFilters.value.find(f => f.id === 'status')?.value ?? null) as 'active' | 'disabled' | null,
)

function setStatusFilter(value: 'active' | 'disabled' | null) {
  columnFilters.value = value
    ? [{ id: 'status', value }]
    : []
}

// const store = useProfileStore()

// const UBadge = resolveComponent('UBadge')
// interface trx {
//   created_at: string
//   id: string
//   reference: string
//   type: string
//   user_id: string
//   virtual_account_no: string
//   wallet_id: string
//   wallet: {
//     balance: number
//     currency: string
//   }
// }

interface walletType {
  id: string
  created_at: string
  last_seen: string
  name: string
  email: string
  account: number
  status: 'active' | 'disabled'
}

const walletfund = ref<walletType[]>([
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
    status: 'disabled',
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
])

// const { data: trxData, status } = await useLazyFetch('/api/transaction', {
//   query: { userId: store.userProfile?.user_id, limit: '3' },
//   key: 'transactions',
//   server: false,
// })

// const transactions = computed(() => {
//   if (trxData.value?.success) {
//     return trxData.value.data
//   }
//   return []
// })

const columns: TableColumn<walletType>[] = [
  {
    accessorKey: 'id',
    header: 'Id',
    cell: ({ row }) => `#${row.getValue('id')}`,
    size: 100,
    meta: {
      class: {
        td: '',
        th: '',
      },
    },
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
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue('amount'))
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'NGN',
      }).format(amount)
    },
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

function getHeader(column: Column<walletType>, label: string, position: 'left' | 'right') {
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

function getRowItems(row: Row<walletType>) {
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

const columnPinning = ref({
  left: [], // You can specify column IDs to be pinned on the left or right. For example: ['name']
  right: [],
})

const pagination = ref({
  pageIndex: 0,
  pageSize: 10,
})
</script>

<template>
  <main>
    <div class="flex gap-4 items-center py-3.5 border-accented mb-4">
      <h2 class="hidden sm:inline-block text-nowrap text-[#34383D] text-[20px] font-bold leading-[150%] tracking-[2%]">
        Wallet Funding
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
              :variant="activeStatusFilter === 'disabled' ? 'soft' : 'ghost'"
              :color="activeStatusFilter === 'disabled' ? 'error' : 'neutral'"
              class="justify-start"
              @click="setStatusFilter('disabled')"
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
    <FundingBoxes :total="100" :successful="75" :processing="10" :failed="5" :pending="10" />
    <UTable v-model:pagination="pagination" v-model:global-filter="globalFilter" v-model:column-filters="columnFilters" v-model:column-pinning="columnPinning" :data="walletfund" :columns class="flex-1 font-poppins hidden md:flex" :ui="{ th: 'pl-0 py-1.5 md:py-3 text-[#565252] tracking-[1%] text-[16px] font-bold leading-[150%]', td: 'pl-0 font-normal text-[16px] tracking-[5%] text-[#4D5155]' }">
      <template #empty>
        <div>
          <p>Your Transactions will appear here</p>
        </div>
      </template>
    </UTable>
    <!-- Table Mobile View -->
    <div class="md:hidden py-2">
      <div class="flex justify-between items-center py-3 border-b border-gray-200">
        <!-- Left Column -->
        <div>
          <h3 class="text-gray-900 font-semibold text-base">
            Rovel Jprdan
          </h3>
          <p class="text-gray-500 text-sm mt-1">
            2pm June 18th, 2026
          </p>
        </div>

        <!-- Right Column -->
        <div class="flex flex-col items-end">
          <span class="text-blue-600 font-medium text-base">#2000</span>
          <!-- Dynamic status color example -->
          <p class="text-sm font-medium mt-1 text-green-600">
            Successful
          </p>
        </div>
      </div>
      <div class="flex justify-between items-center py-3 border-b border-gray-200">
        <!-- Left Column -->
        <div>
          <h3 class="text-gray-900 font-semibold text-base">
            Rovel Jprdan
          </h3>
          <p class="text-gray-500 text-sm mt-1">
            2pm June 18th, 2026
          </p>
        </div>

        <!-- Right Column -->
        <div class="flex flex-col items-end">
          <span class="text-blue-600 font-medium text-base">#2000</span>
          <!-- Dynamic status color example -->
          <p class="text-sm font-medium mt-1 text-green-600">
            Successful
          </p>
        </div>
      </div>
      <div class="flex justify-between items-center py-3 border-b border-gray-200">
        <!-- Left Column -->
        <div>
          <h3 class="text-gray-900 font-semibold text-base">
            Rovel Jordan
          </h3>
          <p class="text-gray-500 text-sm mt-1">
            2pm June 18th, 2026
          </p>
        </div>

        <!-- Right Column -->
        <div class="flex flex-col items-end">
          <span class="text-blue-600 font-medium text-base">#2000</span>
          <!-- Dynamic status color example -->
          <p class="text-sm font-medium mt-1 text-green-600">
            Successful
          </p>
        </div>
      </div>
      <div class="flex justify-between items-center py-3 border-b border-gray-200">
        <!-- Left Column -->
        <div>
          <h3 class="text-gray-900 font-semibold text-base">
            Rovel Jordan
          </h3>
          <p class="text-gray-500 text-sm mt-1">
            2pm June 18th, 2026
          </p>
        </div>

        <!-- Right Column -->
        <div class="flex flex-col items-end">
          <span class="text-blue-600 font-medium text-base">#2000</span>
          <!-- Dynamic status color example -->
          <p class="text-sm font-medium mt-1 text-[#F9DB3F]">
            Pending
          </p>
        </div>
      </div>
    </div>
    <!-- <pre>{{ trxData }}</pre> -->
    <!-- <p class="text-red-500">
      {{ trxError }}
  </p> -->
  </main>
</template>
