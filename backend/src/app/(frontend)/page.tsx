import { HomePage } from '@/components/HomePage/HomePage'
import type { Metadata } from 'next'

export default function Page() {
  return <HomePage />
}

export const metadata: Metadata = {
  title: 'VRC - Chào mừng',
  description: 'Trang chủ VRC Backend',
}
