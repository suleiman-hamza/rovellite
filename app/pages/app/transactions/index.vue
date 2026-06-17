<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Row } from '@tanstack/vue-table'
import { getPaginationRowModel } from '@tanstack/vue-table'
import { useClipboard } from '@vueuse/core'
import { h, resolveComponent } from 'vue'
// import { useProfileStore } from '@/stores/profile'

// const store = useProfileStore()

definePageMeta({
  title: 'Funding History',
  layout: 'dashboard-layout',
  middleware: 'auth',
  keepalive: true,
})

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const toast = useToast()
const { copy } = useClipboard()

const columnFilters = ref<{ id: string, value: unknown }[]>([])

const activeStatusFilter = computed(() =>
  (columnFilters.value.find(f => f.id === 'status')?.value ?? null) as 'paid' | 'failed' | 'refunded' | null,
)

function setStatusFilter(value: 'paid' | 'failed' | 'refunded' | null) {
  columnFilters.value = value
    ? [{ id: 'status', value }]
    : []
}

interface Payment {
  id: string
  date: string
  email: string
  amount: number
  status: 'paid' | 'failed' | 'refunded'
}

const transactions = ref<Payment[]>([
  {
    id: '4600',
    date: '2024-03-11T15:30:00',
    email: 'james.anderson@example.com',
    amount: 594,
    status: 'paid',
  },
  {
    id: '4599',
    date: '2024-03-11T10:10:00',
    email: 'mia.white@example.com',
    amount: 276,
    status: 'paid',
  },
  {
    id: '4598',
    date: '2024-03-11T08:50:00',
    email: 'william.brown@example.com',
    amount: 315,
    status: 'failed',
  },
  {
    id: '4597',
    date: '2024-03-10T19:45:00',
    email: 'emma.davis@example.com',
    amount: 529,
    status: 'refunded',
  },
  {
    id: '4596',
    date: '2024-03-10T15:55:00',
    email: 'ethan.harris@example.com',
    amount: 639,
    status: 'paid',
  },
  {
    id: '4595',
    date: '2024-03-10T13:20:00',
    email: 'sophia.miller@example.com',
    amount: 428,
    status: 'paid',
  },
  {
    id: '4594',
    date: '2024-03-10T11:05:00',
    email: 'noah.wilson@example.com',
    amount: 673,
    status: 'refunded',
  },
  {
    id: '4593',
    date: '2024-03-09T22:15:00',
    email: 'olivia.jones@example.com',
    amount: 382,
    status: 'paid',
  },
  {
    id: '4592',
    date: '2024-03-09T20:30:00',
    email: 'liam.taylor@example.com',
    amount: 547,
    status: 'refunded',
  },
  {
    id: '4591',
    date: '2024-03-09T18:45:00',
    email: 'ava.thomas@example.com',
    amount: 291,
    status: 'refunded',
  },
  {
    id: '4590',
    date: '2024-03-09T16:20:00',
    email: 'lucas.martin@example.com',
    amount: 624,
    status: 'failed',
  },
  {
    id: '4589',
    date: '2024-03-09T14:10:00',
    email: 'isabella.clark@example.com',
    amount: 438,
    status: 'paid',
  },
  {
    id: '4588',
    date: '2024-03-09T12:05:00',
    email: 'mason.rodriguez@example.com',
    amount: 583,
    status: 'paid',
  },
  {
    id: '4587',
    date: '2024-03-09T10:30:00',
    email: 'sophia.lee@example.com',
    amount: 347,
    status: 'paid',
  },
  {
    id: '4586',
    date: '2024-03-09T08:15:00',
    email: 'ethan.walker@example.com',
    amount: 692,
    status: 'refunded',
  },
  {
    id: '4585',
    date: '2024-03-08T23:40:00',
    email: 'amelia.hall@example.com',
    amount: 419,
    status: 'paid',
  },
  {
    id: '4584',
    date: '2024-03-08T21:25:00',
    email: 'oliver.young@example.com',
    amount: 563,
    status: 'refunded',
  },
  {
    id: '4583',
    date: '2024-03-08T19:50:00',
    email: 'aria.king@example.com',
    amount: 328,
    status: 'paid',
  },
  {
    id: '4582',
    date: '2024-03-08T17:35:00',
    email: 'henry.wright@example.com',
    amount: 647,
    status: 'refunded',
  },
  {
    id: '4581',
    date: '2024-03-08T15:20:00',
    email: 'luna.lopez@example.com',
    amount: 482,
    status: 'paid',
  },
])

const columns: TableColumn<Payment>[] = [
  {
    accessorKey: 'id',
    header: '#',
    cell: ({ row }) => `#${row.getValue('id')}`,
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => {
      return new Date(row.getValue('date')).toLocaleString('en-US', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    meta: {
      class: {
        th: 'text-right',
        td: 'text-right font-medium',
      },
    },
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
      const colorMap = { paid: 'success', failed: 'error', refunded: 'warning' } as const
      const color = colorMap[row.original.status] ?? 'neutral'
      return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () => row.original.status)
    },
  },
  {
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

const table = useTemplateRef('table')

// const { data: trxData, status } = await useLazyFetch('/api/transaction', {
//   query: { userId: store.userProfile?.user_id, limit: '10' },
//   key: 'transactions',
//   server: false,
// })

const pagination = ref({
  pageIndex: 0,
  pageSize: 5,
})

function getRowItems(row: Row<Payment>) {
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

// const pagination = ref({
//   pageIndex: 0,
//   pageSize: 5,
// })

const globalFilter = ref('')
</script>

<template>
  <main class="bg-white rounded-[20px] p-4">
    <h2 class="sm:hidden inline text-[#34383D] text-[14px] sm:text-[20px] font-bold leading-[150%] tracking-[2%]">
      Funding History
    </h2>
    <div class="flex justify-between gap-2 items-center py-3.5 border-accented mb-4">
      <h2 class="hidden sm:inline-block text-nowrap text-[#34383D] text-[20px] font-bold leading-[150%] tracking-[2%]">
        Funding History
      </h2>
      <UInput v-model="globalFilter" leading-icon="i-lucide-search" class="max-w-112.5 w-full" :ui="{ base: 'rounded-[4px] md:rounded-[12px] md:px-5 md:pl-10 md:py-2.5' }" placeholder="Search for transactions" />
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
              label="Paid"
              size="sm"
              :variant="activeStatusFilter === 'paid' ? 'soft' : 'ghost'"
              :color="activeStatusFilter === 'paid' ? 'success' : 'neutral'"
              class="justify-start"
              @click="setStatusFilter('paid')"
            />
            <UButton
              label="Failed"
              size="sm"
              :variant="activeStatusFilter === 'failed' ? 'soft' : 'ghost'"
              :color="activeStatusFilter === 'failed' ? 'error' : 'neutral'"
              class="justify-start"
              @click="setStatusFilter('failed')"
            />
            <UButton
              label="Refunded"
              size="sm"
              :variant="activeStatusFilter === 'refunded' ? 'soft' : 'ghost'"
              :color="activeStatusFilter === 'refunded' ? 'warning' : 'neutral'"
              class="justify-start"
              @click="setStatusFilter('refunded')"
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
    <UTable
      ref="table" v-model:pagination="pagination" v-model:global-filter="globalFilter" v-model:column-filters="columnFilters" :data="transactions"
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
