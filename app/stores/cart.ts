import { useStorage } from '@vueuse/core'

// const toast = useToast()
// Extend your component's props to include a quantity tracker

// This now perfectly matches your CartItem Props
export interface CartItemType {
  productName: string
  productId: number
  image?: string
  amount: number
  billerId: number
  customerReference: string
  quantity: number
}

export const useCartStore = defineStore('cart', () => {
  // State
  // Persisted to localStorage via VueUse's useStorage — survives page
  // refreshes and tab closes. Serialization (JSON.stringify/parse) is
  // handled automatically since the default value is an array.
  const items = useStorage<CartItemType[]>('cart-items', [])

  // Getters
  // The count is simply the length of the array
  const cartItemCount = computed(() => items.value.length)

  // The total is the sum of (unit amount × quantity) across all items
  const cartTotalAmount = computed(() => {
    return items.value.reduce((total, item) => total + (item.amount || 0) * item.quantity, 0)
  })

  // add this
  function getLineTotal(item: CartItemType) {
    return item.amount * item.quantity
  }

  // Actions
  function addToCart(newItem: CartItemType) {
    // Check if the item is already in the cart
    const existingItem = items.value.find(item => item.productId === newItem.productId)
    const incomingQuantity = newItem.quantity && newItem.quantity > 0 ? newItem.quantity : 1

    if (existingItem) {
      // Item already in cart — bump its quantity instead of rejecting the add
      existingItem.quantity += incomingQuantity
    }
    else {
      items.value.push({ ...newItem, quantity: incomingQuantity })
    }
  }

  // Used by the quantity stepper in the cart page. Clamped to a minimum of
  // 1 — dropping an item to zero is the trash/remove button's job, not this.
  function updateQuantity(productId: number, quantity: number) {
    const item = items.value.find(item => item.productId === productId)
    if (!item)
      return

    item.quantity = Math.max(1, Math.floor(quantity))
  }

  function removeFromCart(productId: number) {
    items.value = items.value.filter(item => item.productId !== productId)
  }

  function clearCart() {
    items.value = []
  }

  return {
    items,
    cartItemCount,
    cartTotalAmount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getLineTotal,
  }
})
