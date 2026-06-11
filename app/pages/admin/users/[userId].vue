<script setup lang="ts">
import type { DropdownMenuItem, TableColumn } from '@nuxt/ui'
import { getPaginationRowModel } from '@tanstack/vue-table'
import { h, resolveComponent } from 'vue'
import TransactionStats from './components/TransactionStats.vue'

const UBadge = resolveComponent('UBadge')

const isModalOpen = ref(false)
const selectedAction = ref<'deactivate' | 'enable' | 'delete' | 'copy' | null>(null)

const modalConfig = computed(() => {
  switch (selectedAction.value) {
    case 'deactivate':
      return { title: 'Deactivate Account', description: 'Are you sure you want to deactivate this account? The user will no longer be able to log in.', actionLabel: 'Deactivate', actionColor: 'error' as const }
    case 'enable':
      return { title: 'Enable Account', description: 'Are you sure you want to enable this account? The user will regain access.', actionLabel: 'Enable', actionColor: 'success' as const }
    case 'delete':
      return { title: 'Delete Account', description: 'Are you sure you want to permanently delete this account? This action cannot be undone.', actionLabel: 'Delete', actionColor: 'error' as const }
    case 'copy':
      return { title: 'Copy Account', description: 'Copy this account\'s details to clipboard?', actionLabel: 'Copy', actionColor: 'neutral' as const }
    default:
      return { title: '', description: '', actionLabel: '', actionColor: 'neutral' as const }
  }
})

function handleModalAction() {
  // TODO: implement action logic per selectedAction.value
  isModalOpen.value = false
}

const items = ref<DropdownMenuItem[]>([
  {
    label: 'Deactivate Account',
    icon: 'i-lucide-ban',
    color: 'error',
    onSelect() {
      selectedAction.value = 'deactivate'
      isModalOpen.value = true
    },
  },
  {
    label: 'Enable Account',
    icon: 'i-lucide-refresh-ccw',
    onSelect() {
      selectedAction.value = 'enable'
      isModalOpen.value = true
    },
  },
  {
    label: 'Delete Account',
    icon: 'i-lucide-trash',
    color: 'error',
    onSelect() {
      selectedAction.value = 'delete'
      isModalOpen.value = true
    },
  },
  {
    label: 'Copy Account',
    icon: 'i-lucide-clipboard',
    onSelect() {
      selectedAction.value = 'copy'
      isModalOpen.value = true
    },
  },
])

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
    header: 'S/N',
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: 'id',
    header: 'Trans Id',
  },
  {
    accessorKey: '',
    header: 'Service',
    cell: () => 'Airtime',
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
    accessorKey: '',
    header: 'Number',
    cell: () => {
      return Math.random().toString().slice(2, 12)
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const color = { paid: 'success', failed: 'error', refunded: 'warning' }[row.original.status as string] ?? 'neutral'
      return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () => row.original.status)
    },
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

// const pagination = ref({
//   pageIndex: 0,
//   pageSize: 5,
// })

const globalFilter = ref('')
</script>

