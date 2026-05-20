import { randomBytes } from 'node:crypto'

const nonAlphanumericRegex = /[^a-z0-9]/gi

export function generateInviteCode(fullName: string): string {
  // Get the first name, remove non-alphanumeric chars, make uppercase
  const firstName = (fullName.split(' ')[0] || '').replace(nonAlphanumericRegex, '').toUpperCase()

  // Generate 3 random bytes (6 hex characters)
  const randomHex = randomBytes(3).toString('hex').toUpperCase()

  // Combine into a tracking code
  return `ROV-${firstName}-${randomHex}`
}
