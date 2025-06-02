import { toast as sonnerToast } from 'sonner'

interface ToastProps {
  title?: string
  description?: string
  variant?: 'default' | 'destructive' | 'success'
}

export function useToast() {
  return {
    toast: ({ title, description, variant = 'default' }: ToastProps) => {
      const message = title || description || ''
      
      if (variant === 'destructive') {
        sonnerToast.error(message)
      } else if (variant === 'success') {
        sonnerToast.success(message)
      } else {
        sonnerToast(message)
      }
    }
  }
}

export function toast({ title, description, variant = 'default' }: ToastProps) {
  const message = title || description || ''
  
  if (variant === 'destructive') {
    sonnerToast.error(message)
  } else if (variant === 'success') {
    sonnerToast.success(message)
  } else {
    sonnerToast(message)
  }
}
