<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { AdminTransactionListItem } from '~~/server/api/admin/transactions.get'
import { useProfileStore } from '@/stores/profile'

const store = useProfileStore()

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
const table = useTemplateRef('table')
const globalFilter = ref('')

const { data: trxData, status: fetchStatus } = await useLazyFetch('/api/admin/transactions', {
  query: { userId: store.userProfile?.user_id, limit: '3' },
  key: 'transactions',
  transform: (response) => {
    if (response?.success) {
      return response.data.transactions
    }
    return []
  },
  server: false,
})

const columnFilters = ref<{ id: string, value: unknown }[]>([])

const activeStatusFilter = computed(() =>
  (columnFilters.value.find(f => f.id === 'status')?.value ?? null) as string | null,
)

const _activeTypeFilter = computed(() =>
  (columnFilters.value.find(f => f.id === 'type')?.value ?? null) as string | null,
)

const activeFilterCount = computed(() => columnFilters.value.length)

function setStatusFilter(value: string | null) {
  columnFilters.value = [
    ...columnFilters.value.filter(f => f.id !== 'status'),
    ...(value ? [{ id: 'status', value }] : []),
  ]
}

function _setTypeFilter(value: string | null) {
  columnFilters.value = [
    ...columnFilters.value.filter(f => f.id !== 'type'),
    ...(value ? [{ id: 'type', value }] : []),
  ]
}

const columns: TableColumn<AdminTransactionListItem>[] = [
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
    accessorKey: 'type',
    header: 'Service',
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
    accessorKey: 'profile',
    header: 'Number',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    filterFn: (row, columnId, filterValue) => row.getValue(columnId) === filterValue,
  },
  {
    accessorKey: 'type',
    header: 'Method',
    filterFn: (row, columnId, filterValue) => row.getValue(columnId) === filterValue,
  },
  {
    accessorKey: 'created_at',
    header: 'Date',
    cell: ({ row }) => {
      return new Date(row.getValue('created_at')).toLocaleString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    },
  },
]
</script>

<template>
  <main class="p-4 bg-white rounded-[20px]">
    <div class="flex gap-4 items-center sm:py-3.5 border-accented mb-4">
      <h2 class="hidden sm:inline-block text-nowrap text-[#34383D] text-[20px] font-bold leading-[150%] tracking-[2%]">
        Transaction History
      </h2>
      <UInput v-model="globalFilter" leading-icon="i-lucide-search" class="max-w-200.5 w-full" :ui="{ base: 'rounded-[4px] md:rounded-[12px] md:px-5 md:pl-10 md:py-2.5' }" placeholder="Search transactions..." />
      <UPopover side-flip="true" class="" :ui="{ content: '' }">
        <UButton
          :label="activeFilterCount ? `Filter (${activeFilterCount})` : 'Filter'"
          leading-icon="i-lucide-list-filter"
          :ui="{ base: 'md:px-5 md:py-2.5 rounded-[4px] md:rounded-[12px]', label: 'font-semibold text-[16px]', leadingIcon: 'size-4 md:size-5' }"
          :color="activeFilterCount ? 'primary' : 'neutral'"
          :variant="activeFilterCount ? 'subtle' : 'ghost'"
          :style="!activeFilterCount ? 'color: #4D5155; background: #DBF4FF;' : ''"
        />
        <template #content>
          <div class="p-3 flex flex-col gap-3 min-w-60 min-h-40">
            <div>
              <p class="mb-6 size-fit mx-auto text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide px-2 mb-1">
                Categories
              </p>
              <div class="flex gap-2 justify-center items-center">
                <UButton label="All" size="sm" :variant="!activeStatusFilter ? 'soft' : 'ghost'" :color="!activeStatusFilter ? 'primary' : 'neutral'" class="justify-start" @click="setStatusFilter(null)" />
                <UButton label="Success" size="sm" :variant="activeStatusFilter === 'success' ? 'soft' : 'ghost'" :color="activeStatusFilter === 'success' ? 'success' : 'neutral'" class="justify-start" @click="setStatusFilter('success')" />
                <UButton label="Pending" size="sm" :variant="activeStatusFilter === 'pending' ? 'soft' : 'ghost'" :color="activeStatusFilter === 'pending' ? 'warning' : 'neutral'" class="justify-start" @click="setStatusFilter('pending')" />
                <UButton label="Failed" size="sm" :variant="activeStatusFilter === 'failed' ? 'soft' : 'ghost'" :color="activeStatusFilter === 'failed' ? 'error' : 'neutral'" class="justify-start" @click="setStatusFilter('failed')" />
              </div>
            </div>
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
    <TrxBoxes :total="4" :successful="0" :processing="0" :failed="0" :pending="0" />
    <!-- <TrxBoxes :total="Users?.length || 0" :non-active="Users?.filter(u => u.status === 'suspended').length || 0" :active="Users?.filter(u => u.status === 'active').length || 0" /> -->

    <UTable
      v-model:column-filters="columnFilters"
      :data="trxData"
      :loading="fetchStatus === 'pending' || fetchStatus === 'idle'"
      :columns
      class="hidden md:flex md:flex-1 font-poppins mb-4"
      :ui="{ th: 'pl-0 py-1.5 md:py-3 text-[#565252] tracking-[1%] text-[16px] font-bold leading-[150%]', td: 'pl-0 font-normal text-[16px] tracking-[5%] text-[#4D5155]' }"
    >
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
            Data
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
            Data
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
            Data
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
            Data
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
    </div>
  </main>
</template>
