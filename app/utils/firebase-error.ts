export function mapFirebaseError(error: any): string {
  const code = error?.code || error?.message || ''

  switch (true) {
    case code.includes('auth/email-already-in-use'):
      return 'This email is already in use.'

    case code.includes('auth/invalid-email'):
      return 'The email address is invalid.'

    case code.includes('auth/weak-password'):
      return 'Password must be at least 6 characters.'

    case code.includes('auth/network-request-failed'):
      return 'Network error. Please check your connection.'

    case code.includes('auth/user-not-found'):
      return 'No account found with this email.'

    case code.includes('auth/wrong-password'):
      return 'Incorrect password. Please try again.'

    case code.includes('auth/too-many-requests'):
      return 'Too many attempts. Please wait and try again.'

    case code.includes('auth/invalid-credential'):
      return 'Invalid credentials. Please check and email and password again.'

    default:
      return 'Something went wrong. Please try again.'
  }
}
