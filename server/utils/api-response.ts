// ─── Typed API Response Helpers ──────────────────────────────────────

export interface ApiSuccessResponse<T = unknown> {
  success: true
  message: string
  data: T
  timestamp: string
}

export interface ApiErrorResponse {
  success: false
  message: string
  statusCode: number
  error?: string
  timestamp: string
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse

export const apiResponse = {
  success: <T>(data: T, message = 'Operation successful'): ApiSuccessResponse<T> => ({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  }),

  error: (message: string, statusCode = 500, errorCode?: string): ApiErrorResponse => ({
    success: false,
    message,
    statusCode,
    error: errorCode,
    timestamp: new Date().toISOString(),
  }),
}

export function isSuccessResponse<T = unknown>(res: unknown): res is ApiSuccessResponse<T> {
  return typeof res === 'object' && res !== null && 'success' in res && (res as any).success === true && 'data' in res
}
