'use client'

import { useEffect, useState } from 'react'

/**
 * Custom hook that returns true once the component has mounted on the client.
 * Useful for preventing hydration mismatch with client-only code.
 */
export function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false)
  
  useEffect(() => {
    setHasMounted(true)
  }, [])
  
  return hasMounted
}

/**
 * Custom hook to safely execute code only on the client side after component mount.
 * @param callback Function to execute only on the client side after mounting
 * @param deps Dependencies array (same as useEffect deps)
 */
export function useClientEffect(callback: () => void | (() => void), deps: any[] = []) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      return callback()
    }
    return undefined
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
