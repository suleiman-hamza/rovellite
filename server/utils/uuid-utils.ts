import { Buffer } from 'node:buffer'
import crypto from 'node:crypto'

/** Standard DNS Namespace UUID for RFC 4122 v5 */
const DEFAULT_NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8'

/** Pre-compiled regex to strip hyphens from namespace UUID */
const NS_HYPHEN_REGEX = /-/g

/**
 * Generates a deterministic UUID (RFC 4122 v5) from a name string (e.g. package slug).
 * Given the exact same input string, this function will ALWAYS return the exact same UUID string.
 *
 * @param name Unique string identifier (e.g. "coralpay:package:dstv-padi")
 * @param namespace UUID namespace string (defaults to DNS namespace)
 * @returns Deterministic 36-character UUID string
 */
export function generateDeterministicUuid(
  name: string,
  namespace: string = DEFAULT_NAMESPACE,
): string {
  const hash = crypto.createHash('sha1')

  // Parse namespace hex into bytes
  const nsClean = namespace.replace(NS_HYPHEN_REGEX, '')
  const nsBuffer = Buffer.from(nsClean, 'hex')

  hash.update(nsBuffer)
  hash.update(Buffer.from(name, 'utf8'))
  const buffer = hash.digest()

  // Set RFC 4122 version (5) and variant (2) bits
  buffer[6] = (buffer[6]! & 0x0F) | 0x50
  buffer[8] = (buffer[8]! & 0x3F) | 0x80

  const hex = buffer.toString('hex')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`
}
