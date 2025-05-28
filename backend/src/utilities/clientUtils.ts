/**
 * Safe way to check if code is running in a browser environment
 */
export const isBrowser = typeof window !== 'undefined'

/**
 * Safe way to get window object only on the client side
 * Returns null if called during server-side rendering
 */
export const getWindowSafe = () => {
  return isBrowser ? window : null
}

/**
 * Safe way to get document object only on the client side
 * Returns null if called during server-side rendering
 */
export const getDocumentSafe = () => {
  return isBrowser ? document : null
}

/**
 * Safe way to get localStorage only on the client side
 * Returns a mock object if called during server-side rendering
 */
export const getLocalStorageSafe = () => {
  if (!isBrowser) {
    return {
      getItem: () => null,
      setItem: () => null,
      removeItem: () => null,
    }
  }
  return window.localStorage
}

/**
 * Safely executes a function only on the client side
 * @param callback Function to execute on the client side
 */
export const runOnClient = (callback: () => void) => {
  if (isBrowser) {
    callback()
  }
}
