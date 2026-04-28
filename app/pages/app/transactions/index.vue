<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Row } from '@tanstack/vue-table'
import { useClipboard } from '@vueuse/core'
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

const UButton = resolveComponent('UButton')
// const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const toast = useToast()
const { copy } = useClipboard()

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
    header: 'Description',
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
      const status = row.getValue('status') as string
      const colorMap = {
        success: 'text-success',
        failed: 'text-error',
        refunded: 'text-warning',
        processing: 'text-indigo-500',
      }
      return h(
        'span',
        { class: `font-semibold capitalize ${colorMap[status as keyof typeof colorMap]}` },
        status,
      )
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
        hour: '2-digit',
        minute: '2-digit',
        day: 'numeric',
        month: 'short',
        hour12: true,
      })
    },
  },
  {
    header: 'Action',
    id: 'actions',
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

function getRowItems(row: Row<trx>) {
  return [
    {
      type: 'label',
      label: 'Actions',
    },
    {
      label: 'Copy Transaction Reference',
      onSelect() {
        copy(row.original.reference)

        toast.add({
          title: 'Payment Reference copied to clipboard!',
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
    <div class="flex gap-4 items-center py-3.5 border border-accented">
      <h2 class="text-[#34383D] text-[20px] font-bold leading-[150%] tracking-[2%]">
        Transaction History
      </h2>
      <UInput v-model="globalFilter" size="lg" leading-icon="i-lucide-search" class="max-w-sm" placeholder="Search for transactions" />
      <UPopover>
        <UButton label="Filter" leading-icon="i-lucide-list-filter" size="lg" subtle variant="subtle" />

        <template #content>
          <div class="p-4">
            <h2>Categories</h2>
          </div>
        </template>
      </UPopover>
    </div>
    <UTable ref="table" :data="transactions" :columns="columns" :loading="status === 'pending' || status === 'idle'" class="flex-1 font-poppins" :ui="{ th: 'pl-0 py-1.5 md:py-3 text-[#565252] tracking-[1%] text-[16px] font-bold leading-[150%]', td: 'pl-0 font-normal text-[16px] tracking-[5%] text-[#4D5155]', separator: 'bg-transparent' }">
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