<template>
  <main class="">
    <section class="flex justify-between gap-4 mb-6">
      <div class="flex items-center gap-5">
        <div class="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-200" />
        <div>
          <p class="text-[18px] font-bold text-[#4D5155]">
            John Doe
          </p>
          <p class="text-[14px] text-[#676A6D]">
            john.doe@example.com
          </p>
          <p class="text-[14px] text-[#676A6D]">
            +234567890909
          </p>
          <p class="text-[14px] text-[#676A6D]">
            Active
          </p>
        </div>
      </div>
      <div class="">
        <UDropdownMenu
          :items="items" :content="{
            align: 'end',
            side: 'bottom',
            sideOffset: 8,
          }"
        >
          <UButton icon="i-lucide-arrow-down-narrow-wide" label="Actions" color="neutral" size="lg" variant="soft" />
        </UDropdownMenu>
      </div>
    </section>
    <!-- blue banner -->
    <section class="bg-[#1177FE] rounded-[16px]">
      <UPageGrid class="p-5 rounded-[20px] gap-4">
        <UPageCard
          class="bg-white rounded-[20px] px-2 py-3.5"
          :ui="{ container: 'p-0 sm:p-0 rounded-[20px]' }"
        >
          <template #default>
            <div class="rounded-[20px]">
              <div class="flex gap-2 items-center relative">
                <span class="p-2.5 rounded-[8px]">
                  <NuxtImg src="/images/cart-empty.svg" alt="alt text here" class="w-8 h-8" />
                </span>
                <div class="truncate">
                  <p class="text-[20px] font-bold text-[#4D5155]">
                    0
                  </p>
                  <h3 class="text-[14px] md:text-[16px] lg:text-[18px] tracking-[2%] md:tracking-[10%] text-[#676A6D] font-medium">
                    No Wallet
                  </h3>
                </div>
              </div>
            </div>
          </template>
        </UPageCard>
        <UPageCard
          class="bg-white rounded-[20px] px-2 py-3.5"
          :ui="{ container: 'p-0 sm:p-0 rounded-[20px]' }"
        >
          <template #default>
            <div class="rounded-[20px]">
              <div class="flex gap-2 items-center relative">
                <span class="p-2.5 rounded-[8px]">
                  <NuxtImg src="/images/cart-empty.svg" alt="alt text here" class="w-8 h-8" />
                </span>
                <div class="truncate">
                  <p class="text-[20px] font-bold text-[#4D5155]">
                    0
                  </p>
                  <h3 class="text-[14px] md:text-[16px] lg:text-[18px] tracking-[2%] md:tracking-[10%] text-[#676A6D] font-medium">
                    No Wallet
                  </h3>
                </div>
              </div>
            </div>
          </template>
        </UPageCard>
        <UPageCard
          class="bg-white rounded-[20px] px-2 py-3.5"
          :ui="{ container: 'p-0 sm:p-0 rounded-[20px]' }"
        >
          <template #default>
            <div class="rounded-[20px]">
              <div class="flex gap-2 items-center relative">
                <span class="p-2.5 rounded-[8px]">
                  <NuxtImg src="/images/cart-empty.svg" alt="alt text here" class="w-8 h-8" />
                </span>
                <div class="truncate">
                  <p class="text-[20px] font-bold text-[#4D5155]">
                    0
                  </p>
                  <h3 class="text-[14px] md:text-[16px] lg:text-[18px] tracking-[2%] md:tracking-[10%] text-[#676A6D] font-medium">
                    No Wallet
                  </h3>
                </div>
              </div>
            </div>
          </template>
        </UPageCard>
      </UPageGrid>
      <div class="p-4 sm:px-6 text-white">
        <div class="flex justify-between items-start md:gap-3">
          <div class="flex gap-1.5 md:gap-3 items-center font-bold text-[16px] md:text-[24px] mb-2">
            <NuxtImg src="/images/icons/palmpay-wallet.svg" alt="palmpay wallet" class="w-5.5 h-5.5 md:w-8 md:h-8" />
            <h3 class="text-[16px] md:text-[24px] tracking-[1%]">
              Palmpay
            </h3>
            <span class="tracking-[1%]">0450987873</span>
          </div>
          <div class="">
            <p>Sign Up Date: Jan 1, 2023</p>
            <USeparator class="my-4" />
            <p>Last Login: Jan 1, 2026</p>
          </div>
        </div>
      </div>
    </section>
    <section class="bg-white rounded-[20px] mt-6">
      <UPageGrid :ui="{ base: '' }" class="bg-[#FFFFFF] py-5 px-3 sm:px-4 sm:py-4.5 lg:px-6 gap-4 rounded-xl grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
        <div class="relative col-span-3 md:col-span-1 bg-[#F2FBFF] rounded-xl flex justify-between p-3">
          <div>
            <h3 class="text-[#4D5155] font-bold text-[14px] md:text-[16px] tracking-[1%]">
              vhehk;ssio
            </h3>
            <h4 class="text-[#565252] text-[14px] md:text-[16px] md:tracking-[5%]">
              Referral Code
            </h4>
          </div>
          <button
            class="absolute top-4 right-4 bg-[#C4ECFE] p-1 px-2 rounded-sm h-fit text-[14px]"
          >
            <span>Copy</span>
          </button>
        </div>
        <div class="bg-[#F2FBFF] rounded-lg flex flex-col text-center justify-center items-center p-3">
          <h3 class="text-[#4D5155] font-bold text-[14px] md:text-[16px]">
            #20,000
          </h3>
          <h4 class="text-[#565252] text-[12px] md:text-[16px] md:tracking-[5%]">
            Referal Bonus
          </h4>
        </div>
        <div class="bg-[#F2FBFF] rounded-lg flex flex-col text-center justify-center items-center p-3">
          <h3 class="text-[#4D5155] font-bold text-[14px] md:text-[16px]">
            #20,000
          </h3>
          <h4 class="text-[#565252] text-[12px] md:text-[16px] text-center md:tracking-[5%]">
            Total Referrals
          </h4>
        </div>
        <div class="bg-[#F2FBFF] rounded-lg flex flex-col text-center justify-center items-center p-3 py-2">
          <span class="flex gap-2 font-bold">
            <NuxtImg src="images/dashboard/giftboxblue.svg" alt="Withdraw earnings" class="text-primary w-6 h-6 inline" />
            #20,000
          </span>
          <h4 class="text-[#565252] text-[12px] md:text-[16px] text-center md:tracking-[5%]">
            Total Withdrawal
          </h4>
        </div>
      </UPageGrid>
    </section>
    <section class="mt-6 bg-white p-4 rounded-[20px]">
      <h2 class="sm:hidden inline text-[#34383D] text-[14px] sm:text-[20px] font-bold leading-[150%] tracking-[2%]">
        Transaction History
      </h2>
      <div class="flex justify-between gap-2 items-center py-3.5 border-accented mb-4">
        <h2 class="hidden sm:inline-block text-nowrap text-[#34383D] text-[20px] font-bold leading-[150%] tracking-[2%]">
          Transaction History
        </h2>
        <UInput v-model="globalFilter" leading-icon="i-lucide-search" class="max-w-112.5 w-full" :ui="{ base: 'rounded-[4px] md:rounded-[12px] md:px-5 md:pl-10 md:py-2.5' }" placeholder="Search for transactions" />
        <UPopover>
          <UButton label="Filter" leading-icon="i-lucide-list-filter" :ui="{ base: 'md:px-5 md:py-2.5 text-[#4D5155] bg-[#DBF4FF] rounded-[4px] md:rounded-[12px]', label: 'text-[#4D5155] font-semibold text-[16px]', leadingIcon: 'size-4 md:size-5' }" />
          <template #content>
            <div class="p-4">
              <h2>Categories</h2>
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
      <TransactionStats :total="20" :successful="20" :pending="6" :processing="6" :failed="6" :products="6" />
      <UTable
        ref="table" v-model:pagination="pagination" v-model:global-filter="globalFilter" :data="transactions"
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
    </section>

    <UModal v-model:open="isModalOpen" :title="modalConfig.title" :description="modalConfig.description">
      <template #footer>
        <UButton label="Cancel" color="neutral" variant="outline" @click="isModalOpen = false" />
        <UButton :label="modalConfig.actionLabel" :color="modalConfig.actionColor" @click="handleModalAction" />
      </template>
    </UModal>
  </main>
</template>
