export function useCurrency() {
  const format = (value: number | string, options?: Intl.NumberFormatOptions) => {
    const amount = typeof value === 'string' ? Number(value) : value

    if (Number.isNaN(amount))
      return '₦0.00'

    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      ...options,
    }).format(amount)
  }

  return { format }
}
