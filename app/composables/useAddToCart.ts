import type { CartItemType } from '@/stores/cart'
import { useCartStore } from '@/stores/cart'

export function useAddToCart() {
  const cartStore = useCartStore()
  const toast = useToast()

  function addToCart(item: CartItemType) {
    if (!item.productName || !item.productId || !item.billerId || !item.customerReference) {
      toast.add({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        color: 'error',
        icon: 'i-lucide-alert-circle',
      })
      return
    }

    if (!item.amount || item.amount <= 0) {
      toast.add({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount.',
        color: 'error',
        icon: 'i-lucide-alert-circle',
      })
      return
    }

    cartStore.addToCart(item)
    console.log('Item added to cart:', item)

    toast.add({
      title: 'Added to Cart',
      description: `${item.productName} added to cart`,
      icon: 'i-lucide-check',
    })
  }

  return { addToCart }
}
