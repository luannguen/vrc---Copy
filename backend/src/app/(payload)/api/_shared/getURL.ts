/**
 * Local getURL functions to resolve module import issue
 */

export const getServerSideURL = () => {
  // Use BASE_URL from .env as priority
  let url = process.env.BASE_URL || process.env.NEXT_PUBLIC_SERVER_URL

  if (!url && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }

  if (!url) {
    url = 'http://localhost:3000'
  }

  return url
}
