// Subscription Platform Types

export type ServiceProvider = 'CORALPAY' | 'SOCHITEL'
export type OrderStatus = 'PENDING_FULFILLMENT' | 'COMPLETED' | 'FAILED'

// Subscription Plan

export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  service_provider: ServiceProvider
  is_active: boolean
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

// Order

export interface Order {
  id: string
  user_id: string
  plan_id: string
  idempotency_key: string
  target_identifier: string
  amount: number
  status: OrderStatus
  vendor_request: Record<string, unknown> | null
  vendor_response: Record<string, unknown> | null
  error_message: string | null
  created_at: string
  updated_at: string
}

// Cart Validation

export interface CartValidationRequest {
  subscriptionPlanId: string
  targetIdentifier: string
}

export interface CartValidationResponse {
  planId: string
  planName: string
  serviceProvider: ServiceProvider
  validatedPrice: number
  taxFees: number
  totalAmount: number
  targetIdentifier: string // customerId(e.g)
  expiresAt: string
}

// Checkout Subscribe

export interface SubscribeRequest {
  subscriptionPlanId: string
  targetIdentifier: string
  idempotencyKey: string
}

export interface SubscribeResponse {
  orderId: string
  status: OrderStatus
  amount: number
  planName?: string
  serviceProvider?: ServiceProvider
  targetIdentifier?: string
  alreadyProcessed?: boolean
}

// Process Subscription Debit (RPC result)

export interface ProcessSubscriptionDebitResult {
  order_id: string
  status: OrderStatus
  amount: number
  plan_name: string
  service_provider: ServiceProvider
  target: string
  idempotency_key: string
  already_processed: boolean
}
