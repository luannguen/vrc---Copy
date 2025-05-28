export const getServerSideURL = (): string => {
  let url = process.env.NEXT_PUBLIC_SERVER_URL

  if (!url && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }

  if (!url) {
    url = 'http://localhost:3000'
  }

  return url
}

export const getClientSideURL = (): string => {
  // Always use the environment variable for both server and client rendering
  // This ensures absolute URLs are consistently generated on both sides
  // which prevents hydration mismatches
  return process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

  // NOTE: The previous implementation using window.location
  // was causing hydration errors because the server and client
  // were generating different URLs. We've simplified to always
  // use the environment variable instead.
}
