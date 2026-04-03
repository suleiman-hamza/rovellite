export const apiResponse = {
  success: (data: any, message = 'Operation successful') => ({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  }),

  error: (message: string, statusCode = 500, errorCode?: string) => ({
    success: false,
    message,
    statusCode,
    error: errorCode,
    timestamp: new Date().toISOString(),
  }),
}

export function isSuccessResponse(res: any): res is { success: true, data: any } {
  return res?.success === true && 'data' in res
}
