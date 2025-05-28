'use client'

import React, { useEffect, useState } from 'react'

interface HydrationSafeWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  skipIfServer?: boolean
}

/**
 * A component that helps prevent hydration errors by only rendering children when on the client
 * 
 * @param children - The content to render only on the client side
 * @param fallback - Optional content to show during server rendering (defaults to null)
 * @param skipIfServer - If true, renders nothing during SSR; otherwise renders a placeholder
 */
export default function HydrationSafeWrapper({
  children,
  fallback = null,
  skipIfServer = true,
}: HydrationSafeWrapperProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // During SSR or initial client render before hydration
  if (!isMounted) {
    // Either render nothing (skipIfServer=true) or render a fallback
    return skipIfServer ? null : <>{fallback}</>
  }

  // Only render children after the component has mounted on the client
  return <>{children}</>
}
