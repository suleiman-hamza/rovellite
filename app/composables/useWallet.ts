// composables/useWallet.ts
//
// Place this file in `composables/` (or `app/composables/` if you're on the
// Nuxt 4 srcDir layout) — Nuxt auto-imports it, no manual import needed.

interface WalletProfile {
  email: string
  status: string
  verified: boolean
  full_name: string
  avatar_url: string | null
}

interface WalletData {
  id: string
  user_id: string
  balance: number
  currency: string
  status: string
  created_at: string
  updated_at: string
  profiles?: WalletProfile
}

interface WalletResponse {
  success: boolean
  message: string
  data: WalletData
  timestamp: string
}

/**
 * Fetches the authenticated user's wallet from /api/wallet and exposes
 * formatted/derived state for use across the app (Wallet component,
 * standalone balance displays, etc.)
 *
 * NOTE: totalCredited / totalSpent are intentionally NOT exposed here —
 * /api/wallet only returns `balance`. Those totals would need to be
 * aggregated from the transactions ledger via a separate endpoint/query.
 * Wire them up here once that source exists, following the same
 * computed() pattern as `balance` below.
 */
export async function useWallet() {
  const store = useProfileStore()

  const { data: walletData, pending, error, refresh } = await useFetch<WalletResponse>('/api/wallet', {
    query: { userId: store.userProfile?.user_id },
  })

  const isAmountVisible = ref(true)

  const balance = computed(() => walletData.value?.data?.balance ?? 0)

  const displayedBalance = computed((): string => {
    if (isAmountVisible.value && walletData.value?.success) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'NGN',
      }).format(balance.value)
    }
    return '••••'
  })

  function toggleAmountVisibility() {
    isAmountVisible.value = !isAmountVisible.value
  }

  return {
    walletData,
    balance,
    displayedBalance,
    isAmountVisible,
    toggleAmountVisibility,
    pending,
    error,
    refresh,
  }
}
