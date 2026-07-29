import { Buffer } from 'node:buffer'
import crypto from 'node:crypto'

/**
 * Verifies an incoming webhook signature using HMAC-SHA256.
 *
 * This follows the same pattern as the existing PalmPay RSA-SHA1 verification
 * in `server/utils/palmpay/sign.ts`, but uses HMAC-SHA256 for providers
 * that sign payloads with a shared secret (e.g. CoralPay, Sochitel).
 *
 * @param payload   - The raw request body string to verify
 * @param signature - The signature sent by the third-party provider
 * @param secret    - The shared HMAC secret key
 * @returns true if the signature is valid, false otherwise
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string,
): boolean {
  try {
    const expectedHash = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex')

    // Use timingSafeEqual to prevent timing attacks
    const expectedBuffer = Buffer.from(expectedHash, 'hex')
    const receivedBuffer = Buffer.from(signature, 'hex')

    if (expectedBuffer.length !== receivedBuffer.length) {
      console.warn('[crypto] Signature length mismatch — rejecting')
      return false
    }

    return crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
  }
  catch (error: any) {
    console.error('[crypto] Signature verification error:', error.message)
    return false
  }
}
