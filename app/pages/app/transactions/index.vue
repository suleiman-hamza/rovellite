<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Row } from '@tanstack/vue-table'
import { getPaginationRowModel } from '@tanstack/vue-table'
import { useClipboard } from '@vueuse/core'
import { h, resolveComponent } from 'vue'
import { useProfileStore } from '@/stores/profile'

const store = useProfileStore()

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

type TransactionStatus = 'successful' | 'failed' | 'pending' | 'refunded' | 'completed'

interface Transaction {
  id: string
  createdAt: string
  description: string
  amount: number
  status: TransactionStatus
  reference: string
  type: string
}

const activeStatusFilter = computed(() =>
  (columnFilters.value.find(f => f.id === 'status')?.value ?? null) as TransactionStatus | null,
)

function setStatusFilter(value: TransactionStatus | null) {
  columnFilters.value = value
    ? [{ id: 'status', value }]
    : []
}

function normalizeStatus(status?: string | null): TransactionStatus {
  const normalized = (status ?? '').toLowerCase()

  if (['successful', 'success', 'completed', 'paid'].includes(normalized)) {
    return 'successful'
  }

  if (['failed', 'error'].includes(normalized)) {
    return 'failed'
  }

  if (['pending', 'processing'].includes(normalized)) {
    return 'pending'
  }

  if (['refunded', 'refund'].includes(normalized)) {
    return 'refunded'
  }

  return 'pending'
}

function formatCurrency(amount: number | string | null | undefined) {
  const value = Number(amount ?? 0)

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'NGN',
  }).format(value)
}
// Module scope — compiled once, reused by every formatTransactionType() call
const WORD_SEPARATOR_REGEX = /[_\s-]+/

