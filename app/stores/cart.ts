// const toast = useToast()
// Extend your component's props to include a quantity tracker

// This now perfectly matches your CartItem Props
export interface CartItemType {
  productName: string
  productId: number
  image?: string
  amount: number | null
  billerId: number
  customerReference: string
}

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref<CartItemType[]>([])

  // Getters
  // The count is simply the length of the array
  const cartItemCount = computed(() => items.value.length)

  // The total is just the sum of the amounts
  const cartTotalAmount = computed(() => {
    return items.value.reduce((total, item) => total + item.amount, 0)
  })

  // Actions
  function addToCart(newItem: CartItemType) {
    // Check if the item is already in the cart
    const existingItem = items.value.find(item => item.productId === newItem.productId)

    // Only add the item if it doesn't already exist
    if (!existingItem) {
      items.value.push(newItem)
    }
    else {
      console.warn('tem is already in cart')
      // toast.add({
      //   title: 'Item is already in cart',
      // })
    }
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
    removeFromCart,
    clearCart,
  }
})
