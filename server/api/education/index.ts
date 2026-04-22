export default defineEventHandler(async (_event) => {
  const id = 13 // biller group id for education

  try {
    const response = await $fetch(`/api/coral-pay/biller-group-id/${id}`)
    return response
  }
  catch (error) {
    console.error('Error fetching biller group by ID:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch biller group',
      message: 'An error occurred while fetching the biller group. Please try again later.',
    })
  }
})