function formatTransactionType(type?: string | null) {
  const value = (type ?? '').toLowerCase().trim()

  if (!value) {
    return 'Transaction'
  }

  if (['wallet', 'wallet_funding', 'funding', 'fund'].includes(value)) {
    return 'Wallet Funding'
  }

  if (['airtime', 'data', 'electricity', 'betting', 'education', 'paytv', 'transport'].includes(value)) {
    return value.split(WORD_SEPARATOR_REGEX).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  return value
    .split(WORD_SEPARATOR_REGEX)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function formatDate(value: string | null | undefined) {
  if (!value) {
    return '—'
  }

  return new Date(value).toLocaleString('en-US', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

// Text color for the status label in the mobile list — mirrors the color
// logic already used for the desktop UBadge (success/error/warning/neutral).
function statusTextClass(status: TransactionStatus) {
  switch (status) {
    case 'successful':
      return 'text-[#1ED760]'
    case 'failed':
      return 'text-red-500'
    case 'pending':
      return 'text-amber-500'
    case 'refunded':
      return 'text-gray-400'
    default:
      return 'text-gray-400'
  }
}

const { data: trxData, status: fetchStatus } = await useLazyFetch('/api/transaction', {
  query: { userId: store.userProfile?.user_id, limit: '10' },
  key: 'transactionstable',
  server: false,
})

const transactions = computed<Transaction[]>(() => {
  if (trxData.value?.success && Array.isArray(trxData.value.data)) {
    return trxData.value.data.map((item: Record<string, any>) => ({
      id: String(item.id ?? ''),
      createdAt: item.created_at ?? item.date ?? '',
      description: item.description || item.reference || 'Transaction',
      amount: Number(item.amount ?? 0),
      status: normalizeStatus(item.status),
      reference: item.reference ?? item.id ?? '',
      type: formatTransactionType(item.type),
    }))
  }

  return []
})

const columns: TableColumn<Transaction>[] = [
  {
    accessorKey: 'id',
    header: '#',
    cell: ({ row }) => `#${row.getValue('id')}`,
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => formatCurrency(row.getValue('amount')),
  },
  {
    accessorKey: 'reference',
    header: 'Reference',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    filterFn: (row, columnId, filterValue) => row.getValue(columnId) === filterValue,
    cell: ({ row }) => {
      const color = row.original.status === 'failed'
        ? 'error'
        : row.original.status === 'pending'
          ? 'warning'
          : row.original.status === 'refunded'
            ? 'neutral'
            : 'success'
      const label = row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)

      return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () => label)
    },
  },
  {
    accessorKey: 'type',
    header: 'Type',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => formatDate(row.getValue('createdAt')),
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

// Mirrors the exact rows the desktop <UTable> renders on the current page —
// same filtering, sorting and pagination, just displayed as a list instead
// of a table on mobile. Keeps mobile/desktop in sync off one source of truth.
//
// NOTE: both the return type and the `row` param below are annotated
// explicitly. `table` refs a generic component (UTable<TData>), so an
// un-annotated computed() here creates a circular inference loop with the
// component's generic resolution in the template — which is also what was
// producing the separate __VLS_113 error on the <UTable ref="table"> binding.

const pagination = ref({
  pageIndex: 0,
  pageSize: 5,
})

function getRowItems(row: Row<Transaction>) {
  return [
    {
      type: 'label',
      label: 'Actions',
    },
    {
      label: 'Copy reference',
      onSelect() {
        copy(row.original.reference || row.original.description || row.original.id)

        toast.add({
          title: 'Transaction reference copied to clipboard!',
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

const globalFilter = ref('')
</script>

<template>
  <main class="bg-white rounded-[20px] p-4">
    <!-- mobile view -->
    <section class="sm:hidden">
      <h2 class="text-[#34383D] text-[16px] font-bold leading-[150%] tracking-[2%] mb-4">
        Transactions History
      </h2>

      <div class="flex items-center gap-2 mb-3">
        <UInput
          v-model="globalFilter"
          leading-icon="i-lucide-search"
          class="flex-1"
          :ui="{ base: 'rounded-[10px]' }"
          placeholder="Search"
        />
        <UPopover>
          <UButton
            icon="i-lucide-list-filter"
            :ui="{ base: 'rounded-[10px] p-2.5' }"
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
                label="Successful"
                size="sm"
                :variant="activeStatusFilter === 'successful' ? 'soft' : 'ghost'"
                :color="activeStatusFilter === 'successful' ? 'success' : 'neutral'"
                class="justify-start"
                @click="setStatusFilter('successful')"
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
                label="Pending"
                size="sm"
                :variant="activeStatusFilter === 'pending' ? 'soft' : 'ghost'"
                :color="activeStatusFilter === 'pending' ? 'warning' : 'neutral'"
                class="justify-start"
                @click="setStatusFilter('pending')"
              />
            </div>
          </template>
        </UPopover>
        <div class="flex items-center gap-1.5 shrink-0">
          <UButton
            icon="i-lucide-chevron-left"
            variant="soft"
            color="neutral"
            class="rounded-full"
            :ui="{ base: 'p-2' }"
            :disabled="!table?.tableApi?.getCanPreviousPage()"
            @click="table?.tableApi?.previousPage()"
          />
          <UButton
            icon="i-lucide-chevron-right"
            variant="soft"
            color="neutral"
            class="rounded-full"
            :ui="{ base: 'p-2' }"
            :disabled="!table?.tableApi?.getCanNextPage()"
            @click="table?.tableApi?.nextPage()"
          />
        </div>
      </div>

      <div v-if="fetchStatus === 'pending' || fetchStatus === 'idle'" class="py-6 text-center text-sm text-[#9CA3AF]">
        Loading transactions...
      </div>
      <div v-else-if="!table?.tableApi?.getRowModel().rows.length" class="py-6 text-center text-sm text-[#9CA3AF]">
        Your Transactions will appear here
      </div>
      <div v-else>
        <div
          v-for="(item, index) in table?.tableApi?.getRowModel().rows"
          :key="item.id || index"
          class="flex justify-between items-start py-3 border-b border-gray-100 last:border-none"
        >
          <div class="flex gap-2.5">
            <span class="text-[13px] text-[#9CA3AF] mt-0.5">{{ index + 1 }}</span>
            <div>
              <p class="font-bold text-[#34383D] text-[15px] leading-[150%]">
                {{ item.original.description }}
              </p>
              <p class="text-[13px] text-[#9CA3AF] mt-0.5">
                {{ formatDate(item.original.createdAt) }}
              </p>
            </div>
          </div>
          <div class="text-right">
            <p class="font-bold text-[#1177FE] text-[15px] leading-[150%]">
              {{ formatCurrency(item.original.amount) }}
            </p>
            <p class="text-[13px] font-medium mt-0.5" :class="statusTextClass(item.original.status)">
              {{ item.original.status.charAt(0).toUpperCase() + item.original.status.slice(1) }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- desktop view -->
    <section class="hidden sm:block">
      <div class="flex justify-between gap-2 items-center py-3.5 border-accented mb-4">
        <h2 class="hidden sm:inline-block text-nowrap text-[#34383D] text-[20px] font-bold leading-[150%] tracking-[2%]">
          Transactions
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
                label="Successful"
                size="sm"
                :variant="activeStatusFilter === 'successful' ? 'soft' : 'ghost'"
                :color="activeStatusFilter === 'successful' ? 'success' : 'neutral'"
                class="justify-start"
                @click="setStatusFilter('successful')"
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
                label="Pending"
                size="sm"
                :variant="activeStatusFilter === 'pending' ? 'soft' : 'ghost'"
                :color="activeStatusFilter === 'pending' ? 'warning' : 'neutral'"
                class="justify-start"
                @click="setStatusFilter('pending')"
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
        ref="table"
        v-model:pagination="pagination"
        v-model:global-filter="globalFilter"
        v-model:column-filters="columnFilters"
        :data="transactions"
        :columns="columns"
        :loading="fetchStatus === 'pending' || fetchStatus === 'idle'"
        :pagination-options="{
          getPaginationRowModel: getPaginationRowModel(),
        }"
        class="flex-1 font-poppins"
        :ui="{ th: 'pl-0 py-1.5 md:py-3 text-[#565252] tracking-[1%] text-[16px] font-bold leading-[150%]', td: 'pl-0 font-normal text-[16px] tracking-[5%] text-[#4D5155]', separator: 'bg-transparent' }"
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
    </section>
  </main>
</template>
