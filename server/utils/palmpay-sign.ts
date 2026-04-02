import crypto from 'node:crypto'

export function generatePalmPaySignature(payload: Record<string, any>, palmpayPrivateKey: string): string {
  // Sort keys alphabetically (The Lexicographical Rule)
  const sortedKeys = Object.keys(payload).sort()

  // Build the query string (key=value&key2=value2)
  const stringToSign = sortedKeys
    .filter(key => payload[key] !== undefined && payload[key] !== '')
    .map(key => `${key}=${payload[key]}`)

    .join('&')

  // Generate MD5 Hash and uppercase it
  const md5Hash = crypto.createHash('md5').update(stringToSign).digest('hex').toUpperCase()

  // RSA-SHA1 Signing
  const sign = crypto.createSign('RSA-SHA1')
  sign.update(md5Hash)

  // Format key if necessary (adding headers)
  const formattedKey = palmpayPrivateKey.includes('BEGIN PRIVATE KEY')
    ? palmpayPrivateKey
    : `-----BEGIN PRIVATE KEY-----\n${palmpayPrivateKey}\n-----END PRIVATE KEY-----`

  return sign.sign(formattedKey, 'base64')
}
