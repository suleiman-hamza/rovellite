<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { h, resolveComponent } from 'vue'
// import { getPaginationRowModel } from '@tanstack/vue-table'
import { useProfileStore } from '@/stores/profile'

const store = useProfileStore()

definePageMeta({
  title: 'Transactions',
  layout: 'dashboard-layout',
  middleware: 'auth',
  keepalive: true,
})

const UBadge = resolveComponent('UBadge')
// interface trx {
//   id: number
//   transactionId: string
//   description: string | null
//   amount: number
//   status: string
//   number: number
//   paymentMethod: string
//   date: string
// }

// types/transactions.ts
// export interface Transaction {
//   id: string
//   amount: number
//   type: string
//   status: string
//   reference: string
//   created_at: string // Serialized dates are strings
//   description: string | null
//   user_id: string
//   metadata: JSON
//   virtual_account_no: string
//   wallet_id: string
//   wallet: {
//     balance: number
//     currency: string
//   }

// }

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

const table = useTemplateRef('table')

const { data: trxData, status } = await useLazyFetch('/api/transaction', {
  query: { userId: store.userProfile?.user_id, limit: '10' },
  key: 'transactions',
  server: false,
})

const transactions = computed<trx[]>(() => {
  if (trxData.value?.success) {
    return trxData.value.data
  }
  return []
})

const columns: TableColumn<trx>[] = [
  {
    accessorKey: 'id',
    header: 'S/N',
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: 'reference',
    header: 'Refrence',
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
    cell: ({ row }) => {
      const color = {
        success: 'success' as const,
        failed: 'error' as const,
        refunded: 'neutral' as const,
      }[row.getValue('status') as string]

      return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () =>
        row.getValue('status'))
    },
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

// const pagination = ref({
//   pageIndex: 0,
//   pageSize: 5,
// })

const globalFilter = ref('')
</script>

<template>
  <main class="bg-white rounded-[20px] p-4">
    <div class="flex py-3.5 border-b border-accented">
      <UInput v-model="globalFilter" class="max-w-sm" placeholder="Filter..." />
    </div>
    <UTable ref="table" :data="transactions" :columns="columns" :loading="status === 'pending' || status === 'idle'" class="flex-1 font-poppins" :ui="{ th: 'pl-0 py-1.5 md:py-3 text-[#565252] tracking-[1%] text-[16px] font-bold leading-[150%]', td: 'pl-0 font-normal text-[16px] tracking-[5%] text-[#4D5155]' }">
      <template #empty>
        <div>
          <p>Your Transactions will appear here</p>
        </div>
      </template>
    </UTable>
    <div class="flex justify-end border-t border-default pt-4 px-4">
      <UPagination
        :page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
        :items-per-page="table?.tableApi?.getState().pagination.pageSize"
        :total="table?.tableApi?.getFilteredRowModel().rows.length"
        @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)"
      />
    </div>
  </main>
</template>
