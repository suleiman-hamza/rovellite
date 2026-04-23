import type { SupabaseClient } from '@supabase/supabase-js'
import type {
  CreditWalletWithTransactionArgs,
  VirtualAccountCreditParams,
  VirtualAccountCreditResult,
} from '../../types/supabase'
import type { Database } from '../../types/supabase-schema'

export async function processVirtualAccountCredit(
  supabase: SupabaseClient<Database>,
  params: VirtualAccountCreditParams,
): Promise<VirtualAccountCreditResult> {
  const { virtualAccountNo, amount, reference, description, metadata } = params

  if (Number.isNaN(amount) || amount <= 0) {
    return { success: false, message: 'Invalid amount received', statusCode: 400 }
  }

  // Fetch Virtual account
  const { data: vaData, error: vaError } = await supabase
    .from('virtual_accounts')
    .select('id, user_id, virtual_account_no, status')
    .eq('virtual_account_no', virtualAccountNo.trim())
    .maybeSingle()

  if (vaError || !vaData) {
    console.warn(JSON.stringify({ level: 'warn', service: 'webhook-credit', event: 'va_not_found', virtualAccountNo }))
    return { success: false, message: 'Virtual account not found', statusCode: 404 }
  }

  const virtualAccount = vaData as { user_id: string, status: string }

  // Fetch Wallet & Verify active status
  const { data: walletData, error: walletError } = await supabase
    .from('wallets')
    .select('id, balance, status')
    .eq('user_id', virtualAccount.user_id)
    .single()

  if (walletError || !walletData) {
    console.error(JSON.stringify({ level: 'error', service: 'webhook-credit', event: 'wallet_not_found', userId: virtualAccount.user_id }))
    return { success: false, message: 'Wallet not found for this account', statusCode: 404 }
  }

  const wallet = walletData as { id: string, status: string }

  if (wallet.status !== 'Active') {
    console.warn(JSON.stringify({ level: 'warn', service: 'webhook-credit', event: 'wallet_inactive', userId: virtualAccount.user_id }))
    return { success: false, message: 'Wallet is not active', statusCode: 400 }
  }

  // check if transaction already exists (Idempotency)
  const { data: existingTx } = await supabase
    .from('transactions')
    .select('id')
    .eq('reference', reference)
    .eq('type', 'credit')
    .maybeSingle()

  if (existingTx) {
    console.warn(JSON.stringify({ level: 'warn', service: 'webhook-credit', event: 'duplicate_webhook', reference }))
    return { success: true, message: 'Webhook already processed' }
  }

  // Execute RPC
  const rpcPayload: CreditWalletWithTransactionArgs = {
    p_user_id: virtualAccount.user_id,
    p_wallet_id: wallet.id,
    p_amount: amount,
    p_virtual_account_no: virtualAccountNo,
    p_reference: reference,
    p_description: description,
    p_metadata: metadata,
  }

  const { error: rpcError } = await supabase.rpc(
    'credit_wallet_with_transaction',
    rpcPayload as any,
  )

  if (rpcError) {
    console.error(JSON.stringify({ level: 'error', service: 'webhook-credit', event: 'rpc_failed', reference, error: rpcError.message }))
    return { success: false, message: 'Failed to process wallet credit', statusCode: 500 }
  }

  console.warn(JSON.stringify({ level: 'info', service: 'webhook-credit', event: 'credit_success', userId: virtualAccount.user_id, amount, reference }))

  return { success: true, message: 'Webhook processed successfully' }
}
