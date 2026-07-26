<script setup lang="ts">
// import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import { useProfileStore } from '@/stores/profile'

const store = useProfileStore()

// const UBadge = resolveComponent('UBadge')
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

const { data: trxData, status } = await useLazyFetch('/api/transaction', {
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

const columns: TableColumn<trx>[] = [
  {
    accessorKey: 'id',
    header: 'Transaction Id',
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
    accessorKey: 'status',
    header: 'Status',
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
  <main class="bg-white p-3 py-4 sm:px-6">
    <h2 class="text-[#4D5155] mb-2.5 tracking-[2%] text-[20px] font-bold">
      Recent Transactions
    </h2>
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
          <span class="text-[#1177FE] font-medium text-base">#2000</span>
          <!-- Dynamic status color example -->
          <p class="text-sm font-medium mt-1 text-[#1CB452]">
            Successful
          </p>
        </div>
      </div>
    </div>
    <UTable :data="transactions" :loading="status === 'pending' || status === 'idle'" :columns class="flex-1 font-poppins hidden md:flex md:flex-1" :ui="{ th: 'pl-0 py-1.5 md:py-3 text-[#565252] tracking-[1%] text-[16px] font-bold leading-[150%]', td: 'pl-0 font-normal text-[16px] tracking-[5%] text-[#4D5155]' }">
      <template #empty>
        <div>
          <p>Your Transactions will appear here</p>
        </div>
      </template>
    </UTable>
  </main>
  <!-- <pre>{{ trxData }}</pre> -->
  <!-- <p class="text-red-500">
    {{ trxError }}
  </p> -->
</template>
