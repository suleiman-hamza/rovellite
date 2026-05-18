import crypto from 'node:crypto'

const WHITESPACE_REGEX = /\s+/g
const PEM_WRAP_REGEX = /.{1,64}/g

/**
 * Sorts params alphabetically, removes null/undefined/empty values,
 * excludes the `sign` field, and returns them as a query string.
 */
function sortParams(body: Record<string, any>): string {
  return Object.keys(body)
    .sort()
    .filter(key => key !== 'sign' && body[key] !== undefined && body[key] !== null && body[key] !== '')
    .map(key => `${key}=${body[key]}`)
    .join('&')
}

/**
 * Builds the message digest (MD5 hash in uppercase).
 */
function buildDigest(body: Record<string, any>): string {
  const sortedParameters = sortParams(body)
  const md5Hash = crypto.createHash('md5')
    .update(sortedParameters)
    .digest('hex')
    .toUpperCase()

  return md5Hash
}

/**
 * Formats a raw Base64 public key into a valid PEM.
 *
 * CRITICAL: Node's crypto PEM parser requires the Base64 body to be
 * wrapped at exactly 64 characters per line. A single long Base64 line
 * (even with correct headers) causes verifier.verify() to silently
 * return false — no error thrown, just a failed verification.
 */
function formatPublicKey(rawKey: string): string {
  if (rawKey.includes('-----BEGIN PUBLIC KEY-----')) {
    return rawKey // already a valid PEM — use as-is
  }
  const stripped = rawKey.replace(WHITESPACE_REGEX, '')
  const wrapped = stripped.match(PEM_WRAP_REGEX)?.join('\n') ?? stripped
  return `-----BEGIN PUBLIC KEY-----\n${wrapped}\n-----END PUBLIC KEY-----`
}

/**
 * Formats a raw Base64 private key into a valid PEM.
 * Same 64-char line-wrapping requirement applies.
 */
function formatPrivateKey(rawKey: string): string {
  if (rawKey.includes('-----BEGIN PRIVATE KEY-----') || rawKey.includes('-----BEGIN RSA PRIVATE KEY-----')) {
    return rawKey
  }
  const stripped = rawKey.replace(WHITESPACE_REGEX, '')
  const wrapped = stripped.match(PEM_WRAP_REGEX)?.join('\n') ?? stripped
  return `-----BEGIN PRIVATE KEY-----\n${wrapped}\n-----END PRIVATE KEY-----`
}

/**
 * Generate an RSA-SHA1 signature for outgoing PalmPay API requests.
 *
 * @param payload - The request body to sign
 * @param privateKeyPEM - Private key in PEM format
 * @returns Base64-encoded signature
 */
export function generatePalmPaySignature(
  payload: Record<string, any>,
  privateKeyPEM: string,
): string {
  const digest = buildDigest(payload)
  const formattedKey = formatPrivateKey(privateKeyPEM)

  const signer = crypto.createSign('RSA-SHA1')
  signer.update(digest)
  signer.end()

  return signer.sign(formattedKey, 'base64')
}

/**
 * Verify an incoming PalmPay webhook signature using the PUBLIC key.
 *
 * PalmPay sends the signature inside `body.sign` (NOT in HTTP headers).
 * Verification uses `crypto.createVerify()` with the PalmPay public key.
 *
 * @param body - The raw webhook request body (must include `sign`)
 * @param publicKeyPEM - PalmPay's public key in PEM format
 */

export function verifyPalmpaySignature(
  _event: any,
  body: any,
  publicKeyPEM: string,
): { isValid: boolean, error?: string } {
  const receivedSignature = body?.sign

  // Only log in development — NEVER in production
  // if (process.env.NODE_ENV === 'development' || process.env.NITRO_ENV === 'development') {
  //   console.warn('[PalmPay Signature Debug] Received sign field:', receivedSignature || '(missing)')
  // }

  // DEV-MODE BYPASS: Skip verification for Postman/local testing
  // if (!receivedSignature && (process.env.NODE_ENV === 'development' || process.env.NITRO_ENV === 'development')) {
  //   console.warn('[DEV MODE] Bypassing signature verification — no `sign` field in body')
  //   return { isValid: true }
  // }

  if (!receivedSignature) {
    return {
      isValid: false,
      error: 'Missing signature: `sign` field not found in request body',
    }
  }

  try {
    const digest = buildDigest(body)
    const decodedSignature = decodeURIComponent(receivedSignature)

    // Format the key with mandatory 64-char line wrapping (required by Node crypto PEM parser)
    const formattedKey = formatPublicKey(publicKeyPEM)

    const verifier = crypto.createVerify('RSA-SHA1')
    verifier.update(digest)
    verifier.end()

    const isValid = verifier.verify(formattedKey, decodedSignature, 'base64')

    // if (process.env.NODE_ENV === 'development' || process.env.NITRO_ENV === 'development') {
    //   console.warn(`[PalmPay Signature Debug] Verification result: ${isValid ? '✅ valid' : '❌ invalid'}`)
    // }

    return { isValid }
  }
  catch (error: any) {
    return {
      isValid: false,
      error: `Signature verification error: ${error.message}`,
    }
  }
}
