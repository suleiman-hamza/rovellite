<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { useProfileStore } from '#imports'

const store = useProfileStore()

interface trx {
  created_at: string
  id: string
  reference: string
  type: string
  user_id: string
  virtual_account_no: string
  wallet_id: string
  wallet: {
    balance: number
    currency: string
  }
}

const { data: trxData, status: fetchStatus } = await useLazyFetch('/api/transaction', {
  query: { userId: store.userProfile?.user_id, limit: '3' },
  key: 'transactions',
  server: false,
})

const transactions = computed(() => {
  if (trxData.value?.success) {
    return trxData.value.data
  }
  return []
})

const columnFilters = ref<{ id: string, value: unknown }[]>([])

const columns: TableColumn<trx>[] = [
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
    accessorKey: 'description',
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
    accessorKey: 'number',
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
  <div>
    <!-- end mobile transaction table -->
    <section class="md:hidden space-y-2">
      <template v-if="transactions.length">
        <div
          v-for="transaction in transactions"
          :key="transaction.id"
          class="flex justify-between items-center pb-2 border-b border-gray-200"
        >
          <div class="min-w-0">
            <h3 class="text-gray-900 font-semibold text-base truncate">
              {{ transaction.description || 'Transaction' }}
            </h3>
            <p class="text-gray-500 text-sm mt-1">
              {{ new Date(transaction.created_at).toLocaleString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              }) }}
            </p>
          </div>

          <div class="flex flex-col items-end text-right">
            <span class="text-[#1177FE] font-medium text-base">
              {{ new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'NGN',
              }).format(Number(transaction.amount || 0)) }}
            </span>
            <p
              class="text-sm font-medium mt-1"
              :class="transaction.status?.toLowerCase() === 'successful' ? 'text-[#1CB452]' : transaction.status?.toLowerCase() === 'failed' ? 'text-[#EF4444]' : 'text-[#F59E0B]'"
            >
              {{ transaction.status || 'Pending' }}
            </p>
          </div>
        </div>
      </template>

      <div v-else class="rounded-lg border border-dashed border-gray-200 px-4 py-6 text-center text-sm text-gray-500">
        No transactions available yet.
      </div>
    </section>
    <!-- end mobile transaction table -->

    <!-- desktop ransaction table -->
    <UTable
      v-model:column-filters="columnFilters"
      :data="transactions"
      :loading="fetchStatus === 'pending' || fetchStatus === 'idle'"
      :columns
      class="flex-1 font-poppins hidden md:flex md:flex-1"
      :ui="{ th: 'pl-0 py-1.5 md:py-3 text-[#565252] tracking-[1%] text-[16px] font-bold leading-[150%]', td: 'pl-0 font-normal text-[16px] tracking-[5%] text-[#4D5155]' }"
    >
      <template #empty>
        <div>
          <p>Your Transactions will appear here</p>
        </div>
      </template>
    </UTable>
  </div>
</template>
