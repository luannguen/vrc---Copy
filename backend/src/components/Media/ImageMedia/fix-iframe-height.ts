'use client'

/**
 * Fix for Next.js Image height issues in Payload live preview iframe
 * This ensures proper container heights when images are rendered with fill prop
 */
export const fixIframeImageHeight = () => {
  if (typeof window === 'undefined') return

  // Check if we're in an iframe (Payload live preview)
  const isInIframe = window !== window.parent

  if (isInIframe) {
    console.log('Fixing iframe image heights for Payload live preview...')
    
    // Add a class to the body for iframe-specific styling
    document.body.classList.add('payload-live-preview')
    
    // Fix hero image containers
    const heroImageContainers = document.querySelectorAll('.hero-image-container')
    heroImageContainers.forEach((container) => {
      const element = container as HTMLElement
      element.style.height = '300px'
      element.style.minHeight = '300px'
      element.style.position = 'relative'
      element.style.width = '100%'
      element.style.display = 'block'
    })

    // Fix any picture elements with Next.js Images that have fill
    const pictureElements = document.querySelectorAll('picture')
    pictureElements.forEach((picture) => {
      const element = picture as HTMLElement
      element.style.minHeight = '300px'
      element.style.position = 'relative'
      element.style.width = '100%'
      element.style.height = '100%'
      element.style.display = 'block'
    })
    
    // Fix absolute positioned containers that are parents of Media components
    const absoluteContainers = document.querySelectorAll('[class*="absolute"][class*="inset-0"]')
    absoluteContainers.forEach((container) => {
      const element = container as HTMLElement
      if (element.querySelector('picture') || element.querySelector('img')) {
        element.style.position = 'relative'
        element.style.width = '100%'
        element.style.height = '100%'
        element.style.minHeight = '300px'
      }
    })
    
    // Force re-layout by triggering a reflow
    document.body.offsetHeight
  }
}

// Auto-run when imported with more comprehensive timing
if (typeof window !== 'undefined') {
  // Run immediately
  fixIframeImageHeight()
  
  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixIframeImageHeight)
  }
  
  // Run after window load
  window.addEventListener('load', fixIframeImageHeight)
  
  // Run after short delays to catch dynamically added elements
  setTimeout(fixIframeImageHeight, 100)
  setTimeout(fixIframeImageHeight, 500)
  setTimeout(fixIframeImageHeight, 1000)
  
  // Use MutationObserver to detect new elements
  const observer = new MutationObserver((mutations) => {
    let shouldFix = false
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        shouldFix = true
      }
    })
    if (shouldFix) {
      setTimeout(fixIframeImageHeight, 50)
    }
  })
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
}
