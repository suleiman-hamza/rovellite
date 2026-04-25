<script setup lang="ts">
// import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import { useProfileStore } from '@/stores/profile'

const store = useProfileStore()

// const UBadge = resolveComponent('UBadge')
interface trx {
  transactionId: string
  description: string | null
  amount: number
  status: string
  number: number
  paymentMethod: string
  date: string
}

// const data: {
//     created_at: string;
//     id: string;
//     metadata: Json;
//     reference: string;
//     type: string;
//     user_id: string;
//     virtual_account_no: string;
//     wallet_id: string;
//     wallet: {
//         balance: number;
//         currency: string;
//     };
// }[]
const { data: trxData, status } = await useLazyFetch('/api/transaction', {
  query: { userId: store.userProfile?.user_id, limit: '3' },
  key: 'transactions',
  server: false,
})

const columns: TableColumn<trx>[] = [
  {
    accessorKey: 'transactionId',
    header: 'Transaction Id',
    cell: ({ row }) => `#${row.getValue('id')}`,
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
    accessorKey: 'paymentMethod',
    header: 'Payment Method',
  },
  {
    accessorKey: 'date',
    header: 'Date',
  },
]
</script>

<template>
  <UTable :data="trxData?.data" :loading="status === 'pending' || status === 'idle'" :columns class="flex-1 font-poppins" :ui="{ th: 'px-0 text-[#565252] tracking-[1%] text-[16px] font-bold', td: 'px-0 font-normal text-[16px] tracking-[5%] text-[#4D5155]' }">
    <template #empty>
      <div>
        <p>Your Transactions will appear here</p>
      </div>
    </template>
  </UTable>
  <!-- <pre>{{ trxData }}</pre> -->
  <!-- <p class="text-red-500">
    {{ trxError }}
  </p> -->
</template>
