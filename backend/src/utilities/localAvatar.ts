/**
 * Local Avatar System - Thay thế Gravatar để tránh tracking prevention
 * 
 * Usage:
 * import { getLocalAvatar } from '@/utilities/localAvatar'
 * const avatarUrl = getLocalAvatar(user.email, { size: 50, fallback: 'initials' })
 */

export interface AvatarOptions {
  size?: number
  fallback?: 'initials' | 'default' | 'blank'
  backgroundColor?: string
  textColor?: string
}

/**
 * Generate local avatar URL để tránh Gravatar tracking prevention
 */
export function getLocalAvatar(email: string, options: AvatarOptions = {}): string {
  const { size = 50, fallback = 'initials', backgroundColor, textColor } = options
  
  // Tạo fallback avatar dựa trên email
  if (fallback === 'initials') {
    return generateInitialsAvatar(email, size, backgroundColor, textColor)
  }
  
  if (fallback === 'blank') {
    return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"></svg>`
  }
  
  // Default fallback
  return generateDefaultAvatar(size)
}

/**
 * Tạo avatar từ initials của email
 */
function generateInitialsAvatar(
  email: string, 
  size: number, 
  bgColor?: string, 
  textColor?: string
): string {
  const username = email.split('@')[0] || 'U' // Fallback to 'U' if split fails
  const initials = username.slice(0, 2).toUpperCase()
  
  // Generate màu từ email hash nếu không có bgColor
  const backgroundColor = bgColor || generateColorFromString(email)
  const color = textColor || '#ffffff'
  
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <rect width="${size}" height="${size}" fill="${backgroundColor}" />
      <text x="50%" y="50%" dy="0.35em" text-anchor="middle" fill="${color}" 
            font-family="system-ui, -apple-system, sans-serif" 
            font-size="${Math.floor(size / 2.5)}" font-weight="500">
        ${initials}
      </text>
    </svg>
  `
  
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

/**
 * Generate màu từ string để có consistent colors
 */
function generateColorFromString(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  const colors = [
    '#1f2937', '#374151', '#4b5563', '#6b7280',
    '#dc2626', '#ea580c', '#d97706', '#ca8a04',
    '#65a30d', '#16a34a', '#059669', '#0d9488',
    '#0891b2', '#0284c7', '#2563eb', '#4f46e5',
    '#7c3aed', '#9333ea', '#c026d3', '#db2777'
  ]
  
  const selectedColor = colors[Math.abs(hash) % colors.length]
  return selectedColor || '#6b7280' // Fallback color if undefined
}

/**
 * Default avatar pattern
 */
function generateDefaultAvatar(size: number): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="12" fill="#e5e7eb"/>
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#9ca3af"/>
    </svg>
  `
  
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

/**
 * Hook để sử dụng trong React components
 */
export function useLocalAvatar(email: string, options?: AvatarOptions) {
  return getLocalAvatar(email, options)
}
