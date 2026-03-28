import admin from 'firebase-admin'

// Define the static regex here at the module level
const NEWLINE_REGEX = /\\n/g

export default defineNitroPlugin(() => {
  const config = useRuntimeConfig()

  if (!config.firebaseAdminServiceAccount) {
    console.error('[Firebase Admin] Initialization failed: Missing service account in runtimeConfig.')
    return
  }

  if (admin.apps.length === 0) {
    try {
      // Clone the frozen config object to allow mutation of the private_key
      const serviceAccount = { ...(config.firebaseAdminServiceAccount as any) }

      // Format private key correctly for RSA (critical for Unix/macOS environments)
      if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(NEWLINE_REGEX, '\n')
      }

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      })

      const projectId = admin.app().options.projectId || serviceAccount.project_id
      console.warn(`[Firebase Admin] Initialized successfully for project: ${projectId}`)
    }
    catch (error) {
      console.error('[Firebase Admin] Initialization Error:', error)
    }
  }
})
