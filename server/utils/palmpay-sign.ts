import crypto from 'node:crypto'
import process from 'node:process'

export function generatePalmPaySignature(
  payload: Record<string, any>,
  palmpayPrivateKey: string,
): string {
  // Sort keys alphabetically (The Lexicographical Rule)
  const sortedKeys = Object.keys(payload).sort()

  // Build the query string (key=value&key2=value2)
  const stringToSign = sortedKeys
    .filter(key => payload[key] !== undefined && payload[key] !== '')
    .map(key => `${key}=${payload[key]}`)
    .join('&')

  // logging for debugging purposes
  // if (process.env.NODE_ENV === 'development' || process.env.NITRO_ENV === 'development') {
  //   console.log('[PalmPay Signature Debug] stringToSign', stringToSign)
  //   console.log('[PalmPay Signature Debug] MD5 (uppercase)',
  //     crypto.createHash('md5').update(stringToSign).digest('hex').toUpperCase()
  //   )
  // }

  // Generate MD5 Hash and uppercase it
  const md5Hash = crypto.createHash('md5')
    .update(stringToSign)
    .digest('hex')
    .toUpperCase()

  // RSA-SHA1 Signing
  const sign = crypto.createSign('RSA-SHA1')
  sign.update(md5Hash)

  // Format key if necessary (adding headers)
  const formattedKey = palmpayPrivateKey.includes('BEGIN PRIVATE KEY')
    ? palmpayPrivateKey
    : `-----BEGIN PRIVATE KEY-----\n${palmpayPrivateKey}\n-----END PRIVATE KEY-----`

  return sign.sign(formattedKey, 'base64')
}

// Verify signature
export function verifyPalmpaySignature(
  event: any,
  body: any,
  privateKey: string,
): { isValid: boolean, expected: string, received: string, error?: string } {
  const receivedSignature = getHeader(event, 'Signature') || getHeader(event, 'x-signature')

  const payloadForSigning = body.data ?? body
  const expectedSignature = generatePalmPaySignature(
    payloadForSigning,
    privateKey,
  )

  // Only log signatures in development — NEVER in production (enables webhook forgery)
  if (process.env.NODE_ENV === 'development' || process.env.NITRO_ENV === 'development') {
    console.warn('[PalmPay Signature Debug] Received:', receivedSignature || '(missing)')
    console.warn('[PalmPay Signature Debug] Expected:', expectedSignature)
  }

  // DEV-MODE BYPASS
  // if (process.env.NODE_ENV === 'development' || process.env.NITRO_ENV === 'development') {
  //   console.warn('[DEV MODE] Bypassing signature verification!')
  //   return {
  //     isValid: true,
  //     expected: expectedSignature,
  //     received: (receivedSignature as string) || 'dev-bypass',
  //   }
  // }

  if (!receivedSignature) {
    return {
      isValid: false,
      expected: expectedSignature,
      received: '',
      error: 'Missing signature',
    }
  }

  return {
    isValid: receivedSignature === expectedSignature,
    expected: expectedSignature,
    received: receivedSignature as string,
  }
}
