/**
 * Returns true if code is running in a browser environment
 * Configured to be safe for use in components during rendering 
 * to avoid hydration mismatches
 */
const canUseDOM = (): boolean => {
  // Phần này chỉ được thực thi khi component đã được mount trên client
  // Do đó tránh được vấn đề hydration mismatch giữa server và client
  if (typeof window === 'undefined') return false
  
  return typeof window.document !== 'undefined' && 
         typeof window.document.createElement !== 'undefined'
}

export default canUseDOM
