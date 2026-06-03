import { z } from 'zod'

const whitespaceRegex = /\s+/
const phoneCleanupRegex = /[^0-9+]/g
const nigerianPhoneRegex = /^\+234\d{10}$/

// signup validation schema
export const signupSchema = z.object({
  email: z.email({ message: 'Valid email is required' })
    .trim()
    .toLowerCase(),

  full_name: z.string()
    .trim()
    .min(6, 'Full name must be at least 6 characters')
    .max(20, 'Full name is too long')
    .regex(/^[a-z\s\-]+$/i, 'Full name can only contain letters, spaces and hyphens')
    .refine((val) => {
      // Split by whitespace and remove empty strings
      const nameParts = val.split(whitespaceRegex).filter(Boolean)

      // Check if there are at least 3 names (First + Last)
      if (nameParts.length < 2)
        return false

      // Ensure every name part is at least 2 characters
      return nameParts.every(part => part.length >= 3)
    }, {
      message: 'Each name must contain at least 3 letters',
    })
    .toLowerCase(),

  location: z.string({ message: 'Location is required' })
    .trim()
    .toLowerCase()
    .refine(val => val === 'nigeria', { message: 'Only Nigeria is accepted for now' })
    .transform(() => 'Nigeria'),

  phone: z.string({ message: 'Phone number is required' })
    .transform((val) => {
      // Remove all characters except digits and plus sign
      let cleaned = val.replace(phoneCleanupRegex, '')
      // Auto-prefix Nigerian country code
      if (cleaned.startsWith('0'))
        cleaned = `+234${cleaned.slice(1)}`
      else if (cleaned.startsWith('234'))
        cleaned = `+${cleaned}`
      else if (!cleaned.startsWith('+'))
        cleaned = `+234${cleaned}`
      return cleaned
    })
    .refine(val => nigerianPhoneRegex.test(val), 'Must be a valid 10-digit Nigerian phone number'),

  referralCode: z
    .string()
    .trim()
    .toUpperCase()
    .optional()
    .or(z.literal('')),

  password: z.string({ message: 'Password is required' })
    .trim()
    .min(8, 'Password must be at least 8 characters')
    .max(12, 'Password cannot exceed 12 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[^A-Z0-9]/i, 'Password must contain at least one special character'),

  confirmPassword: z.string({ message: 'Confirm password is required' }).trim(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export type SignupInput = z.infer<typeof signupSchema>

// login validation schema
export const loginSchema = z.object({
  email: z.email({ message: 'Valid email is required' })
    .trim()
    .toLowerCase(),
  password: z.string({ message: 'Password is required' }).min(1, 'Password is required'),
})

export type LoginInput = z.infer<typeof loginSchema>

// forgot password validation schema
export const forgotPasswordSchema = z.object({
  email: z.email({ message: 'Valid email is required' })
    .trim()
    .toLowerCase(),
})

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
