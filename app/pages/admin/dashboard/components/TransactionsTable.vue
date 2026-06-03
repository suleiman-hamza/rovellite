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
  },
  {
    accessorKey: 'type',
    header: 'Method',
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
  <main class="bg-white p-3 py-4 sm:px-6 ">
    <h2 class="text-[#4D5155] mb-2.5 tracking-[2%] text-[20px] font-bold">
      Recent Transactions
    </h2>
    <UTable :data="transactions" :loading="status === 'pending' || status === 'idle'" :columns class="flex-1 font-poppins" :ui="{ th: 'pl-0 py-1.5 md:py-3 text-[#565252] tracking-[1%] text-[16px] font-bold leading-[150%]', td: 'pl-0 font-normal text-[16px] tracking-[5%] text-[#4D5155]' }">
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
