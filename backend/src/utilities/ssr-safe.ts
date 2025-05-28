/**
 * This file provides server-safe versions of browser APIs
 * to avoid "ReferenceError: window is not defined" errors during SSR
 */

/**
 * Server-safe version of window.localStorage
 */
export const ssrSafeLocalStorage = {
  getItem: () => null,
  setItem: () => null,
  removeItem: () => null,
  clear: () => null,
  key: () => null,
  length: 0,
}

/**
 * Server-safe version of window.sessionStorage
 */
export const ssrSafeSessionStorage = {
  getItem: () => null,
  setItem: () => null,
  removeItem: () => null,
  clear: () => null,
  key: () => null,
  length: 0,
}

/**
 * Server-safe version of document.cookie
 * Returns empty string during SSR
 */
export const getSSRSafeCookie = () => {
  if (typeof document !== 'undefined') {
    return document.cookie
  }
  return ''
}

/**
 * Server-safe way to check if an element is visible in viewport
 * Always returns false during SSR
 */
export const ssrSafeIsElementInViewport = () => {
  return false
}

/**
 * Server-safe version of navigator.userAgent
 * Returns empty string during SSR
 */
export const getSSRSafeUserAgent = () => {
  if (typeof navigator !== 'undefined') {
    return navigator.userAgent
  }
  return ''
}
